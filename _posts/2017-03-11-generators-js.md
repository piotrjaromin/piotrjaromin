---
layout: post
title:  "Generators and iterators"
date:   2018-03-11 10:03:06 +0200
categories: generators yield await nodejs javascript
tags: generators yield await nodejs javascript
---
# Generators and iterators

## Basics

Generators were introduced in ES6. Iterators know how to access single element of collection, on the other hand generators allows for easier creation of iterators.

Below is example of generator function, notice `*` before function name and `yield` keyword.

```javascript
function *names() {
    yield 'Jhon';
    yield 'Mack';
    return 'Kate';
}
```

Now when we will call `names()` it will return iterator which can be used as below.

```javascript

const itr = names();

console.log(itr.next()); // { value: 'Jhon', done: false }
console.log(itr.next()); // { value: 'Mack', done: false }
console.log(itr.next()); // { value: 'Kate', done: true }
console.log(itr.next()); // { value: undefined, done: true }
```

`next` function of iterator return object with two keys `value` and `done`. `done` informs us if iterator has another value to return. Calling `next` when iterator has no more values will result with `undefined` value of `value` field.

Now, what happened here, is that `yield` returns value to `next()` function of iterator. We have used `yield` twice, also we have one return statement that means that we call call next 3 times, after that iterators is done.

As you can see we can make generators which return infite values like below example.

```javascript
function *countToInfinity() {
    let i = 0;
    while(true) {
        yield i++;
    }
}
```

Iterator returned by `countToInfinity` will always have `done` field set to `false` because of infinite loop.

With iterators and generators we are also allowed to pass in values to the `next` call.

```javascript
function *sayHello() {
    const name = yield 'Jack';
    return `Hello ${name}`
}

const itr = sayHello();

console.log(itr.next()); // { value: 'Jack', done: false }
console.log(itr.next('Michel')); // { value: 'Hello Michel', done: true }
```

`yield` keyword has two functions first is to return value to iterator, and second is to pass value from iterator to inside of function(generator).

So what happens here, is when call first `itr.next()`, it will go to `yield` in `sayHello` function and return value at right side, and them pause execution. After second call to next with `itr.next('Michel')` yield will pass 'Michel' string as value to `name` variable and go to line with return statement.

If we do not need to return jack name from `sayHello()` then we can simplify it to this:

```javascript
function *sayHello() {
    const name = yield;
    return `Hello ${name}`
}

const itr = sayHello();

console.log(itr.next()); // { value: undefined', done: false }
console.log(itr.next('Michel')); // { value: 'Hello Michel', done: true }
```

or even to:
```javascript
function *sayHello() {
    return `Hello ${yield}`
}
```

## Asynchronous operations (with promises)

Generators and iterators can alo be used in asynchronous operations.

Here is simple example with usage of [co library](https://www.npmjs.com/package/co).

```javascript
const co = require('co');

function delay(delayMs) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`delayed by ${delayMs} ms`), delayMs)
    })
}

co(function *(){
    var a = delay(600);
    var b = delay(200);
    var c = delay(500);
    var res = yield [a, b, c];
    console.log(res); // [ 'delayed by 600 ms', 'delayed by 200 ms', 'delayed by 500 ms' ]
});
```

`co` function takes in generator function and resolves promises inside it, thanks to this we are able to use promises as they would be synchronous functions which return values.

Currently with es7 for asynchronous operations we ca use `async/await` keywords with instead of generators, but if we are stuck with older versions of nodejs (e.g when using AWS lambda) generators are the way to go.
