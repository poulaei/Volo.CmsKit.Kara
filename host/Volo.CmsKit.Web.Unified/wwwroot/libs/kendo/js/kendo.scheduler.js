require('./kendo.dropdownlist.js');
require('./kendo.editable.js');
require('./kendo.multiselect.js');
require('./kendo.window.js');
require('./kendo.datetimepicker.js');
require('./kendo.scheduler.recurrence.js');
require('./kendo.scheduler.view.js');
require('./kendo.scheduler.dayview.js');
require('./kendo.scheduler.agendaview.js');
require('./kendo.scheduler.monthview.js');
require('./kendo.scheduler.timelineview.js');
require('./kendo.scheduler.yearview.js');
require('./kendo.dialog.js');
require('./kendo.pane.js');
require('./kendo.pdf.js');
require('./kendo.switch.js');
require('./kendo.toolbar.js');
require('./kendo.html.button.js');
require('./kendo.icons.js');

var __meta__ = {
    id: "scheduler",
    name: "Scheduler",
    category: "web",
    description: "The Scheduler is an event calendar.",
    depends: [ "dropdownlist", "editable", "multiselect", "window", "datepicker", "datetimepicker", "toolbar", "scheduler.recurrence", "scheduler.view", "html.button", "icons" ],
    features: [ {
        id: "scheduler-dayview",
        name: "Scheduler Day View",
        description: "Scheduler Day View",
        depends: [ "scheduler.dayview" ]
    }, {
        id: "scheduler-agendaview",
        name: "Scheduler Agenda View",
        description: "Scheduler Agenda View",
        depends: [ "scheduler.agendaview" ]
    }, {
        id: "scheduler-monthview",
        name: "Scheduler Month View",
        description: "Scheduler Month View",
        depends: [ "scheduler.monthview" ]
    }, {
        id: "scheduler-timelineview",
        name: "Scheduler Timeline View",
        description: "Scheduler Timeline View",
        depends: [ "scheduler.timelineview" ]
    }, {
        id: "scheduler-yearview",
        name: "Scheduler Year View",
        description: "Scheduler Year View",
        depends: [ "scheduler.yearview" ]
    }, {
        id: "scheduler-mobile",
        name: "Scheduler adaptive rendering",
        description: "Support for adaptive rendering",
        depends: [ "dialog", "pane", "switch" ]
    }, {
        id: "scheduler-pdf-export",
        name: "PDF export",
        description: "Export the scheduler events as PDF",
        depends: [ "pdf", "drawing" ]
    }, {
        id: "scheduler-timezones",
        name: "Timezones",
        description: "Allow selecting timezones different than Etc/UTC",
        depends: [ "timezones" ]
    }]
};


(function($, undefined$1) {
    var kendo = window.kendo,
        date = kendo.date,
        MS_PER_DAY = date.MS_PER_DAY,
        getDate = date.getDate,
        getMilliseconds = kendo.date.getMilliseconds,
        recurrence = kendo.recurrence,
        encode = kendo.htmlEncode,
        keys = kendo.keys,
        ui = kendo.ui,
        Widget = ui.Widget,
        DataBoundWidget = ui.DataBoundWidget,
        STRING = "string",
        Popup = ui.Popup,
        Calendar = ui.Calendar,
        DataSource = kendo.data.DataSource,
        isPlainObject = $.isPlainObject,
        extend = $.extend,
        toString = Object.prototype.toString,
        isArray = Array.isArray,
        NS = ".kendoScheduler",
        CLICK = "click",
        MOUSEDOWN = "mousedown",
        TOUCHSTART = kendo.support.pointers ? "pointerdown" : "touchstart",
        TOUCHMOVE = kendo.support.pointers ? "pointermove" : "touchmove",
        TOUCHEND = kendo.support.pointers ? "pointerup" : "touchend",
        MOUSEMOVE = kendo.support.mousemove,
        CHANGE = "change",
        PROGRESS = "progress",
        ERROR = "error",
        CANCEL = "cancel",
        REMOVE = "remove",
        RESET = "resetSeries",
        SAVE = "save",
        ADD = "add",
        EDIT = "edit",
        DISABLED = "disabled",
        OPTION = "option",
        FOCUSEDSTATE = "k-focus",
        INVERSECOLORCLASS = "k-event-inverse",
        valueStartEndBoundRegex = /(?:value:start|value:end)(?:,|$)/,
        MIN_SCREEN = "(min-width: 1024px)",
        TODAY = getDate(new Date()),
        EXCEPTION_SEPARATOR = ",",
        OLD_EXCEPTION_SEPARATOR_REGEXP = /\;/g,
        RECURRENCE_EXCEPTION = "recurrenceException",
        DELETECONFIRM = "Are you sure you want to delete this event?",
        DELETERECURRING = "Do you want to delete only this event occurrence or the whole series?",
        EDITRECURRING = "Do you want to edit only this event occurrence or the whole series?",
        DELETERECURRINGCONFIRM = "Are you sure you want to delete this event occurrence?",
        RESETSERIESCONFIRM = "Are you sure you want to reset the whole series?",
        DELETESERIESCONFIRM = "Are you sure you want to delete the whole series?",
        ONGOING_CLASS = "k-event-ongoing",
        COMMANDBUTTONTMPL = ({ className, attr, text, icon, fillMode, themeColor }) =>
            kendo.html.renderButton(`<button type="button" class="${className}" ${attr}>${text}</button>`, {
                icon: icon,
                fillMode: fillMode,
                themeColor: themeColor
            }),
        VIEWS_DROPDOWN_TEMPLATE = kendo.template(({ label, views, type }) =>
            `<select aria-label="${label}" class="k-picker k-dropdown-list k-dropdown ${type}">` +
                Object.keys(views).map((view) => `<option value="${view}">${views[view].title}</option>`).join('') +
            '</select>'
        ),

        DEFAULT_TOOLS = {
            pdf: {
                name: "pdf",
                type: "button",
                icon: "file-pdf",
                attributes: {
                    class: "k-pdf"
                }
            },
            pdfMobile: {
                name: "pdf",
                type: "button",
                icon: "file-pdf",
                showText: "overflow",
                attributes: {
                    class: "k-pdf"
                }
            },
            today: {
                name: "today",
                type: "button",
                attributes: {
                    class: "k-nav-today",
                }
            },
            previous: {
                name: "previous",
                type: "button",
                icon: "caret-alt-left",
                showText: "overflow",
                attributes: {
                    class: "k-nav-prev"
                }
            },
            next: {
                name: "next",
                type: "button",
                icon: "caret-alt-right",
                showText: "overflow",
                attributes: {
                    class: "k-nav-next"
                }
            },
            current: {
                name: "current",
                type: "button",
                icon: "calendar",
                fillMode: "flat",
                text: 'placeholder',
                attributes: {
                    "aria-live": "polite",
                    class: "k-nav-current"
                }
            },
            search: {
                template: '<span class="k-scheduler-search k-textbox k-input k-input-md k-rounded-md k-input-solid">' +
                        '<input tabindex="-1" autocomplete="off" class="k-input-inner k-scheduler-search-input k-input-inner" />' +
                        `<span class="k-input-suffix">${kendo.ui.icon("search")}</span>` +
                    '</span>'
            },
            refresh: {
                name: "refresh",
                type: "button",
                icon: "arrow-rotate-cw",
                showText: "overflow",
                attributes: {
                    class: "k-scheduler-refresh"
                }
            },
            create: {
                name: "create",
                type: "button",
                icon: "plus",
                attributes: {
                    class: "k-create-event"
                }
            },
            calendar: {
                name: "calendar",
                type: "button",
                icon: "calendar",
                attributes: {
                    class: "k-nav-calendar"
                }
            },
            previousMobile: {
                name: "previous",
                type: "button",
                icon: "chevron-left",
                showText: "overflow",
                attributes: {
                    class: "k-nav-prev"
                }
            },
            nextMobile: {
                name: "next",
                type: "button",
                icon: "chevron-right",
                showText: "overflow",
                attributes: {
                    class: "k-nav-next"
                }
            },
            currentMobile: {
                template: '<span class="k-scheduler-navigation">' +
                        '<span class="k-nav-current">' +
                            '<span class="k-m-date-format"></span>' +
                            '<span class="k-y-date-format"></span>' +
                        '</span>' +
                    '</span>'
            },
            view: {
                name: "view",
                type: "button",
                togglable: true,
                group: "views"
            }
        },

        defaultDesktopTools = [
            ["today", "previous", "next"],
            "current",
            { type: "spacer" }
        ],

        defaultMobileToolsFirst = [
            ["calendar"],
            { type: "spacer" }
        ],

        defaultMobileToolsSecond = [
            "previousMobile",
            { type: "spacer" },
            "currentMobile",
            { type: "spacer" },
            "nextMobile"
        ],

        MOBILEDATERANGEEDITOR = function(container, options) {
            var attr = { name: options.field, title: options.title };
            var isAllDay = options.model.isAllDay;
            var dateTimeValidate = kendo.attr("validate") + "='" + (!isAllDay) + "'";
            var dateValidate = kendo.attr("validate") + "='" + (!!isAllDay) + "'";

            appendTimezoneAttr(attr, options);
            appendValidDateValidator(attr, options);
            appendDateCompareValidator(attr, options);

            $('<input type="datetime-local" required ' + kendo.attr("type") + '="datetime-local" ' + kendo.attr("bind") + '="value:' + options.field + ', invisible:isAllDay" ' + dateTimeValidate + '/>')
                .attr(attr)
                .appendTo(container);

            $('<input type="date" required ' + kendo.attr("type") + '="date" ' + kendo.attr("bind") + '="value:' + options.field + ',visible:isAllDay" ' +
                dateValidate + '/>')
                .attr(attr).appendTo(container);

            $('<span ' + kendo.attr("for") + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
        },
        DATERANGEEDITOR = function(container, options) {
            var attr = { name: options.field, title: options.title },
                isAllDay = options.model.isAllDay,
                dateTimeValidate = kendo.attr("validate") + "='" + (!isAllDay) + "' ",
                dateValidate = kendo.attr("validate") + "='" + (!!isAllDay) + "' ";

            appendTimezoneAttr(attr, options);
            appendValidDateValidator(attr, options);
            appendDateCompareValidator(attr, options);

            $('<input type="text" required ' + kendo.attr("type") + '="date"' + ' ' + kendo.attr("role") + '="datetimepicker" ' + kendo.attr("bind") + '="value:' + options.field + ',invisible:isAllDay" ' +
                dateTimeValidate + '/>')
            .attr(attr).appendTo(container);

            $('<input type="text" required ' + kendo.attr("type") + '="date"' + ' ' + kendo.attr("role") + '="datepicker" ' + kendo.attr("bind") + '="value:' + options.field + ',visible:isAllDay" ' +
                dateValidate + '/>')
            .attr(attr).appendTo(container);

            $('<span ' + kendo.attr("bind") + '="text: ' + options.field + 'Timezone"></span>').appendTo(container);

            if (options.field === "end") {
                $('<span ' + kendo.attr("bind") + '="text: startTimezone, invisible: endTimezone"></span>').appendTo(container);
            }

            $('<span ' + kendo.attr("for") + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
        },
        RECURRENCEEDITOR = function(container, options) {
            $('<div ' + kendo.attr("bind") + '="value:' + options.field + '" />')
                .attr({
                    name: options.field
                })
                .appendTo(container)
                .kendoRecurrenceEditor({
                    start: options.model.start,
                    timezone: options.timezone,
                    messages: options.messages
                });
        },
        MOBILERECURRENCEEDITOR = function(container, options) {
            $('<div ' + kendo.attr("bind") + '="value:' + options.field + '" />')
                .attr({
                    name: options.field
                })
                .appendTo(container)
                .kendoMobileRecurrenceEditor({
                    start: options.model.start,
                    timezone: options.timezone,
                    messages: options.messages,
                    pane: options.pane,
                    value: options.model[options.field]
                });
        },
        MOBILEISALLDAYEDITOR = function(container, options) {
            $('<input type="checkbox" data-role="switch"' + kendo.attr("bind") + '="value:' + options.field + '" />').appendTo(container);
        },
        ISALLDAYEDITOR = function(container, options) {
            $('<input type="checkbox" data-role="checkbox"' + kendo.attr("bind") + '="value:' + options.field + '" data-label="' + options.title + '" />')
                .attr({
                    id: options.field,
                    name: options.field,
                    title: options.title ? options.title : options.field
                })
                .appendTo(container);
        },
        MOBILETIMEZONEPOPUP = function(container, options) {
            var text = timezoneButtonText(options.model, options.messages.noTimezone);
            $('<span class="k-timezone-label"></span>').text(text).appendTo(container);
            $(kendo.ui.icon("arrow-chevron-right")).appendTo(container);
            container.closest("li.k-item label").on(CLICK, options.click);
        },
        TIMEZONEPOPUP = function(container, options) {
            $('<a href="#" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" data-bind="invisible:isAllDay"><span class="k-button-text">' + options.messages.timezoneEditorButton + '</span></a>').on(CLICK, options.click).appendTo(container);
        },
        MOBILETIMEZONEEDITOR = function(container, options) {
            $('<div class="k-mobiletimezoneeditor" ' + kendo.attr("bind") + '="value:' + options.field + '" />')
                .attr({
                    name: options.field
                })
                .appendTo(container)
                .kendoMobileTimezoneEditor({
                    optionLabel: options.noTimezone
                });
        },
        TIMEZONEEDITOR = function(container, options) {
            var visible = options.visible || options.visible === undefined$1;
            $('<div ' + kendo.attr("bind") + '="value:' + options.field + '" />')
                .attr({ name: options.field })
                .toggle(visible)
                .appendTo(container)
                .kendoTimezoneEditor({
                    optionLabel: options.noTimezone,
                    title: options.title
                });
        };

    function timezoneButtonText(model, message) {
        message = message || "";

        if (model.startTimezone) {
            message = model.startTimezone;

            if (model.endTimezone) {
                message += " | " + model.endTimezone;
            }
        }

        return message;
    }

    function appendTimezoneAttr(attrs, options) {
        var timezone = options.timezone;

        if (timezone) {
            attrs[kendo.attr("timezone")] = timezone;
        }
    }

    function appendValidDateValidator(attrs, options) {
        var validationRules = options.model.fields[options.field].validation;

        if (validationRules) {
            var validDateRule = validationRules.validDateValidator;
            if (validDateRule && isPlainObject(validDateRule) && validDateRule.message) {
                attrs[kendo.attr("validDate-msg")] = validDateRule.message;
            }
        }
    }

    function appendDateCompareValidator(attrs, options) {
        var validationRules = options.model.fields[options.field].validation;

        if (validationRules) {
            var dateCompareRule = validationRules.dateCompare;
            if (dateCompareRule && isPlainObject(dateCompareRule) && dateCompareRule.message) {
                attrs[kendo.attr("dateCompare-msg")] = dateCompareRule.message;
            }
        }
    }

    function wrapDataAccess(originalFunction, timezone) {
        return function(data) {
            data = originalFunction(data);

            convertData(data, "apply", timezone);

            return data || [];
        };
    }

    function wrapDataSerialization(originalFunction, timezone) {
        return function(data) {

            if (data) {
                if (toString.call(data) !== "[object Array]" && !(data instanceof kendo.data.ObservableArray)) {
                    data = [data];
                }
            }

            convertData(data, "remove", timezone, true);

            data = originalFunction(data);

            return data || [];
        };
    }

    function convertData(data, method, timezone, removeUid) {
        var event,
            idx,
            length,
            startOffset,
            endOffset;

        data = data || [];

        for (idx = 0, length = data.length; idx < length; idx++) {
            event = data[idx];
            startOffset = event.start ? event.start.getTimezoneOffset() : null;
            endOffset = event.start ? event.end.getTimezoneOffset() : null;

            if (removeUid) {
                if (event.startTimezone || event.endTimezone) {
                    if (timezone) {
                        event.start = kendo.timezone.convert(event.start, event.startTimezone || event.endTimezone, timezone);
                        event.end = kendo.timezone.convert(event.end, event.endTimezone || event.startTimezone, timezone);

                        event.start = kendo.timezone[method](event.start, timezone);
                        event.end = kendo.timezone[method](event.end, timezone);
                    } else {
                        event.start = kendo.timezone[method](event.start, event.startTimezone || event.endTimezone);
                        event.end = kendo.timezone[method](event.end, event.endTimezone || event.startTimezone);
                    }

                } else if (timezone) {
                    event.start = kendo.timezone[method](event.start, timezone);
                    event.end = kendo.timezone[method](event.end, timezone);
                }
            } else {
                if (event.startTimezone || event.endTimezone) {
                    event.start = kendo.timezone[method](event.start, event.startTimezone || event.endTimezone);
                    event.end = kendo.timezone[method](event.end, event.endTimezone || event.startTimezone);

                    if (timezone) {
                        event.start = kendo.timezone.convert(event.start, event.startTimezone || event.endTimezone, timezone);
                        event.end = kendo.timezone.convert(event.end, event.endTimezone || event.startTimezone, timezone);
                    }

                } else if (timezone) {
                    event.start = kendo.timezone[method](event.start, timezone);
                    event.end = kendo.timezone[method](event.end, timezone);
                }
            }

            if (removeUid) {
                delete event.uid;
            }

            if (method === "remove" && event.start && startOffset && startOffset !== event.start.getTimezoneOffset()) {
                event.start = new Date(event.start.getTime() + (startOffset - event.start.getTimezoneOffset()) * 60000);
            }
            if (method === "remove" && event.end && endOffset && endOffset !== event.end.getTimezoneOffset()) {
                event.end = new Date(event.end.getTime() + (endOffset - event.end.getTimezoneOffset()) * 60000);
            }
        }
        return data;
    }

    function getOccurrenceByUid(data, uid) {
        var length = data.length,
            idx = 0,
            event;

        for (; idx < length; idx++) {
            event = data[idx];

            if (event.uid === uid) {
                return event;
            }
        }
    }

    var SchedulerDataReader = kendo.Class.extend({
        init: function(schema, reader) {
            var timezone = schema.timezone;

            this.reader = reader;

            if (reader.model) {
                this.model = reader.model;
            }

            this.timezone = timezone;
            this.data = wrapDataAccess(this.data.bind(this), timezone);
            this.serialize = wrapDataSerialization(this.serialize.bind(this), timezone);
        },
        errors: function(data) {
            return this.reader.errors(data);
        },
        parse: function(data) {
            return this.reader.parse(data);
        },
        data: function(data) {
            return this.reader.data(data);
        },
        total: function(data) {
            return this.reader.total(data);
        },
        groups: function(data) {
            return this.reader.groups(data);
        },
        aggregates: function(data) {
            return this.reader.aggregates(data);
        },
        serialize: function(data) {
            return this.reader.serialize(data);
        }
    });

    function applyZone(date, fromZone, toZone) {
        if (toZone) {
            date = kendo.timezone.convert(date, fromZone, toZone);
        } else {
            date = kendo.timezone.remove(date, fromZone);
        }

        return date;
    }

    function validDateValidator(input) {
        if ((input.filter("[name=start]").length && input.filter("[title=Start]").length) ||
            (input.filter("[name=end]").length && input.filter("[title=End]").length) ||
            input.filter(".k-recur-until").length) {
            var date;
            var picker = kendo.widgetInstance(input, kendo.ui);

            if (picker) {
                date = kendo.parseDate(input.val(), picker.options.format);
                return !!date && picker.value();
            } else {
                date = kendo.parseDate(input.val());
                return !!date;
            }
        }

        return true;
    }

    function dateCompareValidator(input) {
        if (input.filter("[name=end]").length) {
            var container = input.closest(".k-scheduler-edit-form");
            var startInput = container.find("[name=start]:visible");
            var endInput = container.find("[name=end]:visible");

            if (endInput[0] && startInput[0]) {
                var start, end;
                var startPicker = kendo.widgetInstance(startInput, kendo.ui);
                var endPicker = kendo.widgetInstance(endInput, kendo.ui);

                var editable = container.data("kendoEditable");
                var model = editable ? editable.options.model : null;

                if (startPicker && endPicker) {
                    start = startPicker.value();
                    end = endPicker.value();
                } else {
                    start = kendo.parseDate(startInput.val());
                    end = kendo.parseDate(endInput.val());
                }

                if (start && end) {
                    if (model) {
                        var timezone = startInput.attr(kendo.attr("timezone"));
                        var startTimezone = model.startTimezone;
                        var endTimezone = model.endTimezone;

                        startTimezone = startTimezone || endTimezone;
                        endTimezone = endTimezone || startTimezone;

                        if (startTimezone) {
                            start = applyZone(start, startTimezone, timezone);
                            end = applyZone(end, endTimezone, timezone);
                        }
                    }

                    return start <= end;
                }
            }
        }

        return true;
    }

    function untilDateCompareValidator(input) {
        var untilPicker, until,
            container, startInput, start, startPicker;

        if (input.filter(".k-recur-until").length) {
            untilPicker = kendo.widgetInstance(input, kendo.ui);
            until = untilPicker.value();
            container = input.closest(".k-scheduler-edit-form");
            startInput = container.find("[name=start]:visible");

            if (startInput[0]) {
                startPicker = kendo.widgetInstance(startInput, kendo.ui);

                if (startPicker) {
                    start = startPicker.value();
                } else {
                    start = kendo.parseDate(startInput.val());
                }

                if (start && until) {
                    return start <= until;
                }
            }
        }

        return true;
    }

    var SchedulerEvent = kendo.data.Model.define({
        init: function(value) {
            var that = this;

            kendo.data.Model.fn.init.call(that, value);

            that._defaultId = that.defaults[that.idField];
        },

        _time: function(field) {
            var date = this[field];
            var fieldTime = "_" + field + "Time";

            if (this[fieldTime]) {
                return this[fieldTime] - kendo.date.toUtcTime(kendo.date.getDate(date));
            }

            return getMilliseconds(date);
        },

        _date: function(field) {
            var fieldTime = "_" + field + "Time";

            if (this[fieldTime]) {
                return this[fieldTime] - this._time(field);
            }

            return kendo.date.getDate(this[field]);
        },

        clone: function(options, updateUid) {
            var uid = this.uid,
                event = new this.constructor($.extend({}, this.toJSON(), options));

            if (!updateUid) {
                event.uid = uid;
            }

            return event;
        },

        duration: function() {
            var end = this.end;
            var start = this.start;
            var offset = (end.getTimezoneOffset() - start.getTimezoneOffset()) * kendo.date.MS_PER_MINUTE;

            return end - start - offset;
        },

        expand: function(start, end, zone) {
            return recurrence ? recurrence.expand(this, start, end, zone) : [this];
        },

        update: function(eventInfo) {
            for (var field in eventInfo) {
                this.set(field, eventInfo[field]);
            }

            if (this._startTime) {
                this.set("_startTime", kendo.date.toUtcTime(this.start));
            }

            if (this._endTime) {
                this.set("_endTime", kendo.date.toUtcTime(this.end));
            }
        },

        isMultiDay: function() {
            return this.isAllDay || this.duration() >= kendo.date.MS_PER_DAY;
        },

        isException: function() {
            return !this.isNew() && this.recurrenceId;
        },

        isOccurrence: function() {
            return this.isNew() && this.recurrenceId;
        },

        isRecurring: function() {
            return !!(this.recurrenceRule || this.recurrenceId);
        },

        isRecurrenceHead: function() {
            return !!(this.id && this.recurrenceRule);
        },

        toOccurrence: function(options) {
            options = $.extend(options, {
                recurrenceException: null,
                recurrenceRule: null,
                recurrenceId: this.id || this.recurrenceId
            });

            options[this.idField] = this.defaults[this.idField];

            return this.clone(options, true);
        },

        toJSON: function() {
            var obj = kendo.data.Model.fn.toJSON.call(this);
            obj.uid = this.uid;

            delete obj._startTime;
            delete obj._endTime;

            return obj;
        },

        shouldSerialize: function(field) {
            return kendo.data.Model.fn.shouldSerialize.call(this, field) && field !== "_defaultId";
        },

        set: function(key, value) {
            var isAllDay = this.isAllDay || false;

            kendo.data.Model.fn.set.call(this, key, value);

            if (key == "isAllDay" && value != isAllDay) {
                var start = kendo.date.getDate(this.start);
                var end = new Date(this.end);
                var milliseconds = kendo.date.getMilliseconds(end);

                if (milliseconds === 0 && value) {
                    milliseconds = MS_PER_DAY;
                }

                this.set("start", start);

                if (value === true) {
                    kendo.date.setTime(end, -milliseconds);

                    if (end < start) {
                        end = start;
                    }
                } else {
                    kendo.date.setTime(end, MS_PER_DAY - milliseconds);
                }

                this.set("end", end);
            }
        },
        id: "id",
        fields: {
            id: { type: "number" },
            title: { defaultValue: "", type: "string" },
            start: { type: "date", validation: { required: true, validDate: { value: validDateValidator } } },
            startTimezone: { type: "string" },
            end: {
                type: "date",
                validation: {
                    required: true,
                    validDate: { value: validDateValidator },
                    dateCompare: { value: dateCompareValidator }
                }
            },
            endTimezone: { type: "string" },
            recurrenceRule: {
                defaultValue: "",
                type: "string",
                validation: {
                    validDate: { value: validDateValidator },
                    untilDateCompare: { value: untilDateCompareValidator }
                }
            },
            recurrenceException: { defaultValue: "", type: "string" },
            isAllDay: { type: "boolean", defaultValue: false },
            description: { type: "string" }
        }
    });

    var SchedulerDataSource = DataSource.extend({
        init: function(options) {

            DataSource.fn.init.call(this, extend(true, {}, {
                schema: {
                    modelBase: SchedulerEvent,
                    model: SchedulerEvent
                }
            }, options));

            this.reader = new SchedulerDataReader(this.options.schema, this.reader);
        },

        expand: function(start, end) {
            var data = this.view(),
                filter = {},
                endOffset;

            if (start && end) {
                endOffset = end.getTimezoneOffset();
                end = new Date(end.getTime() + MS_PER_DAY - 1);

                if (end.getTimezoneOffset() !== endOffset) {
                    end = kendo.timezone.apply(end, endOffset);
                }

                filter = {
                    logic: "or",
                    filters: [
                        {
                            logic: "and",
                            filters: [
                                { field: "start", operator: "gte", value: start },
                                { field: "end", operator: "gte", value: start },
                                { field: "start", operator: "lte", value: end }
                            ]
                        },
                        {
                            logic: "and",
                            filters: [
                                { field: "start", operator: "lte", value: new Date(start.getTime() + MS_PER_DAY - 1) },
                                { field: "end", operator: "gte", value: start }
                            ]
                        }
                    ]
                };

                data = new kendo.data.Query(expandAll(data, start, end, this.reader.timezone)).filter(filter).toArray();
            }

            return data;
        },

        cancelChanges: function(model) {
            if (model && model.isOccurrence()) {
                this._removeExceptionDate(model);
            }

            DataSource.fn.cancelChanges.call(this, model);
        },

        insert: function(index, model) {
            if (!model) {
                return;
            }

            if (!(model instanceof SchedulerEvent)) {
                var eventInfo = model;

                model = this._createNewModel();
                model.accept(eventInfo);
            }

            if ((!this._pushCreated && model.isRecurrenceHead()) || model.recurrenceId) {
                model = model.recurrenceId ? model : model.toOccurrence();
                this._addExceptionDate(model);
            }

            return DataSource.fn.insert.call(this, index, model);
        },

        pushCreate: function(items) {
            this._pushCreated = true;
            DataSource.fn.pushCreate.call(this, items);
            this._pushCreated = false;
        },

        remove: function(model) {
            if (model.isRecurrenceHead()) {
                this._removeExceptions(model);
            } else if (model.isRecurring()) {
                this._addExceptionDate(model);
            }

            return DataSource.fn.remove.call(this, model);
        },

        _removeExceptions: function(model) {
            var data = this.data().slice(0),
                item = data.shift(),
                id = model.id;

            while (item) {
                if (item.recurrenceId === id) {
                    DataSource.fn.remove.call(this, item);
                }

                item = data.shift();
            }

            model.set(RECURRENCE_EXCEPTION, "");
        },

        _removeExceptionDate: function(model) {
            if (model.recurrenceId) {
                var head = this.get(model.recurrenceId);

                if (head) {
                    var start = model.defaults.start;
                    var replaceRegExp = new RegExp("(\\" + EXCEPTION_SEPARATOR + "?)" + recurrence.toExceptionString(start, this.reader.timezone));
                    var recurrenceException = (head.recurrenceException || "").replace(OLD_EXCEPTION_SEPARATOR_REGEXP, EXCEPTION_SEPARATOR).replace(/\,$/, "");

                    if (replaceRegExp.test(recurrenceException)) {
                        head.set(RECURRENCE_EXCEPTION, recurrenceException.replace(replaceRegExp, ""));
                    } else {
                        start = model.start;
                        replaceRegExp = new RegExp("(\\" + EXCEPTION_SEPARATOR + "?)" + recurrence.toExceptionString(start, this.reader.timezone));
                        head.set(RECURRENCE_EXCEPTION, recurrenceException.replace(replaceRegExp, ""));
                    }
                }
            }
        },

        _addExceptionDate: function(model) {
            var start = model.start;
            var zone = this.reader.timezone;
            var head = this.get(model.recurrenceId);
            var recurrenceException = (head.recurrenceException || "").replace(OLD_EXCEPTION_SEPARATOR_REGEXP, EXCEPTION_SEPARATOR).replace(/\,$/, "");

            if (!recurrence.isException(recurrenceException, start, zone)) {
                var newException = recurrence.toExceptionString(start, zone);
                model.defaults.start = start;
                head.set(RECURRENCE_EXCEPTION, recurrenceException + (recurrenceException && newException ? EXCEPTION_SEPARATOR : "") + newException);
            }
        }
    });

    function expandAll(events, start, end, zone) {
        var length = events.length,
            data = [],
            idx = 0;

        for (; idx < length; idx++) {
            data = data.concat(events[idx].expand(start, end, zone));
        }

        return data;
    }

    SchedulerDataSource.create = function(options) {
        if (isArray(options) || options instanceof kendo.data.ObservableArray) {
            options = { data: options };
        }

        var dataSource = options || {},
            data = dataSource.data;

        dataSource.data = data;

        if (!(dataSource instanceof SchedulerDataSource) && dataSource instanceof kendo.data.DataSource) {
            throw new Error("Incorrect DataSource type. Only SchedulerDataSource instances are supported");
        }

        return dataSource instanceof SchedulerDataSource ? dataSource : new SchedulerDataSource(dataSource);
    };

    extend(true, kendo.data, {
       SchedulerDataSource: SchedulerDataSource,
       SchedulerDataReader: SchedulerDataReader,
       SchedulerEvent: SchedulerEvent
    });

    var defaultCommands = {
        update: {
            text: "Save",
            className: "k-button-solid-primary k-scheduler-update"
        },
        canceledit: {
            text: "Cancel",
            className: "k-scheduler-cancel"
        },
        destroy: {
            text: "Delete",
            icon: "trash",
            imageClass: "k-i-trash",
            className: "k-button-solid-primary k-scheduler-delete",
            iconClass: "k-icon"
        }
    };

    function trimOptions(options, overrideOptions) {
        delete options.name;
        delete options.prefix;

        delete options.remove;
        delete options.edit;
        delete options.add;
        delete options.navigate;

        for (var key in overrideOptions) {
            options[key] = overrideOptions[key];
        }

        return options;
    }

    /*
    function fieldType(field) {
        field = field != null ? field : "";
        return field.type || kendo.type(field) || "string";
    }
    */

    function descriptionEditor(options) {
        var attr = createValidationAttributes(options.model, options.field);

        return function(container, model) {
            $('<textarea name="description" class="k-input-inner" title="' + model.title + '"/>').attr(attr)
                .appendTo(container)
                .wrap('<span class="k-input k-textarea k-input-solid k-input-md k-rounded-md"></span>');
        };
    }

    function createValidationAttributes(model, field) {
        var modelField = (model.fields || model)[field];
        var specialRules = ["url", "email", "number", "date", "boolean"];
        var validation = modelField ? modelField.validation : {};
        // var type = fieldType(modelField);
        var datatype = kendo.attr("type");
        var inArray = $.inArray;
        var ruleName;
        var rule;

        var attr = {};

        for (ruleName in validation) {
            rule = validation[ruleName];

            if (inArray(ruleName, specialRules) >= 0) {
                attr[datatype] = ruleName;
            } else if (!kendo.isFunction(rule)) {
                attr[ruleName] = isPlainObject(rule) ? (rule.value || ruleName) : rule;
            }

            attr[kendo.attr(ruleName + "-msg")] = rule.message;
        }

        return attr;
    }

    function filterResourceEditorData(editor, parentValue, parentValueField, valueField) {
        var editorValue = editor.value(),
            isMs = Array.isArray(editorValue),
            valueArray;

        if (isMs) {
            valueArray = JSON.parse(JSON.stringify(editorValue));
        } else {
            valueArray = [editorValue.toString()];
        }

        editor.dataSource.data().forEach(function(item) {
            if (item[parentValueField] === null || item[parentValueField] === undefined$1 || item[parentValueField] == parentValue) {
                item.set(DISABLED, false);
            } else {
                var currentValue = item.get(valueField);

                item.set(DISABLED, true);

                if (valueArray.indexOf(currentValue) >= 0 || valueArray.indexOf(currentValue.toString()) >= 0) {
                    if (isMs) {
                        valueArray.splice(valueArray.indexOf(currentValue), 1);
                    } else {
                        editor.value(null);
                        editor.trigger(CHANGE);
                    }
                }
            }
        });

        if (isMs && valueArray.length < editorValue.length) {
            editor.value(valueArray);
            editor.trigger(CHANGE);
        }
    }

    function bindParentValueChangeHandler(container, currentEditor, resource, parent) {
        var parentElement = container.closest(".k-edit-form-container").find("[data-" + kendo.ns + "bind='value:" + parent + "']");
        var parentWidget = parentElement.getKendoDropDownList();

        if (parentWidget) {
            parentWidget.bind(CHANGE, function(ev) {
                var parentValue = ev.sender.value();

                filterResourceEditorData(currentEditor, parentValue, resource.dataParentValueField, resource.dataValueField);
            });
        } else {
            parentElement.on(CHANGE, function(ev) {
                var parentValue = ev.target.value;

                filterResourceEditorData(currentEditor, parentValue, resource.dataParentValueField, resource.dataValueField);
            });
        }
    }

    function filterMobileResourceEditorData(resource, currentEditor, parentSelectedValue) {
        var options = currentEditor.find(OPTION),
            editorValue = currentEditor.val(),
            isMs = Array.isArray(editorValue),
            valueArray;

        if (isMs) {
            valueArray = JSON.parse(JSON.stringify(editorValue));
        } else {
            valueArray = [editorValue];
        }

        resource.dataSource.view().forEach(function(item, index) {
            var itemParentValue = kendo.getter(resource.dataParentValueField)(item);
            var valid = itemParentValue === null || itemParentValue === undefined$1 || itemParentValue == parentSelectedValue;

            if (valid) {
                options[index].removeAttribute(DISABLED);
            } else {
                options[index].setAttribute(DISABLED, DISABLED);

                var currentValue = "" + item.get(resource.dataValueField);

                if (valueArray.indexOf(currentValue) >= 0) {
                    if (isMs) {
                        valueArray.splice(valueArray.indexOf(currentValue), 1);
                    } else {
                        currentEditor.val(null);
                        currentEditor.trigger(CHANGE);
                    }
                }
            }
        });

        if (isMs && valueArray.length < editorValue.length) {
            currentEditor.val(valueArray);
            currentEditor.trigger(CHANGE);
        }
    }

    function dropDownResourceEditor(resource, model, parent) {
        var attr = createValidationAttributes(model, resource.field);

        return function(container) {
            var currentEditor;

            if (parent) {
                setTimeout(function() {
                    filterResourceEditorData(currentEditor, model[parent], resource.dataParentValueField, resource.dataValueField);
                    bindParentValueChangeHandler(container, currentEditor, resource, parent);
                });
            }

            currentEditor = $(kendo.format('<select aria-labelledby="' + resource.field + '_label" data-{0}bind="value:{1}" title="' + model.title + '">', kendo.ns, resource.field))
                .appendTo(container)
                .attr(attr)
                .kendoDropDownList({
                    dataTextField: resource.dataTextField,
                    dataValueField: resource.dataValueField,
                    dataSource: resource.dataSource.data(),
                    valuePrimitive: resource.valuePrimitive,
                    optionLabel: "None",
                    template: (data) => `<span ${data.disabled ? "data-disabled" : ""}><span class="k-scheduler-mark" ${kendo.attr("style-background-color")}="${data[resource.dataColorField] || "none"}"></span>${data[resource.dataTextField]}</span>`,
                    select: function(e) {
                        if (e.dataItem && e.dataItem.disabled) {
                            e.preventDefault();
                        }
                    },
                    dataBound: function(e) {
                        var options = e.sender.list.find('li');

                        options.each(function(i, el) {
                            var element = $(el);

                            if (element.find("[data-disabled]").length > 0) {
                                element.addClass("k-disabled");
                            }
                        });
                    }
                }).data("kendoDropDownList");
       };
    }

    function dropDownResourceEditorMobile(resource, model, parent) {
        var attr = createValidationAttributes(model, resource.field);

        return function(container) {
            var options = "";
            var view = resource.dataSource.view();

            for (var idx = 0, length = view.length; idx < length; idx++) {
                options += kendo.format('<option value="{0}">{1}</option>',
                    kendo.getter(resource.dataValueField)(view[idx]),
                    kendo.getter(resource.dataTextField)(view[idx])
                );
            }

            var currentEditor = $(kendo.format('<select aria-labelledby="' + resource.field + '_label" data-{0}bind="value:{1}">{2}</select>',
                kendo.ns,
                resource.field,
                options
            ))
            .appendTo(container)
            .attr(attr);

            if (parent) {
                setTimeout(function() {
                    var parentElement = container.closest(".k-stretched-view").find("[data-" + kendo.ns + "bind='value:" + parent + "']");
                    var parentSelectedValue = model[parent];

                    filterMobileResourceEditorData(resource, currentEditor, parentSelectedValue);

                    parentElement.on(CHANGE, function(ev) {
                        var parentValue = ev.target.value;

                        filterMobileResourceEditorData(resource, currentEditor, parentValue);
                    });
                });
            }
       };
    }

    function multiSelectResourceEditor(resource, model, parent) {
        var attr = createValidationAttributes(model, resource.field);

        return function(container) {
            var currentEditor;

            if (parent) {
                setTimeout(function() {
                    filterResourceEditorData(currentEditor, model[parent], resource.dataParentValueField, resource.dataValueField);
                    bindParentValueChangeHandler(container, currentEditor, resource, parent);
                });
            }

            currentEditor = $(kendo.format('<select aria-labelledby="' + resource.field + '_label" data-{0}bind="value:{1}">', kendo.ns, resource.field))
                .appendTo(container)
                .attr(attr)
                .kendoMultiSelect({
                    dataTextField: resource.dataTextField,
                    dataValueField: resource.dataValueField,
                    dataSource: resource.dataSource.data(),
                    valuePrimitive: resource.valuePrimitive,
                    itemTemplate: (data) => `<span ${data.disabled ? "data-disabled" : ""}><span class="k-scheduler-mark" ${kendo.attr("style-background-color")}="${data[resource.dataColorField] || "none"}"></span>${data[resource.dataTextField]}</span>`,
                    tagTemplate: (data) => `<span class="k-scheduler-mark" ${kendo.attr("style-background-color")}="${data[resource.dataColorField] || "none"}"></span>${data[resource.dataTextField]}`,
                    select: function(e) {
                        if (e.dataItem && e.dataItem.disabled) {
                            e.preventDefault();
                        }
                    },
                    dataBound: function(e) {
                        var options = e.sender.list.find('li');

                        options.each(function(i, el) {
                            var element = $(el);

                            if (element.find("[data-disabled]").length > 0) {
                                element.addClass("k-disabled");
                            }
                        });
                    }
                }).data("kendoMultiSelect");
       };
    }

    function multiSelectResourceEditorMobile(resource, model, parent) {
        var attr = createValidationAttributes(model, resource.field);

        return function(container) {
            var options = "";
            var view = resource.dataSource.view();

            for (var idx = 0, length = view.length; idx < length; idx++) {
                options += kendo.format('<option value="{0}">{1}</option>',
                    kendo.getter(resource.dataValueField)(view[idx]),
                    kendo.getter(resource.dataTextField)(view[idx])
                );
            }

            var currentEditor = $(kendo.format('<select aria-labelledby="' + resource.field + '_label" data-{0}bind="value:{1}" multiple="multiple">{2}</select>',
                kendo.ns,
                resource.field,
                options
            ))
            .appendTo(container)
            .attr(attr);

            if (parent) {
                setTimeout(function() {
                    var parentElement = container.closest(".k-stretched-view").find("[data-" + kendo.ns + "bind='value:" + parent + "']");
                    var parentSelectedValue = model[parent];

                    filterMobileResourceEditorData(resource, currentEditor, parentSelectedValue);

                    parentElement.on(CHANGE, function(ev) {
                        var parentValue = ev.target.value;

                        filterMobileResourceEditorData(resource, currentEditor, parentValue);
                    });
                });
            }
       };
    }

    function moveEventRange(event, distance) {
        var duration = event.end.getTime() - event.start.getTime();

        var start = new Date(event.start.getTime());

        kendo.date.setTime(start, distance);

        var end = new Date(start.getTime());

        kendo.date.setTime(end, duration, true);

        return {
            start: start,
            end: end
        };
    }

    var editors = {
        mobile: {
            dateRange: MOBILEDATERANGEEDITOR,
            timezonePopUp: MOBILETIMEZONEPOPUP,
            timezone: MOBILETIMEZONEEDITOR,
            recurrence: MOBILERECURRENCEEDITOR,
            description: descriptionEditor,
            multipleResources: multiSelectResourceEditorMobile,
            resources: dropDownResourceEditorMobile,
            isAllDay: MOBILEISALLDAYEDITOR
        },
        desktop: {
            dateRange: DATERANGEEDITOR,
            timezonePopUp: TIMEZONEPOPUP,
            timezone: TIMEZONEEDITOR,
            recurrence: RECURRENCEEDITOR,
            description: descriptionEditor,
            multipleResources: multiSelectResourceEditor,
            resources: dropDownResourceEditor,
            isAllDay: ISALLDAYEDITOR
        }
    };

    var Editor = kendo.Observable.extend({
        init: function(element, options) {

            kendo.Observable.fn.init.call(this);

            this.element = element;
            this.options = extend(true, {}, this.options, options);
            this.createButton = this.options.createButton;

            this.toggleDateValidationHandler = this._toggleDateValidation.bind(this);
        },

        _toggleDateValidation: function(e) {
            if (e.field == "isAllDay") {
                var container = this.container,
                    isAllDay = this.editable.options.model.isAllDay,
                    bindAttribute = kendo.attr("bind"),
                    element, isDateTimeInput, shouldValidate;
                container.find("[" + bindAttribute + "*=end],[" + bindAttribute + "*=start]").each(function() {
                    element = $(this);
                    if (valueStartEndBoundRegex.test(element.attr(bindAttribute))) {
                        isDateTimeInput = element.is("[" + kendo.attr("role") + "=datetimepicker],[type*=datetime]");
                        shouldValidate = isAllDay !== isDateTimeInput;
                        element.attr(kendo.attr("validate"), shouldValidate);
                    }
                });
            }
        },

        fields: function(editors, model) {
            var that = this;
            var messages = that.options.messages;
            var timezone = that.options.timezone;

            var click = function(e) {
                e.preventDefault();
                that._initTimezoneEditor(model, this);
            };

            var fields = [
                { field: "title", title: messages.editor.title /*, format: field.format, editor: field.editor, values: field.values*/ },
                { field: "start", title: messages.editor.start, editor: editors.dateRange, timezone: timezone },
                { field: "end", title: messages.editor.end, editor: editors.dateRange, timezone: timezone },
                { field: "isAllDay", title: messages.editor.allDayEvent, editor: editors.isAllDay }
            ];

            var checkHierarchical = function(item) {
                return !!item[resource.dataParentValueField];
            };

            if (kendo.timezone.windows_zones) {
                fields.push({ field: "timezone", title: messages.editor.timezone, editor: editors.timezonePopUp, click: click, messages: messages.editor, model: model });
                fields.push({ field: "startTimezone", title: messages.editor.startTimezone, editor: editors.timezone, noTimezone: messages.editor.noTimezone });
                fields.push({ field: "endTimezone", title: messages.editor.endTimezone, editor: editors.timezone, noTimezone: messages.editor.noTimezone });
            }

            if (!model.recurrenceId) {
                fields.push({ field: "recurrenceRule", title: messages.editor.repeat, editor: editors.recurrence, timezone: timezone, messages: messages.recurrenceEditor, pane: this.pane });
            }

            if ("description" in model) {
                fields.push({ field: "description", title: messages.editor.description, editor: editors.description({ model: model, field: "description" }) });
            }

            for (var resourceIndex = 0; resourceIndex < this.options.resources.length; resourceIndex++) {
                var resource = this.options.resources[resourceIndex];
                var resourceView = resource.dataSource.view();
                var hasParent = resourceView.some(checkHierarchical);
                var parentResource, parent;

                if (hasParent) {
                    parentResource = this.options.resources[resourceIndex - 1];

                    if (parentResource) {
                        parent = parentResource.field;
                    }
                }

                fields.push({
                    field: resource.field,
                    title: resource.title,
                    editor: resource.multiple ? editors.multipleResources(resource, model, parent) : editors.resources(resource, model, parent)
                });
            }

            return fields;
        },

        end: function() {
            return this.editable.end();
        },

        _buildDesktopEditTemplate: function(model, fields, editableFields) {
            var messages = this.options.messages;

            const startTimezone = `<div class="k-popup-edit-form k-scheduler-edit-form k-scheduler-timezones" ${kendo.attr("style-display")}="none">` +
                                    '<div class="k-form">' +
                                    '<div class="k-form-field"><div class="k-form-field-wrap">' + kendo.html.renderCheckBox($('<input class="k-timezone-toggle"/>'), { label: messages.editor.separateTimezones }) + '</div></div>';

            const editableField = (fieldName) => {
                const isEditable = !model.editable || model.editable(fieldName);

                if (isEditable) {
                    return `<div ${kendo.attr("container-for")}="${fieldName}" class="k-form-field-wrap"></div>`;
                } else {
                    return `<div class="k-form-field-wrap">${(fieldName && kendo.getter(fieldName)(model)) || ''}</div>`;
                }
            };

            const generateFields = (field) => {
                const fieldName = field.field;
                const fieldTitle = field.title;
                const modelField = model.fields[fieldName];
                const isEditable = !model.editable || model.editable(fieldName);

                if (isEditable) {
                    editableFields.push(field);
                }

                return (fieldName === 'startTimezone' ? startTimezone : '') +
                    (modelField && modelField.type === "boolean" ?
                        `<div class="k-form-field">${editableField(fieldName)}</div>` :
                        `<div class="k-form-field"><label class="k-label k-form-label" for="${fieldName}" id="${fieldName}_label">${fieldTitle || fieldName || ""}</label>${editableField(fieldName)}</div>`) +
                    (fieldName === 'endTimezone' ? this._createEndTimezoneButton() : '');
            };

            return `<div class="k-form">` +
                fields.map(generateFields).join('') +
            `</div>`;
        },

        _buildMobileEditTemplate: function(model, fields, editableFields) {
            var messages = this.options.messages;

            const startTimezone = `<div class="k-popup-edit-form k-scheduler-edit-form k-scheduler-timezones" ${kendo.attr("style-display")}="none">` +
                                    '<ul class="k-listgroup k-listgroup-flush">' +
                                        '<li class="k-item k-listgroup-item">' +
                                            '<label class="k-label k-listgroup-form-row">' +
                                                '<span class="k-item-title k-listgroup-form-row">' + encode(messages.editor.separateTimezones) + '</span>' +
                                                '<span class="k-listgroup-form-field-wrapper">' +
                                                    '<input class="k-timezone-toggle" data-role="switch" type="checkbox" />' +
                                                '</span>' +
                                            '</label>' +
                                        '</li>';

            const editableField = (field) => {
                const fieldName = field.field;
                const fieldTitle = field.title;
                const isEditable = !model.editable || model.editable(fieldName);
                let midPart;

                if (isEditable) {
                    midPart = `${fieldName === 'timezone' ?
                                    `<label class="k-label k-listgroup-form-row" data-bind="css: { k-disabled: isAllDay }">` :
                                    `<label class="k-label k-listgroup-form-row">`}` +
                        `<span class="k-item-title k-listgroup-form-field-label">${fieldTitle || fieldName || ""}</span>` +
                        `<div class="k-listgroup-form-field-wrapper" ${kendo.attr("container-for")}="${fieldName}"></div>`;
                } else {
                    midPart = `<li class="k-item k-listgroup-item">` +
                        `<label class="k-label k-no-click k-listgroup-form-row">` +
                        `<span class="k-item-title k-listgroup-form-field-label">${fieldTitle || fieldName || ""}</span>` +
                        `<span class="k-no-editor k-listgroup-form-field-wrapper">${(fieldName && kendo.getter(fieldName)(model)) || ''}</span>`;
                }


                return `<li class="k-item k-listgroup-item">` +
                   midPart +
                `</label></li>`;

            };

            const generateFields = (field) => {
                const fieldName = field.field;
                const isEditable = !model.editable || model.editable(fieldName);

                if (isEditable) {
                    editableFields.push(field);
                }

                return (fieldName === "timezone" || fieldName === "recurrenceRule" ? '</ul><ul class="k-listgroup k-listgroup-flush">' : '') +
                    (fieldName === 'startTimezone' ? startTimezone : '') +
                    editableField(field) +
                    (fieldName === 'recurrenceRule' ? '</ul><ul class="k-listgroup k-listgroup-flush">' : '') +
                    (fieldName === 'endTimezone' ? '</ul></div>' : '');
            };

            const result = `<ul class="k-listgroup k-listgroup-flush">` +
                fields.map(generateFields).join('') +
            `</ul>`;

            return result;
        },

        _buildEditTemplate: function(model, fields, editableFields, isMobile) {
            var settings = extend({}, kendo.Template, this.options.templateSettings);
            var template = this.options.editable.template;
            var html = "";

            if (template) {
                if (typeof template === STRING) {
                    template = kendo.unescape(template);
                }
                html += (kendo.template(template, settings))(model);
            } else if (isMobile) {
                html += '<div data-role="content">' + this._buildMobileEditTemplate(model, fields, editableFields) + '</div>';
            } else {
                html += this._buildDesktopEditTemplate(model, fields, editableFields);
            }

            return html;
        },

        _createEndTimezoneButton: function() {
            return '</ul></div>';
        },

        _revertTimezones: function(model) {
            model.set("startTimezone", this._startTimezone);
            model.set("endTimezone", this._endTimezone);

            delete this._startTimezone;
            delete this._endTimezone;
        }
    });

    var MobileEditor = Editor.extend({
        init: function() {
            Editor.fn.init.apply(this, arguments);

            this.pane = kendo.Pane.wrap(this.element, {
                viewEngine: {
                    viewOptions: {
                        renderOnInit: true,
                        wrap: false,
                        wrapInSections: true,
                        detachOnHide: false,
                        detachOnDestroy: false
                    }
                }
            });
            this.pane.element.parent().css("height", this.options.height);
            this.view = this.pane.view();
        },

        options: {
            animations: {
                left: "slide",
                right: "slide:right"
            }
        },

        destroy: function() {
            this.close();
            this.unbind();
            this.pane.destroy();
        },

        _initTimezoneEditor: function(model) {
            var that = this;
            var pane = that.pane;
            var messages = that.options.messages;
            var timezoneView = that.timezoneView;
            var container = timezoneView ? timezoneView.content.find(".k-scheduler-timezones") : that.container.find(".k-scheduler-timezones");
            var kSwitch = container.find("input.k-timezone-toggle").data("kendoSwitch");
            var endTimezoneRow = container.find("li.k-item:not(.k-zonepicker)").last();
            var startTimezoneChange = function(e) {
                if (e.field === "startTimezone") {
                    var value = model.startTimezone;

                    kSwitch.enable(value);

                    if (!value) {
                        endTimezoneRow.hide();
                        model.set("endTimezone", "");
                        kSwitch.value(false);
                    }
                }
            };

            that._startTimezone = model.startTimezone || "";
            that._endTimezone = model.endTimezone || "";

            if (!timezoneView) {
                var html = '<div data-role="view" class="k-popup-edit-form k-scheduler-edit-form">' +
                '<div data-role="header" class="k-header">' +
                    '<a href="\\#" class="k-header-cancel k-scheduler-cancel k-link" title="' + messages.cancel + '"' +
                    `aria-label="${messages.cancel}">${kendo.ui.icon("chevron-left")}</a>` +
                    encode(messages.editor.timezoneTitle) +
                    '<a href="\\#" class="k-header-done k-scheduler-update k-link" title="' + messages.save + '" ' +
                    `aria-label="${messages.save}">${kendo.ui.icon("check")}</a>` +
                '</div><div data-role="content"></div>';

                this.timezoneView = timezoneView = pane.append(html);

                timezoneView.contentElement.append(container.show());

                timezoneView.element.on(CLICK + NS, ".k-scheduler-cancel, .k-scheduler-update", function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if ($(this).hasClass("k-scheduler-cancel")) {
                        that._revertTimezones(model);
                    }

                    var editView = that._editPane;

                    var text = timezoneButtonText(model, messages.editor.noTimezone);

                    editView.content.find(".k-timezone-label").text(text);

                    pane.navigate(editView, that.options.animations.right);
                });

                kSwitch.bind(CHANGE, function(ev) {
                    endTimezoneRow.toggle(ev.checked);
                    model.set("endTimezone", "");
                });
                model.bind(CHANGE, startTimezoneChange);
            }

            kSwitch.value(!!model.endTimezone);
            kSwitch.enable(!!model.startTimezone);

            if (model.endTimezone) {
                endTimezoneRow.show();
            } else {
                endTimezoneRow.hide();
            }

            pane.navigate(timezoneView, that.options.animations.left);
        },

        showDialog: function(options) {
            var actions = options.buttons.map(function(button) {
                return {
                    text: button.text,
                    action: button.click
                };
            });

            actions.push({
                text: this.options.messages.cancel,
                primary: true
            });

            $("<div />").appendTo(document.body)
                .kendoDialog({
                    close: function() {
                        this.destroy();
                    },
                    modal: {
                        preventScroll: true
                    },
                    closable: false,
                    title: false,
                    content: options.text,
                    actions: actions
                });
        },

        editEvent: function(model) {
            var pane = this.pane;
            var html = "";

            var messages = this.options.messages;
            var updateText = messages.save;
            var removeText = messages.destroy;
            var cancelText = messages.cancel;
            var titleText = messages.editor.editorTitle;
            var resetSeries = messages.resetSeries;

            html += '<div data-role="view" class="k-popup-edit-form k-scheduler-edit-form"' + kendo.attr("uid") + '="' + model.uid + '">' +
                '<div data-role="header" class="k-header">' +
                    '<a href="#" class="k-header-cancel k-scheduler-cancel k-link" title="' + cancelText + '"' +
                    `aria-label="${cancelText}">${kendo.ui.icon("chevron-left")}</a>` +
                    encode(titleText) +
                    '<a href="#" class="k-header-done k-scheduler-update k-link" title="' + updateText + '" ' +
                    `aria-label="${updateText}">${kendo.ui.icon("check")}</a>` +
                '</div>';

            var fields = this.fields(editors.mobile, model);

            var that = this;

            var editableFields = [];

            html += this._buildEditTemplate(model, fields, editableFields, true);

            html += "</div>";

            var view = pane.append(html);

            if (!model.isNew() && this.options.editable && this.options.editable.destroy !== false && model.isRecurrenceHead() && model.recurrenceException) {
                var resetSeriesBtn = '<ul class="k-edit-buttons k-listgroup k-listgroup-flush"><li class="k-item k-listgroup-item"><span class="k-scheduler-resetSeries k-link k-label" aria-label="' + resetSeries + '">' + resetSeries + '</span></li></ul>';
                view.contentElement.append(resetSeriesBtn);
            }

            if (!model.isNew() && this.options.editable && this.options.editable.destroy !== false) {
                var deleteBtn = '<ul class="k-edit-buttons k-listgroup k-listgroup-flush"><li class="k-item k-listgroup-item"><span class="k-scheduler-delete k-link k-label" aria-label="' + removeText + '">' + removeText + '</span></li></ul>';
                view.contentElement.append(deleteBtn);
            }

            this._editPane = view;

            var container = this.container = view.element;

            this.editable = container.kendoEditable({
                fields: editableFields,
                model: model,
                clearContainer: false,
                target: that.options.target,
                validateOnBlur: true
            }).data("kendoEditable");

            if (!this.trigger("edit", { container: container, model: model })) {

                container.on(CLICK + NS, "a.k-scheduler-edit, a.k-scheduler-cancel, a.k-scheduler-update, span.k-scheduler-delete, span.k-scheduler-resetSeries", function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var button = $(this);

                    if (!button.hasClass("k-scheduler-edit")) {

                        var name = "cancel";

                        if (button.hasClass("k-scheduler-update")) {
                            name = "save";
                        } else if (button.hasClass("k-scheduler-delete")) {
                            name = "remove";
                        } else if (button.hasClass("k-scheduler-resetSeries")) {
                            name = RESET;
                        }

                        that.trigger(name, { container: container, model: model });
                    } else {
                        pane.navigate(this._editPane, that.options.animations.right);
                    }
                });

                pane.navigate(view, that.options.animations.left);

                model.bind(CHANGE, that.toggleDateValidationHandler);
            } else {
                this.trigger("cancel", { container: container, model: model });
            }

            return this.editable;
        },

        _views: function() {
            return this.pane.element
                    .find(kendo.roleSelector("view"))
                    .not(this.view.element);
        },

        close: function() {
            if (this.container) {
                this.pane.navigate("", this.options.animations.right);

                var views = this._views();
                var view;

                for (var idx = 0, length = views.length; idx < length; idx++) {
                    view = views.eq(idx).data("kendoView");
                    if (view) {
                       view.purge();
                    }
                }

                views.remove();

                this.container = null;
                if (this.editable) {
                    this.editable.options.model.unbind(CHANGE, this.toggleDateValidationHandler);
                    this.editable.destroy();
                    this.editable = null;
                }
                this.timezoneView = null;
            }
        }
    });

    var PopupEditor = Editor.extend({
        destroy: function() {
            this.close();
            this.unbind();
        },

        editEvent: function(model) {
            var that = this;
            var editable = that.options.editable;
            var html = '<div ' + kendo.attr("uid") + '="' + model.uid + '" class="k-popup-edit-form k-scheduler-edit-form"><div class="k-edit-form-container">';
            var $html;
            var messages = that.options.messages;
            var updateText = messages.save;
            var updateIcon = "save";
            var cancelText = messages.cancel;
            var cancelIcon = "cancel-outline";
            var deleteText = messages.destroy;
            var deleteIcon = "trash";
            var resetSeries = messages.resetSeries;
            var fields = this.fields(editors.desktop, model);
            var editableFields = [];
            var fieldName;

            html += this._buildEditTemplate(model, fields, editableFields, false);

            var attr;
            var options = isPlainObject(editable) ? editable.window : {};

            html += '<div class="k-edit-buttons">';

            html += this.createButton({ name: "update", text: updateText, attr: attr, icon: updateIcon }) + this.createButton({ name: "canceledit", text: cancelText, attr: attr, icon: cancelIcon });

            if (!model.isNew() && editable.destroy !== false && model.isRecurrenceHead() && model.recurrenceException) {
                html += this.createButton({ name: "resetSeries", text: resetSeries, attr: attr });
            }

            if ((!model.isNew() || model.isRecurring()) && editable.destroy !== false) {
                html += '<span class="k-spacer"></span>' + this.createButton({ name: "delete", text: deleteText, attr: attr, icon: deleteIcon, fillMode: "flat", themeColor: "primary" });
            }

            html += '</div></div></div>';

            $html = $(html);
            kendo.applyStylesFromKendoAttributes($html, ["display"]);

            var container = this.container = $html
                .appendTo(that.element).eq(0)
                .kendoWindow(extend({
                    modal: true,
                    resizable: false,
                    draggable: true,
                    title: messages.editor.editorTitle,
                    visible: false,
                    close: function(e) {
                        if (e.userTriggered) {
                            if (that.trigger(CANCEL, { container: container, model: model })) {
                                e.preventDefault();
                            }
                        }
                    }
                }, options));

            that.editable = container.kendoEditable({
                fields: editableFields,
                model: model,
                clearContainer: false,
                validateOnBlur: true,
                target: that.options.target
            }).data("kendoEditable");

            for (var field in editableFields) {
                if (editableFields[field].field !== "recurrenceRule") {
                    fieldName = editableFields[field].field;
                    container.find("[name='" + fieldName + "']").attr("aria-labelledby", fieldName + "_label");
                }

                if (editableFields[field].field === "isAllDay") {
                    container.find("label[for='" + fieldName + "']").attr("id", fieldName + "_label");
                }
            }

            if (!that.trigger(EDIT, { container: container, model: model })) {

                if (editable.window && editable.window.position) {
                    container.data("kendoWindow").open();
                } else {
                    container.data("kendoWindow").center().open();
                }

                container.on(CLICK + NS, "button.k-scheduler-cancel", function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    that.trigger(CANCEL, { container: container, model: model });
                });

                container.on(CLICK + NS, "button.k-scheduler-update", function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    that.trigger("save", { container: container, model: model });
                });

                container.on(CLICK + NS, "button.k-scheduler-delete", function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    that.trigger(REMOVE, { container: container, model: model });
                });

                container.on(CLICK + NS, "button.k-scheduler-resetSeries", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    that.trigger(RESET, { container: container, model: model });
                });

                kendo.cycleForm(container);

                model.bind(CHANGE, that.toggleDateValidationHandler);
            } else {
                that.trigger(CANCEL, { container: container, model: model });
            }

            return that.editable;
        },

        close: function() {
            var that = this;

            var destroy = function() {
                if (that.editable) {
                    that.editable.options.model.unbind(CHANGE, that.toggleDateValidationHandler);
                    that.editable.destroy();
                    that.editable = null;
                    that.container = null;
                }
                if (that.popup) {
                    that.popup.destroy();
                    that.popup = null;
                }
            };

            if (that.editable) {
                if (that._timezonePopup && that._timezonePopup.data("kendoWindow")) {
                    that._timezonePopup.data("kendoWindow").destroy();
                    that._timezonePopup = null;
                }

                if (that.container.is(":visible")) {
                    that.container.data("kendoWindow").bind("deactivate", destroy).close();
                } else {
                    destroy();
                }
            } else {
                destroy();
            }
        },

        _createEndTimezoneButton: function() {
            var messages = this.options.messages;
            var html = "";

            html += '<div class="k-edit-buttons">';
            html += this.createButton({ name: "savetimezone", icon: "save", themeColor: "primary", text: messages.save }) + this.createButton({ name: "canceltimezone", icon: "cancel-outline", text: messages.cancel });
            html += '</div></div></div>';

            return html;
        },

        showDialog: function(options) {
            var html = kendo.format("<div class='k-popup-edit-form'><div class='k-edit-form-container'><p class='k-popup-message'>{0}</p>", options.text);

            html += '<div class="k-edit-buttons">';

            for (var buttonIndex = 0; buttonIndex < options.buttons.length; buttonIndex++) {
                html += this.createButton(options.buttons[buttonIndex]);
            }

            html += '</div></div></div>';

            var wrapper = this.element;

            if (this.popup) {
                this.popup.destroy();
            }

            var popup = this.popup = $(html).appendTo(wrapper)
                               .eq(0)
                               .on(CLICK, ".k-button", function(e) {
                                    e.preventDefault();

                                    popup.close();

                                    var buttonIndex = $(e.currentTarget).index();

                                    options.buttons[buttonIndex].click();
                               })
                               .kendoWindow({
                                   modal: true,
                                   resizable: false,
                                   draggable: false,
                                   title: options.title,
                                   visible: false,
                                   close: function() {
                                       this.destroy();
                                       wrapper.trigger("focus");
                                   }
                               })
                               .getKendoWindow();

            popup.center().open();
        },

        _initTimezoneEditor: function(model, activator) {
            var that = this;
            var container = that.container.find(".k-scheduler-timezones");
            var checkbox = container.find("input.k-timezone-toggle");
            var endTimezoneRow = container.find(".k-form-field").last();
            var saveButton = container.find(".k-scheduler-savetimezone");
            var cancelButton = container.find(".k-scheduler-canceltimezone");
            var timezonePopup = that._timezonePopup;
            var startTimezoneChange = function(e) {
                if (e.field === "startTimezone") {
                    var value = model.startTimezone;

                    checkbox.prop(DISABLED, !value);

                    if (!value) {
                        endTimezoneRow.hide();
                        model.set("endTimezone", "");
                        checkbox.prop("checked", false);
                    }
                }
            };
            var wnd;

            that._startTimezone = model.startTimezone;
            that._endTimezone = model.endTimezone;

            if (!timezonePopup) {
                that._timezonePopup = timezonePopup = container.kendoWindow({
                    modal: true,
                    resizable: false,
                    draggable: true,
                    title: that.options.messages.editor.timezoneEditorTitle,
                    visible: false,
                    close: function(e) {
                        model.unbind(CHANGE, startTimezoneChange);

                        if (e.userTriggered) {
                            that._revertTimezones(model);
                        }

                        if (activator) {
                            activator.focus();
                        }
                    }
                });

                checkbox.on(CLICK, function() {
                    endTimezoneRow.toggle(checkbox.prop("checked"));
                    model.set("endTimezone", "");
                });

                saveButton.on(CLICK, function(e) {
                    e.preventDefault();
                    wnd.close();
                });

                cancelButton.on(CLICK, function(e) {
                    e.preventDefault();
                    that._revertTimezones(model);
                    wnd.close();
                });

                model.bind(CHANGE, startTimezoneChange);
            }

            checkbox.prop("checked", model.endTimezone).prop(DISABLED, !model.startTimezone);

            if (model.endTimezone) {
                endTimezoneRow.show();
            } else {
                endTimezoneRow.hide();
            }

            wnd = timezonePopup.data("kendoWindow");
            wnd.center().open();
        }
    });

    var Scheduler = DataBoundWidget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, options);

            if (!that.options.views || !that.options.views.length) {
                that.options.views = ["day", "week"];
            }

            that.resources = [];

            that._initModel();

            that._wrapper();

            if (that.options.selectable) {
                that._tabindex();
            }

            that._views();

            that._toolbar();

            that._dataSource();

            that._resources();

            that._resizeHandler = function() {
                that.resize();
            };

            that.wrapper.on(MOUSEDOWN + NS + " selectstart" + NS, function(e) {
                var target = $(e.target);

                if (!target.is(":kendoFocusable") && target.closest(".k-button").length === 0) {
                    e.preventDefault();
                }
            });

            if (that.options.editable && that.options.editable.resize !== false) {
                that._resizable();
            }

            that._movable();

            that._bindResize();

            if (that.options.messages && that.options.messages.recurrence) {
                recurrence.options = that.options.messages.recurrence;
            }

            that._navigation();
            that._selectable();
            that._touchHandlers();

            that._ariaId = kendo.guid();

            that._createEditor();

            that.mediaQueryList = kendo.mediaQuery(MIN_SCREEN);
            that.mediaQueryList.onChange(that._onMediaChange.bind(that));

            if (that._showWatermarkOverlay) {
                that._showWatermarkOverlay(that.element[0]);
            }
        },

        _onMediaChange: function(e) {
            var that = this;
            var view = that._selectedView;
            var toolbarEl = that.toolbar;
            var toolbar = toolbarEl.getKendoToolBar();

            if (e.matches) {
                toolbar.hide(toolbarEl.find(".k-views-dropdown"));
                toolbar.show(toolbarEl.find(".k-views-dropdown").parent().next(".k-button-group"));
            } else {
                toolbar.show(toolbarEl.find(".k-views-dropdown"));
                toolbar.hide(toolbarEl.find(".k-views-dropdown").parent().next(".k-button-group"));
            }

            that._model.set("formattedDate", e.matches ? view.dateForTitle() : view.shortDateForTitle());
        },

        _bindResize: function() {
            $(window).on("resize" + NS, this._resizeHandler);
        },

        _unbindResize: function() {
            $(window).off("resize" + NS, this._resizeHandler);
        },

        dataItems: function() {
            var that = this;
            var items = that.items();
            var events = that._data;
            var eventsUids = $.map(items, function(item) {
                return $(item).attr("data-uid");
            });
            var i;
            var key;

            var dict = {};
            var eventsUidsLength = eventsUids.length;
            for (i = 0; i < eventsUidsLength; i++) {
                dict[eventsUids[i]] = null;
            }

            var eventsCount = events.length;
            for (i = 0; i < eventsCount; i++) {
                var event = events[i];
                if (dict[event.uid] !== undefined$1) {
                    dict[event.uid] = event;
                }
            }

            var sortedData = [];
            for (key in dict) {
                sortedData.push(dict[key]);
            }

            return sortedData;
        },

        _isMobile: function() {
            var options = this.options;
            return (options.mobile === true && kendo.support.mobileOS) || options.mobile === "phone" || options.mobile === "tablet";
        },

        _isTouch: function(event) {
            return /touch/.test(event.type) || (event.originalEvent && /touch/.test(event.originalEvent.pointerType));
        },

        _isInverseColor: function(eventElement) {
            return eventElement.hasClass(INVERSECOLORCLASS);
        },

        _groupsByResource: function(resources, groupIndex, groupsArray, parentFieldValue, parentField) {
            if (!groupsArray) {
                groupsArray = [];
            }

            var resource = resources[0];
            if (resource) {
                var group;
                var data = resource.dataSource.view();
                var prevIndex = 0;

                for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                    var fieldValue = kendo.getter(resource.dataValueField)(data[dataIndex]);
                    var currentGroupIndex = groupIndex + prevIndex + dataIndex;

                    group = this._groupsByResource(resources.slice(1), currentGroupIndex, groupsArray, fieldValue, resource.field);
                    group[resource.field] = fieldValue;
                    prevIndex = group.groupIndex;

                    if (parentField && parentFieldValue) {
                        group[parentField] = parentFieldValue;
                    }

                    if (resources.length === 1) {
                        group.groupIndex = groupIndex + dataIndex;
                        groupsArray.push(group);
                    }
                }
                return group;
            } else {
                return {};
            }
        },

        data: function() {
            return this._data;
        },

        select: function(options) {
            var that = this;
            var view = that.view();
            var selection = that._selection;
            var groups = view.groups;
            var selectedGroups;

            if (options === undefined$1) {
                var selectedEvents;
                var slots = view._selectedSlots;

                if (!selection) {
                    return [];
                }

                if (selection && selection.events) {
                    selectedEvents = that._selectedEvents();
                }

                return {
                    start: selection.start,
                    end: selection.end,
                    events: selectedEvents,
                    slots: slots,
                    resources: view._resourceBySlot(selection)
                };
            }

            if (!options) {
                that._selection = null;
                that._old = null;
                view.clearSelection();

                return;
            }

            if (Array.isArray(options)) {
                options = {
                    events: options.splice(0)
                };
            }

            if (options.resources) {
                var fieldName;
                var filters = [];
                var groupsByResource = [];

                if (view.groupedResources) {
                    that._groupsByResource(view.groupedResources, 0, groupsByResource);
                }

                for (fieldName in options.resources) {
                    filters.push({ field: fieldName, operator: "eq", value: options.resources[fieldName] });
                }

                selectedGroups = new kendo.data.Query(groupsByResource)
                    .filter(filters)
                    .toArray();
            }

            if (options.events && options.events.length) {
                that._selectEvents(options.events, selectedGroups);
                that._select();

                return;
            }

            if (groups && (options.start && options.end)) {
                var rangeStart = getDate(view._startDate);
                var rangeEnd = kendo.date.addDays(getDate(view._endDate),1);
                var group;
                var ranges;

                if (options.start < rangeEnd && rangeStart <= options.end) {
                    if (selectedGroups && selectedGroups.length) {
                        group = groups[selectedGroups[0].groupIndex];
                    } else {
                        group = groups[0];
                    }

                    if (!group.timeSlotCollectionCount()) {
                        options.isAllDay = true;
                    }

                    ranges = group.ranges(options.start, options.end, options.isAllDay, false);

                    if (ranges.length) {
                        that._selection = {
                            start: kendo.timezone.toLocalDate(ranges[0].start.start),
                            end: kendo.timezone.toLocalDate(ranges[ranges.length - 1].end.end),
                            groupIndex: ranges[0].start.groupIndex,
                            index: ranges[0].start.index,
                            isAllDay: ranges[0].start.isDaySlot,
                            events: []
                        };

                        that._select();
                    }
                }
            }
        },

        _selectEvents: function(eventsUids, selectedGroups) {
            var that = this;
            var idx;
            var view = that.view();
            var groups = view.groups;
            var eventsLength = eventsUids.length;
            var isGrouped = selectedGroups && selectedGroups.length;
            var ctrlKey = that._ctrlKey;

            that._ctrlKey = true;

            for (idx = 0; idx < eventsLength; idx++) {
                if (groups && isGrouped) {
                    var currentGroup = groups[selectedGroups[0].groupIndex];
                    var events = [];
                    var timeSlotCollectionCount = currentGroup.timeSlotCollectionCount();
                    var daySlotCollectionCount = currentGroup.daySlotCollectionCount();

                    for (var collIdx = 0; collIdx < timeSlotCollectionCount; collIdx++) {
                        events = events.concat(currentGroup.getTimeSlotCollection(collIdx).events());
                    }

                    for (var dayCollIdx = 0; dayCollIdx < daySlotCollectionCount; dayCollIdx++) {
                        events = events.concat(currentGroup.getDaySlotCollection(dayCollIdx).events());
                    }

                    events = new kendo.data.Query(events)
                        .filter({ field: event => event.element[0].getAttribute('data-uid'), operator: "eq", value: eventsUids[idx] })
                        .toArray();

                    if (events[0]) {
                        that._createSelection(events[0].element);
                    }
                } else {
                    var element = view.element.find(kendo.format(".k-event[data-uid={0}], .k-task[data-uid={0}]", eventsUids[idx]));

                    if (element.length) {
                        that._createSelection(element[0]);
                    }
                }
            }

            that._ctrlKey = ctrlKey;
        },

        _touchHandlers: function() {
            var that = this;
            var startX;
            var startY;
            var endX;
            var endY;
            var timeStamp;
            var wrapper = that.wrapper;
            var touchMoveHandler = that._touchMove.bind(that);

            wrapper.on(TOUCHSTART + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td, .k-event", function(e) {
                var content = that.wrapper.find(".k-scheduler-content");

                if (!that._isTouch(e)) {
                    return;
                }

                content.stop(true, false);

                that._touchPosX = startX = that._tapPosition(e, 'X');
                that._touchPosY = startY = that._tapPosition(e, 'Y');
                that._userTouched = true;
                that.view()._scrolling = false;
                timeStamp = Date.now();

                wrapper.on(TOUCHMOVE + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td, .k-event", touchMoveHandler);
            });

            wrapper.on("contextmenu" + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td, .k-event", function(e) {
                that._preventFocus = true;
            });

            wrapper.on(TOUCHEND + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td, .k-event", function(e) {
                if (!that._isTouch(e)) {
                    return;
                }

                var delta = Date.now() - timeStamp;
                var content = that.wrapper.find(".k-scheduler-content");
                var amplitude = -that._amplitude * (3000 / delta);

                endX = that._tapPosition(e, 'X');
                endY = that._tapPosition(e, 'Y');

                if (that._dragging) {
                    return;
                }

                if (that.options.selectable && (Math.abs(endX - startX) <= 10 || Math.abs(endY - startY) <= 10)) {
                    that._mouseDownSelection(e);
                }

                if (!kendo.support.kineticScrollNeeded && delta < 200 && Math.abs(endX - startX) > 10) {
                    content.animate({
                        scrollTop: content[0].scrollTop + amplitude
                    });
                }

                wrapper.off(TOUCHMOVE + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td", touchMoveHandler);
            });
        },

        _navigation: function() {
            var that = this,
                wrapper = that.wrapper;

            wrapper.on("focus" + NS, function() {
                var selection = that._selection;

                setTimeout(function() {
                    if (!that._preventFocus) {
                        if ((!selection ||
                                (selection.events.length > 0 && wrapper.find("[data-uid='" + selection.events[0] + "']").length === 0)) &&
                            !that._userTouched &&
                            !that._mouseDown) {
                                that._initialFocus();
                        } else {
                            that._mouseDown = false;
                        }

                        that._select();
                    } else {
                        that._preventFocus = false;
                    }
                }, 300);
            });

            wrapper.on("focusout" + NS, function() {
                that._ctrlKey = that._shiftKey = false;
            });

            wrapper.on("keydown" + NS, that._keydown.bind(that));

            wrapper.on("keyup" + NS, function(e) {
                that._ctrlKey = e.ctrlKey;
                that._shiftKey = e.shiftKey;
            });
        },

        _selectable: function() {
            var that = this;
            var wrapper = that.wrapper;

            if (!that.options.selectable) {
                return;
            }

            wrapper.on(MOUSEDOWN + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td, .k-event, .k-scheduler-body td .k-link", function(e) {
                if (that._isTouch(e)) {
                    return;
                }
                that._mouseDownSelection(e);
            });

            var mouseMoveHandler = that._mouseMove.bind(that);

            wrapper.on(MOUSEDOWN + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td", function(e) {
                var which = e.which;
                var button = e.button;
                var isRight = which && which === 3 || button && button == 2;

                if (that._isTouch(e)) {
                    return;
                }

                if (!isRight) {
                    wrapper.on(MOUSEMOVE + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td", mouseMoveHandler);
                }
            });

            wrapper.on("mouseup" + NS + " mousecancel" + NS, function() {
                wrapper.off(MOUSEMOVE + NS, ".k-scheduler-header-all-day td, .k-scheduler-content td", mouseMoveHandler);
            });
        },

        _mouseDownSelection: function(e) {
            var which = e.which;
            var button = e.button;
            var isRight = which && which === 3 || button && button == 2;

            if (!isRight) {
                if (e.ctrlKey) {
                    this._ctrlKey = e.ctrlKey;
                }

                if (e.shiftKey) {
                    this._shiftKey = e.shiftKey;
                }

                this._mouseDown = true;
                this._createSelection(e.currentTarget);

                if ($(e.currentTarget).hasClass("k-event")) {
                    this._selection.eventElement = e.currentTarget;
                }
            }

            if (this.view().name !== "year" && kendo._activeElement() !== this.wrapper.get(0)) {
                kendo.focusElement(this.wrapper);
            } else {
                this._select();
            }

            if (this.toolbar) {
                this.toolbar.find("." + FOCUSEDSTATE).removeClass(FOCUSEDSTATE);
            }
        },

        _selectFirstSlot: function() {
            var firstAllDay = this.wrapper.find(".k-scheduler-header-all-day").find("td").first(),
                firstContent = this.wrapper.find(".k-scheduler-content").find("td").first(),
                firstSlot;

            if (firstAllDay.length > 0) {
                firstSlot = firstAllDay;
            } else if (firstContent.length > 0) {
                firstSlot = firstContent;
            } else {
                firstSlot = this.wrapper.find(".k-scheduler-body").find(".k-link").first();
            }

            this._createSelection(firstSlot);
        },

        _firstEvent: function() {
            var firstEventInAllDay = this.wrapper.find(".k-scheduler-header-wrap .k-event, .k-task").first(),
                firstEventInContent = this.wrapper.find(".k-scheduler-content .k-event").first(),
                firstEvent, allDayEvent, contentEvent;

            if (firstEventInAllDay.length > 0) {
                if (firstEventInContent.length > 0) {
                    allDayEvent = this.occurrenceByUid(firstEventInAllDay.data("uid"));
                    contentEvent = this.occurrenceByUid(firstEventInContent.data("uid"));

                    firstEvent = allDayEvent.start <= contentEvent.start ? firstEventInAllDay : firstEventInContent;
                } else {
                    firstEvent = firstEventInAllDay;
                }
            } else if (firstEventInContent) {
                firstEvent = firstEventInContent;
            }

            return firstEvent;
        },

        _initialFocus: function() {
            var firstEvent = this._firstEvent();

            if (this.options.selectable) {
                if (firstEvent && firstEvent.length > 0) {
                    this._createSelection(firstEvent);
                    this._selection.eventElement = firstEvent[0];
                } else {
                    this._selectFirstSlot();
                }
            } else if (this.toolbar && this.toolbar.find("." + FOCUSEDSTATE).length === 0) {
                this._focusToolbar();
            } else if (this.toolbar) {
                this.toolbar.find("." + FOCUSEDSTATE).removeClass(FOCUSEDSTATE);
            }
        },

        _select: function() {
            var that = this;
            var view = that.view();
            var wrapper = that.wrapper;
            var current = view.current();
            var selection = that._selection;
            var oldSelection = that._old ? that._old.selection : null;
            var oldEventsLength = that._old ? that._old.eventsLength : null;
            if (!selection) {
                return;
            }

            if (current) {
                current.removeAttribute("id");
                wrapper.removeAttr("aria-activedescendant");
            }

            view.select(selection);
            that._selection.eventElement = null;

            current = view.current();
            if (current) {
                current.setAttribute("id", that._ariaId);
                wrapper.attr("aria-activedescendant", that._ariaId);

                if (oldSelection !== current || (selection.events && (oldEventsLength !== selection.events.length ))) {
                    var currentUid = $(current).data("uid");

                    if (that._old && currentUid &&
                        currentUid === $(that._old.selection).data("uid") &&
                        (selection.events && that._old.eventsLength === selection.events.length)) {
                        return;
                    }

                    var events = that._selectedEvents();
                    var slots = view._selectedSlots;

                    that._old = {
                        selection: current,
                        eventsLength: events.length
                    };

                    that.trigger(CHANGE, {
                        start: selection.start,
                        end: selection.end,
                        events: events,
                        slots: slots,
                        resources: view._resourceBySlot(selection)
                    });
                }
            }
        },

        _selectedEvents: function() {
            var uids = this._selection.events;
            var length = uids.length;
            var idx = 0;
            var event;

            var events = [];

            for (; idx < length; idx++) {
                event = this.occurrenceByUid(uids[idx]);
                if (event) {
                    events.push(event);
                }
            }

            return events;
        },

        _tapPosition: function(event, coordinate) {
            return /touch/.test(event.type) ? (event.originalEvent || event).changedTouches[0]['page' + coordinate] : event['page' + coordinate];
        },

        _touchMove: function(e) {
            var that = this;
            var content = that.wrapper.find(".k-scheduler-content");
            var verticalScroll = content[0].scrollHeight > content[0].clientHeight;
            var horizontalScroll = content[0].scrollWidth > content[0].clientWidth;
            var endY = that._tapPosition(e, 'Y');
            var endX = that._tapPosition(e, 'X');
            var scrollTop = content[0].scrollTop - Math.round(endY - that._touchPosY);
            var scrollLeft = content[0].scrollLeft - Math.round(endX - that._touchPosX);
            var applyVerticalScroll = verticalScroll && Math.abs(endY - that._touchPosY) > 10;
            var applyhorizontalScroll = horizontalScroll && Math.abs(endY - that._touchPosY) > 10;


            if (that._dragging || kendo.support.kineticScrollNeeded || !that._isTouch(e)) {
                return;
            }

            if (applyVerticalScroll || applyhorizontalScroll) {
                that._amplitude = Math.round(endY - that._touchPosY);
                that._touchPosY = endY;
                that._touchPosX = endX;
                content.animate({
                    scrollTop: scrollTop,
                    scrollLeft: scrollLeft
                }, 0);
                that.view()._scrolling = true;
            }
        },

        _mouseMove: function(e) {
            var that = this;
            clearTimeout(that._moveTimer);

            if (that._isTouch(e)) {
                return;
            }

            that._moveTimer = setTimeout(function() {
                var view = that.view();
                var selection = that._selection;

                if (selection) {
                    var slot = view.selectionByElement($(e.currentTarget));

                    if (slot && selection.groupIndex === slot.groupIndex) {
                        var startDate = slot.startDate();
                        var endDate = slot.endDate();

                        if (startDate >= selection.end) {
                            selection.backward = false;
                        } else if (endDate <= selection.start) {
                            selection.backward = true;
                        }

                        if (selection.backward) {
                            selection.start = startDate;
                        } else {
                            selection.end = endDate;
                        }

                        that._select();
                    }
                }
            }, 5);
        },

        _viewByIndex: function(index) {
            var view, views = this.views;

            for (view in views) {
                if (!index) {
                    return view;
                }

                index--;
            }
        },

        _keydownToolbar: function(e) {
            var key = e.keyCode;

            if (e.altKey && key === keys.DOWN && this.toolbar.find(".k-nav-current").hasClass(FOCUSEDSTATE)) {
                this._showCalendar();
                e.preventDefault();
                return;
            } else if (key === keys.DOWN) {
                if (this._selectedViewName === "year") {
                    this.view().calendar.focus();
                } else if (document.activeElement !== this.element[0]) {
                    this.element.focus();
                }

                e.preventDefault();

                return;
            }
        },

        _keydownView: function(e) {
            var key = e.keyCode,
                isModifier = key === 16 || key === 18 || key === 17 || key === 91 || key === 92,
                selection = this._selection,
                view = this.view(),
                editable = view.options.editable,
                arrowKeys = [ keys.LEFT, keys.RIGHT, keys.UP, keys.DOWN ],
                isRtl = kendo.support.isRtl(this.element),
                previous, content, cell;

            if (isModifier) {
                return;
            }

            // slots selection via keyboard is no longer available
            // see here: https://github.com/telerik/kendo-themes/blob/develop/docs/accessibility/Scheduler.md
            if (!selection) {
                return;
            }

            if (key === keys.ENTER) {
                if (selection.events.length && editable) {
                    if (editable.update !== false) {
                        this.editEvent(selection.events[0]);
                    }
                }
            } else if ((key === keys.DELETE || key === keys.BACKSPACE) && editable !== false && editable.destroy !== false) {
                this.removeEvent(selection.events[0]);
            } else if (arrowKeys.indexOf(key) > -1) {
                previous = key === keys.UP || (key === keys.LEFT && !isRtl) || (key === keys.RIGHT && isRtl);

                if (view.moveToEvent(selection, previous)) {
                    this._select();

                    // Focus the Scheduler element only if it not the currently focused element
                    if (document.activeElement !== this.element[0]) {
                        this.element.focus();
                    }

                    e.preventDefault();
                }
            } else if (key === keys.HOME || key === keys.END) {
                e.preventDefault();
                content = this.view().content.eq(0);

                if (key === keys.HOME) {
                    cell = content.find(".k-scheduler-table td").first();
                } else {
                    cell = content.find(".k-scheduler-table td").last();
                }

                this.view()._scrollTo(cell[0], content[0]);
            }
        },

        _keydownShortcut: function(key) {
            var currentDate = new Date(),
                timezone = this.options.timezone,
                editable = this.view().options.editable;

            if (key === 66 && !!this.view().toggleFullDay) {
                this.view().toggleFullDay();
            } else if (key === 67 && editable && editable.create !== false) {
                this.addEvent(extend({}, {
                    start: this.date(),
                    end: this.date()
                }));
            } else if (key === 84) {
                if (timezone) {
                    var timezoneOffset = kendo.timezone.offset(currentDate, timezone);
                    date = kendo.timezone.convert(currentDate, currentDate.getTimezoneOffset(), timezoneOffset);
                } else {
                    date = currentDate;
                }

                if (!this.trigger("navigate", { view: this._selectedViewName, action: "today", date: date })) {
                    this.date(date);
                }
            }
        },

        _keydownYearView: function(e) {
            var view = this.view(),
                selection = this._selection,
                key = e.keyCode;

            if (key === keys.TAB) {
                return;
            }

            if (key === keys.F10) {
                this._focusToolbar();
                e.preventDefault();
            } else {
                this.toolbar.find("." + FOCUSEDSTATE).removeClass(FOCUSEDSTATE);
                view.calendar.focus();
            }

            if (selection) {
                this._adjustSelectedDate();
            }

            e.preventDefault();
        },

        _keydownAgendaView: function(e) {
            var key = e.keyCode,
                view = this.view(),
                selection = this._selection,
                content, cell;

            if (view.move(selection, key)) {
                e.preventDefault();
                this.toolbar.find("." + FOCUSEDSTATE).removeClass(FOCUSEDSTATE);
                this._select();
            } else if (key === keys.HOME || key === keys.END) {
                e.preventDefault();
                content = this.view().content.eq(0);

                if (key === keys.HOME) {
                    cell = content.find(".k-scheduler-table td").first();
                } else {
                    cell = content.find(".k-scheduler-table td").last();
                }

                this.view()._scrollTo(cell[0], content[0]);
            }
        },

        _keydownChangeView: function(key) {
            var viewIndex = key - 49,
                viewByIndex;

            if (viewIndex === -1) {
                viewIndex = 9;
            }

            viewByIndex = this._viewByIndex(viewIndex);

            if (viewByIndex && !this.trigger("navigate", { view: viewByIndex, action: "changeView", date: this.date() })) {
                this.view(viewByIndex);
            }
        },

        _keydownChangeDate: function(key) {
            var isRtl = kendo.support.isRtl(this.element),
                direction = (isRtl && key === keys.LEFT) || (!isRtl && key === keys.RIGHT) ? "next" : "previous";

            if (direction === "next") {
                date = this.view().nextDate();
            } else {
                date = this.view().previousDate();
            }

            if (!this.trigger("navigate", { view: this._selectedViewName, action: direction, date: date })) {
                this.date(date);
                this._initialFocus();
                this._select();
            }
        },

        _keydown: function(e) {
            var key = e.keyCode,
                shortcutKeys = [66, 67, 84],
                toolbarIsFocused = $(e.target).closest(".k-toolbar").length > 0,
                altKey = e.altKey;

            this._ctrlKey = e.ctrlKey;
            this._shiftKey = e.shiftKey;

            if (key === keys.ESC && this.popup && this.popup.visible()) {
                this.popup.close();
                e.preventDefault();
                return;
            }

            if ((key === keys.LEFT || key === keys.RIGHT) && this._shiftKey) {
                this._keydownChangeDate(key);
                return;
            }

            if (altKey && key >= 48 && key <= 57) {
                this._keydownChangeView(key);
                return;
            }

            if (shortcutKeys.indexOf(key) > -1) {
                if (!$(e.target).hasClass("k-scheduler-search-input")) {
                    this._keydownShortcut(key);
                }

                return;
            }

            if (toolbarIsFocused) {
                this._keydownToolbar(e);
            } else {
                if (this._selectedViewName === "year") {
                    this._keydownYearView(e);
                    return;
                }

                if (key === keys.F10) {
                    this._focusToolbar();
                    e.preventDefault();
                    return;
                }

                if (this._selectedViewName === "agenda") {
                    this._keydownAgendaView(e);
                    return;
                }

                this._keydownView(e);
            }
        },

        _focusToolbar: function() {
            this.toolbar.find("[tabindex=0]").first()
                .trigger("focus")
                .addClass(FOCUSEDSTATE);
        },

        _createSelection: function(item) {
            var selection = this._selection,
                uid, slot;

            item = $(item);

            if (item.is(".k-event")) {
                uid = item.attr(kendo.attr("uid"));

                if (selection && selection.events.indexOf(uid) !== -1 && !this._ctrlKey) {
                    return;
                }
            }

            if (!selection || (!this._ctrlKey && !this._shiftKey)) {
                selection = this._selection = {
                    events: [],
                    groupIndex: 0
                };
            }

            slot = this.view().selectionByElement(item);

            if (slot) {
                selection.groupIndex = slot.groupIndex || 0;
            }

            if (uid) {
                slot = getOccurrenceByUid(this._data, uid);
            }

            if (slot && slot.uid) {
                uid = [slot.uid];
            }

            this._updateSelection(slot, uid);
            this._adjustSelectedDate();
        },

        _updateSelection: function(dataItem, events, groupIndex) {
            var selection = this._selection;

            if (dataItem && selection) {
                var view = this.view();

                if (dataItem.uid) {
                    dataItem = view._updateEventForSelection(dataItem);
                }

                if (this._shiftKey && selection.start && selection.end) {
                    var backward = dataItem.end < selection.end;

                    selection.end = dataItem.endDate ? dataItem.endDate() : dataItem.end;

                    if (backward && view._timeSlotInterval) {
                        kendo.date.setTime(selection.end, -view._timeSlotInterval());
                    }
                } else {
                    selection.start = dataItem.startDate ? dataItem.startDate() : dataItem.start;
                    selection.end = dataItem.endDate ? dataItem.endDate() : dataItem.end;
                }

                if ("isDaySlot" in dataItem) {
                    selection.isAllDay = dataItem.isDaySlot;
                } else {
                    selection.isAllDay = dataItem.isAllDay;
                }

                if (groupIndex !== null && groupIndex !== undefined$1) {
                    selection.groupIndex = groupIndex;
                }

                selection.index = dataItem.index;
                if (this._ctrlKey) {
                    var indexOfEvent = (events && events.length) ? selection.events.indexOf(events[0]) : -1;

                    if (indexOfEvent > -1) {
                        selection.events.splice(indexOfEvent, 1);
                    } else {
                        selection.events = selection.events.concat(events || []);
                    }
                } else {
                        selection.events = events || [];
                }
            }
        },

        options: {
            name: "Scheduler",
            date: TODAY,
            editable: true,
            autoBind: true,
            snap: true,
            mobile: false,
            timezone: "",
            allDaySlot: true,
            min: new Date(1900, 0, 1),
            max: new Date(2099, 11, 31),
            toolbar: null,
            workWeekStart: 1,
            workWeekEnd: 5,
            workDays: null,
            showWorkHours: false,
            startTime: TODAY,
            endTime: TODAY,
            currentTimeMarker: {
                updateInterval: 10000,
                useLocalTimezone: true
            },
            ongoingEvents: {
                cssClass: ONGOING_CLASS,
                enabled: false,
                updateInterval: 60000,
                useLocalTimezone: true
            },
            footer: {},
            messages: {
                today: "Today",
                pdf: "Export to PDF",
                save: "Save",
                cancel: "Cancel",
                destroy: "Delete",
                resetSeries: "Reset Series",
                deleteWindowTitle: "Delete event",
                next: "Next",
                previous: "Previous",
                refresh: "Refresh",
                selectView: "Select view",
                ariaSlotLabel: "Selected from {0:t} to {1:t}",
                ariaEventLabel: {
                    on: "on",
                    at: "at",
                    to: "to",
                    allDay: "(all day)",
                    prefix: ""
                },
                search: "Search...",
                views: {
                    day: "Day",
                    week: "Week",
                    workWeek: "Work Week",
                    agenda: "Agenda",
                    month: "Month",
                    timeline: "Timeline",
                    timelineWeek: "Timeline Week",
                    timelineWorkWeek: "Timeline Work Week",
                    timelineMonth: "Timeline Month",
                    year: "Year"
                },
                recurrenceMessages: {
                    deleteWindowTitle: "Delete Recurring Item",
                    resetSeriesWindowTitle: "Reset Series",
                    deleteWindowOccurrence: "Delete current occurrence",
                    deleteWindowSeries: "Delete the series",
                    editWindowTitle: "Edit Recurring Item",
                    editWindowOccurrence: "Edit current occurrence",
                    editWindowSeries: "Edit the series"
                },
                editable: {
                    confirmation: DELETECONFIRM
                },
                editor: {
                    title: "Title",
                    start: "Start",
                    end: "End",
                    allDayEvent: "All day event",
                    description: "Description",
                    repeat: "Repeat",
                    timezone: "Timezone",
                    startTimezone: "Start timezone",
                    endTimezone: "End timezone",
                    separateTimezones: "Use separate start and end time zones",
                    timezoneEditorTitle: "Timezones",
                    timezoneEditorButton: "Time zone",
                    timezoneTitle: "Time zones",
                    noTimezone: "No timezone",
                    editorTitle: "Event"
                }
            },
            height: null,
            width: null,
            resources: [],
            group: {
                resources: [],
                orientation: "horizontal"
            },
            views: [],
            selectable: false
        },

        events: [
            REMOVE,
            EDIT,
            CANCEL,
            SAVE,
            "add",
            "dataBinding",
            "dataBound",
            "moveStart",
            "move",
            "moveEnd",
            "resizeStart",
            "resize",
            "resizeEnd",
            "navigate",
            CHANGE
        ],

        destroy: function() {
            var that = this,
                element;

            Widget.fn.destroy.call(that);

            if (that.dataSource) {
                that.dataSource.unbind(CHANGE, that._refreshHandler);
                that.dataSource.unbind(PROGRESS, that._progressHandler);
                that.dataSource.unbind(ERROR, that._errorHandler);
            }

            if (that._resourceRefreshHandler) {
                for (var idx = 0; idx < that.resources.length; idx++) {
                    var resourceDS = that.resources[idx].dataSource;
                    resourceDS.unbind(CHANGE, that._resourceRefreshHandler);
                    resourceDS.unbind(PROGRESS, that._resourceProgressHandler);
                    resourceDS.unbind(ERROR, that._resourceErrorHandler);
                }
            }

            if (that.calendar) {
                that.calendar.destroy();
                that.popup.destroy();
            }

            if (that.view()) {
                that.view().destroy();
            }

            if (that._editor) {
                that._editor.destroy();
            }

            if (this._moveDraggable) {
                this._moveDraggable.destroy();
            }

            if (this._resizeDraggable) {
                this._resizeDraggable.destroy();
            }

            if (that.mediaQueryList) {
                that.mediaQueryList.destroy();
            }

            element = that.element
                .add(that.wrapper)
                .add(that.toolbar)
                .add(that.popup);

            element.off(NS);

            clearTimeout(that._moveTimer);

            that._model = null;
            that.toolbar = null;
            that.element = null;

            $(window).off("resize" + NS, that._resizeHandler);

            kendo.destroy(that.wrapper);
        },

        setDataSource: function(dataSource) {
            this.options.dataSource = dataSource;

            this._dataSource();

            if (this.options.autoBind && dataSource.fetch) {
                dataSource.fetch();
            } else if (isArray(dataSource)) {
                this.view(this._selectedView);
            }
        },

        items: function() {
            var content = this.wrapper.find(".k-scheduler-content");
            var view = this.view();

            if (view && view.options.name === "agenda") {
                return content.find(".k-task");
            } else {
                return content.find(".k-event")
                              .add(this.wrapper.find(".k-scheduler-header-wrap")
                                       .find(".k-scheduler-header-all-day").siblings());
            }
        },

        _movable: function() {
            var startSlot;
            var endSlot;
            var startResources;
            var startTime;
            var endTime;
            var event;
            var clonedEvent;
            var that = this;
            var originSlot;
            var originStartTime;
            var originalEvent;
            var distance = 0;
            var clonedEvents = [];
            var cachedEvents = [];

            var isMobile = that._isMobile();
            var movable = that.options.editable && that.options.editable.move !== false;
            var resizable = that.options.editable && that.options.editable.resize !== false;

            if (movable || (resizable && isMobile)) {
                that._dragging = false;
                if (isMobile && kendo.support.mobileOS.android) {
                    distance = 5;
                }

                that._moveDraggable = new kendo.ui.Draggable(that.element, {
                    distance: distance,
                    filter: ".k-event",
                    ignore: ".k-resize-handle",
                    holdToDrag: isMobile,
                    autoScroll: true
                });

                if (movable) {
                    that._moveDraggable.bind("dragstart", function(e) {
                        var view = that.view();
                        var eventElement = e.currentTarget;
                        var isTouch = that._isTouch(e);
                        that._dragging = true;

                        if (!view.options.editable || view.options.editable.move === false) {
                            that._dragging = false;
                            e.preventDefault();
                            return;
                        }

                        if (isTouch && !eventElement.hasClass("k-event-active")) {
                            that._dragging = false;
                            that.element.find(".k-event-active").removeClass("k-event-active");
                            e.preventDefault();
                            return;
                        }

                        event = that.occurrenceByUid(eventElement.attr(kendo.attr("uid")));

                        clonedEvent = event.clone();
                        originalEvent = event.clone();

                        clonedEvent.update(view._eventOptionsForMove(clonedEvent));

                        clonedEvent.inverseColor = that._isInverseColor(eventElement);

                        clonedEvents = [];
                        if (that._selection) {
                            var events = that._selection.events;

                            for (var i = 0; i < events.length; i++) {
                                var evtClone = that.occurrenceByUid(events[i]).clone();
                                var evtCloneElement = this.element.find('div.k-event[data-uid="' + evtClone.uid + '"]').eq(0);

                                evtClone.update(view._eventOptionsForMove(evtClone));

                                if (evtCloneElement.length) {
                                    evtClone.inverseColor = that._isInverseColor(evtCloneElement);
                                }

                                clonedEvents.push(evtClone);
                            }
                        } else {
                            clonedEvents.push(clonedEvent);
                        }

                        startSlot = view._slotByPosition(e.x.startLocation, e.y.startLocation);
                        startResources = view._resourceBySlot(startSlot);

                        originStartTime = startTime = startSlot.startOffset(e.x.startLocation, e.y.startLocation, that.options.snap);

                        endSlot = startSlot;

                        originSlot = startSlot;

                        if (!startSlot || that.trigger("moveStart", { event: event })) {
                            e.preventDefault();
                        }
                    })
                    .bind("drag", function(e) {
                        var view = that.view();
                        var slot = view._slotByPosition(e.x.location, e.y.location);
                        var distance;
                        var range;
                        var i;

                        if (!slot) {
                            return;
                        }

                        endTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);

                        if (slot.isDaySlot !== startSlot.isDaySlot) {

                            if (slot.isDaySlot !== originSlot.isDaySlot) {
                                var slotIndex = $(startSlot.element).index();

                                var targetSlotElement = $(slot.element).parent().children().eq(slotIndex);

                                startSlot = view._slotByPosition(targetSlotElement.offset().left, targetSlotElement.offset().top);

                                startTime = startSlot.startOffset(e.x.location, e.y.location, true);

                                cachedEvents = clonedEvents.map(function(event) { return event.clone(); });

                                for (i = 0; i < clonedEvents.length; i++) {
                                    if (clonedEvents[i].isAllDay != slot.isDaySlot) {
                                        clonedEvents[i].isAllDay = slot.isDaySlot;

                                        clonedEvents[i].end = kendo.date.getDate(clonedEvents[i].start);
                                        clonedEvents[i].start = kendo.date.getDate(clonedEvents[i].start);

                                        if (!slot.isDaySlot) {
                                            kendo.date.setTime(clonedEvents[i].start, kendo.date.getMilliseconds(view.startTime()));
                                            kendo.date.setTime(clonedEvents[i].end, kendo.date.getMilliseconds(view.startTime()) + view._timeSlotInterval());
                                        }
                                    }
                                }
                            } else {
                                startSlot = $.extend(true, { }, originSlot);
                                startTime = originStartTime;

                                clonedEvents = cachedEvents;
                            }
                        }

                        distance = endTime - startTime;

                        for (i = 0; i < clonedEvents.length; i++) {
                            view._updateMoveHint(clonedEvents[i], slot.groupIndex, distance);
                        }

                        range = moveEventRange(clonedEvent, distance);

                        if (!that.trigger("move", {
                            event: event,
                            slot: { element: slot.element, start: slot.startDate(), end: slot.endDate(), isDaySlot: slot.isDaySlot },
                            resources: view._resourceBySlot(slot),
                            start: range.start,
                            end: range.end
                        })) {
                            endSlot = slot;
                        } else {
                            for (i = 0; i < clonedEvents.length; i++) {
                                view._updateMoveHint(clonedEvents[i], slot.groupIndex, distance);
                            }
                        }
                    })
                    .bind("dragend", function(e) {
                        that.view()._removeMoveHint();
                        var distance = endTime - startTime;
                        var range = moveEventRange(clonedEvent, distance);
                        var start = range.start;
                        var end = range.end;
                        that._dragging = false;

                        var endResources = that.view()._resourceBySlot(endSlot);

                        var prevented = that.trigger("moveEnd", {
                            event: event,
                            slot: { element: endSlot.element, start: endSlot.startDate(), end: endSlot.endDate() },
                            start: start,
                            end: end,
                            resources: endResources
                        });

                        if (!prevented && (event.start.getTime() !== start.getTime() ||
                            event.end.getTime() !== end.getTime() ||
                            originSlot.isDaySlot !== endSlot.isDaySlot ||
                            kendo.stringify(endResources) !== kendo.stringify(startResources))) {

                            that._isMultiDrag = clonedEvents.length > 1;

                            for (var i = 0; i < clonedEvents.length; i++) {
                                var evt = clonedEvents[i];

                                range = moveEventRange(evt, distance);

                                var updatedEventOptions = that.view()._eventOptionsForMove(evt);
                                var eventOptions = $.extend(
                                    {
                                        isAllDay: evt.isAllDay,
                                        start: range.start,
                                        end: range.end
                                    },
                                    updatedEventOptions,
                                    endResources
                                );

                                that._updateEvent(null, evt, eventOptions);
                            }

                            if (that._isMultiDrag) {
                                that.dataSource.sync();
                                that._isMultiDrag = false;
                            }
                        }

                        e.currentTarget.removeClass("k-event-active");
                        this.cancelHold();
                        clonedEvents = [];
                        cachedEvents = [];
                    })
                    .bind("dragcancel", function() {
                        that.view()._removeMoveHint();
                        this.cancelHold();
                        clonedEvents = [];
                        cachedEvents = [];
                    });
                }

                that._moveDraggable.bind("hold", function(e) {
                    if (that._isTouch(e)) {
                        that.element.find(".k-event-active").removeClass("k-event-active");
                        if (that.options.selectable) {
                            that._createSelection(e.currentTarget);
                        }
                        e.currentTarget.addClass("k-event-active");
                    }
                });
            }
        },

        _resizable: function() {
            var startTime;
            var endTime;
            var event;
            var clonedEvent;
            var slot;
            var that = this;
            var distance = 0;

            function direction(handle) {
                var directions = {
                    "k-resize-e": "east",
                    "k-resize-w": "west",
                    "k-resize-n": "north",
                    "k-resize-s": "south"
                };

                for (var key in directions) {
                    if (handle.hasClass(key)) {
                        return directions[key];
                    }
                }
            }

            if (that._isMobile() && kendo.support.mobileOS.android) {
                distance = 5;
            }

            that._resizeDraggable = new kendo.ui.Draggable(that.element, {
                distance: distance,
                filter: ".k-resize-handle",
                autoScroll: true,
                dragstart: function(e) {
                    var dragHandle = $(e.currentTarget);

                    var eventElement = dragHandle.closest(".k-event");

                    var uid = eventElement.attr(kendo.attr("uid"));

                    var view = that.view();

                    that._dragging = true;
                    event = that.occurrenceByUid(uid);

                    clonedEvent = event.clone();

                    view._updateEventForResize(clonedEvent);

                    slot = view._slotByPosition(e.x.startLocation, e.y.startLocation);

                    if (that.trigger("resizeStart", { event: event })) {
                        e.preventDefault();
                    }

                    startTime = kendo.date.toUtcTime(clonedEvent.start);

                    endTime = kendo.date.toUtcTime(clonedEvent.end);
                },
                drag: function(e) {
                    if (!slot) {
                        return;
                    }

                    var dragHandle = $(e.currentTarget);

                    var dir = direction(dragHandle);

                    var view = that.view();

                    var currentSlot = view._slotByPosition(e.x.location, e.y.location);

                    if (!currentSlot || slot.groupIndex != currentSlot.groupIndex) {
                        return;
                    }

                    slot = currentSlot;

                    var originalStart = startTime;

                    var originalEnd = endTime;

                    if (dir == "south") {
                        if (!slot.isDaySlot && slot.end - kendo.date.toUtcTime(clonedEvent.start) >= view._timeSlotInterval()) {
                            if (clonedEvent.isAllDay) {
                                endTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                            } else {
                                endTime = slot.endOffset(e.x.location, e.y.location, that.options.snap);
                            }
                        }
                    } else if (dir == "north") {
                        if (!slot.isDaySlot && kendo.date.toUtcTime(clonedEvent.end) - slot.start >= view._timeSlotInterval()) {
                            startTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                        }
                    } else if (dir == "east") {
                        if (slot.isDaySlot && kendo.date.toUtcTime(kendo.date.getDate(slot.endDate())) >= kendo.date.toUtcTime(kendo.date.getDate(clonedEvent.start))) {
                            if (clonedEvent.isAllDay) {
                                endTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                            } else {
                                endTime = slot.endOffset(e.x.location, e.y.location, that.options.snap);
                            }
                        } else if (!slot.isDaySlot && slot.end - kendo.date.toUtcTime(clonedEvent.start) >= view._timeSlotInterval()) {
                            endTime = slot.endOffset(e.x.location, e.y.location, that.options.snap);
                        }
                    } else if (dir == "west") {
                        if (slot.isDaySlot && kendo.date.toUtcTime(kendo.date.getDate(clonedEvent.end)) >= kendo.date.toUtcTime(kendo.date.getDate(slot.startDate()))) {
                            startTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                        } else if (!slot.isDaySlot && kendo.date.toUtcTime(clonedEvent.end) - slot.start >= view._timeSlotInterval()) {
                            startTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                        }
                    }

                    if (!that.trigger("resize", {
                        event: event,
                        slot: { element: slot.element, start: slot.startDate(), end: slot.endDate() },
                        start: kendo.timezone.toLocalDate(startTime),
                        end: kendo.timezone.toLocalDate(endTime),
                        resources: view._resourceBySlot(slot)
                    })) {
                        view._updateResizeHint(clonedEvent, slot.groupIndex, startTime, endTime);
                    } else {
                        startTime = originalStart;
                        endTime = originalEnd;
                    }
                },
                dragend: function(e) {
                    var dragHandle = $(e.currentTarget);
                    var start = new Date(clonedEvent.start.getTime());
                    var end = new Date(clonedEvent.end.getTime());
                    var dir = direction(dragHandle);

                    that._dragging = false;
                    that.view()._removeResizeHint();

                    if (dir == "south") {
                        end = kendo.timezone.toLocalDate(endTime);
                    } else if (dir == "north") {
                        start = kendo.timezone.toLocalDate(startTime);
                    } else if (dir == "east") {
                        if (slot.isDaySlot) {
                            end = kendo.date.getDate(kendo.timezone.toLocalDate(endTime));
                        } else {
                            end = kendo.timezone.toLocalDate(endTime);
                        }
                    } else if (dir == "west") {
                        if (slot.isDaySlot) {
                            start = new Date(kendo.timezone.toLocalDate(startTime));
                            start.setHours(0);
                            start.setMinutes(0);
                        } else {
                            start = kendo.timezone.toLocalDate(startTime);
                        }
                    }

                    var prevented = that.trigger("resizeEnd", {
                        event: event,
                        slot: { element: slot.element, start: slot.startDate(), end: slot.endDate() },
                        start: start,
                        end: end,
                        resources: that.view()._resourceBySlot(slot)
                    });

                    if (!prevented && end.getTime() >= start.getTime()) {
                        if (clonedEvent.start.getTime() != start.getTime() || clonedEvent.end.getTime() != end.getTime()) {
                            that.view()._updateEventForResize(event);
                            that._updateEvent(dir, event, { start: start, end: end });
                        }
                    }

                    slot = null;
                    event = null;
                },
                dragcancel: function() {
                    that._dragging = false;
                    that.view()._removeResizeHint();

                    slot = null;
                    event = null;
                }
            });
        },

        _updateEvent: function(dir, event, eventInfo) {
            var that = this;

            var updateEvent = function(event, callback) {
                var start;

                try {
                    that._preventRefresh = true;
                    event.update(eventInfo);
                    that._convertDates(event);
                    start = event.start;

                    if (dir && event.duration() % MS_PER_DAY === 0 && start.getHours() === 0 && start.getMinutes() === 0 && start.getSeconds() === 0 && start.getMilliseconds() === 0) {
                        event.set("isAllDay", true);
                    }
                } finally {
                    that._preventRefresh = false;
                }

                if (!that.trigger(SAVE, { event: event })) {
                    if (callback) {
                        callback();
                    }

                    if (!that._isMultiDrag) {
                        that.dataSource.sync();
                    }
                }
            };

            var recurrenceHead = function(event) {
                if (event.recurrenceRule) {
                    return that.dataSource.getByUid(event.uid);
                } else {
                    return that.dataSource.get(event.recurrenceId);
                }
            };

            var updateSeries = function() {
                var head = recurrenceHead(event);

                if (dir == "south" || dir == "north") {
                    if (eventInfo.start) {
                        var start = kendo.date.getDate(head.start);
                        kendo.date.setTime(start, getMilliseconds(eventInfo.start));
                        eventInfo.start = start;
                    }
                    if (eventInfo.end) {
                        var end = kendo.date.getDate(head.end);
                        kendo.date.setTime(end, getMilliseconds(eventInfo.end));
                        eventInfo.end = end;
                    }
                }

                that.dataSource._removeExceptions(head);

                updateEvent(head);
            };

            var updateOccurrence = function() {
                var head = recurrenceHead(event);
                var eventUid;

                var callback = function() {
                    that._convertDates(head);

                    if (that._selection) {
                        that._selection.events.push(eventUid);
                    }
                };

                var exception = head.toOccurrence({ start: event.start, end: event.end });

                eventUid = exception.uid;

                updateEvent(that.dataSource.add(exception), callback);
            };

            if (event.recurrenceRule || event.isOccurrence()) {
                var recurrenceMessages = that.options.messages.recurrenceMessages;

                that._showRecurringDialog(event, updateOccurrence, updateSeries,{
                    title: recurrenceMessages.editWindowTitle,
                    text: recurrenceMessages.editRecurring ? recurrenceMessages.editRecurring : EDITRECURRING,
                    occurrenceText: recurrenceMessages.editWindowOccurrence,
                    seriesText: recurrenceMessages.editWindowSeries
                });
            } else {
                updateEvent(that.dataSource.getByUid(event.uid));
            }
        },

        _modelForContainer: function(container) {
            container = $(container).closest("[" + kendo.attr("uid") + "]");

            return this.dataSource.getByUid(container.attr(kendo.attr("uid")));
        },

        showDialog: function(options) {
            this.toolbar.find("." + FOCUSEDSTATE).removeClass(FOCUSEDSTATE);
            this._editor.showDialog(options);
        },

        focus: function() {
            this.wrapper.trigger("focus");
        },

        _confirmation: function(callback, model, isResetSeries) {
            var editable = this.options.editable;

            if (editable === true || editable.confirmation !== false) {
                var messages = this.options.messages;
                var title = messages.deleteWindowTitle;
                var text = typeof editable.confirmation === STRING ? editable.confirmation : messages.editable.confirmation;

                if (this._isEditorOpened() && model.isRecurring()) {
                    var recurrenceMessages = this.options.messages.recurrenceMessages;
                    title = recurrenceMessages.deleteWindowTitle;

                    if (model.isException() || model.isNew()) {
                        text = recurrenceMessages.deleteRecurringConfirmation ? recurrenceMessages.deleteRecurringConfirmation : DELETERECURRINGCONFIRM;
                    } else {
                        text = recurrenceMessages.deleteSeriesConfirmation ? recurrenceMessages.deleteSeriesConfirmation : DELETESERIESCONFIRM;
                    }

                    if (isResetSeries) {
                        title = recurrenceMessages.resetSeriesWindowTitle;
                        text = recurrenceMessages.resetSeriesConfirmation ? recurrenceMessages.resetSeriesConfirmation : RESETSERIESCONFIRM;
                    }
                }

                var buttons = [
                    { name: "destroy", text: isResetSeries ? messages.resetSeries : messages.destroy, click: function() { callback(); } }
                ];

                if (!(this._isMobile() && kendo.Pane)) {
                    buttons.push({ name: "canceledit", text: messages.cancel, click: function() { callback(true); } });
                }

                this._unbindResize();

                this.showDialog({
                    model: model,
                    text: text,
                    title: title,
                    buttons: buttons
                });

                this._bindResize();
            } else {
                callback();
            }
        },

        addEvent: function(eventInfo) {
            var editable = this._editor.editable;
            var dataSource = this.dataSource;
            var event;

            eventInfo = eventInfo || {};

            var prevented = this.trigger("add", { event: eventInfo });

            if (!prevented && ((editable && editable.end()) || !editable)) {
                this.cancelEvent();

                if (eventInfo && eventInfo.toJSON) {
                    eventInfo = eventInfo.toJSON();
                }

                event = dataSource.add(eventInfo);

                if (event) {
                    this.cancelEvent();
                    this._editEvent(event);
                }
            }
       },

       saveEvent: function() {
            var that = this;
            var editor = that._editor;
            var dataSource = that.dataSource;

            if (!editor) {
                return;
            }

            var editable = editor.editable;
            var container = editor.container;
            var model = that._modelForContainer(container);
            var events, i, event;

            if (container && editable && editable.end() &&
                !that.trigger(SAVE, { container: container, event: model } )) {

                if (!model.isOccurrence() && !!model.recurrenceException && !model.recurrenceRule) {
                    events = dataSource.data();

                    for (i = events.length - 1; i >= 0; i -= 1) {
                        event = events[i];
                        if (event && event.recurrenceId === model.id) {
                            dataSource.remove(event);
                        }
                    }

                    model.set("recurrenceException", "");
                }

                if (!model.dirty && !model.isOccurrence()) {
                    that._convertDates(model, "remove");
                }

                dataSource.sync();
            }
        },

        cancelEvent: function() {
            var editor = this._editor;
            var container = editor.container;
            var model;

            if (container) {
                model = this._modelForContainer(container);

                if (model && model.isOccurrence()) {
                    this._convertDates(model, "remove");
                    this._convertDates(this.dataSource.get(model.recurrenceId), "remove");
                }

                this.dataSource.cancelChanges(model);

                //TODO: handle the cancel in UI

                editor.close();
            }
        },

        editEvent: function(uid) {
            var model = typeof uid == "string" ? this.occurrenceByUid(uid) : uid;

            if (!model) {
                return;
            }

            this.cancelEvent();

            if (model.isRecurring()) {
                this._editRecurringDialog(model);
            } else {
                this._editEvent(model);
            }
        },

        _editEvent: function(model) {
            this._preventRefresh = true;
            this._unbindResize();

            this._createPopupEditor(model);
            this.toolbar.find("." + FOCUSEDSTATE).removeClass(FOCUSEDSTATE);

            this._bindResize();
        },

        _editRecurringDialog: function(model) {
            var that = this;

            var editOccurrence = function() {
                if (model.isException()) {
                    that._editEvent(model);
                } else {
                    that.addEvent(model);
                }
            };

            var editSeries = function() {
                if (model.recurrenceId) {
                    model = that.dataSource.get(model.recurrenceId);
                }

                that._editEvent(model);
            };

            var recurrenceMessages = that.options.messages.recurrenceMessages;
            that._showRecurringDialog(model, editOccurrence, editSeries, {
                title: recurrenceMessages.editWindowTitle,
                text: recurrenceMessages.editRecurring ? recurrenceMessages.editRecurring : EDITRECURRING,
                occurrenceText: recurrenceMessages.editWindowOccurrence,
                seriesText: recurrenceMessages.editWindowSeries
            });
         },

         _showRecurringDialog: function(model, editOccurrence, editSeries, messages) {
             var editable = this.options.editable;
             var editRecurringMode = isPlainObject(editable) ? editable.editRecurringMode : "dialog";

             if (editRecurringMode === "occurrence" || this._isMultiDrag) {
                 editOccurrence();
             } else if (editRecurringMode === "series") {
                 editSeries();
             } else {
                 this._unbindResize();

                 this.showDialog({
                     model: model,
                     title: messages.title,
                     text: messages.text,
                     buttons: [
                         { text: messages.occurrenceText, click: editOccurrence },
                         { text: messages.seriesText, click: editSeries }
                     ]
                 });

                 this._bindResize();
             }
        },

        _createButton: function(command) {
            var template = command.template || COMMANDBUTTONTMPL,
                commandName = typeof command === STRING ? command : command.name || command.text,
                options = { className: "k-scheduler-" + (commandName || "").replace(/\s/g, ""), text: commandName, attr: "" };

            if (!commandName && !(isPlainObject(command) && command.template)) {
                throw new Error("Custom commands should have name specified");
            }

            if (isPlainObject(command)) {
                if (command.className) {
                    command.className += " " + options.className;
                }

                if (commandName === "edit" && isPlainObject(command.text)) {
                    command = extend(true, {}, command);
                    command.text = command.text.edit;
                }

                options = extend(true, options, defaultCommands[commandName], command);
            } else {
                options = extend(true, options, defaultCommands[commandName]);
            }

            if (!options.className) {
                options.className = "k-button-solid-base";
            } else if (options.className.indexOf("k-button-solid-primary") === -1) {
                options.className += " k-button-solid-base";
            }

            return kendo.template(template)(options);
        },

        _convertDates: function(model, method) {
            var timezone = this.dataSource.reader.timezone;
            var startTimezone = model.startTimezone;
            var endTimezone = model.endTimezone;
            var start = model.start;
            var end = model.start;

            method = method || "apply";
            startTimezone = startTimezone || endTimezone;
            endTimezone = endTimezone || startTimezone;

            if (startTimezone) {
                if (timezone) {
                    if (method === "apply") {
                        start = kendo.timezone.convert(model.start, timezone, startTimezone);
                        end = kendo.timezone.convert(model.end, timezone, endTimezone);
                    } else {
                        start = kendo.timezone.convert(model.start, startTimezone, timezone);
                        end = kendo.timezone.convert(model.end, endTimezone, timezone);
                    }
                } else {
                    start = kendo.timezone[method](model.start, startTimezone);
                    end = kendo.timezone[method](model.end, endTimezone);
                }

                model._set("start", start);
                model._set("end", end);
            }
        },

        _createEditor: function() {
            var that = this;

            var editor;

            if (this._isMobile() && kendo.Pane) {
                editor = that._editor = new MobileEditor(this.wrapper, extend({}, this.options, {
                    target: this,
                    timezone: that.dataSource.reader.timezone,
                    resources: that.resources,
                    createButton: this._createButton.bind(this)
                }));
            } else {
                editor = that._editor = new PopupEditor(this.wrapper, extend({}, this.options, {
                    target: this,
                    createButton: this._createButton.bind(this),
                    timezone: that.dataSource.reader.timezone,
                    resources: that.resources
                }));
            }

            editor.bind("cancel", function(e) {
                if (that.trigger("cancel", { container: e.container, event: e.model })) {
                    e.preventDefault();
                    return;
                }
                that._preventRefresh = false;
                that.cancelEvent();

                if (that._attemptRefresh) {
                    that.refresh();
                }

                that.focus();
            });

            editor.bind("edit", function(e) {
                if (that.trigger(EDIT, { container: e.container, event: e.model })) {
                    e.preventDefault();
                }
            });

            editor.bind("save", function() {
                that._preventRefresh = false;
                that.saveEvent();
            });

            editor.bind("remove", function(e) {
                that._preventRefresh = false;
                that.removeEvent(e.model);
            });

            editor.bind("resetSeries", function(e) {
                that._confirmation(function(cancel) {
                    that._preventRefresh = false;
                    if (!cancel) {
                        that.dataSource._removeExceptions(e.model);
                        that.saveEvent();
                    }
                }, e.model, true);
            });
        },

        _createPopupEditor: function(model) {
            var editor = this._editor;

            if (!model.isNew() || model.isOccurrence()) {
                if (model.isOccurrence()) {
                    this._convertDates(model.recurrenceId ? this.dataSource.get(model.recurrenceId) : model);
                }
                this._convertDates(model);
            }

            this.editable = editor.editEvent(model);
        },

        removeEvent: function(uid) {
            var that = this,
                model = typeof uid == "string" ? that.occurrenceByUid(uid) : uid;

            if (!model) {
                return;
            }

            if (model.isRecurring()) {
                that._deleteRecurringDialog(model);
            } else {
                that._confirmation(function(cancel) {
                    if (!cancel) {
                        that._removeEvent(model);
                    }
                }, model);
            }
        },

        occurrenceByUid: function(uid) {
            var occurrence = this.dataSource.getByUid(uid);
            if (!occurrence) {
                occurrence = getOccurrenceByUid(this._data, uid);
            }

            return occurrence;
        },

        occurrencesInRange: function(start, end) {
            return new kendo.data.Query(this._data).filter({
                logic: "or",
                filters: [
                    {
                        logic: "and",
                        filters: [
                            { field: "start", operator: "gte", value: start },
                            { field: "end", operator: "gte", value: start },
                            { field: "start", operator: "lt", value: end }
                        ]
                    },
                    {
                        logic: "and",
                        filters: [
                            { field: "start", operator: "lte", value: start },
                            { field: "end", operator: "gt", value: start }
                        ]
                    }
                ]
            }).toArray();
        },

        _removeEvent: function(model) {
            if (!this.trigger(REMOVE, { event: model })) {
                if (this.dataSource.remove(model)) {
                    this.dataSource.sync();
                }
            }
        },

        _deleteRecurringDialog: function(model) {
            var that = this;
            var currentModel = model;
            var editable = that.options.editable;
            var deleteOccurrence;
            var deleteSeries;
            var createException;
            var deleteOccurrenceConfirmation;
            var deleteSeriesConfirmation;
            var createExceptionConfirmation;
            var editRecurringMode = isPlainObject(editable) ? editable.editRecurringMode : "dialog";

            deleteOccurrence = function() {
                var occurrence = currentModel.recurrenceId ? currentModel : currentModel.toOccurrence();
                var head = that.dataSource.get(occurrence.recurrenceId);

                that._convertDates(head);
                that._removeEvent(occurrence);
            };

            deleteSeries = function() {
                if (currentModel.recurrenceId) {
                    currentModel = that.dataSource.get(currentModel.recurrenceId);
                }

                that._removeEvent(currentModel);
            };

            createException = function() {
                that.dataSource.remove(currentModel);
                that.dataSource.sync();
            };

            if (editRecurringMode != "dialog" || that._isEditorOpened()) {
                deleteOccurrenceConfirmation = function() {
                    that._confirmation(function(cancel) {
                        if (!cancel) {
                            deleteOccurrence();
                        }
                    }, currentModel);
                };

                deleteSeriesConfirmation = function() {
                    that._confirmation(function(cancel) {
                        if (!cancel) {
                            deleteSeries();
                        }
                    }, currentModel);
                };

                createExceptionConfirmation = function() {
                    that._confirmation(function(cancel) {
                        if (!cancel) {
                            createException();
                        }
                    }, currentModel);
                };
            }

            var seriesCallback = deleteSeriesConfirmation || deleteSeries;
            var occurrenceCallback = deleteOccurrenceConfirmation || deleteOccurrence;
            var exeptionCallback = createExceptionConfirmation || createException;

            if (that._isEditorOpened()) {
                if (model.isException()) {
                    occurrenceCallback();
                } else if (model.isNew()) {
                    exeptionCallback();
                } else {
                    seriesCallback();
                }
            } else {
                var recurrenceMessages = that.options.messages.recurrenceMessages;
                that._showRecurringDialog(model, occurrenceCallback, seriesCallback, {
                    title: recurrenceMessages.deleteWindowTitle,
                    text: recurrenceMessages.deleteRecurring ? recurrenceMessages.deleteRecurring : DELETERECURRING,
                    occurrenceText: recurrenceMessages.deleteWindowOccurrence,
                    seriesText: recurrenceMessages.deleteWindowSeries
                });
            }
        },

        _isEditorOpened: function() {
            return !!this._editor.container;
        },

        _unbindView: function(view) {
            var that = this;

            view.destroy();
        },

        _bindView: function(view) {
            var that = this;

            if (that.options.editable) {
                if (that._viewRemoveHandler) {
                    view.unbind(REMOVE, that._viewRemoveHandler);
                }

                that._viewRemoveHandler = function(e) {
                    that.removeEvent(e.uid);
                };

                view.bind(REMOVE, that._viewRemoveHandler);

                if (that._viewAddHandler) {
                    view.unbind(ADD, that._viewAddHandler);
                }

                that._viewAddHandler = function(e) {
                    that.addEvent(e.eventInfo);
                };

                view.bind(ADD, this._viewAddHandler);

                if (that._viewEditHandler) {
                    view.unbind(EDIT, that._viewEditHandler);
                }

                that._viewEditHandler = function(e) {
                    that.editEvent(e.uid);
                };

                view.bind(EDIT, this._viewEditHandler);
            }

            if (that._viewNavigateHandler) {
                view.unbind("navigate", that._viewNavigateHandler);
            }

            that._viewNavigateHandler = function(e) {
                if (e.action) {
                    if (!that.trigger("navigate", { view: e.view, isWorkDay: e.isWorkDay, action: e.action, date: e.date })) {
                        that.date(e.date);
                    }
                } else if (e.view) {
                    var switchWorkDay = "isWorkDay" in e;
                    var action = switchWorkDay ? "changeWorkDay" : "changeView";

                    if (!that.trigger("navigate", { view: e.view, isWorkDay: e.isWorkDay, action: action, date: e.date })) {
                        if (switchWorkDay) {
                            that._workDayMode = e.isWorkDay;
                        }

                        that._selectView(e.view);
                        that.date(e.date);
                    }
                }
            };

            view.bind("navigate", that._viewNavigateHandler);

            if (that._viewActivateHandler) {
                view.unbind("activate", that._viewActivateHandler);
            }

            that._viewActivateHandler = function() {
                var view = this;
                if (that._selection) {
                    view.constrainSelection(that._selection);

                    if ($(document.activeElement).closest(".k-scheduler-toolbar").length === 0) {
                        if (document.activeElement !== that.wrapper[0]) {
                            that.element.focus();
                        } else {
                            that._select();
                        }
                    }

                    that._adjustSelectedDate();
                }
            };

            view.bind("activate", that._viewActivateHandler);
        },

        _selectView: function(name) {
            var that = this;

            if (name && that.views[name]) {
                if (that._selectedView) {
                    that._unbindView(that._selectedView);
                }

                that._selectedView = that._renderView(name);
                that._selectedViewName = name;

                if (this._initialSize) {
                    this._initialSize = false;
                    this._onMediaChange(window.matchMedia(MIN_SCREEN));
                }

                if (that._viewsCount > 1 && !that._isMobile()) {
                    var viewElementToSelect = that.toolbar.find("[" + kendo.attr("name") + "=" + name + "]");
                    var viewsDropdown = that.toolbar.find(".k-views-dropdown");
                    var viewsGroupEl = viewElementToSelect.closest(".k-button-group");
                    var viewsButtonGroup = viewsGroupEl.data("kendoButtonGroup");

                    viewsDropdown.val(name);

                    if (viewsButtonGroup) {
                        viewsButtonGroup.select(viewElementToSelect);
                    }
                } else if (that._viewsCount > 1) {
                    var viewSelect = that.toolbar.find(".k-scheduler-mobile-views");

                    viewSelect.find("[value=" + name.replace(/\./g, "\\.") + "]")
                        .prop("selected", "selected");
                }
            }
        },

        view: function(name) {
            var that = this;

            if (name) {
                if (name === "year") {
                    that.wrapper.removeAttr("tabindex");
                } else {
                    that.wrapper.attr("tabindex", 0);
                }

                that._selectView(name);
                that.rebind();

                return;
            }

            return that._selectedView;
        },

        viewName: function() {
            return this.view().name;
        },

        _renderView: function(name) {
            var view = this._initializeView(name);

            this._bindView(view);

            if (kendo.support.mouseAndTouchPresent || kendo.support.pointers) {
                view.content.css("-ms-touch-action", "pinch-zoom");
                view.content.css("touch-action", "pinch-zoom");
            }

            this._model.set("formattedDate", view.dateForTitle());
            this._model.set("formattedShortDate", view.shortDateForTitle());
            this._model.set("formattedMobileDate", view.mobileDateForTitle ? view.mobileDateForTitle() : view.shortDateForTitle());
            this._model.set("formattedYear", kendo.format("{0:yyyy}", view.startDate()));

            return view;
        },

        resize: function(force) {
            var size = this.getSize();
            var currentSize = this._size;
            var view = this.view();

            if (!view || !view.groups) {
                return;
            }

            if (force || !currentSize || size.width !== currentSize.width || size.height !== currentSize.height) {
                this.refresh({ action: "resize" });
                this._size = size;
            }
        },

        _adjustSelectedDate: function() {
            var date = this._model.selectedDate,
                selection = this._selection,
                start = selection.start;

            if (start && !kendo.date.isInDateRange(date, getDate(start), getDate(selection.end))) {
                date.setFullYear(start.getFullYear(), start.getMonth(), start.getDate());
            }
        },

        _initializeView: function(name) {
            var view = this.views[name];

            if (view) {
                var isSettings = isPlainObject(view),
                    overrideOptions = {},
                    type = view.type;

                if (typeof type === STRING) {
                    type = kendo.getter(view.type)(window);
                }

                if (isSettings && view.workDays && view.workDays.length) {
                    overrideOptions.workDays = view.workDays;
                }

                if (type) {
                    view = new type(this.wrapper, trimOptions(extend(true, {}, this.options, isSettings ? view : {}, {
                        resources: this.resources,
                        date: this.date(),
                        startTime: kendo.parseDate(view.startTime) || kendo.parseDate(this.options.startTime),
                        endTime: kendo.parseDate(view.endTime) || kendo.parseDate(this.options.endTime),
                        showWorkHours: this._workDayMode
                    }),overrideOptions));

                } else {
                    throw new Error("There is no such view");
                }
            }

            return view;
        },

        _views: function() {
            var views = this.options.views;
            var view;
            var defaultView;
            var selected;
            var isSettings;
            var name;
            var type;
            var idx;
            var length;

            this.views = {};
            this._viewsCount = 0;

            for (idx = 0, length = views.length; idx < length; idx++) {
                var hasType = false;

                view = views[idx];

                isSettings = isPlainObject(view);

                if (isSettings) {
                    type = name = view.type ? view.type : view;
                    if (typeof type !== STRING) {
                        name = view.name || view.title;
                        hasType = true;
                    }
                } else {
                    type = name = view;
                    view = {};
                }

                defaultView = defaultViews[name];

                if (defaultView && !hasType) {
                    view.type = defaultView.type;
                    defaultView.title = this.options.messages.views[name];
                    if (defaultView.type === "day") {
                        defaultView.messages = { allDay: this.options.messages.allDay };
                    } else if (defaultView.type === "agenda") {
                        defaultView.messages = {
                            event: this.options.messages.event,
                            date: this.options.messages.date,
                            time: this.options.messages.time
                        };
                    }
                }

                view = extend({ title: name }, defaultView, isSettings ? view : {});

                if (name) {
                    this.views[name] = view;
                    this._viewsCount++;

                    if (!selected || view.selected) {
                        selected = name;
                    }
                }
            }

            if (selected) {
                this._selectedViewName = selected; // toolbar is not rendered yet
            }
        },

        rebind: function() {
            var that = this,
                resources = that.resources,
                resourceFetchArray = [];

            if (that._preventRebind) {
                that._preventRebind = false;
                return;
            }

            if (that.options.autoBind === false && resources && resources.length > 0) {
                resources.forEach(function(resource) {
                    if (resource.dataSource.data().length === 0) {
                        that._preventRebind = true;
                        resourceFetchArray.push(resource.dataSource.fetch());
                    }
                });

                $.when.apply(null, resourceFetchArray).then(function() {
                    that.dataSource.fetch();
                    that._preventRebind = false;
                });
            } else {
                that.dataSource.fetch();
            }
        },

        _dataSource: function() {
            var that = this,
                options = that.options,
                dataSource = options.dataSource;

            dataSource = isArray(dataSource) ? { data: dataSource } : dataSource;

            if (options.timezone && !(dataSource instanceof SchedulerDataSource)) {
                dataSource = extend(true, dataSource, { schema: { timezone: options.timezone } });
            } else if (dataSource instanceof SchedulerDataSource) {
                options.timezone = dataSource.options.schema ? dataSource.options.schema.timezone : "";
            }

            if (that.dataSource && that._refreshHandler) {
                that.dataSource
                    .unbind(CHANGE, that._refreshHandler)
                    .unbind(PROGRESS, that._progressHandler)
                    .unbind(ERROR, that._errorHandler);
            } else {
                that._refreshHandler = that.refresh.bind(that);
                that._progressHandler = that._requestStart.bind(that);
                that._errorHandler = that._error.bind(that);
            }

            that.dataSource = kendo.data.SchedulerDataSource.create(dataSource)
                .bind(CHANGE, that._refreshHandler)
                .bind(PROGRESS, that._progressHandler)
                .bind(ERROR, that._errorHandler);

            that.options.dataSource = that.dataSource;
        },


        _error: function() {
            this._progress(false);
        },

        _requestStart: function() {
            this._progress(true);
        },

        _progress: function(toggle) {
            var element = this.element.find(".k-scheduler-content");
            kendo.ui.progress(element, toggle);
        },

        _resources: function() {
            var that = this;
            var resources = that.options.resources;
            var resourcePromises = [];

            for (var idx = 0; idx < resources.length; idx++) {
                var resource = resources[idx];
                var field = resource.field;
                var name = resource.name || field;
                var dataSource = resource.dataSource;

                if (!field || !dataSource) {
                    throw new Error('The "field" and "dataSource" options of the scheduler resource are mandatory.');
                }

                that.resources.push({
                    field: field,
                    name: name,
                    title: resource.title || field,
                    dataTextField: resource.dataTextField || "text",
                    dataValueField: resource.dataValueField || "value",
                    dataColorField: resource.dataColorField || "color",
                    dataParentValueField: resource.dataParentValueField || "parentValue",
                    valuePrimitive: resource.valuePrimitive != null ? resource.valuePrimitive : true,
                    multiple: resource.multiple || false,
                    dataSource: that._resourceDataSource(dataSource, name, resourcePromises)
                });
            }

            if (!that.options.autoBind) {
                that._selectView(that._selectedViewName);
            } else {
                $.when.apply(null, resourcePromises)
                      .then(function() {
                            that.view(that._selectedViewName);
                        });
            }
        },

        _resourceDataSource: function(resourceDS, groupName, promises) {
            var that = this;
            var dataSource = isArray(resourceDS) ? { data: resourceDS } : resourceDS;
            var dataSourceInstance = kendo.data.DataSource.create(dataSource);

            if (that.options.autoBind) {
                promises.push(dataSourceInstance.fetch(function() {
                    // 'this' is the DataSource instance not the Scheduler
                    that._bindResourceEvents(this, groupName);
                }));
            } else {
                that._bindResourceEvents(dataSourceInstance, groupName);
            }

            return dataSourceInstance;
        },

        _bindResourceEvents: function(resourceDS, groupName) {
            var that = this;
            var isGrouped = that.options.group && that.options.group.resources.length;
            var isResourceGrouped = isGrouped && that.options.group.resources.indexOf(groupName) > -1;

            if (!that._resourceRefreshHandler && isResourceGrouped) {
                that._resourceRefreshHandler = that._refreshResource.bind(that);
                that._resourceErrorHandler = that._error.bind(that);
            }

            if (isResourceGrouped) {
                resourceDS.bind(CHANGE, that._resourceRefreshHandler)
                    .bind(ERROR, that._resourceErrorHandler);
            }
        },

        _refreshResource: function() {
            var that = this;
            var preventRefresh = (that._editor && that._editor.editable) || that._preventRefresh;

            if (!preventRefresh) {
                that.view(that._selectedViewName);
            }
        },

        _initModel: function() {
            var that = this;
            that._model = kendo.observable({
               selectedDate: new Date(this.options.date),
               formattedDate: "",
               formattedShortDate: ""
           });

           that._model.bind(CHANGE, function(e) {
                if (e.field === "selectedDate") {
                    that.view(that._selectedViewName);
                }
           });
        },

        _wrapper: function() {
            var that = this;
            var options = that.options;
            var height = options.height;
            var width = options.width;

            that.wrapper = that.element.addClass("k-scheduler");

            if (that._isMobile()) {
               that.wrapper.addClass("k-scheduler-mobile");
            }

            if (height) {
                that.wrapper.height(height);
            }

            if (width) {
                that.wrapper.width(width);
            }
        },

        date: function(value) {
            if (value != null && getDate(value) >= getDate(this.options.min) && getDate(value) <= getDate(this.options.max)) {
                this._model.set("selectedDate", value);
            }
            return getDate(this._model.get("selectedDate"));
        },

        _processHandlers: function(defaults) {
            var that = this;

            that._pdfClickHandler = (e) => {
                e.preventDefault();
                that.saveAsPDF();
            };

            that._createClickHandler = (e) => {
                e.preventDefault();
                that.addEvent();
            };

            that._calendarClickHandler = that._currentClickHandler = (e) => {
                e.preventDefault();
                that._showCalendar(e.target);
            };

            that._todayClickHandler = (e) => {
                e.preventDefault();

                var timezone = that.options.timezone,
                    currentDate = new Date(),
                    date;

                if (timezone) {
                    var timezoneOffset = kendo.timezone.offset(currentDate, timezone);
                    date = kendo.timezone.convert(currentDate, currentDate.getTimezoneOffset(), timezoneOffset);
                } else {
                    date = currentDate;
                }

                if (!that.trigger("navigate", { view: that._selectedViewName, action: "today", date: date })) {
                    that.date(date);
                }
            };

            that._previousClickHandler = (e) => {
                e.preventDefault();

                var date = that.view().previousDate();

                if (!that.trigger("navigate", { view: that._selectedViewName, action: "previous", date: date })) {
                    that.date(date);
                }
            };

            that._nextClickHandler = (e) => {
                e.preventDefault();

                var date = that.view().nextDate();

                if (!that.trigger("navigate", { view: that._selectedViewName, action: "next", date: date })) {
                    that.date(date);
                }
            };

            that._refreshClickHandler = (e) => {
                e.preventDefault();

                var name = that.view().name;

                if (!that.trigger("navigate", { view: name, action: "changeView", date: that.date() })) {
                    that.view(name);
                }
            };

            that._viewClickHandler = (e) => {
                var name = e.target.attr(kendo.attr("name"));

                if (!that.trigger("navigate", { view: name, action: "changeView", date: that.date() })) {
                    that.view(name);
                }
            };

            Object.values(defaults).map(t => {
                if (t.name) {
                    t.click = that["_" + t.name + "ClickHandler"];
                }
            });
        },

        _processDefaults: function() {
            var views = this.views,
                defaults = $.extend(true, {}, DEFAULT_TOOLS),
                viewsButtons = [],
                isRtl = kendo.support.isRtl(this.wrapper),
                viewsDdl, viewsMobile;

            Object.keys(views).map(name => {
                var current = $.extend(true, {}, defaults.view);

                current.text = views[name].title;
                current.attributes = {
                    class: "k-view-" + name.toLowerCase(),
                    "data-name": name
                };

                defaults[name] = current;

                viewsButtons.push(name);
            });

            if (viewsButtons.length > 1) {
                viewsDdl = VIEWS_DROPDOWN_TEMPLATE({ views: this.views, label: this.options.messages.selectView, type: "k-views-dropdown" });
                viewsMobile = VIEWS_DROPDOWN_TEMPLATE({ views: this.views, label: this.options.messages.selectView, type: "k-scheduler-mobile-views" });
            }

            defaults.viewsDdl = {
                template: viewsDdl
            };

            defaults.viewsMobile = {
                template: viewsMobile
            };

            this._viewsButtons = viewsButtons;

            if (isRtl) {
                defaults.previous.icon = "k-i-arrow-right";
                defaults.next.icon = "k-i-arrow-left";
            }

            return defaults;
        },

        _processToolbarArray: function() {
            var options = this.options,
                toolbarOptions = options.toolbar,
                commands = [],
                isMobile = this._isMobile(),
                tools, pdf, search;

            if (toolbarOptions) {
                commands = Array.isArray(toolbarOptions) ? toolbarOptions : [toolbarOptions];
            }

            pdf = $.grep(commands, function(item) {
                return item == "pdf" || item.name == "pdf";
            }).length > 0;

            search = $.grep(commands, function(item) {
                return item == "search" || item.name == "search";
            }).length > 0;

            if (isMobile) {
                tools = [...defaultMobileToolsFirst];

                if (options.editable) {
                    tools[0].push("create");
                }
            } else {
                tools = [...defaultDesktopTools];
            }

            if (search) {
                tools.push("search");
            }

            if (pdf) {
                if (isMobile) {
                    tools[0].unshift("pdfMobile");
                } else {
                    tools.unshift("pdf");
                }
            }

            if (this._viewsCount === 1) {
                tools.push("refresh");
            } else if (this._viewsCount > 1) {
                if (isMobile) {
                    tools.push("viewsMobile");
                } else {
                    tools.push("viewsDdl");
                    tools.push(this._viewsButtons);
                }
            }

            return tools;
        },

        _processViewTools: function(items) {
            var result = items,
                viewsIndex = -1;

            items.some((item, index) => {
                if (item === "views" || item.name === "views") {
                    viewsIndex = index;
                    return true;
                }

                return false;
            });

            if (viewsIndex > -1) {
                result.splice(viewsIndex, 1, "viewsDdl", this._viewsButtons);
            }

            return result;
        },

        _processToolbarItems: function() {
            var desktopItems = this.options.toolbar.items.desktop || this.options.toolbar.items,
                mobileItems = this.options.toolbar.items.mobile || this.options.toolbar.items,
                isMobile = this._isMobile();

            if (!isMobile) {
                if (desktopItems.main) {
                    if (desktopItems.navigation) {
                        desktopItems = desktopItems.main.concat(desktopItems.navigation);
                    } else {
                        desktopItems = desktopItems.main;
                    }
                }

                return { tools: this._processViewTools(desktopItems) };
            } else {
                if (Array.isArray(mobileItems)) {
                    return {
                        tools: this._processViewTools(mobileItems),
                        navigation: []
                    };
                } else {
                    return {
                        tools: this._processViewTools(mobileItems.main),
                        navigation: this._processViewTools(mobileItems.navigation)
                    };
                }
            }
        },

        _processTools: function() {
            var options = this.options,
                toolbarOptions = options.toolbar;

            if (toolbarOptions && toolbarOptions.items) {
                return this._processToolbarItems();
            } else {
                return { tools: this._processToolbarArray() };
            }
        },

        _toolbar: function() {
            var that = this;
            var options = that.options;
            var defaults = that._processDefaults();
            var { tools, navigation } = that._processTools();
            var toolbar = $("<div class='k-scheduler-toolbar'>");
            var secondToolbar;

            that._processHandlers(defaults);
            that.wrapper.append(toolbar);
            that.toolbar = toolbar;

            toolbar.kendoToolBar({
                resizable: false,
                tools: tools,
                defaultTools: defaults,
                parentMessages: options.messages
            });

            if (that._isMobile() && (!navigation || navigation.length !== 0)) {
                secondToolbar = $("<div class='k-scheduler-toolbar'>");
                that.wrapper.append(secondToolbar);
                that.toolbar = that.toolbar.add(secondToolbar);

                secondToolbar.kendoToolBar({
                    resizable: false,
                    tools: navigation || [...defaultMobileToolsSecond],
                    defaultTools: defaults,
                    parentMessages: options.messages
                });
            }

            that.toolbar.find(".k-nav-current .k-button-text").attr('data-' + kendo.ns + 'bind', "text: formattedDate");
            that.toolbar.find(".k-m-date-format").attr('data-' + kendo.ns + 'bind', "text: formattedMobileDate");
            that.toolbar.find(".k-y-date-format").attr('data-' + kendo.ns + 'bind', "text: formattedYear");

            kendo.bind(that.toolbar, that._model);

            that.toolbar.find(".k-scheduler-search-input").attr({
                placeholder: options.messages.search,
                title: options.messages.search
            });

            toolbar.on("input" + NS, ".k-scheduler-search-input", kendo.throttle(function(e) {
                that.dataSource.filter({
                    logic: "or",
                    filters: [
                        { field: "title", operator: "contains", value: e.target.value },
                        { field: "description", operator: "contains", value: e.target.value }
                    ]
                });
            }, 250));

            toolbar.on(CHANGE + NS, ".k-views-dropdown, .k-scheduler-mobile-views", function() {
                var name = this.value;

                if (!that.trigger("navigate", { view: name, action: "changeView", date: that.date() })) {
                    that.view(name);
                }
            });

            that._initialSize = true;
        },

        _showCalendar: function(targetElm) {
            var that = this,
                target = targetElm || that.toolbar.find(".k-nav-current"),
                html = $('<div class="k-calendar-container"><div class="k-scheduler-calendar"></div></div>');

            if (!that.popup) {
                that.popup = new Popup(html, {
                    anchor: target,
                    activate: function() {
                        if (that.popup && that.calendar) {
                            that.popup._toggleResize(false);
                            that.calendar.element.find("table").trigger("focus");
                            that.popup._toggleResize(true);
                        }
                    },
                    open: function() {
                        if (!that.calendar) {
                            that.calendar = new Calendar(this.element.find(".k-scheduler-calendar"),
                            {
                                change: function() {
                                    var date = this.value();
                                    if (!that.trigger("navigate", { view: that._selectedViewName, action: "changeDate", date: date })) {
                                        that.date(date);
                                        that.popup.close();
                                    }

                                    if (!that._isMobile()) {
                                        that._selectedView.element.trigger("focus");
                                        that.toolbar.find(".k-nav-current").trigger("focus").addClass(FOCUSEDSTATE);
                                    }
                                },
                                min: that.options.min,
                                max: that.options.max
                            });
                        }
                        that.calendar.element.on("keydown" + NS, function(e) {
                            if (e.keyCode === keys.ESC || e.keyCode === keys.TAB) {
                                that.popup.close();
                                that._selectedView.element.trigger("focus");
                                that.toolbar.find(".k-nav-current").trigger("focus").addClass(FOCUSEDSTATE);
                            }
                        });

                        that.calendar.setOptions({
                            start: that._selectedViewName === "year" ? "decade" : "month",
                            depth: that._selectedViewName === "year" ? "decade" : "month"
                        });

                        that.calendar.value(that.date());
                    },
                    copyAnchorStyles: false
                });
            }

            that.popup.open();
        },

        refresh: function(e) {
            var that = this;
            var view = this.view();
            var preventRefresh = (e && e.action === "itemchange" && (this._editor.editable || this._preventRefresh)) ||
                                 (this.dataSource.options.type === "signalr" && this._preventRefresh);

            this._progress(false);

            e = e || {};

            if (!view) {
                return;
            }

            if (preventRefresh) { // skip rebinding if editing is in progress
                this._attemptRefresh = true && this.dataSource.options.type === "signalr";
                return;
            }

            if (this.trigger("dataBinding", { action: e.action || "rebind", index: e.index, items: e.items })) {
                return;
            }

            if (!(e && e.action === "resize") && this._editor) {
                this._editor.close();
            }

            this._data = this.dataSource.expand(view.startDate(), view.visibleEndDate());

            view.refreshLayout();

            view.render(this._data);

            this.trigger("dataBound");
            this._attemptRefresh = false;
        },

        slotByPosition: function(x, y) {
            var view = this.view();

            if (!view._slotByPosition) {
                return null;
            }

            var slot = view._slotByPosition(x, y);

            if (!slot) {
                return null;
            }

            return {
                startDate: slot.startDate(),
                endDate: slot.endDate(),
                groupIndex: slot.groupIndex,
                element: slot.element,
                isDaySlot: slot.isDaySlot
            };
        },

        slotByElement: function(element) {
            var el = $(element),
                offset = el.offset(),
                width = el.width(),
                height = el.height(),
                centerX = offset.left + width / 2,
                centerY = offset.top + height / 2,
                offset = $(element).offset();

            return this.slotByPosition(centerX, centerY);
        },

        resourcesBySlot: function(slot) {
            return this.view()._resourceBySlot(slot);
        }
    });

    var defaultViews = {
        day: {
            type: "kendo.ui.DayView"
        },
        week: {
            type: "kendo.ui.WeekView"
        },
        workWeek: {
            type: "kendo.ui.WorkWeekView"
        },
        agenda: {
            type: "kendo.ui.AgendaView"
        },
        month: {
            type: "kendo.ui.MonthView"
        },
        timeline: {
            type: "kendo.ui.TimelineView"
        },
        timelineWeek: {
            type: "kendo.ui.TimelineWeekView"
        },
        timelineWorkWeek: {
            type: "kendo.ui.TimelineWorkWeekView"
        },
        timelineMonth: {
            type: "kendo.ui.TimelineMonthView"
        },
        year: {
            type: "kendo.ui.YearView"
        }
    };

    ui.plugin(Scheduler);

    if (kendo.PDFMixin) {
        kendo.PDFMixin.extend(Scheduler.prototype);

        var SCHEDULER_EXPORT = "k-scheduler-pdf-export";
        Scheduler.fn._drawPDF = function(progress) {
            var wrapper = this.wrapper;
            var styles = wrapper[0].style.cssText;

            wrapper.css({
                width: wrapper.width(),
                height: wrapper.height()
            });

            wrapper.addClass(SCHEDULER_EXPORT);

            var scheduler = this;
            var promise = new $.Deferred();
            var table = wrapper.find(".k-scheduler-content").find("table").css("table-layout", "auto");

            setTimeout(function() {
                table.css("table-layout", "fixed");
                scheduler.resize(true);

                scheduler._drawPDFShadow({}, {
                    avoidLinks: scheduler.options.pdf.avoidLinks
                })
                .done(function(group) {
                    var args = {
                        page: group,
                        pageNumber: 1,
                        progress: 1,
                        totalPages: 1
                    };

                    progress.notify(args);
                    promise.resolve(args.page);
                })
                .fail(function(err) {
                    promise.reject(err);
                })
                .always(function() {
                    wrapper[0].style.cssText = styles;
                    wrapper.removeClass(SCHEDULER_EXPORT);
                    scheduler.resize(true);

                    //Required because slot.offsetLeft is incorrect after first resize
                    scheduler.resize(true);
                });
            });

            return promise;
        };
    }

    var TimezoneEditor = Widget.extend({
        init: function(element, options) {
            var that = this,
                zones = kendo.timezone.windows_zones;

            if (!zones || !kendo.timezone.zones_titles) {
                throw new Error('kendo.timezones.min.js is not included.');
            }

            Widget.fn.init.call(that, element, options);

            that.wrapper = that.element;

            that._zonesQuery = new kendo.data.Query(zones);
            that._zoneTitleId = kendo.guid();
            that._zoneTitlePicker();
            that._zonePicker();

            that._zoneTitle.bind("cascade", function() {
                if (!this.value()) {
                    that._zone.wrapper.hide();
                }
            });

            that._zone.bind("cascade", function() {
                that._value = this.value();
                that.trigger(CHANGE);
            });

            that.value(that.options.value);
        },
        options: {
            name: "TimezoneEditor",
            value: "",
            optionLabel: "No timezone"
        },
        events: [ CHANGE ],

        _zoneTitlePicker: function() {
            var that = this,
                zoneTitle = $('<input id="' + that._zoneTitleId + '" aria-label="' + that.options.title + '"/>').appendTo(that.wrapper);

            that._zoneTitle = new kendo.ui.DropDownList(zoneTitle, {
                dataSource: kendo.timezone.zones_titles,
                dataValueField: "other_zone",
                dataTextField: "name",
                optionLabel: that.options.optionLabel
            });
        },

        _zonePicker: function() {
            var that = this,
                zone = $('<input aria-label="' + that.options.title + '"/>').appendTo(this.wrapper);

            that._zone = new kendo.ui.DropDownList(zone, {
                dataValueField: "zone",
                dataTextField: "territory",
                dataSource: that._zonesQuery.data,
                cascadeFrom: that._zoneTitleId,
                dataBound: function() {
                    that._value = this.value();
                    this.wrapper.toggle(this.dataSource.view().length > 1);
                }
            });

            that._zone.wrapper.hide();
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            kendo.destroy(this.wrapper);
        },

        value: function(value) {
            var that = this,
                zone;

            if (value === undefined$1) {
                return that._value;
            }

            zone = that._zonesQuery.filter({ field: "zone", operator: "eq", value: value }).data[0];

            if (zone) {
                that._zoneTitle.value(zone.other_zone);
                that._zone.value(zone.zone);
            } else {
                that._zoneTitle.select(0);
            }

        }
    });

    ui.plugin(TimezoneEditor);

    var ZONETITLEOPTIONTEMPLATE = kendo.template(({ name, other_zone }) => `<option value="${other_zone}">${name}</option>`);
    var ZONEOPTIONTEMPLATE = kendo.template(({ zone, territory }) => `<option value="${zone}">${territory}</option>`);

    var MobileTimezoneEditor = Widget.extend({
        init: function(element, options) {
            var that = this,
                zones = kendo.timezone.windows_zones;

            if (!zones || !kendo.timezone.zones_titles) {
                throw new Error('kendo.timezones.min.js is not included.');
            }

            Widget.fn.init.call(that, element, options);

            that.wrapper = that.element;

            that._zonesQuery = new kendo.data.Query(zones);
            that._zoneTitlePicker();
            that._zonePicker();

            that.value(that.options.value);
        },

        options: {
            name: "MobileTimezoneEditor",
            optionLabel: "No timezone",
            value: ""
        },

        events: [ CHANGE ],

        _bindZones: function(value) {
            var data = value ? this._filter(value) : [];

            this._zone.html(this._options(data, ZONEOPTIONTEMPLATE));
        },

        _filter: function(value) {
            return this._zonesQuery.filter({ field: "other_zone", operator: "eq", value: value }).data;
        },

        _options: function(data, template, optionLabel) {
            var idx = 0;
            var html = "";
            var length = data.length;

            if (optionLabel) {
                html += template({ other_zone: "", name: optionLabel });
            }

            for (; idx < length; idx++) {
                html += template(data[idx]);
            }

            return html;
        },

        _zoneTitlePicker: function() {
            var that = this;
            var options = that._options(kendo.timezone.zones_titles, ZONETITLEOPTIONTEMPLATE, that.options.optionLabel);

            that._zoneTitle = $('<select>' + options + '</select>')
                                .appendTo(that.wrapper)
                                .on("change", function() {
                                    var value = this.value;
                                    var zone = that._zonePickerLabel;
                                    var zoneSelect = zone.find("select");

                                    that._bindZones(value);

                                    if (value && zoneSelect.children().length > 1) {
                                        zone.show();
                                    } else {
                                        zone.hide();
                                    }

                                    that._value = that._zone[0].value;

                                    that.trigger(CHANGE);
                                });
        },

        _zonePicker: function() {
            var that = this;

            that._zonePickerLabel = $("<li class='k-item k-listgroup-item k-zonepicker'>" +
                                        "<label class='k-label k-listgroup-form-row'>" +
                                            "<span class='k-item-title k-listgroup-form-field-label'></span>" +
                                            "<div class='k-listgroup-form-field-wrapper'></div>" +
                                        "</label>" +
                                    "</li>").hide();

            that._zone = $('<select></select>')
                            .appendTo(that._zonePickerLabel.find("div"))
                            .on("change", function() {
                                that._value = this.value;

                                that.trigger(CHANGE);
                            });

            this.wrapper.closest(".k-item").after(that._zonePickerLabel);

            that._bindZones(that._zoneTitle.val());
            that._value = that._zone[0].value;
        },

        destroy: function() {
            Widget.fn.destroy.call(this);

            kendo.destroy(this.wrapper);
        },

        value: function(value) {
            var that = this;
            var zonePicker = that._zone;
            var other_zone = "";
            var zone_value = "";
            var zone;

            if (value === undefined$1) {
                return that._value;
            }

            zone = that._zonesQuery.filter({ field: "zone", operator: "eq", value: value }).data[0];

            if (zone) {
                zone_value = zone.zone;
                other_zone = zone.other_zone;
            }

            that._zoneTitle.val(other_zone);
            that._bindZones(other_zone);

            zonePicker.val(zone_value);
            zone_value = zonePicker[0].value;

            if (zone_value && zonePicker.children.length > 1) {
                that._zonePickerLabel.show();
            } else {
                that._zonePickerLabel.hide();
            }

            that._value = zone_value;
        }
    });

    ui.plugin(MobileTimezoneEditor);

})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
