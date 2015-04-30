## Choreographer

##### Choreographer is a JavaScript library designed for orchestrating complex sequences of browser animations.

It sprouted from the development [Randy](https://github.com/yaybrigade/randy)'s animation code, which sports numerous timed, sequential CSS transitions and animations. It became a big nuisance trying to dynamically coordinate all those animations using JavaScript, since JavaScript doesn't control CSS animations. When Promises and listening for `transitionend`s became too messy, it became necessary to abstract away the coordination code into its own module. Thus, Choreographer!

---

### Installation

Download the built file:

`$ npm install choreographerjs`

### Documentation

Choreographer's raison d'être is to synchronize a long sequence of animations. It was designed to choreograph CSS animations, but should also work for JavaScript animations. It works by storing a map ("choreography") from times to (arrays of) animation functions. When the `perform()` method is invoked, the Choreographer loops through the keys of the map (which correspond to execution times) and creates a timeout that runs the stored animation functions at that time/key.

An example will make that more clear. Given this choreography

```javascript
{
  0: [ fn1 ],
  300: [ fn2, fn3 ],
  600: [ fn4 ]
}
```

On invocation of `Choreographer.perform()`, three timeouts would be created:

```javascript
setTimeout(function () { fn1(); }, 0);
setTimeout(function () { fn2(); fn3(); }, 300);
setTimeout(function () { fn4(); }, 600);
```

This allows each animation function to run in order, at its specified time. Presumably, the time interval between the keys of `fn1` and `fn2/fn3` is the length of time it takes for `fn1` to complete.

### API

#### Constructor

`var choreographer = new Choreographer([duration]);`

Creates a Choreographer. Optionally takes a positive integer argument to set as the default function duration.

##### Properties
* `duration` — The default length (in milliseconds) of a single animation. If `Choreographer.add()` is called without a duration argument, it will default to this value. If this value is not passed to the constructor, it will be set to 300.

#### Add

`Choreographer.add(fn, [duration]);`

Adds a function at the current time, which is stored as a property of the `Choreographer`. Increases the current time by the value passed for `duration`. If nothing is passed, the current time will be increased by the default set when the `Choreographer` was instantiated. Pass a `duration` of 0 to refrain from increasing the time.

##### Arguments
* `fn` — An animation function to add to the choreography.
* `duration` — An optional duration corresponding to the length of time it takes for `fn` to complete, in milliseconds.

#### Pause

`Choreographer.pause([duration]);`

Creates a pause in the choreography by increasing the current time without adding any functions.

##### Arguments
* `duration` — How long to pause (in milliseconds). Optional, and defaults to the value passed in the constructor.

#### Perform

`Choreographer.perform();`

Executes the functions stored in the choreography

### License

GPLv2
