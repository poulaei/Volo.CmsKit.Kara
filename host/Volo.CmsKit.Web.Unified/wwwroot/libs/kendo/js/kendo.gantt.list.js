require('./kendo.treelist.js');
require('./kendo.treeview.draganddrop.js');

var __meta__ = {
    id: "gantt.list",
    name: "Gantt List",
    category: "web",
    description: "The Gantt List",
    depends: [ "treelist", "treeview.draganddrop" ],
    hidden: true
};

(function($) {
    var extend = $.extend,
        map = $.map,
        isFunction = kendo.isFunction,

        ui = kendo.ui,
        TreeList = ui.TreeList,
        outerHeight = kendo._outerHeight,
        activeElement = kendo._activeElement,
        mobileOS = kendo.support.mobileOS,

        DATATYPE = kendo.attr("type"),
        BINDING = kendo.attr("bind"),
        FORMAT = kendo.attr("format"),

        STRING = "string",
        BEFORE_EDIT = "beforeEdit",
        EDIT = "edit",
        SAVE = "save",
        RENDER = "render",
        DOT = ".",

        defaultDateFormat = "{0:" + kendo.getCulture().calendar.patterns.d + "}",

        titleFromField = {
            "title": "Title",
            "start": "Start Time",
            "end": "End Time",
            "percentComplete": "% Done",
            "parentId": "Predecessor ID",
            "id": "ID",
            "orderId": "Order ID"
        },

        SIZE_CALCULATION_TEMPLATE = `<table ${kendo.attr("style-visibility")}="hidden">` +
            "<tbody>" +
                `<tr ${kendo.attr("style-height")}="{0}">` +
                    "<td>&nbsp;</td>" +
                "</tr>" +
            "</tbody>" +
        "</table>",

        listStyles = {
            gridHeader: "k-grid-header",
            gridContentWrap: "k-grid-content",
            editCell: "k-edit-cell",
            iconCollapse: "caret-alt-down",
            iconExpand: "caret-alt-right"
        };

    var GanttList = ui.GanttList = TreeList.extend({
        init: function(element, options) {
            if (this.options.columns.length === 0) {
                this.options.columns.push("title");
            }

            TreeList.fn.init.call(this, element, options);

            this._unbindDataSource();
            this._setWidth();
        },

        options: {
            name: "GanttList",
            autoBind: false,
            sortable: true,
            selectable: true,
            _editCellEvent: "dblclick",
            _tabCycleStop: true,
            navigatable: false,
            editable: {
                move: true,
                mode: "incell"
            },
            resizable: false,
            renderAllRows: false
        },

        destroy: function() {
            TreeList.fn.destroy.call(this);
            kendo.destroy(this.element);
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
            that._cancelEditor();
            cell.removeClass(listStyles.editCell);
            tr = cell.parent().removeClass(listStyles.editRow);

            if (that.lockedContent) {
                that._relatedRow(tr).removeClass(listStyles.editRow);
            }

            if (isCancel) {
                that._render();
            }

            that.trigger("itemChange", { item: tr, data: model, ns: ui });

            if (that.lockedContent) {
                that._adjustRowHeight(tr.css("height", "")[0], that._relatedRow(tr).css("height", "")[0]);
            }
        },

        insertAfter: function(nodeData, referenceNode) {
            if (!nodeData || !referenceNode) {
                return;
            }

            var orderId = referenceNode.orderId;
            var taskInfo = {
                parentId: referenceNode.parentId
            };

            if (referenceNode.parentId === nodeData.parentId && referenceNode.orderId > nodeData.orderId) {
                taskInfo.orderId = orderId;
            } else {
                taskInfo.orderId = orderId + 1;
            }

            this.trigger("reorder", {
                task: nodeData,
                updateInfo: taskInfo
            });
        },

        insertBefore: function(nodeData, referenceNode) {
            if (!nodeData || !referenceNode) {
                return;
            }

            var orderId = referenceNode.orderId;
            var taskInfo = {
                parentId: referenceNode.parentId
            };

            if (referenceNode.parentId === nodeData.parentId &&
                referenceNode.orderId > nodeData.orderId) {
                    taskInfo.orderId = orderId - 1;
            } else {
                taskInfo.orderId = orderId;
            }

            this.trigger("reorder", {
                task: nodeData,
                updateInfo: taskInfo
            });
        },

        _adjustHeight: function() {
            var element = this.element;
            var contentWrap = element.find(DOT + listStyles.gridContentWrap);
            var header = element.find(DOT + listStyles.gridHeader);
            var height;
            var scrollbar = kendo.support.scrollbar();

            if (this._isHeightSet(element)) {
                height = element.height() - outerHeight(header);

                contentWrap.height(height);

                if (this._hasLockedColumns) {
                    scrollbar = this.table[0].offsetWidth > this.table.parent()[0].clientWidth ? scrollbar : 0;
                    this.lockedContent.height(height - scrollbar);
                }
            }
        },

        _adjustRowHeight: function(row1, row2) {
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
         },

        // identical code found in treelist, grid & scheduler :(
        _isHeightSet: function(el) {
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
        },

        _attachCellEditingEventHandlers: function() {
            var that = this,
                editable = that.options.editable;

            TreeList.fn._attachCellEditingEventHandlers.call(that);

            if (that._isIncellEditable() && editable.update !== false) {

                if (mobileOS) {
                    that.touch = that.content
                        .kendoTouch({
                            filter: "td",
                            touchstart: function(e) {
                                that._mouseDownHandler(e.touch);
                            },
                            doubletap: function(e) {
                                if (e.event.target.classList.contains("k-icon") || e.event.target.classList.contains("k-svg-icon")) {
                                    return;
                                }
                                that._openEditorHandler(e.touch);
                            }
                        }).data("kendoTouch");
                }
            }
        },

        _blurActiveElement: function() {
            var activeElement = kendo._activeElement();

            if (activeElement && activeElement.nodeName.toLowerCase() !== "body") {
                $(activeElement).trigger("blur");
            }
        },

        _columns: function() {
            var that = this,
                columns = this.options.columns;

            that._hasExpandable = false;

            columns.forEach(function(item) {
                if (item.expandable) {
                    that._hasExpandable = true;
                }
            });

            that.columns = that.options.columns = map(columns, that._eachColumn.bind(that));

            TreeList.fn._columns.call(that);
        },

        _columnEditor: function(column) {
            var attr = {
                "name": column.field,
                "required": true
            };

            attr[BINDING] = "value:" + column.field;
            attr[DATATYPE] = "date";
            attr[FORMAT] = kendo._extractFormat(column.format);

            return function(container, options) {
                var model = options.model,
                    field = model.fields[column.field] || model[column.field],
                    validation = field.validation;

                if (validation && validation.dateCompare && isFunction(validation.dateCompare) && validation.message) {
                    $('<span ' + kendo.attr("for") + '="' + column.field + '" class="k-invalid-msg"/>')
                        .hide()
                        .appendTo(container);

                    attr[kendo.attr("dateCompare-msg")] = validation.message;
                }

                $('<input type="text"/>')
                    .attr(attr)
                    .prependTo(container)
                    .kendoDateTimePicker({ format: options.format });
            };
        },

        _columnFromElement: function(element) {
            var td = element.closest("td"),
                tr = td.parent(),
                idx = tr.children().index(td);

            return this.columns[idx];
        },

        _eachColumn: function(column) {
            var that = this,
                resourcesField = that.options.resourcesField,
                isSortable = this.options.sortable;

            var model = function() {
                this.field = "";
                this.title = "";
                this.editable = function() { return false; };
                this.sortable = false;
            };

            var formatResources = function(task) {
                var value = task.get(resourcesField) || [],
                    formatedValue = [];

                for (var i = 0; i < value.length; i++) {
                    formatedValue.push(kendo.format("{0} [{1}]", value[i].get("name"), value[i].get("formatedValue")));
                }

                return formatedValue.join(", ");
            };

            if (column.columns) {
                that.hasNestedColumns = true;
                column.columns = map(column.columns, this._eachColumn.bind(this));
            }

            if (typeof column === STRING) {
                column = {
                    field: column,
                    title: titleFromField[column]
                };
            }

            if (column.editable === true) {
                column.editable = function() {
                    return true;
                };
            } else {
                column.editable = function() {
                    return false;
                };
            }

            if (column.field === "start" || column.field === "end") {
                column.format = kendo.getCulture().calendar.patterns[column.format] || column.format || defaultDateFormat;

                if (!column.editor) {
                    if (column.format === defaultDateFormat || column.format.toLowerCase().indexOf("h") > -1) {
                        column.editor = that._columnEditor(column);
                    }
                }
            }
            if (column.field === resourcesField) {
                column.sortable = false;
                column.template = column.template || formatResources;
            }
            if (!that._hasExpandable && column.field === "title") {
                column.expandable = true;
            }

            if (isSortable && !column.sortable) {
                column.sortable = false;
            }

            return extend(new model(), column);
        },

        _editCell: function(cell, column, model) {
            var that = this,
                resourcesField = that.options.resourcesField,
                modelCopy = that.dataSource._createNewModel(model.toJSON()),
                editedCell;

            clearTimeout(that._closeCellTimeout);
            if (column.field === resourcesField) {
                column.editor(cell, modelCopy);
                return;
            } else {
                if (that.trigger(BEFORE_EDIT, { model: model, container: cell })) {
                    that.dataSource._restorePageSizeAfterAddChild();
                    return;
                }

                that.closeCell();

                model._edit = true;

                that._cancelEditor();

                that._render({
                    editedColumn: column,
                    editedColumnIndex: cell.index()
                });

                editedCell = that.table.add(that.lockedTable).find(DOT + listStyles.editCell).first();

                that.editor = that._createIncellEditor(editedCell, {
                    columns: [column],
                    model: model,
                    change: function(e) {
                        if (that.trigger(SAVE, { values: e.values, container: cell, model: model } )) {
                            e.preventDefault();
                        }
                    }
                });

                // refresh the current element as the DOM element reference can be changed after render()
                that._current = editedCell;

                that.trigger(EDIT, { container: cell, model: model });
            }
        },

        _modelFromElement: function(element) {
            var row = element.closest("tr"),
                model = this.dataSource.getByUid(row.attr(kendo.attr("uid")));

            return model;
        },

        _mouseDownHandler: function(e) {
            var currentTarget = $(e.currentTarget);

            if (!currentTarget.hasClass(listStyles.editCell)) {
                this._blurActiveElement();
            }
        },

        _openEditorHandler: function(e) {
            var that = this,
                td = $(e.currentTarget),
                isLockedCell = that.lockedTable && td.closest("table")[0] === that.lockedTable[0],
                selectable = that.selectable && that.selectable.options.multiple;

            if (td.hasClass(listStyles.editCell) ||
                td.has("a.k-grid-delete").length ||
                td.has("button.k-grid-delete").length ||
                (td.closest("tbody")[0] !== that.tbody[0] && !isLockedCell) ||
                $(e.target).is(":input") ||
                $(e.target).is(`[class*=${listStyles.iconExpand}]`) ||
                $(e.target).is(`[class*=${listStyles.iconCollapse}]`)) {

                return;
            }

            if (that.editor) {
                if (that.editor.end()) {
                    if (selectable) {
                        $(activeElement()).trigger("blur");
                    }
                    that.closeCell();
                    that.editCell(td);
                }
            } else {
                that.editCell(td);
            }
        },

        _renderTree: function(taskTree) {
            TreeList.fn._render.call(this);

            if (this.hasNestedColumns) {
                this.element.addClass("k-gantt-treelist-nested-columns");
            }

            if (taskTree && taskTree.length && !taskTree.editedColumn) {
                if (this.options.rowHeight) {
                    this._rowHeight(taskTree);
                }

                this.trigger(RENDER);
            }

            this._adjustHeight();
        },

        _rowHeight: function(tasks) {
            var content = this.content,
                options = this.options,
                rowHeight = typeof options.rowHeight === STRING ? options.rowHeight : options.rowHeight + "px",
                table = $(kendo.format(SIZE_CALCULATION_TEMPLATE, rowHeight)),
                height;

            kendo.applyStylesFromKendoAttributes(table, ["height", "visibility"]);
            content.append(table);
            height = outerHeight(table.find("tr"));
            table.remove();

            this.element.find('[role="treegrid"]').css("height", (tasks.length * height) + "px");
        },

        _setData: function(tasks) {
            this.dataSource.data(tasks);
        },

        _setWidth: function() {
            this.element.find(".k-grid-header table").css("minWidth", this.options.listWidth);
            this.content.find("table").css("minWidth", this.options.listWidth);
        }
    });

    ui.plugin(GanttList);

})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
