pragma solidity >=0.5.0;

contract heroledger {
    uint256 public productCount;

    mapping(uint256 => product) public products;

    struct product {
        uint256 productId;
        string productName;
        string productType;
        string user;
        string email;
        uint256 timestamp;
        uint256 price;
        address payable owner;
        bool inStore;
    }

    event productCreated(
        uint256 productId,
        string productName,
        string productType,
        string user,
        string email,
        uint256 timestamp,
        uint256 price,
        address owner,
        bool inStore
    );

    function createProduct(
        string memory _productName,
        string memory _productType,
        string memory _user,
        string memory _email,
        uint256 _price,
        bool _inStore
    ) public {
        productCount++;
        products[productCount] = product(
            productCount,
            _productName,
            _productType,
            _user,
            _email,
            block.timestamp,
            _price,
            msg.sender,
            _inStore
        );

        emit productCreated (
            productCount,
            _productName,
            _productType,
            _user,
            _email,
            block.timestamp,
            _price,
            msg.sender,
            _inStore
        );
    }
}
