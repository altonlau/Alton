/*
 * Author: Alton Lau
 * Date: February 9, 2017
 * File: skill_ball_directive.js
 * Description: Skill ball directive
 */

angular.module('altonApp').directive('skillBall', function () {

  return {
    restrict: 'E',
    scope: {
      count: '=count',
      value: '=value',
      maxValue: '=maxValue'
    },
    link: function (scope, element) {
      var count, value, maxValue;
      var ready = false;
      var balls = [];

      function adjustBalls() {
        var delay = 0;
        var index = 0;
        var currentScore = 0;
        var score = value * count / maxValue;

        ready = false;
        for (var i = 0; i < count; i++) {
          var highlight = $(balls[i].children('div')[0]);
          currentScore += highlight.width() / highlight.height();
          index = i;
          if (highlight.width() !== highlight.height()) {
            break;
          }
        }

        if (currentScore > score) {
          var adjustment = currentScore - score;
          var indexCount = Math.ceil(adjustment);
          if (!$(balls[index].children('div')[0]).width()) {
            index --;
          }

          for (var i = 0; i < indexCount; i++) {
            var highlight = $(balls[index].children('div')[0]);
            var remainingIndexScore = highlight.width() / highlight.height();
            var indexScore;

            if (remainingIndexScore) {
              if (remainingIndexScore < adjustment) {
                indexScore = 0;
              } else {
                indexScore = remainingIndexScore - adjustment;
              }
              adjustment -= remainingIndexScore;

              if (i === indexCount - 1) {
                highlight.delay(delay).animate({
                  'width': (indexScore * highlight.height()) + 'px'
                }, 100, function () {
                  ready = true;
                });
              } else {
                highlight.delay(delay).animate({
                  'width': (indexScore * highlight.height()) + 'px'
                }, 100);
              }
              delay += 100;
            }
            index--;
          }
        } else if (currentScore < score) {
          var adjustment = score - currentScore;
          var indexCount = Math.ceil(adjustment);

          for (var i = 0; i < indexCount; i++) {
            var highlight = $(balls[index].children('div')[0]);
            var remainingIndexScore = 1 - (highlight.width() / highlight.height());
            var indexScore;

            if (remainingIndexScore < adjustment) {
              indexScore = 1;
            } else {
              indexScore = adjustment;
            }
            adjustment -= remainingIndexScore;

            if (i === indexCount - 1) {
              highlight.delay(delay).animate({
                'width': (indexScore * highlight.height()) + 'px'
              }, 100, function () {
                ready = true;
              });
            } else {
              highlight.delay(delay).animate({
                'width': (indexScore * highlight.height()) + 'px'
              }, 100);
            }
            delay += 100;
            index++;
          }
        } else {
          ready = true;
        }
      }

      function fillBalls(callback) {
        var score = value * count / maxValue;
        var delay = 0;

        for (var i = 0; i < count; i++) {
          var indexScore = Math.max(0, Math.min(score--, 1));
          var highlight = $(balls[i].children('div')[0]);

          if (i === count - 1) {
            highlight.delay(delay).animate({
              'width': (indexScore * highlight.height()) + 'px'
            }, 100, function () {
              callback();
            });
          } else {
            highlight.delay(delay).animate({
              'width': (indexScore * highlight.height()) + 'px'
            }, 100);
          }
          delay += 100;
        }
      }

      function setup() {
        count = scope.count;
        value = scope.value;
        maxValue = scope.maxValue;
        element.empty();
        for (var i = 0; i < count; i++) {
          var ball = $('<div></div>');
          var highlight = $('<div></div>');

          ball.css({
            'border': '1px solid #BDBDBD',
            'border-radius': '12px',
            'display': 'inline-block',
            'height': '24px',
            'overflow': 'hidden',
            'position': 'relative',
            'width': '24px'
          });

          if (i > 0) {
            ball.css('margin-left', '4px');
          }

          highlight.css({
            'background': '#7BCAA5',
            'height': '24px',
            'left': '0',
            'position': 'absolute',
            'top': '0',
            'width': '0'
          });

          ball.append(highlight);
          element.append(ball);
          balls.push(ball);
        }
        fillBalls(function () {
          ready = true;
        });
      }

      scope.$watch('value', function (result) {
        if (ready) {
          value = Math.max(Math.min(result, maxValue), 0);
          adjustBalls();
        }
      });

      setup();
    }
  };

});
