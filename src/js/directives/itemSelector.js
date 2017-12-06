'use strict';

angular.module('copayApp.directives')
  .directive('itemSelector', function($timeout, $rootScope, $ionicModal, storageService, customNetworks) {
    return {
      restrict: 'E',
      templateUrl: 'views/includes/itemSelector.html',
      transclude: true,
      scope: {
        show: '=',
        showSendMax: '=',
        sendMaxAmount: '=',
        processAmount: '=',
        updateAlternativeCurrency: '='
      },
      link: function(scope) {
        scope.hide = function() {
          scope.show = false;
        };

        scope.sendMax = function() {
          $timeout(function() {
            scope.hide();
          }, 100);
          scope.sendMaxAmount();
        };

        scope.selectAlternativeCurrency = function() {
          $timeout(function() {
            scope.hide();
          }, 100);

          var _newScope = $rootScope.$new(true);

          _newScope.inAmount = true; // NOTE: used in AltCurrency Controller

          _newScope.ok = function() {
            scope.chooseAlternativeCurrency.hide();
            scope.chooseAlternativeCurrency.remove();
            scope.updateAlternativeCurrency();
          };

          $ionicModal.fromTemplateUrl('views/modals/preferencesAltCurrency.html', {
              scope: _newScope
          }).then(function(modal) {
            _newScope.$broadcast('$ionicModal.beforeEnter');

            scope.chooseAlternativeCurrency = modal;
            scope.chooseAlternativeCurrency.show();
          });
        };
      }
    };
  });
