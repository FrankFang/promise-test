class Promise2 {
  state = "pending";
  callbacks = [];
  // succeed = null;
  // fail = null;
  resolve(result) {
    /* 完善 */
    setTimeout(() => {
      
      if(this.state !== 'pending'){
        return;
      }
      this.state = 'fulfilled';
      this.callbacks.forEach((item) => {
        if(typeof item[0] === 'function'){
          item[0].call(undefined,result);
        }
      })
    },0)
  }
  reject(reason) {
    /* 完善 */
    setTimeout(() => {
      if(this.state !== 'pending'){
        return;
      }
      this.state = 'rejected';
      this.callbacks.forEach((item) => {
        if(typeof item[1] === 'function'){
          item[1].call(undefined,reason);
        }
      })
    },0)
  }
  constructor(fn) {
    /* 完善 */
    if(typeof fn !== 'function' ){
      throw new Error('fn必须是一个函数');
    }else{
      fn(this.resolve.bind(this),this.reject.bind(this));
    }
  }
  then(succeed?, fail?) {
    let handleList = [];
    /* 完善 */
    if(typeof succeed === 'function'){
      handleList[0] = succeed;
    }
    if(typeof fail === 'function'){
      handleList[1] = fail;
    }
    this.callbacks.push(handleList);
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
