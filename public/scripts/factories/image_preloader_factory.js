/*
 * Author: Alton Lau
 * Date: March 7, 2017
 * File: image_preloader_factory.js
 * Description: Preloads images for future use
 */

angular.module('altonApp').factory('imagePreloader', function ($rootScope, $q) {
  function Preloader(imageLocations) {
    this.imageLocations = imageLocations;
    this.imageCount = this.imageLocations.length;
    this.loadCount = 0;
    this.errorCount = 0;
    this.states = {
      PENDING: 1,
      LOADING: 2,
      RESOLVED: 3,
      REJECTED: 4
    };
    this.state = this.states.PENDING;
    this.deferred = $q.defer();
    this.promise = this.deferred.promise;
  }

  // STATIC METHODS
  Preloader.preload = function (imageLocations) {
    var preloader = new Preloader(imageLocations);
    return (preloader.load());
  };

  // INSTANCE METHODS
  Preloader.prototype = {
    constructor: Preloader,
    // PUBLIC METHODS
    // Determine if the preloader has started loading images yet.
    isInitiated: function isInitiated() {
      return (this.state !== this.states.PENDING);
    },
    // Determine if the preloader has failed to load all of the images.
    isRejected: function isRejected() {
      return (this.state === this.states.REJECTED);
    },
    // Determine if the preloader has successfully loaded all of the images.
    isResolved: function isResolved() {
      return (this.state === this.states.RESOLVED);
    },
    // Initiate the preload of the images. Returns a promise.
    load: function load() {
      // If the images are already loading, return the existing promise.
      if (this.isInitiated()) {
        return (this.promise);
      }
      this.state = this.states.LOADING;

      if (this.imageCount) {
        for (var i = 0; i < this.imageCount; i++) {
          this.loadImageLocation(this.imageLocations[i]);
        }
      } else {
        this.deferred.resolve();
      }
      // Return the deferred promise for the load event.
      return (this.promise);
    },
    // PRIVATE METHODS
    // Handle the load-failure of the given image location.
    handleImageError: function handleImageError(imageLocation) {
      this.errorCount++;
      // If the preload action has already failed, ignore further action.
      if (this.isRejected()) {
        return;
      }
      this.state = this.states.REJECTED;
      this.deferred.reject(imageLocation);
    },
    // Handle the load-success of the given image location.
    handleImageLoad: function handleImageLoad(imageLocation) {
      this.loadCount++;
      // If the preload action has already failed, ignore further action.
      if (this.isRejected()) {
        return;
      }

      this.deferred.notify({
        percent: Math.ceil(this.loadCount / this.imageCount * 100),
        imageLocation: imageLocation
      });

      // If all of the images have loaded, we can resolve the deferred
      // value that we returned to the calling context.
      if (this.loadCount === this.imageCount) {
        this.state = this.states.RESOLVED;
        this.deferred.resolve(this.imageLocations);
      }
    },

    // I load the given image location and then wire the load / error
    // events back into the preloader instance.
    // --
    // NOTE: The load/error events trigger a $digest.
    loadImageLocation: function loadImageLocation(imageLocation) {
      var preloader = this;
      var image = angular.element(new Image()).bind('load', function (event) {
        // Since the load event is asynchronous, we have to
        // tell AngularJS that something changed.
        $rootScope.$apply(function () {
          preloader.handleImageLoad(event.target.src);
          // Clean up object reference to help with the
          // garbage collection in the closure.
          preloader = image = event = null;
        });
      }).bind('error', function (event) {
        // Since the load event is asynchronous, we have to
        // tell AngularJS that something changed.
        $rootScope.$apply(function () {
          preloader.handleImageError(event.target.src);
          // Clean up object reference to help with the
          // garbage collection in the closure.
          preloader = image = event = null;
        });
      }).attr('src', imageLocation);
    }
  };
  // Return the factory instance.
  return (Preloader);
});
