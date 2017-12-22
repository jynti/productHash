function SelectBox(name, optionValues, domElement){
  this.name = name;
  this.optionValues = optionValues;
  this.sideFilter = domElement.sideFilters;
  this.productContentArea = domElement.productContentArea;
  this.url = domElement.url;
  this.footer = domElement.footer;
}

SelectBox.prototype.init = function(){
  this.createOptions();
}

SelectBox.prototype.createOptions = function(){
  var selectBox = $("<select></select>").addClass("select-box");

  for(var i = 0; i < this.optionValues.length; i++){
    var option = $("<option></option>").attr("value", this.optionValues[i][0]).text(this.optionValues[i][1]);
    if(i == 0) {option.prop("selected", true);}
    selectBox.append(option);
  }

  var _this = this;
  selectBox.on("change", function(){
    _this.selectedValue = $(this).val();
    if(_this.name == "pages"){
      _this.constructor.selectedValue = $(this).val();
    }
    else{
      _this.constructor.sortSelectedValue = $(this).val();
      _this.url["pageNumber"] = "0";
    }
    //////////////////////
    _this.url[_this.name] = _this.selectedValue;
    window.location.hash = JSON.stringify(_this.url);
    ///////////////////
    _this.onChangeEvent()
  });
  this.sideFilter.append(selectBox);
  this.sideFilter.append("<hr>");
}

SelectBox.prototype.onChangeEvent = function(){
  this.visibleProducts = Product.getVisibleProducts();
  if(this.name == "pages"){
    this.createFooter();
    Product.show(0, this.selectedValue-1, this.visibleProducts, this.productContentArea);
  } else {
    var selectedPagination = SelectBox.getPresentlySelectedValue();
    Product.show(0, selectedPagination-1, this.visibleProducts, this.productContentArea);
  }
}

SelectBox.onSortClickEvent = function(selectedValue, visibleProducts){
  ///////////////////
  this.sortSelectedValue = selectedValue;
  //////////////////
  if(selectedValue == "name" || selectedValue == "available"){
      visibleProducts.sort(function(product1, product2){
        return product1[selectedValue] - product2[selectedValue];
      });
    } else{
      visibleProducts.sort(function(product1, product2){
        if (product1[selectedValue].toUpperCase() < product2[selectedValue].toUpperCase()) {
          return -1;
        }
        if (product1[selectedValue].toUpperCase() > product2[selectedValue].toUpperCase()) {
          return 1;
        }
        return 0;
      });
    }
    return visibleProducts;
}

SelectBox.prototype.createFooter = function(){
  var domDetails = {
    footer: this.footer,
    productContentArea: this.productContentArea,
    url:this.url
  }

  var footer = new Footer(this.visibleProducts, this.selectedValue, domDetails);
  footer.init();
  footer.highlightButton(0);
}

SelectBox.getPresentlySelectedValue = function(){
  if(!this.selectedValue){
    this.selectedValue = "20"
  }
  return this.selectedValue;
}

SelectBox.setSelectedPageValue = function(selectedValue){
  this.selectedValue = selectedValue;
}
SelectBox.getPresentlySelectedSortValue = function(){
  if(!this.sortSelectedValue){
    this.sortSelectedValue = "name"
  }
  return this.sortSelectedValue;
}
