(function (context) {

  /**
   * Public | Choreographer
   * ============================================================================
   * An object for handling/synchronizing lots of animations. It was designed to
   * choreograph long-running animations based around CSS transitions and
   * animations, but it would likely also work for JavaScript-based animations.
   *
   * It works by storing a map from times (in milliseconds) to (arrays of)
   * animation functions. Once the perform() method is invoked, the Choreographer
   * sets up a timeout for each time in the map, and it sequentially runs all the
   * functions stored for that time.
   *
   * Example
   * -------
   * If the choreography object were
   *
   * {
   *   0: [ fn1 ],
   *   300: [ fn2, fn3 ],
   *   600: [ fn4 ]
   * }
   *
   * then on invocation of Choreographer.perform(), three timeouts would be
   * created:
   *
   * setTimeout(function () { fn1(); }, 0);
   * setTimeout(function () { fn2(); fn3(); }, 300);
   * setTimeout(function () { fn4(); }, 600);
   *
   * This allows each animation function to run in order. Presumably, the time
   * interval between fn1 and fn2/fn3 corresponds to the length the animation
   * function fn1 takes to complete.
   *
   * Properties
   * ----------
   * - duration [number] -> The default length of a single, given animation. This
   *                        can be changed when you're adding an animation. If
   *                        not passed in the constructor, defaults to 300.
   *
   * - time [number] -> The time at with the animations start. Defaults to 0.
   *
   * - choreography [object] -> A map from times to arrays of functions. The
   *                            times represent the times at which the functions
   *                            in the array will be called.
   */
  function Choreographer(duration) {
    this.duration = duration || 300;
    this.time = 0;
    this.choreography = Object.create(null);
  }

  Choreographer.prototype = Object.create(Object.prototype);
  Choreographer.prototype.constructor = Choreographer;

  /**
   * Public | add()
   * ============================================================================
   * Adds a function to the Choreographer.choreography object at a certain time,
   * thus scheduling it to be run at that time. Each time Choreographer.add() is
   * called, a function is pushed onto the array stored at the current
   * Choreographer.time key in the Choreographer.choreography object. Then, the
   * Choreographer.time property is incremented by the passed duration, so the
   * next array of functions won't be called until the current array has
   * finished.
   *
   * Arguments
   * ---------
   * - fn [function] -> A function to be executed at the choreographed time.
   *
   * - duration [number] -> The length of time (in milliseconds) that the passed
   *                        function will take to run.
   */
  Choreographer.prototype.add = function (fn, duration) {

    if (!fn || typeof fn !== 'function') {
      throw new Error("No function was provided to Choreographer.add()");
    }

    // If there is already a function array at the current time, push the added
    // function onto the array. Otherwise, create the array.
    if (this.choreography[this.time]) {
      (this.choreography[this.time]).push(fn);
    } else {
      this.choreography[this.time] = [ fn ];
    }

    if ((!duration || typeof duration !== 'number') && duration !== 0) {
      var duration = this.duration;
    }

    this.time += duration;

  }

  /**
   * Public | pause()
   * ============================================================================
   * Pauses the execution of functions for a given duration. Works by simply
   * incrementing the Choreographer.time property, so the next function array
   * will not be called for another `duration` milliseconds.
   *
   * Arguments
   * ---------
   * - duration [number] -> A length of time (in milliseconds) to pause.
   */
  Choreographer.prototype.pause = function (duration) {

    if (!duration || typeof duration !== 'number') {
      var duration = this.duration;
    }

    this.time += duration;

  }

  /**
   * Public | perform()
   * ============================================================================
   * Executes the functions stored in Choreographer.choreography by creating
   * timeouts for each function and time.
   */
  Choreographer.prototype.perform = function () {
    for (var time in this.choreography) {
      var taskList = this.choreography[time];
      taskList.forEach(function (fn) {
        setTimeout(fn, time);
      });
    }
  }

  context.Choreographer = Choreographer;

})(this);