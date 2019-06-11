(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {

  }, {}], 2: [function (require, module, exports) {
    (function (global) {
      'use strict';

      // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
      // original notice:

      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */
      function compare(a, b) {
        if (a === b) {
          return 0;
        }

        var x = a.length;
        var y = b.length;

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }

        if (x < y) {
          return -1;
        }
        if (y < x) {
          return 1;
        }
        return 0;
      }
      function isBuffer(b) {
        if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
          return global.Buffer.isBuffer(b);
        }
        return !!(b != null && b._isBuffer);
      }

      // based on node assert, original notice:

      // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
      //
      // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
      //
      // Originally from narwhal.js (http://narwhaljs.org)
      // Copyright (c) 2009 Thomas Robinson <280north.com>
      //
      // Permission is hereby granted, free of charge, to any person obtaining a copy
      // of this software and associated documentation files (the 'Software'), to
      // deal in the Software without restriction, including without limitation the
      // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
      // sell copies of the Software, and to permit persons to whom the Software is
      // furnished to do so, subject to the following conditions:
      //
      // The above copyright notice and this permission notice shall be included in
      // all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
      // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
      // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

      var util = require('util/');
      var hasOwn = Object.prototype.hasOwnProperty;
      var pSlice = Array.prototype.slice;
      var functionsHaveNames = (function () {
        return function foo() { }.name === 'foo';
      }());
      function pToString(obj) {
        return Object.prototype.toString.call(obj);
      }
      function isView(arrbuf) {
        if (isBuffer(arrbuf)) {
          return false;
        }
        if (typeof global.ArrayBuffer !== 'function') {
          return false;
        }
        if (typeof ArrayBuffer.isView === 'function') {
          return ArrayBuffer.isView(arrbuf);
        }
        if (!arrbuf) {
          return false;
        }
        if (arrbuf instanceof DataView) {
          return true;
        }
        if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
          return true;
        }
        return false;
      }
      // 1. The assert module provides functions that throw
      // AssertionError's when particular conditions are not met. The
      // assert module must conform to the following interface.

      var assert = module.exports = ok;

      // 2. The AssertionError is defined in assert.
      // new assert.AssertionError({ message: message,
      //                             actual: actual,
      //                             expected: expected })

      var regex = /\s*function\s+([^\(\s]*)\s*/;
      // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
      function getName(func) {
        if (!util.isFunction(func)) {
          return;
        }
        if (functionsHaveNames) {
          return func.name;
        }
        var str = func.toString();
        var match = str.match(regex);
        return match && match[1];
      }
      assert.AssertionError = function AssertionError(options) {
        this.name = 'AssertionError';
        this.actual = options.actual;
        this.expected = options.expected;
        this.operator = options.operator;
        if (options.message) {
          this.message = options.message;
          this.generatedMessage = false;
        } else {
          this.message = getMessage(this);
          this.generatedMessage = true;
        }
        var stackStartFunction = options.stackStartFunction || fail;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, stackStartFunction);
        } else {
          // non v8 browsers so we can have a stacktrace
          var err = new Error();
          if (err.stack) {
            var out = err.stack;

            // try to strip useless frames
            var fn_name = getName(stackStartFunction);
            var idx = out.indexOf('\n' + fn_name);
            if (idx >= 0) {
              // once we have located the function frame
              // we need to strip out everything before it (and its line)
              var next_line = out.indexOf('\n', idx + 1);
              out = out.substring(next_line + 1);
            }

            this.stack = out;
          }
        }
      };

      // assert.AssertionError instanceof Error
      util.inherits(assert.AssertionError, Error);

      function truncate(s, n) {
        if (typeof s === 'string') {
          return s.length < n ? s : s.slice(0, n);
        } else {
          return s;
        }
      }
      function inspect(something) {
        if (functionsHaveNames || !util.isFunction(something)) {
          return util.inspect(something);
        }
        var rawname = getName(something);
        var name = rawname ? ': ' + rawname : '';
        return '[Function' + name + ']';
      }
      function getMessage(self) {
        return truncate(inspect(self.actual), 128) + ' ' +
          self.operator + ' ' +
          truncate(inspect(self.expected), 128);
      }

      // At present only the three keys mentioned above are used and
      // understood by the spec. Implementations or sub modules can pass
      // other keys to the AssertionError's constructor - they will be
      // ignored.

      // 3. All of the following functions must throw an AssertionError
      // when a corresponding condition is not met, with a message that
      // may be undefined if not provided.  All assertion methods provide
      // both the actual and expected values to the assertion error for
      // display purposes.

      function fail(actual, expected, message, operator, stackStartFunction) {
        throw new assert.AssertionError({
          message: message,
          actual: actual,
          expected: expected,
          operator: operator,
          stackStartFunction: stackStartFunction
        });
      }

      // EXTENSION! allows for well behaved errors defined elsewhere.
      assert.fail = fail;

      // 4. Pure assertion tests whether a value is truthy, as determined
      // by !!guard.
      // assert.ok(guard, message_opt);
      // This statement is equivalent to assert.equal(true, !!guard,
      // message_opt);. To test strictly for the value true, use
      // assert.strictEqual(true, guard, message_opt);.

      function ok(value, message) {
        if (!value) fail(value, true, message, '==', assert.ok);
      }
      assert.ok = ok;

      // 5. The equality assertion tests shallow, coercive equality with
      // ==.
      // assert.equal(actual, expected, message_opt);

      assert.equal = function equal(actual, expected, message) {
        if (actual != expected) fail(actual, expected, message, '==', assert.equal);
      };

      // 6. The non-equality assertion tests for whether two objects are not equal
      // with != assert.notEqual(actual, expected, message_opt);

      assert.notEqual = function notEqual(actual, expected, message) {
        if (actual == expected) {
          fail(actual, expected, message, '!=', assert.notEqual);
        }
      };

      // 7. The equivalence assertion tests a deep equality relation.
      // assert.deepEqual(actual, expected, message_opt);

      assert.deepEqual = function deepEqual(actual, expected, message) {
        if (!_deepEqual(actual, expected, false)) {
          fail(actual, expected, message, 'deepEqual', assert.deepEqual);
        }
      };

      assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
        if (!_deepEqual(actual, expected, true)) {
          fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
        }
      };

      function _deepEqual(actual, expected, strict, memos) {
        // 7.1. All identical values are equivalent, as determined by ===.
        if (actual === expected) {
          return true;
        } else if (isBuffer(actual) && isBuffer(expected)) {
          return compare(actual, expected) === 0;

          // 7.2. If the expected value is a Date object, the actual value is
          // equivalent if it is also a Date object that refers to the same time.
        } else if (util.isDate(actual) && util.isDate(expected)) {
          return actual.getTime() === expected.getTime();

          // 7.3 If the expected value is a RegExp object, the actual value is
          // equivalent if it is also a RegExp object with the same source and
          // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
        } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
          return actual.source === expected.source &&
            actual.global === expected.global &&
            actual.multiline === expected.multiline &&
            actual.lastIndex === expected.lastIndex &&
            actual.ignoreCase === expected.ignoreCase;

          // 7.4. Other pairs that do not both pass typeof value == 'object',
          // equivalence is determined by ==.
        } else if ((actual === null || typeof actual !== 'object') &&
          (expected === null || typeof expected !== 'object')) {
          return strict ? actual === expected : actual == expected;

          // If both values are instances of typed arrays, wrap their underlying
          // ArrayBuffers in a Buffer each to increase performance
          // This optimization requires the arrays to have the same type as checked by
          // Object.prototype.toString (aka pToString). Never perform binary
          // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
          // bit patterns are not identical.
        } else if (isView(actual) && isView(expected) &&
          pToString(actual) === pToString(expected) &&
          !(actual instanceof Float32Array ||
            actual instanceof Float64Array)) {
          return compare(new Uint8Array(actual.buffer),
            new Uint8Array(expected.buffer)) === 0;

          // 7.5 For all other Object pairs, including Array objects, equivalence is
          // determined by having the same number of owned properties (as verified
          // with Object.prototype.hasOwnProperty.call), the same set of keys
          // (although not necessarily the same order), equivalent values for every
          // corresponding key, and an identical 'prototype' property. Note: this
          // accounts for both named and indexed properties on Arrays.
        } else if (isBuffer(actual) !== isBuffer(expected)) {
          return false;
        } else {
          memos = memos || { actual: [], expected: [] };

          var actualIndex = memos.actual.indexOf(actual);
          if (actualIndex !== -1) {
            if (actualIndex === memos.expected.indexOf(expected)) {
              return true;
            }
          }

          memos.actual.push(actual);
          memos.expected.push(expected);

          return objEquiv(actual, expected, strict, memos);
        }
      }

      function isArguments(object) {
        return Object.prototype.toString.call(object) == '[object Arguments]';
      }

      function objEquiv(a, b, strict, actualVisitedObjects) {
        if (a === null || a === undefined || b === null || b === undefined)
          return false;
        // if one is a primitive, the other must be same
        if (util.isPrimitive(a) || util.isPrimitive(b))
          return a === b;
        if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
          return false;
        var aIsArgs = isArguments(a);
        var bIsArgs = isArguments(b);
        if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
          return false;
        if (aIsArgs) {
          a = pSlice.call(a);
          b = pSlice.call(b);
          return _deepEqual(a, b, strict);
        }
        var ka = objectKeys(a);
        var kb = objectKeys(b);
        var key, i;
        // having the same number of owned properties (keys incorporates
        // hasOwnProperty)
        if (ka.length !== kb.length)
          return false;
        //the same set of keys (although not necessarily the same order),
        ka.sort();
        kb.sort();
        //~~~cheap key test
        for (i = ka.length - 1; i >= 0; i--) {
          if (ka[i] !== kb[i])
            return false;
        }
        //equivalent values for every corresponding key, and
        //~~~possibly expensive deep test
        for (i = ka.length - 1; i >= 0; i--) {
          key = ka[i];
          if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
            return false;
        }
        return true;
      }

      // 8. The non-equivalence assertion tests for any deep inequality.
      // assert.notDeepEqual(actual, expected, message_opt);

      assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
        if (_deepEqual(actual, expected, false)) {
          fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
        }
      };

      assert.notDeepStrictEqual = notDeepStrictEqual;
      function notDeepStrictEqual(actual, expected, message) {
        if (_deepEqual(actual, expected, true)) {
          fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
        }
      }


      // 9. The strict equality assertion tests strict equality, as determined by ===.
      // assert.strictEqual(actual, expected, message_opt);

      assert.strictEqual = function strictEqual(actual, expected, message) {
        if (actual !== expected) {
          fail(actual, expected, message, '===', assert.strictEqual);
        }
      };

      // 10. The strict non-equality assertion tests for strict inequality, as
      // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

      assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
        if (actual === expected) {
          fail(actual, expected, message, '!==', assert.notStrictEqual);
        }
      };

      function expectedException(actual, expected) {
        if (!actual || !expected) {
          return false;
        }

        if (Object.prototype.toString.call(expected) == '[object RegExp]') {
          return expected.test(actual);
        }

        try {
          if (actual instanceof expected) {
            return true;
          }
        } catch (e) {
          // Ignore.  The instanceof check doesn't work for arrow functions.
        }

        if (Error.isPrototypeOf(expected)) {
          return false;
        }

        return expected.call({}, actual) === true;
      }

      function _tryBlock(block) {
        var error;
        try {
          block();
        } catch (e) {
          error = e;
        }
        return error;
      }

      function _throws(shouldThrow, block, expected, message) {
        var actual;

        if (typeof block !== 'function') {
          throw new TypeError('"block" argument must be a function');
        }

        if (typeof expected === 'string') {
          message = expected;
          expected = null;
        }

        actual = _tryBlock(block);

        message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
          (message ? ' ' + message : '.');

        if (shouldThrow && !actual) {
          fail(actual, expected, 'Missing expected exception' + message);
        }

        var userProvidedMessage = typeof message === 'string';
        var isUnwantedException = !shouldThrow && util.isError(actual);
        var isUnexpectedException = !shouldThrow && actual && !expected;

        if ((isUnwantedException &&
          userProvidedMessage &&
          expectedException(actual, expected)) ||
          isUnexpectedException) {
          fail(actual, expected, 'Got unwanted exception' + message);
        }

        if ((shouldThrow && actual && expected &&
          !expectedException(actual, expected)) || (!shouldThrow && actual)) {
          throw actual;
        }
      }

      // 11. Expected to throw an error:
      // assert.throws(block, Error_opt, message_opt);

      assert.throws = function (block, /*optional*/error, /*optional*/message) {
        _throws(true, block, error, message);
      };

      // EXTENSION! This is annoying to write outside this module.
      assert.doesNotThrow = function (block, /*optional*/error, /*optional*/message) {
        _throws(false, block, error, message);
      };

      assert.ifError = function (err) { if (err) throw err; };

      var objectKeys = Object.keys || function (obj) {
        var keys = [];
        for (var key in obj) {
          if (hasOwn.call(obj, key)) keys.push(key);
        }
        return keys;
      };

    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, { "util/": 5 }], 3: [function (require, module, exports) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () { }
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }

  }, {}], 4: [function (require, module, exports) {
    module.exports = function isBuffer(arg) {
      return arg && typeof arg === 'object'
        && typeof arg.copy === 'function'
        && typeof arg.fill === 'function'
        && typeof arg.readUInt8 === 'function';
    }
  }, {}], 5: [function (require, module, exports) {
    (function (process, global) {
      // Copyright Joyent, Inc. and other Node contributors.
      //
      // Permission is hereby granted, free of charge, to any person obtaining a
      // copy of this software and associated documentation files (the
      // "Software"), to deal in the Software without restriction, including
      // without limitation the rights to use, copy, modify, merge, publish,
      // distribute, sublicense, and/or sell copies of the Software, and to permit
      // persons to whom the Software is furnished to do so, subject to the
      // following conditions:
      //
      // The above copyright notice and this permission notice shall be included
      // in all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
      // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
      // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
      // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
      // USE OR OTHER DEALINGS IN THE SOFTWARE.

      var formatRegExp = /%[sdj%]/g;
      exports.format = function (f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(' ');
        }

        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function (x) {
          if (x === '%%') return '%';
          if (i >= len) return x;
          switch (x) {
            case '%s': return String(args[i++]);
            case '%d': return Number(args[i++]);
            case '%j':
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return '[Circular]';
              }
            default:
              return x;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += ' ' + x;
          } else {
            str += ' ' + inspect(x);
          }
        }
        return str;
      };


      // Mark that a method should not be used.
      // Returns a modified function which warns once by default.
      // If --no-deprecation is set, then it is a no-op.
      exports.deprecate = function (fn, msg) {
        // Allow for deprecating things in the process of starting up.
        if (isUndefined(global.process)) {
          return function () {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }

        if (process.noDeprecation === true) {
          return fn;
        }

        var warned = false;
        function deprecated() {
          if (!warned) {
            if (process.throwDeprecation) {
              throw new Error(msg);
            } else if (process.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }

        return deprecated;
      };


      var debugs = {};
      var debugEnviron;
      exports.debuglog = function (set) {
        if (isUndefined(debugEnviron))
          debugEnviron = process.env.NODE_DEBUG || '';
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
            var pid = process.pid;
            debugs[set] = function () {
              var msg = exports.format.apply(exports, arguments);
              console.error('%s %d: %s', set, pid, msg);
            };
          } else {
            debugs[set] = function () { };
          }
        }
        return debugs[set];
      };


      /**
       * Echos the value of a value. Trys to print the value out
       * in the best way possible given the different types.
       *
       * @param {Object} obj The object to print out.
       * @param {Object} opts Optional options object that alters the output.
       */
      /* legacy: obj, showHidden, depth, colors*/
      function inspect(obj, opts) {
        // default options
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        // legacy...
        if (arguments.length >= 3) ctx.depth = arguments[2];
        if (arguments.length >= 4) ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          // legacy...
          ctx.showHidden = opts;
        } else if (opts) {
          // got an "options" object
          exports._extend(ctx, opts);
        }
        // set default options
        if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
        if (isUndefined(ctx.depth)) ctx.depth = 2;
        if (isUndefined(ctx.colors)) ctx.colors = false;
        if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
        if (ctx.colors) ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;


      // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
      inspect.colors = {
        'bold': [1, 22],
        'italic': [3, 23],
        'underline': [4, 24],
        'inverse': [7, 27],
        'white': [37, 39],
        'grey': [90, 39],
        'black': [30, 39],
        'blue': [34, 39],
        'cyan': [36, 39],
        'green': [32, 39],
        'magenta': [35, 39],
        'red': [31, 39],
        'yellow': [33, 39]
      };

      // Don't use 'blue' not visible on cmd.exe
      inspect.styles = {
        'special': 'cyan',
        'number': 'yellow',
        'boolean': 'yellow',
        'undefined': 'grey',
        'null': 'bold',
        'string': 'green',
        'date': 'magenta',
        // "name": intentionally not styling
        'regexp': 'red'
      };


      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];

        if (style) {
          return '\u001b[' + inspect.colors[style][0] + 'm' + str +
            '\u001b[' + inspect.colors[style][1] + 'm';
        } else {
          return str;
        }
      }


      function stylizeNoColor(str, styleType) {
        return str;
      }


      function arrayToHash(array) {
        var hash = {};

        array.forEach(function (val, idx) {
          hash[val] = true;
        });

        return hash;
      }


      function formatValue(ctx, value, recurseTimes) {
        // Provide a hook for user-specified inspect functions.
        // Check that value is an object with an inspect function on it
        if (ctx.customInspect &&
          value &&
          isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }

        // Primitive types cannot have properties
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }

        // Look up the keys of the object.
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);

        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }

        // IE doesn't make error fields non-enumerable
        // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
        if (isError(value)
          && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
          return formatError(value);
        }

        // Some type of object without properties can be shortcutted.
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ': ' + value.name : '';
            return ctx.stylize('[Function' + name + ']', 'special');
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), 'date');
          }
          if (isError(value)) {
            return formatError(value);
          }
        }

        var base = '', array = false, braces = ['{', '}'];

        // Make Array say that they are Array
        if (isArray(value)) {
          array = true;
          braces = ['[', ']'];
        }

        // Make functions say that they are functions
        if (isFunction(value)) {
          var n = value.name ? ': ' + value.name : '';
          base = ' [Function' + n + ']';
        }

        // Make RegExps say that they are RegExps
        if (isRegExp(value)) {
          base = ' ' + RegExp.prototype.toString.call(value);
        }

        // Make dates with properties first say the date
        if (isDate(value)) {
          base = ' ' + Date.prototype.toUTCString.call(value);
        }

        // Make error with message first say the error
        if (isError(value)) {
          base = ' ' + formatError(value);
        }

        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }

        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
          } else {
            return ctx.stylize('[Object]', 'special');
          }
        }

        ctx.seen.push(value);

        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function (key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }

        ctx.seen.pop();

        return reduceToSingleString(output, base, braces);
      }


      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize('undefined', 'undefined');
        if (isString(value)) {
          var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"') + '\'';
          return ctx.stylize(simple, 'string');
        }
        if (isNumber(value))
          return ctx.stylize('' + value, 'number');
        if (isBoolean(value))
          return ctx.stylize('' + value, 'boolean');
        // For some reason typeof null is "object", so special case here.
        if (isNull(value))
          return ctx.stylize('null', 'null');
      }


      function formatError(value) {
        return '[' + Error.prototype.toString.call(value) + ']';
      }


      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true));
          } else {
            output.push('');
          }
        }
        keys.forEach(function (key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true));
          }
        });
        return output;
      }


      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize('[Getter/Setter]', 'special');
          } else {
            str = ctx.stylize('[Getter]', 'special');
          }
        } else {
          if (desc.set) {
            str = ctx.stylize('[Setter]', 'special');
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (array) {
                str = str.split('\n').map(function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + str.split('\n').map(function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = ctx.stylize('[Circular]', 'special');
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
              .replace(/\\"/g, '"')
              .replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      }


      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function (prev, cur) {
          numLinesEst++;
          if (cur.indexOf('\n') >= 0) numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
        }, 0);

        if (length > 60) {
          return braces[0] +
            (base === '' ? '' : base + '\n ') +
            ' ' +
            output.join(',\n  ') +
            ' ' +
            braces[1];
        }

        return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }


      // NOTE: These type checking functions intentionally don't use `instanceof`
      // because it is fragile and can be easily faked with `Object.create()`.
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;

      function isBoolean(arg) {
        return typeof arg === 'boolean';
      }
      exports.isBoolean = isBoolean;

      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;

      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;

      function isNumber(arg) {
        return typeof arg === 'number';
      }
      exports.isNumber = isNumber;

      function isString(arg) {
        return typeof arg === 'string';
      }
      exports.isString = isString;

      function isSymbol(arg) {
        return typeof arg === 'symbol';
      }
      exports.isSymbol = isSymbol;

      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;

      function isRegExp(re) {
        return isObject(re) && objectToString(re) === '[object RegExp]';
      }
      exports.isRegExp = isRegExp;

      function isObject(arg) {
        return typeof arg === 'object' && arg !== null;
      }
      exports.isObject = isObject;

      function isDate(d) {
        return isObject(d) && objectToString(d) === '[object Date]';
      }
      exports.isDate = isDate;

      function isError(e) {
        return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
      }
      exports.isError = isError;

      function isFunction(arg) {
        return typeof arg === 'function';
      }
      exports.isFunction = isFunction;

      function isPrimitive(arg) {
        return arg === null ||
          typeof arg === 'boolean' ||
          typeof arg === 'number' ||
          typeof arg === 'string' ||
          typeof arg === 'symbol' ||  // ES6 symbol
          typeof arg === 'undefined';
      }
      exports.isPrimitive = isPrimitive;

      exports.isBuffer = require('./support/isBuffer');

      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }


      function pad(n) {
        return n < 10 ? '0' + n.toString(10) : n.toString(10);
      }


      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'];

      // 26 Feb 16:19:34
      function timestamp() {
        var d = new Date();
        var time = [pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())].join(':');
        return [d.getDate(), months[d.getMonth()], time].join(' ');
      }


      // log is just a thin wrapper to console.log that prepends a timestamp
      exports.log = function () {
        console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
      };


      /**
       * Inherit the prototype methods from one constructor into another.
       *
       * The Function.prototype.inherits from lang.js rewritten as a standalone
       * function (not on Function.prototype). NOTE: If this file is to be loaded
       * during bootstrapping this function needs to be rewritten using some native
       * functions as prototype setup using normal JavaScript does not work as
       * expected during bootstrapping (see mirror.js in r114903).
       *
       * @param {function} ctor Constructor function which needs to inherit the
       *     prototype.
       * @param {function} superCtor Constructor function to inherit prototype from.
       */
      exports.inherits = require('inherits');

      exports._extend = function (origin, add) {
        // Don't do anything if add isn't an object
        if (!add || !isObject(add)) return origin;

        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };

      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }

    }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, { "./support/isBuffer": 4, "_process": 12, "inherits": 3 }], 6: [function (require, module, exports) {
    'use strict'

    exports.byteLength = byteLength
    exports.toByteArray = toByteArray
    exports.fromByteArray = fromByteArray

    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i]
      revLookup[code.charCodeAt(i)] = i
    }

    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63

    function getLens(b64) {
      var len = b64.length

      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }

      // Trim off extra bytes after placeholder bytes are found
      // See: https://github.com/beatgammit/base64-js/issues/42
      var validLen = b64.indexOf('=')
      if (validLen === -1) validLen = len

      var placeHoldersLen = validLen === len
        ? 0
        : 4 - (validLen % 4)

      return [validLen, placeHoldersLen]
    }

    // base64 is 4/3 + up to two characters of the original data
    function byteLength(b64) {
      var lens = getLens(b64)
      var validLen = lens[0]
      var placeHoldersLen = lens[1]
      return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    function _byteLength(b64, validLen, placeHoldersLen) {
      return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    function toByteArray(b64) {
      var tmp
      var lens = getLens(b64)
      var validLen = lens[0]
      var placeHoldersLen = lens[1]

      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

      var curByte = 0

      // if there are placeholders, only get up to the last complete 4 chars
      var len = placeHoldersLen > 0
        ? validLen - 4
        : validLen

      for (var i = 0; i < len; i += 4) {
        tmp =
          (revLookup[b64.charCodeAt(i)] << 18) |
          (revLookup[b64.charCodeAt(i + 1)] << 12) |
          (revLookup[b64.charCodeAt(i + 2)] << 6) |
          revLookup[b64.charCodeAt(i + 3)]
        arr[curByte++] = (tmp >> 16) & 0xFF
        arr[curByte++] = (tmp >> 8) & 0xFF
        arr[curByte++] = tmp & 0xFF
      }

      if (placeHoldersLen === 2) {
        tmp =
          (revLookup[b64.charCodeAt(i)] << 2) |
          (revLookup[b64.charCodeAt(i + 1)] >> 4)
        arr[curByte++] = tmp & 0xFF
      }

      if (placeHoldersLen === 1) {
        tmp =
          (revLookup[b64.charCodeAt(i)] << 10) |
          (revLookup[b64.charCodeAt(i + 1)] << 4) |
          (revLookup[b64.charCodeAt(i + 2)] >> 2)
        arr[curByte++] = (tmp >> 8) & 0xFF
        arr[curByte++] = tmp & 0xFF
      }

      return arr
    }

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3F] +
        lookup[num >> 12 & 0x3F] +
        lookup[num >> 6 & 0x3F] +
        lookup[num & 0x3F]
    }

    function encodeChunk(uint8, start, end) {
      var tmp
      var output = []
      for (var i = start; i < end; i += 3) {
        tmp =
          ((uint8[i] << 16) & 0xFF0000) +
          ((uint8[i + 1] << 8) & 0xFF00) +
          (uint8[i + 2] & 0xFF)
        output.push(tripletToBase64(tmp))
      }
      return output.join('')
    }

    function fromByteArray(uint8) {
      var tmp
      var len = uint8.length
      var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
      var parts = []
      var maxChunkLength = 16383 // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(
          uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
        ))
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1]
        parts.push(
          lookup[tmp >> 2] +
          lookup[(tmp << 4) & 0x3F] +
          '=='
        )
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1]
        parts.push(
          lookup[tmp >> 10] +
          lookup[(tmp >> 4) & 0x3F] +
          lookup[(tmp << 2) & 0x3F] +
          '='
        )
      }

      return parts.join('')
    }

  }, {}], 7: [function (require, module, exports) {
    (function (Buffer) {
      /*!
       * The buffer module from node.js, for the browser.
       *
       * @author   Feross Aboukhadijeh <https://feross.org>
       * @license  MIT
       */
      /* eslint-disable no-proto */

      'use strict'

      var base64 = require('base64-js')
      var ieee754 = require('ieee754')

      exports.Buffer = Buffer
      exports.SlowBuffer = SlowBuffer
      exports.INSPECT_MAX_BYTES = 50

      var K_MAX_LENGTH = 0x7fffffff
      exports.kMaxLength = K_MAX_LENGTH

      /**
       * If `Buffer.TYPED_ARRAY_SUPPORT`:
       *   === true    Use Uint8Array implementation (fastest)
       *   === false   Print warning and recommend using `buffer` v4.x which has an Object
       *               implementation (most compatible, even IE6)
       *
       * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
       * Opera 11.6+, iOS 4.2+.
       *
       * We report that the browser does not support typed arrays if the are not subclassable
       * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
       * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
       * for __proto__ and has a buggy typed array implementation.
       */
      Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

      if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
        typeof console.error === 'function') {
        console.error(
          'This browser lacks typed array (Uint8Array) support which is required by ' +
          '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
        )
      }

      function typedArraySupport() {
        // Can typed array instances can be augmented?
        try {
          var arr = new Uint8Array(1)
          arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
          return arr.foo() === 42
        } catch (e) {
          return false
        }
      }

      Object.defineProperty(Buffer.prototype, 'parent', {
        enumerable: true,
        get: function () {
          if (!Buffer.isBuffer(this)) return undefined
          return this.buffer
        }
      })

      Object.defineProperty(Buffer.prototype, 'offset', {
        enumerable: true,
        get: function () {
          if (!Buffer.isBuffer(this)) return undefined
          return this.byteOffset
        }
      })

      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"')
        }
        // Return an augmented `Uint8Array` instance
        var buf = new Uint8Array(length)
        buf.__proto__ = Buffer.prototype
        return buf
      }

      /**
       * The Buffer constructor returns instances of `Uint8Array` that have their
       * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
       * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
       * and the `Uint8Array` methods. Square bracket notation works as expected -- it
       * returns a single octet.
       *
       * The `Uint8Array` prototype remains unmodified.
       */

      function Buffer(arg, encodingOrOffset, length) {
        // Common case.
        if (typeof arg === 'number') {
          if (typeof encodingOrOffset === 'string') {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            )
          }
          return allocUnsafe(arg)
        }
        return from(arg, encodingOrOffset, length)
      }

      // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
      if (typeof Symbol !== 'undefined' && Symbol.species != null &&
        Buffer[Symbol.species] === Buffer) {
        Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true,
          enumerable: false,
          writable: false
        })
      }

      Buffer.poolSize = 8192 // not used by this implementation

      function from(value, encodingOrOffset, length) {
        if (typeof value === 'string') {
          return fromString(value, encodingOrOffset)
        }

        if (ArrayBuffer.isView(value)) {
          return fromArrayLike(value)
        }

        if (value == null) {
          throw TypeError(
            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
            'or Array-like Object. Received type ' + (typeof value)
          )
        }

        if (isInstance(value, ArrayBuffer) ||
          (value && isInstance(value.buffer, ArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length)
        }

        if (typeof value === 'number') {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          )
        }

        var valueOf = value.valueOf && value.valueOf()
        if (valueOf != null && valueOf !== value) {
          return Buffer.from(valueOf, encodingOrOffset, length)
        }

        var b = fromObject(value)
        if (b) return b

        if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
          typeof value[Symbol.toPrimitive] === 'function') {
          return Buffer.from(
            value[Symbol.toPrimitive]('string'), encodingOrOffset, length
          )
        }

        throw new TypeError(
          'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
          'or Array-like Object. Received type ' + (typeof value)
        )
      }

      /**
       * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
       * if value is a number.
       * Buffer.from(str[, encoding])
       * Buffer.from(array)
       * Buffer.from(buffer)
       * Buffer.from(arrayBuffer[, byteOffset[, length]])
       **/
      Buffer.from = function (value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length)
      }

      // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
      // https://github.com/feross/buffer/pull/148
      Buffer.prototype.__proto__ = Uint8Array.prototype
      Buffer.__proto__ = Uint8Array

      function assertSize(size) {
        if (typeof size !== 'number') {
          throw new TypeError('"size" argument must be of type number')
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"')
        }
      }

      function alloc(size, fill, encoding) {
        assertSize(size)
        if (size <= 0) {
          return createBuffer(size)
        }
        if (fill !== undefined) {
          // Only pay attention to encoding if it's a string. This
          // prevents accidentally sending in a number that would
          // be interpretted as a start offset.
          return typeof encoding === 'string'
            ? createBuffer(size).fill(fill, encoding)
            : createBuffer(size).fill(fill)
        }
        return createBuffer(size)
      }

      /**
       * Creates a new filled Buffer instance.
       * alloc(size[, fill[, encoding]])
       **/
      Buffer.alloc = function (size, fill, encoding) {
        return alloc(size, fill, encoding)
      }

      function allocUnsafe(size) {
        assertSize(size)
        return createBuffer(size < 0 ? 0 : checked(size) | 0)
      }

      /**
       * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
       * */
      Buffer.allocUnsafe = function (size) {
        return allocUnsafe(size)
      }
      /**
       * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
       */
      Buffer.allocUnsafeSlow = function (size) {
        return allocUnsafe(size)
      }

      function fromString(string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
          encoding = 'utf8'
        }

        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding)
        }

        var length = byteLength(string, encoding) | 0
        var buf = createBuffer(length)

        var actual = buf.write(string, encoding)

        if (actual !== length) {
          // Writing a hex string, for example, that contains invalid characters will
          // cause everything after the first invalid character to be ignored. (e.g.
          // 'abxxcd' will be treated as 'ab')
          buf = buf.slice(0, actual)
        }

        return buf
      }

      function fromArrayLike(array) {
        var length = array.length < 0 ? 0 : checked(array.length) | 0
        var buf = createBuffer(length)
        for (var i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255
        }
        return buf
      }

      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds')
        }

        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds')
        }

        var buf
        if (byteOffset === undefined && length === undefined) {
          buf = new Uint8Array(array)
        } else if (length === undefined) {
          buf = new Uint8Array(array, byteOffset)
        } else {
          buf = new Uint8Array(array, byteOffset, length)
        }

        // Return an augmented `Uint8Array` instance
        buf.__proto__ = Buffer.prototype
        return buf
      }

      function fromObject(obj) {
        if (Buffer.isBuffer(obj)) {
          var len = checked(obj.length) | 0
          var buf = createBuffer(len)

          if (buf.length === 0) {
            return buf
          }

          obj.copy(buf, 0, 0, len)
          return buf
        }

        if (obj.length !== undefined) {
          if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
            return createBuffer(0)
          }
          return fromArrayLike(obj)
        }

        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data)
        }
      }

      function checked(length) {
        // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= K_MAX_LENGTH) {
          throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
            'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
        }
        return length | 0
      }

      function SlowBuffer(length) {
        if (+length != length) { // eslint-disable-line eqeqeq
          length = 0
        }
        return Buffer.alloc(+length)
      }

      Buffer.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true &&
          b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
      }

      Buffer.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
        if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          )
        }

        if (a === b) return 0

        var x = a.length
        var y = b.length

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i]
            y = b[i]
            break
          }
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
      }

      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'latin1':
          case 'binary':
          case 'base64':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true
          default:
            return false
        }
      }

      Buffer.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        }

        if (list.length === 0) {
          return Buffer.alloc(0)
        }

        var i
        if (length === undefined) {
          length = 0
          for (i = 0; i < list.length; ++i) {
            length += list[i].length
          }
        }

        var buffer = Buffer.allocUnsafe(length)
        var pos = 0
        for (i = 0; i < list.length; ++i) {
          var buf = list[i]
          if (isInstance(buf, Uint8Array)) {
            buf = Buffer.from(buf)
          }
          if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers')
          }
          buf.copy(buffer, pos)
          pos += buf.length
        }
        return buffer
      }

      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) {
          return string.length
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength
        }
        if (typeof string !== 'string') {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
            'Received type ' + typeof string
          )
        }

        var len = string.length
        var mustMatch = (arguments.length > 2 && arguments[2] === true)
        if (!mustMatch && len === 0) return 0

        // Use a for loop to avoid recursion
        var loweredCase = false
        for (; ;) {
          switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
              return len
            case 'utf8':
            case 'utf-8':
              return utf8ToBytes(string).length
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return len * 2
            case 'hex':
              return len >>> 1
            case 'base64':
              return base64ToBytes(string).length
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
              }
              encoding = ('' + encoding).toLowerCase()
              loweredCase = true
          }
        }
      }
      Buffer.byteLength = byteLength

      function slowToString(encoding, start, end) {
        var loweredCase = false

        // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.

        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
        if (start === undefined || start < 0) {
          start = 0
        }
        // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.
        if (start > this.length) {
          return ''
        }

        if (end === undefined || end > this.length) {
          end = this.length
        }

        if (end <= 0) {
          return ''
        }

        // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
        end >>>= 0
        start >>>= 0

        if (end <= start) {
          return ''
        }

        if (!encoding) encoding = 'utf8'

        while (true) {
          switch (encoding) {
            case 'hex':
              return hexSlice(this, start, end)

            case 'utf8':
            case 'utf-8':
              return utf8Slice(this, start, end)

            case 'ascii':
              return asciiSlice(this, start, end)

            case 'latin1':
            case 'binary':
              return latin1Slice(this, start, end)

            case 'base64':
              return base64Slice(this, start, end)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return utf16leSlice(this, start, end)

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
              encoding = (encoding + '').toLowerCase()
              loweredCase = true
          }
        }
      }

      // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
      // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
      // reliably in a browserify context because there could be multiple different
      // copies of the 'buffer' package in use. This method works even for Buffer
      // instances that were created from another copy of the `buffer` package.
      // See: https://github.com/feross/buffer/issues/154
      Buffer.prototype._isBuffer = true

      function swap(b, n, m) {
        var i = b[n]
        b[n] = b[m]
        b[m] = i
      }

      Buffer.prototype.swap16 = function swap16() {
        var len = this.length
        if (len % 2 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 16-bits')
        }
        for (var i = 0; i < len; i += 2) {
          swap(this, i, i + 1)
        }
        return this
      }

      Buffer.prototype.swap32 = function swap32() {
        var len = this.length
        if (len % 4 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 32-bits')
        }
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3)
          swap(this, i + 1, i + 2)
        }
        return this
      }

      Buffer.prototype.swap64 = function swap64() {
        var len = this.length
        if (len % 8 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 64-bits')
        }
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7)
          swap(this, i + 1, i + 6)
          swap(this, i + 2, i + 5)
          swap(this, i + 3, i + 4)
        }
        return this
      }

      Buffer.prototype.toString = function toString() {
        var length = this.length
        if (length === 0) return ''
        if (arguments.length === 0) return utf8Slice(this, 0, length)
        return slowToString.apply(this, arguments)
      }

      Buffer.prototype.toLocaleString = Buffer.prototype.toString

      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
        if (this === b) return true
        return Buffer.compare(this, b) === 0
      }

      Buffer.prototype.inspect = function inspect() {
        var str = ''
        var max = exports.INSPECT_MAX_BYTES
        str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
        if (this.length > max) str += ' ... '
        return '<Buffer ' + str + '>'
      }

      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer.from(target, target.offset, target.byteLength)
        }
        if (!Buffer.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. ' +
            'Received type ' + (typeof target)
          )
        }

        if (start === undefined) {
          start = 0
        }
        if (end === undefined) {
          end = target ? target.length : 0
        }
        if (thisStart === undefined) {
          thisStart = 0
        }
        if (thisEnd === undefined) {
          thisEnd = this.length
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError('out of range index')
        }

        if (thisStart >= thisEnd && start >= end) {
          return 0
        }
        if (thisStart >= thisEnd) {
          return -1
        }
        if (start >= end) {
          return 1
        }

        start >>>= 0
        end >>>= 0
        thisStart >>>= 0
        thisEnd >>>= 0

        if (this === target) return 0

        var x = thisEnd - thisStart
        var y = end - start
        var len = Math.min(x, y)

        var thisCopy = this.slice(thisStart, thisEnd)
        var targetCopy = target.slice(start, end)

        for (var i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i]
            y = targetCopy[i]
            break
          }
        }

        if (x < y) return -1
        if (y < x) return 1
        return 0
      }

      // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
      // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
      //
      // Arguments:
      // - buffer - a Buffer to search
      // - val - a string, Buffer, or number
      // - byteOffset - an index into `buffer`; will be clamped to an int32
      // - encoding - an optional encoding, relevant is val is a string
      // - dir - true for indexOf, false for lastIndexOf
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1

        // Normalize byteOffset
        if (typeof byteOffset === 'string') {
          encoding = byteOffset
          byteOffset = 0
        } else if (byteOffset > 0x7fffffff) {
          byteOffset = 0x7fffffff
        } else if (byteOffset < -0x80000000) {
          byteOffset = -0x80000000
        }
        byteOffset = +byteOffset // Coerce to Number.
        if (numberIsNaN(byteOffset)) {
          // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
          byteOffset = dir ? 0 : (buffer.length - 1)
        }

        // Normalize byteOffset: negative offsets start from the end of the buffer
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset
        if (byteOffset >= buffer.length) {
          if (dir) return -1
          else byteOffset = buffer.length - 1
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0
          else return -1
        }

        // Normalize val
        if (typeof val === 'string') {
          val = Buffer.from(val, encoding)
        }

        // Finally, search either indexOf (if dir is true) or lastIndexOf
        if (Buffer.isBuffer(val)) {
          // Special case: looking for empty string/buffer always fails
          if (val.length === 0) {
            return -1
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
        } else if (typeof val === 'number') {
          val = val & 0xFF // Search for a byte value [0-255]
          if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
        }

        throw new TypeError('val must be string, number or Buffer')
      }

      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1
        var arrLength = arr.length
        var valLength = val.length

        if (encoding !== undefined) {
          encoding = String(encoding).toLowerCase()
          if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
              return -1
            }
            indexSize = 2
            arrLength /= 2
            valLength /= 2
            byteOffset /= 2
          }
        }

        function read(buf, i) {
          if (indexSize === 1) {
            return buf[i]
          } else {
            return buf.readUInt16BE(i * indexSize)
          }
        }

        var i
        if (dir) {
          var foundIndex = -1
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
            } else {
              if (foundIndex !== -1) i -= i - foundIndex
              foundIndex = -1
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
          for (i = byteOffset; i >= 0; i--) {
            var found = true
            for (var j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false
                break
              }
            }
            if (found) return i
          }
        }

        return -1
      }

      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1
      }

      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
      }

      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
      }

      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0
        var remaining = buf.length - offset
        if (!length) {
          length = remaining
        } else {
          length = Number(length)
          if (length > remaining) {
            length = remaining
          }
        }

        var strLen = string.length

        if (length > strLen / 2) {
          length = strLen / 2
        }
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(i * 2, 2), 16)
          if (numberIsNaN(parsed)) return i
          buf[offset + i] = parsed
        }
        return i
      }

      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
      }

      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length)
      }

      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length)
      }

      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length)
      }

      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
      }

      Buffer.prototype.write = function write(string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
          encoding = 'utf8'
          length = this.length
          offset = 0
          // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
          encoding = offset
          length = this.length
          offset = 0
          // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
          offset = offset >>> 0
          if (isFinite(length)) {
            length = length >>> 0
            if (encoding === undefined) encoding = 'utf8'
          } else {
            encoding = length
            length = undefined
          }
        } else {
          throw new Error(
            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
          )
        }

        var remaining = this.length - offset
        if (length === undefined || length > remaining) length = remaining

        if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
          throw new RangeError('Attempt to write outside buffer bounds')
        }

        if (!encoding) encoding = 'utf8'

        var loweredCase = false
        for (; ;) {
          switch (encoding) {
            case 'hex':
              return hexWrite(this, string, offset, length)

            case 'utf8':
            case 'utf-8':
              return utf8Write(this, string, offset, length)

            case 'ascii':
              return asciiWrite(this, string, offset, length)

            case 'latin1':
            case 'binary':
              return latin1Write(this, string, offset, length)

            case 'base64':
              // Warning: maxLength not taken into account in base64Write
              return base64Write(this, string, offset, length)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return ucs2Write(this, string, offset, length)

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
              encoding = ('' + encoding).toLowerCase()
              loweredCase = true
          }
        }
      }

      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        }
      }

      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf)
        } else {
          return base64.fromByteArray(buf.slice(start, end))
        }
      }

      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end)
        var res = []

        var i = start
        while (i < end) {
          var firstByte = buf[i]
          var codePoint = null
          var bytesPerSequence = (firstByte > 0xEF) ? 4
            : (firstByte > 0xDF) ? 3
              : (firstByte > 0xBF) ? 2
                : 1

          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint

            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 0x80) {
                  codePoint = firstByte
                }
                break
              case 2:
                secondByte = buf[i + 1]
                if ((secondByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                  if (tempCodePoint > 0x7F) {
                    codePoint = tempCodePoint
                  }
                }
                break
              case 3:
                secondByte = buf[i + 1]
                thirdByte = buf[i + 2]
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                  if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                    codePoint = tempCodePoint
                  }
                }
                break
              case 4:
                secondByte = buf[i + 1]
                thirdByte = buf[i + 2]
                fourthByte = buf[i + 3]
                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                  if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                    codePoint = tempCodePoint
                  }
                }
            }
          }

          if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD
            bytesPerSequence = 1
          } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000
            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
            codePoint = 0xDC00 | codePoint & 0x3FF
          }

          res.push(codePoint)
          i += bytesPerSequence
        }

        return decodeCodePointsArray(res)
      }

      // Based on http://stackoverflow.com/a/22747272/680742, the browser with
      // the lowest limit is Chrome, with 0x10000 args.
      // We go 1 magnitude less, for safety
      var MAX_ARGUMENTS_LENGTH = 0x1000

      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
        }

        // Decode in chunks to avoid "call stack size exceeded".
        var res = ''
        var i = 0
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          )
        }
        return res
      }

      function asciiSlice(buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 0x7F)
        }
        return ret
      }

      function latin1Slice(buf, start, end) {
        var ret = ''
        end = Math.min(buf.length, end)

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i])
        }
        return ret
      }

      function hexSlice(buf, start, end) {
        var len = buf.length

        if (!start || start < 0) start = 0
        if (!end || end < 0 || end > len) end = len

        var out = ''
        for (var i = start; i < end; ++i) {
          out += toHex(buf[i])
        }
        return out
      }

      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end)
        var res = ''
        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
        }
        return res
      }

      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length
        start = ~~start
        end = end === undefined ? len : ~~end

        if (start < 0) {
          start += len
          if (start < 0) start = 0
        } else if (start > len) {
          start = len
        }

        if (end < 0) {
          end += len
          if (end < 0) end = 0
        } else if (end > len) {
          end = len
        }

        if (end < start) end = start

        var newBuf = this.subarray(start, end)
        // Return an augmented `Uint8Array` instance
        newBuf.__proto__ = Buffer.prototype
        return newBuf
      }

      /*
       * Need to make sure that buffer isn't trying to write out of bounds.
       */
      function checkOffset(offset, ext, length) {
        if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
      }

      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset = offset >>> 0
        byteLength = byteLength >>> 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul
        }

        return val
      }

      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset = offset >>> 0
        byteLength = byteLength >>> 0
        if (!noAssert) {
          checkOffset(offset, byteLength, this.length)
        }

        var val = this[offset + --byteLength]
        var mul = 1
        while (byteLength > 0 && (mul *= 0x100)) {
          val += this[offset + --byteLength] * mul
        }

        return val
      }

      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 1, this.length)
        return this[offset]
      }

      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 2, this.length)
        return this[offset] | (this[offset + 1] << 8)
      }

      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 2, this.length)
        return (this[offset] << 8) | this[offset + 1]
      }

      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)

        return ((this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
      }

      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] * 0x1000000) +
          ((this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            this[offset + 3])
      }

      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset = offset >>> 0
        byteLength = byteLength >>> 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var val = this[offset]
        var mul = 1
        var i = 0
        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
      }

      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset = offset >>> 0
        byteLength = byteLength >>> 0
        if (!noAssert) checkOffset(offset, byteLength, this.length)

        var i = byteLength
        var mul = 1
        var val = this[offset + --i]
        while (i > 0 && (mul *= 0x100)) {
          val += this[offset + --i] * mul
        }
        mul *= 0x80

        if (val >= mul) val -= Math.pow(2, 8 * byteLength)

        return val
      }

      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 1, this.length)
        if (!(this[offset] & 0x80)) return (this[offset])
        return ((0xff - this[offset] + 1) * -1)
      }

      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset] | (this[offset + 1] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
      }

      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 2, this.length)
        var val = this[offset + 1] | (this[offset] << 8)
        return (val & 0x8000) ? val | 0xFFFF0000 : val
      }

      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16) |
          (this[offset + 3] << 24)
      }

      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)

        return (this[offset] << 24) |
          (this[offset + 1] << 16) |
          (this[offset + 2] << 8) |
          (this[offset + 3])
      }

      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, true, 23, 4)
      }

      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)
        return ieee754.read(this, offset, false, 23, 4)
      }

      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, true, 52, 8)
      }

      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 8, this.length)
        return ieee754.read(this, offset, false, 52, 8)
      }

      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
        if (offset + ext > buf.length) throw new RangeError('Index out of range')
      }

      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset >>> 0
        byteLength = byteLength >>> 0
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1
          checkInt(this, value, offset, byteLength, maxBytes, 0)
        }

        var mul = 1
        var i = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset >>> 0
        byteLength = byteLength >>> 0
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1
          checkInt(this, value, offset, byteLength, maxBytes, 0)
        }

        var i = byteLength - 1
        var mul = 1
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = (value / mul) & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
        this[offset] = (value & 0xff)
        return offset + 1
      }

      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
        return offset + 2
      }

      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
        this[offset] = (value >>> 8)
        this[offset + 1] = (value & 0xff)
        return offset + 2
      }

      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        this[offset + 3] = (value >>> 24)
        this[offset + 2] = (value >>> 16)
        this[offset + 1] = (value >>> 8)
        this[offset] = (value & 0xff)
        return offset + 4
      }

      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
        this[offset] = (value >>> 24)
        this[offset + 1] = (value >>> 16)
        this[offset + 2] = (value >>> 8)
        this[offset + 3] = (value & 0xff)
        return offset + 4
      }

      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) {
          var limit = Math.pow(2, (8 * byteLength) - 1)

          checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = 0
        var mul = 1
        var sub = 0
        this[offset] = value & 0xFF
        while (++i < byteLength && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1
          }
          this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) {
          var limit = Math.pow(2, (8 * byteLength) - 1)

          checkInt(this, value, offset, byteLength, limit - 1, -limit)
        }

        var i = byteLength - 1
        var mul = 1
        var sub = 0
        this[offset + i] = value & 0xFF
        while (--i >= 0 && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1
          }
          this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
        }

        return offset + byteLength
      }

      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
        if (value < 0) value = 0xff + value + 1
        this[offset] = (value & 0xff)
        return offset + 1
      }

      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
        return offset + 2
      }

      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
        this[offset] = (value >>> 8)
        this[offset + 1] = (value & 0xff)
        return offset + 2
      }

      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
        this[offset + 2] = (value >>> 16)
        this[offset + 3] = (value >>> 24)
        return offset + 4
      }

      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
        if (value < 0) value = 0xffffffff + value + 1
        this[offset] = (value >>> 24)
        this[offset + 1] = (value >>> 16)
        this[offset + 2] = (value >>> 8)
        this[offset + 3] = (value & 0xff)
        return offset + 4
      }

      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range')
        if (offset < 0) throw new RangeError('Index out of range')
      }

      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4)
        return offset + 4
      }

      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert)
      }

      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert)
      }

      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8)
        return offset + 8
      }

      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert)
      }

      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert)
      }

      // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
        if (!start) start = 0
        if (!end && end !== 0) end = this.length
        if (targetStart >= target.length) targetStart = target.length
        if (!targetStart) targetStart = 0
        if (end > 0 && end < start) end = start

        // Copy 0 bytes; we're done
        if (end === start) return 0
        if (target.length === 0 || this.length === 0) return 0

        // Fatal error conditions
        if (targetStart < 0) {
          throw new RangeError('targetStart out of bounds')
        }
        if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
        if (end < 0) throw new RangeError('sourceEnd out of bounds')

        // Are we oob?
        if (end > this.length) end = this.length
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start
        }

        var len = end - start

        if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
          // Use built-in when available, missing from IE11
          this.copyWithin(targetStart, start, end)
        } else if (this === target && start < targetStart && targetStart < end) {
          // descending copy from end
          for (var i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start]
          }
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          )
        }

        return len
      }

      // Usage:
      //    buffer.fill(number[, offset[, end]])
      //    buffer.fill(buffer[, offset[, end]])
      //    buffer.fill(string[, offset[, end]][, encoding])
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
          if (typeof start === 'string') {
            encoding = start
            start = 0
            end = this.length
          } else if (typeof end === 'string') {
            encoding = end
            end = this.length
          }
          if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string')
          }
          if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding)
          }
          if (val.length === 1) {
            var code = val.charCodeAt(0)
            if ((encoding === 'utf8' && code < 128) ||
              encoding === 'latin1') {
              // Fast path: If `val` fits into a single byte, use that numeric value.
              val = code
            }
          }
        } else if (typeof val === 'number') {
          val = val & 255
        }

        // Invalid ranges are not set to a default, so can range check early.
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError('Out of range index')
        }

        if (end <= start) {
          return this
        }

        start = start >>> 0
        end = end === undefined ? this.length : end >>> 0

        if (!val) val = 0

        var i
        if (typeof val === 'number') {
          for (i = start; i < end; ++i) {
            this[i] = val
          }
        } else {
          var bytes = Buffer.isBuffer(val)
            ? val
            : Buffer.from(val, encoding)
          var len = bytes.length
          if (len === 0) {
            throw new TypeError('The value "' + val +
              '" is invalid for argument "value"')
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len]
          }
        }

        return this
      }

      // HELPER FUNCTIONS
      // ================

      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

      function base64clean(str) {
        // Node takes equal signs as end of the Base64 encoding
        str = str.split('=')[0]
        // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = str.trim().replace(INVALID_BASE64_RE, '')
        // Node converts strings with length < 2 to ''
        if (str.length < 2) return ''
        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
        while (str.length % 4 !== 0) {
          str = str + '='
        }
        return str
      }

      function toHex(n) {
        if (n < 16) return '0' + n.toString(16)
        return n.toString(16)
      }

      function utf8ToBytes(string, units) {
        units = units || Infinity
        var codePoint
        var length = string.length
        var leadSurrogate = null
        var bytes = []

        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i)

          // is surrogate component
          if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
              // no lead yet
              if (codePoint > 0xDBFF) {
                // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                continue
              } else if (i + 1 === length) {
                // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                continue
              }

              // valid lead
              leadSurrogate = codePoint

              continue
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              leadSurrogate = codePoint
              continue
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
          } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          }

          leadSurrogate = null

          // encode utf8
          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break
            bytes.push(codePoint)
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break
            bytes.push(
              codePoint >> 0x6 | 0xC0,
              codePoint & 0x3F | 0x80
            )
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break
            bytes.push(
              codePoint >> 0xC | 0xE0,
              codePoint >> 0x6 & 0x3F | 0x80,
              codePoint & 0x3F | 0x80
            )
          } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break
            bytes.push(
              codePoint >> 0x12 | 0xF0,
              codePoint >> 0xC & 0x3F | 0x80,
              codePoint >> 0x6 & 0x3F | 0x80,
              codePoint & 0x3F | 0x80
            )
          } else {
            throw new Error('Invalid code point')
          }
        }

        return bytes
      }

      function asciiToBytes(str) {
        var byteArray = []
        for (var i = 0; i < str.length; ++i) {
          // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF)
        }
        return byteArray
      }

      function utf16leToBytes(str, units) {
        var c, hi, lo
        var byteArray = []
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break

          c = str.charCodeAt(i)
          hi = c >> 8
          lo = c % 256
          byteArray.push(lo)
          byteArray.push(hi)
        }

        return byteArray
      }

      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str))
      }

      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if ((i + offset >= dst.length) || (i >= src.length)) break
          dst[i + offset] = src[i]
        }
        return i
      }

      // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
      // the `instanceof` check but they should be treated as of that type.
      // See: https://github.com/feross/buffer/issues/166
      function isInstance(obj, type) {
        return obj instanceof type ||
          (obj != null && obj.constructor != null && obj.constructor.name != null &&
            obj.constructor.name === type.name)
      }
      function numberIsNaN(obj) {
        // For IE11 support
        return obj !== obj // eslint-disable-line no-self-compare
      }

    }).call(this, require("buffer").Buffer)
  }, { "base64-js": 6, "buffer": 7, "ieee754": 9 }], 8: [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    var objectCreate = Object.create || objectCreatePolyfill
    var objectKeys = Object.keys || objectKeysPolyfill
    var bind = Function.prototype.bind || functionBindPolyfill

    function EventEmitter() {
      if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
        this._events = objectCreate(null);
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    }
    module.exports = EventEmitter;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    var defaultMaxListeners = 10;

    var hasDefineProperty;
    try {
      var o = {};
      if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
      hasDefineProperty = o.x === 0;
    } catch (err) { hasDefineProperty = false }
    if (hasDefineProperty) {
      Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
        enumerable: true,
        get: function () {
          return defaultMaxListeners;
        },
        set: function (arg) {
          // check whether the input is a positive number (whose value is zero or
          // greater and not a NaN).
          if (typeof arg !== 'number' || arg < 0 || arg !== arg)
            throw new TypeError('"defaultMaxListeners" must be a positive number');
          defaultMaxListeners = arg;
        }
      });
    } else {
      EventEmitter.defaultMaxListeners = defaultMaxListeners;
    }

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || isNaN(n))
        throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };

    function $getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };

    // These standalone emit* functions are used to optimize calling of event
    // handlers for fast cases because emit() itself often has a variable number of
    // arguments and can be deoptimized because of that. These functions always have
    // the same number of arguments and thus do not get deoptimized, so the code
    // inside them can execute faster.
    function emitNone(handler, isFn, self) {
      if (isFn)
        handler.call(self);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self);
      }
    }
    function emitOne(handler, isFn, self, arg1) {
      if (isFn)
        handler.call(self, arg1);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1);
      }
    }
    function emitTwo(handler, isFn, self, arg1, arg2) {
      if (isFn)
        handler.call(self, arg1, arg2);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2);
      }
    }
    function emitThree(handler, isFn, self, arg1, arg2, arg3) {
      if (isFn)
        handler.call(self, arg1, arg2, arg3);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2, arg3);
      }
    }

    function emitMany(handler, isFn, self, args) {
      if (isFn)
        handler.apply(self, args);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].apply(self, args);
      }
    }

    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events;
      var doError = (type === 'error');

      events = this._events;
      if (events)
        doError = (doError && events.error == null);
      else if (!doError)
        return false;

      // If there is no 'error' event listener then throw.
      if (doError) {
        if (arguments.length > 1)
          er = arguments[1];
        if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          // At least give some kind of context to the user
          var err = new Error('Unhandled "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
        return false;
      }

      handler = events[type];

      if (!handler)
        return false;

      var isFn = typeof handler === 'function';
      len = arguments.length;
      switch (len) {
        // fast cases
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        // slower
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          emitMany(handler, isFn, this, args);
      }

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = target._events;
      if (!events) {
        events = target._events = objectCreate(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener) {
          target.emit('newListener', type,
            listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }

      if (!existing) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] =
            prepend ? [listener, existing] : [existing, listener];
        } else {
          // If we've already got an array, just append.
          if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
        }

        // Check for listener leak
        if (!existing.warned) {
          m = $getMaxListeners(target);
          if (m && m > 0 && existing.length > m) {
            existing.warned = true;
            var w = new Error('Possible EventEmitter memory leak detected. ' +
              existing.length + ' "' + String(type) + '" listeners ' +
              'added. Use emitter.setMaxListeners() to ' +
              'increase limit.');
            w.name = 'MaxListenersExceededWarning';
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            if (typeof console === 'object' && console.warn) {
              console.warn('%s: %s', w.name, w.message);
            }
          }
        }
      }

      return target;
    }

    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        switch (arguments.length) {
          case 0:
            return this.listener.call(this.target);
          case 1:
            return this.listener.call(this.target, arguments[0]);
          case 2:
            return this.listener.call(this.target, arguments[0], arguments[1]);
          case 3:
            return this.listener.call(this.target, arguments[0], arguments[1],
              arguments[2]);
          default:
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; ++i)
              args[i] = arguments[i];
            this.listener.apply(this.target, args);
        }
      }
    }

    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
      var wrapped = bind.call(onceWrapper, state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

    // Emits a 'removeListener' event if and only if the listener was removed.
    EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (position === 0)
            list.shift();
          else
            spliceOne(list, position);

          if (list.length === 1)
            events[type] = list[0];

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };

    EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events, i;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = objectCreate(null);
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = objectCreate(null);
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = objectKeys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = objectCreate(null);
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }

        return this;
      };

    function _listeners(target, type, unwrap) {
      var events = target._events;

      if (!events)
        return [];

      var evlistener = events[type];
      if (!evlistener)
        return [];

      if (typeof evlistener === 'function')
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];

      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }

    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };

    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };

    EventEmitter.listenerCount = function (emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;

      if (events) {
        var evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };

    // About 1.5x faster than the two-arg version of Array#splice().
    function spliceOne(list, index) {
      for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
        list[i] = list[k];
      list.pop();
    }

    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }

    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }

    function objectCreatePolyfill(proto) {
      var F = function () { };
      F.prototype = proto;
      return new F;
    }
    function objectKeysPolyfill(obj) {
      var keys = [];
      for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
      return k;
    }
    function functionBindPolyfill(context) {
      var fn = this;
      return function () {
        return fn.apply(context, arguments);
      };
    }

  }, {}], 9: [function (require, module, exports) {
    exports.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m
      var eLen = (nBytes * 8) - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var nBits = -7
      var i = isLE ? (nBytes - 1) : 0
      var d = isLE ? -1 : 1
      var s = buffer[offset + i]

      i += d

      e = s & ((1 << (-nBits)) - 1)
      s >>= (-nBits)
      nBits += eLen
      for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) { }

      m = e & ((1 << (-nBits)) - 1)
      e >>= (-nBits)
      nBits += mLen
      for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) { }

      if (e === 0) {
        e = 1 - eBias
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }

    exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c
      var eLen = (nBytes * 8) - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
      var i = isLE ? 0 : (nBytes - 1)
      var d = isLE ? 1 : -1
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

      value = Math.abs(value)

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
      } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--
          c *= 2
        }
        if (e + eBias >= 1) {
          value += rt / c
        } else {
          value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
          e++
          c /= 2
        }

        if (e + eBias >= eMax) {
          m = 0
          e = eMax
        } else if (e + eBias >= 1) {
          m = ((value * c) - 1) * Math.pow(2, mLen)
          e = e + eBias
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
          e = 0
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

      e = (e << mLen) | m
      eLen += mLen
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

      buffer[offset + i - d] |= s * 128
    }

  }, {}], 10: [function (require, module, exports) {
    arguments[4][3][0].apply(exports, arguments)
  }, { "dup": 3 }], 11: [function (require, module, exports) {
    exports.endianness = function () { return 'LE' };

    exports.hostname = function () {
      if (typeof location !== 'undefined') {
        return location.hostname
      }
      else return '';
    };

    exports.loadavg = function () { return [] };

    exports.uptime = function () { return 0 };

    exports.freemem = function () {
      return Number.MAX_VALUE;
    };

    exports.totalmem = function () {
      return Number.MAX_VALUE;
    };

    exports.cpus = function () { return [] };

    exports.type = function () { return 'Browser' };

    exports.release = function () {
      if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
      }
      return '';
    };

    exports.networkInterfaces
      = exports.getNetworkInterfaces
      = function () { return {} };

    exports.arch = function () { return 'javascript' };

    exports.platform = function () { return 'browser' };

    exports.tmpdir = exports.tmpDir = function () {
      return '/tmp';
    };

    exports.EOL = '\n';

    exports.homedir = function () {
      return '/'
    };

  }, {}], 12: [function (require, module, exports) {
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }
    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    }())
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }


    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }



    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }
      draining = false;
      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }
      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() { }

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) { return [] }

    process.binding = function (name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function () { return 0; };

  }, {}], 13: [function (require, module, exports) {
    arguments[4][4][0].apply(exports, arguments)
  }, { "dup": 4 }], 14: [function (require, module, exports) {
    arguments[4][5][0].apply(exports, arguments)
  }, { "./support/isBuffer": 13, "_process": 12, "dup": 5, "inherits": 10 }], 15: [function (require, module, exports) {
    /**
     * @module audio-format
     */
    'use strict'

    var rates = require('sample-rate')
    var os = require('os')
    var isAudioBuffer = require('is-audio-buffer')
    var isBuffer = require('is-buffer')
    var isPlainObj = require('is-plain-obj')
    var pick = require('pick-by-alias')

    module.exports = {
      parse: parse,
      stringify: stringify,
      detect: detect,
      type: getType
    }

    var endianness = os.endianness instanceof Function ? os.endianness().toLowerCase() : 'le'

    var types = {
      'uint': 'uint32',
      'uint8': 'uint8',
      'uint8_clamped': 'uint8',
      'uint16': 'uint16',
      'uint32': 'uint32',
      'int': 'int32',
      'int8': 'int8',
      'int16': 'int16',
      'int32': 'int32',
      'float': 'float32',
      'float32': 'float32',
      'float64': 'float64',
      'array': 'array',
      'arraybuffer': 'arraybuffer',
      'buffer': 'buffer',
      'audiobuffer': 'audiobuffer',
      'ndarray': 'ndarray',
      'ndsamples': 'ndsamples'
    }
    var channelNumber = {
      'mono': 1,
      'stereo': 2,
      'quad': 4,
      '5.1': 6,
      '2.1': 3,
      '3-channel': 3,
      '5-channel': 5
    }
    var maxChannels = 32
    for (var i = 6; i < maxChannels; i++) {
      channelNumber[i + '-channel'] = i
    }

    var channelName = {}
    for (var name in channelNumber) {
      channelName[channelNumber[name]] = name
    }
    //parse format string
    function parse(str) {
      var format = {}

      var parts = str.split(/\s*[,;_]\s*|\s+/)

      for (var i = 0; i < parts.length; i++) {
        var part = parts[i].toLowerCase()

        if (part === 'planar' && format.interleaved == null) {
          format.interleaved = false
          if (format.channels == null) format.channels = 2
        }
        else if ((part === 'interleave' || part === 'interleaved') && format.interleaved == null) {
          format.interleaved = true
          if (format.channels == null) format.channels = 2
        }
        else if (channelNumber[part]) format.channels = channelNumber[part]
        else if (part === 'le' || part === 'LE' || part === 'littleendian' || part === 'bigEndian') format.endianness = 'le'
        else if (part === 'be' || part === 'BE' || part === 'bigendian' || part === 'bigEndian') format.endianness = 'be'
        else if (types[part]) {
          format.type = types[part]
          if (part === 'audiobuffer') {
            format.endianness = endianness
            format.interleaved = false
          }
        }
        else if (rates[part]) format.sampleRate = rates[part]
        else if (/^\d+$/.test(part)) format.sampleRate = parseInt(part)
        else throw Error('Cannot identify part `' + part + '`')
      }

      return format
    }


    //parse available format properties from an object
    function detect(obj) {
      if (!obj) return {}

      var format = pick(obj, {
        channels: 'channel channels numberOfChannels channelCount',
        sampleRate: 'sampleRate rate',
        interleaved: 'interleave interleaved',
        type: 'type dtype',
        endianness: 'endianness'
      })

      // ndsamples case
      if (obj.format) {
        format.type = 'ndsamples'
      }
      if (format.sampleRate == null && obj.format && obj.format.sampleRate) {
        format.sampleRate = obj.format.sampleRate
      }
      if (obj.planar) format.interleaved = false
      if (format.interleaved != null) {
        if (format.channels == null) format.channels = 2
      }
      if (format.type == null) {
        var type = getType(obj)
        if (type) format.type = type
      }

      if (format.type === 'audiobuffer') {
        format.endianness = endianness
        format.interleaved = false
      }

      return format
    }


    //convert format string to format object
    function stringify(format, omit) {
      if (omit === undefined) {
        omit = { endianness: 'le' }
      } else if (omit == null) {
        omit = {}
      } else if (typeof omit === 'string') {
        omit = parse(omit)
      } else {
        omit = detect(omit)
      }

      if (!isPlainObj(format)) format = detect(format)

      var parts = []

      if (format.type != null && format.type !== omit.type) parts.push(format.type || 'float32')
      if (format.channels != null && format.channels !== omit.channels) parts.push(channelName[format.channels])
      if (format.endianness != null && format.endianness !== omit.endianness) parts.push(format.endianness || 'le')
      if (format.interleaved != null && format.interleaved !== omit.interleaved) {
        if (format.type !== 'audiobuffer') parts.push(format.interleaved ? 'interleaved' : 'planar')
      }
      if (format.sampleRate != null && format.sampleRate !== omit.sampleRate) parts.push(format.sampleRate)

      return parts.join(' ')
    }


    //return type string for an object
    function getType(arg) {
      if (isAudioBuffer(arg)) return 'audiobuffer'
      if (isBuffer(arg)) return 'buffer'
      if (Array.isArray(arg)) return 'array'
      if (arg instanceof ArrayBuffer) return 'arraybuffer'
      if (arg.shape && arg.dtype) return arg.format ? 'ndsamples' : 'ndarray'
      if (arg instanceof Float32Array) return 'float32'
      if (arg instanceof Float64Array) return 'float64'
      if (arg instanceof Uint8Array) return 'uint8'
      if (arg instanceof Uint8ClampedArray) return 'uint8_clamped'
      if (arg instanceof Int8Array) return 'int8'
      if (arg instanceof Int16Array) return 'int16'
      if (arg instanceof Uint16Array) return 'uint16'
      if (arg instanceof Int32Array) return 'int32'
      if (arg instanceof Uint32Array) return 'uint32'
    }

  }, { "is-audio-buffer": 25, "is-buffer": 26, "is-plain-obj": 27, "os": 11, "pick-by-alias": 32, "sample-rate": 33 }], 16: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bit_stream_1 = require("./util/bit-stream");
    var debug = require("./util/debug");
    var NALU_1 = require("./util/NALU");
    var H264Parser = (function () {
      function H264Parser(remuxer) {
        this.remuxer = remuxer;
        this.track = remuxer.mp4track;
      }
      H264Parser.prototype.parseSEI = function (sei) {
        var messages = H264Parser.readSEI(sei);
        for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
          var m = messages_1[_i];
          switch (m.type) {
            case 0:
              this.track.seiBuffering = true;
              break;
            case 5:
              return true;
            default:
              break;
          }
        }
        return false;
      };
      H264Parser.prototype.parseSPS = function (sps) {
        var config = H264Parser.readSPS(sps);
        this.track.width = config.width;
        this.track.height = config.height;
        this.track.sps = [sps];
        this.track.codec = 'avc1.';
        var codecArray = new DataView(sps.buffer, sps.byteOffset + 1, 4);
        for (var i = 0; i < 3; ++i) {
          var h = codecArray.getUint8(i).toString(16);
          if (h.length < 2) {
            h = '0' + h;
          }
          this.track.codec += h;
        }
      };
      H264Parser.prototype.parsePPS = function (pps) {
        this.track.pps = [pps];
      };
      H264Parser.prototype.parseNAL = function (unit) {
        if (!unit) {
          return false;
        }
        var push = false;
        switch (unit.type()) {
          case NALU_1.default.NDR:
          case NALU_1.default.IDR:
            push = true;
            break;
          case NALU_1.default.SEI:
            push = this.parseSEI(unit.getData().subarray(4));
            break;
          case NALU_1.default.SPS:
            if (this.track.sps.length === 0) {
              this.parseSPS(unit.getData().subarray(4));
              debug.log(" Found SPS type NALU frame.");
              if (!this.remuxer.readyToDecode && this.track.pps.length > 0 && this.track.sps.length > 0) {
                this.remuxer.readyToDecode = true;
              }
            }
            break;
          case NALU_1.default.PPS:
            if (this.track.pps.length === 0) {
              this.parsePPS(unit.getData().subarray(4));
              debug.log(" Found PPS type NALU frame.");
              if (!this.remuxer.readyToDecode && this.track.pps.length > 0 && this.track.sps.length > 0) {
                this.remuxer.readyToDecode = true;
              }
            }
            break;
          default:
            debug.log(" Found Unknown type NALU frame. type=" + unit.type());
            break;
        }
        return push;
      };
      H264Parser.skipScalingList = function (decoder, count) {
        var lastScale = 8;
        var nextScale = 8;
        for (var j = 0; j < count; j++) {
          if (nextScale !== 0) {
            var deltaScale = decoder.readEG();
            nextScale = (lastScale + deltaScale + 256) % 256;
          }
          lastScale = (nextScale === 0) ? lastScale : nextScale;
        }
      };
      H264Parser.readSPS = function (data) {
        var decoder = new bit_stream_1.default(data);
        var frameCropLeftOffset = 0;
        var frameCropRightOffset = 0;
        var frameCropTopOffset = 0;
        var frameCropBottomOffset = 0;
        var sarScale = 1;
        decoder.readUByte();
        var profileIdc = decoder.readUByte();
        decoder.skipBits(5);
        decoder.skipBits(3);
        decoder.skipBits(8);
        decoder.skipUEG();
        if (profileIdc === 100 ||
          profileIdc === 110 ||
          profileIdc === 122 ||
          profileIdc === 244 ||
          profileIdc === 44 ||
          profileIdc === 83 ||
          profileIdc === 86 ||
          profileIdc === 118 ||
          profileIdc === 128) {
          var chromaFormatIdc = decoder.readUEG();
          if (chromaFormatIdc === 3) {
            decoder.skipBits(1);
          }
          decoder.skipUEG();
          decoder.skipUEG();
          decoder.skipBits(1);
          if (decoder.readBoolean()) {
            var scalingListCount = (chromaFormatIdc !== 3) ? 8 : 12;
            for (var i = 0; i < scalingListCount; ++i) {
              if (decoder.readBoolean()) {
                if (i < 6) {
                  H264Parser.skipScalingList(decoder, 16);
                }
                else {
                  H264Parser.skipScalingList(decoder, 64);
                }
              }
            }
          }
        }
        decoder.skipUEG();
        var picOrderCntType = decoder.readUEG();
        if (picOrderCntType === 0) {
          decoder.readUEG();
        }
        else if (picOrderCntType === 1) {
          decoder.skipBits(1);
          decoder.skipEG();
          decoder.skipEG();
          var numRefFramesInPicOrderCntCycle = decoder.readUEG();
          for (var i = 0; i < numRefFramesInPicOrderCntCycle; ++i) {
            decoder.skipEG();
          }
        }
        decoder.skipUEG();
        decoder.skipBits(1);
        var picWidthInMbsMinus1 = decoder.readUEG();
        var picHeightInMapUnitsMinus1 = decoder.readUEG();
        var frameMbsOnlyFlag = decoder.readBits(1);
        if (frameMbsOnlyFlag === 0) {
          decoder.skipBits(1);
        }
        decoder.skipBits(1);
        if (decoder.readBoolean()) {
          frameCropLeftOffset = decoder.readUEG();
          frameCropRightOffset = decoder.readUEG();
          frameCropTopOffset = decoder.readUEG();
          frameCropBottomOffset = decoder.readUEG();
        }
        if (decoder.readBoolean()) {
          if (decoder.readBoolean()) {
            var sarRatio = void 0;
            var aspectRatioIdc = decoder.readUByte();
            switch (aspectRatioIdc) {
              case 1:
                sarRatio = [1, 1];
                break;
              case 2:
                sarRatio = [12, 11];
                break;
              case 3:
                sarRatio = [10, 11];
                break;
              case 4:
                sarRatio = [16, 11];
                break;
              case 5:
                sarRatio = [40, 33];
                break;
              case 6:
                sarRatio = [24, 11];
                break;
              case 7:
                sarRatio = [20, 11];
                break;
              case 8:
                sarRatio = [32, 11];
                break;
              case 9:
                sarRatio = [80, 33];
                break;
              case 10:
                sarRatio = [18, 11];
                break;
              case 11:
                sarRatio = [15, 11];
                break;
              case 12:
                sarRatio = [64, 33];
                break;
              case 13:
                sarRatio = [160, 99];
                break;
              case 14:
                sarRatio = [4, 3];
                break;
              case 15:
                sarRatio = [3, 2];
                break;
              case 16:
                sarRatio = [2, 1];
                break;
              case 255: {
                sarRatio = [decoder.readUByte() << 8 | decoder.readUByte(), decoder.readUByte() << 8 | decoder.readUByte()];
                break;
              }
              default: {
                debug.error("  H264: Unknown aspectRatioIdc=" + aspectRatioIdc);
              }
            }
            if (sarRatio) {
              sarScale = sarRatio[0] / sarRatio[1];
            }
          }
          if (decoder.readBoolean()) {
            decoder.skipBits(1);
          }
          if (decoder.readBoolean()) {
            decoder.skipBits(4);
            if (decoder.readBoolean()) {
              decoder.skipBits(24);
            }
          }
          if (decoder.readBoolean()) {
            decoder.skipUEG();
            decoder.skipUEG();
          }
          if (decoder.readBoolean()) {
            var unitsInTick = decoder.readUInt();
            var timeScale = decoder.readUInt();
            var fixedFrameRate = decoder.readBoolean();
            var frameDuration = timeScale / (2 * unitsInTick);
            debug.log("timescale: " + timeScale + "; unitsInTick: " + unitsInTick + "; " +
              ("fixedFramerate: " + fixedFrameRate + "; avgFrameDuration: " + frameDuration));
          }
        }
        return {
          width: Math.ceil((((picWidthInMbsMinus1 + 1) * 16) - frameCropLeftOffset * 2 - frameCropRightOffset * 2) * sarScale),
          height: ((2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16) -
            ((frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset)),
        };
      };
      H264Parser.readSEI = function (data) {
        var decoder = new bit_stream_1.default(data);
        decoder.skipBits(8);
        var result = [];
        while (decoder.bitsAvailable > 3 * 8) {
          result.push(this.readSEIMessage(decoder));
        }
        return result;
      };
      H264Parser.readSEIMessage = function (decoder) {
        function get() {
          var result = 0;
          while (true) {
            var value = decoder.readUByte();
            result += value;
            if (value !== 0xff) {
              break;
            }
          }
          return result;
        }
        var payloadType = get();
        var payloadSize = get();
        return this.readSEIPayload(decoder, payloadType, payloadSize);
      };
      H264Parser.readSEIPayload = function (decoder, type, size) {
        var result;
        switch (type) {
          default:
            result = { type: type };
            decoder.skipBits(size * 8);
        }
        decoder.skipBits(decoder.bitsAvailable % 8);
        return result;
      };
      return H264Parser;
    }());
    exports.default = H264Parser;

  }, { "./util/NALU": 20, "./util/bit-stream": 21, "./util/debug": 22 }], 17: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var h264_parser_1 = require("./h264-parser");
    var debug = require("./util/debug");
    var NALU_1 = require("./util/NALU");
    var trackId = 1;
    var H264Remuxer = (function () {
      function H264Remuxer(fps, framePerFragment, timescale) {
        this.fps = fps;
        this.framePerFragment = framePerFragment;
        this.timescale = timescale;
        this.readyToDecode = false;
        this.totalDTS = 0;
        this.stepDTS = Math.round(this.timescale / this.fps);
        this.frameCount = 0;
        this.seq = 1;
        this.mp4track = {
          id: H264Remuxer.getTrackID(),
          type: 'video',
          len: 0,
          codec: '',
          sps: [],
          pps: [],
          seiBuffering: false,
          width: 0,
          height: 0,
          timescale: timescale,
          duration: timescale,
          samples: [],
          isKeyFrame: true,
        };
        this.unitSamples = [[]];
        this.parser = new h264_parser_1.default(this);
      }
      H264Remuxer.getTrackID = function () {
        return trackId++;
      };
      Object.defineProperty(H264Remuxer.prototype, "seqNum", {
        get: function () {
          return this.seq;
        },
        enumerable: true,
        configurable: true
      });
      H264Remuxer.prototype.remux = function (nalu) {
        // console.log('===============================');
        // console.log(nalu.type());
        // console.log(NALU_1.default.SEI);
        // console.log(NALU_1.default.IDR);
        // console.log(NALU_1.default.NDR);
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        if (this.mp4track.seiBuffering && nalu.type() === NALU_1.default.SEI) {
          return this.createNextFrame();
        }
        if (this.parser.parseNAL(nalu)) {
          this.unitSamples[this.unitSamples.length - 1].push(nalu);
          this.mp4track.len += nalu.getSize();
        }
        if (!this.mp4track.seiBuffering && (nalu.type() === NALU_1.default.IDR || nalu.type() === NALU_1.default.NDR)) {
          return this.createNextFrame();
        }
        return;
      };
      H264Remuxer.prototype.createNextFrame = function () {

        if (this.mp4track.len > 0) {
          // console.log(this.mp4track.len);
          // console.log(this.framePerFragment);
          this.frameCount++;
          if (this.frameCount % this.framePerFragment === 0) {
            var fragment = this.getFragment();
            if (fragment) {
              var dts = this.totalDTS;
              this.totalDTS = this.stepDTS * this.frameCount;
              return [dts, fragment];
            }
            else {
              debug.log("No mp4 sample data.");
            }
          }
          this.unitSamples.push([]);
        }
        return;
      };
      H264Remuxer.prototype.flush = function () {
        this.seq++;
        this.mp4track.len = 0;
        this.mp4track.samples = [];
        this.mp4track.isKeyFrame = false;
        this.unitSamples = [[]];
      };
      H264Remuxer.prototype.getFragment = function () {
        if (!this.checkReadyToDecode()) {
          return undefined;
        }
        var payload = new Uint8Array(this.mp4track.len);
        this.mp4track.samples = [];
        var offset = 0;
        for (var i = 0, len = this.unitSamples.length; i < len; i++) {
          var units = this.unitSamples[i];
          if (units.length === 0) {
            continue;
          }
          var mp4Sample = {
            size: 0,
            cts: this.stepDTS * i,
          };
          for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
            var unit = units_1[_i];
            mp4Sample.size += unit.getSize();
            payload.set(unit.getData(), offset);
            offset += unit.getSize();
          }
          this.mp4track.samples.push(mp4Sample);
        }
        if (offset === 0) {
          return undefined;
        }
        return payload;
      };
      H264Remuxer.prototype.checkReadyToDecode = function () {
        if (!this.readyToDecode || this.unitSamples.filter(function (array) { return array.length > 0; }).length === 0) {
          debug.log("Not ready to decode! readyToDecode(" + this.readyToDecode + ") is false or units is empty.");
          return false;
        }
        return true;
      };
      return H264Remuxer;
    }());
    exports.default = H264Remuxer;

  }, { "./h264-parser": 16, "./util/NALU": 20, "./util/debug": 22 }], 18: [function (require, module, exports) {
    (function (Buffer) {
      //var VideoConverter = require('./video-converter.js');
      var convert = require('pcm-convert');

      // var Lame = require("node-lame").Lame;
      var Lame = require('../../node-lame/lib/build/Lame.js');
      // var files = fs.readdirSync('D:/xampp/htdocs/example/gops/1/1/201905/0910'); //720
      // var files = fs.readdirSync('D:/xampp/htdocs/example/gops/3/201905/1007'); // 1080
      // var files = fs.readdirSync('D:/xampp/htdocs/example/gops/h265/1/18/201905/1007'); // 1080
      // var files = fs.readdirSync('D:/xampp/htdocs/example/gops/1/11/201905/1308'); // 韓團 audio
      // var files = ["1557749607.gop","1557749608.gop","1557749609.gop","1557749610.gop","1557749611.gop","1557749612.gop","1557749613.gop","1557749614.gop","1557749615.gop","1557749616.gop","1557749617.gop","picture.jpg"]; // 蔡依林 
      var files = ["1557749607.gop", "1557749608.gop", "1557749609.gop", "1557749610.gop", "1557749611.gop", "1557749612.gop", "1557749613.gop", "1557749614.gop", "1557749615.gop", "1557749616.gop", "1557749617.gop", "picture.jpg"]; // 蔡依林 
      // window.videoConverter =function(element, fps, fpf){
      //   return new VideoConverter.default(element, fps, fpf);
      // };
      window.convert = convert;
      window.gopFiles = files;
      window.Lame = function (option, mp3InputBuffer) {
        return new Lame.Lame({
          "output": "buffer"
        }).setBuffer(Buffer.from(mp3InputBuffer));
      };
      // console.log(Buffer.from([1, 2, 3]));
      // window.createBuffer = function(obj){
      // 	return Buffer.from(obj);
      // }

    }).call(this, require("buffer").Buffer)
  }, { "../../node-lame/lib/build/Lame.js": 28, "./video-converter.js": 24, "buffer": 7, "pcm-convert": 31 }], 19: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MP4 = (function () {
      function MP4() {
      }
      MP4.init = function () {
        MP4.initalized = true;
        MP4.types = {
          avc1: [],
          avcC: [],
          btrt: [],
          dinf: [],
          dref: [],
          esds: [],
          ftyp: [],
          hdlr: [],
          mdat: [],
          mdhd: [],
          mdia: [],
          mfhd: [],
          minf: [],
          moof: [],
          moov: [],
          mp4a: [],
          mvex: [],
          mvhd: [],
          sdtp: [],
          stbl: [],
          stco: [],
          stsc: [],
          stsd: [],
          stsz: [],
          stts: [],
          styp: [],
          tfdt: [],
          tfhd: [],
          traf: [],
          trak: [],
          trun: [],
          trep: [],
          trex: [],
          tkhd: [],
          vmhd: [],
          smhd: [],
        };
        for (var type in MP4.types) {
          if (MP4.types.hasOwnProperty(type)) {
            MP4.types[type] = [
              type.charCodeAt(0),
              type.charCodeAt(1),
              type.charCodeAt(2),
              type.charCodeAt(3),
            ];
          }
        }
        var hdlr = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x76, 0x69, 0x64, 0x65,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x56, 0x69, 0x64, 0x65,
          0x6f, 0x48, 0x61, 0x6e,
          0x64, 0x6c, 0x65, 0x72, 0x00,
        ]);
        var dref = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x0c,
          0x75, 0x72, 0x6c, 0x20,
          0x00,
          0x00, 0x00, 0x01,
        ]);
        var stco = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
        ]);
        MP4.STTS = MP4.STSC = MP4.STCO = stco;
        MP4.STSZ = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
        ]);
        MP4.VMHD = new Uint8Array([
          0x00,
          0x00, 0x00, 0x01,
          0x00, 0x00,
          0x00, 0x00,
          0x00, 0x00,
          0x00, 0x00,
        ]);
        MP4.SMHD = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00,
          0x00, 0x00,
        ]);
        MP4.STSD = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x01
        ]);
        MP4.FTYP = MP4.box(MP4.types.ftyp, new Uint8Array([
          0x69, 0x73, 0x6f, 0x35,
          0x00, 0x00, 0x00, 0x01,
          0x61, 0x76, 0x63, 0x31,
          0x69, 0x73, 0x6f, 0x35,
          0x64, 0x61, 0x73, 0x68,
        ]));
        MP4.STYP = MP4.box(MP4.types.styp, new Uint8Array([
          0x6d, 0x73, 0x64, 0x68,
          0x00, 0x00, 0x00, 0x00,
          0x6d, 0x73, 0x64, 0x68,
          0x6d, 0x73, 0x69, 0x78,
        ]));
        MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
        MP4.HDLR = MP4.box(MP4.types.hdlr, hdlr);
      };
      MP4.box = function (type) {
        var payload = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          payload[_i - 1] = arguments[_i];
        }
        var size = 8;
        for (var _a = 0, payload_1 = payload; _a < payload_1.length; _a++) {
          var p = payload_1[_a];
          size += p.byteLength;
        }
        var result = new Uint8Array(size);
        result[0] = (size >> 24) & 0xff;
        result[1] = (size >> 16) & 0xff;
        result[2] = (size >> 8) & 0xff;
        result[3] = size & 0xff;
        result.set(type, 4);
        size = 8;
        for (var _b = 0, payload_2 = payload; _b < payload_2.length; _b++) {
          var box = payload_2[_b];
          result.set(box, size);
          size += box.byteLength;
        }
        return result;
      };
      MP4.mdat = function (data) {
        return MP4.box(MP4.types.mdat, data);
      };
      MP4.mdhd = function (timescale) {
        return MP4.box(MP4.types.mdhd, new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x02,
          (timescale >> 24) & 0xFF,
          (timescale >> 16) & 0xFF,
          (timescale >> 8) & 0xFF,
          timescale & 0xFF,
          0x00, 0x00, 0x00, 0x00,
          0x55, 0xc4,
          0x00, 0x00,
        ]));
      };
      MP4.mdia = function (track) {
        return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale), MP4.HDLR, MP4.minf(track));
      };
      MP4.mfhd = function (sequenceNumber) {
        return MP4.box(MP4.types.mfhd, new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          (sequenceNumber >> 24),
          (sequenceNumber >> 16) & 0xFF,
          (sequenceNumber >> 8) & 0xFF,
          sequenceNumber & 0xFF,
        ]));
      };
      MP4.minf = function (track) {
        return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
      };
      MP4.moof = function (sn, baseMediaDecodeTime, track) {
        return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
      };
      MP4.moov = function (tracks, duration, timescale) {
        var boxes = [];
        for (var _i = 0, tracks_1 = tracks; _i < tracks_1.length; _i++) {
          var track = tracks_1[_i];
          boxes.push(MP4.trak(track));
        }
        return MP4.box.apply(MP4, [MP4.types.moov, MP4.mvhd(timescale, duration), MP4.mvex(tracks)].concat(boxes));
      };
      MP4.mvhd = function (timescale, duration) {
        var bytes = new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x02,
          (timescale >> 24) & 0xFF,
          (timescale >> 16) & 0xFF,
          (timescale >> 8) & 0xFF,
          timescale & 0xFF,
          (duration >> 24) & 0xFF,
          (duration >> 16) & 0xFF,
          (duration >> 8) & 0xFF,
          duration & 0xFF,
          0x00, 0x01, 0x00, 0x00,
          0x01, 0x00,
          0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x01, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x01, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x40, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x02,
        ]);
        return MP4.box(MP4.types.mvhd, bytes);
      };
      MP4.mvex = function (tracks) {
        var boxes = [];
        for (var _i = 0, tracks_2 = tracks; _i < tracks_2.length; _i++) {
          var track = tracks_2[_i];
          boxes.push(MP4.trex(track));
        }
        return MP4.box.apply(MP4, [MP4.types.mvex].concat(boxes, [MP4.trep()]));
      };
      MP4.trep = function () {
        return MP4.box(MP4.types.trep, new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x01,
        ]));
      };
      MP4.stbl = function (track) {
        return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
      };
      MP4.avc1 = function (track) {
        var sps = [];
        var pps = [];
        for (var _i = 0, _a = track.sps; _i < _a.length; _i++) {
          var data = _a[_i];
          var len = data.byteLength;
          sps.push((len >>> 8) & 0xFF);
          sps.push((len & 0xFF));
          sps = sps.concat(Array.prototype.slice.call(data));
        }
        for (var _b = 0, _c = track.pps; _b < _c.length; _b++) {
          var data = _c[_b];
          var len = data.byteLength;
          pps.push((len >>> 8) & 0xFF);
          pps.push((len & 0xFF));
          pps = pps.concat(Array.prototype.slice.call(data));
        }
        var avcc = MP4.box(MP4.types.avcC, new Uint8Array([
          0x01,
          sps[3],
          sps[4],
          sps[5],
          0xfc | 3,
          0xE0 | track.sps.length,
        ].concat(sps).concat([
          track.pps.length,
        ]).concat(pps)));
        var width = track.width;
        var height = track.height;
        return MP4.box(MP4.types.avc1, new Uint8Array([
          0x00, 0x00, 0x00,
          0x00, 0x00, 0x00,
          0x00, 0x01,
          0x00, 0x00,
          0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          (width >> 8) & 0xFF,
          width & 0xff,
          (height >> 8) & 0xFF,
          height & 0xff,
          0x00, 0x48, 0x00, 0x00,
          0x00, 0x48, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x01,
          0x12,
          0x62, 0x69, 0x6E, 0x65,
          0x6C, 0x70, 0x72, 0x6F,
          0x2E, 0x72, 0x75, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00,
          0x00, 0x18,
          0x11, 0x11
        ]), avcc, MP4.box(MP4.types.btrt, new Uint8Array([
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x2d, 0xc6, 0xc0,
          0x00, 0x2d, 0xc6, 0xc0,
        ])));
      };
      MP4.stsd = function (track) {
        return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
      };
      MP4.tkhd = function (track) {
        var id = track.id;
        var width = track.width;
        var height = track.height;
        return MP4.box(MP4.types.tkhd, new Uint8Array([
          0x00,
          0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x02,
          (id >> 24) & 0xFF,
          (id >> 16) & 0xFF,
          (id >> 8) & 0xFF,
          id & 0xFF,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00,
          0x00, 0x00,
          (track.type === 'audio' ? 0x01 : 0x00), 0x00,
          0x00, 0x00,
          0x00, 0x01, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x01, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00,
          0x40, 0x00, 0x00, 0x00,
          (width >> 8) & 0xFF,
          width & 0xFF,
          0x00, 0x00,
          (height >> 8) & 0xFF,
          height & 0xFF,
          0x00, 0x00,
        ]));
      };
      MP4.traf = function (track, baseMediaDecodeTime) {
        var id = track.id;
        return MP4.box(MP4.types.traf, MP4.box(MP4.types.tfhd, new Uint8Array([
          0x00,
          0x02, 0x00, 0x00,
          (id >> 24),
          (id >> 16) & 0XFF,
          (id >> 8) & 0XFF,
          (id & 0xFF),
        ])), MP4.box(MP4.types.tfdt, new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          (baseMediaDecodeTime >> 24),
          (baseMediaDecodeTime >> 16) & 0XFF,
          (baseMediaDecodeTime >> 8) & 0XFF,
          (baseMediaDecodeTime & 0xFF),
        ])), MP4.trun(track, 16 +
          16 +
          8 +
          16 +
          8 +
          8));
      };
      MP4.trak = function (track) {
        track.duration = track.duration || 0xffffffff;
        return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
      };
      MP4.trex = function (track) {
        var id = track.id;
        return MP4.box(MP4.types.trex, new Uint8Array([
          0x00,
          0x00, 0x00, 0x00,
          (id >> 24),
          (id >> 16) & 0XFF,
          (id >> 8) & 0XFF,
          (id & 0xFF),
          0x00, 0x00, 0x00, 0x01,
          0x00, 0x00, 0x00, 0x3c,
          0x00, 0x00, 0x00, 0x00,
          0x00, 0x01, 0x00, 0x00,
        ]));
      };
      MP4.trun = function (track, offset) {
        var samples = track.samples || [];
        var len = samples.length;
        var additionalLen = track.isKeyFrame ? 4 : 0;
        var arraylen = 12 + additionalLen + (4 * len);
        var array = new Uint8Array(arraylen);
        offset += 8 + arraylen;
        array.set([
          0x00,
          0x00, 0x02, (track.isKeyFrame ? 0x05 : 0x01),
          (len >>> 24) & 0xFF,
          (len >>> 16) & 0xFF,
          (len >>> 8) & 0xFF,
          len & 0xFF,
          (offset >>> 24) & 0xFF,
          (offset >>> 16) & 0xFF,
          (offset >>> 8) & 0xFF,
          offset & 0xFF,
        ], 0);
        if (track.isKeyFrame) {
          array.set([
            0x00, 0x00, 0x00, 0x00,
          ], 12);
        }
        for (var i = 0; i < len; i++) {
          var sample = samples[i];
          var size = sample.size;
          array.set([
            (size >>> 24) & 0xFF,
            (size >>> 16) & 0xFF,
            (size >>> 8) & 0xFF,
            size & 0xFF,
          ], 12 + additionalLen + 4 * i);
        }
        return MP4.box(MP4.types.trun, array);
      };
      MP4.initSegment = function (tracks, duration, timescale) {
        if (!MP4.initalized) {
          MP4.init();
        }
        var movie = MP4.moov(tracks, duration, timescale);
        var result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
        result.set(MP4.FTYP);
        result.set(movie, MP4.FTYP.byteLength);
        return result;
      };
      MP4.fragmentSegment = function (sn, baseMediaDecodeTime, track, payload) {
        var moof = MP4.moof(sn, baseMediaDecodeTime, track);
        var mdat = MP4.mdat(payload);
        var result = new Uint8Array(MP4.STYP.byteLength + moof.byteLength + mdat.byteLength);
        result.set(MP4.STYP);
        result.set(moof, MP4.STYP.byteLength);
        result.set(mdat, MP4.STYP.byteLength + moof.byteLength);
        return result;
      };
      return MP4;
    }());
    MP4.types = {};
    MP4.initalized = false;
    exports.default = MP4;

  }, {}], 20: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NALU = (function () {
      function NALU(data) {
        this.data = data;
        this.nri = (data[0] & 0x60) >> 5;
        // console.log('--------------------NALU init------------------------');
        // console.log(data[0]);
        // console.log('--------------------NALU init end------------------------');
        this.ntype = data[0] & 0x1f;
      }
      Object.defineProperty(NALU, "NDR", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NALU, "IDR", {
        get: function () { return 5; },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NALU, "SEI", {
        get: function () { return 6; },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NALU, "SPS", {
        get: function () { return 7; },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NALU, "PPS", {
        get: function () { return 8; },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(NALU, "TYPES", {
        get: function () {
          return _a = {},
            _a[NALU.IDR] = 'IDR',
            _a[NALU.SEI] = 'SEI',
            _a[NALU.SPS] = 'SPS',
            _a[NALU.PPS] = 'PPS',
            _a[NALU.NDR] = 'NDR',
            _a;
          var _a;
        },
        enumerable: true,
        configurable: true
      });
      NALU.type = function (nalu) {
        if (nalu.ntype in NALU.TYPES) {
          return NALU.TYPES[nalu.ntype];
        }
        else {
          return 'UNKNOWN';
        }
      };
      NALU.prototype.type = function () {
        return this.ntype;
      };
      NALU.prototype.isKeyframe = function () {
        return this.ntype === NALU.IDR;
      };
      NALU.prototype.getSize = function () {
        return 4 + this.data.byteLength;
      };
      NALU.prototype.getData = function () {
        var result = new Uint8Array(this.getSize());
        var view = new DataView(result.buffer);
        view.setUint32(0, this.getSize() - 4);
        result.set(this.data, 4);
        return result;
      };
      return NALU;
    }());
    exports.default = NALU;

  }, {}], 21: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BitStream = (function () {
      function BitStream(data) {
        this.data = data;
        this.index = 0;
        this.bitLength = data.byteLength * 8;
      }
      Object.defineProperty(BitStream.prototype, "bitsAvailable", {
        get: function () {
          return this.bitLength - this.index;
        },
        enumerable: true,
        configurable: true
      });
      BitStream.prototype.skipBits = function (size) {
        if (this.bitsAvailable < size) {
          throw new Error('no bytes available');
        }
        this.index += size;
      };
      BitStream.prototype.readBits = function (size) {
        var result = this.getBits(size, this.index);
        return result;
      };
      BitStream.prototype.getBits = function (size, offsetBits, moveIndex) {
        if (moveIndex === void 0) { moveIndex = true; }
        if (this.bitsAvailable < size) {
          throw new Error('no bytes available');
        }
        var offset = offsetBits % 8;
        var byte = this.data[(offsetBits / 8) | 0] & (0xff >>> offset);
        var bits = 8 - offset;
        if (bits >= size) {
          if (moveIndex) {
            this.index += size;
          }
          return byte >> (bits - size);
        }
        else {
          if (moveIndex) {
            this.index += bits;
          }
          var nextSize = size - bits;
          return (byte << nextSize) | this.getBits(nextSize, offsetBits + bits, moveIndex);
        }
      };
      BitStream.prototype.skipLZ = function () {
        var leadingZeroCount;
        for (leadingZeroCount = 0; leadingZeroCount < this.bitLength - this.index; ++leadingZeroCount) {
          if (0 !== this.getBits(1, this.index + leadingZeroCount, false)) {
            this.index += leadingZeroCount;
            return leadingZeroCount;
          }
        }
        return leadingZeroCount;
      };
      BitStream.prototype.skipUEG = function () {
        this.skipBits(1 + this.skipLZ());
      };
      BitStream.prototype.skipEG = function () {
        this.skipBits(1 + this.skipLZ());
      };
      BitStream.prototype.readUEG = function () {
        var prefix = this.skipLZ();
        return this.readBits(prefix + 1) - 1;
      };
      BitStream.prototype.readEG = function () {
        var value = this.readUEG();
        if (0x01 & value) {
          return (1 + value) >>> 1;
        }
        else {
          return -1 * (value >>> 1);
        }
      };
      BitStream.prototype.readBoolean = function () {
        return 1 === this.readBits(1);
      };
      BitStream.prototype.readUByte = function () {
        return this.readBits(8);
      };
      BitStream.prototype.readUShort = function () {
        return this.readBits(16);
      };
      BitStream.prototype.readUInt = function () {
        return this.readBits(32);
      };
      return BitStream;
    }());
    exports.default = BitStream;

  }, {}], 22: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var logger;
    var errorLogger;
    function setLogger(log, error) {
      logger = log;
      errorLogger = error != null ? error : log;
    }
    exports.setLogger = setLogger;
    function isEnable() {
      return logger != null;
    }
    exports.isEnable = isEnable;
    function log(message) {
      var optionalParams = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
      }
      if (logger) {
        logger.apply(void 0, [message].concat(optionalParams));
      }
    }
    exports.log = log;
    function error(message) {
      var optionalParams = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
      }
      if (errorLogger) {
        errorLogger.apply(void 0, [message].concat(optionalParams));
      }
    }
    exports.error = error;

  }, {}], 23: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NALU_1 = require("./NALU");
    var VideoStreamBuffer = (function () {
      function VideoStreamBuffer() {
      }
      VideoStreamBuffer.prototype.clear = function () {
        this.buffer = undefined;
      };
      VideoStreamBuffer.prototype.append = function (value) {
        var nextNalHeader = function (b) {
          var i = 3;
          // var i = 3;
          return function () {
            var count = 0;
            for (; i < b.length; i++) {
              switch (b[i]) {
                case 0:
                  count++;
                  break;
                case 1:
                  if (count === 3) {
                    return i - 3;
                  }
                default:
                  count = 0;
              }
            }
            return;
          };
        };
        var result = [];
        var buffer;
        if (this.buffer) {
          if (value[3] === 1 && value[2] === 0 && value[1] === 0 && value[0] === 0) {
            result.push(new NALU_1.default(this.buffer.subarray(4)));
            buffer = Uint8Array.from(value);
          }
        }
        if (buffer == null) {
          buffer = this.mergeBuffer(value);
        }
        var lastIndex = 0;
        // console.log(buffer);
        var f = nextNalHeader(buffer);
        // console.log(f());
        for (var index = f(); index != null; index = f()) {
          result.push(new NALU_1.default(buffer.subarray(lastIndex + 4, index)));
          lastIndex = index;
        }
        this.buffer = buffer.subarray(lastIndex);
        // console.log(result);
        return result;
      };
      VideoStreamBuffer.prototype.mergeBuffer = function (value) {
        if (this.buffer == null) {
          return Uint8Array.from(value);
        }
        else {
          var newBuffer = new Uint8Array(this.buffer.byteLength + value.length);
          if (this.buffer.byteLength > 0) {
            newBuffer.set(this.buffer, 0);
          }
          newBuffer.set(value, this.buffer.byteLength);
          return newBuffer;
        }
      };
      return VideoStreamBuffer;
    }());
    exports.default = VideoStreamBuffer;

  }, { "./NALU": 20 }], 24: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var h264_remuxer_1 = require("./h264-remuxer");
    var mp4_generator_1 = require("./mp4-generator");
    var debug = require("./util/debug");
    var nalu_stream_buffer_1 = require("./util/nalu-stream-buffer");
    exports.mimeType = 'video/mp4; codecs="avc1.42E01E"';
    var VideoConverter = (function () {
      function VideoConverter(element, fps, fpf) {
        if (fps === void 0) { fps = 60; }
        if (fpf === void 0) { fpf = fps; }
        this.element = element;
        this.fps = fps;
        this.fpf = fpf;
        this.receiveBuffer = new nalu_stream_buffer_1.default();
        this.queue = [];
        if (!MediaSource || !MediaSource.isTypeSupported(exports.mimeType)) {
          throw new Error("Your browser is not supported: " + exports.mimeType);
        }
        this.reset();
      }
      Object.defineProperty(VideoConverter, "errorNotes", {
        get: function () {
          return _a = {},
            _a[MediaError.MEDIA_ERR_ABORTED] = 'fetching process aborted by user',
            _a[MediaError.MEDIA_ERR_NETWORK] = 'error occurred when downloading',
            _a[MediaError.MEDIA_ERR_DECODE] = 'error occurred when decoding',
            _a[MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED] = 'audio/video not supported',
            _a;
          var _a;
        },
        enumerable: true,
        configurable: true
      });
      VideoConverter.prototype.setup = function () {
        var _this = this;
        this.mediaReadyPromise = new Promise(function (resolve, _reject) {
          _this.mediaSource.addEventListener('sourceopen', function () {
            debug.log("Media Source opened.");
            _this.sourceBuffer = _this.mediaSource.addSourceBuffer(exports.mimeType);
            _this.sourceBuffer.addEventListener('updateend', function () {
              debug.log("  SourceBuffer updateend");
              debug.log("    sourceBuffer.buffered.length=" + _this.sourceBuffer.buffered.length);
              for (var i = 0, len = _this.sourceBuffer.buffered.length; i < len; i++) {
                debug.log("    sourceBuffer.buffered [" + i + "]: " +
                  (_this.sourceBuffer.buffered.start(i) + ", " + _this.sourceBuffer.buffered.end(i)));
              }
              debug.log("  mediasource.duration=" + _this.mediaSource.duration);
              debug.log("  mediasource.readyState=" + _this.mediaSource.readyState);
              debug.log("  video.duration=" + _this.element.duration);
              debug.log("    video.buffered.length=" + _this.element.buffered.length);
              if (debug.isEnable()) {
                for (var i = 0, len = _this.element.buffered.length; i < len; i++) {
                  debug.log("    video.buffered [" + i + "]: " + _this.element.buffered.start(i) + ", " + _this.element.buffered.end(i));
                }
              }
              debug.log("  video.currentTime=" + _this.element.currentTime);
              debug.log("  video.readyState=" + _this.element.readyState);
              var data = _this.queue.shift();
              if (data) {
                _this.writeBuffer(data);
              }
            });
            _this.sourceBuffer.addEventListener('error', function () {
              debug.error('  SourceBuffer errored!');
            });
            _this.mediaReady = true;
            resolve();
          }, false);
          _this.mediaSource.addEventListener('sourceclose', function () {
            debug.log("Media Source closed.");
            _this.mediaReady = false;
          }, false);
          _this.element.src = URL.createObjectURL(_this.mediaSource);
        });
        return this.mediaReadyPromise;
      };
      VideoConverter.prototype.play = function () {
        var _this = this;
        if (!this.element.paused) {
          return;
        }
        if (this.mediaReady && this.element.readyState >= 2) {
          this.element.play();
        }
        else {
          var handler_1 = function () {
            _this.play();
            _this.element.removeEventListener('canplaythrough', handler_1);
          };
          this.element.addEventListener('canplaythrough', handler_1);
        }
      };
      VideoConverter.prototype.pause = function () {
        if (this.element.paused) {
          return;
        }
        this.element.pause();
      };
      VideoConverter.prototype.reset = function () {
        this.receiveBuffer.clear();
        if (this.mediaSource && this.mediaSource.readyState === 'open') {
          this.mediaSource.duration = 0;
          this.mediaSource.endOfStream();
        }
        this.mediaSource = new MediaSource();
        this.remuxer = new h264_remuxer_1.default(this.fps, this.fpf, this.fps * 60);
        this.mediaReady = false;
        this.mediaReadyPromise = undefined;
        this.queue = [];
        this.isFirstFrame = true;
        this.setup();
      };
      VideoConverter.prototype.appendRawData = function (data) {
        var nalus = this.receiveBuffer.append(data);
        for (var _i = 0, nalus_1 = nalus; _i < nalus_1.length; _i++) {
          var nalu = nalus_1[_i];
          // console.log(nalu);
          var ret = this.remuxer.remux(nalu);

          if (ret) {
            this.writeFragment(ret[0], ret[1]);
          }
        }
      };
      VideoConverter.prototype.writeFragment = function (dts, pay) {
        var remuxer = this.remuxer;
        if (remuxer.mp4track.isKeyFrame) {
          this.writeBuffer(mp4_generator_1.default.initSegment([remuxer.mp4track], Infinity, remuxer.timescale));
        }
        if (pay && pay.byteLength) {
          debug.log(" Put fragment: " + remuxer.seqNum + ", frames=" + remuxer.mp4track.samples.length + ", size=" + pay.byteLength);
          var fragment = mp4_generator_1.default.fragmentSegment(remuxer.seqNum, dts, remuxer.mp4track, pay);
          this.writeBuffer(fragment);
          remuxer.flush();
        }
        else {
          debug.error("Nothing payload!");
        }
      };
      VideoConverter.prototype.writeBuffer = function (data) {
        var _this = this;
        if (this.mediaReady) {
          if (this.sourceBuffer.updating) {
            this.queue.push(data);
          }
          else {
            this.doAppend(data);
          }
        }
        else {
          this.queue.push(data);
          if (this.mediaReadyPromise) {
            this.mediaReadyPromise.then(function () {
              if (!_this.sourceBuffer.updating) {
                var d = _this.queue.shift();
                if (d) {
                  _this.writeBuffer(d);
                }
              }
            });
            this.mediaReadyPromise = undefined;
          }
        }
      };
      VideoConverter.prototype.doAppend = function (data) {
        var error = this.element.error;
        if (error) {
          debug.error("MSE Error Occured: " + VideoConverter.errorNotes[error.code]);
          this.element.pause();
          if (this.mediaSource.readyState === 'open') {
            this.mediaSource.endOfStream();
          }
        }
        else {
          try {
            this.sourceBuffer.appendBuffer(data);
            debug.log("  appended buffer: size=" + data.byteLength);
          }
          catch (err) {
            debug.error("MSE Error occured while appending buffer. " + err.name + ": " + err.message);
          }
        }
      };
      return VideoConverter;
    }());
    exports.default = VideoConverter;

  }, { "./h264-remuxer": 17, "./mp4-generator": 19, "./util/debug": 22, "./util/nalu-stream-buffer": 23 }], 25: [function (require, module, exports) {
    /**
     * @module  is-audio-buffer
     */
    'use strict';

    module.exports = function isAudioBuffer(buffer) {
      //the guess is duck-typing
      return buffer != null
        && typeof buffer.length === 'number'
        && typeof buffer.sampleRate === 'number' //swims like AudioBuffer
        && typeof buffer.getChannelData === 'function' //quacks like AudioBuffer
        // && buffer.copyToChannel
        // && buffer.copyFromChannel
        && typeof buffer.duration === 'number'
    };

  }, {}], 26: [function (require, module, exports) {
    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */

    // The _isBuffer check is for Safari 5-7 support, because it's missing
    // Object.prototype.constructor. Remove this eventually
    module.exports = function (obj) {
      return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
    }

    function isBuffer(obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
    }

    // For Node v0.10 support. Remove this eventually.
    function isSlowBuffer(obj) {
      return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
    }

  }, {}], 27: [function (require, module, exports) {
    'use strict';
    var toString = Object.prototype.toString;

    module.exports = function (x) {
      var prototype;
      return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
    };

  }, {}], 28: [function (require, module, exports) {
    (function (Buffer, __dirname) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const LameOptions_1 = require("./LameOptions");
      const fs_1 = require("fs");
      const util_1 = require("util");
      const child_process_1 = require("child_process");
      const events_1 = require("events");
      /**
       * Wrapper for Lame for Node
       *
       * @class Lame
       */
      class Lame {
        /**
         * Creates an instance of Lame and set all options
         * @param {Options} options
         */
        constructor(options) {
          this.status = {
            started: false,
            finished: false,
            progress: undefined,
            eta: undefined
          };
          this.emitter = new events_1.EventEmitter();
          this.options = options;
          this.args = new LameOptions_1.LameOptions(this.options).getArguments();
        }
        /**
         * Set file path of audio to decode/encode
         *
         * @param {string} filePath
         */
        setFile(path) {
          if (!fs_1.existsSync(path)) {
            throw new Error("Audio file (path) dose not exist");
          }
          this.filePath = path;
          this.fileBuffer = undefined;
          return this;
        }
        /**
         * Set file buffer of audio to decode/encode
         *
         * @param {Buffer} file
         */
        setBuffer(file) {
          if (!util_1.isBuffer(file)) {
            throw new Error("Audio file (buffer) dose not exist");
          }
          this.fileBuffer = file;
          this.filePath = undefined;
          return this;
        }
        /**
         * Get decoded/encoded file path
         *
         * @returns {string} Path of decoded/encoded file
         */
        getFile() {
          if (this.progressedFilePath == undefined) {
            throw new Error("Audio is not yet decoded/encoded");
          }
          return this.progressedFilePath;
        }
        /**
         * Get decoded/encoded file as buffer
         *
         * @returns {Buffer} decoded/Encoded file
         */
        getBuffer() {
          if (this.progressedBuffer == undefined) {
            throw new Error("Audio is not yet decoded/encoded");
          }
          return this.progressedBuffer;
        }
        /**
         * Get event emitter
         *
         * @returns {EventEmitter}
         */
        getEmitter() {
          return this.emitter;
        }
        /**
         * Get status of converter
         *
         * @returns {LameStatus}
         */
        getStatus() {
          return this.status;
        }
        /**
         * Encode audio file by Lame
         *
         * @return {Promise}
         */
        encode() {
          return this.progress("encode");
        }
        /**
         * Decode audio file by Lame
         *
         * @return {Promise}
         */
        decode() {
          return this.progress("decode");
        }
        /**
         * Decode/Encode audio file by Lame
         *
         * @return {Promise}
         */
        progress(type) {
          if (this.filePath == undefined && this.fileBuffer == undefined) {
            throw new Error("Audio file to encode is not set");
          }
          // Set decode flag to progress a MP3 to WAV decode
          const args = this.args;
          if (type == "decode") {
            args.push("--decode");
          }
          if (this.fileBuffer != undefined) {
            // File buffer is set; write it as temp file
            this.fileBufferTempFilePath = this.tempFilePathGenerator("raw", type);
            return new Promise((resolve, reject) => {
              fs_1.writeFile(this.fileBufferTempFilePath, this.fileBuffer, err => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(this.fileBufferTempFilePath);
              });
            })
              .then((file) => {
                return this.execProgress(file, args, type);
              })
              .catch((error) => {
                this.removeTempFilesOnError();
                throw error;
              });
          }
          else {
            // File path is set
            return this.execProgress(this.filePath, args, type).catch((error) => {
              this.removeTempFilesOnError();
              throw error;
            });
          }
        }
        /**
         * Execute decoding/encoding via spawn Lame
         *
         * @private
         * @param {string} inputFilePath Path of input file
         */
        execProgress(inputFilePath, args, type) {
          // Add output settings args
          args.push("--disptime");
          args.push("1");
          // Add output file to args, if not undefined in options
          if (this.options.output == "buffer") {
            const tempOutPath = this.tempFilePathGenerator("encoded", type);
            args.unshift(`${tempOutPath}`);
            // Set decode/encoded file path
            this.progressedBufferTempFilePath = tempOutPath;
          }
          else {
            // Set decode/encoded file path
            this.progressedFilePath = this.options.output;
            args.unshift(this.progressedFilePath);
          }
          // Add input file to args
          args.unshift(inputFilePath);
          // Spawn instance of encoder and hook output methods
          this.status.started = true;
          this.status.finished = false;
          this.status.progress = 0;
          this.status.eta = undefined;
          /**
           * Handles output of stdout (and stderr)
           * Parses data from output into object
           *
           * @param {(String | Buffer)} data
           */
          const progressStdout = (data) => {
            data = data.toString().trim();
            // Every output of Lame comes as "stderr". Deciding if it is an error or valid data by regex
            if (data.length > 6) {
              if (type == "encode" &&
                data.search("Writing LAME Tag...done") > -1) {
                // processing done
                this.status.finished = true;
                this.status.progress = 100;
                this.status.eta = "00:00";
                this.emitter.emit("finish");
                this.emitter.emit("progress", [
                  this.status.progress,
                  this.status.eta
                ]);
              }
              else if (type == "encode" &&
                data.search(/\((( [0-9])|([0-9]{2})|(100))%\)\|/) > -1) {
                // status of processing
                const progressMatch = data.match(/\((( [0-9])|([0-9]{2})|(100))%\)\|/);
                const etaMatch = data.match(/[0-9]{1,2}:[0-9][0-9] /);
                const progress = String(progressMatch[1]);
                let eta = null;
                if (etaMatch != null) {
                  eta = etaMatch[0].trim();
                }
                if (progress != null &&
                  Number(progress) > this.status.progress) {
                  this.status.progress = Number(progress);
                }
                if (eta != null) {
                  this.status.eta = eta;
                }
                this.emitter.emit("progress", [
                  this.status.progress,
                  this.status.eta
                ]);
              }
              else if (type == "decode" &&
                data.search(/[0-9]{1,10}\/[0-9]{1,10}/) > -1) {
                const progressMatch = data.match(/[0-9]{1,10}\/[0-9]{1,10}/);
                const progressAbsolute = progressMatch[0].split("/");
                const progress = Math.floor((Number(progressAbsolute[0]) /
                  Number(progressAbsolute[1])) *
                  100);
                if (!isNaN(progress) &&
                  Number(progress) > this.status.progress) {
                  this.status.progress = Number(progress);
                }
                this.emitter.emit("progress", [
                  this.status.progress,
                  this.status.eta
                ]);
              }
              else if (data.search(/^lame: /) > -1 ||
                data.search(/^Warning: /) > -1 ||
                data.search(/Error /) > -1) {
                // Unexpected output => error
                if (data.search(/^lame: /) == -1) {
                  this.emitter.emit("error", new Error("lame: " + data));
                }
                else {
                  this.emitter.emit("error", new Error(String(data)));
                }
              }
            }
          };
          const progressOnClose = code => {
            if (code == 0) {
              if (!this.status.finished) {
                this.emitter.emit("finish");
              }
              this.status.finished = true;
              this.status.progress = 100;
              this.status.eta = "00:00";
            }
          };
          /**
           * Handles error throw of Lame instance
           *
           * @param {Error} error
           */
          const progressError = (error) => {
            this.emitter.emit("error", error);
          };
          const instance = child_process_1.spawn("lame", args);
          instance.stdout.on("data", progressStdout);
          instance.stderr.on("data", progressStdout); // Most output, even non-errors, are on stderr
          instance.on("close", progressOnClose);
          instance.on("error", progressError);
          // Return promise of finish encoding progress
          return new Promise((resolve, reject) => {
            this.emitter.on("finish", () => {
              // If input was buffer, remove temp file
              if (this.fileBufferTempFilePath != undefined) {
                fs_1.unlinkSync(this.fileBufferTempFilePath);
              }
              // If output should be a buffer, load decoded/encoded audio file in object and remove temp file
              if (this.options.output == "buffer") {
                fs_1.readFile(this.progressedBufferTempFilePath, null, (error, data) => {
                  // Remove temp decoded/encoded file
                  fs_1.unlinkSync(this.progressedBufferTempFilePath);
                  if (error) {
                    reject(error);
                    return;
                  }
                  this.progressedBuffer = Buffer.from(data);
                  this.progressedBufferTempFilePath = undefined;
                  resolve(this);
                });
              }
              else {
                resolve(this);
              }
            });
            this.emitter.on("error", error => {
              reject(error);
            });
          });
        }
        /**
         * Generate temp file path
         *
         * @param {("raw" | "encoded")} type
         * @returns {string} Path
         */
        tempFilePathGenerator(type, progressType) {
          const prefix = `${__dirname}/../.`;
          let path = `${prefix}./temp/${type}/`;
          let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for (let i = 0; i < 32; i++) {
            path += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          if (type == "raw" && progressType == "decode") {
            path += `.mp3`;
          }
          if (!fs_1.existsSync(`${prefix}./temp/${path}`)) {
            return path;
          }
          else {
            return this.tempFilePathGenerator(type, progressType);
          }
        }
        /**
         * Remove temp files, if error occurred
         */
        removeTempFilesOnError() {
          if (this.fileBufferTempFilePath != undefined) {
            fs_1.unlinkSync(this.fileBufferTempFilePath);
          }
          if (this.progressedBufferTempFilePath != undefined) {
            fs_1.unlinkSync(this.progressedBufferTempFilePath);
          }
        }
      }
      exports.Lame = Lame;

    }).call(this, require("buffer").Buffer, "/../../node-lame/lib/build")
  }, { "./LameOptions": 29, "buffer": 7, "child_process": 1, "events": 8, "fs": 1, "util": 14 }], 29: [function (require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * All options of node-lame; build argument array for binary
     *
     * @class LameOptions
     */
    class LameOptions {
      /**
       * Validate all options and build argument array for binary
       * @param {Object} options
       */
      constructor(options) {
        this.args = [];
        // Output is required
        if (options["output"] == undefined) {
          throw new Error("lame: Invalid option: 'output' is required");
        }
        // Save options as arguments
        for (const key in options) {
          const value = options[key];
          let arg;
          switch (key) {
            case "output":
              arg = this.output(value);
              break;
            case "raw":
              arg = this.raw(value);
              break;
            case "swap-bytes":
              arg = this.swapBytes(value);
              break;
            case "sfreq":
              arg = this.sfreq(value);
              break;
            case "bitwidth":
              arg = this.bitwidth(value);
              break;
            case "signed":
              arg = this.signed(value);
              break;
            case "unsigned":
              arg = this.unsigned(value);
              break;
            case "little-endian":
              arg = this.littleEndian(value);
              break;
            case "big-endian":
              arg = this.bigEndian(value);
              break;
            case "mp2Input":
              arg = this.mp2Input(value);
              break;
            case "mp3Input":
              arg = this.mp3Input(value);
              break;
            case "mode":
              arg = this.mode(value);
              break;
            case "to-mono":
              arg = this.toMono(value);
              break;
            case "channel-different-block-sizes":
              arg = this.channelDifferentBlockSize(value);
              break;
            case "freeformat":
              arg = this.freeformat(value);
              break;
            case "disable-info-tag":
              arg = this.disableInfoTag(value);
              break;
            case "comp":
              arg = this.comp(value);
              break;
            case "scale":
              arg = this.scale(value);
              break;
            case "scale-l":
              arg = this.scaleL(value);
              break;
            case "scale-r":
              arg = this.scaleR(value);
              break;
            case "replaygain-fast":
              arg = this.replaygainFast(value);
              break;
            case "replaygain-accurate":
              arg = this.replaygainAccurate(value);
              break;
            case "no-replaygain":
              arg = this.noreplaygain(value);
              break;
            case "clip-detect":
              arg = this.clipDetect(value);
              break;
            case "preset":
              arg = this.preset(value);
              break;
            case "noasm":
              arg = this.noasm(value);
              break;
            case "quality":
              arg = this.quality(value);
              break;
            case "bitrate":
              arg = this.bitrate(value);
              break;
            case "force-bitrate":
              arg = this.forceBitrate(value);
              break;
            case "cbr":
              arg = this.cbr(value);
              break;
            case "abr":
              arg = this.abr(value);
              break;
            case "vbr":
              arg = this.vbr(value);
              break;
            case "vbr-quality":
              arg = this.vbrQuality(value);
              break;
            case "ignore-noise-in-sfb21":
              arg = this.ignoreNoiseInSfb21(value);
              break;
            case "emp":
              arg = this.emp(value);
              break;
            case "mark-as-copyrighted":
              arg = this.markAsCopyrighted(value);
              break;
            case "mark-as-copy":
              arg = this.markAsCopy(value);
              break;
            case "crc-error-protection":
              arg = this.crcErrorProtection(value);
              break;
            case "nores":
              arg = this.nores(value);
              break;
            case "strictly-enforce-ISO":
              arg = this.strictlyEnforceIso(value);
              break;
            case "lowpass":
              arg = this.lowpass(value);
              break;
            case "lowpass-width":
              arg = this.lowpassWidth(value);
              break;
            case "highpass":
              arg = this.highpass(value);
              break;
            case "highpass-width":
              arg = this.highpassWidth(value);
              break;
            case "resample":
              arg = this.resample(value);
              break;
            case "meta":
              arg = this.meta(value);
              break;
            default:
              throw new Error("Unknown parameter " + key);
          }
          if (arg != undefined) {
            for (const i in arg) {
              this.args.push(arg[i]);
            }
          }
        }
      }
      /**
       * Get all arguments for binary
       */
      getArguments() {
        return this.args;
      }
      output(value) {
        return undefined; // Handled in Lame class, because of fixed position (2nd parameter)
      }
      raw(value) {
        if (value == true) {
          return [`-r`];
        }
        else {
          return undefined;
        }
      }
      swapBytes(value) {
        if (value == true) {
          return [`-x`];
        }
        else {
          return undefined;
        }
      }
      sfreq(value) {
        if (value == 8 ||
          value == 11.025 ||
          value == 12 ||
          value == 16 ||
          value == 22.05 ||
          value == 24 ||
          value == 32 ||
          value == 44.1 ||
          value == 48) {
          return [`-s`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'sfreq' is not in range of 8, 11.025, 12, 16, 22.05, 24, 32, 44.1 or 48.");
        }
      }
      bitwidth(value) {
        if (value == 8 || value == 16 || value == 24 || value == 32) {
          return [`--bitwidth`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'sfreq' is not in range of 8, 16, 24 or 32.");
        }
      }
      signed(value) {
        if (value == true) {
          return [`--signed`];
        }
        else {
          return undefined;
        }
      }
      unsigned(value) {
        if (value == true) {
          return [`--unsigned`];
        }
        else {
          return undefined;
        }
      }
      littleEndian(value) {
        if (value == true) {
          return [`--little-endian`];
        }
        else {
          return undefined;
        }
      }
      bigEndian(value) {
        if (value == true) {
          return [`--big-endian`];
        }
        else {
          return undefined;
        }
      }
      mp2Input(value) {
        if (value == true) {
          return [`--mp2input`];
        }
        else {
          return undefined;
        }
      }
      mp3Input(value) {
        if (value == true) {
          return [`--mp3input`];
        }
        else {
          return undefined;
        }
      }
      mode(value) {
        if (value == "s" ||
          value == "j" ||
          value == "f" ||
          value == "d" ||
          value == "m" ||
          value == "l" ||
          value == "r") {
          return [`-m`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'mode' is not in range of 's', 'j', 'f', 'd', 'm', 'l' or 'r'.");
        }
      }
      toMono(value) {
        if (value == true) {
          return [`-a`];
        }
        else {
          return undefined;
        }
      }
      channelDifferentBlockSize(value) {
        if (value == true) {
          return [`-d`];
        }
        else {
          return undefined;
        }
      }
      freeformat(value) {
        if (value == "FreeAmp" ||
          value == "in_mpg123" ||
          value == "l3dec" ||
          value == "LAME" ||
          value == "MAD") {
          return [`--freeformat`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'mode' is not in range of 'FreeAmp', 'in_mpg123', 'l3dec', 'LAME', 'MAD'.");
        }
      }
      disableInfoTag(value) {
        if (value == true) {
          return [`-t`];
        }
        else {
          return undefined;
        }
      }
      comp(value) {
        return [`--comp`, value];
      }
      scale(value) {
        return [`--scale`, value];
      }
      scaleL(value) {
        return [`--scale-l`, value];
      }
      scaleR(value) {
        return [`--scale-r`, value];
      }
      replaygainFast(value) {
        if (value == true) {
          return [`--replaygain-fast`];
        }
        else {
          return undefined;
        }
      }
      replaygainAccurate(value) {
        if (value == true) {
          return [`--replaygain-accurate`];
        }
        else {
          return undefined;
        }
      }
      noreplaygain(value) {
        if (value == true) {
          return [`--noreplaygain`];
        }
        else {
          return undefined;
        }
      }
      clipDetect(value) {
        if (value == true) {
          return [`--clipdetect`];
        }
        else {
          return undefined;
        }
      }
      preset(value) {
        if (value == "medium" ||
          value == "standard" ||
          value == "extreme" ||
          value == "insane") {
          return [`--preset`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'mode' is not in range of 'medium', 'standard', 'extreme' or 'insane'.");
        }
      }
      noasm(value) {
        if (value == "mmx" || value == "3dnow" || value == "sse") {
          return [`--noasm`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'noasm' is not in range of 'mmx', '3dnow' or 'sse'.");
        }
      }
      quality(value) {
        if (value >= 0 && value <= 9) {
          return [`-q`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'quality' is not in range of 0 to 9.");
        }
      }
      bitrate(value) {
        if (value == 8 ||
          value == 16 ||
          value == 24 ||
          value == 32 ||
          value == 40 ||
          value == 48 ||
          value == 56 ||
          value == 64 ||
          value == 80 ||
          value == 96 ||
          value == 112 ||
          value == 128 ||
          value == 144 ||
          value == 160 ||
          value == 192 ||
          value == 224 ||
          value == 256 ||
          value == 320) {
          return [`-b`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'bitrate' is not in range of 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 192, 224, 256 or 320.");
        }
      }
      forceBitrate(value) {
        if (value == true) {
          return [`-F`];
        }
        else {
          return undefined;
        }
      }
      cbr(value) {
        if (value == true) {
          return [`--cbr`];
        }
        else {
          return undefined;
        }
      }
      abr(value) {
        if (value >= 8 && value <= 310) {
          return [`--abr`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'abr' is not in range of 8 to 310.");
        }
      }
      vbr(value) {
        if (value == true) {
          return [`-v`];
        }
        else {
          return undefined;
        }
      }
      vbrQuality(value) {
        if (value >= 0 && value <= 9) {
          return [`-V`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'vbrQuality' is not in range of 0 to 9.");
        }
      }
      ignoreNoiseInSfb21(value) {
        if (value == true) {
          return [`-Y`];
        }
        else {
          return undefined;
        }
      }
      emp(value) {
        if (value == "n" || value == 5 || value == "c") {
          return [`-e`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'emp' is not in range of 'n', 5 or 'c'.");
        }
      }
      markAsCopyrighted(value) {
        if (value == true) {
          return [`-c`];
        }
        else {
          return undefined;
        }
      }
      markAsCopy(value) {
        if (value == true) {
          return [`-o`];
        }
        else {
          return undefined;
        }
      }
      crcErrorProtection(value) {
        if (value == true) {
          return [`-p`];
        }
        else {
          return undefined;
        }
      }
      nores(value) {
        if (value == true) {
          return [`--nores`];
        }
        else {
          return undefined;
        }
      }
      strictlyEnforceIso(value) {
        if (value == true) {
          return [`--strictly-enforce-ISO`];
        }
        else {
          return undefined;
        }
      }
      lowpass(value) {
        return [`--lowpass`, value];
      }
      lowpassWidth(value) {
        return [`--lowpass-width`, value];
      }
      highpass(value) {
        return [`--highpass`, value];
      }
      highpassWidth(value) {
        return [`--highpass-width`, value];
      }
      resample(value) {
        if (value == 8 ||
          value == 11.025 ||
          value == 12 ||
          value == 16 ||
          value == 22.05 ||
          value == 24 ||
          value == 32 ||
          value == 44.1 ||
          value == 48) {
          return [`--resample`, value];
        }
        else {
          throw new Error("lame: Invalid option: 'resample' is not in range of 8, 11.025, 12, 16, 22.05, 24, 32, 44.1 or 48.");
        }
      }
      meta(metaObj) {
        for (const key in metaObj) {
          const value = metaObj[key];
          if (key == "title" ||
            key == "artist" ||
            key == "album" ||
            key == "year" ||
            key == "comment" ||
            key == "track" ||
            key == "genre" ||
            key == "artwork" ||
            key == "genre-list" ||
            key == "pad-id3v2-size") {
            let arg0;
            if (key == "title") {
              arg0 = `--tt`;
            }
            else if (key == "artist") {
              arg0 = `--ta`;
            }
            else if (key == "album") {
              arg0 = `--tl`;
            }
            else if (key == "year") {
              arg0 = `--ty`;
            }
            else if (key == "comment") {
              arg0 = `--tc`;
            }
            else if (key == "track") {
              arg0 = `--tn`;
            }
            else if (key == "genre") {
              arg0 = `--tg`;
            }
            else if (key == "artwork") {
              arg0 = `--ti`;
            }
            else if (key == "genre-list") {
              arg0 = `--genre-list`;
            }
            else if (key == "pad-id3v2-size") {
              arg0 = `--pad-id3v2-size`;
            }
            else {
              throw new Error(`lame: Invalid option: 'meta' unknown property '${key}'`);
            }
            const arg1 = `${value}`;
            this.args.push(arg0);
            this.args.push(arg1);
          }
          else if (key == "add-id3v2" ||
            key == "id3v1-only" ||
            key == "id3v2-only" ||
            key == "id3v2-latin1" ||
            key == "id3v2-utf16" ||
            key == "space-id3v1" ||
            key == "pad-id3v2" ||
            key == "ignore-tag-errors") {
            this.args.push(`--${key}`);
          }
          else {
            throw new Error(`lame: Invalid option: 'meta' unknown property '${key}'`);
          }
        }
        return undefined;
      }
    }
    exports.LameOptions = LameOptions;

  }, {}], 30: [function (require, module, exports) {
    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */

    'use strict';
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
      if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
      }

      return Object(val);
    }

    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }

        // Detect buggy property enumeration order in older V8 versions.

        // https://bugs.chromium.org/p/v8/issues/detail?id=4118
        var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
        test1[5] = 'de';
        if (Object.getOwnPropertyNames(test1)[0] === '5') {
          return false;
        }

        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2['_' + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
          return test2[n];
        });
        if (order2.join('') !== '0123456789') {
          return false;
        }

        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test3 = {};
        'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join('') !==
          'abcdefghijklmnopqrst') {
          return false;
        }

        return true;
      } catch (err) {
        // We don't expect any of the above to throw, but better to be safe.
        return false;
      }
    }

    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
      var from;
      var to = toObject(target);
      var symbols;

      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }

        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }

      return to;
    };

  }, {}], 31: [function (require, module, exports) {
    /**
     * @module pcm-convert
     */
    'use strict'

    var assert = require('assert')
    var isBuffer = require('is-buffer')
    var format = require('audio-format')
    var extend = require('object-assign')
    var isAudioBuffer = require('is-audio-buffer')

    module.exports = convert

    function convert(buffer, from, to, target) {
      assert(buffer, 'First argument should be data')
      assert(from, 'Second argument should be format string or object')

      //quick ignore
      if (from === to) {
        return buffer
      }

      //2-containers case
      if (isContainer(from)) {
        target = from
        to = format.detect(target)
        from = format.detect(buffer)
      }
      //if no source format defined, just target format
      else if (to === undefined && target === undefined) {
        to = getFormat(from)
        from = format.detect(buffer)
      }
      //if no source format but container is passed with from as target format
      else if (isContainer(to)) {
        target = to
        to = getFormat(from)
        from = format.detect(buffer)
      }
      //all arguments
      else {
        var inFormat = getFormat(from)
        var srcFormat = format.detect(buffer)
        srcFormat.dtype = inFormat.type === 'arraybuffer' ? srcFormat.type : inFormat.type
        from = extend(inFormat, srcFormat)

        var outFormat = getFormat(to)
        var dstFormat = format.detect(target)
        if (outFormat.type) {
          dstFormat.dtype = outFormat.type === 'arraybuffer' ? (dstFormat.type || from.dtype) : outFormat.type
        }
        to = extend(outFormat, dstFormat)
      }

      if (to.channels == null && from.channels != null) {
        to.channels = from.channels
      }

      if (to.type == null) {
        to.type = from.type
        to.dtype = from.dtype
      }

      if (to.interleaved != null && from.channels == null) {
        from.channels = 2
      }

      //ignore same format
      if (from.type === to.type &&
        from.interleaved === to.interleaved &&
        from.endianness === to.endianness) return buffer

      normalize(from)
      normalize(to)

      //audio-buffer-list/audio types
      if (buffer.buffers || (buffer.buffer && buffer.buffer.buffers)) {
        //handle audio
        if (buffer.buffer) buffer = buffer.buffer

        //handle audiobufferlist
        if (buffer.buffers) buffer = buffer.join()
      }

      var src
      //convert buffer/alike to arrayBuffer
      if (isAudioBuffer(buffer)) {
        if (buffer._data) src = buffer._data
        else {
          src = new Float32Array(buffer.length * buffer.numberOfChannels)
          for (var c = 0, l = buffer.numberOfChannels; c < l; c++) {
            src.set(buffer.getChannelData(c), buffer.length * c)
          }
        }
      }
      else if (buffer instanceof ArrayBuffer) {
        src = new (dtypeClass[from.dtype])(buffer)
      }
      else if (isBuffer(buffer)) {
        if (buffer.byteOffset != null) src = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        else src = buffer.buffer;

        src = new (dtypeClass[from.dtype])(src)
      }
      //typed arrays are unchanged as is
      else {
        src = buffer
      }

      //dst is automatically filled with mapped values
      //but in some cases mapped badly, e. g. float → int(round + rotate)
      var dst = to.type === 'array' ? Array.from(src) : new (dtypeClass[to.dtype])(src)

      //if range differ, we should apply more thoughtful mapping
      if (from.max !== to.max) {
        var fromRange = from.max - from.min, toRange = to.max - to.min
        for (var i = 0, l = src.length; i < l; i++) {
          var value = src[i]

          //ignore not changed range
          //bring to 0..1
          var normalValue = (value - from.min) / fromRange

          //bring to new format ranges
          value = normalValue * toRange + to.min

          //clamp (buffers do not like values outside of bounds)
          dst[i] = Math.max(to.min, Math.min(to.max, value))
        }
      }

      //reinterleave, if required
      if (from.interleaved != to.interleaved) {
        var channels = from.channels
        var len = Math.floor(src.length / channels)

        //deinterleave
        if (from.interleaved && !to.interleaved) {
          dst = dst.map(function (value, idx, data) {
            var offset = idx % len
            var channel = ~~(idx / len)

            return data[offset * channels + channel]
          })
        }
        //interleave
        else if (!from.interleaved && to.interleaved) {
          dst = dst.map(function (value, idx, data) {
            var offset = ~~(idx / channels)
            var channel = idx % channels

            return data[channel * len + offset]
          })
        }
      }

      //ensure endianness
      if (to.dtype != 'array' && to.dtype != 'int8' && to.dtype != 'uint8' && from.endianness && to.endianness && from.endianness !== to.endianness) {
        var le = to.endianness === 'le'
        var view = new DataView(dst.buffer)
        var step = dst.BYTES_PER_ELEMENT
        var methodName = 'set' + to.dtype[0].toUpperCase() + to.dtype.slice(1)
        for (var i = 0, l = dst.length; i < l; i++) {
          view[methodName](i * step, dst[i], le)
        }
      }

      if (to.type === 'audiobuffer') {
        //TODO
      }


      if (target) {
        if (Array.isArray(target)) {
          for (var i = 0; i < dst.length; i++) {
            target[i] = dst[i]
          }
        }
        else if (target instanceof ArrayBuffer) {
          var
            targetContainer = new dtypeClass[to.dtype](target)
          targetContainer.set(dst)
          target = targetContainer
        }
        else {
          target.set(dst)
        }
        dst = target
      }

      if (to.type === 'arraybuffer' || to.type === 'buffer') dst = dst.buffer

      return dst
    }

    function getFormat(arg) {
      return typeof arg === 'string' ? format.parse(arg) : format.detect(arg)
    }

    function isContainer(arg) {
      return typeof arg != 'string' && (Array.isArray(arg) || ArrayBuffer.isView(arg) || arg instanceof ArrayBuffer)
    }


    var dtypeClass = {
      'uint8': Uint8Array,
      'uint8_clamped': Uint8ClampedArray,
      'uint16': Uint16Array,
      'uint32': Uint32Array,
      'int8': Int8Array,
      'int16': Int16Array,
      'int32': Int32Array,
      'float32': Float32Array,
      'float64': Float64Array,
      'array': Array,
      'arraybuffer': Uint8Array,
      'buffer': Uint8Array,
    }

    var defaultDtype = {
      'float32': 'float32',
      'audiobuffer': 'float32',
      'ndsamples': 'float32',
      'ndarray': 'float32',
      'float64': 'float64',
      'buffer': 'uint8',
      'arraybuffer': 'uint8',
      'uint8': 'uint8',
      'uint8_clamped': 'uint8',
      'uint16': 'uint16',
      'uint32': 'uint32',
      'int8': 'int8',
      'int16': 'int16',
      'int32': 'int32',
      'array': 'array'
    }

    //make sure all format properties are present
    function normalize(obj) {
      if (!obj.dtype) {
        obj.dtype = defaultDtype[obj.type] || 'array'
      }

      //provide limits
      switch (obj.dtype) {
        case 'float32':
        case 'float64':
        case 'audiobuffer':
        case 'ndsamples':
        case 'ndarray':
          obj.min = -1
          obj.max = 1
          break;
        case 'uint8':
          obj.min = 0
          obj.max = 255
          break;
        case 'uint16':
          obj.min = 0
          obj.max = 65535
          break;
        case 'uint32':
          obj.min = 0
          obj.max = 4294967295
          break;
        case 'int8':
          obj.min = -128
          obj.max = 127
          break;
        case 'int16':
          obj.min = -32768
          obj.max = 32767
          break;
        case 'int32':
          obj.min = -2147483648
          obj.max = 2147483647
          break;
        default:
          obj.min = -1
          obj.max = 1
          break;
      }

      return obj
    }

  }, { "assert": 2, "audio-format": 15, "is-audio-buffer": 25, "is-buffer": 26, "object-assign": 30 }], 32: [function (require, module, exports) {
    'use strict'


    module.exports = function pick(src, props, keepRest) {
      var result = {}, prop, i

      if (typeof props === 'string') props = toList(props)
      if (Array.isArray(props)) {
        var res = {}
        for (i = 0; i < props.length; i++) {
          res[props[i]] = true
        }
        props = res
      }

      // convert strings to lists
      for (prop in props) {
        props[prop] = toList(props[prop])
      }

      // keep-rest strategy requires unmatched props to be preserved
      var occupied = {}

      for (prop in props) {
        var aliases = props[prop]

        if (Array.isArray(aliases)) {
          for (i = 0; i < aliases.length; i++) {
            var alias = aliases[i]

            if (keepRest) {
              occupied[alias] = true
            }

            if (alias in src) {
              result[prop] = src[alias]

              if (keepRest) {
                for (var j = i; j < aliases.length; j++) {
                  occupied[aliases[j]] = true
                }
              }

              break
            }
          }
        }
        else if (prop in src) {
          if (props[prop]) {
            result[prop] = src[prop]
          }

          if (keepRest) {
            occupied[prop] = true
          }
        }
      }

      if (keepRest) {
        for (prop in src) {
          if (occupied[prop]) continue
          result[prop] = src[prop]
        }
      }

      return result
    }

    var CACHE = {}

    function toList(arg) {
      if (CACHE[arg]) return CACHE[arg]
      if (typeof arg === 'string') {
        arg = CACHE[arg] = arg.split(/\s*,\s*|\s+/)
      }
      return arg
    }

  }, {}], 33: [function (require, module, exports) {
    module.exports = {
      "8000": 8000,
      "11025": 11025,
      "16000": 16000,
      "22050": 22050,
      "44100": 44100,
      "48000": 48000,
      "88200": 88200,
      "96000": 96000,
      "176400": 176400,
      "192000": 192000,
      "352800": 352800,
      "384000": 384000
    }

  }, {}]
}, {}, [18]);
