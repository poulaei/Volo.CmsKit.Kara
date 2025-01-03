import './kendo.html.base.js';

var __meta__ = {
    id: "html.loadercontainer",
    name: "Html.LoaderContainer",
    category: "web",
    description: "HTML rendering utility for Kendo UI for jQuery.",
    depends: [ "html.base"],
    features: []
};

(function($, undefined$1) {
    var kendo = window.kendo,
        HTMLBase = kendo.html.HTMLBase;

    var renderLoaderContainer = function(element, options) {
        if (!element || $.isPlainObject(element)) {
            options = element;
            element = $("<div></div>");
        }

        return (new HTMLLoaderContainer(element, options)).html();
    };

    var LOADER_CONTAINER = "k-loader-container k-loader-container-lg",
        LOADER_OVERLAY = "k-loader-container-overlay";


    var HTMLLoaderContainer = HTMLBase.extend({
        init: function(element, options) {
            var that = this;
            HTMLBase.fn.init.call(that, element, options);

            that.options = $.extend({}, that.options, options);

            that._wrapper();
            that._overlay();
            that._innerContainer();

        },
        options: {
            name: "HTMLLoaderContainer",
            themeColor: "base",
            overlayColor: 'dark',
            cssClass: '',
            message: 'Loading...',
            loaderPosition: 'start',
        },

        _wrapper: function() {
            var that = this,
                wrapper,
                options = that.options;

            wrapper = $(`<div class="${LOADER_CONTAINER} k-loader-${options.loaderPosition}${options.cssClass ? ` ${options.cssClass}` : ''}"></div>`);
            that.wrapper = wrapper;
        },

        _overlay: function() {
            var that = this,
                overlay,
                options = that.options,
                colorClass = 'k-overlay-' + options.overlayColor;

            overlay = $(`<div class='${LOADER_OVERLAY} ${colorClass}'></div>`);
            that.wrapper.append(overlay);
        },

        _innerContainer: function() {
            var that = this,
                message,
                innerContainer;

            innerContainer = $("<div class='k-loader-container-inner k-loader-container-panel'></div>");

            that.loaderContainer = innerContainer;

            message = that._initMessage();

            innerContainer.append(message);
            that.wrapper.append(innerContainer);
        },

        _initMessage: function() {
            var that = this,
                options = that.options,
                message = that.options.message,
                messageContainer;

                messageContainer = $(`<div class='k-loader-container-label !k-text-${options.themeColor}'>${message}</div>`);

            return messageContainer;
        },
    });

    $.extend(kendo.html, {
        renderLoaderContainer: renderLoaderContainer,
        HTMLLoaderContainer: HTMLLoaderContainer
    });

})(window.kendo.jQuery);
var kendo$1 = kendo;

export { kendo$1 as default };
