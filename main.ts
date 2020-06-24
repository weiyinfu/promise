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
}

function Resolve(promise, x) {
  if (promise === x) {
    promise.reject(new TypeError("The promise and its value refer to the same object"));
  } else if (x instanceof Promis) {
    if (x.state === State.pending) {
      x.then(val => {
        Resolve(promise, val);
      }, reason => {
        promise.reject(reason);
      });
    } else {
      promise.transition(x.state, x.value);
    }
  } else if ($.isObject(x) || $.isFunction(x)) {
    //下面这段代码是整个promise中最难以理解的，主要是考虑到并发时，无法确定哪一段代码先执行到。
    let called = false;//防止调用多次
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
      }
    }
  } else {
    promise.fulfill(x);
  }
}

function fulfillFallBack(value) {
  return value;
}

function rejectFallBack(reason) {
  throw reason;
}

class Promis {
  state: State = State.pending;
  value: any;
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

  process() {
    if (this.state === State.pending) {
      return;
    }
    let that = this;
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
          queuedPromise.reject(e);
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

  reject(reason) {
    this.transition(State.REJECTED, reason);
  }

  fulfill(value) {
    this.transition(State.FULFILLED, value);
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
