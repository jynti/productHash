function ProductPageCreator(domDetails){
  this.domDetails = domDetails;
  this.sideFilters = domDetails.filter;
  this.footer = domDetails.footer;
  this.productContentArea = domDetails.productContentArea;
  this.allProducts = [];
  this.url = {
    "BRAND A": false,
    "BRAND B":false,
    "BRAND C":false,
    "BRAND D":false,
    "Blue":false,
    "Green":false,
    "Red":false,
    "Yellow":false,
    "available":false,
    "pages":"20",
    "pageNumber":"0",
    "sort":"name",
    "products": {}
  }
}
ProductPageCreator.prototype.init = function(){
  this.getJsonData();
}
ProductPageCreator.prototype.getJsonData = function(){
  var _this = this;
  $.ajax({
    url: "product.json",
    context: _this,
    dataType: "json"
  }).done(_this.onJsonSuccess);
};

ProductPageCreator.prototype.onJsonSuccess = function(data){
  var _this = this;
  $.each(data, function(key, value){
    _this.createProduct(value);
  });

  var hash = window.location.hash;
  if(hash.length > 0){
    _this.onHashPresent();
  } else {
    this.createSideFilter();
    _this.url["products"] = this.allProducts;
    Product.show(0, this.allProducts.length - 1, this.allProducts, this.productContentArea);
  }
}

ProductPageCreator.prototype.createProduct = function(value){
  var product = new Product(value);
  this.allProducts.push(product);
}

ProductPageCreator.prototype.createSideFilter = function(url){
  if(url === undefined){url = this.url}
  var domDetails = {
    sideFilters: this.sideFilters,
    productContentArea: this.productContentArea,
    footer: this.footer,
    url: url
  }
  var brandFilter = new Filter("brand", this.allProducts, domDetails);
  brandFilter.init();

  var colorFilter = new Filter("color", this.allProducts, domDetails);
  colorFilter.init();

  var soldFilter = new Filter("available", this.allProducts, domDetails);
  soldFilter.init();

  var optionValues = [[this.allProducts.length, "all"], ["3","3"], ["6","6"], ["9","9"]];

  var pageSelectBox = new SelectBox("pages", optionValues, domDetails);
  pageSelectBox.init();

  var optionValues = [["name", "Sort by Name"], ["color", "Sort by Color"], ["available", "Sort by Availability"], ["brand", "Sort by Brand"]];
  var sortSelectBox = new SelectBox("sort", optionValues, domDetails);
  sortSelectBox.init();
}

ProductPageCreator.prototype.onHashPresent = function(){
  var hash = window.location.hash;
  hash = decodeURIComponent(hash);
  hash = JSON.parse(hash.substring(1, hash.length));

  this.url = hash;

  this.createSideFilter(this.url);

  for(var prop in this.url){
    if(prop == "available") {
      $("input[name='available']").prop('checked', this.url["available"]);
      break;
    }
    $("input[value='" + prop + "']").prop('checked', this.url[prop]);
  }

  //sorting
  var visibleProducts = this.url["products"];
  var sortSelectedValue = this.url["sort"];
  $("option[value=" + sortSelectedValue + "]").prop('selected', true);
  SelectBox.onSortClickEvent(sortSelectedValue, visibleProducts);

  //pagination
  var selectedValue = this.url["pages"];
  $("option[value=" + selectedValue + "]").prop('selected', true);
  SelectBox.setSelectedPageValue(selectedValue);

  var buttonNumber = this.url["pageNumber"] ;
  var start = buttonNumber * + selectedValue;
  var end = start + +selectedValue - 1;

  var footer = new Footer(visibleProducts, selectedValue, this.domDetails);
  footer.init();
  footer.highlightButton(buttonNumber);
  Product.show(start, end, visibleProducts, this.productContentArea);

}

///////////////////////////////////////////////////////////
$(document).ready(function(){
  var domDetails = {
    productContentArea: $("#content"),
    filter: $("#filters"),
    footer: $("#footer")
  }
  var productPageCreator = new ProductPageCreator(domDetails);
  productPageCreator.init();


})
