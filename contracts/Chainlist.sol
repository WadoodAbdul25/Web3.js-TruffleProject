pragma solidity ^0.4.18;
import "./Ownable.sol";

contract chainlist is Ownable{
  struct Article {
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }
  //state Variables
  mapping (uint => Article) public articles;
  uint articleCounter;



  /* function chainlist() public{
  } */

  event logSellArticle(
    uint indexed _id,
    address indexed _seller,
    string _name,
    uint256 _price
    );

  event logBuyArticle(
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
    );

    function kill() public onlyOwner {
      /* require(msg.sender == ownerOfContract); */
      selfdestruct(owner);
    }

  //Function to sell an Article
  function sellArticle(string _name, string _description, uint256 _price) public{

    articleCounter++;

    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      0x0,
      _name,
      _description,
      _price
      );

    logSellArticle(articleCounter, msg.sender, _name, _price);
  }

  function buyArticle(uint _id) payable public {
    //check wheather aricle is for sale
    require(articleCounter > 0);
    //check wheather the id corresponds to an existing article
    require(_id > 0 && _id <= articleCounter);
    // getting the article
    Article storage article = articles[_id];
    //check wheather article hasn't been sold already
    require(article.buyer == 0x0);
    //don't allow seller to buy his article himself
    require(msg.sender != article.seller);
    //check the paying value and the price are equal
    require(msg.value == article.price);

    //Buyer's address
    article.buyer = msg.sender;

    //sending ETH to the seller
    article.seller.transfer(msg.value);


    logBuyArticle(_id, article.seller, article.buyer, article.name, article.price);

  }

  //Function to fetch number of ARTICLES
  function getNumberOfArticles() public view returns(uint){
    return articleCounter;
  }

  //fetch all the articles
  function fetchArticlesForSale() public view returns(uint []){
    uint [] memory articleIds = new uint[](articleCounter);

    uint numberOfArticlesForSale = 0;

    for(uint i = 1  ; i<=articleCounter; i++){
      if(articles[i].buyer == 0x0){
        articleIds[numberOfArticlesForSale] = articles[i].id;
        numberOfArticlesForSale++;
      }
    }

    uint [] memory forSale = new uint[] (numberOfArticlesForSale);
    for(uint j = 0; j<numberOfArticlesForSale; j++){
      forSale[j] = articleIds[j];
    }
    return forSale;
  }

}
