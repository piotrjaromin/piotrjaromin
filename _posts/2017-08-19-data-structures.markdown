---
layout: post
title:  "Basic data structures"
date:   2017-08-19 17:03:06 +0200
categories: data structures algorithms
tags: data structures algorithms
---

### Array
Collections of elements identified by index.
Big-O: Access Θ(1); Search Θ(n); Insertion Θ(n); Deletion Θ(n)

### Stack
Works as LIFO.
Adds new element to the tail, and also removes elements from tail.

Big-O: Access Θ(n); Search Θ(n); Insertion Θ(1); Deletion Θ(1)

### Queue
Works as FIFO.
Adds new elements to tail but removes elements from head.

Priority queue - can insert new element onto any position based on priority

Big-O: Access Θ(n); Search Θ(n); Insertion Θ(1); Deletion Θ(1)

### List
Ordered sequence of elements

#### Linked list
Stores nodes pointing to other nodes.
If node have reference to next node or null(end of list) - single linked list.
If node has reference to previous and next node then it is double linked list.

head - start of list
tail - end of list

Circularly connected list - tail points to head

Big-O: Access Θ(n); Search Θ(n); Insertion Θ(1); Deletion Θ(1)

### Set
Unordered sequence of unique elements

#### HashSet
Elements inserted into Set are first passed through hash function.
Can be backed by HashMap.

Big-O: Access Θ(1); Search Θ(1); Insertion Θ(1); Deletion Θ(1)

### Map
Key value store.

#### HashMap
Key value store, usually backed by array. Keys are converted by hashing function to numbers and inserted into array.
If duplicate value occurs it can be either avoided by adding linked list to array with elements with the same hash
or other methods can be used(linear probing - incrementing hash by one till empty slot is found).

Big-O: Access Θ(1); Search Θ(1); Insertion Θ(1); Deletion Θ(1)

### Trees
Hierarchical structure, which consist of root and child nodes. Nodes contain values and references to child nodes.

Leaf - child node without children.
Tree level - amount of horizontal levels numbered from zero (root).

### B-Tree
Tree where each node has only two values.
Value on the left is always lower than node value, and value on the right is always greater.

Big-O: Access Θ(logn(n)); Search Θ(logn(n)); Insertion Θ(logn(n)); Deletion Θ(logn(n))

### Graphs
Graphs are structures consisting of vertices and edges. 
Edges are connecting vertices. 
Graphs can be directed (vertices will have direction point from one edge to another) or undirected.
Edges can also have value. If each vertices has edge to all others vertices then graph is connected.
 
Graphs can be traversed with Depth first search (backed by stack) or by Breadth first search (queue).