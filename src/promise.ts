class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    setTimeout(() => {
      if (this.state !== 'pending') return;
      this.state = 'fullfilled';
      this.callbacks.forEach((handle) => {
        if (handle[0]) handle[0].call(undefined, result);
      });
    }, 0);
  }
  reject(reason) {
    setTimeout(() => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.callbacks.forEach((handle) => {
        if (handle[1]) handle[1].call(undefined, reason);
      });
    }, 0);
  }
  constructor(fn) {
     if (typeof fn !== 'function') {
      throw new Error('Promise必须传入一个函数');
    }
    fn(this.res.bind(this), this.rej.bind(this));
  }
  then(succeed?, fail?) {
    const handle = [];
    if (typeof succeed === 'function') handle[0] = succeed;
    if (typeof fail === 'function') handle[1] = fail;
    this.callbacks.push(handle);
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
