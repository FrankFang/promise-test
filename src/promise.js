class Promise2 {
  status = "pending"; // 'pending','fulfilled','rejected'
  callbacks = []; // [{succeed: f1,fail: f2}]
  resolve(result) {
    if (this.status !== "pending") return; // 如果不是pending 不执行
    this.status = "fulfilled";
    nextTick(() => {
      // 遍历 callbacks，调用所有的 handle[0]
      this.callbacks.forEach((handle) => {
        if (typeof handle.succeed === "function") {
          handle.succeed.call(undefined, result);
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
          handle.fail.call(undefined, reason);
        }
      });
    });
  }
  constructor(fn) {
    if (typeof fn !== "function") throw new Error("fn must be function");
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed, fail) {
    const handle = { succeed: undefined, fail: undefined };
    if (typeof succeed === "function") {
      handle.succeed = succeed;
    }
    if (typeof fail === "function") {
      handle.fail = fail;
    }
    this.callbacks.push(handle);
    // 把函数推到 callbacks 里面
    return undefined;
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
