function Product(value){
  this.brand = value.brand;
  this.color = value.color;
  this.name = value.name;
  this.available = value.sold_out;
  this.url = value.url;
}

Product.show = function(from, to, visibleProducts, productContentArea, dropdown){
  productContentArea.empty();
  if( to > visibleProducts.length - 1 ){ to = visibleProducts.length -1; }
  var sortValue = dropdown.selectedValues["sort"];
  visibleProducts = dropdown.onSortClickEvent(sortValue, visibleProducts);

  this.allVisibleProducts = visibleProducts;
  for(var i = from; i <= to; i++){
    var element = visibleProducts[i];

    var productDiv = $("<div></div>").addClass("product-class");
    var productImg = $("<img>").attr("src", "images/" + element.url).addClass("image-class");

    productDiv.append(productImg);
    productContentArea.append(productDiv);
  }
}

Product.getVisibleProducts = function(){
  return this.allVisibleProducts;
}
