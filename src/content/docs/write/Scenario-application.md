---
title: 场景应用
---

## 循环打印红黄绿

```jsx

```

## 每隔一秒打印 1，2，3，4

```jsx

```

## 小孩报数

```jsx

```

## 实现发布-订阅模式

```jsx

```

## 使用 setTimeout 实现 setInterval

```jsx

```

## 实现 jsonp

```jsx
// 动态的加载js文件
function addScript(src) {
  const script = document.createElement("script");
  script.src = src;
  script.type = "text/javascript";
  document.body.appendChild(script);
}
addScript("http://xxx.xxx.com/xxx.js?callback=handleRes");
// 设置一个全局的callback函数来接收回调结果
function handleRes(res) {
  console.log(res);
}
// 接口返回的数据格式
handleRes({ a: 1, b: 2 });
```

## 判断对象是否存在循环引用

```jsx

```
