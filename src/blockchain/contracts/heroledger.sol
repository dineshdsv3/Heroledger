pragma solidity >=0.5.0;

contract heroledger {
    uint256 public productCount;

    mapping(uint256 => product) public products;

    struct product {
        uint256 productId;
        string productName;
        string productType;
        string orginator;
        string ownerEmail;
        uint256 timestamp;
        uint256 price;
        address payable owner;
        bool inStore;
        bool license;
    }

    event productCreated(
        uint256 productId,
        string productName,
        string productType,
        string originator,
        string ownerEmail,
        uint256 timestamp,
        uint256 price,
        address owner,
        bool inStore,
        bool license
    );

    event productEdited(
        uint256 productId,
        uint256 price,
        bool inStore,
        bool license
    );

    function createProduct(
        string memory _productName,
        string memory _productType,
        string memory _email,
        uint256 _price,
        bool _inStore,
        bool _license
    ) public {
        productCount++;
        products[productCount] = product(
            productCount,
            _productName,
            _productType,
            _email,
            _email,
            block.timestamp,
            _price,
            msg.sender,
            _inStore,
            _license
        );

        emit productCreated(
            productCount,
            _productName,
            _productType,
            _email,
            _email,
            block.timestamp,
            _price,
            msg.sender,
            _inStore,
            _license
        );
    }

    function editProduct(
        uint256 _productId,
        uint256 _price,
        bool _inStore,
        bool _license
    ) public {
        product memory _product = products[_productId];

        require(_product.productId > 0 && _product.productId <= productCount,"Product Not Found");

        _product.price = _price;
        _product.inStore = _inStore;
        _product.license = _license;

        emit productEdited(_productId, _price, _inStore, _license);
    }
}
