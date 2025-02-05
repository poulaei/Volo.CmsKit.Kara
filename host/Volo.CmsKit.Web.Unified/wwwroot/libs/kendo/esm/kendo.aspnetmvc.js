import './kendo.data.js';
import './kendo.combobox.js';
import './kendo.dropdownlist.js';
import './kendo.dropdowntree.js';
import './kendo.multiselect.js';
import './kendo.validator.js';

(function($, undefined$1) {
    var kendo = window.kendo,
        escapeQuoteRegExp = /'/ig,
        extend = $.extend,
        isArray = Array.isArray,
        isPlainObject = $.isPlainObject,
        POINT = ".";

    function parameterMap(options, operation, serializationOptions) {
       var result = {};

       if (options.sort) {
           result[this.options.prefix + "sort"] = $.map(options.sort, function(sort) {
               return sort.field + "-" + sort.dir;
           }).join("~");

           delete options.sort;
       } else {
           result[this.options.prefix + "sort"] = "";
       }

       if (options.page) {
           result[this.options.prefix + "page"] = options.page;

           delete options.page;
       }

       if (options.pageSize) {
           result[this.options.prefix + "pageSize"] = options.pageSize;

           delete options.pageSize;
       }

       if (options.group) {
            result[this.options.prefix + "group"] = $.map(options.group, function(group) {
               return group.field + "-" + group.dir;
           }).join("~");

           delete options.group;
       } else {
            result[this.options.prefix + "group"] = "";
       }

       if (options.aggregate) {
           result[this.options.prefix + "aggregate"] = $.map(options.aggregate, function(aggregate) {
               return aggregate.field + "-" + aggregate.aggregate;
           }).join("~");

           delete options.aggregate;
       }

       if (options.filter) {
           result[this.options.prefix + "filter"] = serializeFilter(options.filter, serializationOptions.encode);

            if (serializationOptions.caseSensitiveFilter) {
                result["caseSensitiveFilter"] = true;
            }

           delete options.filter;
       } else {
           result[this.options.prefix + "filter"] = "";
           delete options.filter;
       }

       if (!options.groupPaging) {
           delete options.take;
           delete options.skip;
       }

       var serializer = new Serializer(serializationOptions);
       serializer.serialize(result, options, "");

       return result;
    }

    var Serializer = function(options) {
        options = options || {};
        this.culture = options.culture || kendo.culture();
        this.stringifyDates = options.stringifyDates;
        this.decimalSeparator = this.culture.numberFormat[POINT];
    };

    Serializer.prototype = Serializer.fn = {
        serialize: function(result, data, prefix) {
            var valuePrefix;
            for (var key in data) {
                valuePrefix = prefix ? prefix + "." + key : key;
                this.serializeField(result, data[key], data, key, valuePrefix);
            }
        },

        serializeField: function(result, value, data, key, prefix) {
            if (isArray(value)) {
                this.serializeArray(result, value, prefix);
            } else if (isPlainObject(value)) {
                this.serialize(result, value, prefix);
            } else {
                if (result[prefix] === undefined$1) {
                    result[prefix] = data[key] = this.serializeValue(value);
                }
            }
        },

        serializeArray: function(result, data, prefix) {
            var value, key, valuePrefix;
            for (var sourceIndex = 0, destinationIndex = 0; sourceIndex < data.length; sourceIndex++) {
                value = data[sourceIndex];
                key = "[" + destinationIndex + "]";
                valuePrefix = prefix + key;

                this.serializeField(result, value, data, key, valuePrefix);

                destinationIndex++;
            }
        },

        serializeValue: function(value) {
            if (value instanceof Date) {
                if (this.stringifyDates) {
                    value = kendo.stringify(value).replace(/"/g, "");
                } else {
                    value = kendo.toString(value, "G", this.culture.name);
                }
            } else if (typeof value === "number") {
                value = value.toString().replace(POINT, this.decimalSeparator);
            }
            return value;
        }
    };

    function serializeFilter(filter, encode) {
       if (filter.filters) {
           return $.map(filter.filters, function(f) {
               var hasChildren = f.filters && f.filters.length > 1,
                   result = serializeFilter(f, encode);

               if (result && hasChildren) {
                   result = "(" + result + ")";
               }

               return result;
           }).join("~" + filter.logic + "~");
       }

       if (filter.field) {
           return filter.field + "~" + filter.operator + "~" + encodeFilterValue(filter.value, encode);
       } else {
           return undefined$1;
       }
    }

    function encodeFilterValue(value, encode) {
       if (typeof value === "string") {
           if (value.indexOf('Date(') > -1) {
               value = new Date(parseInt(value.replace(/^\/Date\((.*?)\)\/$/, '$1'), 10));
           } else {
               value = value.replace(escapeQuoteRegExp, "''");

               if (encode) {
                   value = encodeURIComponent(value);
               }

               return "'" + value + "'";
           }
       }

       if (value && value.getTime) {
           return "datetime'" + kendo.format("{0:yyyy-MM-ddTHH-mm-ss}", value) + "'";
       }
       return value;
    }

    function valueOrDefault(value, defaultValue) {
        return typeof value !== "undefined" ? value : defaultValue;
    }

    function translateGroup(group) {
        var hasSubgroups = group.HasSubgroups || group.hasSubgroups || false;
        var items = group.Items || group.items;
        var itemCount = group.ItemCount || group.itemCount;
        var subgroupCount = group.SubgroupCount || group.subgroupCount;

        return {
            value: valueOrDefault(group.Key, valueOrDefault(group.key, group.value)),
            field: group.Member || group.member || group.field,
            hasSubgroups: hasSubgroups,
            aggregates: translateAggregate(group.Aggregates || group.aggregates),
            items: hasSubgroups ? $.map(items, translateGroup) : items,
            itemCount: itemCount,
            subgroupCount: subgroupCount,
            uid: kendo.guid()
        };
    }

    function translateAggregateResults(aggregate) {
       var obj = {};
       obj[(aggregate.AggregateMethodName || aggregate.aggregateMethodName).toLowerCase()] = valueOrDefault(aggregate.Value, aggregate.value);

       return obj;
    }

    function translateAggregate(aggregates) {
        var functionResult = {},
            key,
            functionName,
            aggregate;

        for (key in aggregates) {
            functionResult = {};
            aggregate = aggregates[key];

            for (functionName in aggregate) {
               functionResult[functionName.toLowerCase()] = aggregate[functionName];
            }

            aggregates[key] = functionResult;
        }

        return aggregates;
    }

    function convertAggregates(aggregates) {
        var idx, length, aggregate;
        var result = {};

        for (idx = 0, length = aggregates.length; idx < length; idx++) {
            aggregate = aggregates[idx];
            result[(aggregate.Member || aggregate.member)] = extend(true, result[(aggregate.Member || aggregate.member)], translateAggregateResults(aggregate));
        }

        return result;
    }

    extend(true, kendo.data, {
        schemas: {
            "aspnetmvc-ajax": {
                groups: function(data) {
                    return $.map(this._dataAccessFunction(data), translateGroup);
                },
                aggregates: function(data) {
                    data = data.d || data;
                    var aggregates = data.AggregateResults || data.aggregateResults || [];

                    if (!Array.isArray(aggregates)) {
                        for (var key in aggregates) {
                            aggregates[key] = convertAggregates(aggregates[key]);
                        }

                        return aggregates;
                    }

                    return convertAggregates(aggregates);
                }
            }
        }
    });

    extend(true, kendo.data, {
        transports: {
            "aspnetmvc-ajax": kendo.data.RemoteTransport.extend({
                init: function(options) {
                    var that = this,
                        stringifyDates = (options || {}).stringifyDates,
                        caseSensitiveFilter = (options || {}).caseSensitiveFilter;

                    kendo.data.RemoteTransport.fn.init.call(this,
                        extend(true, {}, this.options, options, {
                            parameterMap: function(options, operation) {
                                return parameterMap.call(that, options, operation, {
                                    encode: false,
                                    stringifyDates: stringifyDates,
                                    caseSensitiveFilter: caseSensitiveFilter
                                });
                            }
                        })
                    );
                },
                read: function(options) {
                    var data = this.options.data,
                        url = this.options.read.url;

                    if (isPlainObject(data)) {
                        if (url) {
                            this.options.data = null;
                        }

                        if (!data.Data.length && url) {
                            kendo.data.RemoteTransport.fn.read.call(this, options);
                        } else {
                            options.success(data);
                        }
                    } else {
                        kendo.data.RemoteTransport.fn.read.call(this, options);
                    }
                },
                options: {
                    read: {
                        type: "POST"
                    },
                    update: {
                        type: "POST"
                    },
                    create: {
                        type: "POST"
                    },
                    destroy: {
                        type: "POST"
                    },
                    parameterMap: parameterMap,
                    prefix: ""
                }
            })
        }
    });

    extend(true, kendo.data, {
       schemas: {
           "webapi": kendo.data.schemas["aspnetmvc-ajax"]
       }
    });

    extend(true, kendo.data, {
        transports: {
            "webapi": kendo.data.RemoteTransport.extend({
                init: function(options) {
                    var that = this;
                    var stringifyDates = (options || {}).stringifyDates;
                    var culture = kendo.cultures[options.culture] || kendo.cultures["en-US"];

                    if (options.update) {
                        var updateUrl = typeof options.update === "string" ? options.update : options.update.url;

                        options.update = extend(options.update, { url: function(data) {
                            return kendo.format(updateUrl, data[options.idField]);
                        } });
                    }

                    if (options.destroy) {
                        var destroyUrl = typeof options.destroy === "string" ? options.destroy : options.destroy.url;

                        options.destroy = extend(options.destroy, { url: function(data) {
                            return kendo.format(destroyUrl, data[options.idField]);
                        } });
                    }

                    if (options.create && typeof options.create === "string") {
                        options.create = {
                            url: options.create
                        };
                    }

                    kendo.data.RemoteTransport.fn.init.call(this,
                        extend(true, {}, this.options, options, {
                            parameterMap: function(options, operation) {
                                return parameterMap.call(that, options, operation, {
                                    encode: false,
                                    stringifyDates: stringifyDates,
                                    culture: culture
                                });
                            }
                        })
                    );
                },
                read: function(options) {
                    var data = this.options.data,
                        url = this.options.read.url;

                    if (isPlainObject(data)) {
                        if (url) {
                            this.options.data = null;
                        }

                        if (!data.Data.length && url) {
                            kendo.data.RemoteTransport.fn.read.call(this, options);
                        } else {
                            options.success(data);
                        }
                    } else {
                        kendo.data.RemoteTransport.fn.read.call(this, options);
                    }
                },
                options: {
                    read: {
                        type: "GET"
                    },
                    update: {
                        type: "PUT"
                    },
                    create: {
                        type: "POST"
                    },
                    destroy: {
                        type: "DELETE"
                    },
                    parameterMap: parameterMap,
                    prefix: ""
                }
            })
        }
    });

    extend(true, kendo.data, {
        transports: {
            "aspnetmvc-server": kendo.data.RemoteTransport.extend({
                init: function(options) {
                    var that = this;

                    kendo.data.RemoteTransport.fn.init.call(this,
                        extend(options, {
                            parameterMap: function(options, operation) {
                                return parameterMap.call(that, options, operation, {
                                    encode: true
                                });
                            }
                        }
                    ));
                },
                read: function(options) {
                    var url,
                        prefix = this.options.prefix,
                        params = [prefix + "sort",
                            prefix + "page",
                            prefix + "pageSize",
                            prefix + "group",
                            prefix + "aggregate",
                            prefix + "filter"],
                        regExp = new RegExp("(" + params.join('|') + ")=[^&]*&?", "g"),
                        query;

                    query = location.search.replace(regExp, "").replace("?", "");

                    if (query.length && !(/&$/.test(query))) {
                        query += "&";
                    }

                    options = this.setup(options, "read");

                    url = options.url;

                    if (url.indexOf("?") >= 0) {
                        query = query.replace(/(.*?=.*?)&/g, function(match) {
                            if (url.indexOf(match.substr(0, match.indexOf("="))) >= 0) {
                               return "";
                            }
                            return match;
                        });
                        url += "&" + query;
                    } else {
                        url += "?" + query;
                    }

                    url += $.map(options.data, function(value, key) {
                        return key + "=" + value;
                    }).join("&");

                    location.href = url;
                }
            })
        }
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui;

    if (ui && ui.ComboBox) {
        ui.ComboBox.requestData = function(selector) {
            var combobox = $(selector).data("kendoComboBox");

            if (!combobox) {
                return;
            }

            var filter = combobox.dataSource.filter();
            var value = combobox.input.val();

            if (!filter || !filter.filters.length) {
                value = "";
            }

            return { text: value };
        };
    }

})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui;

    if (ui && ui.MultiColumnComboBox) {
        ui.MultiColumnComboBox.requestData = function(selector) {

            var multicolumncombobox = $(selector).data("kendoMultiColumnComboBox");

            if (!multicolumncombobox) {
                return;
            }

            var filter = multicolumncombobox.dataSource.filter();
            var value = multicolumncombobox.input.val();

            if (!filter || !filter.filters.length) {
                value = "";
            }

            return { text: value };
        };
    }

})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui;

    if (ui && ui.DropDownList) {
        ui.DropDownList.requestData = function(selector) {
            var dropdownlist = $(selector).data("kendoDropDownList");

            if (!dropdownlist) {
                return;
            }

            var filter = dropdownlist.dataSource.filter();
            var filterInput = dropdownlist.filterInput;
            var value = filterInput ? filterInput.val() : "";

            if (!filter || !filter.filters.length) {
                value = "";
            }

            return { text: value };
        };
    }

})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui;

    if (ui && ui.DropDownTree) {
        ui.DropDownTree.requestData = function(selector) {
            var dropdowntree = $(selector).data("kendoDropDownTree");

            if (!dropdowntree) {
                return;
            }

            var filter = dropdowntree.dataSource.filter();
            var filterInput = dropdowntree.filterInput;
            var value = filterInput ? filterInput.val() : "";

            if (!filter || !filter.filters.length) {
                value = "";
            }

            return { text: value };
        };
    }

})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui;

    if (ui && ui.MultiSelect) {
        ui.MultiSelect.requestData = function(selector) {
            var multiselect = $(selector).data("kendoMultiSelect");

            if (!multiselect) {
                return;
            }

            var text = multiselect.input.val();

            return { text: text !== multiselect.options.placeholder ? text : "" };
        };
    }

})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        extend = $.extend,
        isFunction = kendo.isFunction;

    extend(true, kendo.data, {
        schemas: {
            "imagebrowser-aspnetmvc": {
                data: function(data) {
                    return data || [];
                },
                model: {
                    id: "name",
                    fields: {
                        name: { field: "Name" },
                        size: { field: "Size" },
                        type: { field: "EntryType", parse: function(value) { return value == 0 ? "f" : "d"; } }
                    }
                }
            }
        }
    });

    extend(true, kendo.data, {
        schemas: {
            "filebrowser-aspnetmvc": kendo.data.schemas["imagebrowser-aspnetmvc"]
        }
    });

    extend(true, kendo.data, {
        transports: {
            "imagebrowser-aspnetmvc": kendo.data.RemoteTransport.extend({
                init: function(options) {
                    kendo.data.RemoteTransport.fn.init.call(this, $.extend(true, {}, this.options, options));
                },
                _call: function(type, options) {
                    options.data = $.extend({}, options.data, { path: this.options.path() });

                    if (isFunction(this.options[type])) {
                        this.options[type].call(this, options);
                    } else {
                        kendo.data.RemoteTransport.fn[type].call(this, options);
                    }
                },
                read: function(options) {
                    this._call("read", options);
                },
                create: function(options) {
                    this._call("create", options);
                },
                destroy: function(options) {
                    this._call("destroy", options);
                },
                update: function() {
                    //updates are handled by the upload
                },
                options: {
                    read: {
                        type: "POST"
                    },
                    update: {
                        type: "POST"
                    },
                    create: {
                        type: "POST"
                    },
                    destroy: {
                        type: "POST"
                    },
                    parameterMap: function(options, type) {
                        if (type != "read") {
                            options.EntryType = options.EntryType === "f" ? 0 : 1;
                        }
                        return options;
                    }
                }
            })
        }
    });

    extend(true, kendo.data, {
        transports: {
            "filebrowser-aspnetmvc": kendo.data.transports["imagebrowser-aspnetmvc"]
        }
    });

})(window.kendo.jQuery);

(function($, undefined$1) {
    var nameSpecialCharRegExp = /("|\%|'|\[|\]|\$|\.|\,|\:|\;|\+|\*|\&|\!|\#|\(|\)|<|>|\=|\?|\@|\^|\{|\}|\~|\/|\||`)/g;
    var SWITCHSELECTOR = ".k-switch";
    var dateWidgets = ["DatePicker","DateTimePicker"];
    var MAXDATE = new Date(8640000000000000);
    var MINDATE = new Date(-8640000000000000);

    function generateMessages() {
        var name,
            messages = {};

        for (name in validationRules) {
            messages["mvc" + name] = createMessage(name);
        }
        return messages;
    }

    function generateRules() {
         var name,
             rules = {};

         for (name in validationRules) {
             rules["mvc" + name] = createRule(name);
        }
        return rules;
    }

    function extractParams(input, ruleName) {
        var params = {},
            index,
            data = input.data(),
            length = ruleName.length,
            rule,
            key,
            start;

        for (key in data) {
            rule = key.toLowerCase();
            index = rule.indexOf(ruleName);
            if (index > -1) {
                start = rule === "valserver" ? index : index + length;
                rule = rule.substring(start, key.length);

                if (rule) {
                    params[rule] = data[key];
                }
            }
        }
        return params;
    }

    function rulesFromData(metadata) {
        var idx,
            length,
            fields = metadata.Fields || [],
            rules = {};

        for (idx = 0, length = fields.length; idx < length; idx++) {
            $.extend(true, rules, rulesForField(fields[idx]));
        }
        return rules;
    }

    function rulesForField(field) {
        var rules = {},
            messages = {},
            fieldName = field.FieldName,
            fieldRules = field.ValidationRules,
            validationType,
            validationParams,
            idx,
            length;

        for (idx = 0, length = fieldRules.length; idx < length; idx++) {
            validationType = fieldRules[idx].ValidationType;
            validationParams = fieldRules[idx].ValidationParameters;

            rules[fieldName + validationType] = createMetaRule(fieldName, validationType, validationParams);

            messages[fieldName + validationType] = createMetaMessage(fieldRules[idx].ErrorMessage);
        }

        return { rules: rules, messages: messages };
    }

    function createMessage(rule) {
        return function(input) {
            if (input.filter("[data-rule-" + rule + "]").length) {
                return input.attr("data-msg-" + rule);
            } else {
                return input.attr("data-val-" + rule);
            }
        };
    }

    function createRule(ruleName) {
        return function(input) {
            if (input.filter("[data-val-" + ruleName + "]").length) {
                return validationRules[ruleName](input, extractParams(input, ruleName));
            } else if (input.filter("[data-rule-" + ruleName + "]").length) {
                return validationRules[ruleName](input, extractParams(input, ruleName));
            }
            return true;
        };
    }

    function createMetaMessage(message) {
        return function() { return message; };
    }

    function createMetaRule(fieldName, type, params) {
        return function(input) {
            if (input.filter("[name=" + fieldName + "]").length) {
                return validationRules[type](input, params);
            }
            return true;
        };
    }

    function patternMatcher(value, pattern) {
        if (typeof pattern === "string") {
            pattern = new RegExp('^(?:' + pattern + ')$');
        }
        return pattern.test(value);
    }

    function isValidDate(input) {
        return input.val() === "" || kendo.parseDate(input.val()) !== null;
    }

    function isDateInput(input) {
        var widget = kendo.widgetInstance(input);
        return widget && (dateWidgets.indexOf(widget.options.name) > -1 ) && isValidDate(input);
    }

    function parseDateValue(value) {
        return kendo.parseDate(value).getTime();
    }

    function parseNumericValue(value) {
        return kendo.parseFloat(value) || 0;
    }

    function validateValue(input, params, isMinValidation) {
        var value, limit;

        if (isDateInput(input)) {
            limit = isMinValidation ? parseDateValue(params.min) || MINDATE.getTime() : parseDateValue(params.max) || MAXDATE.getTime();
            value = kendo.parseDate(input.val()).getTime();
        } else {
            limit = isMinValidation ? parseNumericValue(params.min) : parseNumericValue(params.max);
            value = parseNumericValue(input.val());
        }

        return isMinValidation ? limit <= value : value <= limit;
    }

    var validationRules = {
        required: function(input) {
            var value = input.val(),
                checkbox = input.filter("[type=checkbox]"),
                radio = input.filter("[type=radio]"),
                name;

            if (checkbox.length) {
                name = checkbox[0].name.replace(nameSpecialCharRegExp, "\\$1");
                var hiddenSelector = "input:hidden[name='" + name + "']";
                var checkboxGroupMembers = input.closest(".k-checkbox-list").find("input[name='" + name + "']");

                if (checkbox.closest(SWITCHSELECTOR).length) {
                    checkbox = checkbox.closest(SWITCHSELECTOR);
                }

                var hidden = input.parent().next(hiddenSelector);

                if (!hidden.length) {
                    hidden = checkbox.parent().next("label.k-checkbox-label").next(hiddenSelector);
                }

                if (hidden.length) {
                    value = hidden.val();
                } else {
                    value = input.prop("checked") === true;
                }

                if (checkboxGroupMembers.length) {
                    value = checkboxGroupMembers.is(":checked");
                }
            } else if (radio.length) {
                value = kendo.jQuery.find("input[name='" + input.attr("name") + "']:checked").length > 0;
            }

            return !(value === "" || !value || value.length === 0);
        },
        number: function(input) {
            return input.val() === "" || input.val() == null || kendo.parseFloat(input.val()) !== null;
        },
        regex: function(input, params) {
            if (input.val() !== "") {
                return patternMatcher(input.val(), params.pattern);
            }
            return true;
        },
        range: function(input, params) {
            if (input.val() !== "") {
                return this.min(input, params) && this.max(input, params);
            }
            return true;
        },
        min: function(input, params) {
            return validateValue(input, params, true);
        },
        max: function(input, params) {
            return validateValue(input, params, false);
        },
        date: function(input) {
            return isValidDate(input);
        },
        length: function(input, params) {
            if (input.val() !== "") {
                var len = kendo.trim(input.val()).length;
                return (!params.min || len >= (params.min || 0)) && (!params.max || len <= (params.max || 0));
            }
            return true;
        },
        server: function(input, params) {
            if (params.server) {
                return false;
            }

            return true;
        },
        equalto: function(input) {
            if (input.filter("[data-val-equalto-other]").length) {
                var otherField = input.attr("data-val-equalto-other");
                otherField = otherField.substr(otherField.lastIndexOf(".") + 1);
                return input.val() == $("#" + otherField).val();
            }
            return true;
        }
    };

    $.extend(true, kendo.ui.validator, {
        rules: generateRules(),
        messages: generateMessages(),
        messageLocators: {
            mvcLocator: {
                locate: function(element, fieldName) {
                    fieldName = fieldName.replace(nameSpecialCharRegExp, "\\$1");
                    return element.find(".field-validation-valid[data-valmsg-for='" + fieldName + "'], .field-validation-error[data-valmsg-for='" + fieldName + "']");
                },
                decorate: function(message, fieldName) {
                    message.addClass("field-validation-error").attr("data-valmsg-for", fieldName || "");
                }
            },
            mvcMetadataLocator: {
                locate: function(element, fieldName) {
                    fieldName = fieldName.replace(nameSpecialCharRegExp, "\\$1");
                    return element.find("#" + fieldName + "_validationMessage.field-validation-valid");
                },
                decorate: function(message, fieldName) {
                    message.addClass("field-validation-error").attr("id", fieldName + "_validationMessage");
                }
            }
        },
        ruleResolvers: {
            mvcMetaDataResolver: {
                resolve: function(element) {
                    var metadata = window.mvcClientValidationMetadata || [];

                    if (metadata.length) {
                        element = $(element);
                        for (var idx = 0; idx < metadata.length; idx++) {
                            if (metadata[idx].FormId == element.attr("id")) {
                                return rulesFromData(metadata[idx]);
                            }
                        }
                    }
                    return {};
                }
            }
        },
        validateOnInit: function(element) {
            return !!element.find("input[data-val-server]").length;
        },
        allowSubmit: function(element, errors) {
            return !!errors && errors.length === element.find("input[data-val-server]").length;
        }
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        extend = $.extend;

    extend(true, kendo.data, {
        schemas: {
            "filemanager": {
                data: function(data) {
                    return data || [];
                },
                model: {
                    id: "path",
                    hasChildren: "hasDirectories",
                    fields: {
                        name: { field: "Name", editable: true, type: "string", defaultValue: "New Folder" },
                        size: { field: "Size", editable: false, type: "number" },
                        path: { field: "Path", editable: false, type: "string" },
                        extension: { field: "Extension", editable: false, type: "string" },
                        isDirectory: { field: "IsDirectory", editable: false, defaultValue: true, type: "boolean" },
                        hasDirectories: { field: "HasDirectories", editable: false, defaultValue: false, type: "boolean" },
                        created: { field: "Created", type: "date", editable: false },
                        createdUtc: { field: "CreatedUtc", type: "date", editable: false },
                        modified: { field: "Modified", type: "date", editable: false },
                        modifiedUtc: { field: "ModifiedUtc", type: "date", editable: false }
                    }
                }
            }
        }
    });
})(window.kendo.jQuery);

var __meta__ = {
    id: "aspnetmvc",
    name: "ASP.NET MVC",
    category: "wrappers",
    description: "Scripts required by Telerik UI for ASP.NET MVC and Telerik UI for ASP.NET Core",
    depends: [ "data", "combobox", "multicolumncombobox", "dropdownlist", "multiselect", "validator" ]
};

(function($, undefined$1) {
    var extend = $.extend;

    $(function() { kendo.__documentIsReady = true; });

    function syncReady(cb) {
        if (kendo.__documentIsReady) { //sync operation
            cb();
        }
        else { //async operation
            $(cb);
        }
    }

    extend(kendo, {
        syncReady: syncReady
    });
})(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
