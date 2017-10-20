'use strict';

angular
  .module('copayApp.services')
  .value('Greetings', function(props) {
    return React.createElement('h1', null, 'Greetings ' + props.message + '!');
  });

