module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1134);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 1057:
/***/ (function(module, exports) {

	module.exports = require("./kendo.core");

/***/ }),

/***/ 1134:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1057) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	var __meta__ = { // jshint ignore:line
	    id: "data.xml",
	    name: "XML",
	    category: "framework",
	    depends: [ "core" ],
	    hidden: true
	};

	/*jshint  eqnull: true, boss: true */
	(function($, undefined) {
	    var kendo = window.kendo,
	        isArray = Array.isArray,
	        isPlainObject = $.isPlainObject,
	        map = $.map,
	        each = $.each,
	        extend = $.extend,
	        getter = kendo.getter,
	        Class = kendo.Class;

	    var XmlDataReader = Class.extend({
	        init: function(options) {
	            var that = this,
	                total = options.total,
	                model = options.model,
	                parse = options.parse,
	                errors = options.errors,
	                serialize = options.serialize,
	                data = options.data;

	            if (model) {
	                if (isPlainObject(model)) {
	                    var base = options.modelBase || kendo.data.Model;

	                    if (model.fields) {
	                        each(model.fields, function(field, value) {
	                            if (isPlainObject(value) && value.field) {
	                                if (!kendo.isFunction(value.field)) {
	                                    value = extend(value, { field: that.getter(value.field) });
	                                }
	                            } else {
	                                value = { field: that.getter(value) };
	                            }
	                            model.fields[field] = value;
	                        });
	                    }

	                    var id = model.id;
	                    if (id) {
	                        var idField = {};

	                        idField[that.xpathToMember(id, true)] = { field : that.getter(id) };
	                        model.fields = extend(idField, model.fields);
	                        model.id = that.xpathToMember(id);
	                    }
	                    model = base.define(model);
	                }

	                that.model = model;
	            }

	            if (total) {
	                if (typeof total == "string") {
	                    total = that.getter(total);
	                    that.total = function(data) {
	                        return parseInt(total(data), 10);
	                    };
	                } else if (typeof total == "function"){
	                    that.total = total;
	                }
	            }

	            if (errors) {
	                if (typeof errors == "string") {
	                    errors = that.getter(errors);
	                    that.errors = function(data) {
	                        return errors(data) || null;
	                    };
	                } else if (typeof errors == "function"){
	                    that.errors = errors;
	                }
	            }

	            if (data) {
	                if (typeof data == "string") {
	                    data = that.xpathToMember(data);
	                    that.data = function(value) {
	                        var result = that.evaluate(value, data),
	                            modelInstance;

	                        result = isArray(result) ? result : [result];

	                        if (that.model && model.fields) {
	                            modelInstance = new that.model();

	                            return map(result, function(value) {
	                                if (value) {
	                                    var record = {}, field;

	                                    for (field in model.fields) {
	                                        record[field] = modelInstance._parse(field, model.fields[field].field(value));
	                                    }

	                                    return record;
	                                }
	                            });
	                        }

	                        return result;
	                    };
	                } else if (typeof data == "function") {
	                    that.data = data;
	                }
	            }

	            if (typeof parse == "function") {
	                var xmlParse = that.parse;

	                that.parse = function(data) {
	                    var xml = parse.call(that, data);
	                    return xmlParse.call(that, xml);
	                };
	            }

	            if (typeof serialize == "function") {
	                that.serialize = serialize;
	            }
	        },
	        total: function(result) {
	            return this.data(result).length;
	        },
	        errors: function(data) {
	            return data ? data.errors : null;
	        },
	        serialize: function(data) {
	            return data;
	        },
	        parseDOM: function(element) {
	            var result = {},
	                parsedNode,
	                node,
	                nodeType,
	                nodeName,
	                member,
	                attribute,
	                attributes = element.attributes,
	                attributeCount = attributes.length,
	                idx;

	            for (idx = 0; idx < attributeCount; idx++) {
	                attribute = attributes[idx];
	                result["@" + attribute.nodeName] = attribute.nodeValue;
	            }

	            for (node = element.firstChild; node; node = node.nextSibling) {
	                nodeType = node.nodeType;

	                if (nodeType === 3 || nodeType === 4) {
	                    // text nodes or CDATA are stored as #text field
	                    result["#text"] = node.nodeValue;
	                } else if (nodeType === 1) {
	                    // elements are stored as fields
	                    parsedNode = this.parseDOM(node);

	                    nodeName = node.nodeName;

	                    member = result[nodeName];

	                    if (isArray(member)) {
	                        // elements of same nodeName are stored as array
	                        member.push(parsedNode);
	                    } else if (member !== undefined) {
	                        member = [member, parsedNode];
	                    } else {
	                        member = parsedNode;
	                    }

	                    result[nodeName] = member;
	                }
	            }
	            return result;
	        },

	        evaluate: function(value, expression) {
	            var members = expression.split("."),
	                member,
	                result,
	                length,
	                intermediateResult,
	                idx;

	            while (member = members.shift()) {
	                value = value[member];

	                if (isArray(value)) {
	                    result = [];
	                    expression = members.join(".");

	                    for (idx = 0, length = value.length; idx < length; idx++) {
	                        intermediateResult = this.evaluate(value[idx], expression);

	                        intermediateResult = isArray(intermediateResult) ? intermediateResult : [intermediateResult];

	                        result.push.apply(result, intermediateResult);
	                    }

	                    return result;
	                }
	            }

	            return value;
	        },

	        parse: function(xml) {
	            var documentElement,
	                tree,
	                result = {};

	            documentElement = xml.documentElement || $.parseXML(xml).documentElement;

	            tree = this.parseDOM(documentElement);

	            result[documentElement.nodeName] = tree;

	            return result;
	        },

	        xpathToMember: function(member, raw) {
	            if (!member) {
	                return "";
	            }

	            member = member.replace(/^\//, "") // remove the first "/"
	                           .replace(/\//g, "."); // replace all "/" with "."

	            if (member.indexOf("@") >= 0) {
	                // replace @attribute with '["@attribute"]'
	                return member.replace(/\.?(@.*)/, raw? '$1':'["$1"]');
	            }

	            if (member.indexOf("text()") >= 0) {
	                // replace ".text()" with '["#text"]'
	                return member.replace(/(\.?text\(\))/, raw? '#text':'["#text"]');
	            }

	            return member;
	        },
	        getter: function(member) {
	            return getter(this.xpathToMember(member), true);
	        }
	    });

	    $.extend(true, kendo.data, {
	        XmlDataReader: XmlDataReader,
	        readers: {
	            xml: XmlDataReader
	        }
	    });
	})(window.kendo.jQuery);

	return window.kendo;

	}, __webpack_require__(3));


/***/ })

/******/ });