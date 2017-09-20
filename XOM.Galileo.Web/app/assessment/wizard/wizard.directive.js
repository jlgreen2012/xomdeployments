(function () {
    'use strict';

    angular
        .module('app.assessment')
        .directive('pbWizard', Wizard);

    Wizard.$inject = ['$log', '$timeout', '$sce'];

    /**
     * Directive to create an navigate through a wizard of questions.
     * @param {$log} $log
     * @param {$timeout} $timeout
     * @param {$sce} $sce
     * @returns {Object}
     */
    function Wizard($log, $timeout, $sce) {
        var directive = {
            link: link,
            templateUrl: '/app/assessment/wizard/wizard.html',
            restrict: 'A',
            scope: {
                title: '@',
                questions: '=',
                pageSize: '@',
                loaded: '=',
                save: '&',
                submit: '&',
                cancel: '&',
                review: '&'
            }
        };
        return directive;

        /**
         * Link function.
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         */
        function link(scope, element, attrs) {
            // alert message for actions.
            scope.message = null;

            /*
             * Navigation methods.
             * These are navigation options that apply to the entire wizard, not a particular page or step.
             */

            scope.showSaveAndExitModal = false;
            /**
             * Show the save and exit modal.
             */
            function saveAndExit() {
                scope.showSaveAndExitModal = true;
            };

            scope.showCancelModal = false;
            /**
             * Show the cancel modal.
             */
            function cancel () {
                scope.showCancelModal = true;
            };

            scope.saveAndExitModalText = '<p>You have chosen to save the input provided thus far and exit the assessment.</p>' +
                '<p>Select OK below to save all information and return to the Assessments page, or select Cancel to return to the current assessment.</p>';
            scope.cancelModalText = '<p>You have chosen to cancel this assessment. If you are sure you want to cancel and delete all input provided thus far, click OK below.</p>' +
                '<p>If you would like to save your assessment and finish it later, select Cancel below, and then select \'Save and Exit\' from the current assessment screen.</p>';

            /**
             *  Save and exit the assessment.
             */
            scope.confirmSaveAndExit = function () {
                scope.save()
               .then(null, function (error) {
                   // Hide the modal.
                   scope.showSaveAndExitModal = false;
                   $log.error("Assessment failed to save!");

                   // Show the error message for 5 seconds. Then hide.
                   if (error === '') {
                       scope.message = "Any error occurred while saving your progress. Please try again.";
                   }
                   else {
                       scope.message = error;
                   }
                   $timeout(function () {
                       scope.message = null;
                   }, 5000);
               });
            };

            /**
             * Cancel the assessment.
             */
            scope.confirmCancel = function () {
                scope.cancel();
            };

            /**
             * Submit the assessment answers.
             */
            scope.submitAndEnd = function () {
                $log.debug("submit");

                scope.submit()
                .then(function () {
                    // Consider moving the promise chaining into the step next method so that we don't duplicate this logic.
                    scope.currentStepIndex++;
                }, function (error) {
                    $log.error("Assessment failed to save!");

                    // Show the error message for 5 seconds. Then hide.
                    if (error === '') {
                        scope.message = "Any error occurred while submitting your assessment. Please try again.";
                    }
                    else {
                        scope.message = error;
                    }
                    $timeout(function () {
                        scope.message = null;
                    }, 5000);
                });
            };

            /*
             * Watches
             */

            /**
             * Changes to questions. Mostly used for initial load.
             */
            scope.$watchCollection(
                function () {
                    return [
                        scope.questions
                    ];
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        configurePages();
                    }
                });

            /**
             *  Switching between steps and pages requires rebuilding the navigation per page.f
             * Validation checks to show and disable buttons appropriately require the object be reset.
             */
            scope.$watchCollection(
              function () {
                  return [
                      scope.currentStepIndex,
                      typeof scope.currentStep() === "undefined" ? scope.currentStepIndex : scope.currentStep().currentPageIndex
                  ];
              }, function (newValue, oldValue) {
                  if (newValue !== oldValue) {
                      scope.currentStep().currentPage.createNavigation();
                  }
              });

            /*
             * Create 'pages'
             */
            scope.steps = [];
            scope.currentStepIndex = -1;

            /**
             * Gets the current step object.
             * @returns {Object}
             */
            scope.currentStep = function () { return scope.steps[scope.currentStepIndex]; }

            /**
             * Step class.
             * Represents a normal step within the wizard.
             * Extensions of this class can be built for more complex steps.
             */
            class Step {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {String} name
                 * @param {String} type
                 */
                constructor(index, name, type) {
                    this.index = index;
                    this.name = name;
                    this.type = type;
                    this.pages = this.createPages();
                    this.currentPageIndex = 0;
                }

                /**
                 *  Returns the current page of this step.
                 * @returns {Page}
                 */
                get currentPage() {
                    return this.calcCurrentPage();
                }

                /**
                 *  Determines if this step is the current step within the wizard.
                 * @returns {Bool}
                 */
                get isCurrentStep() {
                    return scope.currentStepIndex == this.index;
                }

                /**
                 *  Sets this step as the current step within the wizard.
                 */
                setCurrentStep() {
                    scope.currentStepIndex = this.index;
                    scope.currentStep().currentPageIndex = 0;
                    scope.showReviewAndSubmitPage = false;
                }

                /**
                 *  Gets the current page within this step.
                 * @returns {Page}
                 */
                calcCurrentPage() {
                    return this.pages[this.currentPageIndex];
                }

                /**
                 * Creates basic text pages for a normal step.
                 * @returns {Array}
                 */
                createPages() {
                    var newPages = [];
                    if (this.type === 'START') {
                        newPages.push(new StartPage(0));
                    }
                    else if (this.type === 'REVIEW') {
                        newPages.push(new ReviewPage(0));
                    }
                    else if (this.type === 'END') {
                        newPages.push(new EndPage(0));
                    }
                    return newPages;
                }
            }

            /**
             * Question step, inherits from Step.
             * Represents a step that contains a list of questions to answer.
             */
            class QuestionStep extends Step {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {String} name
                 * @param {String} type
                 * @param {Array} questions
                 */
                constructor(index, name, type, questions) {
                    super(index, name, type);
                    this.pages = this.createPages(questions);
                    this.totalQuestions = questions.length;
                }

                /**
                 *  Determines if all questions in all pages for this step are marked as completed.
                 * @returns {Boolean} isvalid
                 */
                get isCompleted() {
                    return this.calcStatus();
                }

                /**
                 * Create the pages for the current step based on our page size and questions provided.
                 * Each page only contains questions for this step, even if the last page does not fill the page size.
                 * ie. if we have seven questions with a page size of two, we'll have 4 pages where the last page only has one question.
                 * @param {Array} questions
                 * @returns {Array}
                 */
                createPages(questions) {
                    if (typeof questions !== "undefined") {
                        var newPages = [],
                            totalPages = Math.ceil(questions.length / scope.pageSize),

                            // index of first question we want to add.
                            startIndex = 0,

                            // index of last question PLUS ONE we want to add (for use with slice).
                            endIndex = startIndex + +scope.pageSize,

                            questionsForPage;

                        for (var i = 0; i < totalPages; i++) {
                            // get the page size number of questions and create the page object.
                            questionsForPage = questions.slice(startIndex, endIndex);
                            if (questionsForPage.length > 0) {
                                newPages.push(new QuestionPage(i, questionsForPage));
                            }
                            else {
                                $log.debug('Something went wrong while finding questions to add to page index ' + this.index);
                            }

                            // shift our indexes.
                            startIndex = endIndex;
                            endIndex += +scope.pageSize;
                        }
                        $log.debug(newPages.length + " pages created for step: " + this.name);
                        return newPages;
                    }
                    else {
                        return [];
                    }
                }

                /**
                 * Determine if all answers have been answered. Returns t/f.
                 * @returns {Boolean}
                 */
                calcStatus() {
                    var isComplete = true,
                        currentpage,
                        unanswered;

                    // Determine if any of our questions have an falsey IsAnswered value or no answer id.
                    for (var i = 0; i < this.pages.length; i++) {
                        currentpage = this.pages[i];
                        unanswered = currentpage.questions.filter(function (q) {
                            return q.selectedAnswerId === null || q.selectedAnswerId <= 0;
                        })
                        if (unanswered.length > 0) {
                            isComplete = false;
                            break;
                        }
                    }
                    return isComplete;
                }
            }

            /**
             * Page class
             * Represents a single page within the wizard.
             */
            class Page {
                /**
                 * Constructor for class.
                 * @param {Int} index
                 */
                constructor(index) {
                    // index within a step.
                    this.index = index;
                }

                /**
                 * Navigate to the previous question.
                 */
                back() {
                    // if we're on the first page of a step, return to the previous step.
                    // otherwise, if we're still navigating within the same step, just update the page number.
                    if (scope.currentStep().currentPageIndex == 0) {
                        scope.currentStepIndex--;
                    }

                    else {
                        scope.currentStep().currentPageIndex--;
                    }
                }

                /**
                 * Navigate to the next question.
                 */
                next() {
                    // if we're still navigating within the same step, just update the page number.
                    // otherwise, move to the next step.
                    const pageIndex = scope.currentStep().currentPageIndex,
                        lastPageIndex = scope.currentStep().pages.length - 1;
                    if (pageIndex < lastPageIndex) {
                        scope.currentStep().currentPageIndex++;
                    }

                    else {
                        scope.currentStepIndex++;

                        // foce start at the beginning of the step.
                        scope.currentStep().currentPageIndex = 0;
                    }
                }

                /**
                 * Cancel the entire assessment. Add items here if we needed to do any cleanup on this page before exiting.
                 */
                cancel() {
                    cancel();
                }

                /**
                 * Save and exit the entire assessment. Add items here if we needed to any cleanup on this page before exiting.
                 */
                saveAndExit() {
                    saveAndExit();
                }

                /**
                 * Text description of where we are in the step.
                 * @returns {String}
                 */
                get navigationStatus() {
                    return "";
                }

                /**
                 * Create our navigation buttons based on what we want the user to be able to do at this step.
                 * Navigation buttons are split on the left and right sides of the wizard.
                 * @returns {Array}
                 */
                createNavigation() {
                    var nav = {
                        left: [],
                        right: []
                    };
                    this.navigation = nav;
                    return nav;
                }
            }

            /**
             * First page, inherits from Page.
             * First page of the wizard, if desired.
             * This could contain information about the wizard's content, instructions, etc.
             */
            class StartPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 */
                constructor(index) {
                    super(index);
                }

                /**
                 * Create our navigation buttons based on what we want the user to be able to do at this step.
                 */
                createNavigation() {
                    var nav = super.createNavigation();
                    nav.right.push(new NavButton('Continue', this.next, true, true));
                    this.navigation = nav;
                }
            }

            /**
             * Question Page inherits from Page
             * Represents a page built up of questions as content.
             */
            class QuestionPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {Array} questions
                 */
                constructor(index, questions) {
                    super(index);
                    this.questions = questions;
                }

                /**
                 * Get the first question's number.
                 * Display version of the index, 1 based.
                 * @returns {Int}
                 */
                get lowerIndex() {
                    // question order is zero based.
                    return this.questions[0].questionOrder + 1;
                }

                /**
                 * Determine if this is the first question of the entire wizard. Prevents using the back button currently,
                 * but this is NOT hooked up to work with a StartPage yet.
                 * @returns {Boolean}
                 */
                get isFirstQuestionOfWizard() {
                    if (typeof scope.currentStep() !== "undefined") {
                        // todo: filter to type of question step.
                        const stepIndex = scope.currentStepIndex,
                              pageIndex = scope.currentStep().currentPageIndex;
                        return stepIndex == 0 && pageIndex === 0;
                    }
                    else {
                        return false;
                    }
                }

                /**
                 * Get the last question's number.
                 * Display version of the index, 1 based.
                 * @returns {Int}
                 */
                get upperIndex() {
                    // question order is zero based.
                    return this.questions.slice(-1)[0].questionOrder + 1;
                }

                /**
                 * Textual description of where we are within the step.
                 * @returns {String}
                 */
                get navigationStatus() {
                    if (this.lowerIndex === this.upperIndex) {
                        return "Question " + this.lowerIndex + " of " + scope.currentStep().totalQuestions;
                    }
                    else {
                        return "Questions " + this.lowerIndex + " - " +
                            this.upperIndex + " of " + scope.currentStep().totalQuestions;
                    }
                }

                /**
                 * Allow user to navigate between question pages.
                 */
                createNavigation() {
                    var nav = super.createNavigation();
                    nav.left.push(
                        new NavButton('Back', this.back, !this.isFirstQuestionOfWizard, false, 0));
                    nav.left.push(
                        new NavButton('Cancel', this.cancel, true, false, 1));
                    nav.right.push(
                        new NavButton('Continue', this.next, true, false, 1));
                    nav.right.push(
                        new NavButton('Save and Exit', this.saveAndExit, true, false, 0));

                    this.navigation = nav;
                }
            }

            /**
             * Review Page, inherits from Page
             * Review and confirm page of the wizard.
             * Instructs the user on their final instructions of the wizard.
             */
            class ReviewPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 */
                constructor(index) {
                    super(index);
                }

                /**
                 * Determines if the entire wizard is valid. Prevents submission of the form.
                 * @returns {Boolean}
                 */
                get isValid() {
                    // If there are any incomplete steps, the form is invalid.
                    return scope.steps.filter(function (s) {
                        return s.type === 'QUESTION' && s.isCompleted === false;
                    }).length === 0;
                }

                /**
                 * Get text context to provide instructions to the user.
                 * Context depends on validity of form.
                 * @returns {String}
                 */
                get content() {
                    var paragraphs = [];
                    if (this.isValid === true) {
                        paragraphs.push("You have now provided responses to all questions for this assessment. At this point, you may click the \"Review/Change Responses\" button to change any of your responses.");
                        paragraphs.push("If you are satisfied with your answers, you may click the \"Submit Assessment\" button to submit your final answers.");
                    }
                    else {
                        paragraphs.push("You have not answered all of the questions in the assessment. Please select one answer for every question.");
                        paragraphs.push("The incomplete steps are indicated above in the progress tracker. Click the incomplete steps to complete the assessment.");
                    }
                    return paragraphs;
                }

                /**
                 * Allow user to return to questions, save, or submit at this page.
                 */
                createNavigation() {
                    var nav = super.createNavigation();
                    nav.left.push(new NavButton('Review/Change Responses', this.back, true, false, 0));
                    nav.right.push(new NavButton('Submit Assessment', scope.submitAndEnd, true, !this.isValid, 1));
                    nav.right.push(new NavButton('Save and Exit', saveAndExit, true, false, 0));

                    this.navigation = nav;
                }
            }

            /**
             * The last page of the wizard.
             * Used to provide the next available steps to the user after the wizard is complete.
             */
            class EndPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {String} type
                 */
                constructor(index, type) {
                    super(index, type);
                }

                /**
                 * Get text context to provide instructions to the user.
                 * @returns {String}
                 */
                get content() {
                    var paragraphs = [];

                    paragraphs.push("Your responses for the " + scope.title + " have been submitted.");

                    return paragraphs;
                }

                /**
                 * Allow user to only go to the assessments page at this point.
                 */
                createNavigation() {
                    var nav = {
                        left: [],
                        right: []
                    };
                    nav.right.push(new NavButton('Review Results', scope.review, true, false, 0));

                    this.navigation = nav;
                }
            }

            /**
             * Nav Button class.
             * Builds out the available navigation options.
             * Enabled/disable and show/hide based on step or page statuses.
             */
            class NavButton {
                /**
                 * Class constructor.
                 * @param {String} text
                 * @param {Function} func
                 * @param {Boolean} enabled
                 * @param {Boolean} hidden
                 * @param {Int} order
                 */
                constructor(text, func, enabled, hidden, order) {
                    this.text = text;
                    this.func = func;
                    this.enabled = enabled;
                    this.hidden = hidden;
                    this.order = order;
                }
            }

            /**
             * Create all of our pages for each category.
             */
            function configurePages() {
                // could move a lot of this logic into the controller to make this directive
                // more reusable. Consider for later and different types of assessments.

                // Create start page.
                // NA - we don't have one for now. Will need to alter starting index for questions.

                // group questions by category name.
                let grouped = scope.questions.group(question => question.categoryName),

                // grouped will look like [ { key: 'catname', data: [ ...cats... ] }, .. ]
                // take each group and create a new step from it.
                    stepIndex = 0;
                scope.steps = grouped.map(function (group, index) {
                    return new QuestionStep((stepIndex + index),
                        group.key,
                        'QUESTION',
                        group.data);
                });

                // Create review page.
                scope.steps.push(
                    new Step((scope.steps.length - 1), 'Review', 'REVIEW')
                );

                // Create end page.
                scope.steps.push(
                    new Step((scope.steps.length - 1), 'End', 'END')
                );

                // Start us off at the first step.
                scope.currentStepIndex = 0;

                // Let the UI know we have everything we need.
                scope.loaded = true;
            }
        }
    }
})();