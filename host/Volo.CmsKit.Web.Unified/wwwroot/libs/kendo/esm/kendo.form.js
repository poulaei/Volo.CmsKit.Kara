import './kendo.editable.js';
import './kendo.button.js';

var __meta__ = {
        id: "form",
        name: "Form",
        category: "web",
        description: "The Form widget.",
        depends: [ "editable", "button" ],
        features: [{
            id: "form-dropdowns",
            name: "DropDowns",
            description: "Support for DropDown editors",
            depends: [ "autocomplete", "combobox", "multiselect", "dropdowntree", "multicolumncombobox" ]
        }, {
            id: "form-datepickers",
            name: "DatePickers",
            description: "Support for DatePicker editors",
            depends: [ "dateinput", "datepicker", "datetimepicker", "timepicker" ]
        }, {
            id: "form-inputs",
            name: "Inputs",
            description: "Support for Input editors",
            depends: [ "numerictextbox", "maskedtextbox", "switch", "rating", "slider", "colorpicker", "radiogroup", "checkboxgroup", "textbox", "textarea", "checkbox" ]
        }, {
            id: "form-editor",
            name: "Editor",
            description: "Support for Editor editor",
            depends: [ "editor" ]
        }]
    };

    (function($, undefined$1) {
        var kendo = window.kendo,
            ui = kendo.ui,
            NS = ".kendoForm",
            Widget = ui.Widget,
            extend = $.extend,
            encode = kendo.htmlEncode,
            VALIDATE = "validate",
            VALIDATEFIELD = "validateField",
            VALIDATEINPUT = "validateInput",
            CHANGE = "change",
            CLICK = "click" + NS,
            SUBMIT = "submit",
            CLEAR = "clear",
            MAX_WIDTH = "max-width",
            SET = "set",
            EQUAL_SET = "equalSet",
            GROUP = "group",
            ARIA_DESCRIBEDBY = "aria-describedby",
            DATA_STOP = "data-stop",
            DATA_ROLE = "data-role",
            EDITABLE = "editable",
            FORM = "form",
            DOT = ".",
            DATA_ROLE_RADIO_GROUP = "[data-role='radiogroup']",
            DATA_ROLE_CHECKBOX_GROUP = "[data-role='checkboxgroup']";

        var formStyles = {
            form: "k-form",
            horizontal: "k-form-horizontal",
            vertical: "",
            field: "k-form-field",
            fieldsContainer: "k-form-fields-container",
            fieldWrap: "k-form-field-wrap",
            fieldError: "k-form-field-error",
            fieldHint: "k-form-hint",
            fieldset: "k-form-fieldset",
            layout: "k-form-layout",
            legend: "k-form-legend",
            label: "k-label k-form-label",
            emptyLabel: "k-label-empty",
            optional: "k-label-optional",
            buttonsContainer: "k-form-buttons",
            buttonsEnd: "k-buttons-end",
            submit: "k-form-submit",
            clear: "k-form-clear",
            invalid: "k-invalid",
            hidden: "k-hidden"
        };

        var formOrientation = {
            horizontal: "horizontal",
            vertical: "vertical"
        };

        var Form = Widget.extend({
            init: function(element, options) {
                var that = this;

                Widget.fn.init.call(that, element, options);

                that.options = kendo.deepExtend({}, that.options, options);

                if (options && options.formData) {
                    that.options.formData = options.formData;
                }

                that._wrapper();

                that._setFields();

                that._setModel();

                that._renderContainers();

                if (that.options.renderButtons) {
                    that._renderButtons();
                }

                that._editable();

                that._renderBoolLabels();

                that._renderFieldsHints();

                that._setEvents();

                that._applyCssClasses();
            },

            events: [
                VALIDATEFIELD,
                VALIDATE,
                CHANGE,
                SUBMIT,
                CLEAR
            ],

            options: {
                name: "Form",
                orientation: formOrientation.vertical,
                validatable: {
                    validateOnBlur: true,
                    validationSummary: false,
                    errorTemplate: null
                },
                buttonsTemplate: null,
                messages: {
                    submit: "Submit",
                    clear: "Clear",
                    optional: "(Optional)"
                },
                layout: "",
                grid: {},
                formData: {},
                items: [],
                formatLabel: null,
                focusFirst: false,
                renderButtons: true,
                size: "medium"
            },

            _noLabelfieldTemplate: ({ styles, colSpan, hidden, field })=>
                                    `<div class='${encode(styles.field)} ${colSpan ? `k-colspan-${encode(colSpan)} k-col-span-${encode(colSpan)}` : '' } ${hidden ? encode(styles.hidden) : '' }'>` +
                                        `<span class='${encode(styles.label)} ${encode(styles.emptyLabel)}'></span>` +
                                        `<div class='k-form-field-wrap' data-container-for='${encode(field)}'></div>` +
                                    "</div>",

            _fieldTemplate: ({ styles, colSpan, hidden, field, label, id, optional }) =>
                            `<div class='${encode(styles.field)} ${colSpan ? `k-colspan-${encode(colSpan)} k-col-span-${encode(colSpan)}` : ''} ${hidden ? `${encode(styles.hidden)}` : ''}'>` +
                                ((label && !hidden) ?
                                `<label class='${encode(styles.label)}' for='${encode(id)}' id='${encode(id)}-form-label'>` +
                                    ((typeof label.encoded != 'undefined' && label.encoded === false) ?
                                    label.text || label
                                    : encode(label.text || label)) +
                                    (label.optional ? `<span class='${encode(styles.optional)}'>${encode(optional)}</span>` : '') +
                                "</label>"
                                : '' ) +
                                `<div class='k-form-field-wrap' data-container-for='${encode(field)}'></div>` +
                            "</div>",

            _boolLabelTemplate: ({ styles, colSpan, hidden, field, label, id, optional }) =>
                            `<label class='k-checkbox-label' for='${encode(id)}' id='${encode(id)}-form-label'>` +
                                ((typeof label.encoded != 'undefined' && label.encoded === false) ?
                                label.text || label
                                : encode(label.text || label)) +
                                (label.optional ? `<span class='${encode(styles.optional)}'>${encode(optional)}</span>` : '') +
                            "</label>",

            _groupTemplate: ({ styles, colSpan, label }) =>
                            `<fieldset class='${encode(styles.fieldset)} ${colSpan ? `k-colspan-${encode(colSpan)} k-col-span-${encode(colSpan)}` : ''}'>` +
                                `<legend class='${encode(styles.legend)}'>${encode(label.text || label)}</legend>` +
                            "</fieldset>",

            _errorTemplate: ({ field, message }) => `<span class='k-form-error' id='${field}-form-error'><div>${message}</div></span>`,

            _hintTemplate: ({ id, message }) => `<div class='k-form-hint' id='${id}-form-hint'><span>${message}</span></div>`,

            _wrapper: function() {
                var that = this,
                    options = that.options,
                    formStyles = Form.styles,
                    width = options.width,
                    height = options.height;

                that.wrapper = that.element
                    .addClass(formStyles.form)
                    .addClass(formStyles[options.orientation]);

                if (height) {
                    that.wrapper.height(height);
                }

                if (width) {
                    that.wrapper.css(MAX_WIDTH, width);
                }

                that.layoutWrapper = that._setupLayoutContainer(that.wrapper, {
                    grid: options.grid,
                    layout: options.layout
                });
            },

            _flattenFields: function(fields) {
                var items = [].concat(fields),
                    item = items.shift(),
                    result = [],
                    push = [].push;

                while (item) {
                    if (item.items) {
                        push.apply(items, item.items);
                    } else {
                        push.call(result, item);
                    }

                    item = items.shift();
                }

                return result;
            },

            _defaultLabel: function(fieldName) {
                var that = this,
                    customFormat = that.options.formatLabel;

                if (!fieldName.length) {
                    return;
                }

                if (kendo.isFunction(customFormat)) {
                    return customFormat(fieldName);
                }

                return fieldName.split(/(.*[a-z])(?=[A-Z])/).join(" ").trim() + ":";
            },

            _formatLabel: function(field, label) {
                var that = this,
                    text = $.isPlainObject(label) ? label.text : label;

                if (text !== undefined$1) {
                    return label;
                }

                return that._defaultLabel(field);
            },

            _defaultFields: function() {
                var that = this,
                    options = that.options,
                    formDataFields = Object.keys(options.formData || {}),
                    itemFields = options.items || {},
                    defaultFormDataFields = [],
                    field;

                if (itemFields.length) {
                    return itemFields;
                }

                for (var i = 0; i < formDataFields.length; i += 1) {
                    field = formDataFields[i];

                    defaultFormDataFields.push({
                        field: field,
                        id: field
                    });
                }

                return defaultFormDataFields;
            },

            _setFields: function() {
                var that = this,
                    defaultFields = that._flattenFields(that._defaultFields()),
                    formData = that.options.formData || {},
                    fieldInfo, fieldValue, type, editor, attributes;

                that._fields = [];

                for (var field in defaultFields) {
                    fieldInfo = defaultFields[field];
                    fieldValue = formData[fieldInfo.field];

                    type = typeof fieldInfo.editor === "string" ? fieldInfo.editor :
                        kendo.type(fieldValue ? kendo.parseDate(fieldValue.toString()) || fieldValue : fieldValue);

                    editor = kendo.isFunction(fieldInfo.editor) ? fieldInfo.editor :
                         ui.Editable.fn.options.editors[type] ? "" : fieldInfo.editor;

                    if (!that._isHidden(fieldInfo.editor)) {
                        if (fieldInfo.label) {
                            attributes = {
                                "aria-labelledby": fieldInfo.id || fieldInfo.field + "-form-label"
                            };
                        } else if (!fieldInfo.attributes || !fieldInfo.attributes["aria-label"]) {
                            attributes = {
                                "aria-label": fieldInfo.name || fieldInfo.field
                            };
                        }
                    }

                    fieldInfo = extend(true, {
                        label: fieldInfo.label || fieldInfo.name || fieldInfo.field,
                        optionalText: that.options.messages.optional
                    }, fieldInfo, {
                        id: fieldInfo.id || fieldInfo.field,
                        name: fieldInfo.name || fieldInfo.field,
                        type: type,
                        editor: editor,
                        attributes: attributes,
                        isHidden: that._isHidden(fieldInfo.editor) || that._isAntiForgeryToken(fieldInfo.name || fieldInfo.field)
                    });

                    that._fields[field] = fieldInfo;
                }
            },

            _setModel: function() {
                var that = this,
                    options = that.options,
                    formData = options.formData || {};

                if (options.formData instanceof kendo.data.ObservableObject) {
                    that._model = formData;
                    return;
                }

                var MyModel = kendo.data.Model.define({ fields: that._fields });

                that._model = new MyModel(formData);
            },

            _editable: function() {
                var that = this,
                    options = that.options,
                    validatorOptions = that.options.validatable;

                that._addEditableMvvmAttributes();

                that.editable = that.wrapper.kendoEditable({
                    model: that._model,
                    fields: that._fields || [],
                    validateOnBlur: validatorOptions.validateOnBlur,
                    validationSummary: validatorOptions.validationSummary,
                    errorTemplate: validatorOptions.errorTemplate || that._errorTemplate,
                    clearContainer: false,
                    skipFocus: !options.focusFirst,
                    target: that,
                    size: options.size
                }).getKendoEditable();

                that.validator = that.editable.validatable;

                that._removeEditableMvvmAttributes();
            },

            _addEditableMvvmAttributes: function() {
                // required for two mvvm bindable widgets on one element
                this.wrapper.attr(DATA_ROLE, EDITABLE);
            },

            _removeEditableMvvmAttributes: function() {
                // required for two mvvm bindable widgets on one element
                this.wrapper
                    .attr(DATA_STOP, true)
                    .attr(DATA_ROLE, FORM);
            },

            _getItemTemplate: function(type) {
                var that = this,
                    template;

                if (type === GROUP) {
                    template = that._groupTemplate;
                } else {
                    template = that._fieldTemplate;
                }

                return template;
            },

            _isHidden: function(editor) {
                return typeof editor === "string" && editor === "hidden";
            },

            _isAntiForgeryToken: function(field) {
                return field === ui.Editable.antiForgeryTokenName;

            },

            _renderField: function(item) {
                var that = this,
                    formStyles = Form.styles,
                    isHorizontal = that.options.orientation === formOrientation.horizontal,
                    fieldType = that._model.fields && that._model.fields[item.field] && that._model.fields[item.field].type,
                    isBoolField = fieldType && fieldType === "boolean",
                    fieldTemplate, renderedField;

                if (isBoolField && isHorizontal && !item.editor) {
                    fieldTemplate = that._noLabelfieldTemplate;
                } else {
                    fieldTemplate = that._fieldTemplate;
                }

                renderedField = (kendo.template(fieldTemplate)({
                    styles: formStyles,
                    id: item.id || item.field || "",
                    field: item.field || "",
                    label: isBoolField && !item.editor ? null : that._formatLabel(item.field, item.label),
                    colSpan: item.colSpan || "",
                    optional: that.options.messages.optional,
                    hidden: that._isHidden(item.editor) || that._isAntiForgeryToken(item.field)
                }));

                return renderedField;
            },

            _toggleFieldErrorState: function(element, state) {
                var field = element.closest(DOT + formStyles.field);

                if (field.length) {
                    field.toggleClass(formStyles.fieldError, state);
                }
            },

            _renderBoolLabels: function() {
                var that = this,
                    formStyles = Form.styles,
                    fields = that._fields,
                    field, fieldElement;

                for (var i = 0; i < fields.length; i += 1) {
                    field = fields[i];
                    fieldElement = that.wrapper.find("[name='" + field.name + "']:not([type='hidden'])");

                    if (!fieldElement || !field.label || field.isHidden || field.type !== "boolean" || field.editor) {
                        continue;
                    }

                    fieldElement.parent().after(kendo.template(that._boolLabelTemplate)({
                        styles: formStyles,
                        id: field.id || field.field || "",
                        optional: that.options.messages.optional,
                        label: that._formatLabel(field.field, field.label)
                    }));
                }
            },

            _renderFieldsHints: function() {
                var that = this,
                    fields = that._fields,
                    field, fieldWidgetInstance, fieldElement, nextLabelElement, hint;

                for (var i = 0; i < fields.length; i += 1) {
                    field = fields[i];
                    fieldElement = that.wrapper.find(`[name='${field.name}'],[id='${field.name}']`);

                    if (!fieldElement || !field.hint || field.isHidden) {
                        continue;
                    }

                    hint = $(kendo.template(that._hintTemplate)({ message: field.hint || "", id: field.id }));

                    that._associateHintContainer(fieldElement, hint.attr("id"));

                    fieldWidgetInstance = kendo.widgetInstance(fieldElement);

                    if (fieldWidgetInstance) {
                        nextLabelElement = fieldWidgetInstance.element.next("label[for='" + fieldWidgetInstance.element.attr("id") + "']");
                        fieldElement = nextLabelElement.length ? nextLabelElement : fieldWidgetInstance.wrapper;
                    }

                    if (that.validator._errorsByName(field.name).length) {
                        hint.toggleClass(formStyles.hidden);
                        kendo.removeAttribute(fieldElement, ARIA_DESCRIBEDBY, hint.attr("id"));
                    }

                    hint.insertAfter(fieldElement);
                }
            },

            _associateHintContainer: function(input, hintId) {
                var nextFocusable = kendo.getWidgetFocusableElement(input);

                if (!nextFocusable || !hintId) {
                    return;
                }

                kendo.toggleAttribute(nextFocusable, ARIA_DESCRIBEDBY, hintId);
            },

            _toggleHint: function(element, state) {
                var that = this,
                    field = element.closest(DOT + formStyles.field),
                    hint;

                if (field.length) {
                    hint = field.find(DOT + formStyles.fieldHint);

                    if (hint.length) {
                        hint.toggleClass(formStyles.hidden, state);
                        that._associateHintContainer(element, hint.attr("id"));
                    }
                }
            },

            _renderGroup: function(item) {
                var that = this,
                    type = item.type,
                    child, renderedGroup, fieldsContainer;

                fieldsContainer = renderedGroup = $(kendo.template(that._getItemTemplate(type))({
                    styles: formStyles,
                    label: item.label || "",
                    colSpan: item.colSpan
                }));

                fieldsContainer = that._setupLayoutContainer(renderedGroup, {
                    grid: item.grid,
                    layout: item.layout
                }) || renderedGroup;

                for (var i = 0; i < item.items.length; i += 1) {
                    child = item.items[i];
                    fieldsContainer.append(that._renderField(child));
                }

                return renderedGroup;
            },

            _renderContainers: function() {
                var that = this,
                    defaultFields = that._defaultFields(),
                    columnsLayout = that.options.layout === "grid",
                    targetContainer = columnsLayout ? that.layoutWrapper : that.wrapper,
                    item, type, container;

                for (var i = 0; i < defaultFields.length; i += 1) {
                    item = defaultFields[i];
                    type = item.type;

                    if (type === GROUP) {
                        container = that._renderGroup(item);
                    } else {
                        container = that._renderField(item);
                    }

                    targetContainer.append(container);
                }
            },

            _buttonsTemplate: function() {
                var options = this.options,
                    messages = options.messages,
                    formStyles = Form.styles,
                    buttons, submit, clear;

                if (options.buttonsTemplate !== null) {
                    buttons = kendo.template(options.buttonsTemplate)({
                        styles: formStyles,
                        messages: messages
                    });
                } else {
                    submit = $("<button class='" + formStyles.submit + "'>" + encode(messages.submit) + "</button>").kendoButton({
                        type: "submit",
                        themeColor: "primary",
                        size: options.size
                    });
                    clear = $("<button class='" + formStyles.clear + "'>" + encode(messages.clear) + "</button>").kendoButton({
                        size: options.size
                    });

                    buttons = submit.add(clear);
                }

                return buttons;
            },

            _renderButtons: function() {
                var that = this,
                    wrapper = that.wrapper,
                    options = that.options,
                    formStyles = Form.styles,
                    isHorizontal = options.orientation === formOrientation.horizontal,
                    buttonsContainer = wrapper.find(DOT + formStyles.buttonsContainer),
                    buttons;

                if (!buttonsContainer.length) {
                    buttonsContainer = $("<div />")
                        .addClass(formStyles.buttonsContainer)
                        .addClass(isHorizontal ? formStyles.buttonsEnd : "");
                }

                buttons = that._buttonsTemplate();

                buttonsContainer.append(buttons);

                that.element.append(buttonsContainer);
            },

            _setupLayoutContainer: function(appendTarget, options) {
                var layout = options.layout,
                    grid = options.grid,
                    layoutClassNames = [],
                    layoutContainer, rowsGap, colsGap;

                if (typeof layout === "string" && layout !== "") {
                    layoutContainer = $("<div></div>")
                        .appendTo(appendTarget)
                        .addClass(formStyles.layout);

                    layoutClassNames.push("k-d-" + layout);
                }

                if (layout === "grid" && typeof grid === "object") {
                    if (typeof grid.cols === "number") {
                        layoutClassNames.push("k-grid-cols-" + grid.cols);
                    } else if (typeof grid.cols === "string") {
                        layoutContainer.css("grid-template-columns", grid.cols);
                    }

                    if (typeof grid.gutter === "number" || typeof grid.gutter === "string") {
                        layoutContainer.css("grid-gap", grid.gutter);
                    } else if ($.isPlainObject(grid.gutter)) {
                        rowsGap = grid.gutter.rows;
                        colsGap = grid.gutter.cols;

                        if (typeof rowsGap === "number") {
                            rowsGap = rowsGap + "px";
                        }
                        if (typeof colsGap === "number") {
                            colsGap = colsGap + "px";
                        }

                        layoutContainer.css("grid-gap", rowsGap + " " + colsGap);
                    }
                }

                if (layoutContainer) {
                    layoutContainer.addClass(layoutClassNames.join(" "));
                }

                return layoutContainer;
            },

            _setEvents: function() {
                var that = this,
                    validator = that.validator;

                validator
                    .bind(VALIDATEINPUT, that._validateField.bind(that))
                    .bind(VALIDATE, that._validate.bind(that));

                that.wrapper
                    .on(SUBMIT + NS, that._submit.bind(that))
                    .on(CLEAR + NS, that._clear.bind(that))
                    .on(CLICK + NS, DOT + formStyles.clear, that._clear.bind(that));

                if (!that._changeHandler) {
                    that._changeHandler = that._change.bind(that);
                }

                that._model.bind(CHANGE, that._changeHandler);
            },

            _validateField: function(ev) {
                var that = this,
                    data = {
                        model: that._model.toJSON(),
                        valid: ev.valid,
                        field: ev.field,
                        error: ev.error,
                        input: ev.input
                    };

                that._toggleFieldErrorState(data.input, !data.valid);

                that._toggleHint(data.input, !data.valid);

                if (that.trigger(VALIDATEFIELD, data)) {
                    ev.preventDefault();
                }
            },

            _validate: function(ev) {
                var that = this,
                    data = {
                        model: that._model.toJSON(),
                        valid: ev.valid,
                        errors: ev.errors
                    };

                that.trigger(VALIDATE, data);
            },

            _change: function(ev) {
                var that = this,
                    field = ev.field,
                    data = {
                        field: field,
                        value: that._model[field]
                    };

                that.trigger(CHANGE, data);
            },

            _submit: function(ev) {
                var that = this,
                    jsonModel = that._model.toJSON();

                if (that.trigger(SUBMIT, { model: jsonModel })) {
                    ev.preventDefault();
                }
            },

            _clear: function(ev) {
                var that = this;

                ev.preventDefault();

                that.clear();

                that.trigger(CLEAR);
            },

            validate: function() {
                var that = this,
                    validator = that.validator;

                if (!validator) {
                    return;
                }

                return validator.validate();
            },

            clear: function() {
                var that = this,
                    fields = that._fields,
                    model = that._model,
                    editable = that.editable,
                    validateOnBlur = that.validator.options.validateOnBlur;

                that.validator.reset();

                if (validateOnBlur) {
                    model
                        .unbind(SET)
                        .unbind(EQUAL_SET);
                }

                for (var i = 0; i < fields.length; i += 1) {
                    var field = fields[i].field;
                    var element = that.wrapper.find("[name='" + field + "']");
                    var widgetInstance = kendo.widgetInstance(element);
                    var isHiddenInput = element.is("input[type=hidden]");

                    if (!element.is(DATA_ROLE_CHECKBOX_GROUP) && !element.is(DATA_ROLE_RADIO_GROUP) && !isHiddenInput) {
                        element.val("");
                    }

                    if (!widgetInstance && element.hasClass("k-hidden")) {
                        widgetInstance = kendo.widgetInstance(element.closest(".k-signature"));
                    }

                    if (widgetInstance) {
                        if (kendo.ui.Upload && widgetInstance instanceof kendo.ui.Upload) {
                            widgetInstance.clearAllFiles();
                        } else {
                            widgetInstance.value(null);
                        }
                    }

                    that._toggleHint(element, false);

                    if (typeof model[field] === "boolean") {
                        element.val("false");
                        model.set(field, false);
                    } else if (!isHiddenInput) {
                        model.set(field, null);
                    }
                }

                that.wrapper.find(DOT + formStyles.fieldError)
                    .removeClass(formStyles.fieldError);

                if (validateOnBlur) {
                    model
                        .bind(SET, editable._validateProxy)
                        .bind(EQUAL_SET, editable._validateProxy);
                }
            },

            setOptions: function(newOptions) {
                var that = this;

                that.destroy();

                that.wrapper
                    .removeClass(formStyles.horizontal)
                    .removeAttr(DATA_STOP)
                    .empty();

                that.init(that.element, newOptions);
            },

            destroy: function() {
                var that = this;

                that.wrapper.off(NS);

                if (that._model) {
                    that._model.unbind(CHANGE, that._changeHandler);
                    that._changeHandler = null;
                }

                Widget.fn.destroy.call(that.editable);

                Widget.fn.destroy.call(that);

                if (that.editable) {
                    that.editable.destroy();
                    that.editable = null;
                }
            }
        });

        kendo.cssProperties.registerPrefix("Form", "k-form-");

        ui.plugin(Form);

        extend(true, Form, { styles: formStyles });

  })(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
