'use strict';

angular.module('copayApp.controllers').controller('proposalsController',
  function($timeout, $rootScope, $scope, profileService, $log, txpModalService, addressbookService, timeService, walletService) {

    $scope.fetchingProposals = true;

    $scope.$on("$ionicView.enter", function() {
      addressbookService.list(function(err, ab) {
        if (err) $log.error(err);
        $scope.addressbook = ab || {};
        updateTxps();
      });

      $scope.$on('action/updateTxps', function(event, data) {
        var wallet = profileService.getWallet(data.walletId);
        walletService.getStatus(wallet, {}, function(err, status) {
          if (err) {
            $log.error(err);
            return;
          }
          wallet.status = status;
          updateTxps();
        });
      });
    });

    function updateTxps() {
      profileService.getTxps({ limit: 50 }, function(err, txps) {
        $scope.fetchingProposals = false;
        if (err) {
          $log.error(err);
          return;
        }
        $scope.txps = txps;
        $timeout(function() {
          $scope.$apply();
        });
      });
    }

    $scope.openTxpModal = txpModalService.open;

    $scope.createdWithinPastDay = function(time) {
      return timeService.withinPastDay(time);
    };
  });
