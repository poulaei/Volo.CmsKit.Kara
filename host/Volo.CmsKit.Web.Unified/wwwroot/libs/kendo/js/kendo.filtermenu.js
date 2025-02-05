require('./kendo.datepicker.js');
require('./kendo.numerictextbox.js');
require('./kendo.dropdownlist.js');
require('./kendo.buttongroup.js');
require('./kendo.binder.js');
require('./kendo.html.button.js');
require('./kendo.icons.js');

var __meta__ = {
    id: "filtermenu",
    name: "Filtering Menu",
    category: "framework",
    depends: [ "datepicker", "numerictextbox", "dropdownlist", "buttongroup", "binder", "html.button", "icons" ],
    advanced: true
};


(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui,
        support = kendo.support,
        encode = kendo.htmlEncode,
        AUTOCOMPLETEVALUE = support.browser.chrome ? "disabled" : "off",
        POPUP = "kendoPopup",
        INIT = "init",
        OPEN = "open",
        REFRESH = "refresh",
        CHANGE = "change",
        NS = ".kendoFilterMenu",
        COLUMN_HEADER_SELECTOR = ".k-table-th",
        EQ = "Is equal to",
        NEQ = "Is not equal to",
        roles = {
            "number": "numerictextbox",
            "date": "datepicker"
        },
        mobileRoles = {
            "string": "text",
            "number": "number",
            "date": "date"
        },
        isFunction = kendo.isFunction,
        Widget = ui.Widget;

    var actionsFilterButtonsContainer = ({ actionsCssClass, messages }) =>
    `<div class="k-actions-stretched ${actionsCssClass ? actionsCssClass : "k-actions"}">` +
        kendo.html.renderButton(`<button title="${messages.filter}">${encode(messages.filter)}</button>`, { type: "submit", themeColor: "primary", icon: "filter" }) +
        kendo.html.renderButton(`<button title="${messages.clear}">${encode(messages.clear)}</button>`, { type: "reset", icon: "filter-clear" }) +
    '</div>';
    var booleanTemplate = ({ field, format, ns, messages, extra, operators, type, role, values, componentType }) =>
        '<div class="k-filter-menu-container">' +
            `<div class="k-filter-help-text">${encode(messages.info)}</div>` +
            '<label>' +
                `<input type="radio" data-${ns}bind="checked: filters[0].value" value="true" name="filters[0].value"/>` +
                `${encode(messages.isTrue)}` +
            '</label>' +
            '<label>' +
                `<input type="radio" data-${ns}bind="checked: filters[0].value" value="false" name="filters[0].value"/>` +
                `${encode(messages.isFalse)}` +
            '</label>' +
            actionsFilterButtonsContainer({ messages }) +
        '</div>';

    var modernBooleanTemplate = ({ field, format, ns, messages, extra, operators, type, role, values, componentType }) => {
        var inputIdForTrue = kendo.guid(), inputIdForFalse = kendo.guid();
        return '<div class="k-filter-menu-container">' +
            '<div>' +
                '<ul class="k-radio-list k-reset">' +
                    '<li>' +
                        `<input type="radio" class="k-radio k-radio-md" id="${inputIdForTrue}" data-${ns}bind="checked: filters[0].value" value="true" name="filters[0].value" />` +
                        `<label class="k-radio-label" for="${inputIdForTrue}">${encode(messages.isTrue)}</label>` +
                    '</li>' +
                    '<li>' +
                        `<input type="radio" class="k-radio k-radio-md" id="${inputIdForFalse}" data-${ns}bind="checked: filters[0].value" value="false" name="filters[0].value" />` +
                        `<label class="k-radio-label" for="${inputIdForFalse}">${encode(messages.isFalse)}</label>` +
                    '</li>' +
                '</ul>' +
                actionsFilterButtonsContainer({ actionsCssClass: "k-columnmenu-actions", messages }) +
            '</div>' +
        '</div>';
    };

    var customBooleanTemplate = ({ field, format, ns, messages, extra, operators, type, role, values, componentType }) =>
        '<div class="k-filter-menu-container">' +
            `<div class="k-filter-help-text">${encode(messages.info)}</div>` +
            '<label>' +
                `<span class="k-textbox k-input k-input-md k-rounded-md k-input-solid"><input class="k-input-inner" data-${ns}bind="value: filters[0].value" name="filters[0].value"/></span>` +
            '</label>' +
            actionsFilterButtonsContainer({ messages }) +
        '</div>';

    var defaultTemplate = ({ field, format, ns, messages, extra, operators, type, role, values, componentType }) =>
        '<div class="k-filter-menu-container">' +
            (componentType === "classic" ?
                `<div class="k-filter-help-text">${encode(messages.info)}</div>`
            : '') +
            `<select title="${messages.operator}" data-${ns}bind="value: filters[0].operator" data-${ns}role="dropdownlist">` +
                `${Object.keys(operators || {}).map((op) =>
                    `<option value="${op}">${operators[op]}</option>`
                )}` +
            '</select>' +
            (values ?
            `<select title="${messages.value}" data-${ns}bind="value:filters[0].value" data-${ns}text-field="text" data-${ns}value-field="value" data-${ns}source='${kendo.stringify(values).replace(/\'/g,"&#39;")}' data-${ns}role="dropdownlist" data-${ns}option-label="${messages.selectValue}" data-${ns}value-primitive="true">` +
            '</select>'
            :
            `<input title="${messages.value}" data-${ns}bind="value:filters[0].value" class="k-input-inner" type="text" ${role ? `data-${ns}role="${role}"` : ""} />`
            ) +
            (extra ?
                (componentType === "modern" ?
                `<ul data-${ns}role="buttongroup" data-bind="events: { select: onLogicChange }">` +
                    `<li data-${ns}value="and">And</li>` +
                    `<li data-${ns}value="or">Or</li>` +
                '</ul>'
                :
                `<select title="${messages.logic}" class="k-filter-and" data-${ns}bind="value: logic" data-${ns}role="dropdownlist">` +
                    `<option value="and">${encode(messages.and)}</option>` +
                    `<option value="or">${encode(messages.or)}</option>` +
                '</select>'
                ) +
                `<select title="${messages.additionalOperator}" data-${ns}bind="value: filters[1].operator" data-${ns}role="dropdownlist">` +
                    `${Object.keys(operators || {}).map((op) =>
                        `<option value="${op}">${encode(operators[op])}</option>`
                    )}` +
                '</select>' +
                (values ?
                `<select title="${messages.additionalValue}" data-${ns}bind="value:filters[1].value" data-${ns}text-field="text" data-${ns}value-field="value" data-${ns}source='${kendo.stringify(values).replace(/\'/g,"&#39;")}' data-${ns}role="dropdownlist" data-${ns}option-label="${messages.selectValue}" data-${ns}value-primitive="true">` +
                '</select>'
                :
                `<input title="${messages.additionalValue}" data-${ns}bind="value: filters[1].value" class="k-input-inner" type="text" ${role ? `data-${ns}role="${role}"` : ""}/>`
                )
            : '') +
            actionsFilterButtonsContainer({ messages }) +
        '</div>';

    var defaultMobileTemplate = ({ field, title, format, ns, messages, extra, operators, filterMenuGuid, type, role, inputType, values }) =>
        `<div data-${ns}role="view" class="k-grid-filter-menu">` +
            `<div data-${ns}role="header" class="k-header">` +
                `<a href="#" class="k-header-cancel k-link" title="${messages.cancel}" ` +
                `aria-label="${messages.cancel}">${kendo.ui.icon("chevron-left")}</a>` +
                `${encode(messages.filter)} ${encode(messages.into)} ${encode(title)}` +
                `<a href="#" class="k-header-done k-link" title="${messages.done}" ` +
                `aria-label="${messages.done}">${kendo.ui.icon("check")}</a>` +
            '</div>' +
            `<form title="${messages.title}" class="k-filter-menu">` +
                '<ul class="k-reset">' +
                    '<li>' +
                        `<span class="k-list-title k-filter-help-text">${encode(messages.info)}</span>` +
                        '<ul class="k-listgroup k-listgroup-flush">' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-filter-operator-text">${messages.operator}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        `<select id="operator_${filterMenuGuid}" title="${messages.operator}" class="k-filter-operator" data-${ns}bind="value: filters[0].operator" autocomplete="${AUTOCOMPLETEVALUE}" >` +
                                            `${Object.keys(operators || {}).map((op) =>
                                                `<option value="${op}">${encode(operators[op])}</option>`
                                            )}` +
                                        '</select>' +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-filter-input-text">${messages.value}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        (values ?
                                        `<select id="value_${filterMenuGuid}" title="${messages.value}" data-${ns}bind="value:filters[0].value" autocomplete="${AUTOCOMPLETEVALUE}" >` +
                                            `<option value="">${messages.selectValue}</option>` +
                                            `${Object.keys(values || {}).map((val) =>
                                                `<option value="${values[val].value}">${encode(values[val].text)}</option>`
                                            )}` +
                                        '</select>'
                                        :
                                        `<input id="value_${filterMenuGuid}" title="${messages.value}" data-${ns}bind="value:filters[0].value" class="k-value-input" type="${inputType}" autocomplete="${AUTOCOMPLETEVALUE}" />`
                                        ) +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                        '</ul>' +
                        (extra ?
                        '<ul class="k-listgroup k-listgroup-flush">' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-filter-logic-and-text">${messages.and}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        `<input id="and_${filterMenuGuid}" title="${messages.and}" type="radio" name="logic"data-${ns}bind="checked: logic" value="and" autocomplete="${AUTOCOMPLETEVALUE}" />` +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-filter-logic-or-text">${messages.or}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        `<input id="or_${filterMenuGuid}" title="${messages.or}" type="radio" name="logic" data-${ns}bind="checked: logic" value="or" autocomplete="${AUTOCOMPLETEVALUE}" />` +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                        '</ul>' +
                        '<ul class="k-listgroup k-listgroup-flush">' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-filter-operator-text">${messages.additionalOperator}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        `<select id="additionalOperator_${filterMenuGuid}" title="${messages.additionalOperator}" class="k-filter-operator" data-${ns}bind="value: filters[1].operator" autocomplete="${AUTOCOMPLETEVALUE}" >` +
                                            `${Object.keys(operators || {}).map((op) =>
                                                `<option value="${op}">${operators[op]}</option>`
                                            )}` +
                                        '</select>' +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-filter-input-text">${messages.additionalValue}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        (values ?
                                        `<select id="additionalValue_${filterMenuGuid}" title="${messages.additionalValue}" data-${ns}bind="value:filters[1].value" autocomplete="${AUTOCOMPLETEVALUE}" >` +
                                            `<option value="">${messages.selectValue}</option>` +
                                            `${Object.keys(values || {}).map((val) =>
                                                `<option value="${values[val].value}">${encode(values[val].text)}</option>`
                                            )}` +
                                        '</select>'
                                        :
                                        `<input id="additionalValue_${filterMenuGuid}" title="${messages.additionalValue}" data-${ns}bind="value:filters[1].value" class="k-value-input" type="${inputType}" autocomplete="${AUTOCOMPLETEVALUE}" />`
                                        ) +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                        '</ul>'
                        : '') +
                    '</li>' +
                    '<li class="k-item k-clear-wrap">' +
                        '<span class="k-list-title">&nbsp;</span>' +
                        '<ul class="k-listgroup k-listgroup-flush">' +
                            '<li class="k-listgroup-item">' +
                                `<span class="k-link k-label k-clear" title="${messages.clear}" aria-label="${messages.clear}">` +
                                    `${encode(messages.clear)}` +
                                '</span>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</form>' +
        '</div>';

    var booleanMobileTemplate = ({ field, title, format, ns, messages, extra, operators, filterMenuGuid, type, role, inputType, values }) =>
        `<div data-${ns}role="view" class="k-grid-filter-menu">` +
            `<div data-${ns}role="header" class="k-header">` +
                `<a href="#" class="k-header-cancel k-link" title="${messages.cancel}" ` +
                `aria-label="${messages.cancel}">${kendo.ui.icon("chevron-left")}</a>` +
                `${encode(messages.filter)} ${encode(messages.into)} ${encode(title)}` +
                `<a href="#" class="k-header-done k-link" title="${messages.done}" ` +
                `aria-label="${messages.done}">${kendo.ui.icon("check")}</a>` +
            '</div>' +
            `<form title="${messages.title}" class="k-filter-menu">` +
                '<ul class="k-reset">' +
                    '<li>' +
                        `<span class="k-list-title k-filter-help-text">${encode(messages.info)}</span>` +
                        '<ul class="k-listgroup k-listgroup-flush k-multicheck-bool-wrap">' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span class="k-listgroup-form-field-label k-item-title">${encode(messages.isTrue)}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper"></span>' +
                                        `<input id="true_${filterMenuGuid}" title="${messages.isTrue}" type="radio" data-${ns}bind="checked: filters[0].value" value="true" name="filters[0].value" autocomplete="${AUTOCOMPLETEVALUE}" />` +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                            '<li class="k-item k-listgroup-item">' +
                                '<label class="k-listgroup-form-row k-label">' +
                                    `<span for="false_${filterMenuGuid}" class="k-listgroup-form-field-label k-item-title">${encode(messages.isFalse)}</span>` +
                                    '<span class="k-listgroup-form-field-wrapper">' +
                                        `<input id="false_${filterMenuGuid}" title="${messages.isFalse}" type="radio" data-${ns}bind="checked: filters[0].value" value="false" name="filters[0].value" autocomplete="${AUTOCOMPLETEVALUE}" />` +
                                    '</span>' +
                                '</label>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                    '<li class="k-item k-clear-wrap">' +
                        '<span class="k-list-title">&nbsp;</span>' +
                        '<ul class="k-listgroup k-listgroup-flush">' +
                            '<li class="k-listgroup-item">' +
                                `<span class="k-link k-label k-clear" title="${messages.clear}" aria-label="${messages.clear}">` +
                                    `${encode(messages.clear)}` +
                                '</span>' +
                            '</li>' +
                        '</ul>' +
                    '</li>' +
                '</ul>' +
            '</form>' +
        '</div>';

    function removeFiltersForField(expression, field) {
        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function(filter) {
                removeFiltersForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field != field;
                }
            });
        }
    }

    function convertItems(items) {
        var idx,
            length,
            item,
            value,
            text,
            result;

        if (items && items.length) {
            result = [];
            for (idx = 0, length = items.length; idx < length; idx++) {
                item = items[idx];
                text = item.text !== "" ? item.text || item.value || item : item.text;
                value = item.value == null ? (item.text || item) : item.value;

                result[idx] = { text: text, value: value };
            }
        }
        return result;
    }


    function clearFilter(filters, field) {
        return $.grep(filters, function(expr) {
            if (expr.filters) {
                expr.filters = $.grep(expr.filters, function(nested) {
                    return nested.field != field;
                });

                return expr.filters.length;
            }
            return expr.field != field;
        });
    }

    var FilterMenu = Widget.extend({
        init: function(element, options) {
            var that = this,
                type = "string",
                operators,
                initial,
                field,
                columnHeader;

            options = options || {};
            options.componentType = options.componentType || "classic";
            Widget.fn.init.call(that, element, options);

            operators = that.operators = options.operators || {};

            element = that.element;
            options = that.options;

            that.dataSource = DataSource.create(options.dataSource);

            that.field = options.field || element.attr(kendo.attr("field"));

            columnHeader = $(element.closest(COLUMN_HEADER_SELECTOR));
            if (columnHeader.length) {
                that.appendTo = columnHeader.find(options.appendTo);
            } else {
                that.appendTo = $(options.appendTo);
            }

            that.link = that._createLink() || $();

            that.model = that.dataSource.reader.model;

            that._parse = function(value) {
                 return value != null ? (value + "") : value;
            };

            if (that.model && that.model.fields) {
                field = that.model.fields[that.field];

                if (field) {
                    type = field.type || "string";
                    if (field.parse) {
                        that._parse = field.parse.bind(field);
                    }
                }
            }

            if (options.values) {
                type = "enums";
            }

            that.type = type;

            operators = operators[type] || options.operators[type];

            for (initial in operators) { // get the first operator
                break;
            }

            that._defaultFilter = function() {
                return { field: that.field, operator: initial || "eq", value: "" };
            };

            that._refreshHandler = that.refresh.bind(that);

            that.dataSource.bind(CHANGE, that._refreshHandler);

            if (options.appendToElement) { // force creation if used in column menu
                that._init();
            } else {
                that.refresh(); //refresh if DataSource is fitered before menu is created
            }
        },

        _init: function() {
            var that = this,
                ui = that.options.ui,
                setUI = isFunction(ui),
                attrRole = kendo.attr("role"),
                role;

            that.pane = that.options.pane;
            if (that.pane) {
                that._isMobile = true;
            }

            if (!setUI) {
                role = ui || roles[that.type];
            }

            if (that._isMobile) {
                that._createMobileForm(role);
            } else {
                that._createForm(role);
            }

            that.form
                .on("submit" + NS, that._submit.bind(that))
                .on("reset" + NS, that._reset.bind(that));

            if (setUI) {
                that.form.find(".k-input-inner")
                    .removeClass("k-input-inner")
                    .each(function() {
                        ui($(this));
                    });
            } else {
                that.form
                    .find(".k-input-inner[" + attrRole + "]")
                    .removeClass("k-input-inner");

                that.form
                    .find(".k-input-inner:not([data-role]):not(.k-numerictextbox>.k-input-inner)")
                    .wrap("<span class='k-textbox k-input k-input-md k-rounded-md k-input-solid'></span>");
            }

            that.refresh();

            that.trigger(INIT, { field: that.field, container: that.form });

            if (that.options.cycleForm) {
                kendo.cycleForm(that.form);
            }
        },

        _createForm: function(role) {
            var that = this,
                options = that.options,
                operators = that.operators || {},
                type = that.type;

            operators = operators[type] || options.operators[type];

            that.form = $('<form title="' + encode(that.options.messages.title) + '" class="k-filter-menu"/>')
                .html(kendo.template(that._getTemplate())({
                    field: that.field,
                    format: options.format,
                    ns: kendo.ns,
                    messages: options.messages,
                    extra: options.extra,
                    operators: operators,
                    type: type,
                    role: role,
                    values: convertItems(options.values),
                    componentType: that.options.componentType
                }));

            if (!options.appendToElement) {
                that.popup = that.form[POPUP]({
                    anchor: that.link,
                    copyAnchorStyles: false,
                    open: that._open.bind(that),
                    activate: that._activate.bind(that),
                    close: function() {
                        if (that.options.closeCallback) {
                            that.options.closeCallback(that.element);
                        }
                    }
                }).data(POPUP);
            } else {
                that.element.append(that.form);
                that.popup = that.element.closest(".k-column-menu.k-popup").data(POPUP);
            }

            that.form
                .on("keydown" + NS, that._keydown.bind(that));
        },

        _getTemplate: function() {
            var that = this,
                hasCustomTemplate = isFunction(that.options.ui);

            if (that.type === 'boolean') {
                if (hasCustomTemplate) {
                    return customBooleanTemplate;
                } else if (that.options.componentType === 'modern') {
                    return modernBooleanTemplate;
                } else {
                    return booleanTemplate;
                }
            } else {
                return defaultTemplate;
            }
        },

        _createMobileForm: function(role) {
            var that = this,
                options = that.options,
                operators = that.operators || {},
                filterMenuGuid = kendo.guid(),
                type = that.type;

            operators = operators[type] || options.operators[type];

            that.form = $("<div />")
                .html(kendo.template(type === "boolean" ? booleanMobileTemplate : defaultMobileTemplate)({
                    field: that.field,
                    title: options.title || that.field,
                    format: options.format,
                    ns: kendo.ns,
                    messages: options.messages,
                    extra: options.extra,
                    operators: operators,
                    filterMenuGuid: filterMenuGuid,
                    type: type,
                    role: role,
                    inputType: mobileRoles[type],
                    values: convertItems(options.values)
                }));

            that.view = that.pane.append(that.form.html());
            that.form = that.view.element.find("form");

            that.view.element
                .on("click", ".k-header-done", function(e) {
                    that.form.submit();
                    e.preventDefault();
                })
                .on("click", ".k-header-cancel", function(e) {
                    that._closeForm();
                    e.preventDefault();
                })
                .on("click", ".k-clear", function(e) {
                    that._mobileClear();
                    e.preventDefault();
                });

            that.view.bind("showStart", function() {
                that.refresh();
            });
        },

        _createLink: function() {
            var that = this,
                element = that.element,
                appendTarget = that.appendTo.length ? element.find(that.appendTo) : element,
                options = that.options,
                title = kendo.format(options.messages.buttonTitle, that.options.title || that.field),
                link;

            if (options.appendToElement) {
                return;
            }

            link = element.addClass("k-filterable").find(".k-grid-filter-menu");

            if (!link[0]) {
                link = appendTarget
                    .append('<a class="k-grid-filter-menu k-grid-header-menu" href="#" aria-hidden="true" title="' +
                        title + '" >' + kendo.ui.icon("filter") + '</a>')
                    .find(".k-grid-filter-menu");
            }

            link.attr("tabindex", -1)
                .on("click" + NS, that._click.bind(that));

            return link;
        },

        refresh: function() {
            var that = this,
                expression = that.dataSource.filter() || { filters: [], logic: "and" };

            var defaultFilters = [ that._defaultFilter() ];
            var defaultOperator = that._defaultFilter().operator;
            if (that.options.extra || (defaultOperator !== "isnull" && defaultOperator !== "isnullorempty" && defaultOperator !== "isnotnullorempty" && defaultOperator !== "isnotnull" && defaultOperator !== "isempty" && defaultOperator !== "isnotempty")) {
                defaultFilters.push(that._defaultFilter());
            }

            that.filterModel = kendo.observable({
                logic: "and",
                filters: defaultFilters
            });

            if (that.form) {
                //NOTE: binding the form element directly causes weird error in IE when grid is bound through MVVM and column is sorted
                kendo.bind(that.form.children().first(), that.filterModel);

                if (that.options.componentType === "modern" && that.options.extra && that.type !== "boolean" && !that._isMobile) {
                    that.filterModel.bind("change", function() {
                        var roleAttribute = kendo.attr("role");
                        var buttongroup = that.form.find("[" + roleAttribute + "='buttongroup']").data('kendoButtonGroup');
                        var index = this.logic === "and" ? 0 : 1;

                        buttongroup.select(buttongroup.element.children().eq(index));
                    });
                    that.filterModel.set("onLogicChange",that._logicChangeHandler);
                }
            }

            if (that._bind(expression)) {
                that.link.addClass("k-active");
            } else {
                that.link.removeClass("k-active");
            }
        },

        _logicChangeHandler: function(e) {
            var valueAttribute = kendo.attr('value');
            var logic = e.sender.current().attr(valueAttribute);

            this.set('logic', logic);
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            if (that.form) {
                kendo.unbind(that.form);
                kendo.destroy(that.form);
                that.form.off(NS);
                if (that.popup) {
                    that.popup.destroy();
                    that.popup = null;
                }
                that.form = null;
            }

            if (that.view) {
                that.view.purge();
                that.view = null;
            }

            that.link.off(NS);

            if (that._refreshHandler) {
                that.dataSource.unbind(CHANGE, that._refreshHandler);
                that.dataSource = null;
            }

            that.element = that.link = that._refreshHandler = that.filterModel = null;
        },

        _bind: function(expression) {
            var that = this,
                filters = expression.filters,
                idx,
                length,
                found = false,
                current = 0,
                filterModel = that.filterModel,
                currentFilter,
                filter;

            for (idx = 0, length = filters.length; idx < length; idx++) {
                filter = filters[idx];
                if (filter.field == that.field) {
                    filterModel.set("logic", expression.logic);

                    currentFilter = filterModel.filters[current];
                    if (!currentFilter) {
                        filterModel.filters.push({ field: that.field });
                        currentFilter = filterModel.filters[current];
                    }
                    currentFilter.set("value", that._parse(filter.value));
                    currentFilter.set("operator", filter.operator);

                    current++;
                    found = true;
                } else if (filter.filters) {
                    found = found || that._bind(filter);
                }
            }

            return found;
        },

        _stripFilters: function(filters) {
           return $.grep(filters, function(filter) {
               return (filter.value !== "" && filter.value != null) ||
               (filter.operator === "isnull" || filter.operator === "isnotnull" ||
                   filter.operator === "isempty" || filter.operator === "isnotempty" ||
                   filter.operator == "isnullorempty" || filter.operator == "isnotnullorempty");
            });
        },

        _merge: function(expression) {
            var that = this,
                logic = expression.logic || "and",
                filters = this._stripFilters(expression.filters),
                filter,
                result = that.dataSource.filter() || { filters: [], logic: "and" },
                idx,
                length;

            removeFiltersForField(result, that.field);

            for (idx = 0, length = filters.length; idx < length; idx++) {
                filter = filters[idx];
                filter.value = that._parse(filter.value);
            }

            if (filters.length) {
                if (result.filters.length) {
                    expression.filters = filters;

                    if (result.logic !== "and") {
                        result.filters = [ { logic: result.logic, filters: result.filters }];
                        result.logic = "and";
                    }

                    if (filters.length > 1) {
                        result.filters.push(expression);
                    } else {
                        result.filters.push(filters[0]);
                    }
                } else {
                    result.filters = filters;
                    result.logic = logic;
                }
            }

            return result;
        },

        filter: function(expression) {
            var filters = this._stripFilters(expression.filters);
            if (filters.length && this.trigger("change", {
                    filter: { logic: expression.logic, filters: filters },
                    field: this.field
                })) {

                return;
            }

            expression = this._merge(expression);

            if (expression.filters.length) {
                this.dataSource.filter(expression);
            }
        },

        clear: function(expression) {
            var that = this;
            expression = expression || $.extend(true, {}, { filters: [] }, that.dataSource.filter()) || { filters: [] };

            if (this.trigger("change", { filter: null, field: that.field })) {
                return;
            }

            that._removeFilter(expression);
        },

        _mobileClear: function() {
            var that = this;
            var viewElement = that.view.element;

            if (that.type === "boolean") {
                var booleanRadioButton = viewElement.find("[type='radio']:checked");
                var booleanRadioButtonValue = booleanRadioButton.val();

                booleanRadioButton.val("");
                booleanRadioButton.trigger("change");
                booleanRadioButton.val(booleanRadioButtonValue);
                booleanRadioButton.prop("checked", false);
            } else {
                var operatorSelects = viewElement.find("select");

                operatorSelects.each(function(i, e) {
                    var input = $(e);

                    input.val(input.find("option").first().val());
                    input.trigger("change");
                });

                if (that.type === "string" || that.type === "date" || that.type === "number") {
                    var valueInputs = viewElement.find(".k-value-input");

                    valueInputs.each(function(i, e) {
                        var input = $(e);

                        input.val("");
                        input.trigger("change");
                    });
                }

                if (that.options.extra) {
                    var andLogicRadio = viewElement.find("[name=logic]").first();

                    andLogicRadio.prop("checked", true);
                    andLogicRadio.trigger("change");
                }
            }
        },

        _removeFilter: function(expression) {
            var that = this;
            expression.filters = $.grep(expression.filters, function(filter) {
                if (filter.filters) {
                    filter.filters = clearFilter(filter.filters, that.field);

                    return filter.filters.length;
                }

                return filter.field != that.field;
            });

            if (!expression.filters.length) {
                expression = null;
            }

            that.dataSource.filter(expression);
        },

        _submit: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var expression = this.filterModel.toJSON();
            var containsFilters = $.grep(expression.filters, function(filter) {
                return filter.value !== "" && filter.value !== null;
            });

            if (this._checkForNullOrEmptyFilter(expression) || (containsFilters && containsFilters.length)) {
                this.filter(expression);
            } else {
                var currentExpression = this.dataSource.filter();

                if (currentExpression) {
                    currentExpression.filters.push(expression);
                    expression = currentExpression;
                }
                this.clear(expression);
            }

            this._closeForm();
        },

        _checkForNullOrEmptyFilter: function(expression) {
            if (!expression || !expression.filters || !expression.filters.length) {
                return false;
            }
            var firstNullOrEmpty = false;
            var secondNullOrEmpty = false;
            var operator;

            if (expression.filters[0]) {
                operator = expression.filters[0].operator;
                firstNullOrEmpty = operator == "isnull" || operator == "isnotnull" || operator == "isnotempty" ||
                    operator == "isempty" || operator == "isnullorempty" || operator == "isnotnullorempty";
            }
            if (expression.filters[1]) {
                operator = expression.filters[1].operator;
                secondNullOrEmpty = operator == "isnull" || operator == "isnotnull" || operator == "isnotempty" ||
                    operator == "isempty" || operator == "isnullorempty" || operator == "isnotnullorempty";
            }

            return (!this.options.extra && firstNullOrEmpty) || (this.options.extra && (firstNullOrEmpty || secondNullOrEmpty));
        },

        _reset: function() {
            this.clear();

            if (this.options.search && this.container) {
                this.container.find("label").parent().show();
            }
            this._closeForm();
        },

        _closeForm: function() {
            if (this._isMobile) {
                this.pane.navigate("", this.options.animations.right);
            } else {
                this.popup.close();
            }
        },

        _click: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.popup && !this.pane) {
                this._init();
            }

            if (this._isMobile) {
                this.pane.navigate(this.view, this.options.animations.left);
            } else {
                this.popup.toggle();
            }
        },

        _open: function() {
            var popup;

            $(".k-filter-menu").not(this.form).each(function() {
                popup = $(this).data(POPUP);
                if (popup) {
                    popup.close();
                }
            });
        },

        _activate: function() {
            this.form.find(":kendoFocusable").first().trigger("focus");

            this.trigger(OPEN, { field: this.field, container: this.form });
        },

        _keydown: function(e) {
            var target = $(e.target),
                instance;

            if (e.keyCode == kendo.keys.ESC) {
                instance = kendo.widgetInstance(target.find("select"));

                if (target.hasClass("k-picker") &&
                    instance &&
                    instance.popup.visible()) {
                        e.stopPropagation();
                        return;
                }

                target.closest(".k-popup").getKendoPopup().close();
            }
        },

        events: [ INIT, "change", OPEN ],

        options: {
            name: "FilterMenu",
            extra: true,
            appendToElement: false,
            type: "string",
            operators: {
                string: {
                    eq: EQ,
                    neq: NEQ,
                    startswith: "Starts with",
                    contains: "Contains",
                    doesnotcontain: "Does not contain",
                    endswith: "Ends with",
                    isnull: "Is null",
                    isnotnull: "Is not null",
                    isempty: "Is empty",
                    isnotempty: "Is not empty",
                    isnullorempty: "Has no value",
                    isnotnullorempty: "Has value"
                },
                number: {
                    eq: EQ,
                    neq: NEQ,
                    gte: "Is greater than or equal to",
                    gt: "Is greater than",
                    lte: "Is less than or equal to",
                    lt: "Is less than",
                    isnull: "Is null",
                    isnotnull: "Is not null"
                },
                date: {
                    eq: EQ,
                    neq: NEQ,
                    gte: "Is after or equal to",
                    gt: "Is after",
                    lte: "Is before or equal to",
                    lt: "Is before",
                    isnull: "Is null",
                    isnotnull: "Is not null"
                },
                enums: {
                    eq: EQ,
                    neq: NEQ,
                    isnull: "Is null",
                    isnotnull: "Is not null"
                }
            },
            messages: {
                info: "Show items with value that:",
                title: "Show items with value that:",
                isTrue: "is true",
                isFalse: "is false",
                filter: "Filter",
                clear: "Clear",
                and: "And",
                or: "Or",
                selectValue: "-Select value-",
                operator: "Operator",
                value: "Value",
                additionalValue: "Additional value",
                additionalOperator: "Additional operator",
                logic: "Filters logic",
                cancel: "Cancel",
                done: "Done",
                into: "in",
                buttonTitle: "{0} filter column settings"
            },
            animations: {
                left: "slide",
                right: "slide:right"
            },
            componentType: 'classic',
            cycleForm: true,
            appendTo: null
        }
    });

    var multiCheckNS = ".kendoFilterMultiCheck";

    function filterValuesForField(expression, field) {

        if (expression.filters) {
            expression.filters = $.grep(expression.filters, function(filter) {
                filterValuesForField(filter, field);
                if (filter.filters) {
                    return filter.filters.length;
                } else {
                    return filter.field == field && filter.operator == "eq";
                }
            });
        }
    }

    function flatFilterValues(expression) {
        if (expression.logic == "and" && expression.filters.length > 1) {
            return [];
        }
        if (expression.filters) {
            return $.map(expression.filters, function(filter) {
                return flatFilterValues(filter);
            });
        } else if (expression.value !== undefined$1) {
            return [expression.value];
        } else {
            return [];
        }
    }

    function distinct(items, field) {
        var getter = kendo.getter(field, true),
            result = [],
            index = 0,
            seen = {};

        while (index < items.length) {
            var item = items[index++],
                text = getter(item);

            if (text !== undefined$1 && !seen.hasOwnProperty(text)) {
                result.push(item);
                seen[text] = true;
            }
        }

        return result;
    }

    function removeDuplicates(dataSelector, dataTextField) {

        return function(e) {
            var items = dataSelector(e);

            return distinct(items, dataTextField);
        };
    }

    var DataSource = kendo.data.DataSource;

    var multiCheckMobileTemplate = ({ field, title, ns, messages, search, checkAll }) =>
        `<div data-${ns}role="view" class="k-grid-filter-menu">` +
            `<div data-${ns}role="header" class="k-header">` +
                `<a href="#" class="k-header-cancel k-link" title="${messages.cancel}" ` +
                `aria-label="${messages.cancel}">${kendo.ui.icon("chevron-left")}</a>` +
                `${messages.filter} ${messages.into} ${title}` +
                `<a href="#" class="k-header-done k-link" title="${messages.done}" ` +
                `aria-label="${messages.done}">${kendo.ui.icon("check")}</a>` +
            '</div>' +
            '<form class="k-filter-menu">' +
                '<ul class="k-reset">' +
                    (search ?
                    '<li class="k-space-right">' +
                        '<span class="k-searchbox k-textbox k-input k-input-md k-rounded-md k-input-solid">' +
                            `<input class="k-input-inner" placeholder="${messages.search}" title="${messages.search}" autocomplete="${AUTOCOMPLETEVALUE}"  />` +
                            `<span class="k-input-suffix">${kendo.ui.icon("search")}` +
                        '</span>' +
                    '</li>'
                    : '') +
                    '<li class="k-filter-tools">' +
                        `<span ${checkAll ? "" : `${kendo.attr("style-visibility")}="hidden"`} class="k-label k-select-all" title="${messages.checkAll}" ` +
                            `aria-label="${messages.checkAll}">${messages.checkAll}</span>` +
                        `<span class="k-label k-clear-all" title="${messages.clearAll}" ` +
                            `aria-label="${messages.clearAll}">${messages.clearAll}</span>` +
                    '</li>' +
                    (messages.selectedItemsFormat ?
                    '<li>' +
                        '<div class="k-filter-selected-items"></div>' +
                    '</li>'
                    : '') +
                    '<li>' +
                        '<ul class="k-multicheck-wrap k-listgroup k-listgroup-flush"></ul>' +
                    '</li>' +
                '</ul>' +
            '</form>' +
        '</div>';

    var FilterMultiCheck = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);
            options = this.options;
            this.element = $(element);
            var columnHeader;
            var field = this.field = this.options.field || this.element.attr(kendo.attr("field"));
            var checkSource = options.checkSource;
            if (this._foreignKeyValues()) {
                this.checkSource = DataSource.create(options.values);
                this.checkSource.fetch();
            } else if (options.forceUnique) {
                checkSource = $.extend(true, {}, options.dataSource.options);
                delete checkSource.pageSize;

                this.checkSource = DataSource.create(checkSource);
                this.checkSource.reader.data = removeDuplicates(this.checkSource.reader.data, this.field);
            } else {
                this.checkSource = DataSource.create(checkSource);
            }

            this.dataSource = options.dataSource;
            this.model = this.dataSource.reader.model;

            this._parse = function(value) {
                 return value + "";
            };

            if (this.model && this.model.fields) {
                field = this.model.fields[this.field];

                if (field) {
                    if (field.type == "number") {
                        this._parse = function(value) {
                            if (typeof value === "string" && (value.toLowerCase() === "null" || this._foreignKeyValues() && value === "")) {
                                return null;
                            }
                            return parseFloat(value);
                        };
                    } else if (field.parse) {
                        this._parse = field.parse.bind(field);
                    }
                    this.type = field.type || "string";
                }
            }

            columnHeader = $(element.closest(COLUMN_HEADER_SELECTOR));
            if (columnHeader.length) {
                this.appendTo = columnHeader.find(options.appendTo);
            } else {
                this.appendTo = $(options.appendTo);
            }

            if (!options.appendToElement) {
                this._createLink();
            } else {
                this._init();
            }

            this._refreshHandler = this.refresh.bind(this);
            this.dataSource.bind(CHANGE, this._refreshHandler);

        },
        _createLink: function() {
            var element = this.element;
            var appendTarget = this.appendTo.length ? element.find(this.appendTo) : element;
            var link = element.addClass("k-filterable").find(".k-grid-filter-menu");
            var title = encode(kendo.format(this.options.messages.buttonTitle, this.options.title || this.field));

            if (!link[0]) {
                link = appendTarget
                    .append('<a class="k-grid-filter-menu k-grid-header-menu" href="#" title="' +
                        title + '" aria-hidden="true"' +
                        '">' + kendo.ui.icon("filter") + '</a>')
                    .find(".k-grid-filter-menu");
            }

            this._link = link.attr("tabindex", -1)
                .on("click" + NS, this._click.bind(this));
        },
        _init: function() {
            var that = this;
            var forceUnique = this.options.forceUnique;

            var options = this.options;
            this.pane = options.pane;

            if (this.pane) {
                this._isMobile = true;
            }

            this._createForm();

            if (this._foreignKeyValues()) {
                this.refresh();
            } else if (forceUnique && !this.checkSource.options.serverPaging && this.dataSource.data().length) {
                this.checkSource.data(distinct(this.dataSource.data(),this.field));
                this.refresh();
            } else {
                this._attachProgress();

                this.checkSource.fetch(function() {
                    that.refresh.call(that);
                });
            }

            if (!this.options.forceUnique) {
                this.checkChangeHandler = function() {
                    that.container.empty();
                    that.refresh();
                };
                this.checkSource.bind(CHANGE, this.checkChangeHandler);
            }

            this.form.on("keydown" + multiCheckNS, this._keydown.bind(this))
                        .on("submit" + multiCheckNS, this._filter.bind(this))
                        .on("reset" + multiCheckNS, this._reset.bind(this));

            this.trigger(INIT, { field: this.field, container: this.form });
        },

        _attachProgress: function() {
            var that = this;

            this._progressHandler = function() {
                ui.progress(that.container, true);
            };

            this._progressHideHandler = function() {
                ui.progress(that.container, false);
            };

            this.checkSource
                .bind("progress", this._progressHandler)
                .bind("change", this._progressHideHandler);
        },

        _input: function() {
            var that = this;
            that._clearTypingTimeout();
            that._typingTimeout = setTimeout(function() { that.search(); }, 100);
        },

        _clearSearch: function() {
            var that = this;
            that.searchTextBox.val("");
            that.search();
        },

        _clearTypingTimeout: function() {
            if (this._typingTimeout) {
                clearTimeout(this._typingTimeout);
                this._typingTimeout = null;
            }
        },

        search: function() {
            var ignoreCase = this.options.ignoreCase;
            var searchString = this.searchTextBox[0].value;
            var labels = this.container.find("label");

            if (ignoreCase) {
                searchString = searchString.toLowerCase();
            }
            var i = 0;
            if (this.options.checkAll && labels.length)
            {
                if (!this._isMobile) {
                    labels[0].parentNode.style.display = searchString ? "none" : "";
                    i++;
                } else {
                    this.view.element.find(".k-select-all")[0].style.visibility = searchString ? "hidden" : "";
                }
            }

            while (i < labels.length) {
                var label = labels[i];
                var labelText = label.textContent || label.innerText;
                if (ignoreCase) {
                    labelText = labelText.toLowerCase();
                }
                label.parentNode.style.display = labelText.indexOf(searchString) >= 0 ? "" : "none";
                i++;
            }
        },
        _activate: function() {
            this.form.find(":kendoFocusable").first().trigger("focus");

            this.trigger(OPEN, { field: this.field, container: this.form });
        },
        _createForm: function() {
            var options = this.options;
            var html = "";
            var that = this;

            if (!this._isMobile) {
                html += "<div class='k-filter-menu-container'>";
                if (options.search) {
                    html += "<span class='k-searchbox k-textbox k-input k-input-md k-rounded-md k-input-solid'>" +
                                kendo.ui.icon("search") +
                                "<input class='k-input-inner' type='text' placeholder='" + encode(options.messages.search) + "' />" +
                                "<span class='k-input-suffix'>" +
                                    "<span class='k-clear-value'>" + kendo.ui.icon("x") + "</span>" +
                                "</span>" +
                            "</span>";
                }
                html += "<ul class='k-reset k-multicheck-wrap'></ul>";
                if (options.messages.selectedItemsFormat) {
                    html += "<div class='k-filter-selected-items'>" + kendo.format(options.messages.selectedItemsFormat, 0) + "</div>";
                }
                html += "<div class='k-actions'>";
                html += "<button type='submit' class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary'><span class='k-button-text'>" + encode(options.messages.filter) + "</span></button>";
                html += "<button type='reset' class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base'><span class='k-button-text'>" + encode(options.messages.clear) + "</span></button>";
                html += "</div>";
                html += "</div>";

                this.form = $('<form class="k-filter-menu"/>').html(html);
                this.container = this.form.find(".k-multicheck-wrap");
            }
            if (this._isMobile) {
                let checkMobileHtml = $(kendo.template(multiCheckMobileTemplate)({
                    field: that.field,
                    title: options.title || that.field,
                    ns: kendo.ns,
                    messages: options.messages,
                    search: options.search,
                    checkAll: options.checkAll
                }));

                kendo.applyStylesFromKendoAttributes(checkMobileHtml, ["visibility"]);
                that.form = $("<div />").append(checkMobileHtml);

                that.view = that.pane.append(that.form.html());
                that.form = that.view.element.find("form");
                var element = this.view.element;
                this.container = element.find(".k-multicheck-wrap");

                element
                    .on("click", ".k-header-done", function(e) {
                        that.form.submit();
                        e.preventDefault();
                    })
                    .on("click", ".k-header-cancel", function(e) {
                        that._closeForm();
                        e.preventDefault();
                    })
                    .on("click", ".k-clear-all", function(e) {
                        that._mobileCheckAll(false);
                        e.preventDefault();
                    })
                    .on("click", ".k-select-all", function(e) {
                        that._mobileCheckAll(true);
                        e.preventDefault();
                    });

                that.view.bind("showStart", function() {
                    that.refresh();
                });
            } else {
                if (!options.appendToElement) {
                    that.popup = that.form.kendoPopup({
                        anchor: that._link,
                        copyAnchorStyles: false,
                        open: that._open.bind(that),
                        activate: that._activate.bind(that),
                        close: function() {
                            if (that.options.closeCallback) {
                                that.options.closeCallback(that.element);
                            }
                        }
                    }).data(POPUP);
                } else {
                    this.popup = this.element.closest(".k-column-menu.k-popup").data(POPUP);
                    this.element.append(this.form);
                }
            }

            if (options.search) {
                this.searchTextBox = this.form.find(".k-searchbox input");
                this.searchTextBox.on("input" + multiCheckNS, this._input.bind(this));
                this.clearSearchButton = this.form.find(".k-searchbox .k-clear-value");
                this.clearSearchButton.on("click" + multiCheckNS, this._clearSearch.bind(this));
            }
        },
        _open: function() {
            var popup;

            $(".k-filter-menu").not(this.form).each(function() {
                popup = $(this).data(POPUP);
                if (popup) {
                    popup.close();
                }
            });
        },
        createCheckAllItem: function() {
            var options = this.options;
            var template = kendo.template(options.itemTemplate({ field: "all", mobile: this._isMobile }));
            var checkAllContainer = $(template({ all: options.messages.checkAll }));
            this.container.prepend(checkAllContainer);

            checkAllContainer.addClass("k-check-all-wrap");
            this.checkBoxAll = checkAllContainer.find(":checkbox").eq(0).addClass("k-check-all");
            this.checkAllHandler = this.checkAll.bind(this);
            this.checkBoxAll.on(CHANGE + multiCheckNS, this.checkAllHandler);
        },
        updateCheckAllState: function() {
            if (this.options.messages.selectedItemsFormat) {
                this.form.find(".k-filter-selected-items").text(kendo.format(this.options.messages.selectedItemsFormat, this.container.find(":checked:not(.k-check-all)").length));
            }
            if (this.checkBoxAll) {
                var state = this.container.find(":checkbox:not(.k-check-all)").length == this.container.find(":checked:not(.k-check-all)").length;
                this.checkBoxAll.prop("checked", state);
            }
        },
        createIsNullItem: function() {
            var options = this.options;
            var template = kendo.template(options.itemTemplate({ field: "isNull", mobile: this._isMobile, valueField: "value" }));
            var isNullContainer = $(template({ isNull: options.messages.isNull, value: null }));
            this.container.append(isNullContainer);
        },
        refresh: function(e) {
            var forceUnique = this.options.forceUnique;
            var dataSource = this.dataSource;
            var filters = this.getFilterArray();

            if (this._link) {
                this._link.toggleClass("k-active", filters.length !== 0);
            }

            if (this.form) {
                if (e && forceUnique && e.sender === dataSource && !dataSource.options.serverPaging &&
                     (e.action == "itemchange" || e.action == "add" || e.action == "remove" || (dataSource.options.autoSync && e.action === "sync")) &&
                         !this._foreignKeyValues()) {
                    this.checkSource.data(distinct(this.dataSource.data(),this.field));
                    this.container.empty();
                }

                if (this.container.is(":empty")) {
                    this.createCheckBoxes();
                }
                this.checkValues(filters);
                this.trigger(REFRESH);
            }
        },
        getFilterArray: function() {
            var expression = $.extend(true, {}, { filters: [], logic: "and" }, this.dataSource.filter());
            filterValuesForField(expression, this.field);
            var flatValues = flatFilterValues(expression);
            return flatValues;
        },
        createCheckBoxes: function() {
            var options = this.options;
            var data;
            var templateOptions = {
                field: this.field,
                format: options.format,
                mobile: this._isMobile,
                type: this.type
            };
            var boolDataFilter = booleanFilterHandler.bind(this);

            if (!this.options.forceUnique) {
                data = this.checkSource.view();
            } else if (this._foreignKeyValues()) {
                data = this.checkSource.data();
                templateOptions.valueField = "value";
                templateOptions.field = "text";
            } else if (this.checkSource._isServerGrouped()) {
                data = distinct(this.checkSource._flatData(this.checkSource.data()), this.field);
            } else {
                data = this.checkSource.data();
            }

            if (this.type === "boolean") {
                this.createIsNullItem();
                data = data.filter(boolDataFilter);
            }

            var template = kendo.template(options.itemTemplate(templateOptions));
            var itemsHtml = kendo.render(template, data);

            this.container.on(CHANGE + multiCheckNS, ":checkbox", this.updateCheckAllState.bind(this));
            this.container.prepend(itemsHtml);

            if (options.checkAll && !this._isMobile) {
                this.createCheckAllItem();
            }
        },
        checkAll: function() {
            var state = this.checkBoxAll.is(":checked");
            this.container.find(":checkbox").prop("checked", state);
        },
        checkValues: function(values) {
            var that = this;

            $($.grep(this.container.find(":checkbox").prop("checked", false), function(ele) {
                var found = false;
                if ($(ele).is(".k-check-all")) {
                    return;
                }
                var checkBoxVal = that._parse($(ele).val());
                for (var i = 0; i < values.length; i++) {
                    if (that.type == "date") {
                        if (values[i] && checkBoxVal) {
                            found = values[i].getTime() == checkBoxVal.getTime();
                        } else if (values[i] === null && checkBoxVal === null) {
                            found = true;
                        } else {
                            found = false;
                        }
                    } else {
                        found = values[i] == checkBoxVal;
                    }
                    if (found) {
                        return found;
                    }
                }
            })).prop("checked", true);
            this.updateCheckAllState();
        },

        _mobileCheckAll: function(state) {
            var that = this;
            var checkboxes = that.container.find(":checkbox");

            checkboxes.each(function(i, e) {
                var checkbox = $(e);

                checkbox.prop("checked", state);
                checkbox.trigger("change");
            });
        },

        _filter: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var expression = { logic: "or" };

            var that = this;
            expression.filters = $.map(this.form.find(":checkbox:checked:not(.k-check-all)"), function(item) {
                return { value: $(item).val(), operator: "eq", field: that.field };
            });

            if (this.trigger("change", { filter: expression, field: that.field })) {
                return;
            }

            expression = this._merge(expression);
            if (expression.filters.length) {
                this.dataSource.filter(expression);
            } else {
                that._removeFilter(that.dataSource.filter() || { filters: [] });
            }

            this._closeForm();
        },

        _stripFilters: function(filters) {
           return $.grep(filters, function(filter) {
                return filter.value != null;
            });
        },

        _foreignKeyValues: function() {
            var options = this.options;
            return options.values && !options.checkSource;
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            if (that.form) {
                kendo.unbind(that.form);
                kendo.destroy(that.form);
                that.form.off(multiCheckNS);
                if (that.popup) {
                    that.popup.destroy();
                    that.popup = null;
                }
                that.form = null;
                if (that.container) {
                    that.container.off(multiCheckNS);
                    that.container = null;
                }

                if (that.checkBoxAll) {
                    that.checkBoxAll.off(multiCheckNS);
                }
            }

            if (that.view) {
                that.view.purge();
                that.view = null;
            }

            if (that._link) {
                that._link.off(NS);
            }

            if (that._refreshHandler) {
                that.dataSource.unbind(CHANGE, that._refreshHandler);
                that.dataSource = null;
            }

            if (that.checkChangeHandler) {
                that.checkSource.unbind(CHANGE, that.checkChangeHandler);
            }

            if (that._progressHandler) {
                that.checkSource.unbind("progress", that._progressHandler);
            }

            if (that._progressHideHandler) {
                that.checkSource.unbind("change", that._progressHideHandler);
            }

            this._clearTypingTimeout();

            if (this.searchTextBox) {
                this.searchTextBox.off(multiCheckNS);
                this.searchTextBox = null;
            }

            if (this.clearSearchButton) {
                this.clearSearchButton.off(multiCheckNS);
                this.clearSearchButton = null;
            }

            that.element = that.checkSource = that.container = that.checkBoxAll = that._link = that._refreshHandler = that.checkAllHandler = null;
        },
        options: {
            name: "FilterMultiCheck",
            itemTemplate: ({ field, mobile, valueField, format, type }) => {
                var valueFormat = "";

                if (valueField === undefined$1) {
                    valueField = field;
                }

                if (type == "date") {
                    valueFormat = ":yyyy-MM-ddTHH:mm:sszzz";
                }

                if (mobile) {
                    return (data) =>
                        "<li class='k-item k-listgroup-item'>" +
                            "<label class='k-label k-listgroup-form-row k-checkbox-label'>" +
                                `<span class='k-listgroup-form-field-label k-item-title '>${encode(kendo.format(format ? format : "{0}", kendo.getter(field)(data)))}</span>` +
                                '<span class="k-listgroup-form-field-wrapper">' +
                                    `<input type='checkbox' class='k-checkbox k-checkbox-md k-rounded-md' value='${encode(kendo.format(`{0${valueFormat}}`, kendo.getter(valueField)(data)))}'/>` +
                                '</span>' +
                            "</label>" +
                        "</li>";
                }

                return (data) =>
                    "<li class='k-item'>" +
                        "<label class='k-label k-checkbox-label'>" +
                            `<input type='checkbox' class='k-checkbox k-checkbox-md k-rounded-md' value='${encode(kendo.format(`{0${valueFormat}}`, kendo.getter(valueField)(data)))}'/>` +
                            `<span>${encode(kendo.format(format ? format : "{0}", kendo.getter(field)(data)))}</span>` +
                        "</label>" +
                    "</li>";
            },
            checkAll: true,
            search: false,
            ignoreCase: true,
            appendToElement: false,
            messages: {
                checkAll: "Select All",
                isNull: "is empty",
                clearAll: "Clear All",
                clear: "Clear",
                filter: "Filter",
                search: "Search",
                cancel: "Cancel",
                selectedItemsFormat: "{0} items selected",
                done: "Done",
                into: "in",
                buttonTitle: "{0} filter column settings"
            },
            forceUnique: true,
            animations: {
                left: "slide",
                right: "slide:right"
            },
            appendTo: null
        },
        events: [ INIT, REFRESH, "change", OPEN ]
    });

    function booleanFilterHandler(item) {
        return item[this.field] !== null;
    }

    $.extend(FilterMultiCheck.fn, {
        _click: FilterMenu.fn._click,
        _keydown: FilterMenu.fn._keydown,
        _reset: FilterMenu.fn._reset,
        _closeForm: FilterMenu.fn._closeForm,
        _removeFilter: FilterMenu.fn._removeFilter,
        clear: FilterMenu.fn.clear,

        _merge: FilterMenu.fn._merge
    });

    ui.plugin(FilterMenu);
    ui.plugin(FilterMultiCheck);
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
