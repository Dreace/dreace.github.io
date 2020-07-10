---
title: TopK 问题两种解决方案：堆、快排变形
typora-root-url: ../../source/
date: 2020-07-10 12:31:47
tags:
 - 算法
 - C++
categories:
 - 算法
---

这里的 TopK 不单指最大的 $k$ 个元素，也可以是最小的 $k$ 个元素，具体的例题可以看 [剑指 Offer 40. 最小的k个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)。本文的代码均为可以在力扣提交的题解，故不包含头文件和 `main` 函数。

<!-- more -->

## 堆

看到这种题，最先想到的可能是直接使用已有的排序函数，但是其时间复杂度为 $O(n \log n)$，大量的排序工作是多余。

一个优化的想法是，建立一个大小为 $k$ 的堆（针对求最小的 $k$ 个元素使用最大堆），只需要一次遍历将遍历到的元素和堆顶元素比较，若比堆顶小，则替换堆顶，然后进行堆调整。遍历完成后，堆中就是要求的最小的 $k$ 个元素（无序的）。

通过堆优化后时间复杂度为 $O(n \log k)$。

```cpp
class Solution {
public:
    vector<int> getLeastNumbers(const vector<int> &arr, int k) {
        vector<int> ans(k, 0);
        if (k == 0) {
            return ans;
        }
        // 建堆
        for (int i = 0; i < k; ++i) {
            ans[i] = arr[i];
        }
        for (int i = k / 2 - 1; i >= 0; --i) {
            adjust(ans, i);
        }
        int n = arr.size();
        for (int i = k; i < n; ++i) {
            // 比堆中最大的要小
            if (arr[i] < ans[0]) {
                // 替换
                ans[0] = arr[i];
                // 调整后堆顶是最大的元素
                adjust(ans, 0u);
            }
        }
        return ans;
    }


    void adjust(vector<int> &heap, uint32_t index) {
        uint32_t t = index;
        // 左孩子
        if ((index << 1u) + 1 < heap.size() && heap[(index << 1u) + 1] > heap[t]) {
            t = (index << 1u) + 1;
        }
        // 右孩子
        if ((index << 1u) + 2 < heap.size() && heap[(index << 1u) + 2] > heap[t]) {
            t = (index << 1u) + 2;
        }
        // 孩子节点比父节点大
        if (t != index) {
            std::swap(heap[index], heap[t]);
            // 递归调整
            adjust(heap, t);
        }
    }
};
```

## 快排

这里不是真的快排，而是借助快排的思想，将元素划分成比中间元素后大或小的两部分后，再对其中的一个部分再次划分。快排的思想是分治，这里解决 TopK 的思想是减治，因为划分后不符合条件的部分直接舍弃掉。

该方法的期望时间复杂度 $O(n)$，最坏时间复杂度 $O(n^2)$，因为可能每次选取的中间值都是最大值，为了解决这个问题，可以随机选择中间值（被注释掉的三行代码）。

```cpp
class Solution {
public:
    std::vector<int> getLeastNumbers(std::vector<int> &arr, int k) {
        uint32_t left = 0, right = arr.size() - 1;
//        srand(time(nullptr));
        while (left < right) {
//            int t = rand() % (right - left + 1) + left;
//            std::swap(arr[left], arr[t]);
            int pivot = arr[left];
            int i = left, j = right;
            // 完成后以 i 为分界，左半部分比 arr[i] 小，右半部分比 arr[i] 大
            while (i <= j) {
                // 寻找左半部分比 pivot 大的元素
                while (i <= j && arr[i] < pivot) {
                    ++i;
                }
                // 寻找右半部分比 pivot 小的元素
                while (i <= j && arr[j] > pivot) {
                    --j;
                }
                if (i <= j) {
                    std::swap(arr[i], arr[j]);
                    ++i;
                    --j;
                }
            }
            if (i >= k) {
                // 大于等于 k 个
                right = i - 1;
            } else {
                // 小于 k 个
                left = i;
            }
        }
        return std::vector<int>(arr.begin(), arr.begin() + k);
    }
};
```

## 两种算法的选择

在数据量比较小时，两个算法没有太大的区别。

但是当数据量达到十亿级别（腾讯面试被问过这个问题）使用快排需要将所有数据读入内存（当然也可以优化，但是会更复杂）。

而使用堆只需要维护一个大小为 $k$ 的堆（实际来说是数组），由于只需要遍历一次数据，数据读入一次就行了，对磁盘的操作可以很少。相比 CPU 的速度，磁盘 I/O 的时间有数量级上的差异。

因此在大数据量上应该选择堆。