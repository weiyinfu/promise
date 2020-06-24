enum State {
  pending, FULFILLED, REJECTED
}

const $ = {
  runAsync(fn) {
    setTimeout(fn, 0);
  },
  isFunction(val) {
    return val && typeof val === "function";
  },
  isObject(val) {
    return val && typeof val === "object";
  },
  isPromise(val) {
    return val instanceof Promis;
  }
}

function Resolve(promise, x) {
  if (promise === x) {
    promise.transition(State.REJECTED, new TypeError("The promise and its value refer to the same object"));
  } else if ($.isPromise(x)) {
    if (x.state === State.pending) {
      x.then(function (val) {
        Resolve(promise, val);
      }, function (reason) {
        promise.transition(State.REJECTED, reason);
      });
    } else {
      promise.transition(x.state, x.value);
    }
  } else if ($.isObject(x) || $.isFunction(x)) {
    let called = false;
    try {
      let thenHandler = x.then;

      if ($.isFunction(thenHandler)) {
        thenHandler.call(x,
            function (y) {
              if (!called) {
                Resolve(promise, y);
                called = true;
              }
            },
            function (r) {
              if (!called) {
                promise.reject(r);
                called = true;
              }
            });
      } else {
        promise.fulfill(x);
        called = true;
      }
    } catch (e) {
      if (!called) {
        promise.reject(e);
        called = true;
      }
    }
  } else {
    promise.fulfill(x);
  }
}

class Promis {
  state: State = State.pending;
  value: any;
  reason: any;
  //可能会多次调用then函数
  queue = [];
  handlers = {
    fulfill: null,
    reject: null
  };

  constructor(fn: (resolve: Function, reject: Function) => void) {
    if (fn) {
      fn(value => {
        Resolve(this, value);
      }, reason => {
        this.reject(reason);
      });
    }
  }

  reject(reason) {
    this.transition(State.REJECTED, reason);
  }

  fulfill(value) {
    this.transition(State.FULFILLED, value);
  }

  process() {
    let that = this,
        fulfillFallBack = function (value) {
          return value;
        },
        rejectFallBack = function (reason) {
          throw reason;
        };

    if (this.state === State.pending) {
      return;
    }

    $.runAsync(function () {
      while (that.queue.length) {
        let queuedPromise = that.queue.shift(),
            handler = null,
            value;

        if (that.state === State.FULFILLED) {
          handler = queuedPromise.handlers.fulfill || fulfillFallBack;
        } else if (that.state === State.REJECTED) {
          handler = queuedPromise.handlers.reject || rejectFallBack;
        } else {
          throw new Error("error state");
        }

        try {
          value = handler(that.value);
        } catch (e) {
          queuedPromise.transition(State.REJECTED, e);
          continue;
        }

        Resolve(queuedPromise, value);
      }
    });
  }

  transition(state, value) {
    if (this.state !== State.pending) return;
    this.value = value;
    this.state = state;
    this.process();
  }

  then(onFulfilled, onRejected) {
    let queuedPromise = new Promis(null);
    if ($.isFunction(onFulfilled)) {
      queuedPromise.handlers.fulfill = onFulfilled;
    }
    if ($.isFunction(onRejected)) {
      queuedPromise.handlers.reject = onRejected;
    }
    this.queue.push(queuedPromise);
    this.process();
    return queuedPromise;
  }
}

export function deferred() {
  let x: any = {}
  x.promise = new Promis((resolve, reject) => {
    x.resolve = resolve;
    x.reject = reject;
  })
  return x;
}
