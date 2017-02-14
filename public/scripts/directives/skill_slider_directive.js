/*
 * Author: Alton Lau
 * Date: February 13, 2017
 * File: skill_slider_directive.js
 * Description: Skill slider directive
 */

angular.module('altonApp').directive('skillSlider', function () {

  return {
    restrict: 'E',
    scope: {
      value: '=value',
      max: '=max',
      step: '=step'
    },
    template: '<input class="skill-slider" type="range">',
    link: function (scope, element) {
      var ready = false;

      function adjustSlider() {

      }

      function setup() {
        var valueContainer = $('<div></div>');
        var max = scope.max;
        var value = scope.value;
        var step = scope.step;
        var range = element.children('input')[0];

        $(range).attr('min', 0);
        $(range).attr('max', max);
        $(range).attr('step', step);
        $(range).val(value);

        valueContainer.html(value);
        element.prepend(valueContainer);

        valueContainer.css({
          'align-items': 'center',
          'background': '#7BCAA5',
          'border-radius': '64px',
          'color': 'white',
          'display': 'flex',
          'float': 'left',
          'justify-content': 'center',
          'margin-right': '-8px',
          'vertical-align': 'top',
          'width': '15%'
        });
        valueContainer.height(valueContainer.width());
        $(range).css({
          'height': valueContainer.height(),
          'padding-top': '0.5px',
          'width': '85%'
        });

        $(range).on('input', function (event) {
          scope.$apply(scope.value = $(this).val());
          valueContainer.html(scope.value);
        });
      }

      scope.$watch('value', function (result) {
        if (ready) {
          value = Math.max(Math.min(result, max), 0);
          adjustSlider();
        }
      });

      setup();
    }
  };

});
