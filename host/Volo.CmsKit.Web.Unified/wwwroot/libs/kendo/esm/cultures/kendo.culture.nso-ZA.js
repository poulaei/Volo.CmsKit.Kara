import '../kendo.core.js';

(function( window, undefined$1 ) {
    kendo.cultures["nso-ZA"] = {
        name: "nso-ZA",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": " ",
            ".": ".",
            groupSize: [3],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 2,
                ",": " ",
                ".": ".",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "South African Rand",
                abbr: "ZAR",
                pattern: ["-$ n","$ n"],
                decimals: 2,
                ",": " ",
                ".": ".",
                groupSize: [3],
                symbol: "R"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["Lamorena","Musopologo","Labobedi","Laboraro","Labone","Labohlano","Mokibelo"],
                    namesAbbr: ["Lam","Mos","Bed","Rar","Ne","Hla","Mok"],
                    namesShort: ["Lam","Mos","Bed","Rar","Ne","Hla","Mok"]
                },
                months: {
                    names: ["Pherekgong","Dibokwane","Hlakola","Moranang","Mopitlo","Phupu","Mosegemanye","Phato","Lewedi","Diphalane","Dibatsela","Manthole"],
                    namesAbbr: ["Phere","Dibo","Hlak","Mora","Mopi","Phupu","Mose","Phato","Lewe","Dipha","Diba","Manth"]
                },
                AM: ["AM","am","AM"],
                PM: ["PM","pm","PM"],
                patterns: {
                    d: "yyyy-MM-dd",
                    D: "yyyy MMMM d, dddd",
                    F: "yyyy MMMM d, dddd HH:mm:ss",
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
                firstDay: 0
            }
        }
    };
})();