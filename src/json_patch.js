if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

(function() {
  var RE_ARRAY_INDEX = /^\d+$/;
  var OPS = [
    'add',
    'remove',
    'replace',
    'move',
    'copy',
    'test'
  ];

  function applyPatch(doc, patch) {
    if (typeof patch.op !== 'string')   { throw new Error('Missing op'); }
    if (typeof patch.path !== 'string') { throw new Error('Missing path'); }
    if (OPS.indexOf(patch.op) === -1)   { throw new Error('Invalid op'); }

    return operations[patch.op](doc, patch);
  }

  function applyPatches(doc, patches) {
    var i;

    for (i = 0; i < patches.length; i++) {
      doc = applyPatch(doc, patches[i]);
    }

    return doc;
  }

  function isArrayIndex(value) {
    return RE_ARRAY_INDEX.test(value);
  }

  var operations = {
    add: function applyAddOp(doc, patch) {
      // Target is root return patch.value as replacement for doc
      if (patch.path === '/') {
        return patch.value;
      }

      // Loop toward the target object
      var parts  = patch.path.split('/').slice(1);
      var target = doc;
      var part;

      while (parts.length > 1) {
        part   = parts.shift();
        target = target[part];

        // Throw if part of the path is not an object
        if (target === undefined) {
          throw new Error('Undefined ' + part + ' in path' + patch.path);
        }
      }

      part = parts.shift();

      // Target is an array
      if (Array.isArray(target)) {
        if (isArrayIndex(part)) {
          var index = Number(part);

          // Index is out of range
          if (index > target.length) {
            throw new Error("Index out of range");
          }

          // Elements at and right of the index ar moved one position to the
          // right
          if (target.length >= (index - 1)) {
            for (var i = target.length - 1; i >= index; i--) {
              target[i + 1] = target[i];
            }
          }

          // Insert value at index
          target[index] = patch.value;
        } else if (part === '-') { // Append to the array
          target.push(patch.value);
        } else {
          throw new Error('Must be valid array index');
        }

      // Target is an object
      } else {
        target[part] = patch.value;
      }

      // Return the document
      return doc;
    },

    remove: function applyRemoveOp(doc, patch) {
      // Loop toward the target object
      var parts  = patch.path.split('/').slice(1);
      var target = doc;
      var part;

      while (parts.length > 1) {
        part   = parts.shift();
        target = target[part];

        // Throw if part of the path is not an object
        if (target === undefined) {
          throw new Error('Undefined ' + part + ' in path' + patch.path);
        }
      }

      part = parts.shift();

      if (Array.isArray(target)) {
        if (isArrayIndex(part)) {
          var index = Number(part);

          if (index >= target.length) {
            throw new Error('Index out of range');
          }

          target.splice(index, 1);
        } else {
          throw new Error('Must be valid array index');
        }
      } else {
        if (part in target) {
          delete target[part];
        } else {
          throw new Error('Target path must exist');
        }
      }

      return doc;
    }
  };

  window.JSONPatch = {
    apply: applyPatches
  };
})();
