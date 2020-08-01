class Promise2 {
  status = "pending";
  succed = [];
  fail = [];
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("我只接收函数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(value) {
    if (this.status === "pending") {
      this.status = "fulfilled";
      setTimeout(function () {
        this.succed.forEach((succedFn) => {
          if (typeof succedFn === "function") {
            succedFn(value);
          }
        });
      }, 0);
    }
  }
  reject(reason) {
    if (this.status === "pending") {
      this.status = "rejected";
      setTimeout(function () {
        this.succed.forEach((fillFn) => {
          if (typeof fillFn === "function") {
            fillFn(reason);
          }
        });
      }, 0);
    }
  }
  then(succed, fail) {
    if (typeof succed === "function") {
      this.succed.push(succed);
    }
    if (typeof fail === "function") {
      this.fail.push(fail);
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
