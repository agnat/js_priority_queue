var max_first = exports.max_first = function max_first(a, b) { return a - b; }
  , min_first = exports.min_first = function min_first(a, b) { return b - a; }
  ;

function PriorityQueue(compare, content){
  if (!(this instanceof PriorityQueue)) return new PriorityQueue(compare);

  content = content || [];
  compare = compare || max_first;

  function up(n) {
    var element = content[n] , parentN , parent;
    while (n > 0) {
      parentN = Math.floor((n + 1) / 2) - 1;
      parent = content[parentN];
      if (compare(parent, element) < 0) {
        content[parentN] = element;
        content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  function down(n) {
    var length = content.length,
        element = content[n];

    while(true) {
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      var swap = null;
      if (child1N < length) {
        var child1 = content[child1N];
        if (compare(element, child1) < 0)
          swap = child1N;
      }
      if (child2N < length) {
        var child2 = content[child2N];
        if (compare(swap == null ? element : child1, child2) < 0)
          swap = child2N;
      }
      if (swap != null) {
        content[n] = content[swap];
        content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }

  this.push = function push(/* element, ... */) {
    var old_length = content.length
      , length = old_length + arguments.length;
    content.push.apply(content, arguments);
    for (var i = old_length; i < length; ++i) {
      up(i);
    }
  }

  this.pop = function pop() {
    var result = content[0]
      , back = content.pop();
    if (content.length > 0) {
      content[0] = back;
      down(0);
    }
    return result;
  }

  this.__defineGetter__('length', function() { return content.length });
};

var assert = require('assert');

var q = new PriorityQueue();

q.push(15, 23, 1, 222, 11, 23, 0, -2, 0, 124, -300, 1000);
for (var i = 0; i < 10; ++i) {
  console.log('================================');
  for (var j = 0; j < 5; ++j) {
    console.log(q.pop());
  }
  for (var j = 0; j < 5; ++j) {
    q.push(Math.random() * 2000 - 1000);
  }
}
console.log('================================');
while (q.length) { console.log(q.pop()) }

