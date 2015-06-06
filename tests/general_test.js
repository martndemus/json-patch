QUnit.module("General");

QUnit.test("Empty document, no patches", function(assert) {
  var doc = {};
  var patches = [];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, {});
});

QUnit.test("Document is empty array, no patches", function(assert) {
  var doc = [];
  var patches = [];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, []);
});

QUnit.test("No patches", function(assert) {
  var doc = { foo: 1 };
  var patches = [];

  var result = JSONPatch.apply(doc, patches);

  assert.deepEqual(result, { foo: 1 });
});

QUnit.test("Op must be present", function(assert) {
  var doc = {};
  var patches = [
    { path: '/foo/bar', value: 42 }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Missing op/);
});

QUnit.test("Op must be a valid op", function(assert) {
  var doc = {};
  var patches = [
    { op: 'foo', path: '/foo/bar', value: 42 }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Invalid op/);
});

QUnit.test("Path must be present", function(assert) {
  var doc = {};
  var patches = [
    { op: 'add', value: 42 }
  ];

  assert.throws(function() {
    JSONPatch.apply(doc, patches);
  }, /Missing path/);

});

