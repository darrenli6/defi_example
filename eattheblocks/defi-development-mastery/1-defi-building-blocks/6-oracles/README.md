

```
darren@darrendeMacBook-Pro 6-oracles % truffle migrate --reset             

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x1bfbf3e88f6f810da35afa61cac66484d108893fe8dfa9f8ba22d6060a7e883e
   > Blocks: 0            Seconds: 0
   > contract address:    0x39F2a92BE0413B6d5BeeC8F2c345CDfB2Fe4168e
   > block number:        270
   > block timestamp:     1649572032
   > account:             0x3E6ba59EfFa8d6f3f550287F33b3E6C250C83af0
   > balance:             97.12944666
   > gas used:            186963 (0x2da53)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00373926 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00373926 ETH


2_deploy_contract.js
====================

   Replacing 'Oracle'
   ------------------
   > transaction hash:    0x95ac1378bc486b4f3ceee8b2202528b312fcf53a5608b660b5358f26b8e29594
   > Blocks: 0            Seconds: 0
   > contract address:    0xedEE582638879a17B098d76d302aEF2986b854f1
   > block number:        272
   > block timestamp:     1649572033
   > account:             0x3E6ba59EfFa8d6f3f550287F33b3E6C250C83af0
   > balance:             97.12127004
   > gas used:            366496 (0x597a0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00732992 ETH


   Replacing 'Consumer'
   --------------------
   > transaction hash:    0x7e6cc151e1ad664110720ac5105369597a07f00be2a07de4605f0387d0642978
   > Blocks: 0            Seconds: 0
   > contract address:    0xdf8b9c3Ee890734a77aFBD1Bb6BEdc1d9C481D2a
   > block number:        274
   > block timestamp:     1649572033
   > account:             0x3E6ba59EfFa8d6f3f550287F33b3E6C250C83af0
   > balance:             97.11573686
   > gas used:            232994 (0x38e22)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00465988 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:           0.0119898 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.01572906 ETH


```

```
darren@darrendeMacBook-Pro 6-oracles % truffle exec script/price-watcher.js --network development

```

