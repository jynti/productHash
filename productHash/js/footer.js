function Footer(visibleProducts, selectedPagination, domElements) {
  this.visibleProducts = visibleProducts;
  this.selectedPagination = selectedPagination;
  this.footer = domElements.footer;
  this.productContentArea = domElements.productContentArea;
  this.url = domElements.url;
}

Footer.prototype.init = function() {
  this.numberOfButtonsToCreate();
  this.createButtons();
}

Footer.prototype.numberOfButtonsToCreate = function() {
  this.numberOfButtonsToCreate = Math.ceil(this.visibleProducts.length / this.selectedPagination);
}

Footer.prototype.createButtons = function() {
  var _this = this;
  this.footer.empty();
  var buttons = [];
  for (var buttonNumber = 0; buttonNumber < this.numberOfButtonsToCreate; buttonNumber++) {
    var pageNumber = $("<span></span>").text(buttonNumber + 1).addClass("page-number").data("button-number", buttonNumber);
    buttons.push(pageNumber);
  }
  this.footer.append(buttons);
  $(".page-number").on("click", function() {
    var buttonNumber = $(this).data("button-number");
    _this.url["pageNumber"] = buttonNumber;
    window.location.hash = JSON.stringify(_this.url);
    _this.onButtonClick(buttonNumber);
  })

}

Footer.prototype.onButtonClick = function(buttonNumber) {
  var fromProduct = buttonNumber * (+this.selectedPagination);
  var tillProduct = fromProduct + (+this.selectedPagination) - 1;
  this.highlightButton(buttonNumber);
  Product.show(fromProduct, tillProduct, this.visibleProducts, this.productContentArea);
}


Footer.prototype.highlightButton = function(buttonNumber) {
  this.footer.find("span").eq(buttonNumber).css("color", "red").siblings().css("color", "white");
}
