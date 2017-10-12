'use strict';

angular.module('copayApp.services').factory('addressbookService', function(bitcore, storageService, lodash) {
  var root = {};

  root.get = function(addr, cb) {
    storageService.getAddressbook('testnet', function(err, ab) {
      if (err) return cb(err);
      if (ab) ab = JSON.parse(ab);
      if (ab && ab[addr]) return cb(null, ab[addr]);

      storageService.getAddressbook('livenet', function(err, ab) {
        if (err) return cb(err);
        if (ab) ab = JSON.parse(ab);
        if (ab && ab[addr]) return cb(null, ab[addr]);
        return cb();
      });
    });
  };

  root.list = function(cb) {
    async.parallel([
      async.apply(storageService.getAddressbook, 'testnet'),
      async.apply(storageService.getAddressbook, 'livenet'),
      async.apply(storageService.getAddressbook, 'aureus'),
      async.apply(storageService.getAddressbook, 'deuscoin')
    ], function(err, rawAddressbook) {
      if (err) return cb('Could not get the Addressbook');

      var addressbook = rawAddressbook.map(function(ab) {
        return JSON.parse(ab || '{}');
      });

      addressbook = lodash.defaults.apply(null, addressbook);

      cb(err, addressbook);
    });
  };

  root.add = function(entry, cb) {
    var network = (new bitcore.Address(entry.address)).network.name;
    storageService.getAddressbook(network, function(err, ab) {
      if (err) return cb(err);
      if (ab) ab = JSON.parse(ab);
      ab = ab || {};
      if (lodash.isArray(ab)) ab = {}; // No array
      if (ab[entry.address]) return cb('Entry already exist');
      ab[entry.address] = entry;
      storageService.setAddressbook(network, JSON.stringify(ab), function(err, ab) {
        if (err) return cb('Error adding new entry');
        root.list(function(err, ab) {
          return cb(err, ab);
        });
      });
    });
  };

  root.remove = function(addr, cb) {
    var network = (new bitcore.Address(addr)).network.name;
    storageService.getAddressbook(network, function(err, ab) {
      if (err) return cb(err);
      if (ab) ab = JSON.parse(ab);
      ab = ab || {};
      if (lodash.isEmpty(ab)) return cb('Addressbook is empty');
      if (!ab[addr]) return cb('Entry does not exist');
      delete ab[addr];
      storageService.setAddressbook(network, JSON.stringify(ab), function(err) {
        if (err) return cb('Error deleting entry');
        root.list(function(err, ab) {
          return cb(err, ab);
        });
      });
    });
  };

  root.removeAll = function() {
    storageService.removeAddressbook('livenet', function(err) {
      storageService.removeAddressbook('testnet', function(err) {
        if (err) return cb('Error deleting addressbook');
        return cb();
      });
    });
  };

  return root;
});
