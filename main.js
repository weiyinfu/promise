"use strict";
exports.__esModule = true;
var State;
(function (State) {
    State[State["pending"] = 0] = "pending";
    State[State["FULFILLED"] = 1] = "FULFILLED";
    State[State["REJECTED"] = 2] = "REJECTED";
})(State || (State = {}));
var $ = {
    runAsync: function (fn) {
        setTimeout(fn, 0);
    },
    isFunction: function (val) {
        return val && typeof val === "function";
    },
    isObject: function (val) {
        return val && typeof val === "object";
    },
    isPromise: function (val) {
        return val instanceof Promis;
    }
};
function Resolve(promise, x) {
    if (promise === x) {
        promise.reject(new TypeError("The promise and its value refer to the same object"));
    }
    else if ($.isPromise(x)) {
        if (x.state === State.pending) {
            x.then(function (val) {
                Resolve(promise, val);
            }, function (reason) {
                promise.reject(reason);
            });
        }
        else {
            promise.transition(x.state, x.value);
        }
    }
    else if ($.isObject(x) || $.isFunction(x)) {
        //下面这段代码是整个promise中最难以理解的，主要是考虑到并发时，无法确定哪一段代码先执行到。
        var called_1 = false; //防止调用多次
        try {
            var thenHandler = x.then;
            if ($.isFunction(thenHandler)) {
                thenHandler.call(x, function (y) {
                    if (!called_1) {
                        Resolve(promise, y);
                        called_1 = true;
                    }
                }, function (r) {
                    if (!called_1) {
                        promise.reject(r);
                        called_1 = true;
                    }
                });
            }
            else {
                promise.fulfill(x);
                called_1 = true;
            }
        }
        catch (e) {
            if (!called_1) {
                promise.reject(e);
            }
        }
    }
    else {
        promise.fulfill(x);
    }
}
function fulfillFallBack(value) {
    return value;
}
function rejectFallBack(reason) {
    throw reason;
}
var Promis = /** @class */ (function () {
    function Promis(fn) {
        var _this = this;
        this.state = State.pending;
        //可能会多次调用then函数
        this.queue = [];
        this.handlers = {
            fulfill: null,
            reject: null
        };
        if (fn) {
            fn(function (value) {
                Resolve(_this, value);
            }, function (reason) {
                _this.reject(reason);
            });
        }
    }
    Promis.prototype.process = function () {
        if (this.state === State.pending) {
            return;
        }
        var that = this;
        $.runAsync(function () {
            while (that.queue.length) {
                var queuedPromise = that.queue.shift(), handler = null, value = void 0;
                if (that.state === State.FULFILLED) {
                    handler = queuedPromise.handlers.fulfill || fulfillFallBack;
                }
                else if (that.state === State.REJECTED) {
                    handler = queuedPromise.handlers.reject || rejectFallBack;
                }
                else {
                    throw new Error("error state");
                }
                try {
                    value = handler(that.value);
                }
                catch (e) {
                    queuedPromise.reject(e);
                    continue;
                }
                Resolve(queuedPromise, value);
            }
        });
    };
    Promis.prototype.transition = function (state, value) {
        if (this.state !== State.pending)
            return;
        this.value = value;
        this.state = state;
        this.process();
    };
    Promis.prototype.reject = function (reason) {
        this.transition(State.REJECTED, reason);
    };
    Promis.prototype.fulfill = function (value) {
        this.transition(State.FULFILLED, value);
    };
    Promis.prototype.then = function (onFulfilled, onRejected) {
        var queuedPromise = new Promis(null);
        if ($.isFunction(onFulfilled)) {
            queuedPromise.handlers.fulfill = onFulfilled;
        }
        if ($.isFunction(onRejected)) {
            queuedPromise.handlers.reject = onRejected;
        }
        this.queue.push(queuedPromise);
        this.process();
        return queuedPromise;
    };
    return Promis;
}());
function deferred() {
    var x = {};
    x.promise = new Promis(function (resolve, reject) {
        x.resolve = resolve;
        x.reject = reject;
    });
    return x;
}
exports.deferred = deferred;
