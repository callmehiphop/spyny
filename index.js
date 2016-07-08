var slice = Array.prototype.slice;

/**
 * Creates a spy, optionally accepting a callback function to be ran when and if
 * the spy is called.
 *
 * @param {function=} callback - The callback function.
 * @return {function} spy - The spy function.
 */
function createSpy(callback) {
  var returnValue;
  var calls = [];

  function spy() {
    var args = slice.call(arguments);

    calls.push({ args: args });

    if (typeof callback === 'function') {
      return callback.apply(this, args);
    }

    return returnValue;
  }

  Object.defineProperties(spy, {
    called: {
      get: function() {
        return calls.length > 0;
      }
    },
    callCount: {
      get: function() {
        return calls.length;
      }
    }
  });

  spy.callWith = function(cb) {
    callback = cb;
  };

  spy.getCall = function(index) {
    return calls[index];
  };

  spy.reset = function() {
    calls.length = 0;
  };

  spy.returns = function(value) {
    returnValue = value;
    return spy;
  };

  return spy;
}

module.exports = createSpy;

/**
 * Spies on a specific method, useful for restoring the method later on.
 *
 * @param {object} obj - The object containing the method to spy on.
 * @param {string} method - The name of the method to spy on.
 * @param {function=} callback - The callback function to be invoked when the
 *     spy is called.
 * @return {function} spy - The spy.
 */
function spyOn(obj, method, callback) {
  var originalMethod = obj[method];
  var spy = obj[method] = createSpy(callback);

  spy.restore = function() {
    obj[method] = originalMethod;
  };

  spy.passthrough = function() {
    spy.callWith(originalMethod);
    return spy;
  };

  return spy;
}

module.exports.on = spyOn;

/**
 * Creates a spy "sandbox", useful for managing multiple spies by resetting or
 * restoring all of them with a single method.
 *
 * @return {object} sandbox - The sandbox.
 */
function createSandbox() {
  var sandbox = {};
  var spies = sandbox.spies = [];

  sandbox.flush = function() {
    spies.length = 0;
  };

  sandbox.reset = function() {
    spies.forEach(function(spy) {
      spy.reset();
    });
  };

  sandbox.restore = function() {
    for (var i = spies.length - 1; i > -1; i--) {
      if (typeof spies[i].restore !== 'function') {
        continue;
      }

      spies[i].restore();
      spies.splice(i, 1);
    }
  };

  sandbox.spy = function(callback) {
    var spy = createSpy(callback);
    spies.push(spy);
    return spy;
  };

  sandbox.spy.on = function(obj, method, callback) {
    var spy = spyOn(obj, method, callback);
    spies.push(spy);
    return spy;
  };

  return sandbox;
}

module.exports.sandbox = createSandbox;