/*
 * Author: Alton Lau
 * Date: March 7, 2017
 * File: image_preloader_factory.js
 * Description: Preloads images for future use
 */

angular.module('altonApp').factory('imagePreloader', function ($q, $timeout) {
  var body = document.getElementsByTagName('body')[0];

  function renderImage(imgPath) {
    return $q(function (resolve) {
      // Create an image element
      var element = document.createElement('img');
      var timeoutId;

      // Assign properties to the element making it tiny and invisible to the viewer
      element.src = imgPath;
      element.height = "1";
      element.width = "1";
      element.style.opacity = 0;

      // Begin a timeout.  If image has failed to load, resolve anyway and remove element
      timeoutId = $timeout(function () {
        body.removeChild(element);
        element.removeEventListener('load', processLoadEvent);
        resolve();
      }, 1750);

      element.addEventListener('load', processLoadEvent);

      // Wait for the image to load and then remove it
      // Cancel the timeout event
      function processLoadEvent() {
        body.removeChild(element);
        $timeout.cancel(timeoutId);
        resolve();
      }

      // Add the image element to the DOM
      body.appendChild(element);
    });
  }

  /**
   * Take array of images and force them to be loaded/cached by the browser
   * @param {array} images
   */
  function preload(images) {
    if (!images || images.length === 0) {
      return $q.when();
    }

    return $q.all(images.map(function (image) {
      return renderImage(image);
    }));
  }

  return {
    preload: preload
  };
});
