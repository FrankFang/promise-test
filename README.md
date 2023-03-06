写的 Promise2 类有一个问题：真正的 Promise 是在 then 调用的时候将 resolve 推入微任务的，而不是在 resolve 执行的时候推进去的，如下列代码：
const executeHandle = () => {
  console.log('-------->', '111');
  const promise = handle()
  promise.then(() => {
    console.log('-------->', '333');
  })
  queueMicrotask(() => {
    console.log('-------->', '444');
  })
}
const handle = () => {
  return new Promise((resolve) => {
    resolve('')
    queueMicrotask(() => {
      console.log('-------->', '222');
    })
    setTimeout(() => {
      console.log('-------->', '555');
    })
  })
}
执行结果是：1，2，3，4，5
注意不是：1，3，2，4，5
