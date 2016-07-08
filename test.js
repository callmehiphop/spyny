var assert = require('assert');
var spy = require('./');

describe('spy', function() {

  describe('creating spies', function() {
    it('should create a spy function', function() {
      assert.strictEqual(typeof spy(), 'function');
    });

    it('should capture the arguments it was called with', function() {
      var func = spy();

      func(1, 2, 3);
      func('a', 'b', 'c');

      assert.deepEqual(func.getCall(0).args, [1, 2, 3]);
      assert.deepEqual(func.getCall(1).args, ['a', 'b', 'c']);
    });

    it('should execute a callback if provided', function() {
      var func = spy(function(thing) {
        return thing === true ? 'a' : 'b';
      });

      var a = func(true);
      var b = func();

      assert.strictEqual(a, 'a');
      assert.strictEqual(b, 'b');
    });

    it('should return the static return value if provided', function() {
      var func = spy().returns('hi');

      assert.strictEqual(func(), 'hi');
    });

    it('should return a boolean stating if it was called', function() {
      var func = spy();

      assert.strictEqual(func.called, false);
      func();
      assert.strictEqual(func.called, true);
    });

    it('should return the number of times it was called', function() {
      var func = spy();

      assert.strictEqual(func.callCount, 0);
      func();
      assert.strictEqual(func.callCount, 1);
      func();
      func();
      assert.strictEqual(func.callCount, 3);
    });

    it('should reset all the properties', function() {
      var func = spy();

      func();
      func();
      assert.strictEqual(func.called, true);
      assert.strictEqual(func.callCount, 2);

      func.reset();
      assert.strictEqual(func.called, false);
      assert.strictEqual(func.callCount, 0);
    });

    it('should set the callback function', function() {
      var func = spy();

      func.callWith(function(arg) {
        assert.strictEqual(arg, 'hi');
        return 'yo';
      });

      assert.strictEqual(func('hi'), 'yo');
    });
  });

  describe('spying on methods', function() {
    it('should spy on an objects method', function() {
      var test = {
        method: function() {
          throw new Error('Should not be fired!');
        }
      };

      spy.on(test, 'method').returns('yo');
      assert.strictEqual(test.method(), 'yo');
    });

    it('should restore to the methods previous state', function() {
      var test = {
        method: function() {
          return 'hi';
        }
      };

      spy.on(test, 'method').returns('yo');
      test.method.restore();
      assert.strictEqual(test.method(), 'hi');
    });

    it('should pass through to the original method', function() {
      var test = {
        method: function() {
          return 'howdy';
        }
      };

      spy.on(test, 'method').passthrough();
      assert.strictEqual(test.method(), 'howdy');
      assert.strictEqual(test.method.called, true);
    });
  });

  describe('creating a sandbox', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = spy.sandbox();
    });

    it('should reset all the spies', function() {
      var spy1 = sandbox.spy();
      var spy2 = sandbox.spy();

      spy1();
      spy2();
      spy2();

      assert.strictEqual(spy1.callCount, 1);
      assert.strictEqual(spy2.callCount, 2);

      sandbox.reset();

      assert.strictEqual(spy1.callCount, 0);
      assert.strictEqual(spy2.callCount, 0);
    });

    it('should restore all previous method states', function() {
      var test = {
        method1: function() {
          return 'hi';
        },
        method2: function() {
          return 'bye';
        }
      };

      sandbox.spy.on(test, 'method1').returns('yo');
      sandbox.spy.on(test, 'method2').returns('later');

      assert.strictEqual(test.method1(), 'yo');
      assert.strictEqual(test.method2(), 'later');

      sandbox.restore();

      assert.strictEqual(test.method1(), 'hi');
      assert.strictEqual(test.method2(), 'bye');
    });

    it('should flush any cached spies', function() {
      sandbox.spy();
      sandbox.spy();

      assert.strictEqual(sandbox.spies.length, 2);

      sandbox.flush();

      assert.strictEqual(sandbox.spies.length, 0);
    });
  });

});