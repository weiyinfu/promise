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
        promise.transition(State.REJECTED, new TypeError("The promise and its value refer to the same object"));
    }
    else if ($.isPromise(x)) {
        if (x.state === State.pending) {
            x.then(function (val) {
                Resolve(promise, val);
            }, function (reason) {
                promise.transition(State.REJECTED, reason);
            });
        }
        else {
            promise.transition(x.state, x.value);
        }
    }
    else if ($.isObject(x) || $.isFunction(x)) {
        var called_1 = false;
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
                called_1 = true;
            }
        }
    }
    else {
        promise.fulfill(x);
    }
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
    Promis.prototype.reject = function (reason) {
        this.transition(State.REJECTED, reason);
    };
    Promis.prototype.fulfill = function (value) {
        this.transition(State.FULFILLED, value);
    };
    Promis.prototype.process = function () {
        var that = this, fulfillFallBack = function (value) {
            return value;
        }, rejectFallBack = function (reason) {
            throw reason;
        };
        if (this.state === State.pending) {
            return;
        }
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
                    queuedPromise.transition(State.REJECTED, e);
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
