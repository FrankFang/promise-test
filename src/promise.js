class Promise2 {
  status = "pending"; // 'pending','fulfilled','rejected'
  callbacks = []; // [{succeed: f1,fail: f2,promise: Promise2}]
  resolve(result) {
    if (this.status !== "pending") return; // 如果不是pending 不执行
    this.status = "fulfilled";
    nextTick(() => {
      // 遍历 callbacks，调用所有的 handle[0]
      this.callbacks.forEach((handle) => {
        if (typeof handle.succeed === "function") {
          const x = handle.succeed.call(undefined, result);
          handle.promise.resolveWith(x);
        }
      });
    });
  }
  reject(reason) {
    if (this.status !== "pending") return; // 如果不是pending 不执行
    this.status = "rejected";
    nextTick(() => {
      // 遍历 callbacks，调用所有的 handle[0]
      this.callbacks.forEach((handle) => {
        if (typeof handle.fail === "function") {
          const x = handle.fail.call(undefined, reason);
          handle.promise;
        }
      });
    });
  }
  constructor(fn) {
    if (typeof fn !== "function") throw new Error("fn must be function");
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed, fail) {
    const handle = { succeed: undefined, fail: undefined, promise: undefined };
    if (typeof succeed === "function") {
      handle.succeed = succeed;
    }
    if (typeof fail === "function") {
      handle.fail = fail;
    }
    handle.promise = new Promise2(() => {}); // 为了在resolve / reject中 把上一个的promise的返回值 给了下一个promise
    this.callbacks.push(handle);
    // 把函数推到 callbacks 里面
    return handle.promise;
  }
  resolveWith(x) {
    // promise处理程序 对应规2.3
    if (this === x) this.reject(new TypeError("x和promise不应该是同一个引用"));
    //2.3.1 如果promise和x引用同一个对象，则用TypeError作为原因拒绝（reject）promise。
    else if (x instanceof Promise2) {
      // 2.3.2 如果x是一个promise,采用promise的状态
      x.then(
        (result) => {
          this.resolve(result);
        },
        (reason) => {
          this.reject(reason);
        }
      );
    }
    if (x instanceof Object) {
      //  2.3.3另外，如果x是个对象或者方法
      let then;
      try {
        then = x.then; // 2.3.3.1 让x作为x.then. 3.5
      } catch (e) {
        this.reject(e); // 2.3.3.2 如果取回的x.then属性的结果为一个异常e,用e作为原因reject promise
      }
      if (typeof then === "function") {
        // 如果then是一个方法，把x当作this来调用它， 第一个参数为 resolvePromise，第二个参数为rejectPromise,其中:
        try {
          x.then(
            (y) => this.resolveWith(y), // 2.3.3.3.1 如果/当 resolvePromise被一个值y调用，运行 [[Resolve]](promise, y)
            (r) => this.reject(r) // 2.3.3.3.2 如果/当 rejectPromise被一个原因r调用，用r拒绝（reject）promise);
          );
        } catch (e) {
          this.reject(e); // 2.3.3.3.4 如果调用then抛出一个异常e,用e作为reason拒绝（reject）promise
        }
      } else {
        this.resolve(x); //2.3.3.4 如果then不是一个函数，用x完成(fulfill)promise
      }
    } else {
      this.resolve(x); // 2.3.3.4 如果then不是一个函数，用x完成(fulfill)promise
    }
  }
}

module.exports = Promise2;

function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true,
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}
