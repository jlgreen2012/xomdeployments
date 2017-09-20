(function () {
    'use strict';

    angular
        .module('app.playbook')
        .controller('CommitmentController', CommitmentController);

    CommitmentController.$inject = ['playbookDataService', '$log', '$timeout', '$q', '$rootScope', '$scope', '$moment'];

    /**
     * Controller responsible for all actions related to taking and reviewing an assessment.
     * @param {playbookDataService} playbookDataService
     * @param {$log} $log
     * @param {$timeout} $timeout
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param {$scope} $scope local scope
     * @param {$moment} $moment momentjs library
     */
    function CommitmentController(playbookDataService, $log, $timeout, $q, $rootScope,
                                    $scope, $moment) {
        var vm = this;

        // Indication if the data has loaded for the UI.
        vm.loaded = false;

        // Info message regarding commitments only.
        vm.info = null;

        // Error message.
        vm.error = null;

        // Formatted categories that a commitment can relate to.
        // Includes child questions.
        vm.categories = [];

        // Playbook id that all commitments here belong to.
        vm.playbookId = null;

        // All commitments for the playbook.
        vm.commitments = [];

        // Restrict fields if the user doesnt' own the playbook.
        vm.canEditPlaybook = false; 1

        // Shows/hides suggestions for commitments based on results.
        vm.enableSuggestions = true;

        // Form object for adding and editing a commitment.
        vm.form = {
            // Modal title.
            title: null,

            // Method to call when modal save button is invoked.
            onSave: null,

            // Method to call when modal cancel/close button is invoked.
            onClose: null,

            // Indication if form has been submitted. Shows validation errors when true.
            submitted: false,

            // Indication if form modal should be displayed.
            show: false,

            // Form data based on commitment.
            data: {
                category: null,
                question: null,
                name: null,
                description: null,
                status: null,
                dueDate: null,
                id: null
            }
        };

        // Available statuses for commitments.
        vm.statuses = [
            {
                display: 'In-progress',
                value: 'IN_PROGRESS'
            },
            {
                display: 'Implemented',
                value: 'IMPLEMENTED'
            },
            {
                display: 'Planned',
                value: 'PLANNED'
            }
        ];

        // Methods.
        vm.showAddCommitmentForm = showAddCommitmentForm;
        vm.add = add;
        vm.showEditCommitmentForm = showEditCommitmentForm;
        vm.update = update;
        vm.remove = remove;
        vm.setFormCategoryId = setFormCategoryId;
        vm.setFormQuestionId = setFormQuestionId;
        vm.setFormStatusValue = setFormStatusValue;
        vm.setFormDueDateValue = setFormDueDateValue;
        vm.activate = activate;

        /**
         * Category Object.
         */
        class Category {
            /**
             * Creates a new Category.
             * @param {Int} id
             * @param {String} name
             * @param {Double} score
             * @param {Array} questions
             */
            constructor(id, name, score, questions) {
                var that = this;
                that.id = id;
                that.name = name;
                that.score = score;
                that.questions = questions.map(function (q) {
                    return new Question(q.questionId,
                                        q.questionText,
                                        q.answers,
                                        q.selectedAnswerId);
                });
            }

            /**
             * Builds the text to show in the dropdown when selecting a category for a commitment.
             * Accounts for whether suggestions are enabled.
             * @returns {String}
             */
            get optionText() {
                if (vm.enableSuggestions === true) {
                    return this.name + ' (' + Math.round(+this.score * 100, 0) + '%)';
                }
                else {
                    return this.name;
                }
            }

            /**
            * Determines if the user should create commitments for this category based on:
            * Didn't answer the best answers for all questions within the category and doesn't have ANY commitments.
            * @returns {Boolean}
            */
            get needsCommitments() {
                return this.couldBeImproved();
            }

            /**
            * Gets the list of commitments directly linked to this category.
            * @returns {Array}
            */
            getCommitments() {
                var categoryId = this.id;
                return vm.commitments.filter(function (c) {
                    return c.categoryId === categoryId;
                })
            }

            /**
             * Determines if the user could make imrpovements to the category based on their responses.
             * Could later determine the percentage of questions that have commitments within the category.
             * @returns {Boolean}
             */
            couldBeImproved() {
                return this.getCommitments().length === 0 && !isNaN(this.score) && this.score < 1.0;
            }
        }

        /**
         * Question object.
         */
        class Question {
            /**
             * Creates a new instance of a Question.
             * @param {Int} id
             * @param {String} text
             * @param {Array} answers
             * @param {Int} selectedAnswerId
             */
            constructor(id, text, answers, selectedAnswerId) {
                var that = this;
                that.id = id;
                that.text = text;
                that.answers = answers;
                that.selectedAnswerId = selectedAnswerId;
            }

            /**
             * Very hacky, unstable way to get the best answer. Assumes it's
             * ordered correctly and its the second to last answer. Not last because that is NA.
             */
            get bestAnswer() {
                return this.answers[this.answers.length - 2];
            }

            /**
             * Gets the answer object that was selected during the assessment.
             * @returns {Object}
             */
            get selectedAnswer() {
                var selected = this.selectedAnswerId;
                return this.answers.find(function (a) {
                    return a.id === selected;
                });
            }

            /**
             * Builds the text to show in the dropdown when selecting a question for a commitment.
             * Accounts for whether suggestions are enabled.
             * @returns {String}
             */
            get optionText() {
                if (vm.enableSuggestions === true && this.needsCommitment()) {
                    return this.text + ' *';
                }
                else {
                    return this.text;
                }
            }

            /**
             * Gets the list of commitments directly linked to this question.
             * @returns {Array}
             */
            getCommitments() {
                var questionId = this.id;
                return vm.commitments.filter(function (c) {
                    return c.questionId === questionId;
                });
            }

            /**
             * Determines if the user should create a commitment for this question based on:
             * Didn't select the best answer and doesn't have a commitment directly linked to it.
             * @returns {Boolean}
             */
            needsCommitment() {
                return this.getCommitments().length === 0 &&
                    this.selectedAnswer.id !== this.bestAnswer.id &&
                    this.selectedAnswer.text.toLowerCase() !== "not applicable";
            }
        }

        activate();

        /**
         * Initializes the controller.
         */
        function activate() {
            vm.form.show = false;
            let playbookController = $scope.pc,
                playbook = playbookController.current.details;
            changePlaybook(playbook);
        }

        /**
         * Sets up all commitment data for the playbook.
         * @param {Object} playbook
         */
        function changePlaybook(playbook) {
            vm.playbookId = playbook.id;

            if (typeof playbook.commitments !== "undefined") {
                vm.commitments = playbook.commitments;
                vm.canEditPlaybook = playbook.isOwnedByMe &&
                                     playbook.isArchived === false && 
                                     $scope.pc.current.mode === $scope.pc.modes.edit;
            }

            if (typeof playbook.teamAssessment !== "undefined") {
                vm.categories = getCategoryList(playbook.teamAssessment);
            }

            vm.loaded = true;
        }

        /**
         * Watches for changes to the current playbook and setsup commitment data for it.
         * @param {Object} newValue
         * @param {Object} oldValue
         * @param {$scope} scope)
         */
        $scope.$watch('pc.current.details.id', function (newValue, oldValue, scope) {
            if (newValue !== oldValue) {
                var playbook = $scope.pc.current.details;
                changePlaybook(playbook);
            }
        });

        /**
         * Saves off the category id and name separately.
         * @param {Object} category
         */
        function setFormCategoryId(category) {
            vm.form.data.categoryId = category.id;
            vm.form.data.categoryName = category.name;
        }

        /**
         * Saves off the question id separately.
         * @param {Object} question
         */
        function setFormQuestionId(question) {
            if (question !== null) {
                vm.form.data.questionId = question.id;
            }
        }

        /**
         * Saves off the status id separately.
         * @param {Object} status
         */
        function setFormStatusValue(status) {
            vm.form.data.status = status.value;
        }

        /**
         * Sets the model due date to the utc version of the ui, local date selected by the user.
         * @param {String} date
         */
        function setFormDueDateValue(date) {
            var d = new Date(date);
            vm.form.data.dueDate = $moment.utc(d).toISOString();
        }

        /**
         * Sets the category list.
         * @param {Object} teamAssessment
         * @returns {Array} category list
         */
        function getCategoryList(teamAssessment) {
            var categories = teamAssessment.categoryResults.map(function (category) {
                // Get questions for the category.
                var questionList = teamAssessment.questions.filter(function (response) {
                    return response.categoryName === category.name;
                });

                return new Category(category.categoryId,
                                    category.name,
                                    category.score,
                                    questionList);
            });
            return categories;
        }

        /**
         * Shows the add commitment dialog form.
         */
        function showAddCommitmentForm() {
            vm.form.data = {
                category: null,
                question: null,
                name: null,
                description: null,
                status: null,
                dueDate: null
            };
            vm.form.title = "Add Commitment";
            vm.form.onSave = vm.add;
            vm.form.onClose = vm.form.show = false;

            vm.form.show = true;
        }

        /**
         * Adds a new commitment to the playbook.
         */
        function add() {
            vm.error = null;
            vm.form.submitted = true;

            // Show validation messages if needed.
            if (!vm.form.$valid) {
                return;
            }

            // Save and show feedback to the user.
            playbookDataService.createCommitmentForPlaybook(vm.playbookId, vm.form.data)
                .then(function (data) {
                    vm.info = "Commitment created successfully";
                    $timeout(function () {
                        vm.info = null;
                    }, 2000);

                    // Update cat name of the commitment since it's not returned.
                    data.categoryName = vm.form.data.categoryName;
                    vm.commitments.push(data);
                })
                .catch(function () {
                    vm.error = "Failed to create commitment.";
                })
                .finally(function () {
                    vm.form.submitted = false;
                    vm.form.show = false;
                    vm.form.data = {};
                });
        };

        /**
         * Shows the edit commitment form
         * @param {type} commitment
         */
        function showEditCommitmentForm(commitment) {
            vm.form.data = {
                category: vm.categories.find(function (c) { return c.id === commitment.categoryId; }),
                categoryId: commitment.categoryId,
                categoryName: commitment.name,
                questionId: commitment.questionId,
                name: commitment.name,
                description: commitment.description,
                statusObj: vm.statuses.find(function (s) { return s.value === commitment.status }),
                status: commitment.status,
                dueDate: $moment.utc(new Date(commitment.dueDate)),
                id: commitment.id
            };

            // find question based on category.
            vm.form.data.question = vm.form.data.category.questions.find(function (q) { return q.id === commitment.questionId });

            // format utc date to local.
            var d = new Date(commitment.dueDate);
            vm.form.data.dueDateLocal = $moment(d).local().format('MM-DD-YYYY');

            vm.form.title = "Edit Commitment";
            vm.form.onSave = vm.update;
            vm.form.onClose = vm.form.show = false;

            vm.form.show = true;
        }

        /**
         * Saves updates to an existing commitment.
         */
        function update() {
            vm.error = null;
            vm.form.submitted = true;

            // Show validation messages if needed.
            if (!vm.form.$valid) {
                return;
            }

            // Save and show feedback to the user.
            playbookDataService.updateCommitment(vm.playbookId, vm.form.data)
                .then(function (data) {
                    vm.info = "Commitment saved successfully";
                    $timeout(function () {
                        vm.info = null;
                    }, 2000);

                    // Update view with saved data.
                    var c = vm.commitments.find(function (c) { return c.id === data.id });
                    c.id = data.id;
                    c.categoryId = data.categoryId;
                    c.categoryName = vm.form.data.category.name;
                    c.created = data.created;
                    c.description = data.description;
                    c.dueDate = data.dueDate;
                    c.name = data.name;
                    c.questionId = data.questionId;
                    c.status = data.status;

                })
                .catch(function () {
                    vm.error = "Failed to save commitment.";
                })
                .finally(function () {
                    vm.form.submitted = false;
                    vm.form.data = {};
                    vm.form.show = false;
                });
        };

        /**
         * Deletes the given commitment.
         * @param {Object} commitment
         * @returns {Promise}
         */
        function remove(commitment) {
            vm.error = null;
            var deferred = $q.defer();
            playbookDataService.deleteCommitment(vm.playbookId, commitment.id)
                    .then(function () {
                        // Show feedback to the user.
                        vm.info = "Commitment deleted successfully";
                        $timeout(function () {
                            vm.info = null;
                        }, 2000);

                        // Remove from view.
                        vm.commitments.splice(vm.commitments.findIndex(function (c) { return c.id === commitment.id; }), 1);

                        // Resolve the promise;
                        deferred.resolve();
                    })
                    .catch(function () {
                        vm.error = "Failed to delete commitment.";
                        deferred.reject();
                    });
            return deferred.promise;
        };
    }
})();