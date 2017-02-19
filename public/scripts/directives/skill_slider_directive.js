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
          'height': '40px',
          'justify-content': 'center',
          'margin-right': '-8px',
          'vertical-align': 'top',
          'width': '40px'
        });
        $(range).css({
          'height': valueContainer.height(),
          'padding-top': '0.5px',
          'width': element.width() - valueContainer.width()
        });

        $(range).on('input', function (event) {
          scope.$apply(scope.value = parseFloat($(this).val()));
          valueContainer.html(scope.value);
        });
      }

      $(window).resize(function () {
        var range = element.children('input')[0];
        var valueContainer = element.children('div')[0];

        $(range).css('width', element.parent().width() - $(valueContainer).width());
      });

      setup();
    }
  };

});
