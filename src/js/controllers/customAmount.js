'use strict';

angular.module('copayApp.controllers').controller('customAmountController', function($rootScope, $scope, $stateParams, $ionicHistory, txFormatService, platformInfo, profileService, CUSTOMNETWORKS) {

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    var satToBtc = 1 / 100000000;
    $scope.isCordova = platformInfo.isCordova;
    $scope.address = data.stateParams.toAddress;
    $scope.amount = parseInt(data.stateParams.toAmount);
    $scope.amountBtc = ($scope.amount * satToBtc).toFixed(8);
    $scope.amountStr = txFormatService.formatAmountStr($scope.amount);
    $scope.wallet = profileService.getWallet($stateParams.walletId);
    $scope.network = $scope.wallet.network;
    $scope.altAmountStr = txFormatService.formatAlternativeStr($scope.amount, CUSTOMNETWORKS[$scope.network]);
    if($scope.network === "livenet") {$scope.network = "bitcoin";}
  });

  $scope.finish = function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: false
    });
    $ionicHistory.goBack(-2);
  };

});
