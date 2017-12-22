function Footer(visibleProducts, selectedPagination, domElements){
  this.visibleProducts = visibleProducts;
  this.selectedPagination = selectedPagination;
  this.footer = domElements.footer;
  this.productContentArea = domElements.productContentArea;
  this.url = domElements.url;
}

Footer.prototype.init = function(){
  this.numberOfButtonsToCreate();
  this.createButtons();
}

Footer.prototype.numberOfButtonsToCreate = function(){
  this.numberOfButtonsToCreate = Math.ceil(this.visibleProducts.length/this.selectedPagination);
}

Footer.prototype.createButtons = function(){
  var _this = this;
  this.footer.empty();
  for(var i = 0; i < this.numberOfButtonsToCreate; i++){
    var pageNumber = $("<span></span>").text(i+1).addClass("page-number");
    (function(buttonNumber){
      pageNumber.on("click", function(){
        ///////////////////////
        _this.url["pageNumber"] = buttonNumber;
        window.location.hash = JSON.stringify(_this.url);
        ////////////////////////
        _this.onButtonClick(buttonNumber);
      });
    })(i);
    this.footer.append(pageNumber);
  }
}

Footer.prototype.onButtonClick = function(buttonNumber){
  var start = buttonNumber  * (+this.selectedPagination);
  var end = start + (+this.selectedPagination) - 1;
  this.highlightButton(buttonNumber);
  Product.show(start, end, this.visibleProducts, this.productContentArea);
}


Footer.prototype.highlightButton = function(buttonNumber){
  this.footer.find("span").eq(buttonNumber).css("color", "red").siblings().css("color", "white");
}
