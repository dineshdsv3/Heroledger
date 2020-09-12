pragma solidity >=0.5.0;

contract heroledger {
    uint256 public productCount;
    uint256 public licenseProductCount;

    mapping(uint256 => product) public products;
    mapping(uint256 => licensedProduct) public licensedProducts;

    struct licensedProduct {
        uint256 productId;
        string productName;
        string licensor;
        string licensee;
        address payable ownerAddress;
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
        string licensor,
        string licensee,
        address payable ownerAddress,
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
        address payable owner,
        bool inStore,
        bool license
    );

    event productPurchased(
        uint256 productId,
        string ownerEmail,
        uint256 timestamp,
        bool inStore
    );

    event licensePurchased(
        uint256 productId,
        string licensorMail,
        string licenseeMail,
        uint256 timestamp
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

    function purchaseProduct(
        uint256 _productId,
        string memory _buyerEmail
    ) public payable {
        product memory _product = products[_productId];

        require(
            _product.productId > 0 && _product.productId <= productCount,
            "Invalid Product ID"
        );

        require(msg.value >= _product.price, "Check the price of the product");

        address payable _sellerAdd = _product.owner;

        address(_sellerAdd).transfer(msg.value);

        _product.owner = msg.sender;
        _product.ownerEmail = _buyerEmail;
        _product.inStore = false;

        products[_productId] = _product;

        emit productPurchased(_productId, _buyerEmail, block.timestamp, false);
    }

    function purchaseLicense(uint256 _productId,string memory _licensee) public payable {
        licensedProduct memory _licenseProduct = licensedProducts[_productId];

        product memory _product = products[_productId];

        require(msg.value >= _licenseProduct.licenseFee, "Check with license fee of the product");

        require(_licenseProduct.term1EndDate <= block.timestamp, "License Term Expired");


        address payable _licensorAdd = _licenseProduct.ownerAddress;

        address(_licensorAdd).transfer(msg.value);

        _licenseProduct.licensee = _licensee;
        _licenseProduct.ownerAddress = msg.sender;
        _licenseProduct.term1StartDate = 0;
        _licenseProduct.term1EndDate = 0;
        _licenseProduct.term2 = "N/A";

        _product.license = false;

        products[_productId] = _product;

        licensedProducts[_productId] = _licenseProduct;
        
        emit licensePurchased(_productId,_licenseProduct.licensor, _licenseProduct.licensee, block.timestamp);
    }

    function editProduct(
        uint256 _productId,
        uint256 _price,
        bool _inStore,
        bool _license
    ) public {
        product memory _product = products[_productId];

        require(
            _product.owner == msg.sender,
            "You can't have access to this product"
        );

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
        string memory _licensor,
        uint256 _licenseFee,
        uint256 _term1StartDate,
        uint256 _term1EndDate,
        string memory _term2
    ) public {
        licenseProductCount++;
        licensedProducts[_productId] = licensedProduct(
            _productId,
            _productName,
            _licensor,
            "N/A",
            msg.sender,
            _licenseFee,
            _term1StartDate,
            _term1EndDate,
            _term2
        );

        emit licenseCreated(
            _productId,
            _productName,
            _licensor,
            "N/A",
            msg.sender,
            _licenseFee,
            _term1StartDate,
            _term1EndDate,
            _term2
        );
    }
}
