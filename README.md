# spyny

> A tiny spy library for Node.js.

### `spy([callback])`

Use the `spy` function to create a new spy.

```js
var spy = require('spyny');
var mySpy = spy();
```

You can also provide a callback to be ran when the spy is called. It will recieve all arguments that are passed to the spy.

```js
var mySpy = spy(function(name) {
  return 'Hello, ' + name + '!';
});

console.log(mySpy('Dave'));
// Hello, Dave!
```

#### `called`

Check if a spy was called.

```js
mySpy();
console.log(mySpy.called);
// true
```

#### `callCount`

Check how many times a spy was called.

```js
mySpy();
mySpy();
console.log(mySpy.callCount);
// 2
```

#### `callWith()`

Alternative way of setting the spy callback.

```js
mySpy.callWith(function(name) {
  return 'Yo, ' + name + '!';
});

console.log(mySpy('Dave'));
// Yo, Dave!
```

#### `getCall()`

Get the details of a specific call.

```js
mySpy('yo!');
console.log(mySpy.getCall(0));
// {
//   args: ['yo!']
// }
```

#### `reset()`

Flush all previous call data.

```js
mySpy();
mySpy.reset();
console.log(mySpy.called);
// false
```

#### `returns()`

Assign a return value for the spy.

```js
mySpy.returns('Howdy!');
console.log(mySpy());
// Howdy!
```

===

### `spy.on(obj, method, [callback])`

Spy on an objects method. Contains all properties and methods of `spy()`.

```js
var Dave = {
  greet: function(person) {
    return 'Hello, ' + person + '!';
  }
};

spy.on(Dave, 'greet').returns('Howdy');
console.log(Dave.greet('Gabe'));
// Howdy
```

You can also pass in a callback to be invoked.

```js
spy.on(Dave, 'greet', function(person) {
  return 'Howdy, ' + person + '.';
});

console.log(Dave.greet('Gabe'));
// Howdy, Gabe.
```

#### `restore()`

Restore a method to its previous state.

```js
spy.on(Dave, 'greet');
Dave.greet.restore();
console.log(Dave.greet('Gabe'));
// Hello, Gabe!
```

#### `passthrough()`

When called it instructs the spy to use the original method as the callback.

```js
spy.on(Dave, 'greet').passthrough();
console.log(Dave.greet('Gabe'));
// Hello, Gabe!
console.log(Dave.greet.getCall(0));
// {
//   args: ['Gabe']
// }
```

===

### `spy.sandbox()`

Create a sandbox object to contain all of your spies. Useful for mass cleanups.

```js
var sandbox = require('spyny').sandbox();
var spy = sandbox.spy;
```

#### `spy([callback])`

Creates a spy contained within the sandbox. Contains the same properties and methods as a normal `spy`.

```js
var sandbox = require('spyny').sandbox();
var spy = sandbox.spy;
var mySpy = spy();

mySpy();
console.log(mySpy.called);
// true
```

#### `spy.on(obj, method, [callback])`

Creates a spy for an object's method within the sandbox. Contains the same properties and methods as a normal `spy.on()`

```js
var sandbox = require('spyny').sandbox();
var spy = sandbox.spy;

spy.on(Dave, 'greet').passthrough();
console.log(Dave.greet.called);
// false
```

#### `reset()`

Resets all spies within the sandbox.

```js
var sandbox = require('spyny').sandbox();
var spy = sandbox.spy;
var spy1 = spy();
var spy2 = spy();

spy1();
spy2();
spy2();

sandbox.reset();

console.log(spy1.called);
// false
console.log(spy2.callCount);
// 0
```

#### `restore()`

Restores all spies created via `spy.on()` to previous state.

```js
var sandbox = require('spyny').sandbox();
var spy = sandbox.spy;

spy.on(Dave, 'greet', function() {
  return 'asdf!';
});

sandbox.restore();
console.log(Dave.greet('Gabe'));
// Hello, Gabe!
```

#### `flush()`

Clear all cached spies from the sandbox. *Note:* this does not restore/reset spies, this simply clears them all from the sandbox cache.

```js
var sandbox = require('spyny').sandbox();
var spy = sandbox.spy;

spy.on(Dave, 'greet', function() {
  return 'hi';
});

sandbox.flush();
sandbox.restore(); // `Dave.greet` is still a spy


```

## License

ISC