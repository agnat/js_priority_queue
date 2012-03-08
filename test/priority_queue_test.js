#!/usr/bin/env node

var pq     = require('../priority_queue')
  , assert = require('assert')
  , vows   = require('vows')

  , PriorityQueue = pq.PriorityQueue

var suite = vows.describe('priority queue').addBatch(
{ 'A priority queue': 
  { topic: makeQueue()
  , 'is a PriorityQueue instance': isPriorityQueue
  , 'is empty': hasLength(0)
  , 'shift() returns undefined': shiftReturns(undefined)
  , 'with five items pushed':
    { topic: push(2, 1, 3, Math.PI, 0)
    , 'obeys the heap property': assertHeap
    , 'has a length of five': hasLength(5) 
    , 'returns its items in ascending order': assertOrdering(asc)
    , 'is empty': hasLength(0)
    , 'holds while pushing and shifting 1000 random values': pushAndShift(1000, asc, 0)
    , 'is empty again': hasLength(0)
    }
  }
, 'A priority queue with descending order':
  { topic: makeQueue(pq.max_first)
  , 'is a PriorityQueue instance': isPriorityQueue
  , 'is empty': hasLength(0)
  , 'shift() returns undefined': shiftReturns(undefined)
  , 'and five items pushed':
    { topic: push(2, 1, 3, Math.PI, 0)
    , 'obeys the heap property': assertHeap
    , 'has a length of five': hasLength(5) 
    , 'returns its items in descending order': assertOrdering(desc)
    , 'is empty': hasLength(0)
    , 'holds while pushing and shifting 1000 random values': pushAndShift(1000, desc, 0)
    , 'is empty again': hasLength(0)
    }
  }
, 'A queue with initial data':
  { topic: makeQueue(pq.min_first, [1, 4, 2, 23, 0, -99])
  , 'has a length of six': hasLength(6)
  , 'obeys the heap property': assertHeap
  , 'and five items pushed':
    { topic: push(2, 1, 3, Math.PI, 0)
    , 'obeys the heap property': assertHeap
    , 'returns its items in ascending order': assertOrdering(asc)
    , 'holds while pushing and shifting 1000 random values': pushAndShift(1000, asc, 0)
    }
  }
}).export(module);

function isPriorityQueue(t) { assert.instanceOf(t.queue, PriorityQueue) }
function hasLength(n) { 
  return function(t) {
    assert.strictEqual(t.queue.length, n) 
    assert.strictEqual(t.store.length, n) 
  }
}
function shiftReturns(v) {
  return function(t) {
    assert.deepEqual(t.queue.shift(), v)
  }
}

function parent(i) { return Math.floor((i + 1) / 2) - 1 }

function assertHeap(t) {
  for (var i = 1; i < t.store.length; ++i) {
    assert.isTrue(t.compare(t.store[i], t.store[parent(i)]) >= 0)
  }
}

function push(/* element, ... */) {
  var elements = Array.prototype.slice.call(arguments);
  return function (t) { t.queue.push.apply(t.queue, elements); return t }
}

function makeQueue(compare, initital_data) {
  initital_data = initital_data || []
  compare = compare || pq.min_first
  return { queue: pq.PriorityQueue(compare, initital_data)
         , store: initital_data
         , compare: compare
         }
}

function assertOrdering(test) {
  return function(t) {
    assert.isTrue(t.queue.length > 0)
    var p = t.queue.shift(), v;
    assertHeap(t)
    while (t.queue.length > 0) {
      v = t.queue.shift();
      assertHeap(t)
      assert.isTrue(test(v,p))
      p = v;
    }
  }
}

function asc(a, b) { return a >= b}
function desc(a, b) { return a <= b}

function pushAndShift(n, test, extrem) {
  return function(t) {
    var v, out;
    for (var i = 0; i < n; ++i) {
      v = Math.random() * 2000 - 1000
      if ( ! test(v, extrem)) {
        extrem = v;
      }
      t.queue.push(v)
      assertHeap(t)
      out = t.queue.shift()
      assert.isTrue(test(out, extrem));
      extrem = out;
      assertHeap(t)
    }
  }
}

// vim: set filetype=javascript :
