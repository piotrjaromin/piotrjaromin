---
layout: post
title:  "NodeJs event loop"
date:   2017-09-03 12:03:06 +0200
categories: event loop libuv nodejs
tags: event loop libuv nodejs
---

NodeJs is single thread process with event loop at its heart. Whenever async operation is made, its callback is stored on one of the event loop queues. Event loop constantly checks if those queues have callbacks in them and executes them. We can split them into a few groups, which are checked in order placed below:
1. timers - for setTimeout() and setInterval callbacks
2. I/O callbacks - most of callbacks is executed here (e.g TCP errors, system operations)
3. idle, prepare - internal usage
5. poll - retrvies I/O events
6. check - for setImmediate callbacks
7. close callbacks - close events, e.g for socket.destroy()

Each of these queues is FIFO (first in, first out), it means that oldest elements are being executed first.
In every event loop iteration each queue is checked, event loop will move on if queue is empty or when some hardcoded limit is reached (to prevent event loop starvation and hanging in one phase).

## libuv

Libuv is native library in which event loop is implemented. It also allows nodejs to use kernel async api. In today operation systems we have native support for async operations we do not need to code it manually or create blocking code ( like ``` data = readFile('file.txt')```). Libuv is library which allows nodejs to take advantage of it. In case that some operations are not implemented to be async, there is possibility of creating internal thread pool(which is not accessible from javascript in node) to which task will be delegated. Thanks to this solution event loop can move one without blocking. The size of a thread pool, which is created by libuv, can be set by environment variable called ```UV_THREADPOOL_SIZE```, by default it is 4. Bear in mind that increasing this value might not have clear influence on performance because node is mostly using this thread pool when there is operation to be executed which is not supported by kernel to be async. Every cpu bound operation (like calculating prime numbers) still will be executed in event loop causing it to block for a while.

When kernel is finished executing async operation it will notify event loop by adding callback to poll queue.

## process.nextTick() vs setImmediate() vs setInterval()
setInterval(callback, minTime) - callback will be executed in timers phase after minTime has passed(it might be later, but not sooner)
process.nextTick(callback) - executes right after current phase, it is possible to stave event loop be nesting nextTick calls.
setImmediate(callback) - executed in check phase.

The truth is that nextTick and setImmediate should probably change switched names.
