function ProductPageCreator(domDetails) {
  this.domDetails = domDetails;
  this.sideFilters = domDetails.filter;
  this.footer = domDetails.footer;
  this.productContentArea = domDetails.productContentArea;
  this.allProducts = [];
  this.url = {
    brand: [],
    color: [],
    available: [],
    pages: "20",
    sort: "name",
    pageNumber: "0"
  }
}

ProductPageCreator.prototype.AvailableFilter = ['brand', 'color', 'available'];

ProductPageCreator.prototype.init = function() {
  this.getJsonData();
}
ProductPageCreator.prototype.getJsonData = function() {
  var _this = this;
  $.ajax({
    url: "product.json",
    context: _this,
    dataType: "json"
  }).done(_this.onJsonSuccess);
};

ProductPageCreator.prototype.onJsonSuccess = function(data) {
  var _this = this;
  $.each(data, function(key, value) {
    _this.createProduct(value);
  });

  var hash = window.location.hash;
  if (hash.length > 0) {
    _this.onHashPresent();
  } else {
    this.createSideFilter();
    Product.show(0, this.allProducts.length - 1, this.allProducts, this.productContentArea, this.dropdown);
  }
}

ProductPageCreator.prototype.createProduct = function(value) {
  var product = new Product(value);
  this.allProducts.push(product);
}

ProductPageCreator.prototype.createSideFilter = function(url) {
  if (url === undefined) {
    url = this.url
  }
  var domDetails = {
    sideFilters: this.sideFilters,
    productContentArea: this.productContentArea,
    footer: this.footer,
    url: url,
    allProducts: this.allProducts,
  }
  var pageOptions = {
    name: "pages",
    options: [
      [this.allProducts.length, "all"],
      ["3", "3"],
      ["6", "6"],
      ["9", "9"]
    ]
  };
  var sortOptions = {
    name: "sort",
    options: [
      ["name", "Sort by Name"],
      ["color", "Sort by Color"],
      ["available", "Sort by Availability"],
      ["brand", "Sort by Brand"]
    ]
  };

  var options = [pageOptions, sortOptions];
  this.dropdown = new ProductSorter(options, domDetails);


  var brandFilter = new Filter("brand", this.allProducts, domDetails, this.dropdown);
  brandFilter.init();

  var colorFilter = new Filter("color", this.allProducts, domDetails, this.dropdown);
  colorFilter.init();

  var soldFilter = new Filter("available", this.allProducts, domDetails, this.dropdown);
  soldFilter.init();

  this.dropdown.init();
}

ProductPageCreator.prototype.onHashPresent = function() {
  var hash = window.location.hash;
  hash = decodeURIComponent(hash);
  this.url = JSON.parse(hash.substring(1, hash.length));
  this.createSideFilter(this.url);
  var buttonNumber = this.url["pageNumber"];

  this.checkInputsInUrl();
  $("option[value=" + this.url["pages"] + "]").prop('selected', true).trigger("change");
  $("option[value=" + this.url["sort"] + "]").prop('selected', true).trigger("change");
  $(".page-number").eq(buttonNumber).trigger("click");
}

ProductPageCreator.prototype.checkInputsInUrl = function() {
  var urlInputElement;
  for (var i = 0; i < this.AvailableFilter.length; i++) {
    if (this.url[this.AvailableFilter[i]].length > 0) {
      this.url[this.AvailableFilter[i]].forEach(function(element) {
        urlInputElement = $("input[value='" + element + "']").prop("checked", true);
      });
    }
  }
  if (urlInputElement) {
    urlInputElement.triggerHandler('click', true);
  }
}

///////////////////////////////////////////////////////////
$(document).ready(function() {
  var domDetails = {
    productContentArea: $("#content"),
    filter: $("#filters"),
    footer: $("#footer")
  }
  var productPageCreator = new ProductPageCreator(domDetails);
  productPageCreator.init();
})
