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

	module.exports = __webpack_require__(921);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ }),

/***/ 893:
/***/ (function(module, exports) {

	module.exports = require("../../kendo.drawing");

/***/ }),

/***/ 921:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(f, define){
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(922), __webpack_require__(893) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (f), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	})(function(){

	(function ($, undefined) {
	    // Imports ================================================================
	    var math = Math,
	        atan = math.atan,
	        exp = math.exp,
	        pow = math.pow,
	        sin = math.sin,
	        log = math.log,
	        tan = math.tan,

	        kendo = window.kendo,
	        Class = kendo.Class,

	        dataviz = kendo.dataviz,
	        deepExtend = kendo.deepExtend,

	        g = kendo.geometry,
	        Point = g.Point,

	        map = dataviz.map,
	        Location = map.Location,

	        util = kendo.drawing.util,
	        rad = util.rad,
	        deg = util.deg,
	        limit = util.limitValue;

	    // Constants ==============================================================
	    var PI = math.PI,
	        PI_DIV_2 = PI / 2,
	        PI_DIV_4 = PI / 4,
	        DEG_TO_RAD = PI / 180;

	    // Coordinate reference systems ===========================================
	    var WGS84 = {
	        a: 6378137,                 // Semi-major radius
	        b: 6356752.314245179,       // Semi-minor radius
	        f: 0.0033528106647474805,   // Flattening
	        e: 0.08181919084262149      // Eccentricity
	    };

	    // WGS 84 / World Mercator
	    var Mercator = Class.extend({
	        init: function(options) {
	            this._initOptions(options);
	        },

	        MAX_LNG: 180,
	        MAX_LAT: 85.0840590501,
	        INVERSE_ITERATIONS: 15,
	        INVERSE_CONVERGENCE: 1e-12,

	        options: {
	            centralMeridian: 0,
	            datum: WGS84
	        },

	        forward: function(loc, clamp) {
	            var proj = this,
	                options = proj.options,
	                datum = options.datum,
	                r = datum.a,
	                lng0 = options.centralMeridian,
	                lat = limit(loc.lat, -proj.MAX_LAT, proj.MAX_LAT),
	                lng = clamp ? limit(loc.lng, -proj.MAX_LNG, proj.MAX_LNG) : loc.lng,
	                x = rad(lng - lng0) * r,
	                y = proj._projectLat(lat);

	            return new Point(x, y);
	        },

	        _projectLat: function(lat) {
	            var datum = this.options.datum,
	                ecc = datum.e,
	                r = datum.a,
	                y = rad(lat),
	                ts = tan(PI_DIV_4 + y / 2),
	                con = ecc * sin(y),
	                p = pow((1 - con) / (1 + con), ecc / 2);

	            // See:
	            // http://en.wikipedia.org/wiki/Mercator_projection#Generalization_to_the_ellipsoid
	            return r * log(ts * p);
	        },

	        inverse: function(point, clamp) {
	            var proj = this,
	                options = proj.options,
	                datum = options.datum,
	                r = datum.a,
	                lng0 = options.centralMeridian,
	                lng = point.x / (DEG_TO_RAD * r) + lng0,
	                lat = limit(proj._inverseY(point.y), -proj.MAX_LAT, proj.MAX_LAT);

	            if (clamp) {
	                lng = limit(lng, -proj.MAX_LNG, proj.MAX_LNG);
	            }

	            return new Location(lat, lng);
	        },

	        _inverseY: function(y) {
	            var proj = this,
	                datum = proj.options.datum,
	                r = datum.a,
	                ecc = datum.e,
	                ecch = ecc / 2,
	                ts = exp(-y / r),
	                phi = PI_DIV_2 - 2 * atan(ts),
	                i;

	            for (i = 0; i <= proj.INVERSE_ITERATIONS; i++) {
	                var con = ecc * sin(phi),
	                    p = pow((1 - con) / (1 + con), ecch),
	                    dphi = PI_DIV_2 - 2 * atan(ts * p) - phi;

	                phi += dphi;

	                if (math.abs(dphi) <= proj.INVERSE_CONVERGENCE) {
	                    break;
	                }
	            }

	            return deg(phi);
	        }
	    });

	    // WGS 84 / Pseudo-Mercator
	    // Used by Google Maps, Bing, OSM, etc.
	    // Spherical projection of ellipsoidal coordinates.
	    var SphericalMercator = Mercator.extend({
	        MAX_LAT: 85.0511287798,

	        _projectLat: function(lat) {
	            var r = this.options.datum.a,
	                y = rad(lat),
	                ts = tan(PI_DIV_4 + y / 2);

	            return r * log(ts);
	        },

	        _inverseY: function(y) {
	            var r = this.options.datum.a,
	                ts = exp(-y / r);

	            return deg(PI_DIV_2 - (2 * atan(ts)));
	        }
	    });

	    var Equirectangular = Class.extend({
	        forward: function(loc) {
	            return new Point(loc.lng, loc.lat);
	        },

	        inverse: function(point) {
	            return new Location(point.y, point.x);
	        }
	    });

	    // TODO: Better (less cryptic name) for this class(es)
	    var EPSG3857 = Class.extend({
	        init: function() {
	            var crs = this,
	                proj = crs._proj = new SphericalMercator();

	            var c = this.c = 2 * PI * proj.options.datum.a;

	            // Scale circumference to 1, mirror Y and shift origin to top left
	            this._tm = g.transform().translate(0.5, 0.5).scale(1/c, -1/c);

	            // Inverse transform matrix
	            this._itm = g.transform().scale(c, -c).translate(-0.5, -0.5);
	        },

	        // Location <-> Point (screen coordinates for a given scale)
	        toPoint: function(loc, scale, clamp) {
	            var point = this._proj.forward(loc, clamp);

	            return point
	                .transform(this._tm)
	                .scale(scale || 1);
	        },

	        toLocation: function(point, scale, clamp) {
	            point = point
	                .clone()
	                .scale(1 / (scale || 1))
	                .transform(this._itm);

	            return this._proj.inverse(point, clamp);
	        }
	    });

	    var EPSG3395 = Class.extend({
	        init: function() {
	            this._proj = new Mercator();
	        },

	        toPoint: function(loc) {
	            return this._proj.forward(loc);
	        },

	        toLocation: function(point) {
	            return this._proj.inverse(point);
	        }
	    });

	    // WGS 84
	    var EPSG4326 = Class.extend({
	        init: function() {
	            this._proj = new Equirectangular();
	        },

	        toPoint: function(loc) {
	            return this._proj.forward(loc);
	        },

	        toLocation: function(point) {
	            return this._proj.inverse(point);
	        }
	    });

	    // Exports ================================================================
	    deepExtend(dataviz, {
	        map: {
	            crs: {
	                EPSG3395: EPSG3395,
	                EPSG3857: EPSG3857,
	                EPSG4326: EPSG4326
	            },
	            datums: {
	                WGS84: WGS84
	            },
	            projections: {
	                Equirectangular: Equirectangular,
	                Mercator: Mercator,
	                SphericalMercator: SphericalMercator
	            }
	        }
	    });

	})(window.kendo.jQuery);

	}, __webpack_require__(3));


/***/ }),

/***/ 922:
/***/ (function(module, exports) {

	module.exports = require("./location");

/***/ })

/******/ });