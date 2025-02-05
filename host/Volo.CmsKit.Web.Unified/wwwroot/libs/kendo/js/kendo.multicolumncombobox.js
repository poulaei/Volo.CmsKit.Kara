require('./kendo.combobox.js');

var __meta__ = {
    id: "multicolumncombobox",
    name: "MultiColumnComboBox",
    category: "web",
    description: "The MultiColumnComboBox widget allows the selection from pre-defined values or entering a new value where the list popup is rendered in table layout.",
    depends: [ "combobox" ],
    features: [ {
        id: "mobile-scroller",
        name: "Mobile scroller",
        description: "Support for kinetic scrolling in mobile device",
        depends: [ "mobile.scroller" ]
    }, {
        id: "virtualization",
        name: "VirtualList",
        description: "Support for virtualization",
        depends: [ "virtuallist" ]
    } ]
};

(function($, undefined$1) {
    var kendo = window.kendo,
        ui = kendo.ui,
        ComboBox = ui.ComboBox,
        Select = ui.Select,
        percentageUnitsRegex = /^\d+(\.\d+)?%$/i,
        MCCOMBOBOX = "k-dropdowngrid",
        POPUPCLASS = "k-dropdowngrid-popup";

    var MultiColumnComboBox = ComboBox.extend({
        init: function(element, options) {
            ComboBox.fn.init.call(this, element, options);
            this.list.parent().addClass(POPUPCLASS);

            if (this._allColumnsWidthsAreSet(this.options)) {
                this.list.parent().width(this._calculateDropDownWidth(this.options));
            } else if (this.options.dropDownWidth) {
                this.list.parent().width(this.options.dropDownWidth);
            }
        },

        options: {
            name: "MultiColumnComboBox",
            ns: ".kendoMultiColumnComboBox",
            columns: [],
            dropDownWidth: null,
            filterFields: []
        },

        setOptions: function(options) {
            ComboBox.fn.setOptions.call(this, options);
            if (this._allColumnsWidthsAreSet(options)) {
                this.list.parent().width(this._calculateDropDownWidth(options));
            } else if (this.options.dropDownWidth) {
                this.list.parent().width(this.options.dropDownWidth);
            }
        },

        _popup: function() {
            Select.fn._popup.call(this);
            this.popup.element.removeClass("k-list-container");
        },

        _allColumnsWidthsAreSet: function(options) {
            var columns = options.columns;

            if (!columns || !columns.length) {
                return false;
            }

            for (var i = 0; i < columns.length; i++) {
                var currentWidth = columns[i].width;
                if (!currentWidth || isNaN(parseInt(currentWidth, 10)) || percentageUnitsRegex.test(currentWidth)) {
                    return false;
                }
            }

            return true;
        },

        _calculateDropDownWidth: function(options) {
            var columns = options.columns;
            var totalWidth = kendo.support.scrollbar();

            for (var i = 0; i < columns.length; i++) {
                var currentWidth = columns[i].width;
                totalWidth = totalWidth + parseInt(currentWidth, 10);
            }

            return totalWidth;
        },

        _wrapper: function() {
            ComboBox.fn._wrapper.call(this);
            this.wrapper.addClass(MCCOMBOBOX);
        }
    });

    ui.plugin(MultiColumnComboBox);

    kendo.cssProperties.registerPrefix("MultiColumnComboBox", "k-input-");

    kendo.cssProperties.registerValues("MultiColumnComboBox", [{
        prop: "rounded",
        values: kendo.cssProperties.roundedValues.concat([['full', 'full']])
    }]);
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
