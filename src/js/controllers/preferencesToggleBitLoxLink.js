'use strict';

angular
  .module('copayApp.controllers')
  .controller('preferencesToggleBitLoxLinkController', preferencesToggleBitLoxLinkController);

function preferencesToggleBitLoxLinkController($scope, $log, configService) {
  $scope.toggleBitLoxBuyLink = function() {
    configService.set({ showBitLoxBuyLink: !$scope.showBitLoxBuyLink }, function(err) {
      if (err) $log.debug(err);
    });
  };

  $scope.$on('$ionicView.enter', function () {
    $scope.showBitLoxBuyLink = configService.getSync().showBitLoxBuyLink;
  });
}
