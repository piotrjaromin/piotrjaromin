---
layout: post
title:  "Basic sorting structures"
date:   2017-08-30 10:03:06 +0200
categories: sorting algorithms
tags: sorting algorithms
---

### Bubble Sort
In most basic form bubble sort is iterating array and comparing neighboring elements. 
If first compared element is greater than second then they are switched and iteration continues. 
If first element is lesser or equal second then nothing happens and iteration continues.

In worst case scenario when no optimizations are applied bubble sort needs to iterate n-element array n*n-1 times.

```javascript
for (let i = 1; i < len; i ++ ) {
    for(let j = 0; j < len - i; j++ ) {

        if ( array[j] > array[j + 1]) {
            swap(j,j + 1, array);
        }
    }
}
```

Big-O: Time Complexity Θ(n^2); Space Complexity  Θ(1)

### Selection Sort
Selection sort in each iteration is searching for lowest value in array, when lowest value is found it swaps lowest value with head of array.
In next iteration search is performed again but with omitting first value because it is already sorted. 
Consecutive iterations are skipping more elements at the beginning of array until there is no more elements to sort. 


```javascript
for (let i = 0; i < len; i++ ) {
    let minIndex = i;
    for(let j = i; j < len; j++ ) {
        if ( array[j] < array[minIndex]) {
            minIndex = j;
        }
    }
    swap(i, minIndex, array);
}
```

Big-O: Time Complexity Θ(n^2); Space Complexity  Θ(1)

### Insertion Sort
Insertion sort splits array in two, first half contains sorted data and second half contains unsorted data.
With each iteration item is taken from unsorted part, and inserted in right position of sorted part.

```javascript
//assume first element is already sorted
for (let i = 1; i < len; i++ ) {
    
    const currentValue = remove(i, array);;
  
    let insertIndex = 0;
    while( currentValue > array[insertIndex] && insertIndex < i ) {
        insertIndex++;
    }

    insert(insertIndex, currentValue, array);
}
```

Big-O: Time Complexity Θ(n^2); Space Complexity  Θ(1)

### Merge Sort
Faster than previous ones, but takes more memory. Consist of two parts:
1. Splitting array to smaller pieces (until one item array is reached)
2. Merging small arrays into bigger ones but with sorting order applied

```javascript
function mergeSort(begin, end) {

    if ( begin < end ) {
        const middle = Math.floor( (begin + end) / 2);

        mergeSort(begin, middle);
        mergeSort(middle + 1, end);
        merge(begin, middle, end);
    }
}

function merge(begin, middle, end) {
    const tempArr =[];
    for(let i = begin; i <= end; i++) { tempArr[i] = array[i]; }
    let i = begin, j = middle + 1, index = begin;

    while ( i <= middle && j <= end ) {
        if ( tempArr[i] < tempArr[j] ) {
            array[index] = tempArr[i++];
        }
        else {
            array[index] = tempArr[j++];
        }
        index++;
    }

    //copy remaining elements
    while ( i <= middle) array[index++]=tempArr[i++];
    while ( j <= end) array[index++]=tempArr[j++];
}

mergeSort(0, array.length - 1);
```

Big-O: Time Complexity Θ(nlogn(n)); Space Complexity  Θ(n)

#### Quick Sort
In quick sort we are selecting pivot.
When pivot is selected we are placing number that are lower than it on left side, and parts that are higher than it on right side.
When there is no more elements to move, then are is split in two, elements at the right side of pivot and at the left side of pivot.
For both parts of arrays process is repeated recursively. End of recursion is when we reach one element sub-array.

```javascript
function quickSort(left, right) {
    
    if ( right <= left ) { return; }

    let wall = left;
    let pivot = right;

    for( let i = wall; i < pivot; i++ ) {
        if ( array[i] < array[pivot] ) {
            swap(wall, i, array);
            wall++;
        }
    }

    swap(wall, pivot, array);
    quickSort(left, wall - 1);
    quickSort(wall + 1, right);
}

quickSort(0, array.length - 1);
```

Big-O: Time Complexity Θ(n^2) usually Θ(nlogn); Space Complexity  Θ(n)


### Helper functions

```javascript
function swap(index1, index2, array) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

function insert(index, item, array) {
    array.splice(index, 0, item)
}

function remove(index, array) {
    return array.splice(index, 1)[0];
}
```