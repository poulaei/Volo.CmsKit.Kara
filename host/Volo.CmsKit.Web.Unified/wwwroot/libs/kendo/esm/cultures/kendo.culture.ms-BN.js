import '../kendo.core.js';

(function( window, undefined$1 ) {
    kendo.cultures["ms-BN"] = {
        name: "ms-BN",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ".",
            ".": ",",
            groupSize: [3],
            percent: {
                pattern: ["-n%","n%"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                name: "Brunei Dollar",
                abbr: "BND",
                pattern: ["-$ n","$ n"],
                decimals: 2,
                ",": ".",
                ".": ",",
                groupSize: [3],
                symbol: "$"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"],
                    namesAbbr: ["Ahd","Isn","Sel","Rab","Kha","Jum","Sab"],
                    namesShort: ["Ah","Is","Se","Ra","Kh","Ju","Sa"]
                },
                months: {
                    names: ["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"],
                    namesAbbr: ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogo","Sep","Okt","Nov","Dis"]
                },
                AM: ["PG","pg","PG"],
                PM: ["PTG","ptg","PTG"],
                patterns: {
                    d: "d/MM/yyyy",
                    D: "dd MMMM yyyy",
                    F: "dd MMMM yyyy h:mm:ss tt",
                    g: "d/MM/yyyy h:mm tt",
                    G: "d/MM/yyyy h:mm:ss tt",
                    m: "d MMMM",
                    M: "d MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "h:mm tt",
                    T: "h:mm:ss tt",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 1
            }
        }
    };
})();