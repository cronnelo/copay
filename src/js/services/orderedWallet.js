'use strict';

angular
  .module('copayApp.services')
  .factory('orderedWallet', function($log, storageService, lodash) {
    var service = {
      arrange: arrange
    };

    return service;

    //////////////

    /**
     * @param {[ Object ]} wallets Arrange wallets passed
     *                             Passed by reference - it will change the original wallets
     */
    function arrange(wallets, callback) {
      storageService.getOrderedWallet(function(error, orderOfWallets) {
        orderOfWallets = orderOfWallets
                       ? JSON.parse(orderOfWallets)
                       : createOrderedWallets(wallets);

        lodash.forEach(orderOfWallets, function(wallet, index) {
          var walletIndex = lodash.findIndex(wallets, function(o) {
            return o.name === wallet;
          });

          wallets.splice(index, 0, wallets.splice(walletIndex, 1)[0]);
        });
        // $log.log('wallets',wallets)
        callback(wallets);
      });
    }

    function createOrderedWallets(wallets) {
      return wallets.map(function(wallet) {
        return wallet.name;
      });
    }
  });
