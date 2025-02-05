import './kendo.core.js';

var __meta__ = {
    id: "dom",
    name: "Virtual DOM",
    category: "framework",
    depends: [ "core" ],
    advanced: true
};

(function(kendo) {
    function Node() {
        this.node = null;
    }

    Node.prototype = {
        remove: function() {
            if (this.node.parentNode) {
                this.node.parentNode.removeChild(this.node);
            }
            this.attr = {};
        },
        attr: {},
        text: function() {
            return "";
        }
    };

    function NullNode() {
    }

    NullNode.prototype = {
        nodeName: "#null",
        attr: { style: {} },
        children: [],
        remove: function() {
        }
    };

    var NULL_NODE = new NullNode();

    function Element(nodeName, attr, children) {
        this.nodeName = nodeName;

        this.attr = attr || {};

        this.children = children || [];
    }

    Element.prototype = new Node();

    Element.prototype.appendTo = function(parent) {
        var node = typeof(this.nodeName) === "string" ? document.createElement(this.nodeName) : this.nodeName;

        var children = this.children;

        for (var index = 0; index < children.length; index++) {
            children[index].render(node, NULL_NODE);
        }

        parent.appendChild(node);

        return node;
    };

    Element.prototype.render = function(parent, cached) {
        var node;

        if (cached.nodeName !== this.nodeName) {
            cached.remove();

            node = this.appendTo(parent);
        } else {
            node = cached.node;

            var index;

            var children = this.children;

            var length = children.length;

            var cachedChildren = cached.children;

            var cachedLength = cachedChildren.length;

            if (Math.abs(cachedLength - length) > 2) {
                this.render({
                    appendChild: function(node) {
                        parent.replaceChild(node, cached.node);
                    }
                }, NULL_NODE);

                return;
            }

            for (index = 0; index < length; index++) {
                children[index].render(node, cachedChildren[index] || NULL_NODE);
            }

            for (index = length; index < cachedLength; index++) {
                cachedChildren[index].remove();
            }
        }

        this.node = node;

        this.syncAttributes(cached.attr);

        this.removeAttributes(cached.attr);
    };

    Element.prototype.syncAttributes = function(cachedAttr) {
        var attr = this.attr;

        for (var name in attr) {
            var value = attr[name];

            var cachedValue = cachedAttr[name];

            if (name === "style") {
                this.setStyle(value, cachedValue);
            } else if (value !== cachedValue) {
                this.setAttribute(name, value, cachedValue);
            }
        }
    };

    Element.prototype.setStyle = function(style, cachedValue) {
        var node = this.node;
        var key;

        if (cachedValue) {
            for (key in style) {
                if (style[key] !== cachedValue[key]) {
                    node.style[key] = style[key];
                }
            }
        } else {
            for (key in style) {
                node.style[key] = style[key];
            }
        }
    };

    Element.prototype.removeStyle = function(cachedStyle) {
        var style = this.attr.style || {};
        var node = this.node;

        for (var key in cachedStyle) {
            if (style[key] === undefined) {
                node.style[key] = "";
            }
        }
    };

    Element.prototype.removeAttributes = function(cachedAttr) {
        var attr = this.attr;

        for (var name in cachedAttr) {
            if (name === "style") {
                this.removeStyle(cachedAttr.style);
            } else if (attr[name] === undefined) {
                this.removeAttribute(name);
            }
        }
    };

    Element.prototype.removeAttribute = function(name) {
        var node = this.node;

        if (name === "style") {
            node.style.cssText = "";
        } else if (name === "className") {
            node.className = "";
        } else {
            node.removeAttribute(name);
        }
    };

    Element.prototype.setAttribute = function(name, value) {
        var node = this.node;

        if (node[name] !== undefined) {
            node[name] = value;
        } else {
            node.setAttribute(name, value);
        }
    };

    Element.prototype.text = function() {
        var str = "";
        for (var i = 0; i < this.children.length; ++i) {
            str += this.children[i].text();
        }
        return str;
    };

    function TextNode(nodeValue, force) {
        this.nodeValue = String(nodeValue);
        this.force = force;
    }

    TextNode.prototype = new Node();

    TextNode.prototype.nodeName = "#text";

    TextNode.prototype.render = function(parent, cached) {
        var node;

        if (cached.nodeName !== this.nodeName || this.force) {
            cached.remove();

            node = document.createTextNode(this.nodeValue);

            parent.appendChild(node);
        } else {
            node = cached.node;

            if (this.nodeValue !== cached.nodeValue) {
                if (node.parentNode) {
                    // sometimes in IE parentNode is null (reason unknown),
                    // and IE throws an error when you try to set a
                    // parentless' nodeValue, because why not.
                    node.nodeValue = this.nodeValue;
                }
            }
        }

        this.node = node;
    };

    TextNode.prototype.text = function() {
        return this.nodeValue;
    };

    function HtmlNode(html, replace) {
        this.html = html;
        this.replace = replace;
    }

    HtmlNode.prototype = {
       nodeName: "#html",
       attr: {},
       remove: function() {
           for (var index = 0; index < this.nodes.length; index++) {
               var el = this.nodes[index];
               if (el.parentNode) {
                   el.parentNode.removeChild(el);
               }
           }
       },
       render: function(parent, cached) {
        var lastChild, replacedNode;
           if (cached.nodeName !== this.nodeName || cached.html !== this.html || this.replace) {
               if (this.replace && cached.replace && cached.nodes && cached.nodes.length && cached.nodes[0].outerHTML) {
                // This could be changed to a for loop that replaces several nodes instead of the first one. Presently, there is no use-case scenario for that.
                replacedNode = replaceNode(parent, cached.nodes[0], this.html);
                lastChild = parent.lastChild;
               } else {
                cached.remove();
                lastChild = parent.lastChild;
                insertHtml(parent, this.html);
               }
               this.nodes = [];

               if (replacedNode) {
                this.nodes.push(replacedNode);
               }

               for (var child = lastChild ? lastChild.nextSibling : parent.firstChild; child; child = child.nextSibling) {
                   this.nodes.push(child);
               }
           } else {
               this.nodes = cached.nodes.slice(0);
           }
       }
    };

    var HTML_CONTAINER = document.createElement("div");

    function insertHtml(node, html) {
        HTML_CONTAINER.innerHTML = html;

        while (HTML_CONTAINER.firstChild) {
            node.appendChild(HTML_CONTAINER.firstChild);
        }
    }

    function replaceNode(parent, node, html) {
        var firstChild;

        HTML_CONTAINER.innerHTML = html;
        firstChild = HTML_CONTAINER.firstChild;

        parent.replaceChild(firstChild, node);

        return firstChild;
    }

    function html(value, force) {
        return new HtmlNode(value, force);
    }

    function element(nodeName, attrs, children) {
        return new Element(nodeName, attrs, children);
    }

    function text(value, force) {
        return new TextNode(value, force);
    }

    function Tree(root) {
       this.root = root;
       this.children = [];
    }

    Tree.prototype = {
        html: html,
        element: element,
        text: text,
        render: function(children) {
            var cachedChildren = this.children;

            var index;

            var length;

            for (index = 0, length = children.length; index < length; index++) {
                var cached = cachedChildren[index];
                if (!cached) {
                    cached = NULL_NODE;
                } else if (!cached.node || !cached.node.parentNode) {
                    cached.remove();
                    cached = NULL_NODE;
                }
                children[index].render(this.root, cached);
            }

            for (index = length; index < cachedChildren.length; index++) {
                cachedChildren[index].remove();
            }

            this.children = children;
        }
    };

    kendo.dom = {
        html: html,
        text: text,
        element: element,
        Tree: Tree,
        Node: Node
    };
})(window.kendo);
