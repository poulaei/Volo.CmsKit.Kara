require('../kendo.core.js');

(function( window, undefined$1 ) {
    kendo.cultures["ks-Arab-IN"] = {
        name: "ks-Arab-IN",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ",",
            ".": ".",
            groupSize: [3,2],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3,2],
                symbol: "%"
            },
            currency: {
                name: "Indian Rupee",
                abbr: "INR",
                pattern: ["-$ n","$ n"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3,2],
                symbol: "₹"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["اَتھوار","ژٔنٛدرٕروار","بوٚموار","بودوار","برٛٮ۪سوار","جُمہ","بٹوار"],
                    namesAbbr: ["آتھوار","ژٔنٛدٕروار","بوٚموار","بودوار","برٛٮ۪سوار","جُمہ","بٹوار"],
                    namesShort: ["آتھوار","ژٔنٛدٕروار","بوٚموار","بودوار","برٛٮ۪سوار","جُمہ","بٹوار"]
                },
                months: {
                    names: ["جنؤری","فرؤری","مارٕچ","اپریل","میٔ","جوٗن","جوٗلایی","اگست","ستمبر","اکتوٗبر","نومبر","دسمبر"],
                    namesAbbr: ["جنؤری","فرؤری","مارٕچ","اپریل","میٔ","جوٗن","جوٗلایی","اگست","ستمبر","اکتوٗبر","نومبر","دسمبر"]
                },
                AM: ["AM","am","AM"],
                PM: ["PM","pm","PM"],
                patterns: {
                    d: "M/d/yyyy",
                    D: "dddd, MMMM d, yyyy",
                    F: "dddd, MMMM d, yyyy h:mm:ss tt",
                    g: "M/d/yyyy h:mm tt",
                    G: "M/d/yyyy h:mm:ss tt",
                    m: "MMMM d",
                    M: "MMMM d",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 0
            }
        }
    };
})();
