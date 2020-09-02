pragma solidity >=0.5.0;

contract heroledger {
    uint256 public productCount;
    uint256 public licenseProductCount;

    mapping(uint256 => product) public products;
    mapping(uint256 => licensedProduct) public licensedProducts;

    struct licensedProduct {
        uint256 productId;
        string productName;
        string owner;
        address ownerAddress;
        uint256 licenseFee;
        uint256 term1StartDate;
        uint256 term1EndDate;
        string term2;
    }

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

    event licenseCreated(
        uint256 productId,
        string productName,
        string owner,
        address ownerAddress,
        uint256 licenseFee,
        uint256 term1StartDate,
        uint256 term1EndDate,
        string term2
    );

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

        require(
            _product.productId > 0 && _product.productId <= productCount,
            "Product Not Found"
        );

        _product.price = _price;
        _product.inStore = _inStore;
        _product.license = _license;

        emit productEdited(_productId, _price, _inStore, _license);
    }

    function addLicense(
        uint256 _productId,
        string memory _productName,
        string memory _owner,
        uint256 _licenseFee,
        uint256 _term1StartDate,
        uint256 _term1EndDate,
        string memory _term2
    ) public {
        licenseProductCount++;
        licensedProducts[_productId] = licensedProduct(
            _productId,
            _productName,
            _owner,
            msg.sender,
            _licenseFee,
            _term1StartDate,
            _term1EndDate,
            _term2
        );

        emit licenseCreated(
            _productId,
            _productName,
            _owner,
            msg.sender,
            _licenseFee,
            _term1StartDate,
            _term1EndDate,
            _term2
        );
    }
}
