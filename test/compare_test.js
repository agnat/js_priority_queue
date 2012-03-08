#!/usr/bin/env node

var pq     = require('../priority_queue')
  , assert = require('assert')
  , vows   = require('vows')

  , PriorityQueue = pq.PriorityQueue

function compare_todo(a, b) { return b.priority - a.priority }
var todos =
[ { task: 'write tests'
  , priority: 5
  }
, { task: 'enjoy the spring'
  , priority: 99
  }
, { task: 'have coffee'
  , priority: 50
  }
]

var suite = vows.describe('compare functions').addBatch(
{ 'A queue sorting ToDo items':
  { topic: PriorityQueue(compare_todo, todos)
  , "puts top priority on the good stuff": function(q) {
      assert.strictEqual(q.shift().task, 'enjoy the spring')
    }
  }
}).export(module)

