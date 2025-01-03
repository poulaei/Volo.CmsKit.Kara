import './kendo.core.js';
import './kendo.html.button.js';
import './kendo.icons.js';
import './kendo.draganddrop.js';

(function($, undefined$1) {

    var kendo = window.kendo;
    var Widget = kendo.ui.Widget;
    var extend = $.extend;
    var DOT = ".";
    var NS = ".kendoChat";
    var keys = kendo.keys;

    var messageBoxStyles = {
        input: "k-input-inner",
        inputWrapper: "k-textbox k-input k-input-md k-input-solid k-rounded-md",
        button: "k-button",
        buttonFlat: "k-button-lg k-button-flat k-button-flat-base",
        iconButton: "k-icon-button",
        buttonIcon: "k-button-icon",
        buttonSend: "k-chat-send",
        buttonSendIcon: "paper-plane",
        buttonToggle: "k-button-toggle",
        buttonToggleIcon: "more-horizontal",
        hidden: "k-hidden",
        inputSuffix: "k-input-suffix k-input-suffix-horizontal",
        separator: "k-input-separator k-input-separator-vertical"
    };

    var ChatMessageBox = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);

            this._wrapper();

            this._attachEvents();

            this._typing = false;
        },

        events: [
            "focusToolbar",
            "sendMessage",
            "toggleToolbar",
            "typingEnd",
            "typingStart"
        ],

        options: {
            messages: {
                placeholder: "Type a message...",
                toggleButton: "Toggle toolbar",
                sendButton: "Send message"
            }
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            if (this.input) {
                this.input.off(NS);
                this.input.remove();
                this.input = null;
            }

            this.element.off(NS);
            this.element.empty();
        },

        _wrapper: function() {
            var styles = ChatMessageBox.styles;
            var options = this.options;
            var messages = options.messages;
            var inputId = "inputId_" + kendo.guid();

            this.inputWrapper = this.element
                .addClass(styles.inputWrapper)
                .appendTo(this.element);

            this.input = $("<input type='text'>")
                .addClass(styles.input)
                .attr("id", inputId)
                .attr("aria-label", messages.placeholder)
                .attr("placeholder", messages.placeholder)
                .appendTo(this.inputWrapper);

            this.separator = $("<span></span>")
                .addClass(styles.separator)
                .appendTo(this.inputWrapper);

            this.inputSuffix = $("<span></span>")
                .addClass(styles.inputSuffix)
                .appendTo(this.inputWrapper);

            if (options.toolbar && options.toolbar.toggleable && options.toolbar.buttons && options.toolbar.buttons.length) {
                $(kendo.html.renderButton(`<button class="${styles.buttonToggle}" title="${messages.toggleButton}" aria-label="${messages.toggleButton}" aria-controls="${options.toolbarId}"></button>`,
                    {
                        icon: styles.buttonToggleIcon,
                        fillMode: "flat",
                        size: "medium"
                    }))
                .appendTo(this.inputSuffix);
            }

            $(kendo.html.renderButton(`<button class="${styles.buttonSend}" title="${messages.sendButton}" aria-label="${messages.sendButton}"></button>`,
                {
                    icon: styles.buttonSendIcon,
                    fillMode: "flat",
                    size: "medium"
                }))
            .appendTo(this.inputSuffix);
        },

        _attachEvents: function() {
            var styles = ChatMessageBox.styles;

            this.input
                .on("keydown" + NS, this._keydown.bind(this))
                .on("input" + NS, this._input.bind(this))
                .on("focusout" + NS, this._inputFocusout.bind(this));

            this.element
                .on("click" + NS, DOT + styles.buttonSend, this._buttonClick.bind(this));

            this.element
                .on("click" + NS, DOT + styles.buttonToggle, this._toggleToolbar.bind(this));
        },

        _input: function() {
            var currentValue = this.input.val();
            var start = currentValue.length > 0;

            this._triggerTyping(start);
        },

        _keydown: function(e) {
            var key = e.keyCode;

            switch (key) {
                case keys.ENTER:
                    e.preventDefault();

                    this._sendMessage();
                    break;
                case keys.F10:
                    e.preventDefault();

                    this.trigger("focusToolbar");
                    break;
            }
        },

        _buttonClick: function(e) {
            e.preventDefault();

            this._sendMessage();
        },

        _sendMessage: function() {
            var value = this.input.val();

            if (!value.length) {
                return;
            }

            this._triggerTyping(false);

            var args = {
                text: value
            };

            this.trigger("sendMessage", args);

            this.input.val("");
        },

        _inputFocusout: function() {
            this._triggerTyping(false);
        },

        _triggerTyping: function(start) {
            if (start) {
                if (!this._typing) {
                    this.trigger("typingStart", {});
                    this._typing = true;
                }
            } else {
                if (this._typing) {
                    this.trigger("typingEnd", {});
                    this._typing = false;
                }
            }
        },

        _toggleToolbar: function(ev) {
            this.trigger("toggleToolbar", { originalEvent: ev });
        }
    });

    extend(true, ChatMessageBox, { styles: messageBoxStyles });
    extend(kendo, {
        chat: {
            ChatMessageBox: ChatMessageBox
        }
    });
})(window.kendo.jQuery);

(function($, undefined$1) {

    var kendo = window.kendo;
    var Widget = kendo.ui.Widget;
    var extend = $.extend;
    var DOT = ".";
    var NS = ".kendoChat";

    var DATA_K_BUTTON_NAME = "kButtonName";
    var SCROLL_LEFT_NAME = "chatToolbarScrollLeft";
    var SCROLL_RIGHT_NAME = "chatToolbarScrollRight";
    var VISIBLE = ":visible";
    var TABINDEX = "tabindex";

    var DEFAULT_ANIMATION = {
        effects: "expand:vertical",
        duration: 200
    };
    var NO_ANIMATION = {
        expand: {
            show: true
        },
        collapse: {
            hide: true
        }
    };

    var toolbarStyles = {
        button: "k-button",
        buttonDefaults: "k-button-md k-rounded-md k-button-solid k-button-solid-base",
        buttonList: "k-button-list k-toolbar-group",
        scrollButton: "k-scroll-button",
        scrollButtonLeft: "k-scroll-button-left",
        scrollButtonRight: "k-scroll-button-right",
        scrollButtonLeftIcon: "chevron-left",
        scrollButtonRightIcon: "chevron-right",
        iconButton: "k-icon-button"
    };

    var ChatToolBar = Widget.extend({
        init: function(element, options) {
            options = extend({}, options, { name: "ChatToolbar" });
            var toolbarOptions = options.toolbar;
            var buttonsDefined = toolbarOptions.buttons && toolbarOptions.buttons.length;

            Widget.fn.init.call(this, element, options);

            if (buttonsDefined) {
                this._createButtonList();
            }

            if (buttonsDefined && toolbarOptions.scrollable &&
                    this.buttonsWidth() > this.element.width()) {
                this._initScrolling();
            }

            this._setupAnimation();

            if (buttonsDefined && toolbarOptions.toggleable) {
                this.toggle(true);
            }

            this.element
                .on("click" + NS, this._onClick.bind(this))
                .on("keydown" + NS, this._onKeydown.bind(this));
        },

        events: [
            "click"
        ],

        destroy: function() {
            Widget.fn.destroy.call(this);

            this.element.off(NS);
            this.element.empty();
        },

        _createButtonList: function() {
            var that = this;
            var styles = ChatToolBar.styles;
            var buttons = that.options.toolbar.buttons;
            var buttonList = $("<div class='" + styles.buttonList + "'></div>");

            for (var i = 0; i < buttons.length; i++) {
                var button = that._createButton(buttons[i]);
                buttonList.append(button);
            }

            buttonList.appendTo(this.element);

            this.buttonList = buttonList;
            this.buttons().first().removeAttr(TABINDEX);
        },

        _createButton: function(btnOptions) {
            var styles = ChatToolBar.styles;
            var buttonElm = $("<button>");
            var attributes;

            if (typeof btnOptions === "string") {
                btnOptions = {
                    name: btnOptions
                };
            }

            attributes = $.extend({}, btnOptions.attr || {}, {
                title: btnOptions.text || btnOptions.name,
                "aria-label": btnOptions.text || btnOptions.name,
                type: "button",
                tabindex: -1
            });

            buttonElm
                .attr(attributes)
                .addClass(btnOptions.name)
                .data(DATA_K_BUTTON_NAME, btnOptions.name)
                .addClass(styles.button)
                .addClass(styles.buttonDefaults);

            if (btnOptions.icon || btnOptions.iconClass) {
                buttonElm.addClass(styles.iconButton);
                buttonElm.prepend(kendo.html.renderIcon({ icon: btnOptions.icon, iconClass: "k-button-icon" + (btnOptions.iconClass ? ` ${btnOptions.iconClass}` : "") }));
            }

            return buttonElm;
        },

        _onClick: function(ev) {
            var styles = ChatToolBar.styles;
            var target = $(ev.target).closest(DOT + styles.button);

            if (target.is(DOT + styles.scrollButton) && !this._scrolling) {
                this._scroll(target.data(DATA_K_BUTTON_NAME));
            }

            if (target.data(DATA_K_BUTTON_NAME)) {
                this.buttons().attr(TABINDEX, -1);
                target.removeAttr(TABINDEX);

                this.trigger("click", {
                    button: target[0],
                    name: target.data(DATA_K_BUTTON_NAME),
                    originalEvent: ev
                });
            }
        },

        _onKeydown: function(e) {
            var key = e.keyCode,
                keys = kendo.keys;

            switch (key) {
                case keys.LEFT:
                    this._focusButton(-1);
                    break;
                case keys.RIGHT:
                    this._focusButton(1);
                    break;
            }
        },

        _focusButton: function(dir) {
            var buttons = this.buttons(),
                current = buttons.not("[tabindex=-1]"),
                candidateIndex = current.index() + dir,
                candidate = buttons[candidateIndex];

            if (candidate) {
                current.attr(TABINDEX, -1);
                candidate.removeAttribute(TABINDEX);
                candidate.focus();
            }
        },

        _initScrolling: function() {
            var styles = ChatToolBar.styles;

            this.scrollButtonLeft = this._createButton({
                name: SCROLL_LEFT_NAME,
                icon: styles.scrollButtonLeftIcon,
                attr: {
                    "class": styles.scrollButton + " " + styles.scrollButtonLeft
                }
            });

            this.scrollButtonRight = this._createButton({
                name: SCROLL_RIGHT_NAME,
                icon: styles.scrollButtonRightIcon,
                attr: {
                    "class": styles.scrollButton + " " + styles.scrollButtonRight
                }
            });

            this.element.prepend(this.scrollButtonLeft);
            this.element.append(this.scrollButtonRight);
            this._refreshScrollButtons();

            this.element.on("keydown" + NS, this._refreshScrollButtons.bind(this));
        },

        _scroll: function(commandName) {
            var that = this;
            var buttonWidth = that.buttonWidth();
            var maxScrollSize = this.maxScrollSize();
            var scrollAmmount = commandName === SCROLL_LEFT_NAME ? buttonWidth * -1 : buttonWidth;
            var currentScroll = this.currentScrollLeft();
            var scrollValue = currentScroll + scrollAmmount;
            scrollValue = Math.min(Math.max(scrollValue, 0), maxScrollSize);

            if (commandName !== SCROLL_LEFT_NAME && commandName !== SCROLL_RIGHT_NAME) {
                return;
            }

            kendo.scrollLeft(that.buttonList, scrollValue);
            that._refreshScrollButtons(scrollValue);
        },

        _refreshScrollButtons: function(value) {
            var maxScrollSize = this.maxScrollSize();
            var currentScrollLeft = value === undefined$1 || isNaN(parseInt(value, 10)) ? this.currentScrollLeft() : value;

            if (!this.scrollButtonLeft && !this.scrollButtonRight) {
                return;
            }

            this.scrollButtonLeft.toggle(currentScrollLeft !== 0);
            this.scrollButtonRight.toggle(currentScrollLeft !== maxScrollSize);
        },

        _setupAnimation: function() {
            var animation = this.options.toolbar.animation;
            var defaultExpandAnimation = extend({}, DEFAULT_ANIMATION);
            var defaultCollapseAnimation = extend({
                reverse: true,
                hide: true
            }, DEFAULT_ANIMATION);

            if (animation === false) {
                animation = extend(true, {}, NO_ANIMATION);
            } else {
                animation = extend(true, {
                    expand: defaultExpandAnimation,
                    collapse: defaultCollapseAnimation
                }, animation);
            }

            this.options.toolbar.animation = animation;
        },

        _animationComplete: function() {
            this._refreshScrollButtons();
        },

        _animationCompleteExpand: function() {
            this._animationComplete();
            this.buttons().not("[tabindex=-1]").trigger("focus");
        },

        currentScrollLeft: function() {
            return Math.round(kendo.scrollLeft(this.buttonList));
        },

        maxScrollSize: function() {
            return Math.round(this.buttonList[0].scrollWidth - this.buttonList[0].clientWidth);
        },

        buttons: function() {
            var styles = ChatToolBar.styles;
            return this.buttonList ? this.buttonList.children(DOT + styles.button) : null;
        },

        buttonWidth: function() {
            return Math.round(this.buttons().last().outerWidth(true));
        },

        buttonsWidth: function() {
            var width = 0;

            if (this.buttons()) {
                width = this.buttonWidth() * this.buttons().length;
            }

            return width;
        },

        toggle: function(skipAnimation) {
            var animation = this.options.toolbar.animation;

            if (skipAnimation) {
                animation = extend(true, {}, NO_ANIMATION);
            }

            animation.expand.complete = this._animationCompleteExpand.bind(this);
            animation.collapse.complete = this._animationComplete.bind(this);

            if (this.element.is(VISIBLE)) {
                this.element.kendoStop().kendoAnimate(animation.collapse);
            } else {
                this.element.kendoStop().kendoAnimate(animation.expand);
            }

        },

        focus: function() {
            if (!this.element.is(VISIBLE)) {
                this.toggle();
            } else {
                this.buttons().not("[tabindex=-1]").trigger("focus");
            }
        }
    });

    extend(true, ChatToolBar, { styles: toolbarStyles });
    extend(kendo.chat, {
        ChatToolBar: ChatToolBar
    });
})(window.kendo.jQuery);

(function($, undefined$1) {

    var kendo = window.kendo;
    var encode = kendo.htmlEncode;
    var Widget = kendo.ui.Widget;
    var extend = $.extend;
    var DOT = ".";
    var SPACE = " ";
    var NS = ".kendoChat";

    var IMG_TEMPLATE = ({ url, text, styles }) => `<img src="${url}" alt="${encode(text)}">`;

    var AVATAR_TEMPLATE = ({ url, text, styles }) => `<div class="k-avatar k-avatar-md k-avatar-solid k-avatar-solid-primary k-rounded-full">` +
                                `<span class="k-avatar-image">` +
                                    IMG_TEMPLATE({ url, text, styles }) +
                                `</span>` +
                            `</div>`;

    var MESSAGE_GROUP_TEMPLATE = ({ text, url, styles }) => `<div ${encode(text)} class="${styles.messageGroup} ${ url ? "" : styles.noAvatar }">
            <p class="${styles.author}">${encode(text)}</p>
            ${ url ? AVATAR_TEMPLATE({ url, text, styles }) : '' }
        </div>`;

    var SELF_MESSAGE_GROUP_TEMPLATE = ({ url, text, styles }) => `<div me class="${styles.messageGroup} ${styles.self} ${ url ? "" : styles.noAvatar }">
        ${ url ? AVATAR_TEMPLATE({ url, text, styles }) : '' }
    </div>`;

    var TEXT_MESSAGE_TEMPLATE = ({ styles, text, timestamp }) => `<div class="${styles.message}">
        <time class="${styles.messageTime}">${ kendo.toString(kendo.parseDate(timestamp), "HH:mm:ss") }</time>
        <div class="${styles.bubble}">${encode(text)}</div>
    </div>`;

    var TYPING_INDICATOR_TEMPLATE = ({ styles, text }) => `<div class="${styles.messageListContent} ${styles.typingIndicatorBubble}">
        <p class="${styles.author}">${encode(text)}</p>
        <div class="${styles.message}">
            <div class="${styles.bubble}">
                <div class="${styles.typingIndicator}">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    </div>`;

    var SUGGESTED_ACTION_TEMPLATE = ({ styles, action }) => `<span role="button" tabindex="0" class="${styles.suggestedAction}" data-value="${encode(action.value)}">${encode(action.title)}</span>`;

    var SUGGESTED_ACTIONS_TEMPLATE = ({ styles, suggestedActions }) => `<div class="${styles.suggestedActions}">
        ${ suggestedActions.map(action => SUGGESTED_ACTION_TEMPLATE({ styles, action })).join('') }
    </div>`;

    var HERO_IMG_TEMPLATE = ({ images, styles }) => `<img src="${encode(images[0].url)}" alt="${images[0].alt}" class="${styles.cardMedia}" />`;

    var CARD_ACTION_BUTTON_TEMPLATE = ({ button, styles }) => `<span class="${styles.cardAction}"><button class="${styles.button} ${styles.buttonPrimary}" data-value="${encode(button.value)}"><span class="k-button-text">${encode(button.title)}</span></button></span>`;

    var CARD_ACTIONS_TEMPLATE = ({ styles, buttons }) => `<div class="k-actions ${styles.cardActions} ${styles.cardActionsVertical}">
        ${ buttons.map((button) => CARD_ACTION_BUTTON_TEMPLATE({ styles, button })).join('') }
    </div>`;

    var HERO_CARD_TEMPLATE = ({ styles, images, buttons, title, subtitle, text }) => `<div class="${styles.card} ${styles.cardRich}">
        ${ (typeof images !== "undefined" && images.length > 0) ? HERO_IMG_TEMPLATE({ images, styles }) : '' }
        <div class="${styles.cardBody}">
            ${ typeof title !== "undefined" ? (() => `<h5 class="${styles.cardTitle}">${encode(title)}</h5>`)() : '' }
            ${ typeof subtitle !== "undefined" ? (() => `<h6 class="${styles.cardSubtitle}">${encode(subtitle)}</h6>`)() : '' }
            ${ typeof text !== "undefined" ? (() => `<p>${encode(text)}</p>`)() : '' }
        </div>
        ${ (typeof buttons !== "undefined" && buttons.length > 0) ? CARD_ACTIONS_TEMPLATE({ buttons, styles }) : ''}
    </div>`;

    extend(kendo.chat, {
        Templates: {},
        Components: {}
    });

    kendo.chat.registerTemplate = function(templateName, template) {
        kendo.chat.Templates[templateName] = kendo.template(template);
    };

    kendo.chat.getTemplate = function(templateName) {
        return kendo.chat.Templates[templateName] || TEXT_MESSAGE_TEMPLATE;
    };

    kendo.chat.registerTemplate("text", TEXT_MESSAGE_TEMPLATE);
    kendo.chat.registerTemplate("message", TEXT_MESSAGE_TEMPLATE);
    kendo.chat.registerTemplate("typing", TYPING_INDICATOR_TEMPLATE);
    kendo.chat.registerTemplate("suggestedAction", SUGGESTED_ACTIONS_TEMPLATE);
    kendo.chat.registerTemplate("heroCard", HERO_CARD_TEMPLATE);
    kendo.chat.registerTemplate("application/vnd.microsoft.card.hero", HERO_CARD_TEMPLATE);

    kendo.chat.registerComponent = function(componentName, component) {
        kendo.chat.Components[componentName] = component;
    };

    kendo.chat.getComponent = function(componentName) {
        return kendo.chat.Components[componentName] || null;
    };

    var Component = kendo.chat.Component = kendo.Class.extend({
        init: function(options, view) {
            this.element = $('<div></div>');
            this.options = options;
            this.view = view;
        },

        destroy: function() {
            kendo.destroy(this.element);
        }
    });

    var Calendar = Component.extend({
        init: function(options, view) {
            Component.fn.init.call(this, options, view);

            this.element.kendoCalendar({
                change: function() {
                    view.trigger("suggestedAction", { text: kendo.toString(this.value(), 'd'), type: "message" });
                }
            });
        },

        destroy: function() {
        }
    });
    kendo.chat.registerComponent("calendar", Calendar);

    var viewStyles = {
        wrapper: "k-chat",
        messageList: "k-avatars",
        messageListContent: "k-message-list-content",
        messageTime: "k-message-time",
        messageGroup: "k-message-group",
        message: "k-message",
        only: "k-only",
        first: "k-first",
        middle: "k-middle",
        last: "k-last",
        author: "k-author",
        avatar: "k-avatar",
        noAvatar: "k-no-avatar",
        self: "k-alt",
        button: "k-button",
        buttonDefaults: "k-button-md k-rounded-md k-button-solid k-button-solid-base",
        iconButton: "k-icon-button",
        buttonIcon: "k-button-icon",
        buttonPrimary: "k-button-md k-rounded-md k-button-flat k-button-flat-primary",
        scrollButtonIconLeft: "chevron-left",
        scrollButtonIconRight: "chevron-right",
        typingIndicator: "k-typing-indicator",
        typingIndicatorBubble: "k-typing-indicator-bubble",
        bubble: "k-chat-bubble",
        suggestedActions: "k-quick-replies",
        suggestedAction: "k-quick-reply",
        cardWrapper: "k-card-container",
        cardDeckScrollWrap: "k-card-deck-scrollwrap",
        cardDeck: "k-card-deck",
        cardList: "k-card-list",
        card: "k-card",
        cardRich: "k-card-type-rich",
        cardBody: "k-card-body",
        cardMedia: "k-card-media",
        cardTitle: "k-card-title",
        cardSubtitle: "k-card-subtitle",
        cardActions: "k-card-actions",
        cardActionsVertical: "k-actions-vertical",
        cardActionsHorizontal: "k-actions-horizontal",
        cardActionsStart: "k-actions-start",
        cardActionsCenter: "k-actions-center",
        cardActionsEnd: "k-actions-end",
        cardActionsStretched: "k-actions-stretched",
        cardAction: "k-card-action",
        selected: "k-selected"
    };

    var ChatView = kendo.chat.ChatView = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);

            this._list();

            this._lastSender = null;

            this.typingParticipants = [];

            this._attachEvents();

            this._scrollable();
        },

        events: [
        ],

        options: {
            messages: {
                isTyping: " is typing.",
                areTyping: " are typing.",
                and: " and "
            }
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            if (this._scrollDraggable) {
                this._scrollDraggable.destroy();
            }

            this.element.empty();
            this.element.off(NS);

            this.list = null;
            this._lastSender = null;
        },

        _list: function() {
            var viewStyles = ChatView.styles;

            this.element
                .addClass(viewStyles.messageList)
                .attr("role", "log")
                .attr("aria-label", this.options.messages.messageListLabel);

            this.list = $("<div>")
                .addClass(viewStyles.messageListContent)
                .appendTo(this.element);
        },

        _attachEvents: function() {
            var styles = ChatView.styles;

            this.element
                .on("click" + NS, this._listClick.bind(this))
                .on("click" + NS, DOT + styles.message, this._messageClick.bind(this))
                .on("click" + NS, DOT + styles.suggestedAction, this._suggestedActionClick.bind(this))
                .on("click" + NS, DOT + styles.cardAction + SPACE + DOT + styles.button, this._cardActionClick.bind(this));

            this.element.on("keydown" + NS, DOT + styles.suggestedAction, this._suggestedActionKeydown.bind(this));
        },

        _scrollable: function() {
            var viewStyles = ChatView.styles;

            this.element
                .on("click" + NS, DOT + viewStyles.cardDeckScrollWrap + SPACE + DOT + viewStyles.button, this._scrollButtonClick.bind(this));
        },

        _scrollButtonClick: function(e) {
            var viewStyles = ChatView.styles;
            var button = $(e.currentTarget);
            var scrollToLeft = button.find(`${DOT + viewStyles.buttonIcon}[class*=${viewStyles.scrollButtonIconLeft}]`).length !== 0;
            var scrollContainer = button.siblings(DOT + viewStyles.cardDeck);
            var lastCard = scrollContainer.find(DOT + viewStyles.card).last();
            var cardWidth = lastCard.outerWidth(true);

            if (scrollToLeft) {
                kendo.scrollLeft(scrollContainer, kendo.scrollLeft(scrollContainer) - cardWidth);
            } else {
                kendo.scrollLeft(scrollContainer, kendo.scrollLeft(scrollContainer) + cardWidth);
            }
        },

        getTemplate: function(templateName) {
            return kendo.chat.getTemplate(templateName);
        },

        getComponent: function(type) {
           return kendo.chat.getComponent(type);
        },

        renderMessage: function(message, sender) {
            if (!message.timestamp) {
                message.timestamp = new Date();
            }

            if (!message.text) {
                message.text = "";
            }

            var bubbleElement = this._renderTemplate(message.type, message);

            this._renderBubble(message.type, bubbleElement, sender);

            if (message.type == "typing") {
                if (this.typingParticipants.length > 0) {
                    this._removeTypingParticipant(sender);
                }
            } else {
                this._lastSender = sender.id;
            }
        },

        renderSuggestedActions: function(suggestedActions) {
            this._removeSuggestedActions();

            var element = this._renderTemplate("suggestedAction", { suggestedActions: suggestedActions });

            this.list.append(element);

            this._scrollToBottom();
        },

        renderAttachments: function(options) {
            var wrapper = this._renderAttachmentWrapper(options.attachmentLayout);
            var cardContainer = options.attachmentLayout === "carousel" ? wrapper.find(DOT + ChatView.styles.cardDeck) : wrapper;
            var attachments = options.attachments;

            if (!attachments.length) {
                return;
            }

            for (var i = 0; i < attachments.length; i++) {
                var cardElement = this._renderTemplate(attachments[i].contentType, attachments[i].content);

                cardContainer.append(cardElement);
            }

            this._removeSuggestedActions();
            this._removeTypingIndicator();

            this.list.append(wrapper);

            this._lastSender = null;
        },

        renderComponent: function(type) {
            var componentType = this.getComponent(type);
            var component = new componentType({}, this);

            this.list.append(component.element);

            this._scrollToBottom();
        },

        _renderAttachmentWrapper: function(layout) {
            var viewStyles = ChatView.styles;
            var wrapper = $("<div>");

            if (layout === "carousel") {
                wrapper.addClass(viewStyles.cardDeckScrollWrap);

                var buttonLeft = this._renderScrollButton(viewStyles.scrollButtonIconLeft);
                wrapper.append(buttonLeft);

                wrapper.append($("<div>").addClass(viewStyles.cardDeck));

                var buttonRight = this._renderScrollButton(viewStyles.scrollButtonIconRight);
                wrapper.append(buttonRight);
            } else {
                wrapper.addClass(viewStyles.cardList);
            }

            return wrapper;
        },

        _renderScrollButton: function(directionClass) {
            var viewStyles = ChatView.styles;

            return $("<button>")
                .addClass(viewStyles.button)
                .addClass(viewStyles.buttonDefaults)
                .addClass(viewStyles.iconButton)
                .append(kendo.html.renderIcon({ icon: directionClass, iconClass: viewStyles.buttonIcon }));
        },

        _removeSuggestedActions: function() {
            this.list.find(DOT + ChatView.styles.suggestedActions).remove();
        },

        _listClick: function(e) {
            var styles = ChatView.styles;
            var targetElement = $(e.target);

            if (targetElement.hasClass(styles.message) || targetElement.parents(DOT + styles.message).length) {
                return;
            }

            this._clearSelection();
        },

        _messageClick: function(e) {
            this._clearSelection();

            $(e.currentTarget).addClass(ChatView.styles.selected);
        },

        _suggestedActionClick: function(e) {
            var text = $(e.target).data("value") || "";

            this.trigger("actionClick", { text: text });

            this._removeSuggestedActions();
        },

        _suggestedActionKeydown: function(e) {
            if (e.keyCode === kendo.keys.SPACEBAR || e.keyCode === kendo.keys.ENTER) {
                this._suggestedActionClick(e);
            }
        },

        _cardActionClick: function(e) {
            var text = $(e.target).data("value") || "";

            this.trigger("actionClick", { text: text });
        },

        _renderBubble: function(messageType, bubbleElement, sender) {
            this._removeSuggestedActions();
            this._removeTypingIndicator();

            var group = this._getMessageGroup(sender, messageType);

            this._appendToGroup(group, bubbleElement, messageType);

            this._scrollToBottom();
        },

        _renderTemplate: function(type, options) {
            var componentType = this.getComponent(type);
            var element;

            if (componentType) {
                var component = new componentType(options, this);

                element = component.element;
            } else {
                var template = this.getTemplate(type);
                var templateOptions = extend(true, {}, options, { styles: ChatView.styles });

                element = $(template(templateOptions));
            }

            return element;
        },

        _getMessageGroup: function(sender, messageType) {
            var viewStyles = ChatView.styles;
            var template = this._getMessageGroupTemplate(sender, messageType);
            var appendTarget = messageType == "typing" ? this.element : this.list;
            var group;

            if (sender.id === this._lastSender && this._lastSender !== null && messageType !== "typing") {
                group = this.list.find(DOT + viewStyles.messageGroup).last();

                if (group.length) {
                    return group;
                }
            }

            return $(template({ text: sender.name, url: sender.iconUrl, styles: viewStyles })).appendTo(appendTarget);
        },

        _getMessageGroupTemplate: function(sender, messageType) {
            var isOwnMessage = sender.id === this.options.user.id;
            var template = isOwnMessage ?
                SELF_MESSAGE_GROUP_TEMPLATE :
                MESSAGE_GROUP_TEMPLATE;

            if (messageType == "typing") {
                template = TYPING_INDICATOR_TEMPLATE;
            }

            return template;
        },

        _appendToGroup: function(group, messageElement, messageType) {
            var viewStyles = ChatView.styles;
            var children = group.find(DOT + viewStyles.message);
            var childrenCount = children.length;
            var indicator = this.element.find(DOT + viewStyles.typingIndicator);

            if (indicator.length && messageType == "typing") {
                return;
            }

            messageElement.addClass(childrenCount === 0 ? viewStyles.only : viewStyles.last);

            children.filter(DOT + viewStyles.only)
                .removeClass(viewStyles.only)
                .addClass(viewStyles.first);

            children.filter(DOT + viewStyles.last)
                .removeClass(viewStyles.last)
                .addClass(viewStyles.middle);

            group.append(messageElement);
        },

        _renderTypingIndicator: function(sender) {
            var indicator = this.element.find(DOT + viewStyles.typingIndicatorBubble),
                indicatorList,
                participants;

            this._addTypingParticipant(sender);

            if (indicator.length) {
                participants = this._composeTypingParticipantsText(this.typingParticipants);

                indicatorList = indicator.find(DOT + viewStyles.author).first();
                indicatorList.text(participants);

            } else {
                $(TYPING_INDICATOR_TEMPLATE({
                    text: sender.name + this.options.messages.isTyping,
                    styles: viewStyles
                })).appendTo(this.element);
            }

            this._scrollToBottom();
        },

        _addTypingParticipant: function(sender) {
            var found = false;
            for (var i = 0; i < this.typingParticipants.length; i += 1) {
                if (this.typingParticipants[i].id == sender.id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.typingParticipants.push(sender);
            }
        },

        _removeTypingParticipant: function(sender) {
            var indicator = this.element.find(DOT + viewStyles.typingIndicatorBubble),
                indicatorList,
                participants;

            if (indicator.length) {
                for (var i = 0; i < this.typingParticipants.length; i += 1) {
                    if (this.typingParticipants[i].id == sender.id) {
                        this.typingParticipants.splice(i, 1);
                    }
                }

                participants = this._composeTypingParticipantsText(this.typingParticipants);

                if (participants === "") {
                    indicator.remove();
                } else {
                    indicatorList = indicator.find(DOT + viewStyles.author).first();
                    indicatorList.text(participants);
                }
            }
        },

        _composeTypingParticipantsText: function(participants) {
            var messages = this.options.messages,
                typingAction = participants.length == 1 ? messages.isTyping : messages.areTyping,
                typingText = "";

            if (participants.length === 0) {
                return typingText;
            }

            typingText = this.typingParticipants.map(function(author) {
                return author.name;
            }).join(', ').replace(/,(?!.*,)/gmi, messages.and.trimRight()) + typingAction;

            return typingText;
        },

        _removeTypingIndicator: function() {
            var indicator = this.element.find(DOT + viewStyles.typingIndicatorBubble);

            if (indicator.length) {
                this.typingParticipants = [];
                indicator.remove();
            }
        },

        _clearSelection: function() {
            var selectedClass = ChatView.styles.selected;

            this.element.find(DOT + selectedClass).removeClass(selectedClass);
        },

        _scrollToBottom: function() {
            this.element.scrollTop(this.element.prop("scrollHeight"));
        }
    });

    extend(true, ChatView, { styles: viewStyles });

})(window.kendo.jQuery);

var __meta__ = {
    id: "chat",
    name: "Chat",
    category: "web",
    description: "The Chat component.",
    depends: [ "core", "draganddrop", "html.button" ]
};

(function($, undefined$1) {

    var kendo = window.kendo;
    var Widget = kendo.ui.Widget;
    var extend = $.extend;
    var DOT = ".";

    var chatStyles = {
        wrapper: "k-chat",
        canvas: "k-chat-canvas",
        viewWrapper: "k-message-list",
        messageBoxWrapper: "k-message-box",
        toolbarBoxWrapper: "k-toolbar-box"
    };

    var Chat = Widget.extend({
        init: function(element, options, events) {
            Widget.fn.init.call(this, element, options);

            if (events) {
                this._events = events;
            }

            this._user();

            this._wrapper();

            this._view();

            if (options && options.toolbar && options.toolbar.buttons) {
                this._toolbar();
            }

            this._messageBox();

            kendo.notify(this);
        },

        events: [
            "typingStart",
            "typingEnd",
            "post",
            "sendMessage",
            "actionClick",
            "toolClick"
        ],

        options: {
            user: {
                name: "User",
                iconUrl: ""
            },
            name: "Chat",
            messages: {
                messageListLabel: "Message list",
                placeholder: "Type a message...",
                toggleButton: "Toggle toolbar",
                sendButton: "Send message"
            },
            toolbar: false
        },

        setOptions: function(options) {
            this._setEvents(options);
            $.extend(true, this.options, options);

            if (this.toolbar && "toolbar" in options) {
                this.toolbar.destroy();
                this.toolbar = null;
            }

            if (this.messageBox) {
                this.messageBox.unbind();
                this.messageBox.destroy();
                this.messageBox = null;
            }

            this._messageBox();

            if ("toolbar" in options) {
                this._resetToolbarButtons(options);
                this._toolbar();
            }
        },

        _resetToolbarButtons: function(options) {
            var toolbarBoxWrapper = this.wrapper.find(DOT + chatStyles.toolbarBoxWrapper);

            if (!toolbarBoxWrapper.is(":visible")) {
                toolbarBoxWrapper.show();
            }

            if (options.toolbar && typeof options.toolbar == "object" && "buttons" in options.toolbar) {
                this.options.toolbar.buttons = options.toolbar.buttons;
            }
        },

        destroy: function() {
            if (this.view) {
                this.view.unbind();
                this.view.destroy();
                this.view = null;
            }

            if (this.messageBox) {
                this.messageBox.unbind();
                this.messageBox.destroy();
                this.messageBox = null;
            }

            if (this.toolbar) {
                this.toolbar.destroy();
                this.toolbar = null;
            }

            Widget.fn.destroy.call(this);
        },

        _user: function() {
            this.options.user.id = kendo.guid();
        },

        getUser: function() {
            return extend(true, {}, this.options.user);
        },

        _wrapper: function() {
            var chatStyles = Chat.styles;
            var options = this.options;
            var height = options.height;
            var width = options.width;
            var uiElements = "<div class='" + chatStyles.viewWrapper + "'></div>" +
                             "<span class='" + chatStyles.messageBoxWrapper + "'></span>";
            var toolbarElement = $(`<div class="${chatStyles.toolbarBoxWrapper}" role="toolbar"></div>`).hide();

            this.wrapper = this.element
                .addClass(chatStyles.wrapper)
                .append(uiElements)
                .append(toolbarElement);

            if (options.toolbar && options.toolbar.buttons && options.toolbar.buttons.length) {
                this.wrapper.find(DOT + chatStyles.toolbarBoxWrapper).show();
            }

            if (height) {
                this.wrapper.height(height);
            }

            if (width) {
                this.wrapper.css("max-width", width);
            }
        },

        _view: function() {
            var that = this;
            var chatStyles = Chat.styles;
            var options = extend(true, {}, this.options);

            var element = this.wrapper.find(DOT + chatStyles.viewWrapper + "");

            this.view = new kendo.chat.ChatView(element, options);

            this.view
                .bind("actionClick", function(args) {
                    that.trigger("actionClick", args);

                    that.postMessage(args.text);
                });
        },

        _messageBox: function() {
            var that = this;
            var chatStyles = Chat.styles;
            var options = extend(true, {}, this.options);
            var element = this.wrapper.find(DOT + chatStyles.messageBoxWrapper + "");

            this.messageBox = new kendo.chat.ChatMessageBox(element, options);

            this.messageBox
                .bind("typingStart", function(args) {
                    that.trigger("typingStart", args);
                })
                .bind("typingEnd", function(args) {
                    that.trigger("typingEnd", args);
                })
                .bind("sendMessage", function(args) {
                    that.trigger("sendMessage", args);

                    that.postMessage(args.text);
                })
                .bind("toggleToolbar", function() {
                    that.toggleToolbar();
                })
                .bind("focusToolbar", function() {
                    if (that.toolbar) {
                        that.toolbar.focus();
                    }
                });
        },

        _toolbar: function() {
            var that = this;
            var chatStyles = Chat.styles;
            var options = extend(true, {}, that.options);
            var element = that.wrapper.find(DOT + chatStyles.toolbarBoxWrapper + "");

            that.options.toolbarId = kendo.guid();
            element.attr("id", that.options.toolbarId);

            if (options.toolbar.scrollable === undefined$1) {
                this.options.toolbar.scrollable = options.toolbar.scrollable = true;
            }

            if (options.toolbar.toggleable === undefined$1) {
                this.options.toolbar.toggleable = options.toolbar.toggleable = false;
            }

            that.toolbar = new kendo.chat.ChatToolBar(element, options);

            that.toolbar.bind("click", function(ev) {
                that.trigger("toolClick", {
                    sender: that,
                    name: ev.name,
                    button: ev.button,
                    messageBox: that.messageBox.input[0],
                    originalEvent: ev.originalEvent
                });
            });
        },

        postMessage: function(message) {
            var postArgs = extend(true, {}, { text: message, type: "message", timestamp: new Date(), from: this.getUser() });

            this.trigger("post", postArgs);

            this.renderMessage(postArgs, postArgs.from);
        },

        // TEST calling View renderMessage
        renderMessage: function(message, sender) {
            this.view.renderMessage(message, sender);
        },

        // TEST calling View renderSuggestedActions
        renderSuggestedActions: function(suggestedActions) {
            this.view.renderSuggestedActions(suggestedActions);
        },

        // TEST calling View renderCard
        renderAttachments: function(options, sender) {
            this.view.renderAttachments(options, sender);
        },

        toggleToolbar: function(skipAnimation) {
            this.toolbar.toggle(skipAnimation);
        },

        renderUserTypingIndicator: function(sender) {
            this.view._renderTypingIndicator(sender);
        },

        clearUserTypingIndicator: function(sender) {
            this.view._removeTypingParticipant(sender);
        },

        removeTypingIndicator: function() {
            this.view._removeTypingIndicator();
        }
    });

    kendo.ui.plugin(Chat);

    extend(true, Chat, { styles: chatStyles });

})(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
