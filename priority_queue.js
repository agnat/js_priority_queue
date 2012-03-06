var max_first = exports.max_first = function max_first(a, b) { return a - b; }
  , min_first = exports.min_first = function min_first(a, b) { return b - a; }
  ;

var PriorityQueue = exports.PriorityQueue = function PriorityQueue(compare) {
  if (!(this instanceof PriorityQueue)) return new PriorityQueue(compare);

  compare = compare || max_first;

  var a = [], n = 0;

  function down(parent) {
    var new_element = a[parent]
      , child = 2 * parent
      ;
    while (child <= n) {
      if (child < n) {
        if (compare(a[child + 1], a[child]) > 0) {
          ++child;
        }
      }
      if (compare(new_element, a[child]) < 0) {
        a[parent] = a[child];
        parent = child; 
        child = 2 * parent;
      } else {
        break;
      }
    }
    a[parent] = new_element;
  }

  function up(child) {
    var new_element = a[child]
      , parent = Math.floor(child/2)
      ;
    while (parent >= 1) {
      if (compare(a[parent], new_element) < 0) {
        a[child] = a[parent];
        child = parent;
        parent = Math.floor(child/2);
      } else {
        break;
      }
    }
    a[child] = new_element;
  }

  this.__defineGetter__('length', function() { return n });

  this.insert = function insert(/* elements */) {
    var i = n, j;
    for (j = 0; j < arguments.length; ++j) {
      a[++n] = arguments[j];
    }
    for (++i; i <= n; ++i) {
      up(i);
    }
  }

  this.peek = function peek() {
    if (n >= 1) return a[1];
  }

  this.pop = function pop() {
    if (n < 1) {
      throw new Error('can not pop() empty priority queue');
    }
    var result = a[1];
    a[1] = a[n--];
    down(1);
    return result;
  }

}


//==============================================================================
// Test
//==============================================================================


if (module === require.main) {
  var assert  = require('assert')
    , vows    = require('vows')
    , numbers = []
    ;
  for (var i = 0; i < 100; ++i) {
    numbers.push(Math.random());
  }

  var suite = vows.describe('priority queue').addBatch(
  { 'A new priority queue': 
    { topic: PriorityQueue
    , 'is a PriorityQueue instance': isPriorityQueue
    , 'is empty': function(q) { assert.strictEqual(q.length, 0) }
    }
  , 'A filled priority queue': queueTest(42, 5, 23)
  , 'An inverted priority queue': queueTest(42, 5, 23, min_first)
  , 'A longer priority queue': queueTest.apply(null, numbers)
  });
  suite.reporter = require('vows/lib/vows/reporters/spec');
  suite.run();

  function isPriorityQueue(q) {
    assert.instanceOf(q, PriorityQueue);
  }

  function pqueueWithItems() {
    var items = arguments;
    return function() {
      var q = new PriorityQueue();
      q.insert.apply(q, items);
      return q;
    }
  }

  function queueTest() {
    var items = Array.prototype.slice.call(arguments)
      , cmp = (typeof items[items.length - 1] === 'function') ? items.pop() : max_first
      , sorted = items.sort(cmp)
      , ctx = {}
      ;
    ctx.topic = function() {
      var q = new PriorityQueue(cmp);
      q.insert.apply(q, items);
      return q;
    }
    ctx['returns the items in order'] = function(q) {
      while (sorted.length) {
        assert.strictEqual(q.length, sorted.length);
        assert.strictEqual(q.pop(), sorted.pop());
      }
    }
    return ctx;
  }
}
