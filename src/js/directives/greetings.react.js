'use strict';

angular
  .module('copayApp.directives')
  .directive('greetings', greetings);

function greetings(reactDirective) {
  return reactDirective('Greetings');
}
