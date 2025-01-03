require('./kendo.core.js');
require('./kendo.icons.js');
require('./kendo.textarea.js');
require('./kendo.button.js');
require('./kendo.toolbar.js');
require('./kendo.aiprompt.views.js');

let __meta__ = {
    id: "aiprompt",
    name: "AIPrompt",
    category: "web",
    description: "The AIPrompt component simplifies the incorporation of external AI services into apps.",
    depends: ["core", "icons", "textarea", "button", "toolbar", "panelbar"],
};

(function($) {
    let kendo = window.kendo,
        Widget = kendo.ui.Widget,
        NS = ".kendoAIPrompt",
        ui = kendo.ui,
        extend = $.extend,

        COMMAND_EXECUTE = "commandExecute",
        PROMPT_REQUEST = "promptRequest",
        OUTPUT_RATING_CHANGE = "outputRatingChange",
        OUTPUT_COPY = "outputCopy",

        FOCUS = "focus";

    let cssClasses = {
        menuButton: "k-menu-button",
        aIPrompt: "k-prompt"
    };

    let defaultViews = {
        prompt: {
            type: "kendo.ui.AIPromptPromptView",
            name: "prompt",
            buttonIcon: "sparkles",
        },
        output: {
            type: "kendo.ui.AIPromptOutputView",
            name: "output",
            buttonIcon: "comment",
        },
        commands: {
            type: "kendo.ui.AIPromptCommandsView",
            name: "commands",
            buttonIcon: "more-horizontal",
        },
        custom: {
            type: "kendo.ui.AIPromptCustomView",
            name: "custom",
        }
    };

    let AIPrompt = Widget.extend({
        init: function(element, options) {
            let that = this;
            options = options || {};
            Widget.fn.init.call(that, element, options);

            if (that.options.views.length == 0) {
                that.options.views = ["prompt", "output"];

                if (this.options.promptCommands && this.options.promptCommands.length) {
                    this.options.views.push("commands");
                }
            }

            that.promptOutputs = that.options.promptOutputs || [];
            that._initLayout();
            that._initViews();
            that._initToolbar();
            that.activeView(that.options.activeView);

            kendo.notify(that);
        },

        options: {
            name: "AIPrompt",
            enabled: true,
            toolbarItems: [],
            promptOutputs: [],
            activeView: 0,
            views: [],
            popup: null,
            messages: {
                promptView: "Ask AI",
                outputView: "Output",
                commandsView: "",
                customView: "Custom View",
                promptPlaceholder: "Ask or generate content with AI",
                promptSuggestions: "Prompt Suggestions",
                generateOutput: "Generate",
                outputTitle: "Generated with AI",
                outputRetryTitle: "Generated with AI",
                copyOutput: "Copy",
                retryGeneration: "Retry",
                ratePositive: "",
                rateNegative: ""
            },
            showOutputRating: true,
        },

        events: [
            COMMAND_EXECUTE,
            PROMPT_REQUEST,
            OUTPUT_RATING_CHANGE,
            OUTPUT_COPY,
        ],

        _initializeView: function(name) {
            let viewConfig = this.views[name];
            let view;
            if (viewConfig) {
                let type = viewConfig.type;

                if (typeof type === "string") {
                    type = kendo.getter(viewConfig.type)(window);
                }

                if (type) {
                    view = new type(this.element, extend(true, {
                        promptSuggestions: this.options.promptSuggestions,
                        promptCommands: this.options.promptCommands,
                        promptOutputs: this.promptOutputs,
                        showOutputRating: this.options.showOutputRating,
                        messages: this.options.messages,
                        promptSuggestionItemTemplate: this.options.promptSuggestionItemTemplate,

                    },
                        viewConfig
                    ));
                } else {
                    throw new Error("There is no such view");
                }
            }

            return view;
        },

        _unbindView: function(view) {
            if (view) {
                view.destroy();
            }
        },

        _initViews: function() {
            let that = this,
                options = that.options,
                views = options.views;

            that.views = {};
            that.viewsArray = [];

            for (let i = 0, l = views.length; i < l; i++) {
                let view = views[i];
                let isSettings = typeof view === "object";
                let name = view;

                if (isSettings) {
                    name = typeof view.type !== "string" ? view.name : view.type;
                }

                let defaultView = defaultViews[name];

                if (defaultView) {
                    if (isSettings) {
                        view.type = defaultView.type;
                    }

                    defaultView.buttonText = that.options.messages[`${name}View`];
                }

                view = Object.assign({ title: view.title, name, index: i }, defaultView, isSettings ? view : {});
                that.viewsArray.push(view);

                if (name) {
                    that.views[name] = view;
                }
            }
        },

        getViews: function() {
            return this.viewsArray;
        },

        activeView: function(name) {
            let that = this;
            if (name === undefined) {
                return that._activeViewIndex;
            }

            if (Number.isInteger(name)) {
                name = that.viewsArray[name].name;
            }

            if (name && that.views[name]) {
                if (that._selectedView) {
                    that._unbindView(that._selectedView);
                }

                that._selectedView = that._initializeView(name);
                that._activeViewIndex = that.viewsArray.findIndex(v => v.name === name);
                that._selectedView.render();

                that._updateToolbarState(that._activeViewIndex);

                let toolItem = $(that.toolbar._getAllItems()[that._activeViewIndex]);
                that.toolbar._resetTabIndex(toolItem);
                toolItem.trigger(FOCUS);
            }
        },

        addPromptOutput: function(output) {
            output.id = output.id || kendo.guid();
            this.promptOutputs.unshift(output);

            if (typeof this._selectedView.renderPromptOutput === "function") {
                return this._selectedView.renderPromptOutput(output);
            }
        },

        _updateToolbarState: function(activeToolIndex) {
            let toolbar = this.toolbar;
            toolbar.element.find(".k-toolbar-toggle-button").each(function(index, elm) {
                toolbar.toggle($(elm), index == activeToolIndex);
            });
        },

        _initLayout: function() {
            let that = this,
                header = $("<div></div>").addClass("k-prompt-header");

            that.header = header;
            that.element.addClass(cssClasses.aIPrompt);
            that.element.append(header);
        },

        _getViewTools: function() {
            let that = this;

            return that.viewsArray.map(v => ({
                type: "button",
                text: v.buttonText,
                icon: v.buttonIcon,
                fillMode: "flat",
                themeColor: "primary",
                rounded: "full",
                togglable: true,
                toggle: function() {
                    that.activeView(v.name);
                }
            }));
        },

        _initToolbar: function() {
            let that = this;
            let items = that.options.toolbarItems;
            items = Array.isArray(items) ? items : [items];

            let toolbarEl = $("<div></div>").kendoToolBar({
                resizable: false,
                fillMode: "flat",
                items: that._getViewTools().concat(items)
            }).appendTo(that.header);

            that.toolbar = toolbarEl.data("kendoToolBar");
        },

        focus: function() {
            let that = this;
            that.element.trigger(FOCUS);
        },

        destroy: function() {
            let that = this;

            that.toolbar?.destroy();
            that._selectedView?.destroy();

            that.element.off(NS);

            Widget.fn.destroy.call(that);
        }
    });

    ui.plugin(AIPrompt);

})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
