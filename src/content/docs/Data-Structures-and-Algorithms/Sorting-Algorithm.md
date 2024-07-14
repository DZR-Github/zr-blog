---
title: 排序算法
---

## 快排

思想：快速排序（Quick Sort）是一种常见的高效排序算法，其基本思想是通过选取一个基准元素，将数组分成两个子数组，其中一个子数组的所有元素小于基准元素，另一个子数组的所有元素大于基准元素。然后对这两个子数组分别进行快速排序，最终将整个数组排序。

```jsx
const quickSort = (arr, start, end) => {
  if (end - start < 1) return;
  let left = start,
    right = end;
  let pivot = arr[left];
  while (left < right) {
    while (left < right && arr[right] > pivot) {
      right--;
    }
    while (left < right && arr[left] <= pivot) {
      left++;
    }
    if (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      right--;
    }
  }
  [arr[start], arr[right]] = [arr[right], arr[start]];
  quickSort(arr, start, left - 1);
  quickSort(arr, right + 1, end);
};
```

## 归并排序

思想：归并排序（Merge Sort）是一种基于分治法的排序算法，其主要思想是将待排序数组递归地分成两个子数组，直到每个子数组只有一个元素为止，然后合并这些子数组并排序，直到整个数组有序为止。

```jsx
const mergeSort = (arr) => {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid),
    right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
  const res = [];
  let leftIndex = 0,
    rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      res.push(left[leftIndex++]);
    } else {
      res.push(right[rightIndex++]);
    }
  }

  return res.concat(left.slice(leftIndex), right.slice(rightIndex));
};

mergeSort(arr);
```
