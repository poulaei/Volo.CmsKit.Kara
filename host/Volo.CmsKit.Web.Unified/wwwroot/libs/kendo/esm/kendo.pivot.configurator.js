import './kendo.dom.js';
import './kendo.html.chip.js';
import './kendo.html.chiplist.js';
import './kendo.pivot.common.js';
import './kendo.icons.js';

class Navigation {
    constructor(options) {
        this.tabIndex = 0;
        this.root = null;
        this.eventHandlers = {};
        this.update = () => { };
        this.tabIndex = options.tabIndex;
    }
    get elements() {
        return this.root ? Array.from(this.root.querySelectorAll(this.selectors.join(','))) : [];
    }
    get first() {
        return (this.root && this.root.querySelector(this.selectors.join(','))) || null;
    }
    get last() {
        const all = this.elements;
        return all[all.length - 1] || null;
    }
    get current() {
        return this.elements.find(el => el.matches(':focus'));
    }
    start(root) {
        this.root = root;
        for (const eventType in this.mouseEvents) {
            if (this.mouseEvents[eventType]) {
                this.eventHandlers[eventType] = (ev => {
                    const target = ev.target instanceof Element && ev.target.closest(this.selectors.join(','));
                    if (target) {
                        this.mouseEvents[eventType].call(undefined, target, this, ev);
                    }
                });
                root.addEventListener(eventType, this.eventHandlers[eventType]);
            }
        }
        for (const eventType in this.keyboardEvents) {
            if (this.keyboardEvents[eventType]) {
                this.eventHandlers[eventType] = (ev => {
                    const target = ev.target instanceof Element && ev.target.closest(this.selectors.join(','));
                    const key = ev.key === ' ' ? 'Space' : ev.key;
                    if (target && this.keyboardEvents[eventType][key]) {
                        this.keyboardEvents[eventType][key].call(undefined, target, this, ev);
                    }
                });
                root.addEventListener(eventType, this.eventHandlers[eventType]);
            }
        }
    }
    stop() {
        if (this.root) {
            for (const eventType in this.eventHandlers) {
                if (this.eventHandlers[eventType]) {
                    this.root.removeEventListener(eventType, this.eventHandlers[eventType]);
                }
            }
        }
        this.root = null;
    }
    focusElement(element, previous) {
        if (element) {
            if (previous) {
                previous.removeAttribute('tabindex');
                previous.classList.remove('k-focus');
            }
            element.setAttribute('tabindex', String(this.tabIndex));
            element.focus({ preventScroll: true });
        }
    }
}

const scrollableValuesSel = '.k-pivotgrid .k-pivotgrid-values';
const scrollableColumnHeaderSel = '.k-pivotgrid .k-pivotgrid-column-headers';
const scrollableRowHeaderSel = '.k-pivotgrid .k-pivotgrid-row-headers';
const emptyCellSel = '.k-pivotgrid > .k-pivotgrid-empty-cell';
const tableSel = 'table.k-pivotgrid-table';
const cellSel = '.k-pivotgrid-cell';
const scrollables = [scrollableValuesSel, scrollableColumnHeaderSel, scrollableRowHeaderSel].join(',');
const selectors$1 = [
    emptyCellSel,
    [scrollableColumnHeaderSel, tableSel, cellSel].join(' '),
    [scrollableRowHeaderSel, tableSel, cellSel].join(' '),
    [scrollableValuesSel, tableSel, cellSel].join(' ')
];
const onEnter = (target, nav, ev) => {
    const icon = target.querySelector('.k-icon, .k-svg-icon');
    if (icon) {
        const index = nav.elements.indexOf(target);
        nav.update = () => {
            nav.focusElement(nav.elements[index], null);
            nav.update = () => { };
        };
        icon.click();
        ev.preventDefault();
    }
};
const tryScrollLeft = (target, scrollable, elToScroll) => {
    if (target.offsetLeft < scrollable.scrollLeft) {
        elToScroll.scrollLeft = target.offsetLeft;
    }
};
const tryScrollRight = (target, scrollable, elToScroll) => {
    if (target.offsetLeft + target.offsetWidth > scrollable.scrollLeft + scrollable.offsetWidth &&
        target.offsetWidth < scrollable.offsetWidth) {
        elToScroll.scrollLeft = target.offsetLeft + target.offsetWidth - scrollable.offsetWidth;
    }
};
const tryScrollUp = (target, scrollable, elToScroll) => {
    if (scrollable.scrollTop && target.offsetTop < scrollable.scrollTop) {
        elToScroll.scrollTop = target.offsetTop;
    }
};
const tryScrollDown = (target, scrollable, elToScroll) => {
    if (target.offsetTop + target.offsetHeight > scrollable.scrollTop + scrollable.offsetHeight &&
        target.offsetHeight < scrollable.offsetHeight) {
        elToScroll.scrollTop = target.offsetTop + target.offsetHeight - scrollable.offsetHeight;
    }
};
const scrollTo = (target, root, scrollFunc) => {
    const elToScroll = root.querySelector(scrollableValuesSel);
    const scrollable = target && target.closest(scrollables);
    if (!elToScroll || !scrollable || !target) {
        return;
    }
    scrollFunc.forEach(scroll => scroll(target, scrollable, elToScroll));
};
const tableMap = (table) => {
    const rows = Array.from(table.rows);
    const colsCount = Array.from((rows && rows[0] && rows[0].cells) || [])
        .map(c => c.colSpan)
        .reduce((prev, cur) => prev + cur, 0);
    const map = rows.map(() => new Array(colsCount));
    rows.forEach((row, r) => {
        let curColSpan = 0;
        Array.from(row.cells).forEach((c) => {
            for (let colSp = 0; colSp < c.colSpan; colSp++) {
                for (let rowSp = 0; rowSp < c.rowSpan; rowSp++) {
                    const ind = map[r + rowSp].findIndex((val, curInd) => curInd >= curColSpan && !val);
                    map[r + rowSp][ind] = c;
                }
                curColSpan++;
            }
        });
    });
    return map;
};
const navigationMap = (root) => {
    const columnHeader = tableMap(root.querySelector([scrollableColumnHeaderSel, tableSel].join(' ')));
    const rowHeader = tableMap(root.querySelector([scrollableRowHeaderSel, tableSel].join(' ')));
    const values = tableMap(root.querySelector([scrollableValuesSel, tableSel].join(' ')));
    const emptyCell = root.querySelector(emptyCellSel);
    const emptyCellRow = new Array(rowHeader[0].length).fill(emptyCell);
    const map = [];
    for (let i = 0; i < columnHeader.length; i++) {
        map.push(emptyCellRow.concat(columnHeader[i]));
    }
    for (let i = 0; i < rowHeader.length; i++) {
        map.push(rowHeader[i].concat(values[i]));
    }
    return map;
};
const getTargetPos = (map, target) => {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === target) {
                return [r, c];
            }
        }
    }
    return [-1, -1];
};
const ctrlKey = (ev) => ev.ctrlKey || ev.metaKey;
const cellAt = (root, target, pos) => {
    const map = navigationMap(root);
    let targetPos = getTargetPos(map, target);
    let nextPos = [targetPos[0] + pos[0], targetPos[1] + pos[1]];
    let next = map[nextPos[0]] && map[nextPos[0]][nextPos[1]];
    while (next && next === target) {
        nextPos = [nextPos[0] + pos[0], nextPos[1] + pos[1]];
        next = map[nextPos[0]] && map[nextPos[0]][nextPos[1]];
    }
    return next;
};
const keyboardEvents$1 = {
    keydown: {
        ArrowLeft: (target, nav, ev) => {
            ev.preventDefault();
            const next = cellAt(nav.root, target, [0, -1]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollDown, tryScrollUp]);
        },
        ArrowRight: (target, nav, ev) => {
            ev.preventDefault();
            const next = cellAt(nav.root, target, [0, 1]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollLeft, tryScrollRight, tryScrollDown, tryScrollUp]);
        },
        ArrowUp: (target, nav, ev) => {
            ev.preventDefault();
            const next = cellAt(nav.root, target, [-1, 0]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollDown, tryScrollUp]);
        },
        ArrowDown: (target, nav, ev) => {
            ev.preventDefault();
            const next = cellAt(nav.root, target, [1, 0]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollUp, tryScrollDown]);
        },
        o: (_target, nav, _ev) => {
            if (!nav.root) {
                return;
            }
            // FIX: ADDED manually to fix an issue where depending on the order of the config element and button
            // you either can open the configurator with Ctrl+O, or you can close the configurator with ESC
            let next = nav.root.nextElementSibling;
            if (!(next && next instanceof HTMLElement)) {
                return;
            }

            if (!next.matches('div.k-pivotgrid-configurator-button')) {
                next = next.nextElementSibling;
            }

            if (next && next instanceof HTMLElement && next.matches('div.k-pivotgrid-configurator-button')) {
                if (!nav.root.parentNode || nav.root.parentNode.querySelector(".k-pivotgrid-configurator.k-hidden")) {
                    next.click();
                }

                setTimeout(() => {
                    if (nav.root.parentNode) {
                        const confHeader = nav.root.parentNode.querySelector('.k-pivotgrid-configurator-content .k-form-field .k-fields-list-wrapper .k-treeview');
                        if (confHeader instanceof HTMLElement) {
                            confHeader.setAttribute('tabindex', String(nav.tabIndex));
                            confHeader.focus();
                        }
                    }
                }, 0);
            }
        },
        Enter: onEnter,
        Space: onEnter,
        Home: (target, nav, ev) => {
            const map = navigationMap(nav.root);
            const ctrl = ctrlKey(ev);
            let row = ctrl ? map[0] : (map.find(ro => Boolean(ro.find(x => x === target))) || []);
            let next = row[0];
            if (next) {
                nav.focusElement(next, target);
                scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollDown, tryScrollUp]);
                ev.preventDefault();
            }
        },
        End: (target, nav, ev) => {
            const map = navigationMap(nav.root);
            const ctrl = ctrlKey(ev);
            let row = ctrl ? map[map.length - 1] : (map.find(ro => Boolean(ro.find(x => x === target))) || []);
            let next = row && row[row.length - 1] || null;
            if (next) {
                nav.focusElement(next, target);
                scrollTo(next, nav.root, [tryScrollLeft, tryScrollRight, tryScrollUp, tryScrollDown]);
                ev.preventDefault();
            }
        }
    }
};
const mouseEvents$1 = {
    click: (target, nav) => {
        if (target && target instanceof HTMLElement) {
            const prev = nav.elements.find(c => c.hasAttribute('tabindex')) || null;
            nav.focusElement(target, prev);
        }
    }
};
/**
 * The PivotGrid keyboard navigation functionality.
 *
 * Usage:
 *
 * On Initialize
 * const navigation = new PivotGridNavigation({ tabindex: 0 });
 *
 * Turn on
 * navigation.start(rootDomElement);
 *
 * On After Update
 * navigation.update();
 *
 * On Destroy / Turn off
 * navigation.stop();
 */
class PivotGridNavigation extends Navigation {
    constructor() {
        super(...arguments);
        this.selectors = selectors$1;
        this.mouseEvents = mouseEvents$1;
        this.keyboardEvents = keyboardEvents$1;
    }
}

const selectors = [
    '.k-pivotgrid-configurator-content .k-form-field .k-fields-list-wrapper .k-treeview',
    '.k-pivotgrid-configurator-content .k-chip',
    '.k-pivotgrid-configurator-actions button'
];
const onEscape = (_target, nav, ev) => {
    if (ev.target instanceof HTMLElement) {
        if (nav.root) {
            const pivot = nav.root.previousElementSibling;
            const confButton = nav.root.nextElementSibling;
            const pivotCell = Array.from(pivot instanceof HTMLElement ? pivot.querySelectorAll('[tabindex]') : []).find((c) => c.tabIndex >= 0);
            if (pivotCell instanceof HTMLElement) {
                pivotCell.focus();
                if (confButton instanceof HTMLElement) {
                    confButton.click();
                }
            }
        }
    }
};
const navigate = (target, nav, ev, dir) => {
    ev.preventDefault();
    const all = nav.elements;
    let index = all.indexOf(target) + dir;
    if (index < 0) {
        index = all.length - 1;
    }
    nav.focusElement(all[index % all.length], target);
};
const onDelete = (target, nav, ev) => {
    if (ev.target instanceof HTMLElement) {
        const deleteButton = ev.target.querySelector('.k-icon.k-i-x-circle, .k-svg-icon.k-svg-i-x-circle');
        if (deleteButton instanceof HTMLElement) {
            ev.preventDefault();
            navigate(target, nav, ev, -1);
        }
    }
};
const keyboardEvents = {
    keydown: {
        Tab: (target, nav, ev) => {
            navigate(target, nav, ev, ev.shiftKey ? -1 : 1);
        },
        Escape: onEscape,
        Delete: onDelete,
        Backspace: onDelete
    }
};
const mouseEvents = {
    click: (target, nav) => {
        if (target && target instanceof HTMLElement) {
            const prev = nav.elements.find((c) => c.hasAttribute('tabindex')) || null;
            nav.focusElement(target, prev);
        }
    }
};
/**
 * The PivotGrid Configurator keyboard navigation functionality.
 *
 * Usage:
 *
 * On Initialize
 * const navigation = new ConfiguratorNavigation({ tabindex: 0 });
 *
 * Turn on
 * navigation.start(rootDomElement);
 *
 * On After Update
 * navigation.update();
 *
 * On Destroy / Turn off
 * navigation.stop();
 */
class ConfiguratorNavigation extends Navigation {
    constructor() {
        super(...arguments);
        this.selectors = selectors;
        this.mouseEvents = mouseEvents;
        this.keyboardEvents = keyboardEvents;
    }
}

var __meta__ = {
    id: "pivot.configurator",
    name: "PivotConfigurator",
    category: "web",
    depends: [ "dropdownlist", "treeview", "treeview.draganddrop", "pivot.fieldmenu", "html.chip", "html.chiplist", "pivot.common", "icons" ],
    hidden: true
};


(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui,
        encode = kendo.htmlEncode,
        Widget = ui.Widget,
        common = window.kendo.pivotgrid.common,
        fetchDiscover = common.fetchDiscover,
        configuratorReducer = common.configuratorReducer,
        PIVOT_CONFIGURATOR_ACTION = common.PIVOT_CONFIGURATOR_ACTION,
        ns = ".kendoPivotConfigurator",
        HOVER_EVENTS = "mouseenter" + ns + " mouseleave" + ns,
        SETTINGS_TEMPLATE = ({ title, headerTextId }) => '<div class="k-pivotgrid-configurator-header">' +
                                            `<div class="k-pivotgrid-configurator-header-text" id="${headerTextId}">${encode(title)}</div>` +
                                          '</div>',
        CONTENT_TEMPLATE = ({ formClass, horizontal, ariaId }) => '<div class="k-pivotgrid-configurator-content">' +
            `<form class="${encode(formClass)}">` +
                `${horizontal ? '<div class="k-form-field-wrapper">' : ''}` +
                '<div class="k-form-field">' +
                    `<label class="k-label" id="${ariaId}-configurator-fields">Fields</label>` +
                '</div>' +
                '<div class="k-form-field">' +
                  '<div class="k-fields-list-wrapper"></div>' +
                '</div>' +
                `${horizontal ? '</div><div class="k-form-field-wrapper">' : ''}` +
                '<div class="k-form-field">' +
                    `<label class="k-label" id="${ariaId}-configurator-columns">Columns</label>` +
                '</div>' +
                '<div class="k-chip-list k-column-fields"></div>' +
                '<div class="k-form-field">' +
                    `<label class="k-label" id="${ariaId}-configurator-rows">Rows</label>` +
                '</div>' +
                '<div class="k-chip-list k-row-fields"></div>' +
                `${horizontal ? '</div><div class="k-form-field-wrapper">' : ''}` +
                '<div class="k-form-field">' +
                    `<label class="k-label" id="${ariaId}-configurator-values">Values</label>` +
                '</div>' +
                '<div class="k-chip-list k-column-fields"></div>' +
                `${horizontal ? '</div>' : ''}` +
            '</form>' +
        '</div>',
        TARGET_ITEM_TEMPLATE = ({ name }) => '<span>' +
                `<span class="k-chip-label">${encode(name)}</span>` +
            '</span>',
        ACTIONS_TEMPLATE = ({ cancelText, applyText }) =>
                '<div class="k-pivotgrid-configurator-actions k-actions k-hstack k-justify-content-end">' +
                  '<button class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" aria-disabled="false">' +
                    `<span class="k-button-text">${encode(cancelText)}</span>` +
                  '</button>' +
                  '<button class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" aria-disabled="false">' +
                    `<span class="k-button-text">${encode(applyText)}</span>` +
                  '</button>' +
                '</div>',
        SETTING_CONTAINER_TEMPLATE = ({ name }) => `<div class="k-pivotgrid-target k-pivotgrid-configurator-section"><strong>${encode(name)}</strong><div class="k-pivotgrid-target-wrap"></div>`;

    function addKPI(data) {
        var found;
        var idx = 0;
        var length = data.length;

        for (; idx < length; idx++) {
            if (data[idx].type == 2) {
                found = true;
                break;
            }
        }

        if (found) {
            data.splice(idx + 1, 0, {
                caption: "KPIs",
                defaultHierarchy: "[KPIs]",
                name: "KPIs",
                uniqueName: "[KPIs]"
            });
        }
    }

    function kpiNode(node) {
        return {
            name: node.uniqueName,
            type: node.type
        };
    }

    function normalizeKPIs(data) {
        for (var idx = 0, length = data.length; idx < length; idx++) {
            data[idx].uniqueName = data[idx].name;
            data[idx].type = "kpi";
        }

        return data;
    }

    function settingTargetFromNode(node) {
        var target = $(node).closest(".k-pivot-setting");

        if (target.length) {
            return target.data("kendoPivotSettingTarget");
        }
        return null;
    }

    function getIcons(sortIcon, options) {
        var sortable = options.sortable;
        var result = '';

        if (sortable) {
            result += sortIcon ? `<span class="k-chip-action">${kendo.ui.icon(sortIcon + "-sm")}</span>` : '';
        }

        if (options.filterable || sortable) {
            result += `<span class="k-setting-fieldmenu k-chip-action">${kendo.ui.icon("more-vertical")}</span>`;
        }

        result += `<span class="k-setting-delete k-chip-action">${kendo.ui.icon("x")}</span>`;

        return result;
    }

    var PivotConfiguratorV2 = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);

            this._ariaId = this.element.attr("id") || kendo.guid();
            this.element.addClass("k-widget k-pivotgrid-configurator k-pos-relative");
            this.element.attr({
                "role": "dialog",
                "aria-hidden": true,
                "aria-labelledby": `${this._ariaId}-configurator-header`
            });

            this._dataSource();

            if (this.options.navigatable) {
                this._initPivotGridConfiguratorNavigation();
            }

            this._layout();

            this.refresh();

            if (options.height) {
                this.element.height(options.height);
            }

            kendo.notify(this);
        },

        events: [],

        options: {
            name: "PivotConfiguratorV2",
            orientation: "vertical",
            filterable: false,
            sortable: false,
            messages: {
                title: "Settings",
                cancelButtonText: "Cancel",
                applyButtonText: "Apply",
                measures: "Select some fields to begin setup",
                columns: "Select some fields to begin setup",
                rows: "Select some fields to begin setup"
            }
        },

        setDataSource: function(dataSource) {
            this.options.dataSource = dataSource;

            this._dataSource();

            if (this.measures) {
                this.measures.setDataSource(dataSource);
            }

            if (this.rows) {
                this.rows.setDataSource(dataSource);
            }

            if (this.columns) {
                this.columns.setDataSource(dataSource);
            }

            this.refresh();
        },

        _initPivotGridConfiguratorNavigation: function() {
            var that = this;
            that.configuratorNavigation = new ConfiguratorNavigation({ tabIndex: 0 });
            that.configuratorNavigation.start(that.element[0]);

            const firstCell = that.configuratorNavigation.first;

            if (firstCell) {
                firstCell.setAttribute('tabindex', '0');
            }
        },

        _dataSource: function() {
            var that = this;

            if (that.dataSource && that._refreshHandler) {
                that.dataSource.unbind("change", that._refreshHandler)
                               .unbind("error", that._errorHandler)
                               .unbind("progress", that._progressHandler);
            } else {
                that._errorHandler = that._error.bind(that);
                that._refreshHandler = that.refresh.bind(that);
                that._progressHandler = that._requestStart.bind(that);
            }

            that.dataSource = kendo.data.PivotDataSourceV2.create(that.options.dataSource);
            that.dataSource.bind("change", that._refreshHandler)
                           .bind("error", that._errorHandler)
                           .bind("progress", that._progressHandler);
        },

        _layout: function() {

            var that = this;
            var options = that.options;
            var messages = options.messages;
            var horizontal = options.orientation == "horizontal";

            var panel = $("<div class='k-pivotgrid-configurator-panel k-pivotgrid-configurator-push'></div>");

            panel.addClass(horizontal ? "k-pivotgrid-configurator-horizontal" : "k-pivotgrid-configurator-vertical");

            that.element.append(panel);

            that.panel = panel;

            $(SETTINGS_TEMPLATE({ title: this.options.messages.title, headerTextId: `${that._ariaId}-configurator-header` })).appendTo(that.panel);

            $(CONTENT_TEMPLATE({ formClass: horizontal ? "k-form k-form-horizontal" : "k-form", filterable: options.filterable, horizontal: horizontal, ariaId: that._ariaId }))
                .appendTo(that.panel).find(".k-chip-list")
                .each(function(index, elm) {
                    kendo.html.renderChipList(elm, $.extend({}, options));
                    $(elm).attr({
                        "role": "listbox",
                        "aria-orientation": "horizontal",
                    });
                });

            that._fields();
            $(ACTIONS_TEMPLATE({ cancelText: messages.cancelButtonText, applyText: messages.applyButtonText })).appendTo(that.panel);
            that._targets();

            that.element.on("click" + ns, ".k-pivotgrid-configurator-actions > button", that._actions.bind(that));
        },

        _actions: function(e) {
            e.preventDefault();

            var target = $(e.currentTarget).closest(":not(path,svg)");
            if (target.index()) {
                this.columns._applyState();
                this.rows._applyState();
                this.measures._applyState();
                this.dataSource.read();
            } else {
                this.columns._cancelChanges();
                this.rows._cancelChanges();
                this.measures._cancelChanges();
                this.treeView.dataSource.read();
            }
        },

        _targets: function() {
            var that = this;
            var columns = that.panel.find(".k-column-fields").first();
            var rows = that.panel.find(".k-row-fields");
            var measures = that.panel.find(".k-chip-list").last();
            var options = this.options;

            var targetItemTemplate = ({ name, menuenabled }) => {
                    var chip = kendo.html.renderChip(TARGET_ITEM_TEMPLATE({ name, menuenabled }), $.extend({}, options, {
                        fillMode: "solid",
                        themeColor: "base",
                        rounded: "full",
                        removable: true,
                        removeIcon: "x-circle",
                        actions: menuenabled ? [
                            { icon: "more-vertical" }
                        ] : null
                    }));

                    return chip;
                };

            this.columns = this._createTarget(columns, {
                navigatable: options.navigatable,
                filterable: options.filterable,
                sortable: options.sortable,
                template: targetItemTemplate,
                connectWith: rows,
                messages: {
                    empty: options.messages.columns,
                    fieldMenu: this.options.messages.fieldMenu
                },
                configuratorNavigation: that.configuratorNavigation
            });
            this.columns.element.attr("aria-labelledby", `${this._ariaId}-configurator-header ${this._ariaId}-configurator-columns`);

            this.rows = this._createTarget(rows, {
                navigatable: options.navigatable,
                filterable: options.filterable,
                sortable: options.sortable,
                template: targetItemTemplate,
                setting: "rows",
                connectWith: columns,
                messages: {
                    empty: this.options.messages.rows,
                    fieldMenu: this.options.messages.fieldMenu
                },
                configuratorNavigation: that.configuratorNavigation
            });
            this.rows.element.attr("aria-labelledby", `${this._ariaId}-configurator-header ${this._ariaId}-configurator-rows`);

            this.measures = this._createTarget(measures, {
                navigatable: options.navigatable,
                filterable: false,
                sortable: false,
                setting: "measures",
                template: targetItemTemplate,
                messages: {
                    empty: options.messages.measures,
                    fieldMenu: this.options.messages.fieldMenu
                },
                configuratorNavigation: that.configuratorNavigation
            });

            this.measures.element.attr("aria-labelledby", `${this._ariaId}-configurator-header ${this._ariaId}-configurator-values`);

            [this.columns, this.rows, this.measures].forEach(x=> x.element.find(".k-chip").attr("role", "option"));
        },

        _createTarget: function(element, options) {
            var that = this;
            return new kendo.ui.PivotSettingTargetV2(element, $.extend({
                dataSource: this.dataSource,
                hint: function(element) {
                    return element.clone();
                },
                remove: function(e) {
                    var item = that.treeView.wrapper
                        .find("[data-name='" + e.name + "']")
                        .closest("li");
                    var id = item.attr(kendo.attr("uid"));
                    var dataItem = that.treeView.dataSource.getByUid(id);

                    if (dataItem) {
                        dataItem.checked = false;
                        item.find("input").attr("checked", false);
                    }
                },
                template: options.template
            }, options));
        },

        _fields: function() {
            var that = this;
            var container = that.element.find(".k-fields-list-wrapper");

            this.treeView = $(`<div aria-labelledby="${this._ariaId}-configurator-header ${this._ariaId}-configurator-fields" />`).appendTo(container)
                .kendoTreeView({
                    checkboxes: {
                        checkChildren: true,
                        template: ({ item }) => {
                            var result = '';

                            if ((item.hasChildren || item.aggregator || item.local) && item.uniqueName !== "[KPIs]" && item.uniqueName !== "[Measures]" && item.uniqueName !== "Measures") {
                                result += `<input type="checkbox" data-name="${encode(item.uniqueName)}" ${item.checked ? "checked" : ""} class="k-checkbox k-checkbox-md k-rounded-md" id="${encode(item.uid)}" tabindex="-1">`;
                            }

                            return result;
                        }
                    },
                    dataTextField: "caption",
                    autoBind: false,
                    check: function(e) {
                      var dataItem = e.sender.dataItem(e.node);
                      var action = {
                        type: PIVOT_CONFIGURATOR_ACTION.toggleSelection,
                        payload: dataItem
                      };
                      var state = {
                        columnAxes: that.columns._state(),
                        rowAxes: that.rows._state(),
                        measureAxes: that.measures._state()
                      };
                      var result = configuratorReducer(state, action);

                      if (that.dataSource.cubeSchema && result.measureAxes && result.measureAxes.length &&
                        result.measureAxes.length > state.measureAxes.length) {
                          that.dataSource.cubeSchema.restoreMeasure(result.measureAxes, dataItem);
                      }

                      if (dataItem.defaultHierarchy && dataItem.items && dataItem.items.length) {
                          that._checkMembers([{ name: dataItem.defaultHierarchy }], dataItem.items);
                          dataItem.items.trigger("change");
                      }

                      if (result.columnAxes) {
                          that.columns._state(result.columnAxes);
                          that.columns._redraw();
                      }
                      if (result.rowAxes) {
                          that.rows._state(result.rowAxes);
                          that.rows._redraw();
                      }
                      if (result.measureAxes) {
                          that.measures._state(result.measureAxes);
                          that.measures._redraw();
                      }
                    },
                    dataSource: this._treeViewDataSource()
                 })
                .data("kendoTreeView");

            this.treeView.wrapper.off("click", this.treeView._clickHandler);
        },

        _treeViewDataSource: function() {
            var that = this;

            return kendo.data.HierarchicalDataSource.create({
                schema: {
                    model: {
                        id: "uniqueName",
                        hasChildren: function(item) {
                            if (that.dataSource.cubeSchema && item.uniqueName !== "Measures") {
                                item.local = true;
                                return false;
                            }
                            return !("hierarchyUniqueName" in item) && !("aggregator" in item);
                        }
                    }
                },
                transport: {
                    read: function(options) {
                        var node;
                        var transport = that.dataSource.transport;
                        var catalog = transport.catalog();
                        var cube = transport.cube();
                        var fetchOptions = {
                            url: transport.options.read
                        };
                        var columns = that.columns._state();
                        var rows = that.rows._state();
                        var measures = that.measures._state();
                        var members = columns.concat(rows).concat(measures);
                        var fields;
                        var dsMeasures;
                        var fetchOpts;

                        if ($.isEmptyObject(options.data)) {
                            if (that.dataSource.cubeSchema) {
                                fields = that.dataSource.cubeSchema.dimensions();
                                that._checkMembers(members, fields);
                                options.success(fields);
                            } else {
                                fetchOpts = {
                                    connection: {
                                        catalog: catalog,
                                        cube: cube
                                    },
                                    restrictions: {
                                        catalogName: catalog,
                                        cubeName: cube
                                    },
                                    command: 'schemaDimensions'
                                };

                                fetchDiscover(fetchOptions, fetchOpts)
                                    .then(function(newFields) {
                                        that._checkMembers(members, newFields);
                                        addKPI(newFields);
                                        options.success(newFields);
                                     });
                            }
                        } else {
                            //Hack to get the actual node as the HierarchicalDataSource does not support passing it
                            node = that.treeView.dataSource.get(options.data.uniqueName);

                            if (that.dataSource.cubeSchema) {
                                dsMeasures = that.dataSource.measures();
                                that._checkMembers(members, dsMeasures);
                                options.success(dsMeasures);
                            } else {
                                if (node.uniqueName === "[KPIs]") {
                                    fetchDiscover(fetchOptions, that._getKPIOptions(catalog, cube))
                                    .then(function(newFields) {
                                        options.success(normalizeKPIs(newFields));
                                    });
                                } else if (node.type == "kpi") {
                                    options.success(buildKPImeasures(node));
                                } else {
                                    fetchDiscover(fetchOptions ,that._loadFieldsCommand(node, catalog, cube))
                                    .then(function(newFields) {
                                        that._checkMembers(members, newFields);
                                        options.success(newFields);
                                    });
                                }
                            }
                        }
                    }
                }
            });
        },

        _checkMembers: function(members, newData) {
            var hash = {};
            var index = 0;

            for (index = 0; index < members.length; index++) {
                hash[members[index].name] = true;
            }

            for (index = 0; index < newData.length; index++) {
                if (hash[newData[index].uniqueName]) {
                    newData[index].checked = true;
                }
            }
        },

        _getKPIOptions: function(catalog, cube) {
            return {
                connection: {
                    catalog: catalog,
                    cube: cube
                },
                restrictions: {
                    catalogName: catalog,
                    cubeName: cube
                },
                command: 'schemaKPIs'
            };
        },

        _loadFieldsCommand: function(field, catalog, cube) {
            var command;
            var dimensionUniqueName;
            var hierarchyUniqueName;

            if (field.type === 2) {
                command = 'schemaMeasures';
            } else if (field.dimensionUniqueName) {
                command = 'schemaLevels';
                hierarchyUniqueName = field.uniqueName;
            } else {
                command = 'schemaHierarchies';
                dimensionUniqueName = field.uniqueName;
            }

            var options = {
                connection: {
                    catalog: catalog,
                    cube: cube
                },
                restrictions: {
                    catalogName: catalog,
                    cubeName: cube,
                    hierarchyUniqueName: hierarchyUniqueName,
                    dimensionUniqueName: dimensionUniqueName
                },
                command: command
            };

            return options;
        },

        _progress: function(toggle) {
            kendo.ui.progress(this.element, toggle);
        },

        _error: function() {
            this._progress(false);
        },

        _requestStart: function() {
            this._progress(true);
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            this.dataSource.unbind("change", this._refreshHandler);

            this.element.off(ns);

            this.rows.destroy();
            this.columns.destroy();
            this.measures.destroy();
            this.treeView.destroy();

            this.element = null;
            this._refreshHandler = null;
        },

        refresh: function() {
            if (this.treeView) {
                this.treeView.dataSource.fetch();
            }

            this._progress(false);
        }

    });

    ui.plugin(PivotConfiguratorV2);

    var PivotConfigurator = Widget.extend({
        init: function(element, options) {
            Widget.fn.init.call(this, element, options);

            this.element.addClass("k-pivotgrid-configurator-panel kendo-jquery");

            if (this.options.height) {
                this.element.outerHeight(this.options.height);
            }

            this._dataSource();

            this._layout();

            this.refresh();

            kendo.notify(this);
        },

        events: [],

        options: {
            name: "PivotConfigurator",
            filterable: false,
            sortable: false,
            messages: {
                measures: "Drop Data Fields Here",
                columns: "Drop Column Fields Here",
                rows: "Drop Rows Fields Here",
                measuresLabel: "Measures",
                columnsLabel: "Columns",
                rowsLabel: "Rows",
                fieldsLabel: "Fields"
            }
        },

        _dataSource: function() {
            var that = this;

            if (that.dataSource && that._refreshHandler) {
                that.dataSource.unbind("change", that._refreshHandler)
                               .unbind("error", that._errorHandler)
                               .unbind("progress", that._progressHandler);
            } else {
                that._errorHandler = that._error.bind(that);
                that._refreshHandler = that.refresh.bind(that);
                that._progressHandler = that._requestStart.bind(that);
            }

            that.dataSource = kendo.data.PivotDataSource.create(that.options.dataSource);
            that.dataSource.bind("change", that._refreshHandler)
                           .bind("error", that._errorHandler)
                           .bind("progress", that._progressHandler);
        },

        setDataSource: function(dataSource) {
            this.options.dataSource = dataSource;

            this._dataSource();

            if (this.measures) {
                this.measures.setDataSource(dataSource);
            }

            if (this.rows) {
                this.rows.setDataSource(dataSource);
            }

            if (this.columns) {
                this.columns.setDataSource(dataSource);
            }

            this.refresh();
        },

        _treeViewDataSource: function() {
            var that = this;

            return kendo.data.HierarchicalDataSource.create({
                schema: {
                    model: {
                        id: "uniqueName",
                        hasChildren: function(item) {
                            return !("hierarchyUniqueName" in item) && !("aggregator" in item);
                        }
                    }
                },
                transport: {
                    read: function(options) {
                        var promise;
                        var node;
                        var kpi;

                        if ($.isEmptyObject(options.data)) {
                            promise = that.dataSource.schemaDimensions();

                            promise.done(function(data) {
                                        if (!that.dataSource.cubeBuilder) {
                                            addKPI(data);
                                        }
                                        options.success(data);
                                    })
                                    .fail(options.error);
                        } else {
                            //Hack to get the actual node as the HierarchicalDataSource does not support passing it
                            node = that.treeView.dataSource.get(options.data.uniqueName);

                            if (node.uniqueName === "[KPIs]") {
                                kpi = true;
                                promise = that.dataSource.schemaKPIs();
                                promise.done(function(data) {
                                            options.success(normalizeKPIs(data));
                                       })
                                       .fail(options.error);
                            } else if (node.type == "kpi") {
                                kpi = true;
                                options.success(buildKPImeasures(node));
                            }

                            if (!kpi) {
                                if (node.type == 2) { //measure
                                    promise = that.dataSource.schemaMeasures();
                                } else if (node.dimensionUniqueName) { // hierarchy
                                    promise = that.dataSource.schemaLevels(options.data.uniqueName);
                                } else { // dimension
                                    promise = that.dataSource.schemaHierarchies(options.data.uniqueName);
                                }

                                promise.done(options.success)
                                        .fail(options.error);
                            }
                        }
                    }
                }
            });
        },

        _progress: function(toggle) {
            kendo.ui.progress(this.element, toggle);
        },

        _error: function() {
            this._progress(false);
        },

        _requestStart: function() {
            this._progress(true);
        },

        _layout: function() {
            $('<div class="k-pivotgrid-configurator"><div class="k-pivotgrid-configurator-content"></div></div>').appendTo(this.element);
            this.form = this.element.find('.k-pivotgrid-configurator-content');

            this._fields();
            this._targets();
        },

        _fields: function() {
            var container = $('<div class="k-pivotgrid-fields k-pivotgrid-configurator-section"><strong>' + encode(this.options.messages.fieldsLabel) + '</strong><div class="k-fields-list-wrapper"></div></div>').appendTo(this.form);

            var template = ({ item }) => {
                var result = '';

                if (item.type == 2 || item.uniqueName == "[KPIs]") {
                    result += kendo.ui.icon(item.type == 2 ? "sum" : "caret-alt-expand"/* "kpi" */);
                } else if (item.type && item.type !== "kpi") {
                    result += kendo.ui.icon("arrows-axes");
                }

                result += `${encode(item.caption || item.name)}`;

                return result;
            };

            this.treeView = $("<div/>").appendTo(container.find('.k-fields-list-wrapper'))
                .kendoTreeView({
                    template: template,
                    dataTextField: "caption",
                    dragAndDrop: true,
                    autoBind: false,
                    dataSource: this._treeViewDataSource(),
                    dragstart: function(e) {
                        var dataItem = this.dataItem(e.sourceNode);

                        if ((!dataItem.hasChildren && !dataItem.aggregator && !dataItem.measure) || (dataItem.type == 2) || dataItem.uniqueName === "[KPIs]") {
                            e.preventDefault();
                        }
                    },
                    drag: function(e) {
                        var status = "cancel";
                        var setting = settingTargetFromNode(e.dropTarget);

                        if (setting && setting.validate(this.dataItem(e.sourceNode))) {
                            status = "plus";
                        }

                        e.setStatusClass(status);
                    },
                    drop: function(e) {
                        e.preventDefault();

                        var setting = settingTargetFromNode(e.dropTarget);
                        var node = this.dataItem(e.sourceNode);
                        var idx, length, measures;
                        var name;

                        if (setting && setting.validate(node)) {
                            name = node.defaultHierarchy || node.uniqueName;

                            if (node.type === "kpi") {
                                measures = buildKPImeasures(node);
                                length = measures.length;
                                name = [];

                                for (idx = 0; idx < length; idx++) {
                                    name.push(kpiNode(measures[idx]));
                                }
                            } else if (node.kpi) {
                                name = [kpiNode(node)];
                            }

                            setting.add(name);
                        }
                    }
                 })
                .data("kendoTreeView");
        },

        _createTarget: function(element, options) {
            var template;

            template = ({ name, sortIcon }) => ''
                + `<div class="k-chip k-chip-md k-rounded-full k-chip-solid k-chip-solid-base" data-${kendo.ns}name="${name}">`
                    + '<span class="k-chip-content">'
                        + `<span class="k-chip-label">${name}</span>`
                    + '</span>'
                    + '<span class="k-chip-actions k-field-actions">'
                    + getIcons(sortIcon, options)
                    + '</span>'
                + '</div>';

            return new kendo.ui.PivotSettingTarget(element, $.extend({
                dataSource: this.dataSource,
                template: template,
                emptyTemplate: (data) => `<span class="k-empty">${data}</span>`
            }, options));
        },

        _targets: function() {
            var container = $('<div class="k-pivotgrid-targets"/>').appendTo(this.form);

            var columnsContainer = $(SETTING_CONTAINER_TEMPLATE({ name: this.options.messages.columnsLabel, icon: "columns" })).appendTo(container);
            var columns = $('<div class="k-column-fields k-chip-list" />').appendTo(columnsContainer.find('.k-pivotgrid-target-wrap'));

            var rowsContainer = $(SETTING_CONTAINER_TEMPLATE({ name: this.options.messages.rowsLabel, icon: "rows" })).appendTo(container);
            var rows = $('<div class="k-column-fields k-chip-list" />').appendTo(rowsContainer.find('.k-pivotgrid-target-wrap'));

            var measuresContainer = $(SETTING_CONTAINER_TEMPLATE({ name: this.options.messages.measuresLabel, icon: "sum" })).appendTo(container);
            var measures = $('<div class="k-column-fields k-chip-list" />').appendTo(measuresContainer.find('.k-pivotgrid-target-wrap'));

            var options = this.options;

            this.columns = this._createTarget(columns, {
                filterable: options.filterable,
                sortable: options.sortable,
                connectWith: rows,
                messages: {
                    empty: options.messages.columns,
                    fieldMenu: options.messages.fieldMenu
                }
            });

            this.rows = this._createTarget(rows, {
                filterable: options.filterable,
                sortable: options.sortable,
                setting: "rows",
                connectWith: columns,
                messages: {
                    empty: this.options.messages.rows,
                    fieldMenu: this.options.messages.fieldMenu
                }
            });

            this.measures = this._createTarget(measures, {
                setting: "measures",
                messages: {
                    empty: options.messages.measures
                }
            });

            columns
                .add(rows)
                .add(measures)
                .on(HOVER_EVENTS, ".k-item:not(.k-empty)", this._toggleHover);
        },

        _toggleHover: function(e) {
            $(e.currentTarget).closest(":not(path,svg)").toggleClass("k-hover", e.type === "mouseenter");
        },

        _resize: function() {
            var element = this.element;
            var height = this.options.height;

            if (!height) {
                return;
            }

            element.outerHeight(height);
        },

        refresh: function() {
            var dataSource = this.dataSource;

            if (dataSource.cubeBuilder || this._cube !== dataSource.cube() || this._catalog !== dataSource.catalog()) {
                this.treeView.dataSource.fetch();
            }

            this._catalog = this.dataSource.catalog();
            this._cube = this.dataSource.cube();

            this._resize();

            this._progress(false);
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            this.dataSource.unbind("change", this._refreshHandler);

            this.form.find(".k-pivot-setting").off(ns);

            this.rows.destroy();
            this.columns.destroy();
            this.measures.destroy();
            this.treeView.destroy();

            this.element = null;
            this._refreshHandler = null;
        }
    });

    function kpiMeasure(name, measure, type) {
        return {
            hierarchyUniqueName: name,
            uniqueName: measure,
            caption: measure,
            measure: measure,
            name: measure,
            type: type,
            kpi: true
        };
    }

    function buildKPImeasures(node) {
        var name = node.name;
        return [
            kpiMeasure(name, node.value, "value"),
            kpiMeasure(name, node.goal, "goal"),
            kpiMeasure(name, node.status, "status"),
            kpiMeasure(name, node.trend, "trend")
        ];
    }

    kendo.cssProperties.registerPrefix("HTMLChip", "k-chip-");

    kendo.cssProperties.registerValues("HTMLChip", [{
        prop: "rounded",
        values: kendo.cssProperties.roundedValues.concat([['full', 'full']])
    }]);

    ui.plugin(PivotConfigurator);

})(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
