var ChainList = artifacts.require("./Chainlist.sol");
contract("ChainList", function(accounts){
  var chainlistInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "article 1";
  var articleDescription = "description of article 1";
  var articlePrice = 10

 //testing Exceptions for when someone buys article when there are none
  it("should thrown an error if buying articles when there are none", function(){
    return ChainList.deployed().then(function(instance){
      chainlistInstance = instance;
      return chainlistInstance.buyArticle(1, {
        from: buyer,
        value: web3.toWei(articlePrice, "ether")
      })
    }).then(assert.fail)
    .catch(function(err){
      assert(true);
    }).then(function(){
      return chainlistInstance.getNumberOfArticles();
    }).then(function(data){
    assert.equal(data.toNumber(), 0, "there are no Articles");
    });
  });

  //testing Exceptions for when someone tries to buy an article that does not existing
  it("should throw an error when an unexisting article is tried to purchase", function(){
    return ChainList.deployed().then(function(inst){
    chainlistInstance = inst;
    return chainlistInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller});
  }).then(function(reciept){
    return chainlistInstance.buyArticle(2, {
      from: buyer,
      value:web3.toWei(articlePrice, "ether")
    });
  }).then(assert.fail)
  .catch(function(err){
    assert(true);
  }).then(function(){
    return chainlistInstance.articles(1);
  }).then(function(data){
    assert.equal(data[0].toNumber(), 1, "the article Id must be 1");
    assert.equal(data[1], seller, "the article seller must be " +seller);
    assert.equal(data[2], 0x0, "the buyer must be null");
    assert.equal(data[3], articleName, "the article Name must be "+ articleName);
    assert.equal(data[4], articleDescription, "the article description must be "+ articleDescription);
    assert.equal(data[5], web3.toWei(articlePrice,"ether"), "the article price must be "+ web3.toWei(articlePrice,"ether"));
  })
  });

  //Testing exceptions for when seller buys his own article
  it("should throw an error when Seller and Buyer is the same",function(){
    return ChainList.deployed().then(function(instance){
      chainlistInstance = instance;
      return chainlistInstance.buyArticle(1, {from: seller, value: web3.toWei(articlePrice, "ether")})
    }).then(assert.fail)
    .catch(function(err){
      assert(true)
    }).then(function(){
      return chainlistInstance.articles(1);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "the article Id must be 1");
      assert.equal(data[1], seller, "the article seller must be " +seller);
      assert.equal(data[2], 0x0, "the buyer must be null");
      assert.equal(data[3], articleName, "the article Name must be "+ articleName);
      assert.equal(data[4], articleDescription, "the article description must be "+ articleDescription);
      assert.equal(data[5], web3.toWei(articlePrice,"ether"), "the article price must be "+ web3.toWei(articlePrice,"ether"));
    });
  });

  //testing exceptions for when article has been tried to buy with a different vlaue than its Price
  it("should throw an error when article is bought with the wrong price",function(){
    return ChainList.deployed().then(function(instance){
      chainlistInstance = instance;
      return chainlistInstance.buyArticle(1, {from: buyer, value: web3.toWei(articlePrice + 1, "ether")})
    }).then(assert.fail)
    .catch(function(err){
      assert(true)
    }).then(function(){
      return chainlistInstance.articles(1);
    }).then(function(data){
      assert.equal(data[0].toNumber(), 1, "the article Id must be 1");
      assert.equal(data[1], seller, "the article seller must be " +seller);
      assert.equal(data[2], 0x0, "the buyer must be null");
      assert.equal(data[3], articleName, "the article Name must be "+ articleName);
      assert.equal(data[4], articleDescription, "the article description must be "+ articleDescription);
      assert.equal(data[5], web3.toWei(articlePrice,"ether"), "the article price must be "+ web3.toWei(articlePrice,"ether"));
    });
  });

 //testing Exceptions for when article has been tried to buy but it's already sold
 it("should throw an error when an article is being bought but it's already sold",function(){
   return ChainList.deployed().then(function(instance){
     chainlistInstance = instance;
     return chainlistInstance.buyArticle(1, {from: buyer, value: web3.toWei(articlePrice, "ether")})
   }).then(function(){
     return chainlistInstance.buyArticle(1, {from: web3.eth.accounts[0], value: web3.toWei(articlePrice, "ether")});
   }).then(assert.fail)
   .catch(function(err){
     assert(true)
   }).then(function(){
     return chainlistInstance.articles(1);
   }).then(function(data){
     assert.equal(data[0].toNumber(), 1, "the article Id must be 1");
     assert.equal(data[1], seller, "the article seller must be " +seller);
     assert.equal(data[2], buyer, "the buyer must be" +buyer);
     assert.equal(data[3], articleName, "the article Name must be "+ articleName);
     assert.equal(data[4], articleDescription, "the article description must be "+ articleDescription);
     assert.equal(data[5], web3.toWei(articlePrice,"ether"), "the article price must be "+ web3.toWei(articlePrice,"ether"));
   });
 });
});
