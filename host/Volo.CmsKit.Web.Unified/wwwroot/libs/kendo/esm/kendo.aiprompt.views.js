import './kendo.core.js';
import './kendo.icons.js';
import './kendo.textarea.js';
import './kendo.button.js';
import './kendo.panelbar.js';

(function($) {
    let Widget = kendo.ui.Widget;

    let AIPromptBaseView = kendo.ui.AIPromptBaseView = Widget.extend({
        init: function(element, options) {
            let that = this;

            Widget.fn.init.call(that, element, options);

            that.aiprompt = element.getKendoAIPrompt();

            that.contentElement = that.options.contentElement;
            that.footerElement = that.options.footerElement;
            that.buttonText = that.options.buttonText;
            that.buttonIcon = that.options.buttonIcon;
        },

        options: {
            name: "AIPromptBaseView",
            buttonText: "",
            buttonIcon: "",
        },

        render: function() {
            let that = this;

            that._renderContent();
            that._renderFooter();
        },

        _renderContentElement: function() {
            let that = this;
            let content = $("<div></div>").addClass("k-prompt-content");
            that.contentElement = content;
            that.element.append(content);

            return that.contentElement;
        },

        _renderFooterElement: function() {
            let that = this;
            let footer = $("<div></div>").addClass("k-prompt-footer");
            that.footerElement = footer;
            that.element.append(footer);

            return that.footerElement;
        },

        destroy: function() {
            let that = this;
            Widget.fn.destroy.call(that);

            if (that.contentElement) {
                that.contentElement.off();
                kendo.destroy(that.contentElement);
                that.contentElement.remove();
            }

            if (that.footerElement) {
                that.footerElement.off();
                kendo.destroy(that.footerElement);
                that.footerElement.remove();
            }
        }
    });

    let DEFAULT_PROMPT_VIEW_TEMPLATE = ({ suggestions, promptSuggestionItemTemplate, messages }) => `<div class="k-prompt-view">
        <textarea ref-prompt-input></textarea>
        ${suggestions?.length ?
            `<div class="k-prompt-expander">
                <button ref-prompt-suggestions-button aria-expanded="true">${messages.promptSuggestions}</button>
                <div class="k-prompt-expander-content" role="list">
                    ${suggestions.map(suggestion => promptSuggestionItemTemplate({ suggestion })).join("")}
                </div>
            </div>` : ''
        }
    </div>`;

    let DEFAULT_PROMPT_VIEW_FOOTER_TEMPLATE = ({ messages }) => `<div class="k-actions k-actions-start k-actions-horizontal k-prompt-actions">
        <button ref-generate-output-button>${messages.generateOutput}</button>
    </div>`;

    let DEFAULT_PROMPT_VIEW_SUGGESTION_ITEM_TEMPLATE = ({ suggestion }) => `<div role="listitem" class="k-prompt-suggestion">${suggestion}</div>`;
    kendo.ui.AIPromptPromptView = AIPromptBaseView.extend({
        init: function(element, options) {
            let that = this;

            AIPromptBaseView.fn.init.call(that, element, options);
            that.promptSuggestions = that.options.promptSuggestions;
            that.promptSuggestionItemTemplate = kendo.template(that.options.promptSuggestionItemTemplate || DEFAULT_PROMPT_VIEW_SUGGESTION_ITEM_TEMPLATE);
        },
        options: {
            name: "AIPromptPromptView",
            buttonIcon: "sparkles",
        },

        _renderContent: function() {
            let that = this;
            let suggestions = that.promptSuggestions;
            let promptSuggestionItemTemplate = that.promptSuggestionItemTemplate;
            let content = kendo.template(that.options.viewTemplate || DEFAULT_PROMPT_VIEW_TEMPLATE)({ suggestions, promptSuggestionItemTemplate, messages: that.options.messages });

            that._renderContentElement();
            that.contentElement.append(content);
        },

        _renderFooter: function() {
            let that = this;
            let footer = kendo.template(that.options.footerTemplate || DEFAULT_PROMPT_VIEW_FOOTER_TEMPLATE)({ messages: that.options.messages });

            that._renderFooterElement();
            that.footerElement.append(footer);
        },

        setTextAreaValue: function(value) {
            let that = this;
            that.contentElement.find("textarea[ref-prompt-input]").getKendoTextArea().value(value);
        },

        _focusSuggestion(element) {
            let that = this;
            if (!element || !element.length) {
                return;
            }

            that.contentElement.find(".k-prompt-suggestion[tabindex=0]").attr("tabindex", "-1");
            element.attr("tabindex", "0").trigger("focus");
        },

        initializeComponents: function() {
            let that = this;
            let suggestions = that.promptSuggestions;

            that.contentElement.find("textarea[ref-prompt-input]").kendoTextArea({
                resize: "vertical",
                placeholder: that.options.messages.promptPlaceholder
            });

            that.footerElement.find("button[ref-generate-output-button]").kendoButton({
                icon: "sparkles",
                themeColor: "primary",
                rounded: "full",
                click: function(e) {
                    that.aiprompt.trigger("promptRequest", {
                        isRetry: false,
                        prompt: that.contentElement.find("textarea[ref-prompt-input]").getKendoTextArea().value()
                    });
                }
            });

            if (suggestions?.length) {
                that.contentElement.find(".k-prompt-suggestion").first().attr("tabindex", "0");
                let nextExpanderContentId = kendo.guid();
                let expanderButton = that.contentElement.find(".k-prompt-expander button[ref-prompt-suggestions-button]");

                that.contentElement.find(".k-prompt-expander button[ref-prompt-suggestions-button]").attr("aria-controls", nextExpanderContentId);
                expanderButton.next(".k-prompt-expander-content").attr("id", nextExpanderContentId);

                that.contentElement.find(".k-prompt-expander button[ref-prompt-suggestions-button]").kendoButton({
                    icon: "chevron-up",
                    fillMode: "flat",
                    click: function(e) {
                        let expander = $(e.target).closest(".k-prompt-expander");
                        let content = expander.find(".k-prompt-expander-content");
                        let iconEl = e.sender.element.find(".k-icon");
                        kendo.ui.icon(iconEl, content.is(":visible") ? "chevron-down" : "chevron-up");
                        content.toggle();
                        e.sender.element.attr("aria-expanded", content.is(":visible"));
                    }
                });

                that.contentElement.on("click", ".k-prompt-suggestion", function(e) {
                    that.setTextAreaValue($(e.target).text());
                });

                that.contentElement.on("keydown", ".k-prompt-suggestion", function(e) {
                    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 36 || e.keyCode === 35 || e.keyCode === 13 || e.keyCode === 32) {
                        e.preventDefault();
                        let target = $(e.target);
                        let siblings = target.siblings();
                        let next, prev;

                        // down arrow
                        if (e.keyCode === 40) {
                            next = target.next();
                            that._focusSuggestion(next);
                        }

                        // up arrow
                        if (e.keyCode === 38) {
                            prev = target.prev();
                            that._focusSuggestion(prev);
                        }

                        // home
                        if (e.keyCode === 36) {
                            prev = siblings.first();
                            that._focusSuggestion(prev);
                        }

                        // end
                        if (e.keyCode === 35) {
                            next = siblings.last();
                            that._focusSuggestion(next);
                        }

                        // enter or space
                        if (e.keyCode === 13 || e.keyCode === 32) {
                            that.setTextAreaValue($(e.target).text());
                        }
                    }
                });
            }
        },

        render: function() {
            let that = this;

            that._renderContent();
            that._renderFooter();
            that.initializeComponents();
        },
    });

    let DEFAULT_OUTPUT_CARD_TEMPLATE_FUNC = ({ output, showOutputRating, messages }) => `
    <div role="listitem" tabindex="0" class="k-card" data-id="${output.id}" >
        <div class="k-card-header">
            <div class="k-card-title">${messages.outputTitle}</div>
            <div class="k-card-subtitle">${output.prompt}</div>
        </div>
        <div class="k-card-body">
            <p class="k-white-space-pre-line">${output.output}</p>
        </div>
        <div class="k-actions k-actions-start k-actions-horizontal k-card-actions">
            <button ref-copy-button>${messages.copyOutput}</button>
            <button ref-retry-button>${messages.retryGeneration}</button>

            <span class="k-spacer"></span>
            ${showOutputRating ? `
            <button ref-rate-positive>${messages.ratePositive}</button>
            <button ref-rate-negative>${messages.rateNegative}</button>
            ` : ""}
        </div>
    </div>`;

    let DEFAULT_OUTPUT_VIEW_TEMPLATE = ({ promptOutputs, showOutputRating, messages }) => `<div role="list" class="k-card-list">
    ${promptOutputs ? promptOutputs.map(output => DEFAULT_OUTPUT_CARD_TEMPLATE_FUNC({ output, showOutputRating, messages })).join("") : ''}
    </div>`;

    kendo.ui.AIPromptOutputView = AIPromptBaseView.extend({
        init: function(element, options) {
            let that = this;

            AIPromptBaseView.fn.init.call(that, element, options);

            that.promptOutputs = (that.options.promptOutputs || []).map(output => {
                output.id = output.id || kendo.guid();
                return output;
            });

            that.showOutputRating = that.options.showOutputRating;
        },

        options: {
            name: "AIPromptOutputView",
            buttonIcon: "comment",
            promptOutputs: []
        },

        addPromptOutput: function(output) {
            let that = this;
            output.id = output.id || kendo.guid();
            that.promptOutputs.unshift(output);
            that.renderPromptOutput(output);
        },

        renderPromptOutput: function(output) {
            let that = this;
            let showOutputRating = that.options.showOutputRating;
            let messages = that.options.messages;

            let card = $(kendo.template(DEFAULT_OUTPUT_CARD_TEMPLATE_FUNC)({ output, showOutputRating, messages }));
            that.outputsContainer.append(card);
            that.initializeComponents(card);
        },

        _renderContent: function() {
            let that = this;
            let promptOutputs = that.promptOutputs;
            let showOutputRating = that.options.showOutputRating;
            let messages = that.options.messages;

            let outputsContainer = kendo.template(that.viewTemplate || DEFAULT_OUTPUT_VIEW_TEMPLATE)({ promptOutputs, showOutputRating, messages });
            that.outputsContainer = $(outputsContainer);
            that._renderContentElement();
            that.contentElement.append(that.outputsContainer);
        },

        _getOutputFromElement: function(element) {
            let that = this;
            let card = $(element).closest(".k-card");
            let id = card.data("id");

            let promptOutput = that.promptOutputs.find(output => output.id === id);

            return promptOutput;
        },

        initializeComponents: function(parentElement) {
            let that = this;
            parentElement = parentElement || that.contentElement;

            parentElement.find("[ref-copy-button]").kendoButton({
                icon: "copy",
                fillMode: "flat",
                themeColor: "primary",
                click: function(e) {
                    let promptOutput = that._getOutputFromElement(e.target);
                    if (!that.aiprompt.trigger("outputCopy", { output: promptOutput, prompt: promptOutput.prompt })) {
                        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                            navigator.clipboard.writeText(promptOutput.output);
                        }
                    }
                }
            });

            parentElement.find("[ref-retry-button]").kendoButton({
                icon: "arrow-rotate-cw",
                fillMode: "flat",
                click: function(e) {
                    let promptOutput = that._getOutputFromElement(e.target);

                    that.aiprompt.trigger("promptRequest", { isRetry: true, prompt: promptOutput.prompt, output: promptOutput });
                }
            });

            if (that.options.showOutputRating) {
                parentElement.find("[ref-rate-positive]").kendoButton({
                    icon: "thumb-up-outline",
                    fillMode: "flat",
                    click: function(e) {
                        let promptOutput = that._getOutputFromElement(e.target);
                        let rateType = "positive";

                        that.aiprompt.trigger("outputRatingChange", { rateType, output: promptOutput });

                        kendo.ui.icon(e.sender.element.find(".k-icon"), "thumb-up");
                        kendo.ui.icon(e.target.next("[ref-rate-negative]").find(".k-icon"), "thumb-down-outline");
                    }
                });

                parentElement.find("[ref-rate-negative]").kendoButton({
                    icon: "thumb-down-outline",
                    fillMode: "flat",
                    click: function(e) {
                        let promptOutput = that._getOutputFromElement(e.target);
                        let rateType = "negative";
                        that.aiprompt.trigger("outputRatingChange", { rateType, output: promptOutput });

                        kendo.ui.icon(e.sender.element.find(".k-icon"), "thumb-down");
                        kendo.ui.icon(e.target.prev("[ref-rate-positive]").find(".k-icon"), "thumb-up-outline");
                    }
                });
            }
        },

        render: function() {
            let that = this;
            that._renderContent();
            that.initializeComponents();

            that.contentElement.on("keydown", ".k-card", function(e) {
                let target = $(e.target);

                // if up or down arrow, focus next or previous card
                // if home or end, focus first or last card
                if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 36 || e.keyCode === 35) {
                    e.preventDefault();

                    // down arrow
                    if (e.keyCode === 40) {
                        target.next(".k-card").trigger("focus");
                    }

                    // up arrow
                    if (e.keyCode === 38) {
                        target.prev(".k-card").trigger("focus");
                    }

                    // home
                    if (e.keyCode === 36) {
                        that.contentElement.find(".k-card").first().trigger("focus");
                    }

                    // end
                    if (e.keyCode === 35) {
                        that.contentElement.find(".k-card").last().trigger("focus");
                    }
                }
            });
        }
    });

    kendo.ui.AIPromptCommandsView = AIPromptBaseView.extend({
        options: {
            name: "AIPromptCommandsView",
            buttonText: "",
            buttonIcon: "more-horizontal",
            promptCommands: []
        },

        initializeComponents: function() {
            let that = this;
            let commandItems = that.options.promptCommands;

            let panelBarEl = $("<div></div>").kendoPanelBar({
                animation: false,
                dataSource: commandItems,
                selectable: false,
                select: function(ev) {
                    let item = $(ev.item);
                    let dataItem = this.dataItem(item);
                    if (dataItem.hasChildren) {
                        return;
                    }

                    that.aiprompt.trigger("commandExecute", { sender: that.aiprompt, item: dataItem });
                }
            });

            that.contentElement.append(panelBarEl);
        },

        render: function() {
            let that = this;
            that._renderContentElement();
            that.initializeComponents();
        },
    });

    let EMPTY_TEMPLATE = () => "";
    kendo.ui.AIPromptCustomView = AIPromptBaseView.extend({
        options: {
            name: "AIPromptCustomView",
            buttonText: "",
            buttonIcon: "",
            viewTemplate: EMPTY_TEMPLATE,
            footerTemplate: EMPTY_TEMPLATE,
        },

        initializeComponents: function() {
            let that = this;
            if (typeof that.options.initializeComponents === "function") {
                that.options.initializeComponents.call(that);
            }
        },

        _renderContent: function() {
            let that = this;
            let content = kendo.template(that.options.viewTemplate)({ aiprompt: that });

            that._renderContentElement();
            that.contentElement.append(content);
        },

        _renderFooter: function() {
            let that = this;
            if (that.options.footerTemplate === EMPTY_TEMPLATE) {
                return;
            }

            let footer = kendo.template(that.options.footerTemplate)({ messages: that.options.messages });

            that._renderFooterElement();
            that.footerElement.append(footer);
        },
        render: function() {
            let that = this;
            that._renderContent();
            that._renderFooter();
            that.initializeComponents();
        },
    });

})(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
