class Promise2 {
  state = "pending";
  callbacks = [];
  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    nextTick(() => {
      this.callbacks.forEach((item) => {
        item[0] && item[0].call(undefined, result);
      });
    });
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    nextTick(() => {
      this.callbacks.forEach((item) => {
        item[1] && item[1].call(undefined, reason);
      });
    });
  }
  constructor(fn) {
    if (typeof fn !== 'function') throw new Error('promise必须接受一个函数');
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(succeed?, fail?) {
    const array = [null, null];
    if (typeof succeed === 'function') array[0] = succeed;
    if (typeof fail === 'function') array[1] = fail;
    this.callbacks.push(array);
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
