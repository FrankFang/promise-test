interface nextPromiseCallback {
    onfulfilled?: (value: unknown) => unknown,
    onrejected?: (reason: unknown) => unknown,
    resolve: SelfPromise["selfResolve"],
    reject: SelfPromise["selfReject"],
}

interface thenable {
    then: Function,
    [propName: string]: unknown;
}

class SelfPromise {
    private static readonly PENDING = 'pending'
    private static readonly FULFILLED = 'fulfilled'
    private static readonly REJECTED = 'rejected'

    public state: 'pending' | 'fulfilled' | 'rejected' = "pending"
    private value: unknown
    private ignore: boolean = false

    constructor(executor: (resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) => void) {
        if (typeof executor !== 'function') {
            throw new TypeError('executor must to be a function')
        }
        try {
            executor(this.selfResolve.bind(this), this.selfReject.bind(this))
        } catch (error) {
            this.selfReject(error)
        }
    }

    private callBacks: nextPromiseCallback[] = []

    private isThenable(value: unknown): Function | undefined {
        try {
            if ((typeof value === 'object' || typeof value === 'function') && value !== null) {
                const valueThen = (value as thenable).then
                if ((typeof valueThen === 'function')) {
                    return valueThen
                }
            }
        } catch (error) {
            this.selfReject(error)
        }
    }

    private selfResolve(value?: unknown): void {
        const valueThen = this.isThenable(value)
        if (value === this) {
            this.selfReject(new TypeError('the value can\'t refer to same object'))
        } else if (value instanceof SelfPromise) {
            value.then((value) => {
                this.selfResolve(value)
            }, (reason) => {
                this.selfReject(reason)
            })
            // 处理thenable对象
        } else if (valueThen) {
            let hasCalled = false
            try {
                // new SelfPromise(valueThen.bind(value)).then( (value: unknown) => {
                //     this.selfResolve(value)
                // }, (reason: unknown) => {
                //     this.selfReject(reason)
                // })

                valueThen.call(value, (value: unknown) => {
                    if (!hasCalled){
                        hasCalled = true
                        this.selfResolve(value)
                    }

                }, (reason: unknown) => {
                    if (!hasCalled){
                        hasCalled = true
                        this.selfReject(reason)
                    }
                })
            } catch (error) {
                if (!hasCalled){
                    hasCalled = true
                    this.selfReject(error)
                }
            }
        } else {
            this.transition(SelfPromise.FULFILLED, value)
        }
    }

    private selfReject(reason?: unknown): void {
        this.transition(SelfPromise.REJECTED, reason)
    }

    private transition(status: 'fulfilled' | 'rejected', value?: unknown): void {
        if (this.state === SelfPromise.PENDING) {
            this.state = status
            this.value = value

            this.runCallbacks()
        }
    }

    private runCallbacks(): void {
        for (const callback of this.callBacks) {
            this.handleCallback(callback, this.value)
        }
    }

    private handleCallback(nextCallback: nextPromiseCallback, value?: unknown) {
        const { onfulfilled, onrejected, resolve, reject } = nextCallback
        let callback: ((value: unknown) => unknown) | undefined
        if (this.state === SelfPromise.FULFILLED) {
            callback = onfulfilled
        } else if (this.state === SelfPromise.REJECTED) {
            callback = onrejected
        } else {
            throw new Error('Incorrect status, expected status is either "fulfilled" or "rejected"')
        }

        if (typeof callback === 'function') {
            nextTick(() => {
                try {
                    if (typeof callback === 'function') {
                        resolve(callback.call(undefined, value))
                    } else {
                        throw new TypeError(' callback\'s type has changed ')
                    }
                } catch (error) {
                    reject(error)
                }
            })
        } else {
            const statsCallback = this.state === SelfPromise.FULFILLED ? resolve : reject
            statsCallback(this.value)
        }
    }

    public static resolve(value: unknown): SelfPromise {
        return new SelfPromise((res, rej) => {
            res(value)
        })
    }

    public static reject(reason: unknown): SelfPromise {
        return new SelfPromise((res, rej) => {
            rej(reason)
        })
    }

    public then(onfulfilled?: any, onrejected?: any){
        return new SelfPromise((resolve, reject) => {
            if (this.state === SelfPromise.PENDING) {
                this.callBacks.push({ onfulfilled , onrejected, resolve, reject })
            } else {
                this.handleCallback({ onfulfilled, onrejected, resolve, reject }, this.value)
            }
        })
    }

}


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

export default SelfPromise