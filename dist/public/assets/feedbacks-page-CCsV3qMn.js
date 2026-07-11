import { d as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, B as Button, L as LoaderCircle, C as Check, q as queryClient } from "./index-CaQft13l.js";
import { I as Input } from "./input-DHr73fjq.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-Clim15nr.js";
import { U as Upload } from "./upload-fPSzLkbY.js";
import { I as Info } from "./info-DkTMoqBp.js";
import { R as RefreshCw } from "./refresh-cw-B92eFw-E.js";
import { T as Trash2 } from "./trash-2-CKbwdMFf.js";
var runtime = { exports: {} };
var hasRequiredRuntime;
function requireRuntime() {
  if (hasRequiredRuntime) return runtime.exports;
  hasRequiredRuntime = 1;
  (function(module) {
    var runtime2 = (function(exports$1) {
      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var defineProperty = Object.defineProperty || function(obj, key, desc) {
        obj[key] = desc.value;
      };
      var undefined$1;
      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }
      try {
        define({}, "");
      } catch (err) {
        define = function(obj, key, value) {
          return obj[key] = value;
        };
      }
      function wrap(innerFn, outerFn, self, tryLocsList) {
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []);
        defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });
        return generator;
      }
      exports$1.wrap = wrap;
      function tryCatch(fn, obj, arg) {
        try {
          return { type: "normal", arg: fn.call(obj, arg) };
        } catch (err) {
          return { type: "throw", arg: err };
        }
      }
      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed";
      var ContinueSentinel = {};
      function Generator() {
      }
      function GeneratorFunction() {
      }
      function GeneratorFunctionPrototype() {
      }
      var IteratorPrototype = {};
      define(IteratorPrototype, iteratorSymbol, function() {
        return this;
      });
      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        IteratorPrototype = NativeIteratorPrototype;
      }
      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = GeneratorFunctionPrototype;
      defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
      defineProperty(
        GeneratorFunctionPrototype,
        "constructor",
        { value: GeneratorFunction, configurable: true }
      );
      GeneratorFunction.displayName = define(
        GeneratorFunctionPrototype,
        toStringTagSymbol,
        "GeneratorFunction"
      );
      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function(method) {
          define(prototype, method, function(arg) {
            return this._invoke(method, arg);
          });
        });
      }
      exports$1.isGeneratorFunction = function(genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };
      exports$1.mark = function(genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }
        genFun.prototype = Object.create(Gp);
        return genFun;
      };
      exports$1.awrap = function(arg) {
        return { __await: arg };
      };
      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);
          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;
            if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function(value2) {
                invoke("next", value2, resolve, reject);
              }, function(err) {
                invoke("throw", err, resolve, reject);
              });
            }
            return PromiseImpl.resolve(value).then(function(unwrapped) {
              result.value = unwrapped;
              resolve(result);
            }, function(error) {
              return invoke("throw", error, resolve, reject);
            });
          }
        }
        var previousPromise;
        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function(resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
        }
        defineProperty(this, "_invoke", { value: enqueue });
      }
      defineIteratorMethods(AsyncIterator.prototype);
      define(AsyncIterator.prototype, asyncIteratorSymbol, function() {
        return this;
      });
      exports$1.AsyncIterator = AsyncIterator;
      exports$1.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        );
        return exports$1.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
      };
      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }
          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            }
            return doneResult();
          }
          context.method = method;
          context.arg = arg;
          while (true) {
            var delegate = context.delegate;
            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);
              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }
            if (context.method === "next") {
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }
              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }
            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);
            if (record.type === "normal") {
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;
              if (record.arg === ContinueSentinel) {
                continue;
              }
              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted;
              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      }
      function maybeInvokeDelegate(delegate, context) {
        var methodName = context.method;
        var method = delegate.iterator[methodName];
        if (method === undefined$1) {
          context.delegate = null;
          if (methodName === "throw" && delegate.iterator["return"]) {
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);
            if (context.method === "throw") {
              return ContinueSentinel;
            }
          }
          if (methodName !== "return") {
            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a '" + methodName + "' method"
            );
          }
          return ContinueSentinel;
        }
        var record = tryCatch(method, delegate.iterator, context.arg);
        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }
        var info = record.arg;
        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }
        if (info.done) {
          context[delegate.resultName] = info.value;
          context.next = delegate.nextLoc;
          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          return info;
        }
        context.delegate = null;
        return ContinueSentinel;
      }
      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator");
      define(Gp, iteratorSymbol, function() {
        return this;
      });
      define(Gp, "toString", function() {
        return "[object Generator]";
      });
      function pushTryEntry(locs) {
        var entry = { tryLoc: locs[0] };
        if (1 in locs) {
          entry.catchLoc = locs[1];
        }
        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }
        this.tryEntries.push(entry);
      }
      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }
      function Context(tryLocsList) {
        this.tryEntries = [{ tryLoc: "root" }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }
      exports$1.keys = function(val) {
        var object = Object(val);
        var keys = [];
        for (var key in object) {
          keys.push(key);
        }
        keys.reverse();
        return function next() {
          while (keys.length) {
            var key2 = keys.pop();
            if (key2 in object) {
              next.value = key2;
              next.done = false;
              return next;
            }
          }
          next.done = true;
          return next;
        };
      };
      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];
          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }
          if (typeof iterable.next === "function") {
            return iterable;
          }
          if (!isNaN(iterable.length)) {
            var i = -1, next = function next2() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next2.value = iterable[i];
                  next2.done = false;
                  return next2;
                }
              }
              next2.value = undefined$1;
              next2.done = true;
              return next2;
            };
            return next.next = next;
          }
        }
        return { next: doneResult };
      }
      exports$1.values = values;
      function doneResult() {
        return { value: undefined$1, done: true };
      }
      Context.prototype = {
        constructor: Context,
        reset: function(skipTempReset) {
          this.prev = 0;
          this.next = 0;
          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);
          if (!skipTempReset) {
            for (var name in this) {
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;
          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }
          return this.rval;
        },
        dispatchException: function(exception) {
          if (this.done) {
            throw exception;
          }
          var context = this;
          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;
            if (caught) {
              context.method = "next";
              context.arg = undefined$1;
            }
            return !!caught;
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;
            if (entry.tryLoc === "root") {
              return handle("end");
            }
            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");
              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }
          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            finallyEntry = null;
          }
          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;
          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }
          return this.complete(record);
        },
        complete: function(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }
          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }
          return ContinueSentinel;
        },
        finish: function(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;
              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }
              return thrown;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName,
            nextLoc
          };
          if (this.method === "next") {
            this.arg = undefined$1;
          }
          return ContinueSentinel;
        }
      };
      return exports$1;
    })(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      module.exports
    );
    try {
      regeneratorRuntime = runtime2;
    } catch (accidentalStrictMode) {
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime2;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime2);
      }
    }
  })(runtime);
  return runtime.exports;
}
var getId;
var hasRequiredGetId;
function requireGetId() {
  if (hasRequiredGetId) return getId;
  hasRequiredGetId = 1;
  getId = (prefix, cnt) => `${prefix}-${cnt}-${Math.random().toString(16).slice(3, 8)}`;
  return getId;
}
var createJob;
var hasRequiredCreateJob;
function requireCreateJob() {
  if (hasRequiredCreateJob) return createJob;
  hasRequiredCreateJob = 1;
  const getId2 = requireGetId();
  let jobCounter = 0;
  createJob = ({
    id: _id,
    action,
    payload = {}
  }) => {
    let id = _id;
    if (typeof id === "undefined") {
      id = getId2("Job", jobCounter);
      jobCounter += 1;
    }
    return {
      id,
      action,
      payload
    };
  };
  return createJob;
}
var log = {};
var hasRequiredLog;
function requireLog() {
  if (hasRequiredLog) return log;
  hasRequiredLog = 1;
  let logging = false;
  log.logging = logging;
  log.setLogging = (_logging) => {
    logging = _logging;
  };
  log.log = (...args) => logging ? console.log.apply(this, args) : null;
  return log;
}
var createScheduler;
var hasRequiredCreateScheduler;
function requireCreateScheduler() {
  if (hasRequiredCreateScheduler) return createScheduler;
  hasRequiredCreateScheduler = 1;
  const createJob2 = requireCreateJob();
  const { log: log2 } = requireLog();
  const getId2 = requireGetId();
  let schedulerCounter = 0;
  createScheduler = () => {
    const id = getId2("Scheduler", schedulerCounter);
    const workers = {};
    const runningWorkers = {};
    let jobQueue = [];
    schedulerCounter += 1;
    const getQueueLen = () => jobQueue.length;
    const getNumWorkers = () => Object.keys(workers).length;
    const dequeue = () => {
      if (jobQueue.length !== 0) {
        const wIds = Object.keys(workers);
        for (let i = 0; i < wIds.length; i += 1) {
          if (typeof runningWorkers[wIds[i]] === "undefined") {
            jobQueue[0](workers[wIds[i]]);
            break;
          }
        }
      }
    };
    const queue = (action, payload) => new Promise((resolve, reject) => {
      const job = createJob2({ action, payload });
      jobQueue.push(async (w) => {
        jobQueue.shift();
        runningWorkers[w.id] = job;
        try {
          resolve(await w[action].apply(this, [...payload, job.id]));
        } catch (err) {
          reject(err);
        } finally {
          delete runningWorkers[w.id];
          dequeue();
        }
      });
      log2(`[${id}]: Add ${job.id} to JobQueue`);
      log2(`[${id}]: JobQueue length=${jobQueue.length}`);
      dequeue();
    });
    const addWorker = (w) => {
      workers[w.id] = w;
      log2(`[${id}]: Add ${w.id}`);
      log2(`[${id}]: Number of workers=${getNumWorkers()}`);
      dequeue();
      return w.id;
    };
    const addJob = async (action, ...payload) => {
      if (getNumWorkers() === 0) {
        throw Error(`[${id}]: You need to have at least one worker before adding jobs`);
      }
      return queue(action, payload);
    };
    const terminate = async () => {
      Object.keys(workers).forEach(async (wid) => {
        await workers[wid].terminate();
      });
      jobQueue = [];
    };
    return {
      addWorker,
      addJob,
      terminate,
      getQueueLen,
      getNumWorkers
    };
  };
  return createScheduler;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var getEnvironment;
var hasRequiredGetEnvironment;
function requireGetEnvironment() {
  if (hasRequiredGetEnvironment) return getEnvironment;
  hasRequiredGetEnvironment = 1;
  getEnvironment = (key) => {
    const env = {};
    if (typeof WorkerGlobalScope !== "undefined") {
      env.type = "webworker";
    } else if (typeof document === "object") {
      env.type = "browser";
    } else if (typeof process === "object" && typeof commonjsRequire === "function") {
      env.type = "node";
    }
    if (typeof key === "undefined") {
      return env;
    }
    return env[key];
  };
  return getEnvironment;
}
var resolvePaths;
var hasRequiredResolvePaths;
function requireResolvePaths() {
  if (hasRequiredResolvePaths) return resolvePaths;
  hasRequiredResolvePaths = 1;
  const isBrowser = requireGetEnvironment()("type") === "browser";
  const resolveURL = isBrowser ? (s) => new URL(s, window.location.href).href : (s) => s;
  resolvePaths = (options) => {
    const opts = { ...options };
    ["corePath", "workerPath", "langPath"].forEach((key) => {
      if (options[key]) {
        opts[key] = resolveURL(opts[key]);
      }
    });
    return opts;
  };
  return resolvePaths;
}
var OEM;
var hasRequiredOEM;
function requireOEM() {
  if (hasRequiredOEM) return OEM;
  hasRequiredOEM = 1;
  OEM = {
    TESSERACT_ONLY: 0,
    LSTM_ONLY: 1,
    TESSERACT_LSTM_COMBINED: 2,
    DEFAULT: 3
  };
  return OEM;
}
const version = "7.0.0";
const require$$0 = {
  version
};
var defaultOptions;
var hasRequiredDefaultOptions$1;
function requireDefaultOptions$1() {
  if (hasRequiredDefaultOptions$1) return defaultOptions;
  hasRequiredDefaultOptions$1 = 1;
  defaultOptions = {
    /*
     * Use BlobURL for worker script by default
     * TODO: remove this option
     *
     */
    workerBlobURL: true,
    logger: () => {
    }
  };
  return defaultOptions;
}
var defaultOptions_1;
var hasRequiredDefaultOptions;
function requireDefaultOptions() {
  if (hasRequiredDefaultOptions) return defaultOptions_1;
  hasRequiredDefaultOptions = 1;
  const version2 = require$$0.version;
  const defaultOptions2 = requireDefaultOptions$1();
  defaultOptions_1 = {
    ...defaultOptions2,
    workerPath: `https://cdn.jsdelivr.net/npm/tesseract.js@v${version2}/dist/worker.min.js`
  };
  return defaultOptions_1;
}
var spawnWorker;
var hasRequiredSpawnWorker;
function requireSpawnWorker() {
  if (hasRequiredSpawnWorker) return spawnWorker;
  hasRequiredSpawnWorker = 1;
  spawnWorker = ({ workerPath, workerBlobURL }) => {
    let worker;
    if (Blob && URL && workerBlobURL) {
      const blob = new Blob([`importScripts("${workerPath}");`], {
        type: "application/javascript"
      });
      worker = new Worker(URL.createObjectURL(blob));
    } else {
      worker = new Worker(workerPath);
    }
    return worker;
  };
  return spawnWorker;
}
var terminateWorker;
var hasRequiredTerminateWorker;
function requireTerminateWorker() {
  if (hasRequiredTerminateWorker) return terminateWorker;
  hasRequiredTerminateWorker = 1;
  terminateWorker = (worker) => {
    worker.terminate();
  };
  return terminateWorker;
}
var onMessage;
var hasRequiredOnMessage;
function requireOnMessage() {
  if (hasRequiredOnMessage) return onMessage;
  hasRequiredOnMessage = 1;
  onMessage = (worker, handler) => {
    worker.onmessage = ({ data }) => {
      handler(data);
    };
  };
  return onMessage;
}
var send;
var hasRequiredSend;
function requireSend() {
  if (hasRequiredSend) return send;
  hasRequiredSend = 1;
  send = async (worker, packet) => {
    worker.postMessage(packet);
  };
  return send;
}
var loadImage_1;
var hasRequiredLoadImage;
function requireLoadImage() {
  if (hasRequiredLoadImage) return loadImage_1;
  hasRequiredLoadImage = 1;
  const readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  });
  const loadImage = async (image) => {
    let data = image;
    if (typeof image === "undefined") {
      return "undefined";
    }
    if (typeof image === "string") {
      if (/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(image)) {
        data = atob(image.split(",")[1]).split("").map((c) => c.charCodeAt(0));
      } else {
        const resp = await fetch(image);
        data = await resp.arrayBuffer();
      }
    } else if (typeof HTMLElement !== "undefined" && image instanceof HTMLElement) {
      if (image.tagName === "IMG") {
        data = await loadImage(image.src);
      }
      if (image.tagName === "VIDEO") {
        data = await loadImage(image.poster);
      }
      if (image.tagName === "CANVAS") {
        await new Promise((resolve) => {
          image.toBlob(async (blob) => {
            data = await readFromBlobOrFile(blob);
            resolve();
          });
        });
      }
    } else if (typeof OffscreenCanvas !== "undefined" && image instanceof OffscreenCanvas) {
      const blob = await image.convertToBlob();
      data = await readFromBlobOrFile(blob);
    } else if (image instanceof File || image instanceof Blob) {
      data = await readFromBlobOrFile(image);
    }
    return new Uint8Array(data);
  };
  loadImage_1 = loadImage;
  return loadImage_1;
}
var browser;
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser;
  hasRequiredBrowser = 1;
  const defaultOptions2 = requireDefaultOptions();
  const spawnWorker2 = requireSpawnWorker();
  const terminateWorker2 = requireTerminateWorker();
  const onMessage2 = requireOnMessage();
  const send2 = requireSend();
  const loadImage = requireLoadImage();
  browser = {
    defaultOptions: defaultOptions2,
    spawnWorker: spawnWorker2,
    terminateWorker: terminateWorker2,
    onMessage: onMessage2,
    send: send2,
    loadImage
  };
  return browser;
}
var createWorker;
var hasRequiredCreateWorker;
function requireCreateWorker() {
  if (hasRequiredCreateWorker) return createWorker;
  hasRequiredCreateWorker = 1;
  const resolvePaths2 = requireResolvePaths();
  const createJob2 = requireCreateJob();
  const { log: log2 } = requireLog();
  const getId2 = requireGetId();
  const OEM2 = requireOEM();
  const {
    defaultOptions: defaultOptions2,
    spawnWorker: spawnWorker2,
    terminateWorker: terminateWorker2,
    onMessage: onMessage2,
    loadImage,
    send: send2
  } = requireBrowser();
  let workerCounter = 0;
  createWorker = async (langs = "eng", oem = OEM2.LSTM_ONLY, _options = {}, config = {}) => {
    const id = getId2("Worker", workerCounter);
    const {
      logger,
      errorHandler,
      ...options
    } = resolvePaths2({
      ...defaultOptions2,
      ..._options
    });
    const promises = {};
    const currentLangs = typeof langs === "string" ? langs.split("+") : langs;
    let currentOem = oem;
    let currentConfig = config;
    const lstmOnlyCore = [OEM2.DEFAULT, OEM2.LSTM_ONLY].includes(oem) && !options.legacyCore;
    let workerResReject;
    let workerResResolve;
    const workerRes = new Promise((resolve, reject) => {
      workerResResolve = resolve;
      workerResReject = reject;
    });
    const workerError = (event) => {
      workerResReject(event.message);
    };
    let worker = spawnWorker2(options);
    worker.onerror = workerError;
    workerCounter += 1;
    const startJob = ({ id: jobId, action, payload }) => new Promise((resolve, reject) => {
      log2(`[${id}]: Start ${jobId}, action=${action}`);
      const promiseId = `${action}-${jobId}`;
      promises[promiseId] = { resolve, reject };
      send2(worker, {
        workerId: id,
        jobId,
        action,
        payload
      });
    });
    const load = () => console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)");
    const loadInternal = (jobId) => startJob(createJob2({
      id: jobId,
      action: "load",
      payload: { options: { lstmOnly: lstmOnlyCore, corePath: options.corePath, logging: options.logging } }
    }));
    const writeText = (path, text, jobId) => startJob(createJob2({
      id: jobId,
      action: "FS",
      payload: { method: "writeFile", args: [path, text] }
    }));
    const readText = (path, jobId) => startJob(createJob2({
      id: jobId,
      action: "FS",
      payload: { method: "readFile", args: [path, { encoding: "utf8" }] }
    }));
    const removeFile = (path, jobId) => startJob(createJob2({
      id: jobId,
      action: "FS",
      payload: { method: "unlink", args: [path] }
    }));
    const FS = (method, args, jobId) => startJob(createJob2({
      id: jobId,
      action: "FS",
      payload: { method, args }
    }));
    const loadLanguageInternal = (_langs, jobId) => startJob(createJob2({
      id: jobId,
      action: "loadLanguage",
      payload: {
        langs: _langs,
        options: {
          langPath: options.langPath,
          dataPath: options.dataPath,
          cachePath: options.cachePath,
          cacheMethod: options.cacheMethod,
          gzip: options.gzip,
          lstmOnly: [OEM2.DEFAULT, OEM2.LSTM_ONLY].includes(currentOem) && !options.legacyLang
        }
      }
    }));
    const initializeInternal = (_langs, _oem, _config, jobId) => startJob(createJob2({
      id: jobId,
      action: "initialize",
      payload: { langs: _langs, oem: _oem, config: _config }
    }));
    const reinitialize = (langs2 = "eng", oem2, config2, jobId) => {
      if (lstmOnlyCore && [OEM2.TESSERACT_ONLY, OEM2.TESSERACT_LSTM_COMBINED].includes(oem2)) throw Error("Legacy model requested but code missing.");
      const _oem = oem2 || currentOem;
      currentOem = _oem;
      const _config = config2 || currentConfig;
      currentConfig = _config;
      const langsArr = typeof langs2 === "string" ? langs2.split("+") : langs2;
      const _langs = langsArr.filter((x) => !currentLangs.includes(x));
      currentLangs.push(..._langs);
      if (_langs.length > 0) {
        return loadLanguageInternal(_langs, jobId).then(() => initializeInternal(langs2, _oem, _config, jobId));
      }
      return initializeInternal(langs2, _oem, _config, jobId);
    };
    const setParameters = (params = {}, jobId) => startJob(createJob2({
      id: jobId,
      action: "setParameters",
      payload: { params }
    }));
    const recognize = async (image, opts = {}, output = {
      text: true
    }, jobId) => startJob(createJob2({
      id: jobId,
      action: "recognize",
      payload: { image: await loadImage(image), options: opts, output }
    }));
    const detect = async (image, jobId) => {
      if (lstmOnlyCore) throw Error("`worker.detect` requires Legacy model, which was not loaded.");
      return startJob(createJob2({
        id: jobId,
        action: "detect",
        payload: { image: await loadImage(image) }
      }));
    };
    const terminate = async () => {
      if (worker !== null) {
        terminateWorker2(worker);
        worker = null;
      }
      return Promise.resolve();
    };
    onMessage2(worker, ({
      workerId,
      jobId,
      status,
      action,
      data
    }) => {
      const promiseId = `${action}-${jobId}`;
      if (status === "resolve") {
        log2(`[${workerId}]: Complete ${jobId}`);
        promises[promiseId].resolve({ jobId, data });
        delete promises[promiseId];
      } else if (status === "reject") {
        promises[promiseId].reject(data);
        delete promises[promiseId];
        if (action === "load") workerResReject(data);
        if (errorHandler) {
          errorHandler(data);
        } else {
          throw Error(data);
        }
      } else if (status === "progress") {
        logger({ ...data, userJobId: jobId });
      }
    });
    const resolveObj = {
      id,
      worker,
      load,
      writeText,
      readText,
      removeFile,
      FS,
      reinitialize,
      setParameters,
      recognize,
      detect,
      terminate
    };
    loadInternal().then(() => loadLanguageInternal(langs)).then(() => initializeInternal(langs, oem, config)).then(() => workerResResolve(resolveObj)).catch(() => {
    });
    return workerRes;
  };
  return createWorker;
}
var Tesseract;
var hasRequiredTesseract;
function requireTesseract() {
  if (hasRequiredTesseract) return Tesseract;
  hasRequiredTesseract = 1;
  const createWorker2 = requireCreateWorker();
  const recognize = async (image, langs, options) => {
    const worker = await createWorker2(langs, 1, options);
    return worker.recognize(image).finally(async () => {
      await worker.terminate();
    });
  };
  const detect = async (image, options) => {
    const worker = await createWorker2("osd", 0, options);
    return worker.detect(image).finally(async () => {
      await worker.terminate();
    });
  };
  Tesseract = {
    recognize,
    detect
  };
  return Tesseract;
}
var languages;
var hasRequiredLanguages;
function requireLanguages() {
  if (hasRequiredLanguages) return languages;
  hasRequiredLanguages = 1;
  languages = {
    AFR: "afr",
    AMH: "amh",
    ARA: "ara",
    ASM: "asm",
    AZE: "aze",
    AZE_CYRL: "aze_cyrl",
    BEL: "bel",
    BEN: "ben",
    BOD: "bod",
    BOS: "bos",
    BUL: "bul",
    CAT: "cat",
    CEB: "ceb",
    CES: "ces",
    CHI_SIM: "chi_sim",
    CHI_TRA: "chi_tra",
    CHR: "chr",
    CYM: "cym",
    DAN: "dan",
    DEU: "deu",
    DZO: "dzo",
    ELL: "ell",
    ENG: "eng",
    ENM: "enm",
    EPO: "epo",
    EST: "est",
    EUS: "eus",
    FAS: "fas",
    FIN: "fin",
    FRA: "fra",
    FRK: "frk",
    FRM: "frm",
    GLE: "gle",
    GLG: "glg",
    GRC: "grc",
    GUJ: "guj",
    HAT: "hat",
    HEB: "heb",
    HIN: "hin",
    HRV: "hrv",
    HUN: "hun",
    IKU: "iku",
    IND: "ind",
    ISL: "isl",
    ITA: "ita",
    ITA_OLD: "ita_old",
    JAV: "jav",
    JPN: "jpn",
    KAN: "kan",
    KAT: "kat",
    KAT_OLD: "kat_old",
    KAZ: "kaz",
    KHM: "khm",
    KIR: "kir",
    KOR: "kor",
    KUR: "kur",
    LAO: "lao",
    LAT: "lat",
    LAV: "lav",
    LIT: "lit",
    MAL: "mal",
    MAR: "mar",
    MKD: "mkd",
    MLT: "mlt",
    MSA: "msa",
    MYA: "mya",
    NEP: "nep",
    NLD: "nld",
    NOR: "nor",
    ORI: "ori",
    PAN: "pan",
    POL: "pol",
    POR: "por",
    PUS: "pus",
    RON: "ron",
    RUS: "rus",
    SAN: "san",
    SIN: "sin",
    SLK: "slk",
    SLV: "slv",
    SPA: "spa",
    SPA_OLD: "spa_old",
    SQI: "sqi",
    SRP: "srp",
    SRP_LATN: "srp_latn",
    SWA: "swa",
    SWE: "swe",
    SYR: "syr",
    TAM: "tam",
    TEL: "tel",
    TGK: "tgk",
    TGL: "tgl",
    THA: "tha",
    TIR: "tir",
    TUR: "tur",
    UIG: "uig",
    UKR: "ukr",
    URD: "urd",
    UZB: "uzb",
    UZB_CYRL: "uzb_cyrl",
    VIE: "vie",
    YID: "yid"
  };
  return languages;
}
var PSM;
var hasRequiredPSM;
function requirePSM() {
  if (hasRequiredPSM) return PSM;
  hasRequiredPSM = 1;
  PSM = {
    OSD_ONLY: "0",
    AUTO_OSD: "1",
    AUTO_ONLY: "2",
    AUTO: "3",
    SINGLE_COLUMN: "4",
    SINGLE_BLOCK_VERT_TEXT: "5",
    SINGLE_BLOCK: "6",
    SINGLE_LINE: "7",
    SINGLE_WORD: "8",
    CIRCLE_WORD: "9",
    SINGLE_CHAR: "10",
    SPARSE_TEXT: "11",
    SPARSE_TEXT_OSD: "12",
    RAW_LINE: "13"
  };
  return PSM;
}
var src;
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  requireRuntime();
  const createScheduler2 = requireCreateScheduler();
  const createWorker2 = requireCreateWorker();
  const Tesseract2 = requireTesseract();
  const languages2 = requireLanguages();
  const OEM2 = requireOEM();
  const PSM2 = requirePSM();
  const { setLogging } = requireLog();
  src = {
    languages: languages2,
    OEM: OEM2,
    PSM: PSM2,
    createScheduler: createScheduler2,
    createWorker: createWorker2,
    setLogging,
    ...Tesseract2
  };
  return src;
}
var srcExports = requireSrc();
function FeedbacksPage() {
  const { toast } = useToast();
  const [title, setTitle] = reactExports.useState("");
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [imageSrc, setImageSrc] = reactExports.useState(null);
  const canvasRef = reactExports.useRef(null);
  const [imgElement, setImgElement] = reactExports.useState(null);
  const [blurBoxes, setBlurBoxes] = reactExports.useState([]);
  const [isDrawing, setIsDrawing] = reactExports.useState(false);
  const [startPos, setStartPos] = reactExports.useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = reactExports.useState({ x: 0, y: 0 });
  const [ocrProgress, setOcrProgress] = reactExports.useState(null);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [showPreviewUrl, setShowPreviewUrl] = reactExports.useState(null);
  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["/api/feedbacks"]
  });
  const createFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to save feedback record");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
      toast({
        title: "Success",
        description: "Customer feedback proof uploaded successfully!"
      });
      resetUploader();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to upload feedback.",
        variant: "destructive"
      });
    }
  });
  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/feedbacks/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete feedback");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
      toast({
        title: "Deleted",
        description: "Feedback proof deleted successfully."
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete feedback.",
        variant: "destructive"
      });
    }
  });
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      const img = new Image();
      img.onload = () => {
        setImgElement(img);
        setBlurBoxes([]);
        setShowPreviewUrl(null);
        runOcrAndDetect(url, img.width, img.height);
      };
      img.src = url;
    }
  };
  const runOcrAndDetect = async (src2, originalWidth, originalHeight) => {
    setOcrProgress("Initializing OCR Scanner...");
    try {
      const worker = await srcExports.createWorker("eng");
      setOcrProgress("Scanning image text...");
      const { data } = await worker.recognize(src2);
      setOcrProgress("Processing phone number coordinates...");
      const detectedBoxes = [];
      const words = data.words || [];
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const cleanText = word.text.replace(/[^0-9+]/g, "");
        if (/^(?:\+94|0)7[0-8]\d{7}$/.test(cleanText)) {
          const { x0, y0, x1, y1 } = word.bbox;
          const w = x1 - x0;
          const h = y1 - y0;
          detectedBoxes.push({
            x: x0 + w * 0.3,
            y: y0,
            w: w * 0.7,
            h,
            isAuto: true
          });
        }
        if (i < words.length - 2) {
          const w1 = words[i].text.replace(/[^0-9+]/g, "");
          const w2 = words[i + 1].text.replace(/[^0-9]/g, "");
          const w3 = words[i + 2].text.replace(/[^0-9]/g, "");
          const isOperator = /^(?:\+94|0)?7[0-8]$/.test(w1) || w1 === "+94" && /^[7][0-8]$/.test(w2);
          if (isOperator) {
            let digitIndex1 = i + 2;
            let digitIndex2 = i + 3;
            if (w1 === "+94" && /^[7][0-8]$/.test(w2) && i < words.length - 3) {
              digitIndex1 = i + 3;
              digitIndex2 = i + 4;
            }
            if (digitIndex2 < words.length) {
              const num1 = words[digitIndex1];
              const num2 = words[digitIndex2];
              const cleanNum1 = num1.text.replace(/[^0-9]/g, "");
              const cleanNum2 = num2.text.replace(/[^0-9]/g, "");
              if (cleanNum1.length === 3 && cleanNum2.length === 4) {
                detectedBoxes.push({
                  x: num1.bbox.x0,
                  y: num1.bbox.y0,
                  w: num1.bbox.x1 - num1.bbox.x0,
                  h: num1.bbox.y1 - num1.bbox.y0,
                  isAuto: true
                });
                detectedBoxes.push({
                  x: num2.bbox.x0,
                  y: num2.bbox.y0,
                  w: num2.bbox.x1 - num2.bbox.x0,
                  h: num2.bbox.y1 - num2.bbox.y0,
                  isAuto: true
                });
              }
            }
          }
        }
      }
      await worker.terminate();
      setBlurBoxes(detectedBoxes);
      setOcrProgress(null);
      if (detectedBoxes.length > 0) {
        toast({
          title: "Phone Numbers Detected",
          description: `Automatically found and masked ${detectedBoxes.length} phone number parts!`
        });
      } else {
        toast({
          title: "Scan Completed",
          description: "No phone numbers automatically found. You can blur manually by clicking & dragging."
        });
      }
    } catch (err) {
      console.error("OCR scanning error:", err);
      setOcrProgress(null);
      toast({
        title: "Scanning Failed",
        description: "Auto-scan failed. You can still blur any number manually.",
        variant: "destructive"
      });
    }
  };
  reactExports.useEffect(() => {
    drawCanvas();
  }, [imgElement, blurBoxes, isDrawing, currentPos]);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0);
    blurBoxes.forEach((box) => {
      ctx.fillStyle = box.isAuto ? "rgba(249, 115, 22, 0.4)" : "rgba(168, 85, 247, 0.4)";
      ctx.strokeStyle = box.isAuto ? "rgb(249, 115, 22)" : "rgb(168, 85, 247)";
      ctx.lineWidth = Math.max(2, imgElement.width / 400);
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(10, imgElement.width / 60)}px sans-serif`;
      ctx.fillText(
        box.isAuto ? "Auto Blur" : "Manual Blur",
        box.x + 4,
        box.y + Math.max(12, imgElement.width / 50)
      );
    });
    if (isDrawing) {
      ctx.strokeStyle = "rgba(168, 85, 247, 0.8)";
      ctx.lineWidth = Math.max(2, imgElement.width / 400);
      ctx.setLineDash([6, 6]);
      const x = Math.min(startPos.x, currentPos.x);
      const y = Math.min(startPos.y, currentPos.y);
      const w = Math.abs(startPos.x - currentPos.x);
      const h = Math.abs(startPos.y - currentPos.y);
      ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }
  };
  const getCanvasMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };
  const handleMouseDown = (e) => {
    if (!imgElement) return;
    const pos = getCanvasMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getCanvasMousePos(e);
    setCurrentPos(pos);
  };
  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pos = getCanvasMousePos(e);
    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);
    const w = Math.abs(startPos.x - pos.x);
    const h = Math.abs(startPos.y - pos.y);
    if (w > 5 && h > 5) {
      setBlurBoxes([...blurBoxes, { x, y, w, h, isAuto: false }]);
    }
  };
  const applyBlurAndExport = async () => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const img = imgElement;
      if (!canvas || !img) {
        reject(new Error("Canvas or image element is missing"));
        return;
      }
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = img.width;
      exportCanvas.height = img.height;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2D context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      blurBoxes.forEach((box) => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = box.w;
        tempCanvas.height = box.h;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(
            exportCanvas,
            box.x,
            box.y,
            box.w,
            box.h,
            0,
            0,
            box.w,
            box.h
          );
          ctx.save();
          const blurSize = Math.max(10, img.width / 50);
          ctx.filter = `blur(${blurSize}px)`;
          ctx.drawImage(tempCanvas, box.x, box.y, box.w, box.h);
          ctx.restore();
        }
      });
      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress canvas image"));
          }
        },
        "image/jpeg",
        0.85
        // High quality (85%) compression
      );
    });
  };
  const handleUpload = async () => {
    if (!title) {
      toast({
        title: "Required Field",
        description: "Please enter a feedback title/caption.",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    try {
      const compressedBlob = await applyBlurAndExport();
      const formData = new FormData();
      formData.append("image", compressedBlob, "customer-proof.jpg");
      const uploadResponse = await fetch("/api/settings/upload", {
        method: "POST",
        body: formData
      });
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload compressed image file");
      }
      const { imageUrl } = await uploadResponse.json();
      await createFeedbackMutation.mutateAsync({ title, imageUrl });
    } catch (err) {
      console.error("Upload process error:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "An error occurred during compression or upload.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const resetUploader = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setImgElement(null);
    setBlurBoxes([]);
    setTitle("");
    setShowPreviewUrl(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 p-6 text-white bg-[#06040a] min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent", children: "Customer Feedbacks & Proofs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white/50 tracking-wide uppercase", children: "Compress and auto-mask/blur customer phone numbers instantly" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-black", children: "Upload Customer Proof" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Select feedback screenshot. Phone numbers are automatically detected and masked." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black uppercase text-purple-400 tracking-wider", children: "Feedback Title / Caption" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Dialogue Router Purchase Proof - RS 8500",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black uppercase text-purple-400 tracking-wider block", children: "Feedback Screenshot" }),
            !imageSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group min-h-48", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleFileChange,
                  className: "absolute inset-0 opacity-0 cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-white/20 group-hover:text-purple-400 mb-2 transition-colors duration-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white/40 group-hover:text-white transition-colors duration-300", children: "Drag & drop or Click to choose screenshot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-white/20 mt-1 uppercase tracking-wider", children: "Supports files up to 10MB" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: resetUploader,
                  className: "flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10",
                  children: "Choose Different Image"
                }
              ),
              blurBoxes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => setBlurBoxes([]),
                  className: "rounded-xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10",
                  title: "Clear Blur boxes",
                  children: "Clear Blurs"
                }
              )
            ] })
          ] }),
          imageSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-white/5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs font-medium text-purple-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-purple-400 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white mb-0.5", children: "Mask Phone Numbers" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60", children: "Drag your mouse over the image canvas on the right to manually draw additional blur zones." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleUpload,
                disabled: isUploading || isProcessing,
                className: "w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black",
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                  "Uploading Compressed JPG..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }),
                  "Apply Blur & Upload Instantly"
                ] })
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-6", children: imageSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-black", children: "Image Canvas Workspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-white/40", children: [
            "Auto-scan status: ",
            ocrProgress ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 animate-pulse font-bold", children: ocrProgress }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-bold", children: "Ready / Interactive" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center p-6 bg-black/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[60vh] max-w-full overflow-auto rounded-xl border border-white/10 relative", children: [
            ocrProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 animate-spin text-purple-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-white", children: ocrProgress })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: canvasRef,
                onMouseDown: handleMouseDown,
                onMouseMove: handleMouseMove,
                onMouseUp: handleMouseUp,
                className: "max-w-full h-auto cursor-crosshair block"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mt-4 text-[10px] uppercase tracking-wider font-black text-white/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded bg-orange-500 inline-block" }),
              "Orange: Detected Numbers"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded bg-purple-500 inline-block" }),
              "Purple: Custom Blur Rectangles"
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-black", children: "Current Feedbacks Grid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "View and manage currently uploaded customer proofs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }) }) : feedbacks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-white/20 uppercase tracking-widest text-xs font-black", children: "No customer proofs uploaded yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: feedbacks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "group relative bg-[#06040a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/20 transition-all duration-300 flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[4/3] w-full overflow-hidden relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.imageUrl,
                    alt: item.title || "Feedback",
                    className: "w-full h-full object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "icon",
                    onClick: () => deleteFeedbackMutation.mutate(item.id),
                    disabled: deleteFeedbackMutation.isPending,
                    className: "rounded-xl",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xs text-white truncate", children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-purple-400 mt-0.5", children: new Date(item.createdAt).toLocaleDateString() })
              ] })
            ]
          },
          item.id
        )) }) })
      ] }) })
    ] })
  ] });
}
export {
  FeedbacksPage as default
};
