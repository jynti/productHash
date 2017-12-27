function ProductSorter(options, domDetails) {
  this.sideFilter = domDetails.sideFilters;
  this.productContentArea = domDetails.productContentArea;
  this.url = domDetails.url;
  this.footer = domDetails.footer;
  this.allProducts = domDetails.allProducts;
  this.options = options;
  this.selectedValues = {};
}

ProductSorter.prototype.init = function() {
  this.createDropdowns();
}

ProductSorter.prototype.createDropdowns = function() {
  var _this = this;
  this.options.forEach(function(dropdownType) {
    _this.createOptions(dropdownType);
    _this.selectedValues[dropdownType.name] = dropdownType.options[0][0];
  });
}

ProductSorter.prototype.createOptions = function(dropdownType) {
  var selectBox = $("<select></select>").addClass("select-box");
  var name = dropdownType.name;
  var dropdownOptions = dropdownType.options;
  for (var optionIndex = 0; optionIndex < dropdownOptions.length; optionIndex++) {
    var option = $("<option></option>").attr("value", dropdownOptions[optionIndex][0]).text(dropdownOptions[optionIndex][1]);
    if (optionIndex == 0) {
      option.prop("selected", true);
    }
    selectBox.append(option);
  }
  this.onChangeEvent(selectBox, name);
  this.sideFilter.append(selectBox);
  this.sideFilter.append("<hr>");
}

ProductSorter.prototype.onChangeEvent = function(selectBox, name) {
  var _this = this;
  selectBox.on("change", function() {
    _this.selectedValues[name] = $(this).val();
    _this.url[name] = $(this).val();
    window.location.hash = JSON.stringify(_this.url);
    _this.display();
  });
}

ProductSorter.prototype.display = function() {
  this.visibleProducts = Product.getVisibleProducts();
  if (!this.visibleProducts) this.visibleProducts = this.allProducts;
  this.createFooter();
  var selectedPagination = this.selectedValues["pages"];
  Product.show(0, selectedPagination - 1, this.visibleProducts, this.productContentArea, this);
}

ProductSorter.prototype.onSortClickEvent = function(selectedValue, visibleProducts) {
  if (selectedValue == "name" || selectedValue == "available") {
    visibleProducts = this.sortByNumbers(selectedValue, visibleProducts);
  } else {
    visibleProducts = this.sortByWord(selectedValue, visibleProducts);
  }
  return visibleProducts;
}

ProductSorter.prototype.sortByNumbers = function(selectedValue, visibleProducts) {
  visibleProducts.sort(function(product1, product2) {
    return product1[selectedValue] - product2[selectedValue];
  });
  return visibleProducts;
}

ProductSorter.prototype.sortByWord = function(selectedValue, visibleProducts) {
  visibleProducts.sort(function(product1, product2) {
    return product1[selectedValue].toUpperCase() > product2[selectedValue].toUpperCase()
  });
  return visibleProducts;
}

ProductSorter.prototype.createFooter = function() {
  var domDetails = {
    footer: this.footer,
    productContentArea: this.productContentArea,
    url: this.url,
    dropdown: this
  }
  var footer = new Footer(this.visibleProducts, this.selectedValues["pages"], domDetails);
  footer.init();
  footer.highlightButton(0);
  this.url["pageNumber"] = "0";
  window.location.hash = JSON.stringify(this.url);
}
