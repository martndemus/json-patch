QUnit.module('Add operation');

QUnit.test("Add to undefined property", function(assert) {
  var doc = { foo: undefined };
  var patches = [
    { op: 'add', path: '/foo', value: 1 }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { foo: 1 });
});

QUnit.test("Add a property", function(assert) {
  var doc = {};
  var patches = [
    { op: 'add', path: '/foo', value: 1 }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { foo: 1 });
});

QUnit.test("Add to nested path", function(assert) {
  var doc = { foo: {} };
  var patches = [
    { op: 'add', path: '/foo/bar', value: 'baz' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { foo: { bar: 'baz' } });
});

QUnit.test("Add to nested path undefined at level 0", function(assert) {
  var doc = { };
  var patches = [
    { op: 'add', path: '/foo/bar', value: 'baz' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Undefined foo in path/);
});

QUnit.test("Add to nested path undefined at level 1", function(assert) {
  var doc = { foo: {} };
  var patches = [
    { op: 'add', path: '/foo/bar/baz', value: 'quux' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Undefined bar in path/);
});

QUnit.test("Add a value to an array", function(assert) {
  var doc = [];
  var patches = [
    { op: 'add', path: '/0', value: 'foo' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, ['foo']);
});

QUnit.test("Add a value to an moves items on and after index", function(assert) {
  var doc = ['bar', 'baz'];
  var patches = [
    { op: 'add', path: '/0', value: 'foo' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, ['foo', 'bar', 'baz']);
});

QUnit.test("Add append a value to an array", function(assert) {
  var doc = ['foo', 'bar'];
  var patches = [
    { op: 'add', path: '/-', value: 'baz' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, ['foo', 'bar', 'baz']);
});

QUnit.test("Add append a value to an array", function(assert) {
  var doc = ['foo', 'bar'];
  var patches = [
    { op: 'add', path: '/-', value: 'baz' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, ['foo', 'bar', 'baz']);
});

QUnit.test("Add append a value to an array, using index", function(assert) {
  var doc = ['foo', 'bar'];
  var patches = [
    { op: 'add', path: '/2', value: 'baz' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, ['foo', 'bar', 'baz']);
});

QUnit.test("Add array index out of range", function(assert) {
  var doc = [];
  var patches = [
    { op: 'add', path: '/2', value: 'foo' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Index out of range/);
});

QUnit.test("Array index must be valid", function(assert) {
  var doc = [];
  var patches = [
    { op: 'add', path: '/bar', value: 'foo' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Must be valid array index/);
});

QUnit.test("Array index is object property", function(assert) {
  var doc = {};
  var patches = [
    { op: 'add', path: '/42', value: 'foo' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { '42': 'foo' });
});

QUnit.test("Append array index as object property", function(assert) {
  var doc = {};
  var patches = [
    { op: 'add', path: '/-', value: 'foo' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { '-': 'foo' });
});

QUnit.test("Replace root", function(assert) {
  var doc = 'foo';
  var patches = [
    { op: 'add', path: '/', value: 'bar' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, 'bar');
});


