QUnit.module("Remove operation");

QUnit.test("Remove a property", function(assert) {
  var doc = { foo: 1 };
  var patches = [
    { op: 'remove', path: '/foo' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, {});
});

QUnit.test("Remove a nested property", function(assert) {
  var doc = { foo: { bar: 42 } };
  var patches = [
    { op: 'remove', path: '/foo/bar' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { foo: {} });
});

QUnit.test("Remove from nested path undefined at level 0", function(assert) {
  var doc = { };
  var patches = [
    { op: 'remove', path: '/foo/bar' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Undefined foo in path/);
});

QUnit.test("Remove from nested path undefined at level 1", function(assert) {
  var doc = { foo: { } };
  var patches = [
    { op: 'remove', path: '/foo/bar/baz' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Undefined bar in path/);
});

QUnit.test("Target path must exist", function(assert) {
  var doc = { foo: { } };
  var patches = [
    { op: 'remove', path: '/foo/bar' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Target path must exist/);
});

QUnit.test("Removing an element from an array", function(assert) {
  var doc = ['foo'];
  var patches = [
    { op: 'remove', path: '/0' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, []);
});

QUnit.test("Removing an element from an array moves items after index left ", function(assert) {
  var doc = ['foo', 'bar', 'baz'];
  var patches = [
    { op: 'remove', path: '/1' }
  ];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, ['foo', 'baz']);
});

QUnit.test("Array indexes must be valid", function(assert) {
  var doc = { foo: [] };
  var patches = [
    { op: 'remove', path: '/foo/bar' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Must be valid array index/);
});

QUnit.test("Array index must be in range", function(assert) {
  var doc = [];
  var patches = [
    { op: 'remove', path: '/1' }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Index out of range/);

});
