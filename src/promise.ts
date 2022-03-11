class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    if (this.state !== "pending") return;
    this.state = "fullfilled";
    /* 完善 */
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        if (typeof handle.succeed === "function") {
          handle.succeed.call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason) {
    if (this.state !== "pending") return;
    this.state = "rejected";
    setTimeout(() => {
      this.callbacks.forEach(handle => {
        if (typeof handle.fail === "function") {
          handle.fail.call(undefined, reason);
        }
      });
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接受一个函数为参数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    const handle = {
      succeed: null,
      fail: null
    };
    if (typeof succeed === "function") {
      handle.succeed = succeed;
    }
    if (typeof fail === "function") {
      handle.fail = fail;
    }
    this.callbacks.push(handle);
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


