require('./kendo.mobile.scroller.js');
require('./kendo.toolbar.js');
require('./kendo.combobox.js');
require('./kendo.textbox.js');
require('./kendo.core.js');
require('./kendo.drawing.js');
require('./kendo.upload.js');
require('./kendo.dialog.js');
require('./kendo.window.js');
require('./kendo.binder.js');
require('./kendo.numerictextbox.js');
require('./kendo.dropdownlist.js');
require('./kendo.icons.js');
require('./kendo.draganddrop.js');

var proxy = function (a, b) { return function (e) { return b(a(e)); }; };

var bind = function (el, event, callback) { return el.addEventListener && el.addEventListener(event, callback); };

var unbind = function (el, event, callback) { return el && el.removeEventListener && el.removeEventListener(event, callback); };

var noop = function () { /* empty */ };

var preventDefault = function (e) { return e.preventDefault(); };

var touchRegExp = /touch/;

// 300ms is the usual mouse interval;
// // However, an underpowered mobile device under a heavy load may queue mouse events for a longer period.
var IGNORE_MOUSE_TIMEOUT = 2000;

function normalizeEvent(e) {
    if (e.type.match(touchRegExp)) {
        return {
            pageX: e.changedTouches[0].pageX,
            pageY: e.changedTouches[0].pageY,
            clientX: e.changedTouches[0].clientX,
            clientY: e.changedTouches[0].clientY,
            type: e.type,
            originalEvent: e,
            isTouch: true
        };
    }

    return {
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        type: e.type,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        originalEvent: e
    };
}

var Draggable = function Draggable(ref) {
    var this$1$1 = this;
    var press = ref.press; if ( press === void 0 ) press = noop;
    var drag = ref.drag; if ( drag === void 0 ) drag = noop;
    var release = ref.release; if ( release === void 0 ) release = noop;
    var mouseOnly = ref.mouseOnly; if ( mouseOnly === void 0 ) mouseOnly = false;

    this._pressHandler = proxy(normalizeEvent, press);
    this._dragHandler = proxy(normalizeEvent, drag);
    this._releaseHandler = proxy(normalizeEvent, release);
    this._ignoreMouse = false;
    this._mouseOnly = mouseOnly;

    this._touchstart = function (e) {
        if (e.touches.length === 1) {
            this$1$1._pressHandler(e);
        }
    };

    this._touchmove = function (e) {
        if (e.touches.length === 1) {
            this$1$1._dragHandler(e);
        }
    };

    this._touchend = function (e) {
        // the last finger has been lifted, and the user is not doing gesture.
        // there might be a better way to handle this.
        if (e.touches.length === 0 && e.changedTouches.length === 1) {
            this$1$1._releaseHandler(e);
            this$1$1._ignoreMouse = true;
            setTimeout(this$1$1._restoreMouse, IGNORE_MOUSE_TIMEOUT);
        }
    };

    this._restoreMouse = function () {
        this$1$1._ignoreMouse = false;
    };

    this._mousedown = function (e) {
        var which = e.which;

        if ((which && which > 1) || this$1$1._ignoreMouse) {
            return;
        }

        bind(this$1$1.document, "mousemove", this$1$1._mousemove);
        bind(this$1$1.document, "mouseup", this$1$1._mouseup);
        this$1$1._pressHandler(e);
    };

    this._mousemove = function (e) {
        this$1$1._dragHandler(e);
    };

    this._mouseup = function (e) {
        unbind(this$1$1.document, "mousemove", this$1$1._mousemove);
        unbind(this$1$1.document, "mouseup", this$1$1._mouseup);
        this$1$1._releaseHandler(e);
    };

    this._pointerdown = function (e) {
        if (e.isPrimary && e.button === 0) {
            bind(this$1$1.document, "pointermove", this$1$1._pointermove);
            bind(this$1$1.document, "pointerup", this$1$1._pointerup);
            bind(this$1$1.document, "pointercancel", this$1$1._pointerup);
            bind(this$1$1.document, "contextmenu", preventDefault);

            this$1$1._pressHandler(e);
        }
    };

    this._pointermove = function (e) {
        if (e.isPrimary) {
            this$1$1._dragHandler(e);
        }
    };

    this._pointerup = function (e) {
        if (e.isPrimary) {
            unbind(this$1$1.document, "pointermove", this$1$1._pointermove);
            unbind(this$1$1.document, "pointerup", this$1$1._pointerup);
            unbind(this$1$1.document, "pointercancel", this$1$1._pointerup);
            unbind(this$1$1.document, "contextmenu", preventDefault);

            this$1$1._releaseHandler(e);
        }
    };
};

var prototypeAccessors = { document: { configurable: true } };

Draggable.supportPointerEvent = function supportPointerEvent () {
    return (typeof window !== 'undefined') && window.PointerEvent;
};

prototypeAccessors.document.get = function () {
    return this._element
    ? this._element.ownerDocument
    : document;
};

Draggable.prototype.bindTo = function bindTo (element) {
    if (element === this._element) {
        return;
    }

    if (this._element) {
        this._unbindFromCurrent();
    }

    this._element = element;
    this._bindToCurrent();
};

Draggable.prototype._bindToCurrent = function _bindToCurrent () {
    var element = this._element;

    if (this._usePointers()) {
        bind(element, "pointerdown", this._pointerdown);
        return;
    }

    bind(element, "mousedown", this._mousedown);

    if (!this._mouseOnly) {
        bind(element, "touchstart", this._touchstart);
        bind(element, "touchmove", this._touchmove);
        bind(element, "touchend", this._touchend);
    }
};

Draggable.prototype._unbindFromCurrent = function _unbindFromCurrent () {
    var element = this._element;

    if (this._usePointers()) {
        unbind(element, "pointerdown", this._pointerdown);
        unbind(this.document, "pointermove", this._pointermove);
        unbind(this.document, "pointerup", this._pointerup);
        unbind(this.document, "contextmenu", preventDefault);
        unbind(this.document, "pointercancel", this._pointerup);
        return;
    }

    unbind(element, "mousedown", this._mousedown);

    if (!this._mouseOnly) {
        unbind(element, "touchstart", this._touchstart);
        unbind(element, "touchmove", this._touchmove);
        unbind(element, "touchend", this._touchend);
    }
};

Draggable.prototype._usePointers = function _usePointers () {
    return !this._mouseOnly && Draggable.supportPointerEvent();
};

Draggable.prototype.update = function update (ref) {
        var press = ref.press; if ( press === void 0 ) press = noop;
        var drag = ref.drag; if ( drag === void 0 ) drag = noop;
        var release = ref.release; if ( release === void 0 ) release = noop;
        var mouseOnly = ref.mouseOnly; if ( mouseOnly === void 0 ) mouseOnly = false;

    this._pressHandler = proxy(normalizeEvent, press);
    this._dragHandler = proxy(normalizeEvent, drag);
    this._releaseHandler = proxy(normalizeEvent, release);
    this._mouseOnly = mouseOnly;
};

Draggable.prototype.destroy = function destroy () {
    this._unbindFromCurrent();
    this._element = null;
};

Object.defineProperties( Draggable.prototype, prototypeAccessors );

// Re-export as "default" field to address a bug
// where the ES Module is imported by CommonJS code.
//
// See https://github.com/telerik/kendo-angular/issues/1314
Draggable.default = Draggable;

var __meta__$3 = {
    id: "pdfviewercommon",
    name: "PdfViewerCommon",
    category: "web",
    description: "This is the common package for PdfViewer across all kendo flavours",
    depends: ["core"]
};

(function($, undefined$1) {
    const throttle = function(func, wait, options = {}) {
        let timeout, context, args, result;
        let previous = 0;
        const later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = undefined$1;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        };
        const throttled = function() {
            const now = new Date().getTime();
            if (!previous && options.leading === false) {
                previous = now;
            }
            const remaining = wait - (now - previous);
            context = undefined$1; // this
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = undefined$1;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
            else if (!timeout && options.trailing !== false) {
                timeout = window.setTimeout(later, remaining);
            }
            return result;
        };
        return throttled;
    };
    const preventDefault = (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.originalEvent) {
            e.originalEvent.preventDefault();
        }
    };
    const matchesElementSelector = (element, selector) => {
        if (!element || !selector) {
            return false;
        }
        return element.closest(selector);
    };
    const FRAMES_PER_SECOND = 1000 / 60;
    const SCROLL = 'scroll';
    /**
     * @hidden
     */
    class Scroller {
        constructor(element, options) {
            this.options = {
                events: {
                    [SCROLL]: () => undefined$1
                },
                filter: '',
                // throttle the scroll events to get a more similar experience
                // to the scrolling behavior in Adobe Acrobat Reader
                // as well as allow a way to improve the scrolling performance for large files
                panScrollThrottleDelay: FRAMES_PER_SECOND,
                // the drag directions are actually reversed, e.g.
                // dragging to the right actually moves the document to the left
                scrollDirectionModifier: -1,
                scrollThrottleDelay: FRAMES_PER_SECOND
            };
            this.onElementScroll = () => {
                const element = this.element;
                if (this.state.trackNextElementScroll) {
                    this.scrollTo(element.scrollLeft, element.scrollTop);
                }
                else {
                    // reset the state, so that consecutive scroll events can be handled
                    this.state.trackNextElementScroll = true;
                }
            };
            this.onDragStart = (e) => {
                this.state.dragStarted = false;
                if (!this.shouldTrackPanEvents()) {
                    return;
                }
                const target = e.target || (e.originalEvent || {}).target;
                if (this.options.filter &&
                    !matchesElementSelector(target, this.options.filter)) {
                    return;
                }
                preventDefault(e);
                this.setState({
                    dragStarted: true,
                    location: {
                        pageX: e.pageX,
                        pageY: e.pageY
                    },
                    locationDelta: {
                        x: 0,
                        y: 0
                    }
                });
            };
            this.onDrag = (e) => {
                if (!this.shouldTrackPanEvents() || !this.state.dragStarted) {
                    return;
                }
                this.calculateEventLocationDelta(e);
                this.setState({
                    location: {
                        pageX: e.pageX,
                        pageY: e.pageY
                    }
                });
                const directionModifier = this.options.scrollDirectionModifier;
                const scrollLeft = this.element.scrollLeft +
                    directionModifier * this.state.locationDelta.x;
                const scrollTop = this.element.scrollTop +
                    directionModifier * this.state.locationDelta.y;
                this.scrollTo(scrollLeft, scrollTop);
            };
            this.onDragEnd = () => {
                if (!this.shouldTrackPanEvents()) {
                    return;
                }
            };
            this.element = element;
            this.options = Object.assign({}, this.options, options);
            this.resetState();
            this.bindEvents();
        }
        destroy() {
            this.unbindEvents();
        }
        initDraggable() {
            this.destroyDraggable();
            if (this.options.panScrollThrottleDelay > 0) {
                this.throttledOnDrag = throttle(this.onDrag, this.options.panScrollThrottleDelay);
            }
            else {
                this.throttledOnDrag = this.onDrag;
            }
            this.draggable = new Draggable({
                mouseOnly: false,
                press: this.onDragStart,
                drag: this.throttledOnDrag,
                release: this.onDragEnd
            });
            this.draggable.bindTo(this.element);
        }
        destroyDraggable() {
            if (this.draggable && this.draggable.destroy) {
                this.draggable.destroy();
                if (this.throttledOnDrag && this.throttledOnDrag.cancel) {
                    this.throttledOnDrag.cancel();
                    this.throttledOnDrag = null;
                }
            }
        }
        bindEvents() {
            this.bindDraggableEvents();
            this.bindElementScroll();
        }
        bindDraggableEvents() {
            this.initDraggable();
        }
        bindElementScroll() {
            if (this.options.scrollThrottleDelay > 0) {
                this.throttledOnElementScroll = throttle(this.onElementScroll, this.options.scrollThrottleDelay);
            }
            else {
                this.throttledOnElementScroll = this.onElementScroll;
            }
            this.element.addEventListener(SCROLL, this.throttledOnElementScroll);
        }
        unbindEvents() {
            this.unbindElementScroll();
            this.unbindDraggableEvents();
        }
        unbindDraggableEvents() {
            this.destroyDraggable();
        }
        unbindElementScroll() {
            if (this.throttledOnElementScroll &&
                this.throttledOnElementScroll.cancel) {
                this.throttledOnElementScroll.cancel();
                this.throttledOnElementScroll = null;
            }
            this.element.removeEventListener(SCROLL, this.throttledOnElementScroll);
        }
        setState(newState) {
            this.state = Object.assign({}, this.state || {}, newState);
        }
        resetState() {
            this.setState({
                trackPanEvents: false,
                trackNextElementScroll: false,
                location: { pageX: 0, pageY: 0 },
                locationDelta: { x: 0, y: 0 }
            });
        }
        enablePanEventsTracking() {
            this.state.trackPanEvents = true;
            this.bindDraggableEvents();
        }
        disablePanEventsTracking() {
            this.unbindDraggableEvents();
            this.state.trackPanEvents = false;
        }
        shouldTrackPanEvents() {
            return this.state.trackPanEvents;
        }
        calculateEventLocationDelta(e) {
            this.state.locationDelta = {
                x: e.pageX - this.state.location.pageX,
                y: e.pageY - this.state.location.pageY
            };
        }
        scrollTo(x, y, options = { trackScrollEvent: true }) {
            if (!options.trackScrollEvent) {
                this.state.trackNextElementScroll = false;
            }
            this.element.scrollLeft = x;
            this.element.scrollTop = y;
        }
    }

    /**
     * A function which gives you the page number of the document according to the scroll position.
     *
     * @param rootElement The root HTML element of the PDFViewer component.
     * @returns The page number.
     */
    const currentPage = (rootElement) => {
        const scrollElement = rootElement.querySelector(
            '.k-pdf-viewer-canvas'
        );
        const page = rootElement.querySelector('.k-page');

        return scrollElement && page
            ? Math.floor(
                Math.round(scrollElement.scrollTop) /
                (page.offsetHeight + page.offsetTop) +
                0.01
            )
            : 0;
    };

    const scrollToPage = (
        rootElement,
        pageNumber
    ) => {
        const pages = rootElement.querySelectorAll('.k-page');
        const page = pages[0];
        if (page instanceof HTMLDivElement) {
            const top =
                (page.offsetHeight + page.offsetTop) *
                Math.max(0, Math.min(pageNumber, pages.length - 1));
            const scrollElement = page.closest('.k-pdf-viewer-canvas');
            if (scrollElement) {
                scrollElement.scrollTo({ top, behavior: 'auto' });
            }
        }
    };

    const searchMatchScrollLeftOffset = 0;
    const searchMatchScrollTopOffset = -64;

    const scrollToSearchMatch = (matchElement, scroller) => {
        if (!matchElement) {
            return;
        }

        const closestCharElement = matchElement.closest('.k-text-char');
        const closestTextElement = closestCharElement
            ? closestCharElement.closest('span[role="presentation"]')
            : null;

        if (!closestTextElement) {
            return;
        }

        const closestPageElement =
            closestTextElement.closest('.k-page');

        if (!closestPageElement) {
            return;
        }

        const scrollLeft =
            closestPageElement.offsetLeft +
            -1 * scroller.element.offsetLeft +
            closestTextElement.offsetLeft +
            searchMatchScrollLeftOffset;

        const scrollTop =
            closestPageElement.offsetTop +
            -1 * scroller.element.offsetTop +
            closestTextElement.offsetTop +
            searchMatchScrollTopOffset;

        scroller.scrollTo(scrollLeft, scrollTop, { trackScrollEvent: false });
    };

    kendo.ui.PdfViewerCommon = { Scroller, currentPage, scrollToPage, scrollToSearchMatch };
})(window.kendo.jQuery);

(function($, undefined$1) {
    var extend = $.extend;
    var isLoaded = function() {
        if (!window.pdfjsLib)
        {
            var console = window.console;

            if (console && console.error) {
                console.error("PDF.JS required.");
            }

            return false;
        }

        kendo.pdfviewer.pdfjs.lib = window.pdfjsLib;

        return true;
    };

    extend(kendo, {
        pdfviewer: {
            pdfjs: {
                lib: window.pdfjsLib,
                isLoaded: isLoaded
            }
        }
    });
})(window.kendo.jQuery);

var __meta__$2 = {
    id: "pdfjs-processor",
    name: "PDFJS-Processor",
    category: "framework",
    depends: [ "core" ]
};

(function($, undefined$1) {
    var kendo = window.kendo,
        Class = kendo.Class,
        extend = $.extend,
        atob = window.atob,
        PDFJS;

    var PDFJSProcessor = Class.extend({
        init: function(options, viewer) {
            var that = this;

            if (kendo.pdfviewer.pdfjs.isLoaded()) {
                PDFJS = kendo.pdfviewer.pdfjs.lib;
            }

            that.file = options.file;
            that.viewer = viewer;
        },
        fetchDocument: function() {
            var that = this,
                deferred = $.Deferred(),
                messages = that.viewer.options.messages.errorMessages;

            if (!that.file) {
                return deferred.resolve();
            }

            if (that._isBase64Data() && atob)
            {
                that.file.data = atob(that.file.data);
            }

            PDFJS.getDocument(this.file).promise.then(function(pdf) {
                var pageSizes = [];
                that.pdf = pdf;
                that.pagePromises = [];
                that._downloadData = $.Deferred();

                pdf.getData().then(function(data) {
                    var blob = new Blob([data], { type: 'application/pdf' });
                    that._downloadData.resolve({
                        file: blob
                    });
                });

                for (var i = 1; i <= pdf.numPages; i++) {
                    that.pagePromises.push(pdf.getPage(i));
                }

                Promise.all(that.pagePromises).then(function(pagePromises) {
                    pageSizes = pagePromises.map(function(pagePromise) {
                        var viewport = pagePromise.getViewport({ scale: 4 / 3 });
                        return {
                            width: viewport.width,
                            height: viewport.height
                        };
                    });

                    deferred.resolve({
                        total: pdf.numPages,
                        pages: pageSizes
                    });
                }).catch(function(e) {
                    that.viewer._triggerError({
                        error: e.message,
                        message: messages.parseError
                    });
                });

            }).catch(function(e) {
                var notFoundError = e.name.includes("Missing");
                var alertMessage = notFoundError ? messages.notFound : messages.parseError;
                that.viewer._triggerError({
                    error: e.message,
                    message: alertMessage
                });
                if (notFoundError) {
                    that.viewer._renderBlankPage();
                }
            });

            return deferred;
        },
        fetchPageData: function(number) {
            return this.pagePromises[number - 1];
        },
        downloadFile: function(fileName) {
            var that = this;
            kendo.ui.progress(that.viewer.pageContainer, true);

            that._downloadData.done(function(result) {
                kendo.ui.progress(that.viewer.pageContainer, false);

                var reader = new FileReader();
                reader.readAsDataURL(result.file);

                reader.onload = function() {
                    kendo.saveAs({
                        dataURI: reader.result,
                        fileName: fileName + ".pdf",
                        proxyURL: function() {
                            return reader.result;
                        }
                    });
                };
            });
        },
        navigateToDestination: function(dest) {
            var that = this;
            var dest = dest.split("#")[1];

            try {
                dest = JSON.parse(decodeURI(dest));
            } catch (error) {
                dest = decodeURI(dest);
            }

            if (kendo.isString(dest)) {
                that.pdf.getDestination(dest).then(function(explicitDest) {
                    that._navigateToDest(explicitDest);
                });
            } else if (dest) {
                that._navigateToDest(dest);
            }
        },
        _navigateToDest: function(explicitDest) {
            var that = this,
                pageNumber = explicitDest[0],
                zoom = explicitDest[4] || that.viewer.options.zoom;

            that.pdf.getPageIndex(pageNumber)
                .then(pageIndex => {
                    that.viewer.activatePage(pageIndex + 1);
                    that.viewer.zoom(`${zoom * 100}%`);
                });
        },
        _updateDocument: function(file) {
            if (this.pdf && this.pdf.loadingTask) {
                this.pdf.loadingTask.destroy();
            }

            this.file = file;
        },
        _isBase64Data: function() {
            var data = this.file.data,
                notBase64 = /[^A-Z0-9+\/=]/i,
                length = data && data.length,
                equalSign;

            if (!length || length % 4 !== 0 || notBase64.test(data)) {
                return false;
            }

            equalSign = data.indexOf('=');

            return equalSign === -1 ||
                equalSign === length - 1 ||
                (equalSign === length - 2 && data[length - 1] === '=');
        },
        renderTextLayer: function(params) {
            PDFJS.renderTextLayer(params);
        }
    });

    extend(kendo.pdfviewer.pdfjs, {
        processor: PDFJSProcessor
    });
})(window.kendo.jQuery);

var __meta__$1 = {
    id: "dpl-processor",
    name: "DPL-Processor",
    category: "framework",
    depends: [ "core" ]
};

(function($, undefined$1) {
    var kendo = window.kendo,
        extend = $.extend,
        Class = kendo.Class;

    var DPLProcessor = Class.extend({
        init: function(options, viewer) {
            var that = this;

            that.options = options;
            that.read = options.read;
            that.upload = options.upload;
            that.download = options.download;

            that.viewer = viewer;
        },
        fetchDocument: function() {
            var that = this,
                deferred = $.Deferred(),
                errorMessages = that.viewer.options.messages.errorMessages;

            if (!that.read) {
                return deferred.resolve();
            }

            $.ajax({
                type: that.read.type,
                url: that.read.url,
                dataType: that.read.dataType,
                success: function(data) {
                    if (typeof data != "string") {
                        data = kendo.stringify(data);
                    }
                    deferred.resolve(JSON.parse(data));
                },
                error: function(xhr) {
                    that.viewer._triggerError({
                        error: xhr.responseText,
                        message: errorMessages.parseError
                    });
                }
            });

            return deferred;
        },
        fetchPageData: function(number) {
            var that = this;
            var deferred = $.Deferred();
            var page = that.viewer.document.pages[number - 1];
            var data = {};
            data[that.read.pageField] = number;

            if (!page.geometries.length) {
                $.ajax({
                    type: that.read.type,
                    url: that.read.url,
                    data: data,
                    success: function(data) {
                        deferred.resolve(JSON.parse(data));
                    },
                    error: function(xhr) {
                        that.viewer._triggerError({
                            error: xhr.responseText,
                            message: that.viewer.options.messages.errorMessages.parseError
                        });
                    }
                });
            } else {
                deferred.resolve(page);
            }

            return deferred;
        },
        downloadFile: function(fileName) {
            window.location = this.download.url + "?file=" + fileName;
        },

        fromJSON: function(json)
        {
            var viewer = this.viewer;
            viewer._clearPages();

            viewer.document = json;
            viewer.document.total = viewer.document.pages.length;

            viewer._renderPages();
            viewer.resize(true);

            viewer.activatePage(1);
        }
    });

    extend(kendo.pdfviewer, {
        dpl: {
            processor: DPLProcessor
        }
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var Class = kendo.Class,
        extend = $.extend,
        parseJSON = JSON.parse,
        progress = kendo.ui.progress,
        Class = kendo.Class,
        OPEN = "open";

    var UploadHelper = Class.extend({
        init: function(viewer) {
            this.viewer = viewer;
            this.errorMessages = this.viewer.options.messages.errorMessages;
            this.upload = this.viewer.processor.upload;
        },
        _initUpload: function(uploadElement, extendUploadOptions) {
            var uploadOptions = extend({
                select: this._onSelect.bind(this),
                success: this._onSuccess.bind(this),
                error: this._onError.bind(this),
                complete: this._onComplete.bind(this),
                showFileList: false,
                multiple: false,
                validation: {
                    allowedExtensions: [".pdf"]
                }
            }, extendUploadOptions || {});

            if (this.upload) {
                extend(uploadOptions, {
                    async: {
                        saveUrl: this.upload.url,
                        autoUpload: true,
                        saveField: this.upload.saveField
                    }
                });
            }

            var upload = (uploadElement || $('<input name="files" accept=".pdf" type="file" />')).kendoUpload(uploadOptions).getKendoUpload();

            return upload;
        },
        _onComplete: function() {
            progress(this.viewer.pageContainer, false);
        },
        _onSuccess: function(e) {
            var json = parseJSON(e.response);

            if ($.isPlainObject(json)) {
                this.viewer.processor.fromJSON(json);
            }
            else {
                this.viewer._triggerError({
                    error: json,
                    message: this.errorMessages.parseError
                });
            }
        },
        _onError: function(e) {
            this.viewer._triggerError({
                error: e.XMLHttpRequest.responseText,
                message: this.errorMessages.notSupported
            });
        },
        _onSelect: function(e) {
            var that = this;
            var fileToUpload = e.files[0];

            progress(that.viewer.pageContainer, true);

            if (that.viewer.trigger(OPEN, { file: fileToUpload }) || that.upload) {
                return;
            } else if (fileToUpload.extension.toLowerCase() !== ".pdf") {
                that.viewer._triggerError({
                    error: fileToUpload,
                    message: that.errorMessages.notSupported
                });
                return;
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                var document = e.target.result;
                that.viewer.fromFile(document);
            };
            reader.onerror = function() {
                that.viewer._triggerError({
                    error: fileToUpload,
                    message: that.errorMessages.parseError
                });
            };

            reader.readAsArrayBuffer(fileToUpload.rawFile);
        }
    });

    extend(kendo.pdfviewer, {
        UploadHelper: UploadHelper
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var extend = $.extend,
        noop = $.noop,
        drawing = kendo.drawing,
        Group = drawing.Group,
        Surface = drawing.Surface,
        RENDER = "render",
        Class = kendo.Class,
        UploadHelper = kendo.pdfviewer.UploadHelper,

        DEFAULT_DPR = 2;

    var geometryTypes = {
        Path: "path",
        MultiPath: "multipath",
        Rect: "rect",
        Image: "image",
        Text: "text"
    };

    var BLANK_PAGE_TEMPLATE = (dropzoneId) => `<div class="k-page k-blank-page">
        <div id="${dropzoneId}" class="k-external-dropzone">
            <div class="k-dropzone-inner">
                <span class="k-dropzone-icon k-svg-icon k-icon-xxxl k-svg-i-upload">
                    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M32 384v96h448v-96H32zm192-64h64V192h96L256 32 128 192h96v128z"></path>
                    </svg>
                </span>
                <span class="k-dropzone-hint">Drag and drop files here to upload</span>
            </div>
        </div>
        <input name="files" accept=".pdf" type="file" ref-pdfviewer-blank-page-upload>
    </div>`;

    var Page = Class.extend({
        init: function(options, viewer) {
            this.viewer = viewer;
            this.processor = options.processor;
            this.options = options;
            this.pageNumber = options.number;

            this.element = $("<div class='k-page' />");
            this.element.attr(kendo.attr("number"), this.pageNumber);

            this._updatePageSize(options);
            this.width = options.width;
            this.height = options.height;
        },
        resize: function(ratio) {
            var pageElement = this.element;

            this._updatePageSize({
                width: Math.min(pageElement.width() * ratio, this.width),
                height: Math.min(pageElement.height() * ratio, this.height)
            });
        },
        _updatePageSize: function(size) {
            this.element
                    .width(size.width)
                    .height(size.height);
        },
        destroy: function() {
            kendo.destroy(this.element);
        },
        render: noop
    });

    var BlankPage = Page.extend({
        init: function(options, viewer) {
            this.viewer = viewer;
            this.options = options;
            this._externalDropZoneId = `${viewer.element.attr("id")}-external-dropzone`;
            this.element = $(BLANK_PAGE_TEMPLATE(this._externalDropZoneId));
            this._uploadHelper = new UploadHelper(viewer);
        },
        _initUpload: function() {
            this._upload = this._uploadHelper._initUpload(this.element.find("input[ref-pdfviewer-blank-page-upload]"), {
                dropZone: `#${this._externalDropZoneId}`,
                showFileList: false,
                async: {
                    autoUpload: false,
                    saveUrl: "save"
                }
            });
        },
        resize: noop,
        _updatePageSize: noop,
        destroy: function() {
            if (this._upload) {
                this._upload.destroy();
            }

            kendo.destroy(this.element);
        },
        render: noop
    });

    var DPLPage = Page.extend({
        draw: function() {
            var that = this,
                geometries = that.options.geometries;

            that.group = new Group();
            that.surface.draw(that.group);

            that._drawGeometries(geometries);

            that.viewer.trigger(RENDER, { page: this });
            kendo.ui.progress(that.element, false);
        },
        load: function() {
            var that = this;

            if (that.loaded || !that.processor)
            {
                return;
            }

            that.processor.fetchPageData(that.pageNumber).then(function(data) {
                that.options = data;
                that._initSurface();
                that.draw();
            });

            that.loaded = true;
        },
        _initSurface: function() {
            var size = {
                width: this.element.width(),
                height: this.element.height()
            };
            var surfaceOptions = extend({ width: this.width, height: this.height }, this.viewer.options.view);
            this.surface = new Surface(this.element, surfaceOptions);
            this._updatePageSize(size);
        },
        _drawGeometries: function(geometries) {
            var that = this,
                kGeometry;

            if (!geometries) {
                return;
            }

            for (var i = 0; i <= geometries.length; i++) {
                var geometry = geometries[i];

                if (!geometry) {
                    continue;
                }

                switch (geometry.type) {
                    case geometryTypes.Path:
                    case geometryTypes.MultiPath:
                        kGeometry = that._drawPath(geometry);
                        break;
                    case geometryTypes.Rect:
                        kGeometry = that._drawRect(geometry);
                        break;
                    case geometryTypes.Image:
                        kGeometry = that._drawImage(geometry);
                        break;
                    case geometryTypes.Text:
                        kGeometry = that._drawText(geometry);
                        break;
                    default:
                        kGeometry = null;
                        break;
                }

                if (kGeometry)
                {
                    that.group.append(kGeometry);
                }
            }
        },
        _drawRect: function(geometry)
        {
            var rectGeo = new kendo.geometry.Rect(geometry.point, geometry.size);

            return new drawing.Rect(rectGeo, {
                transform: this._getMatrix(geometry.transform),
                fill: geometry.fillOptions,
                stroke: geometry.strokeOptions
            });
        },

        _drawImage: function(geometry)
        {
            var imageRect = new kendo.geometry.Rect(geometry.point, geometry.size);
            return new drawing.Image(geometry.src, imageRect, {
                transform: this._getMatrix(geometry.transform)
            });
        },

        _drawText: function(geometry)
        {
            var options = {
                transform: this._getMatrix(geometry.transform),
                stroke: geometry.strokeOptions,
                fill: geometry.fillOptions,
                font: geometry.font
            };
            return new kendo.drawing.Text(geometry.content, geometry.point, options);
        },

        _drawPath: function(geometry)
        {
            var options = {
                transform: this._getMatrix(geometry.transform),
                stroke: geometry.strokeOptions,
                fill: geometry.fillOptions
            };
            var path = new drawing.MultiPath(options);

            for (var i = 0; i < geometry.paths.length; i++) {
                var subPath = geometry.paths[i];

                if (!subPath.segments)
                {
                    return;
                }

                path.moveTo.apply(path, subPath.point);

                for (var j = 0; j < subPath.segments.length; j++) {
                    var segment = subPath.segments[j];
                    var drawAction = segment.points.length === 1 ? path.lineTo : path.curveTo;
                    drawAction.apply(path, segment.points);
                }

                if (subPath.closed) {
                    path.close();
                }
            }

            return path;
        },

        _getMatrix: function(transform) {
            var matrix = Object.create(kendo.geometry.Matrix.prototype);
            kendo.geometry.Matrix.apply(matrix, transform);
            return matrix;
        }
    });

    var PDFJSPage = Page.extend({
        init: function(options, viewer) {
            var that = this,
                canvas;

            canvas = $("<canvas />").css({
                width: "100%",
                height: "100%"
            });
            that.canvas = canvas.get(0);

            Page.fn.init.call(that, options, viewer);
            that.canvas.width = that.width;
            that.canvas.height = that.height;

            that.element.append(canvas);
        },
        load: function(defaultScale, force) {
            var that = this,
                promise = $.Deferred();

            if (that._scale === defaultScale && !force)
            {
                return;
            } else if (that._scale && that._scale !== defaultScale && !force)
            {
                that._scale = defaultScale;
                that.render(defaultScale);
                return promise.resolve(that);
            }

            if (that.processor) {
                that.processor.fetchPageData(that.pageNumber).then(function(page) {
                    that._page = page;
                    that._renderPromise = that.render(defaultScale).then(function() {
                        that.viewer.trigger(RENDER, { page: that });
                    });
                    promise.resolve(that);
                });
            }

            that._scale = defaultScale;
            that.loaded = true;
            return promise;
        },
        render: function(scale) {
            var that = this;
            var dpr = window.devicePixelRatio >= DEFAULT_DPR ? window.devicePixelRatio : DEFAULT_DPR;
            var context = this.canvas.getContext('2d'),
                viewport = this._page.getViewport({
                    scale: scale
                });

            this.canvas.width = viewport.width * dpr;
            this.canvas.height = viewport.height * dpr;
            context.scale(dpr, dpr);

            this._scale = scale;
            this._dpr = dpr;

            if (this._renderTask)
            {
                this._renderTask.cancel();
                this._renderTask = null;
            }

            this._updatePageSize({
                width: viewport.width,
                height: viewport.height
            });

            this._renderTask = this._page.render({
                canvasContext: context,
                viewport: viewport
            });

            this._renderTextLayer(viewport);

            return this._renderTask.promise.then(function() {
                that._renderTask = null;
            }).catch(function() {});
        },
        _renderTextLayer: function(viewport) {
            var that = this;
            var page = that._page;

            if (that.textLayer) {
                that.textLayer.remove();
            }

            that.textLayer = $("<div class='k-text-layer'></div>").get(0);
            that.element.append(that.textLayer);

            page.getTextContent({
                normalizeWhitespace: true
            }).then(function(textContent) {
                $(that.textLayer).css({
                  height: viewport.height,
                  width: viewport.width
                }).html(""); // Clear content to make sure that refreshing the page will not cause duplication of the text content.

                var params = {
                    textContent: textContent,
                    container: that.textLayer,
                    viewport: viewport,
                    textDivs: [],
                    enhanceTextSelection: true
                };


                that.processor.renderTextLayer(params);
                that._renderAnnotationLayer(viewport);
            });
        },
        _renderAnnotationLayer: function(viewport) {
            var that = this,
                page = that._page;

            if (that.annotationLayer) {
                that.annotationLayer.remove();
            }

            that.annotationLayer = $("<div class='k-annotation-layer'></div>").css({
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'hidden',
                height: that.element.height(),
                width: that.element.width(),
                pointerEvents: 'none',
            });

            that.element.append(that.annotationLayer);

            page.getAnnotations({ intent: "display" }).then(function(annotations) {
                var links = annotations.map(function(annotation) {
                    if (annotation.subtype === 'Link') {
                        var rect = annotation.rect;
                        var boundingRect = [
                            viewport.convertToViewportPoint(rect[0], rect[1]),
                            viewport.convertToViewportPoint(rect[2], rect[3]),
                        ];

                        var left = Math.min(boundingRect[0][0], boundingRect[1][0]);
                        var top = Math.min(boundingRect[0][1], boundingRect[1][1]);
                        var width = Math.max(boundingRect[0][0], boundingRect[1][0]) - left;
                        var height = Math.max(boundingRect[0][1], boundingRect[1][1]) - top;

                        var url = annotation.url || (annotation.dest && `#${ kendo.isString(annotation.dest) ? encodeURI(annotation.dest) : encodeURI(JSON.stringify(annotation.dest)) }`);

                        return { url: url, rect: { left, top, width, height } };
                    }
                });

                links.forEach(function(link) {
                    var span = $("<span></span>").css({
                        position: 'absolute',
                        left: link.rect.left,
                        top: link.rect.top,
                    }).append($(`<a ${link.url ? `href=${link.url}` : ''}></a>`).css({
                        width: link.rect.width,
                        height: link.rect.height,
                        display: 'inline-block',
                        pointerEvents: 'auto',
                    }));

                    that.annotationLayer.append(span);
                });
            });
        },
    });

    extend(kendo.pdfviewer.dpl, {
        geometryTypes: geometryTypes,
        Page: DPLPage
    });
    extend(kendo.pdfviewer.pdfjs, {
        Page: PDFJSPage
    });
    extend(kendo.pdfviewer, {
        BlankPage: BlankPage
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var Class = kendo.Class,
        extend = $.extend,
        SEARCH_HIGHLIGHT_MARK_CLASS = "k-search-highlight-mark",
        isArray = Array.isArray;

    var SearchDOM = Class.extend({
        init: function(options) {
            var that = this;

            that.options = extend({}, that.options, options);

            that.processDom();
        },

        options: {
            highlightClass: "k-search-highlight",
            charClass: "k-text-char"
        },

        processDom: function() {
            var that = this;

            that.targets = isArray(that.options.target) ? that.options.target : [that.options.target];
            that.textNodes = [];
            that.charIndex = 0;
            that.text = "";

            that.targets.forEach(function(target) {
                that.traverseToTextNode(target);
            });

            for (var i = 0; i < that.textNodes.length; i++) {
                that.processTextNode(that.textNodes[i]);
            }
        },

        traverseToTextNode: function(node) {
            var that = this;

            if (node.nodeType === 3) {
                that.textNodes.push(node);
            } else {
                for (var i = 0; i < node.childNodes.length; i++) {
                    that.traverseToTextNode(node.childNodes[i]);
                }
            }
        },

        processTextNode: function(node) {
            var that = this;
            var text = node.textContent;
            var span;

            that.text = that.text + text;

            if (text.length > 0) {
                span = $(node).wrap("<span>").parent();
                span.parent().attr("role", "presentation");
                span.empty();
                that.splitChars(span.get(0), text);
                span.children().unwrap();
            }
        },

        splitChars: function(span, text) {
            var that = this;
            var newHtml = "";

            for (var i = 0; i < text.length; i++) {
                newHtml = newHtml + "<span class='" + that.options.charClass + "' " + kendo.attr("char-index") + "=" + that.charIndex + ">" + text[i] + "</span>";
                that.charIndex++;
            }

            span.innerHTML = newHtml;
        },

        search: function(value, matchCase) {
            var that = this;
            var expression = new RegExp(value, !matchCase ? "gi" : "g");
            var match;

            that.matches = [];

            that.resetMark();
            that.resetHighlight();
            that.resetMatchIndex();

            if (value === "") {
                return;
            }

            match = expression.exec(that.text);

            while (match) {
                that.matches.push({
                    startOffset: match.index,
                    endOffset: match.index + match[0].length
                });

                match = expression.exec(that.text);
            }

            that.highlightAll();
            that.mark();
        },

        highlightAll: function() {
            var that = this;

            that.matches.forEach(function(match, index) {
                var start = match.startOffset;
                var end = match.endOffset;

                that.highlight(start, end, index + 1);
            });
        },

        highlight: function(start, end, matchIndex) {
            var that = this;

            for (var i = start; i < end; i++) {
                $(that.targets)
                    .find("." + that.options.charClass + "[" + kendo.attr("char-index") + "=" + i + "]")
                    .addClass(that.options.highlightClass)
                    .attr(kendo.attr("match-index"), matchIndex);
            }
        },

        resetHighlight: function() {
            var that = this;

            $(that.targets)
                .find("." + that.options.highlightClass)
                .removeClass(that.options.highlightClass);
        },

        resetMatchIndex: function() {
            var that = this;

            $(that.targets)
                .find("." + that.options.charClass + "[" + kendo.attr("match-index") + "]")
                .removeAttr(kendo.attr("match-index"));
        },

        mark: function() {
            var that = this;

            if (!that.currentIndex && that.currentIndex !== 0) {
                that.currentIndex = 0;
            } else if (that.currentIndex > that.matches.length) {
                that.currentIndex = that.matches.length;
            } else {
                that.resetMark();
            }

            $(that.targets)
                .find("." + that.options.charClass + "[" + kendo.attr("match-index") + "=" + that.currentIndex + "]")
                .wrapInner(`<span class="${SEARCH_HIGHLIGHT_MARK_CLASS}">`);
        },

        resetMark: function() {
            var that = this;
            $(that.targets).find("." + SEARCH_HIGHLIGHT_MARK_CLASS).contents().unwrap();
        },

        nextMatch: function() {
            var that = this;

            that.currentIndex++;

            if (that.currentIndex > that.matches.length) {
                that.currentIndex = 1;
            }

            that.mark();
        },

        previousMatch: function() {
            var that = this;

            that.currentIndex--;

            if (that.currentIndex < 1) {
                that.currentIndex = that.matches.length;
            }

            that.mark();
        },

        getMarkedIndex: function() {
            return this.matches.length ? this.currentIndex : 0;
        },

        getFirstMarked: function() {
            return $(this.targets).find("." + SEARCH_HIGHLIGHT_MARK_CLASS).eq(0);
        },

        destroy: function() {
            var that = this;

            that.resetMark();
            $(that.targets).children("span:not(." + that.options.charClass + ")").each(function(i, item) {
                $(item).text($(item).text());
            });
        }
    });

    extend(kendo.pdfviewer, {
        SearchDOM: SearchDOM
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        encode = kendo.htmlEncode,
        extend = $.extend,
        Class = kendo.Class,
        Draggable = kendo.ui.Draggable,
        outerWidth = kendo._outerWidth,
        EXTENSIONS = {
            svg: ".svg",
            png: ".png"
        },
        keys = kendo.keys;

    var ErrorDialog = Class.extend({
        init: function(options) {
            this.options = extend(options, {
                actions: [{
                    text: options.messages.dialogs.okText
                }]
            });
            this._dialog = $("<div />")
                    .kendoDialog(this.options)
                    .getKendoDialog();
        },
        open: function() {
            this._dialog.center().open();
        }
    });

    var ExportAsDialog = Class.extend({
        init: function(options) {
            this.options = extend(options, this.options, {
                fileFormats: [{
                    description: options.messages.dialogs.exportAsDialog.png,
                    extension: EXTENSIONS.png
                }, {
                    description: options.messages.dialogs.exportAsDialog.svg,
                    extension: EXTENSIONS.svg
                }],
                title: options.messages.dialogs.exportAsDialog.title,
                open: function() {
                    this.center();
                }
            });
            this._initializeDialog();
            return this;
        },
        options: {
            extension: EXTENSIONS.png,
            autoFocus: true,
            resizable: false,
            modal: {
                preventScroll: true
            },
            width: "90%",
            maxWidth: 520,
            template: ({ messages, total }) =>
                `<div class='k-edit-label'><label>${encode(messages.exportAsDialog.labels.fileName)}:</label></div>` +
                "<div class='k-edit-field'>" +
                    "<span class='k-textbox k-input k-input-md k-rounded-md k-input-solid'><input class='k-input-inner' data-bind='value: name' /></span>" +
                "</div>" +
                "<div>" +
                    `<div class='k-edit-label'><label>${encode(messages.exportAsDialog.labels.saveAsType)}:</label></div>` +
                    "<div class='k-edit-field'>" +
                    "<select data-role='dropdownlist' class='k-file-format' " +
                        "data-text-field='description' " +
                        "data-value-field='extension' " +
                        "data-bind='value: extension, source: fileFormats'></select>" +
                    "</div>" +
                "</div>" +
                `<div class='k-edit-label'><label>${encode(messages.exportAsDialog.labels.page)}:</label></div>` +
                "<div class='k-edit-field'>" +
                    `<input data-role='numerictextbox' data-format='n0' data-min='1' data-max='${encode(total)}' data-bind='value: page' />` +
                "</div>" +
                "<div class='k-actions'>" +
                    `<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary' data-bind='click: apply'><span class='k-button-text'>${encode(messages.save)}</span></button>` +
                    `<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base' data-bind='click: close'><span class='k-button-text'>${encode(messages.cancel)}</span></button>` +
                "</div>"
        },
        _updateModel: function(options) {
            if (options.pagesCount) {
                this.viewModel.set("pagesCount", options.pagesCount);
            }
            if (options.page) {
                this.viewModel.set("page", options.page);
            }
        },
        _initializeDialog: function() {
            var that = this;
            var options = that.options;
            var dialogMessages = options.messages.dialogs;
            var dialog = $("<div class='k-pdf-viewer-window k-action-window k-popup-edit-form' />")
                    .append(kendo.template(options.template)({
                        total: options.pagesCount,
                        messages: dialogMessages
                    }))
                    .kendoWindow(options)
                    .getKendoWindow();

            that.viewModel = kendo.observable({
                title: dialogMessages.exportAsDialog.title,
                name: dialogMessages.exportAsDialog.defaultFileName,
                extension: options.extension,
                fileFormats: options.fileFormats,
                pagesCount: options.pagesCount,
                page: 1,
                apply: that.apply.bind(this),
                close: function() {
                    dialog.close();
                }
            });

            that._dialog = dialog;

            kendo.bind(dialog.element, that.viewModel);
            return dialog;
        },
        open: function() {
            this._dialog.center().open();
        },
        apply: function() {
            this._dialog.close();
            this.options.apply({
                fileName: this.viewModel.name + this.viewModel.extension,
                extension: this.viewModel.extension,
                page: this.viewModel.page
            });
        }
    });

    var SearchDialog = Class.extend({
        init: function(options) {
            var that = this;
            that.options = extend({}, options, that.options);
        },
        options: {
            resizable: false,
            template: ({ messages }) => '<div class="k-search-panel k-pos-sticky k-top-center">' +
                          `<button aria-label='${encode(messages.dragHandle)}' class='k-button k-button-md k-rounded-md k-button-flat k-button-flat-base k-icon-button k-search-dialog-draghandle'>${kendo.ui.icon({ icon: "handle-drag", iconClass: "k-button-icon" })}</button>` +
                          "<span class='k-textbox k-input k-input-md k-rounded-md k-input-solid'>" +
                              `<input class='k-search-dialog-input k-input-inner' data-bind='value: boundValue, events: { keyup: onKeyup, input: onInput }' aria-label='${encode( messages.inputLabel)}' title='${encode(messages.inputLabel)}' />` +
                              `<span class='k-input-suffix'><button class='k-button k-button-md k-rounded-md k-button-flat k-button-flat-base k-icon-button k-match-case-button k-match-case-button' data-bind='css: {k-selected: matchCase}, click: matchCaseClick' aria-label='${encode(messages.matchCase)}' title='${encode(messages.matchCase)}'>${kendo.ui.icon({ icon: "convert-lowercase", iconClass: "k-button-icon" })}</button></span>` +
                          "</span>" +
                          `<span class='k-search-matches'><span data-bind='text: matchIndex'></span> ${encode(messages.of)} <span data-bind='text: matches'></span></span>` +
                          `<button class='k-button k-button-md k-rounded-md k-button-flat k-button-flat-base k-icon-button' data-bind='click: prev' aria-label='${encode(messages.previous)}' title='${encode(messages.previous)}'>${kendo.ui.icon({ icon: "arrow-up", iconClass: "k-button-icon" })}</button>` +
                          `<button class='k-button k-button-md k-rounded-md k-button-flat k-button-flat-base k-icon-button' data-bind='click: next' aria-label='${encode(messages.next)}' title='${encode(messages.next)}'>${kendo.ui.icon({ icon: "arrow-down", iconClass: "k-button-icon" })}</button>` +
                          `<button class='k-button k-button-md k-rounded-md k-button-flat k-button-flat-base k-icon-button' data-bind='click: close' aria-label='${encode(messages.close)}' title='${encode(messages.close)}'>${kendo.ui.icon({ icon: "x", iconClass: "k-button-icon" })}</button>` +
                      "</div>"
        },
        open: function() {
            var that = this;

            if (!that.dialog) {
                that._initializeDialog();
            }

            that.options.open();
            that._showSearchDialog();
        },
        close: function() {
            var that = this;
            that.options.close();
            that._hideSearchDialog();
        },
        _showSearchDialog: function() {
            var that = this;

            that.dialog.css("left",`${(that.options.pageContainer.innerWidth() / 2) - (outerWidth(that.dialog, true) / 2)}px`);

            that.dialog.kendoStop().kendoAnimate({
                effects: { zoom: { direction: "in" }, fade: { direction: "in" } },
                duration: 350,
                complete: function(ev) {
                    that.dialog.find(".k-search-dialog-input").trigger("focus");
                }
            });
        },
        _hideSearchDialog: function() {
            var that = this;

            that.dialog.kendoStop().kendoAnimate({
                effects: { zoom: { direction: "out", properties: { scale: 0.7 } }, fade: { direction: "out" } },
                duration: 350,
                hide: true
            });
        },
        _initializeDialog: function() {
            var that = this;
            var template = kendo.template(that.options.template);
            var dialogElm = $(template({
                messages: that.options.messages
            }));

            that.options.pageContainer.prepend(dialogElm);
            that.dialog = dialogElm;

            that._draggable = new Draggable(dialogElm, {
                filter: ".k-search-dialog-draghandle",
                axis: "x",
                dragstart: function(e) {
                    var wnd = that.dialog;
                    var containment = that.options.pageContainer;

                    wnd.startPosition = {
                        left: e.x.client - kendo.getOffset(wnd, "position").left,
                    };

                    if (!containment) {
                        return null;
                    }

                    containment._innerWidth = containment.innerWidth();

                    if (parseInt(containment._innerWidth, 10) > containment[0].clientWidth) {
                        containment._innerWidth -= kendo.support.scrollbar();
                    }

                    wnd.maxLeft = containment._innerWidth - outerWidth(wnd, true);
                },
                drag: function(e) {
                    var wnd = that.dialog;
                    var position = {};
                    var left;

                    left = e.x.client - wnd.startPosition.left;

                    if (left && isNaN(left) && left.toString().indexOf("px") < 0) {
                        position.left = left;
                    } else {
                        position.left = Math.max(
                            Math.min(parseInt(left, 10), parseInt(wnd.maxLeft, 10)),
                            0
                        );
                    }

                    wnd.css(position);
                },
            });

            that._draggable.userEvents.stopPropagation = false;

            that.searchModel = kendo.observable({
                boundValue: "",
                searchText: "",
                matchCase: false,
                matchIndex: 0,
                matches: 0,
                matchCaseClick: function() {
                    this.set("matchCase", !this.matchCase);
                },
                next: that.options.next,
                prev: that.options.prev,
                close: function() {
                    this.set("boundValue", "");
                    that.close();
                },
                onKeyup: function(ev) {
                    var key = ev.keyCode;
                    var navigationFn = ev.shiftKey ? this.prev : this.next;

                    if (key === keys.ENTER) {
                        navigationFn();
                        ev.preventDefault();
                    } else if (key == keys.ESC) {
                        this.close();
                    }
                },
                onInput: function(ev) {
                    this.set("searchText", ev.target.value);
                }
            });

            kendo.bind(dialogElm, that.searchModel);
        }
    });

    extend(kendo.pdfviewer, {
        dialogs: {
            ErrorDialog: ErrorDialog,
            ExportAsDialog: ExportAsDialog,
            SearchDialog: SearchDialog
        }
    });
})(window.kendo.jQuery);

(function($, undefined$1) {
    var kendo = window.kendo,
        extend = $.extend,
        parseJSON = JSON.parse,
        progress = kendo.ui.progress,
        scrollToSearchMatch = kendo.ui.PdfViewerCommon.scrollToSearchMatch,
        Class = kendo.Class,
        UploadHelper = kendo.pdfviewer.UploadHelper,
        OPEN = "open",
        ZOOMSTART = "zoomStart",
        ZOOMEND = "zoomEnd";

    var Command = Class.extend({
        init: function(options) {
            this.options = options;
            this.viewer = options.viewer;
            this.errorMessages = this.viewer.options.messages.errorMessages;
        }
    });

    var OpenCommand = Command.extend({
        init: function(options) {
            Command.fn.init.call(this, options);
            this._uploadHelper = new UploadHelper(this.viewer);
        },
        exec: function() {
            this.viewer._upload = this.viewer._upload || this._uploadHelper._initUpload();
            this.viewer._upload.element.click();
        },
    });

    var PageChangeCommand = Command.extend({
        exec: function() {
            var targetPage = this.options.value,
                viewer = this.viewer,
                current, total;

            if (isNaN(targetPage)) {
                current = viewer._pageNum;
                total = viewer.document.total;

                switch (targetPage) {
                    case "first": targetPage = 1;
                        break;
                    case "prev": targetPage = current > 1 ? current - 1 : 1;
                        break;
                    case "next": targetPage = current < total ? current + 1 : total;
                        break;
                    case "last": targetPage = total;
                        break;
                }
            } else {
                targetPage = Number(targetPage);
            }

            viewer.activatePage(targetPage);
        }
    });

    var DownloadCommand = Command.extend({
        exec: function() {
            if (!this.viewer.document) {
                this.viewer._triggerError({
                    message: this.errorMessages.notFound
                });
                return;
            }

            var fileName = (this.viewer.document.info && this.viewer.document.info.title) ||
                            this.viewer.options.messages.defaultFileName;

            this.viewer.processor.downloadFile(fileName);
        }
    });

    var ExportCommand = Command.extend({
        init: function(options) {
            options = $.extend(options, this.options);
            Command.fn.init.call(this, options);
        },
        exec: function() {
            var dialog = (this.viewer._saveDialog || this._initDialog());

            dialog._updateModel({
                pagesCount: (this.viewer.document && this.viewer.document.total) || 1,
                page: this.viewer.options.page
            });

            dialog.open();
        },
        apply: function(viewModel) {
            var extension = viewModel.extension;

            if (extension === ".png") {
                this.viewer.exportImage(viewModel);
            } else if (extension === ".svg") {
                this.viewer.exportSVG(viewModel);
            }
        },
        _initDialog: function() {
            this.viewer._saveDialog = new kendo.pdfviewer.dialogs.ExportAsDialog({
                apply: this.apply.bind(this),
                pagesCount: (this.viewer.document && this.viewer.document.total) || 1,
                messages: this.viewer.options.messages
            });
            return this.viewer._saveDialog;
        }
    });

    var EnableSelectionCommand = Command.extend({
        exec: function() {
            var that = this,
                viewer = that.viewer;

                viewer._toggleSelection(true);
        }
    });

    var EnablePanCommand = Command.extend({
        exec: function() {
            var that = this,
                viewer = that.viewer;

                viewer._toggleSelection(false);
        }
    });

    var OpenSearchCommand = Command.extend({
        init: function(options) {
            var that = this;

            that.viewer = options.viewer;

            if (!that.viewer.searchDialog) {
                that.viewer.searchDialog = new kendo.pdfviewer.dialogs.SearchDialog({
                    pageContainer: that.viewer.pageContainerWrapper,
                    position: {
                        top: that.viewer.pageContainer.offset().top,
                        left: that.viewer.pageContainer.offset().left
                    },
                    messages: that.viewer.options.messages.dialogs.search,
                    open: that._open.bind(that),
                    next: that._next.bind(that),
                    prev: that._prev.bind(that),
                    close: that._close.bind(that)
                });
            }

            Command.fn.init.call(that, options);
        },
        exec: function() {
            var that = this;

            that.viewer.searchDialog.open();
        },
        _open: function() {
            var that = this;

            that.changeHandler = that._change.bind(that);
            that.zoomStartHandler = that._closeDialog.bind(that);
            that.openFileHandler = that._closeDialog.bind(that);

            if (!that.viewer._searchDOM) {
                that.viewer._initSearchDOM();
                that.viewer.searchDialog.searchModel.bind("change", that.changeHandler);
                that.viewer.bind("zoomStart", that.zoomStartHandler);
                that.viewer.bind("open", that.openFileHandler);
            }
        },
        _close: function() {
            var that = this;
            var searchEngine = that.viewer._searchDOM;

            that.viewer.searchDialog.searchModel.unbind("change", that.changeHandler);
            that.viewer.unbind("zoomStart", that.zoomStartHandler);
            that.viewer.unbind("open", that.openFileHandler);
            searchEngine.destroy();
            delete that.viewer._searchDOM;
            that._updateSearchModel();
            that.viewer.toolbar.element.find("[tabindex=0]").trigger("focus");
        },
        _change: function(ev) {
            var that = this;
            var searchEngine = that.viewer._searchDOM;
            var field = ev.field;
            var model = that.viewer.searchDialog.searchModel;
            var value = model[field];

            if (!searchEngine) {
                return;
            }

            switch (field) {
                case "searchText":
                    searchEngine.search(value, model.matchCase);
                    that._updateSearchModel();
                    break;
                case "matchCase":
                    searchEngine.search(model.searchText, value);
                    that._updateSearchModel();
                    break;
                default:
                    break;
            }
        },
        _next: function() {
            var that = this;
            var searchEngine = that.viewer._searchDOM;

            if (searchEngine.matches && searchEngine.matches.length) {
                searchEngine.nextMatch();
                that._updateSearchModel();
            }
        },
        _prev: function() {
            var that = this;
            var searchEngine = that.viewer._searchDOM;

            if (searchEngine.matches && searchEngine.matches.length) {
                searchEngine.previousMatch();
                that._updateSearchModel();
            }
        },
        _updateSearchModel: function() {
            var that = this;
            var searchEngine = that.viewer._searchDOM;
            var model = that.viewer.searchDialog.searchModel;

            if (searchEngine) {
                model.set("matches", searchEngine.matches.length);
                model.set("matchIndex", searchEngine.getMarkedIndex());
                that._scrollToMark();
            } else {
                model.set("searchText", "");
                model.set("matches", 0);
                model.set("matchIndex", 0);
                model.set("matchCase", false);
            }
        },
        _scrollToMark: function() {
            var that = this;
            var searchEngine = that.viewer._searchDOM;
            var marked = searchEngine.getFirstMarked();

            if (!marked.length) {
                return;
            }

            scrollToSearchMatch(marked[0], that.viewer.pdfScroller);
        },
        _closeDialog: function() {
            var that = this;
            that.viewer.searchDialog.close();
        }
    });

    var ZoomCommand = Command.extend({
        exec: function() {
            var that = this,
                options = that.options,
                viewer = that.viewer,
                scale = options.value || options.scale,
                loadedPagesHeight = 0,
                page = that.viewer._pageNum,
                containerHeight = viewer.pageContainer[0].clientHeight,
                updatedVisiblePagesCount = 1,
                renderTasks = [];

            if (viewer.processingLib === "dpl") {
                return;
            }

            scale = that._calculateZoom();

            var updateViewer = function() {
                var scrollingStarted = viewer._scrollingStarted;

                if (!scrollingStarted)
                {
                    viewer.activatePage(page);
                    viewer._scrollingStarted = false;
                }
            };

            if (!scale) {
                return;
            }

            viewer.zoomScale = scale;
            viewer._scrollingStarted = false;

            viewer._setPageContainerScaleFactor(scale);

            if (viewer.pages) {
                viewer.pages.forEach(function(page) {
                    var pageHeight;

                    if (viewer._visiblePages.indexOf(page) !== -1 && page.loaded) {
                        renderTasks.push(page.render(scale));

                        pageHeight = page._page.getViewport({
                            scale: scale
                        }).height;
                    }
                    else {
                        page.resize(scale);
                        pageHeight = page.element.height();
                    }

                    loadedPagesHeight += pageHeight;

                    if (loadedPagesHeight <= containerHeight) {
                        updatedVisiblePagesCount++;
                    }
                });


                if (viewer._visiblePagesCount != updatedVisiblePagesCount) {

                    viewer._visiblePagesCount = updatedVisiblePagesCount;
                    viewer._loadVisiblePages();
                }
            }

            Promise.all(renderTasks).then(function() {
                updateViewer();
                that._triggerZoomEnd(scale);
            }).catch(function() {
                updateViewer();
                that._triggerZoomEnd(scale);
            });
        },

        _calculateZoom: function() {
            var options = this.options,
                viewer = this.viewer,
                viewerOptions = viewer.options,
                pageContainer = viewer.pageContainer,
                visibleCanvas = viewer._visiblePages && viewer._visiblePages[0].canvas,
                calculatedDpr = (viewer._visiblePages && viewer._visiblePages[0]._dpr) || 2,
                scale = options.value || options.scale,
                scaleValue = scale,
                preventZoom;

            viewer._allowResize = false;
            viewer._autoFit = false;

            if (options.zoomIn) {
                scaleValue = scale = viewer.zoomScale + viewerOptions.zoomRate;
            } else if (options.zoomOut) {
                scaleValue = scale = viewer.zoomScale - viewerOptions.zoomRate;
            } else if (scale === "auto") {
                viewer._allowResize = true;
                scaleValue = viewer._autoZoomScale;
            } else if (scale === "actual") {
                scaleValue = 1;
            } else if (scale === "fitToWidth") {
                viewer._allowResize = true;
                viewer._autoFit = "fitToWidth";
                scaleValue = (pageContainer.width() / ((visibleCanvas.width / calculatedDpr) / viewer.zoomScale));
            } else if (scale === "fitToPage") {
                viewer._allowResize = true;
                viewer._autoFit = "fitToPage";
                scaleValue = (pageContainer.height() / ((visibleCanvas.height / calculatedDpr) / viewer.zoomScale));
            } else if (scale && scale.toString().match(/^[0-9]+%?$/)) {
                scale = parseInt(scale.replace('%', ''), 10) / 100;
                scaleValue = scale;
            } else {
                preventZoom = isNaN(scale);
            }

            if (!preventZoom) {
                preventZoom = scale < viewerOptions.zoomMin || scale > viewerOptions.zoomMax;
            }

            if (preventZoom || viewer.trigger(ZOOMSTART, { scale: scale })) {
                return;
            }

            if (options.updateComboBox && viewer.toolbar)
            {
                viewer._updateZoomComboBox(scale);
            }

            return scaleValue;
        },

        _triggerZoomEnd: function(scale) {
            var that = this,
                viewer = that.viewer;

            viewer.trigger(ZOOMEND, { scale: scale });
        }
    });

    var PrintCommand = Command.extend({
        init: function(options) {
            Command.fn.init.call(this, options);
        },
        exec: function() {
            var that = this;

             if (!that.viewer.document) {
                that.viewer._triggerError({
                    message: this.errorMessages.notFound
                });
                return;
            }

            progress(that.viewer.pageContainer, true);
            that._renderPrintContainer();
            that._loadAllPages().then(that.processAfterRender.bind(that));
        },
        _renderPrintContainer: function() {
            this.printContainer = $("<div></div>");
        },
        _loadAllPages: function() {
            var that = this;
            var pages = that.viewer.pages;
            var loadPromises = [];
            var renderPromises = [];
            var promise = $.Deferred();
            var defaultScale = 3;

            that._originalScale = that.viewer.zoom();
            that.viewer._setPageContainerScaleFactor(defaultScale);

            function getRenderPromise(page) {
                renderPromises.push(page._renderPromise);
            }

            for (var i = 0; i < pages.length; i++) {
                loadPromises.push(pages[i].load(defaultScale, true).then(getRenderPromise));
            }

            Promise.all(loadPromises).then(function() {
                promise.resolve(renderPromises);
            });

            return promise;
        },
        processAfterRender: function(renderPromises) {
            var that = this;

            Promise.all(renderPromises).then(function() {
                that._renderPrintPages();
                setTimeout(function() {
                    that._printDocument();
                    that.viewer.zoom(that._originalScale);
                    progress(that.viewer.pageContainer, false);
                    delete that._originalScale;
                }, 0);
            });
        },
        _renderPrintPages: function() {
            var pages = this.viewer.pages;

            for (var i = 0; i < pages.length; i++) {
                this._renderPrintImage(pages[i]);
            }
         },
        _renderPrintImage: function(page) {
            var canvas = page.canvas;
            var div = $("<div></div>");

            var img = "<img src='" + canvas.toDataURL() + "' width='" + page.width + "px' height='" + page.height + "px' />";

            div.append(img);

            this.printContainer.append(div);
        },
        _printDocument: function() {
            var that = this;
            var pages = that.viewer.pages;
            var width = pages[0].width;
            var height = pages[0].height;
            var myWindow = window.open('','','innerWidth=' + width + ',innerHeight=' + height + 'location=no,titlebar=no,toolbar=no');
            var browser = kendo.support.browser;

            if (!myWindow) {
                that.viewer._triggerError({
                    message: that.errorMessages.popupBlocked
                });
                return;
            }

            myWindow.document.write(that.printContainer.html());
            myWindow.document.close();
            myWindow.focus();
            myWindow.print();

            if (!browser.chrome || browser.chromiumEdge) {
                myWindow.close();
            } else {
                $(myWindow.document).find("body").on("mousemove", function() {
                    myWindow.close();
                });
            }
        }
    });

    extend(kendo.pdfviewer, {
        OpenCommand: OpenCommand,
        PageChangeCommand: PageChangeCommand,
        DownloadCommand: DownloadCommand,
        EnableSelectionCommand: EnableSelectionCommand,
        EnablePanCommand: EnablePanCommand,
        ExportCommand: ExportCommand,
        PrintCommand: PrintCommand,
        OpenSearchCommand: OpenSearchCommand,
        ZoomCommand: ZoomCommand
    });

})(window.kendo.jQuery);

var __meta__ = {
    id: "pdfviewer",
    name: "PDFViewer",
    category: "web",
    description: "PDFViewer to display pdfs in the browser",
    depends: ["core", "window", "dialog", "toolbar", "draganddrop", "upload", "combobox", "drawing", "binder", "dropdownlist", "numerictextbox", "textbox"]
};

(function($, undefined$1) {
    var NS = ".kendoPDFViewer",
        kendo = window.kendo,
        ui = kendo.ui,
        Scroller = ui.PdfViewerCommon.Scroller,
        getCurrentPage = ui.PdfViewerCommon.currentPage,
        scrollToPage = ui.PdfViewerCommon.scrollToPage,
        extend = $.extend,
        drawing = kendo.drawing,
        keys = $.extend({ PLUS: 187, MINUS: 189, ZERO: 48, NUMPAD_ZERO: 96 }, kendo.keys),
        Page,
        BlankPage = kendo.pdfviewer.BlankPage,
        Widget = ui.Widget,
        progress = kendo.ui.progress,
        SCROLL = "scroll",
        RENDER = "render",
        OPEN = "open",
        ERROR = "error",
        KEYDOWN = "keydown" + NS,
        MOUSEWHEEL = "DOMMouseScroll" + NS + " mousewheel" + NS,
        UPDATE = "update",
        ZOOM_SCALE = 1.25,
        PAGE_CHANGE = "pagechange",
        ZOOMSTART = "zoomStart",
        ZOOMEND = "zoomEnd",
        ZOOMCOMMAND = "ZoomCommand",
        WHITECOLOR = "#ffffff",
        TABINDEX = "tabindex",
        CLICK = "click",
        CHANGE = "change",
        TOGGLE = "toggle",
        PROCESSORS = {
            pdfjs: "pdfjs",
            dpl: "dpl"
        },
        styles = {
            viewer: "k-pdf-viewer k-widget",
            scroller: "k-canvas k-pdf-viewer-canvas k-pos-relative k-overflow-auto",
            enableTextSelection: "k-enable-text-select",
            enablePanning: "k-enable-panning",
            highlightClass: "k-search-highlight",
            charClass: "k-text-char"
        },
        PREDEFINED_ZOOM_VALUES = {
            auto: "auto",
            actual: "actual",
            fitToWidth: "fitToWidth",
            fitToPage: "fitToPage"
        };

    var PDFViewer = Widget.extend({
        init: function(element, options) {
            var that = this;

            Widget.fn.init.call(that, element, kendo.deepExtend({}, this.options, options));

            that._processMessages();

            that._wrapper();

            if (that.options.toolbar) {
                that._renderToolbar();
            }

            that._initProcessor(options || {});
            that._renderPageContainer();
            that._loadDocument();

            kendo.notify(that, kendo.ui);

            if (that._showWatermarkOverlay) {
                that._showWatermarkOverlay(that.wrapper[0]);
            }
        },

        events: [
            RENDER,
            OPEN,
            ERROR,
            ZOOMSTART,
            ZOOMEND
        ],

        options: {
            name: "PDFViewer",
            view: {
                type: "canvas"
            },
            pdfjsProcessing: {
                file: null
            },
            dplProcessing: {
                read: {
                    url: null,
                    type: "GET",
                    dataType: "json",
                    pageField: "pageNumber"
                },
                upload: {
                    url: null,
                    saveField: "file"
                },
                download: {
                    url: null
                },
                loadOnDemand: false
            },
            toolbar: {
                items: []
            },
            width: 1000,
            height: 1200,
            page: 1,
            defaultPageSize: {
                width: 794,
                height: 1123
            },
            scale: null,
            zoomMin: 0.5,
            zoomMax: 4,
            zoomRate: 0.25,
            messages: {
                defaultFileName: "Document",
                toolbar: {
                    zoom: {
                        zoomLevel: "zoom level",
                        zoomOut: "Zoom Out",
                        zoomIn: "Zoom In",
                        actualWidth: "Actual Width",
                        autoWidth: "Automatic Width",
                        fitToWidth: "Fit to Width",
                        fitToPage: "Fit to Page"
                    },
                    open: "Open",
                    exportAs: "Export",
                    download: "Download",
                    pager: {
                        first: "Go to the first page",
                        previous: "Go to the previous page",
                        next: "Go to the next page",
                        last: "Go to the last page",
                        of: "of",
                        page: "page",
                        pages: "pages"
                    },
                    print: "Print",
                    toggleSelection: "Enable Selection",
                    togglePan: "Enable Panning",
                    search: "Search"
                },
                errorMessages: {
                    notSupported: "Only pdf files allowed.",
                    parseError: "PDF file fails to process.",
                    notFound: "File is not found.",
                    popupBlocked: "Popup is blocked."
                },
                dialogs: {
                    exportAsDialog: {
                        title: "Export...",
                        defaultFileName: "Document",
                        pdf: "Portable Document Format (.pdf)",
                        png: "Portable Network Graphics (.png)",
                        svg: "Scalable Vector Graphics (.svg)",
                        labels: {
                            fileName: "File name",
                            saveAsType: "Save as",
                            page: "Page"
                        }
                    },
                    okText: "OK",
                    save: "Save",
                    cancel: "Cancel",
                    search: {
                        inputLabel: "Search Text",
                        matchCase: "Match Case",
                        next: "Next Match",
                        previous: "Previous Match",
                        close: "Close",
                        of: "of",
                        dragHandle: "Drag search"
                    }
                }
            }
        },

        defaultTools: {
            pager: {
                name: "pager",
                command: "PageChangeCommand"
            },
            spacer: { type: "spacer" },
            zoomInOut: {
                type: "buttonGroup",
                fillMode: "flat",
                attributes: { "class": "k-zoom-in-out-group" },
                buttons: [
                    { type: "button", icon: "zoom-out", name: "zoomOut", command: "ZoomCommand", showText: "overflow", options: "{ \"zoomOut\": true, \"updateComboBox\": true }", fillMode: "flat" },
                    { type: "button", icon: "zoom-in", name: "zoomIn", command: "ZoomCommand", showText: "overflow", options: "{ \"zoomIn\": true, \"updateComboBox\": true }", fillMode: "flat" },
                ]
            },
            zoom: {
                type: "component",
                name: "zoom",
                command: "ZoomCommand",
                overflow: "never",
                component: "ComboBox",
                data: [50, 100, 150, 200, 300, 400],
                componentOptions: {
                    enable: false,
                    dataTextField: "text",
                    dataValueField: "percent",
                    valuePrimitive: true,
                    clearOnEscape: false,
                    commandOn: "change"
                }
            },
            toggleSelection: {
                type: "buttonGroup",
                fillMode: "flat",
                attributes: { "class": "k-toggle-selection-group" },
                buttons: [
                    {
                        togglable: true,
                        command: "EnableSelectionCommand",
                        icon: "pointer",
                        showText: "overflow",
                        name: "toggleSelection",
                        group: "toggle-pan",
                        fillMode: "flat"
                    }, {
                        togglable: true,
                        command: "EnablePanCommand",
                        icon: "hand",
                        showText: "overflow",
                        name: "togglePan",
                        group: "toggle-pan",
                        selected: true,
                        fillMode: "flat"
                    }
                ]
            },
            spacer2: { type: "spacer" },
            search: {
                type: "button",
                command: "OpenSearchCommand",
                icon: "search",
                name: "search",
                showText: "overflow",
                enable: false,
                fillMode: "flat"
            },
            open: {
                type: "button",
                showText: "overflow",
                name: "open",
                icon: "folder-open",
                command: "OpenCommand",
                fillMode: "flat"
            },
            download: {
                type: "button",
                showText: "overflow",
                name: "download",
                icon: "download",
                command: "DownloadCommand",
                enable: false,
                fillMode: "flat"
            },
            print: {
                type: "button",
                showText: "overflow",
                name: "print",
                icon: "print",
                command: "PrintCommand",
                enable: false,
                fillMode: "flat"
            }
        },

        exportAsTool: {
            exportAs: { type: "button", showText: "overflow", name: "exportAs", icon: "image-export", command: "ExportCommand", fillMode: "flat" }
        },

        pagerTools: [
            {
                type: "buttonGroup",
                fillMode: "flat",
                buttons: [
                    { type: "button", icon: "caret-alt-to-left", name: "first", showText: "overflow", options: "{ \"value\": \"first\" }", attributes: { class: "k-first-link" } },
                    { type: "button", icon: "caret-alt-left", name: "previous", showText: "overflow", options: "{ \"value\": \"prev\" }", attributes: { class: "k-prev-link" }, rounded: "none" },
                ]
            },
            {
                type: "component",
                component: "TextBox",
                name: "page",
                attributes: { class: "k-viewer-pager-input" },
                element: "<input id='page-input'/>",
                overflow: "never",
                componentOptions: {
                    commandOn: "change"
                }
            },
            {
                overflow: "never",
                template: function(data) {
                    return "<label for='page-input'>" + data.componentOptions.messages.of + " <span id='total-page'></span> " + data.componentOptions.messages.pages + "</label>";
                },
                componentOptions: {
                    messages: {
                        of: "of",
                        pages: "pages"
                    }
                }
            },
            {
                type: "buttonGroup",
                fillMode: "flat",
                buttons: [
                    { type: "button", icon: "caret-alt-right", name: "next", showText: "overflow", options: "{ \"value\": \"next\" }", fillMode: "flat", attributes: { class: "k-next-link" }, rounded: "none" },
                    { type: "button", icon: "caret-alt-to-right", name: "last", showText: "overflow", options: "{ \"value\": \"last\" }", fillMode: "flat", attributes: { class: "k-last-link" } }
                ]
            },
        ],

        _processMessages: function() {
            var messages = this.options.messages.toolbar,
                zoom = messages.zoom,
                pager = messages.pager;

            if ($.isPlainObject(zoom)) {
                this.options.messages.toolbar = $.extend({}, this.options.messages.toolbar, zoom);
                this.options.messages.toolbar.zoom = zoom.zoomLevel || this.options.messages.toolbar.zoom;
            }

            if ($.isPlainObject(pager)) {
                this.options.messages.toolbar = $.extend({}, this.options.messages.toolbar, pager);
            }
        },

        _wrapper: function() {
            var that = this,
                options = that.options;

            that.wrapper = that.element;

            that.wrapper
                    .width(options.width)
                    .height(options.height)
                    .addClass(styles.viewer)
                    .on(KEYDOWN, that._keydown.bind(that));

            that._allowResize = that.options.scale === null;
            that._autoZoomScale = ZOOM_SCALE;
            that.zoomScale = that.options.scale || that._autoZoomScale;

            that._resizeHandler = kendo.onResize(function() {
                that.resize();
            });

            that._pageNum = that.options.page;
        },

        _keydown: function(e) {
            var plusShortcuts = [keys.PLUS, keys.NUMPAD_PLUS],
                minusShortcuts = [keys.MINUS, keys.NUMPAD_MINUS],
                zeroShortcuts = [keys.ZERO, keys.NUMPAD_ZERO],
                shouldExecute = false,
                args = {
                    command: ZOOMCOMMAND,
                    options: { updateComboBox: true }
                };

            if (!e.ctrlKey || this._blankPage || this.processingLib === PROCESSORS.dpl) {
                return;
            }

            if (plusShortcuts.includes(e.keyCode)) {
                args.options.zoomIn = true;
                shouldExecute = true;
            } else if (minusShortcuts.includes(e.keyCode)) {
                args.options.zoomOut = true;
                shouldExecute = true;
            } else if (zeroShortcuts.includes(e.keyCode)) {
                args.options.value = ZOOM_SCALE;
                shouldExecute = true;
            }

            if (shouldExecute) {
                this.execute(args);
                e.preventDefault();
            }
        },

        _initProcessor: function(options) {
            var that = this,
                processingOptions;

            processingOptions = options.dplProcessing ? that.options.dplProcessing : that.options.pdfjsProcessing;
            that.processingLib = options.dplProcessing ? PROCESSORS.dpl : PROCESSORS.pdfjs;

            that.processor = new kendo.pdfviewer[that.processingLib].processor(processingOptions, that);
            Page = kendo.pdfviewer[that.processingLib].Page;
        },

        _renderToolbar: function() {
            var that = this,
                options = that.options,
                toolbarOptions = extend({}, options.toolbar),
                tools = toolbarOptions.items && toolbarOptions.items.length ? toolbarOptions.items : Object.keys(that.defaultTools);

            tools = that._processTools(tools);

            toolbarOptions = {
                defaultTools: $.extend({}, that.defaultTools, that.exportAsTool),
                parentMessages: options.messages.toolbar,
                tools: tools,
                resizable: true
            };

            var toolbarElement = $("<div />");
            toolbarElement.appendTo(that.element);
            that.toolbar = new kendo.ui.ToolBar(toolbarElement, toolbarOptions);
            that.options.toolbar = that.toolbar.options;

            that.toolbar.bind(TOGGLE, that._toolbarClick.bind(that));
            that.toolbar.bind(CLICK, that._toolbarClick.bind(that));
            that.toolbar.bind(CHANGE, that._toolbarClick.bind(that));

            that.bind({
                update: that._updateToolbar.bind(that)
            });

            return that.toolbar;
        },

        _processTools: function(tools) {
            var that = this,
                messages = that.options.messages.toolbar;

            tools = tools.flatMap(t => {
                if (t === "zoom") {
                    t = that.defaultTools.zoom;
                } else if (t === "pager") {
                    t = that.defaultTools.pager;
                }

                if (t.name === "zoom") {
                    t = $.extend({}, that.defaultTools.zoom, t);

                    var zoomLevels = [{
                        percent: PREDEFINED_ZOOM_VALUES.auto,
                        text: messages.autoWidth
                    }, {
                        percent: PREDEFINED_ZOOM_VALUES.actual,
                        text: messages.actualWidth
                    }, {
                        percent: PREDEFINED_ZOOM_VALUES.fitToWidth,
                        text: messages.fitToWidth
                    }, {
                        percent: PREDEFINED_ZOOM_VALUES.fitToPage,
                        text: messages.fitToPage
                    }];

                    // eslint-disable-next-line
                    var comboOptions = t.data.map(i => { return { percent: i, text: i + "%" } });
                    var value = that.options.scale ? that.options.scale * 100 + "%" : "auto";

                    zoomLevels = zoomLevels.concat(comboOptions);
                    t.componentOptions.dataSource = zoomLevels;
                    t.componentOptions.value = value;
                } else if (t.name === "pager") {
                    t = $.extend({}, that.defaultTools.pager, t);

                    var pagerTools = that.pagerTools;

                    that.pager = true;

                    t = pagerTools.map(p => {
                        var compMessages;

                        if (p.componentOptions && p.componentOptions.messages) {
                            compMessages = p.componentOptions.messages;
                            Object.keys(messages).forEach(key => {
                                p.componentOptions.messages[key] = messages.pager[key];
                            });
                        }

                        if (p.buttons) {
                            p.buttons = p.buttons.map((b) => {
                                if (b.icon && b.icon.indexOf("caret-alt") > -1 && kendo.support.isRtl(that.element)) {
                                    var direction = b.icon.indexOf("left") > -1 ? "left" : "right";
                                    var rtlDirection = b.icon.indexOf("left") > -1 ? "right" : "left";
                                    b.icon = b.icon.replace(direction, rtlDirection);
                                }
                                b.command = t.command;
                                return b;
                            });
                        } else {
                            p.command = t.command;
                        }

                        return p;
                    });
                }

                return t;
            });

            return tools;
        },

        _updateToolbar: function(e) {
            var pageOptions = {
                    page: e.page || 1,
                    total: e.total || 1
                },
                toolbar = this.toolbar,
                toolbarEl = toolbar.element,
                zoomCombo = toolbarEl.find("[data-command=ZoomCommand][data-role=combobox]").data("kendoComboBox"),
                toFocus = toolbarEl.find(".k-focus");

            if (toFocus.length === 0) {
                toFocus = toolbarEl.find("[tabindex=0]").first();

                if (toFocus.length === 0) {
                    toFocus = toolbar._getAllItems().first();
                }
            }

            if (zoomCombo) {
                zoomCombo.enable(!e.isBlank);
                if (e.action === "zoom") {
                    this._updateZoomComboBox(e.zoom);
                }
            }

            if ((e.action === "pagechange" || e.isBlank) && this.pager) {
                this._updatePager(pageOptions);
            }

            this._updateOnBlank(e.isBlank);

            toolbar._resetTabIndex(toFocus);
        },

        _updateOnBlank: function(isBlank) {
            var toolbar = this.toolbar,
                toolbarEl = toolbar.element;

            toolbar.enable(toolbarEl.find(".k-toggle-selection-group"), !isBlank);
            toolbar.enable(toolbarEl.find(".k-zoom-in-out-group"), !isBlank);

            toolbar.enable(toolbarEl.find("[data-command='OpenSearchCommand']"), !isBlank);
            toolbar.enable(toolbarEl.find("[data-command='DownloadCommand']"), !isBlank);
            toolbar.enable(toolbarEl.find("[data-command='PrintCommand']"), !isBlank);
        },

        _updatePager: function(options) {
            var toolbarEl = this.toolbar.element,
                textBox = toolbarEl.find("#page-input").data("kendoTextBox"),
                totalPagesSpan = toolbarEl.find("#total-page");

            if (textBox && options.page) {
                textBox.value(options.page);
            }

            if (totalPagesSpan.length && options.total) {
                totalPagesSpan.text(options.total);
            }

            this._togglePagerDisabledClass(options);
        },

        _togglePagerDisabledClass: function(options) {
            var toolbar = this.toolbar,
                toolbarEl = toolbar.element,
                total = !options.total,
                prevFirst = toolbarEl.find(".k-prev-link").closest(".k-button-group"),
                nextLast = toolbarEl.find(".k-next-link").closest(".k-button-group"),
                textBox = toolbarEl.find("#page-input").data("kendoTextBox");

            if (prevFirst.length) {
                toolbar.enable(prevFirst, total || options.page !== 1);
            }
            if (nextLast.length) {
                toolbar.enable(nextLast, total || options.page !== options.total);
            }

            if (textBox) {
                textBox.enable(options.total > 1);
            }
        },

        _updateZoomComboBox: function(value) {
            var isPredefined = value === PREDEFINED_ZOOM_VALUES.auto ||
                value === PREDEFINED_ZOOM_VALUES.actual ||
                value === PREDEFINED_ZOOM_VALUES.fitToPage ||
                value === PREDEFINED_ZOOM_VALUES.fitToWidth,
                zoomCombo = this.toolbar.element.find("[data-command=ZoomCommand][data-role=combobox]").data("kendoComboBox");

            if (!isPredefined) {
                value = Math.round(value * 100) + '%';
            }

            if (zoomCombo) {
                zoomCombo.value(value);
            }
        },

        _toolbarClick: function(ev) {
            var command = $(ev.target).data("command"),
                options = $(ev.target).data("options");

            options = extend({}, { value: $(ev.target).val() }, options);

            if (!command) {
                return;
            }

            this.execute({
                command: command,
                options: options
            });
        },

        _initErrorDialog: function(options) {
            var that = this;

            if (!that._errorDialog) {
                options = extend(options, {
                    messages: that.options.messages
                });
                var dialogInstance = new kendo.pdfviewer.dialogs.ErrorDialog(options);
                that._errorDialog = dialogInstance._dialog;
            }
            return that._errorDialog;
        },

        _renderPageContainer: function() {
            var that = this;

            if (!that.pageContainer) {
                that.pageContainerWrapper = $("<div />");
                that.pageContainerWrapper.addClass(styles.scroller);

                that.pageContainer = $(`<div class="k-pdf-viewer-pages" style="--scale-factor: ${that.zoomScale}" />`);
                that.pageContainer.attr(TABINDEX, 0);

                that.pageContainerWrapper.append(that.pageContainer);
                that.wrapper.append(that.pageContainerWrapper);
            }
        },

        _setPageContainerScaleFactor(scale) {
            var that = this;

            if (that.pageContainer) {
                that.pageContainer[0].style.setProperty("--scale-factor", scale);
            }
        },

        _triggerError: function(options) {
            var dialog = this._initErrorDialog();
            extend(options, {
                dialog: dialog
            });
            if (this.pageContainer) {
                progress(this.pageContainer, false);
            }

            if (this.trigger(ERROR, options))
            {
                return;
            }

            dialog.open().content(options.message);
        },

        _renderPages: function() {
            var that = this,
                document = that.document,
                pagesData;

            that.pages = [];

            if (!document || !document.total) {
                that._renderBlankPage();
                return;
            }

            pagesData = document.pages;

            for (var i = 1; i <= document.total; i++) {
                var viewerPage,
                    pageData = {
                        processor: that.processor,
                        number: i
                    };

                if (pagesData && pagesData.length) {
                    pageData = extend(pageData, pagesData[i - 1]);
                }

                viewerPage = new Page(pageData, that);
                that.pages.push(viewerPage);
                that.pageContainer.append(viewerPage.element);
            }

            that._attachContainerEvents();
            that._getVisiblePagesCount();
        },

        _renderBlankPage: function() {
            this._blankPage = new BlankPage(this.options.defaultPageSize, this);

            this.pageContainer.append(this._blankPage.element);

            this._blankPage._initUpload();
            this.trigger(UPDATE, { isBlank: true });
        },

        _resize: function() {
            var that = this,
                containerWidth,
                ratio;

            if (!that._allowResize) {
                return;
            }

            if (!that.pages || !that.pages.length) {
                if (that._blankPage) {
                    ratio = containerWidth / that._blankPage.element.width();
                    that._blankPage.resize(ratio);
                }
                return;
            }

            if (that.toolbar) {
                that.toolbar.resize(true);
            }

            if (that._resizeHandler) {
                clearTimeout(that._resizeHandler);
            }
            that._resizeHandler = setTimeout(that._resizePages.bind(that), 100);
        },

        _resizePages: function() {
            var that = this,
                containerWidth = that.pageContainer[0].clientWidth,
                ratio = 0;

            that.pages.forEach(function(page) {
                var currentRatio = containerWidth / page.element.width();

                if (currentRatio > ratio) {
                    ratio = currentRatio;
                }
            });

            if (that._autoFit) {
                that.zoom(that._autoFit, true);
                return;
            }

            ratio = Math.min(Math.max(ratio, that.options.zoomMin), ZOOM_SCALE);
            if (ratio != that.zoomScale) {
                that.zoom(ratio, true);
                that.zoomScale = ratio;
                that._allowResize = true;
            }
        },

        _attachContainerEvents: function() {
            var that = this;

            that._wheel = kendo.throttle(
                that._wheel.bind(that),
                300
            );

            if (that.processingLib !== PROCESSORS.dpl) {
                that.pageContainer.on(MOUSEWHEEL, function(e) {
                    if (!e.ctrlKey) {
                        return;
                    }

                    if (document.activeElement !== that.pageContainer[0]) {
                        that.pageContainer.trigger("focus");
                    }

                    that._wheel(e);
                    e.preventDefault();
                });
            }

            that.pageContainer.addClass(styles.enablePanning);
            that.pageContainerWrapper.bind(SCROLL, that._scroll.bind(that));
            that.pageContainerWrapper.on(CLICK + NS, ".k-annotation-layer a[href]", that._linkHandler.bind(that));
        },

        _linkHandler: function(e) {
            var that = this,
                link = $(e.target).attr("href");

            if (link && link.indexOf("#") === 0) {
                that.processor.navigateToDestination && that.processor.navigateToDestination(link);
                e.preventDefault();
            }
        },

        _scroll: function(e) {
            var that = this,
                containerHeight = that.pageContainerWrapper.height(),
                total = that.pages.length,
                pageNum = that._pageNum,
                pageIndex = pageNum - 1,
                pageToLoadNum = pageNum,
                pageToLoad,
                currentPage;

                if (that._preventScroll || !total) {
                    that._preventScroll = false;
                    return;
                }

                that._scrollingStarted = true;
                const nextPageIndex = getCurrentPage(that.element[0]);
                currentPage = that.pages[pageIndex];
                pageToLoadNum = pageNum + nextPageIndex - pageIndex;

                if (pageNum !== pageToLoadNum && pageToLoadNum >= 1 && pageToLoadNum <= total) {
                    pageToLoad = that.pages[pageToLoadNum - 1].element;

                    if (pageToLoad.offset().top > containerHeight) {
                        return;
                    }

                    that._pageNum = pageToLoadNum;
                    that._loadVisiblePages();

                    that.trigger(UPDATE, { action: PAGE_CHANGE, page: pageToLoadNum, total: total });
                }
        },

        _wheel: function(e) {
            var originalEvent = e.originalEvent,
                delta = originalEvent.wheelDelta ? -originalEvent.wheelDelta : originalEvent.detail,
                zoomIn = delta < 0;

            this.execute({
                command: ZOOMCOMMAND,
                options: {
                    zoomIn: zoomIn,
                    zoomOut: !zoomIn,
                    updateComboBox: true
                }
            });

            e.preventDefault();
        },

        zoom: function(scale, preventComboBoxChange) {
            var that = this;
            if (!scale) {
                return that.zoomScale;
            }

            return that.execute({
                command: ZOOMCOMMAND,
                options: {
                    value: scale,
                    updateComboBox: !preventComboBoxChange
                }
            });
        },

        execute: function(options) {
            var commandOptions = extend({ viewer: this }, options.options);
            var command = new kendo.pdfviewer[options.command](commandOptions);
            return command.exec();
        },

        _loadDocument: function() {
            var that = this;
            var page = that.options.page;

            progress(that.pageContainer, true);
            that.processor.fetchDocument().done(function(document) {
                that._clearPages();
                that.document = document;

                that._renderPages();
                that.resize(true);

                if (document) {
                    page = page >= 1 && page <= document.total ? page : 1;
                    that.activatePage(page);
                }

                if (that.pdfScroller) {
                    that.pdfScroller.destroy();
                }

                that.pdfScroller = new Scroller(that.pageContainer[0].parentNode, {
                    filter: '.k-page',
                    events: { }
                });

                that.pdfScroller.enablePanEventsTracking();

                progress(that.pageContainer, false);
            });
        },

        loadPage: function(number) {
            var page = this.pages && this.pages[number - 1];

            if (page) {
                return page.load(this.zoomScale);
            }
        },

        activatePage: function(number) {
            var page = this.pages && this.pages[number - 1],
                pageContainer = this.pageContainerWrapper;

            if (!page) {
                return;
            }


            this._pageNum = number;
            this._loadVisiblePages();

            this._preventScroll = true;
            scrollToPage(pageContainer[0], number - 1);
            this.trigger(UPDATE, { action: PAGE_CHANGE, page: number, total: this.pages.length });
        },

        _getVisiblePagesCount: function() {
            var that = this,
                loadedPagesHeight = 0,
                updatedVisiblePagesCount = 0,
                containerHeight = that.pageContainer[0].clientHeight,
                index = 0;

            while (loadedPagesHeight <= containerHeight && index < that.pages.length)
            {
                loadedPagesHeight += that.pages[index].element.height();
                updatedVisiblePagesCount++;
                index++;
            }

            that._visiblePagesCount = updatedVisiblePagesCount;
        },

        _loadVisiblePages: function() {
            var pagesCount = this.pages && this.pages.length,
                minVisiblePageNum = Math.max(this._pageNum - this._visiblePagesCount, 1),
                maxVisiblePageNum = Math.min(this._pageNum + this._visiblePagesCount, pagesCount);

            this._visiblePages = this.pages.slice(minVisiblePageNum - 1, maxVisiblePageNum);

            for (var i = minVisiblePageNum; i <= maxVisiblePageNum; i++)
            {
                this.loadPage(i);
            }
        },

        _loadAllPages: function() {
            var pagesCount = this.pages && this.pages.length;
            var promises = [];

            for (var i = 0; i <= pagesCount; i++)
            {
                promises.push(this.loadPage(i));
            }

            return promises;
        },

        fromFile: function(file) {
            this.zoomScale = this.options.scale || ZOOM_SCALE;
            this.zoom(this.zoomScale, true);
            this.trigger(UPDATE, { action: "zoom", zoom: this.options.scale || "auto" });

            this.processor._updateDocument(file);
            this._loadDocument();
        },

        exportImage: function(options) {
            var that = this;
            var pageNumber = options.page;
            var page = that.pages[pageNumber - 1] || that._blankPage;
            var rootGroup = new drawing.Group();

            page.load();

            var background = kendo.drawing.Path.fromRect(new kendo.geometry.Rect([0, 0], [page.width, page.height]), {
                fill: {
                    color: WHITECOLOR
                },
                stroke: null
            });

            progress(that.pageContainer, true);
            rootGroup.append(background, page.group);

            drawing.exportImage(rootGroup).done(function(data) {
                progress(that.pageContainer, false);
                kendo.saveAs({
                    dataURI: data,
                    fileName: options.fileName,
                    proxyURL: options.proxyURL || "",
                    forceProxy: options.forceProxy,
                    proxyTarget: options.proxyTarget
                });
            });
        },

        exportSVG: function(options) {
            var that = this;
            var pageNumber = options.page;
            var page = that.pages[pageNumber - 1] || that._blankPage;

            progress(that.pageContainer, true);

            page.load();

            drawing.exportSVG(page.group).done(function(data) {
                progress(that.pageContainer, false);
                kendo.saveAs({
                    dataURI: data,
                    fileName: options.fileName,
                    proxyURL: options.proxyURL || "",
                    forceProxy: options.forceProxy,
                    proxyTarget: options.proxyTarget
                });
            });
        },

        setOptions: function(options)
        {
            var that = this;

            if (options.pdfjsProcessing || options.dplProcessing) {
                that._initProcessor(options || {});
            }

            options = $.extend(that.options, options);

            Widget.fn.setOptions.call(that, options);

            if (options.page) {
                that._pageNum = options.page;
                that.activatePage(options.page);
            }

            if (options.width) {
                that.element.width(options.width);
            }

            if (options.height) {
                that.element.height(options.height);
            }
        },

        destroy: function()
        {
            if (this._resizeHandler)
            {
                kendo.unbindResize(this._resizeHandler);
            }

            //destroy nested components
            if (this._errorDialog) {
                this._errorDialog.destroy();
            }

            if (this._saveDialog) {
                this._saveDialog.destroy();
            }

            if (this._upload) {
                this._upload.destroy();
            }

            if (this.toolbar) {
                this.toolbar.unbind();
                this.toolbar.destroy();
                this.toolbar = null;
            }

            if (this.pages && this.pages.length) {
                this.pages.forEach(function(page) {
                    page.destroy();
                });
                this.pages = [];
            }

            if (this.pdfScroller) {
                this.pdfScroller.destroy();
            }
            this.pageContainer.off(NS);
            this.pageContainerWrapper.off(NS);

            Widget.fn.destroy.call(this);
        },

        _clearPages: function() {
            this.pages = [];
            this.document = null;
            this._pageNum = 1;

            this.pageContainer.off(NS);
            this.pageContainer.empty();

            if (this.pdfScroller)
            {
                this.pdfScroller.destroy();
            }
        },

        _toggleSelection: function(enable) {
            var that = this;

            if (enable === undefined$1) {
                enable = true;
            }

            if (that.pdfScroller) {
                enable ? that.pdfScroller.disablePanEventsTracking() : that.pdfScroller.enablePanEventsTracking();
            }

            that.pageContainer.toggleClass(styles.enableTextSelection, enable);
            that.pageContainer.toggleClass(styles.enablePanning, !enable);
        },


        _initSearchDOM: function() {
            var that = this;
            var promise = new Promise(function(resolve) {
                Promise.all(that._loadAllPages()).then(function() {
                    that._searchDOM = new kendo.pdfviewer.SearchDOM({
                        target: that._getTextLayers(),
                        highlightClass: styles.highlightClass,
                        charClass: styles.charClass
                    });

                    resolve();
                });
            });

            return promise;
        },

        _getTextLayers: function() {
            return this.pages.map(function(page) {
                return page.textLayer;
            });
        }
    });

    ui.plugin(PDFViewer);
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
