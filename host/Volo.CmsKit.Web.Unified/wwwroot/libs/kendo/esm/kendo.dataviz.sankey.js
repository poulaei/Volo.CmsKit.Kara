import './kendo.core.js';
import './kendo.color.js';
import './kendo.drawing.js';
import './kendo.dataviz.core.js';
import './kendo.dataviz.chart.js';

/***********************************************************************
 * WARNING: this file is auto-generated.  If you change it directly,
 * your modifications will eventually be lost.  The source code is in
 * `kendo-charts` repository, you should make your changes there and
 * run `src-modules/sync.sh` in this repository.
 */

(function($) {
/* eslint-disable */

window.kendo.dataviz = window.kendo.dataviz || {};
var dataviz = kendo.dataviz;
var deepExtend = dataviz.deepExtend;
var Box = dataviz.Box;
var setDefaultOptions = dataviz.setDefaultOptions;
var constants = dataviz.constants;
var geometry = kendo.geometry;
var drawing = kendo.drawing;

var ChartLegend = dataviz.Legend;

var max = function (array, mapFn) { return Math.max.apply(null, array.map(mapFn)); };
var min = function (array, mapFn) { return Math.min.apply(null, array.map(mapFn)); };
var sum = function (array, mapFn) { return array.map(mapFn).reduce(function (acc, curr) { return (acc + curr); }, 0); };
var sortAsc = function (a, b) { return (a.y0 === b.y0 ? a.index - b.index : a.y0 + a.y1 - b.y0 - b.y1); };
var sortSource = function (a, b) { return sortAsc(a.source, b.source); };
var sortTarget = function (a, b) { return sortAsc(a.target, b.target); };
var value = function (node) { return node.value; };

function sortLinks(nodes) {
    nodes.forEach(function (node) {
        node.targetLinks.forEach(function (link) {
            link.source.sourceLinks.sort(sortTarget);
        });
        node.sourceLinks.forEach(function (link) {
            link.target.targetLinks.sort(sortSource);
        });
    });
}

var calcLayer = function (node, maxDepth) {
    if (node.align === 'left') {
        return node.depth;
    }

    if (node.align === 'right') {
        return maxDepth - node.height;
    }

    return node.sourceLinks.length ? node.depth : maxDepth;
};

var Sankey$1 = kendo.Class.extend({
    init: function(options) {
        var ref = options.nodesOptions;
        var offset = ref.offset; if (offset === void 0) { offset = {}; }
        var align = ref.align;
        this.data = {
            nodes: options.nodes.map(function (node) { return deepExtend({}, { offset: offset, align: align }, node); }),
            links: options.links.map(function (link) { return deepExtend({}, link); })
        };

        this.width = options.width;
        this.height = options.height;
        this.offsetX = options.offsetX || 0;
        this.offsetY = options.offsetY || 0;
        this.nodeWidth = options.nodesOptions.width;
        this.nodePadding = options.nodesOptions.padding;
        this.reverse = options.reverse;
        this.targetColumnIndex = options.targetColumnIndex;
        this.loops = options.loops;
        this.autoLayout = options.autoLayout;
    },

    calculate: function() {
        var ref = this.data;
        var nodes = ref.nodes;
        var links = ref.links;
        this.connectLinksToNodes(nodes, links);
        this.calculateNodeValues(nodes);

        var circularLinks = this.calculateNodeHeights(nodes);

        if (circularLinks) {
            return { nodes: [], links: [], columns: [], circularLinks: circularLinks };
        }

        this.calculateNodeDepths(nodes);
        var columns = this.calculateNodeColumns(nodes);
        this.calculateNodeBreadths(columns);
        this.applyNodesOffset(nodes);
        this.calculateLinkBreadths(nodes);

        return $.extend({}, this.data, {columns: columns});
    },

    connectLinksToNodes: function(nodes, links) {
        var nodesMap = new Map();

        nodes.forEach(function (node, i) {
            node.index = i;
            node.sourceLinks = [];
            node.targetLinks = [];
            node.id = node.id !== undefined ? node.id : node.label.text;
            nodesMap.set(node.id, node);
        });

        links.forEach(function (link) {
            link.source = nodesMap.get(link.sourceId);
            link.target = nodesMap.get(link.targetId);
            link.source.sourceLinks.push(link);
            link.target.targetLinks.push(link);
        });
    },

    calculateNodeValues: function(nodes) {
        nodes.forEach(function (node) {
            node.value = Math.max(
                sum(node.sourceLinks, value),
                sum(node.targetLinks, value)
            );
        });
    },

    calculateNodeDepths: function(nodes) {
        var current = new Set(nodes);
        var next = new Set();
        var currDepth = 0;
        while (current.size) {
            var currentNodes = Array.from(current);
            for (var n = 0; n < currentNodes.length; n++) {
                var node = currentNodes[n];
                node.depth = currDepth;
                for (var l = 0; l < node.sourceLinks.length; l++) {
                    var link = node.sourceLinks[l];
                    next.add(link.target);
                }
            }
            currDepth++;
            current = next;
            next = new Set();
        }
    },

    calculateNodeHeights: function(nodes) {
        var nodesLength = nodes.length;
        var current = new Set(nodes);
        var next = new Set;
        var currentHeight = 0;
        var eachNode = function (node) {
            node.height = currentHeight;
            node.targetLinks.forEach(function (link) {
                next.add(link.source);
            });
        };
        while (current.size) {
            current.forEach(eachNode);
            currentHeight++;
            if (currentHeight > nodesLength) {
                return true;
            }
            current = next;
            next = new Set;
        }
        return false;
    },

    calculateNodeColumns: function(nodes) {
        var this$1$1 = this;

        var maxDepth = max(nodes, function (d) { return d.depth; });
        var columnWidth = (this.width - this.offsetX - this.nodeWidth) / maxDepth;
        var columns = new Array(maxDepth + 1);
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var layer = Math.max(0, Math.min(maxDepth, calcLayer(node, maxDepth)));
            node.x0 = this$1$1.offsetX + layer * columnWidth;
            node.x1 = node.x0 + this$1$1.nodeWidth;
            node.layer = layer;
            columns[layer] = columns[layer] || [];
            columns[layer].push(node);
        }

        return columns;
    },

    calculateNodeBreadths: function(columns) {
        var this$1$1 = this;

        var kSize = min(columns, function (c) { return (this$1$1.height - this$1$1.offsetY - (c.length - 1) * this$1$1.nodePadding) / sum(c, value); });

        columns.forEach(function (nodes) {
            var y = this$1$1.offsetY;
            nodes.forEach(function (node) {
                node.y0 = y;
                node.y1 = y + node.value * kSize;
                y = node.y1 + this$1$1.nodePadding;
                node.sourceLinks.forEach(function (link) {
                    link.width = link.value * kSize;
                });
            });
            y = (this$1$1.height - y + this$1$1.nodePadding) / (nodes.length + 1);
            nodes.forEach(function (node, i) {
                node.y0 += y * (i + 1);
                node.y1 += y * (i + 1);
            });
        });

        if (this.autoLayout !== false) {
            var loops = this.loops !== undefined ? this.loops : columns.length - 1;
            var targetColumnIndex = this.targetColumnIndex || 1;

            for (var i = 0; i < loops; i++) {
                if (!this$1$1.reverse) {
                    this$1$1.uncurlLinksToLeft(columns, targetColumnIndex);
                    this$1$1.uncurlLinksToRight(columns, targetColumnIndex);
                } else {
                    this$1$1.uncurlLinksToRight(columns, targetColumnIndex);
                    this$1$1.uncurlLinksToLeft(columns, targetColumnIndex);
                }
            }
        }

        columns.forEach(sortLinks);
    },

    applyNodesOffset: function(nodes) {
        nodes.forEach(function (node) {
            var offsetX = (node.offset ? node.offset.left : 0) || 0;
            var offsetY = (node.offset ? node.offset.top : 0) || 0;
            node.x0 += offsetX;
            node.x1 += offsetX;
            node.y0 += offsetY;
            node.y1 += offsetY;
        });
    },

    calculateLinkBreadths: function(nodes) {
        nodes.forEach(function (node) {
            var sourceLinks = node.sourceLinks;
            var targetLinks = node.targetLinks;
            var y = node.y0;
            var y1 = y;
            sourceLinks.forEach(function (link) {
                link.x0 = link.source.x1;
                link.y0 = y + link.width / 2;
                y += link.width;
            });
            targetLinks.forEach(function (link) {
                link.x1 = link.target.x0;
                link.y1 = y1 + link.width / 2;
                y1 += link.width;
            });
        });
    },

    uncurlLinksToRight: function(columns, targetColumnIndex) {
        var this$1$1 = this;

        var n = columns.length;
        for (var i = targetColumnIndex; i < n; i++) {
            var column = columns[i];
            column.forEach(function (target) {
                var y = 0;
                var sum = 0;
                target.targetLinks.forEach(function (link) {
                    var kValue = link.value * (target.layer - link.source.layer);
                    y += this$1$1.targetTopPos(link.source, target) * kValue;
                    sum += kValue;
                });

                var dy = y === 0 ? 0 : (y / sum - target.y0);
                target.y0 += dy;
                target.y1 += dy;
                sortLinks([target]);
            });
            column.sort(sortAsc);
            this$1$1.arrangeNodesVertically(column);
        }
    },

    uncurlLinksToLeft: function(columns, targetColumnIndex) {
        var this$1$1 = this;

        var l = columns.length;
        var startIndex = l - 1 - targetColumnIndex;
        for (var i = startIndex; i >= 0; i--) {
            var column = columns[i];
            var loop = function ( j ) {
                var source = column[j];
                var y = 0;
                var sum = 0;
                source.sourceLinks.forEach(function (link) {
                    var kValue = link.value * (link.target.layer - source.layer);
                    y += this$1$1.sourceTopPos(source, link.target) * kValue;
                    sum += kValue;
                });
                var dy = y === 0 ? 0 : (y / sum - source.y0);
                source.y0 += dy;
                source.y1 += dy;
                sortLinks([source]);
            };

            for (var j = 0; j < column.length; j++) loop( j );

            column.sort(sortAsc);
            this$1$1.arrangeNodesVertically(column);
        }
    },

    arrangeNodesVertically: function(nodes) {
        var startIndex = 0;
        var endIndex = nodes.length - 1;

        this.arrangeUp(nodes, this.height, endIndex);
        this.arrangeDown(nodes, this.offsetY, startIndex);
    },

    arrangeDown: function(nodes, yPos, index) {
        var this$1$1 = this;

        var currentY = yPos;

        for (var i = index; i < nodes.length; i++) {
            var node = nodes[i];
            var dy = Math.max(0, currentY - node.y0);
            node.y0 += dy;
            node.y1 += dy;
            currentY = node.y1 + this$1$1.nodePadding;
        }
    },

    arrangeUp: function(nodes, yPos, index) {
        var this$1$1 = this;

        var currentY = yPos;
        for (var i = index; i >= 0; --i) {
            var node = nodes[i];
            var dy = Math.max(0, node.y1 - currentY);
            node.y0 -= dy;
            node.y1 -= dy;
            currentY = node.y0 - this$1$1.nodePadding;
        }
    },

    sourceTopPos: function(source, target) {
        var this$1$1 = this;

        var y = target.y0 - ((target.targetLinks.length - 1) * this.nodePadding) / 2;
        for (var i = 0; i < target.targetLinks.length; i++) {
            var link = target.targetLinks[i];
            if (link.source === source) {
                break;
            }
            y += link.width + this$1$1.nodePadding;
        }
        for (var i$1 = 0; i$1 < source.sourceLinks.length; i$1++) {
            var link$1 = source.sourceLinks[i$1];
            if (link$1.target === target) {
                break;
            }
            y -= link$1.width;
        }
        return y;
    },

    targetTopPos: function(source, target) {
        var this$1$1 = this;

        var y = source.y0 - ((source.sourceLinks.length - 1) * this.nodePadding) / 2;
        for (var i = 0; i < source.sourceLinks.length; i++) {
            var link = source.sourceLinks[i];
            if (link.target === target) {
                break;
            }
            y += link.width + this$1$1.nodePadding;
        }
        for (var i$1 = 0; i$1 < target.targetLinks.length; i$1++) {
            var link$1 = target.targetLinks[i$1];
            if (link$1.source === source) {
                break;
            }
            y -= link$1.width;
        }
        return y;
    }
});

var calculateSankey = function (options) { return new Sankey$1(options).calculate(); };

var crossesValue = function (links) {
    var value = 0;
    var linksLength = links.length;

    for (var i = 0; i < linksLength; i++) {
        var link = links[i];

        for (var lNext = i + 1; lNext < linksLength; lNext++) {
            var nextLink = links[lNext];

            if (intersect(link, nextLink)) {
                value += Math.min(link.value, nextLink.value);
            }
        }
    }

    return value;
};

function rotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
    var expression1 = (p3y - p1y) * (p2x - p1x);
    var expression2 = (p2y - p1y) * (p3x - p1x);

    if (expression1 > expression2) {
        return 1;
    } else if (expression1 === expression2) {
        return 0;
    }

    return -1;
}

function intersect(link1, link2) {
    var f1 = rotationDirection(link1.x0, link1.y0, link1.x1, link1.y1, link2.x1, link2.y1);
    var f2 = rotationDirection(link1.x0, link1.y0, link1.x1, link1.y1, link2.x0, link2.y0);
    var f3 = rotationDirection(link1.x0, link1.y0, link2.x0, link2.y0, link2.x1, link2.y1);
    var f4 = rotationDirection(link1.x1, link1.y1, link2.x0, link2.y0, link2.x1, link2.y1);

    return f1 !== f2 && f3 !== f4;
}

var SankeyElement = (function (Class$$1) {
    function SankeyElement(options) {
        Class$$1.call(this);
        this.options = deepExtend({}, this.options, options);
        this.createVisual();
    }

    if ( Class$$1 ) SankeyElement.__proto__ = Class$$1;
    SankeyElement.prototype = Object.create( Class$$1 && Class$$1.prototype );
    SankeyElement.prototype.constructor = SankeyElement;

    SankeyElement.prototype.createVisual = function createVisual () {
        this.visual = this.createElement();
    };

    SankeyElement.prototype.exportVisual = function exportVisual () {
        return this.visual;
    };

    SankeyElement.prototype.createElement = function createElement () {
        var this$1$1 = this;

        var customVisual = this.options.visual;
        var visual;

        if (customVisual) {
            visual = customVisual({
                sender: this.getSender(),
                options: this.visualOptions(),
                createVisual: function () { return this$1$1.getElement(); }
            });
        } else {
            visual = this.getElement();
        }

        return visual;
    };

    SankeyElement.prototype.getSender = function getSender () {
        return this;
    };

    return SankeyElement;
}(dataviz.Class));

var Node = (function (SankeyElement$$1) {
    function Node () {
        SankeyElement$$1.apply(this, arguments);
    }

    if ( SankeyElement$$1 ) Node.__proto__ = SankeyElement$$1;
    Node.prototype = Object.create( SankeyElement$$1 && SankeyElement$$1.prototype );
    Node.prototype.constructor = Node;

    Node.prototype.getElement = function getElement () {
        var options = this.options;
        var node = options.node;
        var rect = new geometry.Rect([node.x0, node.y0], [node.x1 - node.x0, node.y1 - node.y0]);

        return drawing.Path.fromRect(rect, this.visualOptions());
    };

    Node.prototype.visualOptions = function visualOptions () {
        var options = deepExtend({}, this.options, this.options.node);

        return {
            fill: {
                color: options.color,
                opacity: options.opacity
            },
            stroke: { width: 0 },
            className: 'k-sankey-node',
            role: 'graphics-symbol',
            ariaRoleDescription: 'Node',
            ariaLabel: options.node.label.text
        };
    };

    return Node;
}(SankeyElement));

var nodeColor = function (node, nodeColors, index) { return node.color || nodeColors[index % nodeColors.length]; };

var resolveNodeOptions = function (node, options, nodeColors, index) {
    var nodeOptions = deepExtend({}, options, options.node);
    return deepExtend({},
        { color: nodeColor(node, nodeColors, index) },
        nodeOptions,
        { node: node },
        {
            visual: node.visual,
            opacity: node.opacity,
            offset: node.offset,
            color: node.color
        }
    );
};

var ref = drawing.util;
var defined = ref.defined;

var Link = (function (SankeyElement$$1) {
    function Link () {
        SankeyElement$$1.apply(this, arguments);
    }

    if ( SankeyElement$$1 ) Link.__proto__ = SankeyElement$$1;
    Link.prototype = Object.create( SankeyElement$$1 && SankeyElement$$1.prototype );
    Link.prototype.constructor = Link;

    Link.prototype.getElement = function getElement () {
        var link = this.options.link;
        var x0 = link.x0;
        var x1 = link.x1;
        var y0 = link.y0;
        var y1 = link.y1;
        var xC = (x0 + x1) / 2;

        return new drawing.Path(this.visualOptions())
            .moveTo(x0, y0).curveTo([xC, y0], [xC, y1], [x1, y1]);
    };

    Link.prototype.visualOptions = function visualOptions () {
        var options = this.options;
        var link = this.options.link;
        return {
            stroke: {
                width: options.link.width,
                color: link.color || options.color,
                opacity: defined(link.opacity) ? link.opacity : options.opacity
            }
        };
    };

    return Link;
}(SankeyElement));

var resolveLinkOptions = function (link, options, sourceNode, targetNode) {
    var linkOptions = deepExtend({},
        options,
        {
            link: link,
            opacity: link.opacity,
            color: link.color,
            colorType: link.colorType,
            visual: link.visual,
            highlight: link.highlight
        }
    );

    if (linkOptions.colorType === 'source') {
        linkOptions.color = sourceNode.options.fill.color;
    } else if (linkOptions.colorType === 'target') {
        linkOptions.color = targetNode.options.fill.color;
    }

    return linkOptions;
};

var INSIDE = 'inside';
var BEFORE = 'before';
var AFTER = 'after';

var Label = (function (SankeyElement$$1) {
    function Label () {
        SankeyElement$$1.apply(this, arguments);
    }

    if ( SankeyElement$$1 ) Label.__proto__ = SankeyElement$$1;
    Label.prototype = Object.create( SankeyElement$$1 && SankeyElement$$1.prototype );
    Label.prototype.constructor = Label;

    Label.prototype.getElement = function getElement () {
        var options = deepExtend({}, this.options, this.options.node.label);
        var node = options.node;
        var totalWidth = options.totalWidth;
        var position = options.position;
        var text = options.text;
        var offset = options.offset;

        if (!options.visible || !text) {
            return null;
        }

        var nodeBox = new Box(node.x0, node.y0, node.x1, node.y1);
        var visualOptions = this.visualOptions();
        var textbox = new dataviz.TextBox(text, visualOptions);
        textbox.reflow(new Box());
        var textSizeBox = textbox.box;

        var goesOutside = node.x1 + textSizeBox.width() > totalWidth;
        var textY = nodeBox.center().y - (textSizeBox.height() / 2);
        var side = position === BEFORE || (position === INSIDE && goesOutside) ? BEFORE : AFTER;
        var textOrigin = [side === BEFORE ? node.x0 - textSizeBox.width() : node.x1, textY];

        var textRect = new Box(textOrigin[0], textOrigin[1], textOrigin[0] + textSizeBox.width(), textOrigin[1] + textSizeBox.height());
        textRect.translate(offset.left || 0, offset.top || 0);
        textbox.reflow(textRect);

        textbox.renderVisual();

        return textbox.visual;
    };

    Label.prototype.visualOptions = function visualOptions () {
        var options = deepExtend({}, this.options, this.options.node.label);
        return {
            color: options.color,
            font: options.font,
            border: options.border,
            margin: options.margin,
            padding: options.padding,
            align: options.align,
            paintOrder: options.paintOrder,
            stroke: options.stroke,
        };
    };

    return Label;
}(SankeyElement));

setDefaultOptions(Label, {
    position: INSIDE, // inside, before, after
});

var resolveLabelOptions = function (node, options, totalWidth) { return deepExtend({},
    options,
    {
        node: node,
        totalWidth: totalWidth,
        visual: node.label.visual,
        visible: node.label.visible,
        margin: node.label.margin,
        padding: node.label.padding,
        border: node.label.border,
        align: node.label.align,
        offset: node.label.offset
    }
); };

var Title$1 = (function (SankeyElement$$1) {
    function Title$$1 () {
        SankeyElement$$1.apply(this, arguments);
    }

    if ( SankeyElement$$1 ) Title$$1.__proto__ = SankeyElement$$1;
    Title$$1.prototype = Object.create( SankeyElement$$1 && SankeyElement$$1.prototype );
    Title$$1.prototype.constructor = Title$$1;

    Title$$1.prototype.getElement = function getElement () {
        var options = this.options;
        var drawingRect = options.drawingRect;
        var text = options.text;

        if (options.visible === false || !text) {
            return null;
        }

        var title = dataviz.Title.buildTitle(text, options);

        title.reflow(drawingRect);

        title.renderVisual();
        return title.visual;
    };

    Title$$1.prototype.createElement = function createElement () {
        return this.getElement();
    };

    return Title$$1;
}(SankeyElement));

setDefaultOptions(Title$1, {
    align: constants.CENTER, // 'left', 'right', 'center'
    border: {
        width: 0
    },
    margin: dataviz.getSpacing(5),
    padding: dataviz.getSpacing(5)
});

var AREA = "area";

var sortData = function (a, b) {
    if (a.node.x0 - b.node.x0 !== 0) {
        return a.node.x0 - b.node.x0;
    }
    return a.node.y0 - b.node.y0;
};

var Legend = (function (SankeyElement$$1) {
    function Legend () {
        SankeyElement$$1.apply(this, arguments);
    }

    if ( SankeyElement$$1 ) Legend.__proto__ = SankeyElement$$1;
    Legend.prototype = Object.create( SankeyElement$$1 && SankeyElement$$1.prototype );
    Legend.prototype.constructor = Legend;

    Legend.prototype.getElement = function getElement () {
        var options = this.options;
        var drawingRect = options.drawingRect;
        var nodes = options.nodes; if (nodes === void 0) { nodes = []; }
        var item = options.item;

        if (options.visible === false || !nodes.length) {
            return null;
        }

        var data = nodes.map(function (node) { return ({
            text: (node.label && node.label.text) || '',
            area: {
                background: item.areaBackground !== undefined ? item.areaBackground : node.color,
                opacity: item.areaOpacity !== undefined ? item.areaOpacity : node.opacity
            },
            node: node,
        }); });

        data.sort(sortData);

        var legend = new ChartLegend($.extend({}, options, {data: data}));
        legend.reflow(drawingRect);

        legend.renderVisual();
        return legend.visual;
    };

    Legend.prototype.createElement = function createElement () {
        return this.getElement();
    };

    return Legend;
}(SankeyElement));

setDefaultOptions(Legend, {
    markers: { visible: false },
    item: {
        type: AREA,
        cursor: constants.POINTER,
        opacity: 1
    },
    position: constants.BOTTOM,
    align: constants.CENTER,
    border: {
        width: 0
    }
});

var LINK = 'link';
var NODE = 'node';

var Sankey = (function (Observable$$1) {
    function Sankey(element, options, theme) {
        Observable$$1.call(this);

        this._initTheme(theme);
        this._setOptions(options);
        this._initElement(element);
        this._initSurface();

        if (options && options.data) {
            this._redraw();
            this._initResizeObserver();
        }
    }

    if ( Observable$$1 ) Sankey.__proto__ = Observable$$1;
    Sankey.prototype = Object.create( Observable$$1 && Observable$$1.prototype );
    Sankey.prototype.constructor = Sankey;

    Sankey.prototype.destroy = function destroy () {
        this.unbind();
        this._destroySurface();
        this._destroyResizeObserver();
    };

    Sankey.prototype._initElement = function _initElement (element) {
        this.element = element;
        dataviz.addClass(element, [ "k-chart", "k-sankey" ]);
        element.setAttribute('role', 'graphics-document');
        element.tabIndex = element.getAttribute("tabindex") || 0;

        var ref = this.options;
        var title = ref.title;

        if (title.text) {
            element.setAttribute('aria-label', title.text);
        }

        if (title.description) {
            element.setAttribute("aria-roledescription", title.description);
        }
    };

    Sankey.prototype._initSurface = function _initSurface () {
        if (!this.surface) {
            this._destroySurface();
            this._initSurfaceElement();
            this.surface = this._createSurface();
        }
    };

    Sankey.prototype._initResizeObserver = function _initResizeObserver () {
        var this$1$1 = this;

        var observer = new ResizeObserver(function (entries) {
            entries.forEach(function (entry) {
                var ref = entry.contentRect;
                var width = ref.width;
                var height = ref.height;
                if (entry.target !== this$1$1.element ||
                    (this$1$1.size && this$1$1.size.width === width && this$1$1.size.height === height)) {
                    return;
                }
                this$1$1.size = { width: width, height: height };
                this$1$1.surface.setSize(this$1$1.size);
                this$1$1.resize = true;
                this$1$1._redraw();
            });
        });
        this._resizeObserver = observer;
        observer.observe(this.element);
    };

    Sankey.prototype._createSurface = function _createSurface () {
        return drawing.Surface.create(this.surfaceElement, {
            mouseenter: this._mouseenter.bind(this),
            mouseleave: this._mouseleave.bind(this),
            mousemove: this._mousemove.bind(this),
            click: this._click.bind(this)
        });
    };

    Sankey.prototype._initTheme = function _initTheme (theme) {
        var currentTheme = theme || this.theme || {};
        this.theme = currentTheme;
        this.options = deepExtend({}, currentTheme, this.options);
    };

    Sankey.prototype.setLinksOpacity = function setLinksOpacity (opacity) {
        var this$1$1 = this;

        this.linksVisuals.forEach(function (link) {
            this$1$1.setOpacity(link, opacity, link.linkOptions.opacity);
        });
    };

    Sankey.prototype.setLinksInactivityOpacity = function setLinksInactivityOpacity (inactiveOpacity) {
        var this$1$1 = this;

        this.linksVisuals.forEach(function (link) {
            this$1$1.setOpacity(link, inactiveOpacity, link.linkOptions.highlight.inactiveOpacity);
        });
    };

    Sankey.prototype.setOpacity = function setOpacity (link, opacity, linkValue) {
        link.options.set('stroke', $.extend({}, link.options.stroke,
            {opacity: defined(linkValue) ? linkValue : opacity}));
    };

    Sankey.prototype.trigger = function trigger (name, ev) {
        var event = $.extend({}, ev,
            {type: name,
            targetType: ev.element.type,
            dataItem: ev.element.dataItem});

        return Observable$$1.prototype.trigger.call(this, name, event);
    };

    Sankey.prototype._mouseenter = function _mouseenter (ev) {
        var element = ev.element;
        var isLink = element.type === LINK;
        var isNode = element.type === NODE;
        var isLegendItem = Boolean(element.chartElement && element.chartElement.options.node);

        if ((isLink && this.trigger('linkEnter', ev)) ||
            (isNode && this.trigger('nodeEnter', ev))) {
            return;
        }

        var ref = this.options.links;
        var highlight = ref.highlight;
        if (isLink) {
            this.setLinksInactivityOpacity(highlight.inactiveOpacity);
            this.setOpacity(element, highlight.opacity, element.linkOptions.highlight.opacity);
        } else if (isNode) {
            this.highlightLinks(element, highlight);
        } else if (isLegendItem) {
            var nodeVisual = this.nodesVisuals.get(element.chartElement.options.node.id);
            this.highlightLinks(nodeVisual, highlight);
        }
    };

    Sankey.prototype._mouseleave = function _mouseleave (ev) {
        var this$1$1 = this;

        var element = ev.element;
        var isLink = element.type === LINK;
        var isNode = element.type === NODE;
        var isLegendItem = Boolean(element.chartElement && element.chartElement.options.node);
        var target = ev.originalEvent.relatedTarget;

        if (isLink && target && target.nodeName === 'text') {
            return;
        }

        if (isLink || isNode) {
            if (this.tooltipTimeOut) {
                clearTimeout(this.tooltipTimeOut);
                this.tooltipTimeOut = null;
            }
            this.tooltipShown = false;
            this.trigger('tooltipHide', ev);
        }

        if ((isLink && this.trigger('linkLeave', ev)) ||
            (isNode && this.trigger('nodeLeave', ev))) {
            return;
        }

        if (isLink || isNode || isLegendItem) {
            this.linksVisuals.forEach(function (link) {
                this$1$1.setOpacity(link, this$1$1.options.links.opacity, link.linkOptions.opacity);
            });
        }
    };

    Sankey.prototype._mousemove = function _mousemove (ev) {
        var this$1$1 = this;

        var ref = this.options.tooltip;
        var followPointer = ref.followPointer;
        var delay = ref.delay;
        var element = ev.element;
        var tooltipElType = element.type;

        if ((tooltipElType !== LINK && tooltipElType !== NODE) || (this.tooltipShown && !followPointer)) {
            return;
        }

        var mouseEvent = ev.originalEvent;
        var rect = this.element.getBoundingClientRect();
        var isLeft = mouseEvent.clientX - rect.left < rect.width / 2;
        var isTop = mouseEvent.clientY - rect.top < rect.height / 2;

        ev.tooltipData = {
            popupOffset: {
                left: mouseEvent.pageX,
                top: mouseEvent.pageY
            },
            popupAlign: {
                horizontal: isLeft ? 'left' : 'right',
                vertical: isTop ? 'top' : 'bottom'
            }
        };

        if (tooltipElType === NODE) {
            var ref$1 = element.dataItem;
            var sourceLinks = ref$1.sourceLinks;
            var targetLinks = ref$1.targetLinks;
            var links = targetLinks.length ? targetLinks : sourceLinks;
            ev.nodeValue = links.reduce(function (acc, link) { return acc + link.value; }, 0);
        }

        if (this.tooltipTimeOut) {
            clearTimeout(this.tooltipTimeOut);
            this.tooltipTimeOut = null;
        }

        var nextDelay = followPointer && this.tooltipShown ? 0 : delay;

        this.tooltipTimeOut = setTimeout(function () {
            this$1$1.trigger('tooltipShow', ev);
            this$1$1.tooltipShown = true;
            this$1$1.tooltipTimeOut = null;
        }, nextDelay);
    };

    Sankey.prototype._click = function _click (ev) {
        var element = ev.element;
        var isLink = element.type === LINK;
        var isNode = element.type === NODE;

        if (isNode) {
            this.trigger('nodeClick', ev);
        } else if (isLink) {
            this.trigger('linkClick', ev);
        }
    };

    Sankey.prototype.highlightLinks = function highlightLinks (node, highlight) {
        var this$1$1 = this;

        if (node) {
            this.setLinksInactivityOpacity(highlight.inactiveOpacity);
            node.links.forEach(function (link) {
                this$1$1.setOpacity(link, highlight.opacity, link.linkOptions.highlight.opacity);
            });
        }
    };

    Sankey.prototype._destroySurface = function _destroySurface () {
        if (this.surface) {
            this.surface.destroy();
            this.surface = null;
            this._destroySurfaceElement();
        }
    };

    Sankey.prototype._destroyResizeObserver = function _destroyResizeObserver () {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
    };

    Sankey.prototype._initSurfaceElement = function _initSurfaceElement () {
        if (!this.surfaceElement) {
            this.surfaceElement = document.createElement('div');
            this.element.appendChild(this.surfaceElement);
        }
    };

    Sankey.prototype._destroySurfaceElement = function _destroySurfaceElement () {
        if (this.surfaceElement && this.surfaceElement.parentNode) {
            this.surfaceElement.parentNode.removeChild(this.surfaceElement);
            this.surfaceElement = null;
        }
    };

    Sankey.prototype.setOptions = function setOptions (options, theme) {
        this._setOptions(options);
        this._initTheme(theme);
        this._initSurface();
        this._redraw();
    };

    Sankey.prototype._redraw = function _redraw () {
        this.surface.clear();

        var ref = this._getSize();
        var width = ref.width;
        var height = ref.height;
        this.size = { width: width, height: height };
        this.surface.setSize(this.size);

        this.createVisual();

        this.surface.draw(this.visual);
    };

    Sankey.prototype._getSize = function _getSize () {
        return this.element.getBoundingClientRect();
    };

    Sankey.prototype.createVisual = function createVisual () {
        this.visual = this._render();
    };

    Sankey.prototype.titleBox = function titleBox (title, drawingRect) {
        if (!title || title.visible === false || !title.text) {
            return null;
        }

        var titleElement = new Title$1($.extend({}, {drawingRect: drawingRect}, title));
        var titleVisual = titleElement.exportVisual();
        return titleVisual.chartElement.box;
    };

    Sankey.prototype.legendBox = function legendBox (options, nodes, drawingRect) {
        if (!options || options.visible === false) {
            return null;
        }

        var legend = new Legend($.extend({}, {nodes: nodes}, options, {drawingRect: drawingRect}));
        var legendVisual = legend.exportVisual();

        return legendVisual.chartElement.box;
    };

    Sankey.prototype.calculateSankey = function calculateSankey$1 (calcOptions, sankeyOptions) {
        var title = sankeyOptions.title;
        var legend = sankeyOptions.legend;
        var data = sankeyOptions.data;
        var nodes = sankeyOptions.nodes;
        var labels = sankeyOptions.labels;
        var nodeColors = sankeyOptions.nodeColors;
        var disableAutoLayout = sankeyOptions.disableAutoLayout;
        var autoLayout = !disableAutoLayout;

        var sankeyBox = new Box(0, 0, calcOptions.width, calcOptions.height);
        var titleBox = this.titleBox(title, sankeyBox);

        var legendArea = sankeyBox.clone();

        if (titleBox) {
            var titleHeight = titleBox.height();
            if (title.position === constants.TOP) {
                sankeyBox.unpad({ top: titleHeight });
                legendArea = new Box(0, titleHeight, calcOptions.width, calcOptions.height);
            } else {
                sankeyBox.shrink(0, titleHeight);
                legendArea = new Box(0, 0, calcOptions.width, calcOptions.height - titleHeight);
            }
        }

        var legendBox = this.legendBox(legend, data.nodes, legendArea);
        var legendPosition = (legend && legend.position) || Legend.prototype.options.position;

        if (legendBox) {
            if (legendPosition === constants.LEFT) {
                sankeyBox.unpad({ left: legendBox.width() });
            }

            if (legendPosition === constants.RIGHT) {
                sankeyBox.shrink(legendBox.width(), 0);
            }

            if (legendPosition === constants.TOP) {
                sankeyBox.unpad({ top: legendBox.height() });
            }

            if (legendPosition === constants.BOTTOM) {
                sankeyBox.shrink(0, legendBox.height());
            }
        }

        var ref = calculateSankey($.extend({}, calcOptions, {offsetX: 0, offsetY: 0, width: sankeyBox.width(), height: sankeyBox.height()}));
        var calculatedNodes = ref.nodes;
        var circularLinks = ref.circularLinks;
        if (circularLinks) {
            console.warn('Circular links detected. Kendo Sankey diagram does not support circular links.');
            return { sankey: { nodes: [], links: [], circularLinks: circularLinks }, legendBox: legendBox, titleBox: titleBox };
        }

        var box = new Box();

        calculatedNodes.forEach(function (nodeEl, i) {
            var nodeOps = resolveNodeOptions(nodeEl, nodes, nodeColors, i);
            var nodeInstance = new Node(nodeOps);
            box.wrap(dataviz.rectToBox(nodeInstance.exportVisual().rawBBox()));

            var labelInstance = new Label(resolveLabelOptions(nodeEl, labels, sankeyBox.width()));
            var labelVisual = labelInstance.exportVisual();
            if (labelVisual) {
                box.wrap(dataviz.rectToBox(labelVisual.rawBBox()));
            }
        });

        var offsetX = sankeyBox.x1;
        var offsetY = sankeyBox.y1;

        var width = sankeyBox.width() + offsetX;
        var height = sankeyBox.height() + offsetY;

        width -= box.x2 > sankeyBox.width() ? box.x2 - sankeyBox.width() : 0;
        height -= box.y2 > sankeyBox.height() ? box.y2 - sankeyBox.height() : 0;

        offsetX += box.x1 < 0 ? -box.x1 : 0;
        offsetY += box.y1 < 0 ? -box.y1 : 0;

        if (autoLayout === false) {
            return {
                sankey: calculateSankey($.extend({}, calcOptions, {offsetX: offsetX, offsetY: offsetY, width: width, height: height, autoLayout: false})),
                legendBox: legendBox,
                titleBox: titleBox
            };
        }

        if (this.resize && autoLayout && this.permutation) {
            this.resize = false;
            return {
                sankey: calculateSankey($.extend({}, calcOptions, {offsetX: offsetX, offsetY: offsetY, width: width, height: height}, this.permutation)),
                legendBox: legendBox,
                titleBox: titleBox
            };
        }

        var startColumn = 1;
        var loops = 2;
        var columnsLength = calculateSankey($.extend({}, calcOptions, {offsetX: offsetX, offsetY: offsetY, width: width, height: height, autoLayout: false})).columns.length;
        var results = [];

        var permutation = function (targetColumnIndex, reverse) {
            var currPerm = calculateSankey($.extend({}, calcOptions, {offsetX: offsetX, offsetY: offsetY, width: width, height: height, loops: loops, targetColumnIndex: targetColumnIndex, reverse: reverse}));
            var crosses = crossesValue(currPerm.links);
            results.push({
                crosses: crosses,
                reverse: reverse,
                targetColumnIndex: targetColumnIndex
            });
            return crosses === 0;
        };

        for (var index = startColumn; index <= columnsLength - 1; index++) {
            if (permutation(index, false) || permutation(index, true)) {
                break;
            }
        }

        var minCrosses = Math.min.apply(null, results.map(function (r) { return r.crosses; }));
        var bestResult = results.find(function (r) { return r.crosses === minCrosses; });
        this.permutation = { targetColumnIndex: bestResult.targetColumnIndex, reverse: bestResult.reverse };
        var result = calculateSankey($.extend({}, calcOptions, {offsetX: offsetX, offsetY: offsetY, width: width, height: height}, this.permutation));

        return {
            sankey: result,
            legendBox: legendBox,
            titleBox: titleBox
        };
    };

    Sankey.prototype._render = function _render (options, context) {
        var sankeyOptions = options || this.options;
        var sankeyContext = context || this;

        var data = sankeyOptions.data;
        var labelOptions = sankeyOptions.labels;
        var nodesOptions = sankeyOptions.nodes;
        var linkOptions = sankeyOptions.links;
        var nodeColors = sankeyOptions.nodeColors;
        var title = sankeyOptions.title;
        var legend = sankeyOptions.legend;
        var ref = sankeyContext.size;
        var width = ref.width;
        var height = ref.height;

        var calcOptions = $.extend({}, data, {width: width, height: height, nodesOptions: nodesOptions, title: title, legend: legend});
        var ref$1 = this.calculateSankey(calcOptions, sankeyOptions);
        var sankey = ref$1.sankey;
        var titleBox = ref$1.titleBox;
        var legendBox = ref$1.legendBox;
        var nodes = sankey.nodes;
        var links = sankey.links;

        var visual = new drawing.Group({
            clip: drawing.Path.fromRect(new geometry.Rect([0, 0], [width, height]))
        });

        if (titleBox) {
            var titleElement = new Title$1($.extend({}, title, {drawingRect: titleBox}));
            var titleVisual = titleElement.exportVisual();
            visual.append(titleVisual);
        }

        if (sankey.circularLinks) {
            return visual;
        }

        var visualNodes = new Map();
        sankeyContext.nodesVisuals = visualNodes;

        nodes.forEach(function (node, i) {
            var nodeOps = resolveNodeOptions(node, nodesOptions, nodeColors, i);

            var nodeInstance = new Node(nodeOps);
            var nodeVisual = nodeInstance.exportVisual();
            nodeVisual.links = [];
            nodeVisual.type = NODE;

            node.color = nodeOps.color;
            node.opacity = nodeOps.opacity;

            nodeVisual.dataItem = $.extend({}, data.nodes[i],
                {color: nodeOps.color,
                opacity: nodeOps.opacity,
                sourceLinks: node.sourceLinks.map(function (link) { return ({ sourceId: link.sourceId, targetId: link.targetId, value: link.value }); }),
                targetLinks: node.targetLinks.map(function (link) { return ({ sourceId: link.sourceId, targetId: link.targetId, value: link.value }); })});
            visualNodes.set(node.id, nodeVisual);

            visual.append(nodeVisual);
        });

        var sortedLinks = links.slice().sort(function (a, b) { return b.value - a.value; });

        var linksVisuals = [];
        sankeyContext.linksVisuals = linksVisuals;

        sortedLinks.forEach(function (link) {
            var source = link.source;
            var target = link.target;
            var sourceNode = visualNodes.get(source.id);
            var targetNode = visualNodes.get(target.id);
            var linkOps = resolveLinkOptions(link, linkOptions, sourceNode, targetNode);
            var linkInstance = new Link(linkOps);
            var linkVisual = linkInstance.exportVisual();

            linkVisual.type = LINK;
            linkVisual.dataItem = {
                source: $.extend({}, sourceNode.dataItem),
                target: $.extend({}, targetNode.dataItem),
                value: link.value
            };
            linkVisual.linkOptions = linkOps;
            linksVisuals.push(linkVisual);

            sourceNode.links.push(linkVisual);
            targetNode.links.push(linkVisual);

            visual.append(linkVisual);
        });

        var diagramWidth = nodes.reduce(function (acc, node) { return Math.max(acc, node.x1); }, 0);
        nodes.forEach(function (node) {
            var textOps = resolveLabelOptions(node, labelOptions, diagramWidth);
            var labelInstance = new Label(textOps);
            var labelVisual = labelInstance.exportVisual();

            if (labelVisual) {
                visual.append(labelVisual);
            }
        });

        if (legendBox) {
            var legendElement = new Legend($.extend({}, legend, {drawingRect: legendBox, nodes: nodes}));
            var legendVisual = legendElement.exportVisual();
            visual.append(legendVisual);
        }

        return visual;
    };

    Sankey.prototype.exportVisual = function exportVisual (exportOptions) {
        var options = (exportOptions && exportOptions.options) ?
            deepExtend({}, this.options, exportOptions.options) : this.options;

        var context = {
            size: {
                width: defined(exportOptions && exportOptions.width) ? exportOptions.width : this.size.width,
                height: defined(exportOptions && exportOptions.height) ? exportOptions.height : this.size.height
            }
        };

        return this._render(options, context);
    };

    Sankey.prototype._setOptions = function _setOptions (options) {
        this.options = deepExtend({}, this.options, options);
    };

    return Sankey;
}(dataviz.Observable));

setDefaultOptions(Sankey, {
    title: {
        position: constants.TOP, // 'top', 'bottom'
    },
    labels: {
        visible: true,
        margin: {
            left: 8,
            right: 8
        },
        padding: 0,
        border: {
            width: 0
        },
        paintOrder: 'stroke',
        stroke: {
            lineJoin: "round",
            width: 1
        },
        align: constants.LEFT,
        offset: { left: 0, top: 0 }
    },
    nodes: {
        width: 24,
        padding: 16,
        opacity: 1,
        align: 'stretch', // 'left', 'right', 'stretch'
        offset: { left: 0, top: 0 }
    },
    links: {
        colorType: 'static', // 'source', 'target', 'static'
        opacity: 0.4,
        highlight: {
            opacity: 0.8,
            inactiveOpacity: 0.2
        }
    },
    tooltip: {
        followPointer: false,
        delay: 200
    }
});

var createSankeyData = function (data, dimensions, measure) {
    var nodes = new Set();
    var links = new Map();
    var linksMap = new Map();

    data.forEach(function (row) {
        dimensions.forEach(function (dimension) {
            nodes.add(dimension.value(row));
        });

        for (var i = 0; i < dimensions.length - 1; i++) {
            var source = dimensions[i].value(row);
            var target = dimensions[i + 1].value(row);
            var key = source + "_" + target;
            var value = measure.value(row);
            var existingValue = links.get(key);

            if (existingValue !== undefined) {
                links.set(key, existingValue + value);
            } else {
                links.set(key, value);
                linksMap.set(key, { source: source, target: target });
            }
        }
    });

    var nodesId = new Map();
    var nodesArray = Array.from(nodes).map(function (node, index) {
        nodesId.set(node, index);
        return { id: index, label: { text: String(node) } };
    });

    var linksArray = Array.from(links).map(function (ref) {
        var key = ref[0];
        var value = ref[1];

        var ref$1 = linksMap.get(key);
        var source = ref$1.source;
        var target = ref$1.target;
        return {
            sourceId: nodesId.get(source),
            targetId: nodesId.get(target),
            value: value
        };
    });

    return { nodes: nodesArray, links: linksArray };
};

kendo.deepExtend(kendo.dataviz, {
    Sankey: Sankey,
    createSankeyData: createSankeyData
});

})(window.kendo.jQuery);

(function($) {
    var kendo = window.kendo;
    var Widget = kendo.ui.Widget;

    var encode = kendo.htmlEncode;
    var styleAttr = '__style';
    var tooltipContentWrapStyle = `${styleAttr}="display: flex; align-items: center;"`;
    var space = 3;
    var TootipText = (text) => `<span ${styleAttr}="margin: 0 ${space}px">${text}</span>`;
    var Square = (color) => `<div ${styleAttr}="width: 15px; height: 15px; background-color: ${color}; display: inline-flex; margin-left: ${space}px"></div>`;
    var TooltipTemplates = {
        node: function({ dataItem, value }) {
            const { color, label } = dataItem;
            return (
                `<div ${tooltipContentWrapStyle}>
                    ${Square(color)}
                    ${TootipText(encode(label.text))}
                    ${TootipText(value)}
                </div>`
            );
        },
        link: function({ dataItem, value }) {
            const { source, target } = dataItem;
            return (
                `<div ${tooltipContentWrapStyle}>
                    ${Square(source.color)}
                    ${TootipText(encode(source.label.text))}
                    ${TootipText(kendo.ui.icon({ icon: "arrow-right" }))}
                    ${Square(target.color)}
                    ${TootipText(encode(target.label.text))}
                    ${TootipText(value)}
                </div>`
            );
        }
    };

    var SankeyTooltip = Widget.extend({
        init: function(element, options) {
            this.options = options;

            Widget.fn.init.call(this, element);

            this.element.addClass('k-tooltip k-chart-tooltip k-chart-shared-tooltip')
                .append('<div class="k-tooltip-content"></div>');
        },

        size: function() {
            return {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
        },

        setContent: function(content) {
            this.element.find('.k-tooltip-content').html(content);
            this.element.find(`[${styleAttr}]`).each((i, el) => {
                el.getAttribute(styleAttr)
                    .split(';')
                    .filter(s => s !== '')
                    .forEach(s => {
                        const parts = s.split(':');
                        el.style[parts[0].trim()] = parts[1].trim();
                    });
                el.removeAttribute(styleAttr);
            });
        },

        setPosition: function(popupAlign, popupOffset, offsetOption) {
            const size = this.size();
            const offset = { ...popupOffset };

            offset.left += (popupAlign.horizontal === 'left') ? offsetOption : (-1 * offsetOption);
            if (popupAlign.horizontal === 'right') {
                offset.left -= size.width;
            }

            if (popupAlign.vertical === 'bottom') {
                offset.top -= size.height + offsetOption;
            } else {
                offset.top += offsetOption;
            }

            this.element.css(offset);
        },

        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        },

        destroy: function() {
            this.element.remove();
        }
    });

    kendo.deepExtend(kendo.dataviz, {
        SankeyTooltip: {
            Tooltip: SankeyTooltip,
            ContentTemplates: TooltipTemplates
        }
    });
})(window.kendo.jQuery);

(function($) {
    var kendo = window.kendo;
    var template = kendo.template;
    var Widget = kendo.ui.Widget;
    var dataviz = kendo.dataviz;
    var defined = dataviz.defined;
    var encode = kendo.htmlEncode;
    var KendoSankey = dataviz.Sankey;
    var NODE_CLICK = "nodeClick";
    var LINK_CLICK = "linkClick";
    var NODE_ENTER = "nodeEnter";
    var NODE_LEAVE = "nodeLeave";
    var LINK_ENTER = "linkEnter";
    var LINK_LEAVE = "linkLeave";
    var TOOLTIP_SHOW = "tooltipShow";
    var TOOLTIP_HIDE = "tooltipHide";
    var NODE = 'node';

    const { Tooltip, ContentTemplates } = dataviz.SankeyTooltip;

    var Sankey = Widget.extend({
        init: function(element, userOptions) {
            kendo.destroy(element);
            $(element).empty();

            this.options = kendo.deepExtend(this.options, userOptions);

            Widget.fn.init.call(this, element);

            this.wrapper = this.element;
            this._initSankey();

            this._attachEvents();

            kendo.notify(this, dataviz.ui);

            if (this._showWatermarkOverlay) {
                this._showWatermarkOverlay(this.wrapper[0]);
            }
        },

        setOptions: function(options) {
            var currentOptions = this.options;

            this.events.forEach(eventName => {
                if (currentOptions[eventName]) {
                    this.unbind(eventName, currentOptions[eventName]);
                }
            });

            this._instance.setOptions(options);

            this.bind(this.events, this._instance.options);
        },

        _initSankey: function() {
            const themeOptions = this._getThemeOptions(this.options);
            const { seriesColors: nodeColors, axisDefaults, seriesDefaults, legend, title } = themeOptions;
            const { line: links, labels } = axisDefaults;
            const strokeColor = seriesDefaults.labels.background;

            this._createSankey(this.options, { nodeColors, links, labels: { ...labels, stroke: { color: strokeColor } }, legend, title });
            this.options = this._instance.options;
        },

        _createSankey: function(options, themeOptions) {
            this._instance = new KendoSankey(this.element[0], options, themeOptions);
        },

        _getThemeOptions: function(userOptions) {
            var themeName = (userOptions || {}).theme;

            if (themeName && dataviz.SASS_THEMES.indexOf(themeName.toLowerCase()) !== -1) {
                return dataviz.autoTheme().chart;
            }

            if (defined(themeName)) {
                var themes = dataviz.ui.themes || {};
                var theme = themes[themeName] || themes[themeName.toLowerCase()] || {};
                return theme.chart || {};
            }
        },

        _attachEvents: function() {
            this.events.forEach(eventName => {
                this._instance.bind(eventName, event => {
                    if (this._events[eventName]) {
                        this._events[eventName].forEach(handler => handler.call(undefined, event));
                    }
                });
            });

            this._instance.bind(TOOLTIP_SHOW, this.tooltipShow.bind(this));
            this._instance.bind(TOOLTIP_HIDE, this.tooltipHide.bind(this));
        },

        tooltipShow: function(e) {
            if (!this._tooltip) {
                const doc = this.element[0].ownerDocument;
                this._tooltip = new Tooltip(doc.createElement('div'), {});
                const { appendTo = doc.body } = this.options.tooltip;
                this._tooltip.element.appendTo($(appendTo));
            }

            const { nodeTemplate, linkTemplate, offset } = this.options.tooltip;
            const currentTemplate = template((e.targetType === NODE ? nodeTemplate : linkTemplate) || ContentTemplates[e.targetType]);
            const value = encode(kendo.format(this.options.messages.tooltipUnits, defined(e.nodeValue) ? e.nodeValue : e.dataItem.value));

            this._tooltip.setContent(currentTemplate({ dataItem: e.dataItem, value }));
            this._tooltip.setPosition(e.tooltipData.popupAlign, e.tooltipData.popupOffset, offset);
            this._tooltip.show();
        },

        tooltipHide: function() {
            if (this._tooltip) {
                this._tooltip.destroy();
                this._tooltip = null;
            }
        },

        exportVisual: function(exportOptions) {
            return this._instance.exportVisual(exportOptions);
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.tooltipHide();
            this._instance.destroy();
            this._instance = null;
        },

        events: [
            NODE_CLICK,
            LINK_CLICK,
            NODE_ENTER,
            NODE_LEAVE,
            LINK_ENTER,
            LINK_LEAVE
        ],
        options: {
            name: "Sankey",
            theme: "default",
            tooltip: {
                offset: 12
            },
            messages: {
                tooltipUnits: "({0} Units)"
            }
        }
    });

    dataviz.ExportMixin.extend(Sankey.fn);

    if (kendo.PDFMixin) {
        kendo.PDFMixin.extend(Sankey.fn);
    }

    dataviz.ui.plugin(Sankey);

    kendo.deepExtend(dataviz, {
        Sankey
    });

})(window.kendo.jQuery);

let __meta__ = {
    id: "dataviz.sankey",
    name: "Sankey",
    category: "dataviz",
    description: "The Sankey widget uses modern browser technologies to render high-quality data visualizations in the browser.",
    depends: [ "data", "userevents", "drawing", "dataviz.core", "dataviz.themes" ],
    features: [{
        id: "dataviz.sankey-pdf-export",
        name: "PDF export",
        description: "Export Sankey as PDF",
        depends: [ "pdf" ]
    }]
};

var kendo$1 = kendo;

export { kendo$1 as default };
