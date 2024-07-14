---
title: 数据处理
---

## JavaScript 构造树形结构

```jsx
const listToTree = (list, rootValue) => {
  const res = { id: rootValue };

  list.forEach((item) => {
    const parentNode = list.find((node) => node.id === item.parentId);
    if (item.id !== rootValue) {
      parentNode.children = parentNode.children || [];
      parentNode.children.push(item);
    } else {
      res.children = list.filter((node) => node.parentId === item.id);
    }
  });

  return res;
};

//map优化版
const buildTree = (list, rootValue) => {
  const map = new Map();

  for (let i = 0; i < list.length; i++) {
    map.set(list[i].id, list[i]);
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].id !== rootValue) {
      const parentNode = map.get(list[i].parentId);
      parentNode.children = parentNode.children || [];
      parentNode.children.push(list[i]);
    }
  }
  return map.get(rootValue);
};

const list = [
  {
    id: 1,
    parentId: null,
  },
  {
    id: 3,
    parentId: 1,
  },
  {
    id: 4,
    parentId: 1,
  },
  {
    id: 5,
    parentId: 3,
  },
  {
    id: 6,
    parentId: 4,
  },
  {
    id: 7,
    parentId: 6,
  },
];
```

## 日期格式化函数

```jsx

```

## 数组乱序输出

```jsx

```

## 数组扁平化

```jsx

```

## 数组去重

```jsx

```

## 数组 flat 方法

```jsx

```

## 数组 push 方法

```jsx

```

## 数组 filter 方法

```jsx

```

## 数组 map 方法

```jsx

```

## 字符串 repeat 方法

```jsx

```

## 字符串反转

```jsx

```

## 将数字每千分位用逗号隔开

```jsx

```

## 非负大整数相加

```jsx

```

## 实现 add(1)(2)(3)

```jsx

```

## 实现类数组转化为数组

```jsx

```

## 使用 reduce 求和

```jsx

```

## 解析 URL Params 为对象

```jsx

```
