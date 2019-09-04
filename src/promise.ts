class Promise2 {
  state = "pending";
  callbacks = [];
  value = '';
  resolve = result => {
    /* 完善 */
    nextTick(() => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = result;
      this.callbacks.forEach(callback => {
          callback.succeed(this.value);
      })
      this.callbacks = [];
    })
  }
  reject = reason => {
    /* 完善 */
    nextTick(() => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.callbacks.forEach(callback => {
          callback.fail(this.value);
      });
      this.callbacks = [];
    })
  }
  constructor(fn) {
    /* 完善 */
    // if (typeof fn !== 'function')  {
    //   throw new TypeError('param is not a function');
    // }
    try {
      fn(this.resolve, this.reject);
    } catch (error) {
      // this.reject(error);
      throw error;
    }
  }
  then(succeed?, fail?) {
    /* 完善 */
    return new Promise2((res, rej) => {
      let callback = {
        succeed: (result) => {
          if (!succeed) {
            res(result);
          }

          try {
            res(succeed(result));
          } catch (error) {
            rej(error);
          }
        },
        fail: (reason) => {
          if (!fail) {
            rej(reason);
          }

          try {
            res(fail(reason));
          } catch (error) {
            rej(error)
          }
        }
      };

      this.callbacks = [...this.callbacks, callback];

      this.callbacks.forEach(callback => {
        if (this.state === 'fulfilled') {
          callback.succeed(this.value);
        }

        if (this.state === 'rejected') {
          callback.fail(this.value)
        }
      })
    })
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
