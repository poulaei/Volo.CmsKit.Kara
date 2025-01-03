require('./kendo.core.js');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

var tslib_es6 = {
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
};

/**
 * A function that clones the passed date. The parameter could be `null`.
 *
 * @param date - The initial date value.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * cloneDate(new Date(2016, 0, 1)); // returns new Date(2016, 0, 1);
 * cloneDate(null); // returns null
 * ```
 */
var cloneDate = function (date) { return date ? new Date(date.getTime()) : null; };

/**
 * @hidden
 */
var adjustDST = function (date, hour) {
    var newDate = cloneDate(date);
    if (hour === 0 && newDate.getHours() === 23) {
        newDate.setHours(newDate.getHours() + 2);
    }
    return newDate;
};

/**
 * A function that adds and subtracts days from a `Date` object.
 *
 * @param date - The initial date value.
 * @param offset - The number of days to add and subtract from the date.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * addDays(new Date(2016, 0, 1), 5); // 2016-1-6
 * addDays(new Date(2016, 0, 1), -5); // 2015-12-26
 * ```
 */
var addDays = function (date, offset) {
    var newDate = cloneDate(date);
    newDate.setDate(newDate.getDate() + offset);
    return adjustDST(newDate, date.getHours());
};

/**
 * A function which returns a new `Date` instance.
 *
 * @param year - The year value.
 * @param month - The month value.
 * @param day - The day value.
 * @param hours - The hours value.
 * @param minutes - The minutes value.
 * @param seconds - The seconds value.
 * @param milliseconds - milliseconds value.
 * @returns The date instance.
 *
 * @example
 * ```ts-no-run
 * createDate(2016, 0, 15); // 2016-01-15 00:00:00
 * createDate(2016, 0, 15, 22, 22, 20); // 2016-01-15 22:22:20
 * ```
 */
var createDate = function (year, month, day, hours, minutes, seconds, milliseconds) {
    if (hours === void 0) { hours = 0; }
    if (minutes === void 0) { minutes = 0; }
    if (seconds === void 0) { seconds = 0; }
    if (milliseconds === void 0) { milliseconds = 0; }
    var date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    if (year > -1 && year < 100) {
        date.setFullYear(date.getFullYear() - 1900);
    }
    return adjustDST(date, hours);
};

/**
 * A function which returns the last date of the month.
 *
 * @param date - The initial date.
 * @returns - The last date of the initial date month.
 *
 * @example
 * ```ts-no-run
 * lastDayOfMonth(new Date(2016, 0, 15)); // 2016-01-31
 * ```
 */
var lastDayOfMonth = function (date) {
    var newDate = createDate(date.getFullYear(), date.getMonth() + 1, 1, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return addDays(newDate, -1);
};

var MONTHS_LENGTH = 12;
var normalize = function (date, expectedMonth) { return (date.getMonth() !== expectedMonth ? lastDayOfMonth(addMonths(date, -1)) : date //tslint:disable-line:no-use-before-declare
); };
/**
 * A function that adds and subtracts months from a `Date` object.
 *
 * @param date - The initial date value.
 * @param offset - The number of months to add or subtract from the date.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * addMonths(new Date(2016, 5, 1), 5); // 2016-11-1
 * addMonths(new Date(2016, 5, 1), -5); // 2015-1-1
 * ```
 */
var addMonths = function (date, offset) {
    var newDate = cloneDate(date);
    var diff = (newDate.getMonth() + offset) % MONTHS_LENGTH;
    var expectedMonth = (MONTHS_LENGTH + diff) % MONTHS_LENGTH;
    newDate.setMonth(newDate.getMonth() + offset);
    return normalize(adjustDST(newDate, date.getHours()), expectedMonth);
};

/**
 * @hidden
 */
var setYear = function (value, year) {
    var month = value.getMonth();
    var candidate = createDate(year, month, value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    return candidate.getMonth() === month ? candidate : lastDayOfMonth(addMonths(candidate, -1));
};

/**
 * A function that adds and subtracts years from a `Date` object.
 *
 * @param date - The initial date value.
 * @param offset - The number of years to add or subtract from the date.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * addYears(new Date(2016, 5, 1), 5); // 2011-6-1
 * addYears(new Date(2016, 5, 1), -5); // 2021-6-1
 * ```
 */
var addYears = function (value, offset) {
    return adjustDST(setYear(value, value.getFullYear() + offset), value.getHours());
};

/**
 * A function that adds and subtracts centuries from a `Date` object.
 *
 * @param date - The initial date value.
 * @param offset - The number of centuries to add or subtract from the date.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * addCenturies(new Date(2016, 5, 1), 5); // 2516-6-1
 * addCenturies(new Date(2016, 5, 1), -5); // 1516-6-1
 * ```
 */
var addCenturies = function (value, offset) {
    return addYears(value, 100 * offset);
};

/**
 * A function that adds and subtracts decades from a `Date` object.
 *
 * @param date - The initial date value.
 * @param offset - The number of decades to add or subtract from the date.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * addDecades(new Date(2016, 5, 1), 5); // 2066-6-1
 * addDecades(new Date(2016, 5, 1), -5); // 1966-6-1
 * ```
 */
var addDecades = function (value, offset) {
    return addYears(value, 10 * offset);
};

/**
 * A function that adds and subtracts weeks from a Date object.
 *
 * @param date - The initial date value.
 * @param offset - The number of weeks to add/subtract from the date.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * addWeeks(new Date(2016, 5, 1), 3); // 2016-6-22
 * addWeeks(new Date(2016, 5, 1), -3); // 2015-5-11
 * ```
 */
var addWeeks = function (date, offset) {
    return addDays(date, offset * 7);
};

/**
 * The number of milliseconds in one minute.
 */
var MS_PER_MINUTE$1 = 60000;
/**
 * The number of milliseconds in one hour.
 */
var MS_PER_HOUR = 3600000;
/**
 * The number of milliseconds in one standard day.
 */
var MS_PER_DAY = 86400000;

// tslint:disable:max-line-length
/**
 * An enumeration which represents the horizontal direction. The `Forward` option moves forward. The `Backward` option moves backward.
 */
var Direction;
(function (Direction) {
    /**
     * The `Forward` value with an underlying `1` number value.
     */
    Direction[Direction["Forward"] = 1] = "Forward";
    /**
     * The `Backward` value with an underlying `-1` (minus one) number value.
     */
    Direction[Direction["Backward"] = -1] = "Backward";
})(Direction || (Direction = {}));
// tslint:enable:max-line-length

/**
 * @hidden
 *
 * A function which returns the next or previous date for a specific week day. For example, `Day.Monday`.
 *
 * @param date - The date to calculate from.
 * @param weekDay - The `Day` enum specifying the desired week day.
 * @param direction - The `Direction` enum specifying the calculation direction.
 * @returns - A `Date` instance.
 *
 * @example
 * ```ts-no-run
 * dayOfWeek(new Date(2016, 0, 1), Day.Wednesday, Direction.Forward); // 2016-01-06, Wednesday
 * dayOfWeek(new Date(2016, 0, 1), Day.Wednesday, Direction.Backward); // 2015-12-30, Wednesday
 * ```
 */
var dayOfWeek = function (date, weekDay, direction) {
    if (direction === void 0) { direction = Direction.Forward; }
    var newDate = cloneDate(date);
    var newDay = ((weekDay - newDate.getDay()) + (7 * direction)) % 7;
    newDate.setDate(newDate.getDate() + newDay);
    return adjustDST(newDate, date.getHours());
};

/**
 * Enumeration which represents the week days.
 */
var Day;
(function (Day) {
    /**
     * The Sunday value with an underlying `0` number value.
     */
    Day[Day["Sunday"] = 0] = "Sunday";
    /**
     * The Monday value with an underlying `1` number value.
     */
    Day[Day["Monday"] = 1] = "Monday";
    /**
     * The Tuesday value with an underlying `2` number value.
     */
    Day[Day["Tuesday"] = 2] = "Tuesday";
    /**
     * The Wednesday value with an underlying `3` number value.
     */
    Day[Day["Wednesday"] = 3] = "Wednesday";
    /**
     * The Thursday value with an underlying `4` number value.
     */
    Day[Day["Thursday"] = 4] = "Thursday";
    /**
     * The Friday value with an underlying `5` number value.
     */
    Day[Day["Friday"] = 5] = "Friday";
    /**
     * The Saturday value with an underlying `6` number value.
     */
    Day[Day["Saturday"] = 6] = "Saturday";
})(Day || (Day = {}));

/**
 * @hidden
 */
var normalizeYear = function (value, year) { return (setYear(value, year(value.getFullYear()))); };

/**
 * A function that returns a `Date` object of the first decade in a century.
 *
 * @param date - The start date value.
 * @returns - The first year in a century.
 *
 * @example
 * ```ts-no-run
 * firstDecadeOfCentury(new Date(2017, 0, 1)); // 2000-1-1
 * firstDecadeOfCentury(new Date(2007, 10, 22)); // 2000-11-22
 * firstDecadeOfCentury(new Date(2126, 0, 1)); // 2100-1-1
 * ```
 */
var firstDecadeOfCentury = function (value) { return (normalizeYear(value, function (y) { return y - (y % 100); })); };

/**
 * A function that calculates duration in centuries between two `Date` objects.
 *
 * @param start - The start date value.
 * @param end - The end date value.
 * @returns - The duration in months.
 *
 * @example
 * ```ts-no-run
 * durationInCenturies(new Date(2016, 0, 1), new Date(3216, 0, 1)); // 12
 * durationInCenturies(new Date(2016, 6, 1), new Date(2617, 0, 1)); // 6
 * durationInCenturies(new Date(2016, 0, 1), new Date(2016, 0, 1)); // 0
 * ```
 */
var durationInCenturies = function (start, end) { return ((firstDecadeOfCentury(end).getFullYear() - firstDecadeOfCentury(start).getFullYear()) / 100); };

/**
 * A function that returns a `Date` object of the first year in a decade.
 *
 * @param date - The start date value.
 * @returns - The first year in a decade.
 *
 * @example
 * ```ts-no-run
 * firstYearOfDecade(new Date(2017, 0, 1)); // 2010-1-1
 * firstYearOfDecade(new Date(2007, 10, 22)); // 2000-11-22
 * firstYearOfDecade(new Date(2026, 0, 1)); // 2020-1-1
 * ```
 */
var firstYearOfDecade = function (value) { return (normalizeYear(value, function (y) { return y - (y % 10); })); };

/**
 * A function that calculates duration in decades between two `Date` objects.
 *
 * @param start - The start date value.
 * @param end - The end date value.
 * @returns - The duration in months.
 *
 * @example
 * ```ts-no-run
 * durationInDecades(new Date(2016, 0, 1), new Date(2136, 0, 1)); // 12
 * durationInDecades(new Date(2016, 0, 1), new Date(2016, 0, 1)); // 0
 * ```
 */
var durationInDecades = function (start, end) { return ((firstYearOfDecade(end).getFullYear() - firstYearOfDecade(start).getFullYear()) / 10); };

/**
 * A function that calculates duration in months between two `Date` objects.
 *
 * @param start - The start date value.
 * @param end - The end date value.
 * @returns - The duration in months.
 *
 * @example
 * ```ts-no-run
 * durationInMonths(new Date(2016, 0, 1), new Date(2017, 0, 1)); // 12
 * durationInMonths(new Date(2016, 6, 1), new Date(2017, 0, 1)); // 6
 * durationInMonths(new Date(2016, 0, 1), new Date(2016, 0, 1)); // 0
 * ```
 */
var durationInMonths = function (start, end) { return (((end.getFullYear() - start.getFullYear())) * 12 + (end.getMonth() - start.getMonth())); };

/**
 * A function that calculates duration in years between two `Date` objects.
 *
 * @param start - The start date value.
 * @param end - The end date value.
 * @returns - The duration in years.
 *
 * @example
 * ```ts-no-run
 * durationInYears(new Date(2016, 0, 1), new Date(2028, 0, 1)); // 12
 * durationInYears(new Date(2016, 0, 1), new Date(2022, 0, 1)); // 6
 * durationInYears(new Date(2016, 0, 1), new Date(2016, 0, 1)); // 0
 * ```
 */
var durationInYears = function (start, end) { return (end.getFullYear() - start.getFullYear()); };

/**
 *  A function which returns the first date of the current week.
 *
 * @param date - The initial date.
 * @param weekStartDay [default: Day.Sunday] - The first day of the week.
 * @returns - The first date of the current week.
 *
 * @example
 * ```ts-no-run
 * firstDayInWeek(new Date(2016, 0, 15)); // 2016-01-10
 * firstDayInWeek(new Date(2016, 0, 15), Day.Monday); // 2016-01-11
 * ```
 */
var firstDayInWeek = function (date, weekStartDay) {
    if (weekStartDay === void 0) { weekStartDay = Day.Sunday; }
    var first = cloneDate(date);
    while (first.getDay() !== weekStartDay) {
        first.setDate(first.getDate() - 1);
    }
    return first;
};

/**
 * A function which returns the first date of the month.
 *
 * @param date - The initial date.
 * @returns - The first date of the initial date month.
 *
 * @example
 * ```ts-no-run
 * firstDayOfMonth(new Date(2016, 0, 15)); // 2016-01-01
 * ```
 */
var firstDayOfMonth = function (date) {
    return createDate(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

/**
 * @hidden
 */
var setMonth = function (value, month) {
    var day = value.getDate();
    var candidate = createDate(value.getFullYear(), month, day, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    return candidate.getDate() === day ? candidate : lastDayOfMonth(addMonths(candidate, -1));
};

/**
 * A function that returns a `Date` object of the first month in a year.
 *
 * @param date - The start date value.
 * @returns - The first month in a year.
 *
 * @example
 * ```ts-no-run
 * firstMonthOfYear(new Date(2017, 11, 1)); // 2017-1-1
 * firstMonthOfYear(new Date(2017, 0, 1)); // 2017-1-1
 * ```
 */
var firstMonthOfYear = function (value) { return setMonth(value, 0); };

/**
 * A function which returns the passed date with a midnight time portion.
 *
 * @param date - The initial date.
 * @returns - The date with a midnight time portion.
 *
 * @example
 * ```ts-no-run
 * getDate(new Date(2016, 0, 15, 14, 30, 30)); // 2016-01-15 00:00:00
 * ```
 */
var getDate = function (date) {
    return createDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
};

/**
 * A function that compares two dates. The comparison also includes the time portion.
 *
 * @param candidate - The candidate date.
 * @param expected - The expected date.
 * @returns - A Boolean value indicating whether the values are equal.
 *
 * @example
 * ```ts-no-run
 * isEqual(new Date(2016, 0, 1), new Date(2016, 0, 1)); // true
 * isEqual(new Date(2016, 0, 1), new Date(2016, 0, 2)); // false
 * isEqual(new Date(2016, 0, 1, 10), new Date(2016, 0, 1, 20)); // false
 * ```
 */
var isEqual = function (candidate, expected) {
    if (!candidate && !expected) {
        return true;
    }
    return candidate && expected && candidate.getTime() === expected.getTime();
};

/**
 * A function that compares the date portions of 2 dates.
 *
 * @param candidate - The candidate date.
 * @param expected - The expected date.
 * @returns - A Boolean value whether the values are equal.
 *
 * @example
 * ```ts-no-run
 * isEqualDate(new Date(2016, 0, 1, 10), new Date(2016, 0, 1, 20)); // true
 * isEqualDate(new Date(2016, 0, 1, 10), new Date(2016, 0, 2, 10)); // false
 * ```
 */
var isEqualDate = function (candidate, expected) {
    if (!candidate && !expected) {
        return true;
    }
    return candidate && expected && isEqual(getDate(candidate), getDate(expected));
};

/**
 * A function that returns a `Date` object of the last decade in a century.
 *
 * @param date - The start date value.
 * @returns - The last year in a decade.
 *
 * @example
 * ```ts-no-run
 * lastDecadeOfCentury(new Date(2017, 0, 1)); // 2090-1-1
 * lastDecadeOfCentury(new Date(2007, 10, 22)); // 2090-11-22
 * lastDecadeOfCentury(new Date(2126, 0, 1)); // 2190-1-1
 * ```
 */
var lastDecadeOfCentury = function (value) { return (normalizeYear(value, function (y) { return y - (y % 100) + 90; })); };

/**
 * A function that returns a `Date` object of the last month in a year.
 *
 * @param date - The start date value.
 * @returns - The last month in a year.
 *
 * @example
 * ```ts-no-run
 * lastMonthOfYear(new Date(2017, 5, 3)); // 2017-12-3
 * lastMonthOfYear(new Date(2017, 11, 3)); // 2017-12-3
 * ```
 */
var lastMonthOfYear = function (value) { return setMonth(value, 11); };

/**
 * A function that returns a `Date` object of the last year in a decade.
 *
 * @param date - The start date value.
 * @returns - The last year in a decade.
 *
 * @example
 * ```ts-no-run
 * lastYearOfDecade(new Date(2017, 0, 1)); // 2019-1-1
 * lastYearOfDecade(new Date(2007, 10, 22)); // 2009-11-22
 * lastYearOfDecade(new Date(2026, 0, 1)); // 2029-1-1
 * ```
 */
var lastYearOfDecade = function (value) { return (normalizeYear(value, function (y) { return y - (y % 10) + 9; })); };

/**
 * A function which returns a date by a specific week name. For example, `Day.Monday`.
 *
 * @param date - The date to calculate from.
 * @param weekDay - The `Day` enum specifying the desired week day.
 * @returns - A `Date` instance.
 *
 * @example
 * ```ts-no-run
 * nextDayOfWeek(new Date(2016, 0, 1), Day.Wednesday); // 2016-01-06, Wednesday
 * ```
 */
var nextDayOfWeek = function (date, weekDay) {
    return dayOfWeek(date, weekDay, Direction.Forward);
};

/**
 * A function which returns a date by a specific week name. For example, `Day.Monday`.
 *
 * @param date - The date to calculate from.
 * @param weekDay - The `Day` enum specifying the desired week day.
 * @returns - A `Date` instance.
 *
 * @example
 * ```ts-no-run
 * prevDayOfWeek(new Date(2016, 0, 1), Day.Wednesday); // 2015-12-30, Wednesday
 * ```
 */
var prevDayOfWeek = function (date, weekDay) {
    return dayOfWeek(date, weekDay, Direction.Backward);
};

/**
 * @hidden
 *
 * An object which contains the information about the cities within the timezone.
 */
var timezones = {
    rules: {},
    titles: {},
    zones: {}
};

var MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
var DAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
var MS_PER_MINUTE = 60000;
/**
 * @hidden
 *
 * A function that finds zone rules which become applicable after a specific time.
 *
 * @param year - The value of the year.
 * @param rule - A specific zone rule.
 * @param zone - The definition of the zone.
 *
 * @return - Returns an extended rule.
 *
 * @example
 * ```ts-no-run
 * ruleToDate(2018, rule); // A rule that contains {'2018': |2018 DST date| }
 * ```
 */
var ruleToDate = function (year, rule, zoneOffset) {
    var month = rule[3];
    var on = rule[4];
    var time = rule[5];
    var date;
    var ruleOffset = time[3] === 'u' ? -zoneOffset * MS_PER_MINUTE : 0;
    if (!isNaN(on)) {
        date = new Date(Date.UTC(year, MONTHS[month], on, time[0], time[1], time[2]) + ruleOffset);
    }
    else if (on.indexOf('last') === 0) {
        date = new Date(Date.UTC(year, MONTHS[month] + 1, 1, time[0] - 24, time[1], time[2]) + ruleOffset);
        var targetDay = DAYS[on.substr(4, 3)];
        var ourDay = date.getUTCDay();
        date.setUTCDate(date.getUTCDate() + targetDay - ourDay - (targetDay > ourDay ? 7 : 0));
    }
    else if (on.indexOf('>=') >= 0) {
        date = new Date(Date.UTC(year, MONTHS[month], on.substr(5), time[0], time[1], time[2], 0) + ruleOffset);
        var targetDay = DAYS[on.substr(0, 3)];
        var ourDay = date.getUTCDay();
        date.setUTCDate(date.getUTCDate() + targetDay - ourDay + (targetDay < ourDay ? 7 : 0));
    }
    return date;
};

var CURRENT_UTC_TIME = (new Date()).getTime();
/**
 * @hidden
 *
 * A function that finds zone rules which become applicable after a specific time.
 *
 * @param timezone - The timezone name. For example, `America/Chicago`, `Europe/Sofia`.
 * @param utcTime - The UTC time boundary for a zone rule. Defaults to the current UTC time.
 *
 * @return - Returns a zone rule for the specific zone name.
 *
 * @example
 * ```ts-no-run
 * findZone('Europe/Sofia'); //[-120,"EU","EE%sT",null]
 * ```
 */
var findRule = function (zoneRule, utcTime, zoneOffset) {
    if (utcTime === void 0) { utcTime = CURRENT_UTC_TIME; }
    if (zoneOffset === void 0) { zoneOffset = 0; }
    var rules = timezones.rules[zoneRule];
    if (!rules) {
        var time = zoneRule.split(":");
        var offset = 0;
        if (time.length > 1) {
            offset = time[0] * 60 + Number(time[1]);
        }
        return [-1000000, 'max', '-', 'Jan', 1, [0, 0, 0], offset, '-'];
    }
    var year = new Date(utcTime).getUTCFullYear();
    rules = rules.filter(function (currentRule) {
        var from = currentRule[0];
        var to = currentRule[1];
        return from <= year && (to >= year || (from === year && to === "only") || to === "max");
    });
    rules.push(utcTime);
    rules.sort(function (a, b) {
        if (typeof a !== "number") {
            a = Number(ruleToDate(year, a, zoneOffset));
        }
        if (typeof b !== "number") {
            b = Number(ruleToDate(year, b, zoneOffset));
        }
        return a - b;
    });
    var rule = rules[rules.indexOf(utcTime) - 1] || rules[rules.length - 1];
    return isNaN(rule) ? rule : null;
};

/** @hidden */
var NO_TZ_INFO = 'The required {0} timezone information is not provided!';
/** @hidden */
var INVALID_TZ_STRUCTURE = 'The provided timezone information has invalid stucture!';
var formatRegExp = /\{(\d+)}?\}/g;
var flatten = function (arr) { return arr.reduce(function (a, b) { return a.concat(b); }, []); };
/** @hidden */
var formatMessage = function (message) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var flattenValues = flatten(values);
    return message.replace(formatRegExp, function (_, index) { return flattenValues[parseInt(index, 10)]; });
};

/**
 * @hidden
 *
 * A function that gets all zone rules for a specific zone.
 *
 * @param timezone - The timezone name. For example, `America/Chicago`, `Europe/Sofia`.
 *
 * @return - Returns all zone rules for the specific zone name.
 *
 * @example
 * ```ts-no-run
 * findZone('Europe/Sofia'); //[[-120,"E-Eur","EE%sT",883526400000], [-120,"EU","EE%sT",null]]
 * ```
 */
var getZoneRules = function (timezone) {
    var zones = timezones.zones;
    if (!zones) {
        throw new Error(formatMessage(NO_TZ_INFO, timezone));
    }
    var zoneRules = zones[timezone];
    var result = typeof zoneRules === "string" ? zones[zoneRules] : zoneRules;
    if (!result) {
        throw new Error(formatMessage(NO_TZ_INFO, timezone));
    }
    return result;
};

/**
 * @hidden
 *
 * A function that finds zone rules which become applicable after specific time.
 */
var findZone = function (timezone, utcTime) {
    if (utcTime === void 0) { utcTime = new Date().getTime(); }
    if (timezone === 'Etc/UTC' || timezone === 'Etc/GMT') {
        return [0, "-", "UTC", null];
    }
    var zoneRules = getZoneRules(timezone);
    var idx = zoneRules.length - 1;
    for (; idx >= 0; idx--) {
        var until = zoneRules[idx][3];
        if (until && utcTime > until) {
            break;
        }
    }
    var zone = zoneRules[idx + 1];
    if (!zone) {
        throw new Error(formatMessage(NO_TZ_INFO, timezone));
    }
    return zone;
};

/**
 * @hidden
 *
 * A function that gets the information about the zone and the rule for a specific timezone.
 *
 */
var zoneAndRule = function (timezone, date) {
    var utcTime = date.getTime();
    var zone = findZone(timezone, utcTime);
    return {
        rule: findRule(zone[1], utcTime, zone[0]),
        zone: zone
    };
};

// tslint:disable:max-line-length
/**
 * A function which returns the abbreviated name of the timezone. You can specify an optional date for returning the timezone name at a different point in time. The corresponding UTC date is used for locating the relevant rule. Timezone names change both historically and when they reflect the Daylight Savings Time rules.
 *
 * @param timezone - The timezone name. For example, `America/Chicago`, `Europe/Sofia`.
 * @param date - A date for which to locate the zone rule. By default, the current time is used.
 *
 * @return - The abbreviated name of the timezone at the specified date or, if not set, returns now.
 *
 * @example
 * ```ts-no-run
 * import { abbrTimezone } from '@progress/kendo-date-math';
 * import '@progress/kendo-date-math/tz/Europe/Sofia';
 *
 * const dstDate = new Date('2018-04-01T00:00:00Z');
 * console.log(abbrTimezone('Europe/Sofia', dstDate)); // EEST
 *
 * const date = new Date('2018-01-01T00:00:00Z');
 * console.log(abbrTimezone('Europe/Sofia', date)); // EET
 * ```
 */
// tslint:enable:max-line-length
var abbrTimezone = function (timezone, date) {
    if (date === void 0) { date = new Date(); }
    if (timezone === "Etc/UTC") {
        return 'UTC';
    }
    if (timezone === "Etc/GMT") {
        return 'GMT';
    }
    if (timezone === '') {
        return '';
    }
    var _a = zoneAndRule(timezone, date), zone = _a.zone, rule = _a.rule;
    var base = zone[2];
    if (base.indexOf("/") >= 0) {
        return base.split("/")[rule && +rule[6] ? 1 : 0];
    }
    else if (base.indexOf("%s") >= 0) {
        return base.replace("%s", (!rule || rule[7] === "-") ? '' : rule[7]);
    }
    return base;
};

// tslint:disable:max-line-length
/**
 * A function that loads the information about the provided timezone. The details for the loaded timezone will be available to all functions that are related to the manipulation of the timezone.
 *
 * @param timezoneInfo - The information about the timezone that will be loaded.
 *
 * @example
 * ```ts-no-run
 * loadTimezone({ zones: [...], rules: [...]});
 * ```
 */
// tslint:enable:max-line-length
var loadTimezone = function (tzInfo) {
    if (!tzInfo) {
        throw new Error(formatMessage(NO_TZ_INFO, ''));
    }
    var rules = tzInfo.rules, titles = tzInfo.titles, zones = tzInfo.zones;
    if (rules === undefined || zones === undefined) {
        throw new Error(INVALID_TZ_STRUCTURE);
    }
    Object.assign(timezones.rules, rules);
    Object.assign(timezones.titles, titles || {});
    Object.assign(timezones.zones, zones);
};

/**
 * @hidden
 *
 * A function that calculates the time offset based on zone name.
 *
 * @param timezone - The timezone name. For example, `America/Chicago`, `Europe/Sofia`.
 * @param date - A date for which the zone rule will be located.
 *
 * @return - Returns the timezone offset in minutes at the specified time.
 */
var offset = function (timezone, date) {
    if (date === void 0) { date = new Date(); }
    if (timezone === 'Etc/UTC' || timezone === 'Etc/GMT') {
        return 0;
    }
    if (timezone === '') {
        return date.getTimezoneOffset();
    }
    var _a = zoneAndRule(timezone, date), rule = _a.rule, zone = _a.zone;
    return parseFloat(rule ? zone[0] - rule[6] : zone[0]);
};

/**
 * A function that returns a list of grouped timezone names.
 *
 * @return - Returns a list of grouped timezone names.
 *
 * @example
 * ```ts-no-run
 * import '@progress/kendo-date-math/timezones/europe-berlin';
 * import '@progress/kendo-date-math/timezones/europe-sofia';
 *
 * timezoneGroupNames(); // ['(GMT+01:00) Amsterdam, Berlin, ...', '(GMT+02:00) Sofia, Tallinn...']
 * ```
 */
var timezoneGroupNames = function () {
    var groups = Object.keys(timezones.titles).reduce(function (tmp, t) {
        var group = timezones.titles[t].group;
        tmp[group] = group;
        return tmp;
    }, {});
    return Object.keys(groups);
};

/**
 * A function that returns the list of all timezones that are loaded.
 *
 * @return - Returns the list of all timezones that are loaded.
 *
 * @example
 * ```ts-no-run
 * import '@progress/kendo-date-math/timezones/europe-berlin';
 * import '@progress/kendo-date-math/timezones/europe-sofia';
 *
 * timezoneNames(); // ['Europe/Berlin', 'Europe/Sofia']
 * ```
 */
var timezoneNames = function () { return Object.keys(timezones.zones); };

/**
 * A function that returns the full name of the timezone.
 *
 * @param timezone - The timezone name. For example, `America/Chicago`, `Europe/Sofia`.
 *
 * @return - Returns the full names of the timezone and the group.
 *
 * @example
 * ```ts-no-run
 * timezoneTitle('America/Chicago'); // Central Standard Time
 * ```
 */
var timezoneTitle = function (timezone) {
    var titles = timezones.titles;
    var info = titles[timezone] || {};
    return info.long || timezone;
};

/**
 * A function that creates a local date from the UTC date parts of the input.
 *
 * @param date - The date value that will be converted. Only the UTC date parts are read.
 * @return Date - A local date with the UTC time parts of the supplied date.
 *
 * @example
 * ```ts-no-run
 * import { toLocalDate } from '@progress/kendo-date-math'
 *
 * const date = new Date('2016-11-05');
 * const local = toLocalDate(date);
 *
 * // For example, if the browser is in GMT+0200,
 * // the local date will be shifted 2 hours back:
 * //
 * // "Fri Nov 04 2016 22:00:00 GMT+0200"
 * console.log(local);
 *
 * // This is the same as the UTC parts of the input date:
 * //
 * // "2016-11-05T22:00:00.000Z"
 * console.log(date.toISOString());
 * ```
 */
function toLocalDate(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
}

var addMinutes = function (date, minutes) { return new Date(date.getTime() + minutes * MS_PER_MINUTE$1); };
var addHours = function (date, hours) { return new Date(date.getTime() + hours * MS_PER_HOUR); };
var dayAbbr = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];
var monthAbbr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'
];
var datePrefix = function (utcDate) {
    return dayAbbr[utcDate.getUTCDay()] + ' ' + monthAbbr[utcDate.getUTCMonth()];
};
var padNumber = function (num, len) {
    if (len === void 0) { len = 2; }
    var sign = num < 0 ? '-' : '';
    return sign + new Array(len).concat([Math.abs(num)]).join('0').slice(-len);
};
function isZoneMissingHour(date, timezone) {
    var currentOffset = offset(timezone, date);
    var prevHour = addHours(date, -1);
    var prevOffset = offset(timezone, prevHour);
    return currentOffset < prevOffset;
}
function shiftZoneMissingHour(utcDate, timezone) {
    // Adjust for missing hour during DST transition in timezone.
    var dstOffset = isZoneMissingHour(utcDate, timezone) ? 1 : 0;
    return addHours(utcDate, dstOffset);
}
function convertTimezoneUTC(utcLocal, fromTimezone, toTimezone) {
    if (fromTimezone === toTimezone) {
        return utcLocal;
    }
    var fromOffset = offset(fromTimezone, utcLocal);
    var toOffset = offset(toTimezone, utcLocal);
    var baseDiff = fromOffset - toOffset;
    var midDate = addMinutes(utcLocal, baseDiff);
    var midOffset = offset(toTimezone, midDate);
    var dstDiff = toOffset - midOffset;
    return addMinutes(utcLocal, baseDiff + dstDiff);
}
function formatOffset(tzOffset) {
    var sign = tzOffset <= 0 ? '+' : '-';
    var value = Math.abs(tzOffset);
    var hours = padNumber(Math.floor(value / 60));
    var minutes = padNumber(value % 60);
    return "GMT" + sign + hours + minutes;
}
/**
 * Represents a local date in a specified timezone.
 *
 * The following example demonstrates how to convert a local date to the specified timezone.
 *
 * @example
 * ```ts-no-run
 * import { ZonedDate } from '@progress/kendo-date-math';
 * import '@progress/kendo-date-math/tz/America/New_York';
 *
 * const date = new Date('2018-03-13T00:00:00Z');
 * const tzDate = ZonedDate.fromLocalDate(date, 'America/New_York');
 *
 * // If you run this example in GMT+0200,
 * // the output will be '2018-03-12T22:00:00.000Z'.
 * console.log(tzDate.toISOString());
 * ```
 *
 * The following example demonstrates how to convert between timezones.
 *
 * @example
 * ```ts-no-run
 * import { ZonedDate } from '@progress/kendo-date-math';
 * import '@progress/kendo-date-math/tz/America/New_York';
 * import '@progress/kendo-date-math/tz/America/Los_Angeles';
 *
 * // Note the "Z" suffix for UTC dates.
 * const date = new Date('2018-03-12T22:00:00Z');
 *
 * const tzDate = ZonedDate.fromLocalDate(date, 'America/New_York');
 * const result = tzDate.toTimezone('America/Los_Angeles');
 *
 * // Regardless of the browser timezone
 * // the output will be '2018-03-12T15:00:00.000Z'.
 * console.log(tzDate.toUTCDate());
 * ```
 */
var ZonedDate = /** @class */ (function () {
    // The constructor is aliased as a static fromUTCDate method
    // to clarify the meaning of the utcDate parameter.
    //
    // It can be confused for a local date time while it is in fact
    // treated as a UTC date that represents the local date in the timezone.
    function ZonedDate(utcDate, timezone) {
        this._utcDate = cloneDate(utcDate);
        this.timezone = timezone;
        var tzOffset = offset(timezone, utcDate);
        this.timezoneOffset = tzOffset;
        var localDate = shiftZoneMissingHour(utcDate, timezone);
        this._localDate = convertTimezoneUTC(localDate, timezone, 'Etc/UTC');
    }
    Object.defineProperty(ZonedDate.prototype, "cachedLocalDate", {
        /**
         * Returns a cached local date that denotes the exact time in the set timezone.
         *
         * @return Date - A local date that denotes the exact time in the set timezone.
         *
         * This property is an alternative to `toLocalDate()` that returns a cached value instead of cloning it.
         *
         * > Modifying the returned instance will corrupt the `ZonedDate` state.
         */
        get: function () {
            return this._localDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZonedDate.prototype, "cachedUTCDate", {
        /**
         * Returns a cached `Date` instance with UTC date parts that are set to the local time in the set timezone.
         *
         * @returns Date - A `Date` with UTC date parts that are set to the local time in the set timezone.
         *
         * This property is an alternative to `toUTCDate()` that returns a cached value instead of cloning it.
         *
         * > Modifying the returned instance will corrupt the `ZonedDate` state.
         */
        get: function () {
            return this._utcDate;
        },
        enumerable: true,
        configurable: true
    });
    // tslint:disable:max-line-length
    /**
     * Converts an existing date to a specified timezone.
     *
     * If the `timezone` parameter is omitted, the `ZonedDate` defaults to the timezone of the browser. This concept is known as "floating date" because it does not represent a particular moment in time. Instead, its actual value depends on the current timezone of the browser.
     *
     * @param date - The local date that represents the actual time instance.
     * @param timezone - The ID of the timezone that will be assumed. For example, `Europe/Sofia`.
     * @return ZonedDate - The date in the specified timezone.
     *
     * @example
     * ```ts-no-run
     * import { ZonedDate } from '@progress/kendo-date-math';
     * import '@progress/kendo-date-math/tz/America/New_York';
     *
     * const date = new Date('2018-03-13T00:00:00');
     * const tzDate = ZonedDate.fromLocalDate(date, 'America/New_York');
     *
     * // If you run this example in GMT+0200,
     * // the output will be 'Mon Mar 12 2018 18:00:00 GMT+0200 (EET)'.
     * console.log(tzDate.toString());
     *
     * // If you run this example in UTC,
     * // the output will be '2018-03-12T22:00:00.000Z'.
     * console.log(tzDate.toISOString());
     * ```
     */
    // tslint:enable:max-line-length
    ZonedDate.fromLocalDate = function (date, timezone) {
        if (timezone === void 0) { timezone = ''; }
        var utcDate = convertTimezoneUTC(date, 'Etc/UTC', timezone);
        var shiftZone = isZoneMissingHour(utcDate, timezone);
        var zoneOffset = offset(timezone, utcDate);
        var fixedOffset = 0;
        if (shiftZone) {
            // Adjust for the missing hour during the DST transition in the timezone.
            fixedOffset = zoneOffset > 0 ? -1 : 1;
        }
        var adjDate = addHours(utcDate, fixedOffset);
        return ZonedDate.fromUTCDate(adjDate, timezone);
    };
    // tslint:disable:max-line-length
    /**
     * Creates a date in a specific timezone from the UTC date parts of the supplied `Date`.
     *
     * If the `timezone` parameter is omitted, the `ZonedDate` defaults to the timezone of the browser. This concept is known as "floating date" because it does not represent a particular moment in time. Instead, its actual value depends on the current timezone of the browser.
     *
     * @param date - The UTC date that represents the time in the target zone. This time is not the actual time instant in UTC.
     * @param timezone - The ID of the timezone that will be assumed. For example, `Europe/Sofia`.
     * @return ZonedDate - The date in the specified timezone.
     *
     * @example
     * ```ts-no-run
     * import { ZonedDate } from '@progress/kendo-date-math';
     * import '@progress/kendo-date-math/tz/America/New_York';
     *
     * // Note the "Z" suffix for UTC dates.
     * const date = new Date('2018-03-12T18:00:00Z');
     *
     * // Alternative syntax using Date.UTC
     * // const date = new Date(Date.UTC(2018, 2, 12, 18, 0));
     *
     * const tzDate = ZonedDate.fromUTCDate(date, 'America/New_York');
     *
     * // Regardless of the browser timezone
     * // the output will be 'Mon Mar 12 2018 18:00:00 GMT+0200 (EET)'.
     * console.log(tzDate.toString());
     *
     * // Regardless of the browser timezone
     * // the output in UTC will be '2018-03-12T22:00:00.000Z'.
     * console.log(tzDate.toISOString());
     * ```
     */
    // tslint:enable:max-line-length
    ZonedDate.fromUTCDate = function (utcDate, timezone) {
        if (timezone === void 0) { timezone = ''; }
        return new ZonedDate(utcDate, timezone);
    };
    /**
     * Returns a local date that denotes the exact time in the set timezone.
     *
     * @return Date - A local date that denotes the exact time in the set timezone.
     *
     * @example
     * ```ts-no-run
     * import { ZonedDate } from '@progress/kendo-date-math';
     * import '@progress/kendo-date-math/tz/America/New_York';
     *
     * // Note the "Z" suffix for UTC dates.
     * const date = new Date('2018-03-12T18:00:00Z');
     * const tzDate = ZonedDate.fromUTCDate(date, 'America/New_York');
     *
     * // The local date represents the same moment in time as the ZonedDate:
     * // `2018-03-12T22:00:00.000Z`.
     * console.log(tzDate.toLocalDate().toISOString());
     *
     * // The local date will apply the timezone of the browser. For example,
     * // `Tue Mar 13 2018 00:00:00 GMT+0200 (Eastern European Standard Time)`.
     * console.log(tzDate.toLocalDate().toString())
     * ```
     */
    ZonedDate.prototype.toLocalDate = function () {
        return cloneDate(this._localDate);
    };
    /**
     * Returns a `Date` instance with UTC date parts that are set to the local time in the set timezone.
     *
     * @returns Date - A `Date` with UTC date parts that are set to the local time in the set timezone.
     *
     * @example
     * ```ts-no-run
     * import { ZonedDate } from '@progress/kendo-date-math';
     * import '@progress/kendo-date-math/tz/America/New_York';
     *
     * // Note the "Z" suffix for UTC dates.
     * const date = new Date('2018-03-12T18:00:00Z');
     * const tzDate = ZonedDate.fromUTCDate(date, 'America/New_York');
     *
     * // Regardless of the browser timezone
     * // the output will be '2018-03-12T18:00:00.000Z'.
     * console.log(tzDate.toUTCDate());
     * ```
     */
    ZonedDate.prototype.toUTCDate = function () {
        return cloneDate(this._utcDate);
    };
    /**
     * Converts the date to the specified timezone.
     *
     * @param toTimezone - The timezone to which the values will be converted. For example, `America/Los_Angeles`.
     * @returns ZonedDate - The resulting zoned date.
     *
     * @example
     * ```ts-no-run
     * import { ZonedDate } from '@progress/kendo-date-math';
     * import '@progress/kendo-date-math/tz/America/New_York';
     * import '@progress/kendo-date-math/tz/America/Los_Angeles';
     *
     * // Note the "Z" suffix for UTC dates.
     * const date = new Date('2018-03-12T22:00:00Z');
     *
     * const tzDate = ZonedDate.fromLocalDate(date, 'America/New_York');
     * const result = tzDate.toTimezone('America/Los_Angeles');
     *
     * // Regardless of the browser timezone
     * // the output will be '2018-03-12T15:00:00.000Z'.
     * console.log(tzDate.toUTCDate());
     * ```
     */
    ZonedDate.prototype.toTimezone = function (toTimezone) {
        if (this.timezone === toTimezone) {
            return this.clone();
        }
        var tzOffset = offset(this.timezone, this._utcDate);
        var date = addMinutes(this._utcDate, tzOffset);
        return ZonedDate.fromLocalDate(date, toTimezone);
    };
    /**
     * Returns a new instance that represents the same date.
     *
     * @returns Date - A copy of the instance of the current zoned date.
     */
    ZonedDate.prototype.clone = function () {
        return ZonedDate.fromUTCDate(this._utcDate, this.timezone);
    };
    // tslint:disable:max-line-length
    /**
     * Adds the specified number of days and returns a new instance with the resulting date in the same timezone.
     *
     * @param days - The number of days that will be added.
     * @returns ZonedDate - The resulting date.
     */
    // tslint:enable:max-line-length
    ZonedDate.prototype.addDays = function (days) {
        var newDate = new Date(this._utcDate.getTime());
        newDate.setUTCDate(newDate.getUTCDate() + days);
        return ZonedDate.fromUTCDate(newDate, this.timezone);
    };
    // tslint:disable:max-line-length
    /**
     * Adds the specified number of milliseconds and returns a new instance with the resulting date in the same timezone.
     *
     * The method compensates for DST transitions and ensures that the resulting date occurs exactly after the set amount of time in the timezone.
     *
     * @param milliseconds - The number of days that will be added.
     * @returns ZonedDate - The resulting date.
     */
    // tslint:enable:max-line-length
    ZonedDate.prototype.addTime = function (milliseconds) {
        var utcDate = new Date(this._utcDate.getTime());
        var utcMid = shiftZoneMissingHour(utcDate, this.timezone);
        utcMid.setTime(utcMid.getTime() + milliseconds);
        var utcResult = shiftZoneMissingHour(utcMid, this.timezone);
        return ZonedDate.fromUTCDate(utcResult, this.timezone);
    };
    // tslint:disable:max-line-length
    /**
     * Returns a new instance of the same zoned date having its time parts set to `00:00:00.000`.
     *
     * @returns ZonedDate - The same date having its time parts set to `00:00:00.000`.
     */
    // tslint:enable:max-line-length
    ZonedDate.prototype.stripTime = function () {
        var date = this._utcDate;
        var ticks = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
        return ZonedDate.fromUTCDate(new Date(ticks), this.timezone);
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getTime = function () {
        return this._localDate.getTime();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getTimezoneOffset = function () {
        return this.timezoneOffset;
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getFullYear = function () {
        return this._utcDate.getUTCFullYear();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getMonth = function () {
        return this._utcDate.getUTCMonth();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getDate = function () {
        return this._utcDate.getUTCDate();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getDay = function () {
        return this._utcDate.getUTCDay();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getHours = function () {
        return this._utcDate.getUTCHours();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getMinutes = function () {
        return this._utcDate.getUTCMinutes();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getSeconds = function () {
        return this._utcDate.getUTCSeconds();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getMilliseconds = function () {
        return this._utcDate.getUTCMilliseconds();
    };
    // The local date UTC parts represent actual UTC time
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCDate = function () {
        return this._localDate.getUTCDate();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCDay = function () {
        return this._localDate.getUTCDay();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCFullYear = function () {
        return this._localDate.getUTCFullYear();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCHours = function () {
        return this._localDate.getUTCHours();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCMilliseconds = function () {
        return this._localDate.getUTCMilliseconds();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCMinutes = function () {
        return this._localDate.getUTCMinutes();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.getUTCMonth = function () {
        return this._localDate.getUTCMonth();
    };
    /** @hidden */
    ZonedDate.prototype.getUTCSeconds = function () {
        return this._localDate.getUTCSeconds();
    };
    /** @hidden */
    ZonedDate.prototype.setTime = function (time) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setMilliseconds = function (ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCMilliseconds = function (ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setSeconds = function (sec, ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCSeconds = function (sec, ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setMinutes = function (min, sec, ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCMinutes = function (min, sec, ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setHours = function (hours, min, sec, ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCHours = function (hours, min, sec, ms) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setDate = function (date) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCDate = function (date) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setMonth = function (month, date) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCMonth = function (month, date) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setFullYear = function (year, month, date) {
        throw new Error("Method not implemented.");
    };
    /** @hidden */
    ZonedDate.prototype.setUTCFullYear = function (year, month, date) {
        throw new Error("Method not implemented.");
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.toISOString = function () {
        return this._localDate.toISOString();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.toJSON = function () {
        return this._localDate.toJSON();
    };
    /**
     * @hidden
     */
    ZonedDate.prototype.toString = function () {
        var dateString = datePrefix(this._utcDate);
        var timeString = this.toTimeString();
        return dateString + " " + this.getDate() + " " + this.getFullYear() + " " + timeString;
    };
    /** @hidden */
    ZonedDate.prototype.toDateString = function () {
        return toLocalDate(this._utcDate).toDateString();
    };
    /** @hidden */
    ZonedDate.prototype.toTimeString = function () {
        var hours = padNumber(this.getHours());
        var minutes = padNumber(this.getMinutes());
        var seconds = padNumber(this.getSeconds());
        var time = hours + ":" + minutes + ":" + seconds;
        var tzOffset = formatOffset(this.timezoneOffset);
        var abbrev = abbrTimezone(this.timezone, this._utcDate);
        if (abbrev) {
            abbrev = " (" + abbrev + ")";
        }
        return time + " " + tzOffset + abbrev;
    };
    ZonedDate.prototype.toLocaleString = function (locales, options) {
        return this._localDate.toLocaleString(locales, options);
    };
    ZonedDate.prototype.toLocaleDateString = function (locales, options) {
        return this._localDate.toLocaleDateString(locales, options);
    };
    ZonedDate.prototype.toLocaleTimeString = function (locales, options) {
        return this._localDate.toLocaleTimeString(locales, options);
    };
    /** @hidden */
    ZonedDate.prototype.toUTCString = function () {
        return this.toTimezone('Etc/UTC').toString();
    };
    ZonedDate.prototype[Symbol.toPrimitive] = function (hint) {
        if (hint === 'string' || hint === 'default') {
            return this.toString();
        }
        return this._localDate.getTime();
    };
    /** @hidden */
    ZonedDate.prototype.valueOf = function () {
        return this.getTime();
    };
    /** @hidden */
    ZonedDate.prototype.getVarDate = function () {
        throw new Error('Not implemented.');
    };
    /** @hidden */
    ZonedDate.prototype.format = function (_) {
        throw new Error('Not implemented.');
    };
    /** @hidden */
    ZonedDate.prototype.formatUTC = function (_) {
        throw new Error('Not implemented.');
    };
    return ZonedDate;
}());

/**
 * A function that returns all timezones which match the title of the zone.
 *
 * @param group - The fully qualified zone title. For example, Central Standard Time.
 *
 * @return - Returns the list of all matching timezone names. For example, `[America/Chicago, ...]`.
 *
 * @example
 * ```ts-no-run
 * zonesPerGroup('(GMT+01:00) Amsterdam, Berlin'); // ['Europe/Amsterdam', 'Europe/Berlin'...]
 * ```
 */
var zonesPerGroup = function (group) {
    var titles = timezones.titles;
    return Object.keys(titles).reduce(function (result, title) {
        var info = titles[title] || {};
        return info.group === group ? result.concat(title.split(' ')) : result;
    }, []);
};

var moveDateToWeekStart = function (date, weekStartDay) {
    if (weekStartDay !== Day.Monday) {
        return addDays(prevDayOfWeek(date, weekStartDay), 4);
    }
    return addDays(date, (4 - (date.getDay() || 7)));
};
var calcWeekInYear = function (date, weekStartDay) {
    var firstWeekInYear = createDate(date.getFullYear(), 0, 1, -6);
    var newDate = moveDateToWeekStart(date, weekStartDay);
    var diffInMS = newDate.getTime() - firstWeekInYear.getTime();
    var days = Math.floor(diffInMS / MS_PER_DAY);
    return 1 + Math.floor(days / 7);
};
/**
 * A function that returns the number of the week within a year, which is calculated in relation to the date.
 *
 * For more information, refer to the [**ISO week date**](https://en.wikipedia.org/wiki/ISO_week_date) article.
 *
 * @param date - The date used for the week number calculation.
 * @param weekStartDay - The first day of the week. By default, the first week day is Monday.
 * @returns - The number of the week within the year.
 *
 * @example
 * ```ts-no-run
 * weekInYear(new Date(2016, 0, 1)); // Week 53, 2015
 * weekInYear(new Date(2016, 0, 5)); // Week 1, 2016
 * weekInYear(new Date(2017, 0, 1)); // Week 52, 2016
 * weekInYear(new Date(2017, 0, 2)); // Week 1, 2017
 * ```
 */
var weekInYear = function (date, weekStartDay) {
    if (weekStartDay === void 0) { weekStartDay = Day.Monday; }
    date = getDate(date);
    var prevWeekDate = addDays(date, -7);
    var nextWeekDate = addDays(date, 7);
    var weekNumber = calcWeekInYear(date, weekStartDay);
    if (weekNumber === 0) {
        return calcWeekInYear(prevWeekDate, weekStartDay) + 1;
    }
    if (weekNumber === 53 && calcWeekInYear(nextWeekDate, weekStartDay) > 1) {
        return 1;
    }
    return weekNumber;
};

var Mask = /** @class */ (function () {
    function Mask() {
        this.symbols = '';
        this.partMap = [];
    }
    return Mask;
}());

var Constants = {
    formatSeparator: "_",
    twoDigitYearMax: 68,
    defaultDateFormat: "d",
    defaultLocaleId: "en"
};

var Key = {
    DELETE: "Delete",
    BACKSPACE: "Backspace",
    TAB: "Tab",
    ENTER: "Enter",
    ESCAPE: "Escape",
    ARROW_LEFT: "ArrowLeft",
    ARROW_UP: "ArrowUp",
    ARROW_RIGHT: "ArrowRight",
    ARROW_DOWN: "ArrowDown",
    SPACE: " ",
    END: "End",
    HOME: "Home",
    PAGE_UP: "PageUp",
    PAGE_DOWN: "PageDown"
};

/**
 * @hidden
 */
var padZero = function (length) { return new Array(Math.max(length, 0)).fill('0').join(''); };
/**
 * @hidden
 */
var unpadZero = function (value) { return value.replace(/^0*/, ''); };
/**
 * @hidden
 */
var approximateStringMatching = function (_a) {
    /*
      Remove the right part of the cursor.
      oldFormat = oldFormat.substring(0, caret + oldText.length - newText.length);
    */
    var oldText = _a.oldText, newText = _a.newText, formatPattern = _a.formatPattern, selectionStart = _a.selectionStart, isInCaretMode = _a.isInCaretMode, keyEvent = _a.keyEvent;
    var oldTextSeparator = oldText[selectionStart + oldText.length - newText.length];
    var oldSegmentText = oldText.substring(0, selectionStart + oldText.length - newText.length);
    var newSegmentText = newText.substring(0, selectionStart);
    var diff = [];
    /* Handle the typing of a single character over the same selection. */
    if (oldSegmentText === newSegmentText && selectionStart > 0) {
        diff.push([formatPattern[selectionStart - 1], newSegmentText[selectionStart - 1]]);
        return diff;
    }
    if (oldSegmentText.indexOf(newSegmentText) === 0 && (isInCaretMode &&
        (keyEvent.key === Key.DELETE || keyEvent.key === Key.BACKSPACE)) ||
        (oldSegmentText.indexOf(newSegmentText) === 0 && !isInCaretMode &&
            (newSegmentText.length === 0 ||
                formatPattern[newSegmentText.length - 1] !== formatPattern[newSegmentText.length]))) {
        /* Handle Delete/Backspace. */
        var deletedSymbol = '';
        /*
            The whole text is replaced by the same character.
            A nasty patch is required to keep the selection in the first segment.
        */
        if (!isInCaretMode && newSegmentText.length === 1) {
            diff.push([formatPattern[0], newSegmentText[0]]);
        }
        for (var i = newSegmentText.length; i < oldSegmentText.length; i++) {
            if (formatPattern[i] !== deletedSymbol && formatPattern[i] !== Constants.formatSeparator) {
                deletedSymbol = formatPattern[i];
                diff.push([deletedSymbol, '']);
            }
        }
        return diff;
    }
    /*
        Handle the insertion of the text (the new text is longer than the previous one).
        Handle the typing over a literal as well.
    */
    if ((isInCaretMode &&
        (newSegmentText.indexOf(oldSegmentText) === 0 ||
            formatPattern[selectionStart - 1] === Constants.formatSeparator)) ||
        (!isInCaretMode &&
            (newSegmentText.indexOf(oldSegmentText) === 0 ||
                formatPattern[selectionStart - 1] === Constants.formatSeparator))) {
        var symbol = formatPattern[0];
        for (var i = Math.max(0, oldSegmentText.length - 1); i < formatPattern.length; i++) {
            if (formatPattern[i] !== Constants.formatSeparator) {
                symbol = formatPattern[i];
                break;
            }
        }
        return [[symbol, newSegmentText[selectionStart - 1]]];
    }
    /* Handle the entering of a space or a separator for navigating to the next item. */
    if ((newSegmentText[newSegmentText.length - 1] === ' ') ||
        (newSegmentText[newSegmentText.length - 1] === oldTextSeparator)) {
        return [[formatPattern[selectionStart - 1], Constants.formatSeparator]];
    }
    /* Handle typing over a correctly selected part. */
    var result = [[formatPattern[selectionStart - 1], newSegmentText[selectionStart - 1]]];
    return result;
};
/**
 * @hidden
 */
var dateSymbolMap = function (map, part) {
    map[part.pattern[0]] = part.type;
    return map;
};
/**
 * @hidden
 */
var isInRange = function (candidate, min, max) { return (candidate === null || !((min && min > candidate) || (max && max < candidate))); };

var isObject = function (value) { return value && typeof (value) === "object" && !Array.isArray(value); };
var isHtmlElement = function (element) { return element instanceof HTMLElement; };
var dateSetter = function (method) { return function (date, value) {
    var clone = cloneDate(date);
    clone[method](value);
    return clone;
}; };
/**
 * @hidden
 */
var isPresent = function (value) { return value !== undefined && value !== null; };
/**
 * @hidden
 */
var isDocumentAvailable = function () { return !!document; };
/**
 * @hidden
 */
var isNumber = function (value) { return isPresent(value) && typeof (value) === "number" && !Number.isNaN(value); };
/**
 * @hidden
 */
var parseToInt = function (value) { return parseInt(value, 10); };
/**
 * @hidden
 */
var clamp = function (value, min, max) { return Math.min(max, Math.max(min, value)); };
/**
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var extend = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Object.assign.apply(Object, args);
};
/**
 * @hidden
 */
var deepExtend = function (target) {
    var _a, _b;
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length) {
        return target;
    }
    var source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (var key in source) {
            if (isHtmlElement(source[key])) {
                target[key] = source[key];
            }
            else if (isObject(source[key]) && !(source[key] instanceof Date)) {
                if (!target[key] || !isObject(target[key])) {
                    extend(target, (_a = {}, _a[key] = {}, _a));
                }
                deepExtend(target[key], source[key]);
            }
            else {
                extend(target, (_b = {}, _b[key] = source[key], _b));
            }
        }
    }
    return deepExtend.apply(void 0, [target].concat(sources));
};
/**
 * @hidden
 */
var noop = function () { };
/**
 * @hidden
 */
var isFunction = function (fn) { return typeof (fn) === "function"; };
/**
 * @hidden
 */
var cropTwoDigitYear = function (date) {
    if (!isPresent(date) || isNaN(date.getTime())) {
        return 0;
    }
    return Number(date
        .getFullYear()
        .toString()
        .slice(-2));
};
/**
 * @hidden
 */
var setYears = dateSetter('setFullYear');
/**
 * @hidden
 */
var millisecondDigitsInFormat = function (format) {
    var result = format && format.match(/S+(\1)/);
    return result ? result[0].length : 0;
};
/**
 * @hidden
 */
var millisecondStepFor = function (digits) {
    return Math.pow(10, 3 - digits);
};
/**
 * @hidden
 */
var areDatePartsEqualTo = function (date, year, month, day, hour, minutes, seconds, milliseconds) {
    if (date &&
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day &&
        date.getHours() === hour &&
        date.getMinutes() === minutes &&
        date.getSeconds() === seconds &&
        date.getMilliseconds() === milliseconds) {
        return true;
    }
    return false;
};
/**
 * @hidden
 */
var isValidDate = function (value) { return isPresent(value) && value.getTime && isNumber(value.getTime()); };

var PREVIOUS_CENTURY_BASE = 1900;
var CURRENT_CENTURY_BASE = 2000;
var SHORT_PATTERN_LENGTH_REGEXP = /d|M|H|h|m|s/;
var MONTH_PART_WITH_WORDS_THRESHOLD = 2;
var MONTH_SYMBOL = "M";
// JS months start from 0 (January) instead of 1 (January)
var JS_MONTH_OFFSET = 1;
var DateObject = /** @class */ (function () {
    function DateObject(_a) {
        var intlService = _a.intlService, formatPlaceholder = _a.formatPlaceholder, format = _a.format, _b = _a.cycleTime, cycleTime = _b === void 0 ? false : _b, _c = _a.twoDigitYearMax, twoDigitYearMax = _c === void 0 ? Constants.twoDigitYearMax : _c, _d = _a.value, value = _d === void 0 ? null : _d, _e = _a.autoCorrectParts, autoCorrectParts = _e === void 0 ? true : _e;
        this.year = true;
        this.month = true;
        this.date = true;
        this.hours = true;
        this.minutes = true;
        this.seconds = true;
        this.milliseconds = true;
        this.dayperiod = true;
        this.leadingZero = null;
        this.typedMonthPart = '';
        this.knownParts = 'adHhmMsEyS';
        this.symbols = {
            'E': 'E',
            'H': 'H',
            'M': 'M',
            'a': 'a',
            'd': 'd',
            'h': 'h',
            'm': 'm',
            's': 's',
            'y': 'y',
            'S': 'S'
        };
        this._value = getDate(new Date());
        this.cycleTime = false;
        this._partiallyInvalidDate = {
            startDate: null,
            invalidDateParts: {
                'E': { value: null, date: null, startDateOffset: 0 },
                'H': { value: null, date: null, startDateOffset: 0 },
                'M': { value: null, date: null, startDateOffset: 0 },
                'a': { value: null, date: null, startDateOffset: 0 },
                'd': { value: null, date: null, startDateOffset: 0 },
                'h': { value: null, date: null, startDateOffset: 0 },
                'm': { value: null, date: null, startDateOffset: 0 },
                's': { value: null, date: null, startDateOffset: 0 },
                'y': { value: null, date: null, startDateOffset: 0 },
                'S': { value: null, date: null, startDateOffset: 0 }
            }
        };
        this.setOptions({
            intlService: intlService,
            formatPlaceholder: formatPlaceholder,
            format: format,
            cycleTime: cycleTime,
            twoDigitYearMax: twoDigitYearMax,
            value: value,
            autoCorrectParts: autoCorrectParts
        });
        if (!value) {
            this._value = getDate(new Date());
            var sampleFormat = this.dateFormatString(this.value, this.format).symbols;
            for (var i = 0; i < sampleFormat.length; i++) {
                this.setExisting(sampleFormat[i], false);
            }
        }
        else {
            this._value = cloneDate(value);
        }
    }
    Object.defineProperty(DateObject.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (value && !(value instanceof Date)) {
                // throw new Error("The 'value' should be a valid JavaScript Date instance.");
                return;
            }
            this._value = value;
            this.resetInvalidDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateObject.prototype, "localeId", {
        get: function () {
            var localeId = Constants.defaultLocaleId;
            var cldrKeys = Object.keys(this.intl.cldr);
            for (var i = 0; i < cldrKeys.length; i++) {
                var key = cldrKeys[i];
                var value = this.intl.cldr[key];
                if (value.name && value.calendar && value.numbers &&
                    value.name !== Constants.defaultLocaleId) {
                    localeId = value.name;
                    break;
                }
            }
            return localeId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    DateObject.prototype.setOptions = function (options) {
        this.intl = options.intlService;
        this.formatPlaceholder = options.formatPlaceholder || 'wide';
        this.format = options.format;
        this.cycleTime = options.cycleTime;
        this.monthNames = this.allFormattedMonths(this.localeId);
        this.dayPeriods = this.allDayPeriods(this.localeId);
        this.twoDigitYearMax = options.twoDigitYearMax;
        this.autoCorrectParts = options.autoCorrectParts;
    };
    DateObject.prototype.setValue = function (value) {
        if (!value) {
            this._value = getDate(new Date());
            this.modifyExisting(false);
        }
        else if (!isEqual(value, this._value)) {
            this._value = cloneDate(value);
            this.modifyExisting(true);
        }
        this.resetInvalidDate();
    };
    /**
     * @hidden
     */
    DateObject.prototype.hasValue = function () {
        var _this = this;
        var pred = function (a, p) { return a || p.type !== 'literal' && p.type !== 'dayperiod' && _this.getExisting(p.pattern[0]); };
        return this.intl.splitDateFormat(this.format, this.localeId).reduce(pred, false);
    };
    /**
     * @hidden
     */
    DateObject.prototype.getValue = function () {
        for (var i = 0; i < this.knownParts.length; i++) {
            if (!this.getExisting(this.knownParts[i])) {
                return null;
            }
        }
        return cloneDate(this.value);
    };
    /**
     * @hidden
     */
    DateObject.prototype.getFormattedDate = function (format) {
        return this.intl.formatDate(this.getValue(), format, this.localeId);
    };
    /**
     * @hidden
     */
    DateObject.prototype.getTextAndFormat = function (customFormat) {
        if (customFormat === void 0) { customFormat = ""; }
        var format = customFormat || this.format;
        var text = this.intl.formatDate(this.value, format, this.localeId);
        var mask = this.dateFormatString(this.value, format);
        if (!this.autoCorrectParts && this._partiallyInvalidDate.startDate) {
            var partiallyInvalidText = "";
            var formattedDate = this.intl.formatDate(this.value, format, this.localeId);
            var formattedDates = this.getFormattedInvalidDates(format);
            for (var i = 0; i < formattedDate.length; i++) {
                var symbol = mask.symbols[i];
                if (mask.partMap[i].type === "literal") {
                    partiallyInvalidText += text[i];
                }
                else if (this.getInvalidDatePartValue(symbol)) {
                    var partsForSegment = this.getPartsForSegment(mask, i);
                    if (symbol === "M") {
                        var datePartText = (parseToInt(this.getInvalidDatePartValue(symbol)) + JS_MONTH_OFFSET).toString();
                        if (partsForSegment.length > MONTH_PART_WITH_WORDS_THRESHOLD) {
                            partiallyInvalidText += formattedDates[symbol][i];
                        }
                        else {
                            if (this.getInvalidDatePartValue(symbol)) {
                                var formattedDatePart = padZero(partsForSegment.length - datePartText.length) + datePartText;
                                partiallyInvalidText += formattedDatePart;
                                // add -1 as the first character in the segment is at index i
                                i += partsForSegment.length - 1;
                            }
                            else {
                                partiallyInvalidText += formattedDates[symbol][i];
                            }
                        }
                    }
                    else {
                        if (this.getInvalidDatePartValue(symbol)) {
                            var datePartText = this.getInvalidDatePartValue(symbol).toString();
                            var formattedDatePart = padZero(partsForSegment.length - datePartText.length) + datePartText;
                            partiallyInvalidText += formattedDatePart;
                            // add -1 as the first character in the segment is at index i
                            i += partsForSegment.length - 1;
                        }
                        else {
                            partiallyInvalidText += formattedDates[symbol][i];
                        }
                    }
                }
                else {
                    partiallyInvalidText += text[i];
                }
            }
            text = partiallyInvalidText;
        }
        var result = this.merge(text, mask);
        return result;
    };
    /**
     * @hidden
     */
    DateObject.prototype.getFormattedInvalidDates = function (customFormat) {
        var _this = this;
        if (customFormat === void 0) { customFormat = ""; }
        var format = customFormat || this.format;
        var formattedDatesForSymbol = {
            'E': '',
            'H': '',
            'M': '',
            'a': '',
            'd': '',
            'h': '',
            'm': '',
            's': '',
            'y': '',
            'S': ''
        };
        Object.keys(this._partiallyInvalidDate.invalidDateParts).forEach(function (key) {
            var date = _this.getInvalidDatePart(key).date;
            if (date) {
                var formattedInvalidDate = _this.intl.formatDate(date, format, _this.localeId);
                formattedDatesForSymbol[key] = formattedInvalidDate;
            }
        });
        return formattedDatesForSymbol;
    };
    DateObject.prototype.modifyExisting = function (value) {
        var sampleFormat = this.dateFormatString(this.value, this.format).symbols;
        for (var i = 0; i < sampleFormat.length; i++) {
            this.setExisting(sampleFormat[i], value);
        }
    };
    /**
     * @hidden
     */
    DateObject.prototype.getExisting = function (symbol) {
        switch (symbol) {
            case 'y': return this.year;
            case 'M':
            case 'L': return this.month;
            case 'd': return this.date;
            case 'E': return this.date && this.month && this.year;
            case 'h':
            case 'H': return this.hours;
            case 't':
            case 'a': return this.dayperiod;
            case 'm': return this.minutes;
            case 's': return this.seconds;
            case "S": return this.milliseconds;
            default:
                return true;
        }
    };
    DateObject.prototype.setExisting = function (symbol, value) {
        switch (symbol) {
            case 'y':
                // allow 2/29 dates
                this.year = value;
                if (value === false) {
                    this._value.setFullYear(2000);
                }
                break;
            case 'M':
                // make sure you can type 31 in the day part
                this.month = value;
                if (value === false) {
                    if (this.autoCorrectParts) {
                        this._value.setMonth(0);
                    }
                }
                break;
            case 'd':
                this.date = value;
                break;
            case 'h':
            case 'H':
                this.hours = value;
                break;
            case 't':
            case 'a':
                this.dayperiod = value;
                break;
            case 'm':
                this.minutes = value;
                break;
            case 's':
                this.seconds = value;
                break;
            case "S":
                this.milliseconds = value;
                break;
            default:
                break;
        }
        if (this.getValue()) {
            this.resetInvalidDate();
        }
    };
    DateObject.prototype.modifyPart = function (symbol, offset) {
        if (!isPresent(symbol) || !isPresent(offset) || offset === 0) {
            return;
        }
        var newValue = cloneDate(this.value);
        var timeModified = false;
        var invalidDateFound;
        var isMonth = symbol === "M";
        var isDay = symbol === "d" || symbol === "E";
        var symbolExists = this.getExisting(symbol);
        if (!this.autoCorrectParts && (isDay || isMonth)) {
            var invalidDateParts = this._partiallyInvalidDate.invalidDateParts || {};
            var invalidDatePartValue = this.getInvalidDatePartValue(symbol);
            var year = invalidDateParts.y.value || newValue.getFullYear();
            var month = invalidDateParts.M.value || newValue.getMonth();
            var day = invalidDateParts.d.value || invalidDateParts.E.value || newValue.getDate();
            var hour = invalidDateParts.h.value || invalidDateParts.H.value || newValue.getHours();
            var minutes = invalidDateParts.m.value || newValue.getMinutes();
            var seconds = invalidDateParts.s.value || newValue.getSeconds();
            var milliseconds = invalidDateParts.S.value || newValue.getMilliseconds();
            switch (symbol) {
                case 'y':
                    year += offset;
                    break;
                case 'M':
                    month += offset;
                    break;
                case 'd':
                case 'E':
                    day += offset;
                    break;
                // case 'h':
                // case 'H': hour += offset; break;
                // case 'm': minutes += offset; break;
                // case 's': seconds += offset; break;
                // case 'S': milliseconds += offset; break;
                default: break;
            }
            if (symbol === "M") {
                if ((month < 0 || month > 11)) {
                    if (symbolExists) {
                        this.setExisting(symbol, false);
                        this.resetInvalidDateSymbol(symbol);
                        return;
                    }
                }
                if (!symbolExists) {
                    if (month < 0) {
                        month = clamp(11 + ((month % 11) + 1), 0, 11);
                    }
                    else {
                        var monthValue = isPresent(invalidDatePartValue) ?
                            month :
                            ((offset - JS_MONTH_OFFSET) % 12);
                        month = clamp(monthValue, 0, 11);
                    }
                    month = clamp(month, 0, 11);
                }
                month = clamp(month, 0, 11);
            }
            else if (symbol === "d") {
                if (symbolExists) {
                    if (day <= 0 || day > 31) {
                        this.setExisting(symbol, false);
                        this.resetInvalidDateSymbol(symbol);
                        return;
                    }
                }
                else if (!symbolExists) {
                    if (isPresent(invalidDatePartValue)) {
                        if (day <= 0 || day > 31) {
                            this.setExisting(symbol, false);
                            this.resetInvalidDateSymbol(symbol);
                            return;
                        }
                    }
                    if (offset < 0) {
                        var dayValue = isPresent(invalidDatePartValue) ? day : 1 + (31 - Math.abs(offset % 31));
                        day = clamp(dayValue, 1, 31);
                    }
                    else {
                        var dayValue = isPresent(invalidDatePartValue) ? day : offset % 31;
                        day = clamp(dayValue, 1, 31);
                    }
                    day = clamp(day, 1, 31);
                }
            }
            var dateCandidate = createDate(year, month, day, hour, minutes, seconds, milliseconds);
            var newValueCandidate = isMonth || isDay ?
                this.modifyDateSymbolWithValue(newValue, symbol, isMonth ? month : day) :
                null;
            var dateCandidateExists = areDatePartsEqualTo(dateCandidate, year, month, day, hour, minutes, seconds, milliseconds);
            if (this.getValue() && areDatePartsEqualTo(dateCandidate, year, month, day, hour, minutes, seconds, milliseconds)) {
                newValue = cloneDate(dateCandidate);
                this.markDatePartsAsExisting();
            }
            else if (isMonth && newValueCandidate) {
                if (newValueCandidate.getMonth() === month) {
                    if (this.getExisting("d")) {
                        if (dateCandidateExists) {
                            newValue = cloneDate(dateCandidate);
                            this.resetInvalidDateSymbol(symbol);
                        }
                        else {
                            invalidDateFound = true;
                            this.setInvalidDatePart(symbol, {
                                value: month,
                                date: cloneDate(newValueCandidate),
                                startDateOffset: offset,
                                startDate: cloneDate(this.value)
                            });
                            this.setExisting(symbol, false);
                        }
                    }
                    else if (dateCandidateExists) {
                        this.resetInvalidDateSymbol(symbol);
                        newValue = cloneDate(dateCandidate);
                        if (this.getExisting("M") && this.getExisting("y")) {
                            // changing from 28/Feb to 29/Feb to 29/March
                            this.setExisting("d", true);
                            this.resetInvalidDateSymbol("d");
                        }
                    }
                    else {
                        this.resetInvalidDateSymbol(symbol);
                        newValue = cloneDate(newValueCandidate);
                    }
                }
                else {
                    invalidDateFound = true;
                    this.setInvalidDatePart(symbol, {
                        value: month,
                        date: cloneDate(newValueCandidate),
                        startDateOffset: offset,
                        startDate: cloneDate(this.value)
                    });
                    this.setExisting(symbol, false);
                }
            }
            else if (isDay && newValueCandidate) {
                if (newValueCandidate.getDate() === day) {
                    if (this.getExisting("M")) {
                        if (dateCandidateExists) {
                            newValue = cloneDate(dateCandidate);
                            this.resetInvalidDateSymbol(symbol);
                        }
                        else {
                            invalidDateFound = true;
                            this.setInvalidDatePart(symbol, {
                                value: day,
                                date: cloneDate(newValueCandidate),
                                startDateOffset: offset,
                                startDate: cloneDate(this.value)
                            });
                            this.setExisting(symbol, false);
                        }
                    }
                    else if (dateCandidateExists) {
                        newValue = cloneDate(dateCandidate);
                        this.resetInvalidDateSymbol(symbol);
                        if (this.getExisting("d") && this.getExisting("y")) {
                            // changing from 31/Jan to 31/Feb to 28/Feb
                            this.setExisting("M", true);
                            this.resetInvalidDateSymbol("M");
                        }
                    }
                    else {
                        this.resetInvalidDateSymbol(symbol);
                        newValue = cloneDate(newValueCandidate);
                    }
                }
                else {
                    invalidDateFound = true;
                    this.setInvalidDatePart(symbol, {
                        value: day,
                        date: cloneDate(this.value),
                        startDateOffset: offset,
                        startDate: cloneDate(this.value)
                    });
                    this.setExisting(symbol, false);
                }
            }
        }
        else {
            switch (symbol) {
                case 'y':
                    newValue.setFullYear(newValue.getFullYear() + offset);
                    break;
                case 'M':
                    newValue = addMonths(this.value, offset);
                    break;
                case 'd':
                case 'E':
                    newValue.setDate(newValue.getDate() + offset);
                    break;
                case 'h':
                case 'H':
                    newValue.setHours(newValue.getHours() + offset);
                    timeModified = true;
                    break;
                case 'm':
                    newValue.setMinutes(newValue.getMinutes() + offset);
                    timeModified = true;
                    break;
                case 's':
                    newValue.setSeconds(newValue.getSeconds() + offset);
                    timeModified = true;
                    break;
                case "S":
                    newValue.setMilliseconds(newValue.getMilliseconds() + offset);
                    break;
                case 'a':
                    newValue.setHours(newValue.getHours() + (12 * offset));
                    timeModified = true;
                    break;
                default: break;
            }
        }
        if (this.shouldNormalizeCentury()) {
            newValue = this.normalizeCentury(newValue);
        }
        if (timeModified && !this.cycleTime && newValue.getDate() !== this._value.getDate()) {
            // todo: blazor has this fix, but this fails a unit test
            // newValue.setDate(this._value.getDate());
            // newValue.setMonth(this._value.getMonth());
            // newValue.setFullYear(this._value.getFullYear());
        }
        if (!invalidDateFound) {
            this.setExisting(symbol, true);
            this._value = newValue;
            if (this.getValue()) {
                this.resetInvalidDate();
            }
        }
    };
    /**
     * @hidden
     */
    DateObject.prototype.parsePart = function (_a) {
        var symbol = _a.symbol, currentChar = _a.currentChar, resetSegmentValue = _a.resetSegmentValue, cycleSegmentValue = _a.cycleSegmentValue, rawInputValue = _a.rawTextValue, isDeleting = _a.isDeleting, originalFormat = _a.originalFormat;
        var isInCaretMode = !cycleSegmentValue;
        var dateParts = this.dateFormatString(this.value, this.format);
        var datePartsLiterals = dateParts.partMap
            .filter(function (x) { return x.type === "literal"; })
            .map(function (x, index) {
            return {
                datePartIndex: index,
                type: x.type,
                pattern: x.pattern,
                literal: ""
            };
        });
        var flatDateParts = dateParts.partMap
            .map(function (x) {
            return {
                type: x.type,
                pattern: x.pattern,
                text: ""
            };
        });
        for (var i = 0; i < datePartsLiterals.length; i++) {
            var datePart = datePartsLiterals[i];
            for (var j = 0; j < datePart.pattern.length; j++) {
                if (datePartsLiterals[i + j]) {
                    datePartsLiterals[i + j].literal = datePart.pattern[j];
                }
            }
            i += datePart.pattern.length - 1;
        }
        for (var i = 0; i < flatDateParts.length; i++) {
            var datePart = flatDateParts[i];
            for (var j = 0; j < datePart.pattern.length; j++) {
                if (flatDateParts[i + j]) {
                    flatDateParts[i + j].text = datePart.pattern[j];
                }
            }
            i += datePart.pattern.length - 1;
        }
        var shouldResetPart = isInCaretMode && symbol === "M" && dateParts.partMap
            .filter(function (x) { return x.type === "month"; })
            .some(function (x) { return x.pattern.length > MONTH_PART_WITH_WORDS_THRESHOLD; });
        var parseResult = {
            value: null,
            switchToNext: false,
            resetPart: shouldResetPart,
            hasInvalidDatePart: false
        };
        if (!currentChar) {
            if (isInCaretMode) {
                for (var i = 0; i < datePartsLiterals.length; i++) {
                    var literal = datePartsLiterals[i].literal;
                    var rawValueStartsWithLiteral = rawInputValue.startsWith(literal);
                    var rawValueEndsWithLiteral = rawInputValue.endsWith(literal);
                    var rawValueHasConsecutiveLiterals = rawInputValue.indexOf(literal + literal) >= 0;
                    if (rawValueStartsWithLiteral || rawValueEndsWithLiteral || rawValueHasConsecutiveLiterals) {
                        this.resetLeadingZero();
                        this.setExisting(symbol, false);
                        this.resetInvalidDateSymbol(symbol);
                        return extend(parseResult, { value: null, switchToNext: false });
                    }
                }
            }
            else {
                this.resetLeadingZero();
                this.setExisting(symbol, false);
                this.resetInvalidDateSymbol(symbol);
                return extend(parseResult, { value: null, switchToNext: false });
            }
        }
        var baseDate = this.intl.formatDate(this.value, this.format, this.localeId);
        var baseFormat = dateParts.symbols;
        var replaced = false;
        var prefix = '';
        var current = '';
        var datePartText = '';
        var basePrefix = '';
        var baseSuffix = '';
        var suffix = '';
        var convertedBaseFormat = "";
        for (var i = 0; i < flatDateParts.length; i++) {
            convertedBaseFormat += flatDateParts[i].text;
        }
        var hasFixedFormat = (this.format === baseFormat) ||
            (this.format === convertedBaseFormat) ||
            (this.format === originalFormat) ||
            (this.format.length === originalFormat.length);
        var datePartStartIndex = (hasFixedFormat ? convertedBaseFormat : originalFormat).indexOf(symbol);
        var datePartEndIndex = (hasFixedFormat ? convertedBaseFormat : originalFormat).lastIndexOf(symbol);
        var segmentLength = datePartEndIndex - datePartStartIndex + 1;
        var formatToTextLengthDiff = originalFormat.length - rawInputValue.length;
        if (isInCaretMode || (!isInCaretMode && !this.autoCorrectParts)) {
            for (var i = 0; i < baseDate.length; i++) {
                if (baseFormat[i] === symbol) {
                    var existing = this.getExisting(symbol);
                    current += existing ? baseDate[i] : '0';
                    if (formatToTextLengthDiff > 0) {
                        if (datePartText.length + formatToTextLengthDiff < segmentLength) {
                            datePartText += rawInputValue[i] || "";
                        }
                    }
                    else {
                        datePartText += rawInputValue[i] || "";
                    }
                    replaced = true;
                }
                else if (!replaced) {
                    prefix += baseDate[i];
                    basePrefix += baseDate[i];
                }
                else {
                    suffix += baseDate[i];
                    baseSuffix += baseDate[i];
                }
            }
            if (hasFixedFormat) {
                if (convertedBaseFormat.length < rawInputValue.length) {
                    datePartText += currentChar;
                }
                else if (!isDeleting && originalFormat.length > rawInputValue.length) {
                    // let the parsing to determine if the incomplete value is valid
                }
                if (datePartText.length > segmentLength) {
                    return extend(parseResult, { value: null, switchToNext: false });
                }
            }
            if (!hasFixedFormat || (hasFixedFormat && !this.autoCorrectParts)) {
                current = "";
                datePartText = "";
                prefix = "";
                suffix = "";
                replaced = false;
                for (var i = 0; i < originalFormat.length; i++) {
                    if (originalFormat[i] === symbol) {
                        var existing = this.getExisting(symbol);
                        current += existing ? baseDate[i] || "" : '0';
                        if (formatToTextLengthDiff > 0) {
                            if (datePartText.length + formatToTextLengthDiff < segmentLength) {
                                datePartText += rawInputValue[i] || "";
                            }
                        }
                        else {
                            datePartText += rawInputValue[i] || "";
                        }
                        replaced = true;
                    }
                    else if (!replaced) {
                        prefix += rawInputValue[i] || "";
                    }
                    else {
                        suffix += rawInputValue[i - formatToTextLengthDiff] || "";
                    }
                }
                if (originalFormat.length < rawInputValue.length) {
                    datePartText += currentChar;
                }
            }
        }
        if (!isInCaretMode) {
            if (this.autoCorrectParts) {
                current = "";
                datePartText = "";
                prefix = "";
                suffix = "";
                replaced = false;
                for (var i = 0; i < baseDate.length; i++) {
                    if (baseFormat[i] === symbol) {
                        var existing = this.getExisting(symbol);
                        current += existing ? baseDate[i] : '0';
                        replaced = true;
                    }
                    else if (!replaced) {
                        prefix += baseDate[i];
                    }
                    else {
                        suffix += baseDate[i];
                    }
                }
            }
            else {
                current = resetSegmentValue ? datePartText : current;
            }
        }
        var parsedDate = null;
        var month = this.matchMonth(currentChar);
        var dayPeriod = this.matchDayPeriod(currentChar, symbol);
        var isZeroCurrentChar = currentChar === '0';
        var leadingZero = this.leadingZero || {};
        if (isZeroCurrentChar) {
            if (datePartText === "0") {
                datePartText = current;
            }
            var valueNumber = parseToInt(resetSegmentValue ?
                currentChar :
                (isInCaretMode ? datePartText : current) + currentChar);
            if (valueNumber === 0 && !this.isAbbrMonth(dateParts.partMap, symbol)) {
                this.incrementLeadingZero(symbol);
            }
        }
        else {
            this.resetLeadingZero();
        }
        var partPattern = this.partPattern(dateParts.partMap, symbol);
        var patternValue = partPattern ? partPattern.pattern : null;
        var patternLength = this.patternLength(patternValue) || patternValue.length;
        if (isInCaretMode) {
            if (isDeleting && !datePartText) {
                this.setExisting(symbol, false);
                return extend(parseResult, { value: null, switchToNext: false });
            }
        }
        var currentMaxLength = current.length - 3;
        var tryParse = true;
        var middle = isInCaretMode ? datePartText : current;
        for (var i = Math.max(0, currentMaxLength); i <= current.length; i++) {
            if (!tryParse) {
                break;
            }
            middle = resetSegmentValue ?
                currentChar :
                isInCaretMode ?
                    datePartText :
                    (current.substring(i) + currentChar);
            if (isInCaretMode || !this.autoCorrectParts) {
                tryParse = false;
                middle = unpadZero(middle);
                // middle = padZero(segmentLength - middle.length) + middle;
                middle = padZero(patternLength - middle.length) + middle;
            }
            var middleNumber = parseInt(middle, 10);
            var candidateDateString = prefix + middle + suffix;
            parsedDate = this.intl.parseDate(candidateDateString, this.format, this.localeId);
            var autoCorrectedPrefixAndSuffix = false;
            if (isInCaretMode && !isValidDate(parsedDate)) {
                // if part of the date is not available, e.g. "d"
                // but an expanded format like "F" is used
                // the element value can be "EEEE, February 1, 2022 3:04:05 AM"
                // which is not parsable by intl
                // use the base prefix and suffix, e.g. convert the candidate date string
                // to "Thursday, February 1, 2022 3:04:05 AM"
                // as "EEEE, February..." is not parsable
                if (this.autoCorrectParts) {
                    parsedDate = this.intl.parseDate(basePrefix + middle + baseSuffix, this.format, this.localeId);
                    autoCorrectedPrefixAndSuffix = true;
                }
            }
            var isCurrentCharParsable = !isNaN(parseInt(currentChar, 10)) || (isInCaretMode && isDeleting && currentChar === "");
            if (!parsedDate && !isNaN(middleNumber) && isCurrentCharParsable && this.autoCorrectParts) {
                if (symbol === MONTH_SYMBOL && !month) {
                    // JS months start from 0 (January) instead of 1 (January)
                    var monthNumber = middleNumber - JS_MONTH_OFFSET;
                    if (monthNumber > -1 && monthNumber < 12) {
                        parsedDate = cloneDate(this.value);
                        parsedDate.setMonth(monthNumber);
                        if (parsedDate.getMonth() !== monthNumber) {
                            parsedDate = lastDayOfMonth(addMonths(parsedDate, -1));
                        }
                    }
                }
                if (symbol === 'y') {
                    parsedDate = createDate(parseInt(middle, 10), this.month ? this.value.getMonth() : 0, this.date ? this.value.getDate() : 1, this.hours ? this.value.getHours() : 0, this.minutes ? this.value.getMinutes() : 0, this.seconds ? this.value.getSeconds() : 0, this.milliseconds ? this.value.getMilliseconds() : 0);
                    if (((isInCaretMode && isValidDate(parsedDate)) ||
                        (!isInCaretMode && parsedDate)) && this.date && parsedDate.getDate() !== this.value.getDate()) {
                        parsedDate = lastDayOfMonth(addMonths(parsedDate, -1));
                    }
                }
            }
            if ((isInCaretMode && isValidDate(parsedDate)) || (!isInCaretMode && parsedDate)) {
                // move to next segment if the part will overflow with next char
                // when start from empty date (01, then 010), padded zeros should be trimmed
                var peekedValue = this.peek(middle, patternValue);
                var peekedDateString = autoCorrectedPrefixAndSuffix ?
                    "" + basePrefix + peekedValue + baseSuffix :
                    "" + prefix + peekedValue + suffix;
                var peekedDate = this.intl.parseDate(peekedDateString, this.format, this.localeId);
                var leadingZeroOffset = (this.leadingZero || {})[symbol] || 0;
                var patternSatisfied = (leadingZeroOffset + unpadZero(middle).length) >= patternLength;
                var switchToNext = peekedDate === null ||
                    (leadingZero[symbol] ?
                        patternValue.length <= middle.length :
                        patternSatisfied);
                if (this.shouldNormalizeCentury()) {
                    parsedDate = this.normalizeCentury(parsedDate);
                }
                this._value = parsedDate;
                this.setExisting(symbol, true);
                this.resetInvalidDateSymbol(symbol);
                if (!this.autoCorrectParts) {
                    if (symbol === "M") {
                        if (this.getExisting("M") && this.getExisting("y")) {
                            // changing from 28/Feb to 29/Feb to 29/March
                            this.setExisting("d", true);
                            this.resetInvalidDateSymbol("d");
                        }
                    }
                    else if (symbol === "d") {
                        if (this.getExisting("d") && this.getExisting("y")) {
                            // changing from 31/Jan to 31/Feb to 28/Feb
                            this.setExisting("M", true);
                            this.resetInvalidDateSymbol("M");
                        }
                    }
                    if (!this.hasInvalidDatePart()) {
                        this.markDatePartsAsExisting();
                    }
                }
                return extend(parseResult, { value: this.value, switchToNext: switchToNext });
            }
        }
        if (month) {
            parsedDate = this.intl.parseDate(prefix + month + suffix, this.format, this.localeId);
            if (parsedDate) {
                this._value = parsedDate;
                this.setExisting(symbol, true);
                return extend(parseResult, { value: this.value, switchToNext: false });
            }
        }
        if (dayPeriod) {
            parsedDate = this.intl.parseDate(prefix + dayPeriod + suffix, this.format);
            if (parsedDate) {
                this._value = parsedDate;
                return extend(parseResult, { value: this.value, switchToNext: true });
            }
        }
        if (isZeroCurrentChar) {
            this.setExisting(symbol, false);
        }
        if (!this.autoCorrectParts) {
            var datePartValue = void 0;
            var textToParse = isInCaretMode ? datePartText : middle;
            var parsedValue = parseToInt(textToParse);
            if (isNumber(parsedValue)) {
                if ((symbol === "d" && (parsedValue <= 0 || parsedValue > 31)) ||
                    (symbol === "M" && (parsedValue < 0 || parsedValue > 11))) {
                    return extend(parseResult, { value: null, switchToNext: false });
                }
                datePartValue = symbol === "M" ?
                    parsedValue - JS_MONTH_OFFSET :
                    parsedValue;
                var isMonth = symbol === "M";
                var isDay = symbol === "d";
                var newValue = cloneDate(this._value);
                var invalidDateParts = this._partiallyInvalidDate.invalidDateParts || {};
                var year = invalidDateParts.y.value || newValue.getFullYear();
                /* tslint:disable:no-shadowed-variable */
                var month_1 = isMonth ? datePartValue : invalidDateParts.M.value || newValue.getMonth();
                /* tslint:enable:no-shadowed-variable */
                var day = isDay ? datePartValue : invalidDateParts.d.value || invalidDateParts.E.value || newValue.getDate();
                var hour = invalidDateParts.h.value || invalidDateParts.H.value || newValue.getHours();
                var minutes = invalidDateParts.m.value || newValue.getMinutes();
                var seconds = invalidDateParts.s.value || newValue.getSeconds();
                var milliseconds = invalidDateParts.S.value || newValue.getMilliseconds();
                var dateCandidate = createDate(year, month_1, day, hour, minutes, seconds, milliseconds);
                var dateCandidateExists = areDatePartsEqualTo(dateCandidate, year, month_1, day, hour, minutes, seconds, milliseconds);
                var newValueCandidate = isMonth || isDay ?
                    this.modifyDateSymbolWithValue(newValue, symbol, isMonth ? month_1 : day) :
                    null;
                var invalidDateFound = false;
                if (isMonth && newValueCandidate) {
                    if (newValueCandidate.getMonth() === month_1) {
                        if (this.getExisting("d")) {
                            if (dateCandidateExists) {
                                newValue = cloneDate(dateCandidate);
                                this.resetInvalidDateSymbol(symbol);
                            }
                            else {
                                invalidDateFound = true;
                                this.setInvalidDatePart(symbol, {
                                    value: month_1,
                                    date: cloneDate(newValueCandidate),
                                    startDate: cloneDate(this.value)
                                });
                                this.setExisting(symbol, false);
                            }
                        }
                        else if (dateCandidateExists) {
                            this.resetInvalidDateSymbol(symbol);
                            newValue = cloneDate(dateCandidate);
                            if (this.getExisting("M") && this.getExisting("y")) {
                                // changing from 28/Feb to 29/Feb to 29/March
                                this.setExisting("d", true);
                                this.resetInvalidDateSymbol("d");
                            }
                        }
                        else {
                            this.resetInvalidDateSymbol(symbol);
                            newValue = cloneDate(newValueCandidate);
                        }
                    }
                    else {
                        invalidDateFound = true;
                        this.setInvalidDatePart(symbol, {
                            value: month_1,
                            date: cloneDate(newValueCandidate),
                            startDate: cloneDate(this.value)
                        });
                        this.setExisting(symbol, false);
                    }
                }
                else if (isDay && newValueCandidate) {
                    if (newValueCandidate.getDate() === day) {
                        if (this.getExisting("M")) {
                            if (dateCandidateExists) {
                                newValue = cloneDate(dateCandidate);
                                this.resetInvalidDateSymbol(symbol);
                            }
                            else {
                                invalidDateFound = true;
                                this.setInvalidDatePart(symbol, {
                                    value: day,
                                    date: cloneDate(newValueCandidate),
                                    startDate: cloneDate(this.value)
                                });
                                this.setExisting(symbol, false);
                            }
                        }
                        else if (dateCandidateExists) {
                            newValue = cloneDate(dateCandidate);
                            this.resetInvalidDateSymbol(symbol);
                            if (this.getExisting("d") && this.getExisting("y")) {
                                // changing from 31/Jan to 31/Feb to 28/Feb
                                this.setExisting("M", true);
                                this.resetInvalidDateSymbol("M");
                            }
                        }
                        else {
                            this.resetInvalidDateSymbol(symbol);
                            newValue = cloneDate(newValueCandidate);
                        }
                    }
                    else {
                        invalidDateFound = true;
                        this.setInvalidDatePart(symbol, {
                            value: day,
                            date: cloneDate(this.value),
                            startDate: cloneDate(this.value)
                        });
                        this.setExisting(symbol, false);
                    }
                }
                if (!invalidDateFound) {
                    this.setExisting(symbol, true);
                    if (isInCaretMode && !isValidDate(parsedDate)) {
                        var valueCandidate = this.intl.parseDate(basePrefix + middle + baseSuffix, this.format, this.localeId);
                        if (isValidDate(valueCandidate)) {
                            this._value = valueCandidate;
                        }
                    }
                    else {
                        this._value = newValue;
                    }
                    if (this.getValue()) {
                        this.resetInvalidDate();
                    }
                }
                var switchToNext = false;
                if (symbol === "M") {
                    if (parsedValue >= 2 || textToParse.length >= 2) {
                        switchToNext = true;
                    }
                    else {
                        switchToNext = false;
                    }
                }
                else {
                    switchToNext = hasFixedFormat ?
                        textToParse.length === segmentLength :
                        textToParse.length > segmentLength;
                }
                return extend(parseResult, {
                    value: null,
                    switchToNext: switchToNext,
                    hasInvalidDatePart: invalidDateFound
                });
            }
        }
        return extend(parseResult, { value: null, switchToNext: false });
    };
    /**
     * @hidden
     */
    DateObject.prototype.symbolMap = function (symbol) {
        return this.intl.splitDateFormat(this.format, this.localeId).reduce(dateSymbolMap, {})[symbol];
    };
    /**
     * @hidden
     */
    DateObject.prototype.resetLeadingZero = function () {
        var hasLeadingZero = this.leadingZero !== null;
        this.setLeadingZero(null);
        return hasLeadingZero;
    };
    DateObject.prototype.setLeadingZero = function (leadingZero) {
        this.leadingZero = leadingZero;
    };
    /**
     * @hidden
     */
    DateObject.prototype.getLeadingZero = function () {
        return this.leadingZero || {};
    };
    /**
     * @hidden
     */
    DateObject.prototype.normalizeCentury = function (date) {
        if (!isPresent(date)) {
            return date;
        }
        var twoDigitYear = cropTwoDigitYear(date);
        var centuryBase = this.getNormalizedCenturyBase(twoDigitYear);
        var normalizedDate = setYears(date, centuryBase + twoDigitYear);
        return normalizedDate;
    };
    DateObject.prototype.incrementLeadingZero = function (symbol) {
        var leadingZero = this.leadingZero || {};
        leadingZero[symbol] = (leadingZero[symbol] || 0) + 1;
        this.leadingZero = leadingZero;
    };
    /**
     * @hidden
     */
    DateObject.prototype.isAbbrMonth = function (parts, symbol) {
        var pattern = this.partPattern(parts, symbol);
        return pattern.type === 'month' && pattern.names;
    };
    /**
     * @hidden
     */
    DateObject.prototype.partPattern = function (parts, symbol) {
        return parts.filter(function (part) { return part.pattern.indexOf(symbol) !== -1; })[0];
    };
    /**
     * @hidden
     */
    DateObject.prototype.peek = function (value, pattern) {
        var peekValue = value.replace(/^0*/, '') + '0';
        return padZero(pattern.length - peekValue.length) + peekValue;
    };
    /**
     * @hidden
     */
    DateObject.prototype.matchMonth = function (typedChar) {
        this.typedMonthPart += typedChar.toLowerCase();
        if (this.monthNames.length === 0) {
            return '';
        }
        while (this.typedMonthPart.length > 0) {
            for (var i = 0; i < this.monthNames.length; i++) {
                if (this.monthNames[i].toLowerCase().indexOf(this.typedMonthPart) === 0) {
                    return this.monthNames[i];
                }
            }
            var monthAsNum = parseInt(this.typedMonthPart, 10);
            /* ensure they exact match */
            if (monthAsNum >= 1 && monthAsNum <= 12 && monthAsNum.toString() === this.typedMonthPart) {
                return this.monthNames[monthAsNum - 1];
            }
            this.typedMonthPart = this.typedMonthPart.substring(1, this.typedMonthPart.length);
        }
        return '';
    };
    /**
     * @hidden
     */
    DateObject.prototype.matchDayPeriod = function (typedChar, symbol) {
        var lowerChart = typedChar.toLowerCase();
        if (symbol === 'a' && this.dayPeriods) {
            if (this.dayPeriods.am.toLowerCase().startsWith(lowerChart)) {
                return this.dayPeriods.am;
            }
            else if (this.dayPeriods.pm.toLowerCase().startsWith(lowerChart)) {
                return this.dayPeriods.pm;
            }
        }
        return '';
    };
    /**
     * @hidden
     */
    DateObject.prototype.allFormattedMonths = function (locale) {
        if (locale === void 0) { locale = "en"; }
        var dateFormatParts = this.intl.splitDateFormat(this.format, this.localeId);
        for (var i = 0; i < dateFormatParts.length; i++) {
            if (dateFormatParts[i].type === 'month' && dateFormatParts[i].names) {
                return this.intl.dateFormatNames(locale, dateFormatParts[i].names);
            }
        }
        return [];
    };
    /**
     * @hidden
     */
    DateObject.prototype.allDayPeriods = function (locale) {
        if (locale === void 0) { locale = "en"; }
        var dateFormatParts = this.intl.splitDateFormat(this.format);
        for (var i = 0; i < dateFormatParts.length; i++) {
            if (dateFormatParts[i].type === "dayperiod" && dateFormatParts[i].names) {
                return this.intl.dateFormatNames(locale, dateFormatParts[i].names);
            }
        }
        return null;
    };
    /**
     * @hidden
     */
    DateObject.prototype.patternLength = function (pattern) {
        if (pattern[0] === 'y') {
            return 4;
        }
        if (SHORT_PATTERN_LENGTH_REGEXP.test(pattern)) {
            return 2;
        }
        return 0;
    };
    /**
     * @hidden
     */
    DateObject.prototype.dateFormatString = function (date, format) {
        var dateFormatParts = this.intl.splitDateFormat(format, this.localeId);
        var parts = [];
        var partMap = [];
        for (var i = 0; i < dateFormatParts.length; i++) {
            var partLength = this.intl.formatDate(date, { pattern: dateFormatParts[i].pattern }, this.localeId).length;
            while (partLength > 0) {
                parts.push(this.symbols[dateFormatParts[i].pattern[0]] || Constants.formatSeparator);
                partMap.push(dateFormatParts[i]);
                partLength--;
            }
        }
        var returnValue = new Mask();
        returnValue.symbols = parts.join('');
        returnValue.partMap = partMap;
        return returnValue;
    };
    /**
     * @hidden
     */
    DateObject.prototype.merge = function (text, mask) {
        // Important: right to left.
        var resultText = '';
        var resultFormat = '';
        var format = mask.symbols;
        var processTextSymbolsEnded = false;
        var ignoreFormatSymbolsCount = 0;
        var formattedDates = this.getFormattedInvalidDates(format);
        for (var formatSymbolIndex = format.length - 1; formatSymbolIndex >= 0; formatSymbolIndex--) {
            var partsForSegment = this.getPartsForSegment(mask, formatSymbolIndex);
            if (this.knownParts.indexOf(format[formatSymbolIndex]) === -1 || this.getExisting(format[formatSymbolIndex])) {
                if (this.autoCorrectParts) {
                    resultText = text[formatSymbolIndex] + resultText;
                }
                else {
                    if (text.length !== format.length) {
                        if (processTextSymbolsEnded) {
                            resultText = text[formatSymbolIndex] + resultText;
                        }
                        else if (ignoreFormatSymbolsCount > 0) {
                            resultText = text[formatSymbolIndex] + resultText;
                            ignoreFormatSymbolsCount--;
                            if (ignoreFormatSymbolsCount <= 0) {
                                processTextSymbolsEnded = true;
                            }
                        }
                        else {
                            resultText = (text[formatSymbolIndex + text.length - format.length] || "") + resultText;
                        }
                    }
                    else {
                        resultText = text[formatSymbolIndex] + resultText;
                    }
                }
                resultFormat = format[formatSymbolIndex] + resultFormat;
            }
            else {
                var symbol = format[formatSymbolIndex];
                var formatSymbolIndexModifier = 0;
                if (this.autoCorrectParts || (!this.autoCorrectParts && !this.getInvalidDatePartValue(symbol))) {
                    while (formatSymbolIndex >= 0 && symbol === format[formatSymbolIndex]) {
                        formatSymbolIndex--;
                    }
                    formatSymbolIndex++;
                }
                if (this.leadingZero && this.leadingZero[symbol]) {
                    resultText = '0' + resultText;
                }
                else {
                    if (!this.autoCorrectParts && this.getInvalidDatePartValue(symbol)) {
                        var datePartText = this.getInvalidDatePartValue(symbol).toString();
                        if (symbol === "M") {
                            datePartText = (parseToInt(this.getInvalidDatePartValue(symbol)) + JS_MONTH_OFFSET).toString();
                            if (partsForSegment.length > MONTH_PART_WITH_WORDS_THRESHOLD) {
                                resultText = formattedDates[symbol][formatSymbolIndex] + resultText;
                            }
                            else {
                                datePartText = (parseToInt(this.getInvalidDatePartValue(symbol)) + JS_MONTH_OFFSET).toString();
                                var formattedDatePart = padZero(partsForSegment.length - datePartText.length) + datePartText;
                                resultText = formattedDatePart + resultText;
                                formatSymbolIndexModifier = partsForSegment.length - 1;
                                ignoreFormatSymbolsCount = datePartText.length - partsForSegment.length;
                            }
                        }
                        else {
                            var formattedDatePart = padZero(partsForSegment.length - datePartText.length) + datePartText;
                            resultText = formattedDatePart + resultText;
                            formatSymbolIndexModifier = partsForSegment.length - 1;
                            ignoreFormatSymbolsCount = datePartText.length - partsForSegment.length;
                        }
                    }
                    else {
                        resultText = this.dateFieldName(mask.partMap[formatSymbolIndex]) + resultText;
                    }
                }
                while (resultFormat.length < resultText.length) {
                    resultFormat = format[formatSymbolIndex] + resultFormat;
                }
                if (formatSymbolIndexModifier !== 0) {
                    formatSymbolIndex = (formatSymbolIndex - formatSymbolIndexModifier) + (text.length - format.length);
                }
            }
        }
        return { text: resultText, format: resultFormat };
    };
    /**
     * @hidden
     */
    DateObject.prototype.dateFieldName = function (part) {
        var formatPlaceholder = this.formatPlaceholder || 'wide';
        if (formatPlaceholder[part.type]) {
            return formatPlaceholder[part.type];
        }
        if (formatPlaceholder === 'formatPattern') {
            return part.pattern;
        }
        return this.intl.dateFieldName(Object.assign(part, { nameType: formatPlaceholder }));
    };
    /**
     * @hidden
     */
    DateObject.prototype.getNormalizedCenturyBase = function (twoDigitYear) {
        return twoDigitYear > this.twoDigitYearMax ?
            PREVIOUS_CENTURY_BASE :
            CURRENT_CENTURY_BASE;
    };
    /**
     * @hidden
     */
    DateObject.prototype.shouldNormalizeCentury = function () {
        return this.intl.splitDateFormat(this.format).some(function (part) { return part.pattern === 'yy'; });
    };
    DateObject.prototype.resetInvalidDate = function () {
        var _this = this;
        this._partiallyInvalidDate.startDate = null;
        Object.keys(this._partiallyInvalidDate.invalidDateParts).forEach(function (key) {
            _this.resetInvalidDatePart(key);
        });
    };
    DateObject.prototype.resetInvalidDateSymbol = function (symbol) {
        var _this = this;
        this.resetInvalidDatePart(symbol);
        var shouldResetInvalidDate = true;
        Object.keys(this._partiallyInvalidDate.invalidDateParts).forEach(function (key) {
            if (_this._partiallyInvalidDate.invalidDateParts[key] &&
                isPresent(_this._partiallyInvalidDate.invalidDateParts[key].value)) {
                shouldResetInvalidDate = false;
            }
        });
        if (shouldResetInvalidDate) {
            this.resetInvalidDate();
        }
    };
    DateObject.prototype.resetInvalidDatePart = function (symbol) {
        if (this._partiallyInvalidDate.invalidDateParts[symbol]) {
            this._partiallyInvalidDate.invalidDateParts[symbol] = {
                value: null,
                date: null,
                startDateOffset: 0
            };
        }
    };
    /**
     * @hidden
     */
    DateObject.prototype.getInvalidDatePart = function (symbol) {
        var invalidDatePart = this._partiallyInvalidDate.invalidDateParts[symbol];
        return invalidDatePart || {};
    };
    /**
     * @hidden
     */
    DateObject.prototype.getInvalidDatePartValue = function (symbol) {
        var invalidDatePart = this._partiallyInvalidDate.invalidDateParts[symbol];
        return (invalidDatePart || {}).value;
    };
    DateObject.prototype.setInvalidDatePart = function (symbol, _a) {
        var _b = _a.value, value = _b === void 0 ? null : _b, _c = _a.date, date = _c === void 0 ? null : _c, _d = _a.startDateOffset, startDateOffset = _d === void 0 ? 0 : _d, _e = _a.startDate, startDate = _e === void 0 ? null : _e;
        if (this._partiallyInvalidDate.invalidDateParts[symbol]) {
            this._partiallyInvalidDate.invalidDateParts[symbol].value = value;
            this._partiallyInvalidDate.invalidDateParts[symbol].date = date;
            this._partiallyInvalidDate.invalidDateParts[symbol].startDateOffset = startDateOffset;
            this._partiallyInvalidDate.startDate = startDate;
        }
    };
    /**
     * @hidden
     */
    DateObject.prototype.hasInvalidDatePart = function () {
        var _this = this;
        var hasInvalidDatePart = false;
        Object.keys(this._partiallyInvalidDate.invalidDateParts).forEach(function (key) {
            if (_this._partiallyInvalidDate.invalidDateParts[key] &&
                isPresent(_this._partiallyInvalidDate.invalidDateParts[key].value)) {
                hasInvalidDatePart = true;
            }
        });
        return hasInvalidDatePart;
    };
    /**
     * @hidden
     */
    DateObject.prototype.modifyDateSymbolWithOffset = function (date, symbol, offset) {
        var newValue = cloneDate(date);
        var timeModified = false;
        switch (symbol) {
            case 'y':
                newValue.setFullYear(newValue.getFullYear() + offset);
                break;
            case 'M':
                newValue = addMonths(this.value, offset);
                break;
            case 'd':
            case 'E':
                newValue.setDate(newValue.getDate() + offset);
                break;
            case 'h':
            case 'H':
                newValue.setHours(newValue.getHours() + offset);
                timeModified = true;
                break;
            case 'm':
                newValue.setMinutes(newValue.getMinutes() + offset);
                timeModified = true;
                break;
            case 's':
                newValue.setSeconds(newValue.getSeconds() + offset);
                timeModified = true;
                break;
            case "S":
                newValue.setMilliseconds(newValue.getMilliseconds() + offset);
                break;
            case 'a':
                newValue.setHours(newValue.getHours() + (12 * offset));
                timeModified = true;
                break;
            default: break;
        }
        return {
            date: newValue,
            timeModified: timeModified
        };
    };
    /**
     * @hidden
     */
    DateObject.prototype.modifyDateSymbolWithValue = function (date, symbol, value) {
        var newValue = cloneDate(date);
        switch (symbol) {
            case 'y':
                newValue.setFullYear(value);
                break;
            case 'M':
                newValue = addMonths(date, value - date.getMonth());
                break;
            case 'd':
            case 'E':
                newValue.setDate(value);
                break;
            case 'h':
            case 'H':
                newValue.setHours(value);
                break;
            case 'm':
                newValue.setMinutes(value);
                break;
            case 's':
                newValue.setSeconds(value);
                break;
            case "S":
                newValue.setMilliseconds(value);
                break;
            case 'a':
                newValue.setHours(value);
                break;
            default: break;
        }
        return newValue;
    };
    DateObject.prototype.markDatePartsAsExisting = function () {
        this.modifyExisting(true);
    };
    /**
     * @hidden
     */
    DateObject.prototype.getPartsForSegment = function (mask, partIndex) {
        var segmentPart = mask.partMap[partIndex];
        var partsForSegment = [];
        for (var maskPartIndex = partIndex; maskPartIndex < mask.partMap.length; maskPartIndex++) {
            var part = mask.partMap[maskPartIndex];
            if (segmentPart.type === part.type && segmentPart.pattern === part.pattern) {
                partsForSegment.push(part);
            }
            else {
                break;
            }
        }
        for (var maskPartIndex = partIndex - 1; maskPartIndex >= 0; maskPartIndex--) {
            var part = mask.partMap[maskPartIndex];
            if (segmentPart.type === part.type && segmentPart.pattern === part.pattern) {
                partsForSegment.unshift(part);
            }
            else {
                break;
            }
        }
        return partsForSegment;
    };
    return DateObject;
}());

var KeyCode = {
    BACKSPACE: 8,
    DELETE: 46,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    SPACE: 32,
    END: 35,
    HOME: 36,
    PAGE_UP: 33,
    PAGE_DOWN: 34
};

var defaultOptions = {
    events: {}
};
var Observable = /** @class */ (function () {
    function Observable(options) {
        this.options = deepExtend({}, defaultOptions, options);
    }
    Observable.prototype.destroy = function () {
    };
    /**
     * @hidden
     */
    Observable.prototype.trigger = function (eventName, args) {
        if (args === void 0) { args = {}; }
        var eventData = {
            defaultPrevented: false,
            preventDefault: function () {
                eventData.defaultPrevented = true;
            }
        };
        if (isFunction(this.options.events[eventName])) {
            this.options.events[eventName](extend(eventData, args, {
                sender: this
            }));
            return eventData.defaultPrevented;
        }
        return false;
    };
    return Observable;
}());

var DateInputInteractionMode;
(function (DateInputInteractionMode) {
    DateInputInteractionMode["None"] = "none";
    DateInputInteractionMode["Caret"] = "caret";
    DateInputInteractionMode["Selection"] = "selection";
})(DateInputInteractionMode || (DateInputInteractionMode = {}));

var _a;
var DEFAULT_SEGMENT_STEP = 1;
var DRAG_START = "dragStart";
var DROP = "drop";
var TOUCH_START = "touchstart";
var MOUSE_DOWN = "mousedown";
var MOUSE_UP = "mouseup";
var CLICK = "click";
var INPUT = "input";
var KEY_DOWN = "keydown";
var FOCUS = "focus";
var BLUR = "blur";
var PASTE = "paste";
var MOUSE_SCROLL = "DOMMouseScroll";
var MOUSE_WHEEL = "mousewheel";
var VALUE_CHANGE = "valueChange";
var INPUT_END = "inputEnd";
var BLUR_END = "blurEnd";
var FOCUS_END = "focusEnd";
var CHANGE = "change";
var defaultDateInputOptions = {
    format: "d",
    hasPlaceholder: false,
    placeholder: null,
    cycleTime: true,
    locale: null,
    steps: {
        millisecond: DEFAULT_SEGMENT_STEP,
        second: DEFAULT_SEGMENT_STEP,
        minute: DEFAULT_SEGMENT_STEP,
        hour: DEFAULT_SEGMENT_STEP,
        day: DEFAULT_SEGMENT_STEP,
        month: DEFAULT_SEGMENT_STEP,
        year: DEFAULT_SEGMENT_STEP
    },
    formatPlaceholder: null,
    events: (_a = {},
        _a[VALUE_CHANGE] = null,
        _a[INPUT] = null,
        _a[INPUT_END] = null,
        _a[FOCUS] = null,
        _a[FOCUS_END] = null,
        _a[BLUR] = null,
        _a[BLUR_END] = null,
        _a[KEY_DOWN] = null,
        _a[MOUSE_WHEEL] = null,
        _a[CHANGE] = null,
        _a),
    selectNearestSegmentOnFocus: false,
    selectPreviousSegmentOnBackspace: false,
    enableMouseWheel: false,
    allowCaretMode: false,
    autoSwitchParts: true,
    autoSwitchKeys: [],
    twoDigitYearMax: Constants.twoDigitYearMax,
    autoCorrectParts: true,
    autoFill: false
};
var DateInput = /** @class */ (function (_super) {
    __extends(DateInput, _super);
    function DateInput(element, options) {
        var _this = _super.call(this, options) || this;
        _this.dateObject = null;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        _this.currentText = '';
        _this.currentFormat = '';
        _this.interactionMode = DateInputInteractionMode.None;
        _this.previousElementSelection = { start: 0, end: 0 };
        _this.init(element, options);
        return _this;
    }
    Object.defineProperty(DateInput.prototype, "value", {
        get: function () {
            return this.dateObject && this.dateObject.getValue();
        },
        enumerable: true,
        configurable: true
    });
    DateInput.prototype.init = function (element, options) {
        var dateValue = isValidDate(this.options.value) ? cloneDate(this.options.value) : new Date(options.formattedValue);
        if (!isValidDate(dateValue)) {
            dateValue = null;
        }
        this.element = element;
        // this.element._kendoWidget = this;
        this.options = deepExtend({}, defaultDateInputOptions, options);
        this.intl = this.options.intlService;
        this.dateObject = this.createDateObject();
        this.dateObject.setValue(dateValue);
        this.setTextAndFormat();
        this.bindEvents();
        this.resetSegmentValue = true;
        this.interactionMode = DateInputInteractionMode.None;
        this.forceUpdate();
    };
    DateInput.prototype.destroy = function () {
        this.unbindEvents();
        this.dateObject = null;
        _super.prototype.destroy.call(this);
    };
    DateInput.prototype.bindEvents = function () {
        this.onElementDragStart = this.onElementDragStart.bind(this);
        this.element.addEventListener(DRAG_START, this.onElementDragStart);
        this.onElementDrop = this.onElementDrop.bind(this);
        this.element.addEventListener(DROP, this.onElementDrop);
        this.onElementClick = this.onElementClick.bind(this);
        this.element.addEventListener(CLICK, this.onElementClick);
        this.onElementMouseDown = this.onElementMouseDown.bind(this);
        this.element.addEventListener(MOUSE_DOWN, this.onElementMouseDown);
        this.element.addEventListener(TOUCH_START, this.onElementMouseDown);
        this.onElementMouseUp = this.onElementMouseUp.bind(this);
        this.element.addEventListener(MOUSE_UP, this.onElementMouseUp);
        this.onElementInput = this.onElementInput.bind(this);
        this.element.addEventListener(INPUT, this.onElementInput);
        this.onElementKeyDown = this.onElementKeyDown.bind(this);
        this.element.addEventListener(KEY_DOWN, this.onElementKeyDown);
        this.onElementFocus = this.onElementFocus.bind(this);
        this.element.addEventListener(FOCUS, this.onElementFocus);
        this.onElementBlur = this.onElementBlur.bind(this);
        this.element.addEventListener(BLUR, this.onElementBlur);
        this.onElementChange = this.onElementChange.bind(this);
        this.element.addEventListener(CHANGE, this.onElementChange);
        this.onElementPaste = this.onElementPaste.bind(this);
        this.element.addEventListener(PASTE, this.onElementPaste);
        this.onElementMouseWheel = this.onElementMouseWheel.bind(this);
        this.element.addEventListener(MOUSE_SCROLL, this.onElementMouseWheel);
        this.element.addEventListener(MOUSE_WHEEL, this.onElementMouseWheel);
    };
    DateInput.prototype.unbindEvents = function () {
        this.element.removeEventListener(DRAG_START, this.onElementDragStart);
        this.element.removeEventListener(DROP, this.onElementDrop);
        this.element.removeEventListener(TOUCH_START, this.onElementMouseDown);
        this.element.removeEventListener(MOUSE_DOWN, this.onElementMouseDown);
        this.element.removeEventListener(MOUSE_UP, this.onElementMouseUp);
        this.element.removeEventListener(CLICK, this.onElementClick);
        this.element.removeEventListener(INPUT, this.onElementInput);
        this.element.removeEventListener(KEY_DOWN, this.onElementKeyDown);
        this.element.removeEventListener(FOCUS, this.onElementFocus);
        this.element.removeEventListener(BLUR, this.onElementBlur);
        this.element.removeEventListener(CHANGE, this.onElementChange);
        this.element.removeEventListener(PASTE, this.onElementPaste);
        this.element.removeEventListener(MOUSE_SCROLL, this.onElementMouseWheel);
        this.element.removeEventListener(MOUSE_WHEEL, this.onElementMouseWheel);
    };
    DateInput.prototype.setOptions = function (options, refresh) {
        if (refresh === void 0) { refresh = false; }
        this.options = deepExtend({}, this.options, options);
        this.setDateObjectOptions();
        if (refresh) {
            this.unbindEvents();
            this.init(this.element, this.options);
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.setDateObjectOptions = function () {
        if (this.dateObject) {
            var newOptions = this.getDateObjectOptions();
            this.dateObject.setOptions(newOptions);
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.resetLocale = function () {
        this.unbindEvents();
        this.init(this.element, this.options);
    };
    /**
     * @hidden
     */
    DateInput.prototype.isInCaretMode = function () {
        return this.interactionMode === DateInputInteractionMode.Caret;
    };
    DateInput.prototype.focus = function () {
        this.element.focus();
        if (this.options.selectNearestSegmentOnFocus) {
            this.selectNearestSegment(0);
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementDragStart = function (e) {
        e.preventDefault();
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementDrop = function (e) {
        e.preventDefault();
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementMouseDown = function () {
        this.mouseDownStarted = true;
        this.focusedPriorToMouseDown = this.isActive;
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementMouseUp = function (e) {
        this.mouseDownStarted = false;
        e.preventDefault();
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementClick = function (e) {
        this.mouseDownStarted = false;
        this.switchedPartOnPreviousKeyAction = false;
        var selection = this.selection;
        if (this.isInCaretMode()) {
            // explicitly refresh the input element value
            // caret mode can change the number of symbols in the element
            // thus clicking on a segment can result in incorrect selection
            this.forceUpdate();
        }
        if (e.detail === 3) {
            // when 3 clicks occur, leave the native event to handle the change
            // this results in selecting the whole element value
        }
        else {
            if (this.isActive && this.options.selectNearestSegmentOnFocus) {
                var selectionPresent = this.element.selectionStart !== this.element.selectionEnd;
                var placeholderToggled = isPresent(this.options.placeholder) &&
                    !this.dateObject.hasValue() &&
                    !this.focusedPriorToMouseDown;
                // focus first segment if the user hasn't selected something during mousedown and if the placeholder was just toggled
                var selectFirstSegment = !selectionPresent && placeholderToggled;
                var index = selectFirstSegment ? 0 : this.caret()[0];
                this.selectNearestSegment(index);
            }
            else {
                this.setSelection(this.selectionByIndex(selection.start));
            }
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementInput = function (e) {
        this.triggerInput({ event: e });
        if (!this.element || !this.dateObject) {
            return;
        }
        var switchedPartOnPreviousKeyAction = this.switchedPartOnPreviousKeyAction;
        if (this.isPasteInProgress) {
            if (this.options.allowCaretMode) {
                // pasting should leave the input with caret
                // thus allow direct input instead of selection mode
                this.resetSegmentValue = false;
            }
            this.updateOnPaste(e);
            this.isPasteInProgress = false;
            return;
        }
        var keyDownEvent = this.keyDownEvent || {};
        var isBackspaceKey = keyDownEvent.keyCode === KeyCode.BACKSPACE || keyDownEvent.key === Key.BACKSPACE;
        var isDeleteKey = keyDownEvent.keyCode === KeyCode.DELETE || keyDownEvent.key === Key.DELETE;
        var originalInteractionMode = this.interactionMode;
        if (this.options.allowCaretMode &&
            originalInteractionMode !== DateInputInteractionMode.Caret &&
            !isDeleteKey && !isBackspaceKey) {
            this.resetSegmentValue = true;
        }
        if (this.options.allowCaretMode) {
            this.interactionMode = DateInputInteractionMode.Caret;
        }
        else {
            this.interactionMode = DateInputInteractionMode.Selection;
        }
        var hasCaret = this.isInCaretMode();
        if (hasCaret && this.keyDownEvent.key === Key.SPACE) {
            // do not allow custom "holes" in the date segments
            this.restorePreviousInputEventState();
            return;
        }
        var oldExistingDateValue = this.dateObject && this.dateObject.getValue();
        var oldDateValue = this.dateObject ? this.dateObject.value : null;
        var _a = this.dateObject.getTextAndFormat(), currentText = _a.text, currentFormat = _a.format;
        this.currentFormat = currentFormat;
        var oldText = "";
        if (hasCaret) {
            if (isBackspaceKey || isDeleteKey) {
                oldText = this.previousElementValue;
            }
            else if (originalInteractionMode === DateInputInteractionMode.Caret) {
                oldText = this.previousElementValue;
            }
            else {
                oldText = currentText;
            }
        }
        else {
            oldText = currentText;
        }
        var newText = this.elementValue;
        var diff = approximateStringMatching({
            oldText: oldText,
            newText: newText,
            formatPattern: this.currentFormat,
            selectionStart: this.selection.start,
            isInCaretMode: hasCaret,
            keyEvent: this.keyDownEvent
        });
        if (diff && diff.length && diff[0] && diff[0][1] !== Constants.formatSeparator) {
            this.switchedPartOnPreviousKeyAction = false;
        }
        if (hasCaret && (!diff || diff.length === 0)) {
            this.restorePreviousInputEventState();
            return;
        }
        else if (hasCaret && diff.length === 1) {
            if (!diff[0] || !diff[0][0]) {
                this.restorePreviousInputEventState();
                return;
            }
            else if (hasCaret && diff[0] &&
                (diff[0][0] === Constants.formatSeparator || diff[0][1] === Constants.formatSeparator)) {
                this.restorePreviousInputEventState();
                return;
            }
        }
        var navigationOnly = (diff.length === 1 && diff[0][1] === Constants.formatSeparator);
        var parsePartsResults = [];
        var switchPart = false;
        var error = null;
        if (!navigationOnly) {
            for (var i = 0; i < diff.length; i++) {
                var parsePartResult = this.dateObject.parsePart({
                    symbol: diff[i][0],
                    currentChar: diff[i][1],
                    resetSegmentValue: this.resetSegmentValue,
                    cycleSegmentValue: !this.isInCaretMode(),
                    rawTextValue: this.element.value,
                    isDeleting: isBackspaceKey || isDeleteKey,
                    originalFormat: this.currentFormat
                });
                parsePartsResults.push(parsePartResult);
                if (!parsePartResult.value) {
                    error = { type: "parse" };
                }
                switchPart = parsePartResult.switchToNext;
            }
        }
        if (!this.options.autoSwitchParts) {
            switchPart = false;
        }
        this.resetSegmentValue = false;
        var hasFixedFormat = this.options.format === this.currentFormat ||
            // all not fixed formats are 1 symbol, e.g. "d"
            (isPresent(this.options.format) && this.options.format.length > 1);
        var lastParseResult = parsePartsResults[parsePartsResults.length - 1];
        var lastParseResultHasNoValue = lastParseResult && !isPresent(lastParseResult.value);
        var parsingFailedOnDelete = (hasCaret && (isBackspaceKey || isDeleteKey) && lastParseResultHasNoValue);
        var resetPart = lastParseResult ? lastParseResult.resetPart : false;
        var newExistingDateValue = this.dateObject.getValue();
        var hasExistingDateValueChanged = !isEqual(oldExistingDateValue, newExistingDateValue);
        var newDateValue = this.dateObject.value;
        var symbolForSelection;
        var currentSelection = this.selection;
        if (hasCaret) {
            var diffChar = diff && diff.length > 0 ? diff[0][0] : null;
            var hasLeadingZero = this.dateObject.getLeadingZero()[diffChar];
            if (diff.length && diff[0][0] !== Constants.formatSeparator) {
                if (switchPart) {
                    this.forceUpdateWithSelection();
                    this.switchDateSegment(1);
                }
                else if (resetPart) {
                    symbolForSelection = this.currentFormat[currentSelection.start];
                    if (symbolForSelection) {
                        this.forceUpdate();
                        this.setSelection(this.selectionBySymbol(symbolForSelection));
                    }
                    else {
                        this.restorePreviousInputEventState();
                    }
                }
                else if (parsingFailedOnDelete) {
                    this.forceUpdate();
                    if (diff.length && diff[0][0] !== Constants.formatSeparator) {
                        this.setSelection(this.selectionBySymbol(diff[0][0]));
                    }
                }
                else if (lastParseResultHasNoValue) {
                    if (e.data === "0" && hasLeadingZero) {
                        // do not reset element value on a leading zero
                        // wait for consecutive input to determine the value
                    }
                    else if (isPresent(oldExistingDateValue) && !isPresent(newExistingDateValue)) {
                        this.restorePreviousInputEventState();
                    }
                    else if (!isPresent(oldExistingDateValue) && isPresent(newExistingDateValue)) {
                        this.forceUpdateWithSelection();
                    }
                    else if (isPresent(oldExistingDateValue) && isPresent(newExistingDateValue)) {
                        if (hasExistingDateValueChanged) {
                            this.forceUpdateWithSelection();
                        }
                        else {
                            this.restorePreviousInputEventState();
                        }
                    }
                    else if (!isPresent(oldExistingDateValue) && !isPresent(newExistingDateValue)) {
                        this.forceUpdateWithSelection();
                    }
                    else if (oldDateValue !== newDateValue) {
                        // this can happen on auto correct when no valid value is parsed
                    }
                    else {
                        this.restorePreviousInputEventState();
                    }
                }
                else if (!lastParseResultHasNoValue) {
                    // the user types a valid but incomplete date (e.g. year "123" with format "yyyy")
                    // let them continue typing, but refresh for not fixed formats
                    if (!hasFixedFormat) {
                        this.forceUpdateWithSelection();
                    }
                }
            }
            else {
                if (!this.options.autoSwitchParts && diff[0][1] === Constants.formatSeparator) {
                    // do not change the selection when a separator is pressed
                    // this should happen only if autoSwitchKeys contains the separator explicitly
                }
                else {
                    this.setSelection(this.selectionBySymbol(diff[0][0]));
                }
            }
        }
        else if (!hasCaret) {
            this.forceUpdate();
            if (diff.length && diff[0][0] !== Constants.formatSeparator) {
                this.setSelection(this.selectionBySymbol(diff[0][0]));
            }
            if (this.options.autoSwitchParts) {
                if (navigationOnly) {
                    this.resetSegmentValue = true;
                    if (!switchedPartOnPreviousKeyAction) {
                        this.switchDateSegment(1);
                    }
                    this.switchedPartOnPreviousKeyAction = true;
                }
                else if (switchPart) {
                    this.switchDateSegment(1);
                    this.switchedPartOnPreviousKeyAction = true;
                }
            }
            else {
                if (lastParseResult && lastParseResult.switchToNext) {
                    // the value is complete and should be switched, but the "autoSwitchParts" option prevents this
                    // ensure that the segment value can be reset on next input
                    this.resetSegmentValue = true;
                }
                else if (navigationOnly) {
                    this.resetSegmentValue = true;
                    if (!switchedPartOnPreviousKeyAction) {
                        this.switchDateSegment(1);
                    }
                    this.switchedPartOnPreviousKeyAction = true;
                }
            }
            if (isBackspaceKey && this.options.selectPreviousSegmentOnBackspace) {
                // kendo angular have this UX
                this.switchDateSegment(-1);
            }
        }
        this.tryTriggerValueChange({
            oldValue: oldExistingDateValue,
            event: e
        });
        this.triggerInputEnd({ event: e, error: error });
        if (hasCaret) {
            // a format like "F" can dynamically change the resolved format pattern based on the value, e.g.
            // "Tuesday, February 1, 2022 3:04:05 AM" becomes
            // "Wednesday, February 2, 2022 3:04:05 AM" giving a diff of 2 ("Tuesday".length - "Wednesday".length)
            this.setTextAndFormat();
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementFocus = function (e) {
        if (this.triggerFocus({ event: e })) {
            return;
        }
        this.isActive = true;
        this.interactionMode = DateInputInteractionMode.None;
        this.switchedPartOnPreviousKeyAction = false;
        this.refreshElementValue();
        if (!this.mouseDownStarted) {
            this.caret(0, this.elementValue.length);
        }
        this.mouseDownStarted = false;
        this.triggerFocusEnd({ event: e });
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementBlur = function (e) {
        this.resetSegmentValue = true;
        this.isActive = false;
        if (this.triggerBlur({ event: e })) {
            return;
        }
        if (this.options.autoFill) {
            this.autoFill();
        }
        this.interactionMode = DateInputInteractionMode.None;
        this.switchedPartOnPreviousKeyAction = false;
        this.refreshElementValue();
        this.triggerBlurEnd({ event: e });
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementChange = function (e) {
        this.triggerChange({ event: e });
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementKeyDown = function (e) {
        if (this.triggerKeyDown({ event: e })) {
            return;
        }
        var _a = this.selection, start = _a.start, end = _a.end;
        this.keyDownEvent = e;
        this.previousElementValue = this.element.value;
        this.previousElementSelection = { start: start, end: end };
        if (this.keyEventMatchesAutoSwitchKeys(e)) {
            var isTabKey = e.keyCode === KeyCode.TAB;
            if (isTabKey) {
                var _b = this.selection, selectionStart = _b.start, selectionEnd = _b.end;
                if (e.shiftKey && isTabKey) {
                    this.switchDateSegment(-1);
                }
                else {
                    this.switchDateSegment(1);
                }
                if (selectionStart !== this.selection.start || selectionEnd !== this.selection.end) {
                    // when the selection changes, prevent the default Tab behavior
                    e.preventDefault();
                    return;
                }
            }
            else {
                // do not allow the "input" event to be triggered
                e.preventDefault();
                this.switchDateSegment(1);
                return;
            }
        }
        var symbol = this.currentFormat[this.selection.start];
        var step = this.getStepFromSymbol(symbol);
        var shouldPreventDefault = false;
        if (e.altKey || e.ctrlKey || e.metaKey || e.keyCode === KeyCode.TAB) {
            return;
        }
        switch (e.keyCode) {
            case KeyCode.ARROW_LEFT:
                this.switchDateSegment(-1);
                shouldPreventDefault = true;
                this.switchedPartOnPreviousKeyAction = false;
                break;
            case KeyCode.ARROW_UP:
                this.modifyDateSegmentValue(step, symbol, event);
                shouldPreventDefault = true;
                this.switchedPartOnPreviousKeyAction = false;
                break;
            case KeyCode.ARROW_RIGHT:
                this.switchDateSegment(1);
                shouldPreventDefault = true;
                this.switchedPartOnPreviousKeyAction = false;
                break;
            case KeyCode.ARROW_DOWN:
                this.modifyDateSegmentValue(-step, symbol, event);
                shouldPreventDefault = true;
                this.switchedPartOnPreviousKeyAction = false;
                break;
            case KeyCode.ENTER:
                // todo: handle "change" event
                break;
            case KeyCode.HOME:
                this.selectNearestSegment(0);
                shouldPreventDefault = true;
                this.switchedPartOnPreviousKeyAction = false;
                this.resetSegmentValue = true;
                break;
            case KeyCode.END:
                this.selectNearestSegment(this.elementValue.length);
                shouldPreventDefault = true;
                this.switchedPartOnPreviousKeyAction = false;
                this.resetSegmentValue = true;
                break;
            default:
                // allow the "input" event to handle the change
                return;
        }
        if (shouldPreventDefault) {
            e.preventDefault();
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementPaste = function () {
        this.isPasteInProgress = true;
    };
    /**
     * @hidden
     */
    DateInput.prototype.onElementMouseWheel = function (e) {
        if (!this.options.enableMouseWheel || this.triggerMouseWheel({ event: e })) {
            return;
        }
        if (!this.isActive) {
            return;
        }
        var event = e;
        if (event.shiftKey) {
            this.switchDateSegment((event.wheelDelta || -event.detail) > 0 ? -1 : 1);
        }
        else {
            this.modifyDateSegmentValue((event.wheelDelta || -event.detail) > 0 ? 1 : -1);
        }
        event.returnValue = false;
        if (event.preventDefault) {
            event.preventDefault();
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        }
    };
    DateInput.prototype.updateOnPaste = function (e) {
        var value = this.intl.parseDate(this.elementValue, this.inputFormat) || this.value;
        if (isPresent(value) && this.dateObject.shouldNormalizeCentury()) {
            value = this.dateObject.normalizeCentury(value);
        }
        var oldDateObjectValue = this.dateObject && this.dateObject.getValue();
        this.writeValue(value);
        this.tryTriggerValueChange({
            oldValue: oldDateObjectValue,
            event: e
        });
    };
    Object.defineProperty(DateInput.prototype, "elementValue", {
        get: function () {
            return (this.element || {}).value || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateInput.prototype, "inputFormat", {
        get: function () {
            if (!this.options.format) {
                return Constants.defaultDateFormat;
            }
            if (typeof this.options.format === 'string') {
                return this.options.format;
            }
            else {
                return this.options.format.inputFormat;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateInput.prototype, "displayFormat", {
        get: function () {
            if (!this.options.format) {
                return Constants.defaultDateFormat;
            }
            if (typeof this.options.format === 'string') {
                return this.options.format;
            }
            else {
                return this.options.format.displayFormat;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateInput.prototype, "selection", {
        get: function () {
            var returnValue = { start: 0, end: 0 };
            if (this.element !== null && this.element.selectionStart !== undefined) {
                returnValue = {
                    start: this.element.selectionStart,
                    end: this.element.selectionEnd
                };
            }
            return returnValue;
        },
        enumerable: true,
        configurable: true
    });
    DateInput.prototype.setSelection = function (selection) {
        if (this.element && document.activeElement === this.element) {
            this.element.setSelectionRange(selection.start, selection.end);
            if (selection.start !== selection.end) {
                this.interactionMode = DateInputInteractionMode.Selection;
            }
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.selectionBySymbol = function (symbol) {
        var start = -1;
        var end = 0;
        for (var i = 0; i < this.currentFormat.length; i++) {
            if (this.currentFormat[i] === symbol) {
                end = i + 1;
                if (start === -1) {
                    start = i;
                }
            }
        }
        if (start < 0) {
            start = 0;
        }
        if (!this.options.autoCorrectParts && this.currentFormat.length !== this.currentText.length) {
            if (this.currentFormat.length < this.currentText.length) {
                end += this.currentText.length - this.currentFormat.length;
            }
            else {
                end = Math.max(0, end - (this.currentFormat.length - this.currentText.length));
            }
        }
        return { start: start, end: end };
    };
    /**
     * @hidden
     */
    DateInput.prototype.selectionByIndex = function (index) {
        var selection = { start: index, end: index };
        for (var i = index, j = index - 1; i < this.currentFormat.length || j >= 0; i++, j--) {
            if (i < this.currentFormat.length && this.currentFormat[i] !== Constants.formatSeparator) {
                selection = this.selectionBySymbol(this.currentFormat[i]);
                break;
            }
            if (j >= 0 && this.currentFormat[j] !== Constants.formatSeparator) {
                selection = this.selectionBySymbol(this.currentFormat[j]);
                break;
            }
        }
        return selection;
    };
    DateInput.prototype.switchDateSegment = function (offset) {
        var selection = this.selection;
        if (this.isInCaretMode()) {
            var start = selection.start;
            var currentSymbol = this.currentFormat[start - 1];
            var symbol = "";
            var symbolCandidate = "";
            if (offset < 0) {
                for (var i = start + offset; i >= 0; i--) {
                    symbolCandidate = this.currentFormat[i];
                    if (symbolCandidate !== Constants.formatSeparator &&
                        symbolCandidate !== currentSymbol) {
                        start = i;
                        symbol = symbolCandidate;
                        break;
                    }
                }
            }
            else {
                for (var i = start + offset; i < this.currentFormat.length; i++) {
                    symbolCandidate = this.currentFormat[i];
                    if (symbolCandidate !== Constants.formatSeparator &&
                        symbolCandidate !== currentSymbol) {
                        start = i;
                        symbol = symbolCandidate;
                        break;
                    }
                }
            }
            if (symbol) {
                this.forceUpdate();
                this.setSelection(this.selectionBySymbol(symbol));
                this.interactionMode = DateInputInteractionMode.Selection;
                return;
            }
        }
        this.interactionMode = DateInputInteractionMode.None;
        var _a = this.selection, selectionStart = _a.start, selectionEnd = _a.end;
        if (selectionStart < selectionEnd &&
            this.currentFormat[selectionStart] !== this.currentFormat[selectionEnd - 1]) {
            this.setSelection(this.selectionByIndex(offset > 0 ? selectionStart : selectionEnd - 1));
            this.resetSegmentValue = true;
            this.interactionMode = DateInputInteractionMode.None;
            return;
        }
        var previousFormatSymbol = this.currentFormat[selectionStart];
        var a = selectionStart + offset;
        while (a > 0 && a < this.currentFormat.length) {
            if (this.currentFormat[a] !== previousFormatSymbol &&
                this.currentFormat[a] !== Constants.formatSeparator) {
                break;
            }
            a += offset;
        }
        if (this.currentFormat[a] === Constants.formatSeparator) {
            // no known symbol is found
            return;
        }
        var b = a;
        while (b >= 0 && b < this.currentFormat.length) {
            if (this.currentFormat[b] !== this.currentFormat[a]) {
                break;
            }
            b += offset;
        }
        if (a > b && (b + 1 !== selectionStart || a + 1 !== selectionEnd)) {
            this.setSelection({ start: b + 1, end: a + 1 });
            this.resetSegmentValue = true;
        }
        else if (a < b && (a !== selectionStart || b !== selectionEnd)) {
            this.setSelection({ start: a, end: b });
            this.resetSegmentValue = true;
        }
        this.interactionMode = DateInputInteractionMode.None;
    };
    DateInput.prototype.modifyDateSegmentValue = function (offset, symbol, event) {
        if (symbol === void 0) { symbol = ""; }
        if (event === void 0) { event = {}; }
        if (!this.dateObject || this.options.readonly) {
            return;
        }
        var oldValue = this.value;
        var step = DEFAULT_SEGMENT_STEP * offset;
        var caret = this.caret();
        symbol = symbol || this.currentFormat[caret[0]];
        if (symbol === "S" && !this.options.steps.millisecond) {
            var msDigits = millisecondDigitsInFormat(this.inputFormat);
            step = millisecondStepFor(msDigits);
        }
        this.dateObject.modifyPart(symbol, step);
        this.tryTriggerValueChange({
            oldValue: oldValue,
            event: event
        });
        this.forceUpdate();
        this.setSelection(this.selectionBySymbol(symbol));
    };
    /**
     * @hidden
     */
    DateInput.prototype.tryTriggerValueChange = function (args) {
        if (args === void 0) { args = { oldValue: null, event: {} }; }
        if (!isEqual(this.value, args.oldValue)) {
            return this.triggerValueChange(args);
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerValueChange = function (args) {
        if (args === void 0) { args = { oldValue: null, event: {} }; }
        return this.trigger(VALUE_CHANGE, extend(args, {
            value: this.value
        }));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerInput = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(INPUT, extend(args, {
            value: this.value
        }));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerInputEnd = function (args) {
        if (args === void 0) { args = { event: {}, error: null }; }
        return this.trigger(INPUT_END, extend(args, {
            value: this.value
        }));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerFocus = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(FOCUS, extend({}, args));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerFocusEnd = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(FOCUS_END, extend({}, args));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerBlur = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(BLUR, extend({}, args));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerBlurEnd = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(BLUR_END, extend({}, args));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerChange = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(CHANGE, extend(args, {
            value: this.value
        }));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerKeyDown = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(KEY_DOWN, extend({}, args));
    };
    /**
     * @hidden
     */
    DateInput.prototype.triggerMouseWheel = function (args) {
        if (args === void 0) { args = { event: {} }; }
        return this.trigger(MOUSE_WHEEL, extend({}, args));
    };
    /**
     * @hidden
     */
    DateInput.prototype.forceUpdate = function () {
        this.setTextAndFormat();
        this.refreshElementValue();
    };
    /**
     * @hidden
     */
    DateInput.prototype.forceUpdateWithSelection = function () {
        var _a = this.selection, start = _a.start, end = _a.end;
        var elementValueLength = this.elementValue.length;
        this.forceUpdate();
        var selectionOffset = this.elementValue.length - elementValueLength;
        this.setSelection({
            start: start + selectionOffset,
            end: end + selectionOffset
        });
    };
    /**
     * @hidden
     */
    DateInput.prototype.setTextAndFormat = function () {
        var _a = this.dateObject.getTextAndFormat(), currentText = _a.text, currentFormat = _a.format;
        this.currentFormat = currentFormat;
        this.currentText = currentText;
    };
    /**
     * @hidden
     */
    DateInput.prototype.setElementValue = function (value) {
        this.element.value = value;
    };
    /**
     * @hidden
     */
    DateInput.prototype.getStepFromSymbol = function (symbol) {
        /* eslint-disable no-fallthrough */
        switch (symbol) {
            case "S":
                return Number(this.options.steps.millisecond);
            case "s":
                return Number(this.options.steps.second);
            case "m":
                return Number(this.options.steps.minute);
            // represents hour as value from 01 through 12
            case "h":
            // represents hour as value from 01 through 23
            case "H":
                return Number(this.options.steps.hour);
            case "M":
                return Number(this.options.steps.month);
            // there is no 'D' format specifier for day
            case "d":
            // used for formats such as "EEEE, MMMM d, yyyy",
            // where "EEEE" stands for full name of the day e.g. Monday
            case "E":
                return Number(this.options.steps.day);
            // there is no 'Y' format specifier for year
            case "y":
                return Number(this.options.steps.year);
            default:
                return DEFAULT_SEGMENT_STEP;
        }
        /* eslint-enable no-fallthrough */
    };
    /**
     * @hidden
     */
    DateInput.prototype.restorePreviousInputEventState = function () {
        this.restorePreviousElementValue();
        this.restorePreviousElementSelection();
    };
    /**
     * @hidden
     */
    DateInput.prototype.restorePreviousElementValue = function () {
        this.setElementValue(this.previousElementValue || '');
    };
    /**
     * @hidden
     */
    DateInput.prototype.restorePreviousElementSelection = function () {
        var _a = this.previousElementSelection, start = _a.start, end = _a.end;
        this.setSelection({ start: start || 0, end: end || 0 });
    };
    DateInput.prototype.writeValue = function (value) {
        this.verifyValue(value);
        this.dateObject = this.getDateObject(value);
        this.refreshElementValue();
    };
    DateInput.prototype.verifyValue = function (value) {
        if (value && !isValidDate(value)) {
            throw new Error("The 'value' should be a valid JavaScript Date instance.");
        }
    };
    DateInput.prototype.refreshElementValue = function () {
        var start = this.caret()[0];
        var element = this.element;
        var format = this.isActive ? this.inputFormat : this.displayFormat;
        var _a = this.dateObject.getTextAndFormat(format), currentText = _a.text, currentFormat = _a.format;
        this.currentFormat = currentFormat;
        this.currentText = currentText;
        var hasPlaceholder = this.options.hasPlaceholder || isPresent(this.options.placeholder);
        var showPlaceholder = !this.isActive &&
            hasPlaceholder &&
            !this.dateObject.hasValue();
        if (hasPlaceholder && isPresent(this.options.placeholder)) {
            element.placeholder = this.options.placeholder;
        }
        var newElementValue = showPlaceholder ? "" : currentText;
        this.previousElementValue = this.elementValue;
        this.setElementValue(newElementValue);
        if (this.isActive && !this.options.allowCaretMode && this.options.selectNearestSegmentOnFocus) {
            this.selectNearestSegment(start);
        }
    };
    /**
     * @hidden
     */
    DateInput.prototype.caret = function (start, end) {
        if (end === void 0) { end = start; }
        var isPosition = start !== undefined;
        var returnValue = [start, start];
        var element = this.element;
        if (isPosition && (this.options.disabled || this.options.readonly)) {
            return undefined;
        }
        try {
            if (element.selectionStart !== undefined) {
                if (isPosition) {
                    if (isDocumentAvailable() && document.activeElement !== element) {
                        element.focus();
                    }
                    element.setSelectionRange(start, end);
                }
                returnValue = [element.selectionStart, element.selectionEnd];
            }
        }
        catch (e) {
            returnValue = [];
        }
        return returnValue;
    };
    DateInput.prototype.selectNearestSegment = function (index) {
        // Finds the nearest (in both directions) known part.
        for (var i = index, j = index - 1; i < this.currentFormat.length || j >= 0; i++, j--) {
            if (i < this.currentFormat.length && this.currentFormat[i] !== "_") {
                this.selectDateSegment(this.currentFormat[i]);
                return;
            }
            if (j >= 0 && this.currentFormat[j] !== "_") {
                this.selectDateSegment(this.currentFormat[j]);
                return;
            }
        }
    };
    DateInput.prototype.selectDateSegment = function (symbol) {
        var begin = -1;
        var end = 0;
        for (var i = 0; i < this.currentFormat.length; i++) {
            if (this.currentFormat[i] === symbol) {
                end = i + 1;
                if (begin === -1) {
                    begin = i;
                }
            }
        }
        if (begin < 0) {
            begin = 0;
        }
        this.caret(0, 0);
        this.caret(begin, end);
    };
    /**
     * @hidden
     */
    DateInput.prototype.getDateObject = function (value) {
        var leadingZero = ((this.dateObject || {}) || null).leadingZero;
        this.options.value = value;
        var dateObject = this.createDateObject();
        dateObject.setLeadingZero(this.isActive ? leadingZero : null);
        return dateObject;
    };
    /* tslint:disable:align */
    /**
     * @hidden
     */
    DateInput.prototype.createDateObject = function () {
        var defaultOptions = this.getDateObjectOptions();
        var dateObject = new DateObject(extend({}, defaultOptions));
        return dateObject;
    };
    /**
     * @hidden
     */
    DateInput.prototype.getDateObjectOptions = function () {
        var newOptions = {
            intlService: this.options.intlService,
            formatPlaceholder: this.options.formatPlaceholder ? this.options.formatPlaceholder : 'formatPattern',
            format: this.inputFormat,
            cycleTime: this.options.cycleTime,
            twoDigitYearMax: this.options.twoDigitYearMax,
            autoCorrectParts: this.options.autoCorrectParts,
            value: this.options.value
        };
        return newOptions;
    };
    /* tslint:enable:align */
    /**
     * @hidden
     */
    DateInput.prototype.keyEventMatchesAutoSwitchKeys = function (keyObject) {
        var autoSwitchKeys = (this.options.autoSwitchKeys || [])
            .map(function (x) { return x.toString().toLowerCase().trim(); });
        if (autoSwitchKeys.indexOf(keyObject.keyCode.toString()) >= 0 ||
            autoSwitchKeys.indexOf(keyObject.keyCode) >= 0 ||
            autoSwitchKeys.indexOf(keyObject.key.toLowerCase().trim()) >= 0) {
            return true;
        }
        return false;
    };
    /**
     * @hidden
     */
    DateInput.prototype.autoFill = function () {
        var dateObject = this.dateObject, currentDate = new Date(), day, month, year, hours, minutes, seconds;
        if (dateObject.date || dateObject.month || dateObject.year || dateObject.hours || dateObject.minutes || dateObject.seconds) {
            year = dateObject.year ? dateObject.value.getFullYear() : currentDate.getFullYear(),
                month = dateObject.month ? dateObject.value.getMonth() : currentDate.getMonth(),
                day = dateObject.date ? dateObject.value.getDate() : currentDate.getDate(),
                hours = dateObject.hours ? dateObject.value.getHours() : currentDate.getHours(),
                minutes = dateObject.minutes ? dateObject.value.getMinutes() : currentDate.getMinutes(),
                seconds = dateObject.seconds ? dateObject.value.getSeconds() : currentDate.getSeconds();
            dateObject.setValue(new Date(year, month, day, hours, minutes, seconds));
            this.refreshElementValue();
            this.triggerChange();
        }
    };
    return DateInput;
}(Observable));

var __meta__ = {
    id: "dateinputcommon",
    name: "DateInputCommon",
    category: "web",
    description: "This is the common package for date editing accross all kendo flavours",
    depends: ["core"]
};

(function($, undefined$1) {
    kendo.ui.DateInputCommon = DateInput;
})(window.kendo.jQuery);
var kendo$1 = kendo;

module.exports = kendo$1;
