import './kendo.dom.js';
import './kendo.data.js';
import './kendo.columnsorter.js';
import './kendo.editable.js';
import './kendo.window.js';
import './kendo.filtermenu.js';
import './kendo.columnmenu.js';
import './kendo.selectable.js';
import './kendo.resizable.js';
import './kendo.treeview.draganddrop.js';
import './kendo.pager.js';
import './kendo.filtercell.js';
import './kendo.textbox.js';
import './kendo.form.js';
import './kendo.toolbar.js';
import './kendo.icons.js';
import './kendo.reorderable.js';
import './kendo.excel.js';
import './kendo.pdf.js';
import './kendo.menu.js';

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui,
        ContextMenu = ui.ContextMenu,
        extend = $.extend,
        encode = kendo.htmlEncode;

    var ACTION = "action";

    var TreeListContextMenu = ContextMenu.extend({
        init: function(element, options) {
            var that = this;

            ContextMenu.fn.init.call(that, element, options);

            that._overrideTemplates();
            that._extendItems();

            that.bind("select", that._onSelect.bind(that));
            that.bind("open", that._onOpen.bind(that));
        },

        _overrideTemplates: function() {
            this.templates.sprite = ({ icon, spriteCssClass }) => `${(icon || spriteCssClass) ? kendo.ui.icon({ icon: encode(icon || ""), iconClass: encode(spriteCssClass || "") }) : ''}`;
        },

        defaultItems: {
            "separator": { name: "separator", separator: true },
            "create": { name: "create", text: "Add", icon: "plus", command: "AddCommand", rules: "isEditable" },
            "createChild": { name: "createChild", text: "Add Child", icon: "plus", command: "CreateChildCommand", rules: "isEditable" },
            "edit": { name: "edit", text: "Edit", icon: "pencil", command: "EditCommand", rules: "isEditable" },
            "destroy": { name: "destroy", text: "Delete", icon: "trash", command: "DeleteCommand", rules: "isEditable" },
            "select": { name: "select", text: "Select", icon: "table-body", rules: "isSelectable", items: [
                { name: "selectRow", text: "Row", icon: "table-row-groups", command: "SelectRowCommand" },
                { name: "selectAllRows", text: "All rows", icon: "grid", command: "SelectAllRowsCommand", softRules: "isMultiRowSelectionEnabled" },
                { name: "clearSelection", text: "Clear selection", icon: "table-unmerge", softRules: "hasSelection", command: "ClearSelectionCommand" },
            ] },
            "exportPDF": { name: "exportPDF", text: "Export to PDF", icon: "file-pdf", command: "ExportPDFCommand" },
            "exportExcel": { name: "exportExcel", text: "Export to Excel", icon: "file-excel", command: "ExportExcelCommand" },
            "sortAsc": { name: "sortAsc", text: "Sort Ascending", icon: "sort-asc-small", rules: "isSortable", command: "SortCommand", options: "dir:asc" },
            "sortDesc": { name: "sortDesc", text: "Sort Descending", icon: "sort-desc-small", rules: "isSortable", command: "SortCommand", options: "dir:desc" },
            "expandItem": { name: "expandItem", text: "Expand Item", icon: "folder-open", softRules: "isExpandable", command: "ToggleItemCommand", options: "expand:true" },
            "collapseItem": { name: "collapseItem", text: "Collapse Item", icon: "folder", softRules: "isCollapsible", command: "ToggleItemCommand", options: "expand:false" }
        },

        events: ContextMenu.fn.events.concat([
            ACTION
        ]),

        _onSelect: function(ev) {
            var command = $(ev.item).data("command");
            var options = $(ev.item).data("options");
                options = options ? options.split(",")
                .map(val => {
                    if (val.indexOf(":") > -1) {
                        var [key, val] = val.split(":");
                        return { [key || "_"]: val };
                    }

                    return { [val]: true };
                })
                .reduce((acc, v) => Object.assign(acc, v), {}) : {};

            var target = $(ev.target);

            if (!command) {
                return;
            }

            this.action({
                command: command,
                options: Object.assign(options, { target: target })
            });
        },

        _onOpen: function(ev) {
            var menu = ev.sender,
                items = menu.options.items,
                elTarget = $(ev.event ? ev.event.target : null);

            if ((!items && $.isEmptyObject(this.defaultItems)) || elTarget.closest(".k-grid-column-menu").length) {
                ev.preventDefault();
                return;
            }

            this._toggleSeparatorVisibility();

            menu.element.find(`[${kendo.attr('soft-rules')}]`).each((i, item) => {
                var rules = $(item).attr(kendo.attr('soft-rules')).split(";");
                menu.enable(item, this._validateSoftRules(rules, elTarget));
            });
        },

        _toggleSeparatorVisibility: function() {
            var that = this,
                items = that.element.find(".k-item.k-separator").filter((i, item) => {
                    var prev = $(item).prev(".k-item:not(.k-separator)");
                    var next = $(item).next(".k-item:not(.k-separator)");

                    return !(prev.length && next.length);
                });

            items.hide();
        },

        _extendItems: function() {
            var that = this,
                items = that.options.items,
                item, isBuiltInTool;

            if (items && items.length) {
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    isBuiltInTool = $.isPlainObject(item) && Object.keys(item).length === 1 && item.name;

                    if (isBuiltInTool) {
                        item = item.name;
                    }

                    if ($.isPlainObject(item)) {
                        that._append(item);
                    } else if (that.defaultItems[item]) {
                        item = that.defaultItems[item];
                        that._append(item);
                    } else if (typeof(item) === "string") {
                        item = { name: item, text: item, spriteCssClass: item, command: item + "Command" };
                        that._append(item);
                    }
                }
            } else {
                for (var key in that.defaultItems) {
                    item = that.defaultItems[key];
                    that._append(item);
                }
            }
        },

        _extendItem: function(item) {
            var that = this,
                messages = that.options.messages,
                attr = item.attr || {};

            if (item.command) {
                attr[kendo.attr("command")] = item.command;
            }

            if (item.options) {
                attr[kendo.attr("options")] = item.options;
            }

            if (item.softRules) {
                attr[kendo.attr("soft-rules")] = item.softRules;
            }

            if (item.items) {
                for (var j = 0; j < item.items.length; j++) {
                    item.items.forEach(subItem => {
                        that._extendItem(subItem);
                    });
                }
            }

            extend(item, {
                text: messages.commands[item.name],
                icon: item.icon || "",
                spriteCssClass: item.spriteCssClass || "",
                attr: attr,
                uid: kendo.guid()
            });
        },

        _validateSoftRules: function(rules, target) {
            var that = this;

            if (!rules || !(rules && rules.length)) {
                return true;
            }

            for (var i = 0; i < rules.length; i++) {
                if (!this._readState(rules[i], target)) {
                    return false;
                }
            }

            return true;
        },

        _validateRules: function(tool) {
            var that = this,
                rules = tool.rules ? tool.rules.split(";") : [];

            if (!rules.length) {
                return true;
            }

            for (var i = 0; i < rules.length; i++) {
                if (!this._readState(rules[i])) {
                    return false;
                }
            }

            return true;
        },

        _readState: function(state, target) {
            var that = this,
                states = that.options.states;

            if (kendo.isFunction(states[state])) {
                return states[state](target);
            } else {
                return states[state];
            }
        },

        _append: function(item) {
            var that = this;

            that._extendItem(item);

            if (that._validateRules(item)) {
                that.append(item);
            }
        },

        action: function(args) {
            this.trigger(ACTION, args);
        }
    });

    kendo.ui.treelist = kendo.ui.treelist || {};

    extend(kendo.ui.treelist, {
        ContextMenu: TreeListContextMenu
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        extend = $.extend,
        Class = kendo.Class;

    var Command = Class.extend({
        init: function(options) {
            this.options = options;
            this.treelist = options.treelist;
        }
    });

    var SortCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                dataSource = treelist.dataSource,
                sort = dataSource.sort() || [],
                options = that.options,
                dir = options.dir,
                field = options.target.attr(kendo.attr("field")),
                multipleMode = treelist.options.sortable.mode && treelist.options.sortable.mode === "multiple",
                compare = treelist.options.compare,
                length, idx;

            if (multipleMode) {
                for (idx = 0, length = sort.length; idx < length; idx++) {
                    if (sort[idx].field === field) {
                        sort.splice(idx, 1);
                        break;
                    }
                }
                sort.push({ field: field, dir: dir, compare: compare });
            } else {
                sort = [{ field: field, dir: dir, compare: compare }];
            }

            dataSource.sort(sort);
        },
    });

    var AddCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist;

            treelist.addRow();
        }
    });

    var CreateChildCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                target = that.options.target.closest("tr");

            treelist.addRow(target);
        }
    });

    var EditCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                inCellMode = treelist._editMode() === "incell",
                target = inCellMode ? that.options.target : that.options.target.closest("tr");

            if (inCellMode) {
                treelist.editCell(target);
            } else {
                treelist.editRow(target);
            }
        }
    });

    var DeleteCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                target = that.options.target.closest("tr");

            treelist.removeRow(target);
        }
    });

    var SelectRowCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                selectMode = kendo.ui.Selectable.parseOptions(treelist.options.selectable),
                target = that.options.target.closest("tr");

            treelist.select(selectMode.cell ? target.find('td') : target);
        }
    });

    var SelectAllRowsCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                selectMode = kendo.ui.Selectable.parseOptions(treelist.options.selectable),
                rows = treelist.items();

            treelist.select(selectMode.cell ? rows.find('td') : rows);
        }
    });

    var ClearSelectionCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist;

            treelist.clearSelection();
        }
    });

    var ExportPDFCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist;

            treelist.saveAsPDF();
        }
    });

    var ExportExcelCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist;

                treelist.saveAsExcel();
        }
    });

    var ToggleItemCommand = Command.extend({
        exec: function() {
            var that = this,
                treelist = that.treelist,
                target = that.options.target,
                options = that.options,
                expand = options.expand === 'true';

                if (expand) {
                    treelist.expand(target);
                } else {
                    treelist.collapse(target);
                }
        }
    });

    kendo.ui.treelist = kendo.ui.treelist || {};

    extend(kendo.ui.treelist, {
        TreeListCommand: Command,
        commands: {
            SortCommand: SortCommand,
            AddCommand: AddCommand,
            CreateChildCommand: CreateChildCommand,
            EditCommand: EditCommand,
            DeleteCommand: DeleteCommand,
            SelectRowCommand: SelectRowCommand,
            SelectAllRowsCommand: SelectAllRowsCommand,
            ClearSelectionCommand: ClearSelectionCommand,
            ExportPDFCommand: ExportPDFCommand,
            ExportExcelCommand: ExportExcelCommand,
            ToggleItemCommand: ToggleItemCommand
        }
    });
})(window.kendo.jQuery);

var __meta__ = {
    id: "treelist",
    name: "TreeList",
    category: "web",
    description: "The TreeList widget displays self-referencing data and offers rich support for interacting with data, sorting, filtering, and selection.",
    depends: [ "dom", "data", "pager", "toolbar", "icons", "reorderable", "menu" ],
    features: [ {
        id: "treelist-sorting",
        name: "Sorting",
        description: "Support for column sorting",
        depends: [ "columnsorter" ]
    }, {
        id: "treelist-filtering",
        name: "Filtering",
        description: "Support for record filtering",
        depends: [ "filtermenu" ]
    }, {
        id: "treelist-columnmenu",
        name: "Column menu",
        description: "Support for header column menu",
        depends: [ "columnmenu" ]
    }, {
        id: "treelist-editing",
        name: "Editing",
        description: "Support for record editing",
        depends: [ "editable", "window", "textbox", "form" ]
    }, {
        id: "treelist-selection",
        name: "Selection",
        description: "Support for row selection",
        depends: [ "selectable" ]
    }, {
        id: "treelist-column-resize",
        name: "Column resizing",
        description: "Support for column resizing",
        depends: [ "resizable" ]
    }, {
        id: "treelist-dragging",
        name: "Drag & Drop",
        description: "Support for drag & drop of rows",
        depends: [ "treeview.draganddrop" ]
    }, {
        id: "treelist-excel-export",
        name: "Excel export",
        description: "Export data as Excel spreadsheet",
        depends: [ "excel" ]
    }, {
        id: "treelist-pdf-export",
        name: "PDF export",
        description: "Export data as PDF",
        depends: [ "pdf", "drawing", "progressbar" ]
    }, {
        id: "treelist-paging",
        name: "Paging",
        description: "Support for treelist paging",
        depends: [ "pager" ]
    } ]
};

(function($, undefined$1) {
    var data = kendo.data;
    var encode = kendo.htmlEncode;
    var kendoDom = kendo.dom;
    var kendoDomElement = kendoDom.element;
    var kendoTextElement = kendoDom.text;
    var kendoHtmlElement = kendoDom.html;
    var outerWidth = kendo._outerWidth;
    var keys = $.extend({ F10: 121 }, kendo.keys);
    var outerHeight = kendo._outerHeight;
    var ui = kendo.ui;
    var DataBoundWidget = ui.DataBoundWidget;
    var DataSource = data.DataSource;
    var ObservableArray = data.ObservableArray;
    var Query = data.Query;
    var Model = data.Model;
    var browser = kendo.support.browser;
    var kendoTemplate = kendo.template;
    var activeElement = kendo._activeElement;
    var touchDevice = kendo.support.touch;

    var isArray = Array.isArray;
    var extend = $.extend;
    var map = $.map;
    var grep = $.grep;
    var inArray = $.inArray;
    var isPlainObject = $.isPlainObject;

    var push = Array.prototype.push;

    var STRING = "string";
    var CHANGE = "change";
    var ITEM_CHANGE = "itemChange";
    var ERROR = "error";
    var PROGRESS = "progress";
    var DOT = ".";
    var NS = ".kendoTreeList";
    var CLICK = "click";
    var INPUT = "input";
    var BEFORE_EDIT = "beforeEdit";
    var EDIT = "edit";
    var PAGE = "page";
    var PAGE_CHANGE = "pageChange";
    var SAVE = "save";
    var SAVE_CHANGES = "saveChanges";
    var EXPAND = "expand";
    var COLLAPSE = "collapse";
    var CELL_CLOSE = "cellClose";
    var REMOVE = "remove";
    var DATA_CELL = "td:not(.k-group-cell):not(.k-hierarchy-cell):visible,th:not(.k-group-cell):not(.k-hierarchy-cell):visible";
    var FILTER_CELL = ".k-filter-row td:not(.k-group-cell):not(.k-hierarchy-cell):visible,.k-filter-row th:not(.k-group-cell):not(.k-hierarchy-cell):visible";
    var DATABINDING = "dataBinding";
    var DATABOUND = "dataBound";
    var CANCEL = "cancel";
    var TABINDEX = "tabIndex";
    var FILTERMENUINIT = "filterMenuInit";
    var FILTERMENUOPEN = "filterMenuOpen";
    var COLUMNHIDE = "columnHide";
    var COLUMNSHOW = "columnShow";
    var HEADERCELLS = "th.k-header";
    var COLUMNREORDER = "columnReorder";
    var COLUMNRESIZE = "columnResize";
    var COLUMNMENUINIT = "columnMenuInit";
    var COLUMNMENUOPEN = "columnMenuOpen";
    var COLUMNLOCK = "columnLock";
    var COLUMNUNLOCK = "columnUnlock";
    var FILTER = "filter";
    var NAVIGATE = "navigate";
    var SORT = "sort";
    var PARENTIDFIELD = "parentId";
    var DRAGSTART = "dragstart";
    var DRAG = "drag";
    var DROP = "drop";
    var DRAGEND = "dragend";
    var NAVROW = "tr:visible";
    var NAVCELL = "td:visible";
    var NAVHEADER = "th:visible";
    var NORECORDSCLASS = "k-grid-norecords";
    var ITEMROW = "tr:not(.k-footer-template):visible";
    var isRtl = false;
    var HEIGHT = "height";
    var INCELL = "incell";
    var INLINE = "inline";
    var POPUP = "popup";
    var TABLE = "table";
    var CHECKBOX = "k-checkbox";
    var CHECKBOXINPUT = "input[data-role='checkbox']." + CHECKBOX;
    var SELECTCOLUMNTMPL = '<input class="' + CHECKBOX + ' k-checkbox-md k-rounded-md" data-role="checkbox" aria-label="Select row" aria-checked="false" type="checkbox">';
    var SELECTCOLUMNHEADERTMPL = '<input class="' + CHECKBOX + ' k-checkbox-md k-rounded-md" data-role="checkbox" aria-label="Select all rows" aria-checked="false" type="checkbox">';
    var DRAGHANDLECOLUMNTMPL = () => kendo.ui.icon("reorder");
    var SELECTED = "k-selected";
    var whitespaceRegExp = "[\\x20\\t\\r\\n\\f]";
    var filterRowRegExp = new RegExp("(^|" + whitespaceRegExp + ")" + "(k-filter-row)" + "(" + whitespaceRegExp + "|$)");
    var ICON_REFRESH_SELECTOR = "[class*='-i-arrow-rotate-cw']";
    var ICON_EXPAND_COLLAPSE_SELECTOR = "[ref-treelist-expand-collapse-icon]";
    var CARET_ALT_RIGHT = "caret-alt-right";
    var CARET_ALT_LEFT = "caret-alt-left";
    var ARIA_LABEL = "aria-label";

    var ID = "id",
        PX = "px",
        TR = "tr",
        DIV = "div",

        ARIA_LABEL = "aria-label",
        ARIA_OWNS = "aria-owns",
        ARIA_ROWCOUNT = "aria-rowcount",
        ARIA_COLCOUNT = "aria-colcount",
        ARIA_CONTROLS = "aria-controls",
        ARIA_COLINDEX = "aria-colindex",
        ARIA_ROWINDEX = "aria-rowindex",
        ARIA_EXPANDED = "aria-expanded",
        ARIA_CHECKED = "aria-checked",
        ARIA_ACTIVEDESCENDANT = "aria-activedescendant",
        ROLE = "role",
        NONE = "none",
        ROW = "row",
        ROWGROUP = "rowgroup",
        COLUMNHEADER = "columnheader",
        GRIDCELL = "gridcell";

    var classNames = {
        wrapper: "k-treelist k-grid k-grid-md k-grid-display-block",
        header: "k-header k-table-th",
        button: "k-button",
        alt: "k-alt k-table-alt-row",
        editCell: "k-edit-cell",
        editRow: "k-grid-edit-row",
        dirtyCell: "k-dirty-cell",
        group: "k-treelist-group k-table-group-row",
        toolbar: "k-toolbar",
        gridToolbar: "k-grid-toolbar",
        gridHeader: "k-grid-header",
        gridHeaderWrap: "k-grid-header-wrap",
        gridContent: "k-grid-content",
        gridContentWrap: "k-grid-content",
        gridFilter: "k-grid-filter-menu",
        footerTemplate: "k-footer-template",
        focused: "k-focus",
        loading: "k-i-loading",
        refresh: "arrow-rotate-cw",
        retry: "k-request-retry",
        selected: "k-selected",
        status: "k-status",
        link: "k-link",
        filterable: "k-filterable",
        icon: "k-icon",
        iconFilter: "filter",
        iconCollapse: "caret-alt-down",
        iconExpand: "caret-alt-right",
        iconHidden: "k-i-none",
        iconPlaceHolder: "k-treelist-toggle k-icon k-svg-icon k-i-none",
        input: "k-input",
        dropPositions: "k-i-insert-top k-i-insert-bottom k-i-plus k-i-insert-middle",
        dropTop: "insert-top",
        dropBottom: "insert-bottom",
        dropAdd: "plus",
        dropMiddle: "insert-middle",
        dropDenied: "cancel",
        dragStatus: "k-drag-status",
        dragClue: "k-drag-clue",
        dragClueText: "k-clue-text",
        headerCellInner: "k-cell-inner",
        columnTitle: "k-column-title"
    };

    var defaultCommands = {
        create: {
            icon: "plus",
            className: "k-grid-add",
            methodName: "addRow"
        },
        createchild: {
            icon: "plus",
            className: "k-grid-add",
            methodName: "addRow"
        },
        destroy: {
            icon: "x",
            className: "k-grid-remove-command",
            methodName: "removeRow"
        },
        edit: {
            icon: "pencil",
            className: "k-button-solid-primary k-grid-edit-command",
            methodName: "editRow"
        },
        update: {
            icon: "save",
            className: "k-button-solid-primary k-grid-save-command",
            methodName: "saveRow"
        },
        canceledit: {
            icon: "cancel",
            className: "k-grid-cancel-command",
            methodName: "_cancelEdit"
        },
        cancel: {
            icon: "cancel-outline",
            text: "Cancel changes",
            className: "k-grid-cancel-changes",
            methodName: "cancelChanges"
        },
        save: {
            icon: "check",
            text: "Save changes",
            className: "k-grid-save-changes",
            methodName: "saveChanges"
        },
        excel: {
            icon: "file-excel",
            className: "k-grid-excel",
            methodName: "saveAsExcel"
        },
        pdf: {
            icon: "file-pdf",
            className: "k-grid-pdf",
            methodName: "saveAsPDF"
        },
        search: {
            template: ({ message }) =>
            "<span class='k-spacer'></span>" +
            "<span class='k-searchbox k-input k-input-md k-rounded-md k-input-solid k-grid-search'>" +
                kendo.ui.icon({ icon: "search", iconClass: "k-input-icon" }) +
                `<input autocomplete='off' placeholder='${message}' title='${message}' aria-label='${message}' class='k-input-inner' />` +
            "</span>"
        }
    };

    var defaultBodyContextMenu = [
        "create",
        "createChild",
        "edit",
        "destroy",
        "separator",
        "select",
        "separator",
        "exportPDF",
        "exportExcel",
        "separator",
        "expandItem",
        "collapseItem",
        "separator"
    ];

    var defaultHeadContextMenu = [
        "sortAsc",
        "sortDesc",
        "separator"
    ];

    var TreeView = kendo.Class.extend({
        init: function(data, options) {
            var that = this;

            that.data = data || [];
            that.options = extend(that.options, options);
        },

        options: {
            defaultParentId: null,
            idField: "id",
            parentIdField: PARENTIDFIELD
        },

        childrenMap: function() {
            var that = this;
            var childrenMap = {};
            var dataLength = that.data.length;
            var dataItem;
            var dataItemId;
            var dataItemParentId;
            var idField = that.options.idField;
            var parentIdField = that.options.parentIdField;

            if (that._childrenMap) {
                return that._childrenMap;
            }

            for (var i = 0; i < dataLength; i++) {
                dataItem = this.data[i];
                dataItemId = dataItem[idField];
                dataItemParentId = dataItem[parentIdField];

                childrenMap[dataItemId] = childrenMap[dataItemId] || [];
                childrenMap[dataItemParentId] = childrenMap[dataItemParentId] || [];

                childrenMap[dataItemParentId].push(dataItem);
            }

            that._childrenMap = childrenMap;

            return childrenMap;
        },

        idsMap: function() {
            var that = this;
            var idsMap = {};
            var data = that.data;
            var dataLength = data.length;
            var dataItem;
            var idField = that.options.idField;

            if (that._idMap) {
                return that._idMap;
            }

            for (var i = 0; i < dataLength; i++) {
                dataItem = data[i];
                idsMap[dataItem[idField]] = dataItem;
            }

            that.idsMap = idsMap;
            return idsMap;
        },

        dataMaps: function() {
            var that = this;
            var childrenMap = {};
            var data = that.data;
            var dataLength = data.length;
            var idsMap = {};
            var dataItem;
            var dataItemId;
            var dataItemParentId;
            var idField = that.options.idField;
            var parentIdField = that.options.parentIdField;

            if (that._dataMaps) {
                return that._dataMaps;
            }

            for (var i = 0; i < dataLength; i++) {
                dataItem = data[i];
                dataItemId = dataItem[idField];
                dataItemParentId = dataItem[parentIdField];

                idsMap[dataItemId] = dataItem;

                childrenMap[dataItemId] = childrenMap[dataItemId] || [];
                childrenMap[dataItemParentId] = childrenMap[dataItemParentId] || [];
                childrenMap[dataItemParentId].push(dataItem);
            }

            that._dataMaps = {
                children: childrenMap,
                ids: idsMap
            };

            return that._dataMaps;
        },

        rootNodes: function() {
            var that = this;
            var data = that.data;
            var defaultParentId = that.options.defaultParentId;
            var dataLength = data.length;
            var rootNodes = [];
            var dataItem;
            var parentIdField = that.options.parentIdField;

            for (var i = 0; i < dataLength; i++) {
                dataItem = data[i];

                if (dataItem[parentIdField] === defaultParentId) {
                    rootNodes.push(dataItem);
                }
            }

            return rootNodes;
        },

        removeCollapsedSubtreesFromRootNodes: function(options) {
            options = options || {};
            var that = this;
            var rootNodes = that.rootNodes();
            var result = [];
            var prunedTree;

            that._childrenMap = options.childrenMap = options.childrenMap || that.childrenMap();
            options.maxDepth = options.maxDepth || Infinity;

            for (var i = 0; i < rootNodes.length; i++) {
                prunedTree = that.removeCollapsedSubtrees(rootNodes[i], options);
                result = result.concat(prunedTree);
            }

            return result;
        },

        removeCollapsedSubtrees: function(rootNode, options) {
            options = options || {};
            var that = this;
            var result = [];
            var childIdx;
            var prunedTree;
            var childrenMap = options.childrenMap || {};
            var maxDepth = options.maxDepth || Infinity;
            var idField = that.options.idField;
            var children = childrenMap[rootNode[idField]] || [];
            var expanded = isUndefined(rootNode.expanded) ? options.expanded : rootNode.expanded;

            result.push(rootNode);

            if (children && expanded) {
                for (childIdx = 0; childIdx < children.length; childIdx++) {
                    if (result.length >= maxDepth) {
                        break;
                    }

                    prunedTree = that.removeCollapsedSubtrees(children[childIdx], options);
                    result = result.concat(prunedTree);
                }
            }

            return result;
        }
    });

    var TreeQuery = function(data) {
        this.data = data || [];
    };

    TreeQuery.prototype = new Query();
    TreeQuery.prototype.constructor = TreeQuery;

    TreeQuery.process = function(data, options, inPlace) {
        options = options || {};
        var query = new TreeQuery(data);
        var group = options.group;
        var sort = Query.normalizeGroup(group || []).concat(Query.normalizeSort(options.sort || []));
        var filterCallback = options.filterCallback;
        var filter = options.filter;
        var skip = options.skip;
        var take = options.take;
        var total;
        var childrenMap;
        var filteredChildrenMap;
        var view;
        var prunedData;

        if (sort && inPlace) {
            query = query.sort(sort, undefined$1, undefined$1, inPlace);
        }

        if (filter) {
            query = query.filter(filter);

            if (filterCallback) {
                query = filterCallback(query);
            }

            total = query.toArray().length;
        }

        if (sort && !inPlace) {
            query = query.sort(sort);

            if (group) {
                data = query.toArray();
            }
        }

        if (options.processFromRootNodes) {
            view = new TreeView(query.toArray(), options);

            if (filter) {
                filteredChildrenMap = view.childrenMap();
            }

            prunedData = view.removeCollapsedSubtreesFromRootNodes({
                // filtering or sorting requires changes to childrenMap
                childrenMap: filter || (sort && sort.length) ? undefined$1 : options.childrenMap,
                expanded: options.expanded,
                maxDepth: (skip + take) || Infinity
            });

            childrenMap = view.childrenMap();

            query = new TreeQuery(prunedData);
        }

        if (skip !== undefined$1 && take !== undefined$1) {
            query = query.range(skip, take);
        }

        if (group) {
            query = query.group(group, data);
        }

        return {
            total: total,
            data: query.toArray(),
            childrenMap: childrenMap,
            filteredChildrenMap: filteredChildrenMap
        };
    };

    var TreeListModel = Model.define({
        id: "id",

        parentId: PARENTIDFIELD,

        fields: {
            id: { type: "number" },
            parentId: { type: "number", nullable: true }
        },

        init: function(value) {
            Model.fn.init.call(this, value);

            this._loaded = false;

            if (!this.parentIdField) {
                this.parentIdField = PARENTIDFIELD;
            }

            this.parentId = this.get(this.parentIdField);
        },

        accept: function(data) {
            Model.fn.accept.call(this, data);

            this.parentId = this.get(this.parentIdField);
        },

        set: function(field, value, initiator) {
            if (field == PARENTIDFIELD && this.parentIdField != PARENTIDFIELD) {
                this[this.parentIdField] = value;
            }

            Model.fn.set.call(this, field, value, initiator);

            if (field == this.parentIdField) {
                this.parentId = this.get(this.parentIdField);
            }
        },

        loaded: function(value) {
            if (value !== undefined$1) {
                this._loaded = value;
            } else {
                return this._loaded;
            }
        },

        shouldSerialize: function(field) {
            return Model.fn.shouldSerialize.call(this, field) && field !== "_loaded" && field != "_error" && field != "_edit" && !(this.parentIdField !== "parentId" && field === "parentId");
        }
    });

    TreeListModel.parentIdField = PARENTIDFIELD;

    TreeListModel.define = function(base, options) {
        if (options === undefined$1) {
            options = base;
            base = TreeListModel;
        }

        var parentId = options.parentId || PARENTIDFIELD;

        options.parentIdField = parentId;

        var model = Model.define(base, options);

        if (parentId) {
            model.parentIdField = parentId;
        }

        return model;
    };

    function is(field) {
        return function(object) {
            return object[field];
        };
    }

    function not(func) {
        return function(object) {
            return !func(object);
        };
    }

    var TreeListDataSource = DataSource.extend({
        init: function(options) {
            options = options || {};
            var that = this;
            that._dataMaps = that._getDataMaps();

            options.schema = extend(true, {}, {
                modelBase: TreeListModel,
                model: TreeListModel
            }, options.schema);

            DataSource.fn.init.call(this, options);
        },

        _addRange: function() {
            // empty override for performance - the treelist does not support virtualization
        },

        _createNewModel: function(data) {
            var that = this;
            var model = {};
            var fromModel = data instanceof Model;
            var parentIdField = this._modelParentIdField();

            if (fromModel) {
                model = data;
            }

            model = DataSource.fn._createNewModel.call(this, model);

            if (!fromModel) {
                if (data.parentId) {
                    data[model.parentIdField] = data.parentId;
                } else if (that._isPageable() && data[parentIdField]) {
                    data[model.parentIdField] = data[parentIdField];
                }

                model.accept(data);
            }

            return model;
        },

        _shouldWrap: function() {
            return true;
        },

        _push: function(result, operation) {
            var data = DataSource.fn._readData.call(this, result);

            if (!data) {
                data = result;
            }

            this[operation](data);
        },

        _getData: function() {
            // do not use .data(), which wraps the data items
            return this._data || [];
        },

        _readData: function(newData) {
            var that = this;
            var data = that._isPageable() ? that._getData().toJSON() : that.data();

            newData = DataSource.fn._readData.call(this, newData);

            this._replaceData(((data.toJSON ? data.toJSON() : data)).concat(newData), data);

            if (newData instanceof ObservableArray) {
                return newData;
            }

            return data;
        },

        _replaceData: function(source, target) {
            var sourceLength = source.length;

            for (var i = 0; i < sourceLength; i++) {
                target[i] = source[i];
            }

            target.length = sourceLength;
        },

        _readAggregates: function(data) {
            var result = extend(this._aggregateResult, this.reader.aggregates(data));
            if ("" in result) {
                result[this._defaultParentId()] = result[""];
                delete result[""];
            }

            return result;
        },

        read: function(data) {
            var that = this;

            if (that._isPageable()) {
                that._dataMaps = {};
                if (!that._modelOptions().expanded) {
                    that._skip = 0;
                    that._page = 1;
                    that._collapsedTotal = undefined$1;
                }
            }

            return DataSource.fn.read.call(that, data);
        },

        remove: function(root) {
            this._removeChildData(root);

            this._removeFromDataMaps(root);

            return DataSource.fn.remove.call(this, root);
        },

        _removeChildData: function(model, removePristine) {
            var that = this;
            var pageable = that._isPageable();
            var data = pageable ? this._getData() : this.data();
            var childrenMap = pageable ? that._getChildrenMap() || that.childrenMap(data) : that._childrenMap(data);
            var items = this._subtree(childrenMap, model.id);
            var shouldRemovePristine = isUndefined(removePristine) ? false : removePristine;

            var removedItems = this._removeItems(items, shouldRemovePristine);

            that._removeFromDataMaps(removedItems);
        },

        pushDestroy: function(items) {
            var that = this;

            if (!isArray(items)) {
                items = [items];
            }

            for (var i = 0; i < items.length; i++) {
                that._removeChildData(items[i], true);
                that._removeFromDataMaps(items[i]);
            }

            DataSource.fn.pushDestroy.call(that, items);
        },

        insert: function(index, model) {
            var that = this;
            var newModel = that._createNewModel(model);

            that._insertInDataMaps(newModel);

            return DataSource.fn.insert.call(that, index, newModel);
        },

        _filterCallback: function(query) {
            var that = this;
            var i, item;
            var map = {};
            var result = [];
            var data = query.toArray();
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var pageable = that._isPageable();
            var parentSubtree = [];
            var parent;

            for (i = 0; i < data.length; i++) {
                item = data[i];

                if (pageable) {
                    // return view from root nodes to child nodes
                    parentSubtree = [];

                    if (!map[item[idField]]) {
                        map[item[idField]] = true;
                        parentSubtree.push(item);
                    }

                    parent = that._parentNode(item);

                    while (parent) {
                        if (!map[parent[idField]]) {
                            map[parent[idField]] = true;
                            parentSubtree.unshift(parent);
                            parent = that._parentNode(parent);
                        } else {
                            // the parent chain is already processed
                            break;
                        }
                    }

                    if (parentSubtree.length) {
                        result = result.concat(parentSubtree);
                    }
                } else {
                    while (item) {
                        if (!map[item[idField]]) {
                            map[item[idField]] = true;
                            result.push(item);
                        }

                        if (!map[item[parentIdField]]) {
                            map[item[parentIdField]] = true;
                            item = this.parentNode(item);

                            if (item) {
                                result.push(item);
                            }
                        } else {
                            break;
                        }
                    }
                }
            }

            return new Query(result);
        },

        _subtree: function(map, id) {
            var that = this;
            var result = map[id] || [];
            var defaultParentId = that._defaultParentId();
            var idField = that._modelIdField();

            for (var i = 0, len = result.length; i < len; i++) {
                if (result[i][idField] !== defaultParentId) {
                    result = result.concat(that._subtree(map, result[i][idField]));
                }
            }

            return result;
        },

        // builds hash id -> children
        _childrenMap: function(data) {
            var map = {};
            var i, item, id, parentId;

            data = this._observeView(data);

            for (i = 0; i < data.length; i++) {
                item = data[i];
                id = item.id;
                parentId = item.parentId;

                map[id] = map[id] || [];
                map[parentId] = map[parentId] || [];
                map[parentId].push(item);
            }

            return map;
        },

        childrenMap: function(data) {
            var view = this._createTreeView(data);
            var map = view.childrenMap();
            return map;
        },

        _getChildrenMap: function() {
            var that = this;
            var dataMaps = that._getDataMaps();
            return dataMaps.children;
        },

        _initIdsMap: function(data) {
            var that = this;
            var dataMaps = that._getDataMaps();

            if (isUndefined(dataMaps.ids)) {
                dataMaps.ids = that._idsMap(data);
            }

            return dataMaps.ids;
        },

        _idsMap: function(data) {
            var view = this._createTreeView(data);
            var map = view.idsMap();
            return map;
        },

        _getIdsMap: function() {
            var that = this;
            var dataMaps = that._getDataMaps();
            return dataMaps.ids || {};
        },

        _getFilteredChildrenMap: function() {
            var that = this;
            var dataMaps = that._getDataMaps();
            return dataMaps.filteredChildren;
        },

        _setFilteredChildrenMap: function(map) {
            var that = this;
            var dataMaps = that._getDataMaps();
            dataMaps.filteredChildren = map;
        },

        _initDataMaps: function(data) {
            var that = this;
            var view = that._createTreeView(data);

            that._dataMaps = view.dataMaps();

            return that._dataMaps;
        },

        _initChildrenMapForParent: function(parent) {
            var that = this;
            var data = that._getData();
            var childrenMap = that._getChildrenMap();
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var parentId = (parent || {})[idField];

            if (childrenMap && parent) {
                childrenMap[parentId] = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i][parentIdField] === parentId) {
                        childrenMap[parentId].push(data[i]);
                    }
                }
            }
        },

        _getDataMaps: function() {
            var that = this;
            that._dataMaps = that._dataMaps || {};
            return that._dataMaps;
        },

        _createTreeView: function(data, options) {
            var view = new TreeView(data, extend(options, this._defaultTreeModelOptions()));
            return view;
        },

        _defaultTreeModelOptions: function() {
            var that = this;
            var modelOptions = that._modelOptions();

            return {
                defaultParentId: that._defaultParentId(),
                idField: that._modelIdField(),
                parentIdField: that._modelParentIdField(),
                expanded: modelOptions.expanded
            };
        },

        _defaultDataItemType: function() {
            return this.reader.model || kendo.data.ObservableObject;
        },

        _calculateAggregates: function(data, options) {
            options = options || {};
            var that = this;
            var result = {};
            var item, subtree, i;
            var filter = options.filter;
            var skip = options.skip;
            var take = options.take;
            var maxDepth = !isUndefined(skip) && !isUndefined(take) ? (skip + take) : Infinity;
            var pageable = that._isPageable();
            var filteredChildrenMap = options.filteredChildrenMap;
            var childrenMap = options.childrenMap;
            var pageableChildrenMap;

            if (pageable) {
                if (isUndefined(options.aggregate)) {
                    return result;
                }

                if (filteredChildrenMap) {
                    pageableChildrenMap = filteredChildrenMap;
                } else if (childrenMap) {
                    pageableChildrenMap = childrenMap;
                } else {
                    pageableChildrenMap = that.childrenMap(that._getData());
                }
            }

            if (!pageable && filter) {
                data = Query.process(data, {
                    filter: filter,
                    filterCallback: this._filterCallback.bind(this)
                }).data;
            }

            var map = pageable ? pageableChildrenMap : that._childrenMap(data);

            // calculate aggregates for each subtree
            result[this._defaultParentId()] = new Query(this._subtree(map, this._defaultParentId())).aggregate(options.aggregate);

            for (i = 0; i < data.length; i++) {
                if (i >= maxDepth) {
                    break;
                }

                item = data[i];
                subtree = this._subtree(map, item.id);

                result[item.id] = new Query(subtree).aggregate(options.aggregate);
            }

            return result;
        },

        _queryProcess: function(data, options) {
            var that = this;
            var result = {};
            options = options || {};
            options.filterCallback = this._filterCallback.bind(this);

            if (that._isPageable()) {
                return that._processPageableQuery(data, options);
            } else {
                var defaultParentId = this._defaultParentId();
                result = Query.process(data, options);
                var map = this._childrenMap(result.data);
                var hasLoadedChildren, i, item, children;

                data = map[defaultParentId] || [];

                for (i = 0; i < data.length; i++) {
                    item = data[i];

                    if (item.id === defaultParentId) {
                        continue;
                    }

                    children = map[item.id];
                    hasLoadedChildren = !!(children && children.length);

                    if (!item.loaded()) {
                        item.loaded(hasLoadedChildren || !item.hasChildren);
                    }

                    if (item.loaded() || item.hasChildren !== true) {
                        item.hasChildren = hasLoadedChildren;
                    }

                    if (hasLoadedChildren) {
                        //cannot use splice due to IE8 bug
                        data = data.slice(0, i + 1).concat(children, data.slice(i + 1));
                    }
                }

                result.data = data;
            }

            return result;
        },

        _processPageableQuery: function(data, options) {
            var that = this;
            var dataMaps = that._getDataMaps();
            var result;
            var filteredChildrenMap;

            if (that._getData() !== data || !dataMaps.children || !dataMaps.ids) {
                dataMaps = that._initDataMaps(that._getData());
            }

            options.childrenMap = dataMaps.children || {};
            options.idsMap = dataMaps.ids || {};

            result = that._processTreeQuery(data, options);

            that._replaceWithObservedData(result.data, data);

            that._processDataItemsState(result.data, result.childrenMap);

            that._replaceItemsInDataMaps(result.data);

            result.dataToAggregate = that._dataToAggregate(result.data, options);

            if (options.filter || that.filter()) {
                filteredChildrenMap = result.filteredChildrenMap;
                that._replaceInMapWithObservedData(filteredChildrenMap, data);
                that._setFilteredChildrenMap(filteredChildrenMap);
                options.filteredChildrenMap = filteredChildrenMap;
                that._calculateCollapsedTotal(result.data);
            } else {
                that._collapsedTotal = undefined$1;
            }

            return result;
        },

        _dataToAggregate: function(data) {
            var that = this;
            var firstDataItem = data[0] || {};
            var firstItemParents = that._parentNodes(firstDataItem);
            var dataToAggregate = firstItemParents.concat(data);

            return dataToAggregate;
        },

        _replaceItemsInDataMaps: function(observableArray) {
            var that = this;
            var view = isArray(observableArray) ? observableArray : [observableArray];
            var itemType = that._defaultDataItemType();
            var defaultParentId = that._defaultParentId();
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var dataMaps = that._getDataMaps();
            var item;
            var parents;
            var directParent;

            for (var viewIndex = 0; viewIndex < view.length; viewIndex++) {
                item = view[viewIndex];

                if (!(item instanceof itemType)) {
                    continue;
                }

                that._insertInIdsMap(item);

                parents = that._parentNodes(item);
                directParent = parents && parents.length ? parents[parents.length - 1] : undefined$1;

                if (item[parentIdField] === defaultParentId) {
                    that._replaceInMap(dataMaps.children, defaultParentId, item, itemType);
                } else if (directParent) {
                    that._replaceInMap(dataMaps.children, directParent[idField], item, itemType);
                }
            }
        },

        _replaceInMap: function(map, id, replacement, itemType) {
            var idField = this._modelIdField();
            map[id] = map[id] || [];
            itemType = itemType || this._defaultDataItemType();

            var itemInArray = map[id].filter(function(element) {
                return replacement[idField] === element[idField];
            })[0];

            var itemIndex = itemInArray ? map[id].indexOf(itemInArray) : -1;

            if (itemIndex !== -1 && !(itemInArray instanceof itemType)) {
                map[id][itemIndex] = replacement;
            }
        },

        _replaceWithObservedData: function(dataToReplace, replacementArray) {
            var that = this;
            var idsMap = that._getDataMaps().ids || {};
            var idField = that._modelIdField();
            var itemType = that._defaultDataItemType();
            var itemToReplace;
            var itemToReplaceId;
            var dataItem;
            var dataItemIndex;
            var observableItem;

            for (var i = 0; i < dataToReplace.length; i++) {
                itemToReplace = dataToReplace[i];
                itemToReplaceId = itemToReplace[idField];

                if (!(itemToReplace instanceof itemType)) {
                    if (!(idsMap[itemToReplaceId] instanceof itemType)) {
                        dataItem = that._getById(itemToReplaceId);
                        dataItemIndex = replacementArray.indexOf(dataItem);

                        if (dataItem && dataItemIndex !== -1) {
                            observableItem = replacementArray.at(dataItemIndex);
                            dataToReplace[i] = observableItem;
                        }
                    } else {
                        dataToReplace[i] = idsMap[itemToReplaceId];
                    }
                }
            }
        },

        _replaceInMapWithObservedData: function(map, replacementArray) {
            var that = this;

            for (var key in map) {
                that._replaceWithObservedData(map[key], replacementArray);
            }
        },

        _insertInDataMaps: function(item) {
            var that = this;

            if (that._isPageable()) {
                that._insertInIdsMap(item);
                that._insertInChildrenMap(item);
            }
        },

        _insertInIdsMap: function(item) {
            var that = this;
            var idsMap = that._getIdsMap();
            var idField = that._modelIdField();

            if (!isUndefined(item[idField])) {
                idsMap[item[idField]] = item;
            }
        },

        _insertInChildrenMap: function(item, index) {
            var that = this;
            var childrenMap = that._getChildrenMap() || {};
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var itemId = item[idField];
            var parentId = item[parentIdField];
            index = index || 0;

            childrenMap[itemId] = childrenMap[itemId] || [];
            childrenMap[parentId] = childrenMap[parentId] || [];
            childrenMap[parentId].splice(index, 0, item);
        },

        _removeFromDataMaps: function(items) {
            var that = this;
            items = isArray(items) ? items : [items];

            if (that._isPageable()) {
                for (var i = 0; i < items.length; i++) {
                    that._removeFromIdsMap(items[i]);
                    that._removeFromChildrenMap(items[i]);
                }
            }
        },

        _removeFromIdsMap: function(item) {
            var that = this;
            var idsMap = that._getIdsMap();
            var idField = that._modelIdField();

            if (!isUndefined(item[idField])) {
                idsMap[item[idField]] = undefined$1;
            }
        },

        _removeFromChildrenMap: function(item) {
            var that = this;
            var childrenMap = that._getChildrenMap() || {};
            var parentIdField = that._modelParentIdField();
            var parentId = item[parentIdField];

            childrenMap[parentId] = childrenMap[parentId] || [];

            var itemIndex = that._indexInChildrenMap(item);

            if (itemIndex !== -1) {
                childrenMap[parentId].splice(itemIndex, 1);
            }
        },

        _indexInChildrenMap: function(item) {
            var that = this;
            return that._itemIndexInMap(item, that._getChildrenMap());
        },

        _itemIndexInMap: function(item, dataMap) {
            var that = this;
            var map = dataMap || {};
            var parentIdField = that._modelParentIdField();
            var parentId = item[parentIdField];

            map[parentId] = map[parentId] || [];

            var itemInArray = map[parentId].filter(function(element) {
                return item.uid === element.uid;
            })[0];

            var itemIndex = itemInArray ? map[parentId].indexOf(itemInArray) : -1;

            return itemIndex;
        },

        _getById: function(id) {
            var that = this;
            var idField = that._modelIdField();
            var data = that._getData();

            for (var i = 0; i < data.length; i++) {
                if (data[i][idField] === id) {
                    return data[i];
                }
            }
        },

        _isLastItemInView: function(dataItem) {
            var view = this.view();
            return view.length && view[view.length - 1] === dataItem;
        },

        _defaultPageableQueryOptions: function() {
            var that = this;
            var dataMaps = that._getDataMaps();
            var options = {
                skip: that.skip(),
                take: that.take(),
                page: that.page(),
                pageSize: that.pageSize(),
                sort: that.sort(),
                filter: that.filter(),
                group: that.group(),
                aggregate: that.aggregate(),
                filterCallback: that._filterCallback.bind(that),
                childrenMap: dataMaps.children,
                idsMap: dataMaps.ids
            };

            return options;
        },

        _isPageable: function() {
            var pageSize = this.pageSize();
            return (!isUndefined(pageSize) && pageSize > 0 && !this.options.serverPaging);
        },

        _updateTotalForAction: function(action, items) {
            var that = this;

            DataSource.fn._updateTotalForAction.call(that, action, items);

            if (that._isPageable()) {
                that._updateCollapsedTotalForAction(action, items);
            }
        },

        _updateCollapsedTotalForAction: function(action, items) {
            var that = this;
            var total = parseInt(that._collapsedTotal, 10);

            if (!isNumber(that._collapsedTotal)) {
                that._calculateCollapsedTotal();
                return;
            }

            if (action === "add") {
                total += items.length;
            } else if (action === "remove") {
                total -= items.length;
            } else if (action !== "itemchange" && action !== "sync" && !that.options.serverPaging) {
                total = that._calculateCollapsedTotal();
            } else if (action === "sync") {
                total = that._calculateCollapsedTotal();
            }

            that._collapsedTotal = total;
        },

        _setFilterTotal: function(filterTotal, setDefaultValue) {
            var that = this;

            DataSource.fn._setFilterTotal.call(that, filterTotal, setDefaultValue);

        },

        collapsedTotal: function() {
            var that = this;

            if (!isUndefined(that._collapsedTotal)) {
                return that._collapsedTotal;
            }

            return that._calculateCollapsedTotal();
        },

        _calculateCollapsedTotal: function(filteredData) {
            var that = this;
            var data = that._dataWithoutCollapsedSubtrees(filteredData);//

            if (data.length) {
                that._collapsedTotal = data.length;
            }

            return that._collapsedTotal;
        },

        _dataWithoutCollapsedSubtrees: function(filteredData) {
            return this._removeCollapsedSubtrees(filteredData || this._getData());
        },

        _removeCollapsedSubtrees: function(data) {
            var that = this;
            var view = that._createTreeView(data);
            var result = view.removeCollapsedSubtreesFromRootNodes({
                expanded: that._modelOptions().expanded,
                childrenMap: that.filter() ? that._getFilteredChildrenMap() : that._getChildrenMap()
            });

            return result;
        },

        _processTreeQuery: function(data, options) {
            var result = TreeQuery.process(data, extend(options, this._defaultTreeModelOptions(), {
                processFromRootNodes: true
            }));

            return result;
        },

        _processDataItemsState: function(data, childrenMap) {
            var dataLength = data.length;
            var i;

            for (i = 0; i < dataLength; i++) {
                this._processDataItemState(data[i], childrenMap);
            }
        },

        _processDataItemState: function(dataItem, childrenMap) {
            var defaultParentId = this._defaultParentId();

            if (dataItem.id === defaultParentId) {
                return;
            }

            var children = childrenMap[dataItem.id] || [];
            var hasLoadedChildren = !!(children && children.length);

            if (!dataItem.loaded) {
                return;
            }

            if (!dataItem.loaded()) {
                dataItem.loaded(hasLoadedChildren || !dataItem.hasChildren);
            }

            if (dataItem.loaded() || dataItem.hasChildren !== true) {
                dataItem.hasChildren = hasLoadedChildren;
            }
        },

        _queueRequest: function(options, callback) {
            // allow simultaneous requests (loading multiple items at the same time)
            callback.call(this);
        },

        _modelLoaded: function(id) {
            var model = this.get(id);
            model.loaded(true);
            model.hasChildren = this.childNodes(model).length > 0;
        },

        _modelError: function(id, e) {
            this.get(id)._error = e;
        },

        success: function(data, requestParams) {
            if (!requestParams || typeof requestParams.id == "undefined") {
                this._data = this._observe([]);
            }

            DataSource.fn.success.call(this, data, requestParams);
			this._total = this._data.length;
        },

        load: function(model) {
            var method = "_query";
            var remote = this.options.serverSorting || this.options.serverPaging || this.options.serverFiltering || this.options.serverGrouping || this.options.serverAggregates;
            var defaultPromise = $.Deferred().resolve().promise();

            if (model.loaded()) {
                if (remote) {
                    return defaultPromise;
                }
            } else if (model.hasChildren) {
                method = "read";
                this._removeChildData(model);
            }

            return this[method]({ id: model.id })
                .done(this._modelLoaded.bind(this, model.id))
                .fail(this._modelError.bind(this, model.id));
        },

        contains: function(root, child) {
            var that = this;
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var rootId = root[idField];
            var pageable = that._isPageable();

            while (child) {
                if (child[parentIdField] === rootId) {
                    return true;
                }

                child = pageable ? that._parentNode(child) : that.parentNode(child);
            }

            return false;
        },

        _byParentId: function(id, defaultId) {
            var result = [];
            var view = this.view();
            var current;

            if (id === defaultId) {
                return [];
            }

            for (var i = 0; i < view.length; i++) {
                current = view.at(i);

                if (current.parentId == id) {
                    result.push(current);
                }
            }

            return result;
        },

        _defaultParentId: function() {
            return this.reader.model.fn.defaults[this.reader.model.parentIdField];
        },

        _modelOptions: function() {
            var modelOptions = ((this.options.schema || {}).model || {});
            return modelOptions;
        },

        _modelIdField: function() {
            var modelOptions = this._modelOptions();
            return modelOptions.id || "id";
        },

        _modelParentIdField: function() {
            var modelOptions = this._modelOptions();
            return modelOptions.parentId || PARENTIDFIELD;
        },

        childNodes: function(model) {
            return this._byParentId(model.id, this._defaultParentId());
        },

        allChildNodes: function(model, result) {
            var directChildren = this.data().filter(function(item) {
                return item.parentId === model.id;
            });

            for (var i = 0; i < directChildren.length; i++) {
                result.push(directChildren[i]);
                this.allChildNodes(directChildren[i], result);
            }
        },

        rootNodes: function() {
            return this._byParentId(this._defaultParentId());
        },

        _rootNode: function(child) {
            return this._parentNodes(child)[0];
        },

        _pageableRootNodes: function(options) {
            options = options || {};
            var that = this;
            var defaultParentId = that._defaultParentId();
            var parentIdField = that._modelParentIdField();
            var result = [];
            var nodesWithoutParentInView = that._nodesWithoutParentInView(options);
            var node;
            var root;

            for (var i = 0; i < nodesWithoutParentInView.length; i++) {
                node = nodesWithoutParentInView[i];

                if (node[parentIdField] === defaultParentId) {
                    result.push(node);
                } else {
                    root = that._rootNode(node);

                    if (root && result.indexOf(root) === -1) {
                        result.push(root);
                    }
                }
            }

            return result;
        },

        parentNode: function(model) {
            return this.get(model.parentId);
        },

        _parentNode: function(child) {
            var that = this;
            var parentIdField = that._modelParentIdField();
            var idsMap = that._initIdsMap(that._getData());
            var parentId = child[parentIdField];
            var parent = idsMap[parentId] || that._getById(parentId);

            return parent;
        },

        _parentNodes: function(child) {
            var that = this;
            var parent = that._parentNode(child);
            var parents = [];

            while (parent) {
                parents.unshift(parent);
                parent = that._parentNode(parent);
            }

            return parents;
        },

        _parentNodesNotInView: function() {
            var that = this;
            var view = that.view();
            var result = [];
            var defaultParentId = that._defaultParentId();
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var parentInView;
            var parents = [];
            var directParent;
            var dataItem;
            var dataItemId;
            var dataItemParentId;

            for (var i = 0; i < view.length; i++) {
                dataItem = view[i];
                dataItemId = dataItem[idField];
                dataItemParentId = dataItem[parentIdField];
                parentInView = that._parentInView(dataItemParentId);

                if (!parentInView && dataItemParentId !== defaultParentId) {
                    parents = that._parentNodes(dataItem);

                    directParent = parents && parents.length ? parents[parents.length - 1] : that._getById(dataItemParentId);

                    if (directParent && result.indexOf(directParent) === -1) {
                        result.push(directParent);
                    }
                }
            }

            return result;
        },

        _nodesWithoutParentInView: function(options) {
            options = options || {};
            var that = this;
            var view = that.view();
            var childrenMap = options.childrenMap || that.childrenMap(that._getData());
            var idField = that._modelIdField();
            var parentIdField = that._modelParentIdField();
            var dataItem;
            var parentInView;
            var children = [];
            var result = [];

            for (var i = 0; i < view.length; i++) {
                dataItem = view[i];
                children = childrenMap[dataItem[idField]];
                parentInView = that._parentInView(dataItem[parentIdField]);

                if (!parentInView) {
                    result.push(dataItem);
                }
            }

            return result;
        },

        _parentInView: function(parentId) {
            var view = this.view();

            for (var i = 0; i < view.length; i++) {
                if (view[i].id === parentId) {
                    return view[i];
                }
            }
        },

        level: function(model) {
            var result = -1;

            if (!(model instanceof TreeListModel)) {
                model = this.get(model);
            }

            do {
                model = this.parentNode(model);
                result++;
            } while (model);

            return result;
        },

        _pageableModelLevel: function(model) {
            var that = this;

            if (!model || !that._isPageable()) {
                return 0;
            }

            var parents = that._parentNodes(model);

            return parents.length;
        },

        filter: function(value) {
            var baseFilter = DataSource.fn.filter;

            if (value === undefined$1) {
                return baseFilter.call(this, value);
            }

            baseFilter.call(this, value);
        },

        _pageableQueryOptions: function(options) {
            var dataMaps = this._getDataMaps();

            options.childrenMap = dataMaps.children;
            options.idsMap = dataMaps.ids;

            return options;
        },

        _flatData: function(data, skip) {
            skip = this._isPageable() ? true : skip;
            return DataSource.fn._flatData.call(this, data, skip);
        },

        data: function(data) {
            var that = this;
            var result = DataSource.fn.data.call(that, data);

            if (that._isPageable()) {
                that._initDataMaps(that._getData());
                that._calculateCollapsedTotal();
            }

            return result;
        },

        cancelChanges: function(model) {
            var that = this;

            DataSource.fn.cancelChanges.call(that, model);

            that._restorePageSizeAfterAddChild();
        },

        _modelCanceled: function(model) {
            var that = this;

            if (that._isPageable()) {
                that._removeFromDataMaps(model);
            }
        },

        _changesCanceled: function() {
            var that = this;

            if (that._isPageable()) {
                that._initDataMaps(that._getData());
            }
        },

        _setAddChildPageSize: function() {
            var that = this;
            var queryOptions = {};

            if (that._isPageable()) {
                // increase the page size to make the new item visible in view
                that._addChildPageSize = that.pageSize() + 1;

                queryOptions = that._defaultPageableQueryOptions();
                queryOptions.take = that._addChildPageSize;
                queryOptions.pageSize = that._addChildPageSize;
                that._query(queryOptions);
            }
        },

        _restorePageSizeAfterAddChild: function() {
            var that = this;
            var queryOptions = {};

            if (that._isPageable()) {
                if (!isUndefined(that._addChildPageSize)) {
                    queryOptions = that._defaultPageableQueryOptions();
                    queryOptions.take = that._addChildPageSize - 1;
                    queryOptions.pageSize = that._addChildPageSize - 1;
                    that._query(queryOptions);
                }
            }

            that._addChildPageSize = undefined$1;
        },

        sync: function() {
            var that = this;

            return DataSource.fn.sync.call(that)
                .then(function() {
                    that._restorePageSizeAfterAddChild();
                });
        },

        _syncEnd: function() {
            var that = this;

            if (that._isPageable()) {
                that._initDataMaps(that._getData());
            }
        }
    });

    TreeListDataSource.create = function(options) {
        if (Array.isArray(options)) {
            options = { data: options };
        } else if (options instanceof ObservableArray) {
            options = { data: options.toJSON() };
        }

        return options instanceof TreeListDataSource ? options : new TreeListDataSource(options);
    };

    function isCellVisible() {
        return this.style.display !== "none";
    }

    function sortCells(cells) {
        var indexAttr = kendo.attr("index");
        return cells.sort(function(a, b) {
            a = $(a);
            b = $(b);

            var indexA = a.attr(indexAttr);
            var indexB = b.attr(indexAttr);

            if (indexA === undefined$1) {
                indexA = $(a).index();
            }
            if (indexB === undefined$1) {
                indexB = $(b).index();
            }

            indexA = parseInt(indexA, 10);
            indexB = parseInt(indexB, 10);
            return indexA > indexB ? 1 : (indexA < indexB ? -1 : 0);
        });
    }

    function leafDataCells(container) {
        var rows = container.find(">tr:not(.k-filter-row)");

        var filter = function() {
            var el = $(this);
            return !el.hasClass("k-group-cell") && !el.hasClass("k-hierarchy-cell");
        };

        var cells = $();
        if (rows.length > 1) {
            cells = rows.find("th[data-index]")
                .filter(filter);
        }

        cells = cells.add(rows.last().find("th").filter(filter));

        return sortCells(cells);
    }

    function createPlaceholders(options) {
        var spans = [];
        var className = options.className;

        for (var i = 0, level = options.level; i < level; i++) {
            spans.push(kendoDomElement("span", { className: className, 'aria-hidden': true }));
        }

        return spans;
    }

    function columnsWidth(cols) {
        var colWidth, width = 0;

        for (var idx = 0, length = cols.length; idx < length; idx++) {
            colWidth = cols[idx].style.width;
            if (colWidth && colWidth.indexOf("%") == -1) {
                width += parseInt(colWidth, 10);
            }
        }

        return width;
    }

    function syncTableHeight(table1, table2) {
       table1 = table1[0];
       table2 = table2[0];

       if (table1.rows.length && table2.rows.length && table1.rows.length !== table2.rows.length) {
           var lockedHeigth = table1.offsetHeight;
           var tableHeigth = table2.offsetHeight;

           var row;
           var diff;
           if (lockedHeigth > tableHeigth) {
               row = table2.rows[table2.rows.length - 1];

               if (filterRowRegExp.test(row.className)) {
                   row = table2.rows[table2.rows.length - 2];
               }

               diff = lockedHeigth - tableHeigth;
           } else {
               row = table1.rows[table1.rows.length - 1];

                if (filterRowRegExp.test(row.className)) {
                    row = table1.rows[table1.rows.length - 2];
                }

               diff = tableHeigth - lockedHeigth;
           }
           row.style.height = row.offsetHeight + diff + "px";
       }
    }

    var TreeListPager = ui.Pager.extend({
        options: {
            name: "TreeListPager"
        },

        totalPages: function() {
            var that = this;
            var dataSource = that.dataSource;

            if (dataSource && dataSource._filter) {
                return ui.Pager.fn.totalPages.call(that);
            }

            return Math.ceil((that._collapsedTotal() || 0) / (that.pageSize() || 1));
        },

        _createDataSource: function(options) {
            this.dataSource = kendo.data.TreeListDataSource.create(options.dataSource);
        },

        _collapsedTotal: function() {
            var dataSource = this.dataSource;
            return dataSource ? (dataSource.collapsedTotal() || 0) : 0;
        }
    });

    var Editor = kendo.Observable.extend({
        init: function(element, options) {
            kendo.Observable.fn.init.call(this);

            options = this.options = extend(true, {}, this.options, options);

            this.element = element;

            this.bind(this.events, options);

            this.model = this.options.model;

            this.fields = this._fields(this.options.columns);

            this._initContainer();

            this.createEditable();
        },

        options: {
            renderForm: false
        },

        events: [],

        _initContainer: function() {
            this.wrapper = this.element;
        },

        createEditable: function() {
            var options = this.options;

            if (options.renderForm) {
                this.form = new ui.Form(this.wrapper.find(".k-treelist-form"), {
                    items: this.fields,
                    buttonsTemplate: () => '',
                    formData: this.model,
                    change: options.change
                });

                this.editable = this.form.editable;
            } else {
                this.editable = new ui.Editable(this.wrapper, {
                    fields: this.fields,
                    target: options.target,
                    clearContainer: options.clearContainer,
                    model: this.model,
                    change: options.change
                });
            }
        },

        _isEditable: function(column) {
            return isColumnEditable(column, this.model);
        },

        _fields: function(columns) {
            var fields = [];
            var idx, length, column;

            for (idx = 0, length = columns.length; idx < length; idx++) {
                column = columns[idx];

                if (this._isEditable(column)) {
                    fields.push({
                        field: column.field,
                        format: column.format,
                        editor: column.editor,
                        editorOptions: extend(true, { format: column.format }, column.editorOptions),
                        label: column.title || column.field || ""
                    });
                }
            }

            return fields;
        },

        end: function() {
            return this.editable.end();
        },

        close: function() {
            this.destroy();
        },

        destroy: function() {
            this.editable.destroy();
            this.editable.element
                .find("[" + kendo.attr("container-for") + "]")
                .empty()
                .end()
                .removeAttr(kendo.attr("role"));

            this.model = this.wrapper = this.element = this.columns = this.editable = null;
        }
    });

    var PopupEditor = Editor.extend({
        init: function(element, options) {
            Editor.fn.init.call(this, element, options);

            this._attachHandlers();
            kendo.cycleForm(this.wrapper);

            this.open();
        },

        events: [
            CANCEL,
            SAVE
        ],

        options: {
            window: {
                modal: true,
                resizable: false,
                draggable: true,
                title: "Edit",
                visible: false
            }
        },

        _initContainer: function() {
            var options = this.options;
            var formContent = [];

            this.wrapper = $('<div class="k-popup-edit-form"/>')
                .attr(kendo.attr("uid"), this.model.uid)
                .append('<div class="k-edit-form-container"/>');

            if (options.template) {
                this._appendTemplate(formContent);
                this.fields = [];
            } else {
                this.options.renderForm = true;
                formContent.push(kendoHtmlElement('<div class="k-treelist-form"></div>'));
            }
            new kendoDom.Tree(this.wrapper.children()[0]).render(formContent);

            this.wrapper.appendTo(options.appendTo);

            this.window = new ui.Window(this.wrapper, options.window);
        },

        _appendTemplate: function(form) {
            var template = this.options.template;

            if (typeof template === STRING) {
                template = kendo.unescape(template);
            }

            template = kendo.template(template)(this.model);

            form.push(kendoHtmlElement(template));
        },

        _attachHandlers: function() {
            var closeHandler = this._cancelProxy = this._cancel.bind(this);
            this.window.wrapper.on(CLICK + NS, "button[data-command='canceledit']", this._cancelProxy);

            this._saveProxy = this._save.bind(this);
            this.window.wrapper.on(CLICK + NS, "button[data-command='update']", this._saveProxy);

            this.window.bind("close", function(e) {
                if (e.userTriggered) {
                    closeHandler(e);
                }
            });
        },

        _detachHandlers: function() {
            this._cancelProxy = null;
            this._saveProxy = null;
            this.window.wrapper.off(NS);
        },

        _cancel: function(e) {
            this.trigger(CANCEL, e);
        },

        _save: function() {
            this.trigger(SAVE);
        },

        open: function() {
            this.window.center().open();
        },

        close: function() {
            this.window.bind("deactivate", this.destroy.bind(this)).close();
        },

        destroy: function() {
            if (this.form) {
                this.form.destroy();
            }

            this._detachHandlers();
            this.window.destroy();
            this.window = null;

            Editor.fn.destroy.call(this);
        }
    });

    var IncellEditor = Editor.extend({
        destroy: function() {
            var that = this;

            that.editable.destroy();

            that.editable.element
                .off()
                .empty()
                .removeAttr(kendo.attr("role"));

            that.model = that.wrapper = that.element = that.columns = that.editable = null;
        }
    });

    var TreeList = DataBoundWidget.extend({
        init: function(element, options, events) {
            DataBoundWidget.fn.init.call(this, element, options);

            if (events) {
                this._events = events;
            }

            isRtl = kendo.support.isRtl(element);

            classNames.iconExpand = isRtl ? CARET_ALT_LEFT : CARET_ALT_RIGHT;

            this._dataSource(this.options.dataSource);
            this._columns();
            this._layout();
            this._aria();
            this._ariaId();
            this._navigatable();
            this._selectable();
            this._sortable();
            this._resizable();
            this._filterable();
            this._filterRow();
            this._attachEvents();
            this._toolbar();
            this._scrollable();
            this._reorderable();
            this._columnMenu();
            this._minScreenSupport();
            this._draggable();
            this._pageable();

            if (this.options.autoBind) {
                this.dataSource.fetch();
            }

            if (this._hasLockedColumns) {
                var widget = this;
                this.wrapper.addClass("k-grid-lockedcolumns");
                this._resizeHandler = function() { widget.resize(); };
                $(window).on("resize" + NS, this._resizeHandler);
            }

            if (this.options.contextMenu) {
                this._initContextMenu();
            }

            kendo.notify(this);
        },

        _draggable: function() {
            var that = this;
            var editable = this.options.editable;
            var dataSource = that.dataSource;
            var idField = dataSource._modelIdField();
            var parentIdField = dataSource._modelParentIdField();
            var pageable = that._isPageable();
            var reorderable, clickMoveClick;

            if (!editable || !editable.move) {
                return;
            }

            reorderable = editable.move.reorderable;

            if (editable.move.clickMoveClick !== false && this._hasDragHandleColumn) {
                clickMoveClick = true;
            }

            this._dragging = new kendo.ui.HierarchicalDragAndDrop(this.wrapper, {
                autoScroll: true,
                holdToDrag: touchDevice,
                filter: that._hasDragHandleColumn ? ".k-drag-cell" : "tbody>tr",
                itemSelector: "tr",
                allowedContainers: this.table,
                clickMoveClick: clickMoveClick,
                hintText: function(row) {
                    var text = function() { return $(this).text(); };
                    var separator = "<span class='k-drag-separator'></span>";

                    row = row.closest("tr");

                    return row.children("td").map(text).toArray().join(separator);
                },
                contains: (function(source, destination) {
                    var dest = this.dataItem(destination);
                    var src = this.dataItem(source);

                    return src == dest || this.dataSource.contains(src, dest);
                }).bind(this),
                itemFromTarget: function(target) {
                    var tr = target.closest("tr");
                    var prevRow = tr.prev();
                    var nextRow = tr.next();
                    var first;
                    var last;

                    if (prevRow) {
                        first = !that.sameLevel(prevRow, tr);
                    }

                    if (nextRow) {
                        last = !that.sameLevel(nextRow, tr);
                    }

                    return {
                        item: tr,
                        content: tr,
                        first: first,
                        last: last
                    };
                },
                dragstart: (function(source) {
                    this.wrapper.addClass("k-treelist-dragging");

                    if (this.wrapper.find('.k-grid-content').length) {
                        this.wrapper.find('.k-grid-content table, .k-grid-content-locked table').css("position", "relative");
                    }

                    var model = this.dataItem(source);

                    return this.trigger(DRAGSTART, { source: model });
                }).bind(this),
                drag: (function(e) {
                    e.source = this.dataItem(e.source);

                    this.trigger(DRAG, e);
                }).bind(this),
                drop: (function(e) {
                    e.source = this.dataItem(e.source);
                    e.destination = this.dataItem(e.destination);

                    this.wrapper.removeClass("k-treelist-dragging");

                    if (this.wrapper.find('.k-grid-content').length) {
                        this.wrapper.find('.k-grid-content table, .k-grid-content-locked table').css("position", "static");
                    }

                    return this.trigger(DROP, e);
                }).bind(this),
                dragend: (function(e) {
                    var dest = this.dataItem(e.destination);
                    var src = this.dataItem(e.source);
                    var originalSrcParentId = src[parentIdField];
                    var originalSrcIndex = dataSource._indexInChildrenMap(src);
                    var position = e.position;

                    if (position == "over") {
                        if (pageable) {
                            dataSource._removeFromChildrenMap(src);
                            src[parentIdField] = dest ? dest[idField] : null;

                            dataSource._initChildrenMapForParent(dest);

                            // src.set() below will not work as the parent id is already set
                            src[parentIdField] = originalSrcParentId;
                        }

                        var isPrevented = src.set("parentId", dest ? dest.id : null);

                        if (pageable && isPrevented) {
                            dataSource._removeFromChildrenMap(src);
                            src[parentIdField] = originalSrcParentId;
                            dataSource._removeFromChildrenMap(src);
                            dataSource._insertInChildrenMap(src, originalSrcIndex);
                        }


                    } else {
                        if (position == "before") {
                            that.insertBefore(src, dest);
                        } else if (position == "after") {
                            that.insertAfter(src, dest);
                        }
                    }

                    e.source = src;
                    e.destination = dest;

                    this.trigger(DRAGEND, e);
                }).bind(this),
                reorderable: reorderable,
                dropHintContainer: function(item) {
                    return item.children("td:visible").eq(0);
                },
                dropPositionFrom: function(dropHint) {
                    var contents;
                    var length;
                    var i;
                    var dropHintElement;
                    var isAfterText = false;

                    if (dropHint.parent().find('.k-i-none').length) {
                        return dropHint.prevAll(".k-i-none").length > 0 ? "after" : "before";
                    } else {
                        contents = dropHint.parent().contents();
                        length = contents.length;
                        dropHintElement = dropHint[0];

                        for (i = 0; i < length; i++) {
                            if (contents[i] === dropHintElement) {
                                break;
                            }

                            if (contents[i].nodeType === 3) {
                                isAfterText = true;
                            }
                        }

                        return isAfterText ? "after" : "before";
                    }
                }
            });
        },

        sameLevel: function() {
           return arguments[0].find("." + classNames.iconHidden).length === arguments[1].find("." + classNames.iconHidden).length;
        },

        insertAfter: function(nodeData, referenceNode) {
            this.insertAction(nodeData, referenceNode, 1);
        },

        insertBefore: function(nodeData, referenceNode) {
            this.insertAction(nodeData, referenceNode, 0);
        },

        insertAction: function(nodeData, referenceNode, indexOffset) {
            var that = this;
            var dataSource = that.dataSource;
            var parentIdField = dataSource._modelParentIdField();
            var referenceNodeIndex;
            var nodeDataIndex = dataSource.indexOf(nodeData);
            var pageable = that._isPageable();
            var originalDestIndex = dataSource._indexInChildrenMap(referenceNode);
            var destIndex;
            var childrenMap = dataSource._getChildrenMap() || {};
            var parentId = nodeData[parentIdField];

            that._unbindDataSource();
            that._unbindDataChange();

            if (pageable) {
                dataSource._removeFromChildrenMap(nodeData);
            }

            if (nodeData[parentIdField] != referenceNode[parentIdField]) {
                 nodeData.set("parentId", referenceNode && referenceNode.parentId ? referenceNode.parentId : null);
            }

            dataSource._data.splice(nodeDataIndex, 1);
            referenceNodeIndex = dataSource.indexOf(referenceNode);
            destIndex = referenceNodeIndex + indexOffset;

            if (pageable) {
                originalDestIndex += indexOffset;

                if (childrenMap[parentId].length <= originalDestIndex) {
                    originalDestIndex = childrenMap[parentId].length;
                }
                dataSource._insertInChildrenMap(nodeData, originalDestIndex);
            }

            dataSource._data.splice(destIndex, 0, nodeData);
            dataSource._destroyed.pop();
            that._bindDataChange();
            that._bindDataSource();
            that.refresh();
        },

        _bindDataChange: function() {
            var dataSource = this.dataSource;
            if (dataSource._data && dataSource._changeHandler) {
                dataSource._data.bind(CHANGE, dataSource._changeHandler);
                dataSource._data.trigger(CHANGE);
            }
        },

        _unbindDataChange: function() {
            var dataSource = this.dataSource;
            if (dataSource._data && dataSource._changeHandler) {
                dataSource._data.unbind(CHANGE, dataSource._changeHandler);
            }
        },

        _bindDataSource: function() {
            var that = this;
            var dataSource = that.dataSource;

            if (dataSource) {
                dataSource.bind(CHANGE, that._refreshHandler);
            }
        },

        _unbindDataSource: function() {
            var that = this;
            var dataSource = that.dataSource;

            if (dataSource) {
                dataSource.unbind(CHANGE, that._refreshHandler);
            }
        },

        itemFor: function(model) {
            if (typeof model == "number") {
                model = this.dataSource.get(model);
            }

            return this.tbody.find("[" + kendo.attr("uid") + "=" + model.uid + "]");
        },

        _itemFor: function(model) {
            var that = this;
            var table = that.lockedContent ? that.lockedTable : that.table;

            if (typeof model == "number") {
                model = this.dataSource.get(model);
            }

            return table.find("[" + kendo.attr("uid") + "=" + model.uid + "]");
        },

        _scrollable: function() {
            if (this.options.scrollable) {
                var scrollables = this.thead.closest(".k-grid-header-wrap");
                var lockedContent = $(this.lockedContent)
                    .on("DOMMouseScroll" + NS + " mousewheel" + NS, this._wheelScroll.bind(this));

                this.content.on("scroll" + NS, function() {
                    kendo.scrollLeft(scrollables, this.scrollLeft);
                    lockedContent.scrollTop(this.scrollTop);
                });

                this.element.find(".k-grid-content, .k-grid-content-locked").wrapAll("<div class='k-grid-container' />");

                var touchScroller = kendo.touchScroller(this.content);

                if (touchScroller && touchScroller.movable) {
                    this._touchScroller = touchScroller;

                    touchScroller.movable.bind("change", function(e) {
                        kendo.scrollLeft(scrollables, -e.sender.x);
                        if (lockedContent) {
                            lockedContent.scrollTop(-e.sender.y);
                        }
                    });
                }
            }
        },

        _wheelScroll: function(e) {
            if (e.ctrlKey) {
                return;
            }

            var delta = kendo.wheelDeltaY(e);
            var lockedDiv = $(e.currentTarget);

            if (delta) {
                if (lockedDiv[0].scrollHeight > lockedDiv[0].clientHeight &&
                    (lockedDiv[0].scrollTop < lockedDiv[0].scrollHeight - lockedDiv[0].clientHeight && delta < 0 ||
                    lockedDiv[0].scrollTop > 0 && delta > 0)) {
                    e.preventDefault();
                }
                //In Firefox DOMMouseScroll event cannot be canceled
                lockedDiv.one("wheel" + NS, false);

                this.content.scrollTop(this.content.scrollTop() + (-delta));
            }
        },

        _progress: function() {
            var messages = this.options.messages;

            if (!this.tbody.find("tr").length) {
                this._showStatus(
                    kendo.template(
                        ({ className, messages }) => `<span class='${className}'></span> ${encode(messages.loading)}`
                    )({
                        className: classNames.icon + " " + classNames.loading,
                        messages: messages
                    })
                );
            }
        },

        _error: function(e) {
            if (!this.dataSource.rootNodes().length) {
                this._render({ error: e });
            }
        },

        refresh: function(e) {
            var that = this;
            e = e || {};

            if (e.action == "itemchange" && this.editor) {
                return;
            }

            if (this.trigger(DATABINDING)) {
                return;
            }
            var current = $(this.current());
            var isCurrentInHeader = false;
            var currentIndex, currentRowIndex;

            this._cancelEditor();

            this._render();

            this._adjustHeight();

            if (this.options.navigatable) {
                if (this._isActiveInTable() || this.editor) {
                    isCurrentInHeader = current.is("th");
                    currentIndex = isCurrentInHeader ? current.parent().children(":not(.k-group-cell)").index(current[0]) : Math.max(this.cellIndex(current), 0);
                    currentRowIndex = !isCurrentInHeader && current.parent().index();
                }

                this._restoreCurrent(currentIndex, isCurrentInHeader, currentRowIndex);
            }

            if (that._checkBoxSelection) {
                that._deselectCheckRows(that.items(), true);
            }

            that._aria();

            this.trigger(DATABOUND);
        },

        items: function() {
            if (this._hasLockedColumns) {
                return this._items(this.tbody).add(this._items(this.lockedTable));
            } else {
                return this._items(this.tbody);
            }
        },

        _items: function(container) {
            return container.find("tr[data-uid]").filter(function() {
                return !$(this).hasClass(classNames.footerTemplate);
            });
        },

        _footerItems: function() {
            var container = this.tbody;
            if (this._hasLockedColumns) {
                container = container.add(this.lockedTable);
            }

            return container.find("tr").filter(function() {
                return $(this).hasClass(classNames.footerTemplate);
            });
        },

        dataItems: function() {
            var dataItems = kendo.ui.DataBoundWidget.fn.dataItems.call(this);
            if (this._hasLockedColumns) {
                var n = dataItems.length, tmp = new Array(2 * n);
                for (var i = n; --i >= 0;) {
                    tmp[i] = tmp[i + n] = dataItems[i];
                }
                dataItems = tmp;
            }

            return dataItems;
        },

        _showNoRecordsTemplate: function() {
            var wrapper = '<div class="{0}">{1}</div>';
            var defaultTemplate = '<div class="k-grid-norecords-template"{1}>{0}</div>';
            var scrollableNoGridHeightStyles = (this.options.scrollable && !this.wrapper[0].style.height) ? ` ${kendo.attr("style-margin")}="0 auto" ${kendo.attr("style-position")}="static"` : '';
            var template;
            var noRecordsElement;

            this._contentTree.render([]);
            if (this._hasLockedColumns) {
                this._lockedContentTree.render([]);
            }

            template = kendo.format(defaultTemplate, this.options.messages.noRows, scrollableNoGridHeightStyles);

            noRecordsElement = $(kendo.template(() => kendo.format(wrapper, NORECORDSCLASS, template))({}));
            kendo.applyStylesFromKendoAttributes(noRecordsElement, ["margin", "position"]);
            noRecordsElement.insertAfter(this.table);
        },

        _showStatus: function(message) {
            var status = this.element.find(".k-status");
            var content = $(this.content).add(this.lockedContent);

            if (!status.length) {
                status = $("<div class='k-status' role='alert' aria-live='polite' />").appendTo(this.element);
            }

            this._contentTree.render([]);
            if (this._hasLockedColumns) {
                this._lockedContentTree.render([]);
            }

            content.hide();

            status.html(message);
        },

        _hideStatus: function() {
            this.element.find(".k-status").remove();
            this._hideNoRecordsTempalte();

            $(this.content).add(this.lockedContent).show();
        },

        _hideNoRecordsTempalte: function() {
            this.element.find("." + NORECORDSCLASS).remove();
        },

        _adjustHeight: function() {
            var that = this;
            var element = this.element;
            var contentWrap = element.find(DOT + classNames.gridContentWrap);
            var header = element.find(DOT + classNames.gridHeader);
            var toolbar = element.find(DOT + classNames.gridToolbar);
            var status = element.find(DOT + classNames.status);
            var pagerHeight = that._isPageable() && that.pager && that.pager.element.is(":visible") ? outerHeight(that.pager.element) : 0;
            var height;
            var scrollbar = kendo.support.scrollbar();

            element.css(HEIGHT, this.options.height);

            // identical code found in grid & scheduler :(
            var isHeightSet = function(el) {
                var initialHeight, newHeight;
                if (el[0].style.height) {
                    return true;
                } else {
                    initialHeight = el.height();
                }

                el.height("auto");
                newHeight = el.height();
                el.height("");

                return (initialHeight != newHeight);
            };

            if (isHeightSet(element)) {
                height = that.options.hasHeader ?
                    element.height() - outerHeight(header) - outerHeight(toolbar) - outerHeight(status) - pagerHeight :
                    element.height() - outerHeight(toolbar) - outerHeight(status) - pagerHeight;

                contentWrap.height(height);

                if (this._hasLockedColumns) {
                    scrollbar = this.table[0].offsetWidth > this.table.parent()[0].clientWidth ? scrollbar : 0;
                    this.lockedContent.height(height - scrollbar);
                }
            }
        },

        _resize: function(size, force) {
            this._applyLockedContainersWidth();
            this._adjustHeight();

            if (this.pager && this.pager.element) {
                this.pager.resize(force);
            }
        },

        _minScreenSupport: function() {
            var any = this.hideMinScreenCols();

            if (any) {
                this.minScreenResizeHandler = this.hideMinScreenCols.bind(this);
                $(window).on("resize", this.minScreenResizeHandler);
            }
        },

        _iterateMinScreenCols: function(cols, screenWidth) {
            var any = false;

            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                var minWidth = col.minScreenWidth;
                if (minWidth !== undefined$1 && minWidth !== null) {
                    any = true;
                    if (minWidth > screenWidth) {
                        this.hideColumn(col);
                    } else {
                        this.showColumn(col);
                    }
                }
                if (!col.hidden && col.columns) {
                    any = this._iterateMinScreenCols(col.columns, screenWidth) || any;
                }
            }
            return any;
        },

        hideMinScreenCols: function() {
            var cols = this.columns,
                screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

            return this._iterateMinScreenCols(cols, screenWidth);
        },

        destroy: function() {
            this._destroyColumnAttachments();

            DataBoundWidget.fn.destroy.call(this);

            var dataSource = this.dataSource;

            dataSource.unbind(CHANGE, this._refreshHandler);
            dataSource.unbind(ERROR, this._errorHandler);
            dataSource.unbind(PROGRESS, this._progressHandler);

            if (this._navigatableTables) {
                this._navigatableTables.off(NS);
                this._navigatableTables = null;
                this._headertables = null;
            }

            this._current = null;

            if (this._resizeHandler) {
                $(window).off("resize" + NS, this._resizeHandler);
            }

            if (this._dragging) {
                this._dragging.destroy();
                this._dragging = null;
            }

            if (this.resizable) {
                this.resizable.destroy();
                this.resizable = null;
            }

            if (this.reorderable) {
                this.reorderable.destroy();
                this.reorderable = null;
            }

            if (this._draggableInstance && this._draggableInstance.element) {
                this._draggableInstance.destroy();
                this._draggableInstance = null;
            }

            if (this.selectable) {
                this.selectable.destroy();
            }

            if (this._userEvents) {
                this._userEvents.destroy();
                this._userEvents = null;
            }

            if (this.minScreenResizeHandler) {
                $(window).off("resize", this.minScreenResizeHandler);
            }

            this._destroyEditor();

            this.element.off(NS);
            if (this.wrapper) {
                this.wrapper.off(NS);
            }

            if (this._touchScroller) {
                this._touchScroller.destroy();
            }

            this._destroyPager();

            if (dataSource) {
                dataSource._dataMaps = null;
            }

            this._autoExpandable = null;

            this._refreshHandler = this._errorHandler = this._progressHandler = this._dataSourceFetchProxy = null;

            this.thead =
                this.content =
                this.tbody =
                this.table =
                this.element =
                this.lockedHeader =
                this.lockedContent = null;

            this._statusTree =
                this._headerTree =
                this._contentTree =
                this._lockedHeaderColsTree =
                this._lockedContentColsTree =
                this._lockedHeaderTree =
                this._lockedContentTree = null;

            kendo.destroy(this.wrapper);
        },

        options: {
            name: "TreeList",
            columns: [],
            autoBind: true,
            scrollable: true,
            selectable: false,
            sortable: false,
            toolbar: null,
            height: null,
            columnMenu: false,
            messages: {
                noRows: "No records to display",
                loading: "Loading...",
                requestFailed: "Request failed.",
                retry: "Retry",
                dragHandleLabel: "Drag row",
                commands: {
                    edit: "Edit",
                    update: "Save",
                    canceledit: "Cancel",
                    create: "Add new record",
                    createchild: "Add child record",
                    destroy: "Delete",
                    excel: "Export to Excel",
                    pdf: "Export to PDF",
                    search: "Search...",
                    select: "Select",
                    selectRow: "Select Row",
                    selectAllRows: "All rows",
                    clearSelection: "Clear selection",
                    exportPdf: "Export to PDF",
                    exportExcel: "Export to Excel",
                    sortAsc: "Sort Ascending",
                    sortDesc: "Sort Descending",
                    expandItem: "Expand Item",
                    collapseItem: "Collapse Item"
                },
                sortHeader: "Press Enter to sort",
                filterCellTitle: "filter cell"
            },
            excel: {
                hierarchy: true
            },
            resizable: false,
            search: false,
            filterable: false,
            editable: false,
            reorderable: false,
            pageable: false,
            renderAllRows: true,
            rowTemplate: null,
            altRowTemplate: null,
            hasHeader: true,
            contextMenu: false
        },

        events: [
            CHANGE,
            BEFORE_EDIT,
            EDIT,
            PAGE,
            SAVE,
            SAVE_CHANGES,
            REMOVE,
            EXPAND,
            COLLAPSE,
            DATABINDING,
            DATABOUND,
            CANCEL,
            DRAGSTART,
            DRAG,
            DROP,
            DRAGEND,
            FILTERMENUINIT,
            ITEM_CHANGE,
            CELL_CLOSE,
            FILTERMENUOPEN,
            COLUMNHIDE,
            COLUMNSHOW,
            COLUMNREORDER,
            COLUMNRESIZE,
            COLUMNMENUINIT,
            COLUMNMENUOPEN,
            COLUMNLOCK,
            COLUMNUNLOCK,
            FILTER,
            NAVIGATE,
            SORT
        ],

        getOptions: function() {
            var options = this.options;
            options.dataSource = null;

            var result = extend(true, {}, this.options);
            result.columns = kendo.deepExtend([], this.columns);

            var dataSource = this.dataSource;

            var initialData = dataSource.options.data && dataSource._data;
            dataSource.options.data = null;

            result.dataSource = $.extend(true, {}, dataSource.options);

            dataSource.options.data = initialData;

            result.dataSource.data = initialData;
            result.dataSource.page = dataSource.page();
            result.dataSource.filter = $.extend(true, {}, dataSource.filter());
            result.dataSource.pageSize = dataSource.pageSize();
            result.dataSource.sort = dataSource.sort();
            result.dataSource.group = dataSource.group();
            result.dataSource.aggregate = dataSource.aggregate();

            if (result.dataSource.transport) {
                result.dataSource.transport.dataSource = null;
            }

            if (result.pageable && result.pageable.pageSize) {
                result.pageable.pageSize = dataSource.pageSize();
            }

            return result;
        },

        setOptions: function(options) {
            var currentOptions = this.getOptions();
            kendo.deepExtend(currentOptions, options);
            if (!options.dataSource) {
                currentOptions.dataSource = this.dataSource;
            }
            var wrapper = this.wrapper;
            var events = this._events;
            var element = this.element;

            this.destroy();
            this.options = null;
            if (wrapper[0] !== element[0]) {
                wrapper.before(element);
                wrapper.remove();
            }
            element.empty();

            this.init(element, currentOptions, events);
            this._setEvents(currentOptions);
        },

        _destroyColumnAttachments: function() {
            var that = this;

            if (!that.thead) {
                return;
            }

            that.thead.add(that.lockedHeader).find("th").each(function() {
                var th = $(this),
                    filterMenu = th.data("kendoFilterMenu"),
                    sortable = th.data("kendoColumnSorter"),
                    columnMenu = th.data("kendoColumnMenu");

                if (filterMenu) {
                    filterMenu.destroy();
                }

                if (sortable) {
                    sortable.destroy();
                }

                if (columnMenu) {
                    columnMenu.destroy();
                }
            });
        },

        _toggle: function(model, expand) {
            var that = this;
            var defaultPromise = $.Deferred().resolve().promise();
            var loaded = model.loaded();

            if (that._isIncellEditable() && that.editor) {
                // manually trigger change as the expand/collapse icons are not focusable
                $(activeElement()).change();
                that.closeCell();
            }

            // reset error state
            if (model._error) {
                model.expanded = false;
                model._error = undefined$1;
            }

            // do not load items that are currently loading
            if (!loaded && model.expanded) {
                return defaultPromise;
            }

            // toggle expanded state
            if (typeof expand == "undefined") {
                expand = !model.expanded;
            }

            model.expanded = expand;

            function afterModelLoaded() {
                that._toggleData();
                if (that._isPageable()) {
                    that.refresh();
                } else {
                    that._render();
                }
                that._syncLockedContentHeight();
            }

            if (!loaded) {
                defaultPromise = this.dataSource.load(model)
                    .always((function() {
                        afterModelLoaded();
                    }));
            }

            afterModelLoaded();

            return defaultPromise;
        },

        _toggleData: function() {
            var that = this;

            if (that._isPageable()) {
                that._togglePageableData();
            }
        },

        _togglePageableData: function() {
            var that = this;
            var dataSource = that.dataSource;
            var data = dataSource._getData();
            var result;
            var queryOptions = dataSource._defaultPageableQueryOptions();

            that._renderProgress(true);

            var childrenMap = dataSource._getChildrenMap() || dataSource.childrenMap(dataSource._getData());

            dataSource._processDataItemsState(data, childrenMap);

            result = dataSource._processPageableQuery(data, queryOptions);

            queryOptions.childrenMap = result.childrenMap;
            queryOptions.filteredChildrenMap = result.filteredChildrenMap;

            dataSource._aggregateResult = dataSource._calculateAggregates(result.dataToAggregate, queryOptions);

            dataSource.view(result.data);

            if (!dataSource.filter()) {
                dataSource._calculateCollapsedTotal();
            }

            that._refreshPager();

            that._renderProgress(false);
        },

        _refreshPager: function() {
            var pager = this.pager;

            if (pager) {
                pager.refresh();
            }
        },

        expand: function(row) {
            return this._toggle(this.dataItem(row), true);
        },

        collapse: function(row) {
            return this._toggle(this.dataItem(row), false);
        },

        _toggleChildren: function(e) {
            var icon = $(e.target);
            var model = this.dataItem(icon);

            if (!model) {
                return;
            }

            var event = !model.expanded ? EXPAND : COLLAPSE;

            if (!this.trigger(event, { model: model })) {
                this._toggle(model);
            }

            e.preventDefault();
        },

        _navigatable: function() {
            var that = this;

            if (!that.options.navigatable) {
                that.table.attr("tabindex", 0);
                return;
            }
            var tables = that.table.add(that.lockedTable);

            var headerTables = that.thead.parent().add($(">table", that.lockedHeader));
            if (that.options.scrollable) {
                //add the header table when the widget is scrollable
                tables = tables.add(headerTables);
            }

            headerTables
                .find("a.k-link").attr("tabIndex", -1);

            this._navigatableTables = tables;
            this._headertables = headerTables;

            tables
                //handle click on tables, will attempt to focus the table
                .on((kendo.support.touch ? "touchstart" + NS : "mousedown" + NS), NAVROW + ">:visible", that._tableClick.bind(that))
                .on("focus" + NS, that._tableFocus.bind(that))
                .on("focusout" + NS, that._tableBlur.bind(that))
                .on("keydown" + NS, that._tableKeyDown.bind(that));
        },

        cellIndex: function(td) {
            var lockedColumnOffset = 0;

            if (this.lockedTable && !$.contains(this.lockedTable[0], td[0])) {
                lockedColumnOffset = leafColumns(lockedColumns(this.columns)).length;
            }

            return $(td).parent().children().index(td) + lockedColumnOffset;
        },

        _isActiveInTable: function() {
            var active = kendo._activeElement();

            if (!active) { return false; }

            return this.table[0] === active ||
                $.contains(this.table[0], active) ||
                (this.lockedTable &&
                    (this.lockedTable[0] === active || $.contains(this.lockedTable[0], active))
                );
        },

        _restoreCurrent: function(currentIndex, isCurrentInHeader, currentRowIndex) {
            var rowIndex;
            var row;
            var td;

            if (currentIndex === undefined$1 || currentIndex < 0) {
                return;
            }

            if (this._current) {
                this._current.removeClass("k-focus");
            }

            if (isCurrentInHeader) {
                this._setCurrent(this.thead.find("th").eq(currentIndex));
            } else {
                rowIndex = currentRowIndex || 0;
                currentIndex = currentIndex || 0;

                row = $();

                if (this.lockedTable) {
                    row = this.lockedTable.find(">tbody>tr:visible").eq(rowIndex);
                }
                row = row.add(this.tbody.children().eq(rowIndex));

                td = row.find(">td:visible")
                    .eq(currentIndex);

                this._setCurrent(td);
            }

            if (this._current) {
                focusTable(this.table, true);
                this._current.addClass("k-focus");
            }
        },

        current: function(newCurrent) {
            return this._setCurrent(newCurrent, true);
        },

        _setCurrent: function(newCurrent, preventTrigger, isIncellEditable) {
            var that = this;
            var current = that._current;
            newCurrent = $(newCurrent);

            if (isIncellEditable) {
                if (newCurrent[0]) {
                    that._current = newCurrent;
                    that._updateCurrentAttr(that._current, newCurrent);
                    that._scrollCurrent();

                    if (!preventTrigger) {
                        this.trigger(NAVIGATE, {
                            element: newCurrent
                        });
                    }
                }
            } else {
                if (newCurrent.length && (!current || current[0] !== newCurrent[0])) {
                    this._updateCurrentAttr(current, newCurrent);

                    this._scrollCurrent();

                    if (!preventTrigger) {
                        this.trigger(NAVIGATE, {
                            element: newCurrent
                        });
                    }
                }

                if (newCurrent && newCurrent.length) {
                    this._lastCellIndex = newCurrent.parent().children(DATA_CELL).index(newCurrent);
                }
            }

            return that._current;
        },

        _scrollCurrent: function() {
            var current = this._current;
            var scrollable = this.options.scrollable;

            if (!current || !scrollable) {
                return;
            }

            var row = current.parent();
            var tableContainer = row.closest("table").parent();

            var isInLockedContainer = tableContainer.is(".k-grid-content-locked,.k-grid-header-locked");
            var isInContent = tableContainer.is(".k-grid-content-locked,.k-grid-content");

            var scrollableContainer = $(this.content)[0];

            //adjust scroll vertically
            if (isInContent) {
                this._scrollTo(this._relatedRow(row)[0], scrollableContainer);
            }

            if (this.lockedContent) {
                //sync locked and non-locked content scrollTop
                this.lockedContent[0].scrollTop = scrollableContainer.scrollTop;
            }

            //adjust scroll horizontally, if not inside locked tables
            if (!isInLockedContainer) {
                this._scrollTo(current[0], scrollableContainer);
            }
        },

        _findCurrentCell: function() {
            var that = this;
            var current = that.current();
            var elements = $(that.table).add(that.header).add(that.lockedTable).add(that.lockedHeader);

            if (current && elements.find(current).length > 0) {
                return current;
            } else {
                return elements.find(DOT + classNames.focused);
            }
        },

        _scrollTo: function(element, container) {
            var elementToLowercase = element.tagName.toLowerCase();
            var isHorizontal = elementToLowercase === "td" || elementToLowercase === "th";
            var table = $(element).closest("table")[0];
            var elementOffsetDir = element[isHorizontal ? "offsetWidth" : "offsetHeight"];
            var containerScroll = container[isHorizontal ? "scrollLeft" : "scrollTop"];
            var containerOffsetDir = container[isHorizontal ? "clientWidth" : "clientHeight"];
            var elementOffset = $(element).css("position") === "relative" && isRtl && isHorizontal ? Math.abs(table.offsetLeft - element.offsetLeft) : element[isHorizontal ? "offsetLeft" : "offsetTop"];
            var bottomDistance = elementOffset + elementOffsetDir;
            var result = 0;
            var ieCorrection = 0;
            var firefoxCorrection = 0;

            if (isRtl && isHorizontal) {
                if (browser.msie || browser.edge) {
                    ieCorrection = table.offsetLeft;
                } else if (browser.mozilla || (browser.webkit && (browser.version > 85))) {
                    firefoxCorrection = table.offsetLeft - kendo.support.scrollbar();
                }
            }
            containerScroll = Math.abs(containerScroll + ieCorrection - firefoxCorrection);
            if (containerScroll > elementOffset) {
                result = elementOffset;
            } else if (bottomDistance > (containerScroll + containerOffsetDir)) {
                if (elementOffsetDir <= containerOffsetDir) {
                    result = (bottomDistance - containerOffsetDir);
                } else {
                    result = elementOffset;
                }
            } else {
                result = containerScroll;
            }
            result = Math.abs(result + ieCorrection) + firefoxCorrection;
            container[isHorizontal ? "scrollLeft" : "scrollTop"] = result;
        },

        _aria: function() {
            var wrapper = this.wrapper,
                gridRole = "treegrid",
                table = this.table,
                toolbar = wrapper.find(".k-grid-toolbar"),
                groupingHeader = wrapper.find(".k-grouping-header"),
                gridId = table.attr("id"),
                tableTabindex = table.attr("tabindex"),
                tbodyId, headerGroupId, footerGroupId, tableOwned,
                numberOfFixedRows = this.thead.find("tr").length + this.wrapper.find(".k-grid-footer-wrap table tr").length,
                trailingColumns = this._trailingColumns(),
                virtual = this.virtualScroll,
                pageable = this.options.pageable,
                rowsCount;

            table.attr({
                role: gridRole,
                tabindex: tableTabindex >= 0 ? tableTabindex : 0
            });

            table.find("tbody, thead, tfoot").attr("role", "rowgroup");
            table.find("tr").attr("role", "row");
            table.find("th").attr("role", "columnheader");
            table.find("td").attr("role", "gridcell");

            if ((pageable && this.dataSource.totalPages() > 1) || (virtual && virtual.rows)) {
                if (this._groups() > 0) {
                    rowsCount = -1;
                } else {
                    rowsCount = numberOfFixedRows + this.dataSource.total();
                }

                table.attr("aria-rowcount", rowsCount);
            }

            if (rowsCount && rowsCount > 0) {
                this._ariaRowIndex();
            }

            if ((virtual && virtual.columns) ||
                (!table.attr("aria-colcount") &&
                    (table.find("td:hidden").length > 0 ||
                    wrapper.find(".k-grid-content-locked td:hidden").length > 0))) {
                        table.attr("aria-colcount", trailingColumns + leafColumns(this.columns).length);
                        this._ariaColumnIndex();
            }

            if (!gridId) {
                gridId = kendo.guid();
                table.attr("id", gridId);
            }

            if (this.pager) {
                this.pager.element.attr("aria-controls", gridId);
            }

            toolbar.attr({
                role: "toolbar",
                "aria-label": this.options.messages.toolbarLabel,
                "aria-controls": gridId
            });

            groupingHeader.attr({
                role: "toolbar",
                "aria-label": this.options.messages.groupingHeaderLabel,
                "aria-controls": gridId
            });

            headerGroupId = this._ariaHeaderFooter("header", "thead", "th, td", "columnheader");
            footerGroupId = this._ariaHeaderFooter("footer", "tfoot", "td", "gridcell");

            if (wrapper.find(".k-grid-content-locked").length > 0) {
                this._ariaLockedContent();
            }

            if (!!headerGroupId || !!footerGroupId) {
                tbodyId = this.tbody.attr("id") || kendo.guid();
                tableOwned = [headerGroupId, tbodyId, footerGroupId].join(" ");

                this.tbody.attr("id", tbodyId);
                table.attr("aria-owns", tableOwned);
            }
        },

        _ariaColumnIndex: function() {
            var trailingColumns = this._trailingColumns(),
                dataVirtual = this.tbody.find(">tr").last().find("> td[data-virtual]"),
                headerRows = this.thead.find(">tr").not(".k-filter-row"),
                lockedHeaderRows = this.wrapper.find(".k-grid-header-locked thead > tr").not(".k-filter-row"),
                firstIndex = Number.MAX_VALUE,
                lastIndex = 0,
                lockedLastIndex = 0,
                previousVirtual = 0,
                nextVirtual = 0,
                previousIndex, i, cells, dataIndex, cellsIndex,
                eachHeaderCell = function(j, cell) {
                    var current = cell.getAttribute("data-index"),
                        currentIndex = Number(current),
                        lockedParent = $(cell).closest(".k-grid-header-locked");

                    if (lockedParent.length === 0 && currentIndex < firstIndex) {
                        firstIndex = currentIndex;
                    }

                    if (lockedParent.length > 0 && lockedLastIndex < currentIndex) {
                        lockedLastIndex = currentIndex;
                    }

                    if (lockedParent.length === 0 && lastIndex < currentIndex) {
                        lastIndex = currentIndex;
                    }

                    if (current !== null) {
                        cell.setAttribute("aria-colindex", Number(currentIndex) + 1);
                        previousIndex = Number(currentIndex) + 1 + cell.getAttribute("colspan");
                    } else {
                        cell.setAttribute("aria-colindex", previousIndex + 1);
                        previousIndex = previousIndex + cell.getAttribute("colspan");
                    }
                };

            if (dataVirtual.length === 2) {
                previousVirtual = Number(dataVirtual[0].getAttribute("colspan"));
                nextVirtual = Number(dataVirtual[1].getAttribute("colspan"));
            } else if (dataVirtual.length === 1 && dataVirtual.prev().length === 0) {
                previousVirtual = Number(dataVirtual[0].getAttribute("colspan"));
            } else if (dataVirtual.length === 1 && dataVirtual.prev().length === 1) {
                nextVirtual = Number(dataVirtual[0].getAttribute("colspan"));
            }

            for (i = 0; i < lockedHeaderRows.length; i++) {
                previousIndex = 0;
                lockedHeaderRows.eq(i).find("th").each(eachHeaderCell);
            }

            for (i = 0; i < headerRows.length; i++) {
                previousIndex = 0;
                headerRows.eq(i).find("th").each(eachHeaderCell);
            }

            for (i = 0; i <= lockedLastIndex; i++) {
                dataIndex = i + trailingColumns;
                cells = this.wrapper.find(".k-grid-content-locked tbody > tr > td:nth-child(" + (i + 1) + ")");
                cells.attr("aria-colindex", dataIndex + 1);
            }

            for (i = previousVirtual; i <= lastIndex - firstIndex - nextVirtual; i++) {
                if (previousVirtual === 0 ) {
                    cellsIndex = i + 1;
                } else {
                    cellsIndex = i - previousVirtual + 2;
                }

                dataIndex = firstIndex + i + trailingColumns;

                cells = this.tbody.find("> tr > td:nth-child(" + cellsIndex + ")");
                cells.attr("aria-colindex", dataIndex + 1);
            }
        },

        _ariaHeaderFooter: function(type, group, el, role) {
            var that = this,
                wrapper = that.wrapper,
                table = wrapper.find(".k-grid-" + type + " .k-grid-" + type + "-wrap table"),
                lockedTable = wrapper.find(".k-grid-" + type + " .k-grid-" + type + "-locked table"),
                groupId = "",
                rowGroup;

            if (table.length > 0) {
                rowGroup = table.find(group + ", tbody");
                groupId = rowGroup.attr("id") || kendo.guid();

                table.attr("role", "none");
                table.find("tr").attr("role", "row");
                table.find(el).attr("role", role);
                rowGroup.attr({
                    role: "rowgroup",
                    id: groupId
                });
            }

            if (lockedTable.length > 0) {
                that._ariaLocked(type, group, el, role);
            }

            lockedTable.find("td").attr("role", "gridcell");
            table.find("td").attr("role", "gridcell");

            return groupId;
        },

        _ariaId: function() {
            var id = this.element.attr("id") || "aria";

            if (id) {
                this._cellId = id + "_active_cell";
            }
        },

        _ariaLocked: function(type, group, el, role) {
            var that = this,
                wrapper = that.wrapper,
                table = wrapper.find(".k-grid-" + type + " .k-grid-" + type + "-wrap table"),
                lockedTable = wrapper.find(".k-grid-" + type + " .k-grid-" + type + "-locked table"),
                rows = table.find("tr"),
                lockedRows = lockedTable.find("tr");

            lockedTable.attr("role", "none");
            lockedTable.find(group + ", tbody").attr("role", "none");
            lockedRows.attr("role", "none");

            lockedTable.find(el).attr("role", role);

            rows.each(function(i, row) {
                var ownedCells = [];

                ownedCells = that._cellsIds(lockedRows.eq(i).find(el), "locked_" + type, i);
                ownedCells = ownedCells.concat(that._cellsIds($(row).find(el), type, i));

                row.setAttribute("aria-owns", ownedCells.join(" "));
            });
        },

        _ariaLockedContent: function() {
            var that = this,
                table = that.table,
                tableRows = table.find("tr"),
                lockedTable = that.wrapper.find(".k-grid-content-locked table"),
                lockedRows = lockedTable.find("tr");

            lockedTable.attr("role", "none");
            lockedTable.find("tbody").attr("role", "none");
            lockedRows.attr("role", "none");
            lockedTable.find("td").attr("role", "gridcell");

            tableRows.each(function(i, row) {
                var ownedCells = [];

                ownedCells = that._cellsIds(lockedRows.eq(i).find("td"), "locked_datacell", i);
                ownedCells = ownedCells.concat(that._cellsIds($(row).find("td"), "datacell", i));

                row.setAttribute("aria-owns", ownedCells.join(" "));
            });
        },

        _ariaAddHiddenColIndex: function() {
            var virtualScroll = this.virtualScroll || {},
                columns = this.columns,
                table = this.table,
                leafColsCount = leafColumns(columns).length;

            if (!virtualScroll.columns && !table.attr("aria-colcount")) {
                this._ariaColumnIndex();

                table.attr("aria-colcount", leafColsCount);
            }
        },

        _ariaRemoveHiddenColIndex: function() {
            var virtualScroll = this.virtualScroll || {},
                columns = this.columns,
                leafColsCount = leafColumns(columns).length;

            if (!virtualScroll.columns /* && (leafColsCount === visibleLeafColumns(this.columns).length)*/) {
                this.wrapper.find("td, th").removeAttr("aria-colindex");

                this.table.removeAttr("aria-colcount");
            }
        },

        _ariaRowIndex: function() {
            var headerRows = this.thead.find(">tr"),
                numberOfHeaderRows = headerRows.length,
                bodyRows = this.tbody.find(">tr"),
                footerRows = this.wrapper.find(".k-grid-footer-wrap tfoot > tr"),
                totalNumberOfItems = this.dataSource.total(),
                previousItems = this.dataSource.skip() || 0,
                currentIndex = 1,
                previousMaster = false,
                i, currentRow;

            for (i = 0; i < numberOfHeaderRows; i++) {
                headerRows.eq(i).attr("aria-rowindex", currentIndex + i);
            }

            currentIndex = numberOfHeaderRows + previousItems;

            for (i = 0; i < bodyRows.length; i++) {
                currentRow = bodyRows.eq(i);
                currentIndex = currentIndex + 1;
                currentRow.attr("aria-rowindex", currentIndex);
            }

            currentIndex = numberOfHeaderRows + totalNumberOfItems + 1;

            for (i = 0; i < footerRows.length; i++) {
                footerRows.eq(i).attr("aria-rowindex", currentIndex + i);
            }
        },

        _cellsIds: function(elements, prefix, i) {
            var ownedCells = [];

            elements.each(function(j, cell) {
                var id = cell.getAttribute("id") || prefix + "_" + i + "_" + j;

                cell.setAttribute("id", id);

                ownedCells.push(id);
            });

            return ownedCells;
        },

        _trailingColumns: function() {
            return this._groups();
        },

        _groups: function() {
            var group = this.dataSource.group();

            return group ? group.length : 0;
        },

        _currentDataIndex: function(table, current) {
            var index = current.attr("data-index");

            if (!index) {
                return undefined$1;
            }

            var lockedColumnsCount = lockedColumns(this.columns).length;
            if (lockedColumnsCount && !table.closest("div").hasClass("k-grid-content-locked")[0]) {
                return index - lockedColumnsCount;
            }

            return index;
        },

        _prevVerticalCell: function(container, current) {
            var cells;
            var row = current.parent();
            var rows = container.children(NAVROW);
            var rowIndex = rows.index(row);
            //get data-index in case of last level of multi-level columns
            var index = this._currentDataIndex(container, current);
            var cellSelector = DATA_CELL + "," + FILTER_CELL;

            //current is in the header, but not at the last level of multi-level columns
            if ((index || current.hasClass("k-header")) && !row.hasClass("k-filter-row")) {
                cells = parentColumnsCells(current);
                return cells.eq(cells.length - 2);
            }

            index = Math.max(row.children(cellSelector).index(current), this._lastCellIndex || 0);

            //if current is inside filter row
            if (row.hasClass("k-filter-row")) {
                return leafDataCells(container).filter(isCellVisible).eq(index);
            }

            //move up to header container
            if (rowIndex == -1) {
                //is there filter row in the header container
                row = container.find("tr.k-filter-row:visible");
                if (!row[0]) {
                    return leafDataCells(container).filter(isCellVisible).eq(index);
                }
            } else {
                row = rowIndex === 0 ? $() : rows.eq(rowIndex - 1);
            }

            cells = row.children(cellSelector);
            if (cells.length > index) {
                return cells.eq(index);
            }

            return cells.eq(0);
        },

        _nextVerticalCell: function(container, current) {
            var cells;
            var row = current.parent();
            var rows = container.children(NAVROW);
            var rowIndex = rows.index(row);
            //get data-index in case of last level of multi-level columns
            var index = this._currentDataIndex(container, current);
            var cellSelector = DATA_CELL + "," + FILTER_CELL;

            //current is in the header, but not at the last level of multi-level columns
            //and we are not changing the table
            if (rowIndex != -1 && index === undefined$1 && current.hasClass("k-header")) {
                return childColumnsCells(current).eq(1);
            }

            index = index ? parseInt(index, 10) : row.children(cellSelector).index(current);
            index = Math.max(index, this._lastCellIndex || 0);

            //move down to data container
            if (rowIndex == -1) {
                row = rows.eq(0);
            } else {
                row = rows.eq(rowIndex + current[0].rowSpan);
            }

            var tmpIndex = index;
            //in case of last level of multi-level columns the index should be updated depending on the hidden columns
            if (this._currentDataIndex(container, current) !== undefined$1) {
                var currentRowCells = row.children(":not(.k-group-cell):not(.k-hierarchy-cell)");
                var hiddenColumns = currentRowCells.filter(":hidden");
                for (var idx = 0, length = hiddenColumns.length; idx < length; idx++) {
                    if (currentRowCells.index(hiddenColumns[idx]) < index) {
                        tmpIndex--;
                    }
                }
            }
            index = tmpIndex;

            cells = row.children(cellSelector);
            if (cells.length > index) {
                return cells.eq(index);
            }

            return cells.eq(0);
        },

        _verticalContainer: function(container, up) {
            var table = container.parent();
            var length = this._navigatableTables.length;
            var step = Math.floor(length / 2);
            var index = inArray(table[0], this._navigatableTables);

            if (up) {
                step *= -1;
            }
            index += step;

            if (index >= 0 || index < length) {
                table = this._navigatableTables.eq(index);
            }

            return table.find(up ? "thead" : "tbody");
        },

        _filterFocusable: function() {
            return this.wrapper.find(".k-filter-row").find(".k-dropdownlist, .k-input .k-input-inner:visible, input[type='radio']:visible, input[type='checkbox']:visible");
        },

        _updateCurrentAttr: function(current, next) {
            var headerId = $(current).data("headerId");

            $(current)
                .removeClass(classNames.focused);
            this.table.removeAttr(ARIA_ACTIVEDESCENDANT);

            if (headerId) {
                headerId = headerId.replace(this._cellId, "");
                $(current).attr("id", headerId);
            } else {
                $(current).removeAttr("id");
            }

            next
                .data("headerId", next.attr("id"))
                .attr("id", this._cellId)
                .addClass(classNames.focused);


            this.table.attr(ARIA_ACTIVEDESCENDANT, this._cellId);

            this._current = next;
        },

        _tableKeyDown: function(e) {
            var handled = false;
            var current = this.current();
            var target = $(e.target);
            var canHandle = !e.isDefaultPrevented() && !target.is(":button,a,:input,a>.k-icon,a>.k-svg-icon");

            current = current ? current : $(this.lockedTable).add(this.table).find(NAVROW + " > td:visible").first();

            if (e.altKey && e.keyCode == keys.DOWN) {
                current.find(".k-grid-filter-menu, .k-grid-column-menu").click();
                e.stopImmediatePropagation();
                return;
            }

            if (e.keyCode === keys.F10 && this.toolbar && this.toolbar.length) {
                this.toolbar.find("[tabindex=0]:visible").first().trigger("focus");
                handled = true;
            }

            if (canHandle && e.keyCode == keys.UP) {
                handled = this._moveUp(current, e.shiftKey);
            }

            if (canHandle && e.keyCode == keys.DOWN) {
                handled = this._moveDown(current, e.shiftKey);
            }

            if (canHandle && e.ctrlKey && current.is(".k-header") && this.options.reorderable && e.keyCode == (isRtl ? keys.RIGHT : keys.LEFT)) {
                this._moveColumn(current, true);
            } else if (canHandle && e.ctrlKey && current.is(".k-header") && this.options.reorderable && e.keyCode == (isRtl ? keys.LEFT : keys.RIGHT)) {
                this._moveColumn(current, false);
            } else if (canHandle && e.keyCode == (isRtl ? keys.LEFT : keys.RIGHT)) {
                if (e.altKey) {
                    this._handleExpand(current);
                    handled = true;
                } else {
                    handled = this._moveRight(current);
                }
            } else if (canHandle && e.keyCode == (isRtl ? keys.RIGHT : keys.LEFT)) {
                if (e.altKey) {
                    this._handleCollapse(current);
                    handled = true;
                } else {
                    handled = this._moveLeft(current);
                }
            }

            if (canHandle && e.keyCode == keys.PAGEDOWN) {
                handled = this._handlePageDown();
            }

            if (canHandle && e.keyCode == keys.PAGEUP) {
                handled = this._handlePageUp();
            }

            if (e.keyCode == keys.ENTER || e.keyCode == keys.F2) {
                handled = this._handleEnterKey(current, e.currentTarget, target);
            }

            if (e.keyCode == keys.ESC) {
                handled = this._handleEscKey(current, e.currentTarget);
            }

            if (canHandle && e.keyCode == keys.HOME) {
                handled = this._handleHome(current, e.ctrlKey);
            }

            if (canHandle && e.keyCode == keys.END) {
                handled = this._handleEnd(current, e.ctrlKey);
            }

            if (e.keyCode == keys.TAB) {
                handled = this._handleTabKey(current, e.currentTarget, e.shiftKey, target);
            }

            if (handled) {
                //prevent scrolling while pressing the keys
                e.preventDefault();
                //required in hierarchy
                e.stopPropagation();
            }
        },

        _moveColumn: function(current, isLeft) {
            var elements = this.wrapper.data().kendoReorderable.element.find(this._draggableInstance.options.filter + ":visible");
            var columns = visibleColumns(flatColumnsInDomOrder(this.columns));
            var oldIndex = elements.index($(current));
            var offset = isLeft ? - 1 : 1;
            var column = columns[oldIndex];
            var newIndex = targetParentContainerIndex(columns, this.columns, oldIndex, oldIndex + offset);

            if (newIndex >= 0) {
                this.reorderColumn(newIndex, column, isLeft);
                this.trigger(COLUMNREORDER, {
                    newIndex: newIndex,
                    oldIndex: oldIndex,
                    column: column
                });
            }
        },

        _handleExpand: function(current) {
            var that = this;
            var row = current.parent();
            var model = that.dataItem(row);

            if (current.hasClass("k-header")) {
                return false;
            }

            if (model && model.hasChildren && !model.expanded && !that.trigger(EXPAND, { model: model })) {
                this.expand(row);
                return true;
            }

            return false;
        },

        _handleCollapse: function(current) {
            var that = this;
            var row = current.parent();
            var model = that.dataItem(row);

            if (current.hasClass("k-header")) {
                return false;
            }

            if (model && model.hasChildren && model.expanded && !that.trigger(COLLAPSE, { model: model })) {
                that.collapse(row);
                return true;
            }

            return false;
        },

        _handleHome: function(current, ctrl) {
            var row = current.parent();
            var rowContainer = row.parent();
            var isInLockedTable = this.lockedTable && this.lockedTable.children("tbody")[0] === rowContainer[0];
            var isInBody = rowContainer[0] === this.tbody[0];
            var prev;

            if (ctrl) {
                if (this.lockedTable) {
                    prev = this.lockedTable.find(NAVROW + " > td:visible").first();
                } else {
                    prev = this.table.find(NAVROW + " > td:visible").first();
                }
            } else if (isInBody || isInLockedTable) {
                if (isInBody && this.lockedTable) {
                    row = this._relatedRow(row);
                }
                prev = row.children(NAVCELL).first();
            }

            if (prev && prev.length) {
                this._setCurrent(prev);
                return true;
            }
        },

        _handleEnd: function(current, ctrl) {
            var row = current.parent();
            var rowContainer = row.parent();
            var isInLockedTable = this.lockedTable && this.lockedTable.children("tbody")[0] === rowContainer[0];
            var isInBody = rowContainer[0] === this.tbody[0];
            var next;

            if (ctrl) {
                next = this.table.find(ITEMROW).last().children(NAVCELL).last();
            } else if (isInBody || isInLockedTable) {
                if (!isInBody && this.lockedTable) {
                    row = this._relatedRow(row);
                }
                next = row.children(NAVCELL).last();
            }

            if (next && next.length) {
                this._setCurrent(next);
                return true;
            }
        },

        _handlePageDown: function() {
            var that = this;

            if (!that._isPageable()) {
                return false;
            }

            that.dataSource._restorePageSizeAfterAddChild();
            that.dataSource.page(that.dataSource.page() + 1);

            return true;
        },

        _handlePageUp: function() {
            var that = this;

            if (!that._isPageable()) {
                return false;
            }

            that.dataSource._restorePageSizeAfterAddChild();
            that.dataSource.page(that.dataSource.page() - 1);

            return true;
        },

        _handleEscKey: function(current, currentTable) {
            var active = kendo._activeElement();
            var currentIndex;
            var that = this;
            var row;
            var rowIndex;
            var cellIndex;
            var tbody;

            if (!current || !current.parent().hasClass("k-grid-edit-row")) {
                if (current.has(active).length) {
                    // return focus back to the table
                    focusTable(that.table, true);

                    return true;
                }

                if (current.parent().hasClass("k-filter-row")) {
                    this._filterFocusable().attr(TABINDEX, -1);
                    focusTable(this.table, true);

                    return true;
                }

                return false;
            }

            if (that._isIncellEditable()) {
                row = current.parent();
                cellIndex = current.index();
                rowIndex = row.index();
                tbody = row.closest("tbody");

                that.closeCell(true);

                // refresh the current element as the DOM element reference can be changed after render()
                // moving this to closeCell() causes flickering when clicking on a cell and then on another
                // as 'k-focused' is shown for the closing cell and then added to the newly edited cell
                that._setCurrent(tbody.children().eq(rowIndex).children().eq(cellIndex), false, true);
            } else {
                currentIndex = $(current).parent().index();
                if (active) {
                    active.blur();
                }
                this.cancelRow();
                if (currentIndex >= 0) {
                    this._setCurrent(this.items().eq(currentIndex).children(NAVCELL).first());
                }
            }

            focusTable(that.table, true);

            return true;
        },

        _handleEnterKey: function(current, currentTable, target) {
            var editable = this.options.editable;
            var container = target.closest("[role=gridcell]");
            var focusable, link, filterFocusable;

            if (!target.is("table") && !$.contains(current[0], target[0])) {
                current = container;
            }

            if (current.is("th")) {
                // sort the column, if possible
                link = current.find(".k-link");

                if (current.has($(activeElement())).length > 0) {
                    return false;
                } else if (link.length) {
                    link.click();
                } else if (current.parent().hasClass("k-filter-row")) {
                    filterFocusable = this._filterFocusable();
                    filterFocusable.attr(TABINDEX, 0);
                    current.find(":kendoFocusable").first().focus();
                } else {
                    current.find(CHECKBOXINPUT).trigger("focus");
                }

                return true;
            }

            focusable = current.find(":kendoFocusable").first();
            if (focusable[0] && current.hasClass("k-focus")) {
                focusable.trigger("focus");

                return true;
            }

            if (editable && !target.is(":button,.k-button,textarea")) {
                if (!container[0]) {
                    container = current;
                }

                this._handleEditing(container, false, currentTable);

                return true;
            }

            if (!editable && current.is("td[aria-expanded]")) {
                if (current.is("[aria-expanded=false]")) {
                    this._handleExpand(current);
                } else {
                    this._handleCollapse(current);
                }
            }

            return false;
        },

        _handleTabKey: function(current, currentTable, shiftKey, target) {
            var that = this;
            var incellEditing = that.options.editable && that._isIncellEditable();
            var cell, filterFocusable;

            if (!incellEditing || current.is("th") || (this.options.scrollable ? this._headertables.filter(currentTable).length : this.thead.filter(target).length)) {
                if (current.parent().hasClass("k-filter-row")) {
                    filterFocusable = this._filterFocusable();

                    if (!shiftKey && filterFocusable[filterFocusable.length - 1] === document.activeElement) {
                        filterFocusable.first().trigger("focus");

                        return true;
                    } else if (shiftKey && filterFocusable[0] === document.activeElement) {
                        filterFocusable.last().trigger("focus");

                        return true;
                    }
                }

                return false;
            }

            cell = $(activeElement()).closest(DOT + classNames.editCell);

            if (that.options._tabCycleStop) {
                return false;
            }

            if (cell[0] && cell[0] !== current[0]) {
                current = cell;
            }

            cell = that._tabNext(current, currentTable, shiftKey);

            if (cell.length) {
                that._handleEditing(current, cell, cell.closest(TABLE));
                return true;
            } else {
                that._preventPageSizeRestore = false;
            }

            return false;
        },

        _tabNext: function(current, currentTable, back) {
            var that = this;
            var switchRow = true;
            var next = back ? current.prevAll(DATA_CELL).first() : current.nextAll(":visible").first();

            if (!next.length) {
                next = current.parent();
                if (that.lockedTable) {
                    switchRow = (back && currentTable == that.lockedTable[0]) || (!back && currentTable == that.table[0]);
                    next = that._relatedRow(next);
                }

                if (switchRow) {
                    next = next[back ? "prevAll" : "nextAll"]("tr:not(.k-grouping-row):not(.k-detail-row):visible").first();
                }

                if (back) {
                    next = next.children(DATA_CELL).last();
                } else {
                    next = next.children(DATA_CELL).first();
                }


                that.dataSource._restorePageSizeAfterAddChild();
            }

            return next;
        },

        _handleEditing: function(current, next, table) {
            var that = this,
                active = $(kendo._activeElement()),
                isIE = browser.msie,
                editContainer,
                focusable,
                isEdited;
            var editable = that.options.editable && that.options.editable.update !== false;
            var incellEditing = that._isIncellEditable();
            var nextFocusableCellRowIndex = $(next).parents("tr").index();
            var nextFocusableCellIndex = $(next).index();
            var currentFocusedCellRowIndex = $(current).parents("tr").index();
            var currentFocusedCellIndex = current.index();
            var editedCell;

            table = $(table);

            if (incellEditing) {
                isEdited = current.hasClass(classNames.editCell);
            } else {
                isEdited = current.parent().hasClass("k-grid-edit-row");
            }

            if (that.editor) {
                editContainer = that.editor.wrapper;
                if (editContainer && $.contains(editContainer[0], active[0])) {
                    if (browser.opera) {
                        active.trigger("blur").change().triggerHandler("blur");
                    } else {
                        active.trigger("blur");
                        if (isIE) {
                            //IE10 with jQuery 1.9.x does not trigger blur handler
                            //numeric textbox does trigger change
                            active.trigger("blur");
                        }
                    }
                }

                if (!that.editor) {
                    focusTable(that.table);
                    return;
                }

                if (that.editor.end()) {
                    if (incellEditing) {
                        that._preventPageSizeRestore = true;
                        that.closeCell();
                        that._preventPageSizeRestore = false;

                        if ($(that.table).add(that.lockedTable).find(DOT + classNames.editCell).length === 0) {
                            that._setCurrent(table.find("tbody").children().eq(currentFocusedCellRowIndex).children().eq(currentFocusedCellIndex));
                        }
                    } else {
                        that.saveRow();
                        isEdited = true;
                    }
                } else {
                    if (incellEditing) {
                        that._setCurrent(editContainer);
                    } else {
                        that._setCurrent(editContainer.children().filter(NAVCELL).first());
                    }

                    focusable = editContainer.find(":kendoFocusable").first()[0];
                    if (focusable) {
                        focusable.focus();
                    }
                    return;
                }
            }

            // the next cell to focus might be re-rendered, so update the reference to it if it is an element
            next = $(next).length && table.find(next).length === 0 ? table.find("tbody").children().eq(nextFocusableCellRowIndex).children().eq(nextFocusableCellIndex) : next;

            if (next) {
                that._setCurrent(next);
            }

            focusTable(that.table, true);

            if (!editable) {
                return;
            }

            if ((!isEdited && !next) || next) {
                if (!that.current()) {
                    return;
                }
                var currentIndex = that.current().index();

                if (incellEditing) {
                    that.editCell(that.current());

                    editedCell = $(that.table).add(that.lockedTable).find(DOT + classNames.editCell)[0];

                    if (editedCell) {
                        that._current = $(editedCell);
                    } else {
                        that._setCurrent(that._findCurrentCell());
                    }
                } else {
                    that.editRow(that.current().parent());
                    that._setCurrent(that.editor.wrapper.children().eq(currentIndex));
                    that.current().removeClass("k-focus");
                }
            } else {
                that.dataSource._restorePageSizeAfterAddChild();
            }
        },

        _moveRight: function(current) {
            var next = current.nextAll(NAVCELL).first();
            var row = current.parent();
            var rowIndex = row.index();

            if (current.hasClass("k-header") || row.is('.k-filter-row')) {
                next = current.nextAll(NAVHEADER).first();
                if (!next[0] && this.lockedTable && current.closest("table")[0] === this.lockedHeader.find("table")[0]) {
                    next = this.thead.find("tr").eq(rowIndex).find(NAVHEADER).first();
                }
            }

            if (!next[0] && this.lockedTable && current.closest("table")[0] === this.lockedTable[0]) {
               next = this._relatedRow(row).children(NAVCELL).first();
            }

            if (next[0] && next[0] !== current[0]) {
                focusTable(this.table, true);
            }

            this._setCurrent(next);

            return true;
        },

        _moveLeft: function(current) {
            var prev = current.prevAll(NAVCELL).first();
            var row = current.parent();
            var rowIndex = row.index();

            if (current.hasClass("k-header") || row.is('.k-filter-row')) {
                prev = current.prevAll(NAVHEADER).first();
                if (!prev[0] && this.lockedTable && current.closest("table")[0] === this.thead.parent()[0]) {
                    prev = this.lockedHeader.find(">table>thead>tr").eq(rowIndex).children(NAVHEADER).last();
                }
            }

            if (!prev[0] && this.lockedTable && current.closest("table")[0] === this.table[0]) {
               prev = this._relatedRow(row).children(NAVCELL).last();
            }

            if (prev[0] && prev[0] !== current[0]) {
                focusTable(this.table, true);
            }

            this._setCurrent(prev);

            return true;
        },

        _moveUp: function(current, shiftKey) {
            var container = current.parent().parent();
            var prev;

            if (shiftKey) {
               prev = current.parent();
               prev = prev.prevAll(ITEMROW).first();
               prev = current.parent().is(ITEMROW) ? prev.children().eq(current.index()) : prev.children(DATA_CELL).last();
            } else {
               prev = this._prevVerticalCell(container, current);
               if (!prev[0]) {
                  this._lastCellIndex = 0;
                  container = this._verticalContainer(container, true);

                  prev = this._prevVerticalCell(container, current);

                  if (prev[0]) {
                      focusTable(this.table, true);
                  }
               }
            }

            var tmp = this._lastCellIndex || 0;
            this._setCurrent(prev);
            this._lastCellIndex = tmp;

            return true;
        },

        _moveDown: function(current, shiftKey) {
            var container = current.parent().parent();
            var next;

            if (shiftKey) {
                next = current.parent();
                next = next.nextAll(ITEMROW).first();
                next = current.parent().is(ITEMROW) ? next.children().eq(current.index()) : next.children(DATA_CELL).first();
            } else {
                next = this._nextVerticalCell(container, current);
                if (!next[0]) {
                    this._lastCellIndex = 0;
                    container = this._verticalContainer(container);

                    next = this._nextVerticalCell(container, current);
                    if (next[0]) {
                        focusTable(this.table, true);
                    }
                }
            }
            var tmp = this._lastCellIndex || 0;
            this._setCurrent(next);
            this._lastCellIndex = tmp;
            return true;
        },

        _tableClick: function(e) {
            var that = this,
                currentTarget = $(e.currentTarget),
                isHeader = currentTarget.is("tr:not('.k-filter-row')>th"),
                target = $(e.target),
                table = this.table.add(this.lockedTable),
                headerTable = this.thead.parent().add($(">table", this.lockedHeader)),
                isInput = isInputElement(target.add(target.closest(".k-button-icon"))),
                currentTable = currentTarget.closest("table")[0];

            if (kendo.support.touch) {
                return;
            }

            if (currentTable !== table[0] && currentTable !== table[1] && currentTable !== headerTable[0] && currentTable !== headerTable[1]) {
                return;
            }

            if (this.options.navigatable && !isInput) {
                this._setCurrent(currentTarget);
            }

            if (isHeader || !isInput) {
                setTimeout(function() {
                   if (!isInputElement(kendo._activeElement()) || !$.contains(currentTable, kendo._activeElement())) {
                       focusTable(that.table, true);
                   }
                });
            }

            if (isHeader) {
                e.preventDefault(); //if any problem occurs, call preventDefault only for the clicked header links
            }
        },

        _tableFocus: function(e) {
            var current = this.current();
            var table = this.lockedTable ? this.lockedTable : this.table;

            if (current && current.is(":visible")) {
                current.addClass(classNames.focused);
            } else {
                this._setCurrent(table.find(NAVROW + " > td:visible").first());
            }

            this.table.attr(TABINDEX, 0);
        },

        _tableBlur: function() {
            var current = this.current();

            if (current) {
                current.removeClass(classNames.focused);
            }
        },

        _attachEvents: function() {
            var that = this;
            var retryButton = DOT + classNames.retry;

            that._userEvents = new kendo.UserEvents(that.element, {
                tap: that._onPress.bind(that),
                allowSelection: true
            });

            this.element
                .on(CLICK + NS, retryButton, this._dataSourceFetchProxy)
                .on(CLICK + NS, ".k-button[data-command]", this._commandClick.bind(this))
                .on(INPUT + NS, ".k-grid-search input", this._search.bind(this));

            this._attachCellEditingEventHandlers();
        },

        _onPress: function(e) {
            var that = this;

            if (that._isToggleIcon(e.event.target)) {
                that._toggleChildren.call(that, e.event);
            }
        },

        _isToggleIcon: function(target) {
            const icons = ICON_EXPAND_COLLAPSE_SELECTOR +
                "," + ICON_REFRESH_SELECTOR;

            return $(target).closest(":not(path,svg)").is(icons);
        },

        _attachCellEditingEventHandlers: function() {
            var that = this;
            var editable = that.options.editable;
            var selectable = that.selectable && that.selectable.options.multiple;
            var closeCell = function(e) {
                var target = activeElement();
                var editor = that.editor || {};
                var cell = editor.element;

                if (cell && !$.contains(cell[0], target) && cell[0] !== target && !$(target).closest(".k-animation-container").length) {
                    if (editor.end()) {
                        if (!e.relatedTarget && that._isPageable() && !isUndefined(that.dataSource._addChildPageSize)) {
                            that._preventPageSizeRestore = false;
                        }

                        that.closeCell();
                    }
                }

                that._preventPageSizeRestore = false;
            };
            if (that._isIncellEditable() && editable.update !== false) {
                that.wrapper
                    .on(that.options._editCellEvent || CLICK + NS, "tr:not(.k-grouping-row) > td", function(e) {
                        var td = $(this),
                            isLockedCell = that.lockedTable && td.closest("table")[0] === that.lockedTable[0];

                        if (that._isToggleIcon(e.target)) {
                            return;
                        }

                        if (td.hasClass(classNames.editCell) ||
                            td.has("a.k-grid-delete").length ||
                            td.has("button.k-grid-delete").length ||
                            (td.closest("tbody")[0] !== that.tbody[0] && !isLockedCell) ||
                            $(e.target).is(":input") ||
                            $(e.target).is(ICON_EXPAND_COLLAPSE_SELECTOR)) {

                            if (!that.editor) {
                                that.dataSource._restorePageSizeAfterAddChild();
                            }

                            that._preventPageSizeRestore = false;

                            return;
                        }

                        if (that.editor) {
                            if (td.is(":not(.k-command-cell)") && that.editor.end()) {
                                if (selectable) {
                                    $(activeElement()).trigger("blur");
                                }
                                that.closeCell();
                                that.editCell(td);
                            }
                        } else {
                            that.editCell(td);
                        }
                    })
                    .on("mousedown" + NS, "tr:not(.k-grouping-row) > td", function(e) {
                        // cache the result on "mousedown", which is fired before "focusout" and "click"
                        if (that.editor && that._isPageable() && !isUndefined(that.dataSource._addChildPageSize)) {
                            that._preventPageSizeRestore = $(e.target).parents(DOT + classNames.editRow).length > 0;
                        } else {
                            that._preventPageSizeRestore = false;
                        }
                    })
                    .on("focusin" + NS, function() {
                        // fix focus issue in IE
                        if (!$.contains(this, activeElement())) {
                            clearTimeout(that._closeCellTimeout);
                            that._closeCellTimeout = null;
                        }
                    })
                    .on("focusout" + NS, function(e) {
                        that._closeCellTimeout = setTimeout(function() {
                            closeCell(e);
                        }, 1);
                    });
            }
        },

        _commandByName: function(name) {
            var columns = this.columns;
            var toolbar = Array.isArray(this.options.toolbar) ? this.options.toolbar : [];
            var i, j, commands, currentName;

            if (!name) {
                return;
            }
            name = name.toLowerCase();

            if (defaultCommands[name]) {
                return defaultCommands[name];
            }

            // command not found in defaultCommands, must be custom
            for (i = 0; i < columns.length; i++) {
                commands = columns[i].command;
                if (commands) {
                    for (j = 0; j < commands.length; j++) {
                        currentName = commands[j].name;

                        if (!currentName) {
                            continue;
                        }

                        if (currentName.toLowerCase() == name) {
                            return commands[j];
                        }
                    }
                }
            }

            // custom command in toolbar
            for (i = 0; i < toolbar.length; i++) {
                currentName = toolbar[i].name;

                if (!currentName) {
                    continue;
                }

                if (currentName.toLowerCase() == name) {
                    return toolbar[i];
                }
            }
        },

        _commandClick: function(e) {
            var button = $(e.currentTarget);
            var commandName = button.attr("data-command") || button.parent().attr("data-command");
            var command = this._commandByName(commandName);
            var row = button.parentsUntil(this.wrapper, "tr");

            row = row.length ? row : undefined$1;

            if (command) {
                if (command.methodName) {
                    this[command.methodName](row);
                } else if (command.click) {
                    command.click.call(this, e);
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }
            }
        },

        _search: function(e) {
            var that = this;
            var input = e.currentTarget;
            clearTimeout(that._searchTimeOut);
            that._searchTimeOut = setTimeout(function() {
                that._searchTimeOut = null;
                var options = that.options;
                var searchFields = options.search ? options.search.fields : null;
                var expression = { filters: [], logic: "or" };
                var value = input.value;

                if (!searchFields) {
                    searchFields = getColumnsFields(options.columns);
                }

                if (value) {
                    for (var i = 0; i < searchFields.length; i++) {
                        expression.filters.push({ field: searchFields[i], operator: "contains", value: value });
                    }
                } else {
                    expression = {};
                }

                that.dataSource.filter(expression);

            }, 300);
        },

        _ensureExpandableColumn: function() {
            if (this._autoExpandable) {
                delete this._autoExpandable.expandable;
            }

            var visibleColumns = grep(this.columns, not(is("hidden")));
            visibleColumns = grep(visibleColumns, not(is("command")));
            visibleColumns = grep(visibleColumns, not(is("selectable")));
            visibleColumns = grep(visibleColumns, not(is("draggable")));

            var expandableColumns = grep(visibleColumns, is("expandable"));

            if (this.columns.length && !expandableColumns.length) {
                this._autoExpandable = visibleColumns[0];
                visibleColumns[0].expandable = true;
            }
        },

        _columns: function() {
            var that = this,
                columns = this.options.columns || [],
                draggableColumns;

            this.columns = map(columns, function(column) {
                column = (typeof column === "string") ? { field: column } : column;

                return extend({ encoded: true }, column);
            });

            var lockedCols = lockedColumns(columns);
            if (lockedCols.length > 0) {
                if (this.options.rowTemplate || this.options.altRowTemplate) {
                    throw new Error("Having both row template and locked columns is not supported");
                }
                this._hasLockedColumns = true;
                this.columns = lockedCols.concat(nonLockedColumns(this.columns));
            }

            this.columns = normalizeColumns(this.columns);

            this._ensureExpandableColumn();

            this._columnTemplates();
            this._columnAttributes();

            if ($.grep(leafColumns(that.columns), function(col) {
                if (col.selectable) {
                    that._includeChildren = col.includeChildren;
                }
                return col.selectable;
            }).length) {
                that._checkBoxSelection = true;
                that.element.on(CLICK + NS, "tbody > tr " + CHECKBOXINPUT, that._checkboxClick.bind(that));
                that.element.on(CLICK + NS, "thead > tr " + CHECKBOXINPUT, that._headerCheckboxClick.bind(that));
            }

            draggableColumns = $.grep(leafColumns(that.columns), function(col) { return col.draggable;});

            if (draggableColumns.length) {
                that._hasDragHandleColumn = true;

                for (var i = 0; i < draggableColumns.length; i++) {
                    draggableColumns[i].headerAttributes = $.extend({
                        "aria-label": that.options.messages.dragHandleLabel
                    }, draggableColumns[i].headerAttributes);
                }
            }
        },

        _columnTemplates: function() {
            var idx, length, column;
            var columns = leafColumns(this.columns);

            for (idx = 0, length = columns.length; idx < length; idx++) {
                column = columns[idx];
                if (column.template) {
                    column.template = kendo.template(column.template);
                }

                if (this._isIncellEditable()) {
                    column.dirtyCellTemplate = this._createDirtyColumnTemplate(column);
                    column.dirtyIndicatorTemplate = this._createIndicatorTemplate(column);
                }

                if (column.headerTemplate) {
                    column.headerTemplate = kendo.template(column.headerTemplate);
                }

                if (column.footerTemplate) {
                    column.footerTemplate = kendo.template(column.footerTemplate);
                }
            }
        },

        _columnAttributes: function() {
            // column style attribute is string, kendo.dom expects object
            var idx, length;
            var columns = this.columns;

            function convertStyle(attr) {
                var properties, i, declaration;

                if (attr && attr.style && attr.style.split) {
                    properties = attr.style.split(";");
                    attr.style = {};

                    for (i = 0; i < properties.length; i++) {
                        declaration = properties[i].split(":");

                        var name = kendo.trim(declaration[0]);

                        if (name) {
                            attr.style[$.camelCase(name)] = kendo.trim(declaration[1]);
                        }
                    }
                }
            }

            for (idx = 0, length = columns.length; idx < length; idx++) {
                convertStyle(columns[idx].attributes);
                convertStyle(columns[idx].headerAttributes);
            }
        },

        _clearSortClasses: function() {
            var that = this;

            if (that.content) {
                that.content.find("col:not(.k-group-col):not(.k-hierarchy-col)").removeClass("k-sorted");
            }

            if (that.lockedContent) {
                that.lockedContent.find("col:not(.k-group-col):not(.k-hierarchy-col)").removeClass("k-sorted");
            }
        },

        _layout: function() {
            var that = this;
            var columns = this.columns;
            var element = this.element;

            this.wrapper = element.addClass(classNames.wrapper);

            var layoutTemplateFunction = ({ gridHeader, gridHeaderWrap, gridContentWrap, toolbar, gridToolbar }) => {
                var layout = this.options.hasHeader ? `<div class='${gridHeader}'>` : '';
                if (this.options.hasHeader && this._hasLockedColumns) {
                    layout += "<div class='k-grid-header-locked'>" +
                                    "<table class='k-grid-header-table k-table k-table-md'>" +
                                        "<colgroup></colgroup>" +
                                        "<thead class='k-table-thead' role='rowgroup'></thead>" +
                                    "</table>" +
                                "</div>";
                }

                if (this.options.hasHeader) {
                layout += `<div class='${gridHeaderWrap}'>` +
                                "<table class='k-grid-header-table k-table k-table-md'>" +
                                    "<colgroup></colgroup>" +
                                    "<thead class='k-table-thead' role='rowgroup'></thead>" +
                                "</table>" +
                            "</div>" +
                        "</div>";
                }

                if (this._hasLockedColumns) {
                    layout += "<div class='k-grid-content-locked'>" +
                                    "<table class='k-grid-table k-table k-table-md' role='treegrid'>" +
                                        "<colgroup></colgroup>" +
                                        "<tbody class='k-table-tbody' role='rowgroup'></tbody>" +
                                    "</table>" +
                                "</div>";
                }

                layout += `<div class='${gridContentWrap} k-auto-scrollable'>` +
                                "<table class='k-grid-table k-table k-table-md' role='treegrid'>" +
                                    "<colgroup></colgroup>" +
                                    "<tbody class='k-table-tbody' role='rowgroup'></tbody>" +
                                "</table>" +
                            "</div>";

                if (!this.options.scrollable) {
                    layout =
                        `<table class='k-grid-table k-table k-table-md' role='treegrid' >` +
                            `<colgroup></colgroup>` +
                            `${ this.options.hasHeader ? `<thead class='k-table-thead ${gridHeader}' role='rowgroup'></thead>` : ''}` +
                            `<tbody class='k-table-tbody' role='rowgroup'></tbody>` +
                        `</table>`;
                }

                if (this.options.toolbar) {
                    layout = `<div class='${toolbar} ${gridToolbar}'></div>` + layout;
                }

                return layout;
            };

            layoutTemplateFunction = layoutTemplateFunction.bind(that);

            element.append(
                kendo.template(layoutTemplateFunction)(classNames) +
                "<div class='k-status' role='alert' aria-live='polite'></div>"
            );

            this.toolbar = element.find(DOT + classNames.gridToolbar);

            var header = element.find(DOT + classNames.gridHeader).find("thead").addBack().filter("thead");
            this.thead = header.last();

            if (this.options.scrollable) {
                var rtl = kendo.support.isRtl(element);

                element.find("div." + classNames.gridHeader)
                    .css(rtl ? "padding-left" : "padding-right", kendo.support.scrollbar());
            }


            var content = element.find(DOT + classNames.gridContentWrap);
            if (!content.length) {
                content = element;
            } else {
                this.content = content;
            }

            this.table = content.find(">table").addClass("k-grid-table");
            this.tbody = this.table.find(">tbody");

            if (this._hasLockedColumns) {
                this.lockedHeader = header.first().closest(".k-grid-header-locked");
                this.lockedContent = element.find(".k-grid-content-locked");
                this.lockedTable = this.lockedContent.children().addClass("k-grid-table");
            }

            this._initVirtualTrees();

            this._renderCols();

            if ( that.options.hasHeader) {
                this._renderHeader();
            }
        },

        _initVirtualTrees: function() {
            this._headerColsTree = new kendoDom.Tree(this.thead.prev()[0]);
            this._contentColsTree = new kendoDom.Tree(this.tbody.prev()[0]);
            this._headerTree = new kendoDom.Tree(this.thead[0]);
            this._contentTree = new kendoDom.Tree(this.tbody[0]);
            this._statusTree = new kendoDom.Tree(this.element.children(".k-status")[0]);

            if (this.lockedHeader) {
                this._lockedHeaderColsTree = new kendoDom.Tree(this.lockedHeader.find("colgroup")[0]);
                this._lockedContentColsTree = new kendoDom.Tree(this.lockedTable.find(">colgroup")[0]);
                this._lockedHeaderTree = new kendoDom.Tree(this.lockedHeader.find("thead")[0]);
                this._lockedContentTree = new kendoDom.Tree(this.lockedTable.find(">tbody")[0]);
            }
        },

        _processToolbarItems: function(commands) {
            var that = this,
                messages = that.options.messages.commands,
                items = [];

            commands.map(command => {
                var name = (isPlainObject(command) ? command.name || "" : command).toLowerCase(),
                    text = messages[name];

                if (!name && !(isPlainObject(command) && command.template)) {
                    throw new Error("Commands should have name specified");
                }

                command = extend({}, defaultCommands[name], {
                    name: name,
                    text: (defaultCommands[name] || {}).text || text || capitalize(name),
                    type: command.template ? null : "button"
                }, command);

                if (name === "search") {
                    items.push({ type: "spacer" });
                    command.template = command.template({ message: command.text || messages.search });
                }

                if (command.imageClass) {
                    command.spriteCssClass = command.imageClass;
                    command.iconClass = command.imageClass;
                }

                if (that._commandByName(name)) {
                    if (!command.attributes) {
                        command.attributes = {};
                    }

                    command.attributes["data-command"] = name;
                    command.click = (e) => {
                        e.event.preventDefault();
                        e.event.stopPropagation();

                        that._commandClick({
                            currentTarget: e.target
                        });
                    };
                }

                if (command.className) {
                    if (!command.attributes) {
                        command.attributes = {};
                    }

                    command.attributes["class"] = command.className;
                }

                items.push(command);
            });

            return items;
        },

        _toolbar: function() {
            var options = this.options.toolbar;
            var toolbar = this.toolbar;

            if (!options) {
                return;
            }

            if (Array.isArray(options)) {
                toolbar.kendoToolBar({
                    size: "medium",
                    navigateOnTab: !this.options.navigatable,
                    items: this._processToolbarItems(options)
                });
            } else {
                toolbar.append(kendo.template(options)({}));
            }
        },

        _initContextMenu: function() {
            var that = this,
                options = that.options,
                tbodyContextMenu = isPlainObject(options.contextMenu) && isArray(options.contextMenu.body) ? { items: options.contextMenu.body } : { items: defaultBodyContextMenu },
                theadContextMenu = isPlainObject(options.contextMenu) && isArray(options.contextMenu.head) ? { items: options.contextMenu.head } : { items: defaultHeadContextMenu };

            var mainOptions = isPlainObject(options.contextMenu) ? options.contextMenu : {};

            tbodyContextMenu = extend({}, {
                messages: options.messages,
                target: that.tbody,
                filter: ".k-table-td",
                action: that._action.bind(that),
                states: that._buildStates()
            }, mainOptions, tbodyContextMenu);

            theadContextMenu = extend({}, {
                messages: options.messages,
                target: that.thead,
                filter: ".k-table-th",
                action: that._action.bind(that),
                states: that._buildStates()
            }, mainOptions, theadContextMenu);

            that.tbodyContextMenu = new ui.treelist.ContextMenu("<ul></ul>", tbodyContextMenu);
            that.theadContextMenu = new ui.treelist.ContextMenu("<ul></ul>", theadContextMenu);
        },

        _buildStates: function() {
            var that = this;

            return {
                isEditable: that.options.editable,
                isSelectable: that.options.selectable,
                isMultiRowSelectionEnabled: that.options.selectable === "multiple, row",
                isSortable: that.options.sortable && that.options.hasHeader,
                alwaysDisabled: false,
                hasSelection: () => (this.select() ? this.select().length > 0 : false),
                isSorted: () => !(this.dataSource.sort() ? this.dataSource.sort().length > 0 : false),
                isExpandable: (target) => {
                    let dataItem = this.dataItem(target);
                    return (dataItem && dataItem.hasChildren && !dataItem.expanded);
                },
                isCollapsible: (target) => {
                    let dataItem = this.dataItem(target);
                    return (dataItem && dataItem.hasChildren && dataItem.expanded);
                }
            };
        },

        _action: function(args) {
            var commandName = args.command,
                commandOptions = extend({ treelist: this }, args.options),
                command = new ui.treelist.commands[commandName](commandOptions);

            return command.exec();
        },

        _lockedColumns: function() {
            return grep(this.columns, is("locked"));
        },

        _nonLockedColumns: function() {
            return grep(this.columns, not(is("locked")));
        },

        _templateColumns: function() {
            return grep(this.columns, is("template"));
        },

        _render: function(options) {
            var that = this;
            options = options || {};
            options = that._renderOptions(options);
            var messages = this.options.messages;
            var pageable = that._isPageable();
            var dataSource = that.dataSource;

            var maps = { children: (options.filteredChildrenMap || options.childrenMap), ids: options.idsMap };
            var dataMaps = pageable ? (maps && maps.children && maps.ids ? maps : dataSource._initDataMaps(dataSource._getData())) : {};
            var childrenMap = dataMaps.children;
            var idsMap = dataMaps.ids;
            options.childrenMap = childrenMap;
            options.idsMap = idsMap;

            var data = that._dataToRender(options);
            var level = that._renderedModelLevel(data[0], options);
            var uidAttr = kendo.attr("uid");
            var hasFooterTemplate;
            var selected = this.select().removeClass("k-selected").map(function(_, row) {
                return $(row).attr(uidAttr);
            });
            var viewChildrenMap;

            this._absoluteIndex = 0;

            that._clearRenderMap();

            if (options.error) {
                // root-level error message
                this._showStatus(kendo.template(
                    ({ messages, buttonClass }) =>
                    `${encode(messages.requestFailed)} ` +
                    `<button class='${buttonClass} k-button-md k-rounded-md k-button-solid k-button-solid-base'><span class='k-button-text'>${encode(messages.retry)}</span></button>`
                )({
                    buttonClass: [classNames.button, classNames.retry].join(" "),
                    messages: messages
                }));
            } else if (!data.length) {
                // no rows message
                this._hideStatus();
                this._showNoRecordsTemplate();
            } else {
                if (pageable) {
                    viewChildrenMap = that._viewChildrenMap(options);
                }

                // render rows
                this._hideStatus();

                hasFooterTemplate = this._hasFooterTemplate();

                that._renderRows(options, data, leafColumns(nonLockedColumns(this.columns)), selected, childrenMap, viewChildrenMap, hasFooterTemplate);

                if (this._hasLockedColumns) {
                    this._absoluteIndex = 0;
                    this._lockedContentTree.render(this._trs({
                        columns: leafColumns(lockedColumns(this.columns)),
                        editedColumn: options.editedColumn,
                        editedColumnIndex: options.editedColumnIndex,
                        aggregates: options.aggregates,
                        selected: selected,
                        data: data,
                        childrenMap: childrenMap,
                        viewChildrenMap: viewChildrenMap,
                        hasFooterTemplate: hasFooterTemplate,
                        visible: true,
                        level: level,
                        isLockedTable: true
                    }));
                }
            }

            if (this._touchScroller) {
                this._touchScroller.contentResized();
            }

            this.items().filter(function() {
                return $.inArray($(this).attr(uidAttr), selected) >= 0;
            })
            .addClass("k-selected");

            this._syncLockedContentHeight();

            that._togglePagerVisibility();

            that._setExpanderElement();
        },

        _renderRows: function(options, data, columns, selected, childrenMap, viewChildrenMap, hasFooterTemplate) {
            this._contentTree.render(this._trs({
                columns: columns,
                editedColumn: options.editedColumn,
                editedColumnIndex: options.editedColumnIndex,
                aggregates: options.aggregates,
                selected: selected,
                data: data,
                childrenMap: childrenMap,
                viewChildrenMap: viewChildrenMap,
                hasFooterTemplate: hasFooterTemplate,
                visible: true,
                level: 0
            }));
        },

        _setExpanderElement: function() {
            var that = this,
                hiddenDivClass = 'k-grid-content-expander',
                hiddenDiv = '<div class="' + hiddenDivClass + '"></div>',
                expander;

            if (that.options.scrollable && that.wrapper.is(":visible")) {
                expander = that.table.parent().children('.' + hiddenDivClass);
                if (!that.dataSource || !that.dataSource.view().length) {
                    if (!expander[0]) {
                        expander = $(hiddenDiv).appendTo(that.table.parent());
                    }
                    if (that.thead) {
                        expander.width(that.thead.width());
                    }
                } else if (expander[0]) {
                    expander.remove();
                }
            }
        },

        _renderProgress: function(toggle) {
            kendo.ui.progress(this.wrapper, toggle);
        },

        _renderOptions: function(options) {
            options = options || {};
            var that = this;
            var dataMaps = that.dataSource._getDataMaps();
            var filter = that.dataSource.filter();

            if (that._isPageable()) {
                options.childrenMap = dataMaps.children;
                options.idsMap = dataMaps.ids;

                if (filter) {
                    options.filteredChildrenMap = dataMaps.filteredChildren;
                }
            }

            return options;
        },

        _renderedModelLevel: function(model, options) {
            return !this._isPageable() ? 0 : this.dataSource._pageableModelLevel(model, options);
        },

        _viewChildrenMap: function(options) {
            options = options || {};
            var that = this;
            var dataSource = that.dataSource;
            var viewChildrenMap = dataSource.childrenMap(dataSource.view());
            var idField = dataSource._modelIdField();
            var parentsNotInView = dataSource._parentNodesNotInView();
            var parentNotInView;
            var parentNotInViewId;
            var parents;
            var parent;
            var parentId;
            var child;
            var childId;
            var parentsCopy;

            that._clearRenderMap();

            for (var i = 0; i < parentsNotInView.length; i++) {
                parentNotInView = parentsNotInView[i];
                parentNotInViewId = parentNotInView[idField];

                that._markNodeAsNonRenderable(parentNotInViewId);

                viewChildrenMap[parentNotInViewId] = viewChildrenMap[parentNotInViewId] || [];

                parents = dataSource._parentNodes(parentNotInView);

                // copy the items to avoid mutating the original collection
                parentsCopy = parents.slice();
                parentsCopy.push(parentNotInView);

                for (var parentIndex = 0; parentIndex < parentsCopy.length - 1; parentIndex++) {
                    parent = parentsCopy[parentIndex];
                    parentId = parent[idField];
                    that._markNodeAsNonRenderable(parentId);
                    viewChildrenMap[parentId] = viewChildrenMap[parentId] || [];

                    child = parentsCopy[parentIndex + 1];
                    childId = child[idField];
                    that._markNodeAsNonRenderable(childId);
                    viewChildrenMap[childId] = viewChildrenMap[childId] || [];

                    if (viewChildrenMap[parentId].indexOf(child) === -1) {
                        viewChildrenMap[parentId].unshift(child);
                    }
                }
            }

            return viewChildrenMap;
        },

        _clearRenderMap: function() {
            this._skipRenderingMap = {};
        },

        _dataToRender: function(options) {
            var that = this;

            if (that._isPageable()) {
                return that.dataSource._pageableRootNodes(options);
            }

            return that.dataSource.rootNodes();
        },

        _markNodeAsNonRenderable: function(nodeId) {
            this._skipRenderingMap[nodeId] = true;
        },

        _adjustRowsHeight: function(table1, table2) {
            if (!this._hasLockedColumns) {
                return;
            }

            var rows = table1[0].rows;
            var length = rows.length;
            var idx;
            var rows2 = table2[0].rows;
            var containers = table1.add(table2);
            var containersLength = containers.length;
            var heights = [];

            for (idx = 0; idx < length; idx++) {
                if (!rows2[idx]) {
                    break;
                }

                if (rows[idx].style.height) {
                    rows[idx].style.height = rows2[idx].style.height = "";
                }
            }

            for (idx = 0; idx < length; idx++) {
                if (!rows2[idx]) {
                    break;
                }

                var offsetHeight1 = rows[idx].offsetHeight;
                var offsetHeight2 = rows2[idx].offsetHeight;
                var height = 0;

                if (offsetHeight1 > offsetHeight2) {
                    height = offsetHeight1;
                } else if (offsetHeight1 < offsetHeight2) {
                    height = offsetHeight2;
                }

                heights.push(height);
            }

            for (idx = 0; idx < containersLength; idx++) {
                containers[idx].style.display = "none";
            }

            for (idx = 0; idx < length; idx++) {
                if (heights[idx]) {
                    //add one to resolve row misalignment in IE
                    rows[idx].style.height = rows2[idx].style.height = (heights[idx] + 1) + "px";
                }
            }

            for (idx = 0; idx < containersLength; idx++) {
                containers[idx].style.display = "";
            }
        },

        _ths: function(columns, rowSpan) {
            var ths = [];
            var column, title, children, cellClasses, attr, headerContent;
            var index;
            var leafs;

            for (var i = 0, length = columns.length; i < length; i++) {
                column = columns[i];
                children = [];
                cellClasses = [classNames.header];

                if (column.selectable) {
                    leafs = leafColumns(columns);
                    index = inArray(column, leafs);
                    attr = {
                        scope: "col",
                        role: "columnheader",
                        className: cellClasses.join(" ")
                    };

                    if (column.headerTemplate) {
                        title = column.headerTemplate({});
                    }

                    title = column.headerTemplate ? title : kendo.template( () => SELECTCOLUMNHEADERTMPL)({});


                    if (rowSpan && !column.colSpan) {
                        attr.rowSpan = rowSpan;
                    }

                    if (index > -1) {
                        attr[kendo.attr("index")] = index;
                    }

                    children.push(kendoHtmlElement(title));

                    ths.push(kendoDomElement("th", $.extend(true, {}, attr, column.headerAttributes), children));
                    continue;
                }

                if (column.headerTemplate) {
                    title = column.headerTemplate({});
                } else {
                    title = column.title || column.field || "";
                }

                if (column.headerTemplate) {
                    headerContent = kendoHtmlElement(title);
                } else {
                    headerContent = kendoTextElement(title);
                }

                if (this.options.sortable) {
                    children.push(kendoDomElement("span", { className: classNames.headerCellInner }, [
                        kendoDomElement("span", { className: classNames.link }, [
                            kendoDomElement("span", { className: classNames.columnTitle }, [
                                headerContent
                            ])
                        ])
                    ]));
                } else {
                    children.push(headerContent);
                }

                attr = {
                    "data-field": column.field,
                    "data-title": column.title,
                    "style": column.hidden === true ? { "display": "none" } : {},
                    className: cellClasses.join(" "),
                    "role": "columnheader"
                };

                if (this.options.sortable && column.sortable !== false) {
                    let sortableTitle = `${column.title || column.field}. ${this.options.messages.sortHeader}`;
                    attr["aria-label"] = sortableTitle;
                    attr["title"] = sortableTitle;
                }

                if (!column.columns) {
                    attr.rowSpan = rowSpan ? rowSpan : 1;
                }

                if (column.headerAttributes) {
                    if (column.headerAttributes.colSpan === 1) {
                        delete column.headerAttributes.colSpan;
                    }
                    if (column.headerAttributes["class"]) {
                        attr.className += " " + column.headerAttributes["class"];
                        delete column.headerAttributes["class"];
                    }
                }

                if (column["data-index"] > -1) {
                    attr["data-index"] = column["data-index"];
                }

                attr = extend(true, {}, attr, column.headerAttributes);

                ths.push(kendoDomElement("th", attr, children));
            }

            return ths;
        },

        _cols: function(columns) {
            var cols = [];
            var width, attr;

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].hidden === true) {
                    continue;
                }

                width = columns[i].width;
                attr = {};

                if (width && parseInt(width, 10) !== 0) {
                    attr.style = {
                        width: typeof width === "string" ? width : width + "px"
                    };
                }

                cols.push(kendoDomElement("col", attr));
            }

            return cols;
        },

        _clearColsCache: function() {
            this._headerColsTree.render([]);
            if (this.options.scrollable) {
                this._contentColsTree.render([]);
            }
            if (this._hasLockedColumns) {
                this._lockedHeaderColsTree.render([]);
                this._lockedContentColsTree.render([]);
            }
        },

        _renderCols: function() {
            var columns = nonLockedColumns(this.columns);
            if (this.options.hasHeader) {
                this._headerColsTree.render(this._cols(leafColumns(columns)));
            }

            if (this.options.scrollable) {
                this._contentColsTree.render(this._cols(leafColumns(columns)));
            }

            if (this._hasLockedColumns) {
                columns = lockedColumns(this.columns);
                if (this.options.hasHeader) {
                    this._lockedHeaderColsTree.render(this._cols(leafColumns(columns)));
                }

                this._lockedContentColsTree.render(this._cols(leafColumns(columns)));

                if (!this.options.hasHeader) {
                    this._applyLockedContainersWidth();
                }
            }
        },

        _retrieveFirstColumn: function(columns, rows) {
            var result = $();

            if (rows.length && columns[0]) {
                var column = columns[0];

                while (column.columns && column.columns.length) {
                    column = column.columns[0];
                    rows = rows.filter(":not(:first)");
                }

                result = result.add(rows);
            }

            return result;
        },

        _updateFirstColumnClass: function() {
            var that = this;
            var columns = that.columns || [];
            var tr = that.thead.find(">tr:not(:first, .k-filter-row)");
            var rows;

            columns = nonLockedColumns(columns);

            rows = that._retrieveFirstColumn(columns, tr);

            if (that.lockedHeader) {
                tr = that.lockedHeader.find("thead>tr:not(.k-filter-row):not(:first)");
                columns = lockedColumns(that.columns);

                rows = rows.add(that._retrieveFirstColumn(columns, tr));
            }

            rows.each(function() {
                var ths = $(this).find("th");
                ths.removeClass("k-first");
                ths.eq(0).addClass("k-first");
            });
        },

        _updateRowSpans: function(rows) {
            for (var i = rows.length - 1; i >= 0; i--) {
                var included = visibleChildColumns(rows[i].cells).length > 0;

                if (included) {
                    rows[i].rowSpan = rows.length - i;
                }
            }
        },

        _setColumnDataIndexes: function(columns) {
            for (var i = 0; i < columns.length; i++) {
               columns[i]["data-index"] = i;
            }
        },

        _updateColumnCellIndex: function() {
            var header;
            var offset = 0;

            if (this.lockedHeader) {
                header = this.lockedHeader.find("thead");
                offset = updateCellIndex(header, lockedColumns(this.columns));
            }
            updateCellIndex(this.thead, nonLockedColumns(this.columns), offset);
        },

        _setParentsVisibility: function(column, visible) {
            var columns = this.columns;
            var idx;
            var parents = [];
            var parent;

            var predicate = visible ?
                function(p) { return visibleColumns(p.columns).length && p.hidden; } :
                function(p) { return !visibleColumns(p.columns).length && !p.hidden; };


            if (columnParents(column, columns, parents) && parents.length) {
                for (idx = parents.length - 1; idx >= 0; idx--) {
                    parent = parents[idx];

                    if (predicate(parent)) {
                        parent.hidden = !visible;
                    }
                }
            }
        },

        _prepareColumns: function(rows, columns, parentCell, parentRow, parentColumn) {
            var row = parentRow || rows[rows.length - 1];

            var childRow = rows[row.index + 1];
            var totalColSpan = 0;

            for (var idx = 0; idx < columns.length; idx++) {
                var cell = $.extend({}, columns[idx], { headerAttributes: columns[idx].headerAttributes || {} } );
                row.cells.push(cell);

                if (columns[idx].columns && columns[idx].columns.length) {
                    if (!childRow) {
                        childRow = { rowSpan: 0, cells: [], index: rows.length };
                        rows.push(childRow);
                    }
                    if (columns[idx].columns.length) {
                        cell.headerAttributes.colSpan = visibleChildColumns(columns[idx].columns).length || 1;
                        cell.headerAttributes["data-colspan"] = leafColumns(columns[idx].columns).length;
                    }
                    this._prepareColumns(rows, columns[idx].columns, cell, childRow, columns[idx]);
                    if (!cell.hidden) {
                        totalColSpan += cell.headerAttributes.colSpan - 1;
                    }
                    row.rowSpan = rows.length - row.index;
                }
                columns[idx].rowIndex = row.index;
                if (parentColumn) {
                    columns[idx].parentColumn = parentColumn;
                }
                columns[idx].cellIndex = row.cells.length - 1;
            }
            if (parentCell) {
                parentCell.headerAttributes.colSpan += totalColSpan;
            }
        },

        _renderHeaderTree: function(tree, columns, hasMultiColumnHeaders) {
            var idx;
            var rows = [];
            var rowsToRender = [];
            var filterThs = [];

            if (hasMultiColumnHeaders) {
                rows = [{ rowSpan: 1, cells: [], index: 0 }];
                this._prepareColumns(rows, columns);
                this._updateRowSpans(rows);
                for (idx = 0; idx < rows.length; idx++) {
                    rowsToRender.push(kendoDomElement("tr", { "role": "row", "class": "k-table-row" }, this._ths(rows[idx].cells, rows[idx].rowSpan)));
                }
            } else {
                rowsToRender.push(kendoDomElement("tr", { "role": "row", "class": "k-table-row" }, this._ths(columns)));
            }

            if (this._hasFilterRow()) {
                this._filterThs(columns, filterThs);
                rowsToRender.push(kendoDomElement("tr", { "class": "k-filter-row k-table-row" }, filterThs));
            }

            tree.render(rowsToRender);
        },

        _renderHeader: function() {
            var columns = nonLockedColumns(this.columns);
            var hasMultiColumnHeaders = grep(this.columns, function(item) {
                return item.columns !== undefined$1;
            }).length > 0;
            this._setColumnDataIndexes(leafColumns(this.columns));
            this._renderHeaderTree(this._headerTree, columns, hasMultiColumnHeaders);

            if (this._hasLockedColumns) {
                columns = lockedColumns(this.columns);
                this._renderHeaderTree(this._lockedHeaderTree, columns, hasMultiColumnHeaders);

                this._applyLockedContainersWidth();
                this._syncLockedHeaderHeight();
            }
            this._updateFirstColumnClass();
        },

        _filterThs: function(columns, ths) {
            var column;
            var attr;
            var uidAttr = kendo.attr('uid');

            for (var i = 0, length = columns.length; i < length; i++) {
                column = columns[i];

                if (column.columns) {
                    this._filterThs(column.columns, ths);
                }

                if (column.columns && column.columns.length) {
                    continue;
                }

                attr = {
                    "style": column.hidden === true ? { "display": "none" } : {},
                    "className": "k-table-th k-header",
                    "title": this.options.messages.filterCellTitle,
                    "aria-label": this.options.messages.filterCellTitle
                };
                attr[uidAttr] = column.headerAttributes.id;
                ths.push(kendoDomElement("th", attr));
            }
        },

        _updateFilterThs: function(before, column, refColumn) {
            var columns = leafColumns([column]);
            var filterRowThs = $(this.lockedHeader).add(this.thead).find("tr.k-filter-row th");
            var refIndex;
            var currIndex;
            var uidAttr = kendo.attr('uid');

            function thIndex(ths, uid) {
                for (var i = 0; i < ths.length; i++) {
                    if (ths.eq(i).attr(uidAttr) === uid) {
                        return i;
                    }
                }
            }

            for (var i = columns.length - 1; i >= 0; i--) {
                column = columns[i];
                currIndex = thIndex(filterRowThs, column.headerAttributes.id);
                refIndex = thIndex(filterRowThs, refColumn.headerAttributes.id);
                filterRowThs.eq(currIndex)[before ? "insertBefore" : "insertAfter"](filterRowThs.eq(refIndex));
            }
        },

        _applyLockedContainersWidth: function() {
            if (!this._hasLockedColumns) {
                return;
            }

            var lockedWidth = this.options.hasHeader ?
                columnsWidth(this.lockedHeader.find(">table>colgroup>col")) :
                columnsWidth(this.lockedTable.find(">colgroup>col"));

            var headerTable = this.options.hasHeader ? this.thead.parent() : this.tbody.parent();
            var nonLockedWidth = columnsWidth(headerTable.find(">colgroup>col"));

            var wrapperWidth = this.wrapper[0].clientWidth;
            var scrollbar = kendo.support.scrollbar();

            if (lockedWidth >= wrapperWidth) {
                lockedWidth = wrapperWidth - 3 * scrollbar;
            }

            this.lockedHeader
                .add(this.lockedContent)
                .width(lockedWidth);

            headerTable.add(this.table).width(nonLockedWidth);

            var width = wrapperWidth - lockedWidth;
            this.content.width(width - 1);
            headerTable.parent().width(width - scrollbar - 2);
        },

        _generateRowOptions: function(model, attr, pageable, options, level, hasChildren) {
            var that = this;

            var rowOptions = {
                model: model,
                attr: attr,
                level: pageable ? that._renderedModelLevel(model, options) : level,
                editedColumn: options.editedColumn,
                editedColumnIndex: options.editedColumnIndex,
                hasChildren: hasChildren,
                visible: options.visible,
                isAlt: this._absoluteIndex % 2 === 0
            };
            return rowOptions;
        },

        _renderRow: function(rowOptions, columns, renderer) {
            return this._tds(rowOptions, columns, renderer);
        },

        _trs: function(options) {
            var that = this;
            var model, attr, className, hasChildren, childNodes, i, length;
            var modelId;
            var rows = [];
            var level = options.level;
            var data = options.data;
            var dataSource = this.dataSource;
            var aggregates = dataSource.aggregates() || {};
            var idField = dataSource._modelIdField();
            var parentIdField = dataSource._modelParentIdField();
            var columns = options.columns;
            var pageable = that._isPageable();
            var isLockedTable = options.isLockedTable;
            var childrenMap = options.childrenMap || dataSource.childrenMap(dataSource._getData());

            for (i = 0, length = data.length; i < length; i++) {
                className = [ "k-table-row" ];

                model = data[i];
                modelId = model[idField];

                childNodes = pageable ? childrenMap[modelId] : (model.loaded() ? dataSource.childNodes(model) : []);
                hasChildren = childNodes && childNodes.length;

                attr = { "role": "row" };

                attr[kendo.attr("uid")] = model.uid;

                if (!isLockedTable && hasChildren) {
                    attr[ARIA_EXPANDED] = !!model.expanded;
                }

                if (options.visible) {
                    if (!pageable || (pageable && !that._skipRenderingMap[modelId])) {
                        if (this._absoluteIndex % 2 !== 0) {
                            className.push(classNames.alt);
                        }

                        this._absoluteIndex++;
                    }
                } else {
                    attr.style = { display: "none" };
                }

                if ($.inArray(model.uid, options.selected) >= 0) {
                    className.push(classNames.selected);
                }

                if (hasChildren) {
                    className.push(classNames.group);
                }

                if (model._edit) {
                    className.push("k-grid-edit-row");
                }

                attr.className = className.join(" ");

                if (!that._skipRenderingMap[modelId]) {
                    var row;
                    var rowOptions = that._generateRowOptions(model, attr, pageable, options, level, hasChildren);

                    if (that.options.rowTemplate) {
                        row = this. _trFromTemplate(rowOptions);
                    } else {
                        row = this._renderRow(rowOptions, columns, this._td.bind(this));
                    }

                    rows.push(row);
                }


                if (hasChildren && (that.options.renderAllRows || !!model.expanded)) {
                    if (pageable) {
                        // render the child nodes in the paged view only
                        childNodes = (options.viewChildrenMap || {})[modelId] || [];
                    }

                    if (childNodes.length === 0) {
                        continue;
                    }

                    rows = rows.concat(this._trs({
                        columns: columns,
                        editedColumn: options.editedColumn,
                        editedColumnIndex: options.editedColumnIndex,
                        aggregates: aggregates,
                        selected: options.selected,
                        visible: pageable ? options.visible : (options.visible && !!model.expanded),
                        data: childNodes,
                        childrenMap: options.childrenMap || childrenMap,
                        hasFooterTemplate: options.hasFooterTemplate,
                        viewChildrenMap: options.viewChildrenMap,
                        level: level + 1,
                        isLockedTable: options.isLockedTable
                    }));
                }
            }

            if (options.hasFooterTemplate && model) {
                attr = {
                    className: classNames.footerTemplate + " k-table-row",
                    "data-parentId": model[parentIdField]
                };

                if (!options.visible) {
                    attr.style = { display: "none" };
                }

                rows.push(this._tds({
                    model: aggregates[model[parentIdField]],
                    attr: attr,
                    level: level,
                    editedColumn: options.editedColumn,
                    editedColumnIndex: options.editedColumnIndex
                }, columns, this._footerId));
            }

            return rows;
        },

        _trFromTemplate: function(options) {
            var rowTemplate = this.options.rowTemplate;
            var altRowTemplate = this.options.altRowTemplate;
            var row;
            var template;

            altRowTemplate = altRowTemplate ? altRowTemplate : rowTemplate;

            if (!kendo.isFunction(rowTemplate)) {
                rowTemplate = kendo.template(rowTemplate);
            }

            if (!kendo.isFunction(altRowTemplate)) {
                altRowTemplate = kendo.template(altRowTemplate);
            }

            if (this._absoluteIndex % 2 !== 0) {
                template = rowTemplate(options);
            } else {
                template = altRowTemplate(options);
            }

            if (!$(template).length) {
                return kendoTextElement(template);
            }

            row = this.parseRowTemplate($(template)[0], options);

            return row;
        },

        parseRowTemplate: function(element, options) {
            var nodeName = element.nodeName.toLocaleLowerCase();
            var childNodes = element.childNodes;
            var children = [];
            var currElement;
            var attributes;

            attributes = this.parseAttributes(element);

            for (var i = 0; i < childNodes.length; i++) {
                if (!/\S/.test(childNodes[i].nodeValue)) {
                   continue;
                }
                if (childNodes[i].nodeName.toLocaleLowerCase() === "td") {
                    children.push(this._createCellElement(childNodes[i]));
                }
            }

            if (options && !options.visible) {
               attributes.style = attributes.style || {};
               attributes.style = $.extend(true, attributes.style, { display: "none" });
            }

            if (this._isTextNode(nodeName)) {
                currElement = kendoTextElement(element.nodeValue);
            } else {
                currElement = kendoDomElement(nodeName, attributes, children);
            }

            return currElement;
        },

        _createCellElement: function(element) {
            var attributes = this.parseAttributes(element);
            var spaceElements = $(element).find('.' + classNames.iconHidden).remove();
            var iconElement = $(element).find(ICON_EXPAND_COLLAPSE_SELECTOR).remove()[0];
            var children = [];

            for (var i = 0; i < spaceElements.length; i++) {
                children.push(kendoDomElement("span", this.parseAttributes(spaceElements[i])));
            }

            if (iconElement) {
                children.push(kendoHtmlElement(iconElement.outerHTML, true));
            }
            children.push(kendoHtmlElement($(element).html()));

            return kendoDomElement("td", attributes, children);
        },

        parseAttributes: function(element) {
            if (this._isTextNode(element.nodeName)) {
                return null;
            }

            element = $(element)[0];
            var attributes = element.attributes;
            var length = attributes.length;
            var result = {};

            for (var i = 0; i < length; i++) {
                result[attributes[i].name] = attributes[i].value;
            }

            return result;
        },

        _isTextNode: function(nodeName) {
            return nodeName.indexOf('text') >= 0;
        },

        _footerId: function(options) {
            var content = [];
            var column = options.column;
            var template = options.column.footerTemplate || $.noop;
            var aggregates = options.model[column.field] || {};
            var attr = {
                "role": "gridcell",
                "class": "k-table-td",
                "style": column.hidden === true ? { "display": "none" } : {}
            };

            if (column.expandable) {
                content = content.concat(createPlaceholders({

                    level: options.level + 1,
                    className: classNames.iconPlaceHolder
                }));
            }

            if (column.attributes) {
                extend(true, attr, column.attributes, {
                    "style": column.hidden === true ? { "display": "none" } : {}
                });
            }

            content.push(kendoHtmlElement(template(aggregates) || ""));

            return kendoDomElement("td", attr, content);
        },

        _hasFooterTemplate: function() {
            return !!grep(leafColumns(this.columns), function(c) {
                return c.footerTemplate;
            }).length;
        },

        _tds: function(options, columns, renderer) {
            var children = [];
            var column;
            var editedColumnField = (options.editedColumn || {}).field;
            var incellEditing = this._isIncellEditable();
            var length = columns.length;

            for (var i = 0; i < length; i++) {
                column = columns[i];

                var col = renderer({
                    model: options.model,
                    column: column,
                    editColumn: !incellEditing || (incellEditing && column.field === editedColumnField && options.editedColumnIndex === i),
                    level: options.level
                });

                children.push(col);
            }

            return kendoDomElement("tr", options.attr, children);
        },

        _td: function(options) {
            var children = [];
            var model = options.model;
            var column = options.column;
            var iconType = kendo.defaults.iconType;
            var iconClass;
            var attr = {
                "role": "gridcell",
                "class": "k-table-td",
                "style": column.hidden === true ? { "display": "none" } : {}
            };
            var incellEditing = this._isIncellEditable();
            var columnHasEditCommand = false;

            if (column.attributes) {
                extend(true, attr, column.attributes);
            }

            if (!!column.headerAttributes && !!column.headerAttributes.id) {
                attr["aria-describedby"] = column.headerAttributes.id;
            }

            if (model._edit && column.field && options.editColumn && (incellEditing || (!incellEditing && isColumnEditable(column, model)))) {
                attr[kendo.attr("container-for")] = column.field;

                if (incellEditing) {
                    if (attr.className && attr.className.indexOf(classNames.editCell) !== -1) {
                        attr.className += " k-table-td" + classNames.editCell;
                    } else if (!attr.className) {
                        attr.className = "k-table-td " + classNames.editCell;
                    }
                }
            } else {
                if (column.expandable) {
                    children = createPlaceholders({ level: options.level, className: classNames.iconPlaceHolder });

                    if (model.hasChildren) {
                        attr.ariaExpanded = model.expanded;
                        iconClass = model.expanded ? classNames.iconCollapse : classNames.iconExpand;
                    } else {
                        iconClass = classNames.iconPlaceHolder;
                    }

                    if (model._error) {
                        iconClass = classNames.refresh;
                    } else if (!model.loaded() && model.expanded) {
                        iconClass = "loading";
                        attr["aria-busy"] = true;
                    }

                    // The true flag at the end specifies that the element reference should be replaced instead of being removed and added back to the DOM tree. Check the HtmlNode.render function in kendo.dom.js.
                    children.push(kendoHtmlElement(kendo.ui.icon($(`<span ref-treelist-expand-collapse-icon class="k-treelist-toggle ${iconClass === classNames.iconPlaceHolder ? 'k-i-none' : iconClass === 'loading' ? 'k-i-loading' : ''}"></span>`), { icon: iconClass, type: iconType }), true));

                    attr.style["white-space"] = "nowrap";
                }

                if (isDirtyColumn(column, model)) {
                    if (attr.className) {
                        attr.className += classNames.dirtyCell;
                    } else if (!attr.className) {
                        attr.className = classNames.dirtyCell;
                    }
                }

                if (column.draggable) {
                    attr["class"] += " k-drag-cell k-touch-action-none";

                    if (typeof attr[ARIA_LABEL] === "undefined") {
                        attr[ARIA_LABEL] = this.options.messages.dragHandleLabel;
                    }

                    attr.style.cursor = "move";
                }

                if (column.command) {
                    if (attr.className && attr.className.indexOf("k-command-cell") !== -1 ) {
                        attr.className += " k-command-cell";
                    } else if (!attr.className) {
                        attr.className = "k-command-cell";
                    }

                    columnHasEditCommand = grep(column.command, function(command) {
                        return command === EDIT || command.name === EDIT;
                    }).length > 0;

                    if (model._edit && !this._isIncellEditable() && columnHasEditCommand) {
                        children = this._buildCommands(["update", "canceledit"]);
                    } else {
                        children = this._buildCommands(column.command);
                    }
                } else {
                    children.push(this._cellContent(column, model));
                }

                attr.className = [attr["class"], attr.className].join(" ").trim();
            }

            return kendoDomElement("td", attr, children);
        },

        _cellContent: function(column, model) {
            var that = this;
            var value;
            var incellEditing = that._isIncellEditable();
            var dirtyIndicator;

            if (column.selectable) {
                return kendoHtmlElement(SELECTCOLUMNTMPL);
            }

            if (column.draggable) {
                return kendoHtmlElement(DRAGHANDLECOLUMNTMPL());
            }

            if (column.template) {
                value = that._evalColumnTemplate(column, model);
            } else if (column.field) {
                value = model.get(column.field);
                dirtyIndicator = incellEditing ? column.dirtyIndicatorTemplate(model) : "";
                if (value !== null && !isUndefined(value)) {
                    if (column.format) {
                        value = kendo.format(column.format, value);
                    }

                    value = dirtyIndicator + value;
                } else {
                    value = dirtyIndicator;
                }
            } else if (value === null || isUndefined(value)) {
                value = "";
            }

            if (column.template || !column.encoded) {
                return kendoHtmlElement(value);
            } else {
                if (incellEditing) {
                    return kendoHtmlElement(value);
                } else {
                    return kendoTextElement(value);
                }
            }
        },

        _evalColumnTemplate: function(column, model) {
            if (this._isIncellEditable()) {
                return column.dirtyCellTemplate(model);
            } else {
                return column.template(model);
            }
        },

        _createDirtyColumnTemplate: function(column) {
            var that = this;
            var templateSettings = that._customTemplateSettings();
            var templateFunction = function(data) {
                return (that._dirtyIndicatorTemplate(column.field)(data) + this.columnTemplate(data));
            };

            return kendoTemplate(templateFunction, templateSettings).bind({ columnTemplate: column.template });
        },

        _createIndicatorTemplate: function(column) {
            var dirtyIndicatorTemplate = this._dirtyIndicatorTemplate(column.field);

            return kendoTemplate(dirtyIndicatorTemplate);
        },

        _dirtyIndicatorTemplate: function(field) {
            var that = this;
            var dirtyField;
            var templateSettings = that._customTemplateSettings();
            var paramName = templateSettings.paramName;

            if (field && paramName) {
                return ({ dirty, dirtyFields }) => (dirty && dirtyFields && dirtyFields[field] ? '<span class="k-dirty"></span>' : '');
            }

            return () => "";
        },

        _customTemplateSettings: function() {
            return extend({}, kendo.Template, this.options.templateSettings);
        },

        _buildCommands: function(commands, skipCommandClass) {
            var i, result = [];

            for (i = 0; i < commands.length; i++) {
                result.push(this._handleCommand(commands[i], skipCommandClass));
            }

            return result;
        },

        _handleCommand: function(command, skipCommandClass) {
            var name = (command.name || command).toLowerCase();
            var text = this.options.messages.commands[name];

            command = extend({}, defaultCommands[name], { text: text }, command);


            if (command.template) {
                return kendoHtmlElement(kendo.template(command.template)({ message: command.text || this.options.messages.commands.search }));
            } else {
                return this._button(command, name, command.icon, skipCommandClass);
            }
        },

        _button: function(command, name, icon, skipCommandClass) {
            if (command.className && command.className.indexOf("k-primary") > -1) {
                command.className = command.className.replace("k-primary", "k-button-solid-primary");
            }

            if (!command.className || command.className.indexOf("k-button-solid-primary") === -1) {
                command.className = (command.className || "") + " k-button-solid-base";
            }

            if (skipCommandClass && command.className) {
                let classes = command.className.split(" ");
                command.className = classes.filter(c => c.indexOf("command") === -1).join(" ");
            }

            let buttonHTML = '<button data-command="' + name + '" class="' + command.className + '">' + (command.text || (command.text === "" ? "" : command.name)) + '</button>';

            let button = kendoHtmlElement(kendo.html.renderButton(buttonHTML, {
                icon: icon,
                iconClass: command.imageClass
            }));

            return button;
        },

        _positionResizeHandle: function(e) {
            var th = $(e.currentTarget);
            var resizeHandle = this.resizeHandle;
            var position = th.position();
            var left;
            var rtlCorrection = 0;
            var headerWrap;
            var ieCorrection;
            var webkitCorrection;
            var firefoxCorrection;
            var leftMargin;
            var invisibleSpace;
            var leftBorderWidth;
            var scrollLeft;
            var cellWidth = outerWidth(th);
            var container = th.closest("div");
            var button = typeof e.buttons !== "undefined" ? e.buttons : (e.which || e.button);
            var indicatorWidth = this.options.columnResizeHandleWidth || 3;
            var halfResizeHandle = (indicatorWidth * 3) / 2;

            left = cellWidth;

            if (typeof button !== "undefined" && button !== 0) {
                //do not create a new resize handle if a mouse button is still pressed
                //this happens during resizing or before UserEvents trigger "start"
                return;
            }

            if (!resizeHandle) {
                resizeHandle = this.resizeHandle = $(
                    '<div class="k-resize-handle"><div class="k-resize-handle-inner"></div></div>'
                );
            }

            var cells = leafDataCells(th.closest("thead")).filter(":visible");
            if (isRtl) {
                scrollLeft = kendo.scrollLeft(container);

                if (browser.mozilla || (browser.webkit && browser.version >= 85)) {
                    scrollLeft = scrollLeft * -1;
                }
                leftBorderWidth = parseFloat(container.css("borderLeftWidth"));
                left = th.offset().left + scrollLeft - parseFloat(th.css("marginLeft")) - (container.offset().left + leftBorderWidth);
                rtlCorrection = (left <= scrollLeft ? halfResizeHandle : 0);// when shown on first column headers are misaligned due to the width of the resize handler
                headerWrap = th.closest(".k-grid-header-wrap, .k-grid-header-locked");
                invisibleSpace = headerWrap[0].scrollWidth - headerWrap[0].offsetWidth; // the difference between the entire width and the visible area
                leftMargin = parseFloat(headerWrap.css("marginLeft"));
                ieCorrection = browser.msie ? 2 * kendo.scrollLeft(headerWrap) + leftBorderWidth - leftMargin - rtlCorrection : 0;
                webkitCorrection = browser.webkit && (browser.version < 85) ? (invisibleSpace - rtlCorrection - leftMargin + leftBorderWidth) : -rtlCorrection; //margin left is added due to a margin that avoids double borders
                firefoxCorrection = browser.mozilla ? leftBorderWidth - leftMargin - rtlCorrection : 0;
                left -= webkitCorrection + firefoxCorrection + ieCorrection;
            } else {
                for (var idx = 0; idx < cells.length; idx++) {
                    if (cells[idx] == th[0]) {
                        break;
                    }
                    left += cells[idx].offsetWidth;
                }
            }

            container.append(resizeHandle);

            resizeHandle
                .show()
                .css({
                    top: position.top,
                    left: left - halfResizeHandle,
                    height: outerHeight(th),
                    width: indicatorWidth * 3
                })
                .data("th", th);

            var that = this;
            resizeHandle.off("dblclick" + NS).on("dblclick" + NS, function() {
                //TODO handle frozen columns index
                var index = th.index();
                if ($.contains(that.thead[0], th[0])) {
                    index += grep(that.columns, function(val) { return val.locked && !val.hidden; }).length;
                }
                that.autoFitColumn(index);
            });
        },

        autoFitColumn: function(column) {
            var that = this,
                options = that.options,
                columns = that.columns,
                index,
                th,
                headerTable,
                isLocked,
                visibleLocked = that.lockedHeader ? leafDataCells(that.lockedHeader.find(">table>thead")).filter(isCellVisible).length : 0,
                col;

            //  retrieve the column object, depending on the method argument
            if (typeof column == "number") {
                column = columns[column];
            } else if (isPlainObject(column)) {
                column = grep(columns, function(item) {
                    return item === column;
                })[0];
            } else {
                column = grep(columns, function(item) {
                    return item.field === column;
                })[0];
            }

            if (!column || column.hidden) {
                return;
            }

            index = inArray(column, columns);
            isLocked = column.locked;

            if (isLocked) {
                headerTable = that.lockedHeader.children("table");
            } else {
                headerTable = that.thead.parent();
            }

            th = headerTable.find("[data-index='" + index + "']");

            var contentTable = isLocked ? that.lockedTable : that.table,
                footer = that.footer || $();

            if (that.footer && that.lockedContent) {
                footer = isLocked ? that.footer.children(".k-grid-footer-locked") : that.footer.children(".k-grid-footer-wrap");
            }

            var footerTable = footer.find("table").first();

            if (that.lockedHeader && visibleLocked >= index && !isLocked) {
                index -= visibleLocked;
            }

            // adjust column index, depending on previous hidden columns
            for (var j = 0; j < columns.length; j++) {
                if (columns[j] === column) {
                    break;
                } else {
                    if (columns[j].hidden) {
                        index--;
                    }
                }
            }

            // get col elements
            if (options.scrollable) {
                col = headerTable.find("col:not(.k-group-col):not(.k-hierarchy-col)").eq(index)
                    .add(contentTable.children("colgroup").find("col:not(.k-group-col):not(.k-hierarchy-col)").eq(index))
                    .add(footerTable.find("colgroup").find("col:not(.k-group-col):not(.k-hierarchy-col)").eq(index));
            } else {
                col = contentTable.children("colgroup").find("col:not(.k-group-col):not(.k-hierarchy-col)").eq(index);
            }

            var tables = headerTable.add(contentTable).add(footerTable);

            var oldColumnWidth = outerWidth(th);

            // reset the table and autofitted column widths
            // if scrolling is disabled, we need some additional repainting of the table
            col.width("");
            tables.css("table-layout", "fixed");
            col.width("auto");
            tables.addClass("k-autofitting");
            tables.css("table-layout", "");

            var newColumnWidth = Math.ceil(
                    Math.max(
                        outerWidth(th),
                        outerWidth(contentTable.find("tr").eq(0).children("td:visible").eq(index)),
                        outerWidth(footerTable.find("tr").eq(0).children("td:visible").eq(index))
            ));

            col.width(newColumnWidth);
            column.width = newColumnWidth;

            // if all visible columns have widths, the table needs a pixel width as well
            if (options.scrollable) {
                var cols = headerTable.find("col"),
                    colWidth,
                    totalWidth = 0;
                for (var idx = 0, length = cols.length; idx < length; idx += 1) {
                    colWidth = cols[idx].style.width;
                    if (colWidth && colWidth.indexOf("%") == -1) {
                        totalWidth += parseInt(colWidth, 10);
                    } else {
                        totalWidth = 0;
                        break;
                    }
                }

                if (totalWidth) {
                    tables.each(function() {
                        this.style.width = totalWidth + "px";
                    });
                }
            }

            tables.removeClass("k-autofitting");

            that.trigger(COLUMNRESIZE, {
                column: column,
                oldWidth: oldColumnWidth,
                newWidth: newColumnWidth
            });

            that._applyLockedContainersWidth();
            that._syncLockedContentHeight();
            that._syncLockedHeaderHeight();
        },

        _adjustLockedHorizontalScrollBar: function() {
            var table = this.table,
                content = table.parent();

            var scrollbar = table[0].offsetWidth > content[0].clientWidth ? kendo.support.scrollbar() : 0;
            this.lockedContent.height(outerHeight(content) - scrollbar);
        },

        _syncLockedContentHeight: function() {
            if (this.lockedTable) {
                if (!this._touchScroller) {
                    this._adjustLockedHorizontalScrollBar();
                }
                this._adjustRowsHeight(this.table, this.lockedTable);
                this._syncLockedScroll();
            }
        },

        _syncLockedHeaderHeight: function() {
            if (this.lockedHeader) {
                var lockedTable = this.lockedHeader.children("table");
                var table = this.thead.parent();

                this._adjustRowsHeight(lockedTable, table);

                syncTableHeight(lockedTable, table);
            }
        },

        _syncLockedScroll: function() {
            if (!this.options.scrollable) {
                return;
            }
            this.lockedContent[0].scrollTop = this.content[0].scrollTop;
        },

        _resizable: function() {
            if (!this.options.resizable) {
                return;
            }

            if (this.resizable) {
                this.resizable.destroy();
            }

            var treelist = this;

            $(this.lockedHeader).find("thead").add(this.thead)
                .on("mousemove" + NS, "tr:not(.k-filter-row) > th", this._positionResizeHandle.bind(this));

            this.resizable = new kendo.ui.Resizable(this.wrapper, {
                handle: ".k-resize-handle",
                start: function(e) {
                    var th = $(e.currentTarget).data("th");
                    var index = $.inArray(th[0], leafDataCells(th.closest("thead")).filter(":visible"));
                    var header, contentTable;

                    treelist.wrapper.addClass("k-grid-column-resizing");

                    if (treelist.lockedHeader && $.contains(treelist.lockedHeader[0], th[0])) {
                        header = treelist.lockedHeader;
                        contentTable = treelist.lockedTable;
                    } else {
                        header = treelist.thead.parent();
                        contentTable = treelist.table;
                    }

                    this.col = contentTable.children("colgroup").find("col").eq(index)
                          .add(header.find("col").eq(index));
                    this.th = th;
                    this.startLocation = e.x.location;
                    this.columnWidth = outerWidth(th);
                    this.table = this.col.closest("table");
                    this.totalWidth = this.table.width();
                },
                resize: function(e) {
                    var rtlModifier = isRtl ? -1 : 1;
                    var minColumnWidth = 11;
                    var delta = (e.x.location * rtlModifier) - (this.startLocation * rtlModifier);

                    if (this.columnWidth + delta < minColumnWidth) {
                        delta = minColumnWidth - this.columnWidth;
                    }

                    this.table.width(this.totalWidth + delta);
                    this.col.width(this.columnWidth + delta);
                },
                resizeend: function() {
                    treelist.wrapper.removeClass("k-grid-column-resizing");

                    var field = this.th.attr("data-field");
                    var column = grep(leafColumns(treelist.columns), function(c) {
                        return c.field == field;
                    });
                    var newWidth = Math.floor(outerWidth(this.th));

                    column[0].width = newWidth;
                    treelist._resize();
                    treelist._syncLockedContentHeight();
                    treelist._syncLockedHeaderHeight();
                    treelist.trigger(COLUMNRESIZE, {
                        column: column,
                        oldWidth: this.columnWidth,
                        newWidth: newWidth
                    });

                    this.table = this.col = this.th = null;
                }
            });
        },

        _sortable: function() {
            var columns;
            var column;
            var sortableInstance;
            var cells;
            var cell, idx, length;
            var sortable = this.options.sortable;
            var hasMultiColumnHeaders = grep(this.columns, function(item) {
                return item.columns !== undefined$1;
            }).length > 0;
            var sortHandler = this._sort.bind(this);

            if (!sortable) {
                return;
            }

            if (hasMultiColumnHeaders) {
                if (this.lockedHeader) {
                    cells = sortCells(leafDataCells(this.lockedHeader.find(">table>thead")).add(leafDataCells(this.thead)));
                } else {
                    cells = leafDataCells(this.thead);
                }
            } else {
                cells = $(this.lockedHeader).add(this.thead).find("tr:not(.k-filter-row) th");
            }
            columns = leafColumns(this.columns);

            for (idx = 0, length = cells.length; idx < length; idx++) {
                column = columns[idx];

                if (column.sortable !== false && !column.command && !column.draggable && column.field && !column.selectable) {
                    cell = cells.eq(idx);

                    sortableInstance = cell.data("kendoColumnSorter");
                    if (sortableInstance) {
                        sortableInstance.destroy();
                    }

                    cell.kendoColumnSorter(
                            extend({}, sortable, column.sortable, {
                                dataSource: this.dataSource,
                                change: sortHandler
                            })
                        );
                }
            }
        },

        _filterable: function() {
            var cells;
            var filterable = this.options.filterable;
            var idx;
            var length;
            var columns;
            var column;
            var cell;
            var filterMenuInstance;
            var hasMultiColumnHeaders = grep(this.columns, function(item) {
                return item.columns !== undefined$1;
            }).length > 0;

            if (!filterable || this.options.columnMenu) {
                return;
            }

            var filterInit = (function(e) {
                this.trigger(FILTERMENUINIT, { field: e.field, container: e.container });
            }).bind(this);

            var filterOpen = (function(e) {
                this.trigger(FILTERMENUOPEN, { field: e.field, container: e.container });
            }).bind(this);

            var filterHandler = this._filter.bind(this);

            if (hasMultiColumnHeaders) {
                if (this.lockedHeader) {
                    cells = leafDataCells(this.lockedHeader.find(">table>thead").add(this.thead));
                } else {
                    cells = leafDataCells(this.thead);
                }
            } else {
                cells = $(this.lockedHeader).add(this.thead).find("tr:not(.k-filter-row) th");
            }
            columns = leafColumns(this.columns);

            if (filterable && typeof filterable.mode == STRING && filterable.mode.indexOf("menu") == -1) {
                filterable = false;
            }

            if (!filterable) {
                return;
            }

            for (idx = 0, length = cells.length; idx < length; idx++) {
                column = columns[idx];
                cell = cells.eq(idx);

                filterMenuInstance = cell.data("kendoFilterMenu");
                if (filterMenuInstance) {
                    filterMenuInstance.destroy();
                }

                if (column.draggable || column.command || column.filterable === false || column.selectable) {
                    continue;
                }

                cell.kendoFilterMenu(extend(true, {}, filterable, column.filterable, {
                    dataSource: this.dataSource,
                    init: filterInit,
                    open: filterOpen,
                    change: filterHandler,
                    appendTo: DOT + classNames.headerCellInner
                }));
            }
        },

        _filterRow: function() {
            var that = this;
            if (!that._hasFilterRow()) {
               return;
            }

            var settings;
            var uidAttr = kendo.attr('uid');
            var columns = leafColumns(that.columns),
                filterable = that.options.filterable,
                filterHandler = this._filter.bind(this),
                existingInstance;

            for (var i = 0; i < columns.length; i++) {
                var suggestDataSource,
                    col = columns[i],
                    operators = that.options.filterable.operators,
                    customDataSource = false,
                    th = this.wrapper.find('.k-grid-header .k-filter-row th[' + uidAttr + '="' + col.headerAttributes.id + '"]'),
                    field = col.field,
                    parentColumn = col.parentColumn;

                delete col.parentColumn;

                if (field && col.filterable !== false) {
                    var cellOptions = col.filterable && col.filterable.cell || {};
                    existingInstance = th.find('.k-filtercell').data('kendoFilterCell');

                    if (existingInstance) {
                        existingInstance.destroy();
                        th.empty();
                    }

                    suggestDataSource = that.options.dataSource;
                    if (suggestDataSource instanceof DataSource) {
                        suggestDataSource = that.options.dataSource.options;
                    }

                    var messages = extend(true, {}, filterable.messages);
                    if (col.filterable) {
                        extend(true, messages, col.filterable.messages);
                    }

                    if (cellOptions.enabled === false) {
                        th.html("&nbsp;");
                        continue;
                    }
                    if (cellOptions.dataSource) {
                        suggestDataSource = cellOptions.dataSource;
                        customDataSource = true;
                    }
                    if (col.filterable && col.filterable.operators) {
                        operators = col.filterable.operators;
                    }

                    settings = {
                        column: col,
                        dataSource: that.dataSource,
                        suggestDataSource: suggestDataSource,
                        customDataSource: customDataSource,
                        field: field,
                        messages: messages,
                        values: col.values,
                        template: cellOptions.template,
                        delay: cellOptions.delay,
                        inputWidth: cellOptions.inputWidth,
                        suggestionOperator: cellOptions.suggestionOperator,
                        minLength: cellOptions.minLength,
                        dataTextField: cellOptions.dataTextField,
                        operator: cellOptions.operator,
                        operators: operators,
                        showOperators: cellOptions.showOperators,
                        change: filterHandler
                    };

                    $("<span/>").attr(kendo.attr("field"), field)
                        .appendTo(th)
                        .kendoFilterCell(settings);
                    col.parentColumn = parentColumn;
                } else {
                    th.html("&nbsp;");
                }
            }

            this._filterFocusable().attr(TABINDEX, -1);
        },

        _hasFilterRow: function() {
            var filterable = this.options.filterable;
            var hasFiltering = filterable &&
                    typeof filterable.mode == STRING &&
                    filterable.mode.indexOf("row") != -1;
            var columns = this.columns;
            var columnsWithoutFiltering = $.grep(columns, function(col) {
                return col.filterable === false;
            });

            if (columns.length && columnsWithoutFiltering.length == columns.length) {
                hasFiltering = false;
            }

            return hasFiltering;
        },

        _change: function() {
            var that = this;
            var selectedValues;

            if (that._checkBoxSelection) {
                selectedValues = that.selectable.value();
                that._uncheckCheckBoxes();
                that._checkRows(selectedValues);
                if (selectedValues.length && selectedValues.length === that.items().length) {
                    that._toggleHeaderCheckState(true);
                } else {
                    that._toggleHeaderCheckState(false);
                }
            }
            this.trigger(CHANGE);
        },

        _isLocked: function() {
            return this.lockedHeader !== null;
        },

        _selectable: function() {
            var that = this;
            var selectable = this.options.selectable;
            var filter;
            var element = this.table;
            var useAllItems;
            var isLocked = that._isLocked();
            var multi;
            var cell;

            if (selectable) {
                selectable = kendo.ui.Selectable.parseOptions(selectable);

                if (this._hasLockedColumns) {
                    element = element.add(this.lockedTable);
                    useAllItems = selectable.multiple && selectable.cell;
                }

                filter = ">tbody>tr:not(.k-footer-template)";

                if (selectable.cell) {
                    filter = filter + ">td";
                }

                this.selectable = new kendo.ui.Selectable(element, {
                    filter: filter,
                    aria: true,
                    multiple: selectable.multiple,
                    change: this._change.bind(this),
                    useAllItems: useAllItems,
                    continuousItems: this._continuousItems.bind(this, filter, selectable.cell),
                    relatedTarget: !selectable.cell && this._hasLockedColumns ? this._selectableTarget.bind(this) : undefined$1
                });

                if (that.options.navigatable) {
                    multi = selectable.multiple;
                    cell = selectable.cell;

                    element.on("keydown" + NS, function(e) {
                        var current = that.current();

                        if (!current) {
                            return;
                        }

                        var target = e.target;
                        if (e.keyCode === keys.SPACEBAR && !e.shiftKey && $.inArray(target, element) > -1 &&
                            !current.is(".k-header")) {

                                e.preventDefault();
                                e.stopPropagation();
                                current = cell ? current : current.parent();

                                if (isLocked && !cell) {
                                    current = current.add(that._relatedRow(current));
                                }

                                if (multi) {
                                    if (!e.ctrlKey) {
                                        that.selectable.clear();
                                    } else {
                                        if (current.hasClass(classNames.selected)) {
                                            current.removeClass(classNames.selected);
                                            that.trigger(CHANGE);
                                            return;
                                        }
                                    }
                                } else {
                                    that.selectable.clear();
                                }
                                if (!cell) {
                                    that.selectable._lastActive = current;
                                }

                                that.selectable.value(current);
                                that.trigger(CHANGE);
                        } else if (!cell && ((e.shiftKey && e.keyCode == keys.LEFT) ||
                                    (e.shiftKey && e.keyCode == keys.RIGHT) ||
                                    (e.shiftKey && e.keyCode == keys.UP) ||
                                    (e.shiftKey && e.keyCode == keys.DOWN) ||
                                    (e.keyCode === keys.SPACEBAR && e.shiftKey))) {

                            e.preventDefault();
                            e.stopPropagation();
                            current = current.parent();

                            if (isLocked) {
                                current = current.add(that._relatedRow(current));
                            }

                            if (multi) {
                                if (!that.selectable._lastActive) {
                                    that.selectable._lastActive = current;
                                }
                                that.selectable.selectRange(that.selectable._firstSelectee(), current);
                            } else {
                                that.selectable.clear();
                                that.selectable.value(current);
                            }
                            that.trigger(CHANGE);
                        }
                    });
                }
            }
        },

        _continuousItems: function(filter, cell) {
            if (!this.lockedContent) {
                return;
            }

            var lockedItems = $(filter, this.lockedTable);
            var nonLockedItems = $(filter, this.table);
            var columns = cell ? lockedColumns(this.columns).length : 1;
            var nonLockedColumns = cell ? this.columns.length - columns : 1;
            var result = [];

            for (var idx = 0; idx < lockedItems.length; idx += columns) {
                push.apply(result, lockedItems.slice(idx, idx + columns));
                push.apply(result, nonLockedItems.splice(0, nonLockedColumns));
            }

            return result;
        },

        _selectableTarget: function(items) {
            var related;
            var result = $();
            for (var idx = 0, length = items.length; idx < length; idx ++) {
                related = this._relatedRow(items[idx]);

                if (inArray(related[0], items) < 0) {
                    result = result.add(related);
                }
            }

            return result;
        },

        _relatedRow: function(row) {
            var lockedTable = this.lockedTable;
            row = $(row);

            if (!lockedTable) {
                return row;
            }

            var table = row.closest(this.table.add(this.lockedTable));
            var index = table.find(">tbody>tr").index(row);

            table = table[0] === this.table[0] ? lockedTable : this.table;

            return table.find(">tbody>tr").eq(index);
        },

        select: function(value) {
            var that = this;
            var selectable = this.selectable;

            if (that._checkBoxSelection) {
                if (value) {
                    that._checkRows(value);
                    if (that.select().length === that.items().length) {
                        that._toggleHeaderCheckState(true);
                    }
                }

                return that.items().filter("." + SELECTED);
            }

            if (!selectable) {
                return $();
            }

            if (typeof value !== "undefined") {
                if (!selectable.options.multiple) {
                    selectable.clear();

                    value = value.first();
                }

                if (this._hasLockedColumns) {
                    value = value.add($.map(value, this._relatedRow.bind(this)));
                }
            }

            return selectable.value(value);
        },

        clearSelection: function() {
            var that = this;

            if (that.selectable && !that._checkBoxSelection) {
                that.selectable.clear();
            }

            if (that._checkBoxSelection) {
                that._deselectCheckRows(that.select(), true);
                return;
            }
        },

        _uncheckCheckBoxes: function() {
            var that = this;
            var tables = that.table.add(that.lockedTable);

            tables.find("tbody " + CHECKBOXINPUT).attr("aria-checked", false)
                .prop("checked", false).attr("aria-label", "Select row");

        },

        _deselectCheckRows: function(items, preventChange) {
            var that = this;
            items = that.table.add(that.lockedTable).find(items);

            if (that._isLocked()) {
                items = items.add(items.map(function() {
                    return that._relatedRow(this);
                }));
            }

            items.each(function() {
                $(this).removeClass(SELECTED).find(CHECKBOXINPUT).attr("aria-checked", false)
                    .prop("checked", false).attr("aria-label", "Select row");
            });
            that._toggleHeaderCheckState(false);

            if (!preventChange) {
                that.trigger(CHANGE);
            }
        },

        _headerCheckboxClick: function(e) {
            var that = this,
                checkBox = $(e.target),
                checked = checkBox.prop("checked"),
                parentGrid = checkBox.closest(".k-grid").getKendoTreeList();

            if (that !== parentGrid) {
                return;
            }

            if (checked) {
                that.select(parentGrid.items());
            } else {
                that.clearSelection();
            }
            that.trigger(CHANGE);
        },

        _checkboxClick: function(e) {
            var that = this,
                row = $(e.target).closest("tr"),
                isSelecting = !row.hasClass(SELECTED),
                dataItem = that.dataItem(row),
                children = [],
                selector = "";

            if (that !== row.closest(".k-grid").getKendoTreeList()) {
                return;
            }

            if (that._includeChildren) {
                that.dataSource.allChildNodes(dataItem, children);

                for (var i = 0; i < children.length; i++) {
                    selector += "tr[data-uid='" +	children[i].uid + "'],";
                }
            }

            selector += "tr[data-uid='" +	dataItem.uid + "']";
            row = $(selector);

            if (isSelecting) {
                that.select(row);
                that.trigger(CHANGE);
            } else {
                that._deselectCheckRows(row);
            }
        },

        _checkRows: function(items) {
            items.each(function() {
                $(this).addClass(SELECTED).find(CHECKBOXINPUT).prop("checked", true)
                    .attr("aria-label", "Deselect row").attr("aria-checked", true);
            });
        },

        _toggleHeaderCheckState: function(checked) {
            var that = this;
            if (checked) {
                that.thead.add(that.lockedHeader).find("tr " + CHECKBOXINPUT)
                    .prop("checked", true).attr("aria-checked", true)
                    .attr("aria-label", "Deselect all rows");
            } else {
                that.thead.add(that.lockedHeader).find("tr " + CHECKBOXINPUT)
                    .prop("checked", false).attr("aria-checked", false)
                    .attr("aria-label", "Select all rows");
            }
        },

        _dataSource: function(dataSource) {
            var that = this;
            var ds = this.dataSource;
            var pageable = that.options.pageable;

            if (ds) {
                ds.unbind(CHANGE, this._refreshHandler);
                ds.unbind(ERROR, this._errorHandler);
                ds.unbind(SORT, this._sortHandler);
                ds.unbind(PROGRESS, this._progressHandler);
            }

            this._refreshHandler = this.refresh.bind(this);
            this._errorHandler = this._error.bind(this);
            this._sortHandler = this._clearSortClasses.bind(this);
            this._progressHandler = this._progress.bind(this);


            if (isPlainObject(dataSource)) {
                extend(dataSource, { table: that.table, fields: that.columns });

                if (isPlainObject(pageable) && pageable.pageSize !== undefined$1) {
                    dataSource.pageSize = pageable.pageSize;
                }
            }

            ds = this.dataSource = TreeListDataSource.create(dataSource);

            if (pageable) {
                ds._collapsedTotal = undefined$1;
            }

            ds.bind(CHANGE, this._refreshHandler);
            ds.bind(ERROR, this._errorHandler);
            ds.bind(SORT, this._sortHandler);
            ds.bind(PROGRESS, this._progressHandler);

            this._dataSourceFetchProxy = (function() {
                this.dataSource.fetch();
            }).bind(this);
        },

        setDataSource: function(dataSource) {
            this._dataSource(dataSource);
            this._sortable();
            this._filterable();
            this._filterRow();
            this._columnMenu();
            this._pageable();

            this._contentTree.render([]);

            if (this.options.autoBind) {
                this.dataSource.fetch();
            }
        },

        dataItem: function(element) {
            if (element instanceof TreeListModel) {
                return element;
            }

            var row = $(element).closest("tr");
            var uid = row.attr(kendo.attr("uid"));
            var model = isUndefined(uid) ? null : this.dataSource.getByUid(uid);

            return model;
        },

        editRow: function(row) {
            var that = this;
            var model;

            if (this._isIncellEditable() || !this.options.editable) {
                return;
            }

            if (typeof row === STRING) {
                row = this.tbody.find(row);
            }

            if (that._isPageable() && that._isPopupEditable() && row instanceof TreeListModel) {
                // popup editor can be created without a rendered row
                model = row;
            } else {
                model = this.dataItem(row);
            }

            if (!model) {
                return;
            }

            if (that.editor) {
                model._edit = true;
                this._render();
                this._cancelEditor();
            } else {
                that._preventPageSizeRestore = false;

            }

            if (this._editMode() != "popup") {
                model._edit = true;
            }

            if (this.trigger(BEFORE_EDIT, { model: model })) {
                that.dataSource._restorePageSizeAfterAddChild();
                return;
            }

            this._render();

            this._createEditor(model);

            this.trigger(EDIT, {
                container: this.editor.wrapper,
                model: model
            });
        },

        _cancelEdit: function(e) {
            if (!this.editor) {
                return;
            }
            var currentIndex;

            e = extend(e, {
                container: this.editor.wrapper,
                model: this.editor.model
            });

            if (this.trigger(CANCEL, e)) {
                return;
            }

            if (this.options.navigatable) {
                currentIndex = this.items().index($(this.current()).parent());
            }

            this.cancelRow();

            if (this.options.navigatable) {
                this._setCurrent(this.items().eq(currentIndex).children().filter(NAVCELL).first());
                focusTable(this.table, true);
            }
        },

        cancelRow: function() {
            if (this._isIncellEditable()) {
                return;
            }

            this._cancelEditor();

            this._render();
        },

        saveRow: function() {
            var editor = this.editor;
            var args;

            if (this._isIncellEditable()) {
                return;
            }

            if (!editor) {
                return;
            }

            args = {
                model: editor.model,
                container: editor.wrapper
            };

            if (editor.end() && !this.trigger(SAVE, args)) {
                this.dataSource.sync();
            }
        },

        addRow: function(parent) {
            var that = this;
            var dataSource = that.dataSource;
            var pageable = that._isPageable();
            var incellEditing = that._isIncellEditable();
            var inlineEditing = that._isInlineEditable();
            var editor = this.editor;
            var index = 0;
            var model = {};

            if ((editor && !editor.end()) || !this.options.editable) {
                return;
            }

            if (parent) {
                if (!(parent instanceof TreeListModel)) {
                    parent = this.dataItem(parent);
                }

                model[parent.parentIdField] = parent.id;
                index = this.dataSource.indexOf(parent) + 1;

                this.expand(parent)
                    .then(function() {
                        var showNewModelInView = pageable && dataSource._isLastItemInView(parent) && (incellEditing || inlineEditing);
                        that._insertAt(model, index, showNewModelInView);
                    });

                return;
            }

            this._insertAt(model, index);
        },

        _insertAt: function(model, index, showNewModelInView) {
            var that = this;
            var dataSource = that.dataSource;
            model = that.dataSource.insert(index, model);

            if (showNewModelInView) {
                dataSource._setAddChildPageSize();
            }

            var row = this._itemFor(model);
            var cell;

            if (that._isIncellEditable()) {
                cell = row.children("td").eq(that._firstEditableColumnIndex(row));
                that.editCell(cell);
            } else if (row && row[0]) {
                that.editRow(row);
            } else if ((that._isPageable() || that.dataSource.filter()) && (that._isPopupEditable() || that._isInlineEditable())) {
                that.editRow(model);
            }
        },

        _firstEditableColumnIndex: function(container) {
            var that = this;
            var model = that.dataItem(container);
            var columns = leafColumns(that.columns);
            var length = columns.length;
            var column;
            var idx;

            for (idx = 0; idx < length; idx++) {
                column = columns[idx];

                if (model && (!model.editable || model.editable(column.field)) && !column.command && !column.draggable && column.field && column.hidden !== true) {
                    return idx;
                }
            }

            return -1;
        },

        removeRow: function(row) {
            var model = this.dataItem(row);
            var args = {
                model: model,
                row: row
            };

            if (this.options.editable && model && !this.trigger(REMOVE, args)) {
                if (document.activeElement === $(row).find(".k-grid-delete")[0]) {
                    $(row).find(".k-grid-delete").trigger("blur");
                }
                this.dataSource.remove(model);

                if (!this._isIncellEditable()) {
                    this.dataSource.sync();
                }
            }
        },

        _cancelEditor: function() {
            var that = this;
            var model;
            var editor = that.editor;

            if (editor) {
                model = editor.model;

                that._destroyEditor();

                if (!that._isIncellEditable()) {
                    that.dataSource.cancelChanges(model);
                } else if (that._shouldRestorePageSize()) {
                    that.dataSource._restorePageSizeAfterAddChild();
                }

                model._edit = false;
            }

            that._preventPageSizeRestore = false;
        },

        _shouldRestorePageSize: function() {
            var that = this;
            return that._isPageable() && that._isIncellEditable() && !that._preventPageSizeRestore;
        },

        _destroyEditor: function() {
            if (!this.editor) {
                return;
            }

            this.editor.close();
            this.editor = null;
        },

        _createEditor: function(model) {
            let row = this.itemFor(model);
            let columns = leafColumns(this.columns);
            let leafCols = [];
            let that = this;

            for (var idx = 0; idx < columns.length; idx++) {
                leafCols.push(extend({}, columns[idx]));
                delete leafCols[idx].parentColumn;
            }

            row = row.add(this._relatedRow(row));

            let mode = this._editMode();

            let options = {
                columns: leafCols,
                model: model,
                target: this,
                clearContainer: false,
                template: this.options.editable.template
            };

            if (mode == "inline") {
                this.editor = new Editor(row, options);
            } else {
                let windowOptions = extend({}, that.options.editable.window, {
                    _footerTemplate: () =>
                        `<div class="k-actions k-actions-start k-actions-horizontal k-window-actions">` +
                            that._buildCommands(["update"], true)[0].html +
                            that._buildCommands(["canceledit"], true)[0].html +
                        `</div>`
                });
                extend(options, {
                    window: windowOptions,
                    fieldRenderer: this._cellContent.bind(this),
                    save: this.saveRow.bind(this),
                    cancel: this._cancelEdit.bind(this),
                    appendTo: this.wrapper
                });

                this.editor = new PopupEditor(row, options);
            }
        },

        _createIncellEditor: function(cell, options) {
            var that = this;
            var column = extend({}, options.columns[0]);

            delete column.parentColumn;

            return new IncellEditor(cell, extend({}, {
                fieldRenderer: that._cellContent.bind(that),
                appendTo: that.wrapper,
                clearContainer: false,
                target: that,
                columns: [column],
                model: options.model,
                change: options.change
            }));
        },

        editCell: function(cell) {
            var that = this;
            cell = $(cell);
            var column = leafColumns(that.columns)[that.cellIndex(cell)];
            var model = that.dataItem(cell);

            if (that._isIncellEditable() && model && isColumnEditable(column, model)) {
                that._editCell(cell, column, model, cell.index());
            }
        },

        _editCell: function(cell, column, model, cellIndex) {
            var that = this;
            var editedCell;

            if (that.trigger(BEFORE_EDIT, { model: model })) {
                that.dataSource._restorePageSizeAfterAddChild();
                return;
            }

            that.closeCell();

            model._edit = true;

            that._cancelEditor();

            that._render({
                editedColumn: column,
                editedColumnIndex: cellIndex
            });

            editedCell = that.table.add(that.lockedTable).find(DOT + classNames.editCell).first();

            that.editor = that._createIncellEditor(editedCell, {
                columns: [column],
                model: model,
                change: function(e) {
                    if (that.trigger(SAVE, { values: e.values, container: cell, model: model } )) {
                        e.preventDefault();
                    }

                }
            });

            if (that.lockedTable) {
                that._syncLockedContentHeight();
            }

            // refresh the current element as the DOM element reference can be changed after render()
            that.current() && that.current().removeClass("k-focus");
            that._current = editedCell;
            that.trigger(EDIT, { container: cell, model: model });
        },

        closeCell: function(isCancel) {
            var that = this;
            var cell = (that.editor || {}).element;
            var tr;
            var model;

            if (!cell || !cell[0] || !that._isIncellEditable()) {
                return;
            }

            model = that.dataItem(cell);

            if (isCancel && that.trigger(CANCEL, { container: cell, model: model })) {
                return;
            }

            that.trigger(CELL_CLOSE, { type: isCancel ? CANCEL : SAVE, model: model, container: cell });

            that._cancelEditor();

            cell.removeClass(classNames.editCell);

            tr = cell.parent().removeClass(classNames.editRow);

            if (that.lockedContent) {
                that._relatedRow(tr).removeClass(classNames.editRow);
            }

            that._render();

            that.trigger(ITEM_CHANGE, { item: tr, data: model, ns: ui });

            if (that.lockedContent) {
                adjustRowHeight(tr.css("height", "")[0], that._relatedRow(tr).css("height", "")[0]);
            }
        },

        cancelChanges: function() {
            this.dataSource.cancelChanges();
        },

        saveChanges: function() {
            var that = this;
            var editable = (that.editor || {}).editable;
            var valid = editable && editable.end();

            if ((valid || !editable) && !that.trigger(SAVE_CHANGES)) {
                that.dataSource.sync();
            }
        },

        _editMode: function() {
            var mode = "inline",
                editable = this.options.editable;

            if (editable !== true) {
                if (typeof editable == "string") {
                    mode = editable;
                } else {
                    mode = editable.mode || mode;
                }
            }

            return mode.toLowerCase();
        },

        _isIncellEditable: function() {
            return this._editMode() === INCELL;
        },

        _isInlineEditable: function() {
            return this._editMode() === INLINE;
        },

        _isPopupEditable: function() {
            return this._editMode() === POPUP;
        },

        hideColumn: function(column) {
            this._toggleColumnVisibility(column, true);
        },

        showColumn: function(column) {
            this._toggleColumnVisibility(column, false);
        },

        _toggleColumnVisibility: function(column, hidden) {
            column = this._findColumn(column);

            if (!column || column.hidden === hidden) {
                return;
            }

            column.hidden = hidden;
            this._setParentsVisibility(column, !hidden);

            this._ensureExpandableColumn();
            this._clearColsCache();
            this._renderCols();
            this._renderHeader();
            this._render();

            this._adjustTablesWidth();
            if (hidden) {
                this._ariaAddHiddenColIndex();
            } else {
                this._ariaRemoveHiddenColIndex();
            }

            this.trigger(hidden ? COLUMNHIDE : COLUMNSHOW, { column: column });

            if (!hidden && !column.width) {
                this.table
                    .add(this.thead.closest("table"))
                    .width("");
            }
            this._updateFirstColumnClass();
        },

        _findColumn: function(column) {
            if (typeof column == "number") {
                column = this.columns[column];
            } else if (isPlainObject(column)) {
                column = grep(leafColumns(this.columns), function(item) {
                    return item === column;
                })[0];
            } else {
                column = grep(leafColumns(this.columns), function(item) {
                    return item.field === column;
                })[0];
            }

            return column;
        },

        _adjustTablesWidth: function() {
            var idx, length;
            var cols = this.thead.prev().children();
            var colWidth, width = 0;

            for (idx = 0, length = cols.length; idx < length; idx++ ) {
                colWidth = cols[idx].style.width;
                if (colWidth && colWidth.indexOf("%") == -1) {
                    width += parseInt(colWidth, 10);
                } else {
                    width = 0;
                    break;
                }
            }


            if (width) {
                this.table
                    .add(this.thead.closest("table"))
                    .width(width);
            }
        },

        _reorderable: function() {
            if (!this.options.reorderable) {
                return;
            }

            var scrollable = this.options.scrollable === true;
            var selector = (scrollable ? ".k-grid-header " : "table>.k-grid-header ") + HEADERCELLS;
            var that = this;

            this._draggableInstance = new ui.Draggable(this.wrapper, {
                group: kendo.guid(),
                filter: selector,
                ignore: ".k-filter-row *",
                hint: function(target) {
                    return $('<div class="k-reorder-clue k-drag-clue" />')
                    .html(target.attr(kendo.attr("title")) || target.attr(kendo.attr("field")) || target.text())
                    .prepend(kendo.ui.icon({ icon: "cancel", iconClass: "k-drag-status" }));
                }
            });

            this.reorderable = new ui.Reorderable(this.wrapper, {
                draggable: this._draggableInstance,
                dragOverContainers: this._allowDragOverContainers.bind(this),
                inSameContainer: function(e) {
                    return $(e.source).parent()[0] === $(e.target).parent()[0] && targetParentContainerIndex(flatColumnsInDomOrder(that.columns), that.columns, e.sourceIndex, e.targetIndex) > -1;
                },
                change: function(e) {
                    var columns = flatColumnsInDomOrder(that.columns);
                    var column = columns[e.oldIndex];
                    var newIndex = targetParentContainerIndex(columns, that.columns, e.oldIndex, e.newIndex);

                    that.trigger(COLUMNREORDER, {
                        newIndex: newIndex,
                        oldIndex: inArray(column, columns),
                        column: column
                    });

                    that.reorderColumn(newIndex, column, e.position === "before");
                }
            });
        },

        _allowDragOverContainers: function(sourceIndex, targetIndex) {
            var columns = flatColumnsInDomOrder(this.columns);
            return columns[sourceIndex].lockable !== false && targetParentContainerIndex(columns, this.columns, sourceIndex, targetIndex) > -1;
        },

        _reorderTrees: function(destSources, destContainer, destDomTree, sources, sourcesContainer, sourcesDomTree, before, depth) {
            var ths = $();
            var source = sourcesContainer.find("tr").eq(sources[0].rowIndex);
            var sourceDOM = sourcesDomTree.children[sources[0].rowIndex];
            var sourceChildren = source.children();
            var destDomChildren;
            var currentIndex;
            var destColumn = before ? destSources[0] : destSources[destSources.length - 1];
            var destRow;
            var sourcesLeafs;
            var destLeafs;
            var reorderTaget;
            var destThs;

            for (var idx = 0; idx < sources.length; idx++) {
                currentIndex = sources[idx].cellIndex;
                ths = ths.add(sourceChildren.eq(currentIndex));
                destDomChildren = destDomTree.children[destColumn.rowIndex].children;
                if (destDomTree === sourcesDomTree && before) {
                    currentIndex += idx;
                }

                destDomChildren.splice(before ? destColumn.cellIndex + idx : destColumn.cellIndex + 1 + idx, 0, sourceDOM.children[currentIndex]);
            }

            if (destDomTree === sourcesDomTree && before) {
                sourceDOM.children.splice(sources[0].cellIndex + sources.length, sources.length);
            } else {
                sourceDOM.children.splice(sources[0].cellIndex, sources.length);
            }
            destRow = destContainer.find("tr").eq(destColumn.rowIndex);
            destThs = destRow.find(">th.k-header").eq(destColumn.cellIndex);

            if (destThs.length && ths[0] !== destThs[0]) {
                ths[before ? "insertBefore" : "insertAfter"](destThs);
            }

            if (depth >= sources[0].rowIndex + 1 && depth != 1) {
                sourcesLeafs = [];
                for (idx = 0; idx < sources.length; idx++) {
                    if (sources[idx].columns) {
                        sourcesLeafs = sourcesLeafs.concat(sources[idx].columns);
                    }
                }
                if (!sourcesLeafs.length) {
                    return;
                }

                destLeafs = [];

                for (idx = 0; idx < destSources.length; idx++) {
                    if (destSources[idx].columns) {
                        destLeafs = destLeafs.concat(destSources[idx].columns);
                    }
                }

                if (!destLeafs.length && (destContainer !== sourcesContainer || (destColumn.cellIndex - sources[0].cellIndex > 1 || sources[0].cellIndex - destColumn.cellIndex > 1))) {
                    reorderTaget = findReorderTarget(this.columns, destColumn, sources[0], before, this.columns);

                    destLeafs = [reorderTaget];
                    if (!reorderTaget && sourcesLeafs.length && destContainer.find("tr").length > sources[0].rowIndex + 1) {
                        this._insertTree(sourcesLeafs, sourcesContainer, sourcesDomTree, destContainer, destDomTree);
                        return;
                    }
                }

                if (!destLeafs.length) {
                    return;
                }

                this._reorderTrees(destLeafs, destContainer, destDomTree, sourcesLeafs, sourcesContainer, sourcesDomTree, before, depth);
            }
        },

        _insertTree: function(columns, sourcesContainer, sourcesDomTree, destContainer, destDomTree) {
            var leafs = [];
            var row;
            var ths = $();
            var domTr;

            row = sourcesContainer.find("tr").eq(columns[0].rowIndex);
            domTr = sourcesDomTree.children[columns[0].rowIndex];

            for (var idx = 0; idx < columns.length; idx++) {
                if (columns[idx].columns) {
                    leafs = leafs.concat(columns[idx].columns);
                }
                destDomTree.children[columns[0].rowIndex].children.splice(idx, 0, domTr.children[columns[idx].rowIndex]);
                ths = ths.add(row.find(">th.k-header").eq(columns[idx].cellIndex));
            }

            sourcesDomTree.children[columns[0].rowIndex].children.splice(columns[0].cellIndex, columns.length);
            destContainer.find("tr").eq(columns[0].rowIndex).append(ths);

            if (leafs.length) {
                this._insertTree(leafs, sourcesContainer, sourcesDomTree, destContainer, destDomTree);
            }
        },

        _reorderHeader: function(destColumn, column, before) {
            var sourcesDepth = column.columns ? depth([column]) : 1;
            var targetDepth = destColumn.columns ? depth([destColumn]) : 1;
            var sourceLocked = isLocked(column);
            var destLocked = isLocked(destColumn);
            var destContainer = destLocked ? this.lockedHeader : this.thead;
            var sourcesContainer = sourceLocked ? this.lockedHeader : this.thead;
            var destDomTree = destLocked ? this._lockedHeaderTree : this._headerTree;
            var sourcesDomTree = sourceLocked ? this._lockedHeaderTree : this._headerTree;
            var rowsToAdd;
            var destRows = destContainer.find("tr:not(.k-filter-row)");
            var destTarget;


            if (sourcesDepth === targetDepth || sourcesDepth < destRows.length ) {
                this._reorderTrees([destColumn], destContainer, destDomTree , [column], sourcesContainer ,sourcesDomTree, before, sourcesDepth);
                updateRowSpans(destContainer, destDomTree);
                removeEmptyRows(sourcesContainer, sourcesDomTree);
            } else {
                if (destContainer !== sourcesContainer) {
                    rowsToAdd = sourcesDepth - destRows.length;

                    destRows.each(function(idx) {
                        var cells = this.cells;
                        for (var i = 0; i < cells.length; i++) {
                            if (cells[i].colSpan <= 1 && cells[i].attributes.rowspan) {
                                destDomTree.children[idx].children[i].attr.rowSpan += rowsToAdd;
                                cells[i].rowSpan += rowsToAdd;
                            }
                        }
                    });

                    for (var j = 0; j < rowsToAdd; j++) {
                       destDomTree.children.push(kendoDomElement("tr", { "role": "row" }));
                       if (destContainer.is("thead")) {
                           destTarget = destContainer;
                       } else {
                          destTarget = destContainer.find("thead");
                       }

                       if (this._hasFilterRow()) {
                           $("<tr class='k-table-row' role='row'></tr>").insertBefore(destTarget.find('tr.k-filter-row'));
                       } else {
                           destTarget.append("<tr class='k-table-row' role='row'></tr>");
                       }
                    }
                }

                this._reorderTrees([destColumn], destContainer, destDomTree , [column], sourcesContainer ,sourcesDomTree, before, sourcesDepth);
                removeEmptyRows(sourcesContainer, sourcesDomTree);
             }
        },

        reorderColumn: function(destIndex, column, before) {
            var lockChanged;
            var parent = column.parentColumn;
            var columns = parent ? parent.columns : this.columns;
            var sourceIndex = inArray(column, columns);
            var destColumn = columns[destIndex];
            var isLocked = !!destColumn.locked;
            var hasMultiColumnHeaders = grep(this.columns, function(item) {
                return item.columns !== undefined$1;
            }).length > 0;
            var nonLockedColumnsLength = nonLockedColumns(columns).length;

            if (sourceIndex === destIndex) {
                return;
            }

            if (isLocked && !column.locked && nonLockedColumnsLength == 1) {
                return;
            }

            if (!isLocked && column.locked && (columns.length - nonLockedColumnsLength == 1)) {
                return;
            }

            if (before === undefined$1) {
                before = destIndex < sourceIndex;
            }

            if (hasMultiColumnHeaders) {
                this._reorderHeader(destColumn, column, before);
            }

            lockChanged = !!column.locked;
            lockChanged = lockChanged != isLocked;

            column.locked = isLocked;
            columns.splice(before ? destIndex : destIndex + 1, 0, column);
            columns.splice(sourceIndex < destIndex ? sourceIndex : sourceIndex + 1, 1);
            this._setColumnDataIndexes(leafColumns(this.columns));
            this._clearColsCache();
            this._renderCols();

            //reorder column header manually
            if (!hasMultiColumnHeaders) {
                var ths = $(this.lockedHeader).add(this.thead).find("tr:not(.k-filter-row) th");

                ths.eq(sourceIndex)[before ? "insertBefore" : "insertAfter"](ths.eq(destIndex));

                var dom = this._headerTree.children[0].children;
                if (this._hasLockedColumns) {
                    dom = this._lockedHeaderTree.children[0].children.concat(dom);
                }
                dom.splice(before ? destIndex : destIndex + 1, 0, dom[sourceIndex]);
                dom.splice(sourceIndex < destIndex ? sourceIndex : sourceIndex + 1, 1);
                if (this._hasLockedColumns) {
                    this._lockedHeaderTree.children[0].children = dom.splice(0, lockedColumns(columns).length);
                    this._headerTree.children[0].children = dom;
                }
            } else {
                if (this.lockedHeader) {
                    columns = nonLockedColumns(this.columns);
                    this._prepareColumns([{ rowSpan: 1, cells: [], index: 0 }], columns);
                    columns = lockedColumns(this.columns);
                    this._prepareColumns([{ rowSpan: 1, cells: [], index: 0 }], columns);
                } else {
                    this._prepareColumns([{ rowSpan: 1, cells: [], index: 0 }], this.columns);
                }
            }
            this._updateColumnCellIndex();
            this._applyLockedContainersWidth();
            this._syncLockedHeaderHeight();
            this._updateFirstColumnClass();

            if (this._hasFilterRow()) {
                this._updateFilterThs(before, column, destColumn);
            }

            this.refresh();

            if (!lockChanged) {
                return;
            }

            if (isLocked) {
                this.trigger(COLUMNLOCK, {
                    column: column
                });
            } else {
                this.trigger(COLUMNUNLOCK, {
                    column: column
                });
            }
        },

        lockColumn: function(column) {
            var columns = this.columns;

            if (typeof column == "number") {
                column = columns[column];
            } else {
                column = grep(columns, function(item) {
                    return item.field === column;
                })[0];
            }

            if (!column || column.hidden) {
                return;
            }

            var index = lockedColumns(columns).length - 1;
            this.reorderColumn(index, column, false);
        },

        unlockColumn: function(column) {
            var columns = this.columns;

            if (typeof column == "number") {
                column = columns[column];
            } else {
                column = grep(columns, function(item) {
                    return item.field === column;
                })[0];
            }

            if (!column || column.hidden) {
                return;
            }

            var index = lockedColumns(columns).length;
            this.reorderColumn(index, column, true);
        },

        _columnMenu: function() {
            var ths = $(this.lockedHeader).add(this.thead).find("th");
            var columns = this.columns;
            var options = this.options;
            var columnMenu = options.columnMenu;
            var column, menu, menuOptions, sortable, filterable;
            var initHandler = this._columnMenuInit.bind(this);
            var openHandler = this._columnMenuOpen.bind(this);
            var sortHandler = this._sort.bind(this);
            var filterHandler = this._filter.bind(this);
            var hasLockableColumns = grep(this.columns, function(item) {
                return item.lockable !== false;
            }).length > 0;
            var hasMultiColumnHeaders = grep(this.columns, function(item) {
                return item.columns !== undefined$1;
            }).length > 0;

            if (hasMultiColumnHeaders) {
                columns = leafColumns(columns);
                if (this.lockedHeader) {
                    ths = sortCells(leafDataCells(this.lockedHeader.find(">table>thead")).add(leafDataCells(this.thead)));
                } else {
                    ths = leafDataCells(this.thead);
                }
            } else {
                ths = $(this.lockedHeader).add(this.thead).find("tr:not(.k-filter-row) th");
            }

            if (!columnMenu) {
                return;
            }

            if (typeof columnMenu == "boolean") {
                columnMenu = {};
            }

            for (var i = 0; i < ths.length; i++) {
                column = columns[i];
                if (!column.field) {
                    continue;
                }

                menu = ths.eq(i).data("kendoColumnMenu");
                if (menu) {
                    menu.destroy();
                }

                sortable = false;
                if (column.sortable !== false && columnMenu.sortable !== false && options.sortable !== false) {
                    sortable = extend({}, options.sortable, { compare: (column.sortable || {}).compare });
                }

                filterable = false;
                if (options.filterable && column.filterable !== false && columnMenu.filterable !== false) {
                    filterable = extend({ pane: this.pane }, column.filterable, options.filterable);
                }

                menuOptions = {
                    dataSource: this.dataSource,
                    values: column.values,
                    columns: columnMenu.columns,
                    sortable: sortable,
                    filterable: filterable,
                    messages: columnMenu.messages,
                    owner: this,
                    closeCallback: closeCallback,
                    init: initHandler,
                    open: openHandler,
                    sort: sortHandler,
                    filtering: filterHandler,
                    pane: this.pane,
                    hasLockableColumns: lockedColumns(columns).length > 0 && hasLockableColumns && !hasMultiColumnHeaders,
                    appendTo: DOT + classNames.headerCellInner,
                    reorderable: !!options.reorderable
                };

                ths.eq(i).kendoColumnMenu(menuOptions);
            }
        },

        _columnMenuInit: function(e) {
            this.trigger(COLUMNMENUINIT, { field: e.field, container: e.container });
        },

        _columnMenuOpen: function(e) {
            this.trigger(COLUMNMENUOPEN, { field: e.field, container: e.container });
        },

        _filter: function(e) {
            if (this.trigger(FILTER, { filter: e.filter, field: e.field })) {
                e.preventDefault();
            }
        },

        _sort: function(e) {
            if (this.trigger(SORT, { sort: e.sort })) {
                e.preventDefault();
            }
        },

        _pageable: function() {
            var that = this,
                wrapper,
                pageable = that.options.pageable;

            if (pageable) {
                wrapper = that.wrapper.children("div.k-grid-pager");

                if (!wrapper.length) {
                    wrapper = $('<div class="k-pager k-grid-pager"/>').appendTo(that.wrapper);
                }

                that._destroyPager();

                if (typeof pageable === "object" && pageable instanceof kendo.ui.TreeListPager) {
                    that.pager = pageable;
                } else if (that.dataSource && !that.dataSource.options.serverPaging) {
                    that._createPager(wrapper);
                }

                if (that.pager) {
                    that.pager.bind(PAGE_CHANGE, function(e) {
                        if (that.trigger(PAGE, { page: e.index })) {
                            e.preventDefault();
                        }
                    });
                }
            }
        },

        _createPager: function(element, options) {
            var that = this;

            that.pager = new TreeListPager(element, extend({}, that.options.pageable, {
                dataSource: that.dataSource,
                size: "medium",
                navigatable: that.options.navigatable
            }, options));
        },

        _destroyPager: function() {
            if (this.pager) {
                this.pager.destroy();
                this.pager = null;
            }
        },

        _isPageable: function() {
            var that = this;
            return that.options.pageable && (!that.dataSource || (that.dataSource && that.dataSource._isPageable()));
        },

        _togglePagerVisibility: function() {
            var that = this;
            var pageable = that.options.pageable;

            if (pageable && (isPlainObject(pageable) || pageable instanceof TreeListPager) && pageable.alwaysVisible === false) {
                that.wrapper.find(".k-grid-pager").toggle((that.dataSource.collapsedTotal() || 0) >= that.dataSource.pageSize());
            }
        }
    });

    function closeCallback(element) {
        focusTable(element.closest(".k-treelist").find("[role=treegrid]"), true);
    }

    function isInputElement(element) {
       return $(element).is(":button,a,:input,a>.k-icon,a>.k-svg-icon,textarea,span.k-select,span.k-icon:not(.k-treelist-toggle),span.k-svg-icon:not(.k-treelist-toggle),span.k-link,.k-input,.k-multiselect-wrap,.k-tool-icon,.k-input-value-text,.k-input-inner,.k-button-icon,.k-switch-thumb,.k-switch-track,.k-switch-label-off,.k-switch-label-on");
    }

    function isLocked(column) {
        if (!column.parentColumn) {
            return !!column.locked;
        }
        return !!isLocked(column.parentColumn);
    }

    function findParentColumnWithChildren(columns, index, source, rtl) {
        var target;
        var locked = !!source.locked;
        var targetLocked;

        do {
            target = columns[index];
            index += rtl ? 1 : -1;
            targetLocked = !!target.locked;
        } while (target && index > -1 && index < columns.length && target != source && !target.columns && targetLocked === locked);

        return target;
    }

    function findReorderTarget(columns, target, source, before, masterColumns) {
        if (target.columns) {
            target = target.columns;
            return target[before ? 0 : target.length - 1];
        } else {
            var parent = columnParent(target, columns);
            var parentColumns;

            if (parent) {
                parentColumns = parent.columns;
            } else {
                parentColumns = columns;
            }

            var index = inArray(target, parentColumns);
            if (index === 0 && before && parentColumns.length !== 1) {
                index++;
            } else if (index == parentColumns.length - 1 && !before && index !== 0) {
                index--;
            } else if (index > 0 || (index === 0 && !before && index !== 0)) {
                index += before ? -1 : 1;
            }

            var sourceIndex = inArray(source, parentColumns);
            target = findParentColumnWithChildren(parentColumns, index, source, sourceIndex > index);
            var targetIndex = inArray(target, masterColumns);
            if (target.columns && (!targetIndex || targetIndex === parentColumns.length - 1)) {
                return null;
            }

            if (target && target != source && target.columns) {
                return findReorderTarget(columns, target, source, before, masterColumns);
            }
        }
        return null;
    }

    function leafColumns(columns) {
        var result = [];

        for (var idx = 0; idx < columns.length; idx++) {
            if (!columns[idx].columns) {
                result.push(columns[idx]);
                continue;
            }
            result = result.concat(leafColumns(columns[idx].columns));
        }

        return result;
    }

    function getColumnsFields(columns) {
        var result = [];
        columns = leafColumns(columns);

        for (var idx = 0; idx < columns.length; idx++) {
            if (typeof columns[idx] === "string") {
                result.push(columns[idx]);
            } else if (columns[idx].field) {
                result.push(columns[idx].field);
            }
        }
        return result;
    }

    function visibleChildColumns(columns) {
        return grep(columns, function(column) {
            return !column.hidden;
        });
    }

    function isVisible(column) {
        return visibleColumns([column]).length > 0;
    }

    function visibleColumns(columns) {
        return grep(columns, function(column) {
            var result = !column.hidden;
            if (result && column.columns) {
                result = visibleColumns(column.columns).length > 0;
            }
            return result;
        });
    }

    function normalizeColumns(columns, hide, parentIds) {
        return map(columns, function(column) {
            var hidden;

            column.parentIds = parentIds;

            if (!isVisible(column) || hide) {
                hidden = true;
            }

            var uid = kendo.guid();
            column.headerAttributes = extend({ headers: parentIds }, column.headerAttributes);
            if (!column.headerAttributes || !column.headerAttributes.id) {
                column.headerAttributes = extend({ id: uid }, column.headerAttributes);
            } else {
                uid = column.headerAttributes.id;
            }

            if (column.columns) {
                column.columns = normalizeColumns(column.columns, hidden, parentIds ? (parentIds + " " + uid) : uid);
            }
            return extend({ hidden: hidden }, column);
        });
    }

    function flatColumnsInDomOrder(columns) {
        var result = flatColumns(lockedColumns(columns));
        return result.concat(flatColumns(nonLockedColumns(columns)));
    }

    function targetParentContainerIndex(flatColumns, columns, sourceIndex, targetIndex) {
        var column = flatColumns[sourceIndex];
        var target = flatColumns[targetIndex];

        var parent = columnParent(column, columns);
        columns = parent ? parent.columns : columns;

        return inArray(target, columns);
    }

    function parentColumnsCells(cell) {
        var container = cell.closest("table");
        var result = $().add(cell);

        var row = cell.closest("tr");
        var headerRows = container.find("tr");
        var level = headerRows.index(row);
        if (level > 0) {
            var parent = headerRows.eq(level - 1);
            var parentCellsWithChildren = parent.find("th").filter(function() {
                return !$(this).attr("rowspan");
            });

            var offset = 0;
            var index = row.find("th").index(cell);

            var prevCells = cell.prevAll().filter(function() {
                return this.colSpan > 1;
            });

            for (var idx = 0; idx < prevCells.length; idx++) {
                offset += prevCells[idx].colSpan || 1;
            }

            index += Math.max(offset - 1, 0);

            offset = 0;
            for (idx = 0; idx < parentCellsWithChildren.length; idx++) {
                var parentCell = parentCellsWithChildren.eq(idx);
                if (parentCell.attr("data-colspan")) {
                    offset += parentCell[0].getAttribute("data-colspan");
                } else {
                    offset += 1;
                }
                if (index >= idx && index < offset) {
                    result = parentColumnsCells(parentCell).add(result);
                    break;
                }
            }
        }
        return result;
    }

    function childColumnsCells(cell) {
        var container = cell.closest("thead");
        var result = $().add(cell);

        var row = cell.closest("tr");
        var headerRows = container.find("tr");
        var level = headerRows.index(row) + cell[0].rowSpan;
        var colSpanAttr = kendo.attr("colspan");

        if (level <= headerRows.length - 1) {
            var child = row.next();
            var prevCells = cell.prevAll();

            var idx;

            prevCells = prevCells.filter(function() {
                return !this.rowSpan || this.rowSpan === 1;
            });

            var offset = 0;

            for (idx = 0; idx < prevCells.length; idx++) {
                offset += parseInt(prevCells.eq(idx).attr(colSpanAttr), 10) || 1;
            }

            var cells = child.find("th");
            var colSpan = parseInt(cell.attr(colSpanAttr), 10) || 1;

            idx = 0;

            while (idx < colSpan) {
                child = cells.eq(idx + offset);
                result = result.add(childColumnsCells(child));
                var value = parseInt(child.attr(colSpanAttr), 10);
                if (value > 1) {
                    colSpan -= value - 1;
                }
                idx++;
            }
        }

        return result;
    }

    function columnParent(column, columns) {
        var parents = [];
        columnParents(column, columns, parents);
        return parents[parents.length - 1];
    }

    function columnParents(column, columns, parents) {
        parents = parents || [];

        for (var idx = 0; idx < columns.length; idx++) {
            if (column === columns[idx]) {
                return true;
            } else if (columns[idx].columns) {
                var inserted = parents.length;
                parents.push(columns[idx]);
                if (!columnParents(column, columns[idx].columns, parents)) {
                    parents.splice(inserted, parents.length - inserted);
                } else {
                    return true;
                }
            }
        }
        return false;
    }

    function flatColumns(columns) {
        var result = [];
        var children = [];
        for (var idx = 0; idx < columns.length; idx++) {
            result.push(columns[idx]);
            if (columns[idx].columns) {
                children = children.concat(columns[idx].columns);
            }

        }
        if (children.length) {
            result = result.concat(flatColumns(children));
        }
        return result;
    }

    function columnPosition(column, columns, row, cellCounts) {
        var result;
        var idx;

        row = row || 0;
        cellCounts = cellCounts || {};
        cellCounts[row] = cellCounts[row] || 0;

        for (idx = 0; idx < columns.length; idx++) {
           if (columns[idx] == column) {
                result = { cell: cellCounts[row], row: row };
                break;
           } else if (columns[idx].columns) {
               result = columnPosition(column, columns[idx].columns, row + 1, cellCounts);
               if (result) {
                    break;
               }
           }

           cellCounts[row]++;
        }
        return result;
    }

    function updateCellIndex(thead, columns, offset) {
        offset = offset || 0;

        var position;
        var cell;
        var allColumns = columns;
        columns = leafColumns(columns);

        var cells = {};
        var rows = thead.find(">tr:not(.k-filter-row)");

        var filter = function() {
            var el = $(this);
            return !el.hasClass("k-group-cell") && !el.hasClass("k-hierarchy-cell");
        };

        for (var idx = 0, length = columns.length; idx < length; idx++) {
            position = columnPosition(columns[idx], allColumns);

            if (!cells[position.row]) {
                cells[position.row] = rows.eq(position.row)
                    .find(".k-header")
                    .filter(filter);
            }

            cell = cells[position.row].eq(position.cell);
            cell.attr(kendo.attr("index"), offset + idx);
        }

        return columns.length;
    }

    function depth(columns) {
        var result = 1;
        var max = 0;

        for (var idx = 0; idx < columns.length; idx++) {
            if (columns[idx].columns) {
                var temp = depth(columns[idx].columns);
                if (temp > max) {
                    max = temp;
                }
            }
        }
        return result + max;
    }

    function lockedColumns(columns) {
        return grep(columns, is("locked"));
    }

    function nonLockedColumns(columns) {
        return grep(columns, not(is("locked")));
    }

    function updateRowSpans(container, containerDOMtree) {
        var rows = container.find("tr:not(.k-filter-row)");
        var length = rows.length;

        rows.each(function(idx) {
            var cells = this.cells;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].colSpan <= 1 && cells[i].attributes.rowspan) {
                    containerDOMtree.children[idx].children[i].attr.rowSpan = length - idx;
                    cells[i].rowSpan = length - idx;
                }
            }
        });
    }

    function removeEmptyRows(container, containerDOMtree) {
        var rows = container.find("tr");
        var emptyRows = [];

        rows.filter(function(idx) {
            var shouldRemove = !$(this).children().length;
            if (shouldRemove) {
                emptyRows.push(idx);

            }
            return shouldRemove;
        }).remove();

        for (var i = emptyRows.length - 1; i >= 0; i--) {
            containerDOMtree.children.splice(emptyRows[i], 1);
        }

        updateRowSpans(container, containerDOMtree);
    }

    function focusTable(table, direct) {
      if (direct === true) {
         table = $(table);
         var scrollTop, scrollLeft;
         scrollTop = table.parent().scrollTop();
         scrollLeft = kendo.scrollLeft(table.parent());

        kendo.focusElement(table);

        kendo.scrollLeft(table.parent().scrollTop(scrollTop), scrollLeft);

      } else {
         $(table).one("focusin", function(e) { e.preventDefault(); }).trigger("focus");
      }
    }

    function adjustRowHeight(row1, row2) {
       var height;
       var offsetHeight1 = row1.offsetHeight;
       var offsetHeight2 = row2.offsetHeight;

       if (offsetHeight1 > offsetHeight2) {
           height = offsetHeight1 + "px";
       } else if (offsetHeight1 < offsetHeight2) {
           height = offsetHeight2 + "px";
       }

       if (height) {
           row1.style.height = row2.style.height = height;
       }
    }

    function isColumnEditable(column, model) {
        if (!column || !model || !column.field || column.selectable || column.command || column.draggable || (column.editable && !column.editable(model))) {
            return false;
        }

        return (column.field && model.editable && model.editable(column.field));
    }

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function isDirtyColumn(column, model) {
        var field = (column || {}).field || "";
        return (model.dirty && model.dirtyFields && model.dirtyFields[field] && isColumnEditable(column, model));
    }

    function isUndefined(value) {
        return typeof(value) === "undefined";
    }

    function isNumber(value) {
        return typeof value === "number" && !isNaN(value);
    }

    if (kendo.ExcelMixin) {
        kendo.ExcelMixin.extend(TreeList.prototype);
    }

    if (kendo.PDFMixin) {
        kendo.PDFMixin.extend(TreeList.prototype);

       TreeList.prototype._drawPDF = function(progress) {
           var treeList = this;

           if (treeList.options.pdf.paperSize && treeList.options.pdf.paperSize != "auto") {
               return treeList._drawPDF_autoPageBreak(progress);
           }

           var result = new $.Deferred();
           var dataSource = treeList.dataSource;
           var allPages = treeList.options.pdf.allPages;

           this._initPDFProgress(progress);

           // This group will be our document containing all pages
           var doc = new kendo.drawing.Group();
           var startingPage = dataSource.page();

           function resolve() {
               if (allPages && startingPage !== undefined$1) {
                   dataSource.unbind("change", exportPage);
                   dataSource.one("change", function() {
                       result.resolve(doc);
                   });

                   dataSource.page(startingPage);
               } else {
                   result.resolve(doc);
               }
           }

           function exportPage() {
                treeList._drawPDFShadow({
                    width: treeList.wrapper.width()
                }, {
                    avoidLinks: treeList.options.pdf.avoidLinks
                })
                .done(function(group) {
                    var pageNum = dataSource.page();
                    var totalPages = allPages ? dataSource.totalPages() : 1;

                    var args = {
                        page: group,
                        pageNumber: pageNum,
                        progress: pageNum / totalPages,
                        totalPages: totalPages
                    };

                    progress.notify(args);
                    doc.append(args.page);

                    if (pageNum < totalPages) {
                        dataSource.page(pageNum + 1);
                    } else {
                        resolve();
                    }
                })
                .fail(function(err) {
                    result.reject(err);
                });
            }

            if (allPages) {
                dataSource.bind("change", exportPage);
                dataSource.page(1);
            } else {
                exportPage();
            }

            return result.promise();
        };

        TreeList.prototype._initPDFProgress = function(deferred) {
            var loading = $("<div class='k-loading-pdf-mask'><div class='k-loading-color'></div></div>");
            loading.prepend(this.wrapper.clone().css({
                position: "absolute", top: 0, left: 0
            }));

            this.wrapper.append(loading);

            var progressBar = $("<div class='k-loading-pdf-progress'>")
                .appendTo(loading)
                .kendoProgressBar({
                    type: "chunk",
                    chunkCount: 10,
                    min: 0,
                    max: 1,
                    value: 0
                }).data("kendoProgressBar");

            deferred.progress(function(e) {
                progressBar.value(e.progress);
            })
            .always(function() {
                kendo.destroy(loading);
                loading.remove();
            });
        };

        TreeList.prototype._drawPDF_autoPageBreak = function(progress) {
            var treeList = this;
            var result = new $.Deferred();
            var dataSource = treeList.dataSource;
            var allPages = treeList.options.pdf.allPages;
            var origBody = treeList.wrapper.find('table[role="treeList"] > tbody');
            var cont = $("<div>")
                .css({ position: "absolute", left: -10000, top: -10000 });
            var clone = treeList.wrapper.clone().css({
                height: "auto", width: "auto"
            }).appendTo(cont);
            clone.find(".k-grid-content").css({ height: "auto", width: "auto", overflow: "visible" });
            clone.find('table[role="treeList"], .k-grid-footer table').css({ height: "auto", width: "100%", overflow: "visible" });
            clone.find(".k-grid-pager, .k-grid-toolbar, .k-grouping-header").remove();
            clone.find(".k-grid-header, .k-grid-footer").css({ paddingRight: 0 });

            this._initPDFProgress(progress);

            var body = clone.find('table[role="treeList"] > tbody').empty();
            var startingPage = dataSource.page();

            function resolve() {
                if (allPages && startingPage !== undefined$1) {
                    dataSource.one("change", draw);
                    dataSource.page(startingPage);
                } else {
                    treeList.refresh();
                    draw();
                }
            }

            function draw() {
                cont.appendTo(document.body);
                var options = $.extend({}, treeList.options.pdf, {
                    _destructive: true,
                    progress: function(p) {
                        progress.notify({
                            page: p.page,
                            pageNumber: p.pageNum,
                            progress: 0.5 + p.pageNum / p.totalPages / 2,
                            totalPages: p.totalPages
                        });
                    }
                });
                kendo.drawing.drawDOM(clone, options)
                    .always(function() {
                        cont.remove();
                    })
                    .then(function(group) {
                        result.resolve(group);
                    })
                    .fail(function(err) {
                        result.reject(err);
                    });
            }

            function renderPage() {
                var pageNum = dataSource.page();
                var totalPages = allPages ? dataSource.totalPages() : 1;
                body.append(origBody.find("tr"));
                if (pageNum < totalPages) {
                    dataSource.page(pageNum + 1);
                } else {
                    dataSource.unbind("change", renderPage);
                    resolve();
                }
            }

            if (allPages) {
                dataSource.bind("change", renderPage);
                dataSource.page(1);
            } else {
                renderPage();
            }

            return result.promise();
        };
    }

    extend(true, kendo.data, {
        TreeListDataSource: TreeListDataSource,
        TreeListModel: TreeListModel
    });

    extend(kendo.ui.treelist, {
        editor: Editor,
        defaultBodyContextMenu: defaultBodyContextMenu,
        defaultHeadContextMenu: defaultHeadContextMenu,
    });

    ui.plugin(TreeList);
    ui.plugin(TreeListPager);

})(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
