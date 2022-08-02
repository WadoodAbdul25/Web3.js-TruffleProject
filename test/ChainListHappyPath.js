var Chainlist = artifacts.require("./Chainlist.sol");
// var assert = require('assert');

contract('Chainlist',function(accounts){
  var chainlistInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "Article 1";
  var articleDescription1 = "Description for 1";
  var articlePrice1 = 10;
  var articleName2 = "Article 2";
  var articleDescription2 = "Description for 2";
  var articlePrice2 = 20;


  var sellerBalanceBefore, sellerBalanceAfter;
  var buyerBalanceBefore, buyerBalanceAfter;

  it("should be initialized empty", function(){
    return Chainlist.deployed().then(function(instance){
      chainlistInstance = instance;
      return chainlistInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data, 0, "Number of articles must be 0");
      return chainlistInstance.fetchArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 0, "there should not be any article for Sale")
    })
  });

  it("should let us sell the first article", function(){
    return Chainlist.deployed().then(function(instance){
      chainlistInstance = instance;
      return chainlistInstance.sellArticle(articleName1, articleDescription1, web3.toWei(articlePrice1, "ether"), {from: seller});
    }).then(function(reciept){
      assert.equal(reciept.logs.length, 1, "one event should've been triggered");
      assert.equal(reciept.logs[0].event, "logSellArticle", "Event should be logSellArticle");
      assert.equal(reciept.logs[0].args._id.toNumber(), 1, "Id must be 1");
      assert.equal(reciept.logs[0].args._seller, seller, "Event Seller should be"+seller);
      assert.equal(reciept.logs[0].args._name, articleName1, "Event Article Name should be"+articleName1);
      assert.equal(reciept.logs[0].args._price.toNumber(), web3.toWei(articlePrice1,"ether"), "Event article price should be"+web3.toWei(articlePrice1,"ether"));

      return chainlistInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data,1,"the Number of articles must be 1");

      return chainlistInstance.fetchArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 1, "there must be 1 article for Sale" );
      assert.equal(data[0].toNumber(), 1, "the Id of article must be 1");

      return chainlistInstance.articles(data[0]);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "the article Id must be 1");
      assert.equal(data[1], seller, "the article seller must be " +seller);
      assert.equal(data[2], 0x0, "the buyer must be null");
      assert.equal(data[3], articleName1, "the article Name must be "+ articleName1);
      assert.equal(data[4], articleDescription1, "the article description must be "+ articleDescription1);
      assert.equal(data[5], web3.toWei(articlePrice1,"ether"), "the article price must be "+ web3.toWei(articlePrice1,"ether"));
    });
  });

  it("should let us sell the second article", function(){
    return Chainlist.deployed().then(function(instance){
      chainlistInstance = instance;
      return chainlistInstance.sellArticle(articleName2, articleDescription2, web3.toWei(articlePrice2, "ether"), {from: seller});
    }).then(function(reciept){
      assert.equal(reciept.logs.length, 1, "one event should've been triggered");
      assert.equal(reciept.logs[0].event, "logSellArticle", "Event should be logSellArticle");
      assert.equal(reciept.logs[0].args._id.toNumber(), 2, "Id must be 2");
      assert.equal(reciept.logs[0].args._seller, seller, "Event Seller should be"+seller);
      assert.equal(reciept.logs[0].args._name, articleName2, "Event Article Name should be"+articleName2);
      assert.equal(reciept.logs[0].args._price.toNumber(), web3.toWei(articlePrice2,"ether"), "Event article price should be"+web3.toWei(articlePrice2,"ether"));

      return chainlistInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data,2,"the Number of articles must be 2");

      return chainlistInstance.fetchArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 2, "there must be 2 articles for Sale" );
      assert.equal(data[1].toNumber(), 2, "the Id of article must be 2");

      return chainlistInstance.articles(data[1]);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 2, "the article Id must be 2");
      assert.equal(data[1], seller, "the article seller must be " +seller);
      assert.equal(data[2], 0x0, "the buyer must be null");
      assert.equal(data[3], articleName2, "the article Name must be "+ articleName2);
      assert.equal(data[4], articleDescription2, "the article description must be "+ articleDescription2);
      assert.equal(data[5], web3.toWei(articlePrice2,"ether"), "the article price must be "+ web3.toWei(articlePrice2,"ether"));
    });
  });
    // console.log(sellerBalanceBefore+"this is seller's balance before")
    // console.log(buyerBalanceBefore+"this is buyer's balance before")

    it("should Buy an article", function(){
      return Chainlist.deployed().then(function(instance){
        chainlistInstance = instance;
        sellerBalanceBefore = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
        buyerBalanceBefore = web3.fromWei(web3.eth.getBalance(buyer),"ether").toNumber();
        return chainlistInstance.buyArticle(1,{
          from: buyer,
          value: web3.toWei(articlePrice1, "ether")
        });
      }).then(function (reciept){
        assert.equal(reciept.logs.length, 1, "one event should've been triggered");
        assert.equal(reciept.logs[0].event, "logBuyArticle", "Event should be logBuyArticle");
        assert.equal(reciept.logs[0].args._seller, seller, "Event Seller should be"+seller);
        assert.equal(reciept.logs[0].args._buyer, buyer, "Event Buyer should be"+buyer);
        assert.equal(reciept.logs[0].args._id.toNumber(), 1, "Event id should be 1");
        assert.equal(reciept.logs[0].args._name, articleName1, "Event Article Name should be"+articleName1);
        assert.equal(reciept.logs[0].args._price.toNumber(), web3.toWei(articlePrice1,"ether"), "Even article price should be"+web3.toWei(articlePrice1,"ether"));
         sellerBalanceAfter = web3.fromWei(web3.eth.getBalance(seller),"ether").toNumber();
         buyerBalanceAfter = web3.fromWei(web3.eth.getBalance(buyer),"ether").toNumber();

1
          assert(sellerBalanceAfter == sellerBalanceBefore + articlePrice1, "Seller should have credited " + articlePrice1 + " ETH");
         assert(buyerBalanceAfter <= buyerBalanceBefore - articlePrice1, "Buyer should have debitted" + articlePrice1 + "ETH");


        return chainlistInstance.fetchArticlesForSale();

      }).then(function(data){
        assert.equal(data.length, 1, "there must be only 1 article for Sale coz the other one is sold")
        assert.equal(data[0].toNumber(), 2, "the only article left must be with id 2");

        return chainlistInstance.getNumberOfArticles();
      }).then(function(data){
        assert.equal(data.toNumber(), 2, "there should be 2 articles in total")
      })
    });

});
