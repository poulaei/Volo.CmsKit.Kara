require('./kendo.core.js');
require('./kendo.floatinglabel.js');

let $ = kendo.jQuery;

function addInputPrefixSuffixContainers({ widget, wrapper, options, prefixInsertBefore, suffixInsertAfter }) {
    var prefix = options.prefixOptions,
        suffix = options.suffixOptions,
        hasPrefixContent = prefix.template || prefix.icon,
        hasSuffixContent = suffix.template || suffix.icon,
        suffixInsertAfter = suffixInsertAfter || prefixInsertBefore,
        layoutFlow = options.layoutFlow,
        containerOrientation = layoutFlow ? (layoutFlow == "vertical" ? "horizontal" : "vertical") : "horizontal",
        separatorOrientation = layoutFlow == "vertical" ? "horizontal" : "vertical",
        INPUT_SEPARATOR = `<span class="k-input-separator k-input-separator-${separatorOrientation}"></span>`,
        prefixContainer,
        suffixContainer;

    if (prefix && hasPrefixContent) {
        prefixContainer = wrapper.children(".k-input-prefix");

        if (!prefixContainer[0]) {
            prefixContainer = $(`<span class="k-input-prefix k-input-prefix-${containerOrientation}" />`);
            if (prefixInsertBefore) {
                prefixContainer.insertBefore(prefixInsertBefore);
            } else {
                prefixContainer.prependTo(wrapper);
            }
        }

        if (prefix.icon) {
            prefixContainer.html(kendo.html.renderIcon({ icon: prefix.icon }));
        }

        if (prefix.template) {
            prefixContainer.html(kendo.template(prefix.template)({}));
        }

        if (prefix.separator) {
            $(INPUT_SEPARATOR).insertAfter(prefixContainer);
        }
    }

    if (suffix && hasSuffixContent) {
        suffixContainer = wrapper.children(".k-input-suffix");

        if (!suffixContainer[0]) {
            suffixContainer = $(`<span class="k-input-suffix k-input-suffix-${containerOrientation}" />`).appendTo(wrapper);
            if (suffixInsertAfter) {
                suffixContainer.insertAfter(suffixInsertAfter);
            } else {
                suffixContainer.appendTo(wrapper);
            }
        }

        if (suffix.icon) {
            suffixContainer.html(kendo.html.renderIcon({ icon: suffix.icon }));
        }

        if (suffix.template) {
            suffixContainer.html(kendo.template(suffix.template)({}));
        }

        if (suffix.separator) {
            $(INPUT_SEPARATOR).insertBefore(suffixContainer);
        }
    }

    widget._prefixContainer = prefixContainer;
    widget._suffixContainer = suffixContainer;
}

var __meta__ = {
    id: "textarea",
    name: "TextArea",
    category: "web",
    description: "The TextArea widget represents a multi-line plain-text editing control which enables you to style and provide a floating label functionality to textarea elements",
    depends: ["core", "floatinglabel"]
};

(function($, undefined$1) {
    var kendo = window.kendo,
        Widget = kendo.ui.Widget,
        ui = kendo.ui,
        isPlainObject = $.isPlainObject,
        NS = ".kendoTextArea",
        CHANGE = "change",
        DISABLED = "disabled",
        READONLY = "readonly",
        INPUT = "k-input-inner",
        FOCUSED = "k-focus",
        LABELCLASSES = "k-label k-input-label",
        FLOATINGLABELCLASS = "k-floating-label",
        STATEDISABLED = "k-disabled",
        STATEREADONLY = "k-readonly",
        ARIA_DISABLED = "aria-disabled",
        TEXTAREACONTAINER = "k-textarea-container";

    var TextArea = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);
            options = $.extend(true, {}, options);

            that.options.value = options.value || that.element.val();
            that.options.readonly = options.readonly !== undefined$1 ? options.readonly : Boolean(that.element.attr("readonly"));
            that.options.enable = options.enable !== undefined$1 ? options.enable : !(Boolean(that.element.attr("disabled")));
            that.options.placeholder = options.placeholder || that.element.attr("placeholder");

            if (!that.options.value.replace(/\s/g, '').length) {
                that.options.value = '';
                that.element.val('');
            }

            that.value(that.options.value);
            that._wrapper();
            that._label();
            that._editable({
                readonly: that.options.readonly,
                disable: !(that.options.enable)
            });
            that._applyAttributes();
            that._applyCssClasses();
            that.element
                .addClass(INPUT)
                .attr("autocomplete", "off");

            addInputPrefixSuffixContainers({ widget: that, wrapper: that.wrapper, options: that.options });
            if (that.floatingLabel) {
                that.floatingLabel.refresh();
            }

            kendo.notify(that);
        },

        events: [
            CHANGE
        ],

        attributes: [
            "maxLength",
            "rows",
            "placeholder"
        ],

        options: {
            name: 'TextArea',
            value: '',
            readonly: false,
            enable: true,
            placeholder: '',
            label: null,
            resizable: "none",
            maxLength: null,
            cols: 20,
            rows: 1,
            rounded: "medium",
            size: "medium",
            fillMode: "solid",
            resize: "none",
            overflow: "auto",
            layoutFlow: "vertical",
            prefixOptions: {
                separator: true
            },
            suffixOptions: {
                separator: true
            }
        },

        _applyCssClasses: function(action) {
            var that = this,
                options = that.options,
                resize = kendo.cssProperties.getValidClass({
                    widget: options.name,
                    propName: "resize",
                    value: options.resize
                }),
                overflow = kendo.cssProperties.getValidClass({
                    widget: options.name,
                    propName: "overflow",
                    value: options.overflow
                }),
                layoutFlow = kendo.cssProperties.getValidClass({
                    widget: options.name,
                    propName: "layoutFlow",
                    value: options.layoutFlow
                });

            Widget.fn._applyCssClasses.call(that);

            if (!resize && options.resize === "none") {
                resize = "k-resize-none";
            }

            if (overflow) {
                overflow = "!" + overflow;
            }

            action = action || "addClass";

            that.element[action](resize);
            that.element[action](overflow);
            that.wrapper[action](layoutFlow);
            if (options.layoutFlow == "vertical") {
                that.element[action]("!k-flex-none");
            }
        },

        _applyAttributes: function() {
            var that = this;
            var property;
            var attributes = {};

            for (property in that.attributes) {
                attributes[that.attributes[property]] = that.options[that.attributes[property]];
            }

            that.element.attr(attributes);
        },

        value: function(value) {
            var that = this;

            if (value === undefined$1) {
                return that._value;
            }

            that._value = value;
            that.element.val(value);
        },

        readonly: function(readonly) {
            var that = this;

            this._editable({
                readonly: readonly === undefined$1 ? true : readonly,
                disable: false
            });

            if (that.floatingLabel) {
                that.floatingLabel.readonly(readonly === undefined$1 ? true : readonly);
            }
        },

        enable: function(enable) {
            var that = this;

            this._editable({
                readonly: false,
                disable: !(enable = enable === undefined$1 ? true : enable)
            });

            if (that.floatingLabel) {
                that.floatingLabel.enable(enable = enable === undefined$1 ? true : enable);
            }
        },

        focus: function() {
            var that = this;

            that.element[0].focus();
        },

        destroy: function() {
            var that = this;

            if (that.floatingLabel) {
                that.floatingLabel.destroy();
            }

            that.element.off(NS);
            Widget.fn.destroy.call(that);
        },

        setOptions: function(options) {
            var that = this;
            that._applyCssClasses("removeClass");
            Widget.fn.setOptions.call(that, options);
        },

        _editable: function(options) {
            var that = this;
            var element = that.element;
            var wrapper = that.wrapper;
            var disable = options.disable;
            var readonly = options.readonly;

            element.off(NS);

            if (!readonly && !disable) {
                element.prop(DISABLED, false)
                       .prop(READONLY, false)
                       .attr(ARIA_DISABLED, false);

                wrapper.removeClass(STATEDISABLED)
                        .removeClass(STATEREADONLY);

                element.on("focusin" + NS, that._focusin.bind(that));
                element.on("focusout" + NS, that._focusout.bind(that));
            } else {
                element.attr(DISABLED, disable)
                       .attr(READONLY, readonly)
                       .attr(ARIA_DISABLED, disable);

                wrapper.toggleClass(STATEDISABLED, disable)
                        .toggleClass(STATEREADONLY, readonly);
            }
        },

        _label: function() {
            var that = this;
            var element = that.element;
            var options = that.options;
            var id = element.attr("id");
            var floating;
            var labelText;

            if (options.label !== null) {
                floating = isPlainObject(options.label) ? options.label.floating : false;
                labelText = isPlainObject(options.label) ? options.label.content : options.label;

                if (floating) {
                    that._floatingLabelContainer = that.wrapper.wrap("<span></span>").parent();
                    that.floatingLabel = new kendo.ui.FloatingLabel(that._floatingLabelContainer, { widget: that });
                    that._floatingLabelContainer.addClass(TEXTAREACONTAINER);
                }

                if (kendo.isFunction(labelText)) {
                    labelText = labelText.call(that);
                }

                if (!labelText) {
                    labelText = "";
                }

                if (!id) {
                    id = options.name + "_" + kendo.guid();
                    element.attr("id", id);
                }

                that._inputLabel = $("<label class='" + (floating ? FLOATINGLABELCLASS : LABELCLASSES) + "' for='" + id + "'>" + labelText + "</label>'")[floating ? "insertAfter" : "insertBefore"](that.wrapper);
            }
        },

        _focusin: function() {
            var that = this;

            that.wrapper.addClass(FOCUSED);
        },

        _focusout: function() {
            var that = this;
            var value = that._value;
            var newValue = that.element.val();

            that.wrapper.removeClass(FOCUSED);

            if (value === null) {
                value = "";
            }

            if (value !== newValue) {
                that._value = newValue;

                that.trigger(CHANGE);
            }
        },

        _wrapper: function() {
            var that = this;
            var element = that.element;
            var DOMElement = element[0];
            var wrapper;

            wrapper = element.wrap("<span class='k-input k-textarea'></span>").parent();
            wrapper[0].style.cssText = DOMElement.style.cssText;
            DOMElement.style.width = "";

            that.wrapper = wrapper.addClass(DOMElement.className).removeClass('input-validation-error');
        }
    });

    kendo.cssProperties.registerPrefix("TextArea", "k-input-");

    kendo.cssProperties.registerValues("TextArea", [{
        prop: "rounded",
        values: kendo.cssProperties.roundedValues.concat([['full', 'full']])
    }]);

    ui.plugin(TextArea);
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
