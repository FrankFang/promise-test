class PromiseA {
	// 静态属性
	static PENDING = "pending"
	static FULFILLED = "fulfilled"
	static REJECTED = "rejected"

	state = "pending";
	result = null;
	reason = null;
	successCallbacks = [];
	failCallbacks = []
	// 一个函数，参数为resolve, reject两个方法
	constructor(fn) {
		if(typeof fn !== 'function') {
			throw new TypeError("我只接受函数")
		}
		// resolve,reject在exector的函数作用域执行，因此这里使用bind绑定全局的this
		fn(this.resolve.bind(this), this.reject.bind(this))
	}

	resolve(result) {
		if(this.state === PromiseA.PENDING) {
			this.state = PromiseA.FULFILLED
			this.result = result
			// promise规范中resolve和reject两个函数内的执行是异步的，这里使用nextTick
			nextTick(() => {
				this.successCallbacks.forEach(item => {
					try {
						return item(this.result)
					}catch(e) {
						return e;
					}
				})
			})
		}
	}
	reject(reason) {
		if(this.state === PromiseA.PENDING) {
			this.state = PromiseA.REJECTED
			this.reason = reason
			nextTick(() => {
				this.failCallbacks.forEach(item => {
					try {
						return item.call(undefined, this.reason)
					}catch(e) {
						return e;
					}
				})
			})
		}
	}
	
	// 两个都是可选的参数
	then(succeed?, fail?) {
		if (typeof succeed === "function") {
			this.successCallbacks.push(succeed)
		}
		if (typeof fail === "function") {
			this.failCallbacks.push(fail)
		}
		// 返回new Promise
		return new PromiseA(() => {})
	}
}

export default PromiseA;

// 实现nextTick
function nextTick(fn) {
	// node环境下
	if (process !== undefined && typeof process.nextTick === "function") {
		return process.nextTick(fn);
	} else {
	// 浏览器环境模拟nextTick
		var counter = 1;
		// 关于MutationObserver， 参考: https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver
		var observer = new MutationObserver(fn);
		var textNode = document.createTextNode(String(counter));

		observer.observe(textNode, {
			characterData: true   // 观察节点内容或节点文本的变动
		});

		counter = counter + 1;
		textNode.data = String(counter);
	}
}
