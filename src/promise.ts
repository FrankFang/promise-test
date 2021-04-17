class Promise2 {
    state = "pending";
  callbacks = [];
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接受函数作为参数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  private resolveOrReject(state, data, i) {
    if (this.state !== "pending") return;
    this.state = state;
    nextTick(() => {
      this.callbacks.forEach((handle) => {
        if (typeof handle[i] === "function") {
          try {
            let x = handle[i].call(undefined, data);
            handle[2].resolveWith(x);
          } catch (error) {
            handle[2].reject(error);
          }
        }
      });
    });
  }
  resolve(result?: unknown) {
    this.resolveOrReject("fulfilled", result, 0);
  }
  reject(reason?: unknown) {
    this.resolveOrReject("rejected", reason, 1);
  }
  then(onFulfilled?, onRejected?) {
    const handle = [];
    if (typeof onFulfilled === "function") {
      handle[0] = onFulfilled;
    }
    if (typeof onRejected === "function") {
      handle[1] = onRejected;
    }
    handle[2] = new MyPromise(() => {});
    this.callbacks.push(handle);
    return handle[2];
  }
  resolveWith(x) {
    if (this === x) {
      this.resolveWithSelf();
    } else if (x instanceof MyPromise) {
      this.resolveWithPromise(x);
    } else if (x instanceof Object) {
      this.resolveWithObject(x);
    } else {
      this.resolve(x);
    }
  }
  resolveWithSelf() {
    throw new TypeError();
  }
  resolveWithPromise(x) {
    x.then(
      (result) => {
        this.resolve(result);
      },
      (reason) => {
        this.reject(reason);
      }
    );
  }
  resolveWithObject(x) {
    let then;
    try {
      then = x.then;
    } catch (e) {
      throw new Error(e);
    }
    if (then instanceof Function) {
      try {
        x.then(
          (result) => {
            this.resolveWith(result);
          },
          (reason) => {
            this.reject(reason);
          }
        );
      } catch (error) {
        this.reject(error);
      }
    } else {
      this.resolve(x);
    }
  }
}

export default Promise2;

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}
