class Promise2 {
  constructor(fn) {
    /* 完善 */
    if(typeof fn !== 'function') {
      throw new Error('new Promise的参数应该是一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  state = "pending";// Promise中 就只有三种状态 “成功、失败、pending”
  callbacks = [];

  resolve(result: any) {
    // resolve, reject 其实是在调用 callbacks 队列中的方法，这个方法就是then方法的参数
    setTimeout(() => {
      if(this.state !== "pending") return// 也就是说同一时间只能存在一种状态
        this.state = "fulfilled"
        this.callbacks.forEach(handle => {// 执行成功函数
          if(typeof handle[0] === "function") {
            handle[0].call(undefined, result)
          }
        })
    },0)
  }
  reject(reason) {
    setTimeout(() => {
      if(this.state === "rejected") return 
        this.state = "rejected"
        this.callbacks.forEach(handle => {// 执行失败函数
          if(typeof handle[1] === "function") {
            handle[1].call(undefined, reason)
          }
      })
    },0)
  }

  then(succeed?, fail?) {
    /* 完善 */
    let handle = []
    if(typeof succeed === 'function') {
      handle[0] = succeed
    }
    if(typeof fail === 'function')  {
      handle[1] = fail
    }
      this.callbacks.push(handle)
  }
}

export default Promise2;
