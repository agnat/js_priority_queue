exports.PriorityQueue = function PriorityQueue(compare, queue) {
  if (!(this instanceof PriorityQueue)) return new PriorityQueue(compare, queue);

  compare = compare || min_first;
  queue   = queue   || [];

  function swap(i, j) { var t = queue[i]; queue[i] = queue[j]; queue[j] = t; }

  function heapify(i) {
    var l = queue.length, x;
    while (true) {
      x = i;
      if (left(i)  < l && compare(queue[left(i)],  queue[x]) > 0) x = left(i);
      if (right(i) < l && compare(queue[right(i)], queue[x]) > 0) x = right(i);
      if (x === i) break;
      swap(i, x);
      i = x;
    }
  }

  this.push = function push(/* element, ... */) {
    var i = queue.length, e = i + arguments.length, j;
    queue.push.apply(queue, arguments);
    for (; i < e; ++i) {
      for(j = i; j >= 0 && compare(queue[j], queue[parent(j)]) > 0; j = parent(j)) {
        swap(j, parent(j));
      }
    }
    return queue.length;
  }

  function remove(i) {
    var t = queue[i], b = queue.pop();
    if (queue.length > 0) {
      queue[i] = b;
      heapify(i);
    }
    return t;
  }

  this.pop = function pop() { return remove(0); }
  this.__defineGetter__('length', function length() { return queue.length });

  for (var i = queue.length / 2 - 1; i >= 0; --i) { heapify(i) }
}

function left(i)   { return 2 * i + 1 }
function right(i)  { return 2 * i + 2 }
function parent(i) { return Math.floor((i + 1) / 2) - 1 }

var max_first = exports.max_first = function max_first(a, b) { return a - b; }
  , min_first = exports.min_first = function min_first(a, b) { return b - a; }
  ;

