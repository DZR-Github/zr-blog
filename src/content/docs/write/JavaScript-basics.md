---
title: JavaScript基础
---

## 防抖

> 防抖函数可以将多次高频率触发的函数执行合并成一次，并在指定的时间间隔后执行一次，避免频繁触发事件导致页面卡顿等问题。

函数在 n 秒后再执行，如果 n 秒内被触发，重新计时，保证最后一次触发事件 n 秒后才执行。

应用场景：输入框搜索，表单提交按钮，文本器保存

防抖函数：

```jsx
function debounce(func, delay) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```

可立即执行：

```jsx
const debounce = (fn, delay, immediate = false) => {
  let timer = null,
    flag = 0;

  return function (...args) {
    if (timer) clearTimeout(timer);
    if (immediate && !flag) {
      fn.apply(this, args);
      flag = 1;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
};
```

## 节流

> 可以限制函数的执行频率，避免过多的重复操作，提升页面的响应速度

函数在 n 秒内只执行一次，如果多次触发，则忽略执行

应用场景：拖拽场景，scroll 场景，窗口大小调整

节流函数：

```jsx
function throttle(fn, wait) {
  let startTime = Date.now();

  return function () {
    const nowTime = Date.now();

    // 计算两次执行的间隔时间 是否大于 wait 时间
    if (nowTime - startTime >= wait) {
      startTime = nowTime;
      fn.apply(this, arguments);
    }
  };
}
```

## instanceof 方法

instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。

实现步骤：

1. 首先获取类型的原型
2. 然后获得对象的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为  `null`，因为原型链最终为  `null`

具体实现：

```jsx
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
    prototype = right.prototype; // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;

    proto = Object.getPrototypeOf(proto);
  }
}
```

## new 操作符

在调用 new 的过程中会发生以上四件事情：

（1）首先创建了一个新的空对象

（2）设置原型，将对象的原型设置为函数的 prototype 对象。

（3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）

（4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

```jsx
function objectFactory() {
  let newObject = null;
  let constructor = Array.prototype.shift.call(arguments);
  let result = null;
  // 判断参数是否是一个函数
  if (typeof constructor !== "function") {
    console.error("type error");
    return;
  }
  // 新建一个空对象，对象的原型为构造函数的 prototype 对象
  newObject = Object.create(constructor.prototype);
  // 将 this 指向新建对象，并执行函数
  result = constructor.apply(newObject, arguments);
  // 判断返回对象
  let flag =
    result && (typeof result === "object" || typeof result === "function");
  // 判断返回结果
  return flag ? result : newObject;
}
// 使用方法
objectFactory(构造函数, 初始化参数);
```

## Promise

```jsx
class myPromise {
  // 用static创建静态属性，用来管理状态
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
  constructor(func) {
    // 给类的构造方法constructor添加一个参数func
    this.PromiseState = myPromise.PENDING; // 指定Promise对象的状态属性 PromiseState，初始值为pending
    this.PromiseResult = null; // 指定Promise对象的结果 PromiseResult
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
    try {
      /**
       * func()传入resolve和reject，
       * resolve()和reject()方法在外部调用，这里需要用bind修正一下this指向
       * new 对象实例时，自动执行func()
       */
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
      this.reject(error);
    }
  }

  resolve(result) {
    // result为成功态时接收的终值
    // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.FULFILLED;
      this.PromiseResult = result;
      /**
       * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
       * 看看数组里面有没有then那边 保留 过来的 待执行函数，
       * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
       */
      this.onFulfilledCallbacks.forEach((callback) => {
        callback(result);
      });
    }
  }

  reject(reason) {
    // reason为拒绝态时接收的终值
    // 只能由pending状态 => rejected状态 (避免调用多次resolve reject)
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach((callback) => {
        callback(reason);
      });
    }
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数]
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数
   * @returns {function} newPromsie  返回一个新的promise对象
   */
  then(onFulfilled, onRejected) {
    // 2.2.7规范 then 方法必须返回一个 promise 对象
    let promise2 = new myPromise((resolve, reject) => {
      if (this.PromiseState === myPromise.FULFILLED) {
        /**
         * 为什么这里要加定时器setTimeout？
         * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
         * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
         * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
         * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
         */
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== "function") {
              // 2.2.7.3规范 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
              resolve(this.PromiseResult);
            } else {
              // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
              let x = onFulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            // 2.2.7.2规范 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
            reject(e); // 捕获前面onFulfilled中抛出的异常
          }
        });
      } else if (this.PromiseState === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== "function") {
              // 2.2.7.4规范 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
              reject(this.PromiseResult);
            } else {
              let x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === myPromise.PENDING) {
        // pending 状态保存的 onFulfilled() 和 onRejected() 回调也要符合 2.2.7.1，2.2.7.2，2.2.7.3 和 2.2.7.4 规范
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.PromiseResult);
              } else {
                let x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== "function") {
                reject(this.PromiseResult);
              } else {
                let x = onRejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  if (x === promise2) {
    throw new TypeError("Chaining cycle detected for promise");
  }

  if (x instanceof myPromise) {
    /**
     * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
     *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
     */
    x.then((y) => {
      resolvePromise(promise2, y, resolve, reject);
    }, reject);
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 2.3.3 如果 x 为对象或函数
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      var then = x.then;
    } catch (e) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(e);
    }

    /**
     * 2.3.3.3
     * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
     * 传递两个回调函数作为参数，
     * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
     */
    if (typeof then === "function") {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      let called = false; // 避免多次调用
      try {
        then.call(
          x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        /**
         * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
         */
        if (called) return;
        called = true;

        // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
        reject(e);
      }
    } else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
    return resolve(x);
  }
}
```

## Promise.then

```jsx

```

## Promise.all

Promise.all() 方法接收一个 promise 的 iterable 类型（注：Array，Map，Set 都属于 ES6 的 iterable 类型）的输入，并且只返回一个 Promise 实例， 输入的所有 promise 的 resolve 回调的结果是一个数组。

> 返回的这个 Promise 的 resolve 回调执行是在所有输入的 promise 的 resolve 回调都结束，或者输入的 iterable 里没有 promise 了的时候。它的 reject 回调执行是，只要任何一个输入的 promise 的 reject 回调执行或者输入不合法的 promise 就会立即抛出错误，并且 reject 的是第一个抛出的错误信息。

- Promise.all 等待所有都完成（或第一个失败）
- 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
- 如果参数中包含非 promise 值，这些值将被忽略，但仍然会被放在返回数组中，如果 promise 完成的话 (也就是如果参数里的某值不是 Promise，则需要原样返回在数组里)
- 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 promise 值）。
- 如果传入的 promise 中有一个失败（rejected），Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成

```jsx
class myPromise {
    ...

    /**
     * Promise.all()
     * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
     * @returns
     */
    static all(promises) {
        return new myPromise((resolve, reject) => {
            // 参数校验
            if (Array.isArray(promises)) {
                let result = []; // 存储结果
                let count = 0; // 计数器

                // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
                if (promises.length === 0) {
                    return resolve(promises);
                }

                promises.forEach((item, index) => {
                    // myPromise.resolve方法中已经判断了参数是否为promise与thenable对象，所以无需在该方法中再次判断
                    myPromise.resolve(item).then(
                        value => {
                            count++;
                            // 每个promise执行的结果存储在result中
                            result[index] = value;
                            // Promise.all 等待所有都完成（或第一个失败）
                            count === promises.length && resolve(result);
                        },
                        reason => {
                            /**
                             * 如果传入的 promise 中有一个失败（rejected），
                             * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
                             */
                            reject(reason);
                        }
                    )
                })
            } else {
                return reject(new TypeError('Argument is not iterable'))
            }
        })
    }
}

```

## Promise.race

Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

- 如果传的迭代是空的，则返回的 promise 将永远等待。
- 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 Promise.race 将解析为迭代中找到的第一个值。

```jsx
class myPromise {
	...

    /**
     * Promise.race()
     * @param {iterable} promises 可迭代对象，类似Array。详见 iterable。
     * @returns
     */
   static race(promises) {
       return new myPromise((resolve, reject) => {
           // 参数校验
           if (Array.isArray(promises)) {
               // 如果传入的迭代promises是空的，则返回的 promise 将永远等待。
               if (promises.length > 0) {
                   promises.forEach(item => {
                       /**
                        * 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，
                        * 则 Promise.race 将解析为迭代中找到的第一个值。
                        */
                       myPromise.resolve(item).then(resolve, reject);
                   })
               }
           } else {
               return reject(new TypeError('Argument is not iterable'))
           }
       })
   }
}


```

## Promise.resolve

Promise.resolve(value) 将给定的一个值转为 Promise 对象。

- 如果这个值是一个 promise ，那么将返回这个 promise ；
- 如果这个值是 thenable（即带有"then" 方法），返回的 promise 会“跟随”这个 thenable 的对象，采用它的最终状态；
- 否则返回的 promise 将以此值完成，即以此值执行 resolve()方法 (状态为 fulfilled)。

```jsx
class myPromise {
    ...
}

/**
 * Promise.resolve()
 * @param {[type]} value 要解析为 Promise 对象的值
 */
 myPromise.resolve = function (value) {
     // 如果这个值是一个 promise ，那么将返回这个 promise
     if (value instanceof myPromise) {
         return value;
     } else if (value instanceof Object && 'then' in value) {
         // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
         return new myPromise((resolve, reject) => {
             value.then(resolve, reject);
         })
     }

     // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
     return new myPromise((resolve) => {
         resolve(value)
     })
 }

```

## Promise.reject

Promise.reject()方法返回一个带有拒绝原因的 Promise 对象。

```jsx
class myPromise {
	...
}

/**
 * myPromise.reject
 * @param {*} reason 表示Promise被拒绝的原因
 * @returns
 */
 myPromise.reject = function (reason) {
     return new myPromise((resolve, reject) => {
         reject(reason);
     })
 }

```

## Promise.finally

finally() 方法返回一个 Promise。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。

```jsx
class myPromise {
	...
    catch (onRejected) {
        return this.then(undefined, onRejected)
    }

    /**
     * finally
     * @param {*} callBack 无论结果是fulfilled或者是rejected，都会执行的回调函数
     * @returns
     */
   finally(callBack) {
       return this.then(callBack, callBack)
   }
}

```

## 类型判断函数

```jsx
function getType(value) {
  // 判断数据是 null 的情况
  if (value === null) {
    return value + "";
  }
  // 判断数据是引用类型的情况
  if (typeof value === "object") {
    let valueClass = Object.prototype.toString.call(value),
      type = valueClass.split(" ")[1].split("");
    type.pop();
    return type.join("").toLowerCase();
  } else {
    // 判断数据是基本数据类型的情况和函数的情况
    return typeof value;
  }
}
```

## call 函数

```jsx

```

## apply 函数

```jsx

```

## bind 函数

```jsx

```

## 函数柯里化实现

```jsx

```

## Ajax 请求

```jsx

```

## Promise 封装 Ajax 请求

```jsx

```

## 浅拷贝

浅拷贝是指，一个新的对象对原始对象的属性值进行精确地拷贝，如果拷贝的是基本数据类型，拷贝的就是基本数据类型的值，如果是引用数据类型，拷贝的就是内存地址。如果其中一个对象的引用内存地址发生改变，另一个对象也会发生变化。

```jsx
// 浅拷贝的实现;

function shallowCopy(object) {
  // 只拷贝对象
  if (!object || typeof object !== "object") return;

  // 根据 object 的类型判断是新建一个数组还是对象
  let newObject = Array.isArray(object) ? [] : {};

  // 遍历 object，并且判断是 object 的属性才拷贝
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key] = object[key];
    }
  }

  return newObject;
}
```

## 深拷贝

深拷贝相对浅拷贝而言，如果遇到属性值为引用类型的时候，它新建一个引用类型并将对应的值复制给它，因此对象获得的一个新的引用类型而不是一个原有类型的引用。

> 可以使用 obj.hasOwnProperty(key)或者 Object.keys(obj).includes(key)来判断 key 是否为对象自身的属性。

```jsx
// 深拷贝的实现
function deepCopy(object) {
  if (!object || typeof object !== "object") return;

  let newObject = Array.isArray(object) ? [] : {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key] =
        typeof object[key] === "object" ? deepCopy(object[key]) : object[key];
    }
  }

  return newObject;
}
```
