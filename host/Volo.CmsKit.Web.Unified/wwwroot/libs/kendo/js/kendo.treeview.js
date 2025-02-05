require('./kendo.data.js');
require('./kendo.treeview.draganddrop.js');
require('./kendo.html.input.js');
require('./kendo.icons.js');

var __meta__ = {
    id: "treeview",
    name: "TreeView",
    category: "web",
    description: "The TreeView widget displays hierarchical data in a traditional tree structure,with support for interactive drag-and-drop operations.",
    depends: [ "data", "html.input", "icons" ],
    features: [{
        id: "treeview-dragging",
        name: "Drag & Drop",
        description: "Support for drag & drop",
        depends: [ "treeview.draganddrop" ]
    }]
};

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui,
        data = kendo.data,
        encode = kendo.htmlEncode,
        extend = $.extend,
        template = kendo.template,
        isArray = Array.isArray,
        Widget = ui.Widget,
        HierarchicalDataSource = data.HierarchicalDataSource,
        keys = kendo.keys,
        NS = ".kendoTreeView",
        TEMP_NS = ".kendoTreeViewTemp",
        SELECT = "select",
        CHECK = "check",
        NAVIGATE = "navigate",
        EXPAND = "expand",
        CHANGE = "change",
        ERROR = "error",
        CHECKED = "checked",
        INDETERMINATE = "indeterminate",
        COLLAPSE = "collapse",
        DRAGSTART = "dragstart",
        DRAG = "drag",
        DROP = "drop",
        DRAGEND = "dragend",
        DATABOUND = "dataBound",
        ITEMSLOADED = "itemsLoaded",
        LOADCOMPLETED = "loadCompleted",
        REQUESTEND = "requestEnd",
        CLICK = "click",
        KENDOKEYDOWN = "kendoKeydown",
        UNDEFINED = "undefined",
        KSTATEHOVER = "k-hover",
        KTREEVIEW = "k-treeview",
        VISIBLE = ":visible",
        NODE = ".k-treeview-item",
        ICON = "k-icon",
        TOGGLE_ICON_ELM = `<span></span>`,
        STRING = "string",
        ARIA_CHECKED = "aria-checked",
        ARIA_SELECTED = "aria-selected",
        ARIA_DISABLED = "aria-disabled",
        ARIA_EXPANDED = "aria-expanded",
        ARIA_ACTIVEDESCENDANT = "aria-activedescendant",
        ARIA_BUSY = "aria-busy",
        DISABLED = "k-disabled",
        TreeView,
        subGroup, nodeContents, nodeIcon,
        spriteRe,
        bindings = {
            text: "dataTextField",
            url: "dataUrlField",
            spriteCssClass: "dataSpriteCssClassField",
            imageUrl: "dataImageUrlField"
        },
        isJQueryInstance = function(obj) {
            return (obj instanceof kendo.jQuery) || (window.jQuery && obj instanceof window.jQuery);
        },
        isDomElement = function(o) {
            return (
                typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === STRING
            );
        };

    function contentChild(filter) {
        return function(node) {
            var result = node.children(".k-animation-container");

            if (!result.length) {
                result = node;
            }

            return result.children(filter);
        };
    }

    function templateNoWith(code) {
        return kendo.template(code, { useWithBlock: false });
    }

    subGroup = contentChild(".k-treeview-group");
    nodeContents = contentChild(".k-treeview-group,.k-content");
    nodeIcon = function(node) {
        return node.children("div").find(`.k-treeview-toggle > span:first`);
    };

    function checkboxes(node) {
         return node.find(".k-checkbox-wrap:first input[type=checkbox]");
    }

    function insertAction(indexOffset) {
        return function(nodeData, referenceNode) {
            referenceNode = referenceNode.closest(NODE);

            var group = referenceNode.parent(),
                parentNode;

            if (group.parent().is("li")) {
                parentNode = group.parent();
            }

            return this._dataSourceMove(nodeData, group, parentNode, function(dataSource, model) {
                var referenceItem = this.dataItem(referenceNode);
                var referenceNodeIndex = referenceItem && referenceNode.parent().children().length !== referenceItem.parent().length ? referenceItem.parent().indexOf(referenceItem) : referenceNode.index();

                return this._insert(dataSource.data(), model, referenceNodeIndex + indexOffset);
            });
        };
    }

    spriteRe = /k-sprite/;

    function moveContents(node, container) {
        var tmp;

        while (node && node.nodeName.toLowerCase() != "ul") {
            tmp = node;
            node = node.nextSibling;

            if (tmp.nodeType == 3) {
                tmp.nodeValue = kendo.trim(tmp.nodeValue);
            }

            if (spriteRe.test(tmp.className)) {
                container.insertBefore(tmp, container.firstChild);
            } else {
                container.appendChild(tmp);
            }
        }
    }

    function updateNodeHtml(node) {
        var wrapper = node.children("div"),
            group = node.children("ul"),
            toggleButton = wrapper.find(`.k-treeview-toggle > span`),
            checkbox = node.children("input[type=checkbox]"),
            innerWrapper = wrapper.children(".k-treeview-leaf");

        if (node.hasClass("k-treeview")) {
            return;
        }

        if (!wrapper.length) {
            wrapper = $("<div />").prependTo(node);
        }

        if (!toggleButton.length && group.length) {
            toggleButton = $(`<span class='k-treeview-toggle'>${TOGGLE_ICON_ELM}</span>`).prependTo(wrapper);
        } else if (!group.length || !group.children().length) {
            toggleButton.parent().remove();
            group.remove();
            node.removeAttr(ARIA_EXPANDED);
        }

        if (checkbox.length) {
            $("<span class='k-checkbox-wrap' />").appendTo(wrapper).append(checkbox);
        }

        if (!innerWrapper.length) {
            innerWrapper = node.children("a").eq(0).addClass("k-treeview-leaf k-link");

            if (!innerWrapper.length) {
                innerWrapper = $("<span class='k-treeview-leaf' />");
            }

            innerWrapper.appendTo(wrapper);

            if (wrapper.length) {
                moveContents(wrapper[0].nextSibling, innerWrapper[0]);
            }
        }
    }

    TreeView = kendo.ui.DataBoundWidget.extend({
        init: function(element, options) {
            var that = this,
                inferred = false,
                hasDataSource = options && !!options.dataSource,
                list;

            if (isArray(options)) {
                options = { dataSource: options };
            }

            if (options && typeof options.loadOnDemand == UNDEFINED && isArray(options.dataSource)) {
                options.loadOnDemand = false;
            }

            Widget.prototype.init.call(that, element, options);

            element = that.element;
            options = that.options;

            that._dataSourceUids = {};

            list = (element.is("ul") && element) ||
                   (element.hasClass(KTREEVIEW) && element.children("ul"));

            inferred = !hasDataSource && list.length;

            if (inferred) {
                options.dataSource.list = list;
            }

            that._animation();

            that._accessors();

            that._templates();

            // render treeview if it's not already rendered
            if (!element.hasClass(KTREEVIEW)) {
                that._wrapper();

                if (list) {
                    that.root = element;
                    that._group(that.wrapper);
                }
            } else {
                // otherwise just initialize properties
                that.wrapper = element;
                that.root = element.children("ul").eq(0);
            }

            that._applyCssClasses();
            that._tabindex();

            that.wrapper.find(">ul").attr("role", "tree");

            that._dataSource(inferred);

            that._attachEvents();

            that._dragging();

            if (!inferred) {
                if (options.autoBind) {
                    that._progress(true);
                    that.dataSource.fetch(this._attemptLoadCompleted.bind(this));
                }
            } else {
                that._syncHtmlAndDataSource();
            }

            if (options.checkboxes && options.checkboxes.checkChildren) {
                that.updateIndeterminate();
            }

            if (that.element[0].id) {
                that._ariaId = kendo.format("{0}_tv_active", that.element[0].id);
            } else {
                that._ariaId = kendo.guid() + "_tv_active";
            }

            kendo.notify(that);
        },

        _attachEvents: function() {
            var that = this,
                clickableItems = ".k-treeview-leaf:not(.k-selected,.k-disabled)",
                MOUSEENTER = "mouseenter";

            that._clickHandler = that._click.bind(that);

            that.wrapper
                .on(MOUSEENTER + NS, ".k-treeview-leaf.k-selected", function(e) { e.preventDefault(); })
                .on(MOUSEENTER + NS, clickableItems, function() { $(this).addClass(KSTATEHOVER); })
                .on("mouseleave" + NS, clickableItems, function() { $(this).removeClass(KSTATEHOVER); })
                .on(CLICK + NS, clickableItems, that._clickHandler)
                .on("dblclick" + NS, ".k-treeview-leaf:not(.k-disabled)", that._toggleButtonClick.bind(that))
                .on(CLICK + NS, `.k-treeview-toggle .${ICON}`, that._toggleButtonClick.bind(that))
                .on("keydown" + NS, that, that._keydown.bind(that))
                .on("keypress" + NS, that._keypress.bind(that))
                .on("focus" + NS, that._focus.bind(that))
                .on("blur" + NS, that._blur.bind(that))
                .on("mousedown" + NS, `.k-treeview-leaf,.k-checkbox-wrap :checkbox,.k-treeview-toggle .${ICON}`, that._mousedown.bind(that))
                .on("change" + NS, ".k-checkbox-wrap :checkbox", that._checkboxChange.bind(that))
                .on("click" + NS, ".k-request-retry", that._retryRequest.bind(that))
                .on("click" + NS, ".k-link.k-disabled", function(e) { e.preventDefault(); })
                .on("click" + NS, function(e) {
                    var target = $(e.target);

                    if (!target.is(":kendoFocusable") && !target.find("input,select,textarea,button,object").is(":kendoFocusable")) {
                        that.focus();
                    }
                });
        },

        _syncHtmlAndDataSource: function(root, dataSource) {
            root = root || this.root;
            dataSource = dataSource || this.dataSource;
            var data = dataSource.view(),
                uidAttr = kendo.attr("uid"),
                expandedAttr = kendo.attr("expanded"),
                checkboxesEnabled = this.options.checkboxes,
                items = root.children("li"),
                i,
                item,
                dataItem,
                uid,
                itemCheckbox;

            for (i = 0; i < items.length; i++) {
                dataItem = data[i];
                uid = dataItem.uid;
                item = items.eq(i);
                item.attr("role", "treeitem")
                    .attr(uidAttr, uid)
                    .attr(ARIA_SELECTED, item.hasClass("k-selected"));

                dataItem.expanded = item.attr(expandedAttr) === "true";

                if (dataItem.hasChildren) {
                    item.attr(ARIA_EXPANDED, dataItem.expanded);
                }

                if (checkboxesEnabled) {
                    itemCheckbox = checkboxes(item);
                    dataItem.checked = itemCheckbox.prop(CHECKED);
                    itemCheckbox.attr("id", "_" + uid);
                    itemCheckbox.next(".k-checkbox-label").attr("for", "_" + uid);

                    item.attr(ARIA_CHECKED, item.checked);
                }

                this._syncHtmlAndDataSource(item.children("ul"), dataItem.children);
            }
        },

        _animation: function() {
            var options = this.options,
                animationOptions = options.animation,
                hasCollapseAnimation = animationOptions.collapse && "effects" in animationOptions.collapse,
                collapse = extend({}, animationOptions.expand, animationOptions.collapse);

            if (!hasCollapseAnimation) {
                collapse = extend(collapse, { reverse: true });
            }

            if (animationOptions === false) {
                animationOptions = {
                    expand: { effects: {} },
                    collapse: { hide: true, effects: {} }
                };
            }

            animationOptions.collapse = extend(collapse, { hide: true });
            options.animation = animationOptions;
        },

        _dragging: function() {
            var enabled = this.options.dragAndDrop;
            var dragging = this.dragging;

            if (enabled && !dragging) {
                var widget = this;

                this.dragging = new ui.HierarchicalDragAndDrop(this.element, {
                    reorderable: true,
                    autoScroll: this.options.autoScroll,
                    filter: "div:not(.k-disabled) .k-treeview-leaf",
                    allowedContainers: ".k-treeview",
                    itemSelector: ".k-treeview .k-treeview-item",
                    hintText: this._hintText.bind(this),
                    clickMoveClick: this.options.dragAndDrop.clickMoveClick === true ? true : false,
                    contains: function(source, destination) {
                        return $.contains(source, destination);
                    },
                    dropHintContainer: function(item) {
                        return item;
                    },
                    itemFromTarget: function(target) {
                        var item = target.closest(".k-treeview-top,.k-treeview-mid,.k-treeview-bot");
                        return {
                            item: item,
                            content: target.closest(".k-treeview-leaf"),
                            first: item.hasClass("k-treeview-top"),
                            last: item.hasClass("k-treeview-bot")
                        };
                    },
                    dropPositionFrom: function(dropHint) {
                        return dropHint.prevAll(".k-treeview-leaf").length > 0 ? "after" : "before";
                    },
                    dragstart: function(source) {
                        widget.wrapper.attr(kendo.attr("scrollable"), false);
                        return widget.trigger(DRAGSTART, { sourceNode: source[0] });
                    },
                    drag: function(options) {
                        widget.trigger(DRAG, {
                            originalEvent: options.originalEvent,
                            sourceNode: options.source[0],
                            dropTarget: options.target[0],
                            pageY: options.pageY,
                            pageX: options.pageX,
                            statusClass: options.status,
                            setStatusClass: options.setStatus
                        });
                    },
                    drop: function(options) {
                        var dropTarget = $(options.dropTarget);
                        var navigationTarget = dropTarget.closest("a");

                        if (navigationTarget && navigationTarget.attr("href")) {
                            widget._tempPreventNavigation(navigationTarget);
                        }

                        return widget.trigger(DROP, {
                            originalEvent: options.originalEvent,
                            sourceNode: options.source,
                            destinationNode: options.destination,
                            valid: options.valid,
                            setValid: function(state) {
                                this.valid = state;
                                options.setValid(state);
                            },
                            dropTarget: options.dropTarget,
                            dropPosition: options.position
                        });
                    },
                    dragend: function(options) {
                        var source = options.source;
                        var destination = options.destination;
                        var position = options.position;

                        widget.wrapper.removeAttr(kendo.attr("scrollable"));

                        function triggerDragEnd(source) {
                            if (widget.options.checkboxes && widget.options.checkboxes.checkChildren) {
                                widget.updateIndeterminate();
                            }

                            widget.current(source);
                            widget.element.focus();

                            widget.trigger(DRAGEND, {
                                originalEvent: options.originalEvent,
                                sourceNode: source && source[0],
                                destinationNode: destination[0],
                                dropPosition: position
                            });
                        }

                        // perform reorder / move
                        // different handling is necessary because append might be async in remote bound tree
                        if (position == "over") {
                            widget.append(source, destination, triggerDragEnd);
                        } else {
                            if (position == "before") {
                                source = widget.insertBefore(source, destination);
                            } else if (position == "after") {
                                source = widget.insertAfter(source, destination);
                            }

                            triggerDragEnd(source);
                        }
                    }
                });
            } else if (!enabled && dragging) {
                dragging.destroy();
                this.dragging = null;
            }
        },

        _tempPreventNavigation: function(node) {
            node.on(CLICK + NS + TEMP_NS, function(ev) {
                ev.preventDefault();
                node.off(CLICK + NS + TEMP_NS);
            });
        },

        _hintText: function(node) {
            return this.templates.dragClue({
                item: this.dataItem(node),
                treeview: this.options
            });
        },

        _templates: function() {
            var that = this,
                options = that.options,
                fieldAccessor = that._fieldAccessor.bind(that);

            if (options.template && typeof options.template == STRING) {
                options.template = template(options.template);
            } else if (!options.template) {
                options.template = ({ item }) => {
                    var text = fieldAccessor("text")(item);

                    if (typeof item.encoded != 'undefined' && item.encoded === false) {
                        return `<span class='k-treeview-leaf-text'>${text}</span>`;
                    }

                    return `<span class='k-treeview-leaf-text'>${encode(text)}</span>`;
                };
            }

            that._checkboxes();

            that.templates = {
                setAttributes: function(item) {
                    var result = "";
                    var attributes = item.attr || {};

                    for (var attr in attributes) {
                        if (attributes.hasOwnProperty(attr) && attr !== "class") {
                            result += attr + "=\"" + attributes[attr] + "\" ";
                        }
                    }

                    return result;
                },
                cssClass: function(group, item) {
                    var result = "",
                        index = item.index,
                        groupLength = group.length - 1;

                    if (group.firstLevel && index === 0) {
                        result += "k-treeview-top ";
                    }

                    if (index === 0 && index != groupLength) {
                        result += (result.indexOf("k-treeview-top") != -1) ? "" : "k-treeview-top";
                    } else if (index == groupLength) {
                        result += "k-treeview-bot";
                    } else {
                        result += "k-treeview-mid";
                    }

                    return result;
                },
                textClass: function(item, isLink) {
                    var result = "k-treeview-leaf";

                    if (isLink) {
                        result += " k-link";
                    }

                    if (item.enabled === false) {
                        result += " k-disabled";
                    }

                    if (item.selected === true) {
                        result += " k-selected";
                    }

                    return result;
                },
                checkboxClass: function(item) {
                    var result = "k-checkbox";

                    if (item.enabled === false) {
                        result += " k-disabled";
                    }

                    return result;
                },
                toggleButtonClass: function(item) {
                    var result = "k-treeview-toggle";

                    if (item.enabled === false) {
                        result += " k-disabled";
                    }

                    return result;
                },
                toggleIcon: function(icon, item) {
                    if (item.expanded !== true) {
                        return ui.icon(icon, { icon: `caret-alt-${kendo.support.isRtl(that.element) ? 'left' : 'right'}` });
                    } else {
                        return ui.icon(icon, { icon: 'caret-alt-down' });
                    }
                },
                groupAttributes: function(group) {
                    var attributes = "";

                    if (!group.firstLevel) {
                        attributes = "role='group'";
                    }

                    return attributes + (group.expanded !== true ? ` ${kendo.attr("style-display")}="none"` : "");
                },
                groupCssClass: function(group) {
                    var cssClass = "k-treeview-group";

                    if (group.firstLevel) {
                        cssClass += " k-treeview-lines";
                    }

                    return cssClass;
                },
                dragClue: (data) => data.treeview.template(data),
                group: (data) =>
                `<ul class='${data.r.groupCssClass(data.group)}'${data.r.groupAttributes(data.group)}>` +
                    data.renderItems(data) +
                `</ul>`,
                itemContent: (data) => {
                    var imageUrl = fieldAccessor("imageUrl")(data.item);
                    var spriteCssClass = fieldAccessor("spriteCssClass")(data.item);
                    var result = "";

                    if (imageUrl) {
                        result += `<img class='k-image' alt='' src='${imageUrl}'>`;
                    }

                    if (spriteCssClass) {
                        result += `<span class='k-sprite ${spriteCssClass}'></span>`;
                    }

                    result += data.treeview.template(data);

                    return result;
                },
                itemElement: (data) => {
                    var that = this,
                        item = data.item,
                        r = data.r;
                    var url = fieldAccessor("url")(item),
                        tag = url ? 'a' : 'span',
                        textAttr = url ? ' href="' + url + '"' : '';
                    var result = `<div class="${r.cssClass(data.group, item)}">`;

                    if (item.hasChildren) {
                        result += `<span class='${r.toggleButtonClass(item)}'>` +
                                    r.toggleIcon($(TOGGLE_ICON_ELM), item) +
                                  `</span>`;
                    }

                    if (data.treeview.checkboxes) {
                        result += `<span class='k-checkbox-wrap' role='presentation'>` +
                                    data.treeview.checkboxes.template(data) +
                                  `</span>`;
                    }

                    result += `<${tag} class='${r.textClass(item, !!url)}'${textAttr}>` +
                                 r.itemContent(data) +
                              `</${tag}>`;

                    result += "</div>";

                    return result;
                },
                item: (data) => {
                    var item = data.item,
                        r = data.r;
                    var result =
                        `<li role='treeitem' class="k-treeview-item"` +
                        `${kendo.attr("uid")}="${item.uid}"` +
                        `${r.setAttributes(item.toJSON ? item.toJSON() : item)} `;

                    if (data.treeview.checkboxes) {
                        result +=
                            `aria-checked="${item.checked ? 'true' : 'false'}" `;
                    }

                    result +=
                        `aria-selected="${item.selected ? 'true' : 'false'}" ` +
                            `${item.enabled === false ? 'aria-disabled="true"' : ''}`;

                    if (item.hasChildren) {
                        result += `aria-expanded="${item.expanded ? "true" : "false"}" `;
                    }

                    result +=
                        `data-expanded="${item.expanded ? "true" : "false"}" >` +
                        r.itemElement(data) +
                        `</li>`;

                    return result;
                },
                loading: ({ messages }) =>
                    `<div class='k-icon k-i-loading'></div> ${encode(messages.loading)}`,
                retry: ({ messages }) =>
                    `${encode(messages.requestFailed)} ` +
                    `<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-request-retry'><span class='k-button-text'>${encode(messages.retry)}</span></button>`
            };
        },

        items: function() {
            return this.element.find(".k-treeview-item > div:first-child");
        },

        setDataSource: function(dataSource) {
            var options = this.options;

            options.dataSource = dataSource;

            this._dataSourceUids = {};

            this._dataSource();

            if (options.checkboxes && options.checkboxes.checkChildren) {
                this.dataSource.one("change", this.updateIndeterminate.bind(this, null));
            }

            if (this.options.autoBind) {
                this.dataSource.fetch(this._attemptLoadCompleted.bind(this));
            }
        },

        _bindDataSource: function() {
            var that = this;

            that._refreshHandler = that.refresh.bind(that);
            that._errorHandler = that._error.bind(that);
            that._loadCompletedHandler = that._loadCompleted.bind(that);
            that._requestEndHandler = that._dsRequestEnd.bind(that);
            that._loadedNodes = [];

            that.dataSource.bind(CHANGE, that._refreshHandler);
            that.dataSource.bind(ERROR, that._errorHandler);

            that.dataSource.bind(ITEMSLOADED, that._loadCompletedHandler);
            that.dataSource.bind(REQUESTEND, that._requestEndHandler);
        },

        _dsRequestEnd: function(e) {
            var that = this;

            setTimeout(function() {
                if (e.type === "read" && !that._loadCompletedFired) {
                    that._attemptLoadCompleted();
                }
            });
        },

        _loadCompleted: function(e) {
            var that = this;
            that._loadedNodes = that._loadedNodes.concat(e.nodes);

            if (!that.dataSource.loading() && that.options.loadOnDemand === false) {
                that.trigger(LOADCOMPLETED, { nodes: that._loadedNodes });
                that._loadedNodes = [];
            }
        },

        _attemptLoadCompleted: function() { // If there are no items to be loaded ensure event is triggered on dataBound
            var that = this,
                items = that.dataSource.view(),
                current, i;

            if (that.options.loadOnDemand === false) {
                for (i = 0; i < items.length; i++) {
                    current = items[i];
                    if (current.hasChildren && (!current.children || !current.children.data() || current.children.data().length === 0)) {
                        return;
                    }
                }

                that._loadCompletedFired = true;
                that.trigger(LOADCOMPLETED, { nodes: [] });
            }
        },

        _unbindDataSource: function() {
            var dataSource = this.dataSource;

            if (dataSource) {
                dataSource.unbind(CHANGE, this._refreshHandler);
                dataSource.unbind(ERROR, this._errorHandler);
                dataSource.unbind(ITEMSLOADED, this._loadCompletedHandler);
                dataSource.unbind(REQUESTEND, this._requestEndHandler);
            }
        },

        _dataSource: function(silentRead) {
            var that = this,
                options = that.options,
                dataSource = options.dataSource;

            function recursiveRead(data) {
                for (var i = 0; i < data.length; i++) {
                    data[i]._initChildren();

                    data[i].children.fetch();

                    recursiveRead(data[i].children.view());
                }
            }

            dataSource = isArray(dataSource) ? { data: dataSource } : dataSource;

            that._unbindDataSource();

            if (!dataSource.fields) {
                dataSource.fields = [
                    { field: "text" },
                    { field: "url" },
                    { field: "spriteCssClass" },
                    { field: "imageUrl" }
                ];
            }

            that.dataSource = dataSource = HierarchicalDataSource.create(dataSource);

            if (silentRead) {
                dataSource.fetch();

                recursiveRead(dataSource.view());
            }

            that._bindDataSource();
        },

        events: [
            DRAGSTART,
            DRAG,
            DROP,
            DRAGEND,

            DATABOUND,
            LOADCOMPLETED,

            EXPAND,
            COLLAPSE,
            SELECT,
            CHANGE,
            NAVIGATE,
            CHECK,
            KENDOKEYDOWN
        ],

        options: {
            name: "TreeView",
            dataSource: {},
            animation: {
                expand: {
                    effects: "expand:vertical",
                    duration: 200
                }, collapse: {
                    duration: 100
                }
            },
            messages: {
                loading: "Loading...",
                requestFailed: "Request failed.",
                retry: "Retry"
            },
            dragAndDrop: false,
            checkboxes: false,
            autoBind: true,
            autoScroll: false,
            loadOnDemand: true,
            template: "",
            dataTextField: null,
            size: "medium"
        },

        _accessors: function() {
            var that = this,
                options = that.options,
                i, field, textField,
                element = that.element;

            for (i in bindings) {
                field = options[bindings[i]];
                textField = element.attr(kendo.attr(i + "-field"));

                if (!field && textField) {
                    field = textField;
                }

                if (!field) {
                    field = i;
                }

                if (!isArray(field)) {
                    field = [field];
                }

                options[bindings[i]] = field;
            }
        },

        // generates accessor function for a given field name, honoring the data*Field arrays
        _fieldAccessor: function(fieldName) {
            var fieldBindings = this.options[bindings[fieldName]],
                count = fieldBindings.length;

            return (function(item) {
                if (count === 0) {
                    return kendo.getter(fieldName)(item);
                }

                return $.map(fieldBindings, function(x) {
                    return function(d) { return kendo.getter(x)(d); };
                })[Math.min(item.level(), count - 1)](item);
            });
        },

        setOptions: function(options) {
            Widget.fn.setOptions.call(this, options);

            this._animation();

            this._dragging();

            this._accessors();

            this._templates();
        },

        _trigger: function(eventName, node) {
            return this.trigger(eventName, {
                node: node.closest(NODE)[0]
            });
        },

        _setChecked: function(datasource, value) {
            if (!datasource || !kendo.isFunction(datasource.view)) {
                return;
            }

            for (var i = 0, nodes = datasource.view(); i < nodes.length; i++) {
                if (nodes[i].enabled !== false) {
                    this._setCheckedValue(nodes[i], value);
                }

                if (nodes[i].children) {
                    this._setChecked(nodes[i].children, value);
                }
            }
        },

        _setCheckedValue: function(node, value) {
            node[CHECKED] = value;
        },

        _setIndeterminate: function(node) {
            var group = subGroup(node),
                siblings, length,
                all = true,
                i;

            if (!group.length) {
                return;
            }

            siblings = checkboxes(group.children());

            length = siblings.length;

            if (!length) {
                return;
            } else if (length > 1) {
                for (i = 1; i < length; i++) {
                    if (siblings[i].checked != siblings[i - 1].checked ||
                        siblings[i].indeterminate || siblings[i - 1].indeterminate) {
                        all = false;
                        break;
                    }
                }
            } else {
                all = !siblings[0].indeterminate;
            }

            node.attr(ARIA_CHECKED, all ? siblings[0].checked : "mixed");

            return checkboxes(node)
                .data(INDETERMINATE, !all)
                .prop(INDETERMINATE, !all)
                .prop(CHECKED, all && siblings[0].checked);
        },

        updateIndeterminate: function(node) {
            // top-down update of inital indeterminate state for all nodes
            node = node || this.wrapper;

            var subnodes = subGroup(node).children();
            var i;
            var checkbox;
            var dataItem;

            if (subnodes.length) {
                for (i = 0; i < subnodes.length; i++) {
                    this.updateIndeterminate(subnodes.eq(i));
                }

                if (node.is(".k-treeview")) {
                    return;
                }

                checkbox = this._setIndeterminate(node);

                dataItem = this.dataItem(node);

                if (checkbox && checkbox.prop(CHECKED)) {
                    dataItem.checked = true;
                } else {
                    if (dataItem) {
                        delete dataItem.checked;
                    }
                }
            }
        },

        _bubbleIndeterminate: function(node, skipDownward) {
            // bottom-up setting of indeterminate state of parent nodes
            if (!node.length) {
                return;
            }

            if (!skipDownward) {
                //update the indeterminate state of the node itself
                this.updateIndeterminate(node);
            }

            var parentNode = this.parent(node),
                checkbox;

            if (parentNode.length) {
                this._setIndeterminate(parentNode);

                checkbox = parentNode.children("div").find(".k-checkbox-wrap input[type=checkbox]");

                this._skip = true;
                if (checkbox.prop(INDETERMINATE) === false) {
                    this.dataItem(parentNode).set(CHECKED, checkbox.prop(CHECKED));
                } else {
                    // delete this.dataItem(parentNode).checked;
                    this.dataItem(parentNode).set(CHECKED, false);
                }

                this._skip = false;

                this._bubbleIndeterminate(parentNode, true);
            }
        },

        _checkboxChange: function(e) {
            var that = this;
            var checkbox = $(e.target);
            var isChecked = checkbox.prop(CHECKED);
            var node = checkbox.closest(NODE);
            var dataItem = this.dataItem(node);

            if (this._preventChange) {
                return;
            }

            if (dataItem.checked != isChecked) {
                dataItem.set(CHECKED, isChecked);
                node.attr(ARIA_CHECKED, isChecked);
                this._trigger(CHECK, node);
            }

            if (checkbox.is(":focus")) {
                that._trigger(NAVIGATE, node);
                that.focus();
            }
        },

        _toggleButtonClick: function(e) {
            var node = $(e.currentTarget).closest(NODE);

            if (node.is("[aria-disabled='true']")) {
                return;
            }

            this.toggle(node);
        },

        _mousedown: function(e) {
            var that = this;
            var currentTarget = $(e.currentTarget);
            var node = $(e.currentTarget).closest(NODE);
            var browser = kendo.support.browser;

            if (node.is("[aria-disabled='true']")) {
                return;
            }

            //IE does not trigger change for indeterminate checkboxes
            if ((browser.msie || browser.edge) && currentTarget.is(":checkbox")) {
                if (currentTarget.prop(INDETERMINATE)) {
                    that._preventChange = false;

                    currentTarget.prop(CHECKED, !currentTarget.prop(CHECKED));
                    currentTarget.trigger(CHANGE);

                    currentTarget.on(CLICK + NS, function(e) {
                        e.preventDefault();
                    });

                    that._preventChange = true;
                } else {
                    currentTarget.off(CLICK + NS);
                    that._preventChange = false;
                }
            }

            that._clickTarget = node;
            that.current(node);
        },

        _focusable: function(node) {
            return node && node.length && node.is(":visible") && !node.find(".k-treeview-leaf").first().hasClass(DISABLED);
        },

        _focus: function() {
            var current = this.select(),
                clickTarget = this._clickTarget;

            // suppress initial focus state on touch devices (until keyboard is used)
            if (kendo.support.touch) {
                return;
            }

            if (clickTarget && clickTarget.length) {
                current = clickTarget;
            }

            if (!this._focusable(current)) {
                current = this.current();
            }

            if (!this._focusable(current)) {
                current = this._nextVisible($());
            }

            this.current(current);
        },

        focus: function() {
            var wrapper = this.wrapper,
                scrollContainer = wrapper[0],
                containers = [],
                offsets = [],
                documentElement = document.documentElement,
                i;

            do {
                scrollContainer = scrollContainer.parentNode;

                if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
                    containers.push(scrollContainer);
                    offsets.push(scrollContainer.scrollTop);
                }
            } while (scrollContainer != documentElement);

            kendo.focusElement(wrapper);

            for (i = 0; i < containers.length; i++) {
                containers[i].scrollTop = offsets[i];
            }
        },

        _blur: function() {
            this.current().find(".k-treeview-leaf").first().removeClass("k-focus");
        },

        _enabled: function(node) {
            return !node.children("div").children(".k-treeview-leaf").hasClass(DISABLED);
        },

        parent: function(node) {
            var wrapperRe = /\bk-treeview\b(?!-)/,
                itemRe = /\bk-treeview-item\b/,
                result,
                skipSelf;

            if (typeof node == STRING) {
                node = this.element.find(node);
            }

            if (!isDomElement(node)) {
                node = node[0];
            }

            skipSelf = itemRe.test(node.className);

            do {
                node = node.parentNode;

                if (itemRe.test(node.className)) {
                    if (skipSelf) {
                        result = node;
                    } else {
                        skipSelf = true;
                    }
                }
            } while (!wrapperRe.test(node.className) && !result);

            return $(result);
        },

        _nextVisible: function(node) {
            var that = this,
                expanded = that._expanded(node),
                result;

            function nextParent(node) {
                while (node.length && !node.next().length) {
                    node = that.parent(node);
                }

                if (node.next().length) {
                    return node.next();
                } else {
                    return node;
                }
            }

            if (!node.length || !node.is(":visible")) {
                result = that.root.children().eq(0);
            } else if (expanded) {
                result = subGroup(node).children().first();

                // expanded node with no children
                if (!result.length) {
                    result = nextParent(node);
                }
            } else {
                result = nextParent(node);
            }

            return result;
        },

        _previousVisible: function(node) {
            var that = this,
                lastChild,
                result;

            if (!node.length || node.prev().length) {
                if (node.length) {
                    result = node.prev();
                } else {
                    result = that.root.children().last();
                }

                while (that._expanded(result)) {
                    lastChild = subGroup(result).children().last();

                    if (!lastChild.length) {
                        break;
                    }

                    result = lastChild;
                }
            } else {
                result = that.parent(node) || node;
            }

            return result;
        },

        scrollTo: function(item) {
            if (item && item.length > 0) {
                item[0].scrollIntoView({ block: "nearest" });
            }
        },

        _keydown: function(e) {
            var that = this,
                key = e.keyCode,
                target,
                focused = that.current(),
                expanded = that._expanded(focused),
                checkbox = focused.find(".k-checkbox-wrap").first().find(":checkbox"),
                rtl = kendo.support.isRtl(that.element);

            if (e.target != e.currentTarget) {
                return;
            }

            if ((!rtl && key == keys.RIGHT) || (rtl && key == keys.LEFT)) {
                if (expanded) {
                    target = that._nextVisible(focused);
                } else if (!focused.find(".k-treeview-leaf").first().hasClass(DISABLED)) {
                    that.expand(focused);
                }
            } else if ((!rtl && key == keys.LEFT) || (rtl && key == keys.RIGHT)) {
                if (expanded && !focused.find(".k-treeview-leaf").first().hasClass(DISABLED)) {
                    that.collapse(focused);
                } else {
                    target = that.parent(focused);

                    if (!that._enabled(target)) {
                        target = undefined$1;
                    }
                }
            } else if (key == keys.DOWN) {
                target = that._nextVisible(focused);
            } else if (key == keys.UP) {
                target = that._previousVisible(focused);
            } else if (key == keys.HOME) {
                target = that._nextVisible($());
            } else if (key == keys.END) {
                target = that._previousVisible($());
            } else if (key == keys.ENTER && !focused.find(".k-treeview-leaf").first().hasClass(DISABLED)) {
                if (!focused.find(".k-treeview-leaf").first().hasClass("k-selected")) {
                    if (!that._trigger(SELECT, focused)) {
                        that.select(focused);
                    }
                }
            } else if (key == keys.SPACEBAR && checkbox.length) {
                if (!focused.find(".k-treeview-leaf").first().hasClass(DISABLED)) {
                    checkbox.prop(CHECKED, !checkbox.prop(CHECKED))
                        .data(INDETERMINATE, false)
                        .prop(INDETERMINATE, false);

                    that._checkboxChange({ target: checkbox });
                }
                target = focused;
            }

            if (target) {
                e.preventDefault();

                if (focused[0] != target[0]) {
                    that._trigger(NAVIGATE, target);
                    that.current(target);
                    that.scrollTo(target);
                }
            }
        },

        _keypress: function(e) {
            var that = this;
            var delay = 300;
            var focusedNode = that.current().get(0);
            var matchToFocus;
            var key = e.key;
            var isPrintable = key.length === 1;

            if (!isPrintable) {
                return;
            }

            if (!that._match) {
                that._match = "";
            }

            that._match += key;
            clearTimeout(that._matchTimer);
            that._matchTimer = setTimeout(function() {
                that._match = "";
            }, delay);

            matchToFocus = focusedNode &&
                            that._matchNextByText(
                                Array.prototype.indexOf.call(that.element.find(".k-treeview-item"),
                                focusedNode), that._match
                            );

            if (!matchToFocus.length) {
                matchToFocus = that._matchNextByText(-1, that._match);
            }

            if (matchToFocus.get(0) && matchToFocus.get(0) !== focusedNode) {
                that._trigger(NAVIGATE, matchToFocus);
                that.current(matchToFocus);
            }
        },

        _matchNextByText: function(startIndex, text) {
            var element = this.element;
            var textNodes = element.find(".k-treeview-leaf").filter(function(i, element) {
                return (i > startIndex &&
                        $(element).is(":visible") &&
                        $(element).text().toLowerCase().indexOf(text) === 0);
            });

            return textNodes.eq(0).closest(NODE);
        },

        _click: function(e) {
            var that = this,
                node = $(e.currentTarget),
                contents = nodeContents(node.closest(NODE)),
                href = node.attr("href"),
                shouldNavigate;

            if (href) {
                shouldNavigate = href == "#" || href.indexOf("#" + this.element.id + "-") >= 0;
            } else {
                shouldNavigate = contents.length && !contents.children().length;
            }

            if (shouldNavigate) {
                e.preventDefault();
            }

            if (!node.hasClass(".k-selected") && !that._trigger(SELECT, node)) {
                that.select(node);
            }
        },

        _wrapper: function() {
            var that = this,
                element = that.element,
                wrapper, root,
                wrapperClasses = "k-treeview";

            if (element.is("ul")) {
                wrapper = element.wrap('<div />').parent();
                root = element;
            } else {
                wrapper = element;
                root = wrapper.children("ul").eq(0);
            }

            that.wrapper = wrapper.addClass(wrapperClasses);
            that.root = root;
        },

        _getSelectedNode: function() {
            return this.element.find(".k-selected").closest(NODE);
        },

        _group: function(item) {
            var that = this,
                firstLevel = item.hasClass(KTREEVIEW),
                group = {
                    firstLevel: firstLevel,
                    expanded: firstLevel || that._expanded(item)
                },
                groupElement = item.children("ul");

            groupElement
                .addClass(that.templates.groupCssClass(group))
                .css("display", group.expanded ? "" : "none");

            if (!firstLevel) {
                groupElement.attr("role", "group");
            }

            that._nodes(groupElement, group);
        },

        _nodes: function(groupElement, groupData) {
            var that = this,
                nodes = groupElement.children("li"),
                nodeData;

            groupData = extend({ length: nodes.length }, groupData);

            nodes.each(function(i, node) {
                node = $(node);

                nodeData = { index: i, expanded: that._expanded(node) };

                updateNodeHtml(node);

                that._updateNodeClasses(node, groupData, nodeData);

                // iterate over child nodes
                that._group(node);
            });
        },

        _checkboxes: function() {
            var options = this.options;
            var checkboxes = options.checkboxes;
            var defaultTemplate, checkbox;

            if (checkboxes) {
                defaultTemplate = kendo.html.renderCheckBox($("<input/>"), $.extend({}, options, {
                    rounded: "medium"
                }));

                defaultTemplate = defaultTemplate.replace(">", "");

                checkbox = ({ item }) =>
                defaultTemplate +
                ` id="_${item.uid}" aria-hidden="true" type="checkbox" tabindex="-1"` +
                `${checkboxes.name ? 'name="' + checkboxes.name + '"' : ''} ` +
                `${(item.enabled === false) ? 'disabled' : ''} ` +
                `${item.checked ? 'checked' : ''}/>`;

                checkboxes = extend({
                    template: checkbox
                }, options.checkboxes);

                if (typeof checkboxes.template == STRING) {
                    checkboxes.template = template(checkboxes.template);
                }

                options.checkboxes = checkboxes;
            }
        },

        _updateNodeClasses: function(node, groupData, nodeData) {
            var wrapper = node.children("div"),
                group = node.children("ul"),
                templates = this.templates;

            if (node.hasClass("k-treeview")) {
                return;
            }

            nodeData = nodeData || {};
            nodeData.expanded = typeof nodeData.expanded != UNDEFINED ? nodeData.expanded : this._expanded(node);
            nodeData.index = typeof nodeData.index != UNDEFINED ? nodeData.index : node.index();
            nodeData.enabled = typeof nodeData.enabled != UNDEFINED ? nodeData.enabled : !wrapper.children(".k-treeview-leaf").hasClass("k-disabled");

            groupData = groupData || {};
            groupData.firstLevel = typeof groupData.firstLevel != UNDEFINED ? groupData.firstLevel : node.parent().parent().hasClass(KTREEVIEW);
            groupData.length = typeof groupData.length != UNDEFINED ? groupData.length : node.parent().children().length;

            // li
            node.addClass("k-treeview-item");

            // div
            wrapper.removeClass("k-treeview-top k-treeview-mid k-treeview-bot")
                   .addClass(templates.cssClass(groupData, nodeData));

            // chekbox
            var checkbox = wrapper.find(".k-checkbox");
            checkbox.removeClass("k-checkbox k-disabled").addClass(templates.checkboxClass(nodeData));

            // span / a
            var textWrap = wrapper.children(".k-treeview-leaf");
            var isLink = textWrap[0] && textWrap[0].nodeName.toLowerCase() == "a";
            textWrap.removeClass("k-treeview-leaf k-link k-disabled")
                .addClass(templates.textClass(nodeData, isLink));

            // toggle button
            if (group.length || node.attr("data-hasChildren") == "true") {
                var toggleButton = wrapper.find(".k-treeview-toggle");
                var toggleIcon = toggleButton.children(`span`);
                toggleButton.removeClass("k-treeview-toggle k-disabled").addClass(templates.toggleButtonClass(nodeData));

                // renderv icon
                templates.toggleIcon(toggleIcon, nodeData);


                group.addClass("k-treeview-group");
            }
        },


        _processNodes: function(nodes, callback) {
            var that = this;
            var items = that.element.find(nodes);
            for (var i = 0; i < items.length; i++) {
                callback.call(that, i, $(items[i]).closest(NODE));
            }
        },

        dataItem: function(node) {
            var uid = $(node).closest(NODE).attr(kendo.attr("uid")),
                dataSource = this.dataSource;

            return dataSource && dataSource.getByUid(uid);
        },

        _dataItem: function(node) {
            var uid = $(node).closest(NODE).attr(kendo.attr("uid")),
                dataSource = this.dataSource;

            return dataSource && this._dataSourceUids[uid];
        },

        _insertNode: function(nodeData, index, parentNode, insertCallback, collapsed) {
            var that = this,
                group = subGroup(parentNode),
                updatedGroupLength = group.children().length + 1,
                childrenData,
                groupData = {
                    firstLevel: parentNode.hasClass(KTREEVIEW),
                    expanded: !collapsed,
                    length: updatedGroupLength
                }, node, i, item, nodeHtml = "", firstChild, lastChild,
                append = function(item, group) {
                    item.appendTo(group);
                };

            for (i = 0; i < nodeData.length; i++) {
                item = nodeData[i];

                item.index = index + i;

                nodeHtml += that._renderItem({
                    group: groupData,
                    item: item
                });
            }

            node = $(nodeHtml);

            if (!node.length) {
                return;
            }

            if (!group.length) {
                group = $(that._renderGroup({
                    group: groupData
                }));

                kendo.applyStylesFromKendoAttributes(group, ["display"]);
                group.appendTo(parentNode);

                parentNode.attr(ARIA_EXPANDED, true);
            }

            insertCallback(node, group);

            if (parentNode.hasClass("k-treeview-item")) {
                updateNodeHtml(parentNode);
                that._updateNodeClasses(parentNode, groupData, { expanded: !collapsed });
            }

            firstChild = node.prev().first();
            lastChild = node.next().last();

            that._updateNodeClasses(firstChild, {}, { expanded: firstChild.attr(kendo.attr("expanded")) == "true" });
            that._updateNodeClasses(lastChild, {}, { expanded: lastChild.attr(kendo.attr("expanded")) == "true" });

            // render sub-nodes
            for (i = 0; i < nodeData.length; i++) {
                item = nodeData[i];

                if (item.hasChildren) {
                    childrenData = item.children.data();

                    if (childrenData.length) {
                        that._insertNode(childrenData, item.index, node.eq(i), append, !item.expanded);
                    }
                }
            }

            return node;
        },

        _updateNodes: function(items, field) {
            var that = this;
            var i, node, nodeWrapper, item, isChecked, isCollapsed, kin;
            var context = { treeview: that.options, item: item };
            var render = field != "expanded" && field != "checked";

            function setCheckedState(root, state) {
                if (root.is(".k-treeview-group")) {
                    root.find(".k-treeview-item:not([aria-disabled])").attr(ARIA_CHECKED, state);
                }

                root.find(".k-checkbox-wrap input[type=checkbox]:not([disabled])")
                    .prop(CHECKED, state)
                    .data(INDETERMINATE, false)
                    .prop(INDETERMINATE, false);
            }

            if (field == "selected") {
                item = items[0];

                node = that.findByUid(item.uid);
                kin = node.find(".k-treeview-leaf").first();

                kin.removeClass("k-hover")
                    .toggleClass("k-selected", item[field])
                    .end();

                if (item[field]) {
                    that.current(node);
                }

                node.attr(ARIA_SELECTED, !!item[field]);
            } else {
                var elements = $.map(items, function(item) {
                    return that.findByUid(item.uid).children("div");
                });

                for (i = 0; i < items.length; i++) {
                    context.item = item = items[i];
                    nodeWrapper = elements[i];
                    node = nodeWrapper.parent();

                    if (render) {
                        if (kendo.unbind) {
                            kendo.unbind(nodeWrapper);
                        }
                        nodeWrapper.children(".k-treeview-leaf")
                            .html(that.templates.itemContent(context));
                    }

                    if (field == CHECKED) {
                        isChecked = item[field];

                        setCheckedState(nodeWrapper, isChecked);

                        node.attr(ARIA_CHECKED, isChecked);

                        if (that.options.checkboxes.checkChildren) {
                            setCheckedState(node.children(".k-treeview-group"), isChecked);

                            that._setChecked(item.children, isChecked);

                            that._bubbleIndeterminate(node);
                        }
                    } else if (field == "expanded") {
                        that._toggle(node, item, item[field]);
                    } else if (field == "enabled") {
                        node.find(".k-checkbox-wrap input[type=checkbox]").prop("disabled", !item[field]);

                        isCollapsed = !nodeContents(node).is(VISIBLE);

                        node.removeAttr(ARIA_DISABLED);

                        if (!item[field]) {
                            if (item.selected) {
                                item.set("selected", false);
                            }

                            if (item.expanded) {
                                item.set("expanded", false);
                            }

                            isCollapsed = true;
                            node.attr(ARIA_SELECTED, false)
                                .attr(ARIA_DISABLED, true);
                        }

                        that._updateNodeClasses(node, {}, { enabled: item[field], expanded: !isCollapsed });
                    }

                    if (nodeWrapper.length) {
                        this.trigger("itemChange", { item: nodeWrapper, data: item, ns: ui });
                    }
                }
            }
        },

        _appendItems: function(index, items, parentNode) {
            var group = subGroup(parentNode);
            var children = group.children();
            var collapsed = !this._expanded(parentNode);

            if (this.element === parentNode) {
                var dataItems = this.dataSource.data();
                var viewItems = this.dataSource.view();
                var rootItems = viewItems.length < dataItems.length ? viewItems : dataItems;
                index = rootItems.indexOf(items[0]);
            } else if (items.length) {
                index = items[0].parent().indexOf(items[0]);
            }

            if (typeof index == UNDEFINED) {
                index = children.length;
            }

            this._insertNode(items, index, parentNode, function(item, group) {
                // insert node into DOM
                if (index >= children.length) {
                    item.appendTo(group);
                } else {
                    item.insertBefore(children.eq(index));
                }
            }, collapsed);

            if (!collapsed) {
                this._updateNodeClasses(parentNode, {}, { expanded: !collapsed });
                subGroup(parentNode).css("display", "block");
            }
        },

        _refreshChildren: function(parentNode, items, index) {
            var i, children, child;
            var options = this.options;
            var loadOnDemand = options.loadOnDemand;
            var checkChildren = options.checkboxes && options.checkboxes.checkChildren;

            subGroup(parentNode).empty();

            if (!items.length) {
                updateNodeHtml(parentNode);
            } else {
                this._appendItems(index, items, parentNode);

                children = subGroup(parentNode).children();

                if (loadOnDemand && checkChildren) {
                    this._bubbleIndeterminate(children.last());
                }

                for (i = 0; i < children.length; i++) {
                    child = children.eq(i);
                    this.trigger("itemChange", {
                        item: child.children("div"),
                        data: items[i],
                        ns: ui
                    });
                }
            }
        },

        _refreshRoot: function(items) {
            var groupHtml = this._renderGroup({
                    items: items,
                    group: {
                        firstLevel: true,
                        expanded: true
                    }
                });

            if (this.root.length && this.root[0].parentElement) {
                var group = $(groupHtml);

                this.root
                    .attr("class", group.attr("class"))
                    .html(group.html());
            } else {
                this.root = this.wrapper.html(groupHtml).children("ul");
            }

            var elements = this.root.children(".k-treeview-item");
            for (var i = 0; i < items.length; i++) {
                this.trigger("itemChange", {
                    item: elements.eq(i),
                    data: items[i],
                    ns: ui
                });
            }
        },

        refresh: function(e) {
            var node = e.node;
            var action = e.action;
            var items = e.items;
            var parentNode = this.wrapper;
            var options = this.options;
            var loadOnDemand = options.loadOnDemand;
            var checkChildren = options.checkboxes && options.checkboxes.checkChildren;
            var i;

            if (this._skip) {
                return;
            }

            for (i = 0; i < items.length; i++) {
                this._dataSourceUids[items[i].uid] = items[i];
            }

            if (e.field) {
                if (!items[0] || !items[0].level) {
                    return;
                }

                return this._updateNodes(items, e.field);
            }

            if (node) {
                parentNode = this.findByUid(node.uid);
                this._progress(parentNode, false);
            }

            if (checkChildren && action != "remove") {
                var bubble = false;

                for (i = 0; i < items.length; i++) {
                    if ("checked" in items[i]) {
                        bubble = true;
                        break;
                    }
                }

                if (!bubble && node && node.checked) {
                    for (i = 0; i < items.length; i++) {
                        items[i].checked = true;
                    }
                }
            }

            if (action == "add") {
                this._appendItems(e.index, items, parentNode);
            } else if (action == "remove") {
                this._remove(this.findByUid(items[0].uid), false);
            } else if (action == "itemchange") {
                this._updateNodes(items);
            } else if (action == "itemloaded") {
                this._refreshChildren(parentNode, items, e.index);
            } else {
                this._refreshRoot(items);
                this.element.attr(ARIA_BUSY, false);
            }

            if (action != "remove") {
                for (i = 0; i < items.length; i++) {
                    if (!loadOnDemand || items[i].expanded || items[i]._loaded) {
                        items[i].load();
                    }
                }
            }

            this.wrapper.find(">ul").attr("role", "tree");


            this.trigger(DATABOUND, { node: node ? parentNode : undefined$1 });
            if (this.dataSource.filter() && this.options.checkboxes.checkChildren) {
                this.updateIndeterminate(parentNode);
            }
        },

        _error: function(e) {
            var node = e.node && this.findByUid(e.node.uid);
            var retryHtml = this.templates.retry({ messages: this.options.messages });

            if (node) {
                this._progress(node, false);
                this._expanded(node, false);
                nodeIcon(node).replaceWith(ui.icon($(TOGGLE_ICON_ELM), { icon: "arrow-rotate-cw" }));
                e.node.loaded(false);
            } else {
                this._progress(false);
                this.dataSource.data([]);
                this.element.html(retryHtml);
            }
        },

        _retryRequest: function(e) {
            e.preventDefault();

            this.dataSource.fetch(this._attemptLoadCompleted.bind(this));
        },

        expand: function(nodes) {
            this._processNodes(nodes, function(index, item) {
                this.toggle(item, true);
            });
        },

        collapse: function(nodes) {
            this._processNodes(nodes, function(index, item) {
                this.toggle(item, false);
            });
        },

        enable: function(nodes, enable) {
            if (typeof nodes === "boolean") {
                enable = nodes;
                nodes = this.items();
            } else {
                enable = arguments.length == 2 ? !!enable : true;
            }

            this._processNodes(nodes, function(index, item) {
                this.dataItem(item).set("enabled", enable);
            });
        },

        current: function(node) {
            var that = this,
                current = that._current,
                element = that.element;

            if (arguments.length > 0 && node && node.length) {
                if (current) {
                    current.find(".k-treeview-leaf").first().removeClass("k-focus");
                }

                current = that._current = $(node, element).closest(NODE);
                current.find(".k-treeview-leaf").first().addClass("k-focus");
                that._updateActiveDescendant();

                return;
            }

            if (!current) {
                current = that._nextVisible($());
            }

            return current;
        },

        _updateActiveDescendant: function() {
            var current = this._current,
                id = current[0].id || this._ariaId,
                prev = this.element.find("#" + this._ariaId);

            if (prev.length > 0) {
                prev.removeAttr("id");
            }

            this.root.removeAttr(ARIA_ACTIVEDESCENDANT);
            current.attr("id", id);
            this.root.attr(ARIA_ACTIVEDESCENDANT, id);
        },

        select: function(node) {
            var that = this,
                element = that.element;

            if (!arguments.length) {
                return element.find(".k-selected").closest(NODE);
            }

            node = $(node, element).closest(NODE);

            element.find(".k-selected").each(function() {
                var dataItem = that.dataItem(this);
                if (dataItem) {
                    dataItem.set("selected", false);
                    delete dataItem.selected;
                } else {
                    $(this).removeClass("k-selected");
                }
            });

            if (node.length) {
                that.dataItem(node).set("selected", true);
                that._clickTarget = node;
            }

            that.trigger(CHANGE);
        },

        _toggle: function(node, dataItem, expand) {
            var options = this.options;
            var contents = nodeContents(node);
            var direction = expand ? "expand" : "collapse";
            var loaded;

            if (contents.data("animating")) {
                return;
            }

            loaded = dataItem && dataItem.loaded();

            if (expand && !loaded) {
                if (options.loadOnDemand) {
                    this._progress(node, true);
                }

                contents.remove();
                dataItem.load();
            } else {
                this._updateNodeClasses(node, {}, { expanded: expand });

                if (!expand) {
                    contents.css("height", contents.height()).css("height");
                }

                contents
                    .kendoStop(true, true)
                    .kendoAnimate(extend(
                        { reset: true },
                        options.animation[direction],
                        { complete: function() {
                            if (expand) {
                                contents.css("height", "");
                            }
                        } }
                    ));
            }

        },

        toggle: function(node, expand) {
            node = $(node);

            if (!nodeIcon(node)) {
                return;
            }

            if (arguments.length == 1) {
                expand = !this._expanded(node);
            }

            this._expanded(node, expand);
        },

        destroy: function() {
            var that = this;

            Widget.fn.destroy.call(that);

            that.wrapper.off(NS);
            that.wrapper.find(".k-checkbox-wrap :checkbox").off(NS);
            that._clickHandler = null;

            that._unbindDataSource();

            if (that.dragging) {
                that.dragging.destroy();
            }

            that._dataSourceUids = {};

            kendo.destroy(that.element);

            that.root = that.wrapper = that.element = null;
        },

        _expanded: function(node, value, force) {
            var expandedAttr = kendo.attr("expanded");
            var dataItem;
            var expanded = value;
            var direction = expanded ? "expand" : "collapse";

            if (node.children().hasClass("k-hidden")) {
                node.children().removeClass("k-hidden");
            }

            if (arguments.length == 1) {
                dataItem = this._dataItem(node);
                return node.attr(expandedAttr) === "true" || (dataItem && dataItem.expanded);
            }

            dataItem = this.dataItem(node);

            if (nodeContents(node).data("animating")) {
                return;
            }

            if (force || !this._trigger(direction, node)) {
                if (expanded) {
                    node.attr(expandedAttr, "true");
                    node.attr(ARIA_EXPANDED, "true");
                } else {
                    node.removeAttr(expandedAttr);
                    node.attr(ARIA_EXPANDED, "false");
                }

                if (dataItem) {
                    dataItem.set("expanded", expanded);
                    // necessary when expanding an item yields an error and the item is not expanded as a result
                    expanded = dataItem.expanded;
                }
            }
        },

        _progress: function(node, showProgress) {
            var element = this.element;
            var loadingText = this.templates.loading({ messages: this.options.messages });

            if (arguments.length == 1) {
                showProgress = node;

                if (showProgress) {
                    element.html(loadingText);
                } else {
                    element.empty();
                }

                this.element.attr(ARIA_BUSY, showProgress);
            } else {
                nodeIcon(node).replaceWith(
                    $(TOGGLE_ICON_ELM)
                        .toggleClass('k-i-loading', showProgress)
                        .toggleClass('k-icon', showProgress));
                node.attr(ARIA_BUSY, showProgress);
            }
        },

        text: function(node, text) {
            var dataItem = this.dataItem(node),
                fieldBindings = this.options[bindings.text],
                level = dataItem.level(),
                length = fieldBindings.length,
                field = fieldBindings[Math.min(level, length - 1)];

            if (text) {
                dataItem.set(field, text);
            } else {
                return dataItem[field];
            }
        },

        _objectOrSelf: function(node) {
            return $(node).closest("[data-role=treeview]").data("kendoTreeView") || this;
        },

        _dataSourceMove: function(nodeData, group, parentNode, callback) {
            var referenceDataItem,
                destTreeview = this._objectOrSelf(parentNode || group),
                destDataSource = destTreeview.dataSource;
            var loadPromise = $.Deferred().resolve().promise();

            if (parentNode && parentNode[0] != destTreeview.element[0]) {
                referenceDataItem = destTreeview.dataItem(parentNode);

                if (!referenceDataItem.loaded()) {
                    destTreeview._progress(parentNode, true);
                    loadPromise = referenceDataItem.load();
                }

                if (parentNode != this.root) {
                    destDataSource = referenceDataItem.children;

                    if (!destDataSource || !(destDataSource instanceof HierarchicalDataSource)) {
                        referenceDataItem._initChildren();
                        referenceDataItem.loaded(true);
                        destDataSource = referenceDataItem.children;
                    }
                }
            }

            nodeData = this._toObservableData(nodeData);

            return callback.call(destTreeview, destDataSource, nodeData, loadPromise);
        },

        _toObservableData: function(node) {
            var dataItem = node, dataSource, uid;

            if (isJQueryInstance(node) || isDomElement(node)) {
                dataSource = this._objectOrSelf(node).dataSource;
                uid = $(node).attr(kendo.attr("uid"));
                dataItem = dataSource.getByUid(uid);

                if (dataItem) {
                    dataItem = dataSource.remove(dataItem);
                }
            }

            return dataItem;
        },

        _insert: function(data, model, index) {
            if (!(model instanceof kendo.data.ObservableArray)) {
                if (!isArray(model)) {
                    model = [model];
                }
            } else {
                // items will be converted to new Node instances
                model = model.toJSON();
            }

            var parentNode = data.parent();

            if (parentNode && parentNode._initChildren) {
                parentNode.hasChildren = true;
                parentNode._initChildren();
            }

            data.splice.apply(data, [ index, 0 ].concat(model));

            return this.findByUid(data[index].uid);
        },

        insertAfter: insertAction(1),

        insertBefore: insertAction(0),

        append: function(nodeData, parentNode, success) {
            var group = this.root;

            if (parentNode && nodeData instanceof jQuery && parentNode[0] === nodeData[0]) {
                return;
            }

            parentNode = parentNode && parentNode.length ? parentNode : null;

            if (parentNode) {
                group = subGroup(parentNode);
            }

            return this._dataSourceMove(nodeData, group, parentNode, function(dataSource, model, loadModel) {
                var inserted;
                var that = this;

                function add() {
                    if (parentNode) {
                        that._expanded(parentNode, true, true);
                    }

                    var data = dataSource.data(),
                        index = Math.max(data.length, 0);

                    return that._insert(data, model, index);
                }

                loadModel.done(function() {
                    inserted = add();
                    success = success || $.noop;
                    success(inserted);
                });

                return inserted || null;
            });
        },

        _remove: function(node, keepData) {
            var that = this,
                parentNode,
                prevSibling, nextSibling;

            node = $(node, that.element);

            if (node.attr("id") === that.root.attr(ARIA_ACTIVEDESCENDANT)) {
                that.root.removeAttr(ARIA_ACTIVEDESCENDANT);
            }

            parentNode = node.parent().parent();
            prevSibling = node.prev();
            nextSibling = node.next();

            node[keepData ? "detach" : "remove"]();

            if (parentNode.hasClass("k-treeview-item")) {
                updateNodeHtml(parentNode);
                that._updateNodeClasses(parentNode);
            }

            that._updateNodeClasses(prevSibling);
            that._updateNodeClasses(nextSibling);

            return node;
        },

        remove: function(node) {
            var dataItem = this.dataItem(node);
            if (dataItem) {
                this.dataSource.remove(dataItem);
            }
        },

        detach: function(node) {
            return this._remove(node, true);
        },

        findByText: function(text) {
            return $(this.element).find(".k-treeview-leaf").filter(function(i, element) {
                return $(element).text() == text;
            }).closest(NODE);
        },

        findByUid: function(uid) {
            var items = this.element.find(".k-treeview-item");
            var uidAttr = kendo.attr("uid");
            var result;

            for (var i = 0; i < items.length; i++) {
                if (items[i].getAttribute(uidAttr) == uid) {
                    result = items[i];
                    break;
                }
            }

            return $(result);
        },

        expandPath: function(path, complete) {
            var treeview = this;
            var nodeIds = path.slice(0);
            var callback = complete || $.noop;

            function proceed() {
                nodeIds.shift();

                if (nodeIds.length) {
                    expand(nodeIds[0]).then(proceed);
                } else {
                    callback.call(treeview);
                }
            }

            function expand(id) {
                var result = $.Deferred();
                var node = treeview.dataSource.get(id);
                var expandedAttr = kendo.attr("expanded");
                var nodeElement;

                if (node) {
                    nodeElement = treeview.findByUid(node.uid);

                    if (node.loaded()) {
                        node.set("expanded", true);
                        nodeElement.attr(expandedAttr, true);
                        nodeElement.attr(ARIA_EXPANDED, true);
                        result.resolve();
                    } else {
                        // manually show progress of the node
                        // should be moved to `refresh`
                        // if the datasource starts triggering a `requestStart` event for nodes
                        treeview._progress(nodeElement, true);

                        node.load().then(function() {
                            node.set("expanded", true);
                            nodeElement.attr(expandedAttr, true);
                            nodeElement.attr(ARIA_EXPANDED, true);
                            result.resolve();
                        });
                    }
                } else {
                    result.resolve();
                }

                return result.promise();
            }

            // expand async nodes
            expand(nodeIds[0]).then(proceed);
        },

        _parentIds: function(node) {
            var parent = node && node.parentNode();
            var parents = [];
            while (parent && parent.parentNode) {
                parents.unshift(parent.id);
                parent = parent.parentNode();
            }

            return parents;
        },

        expandTo: function(node) {
            if (!(node instanceof kendo.data.Node)) {
                node = this.dataSource.get(node);
            }

            var parents = this._parentIds(node);

            this.expandPath(parents);
        },

        _renderItem: function(options) {
            if (!options.group) {
                options.group = {};
            }

            options.treeview = this.options;

            options.r = this.templates;

            return this.templates.item(options);
        },

        _renderGroup: function(options) {
            var that = this;

            options.renderItems = function(options) {
                    var html = "",
                        i = 0,
                        items = options.items,
                        len = items ? items.length : 0,
                        group = options.group;

                    group.length = len;

                    for (; i < len; i++) {
                        options.group = group;
                        options.item = items[i];
                        options.item.index = i;
                        html += that._renderItem(options);
                    }

                    return html;
                };

            options.r = that.templates;

            return that.templates.group(options);
        }
    });

    kendo.cssProperties.registerPrefix("TreeView", "k-treeview-");

    ui.plugin(TreeView);
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
