import '../kendo.core.js';

(function( window, undefined$1 ) {
    kendo.cultures["eo-001"] = {
        name: "eo-001",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": " ",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 2,
                ",": " ",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Special Drawing Rights",
                abbr: "XDR",
                pattern: ["-$ n","$ n"],
                decimals: 2,
                ",": " ",
                ".": ",",
                groupSize: [3],
                symbol: "XDR"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["dimanĉo","lundo","mardo","merkredo","ĵaŭdo","vendredo","sabato"],
                    namesAbbr: ["di","lu","ma","me","ĵa","ve","sa"],
                    namesShort: ["di","lu","ma","me","ĵa","ve","sa"]
                },
                months: {
                    names: ["januaro","februaro","marto","aprilo","majo","junio","julio","aŭgusto","septembro","oktobro","novembro","decembro"],
                    namesAbbr: ["jan","feb","mar","apr","maj","jun","jul","aŭg","sep","okt","nov","dec"]
                },
                AM: ["atm","atm","ATM"],
                PM: ["ptm","ptm","PTM"],
                patterns: {
                    d: "yyyy-MM-dd",
                    D: "dddd, d-'a' 'de' MMMM yyyy",
                    F: "dddd, d-'a' 'de' MMMM yyyy HH:mm:ss",
                    g: "yyyy-MM-dd HH:mm",
                    G: "yyyy-MM-dd HH:mm:ss",
                    m: "MMMM d",
                    M: "MMMM d",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "yyyy MMMM",
                    Y: "yyyy MMMM"
                },
                "/": "-",
                ":": ":",
                firstDay: 1
            }
        }
    };
})();
