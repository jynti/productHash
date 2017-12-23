function Dropdown(name, optionValues, domElement) {
  this.name = name;
  this.optionValues = optionValues;
  this.sideFilter = domElement.sideFilters;
  this.productContentArea = domElement.productContentArea;
  this.url = domElement.url;
  this.footer = domElement.footer;
  this.allProducts = domElement.allProducts;
}

Dropdown.prototype.init = function() {
  this.createOptions();
}

Dropdown.prototype.createOptions = function() {
  var selectBox = $("<select></select>").addClass("select-box");

  for (var optionIndex = 0; optionIndex < this.optionValues.length; optionIndex++) {
    var option = $("<option></option>").attr("value", this.optionValues[optionIndex][0]).text(this.optionValues[optionIndex][1]);
    if (optionIndex == 0) {
      option.prop("selected", true);
    }
    selectBox.append(option);
  }

  var _this = this;
  selectBox.on("change", function() {
    _this.selectedValue = $(this).val();
    _this.onSelection();
  });

  this.sideFilter.append(selectBox);
  this.sideFilter.append("<hr>");
}

Dropdown.prototype.onSelection = function() {
  if (this.name == "pages") {
    this.constructor.selectedValue = this.selectedValue;
  } else {
    this.constructor.sortSelectedValue = this.selectedValue;
  }

  this.url[this.name] = this.selectedValue;
  window.location.hash = JSON.stringify(this.url);
  this.display()
}

Dropdown.prototype.display = function() {
  this.visibleProducts = Product.getVisibleProducts();
  if (!this.visibleProducts) this.visibleProducts = this.allProducts;
  if (this.name == "pages") {
    this.createFooter();
    Product.show(0, this.selectedValue - 1, this.visibleProducts, this.productContentArea);
  } else {
    this.createFooter();
    var selectedPagination = Dropdown.getPresentlySelectedValue();
    Product.show(0, selectedPagination - 1, this.visibleProducts, this.productContentArea);
  }
}

Dropdown.onSortClickEvent = function(selectedValue, visibleProducts) {
  this.sortSelectedValue = selectedValue;
  if (selectedValue == "name" || selectedValue == "available") {
    visibleProducts = this.sortForNumbers(selectedValue, visibleProducts);
  } else {
    visibleProducts = this.sortForWord(selectedValue, visibleProducts);
  }
  return visibleProducts;
}

Dropdown.sortForNumbers = function(selectedValue, visibleProducts) {
  visibleProducts.sort(function(product1, product2) {
    return product1[selectedValue] - product2[selectedValue];
  });
  return visibleProducts;
}

Dropdown.sortForWord = function(selectedValue, visibleProducts) {
  visibleProducts.sort(function(product1, product2) {
    if (product1[selectedValue].toUpperCase() < product2[selectedValue].toUpperCase()) {
      return -1;
    }
    if (product1[selectedValue].toUpperCase() > product2[selectedValue].toUpperCase()) {
      return 1;
    }
    return 0;
  });
  return visibleProducts;
}

Dropdown.prototype.createFooter = function() {
  var domDetails = {
    footer: this.footer,
    productContentArea: this.productContentArea,
    url: this.url
  }

  var footer = new Footer(this.visibleProducts, Dropdown.getPresentlySelectedValue(), domDetails);
  footer.init();
  this.url["pageNumber"] = "0";
  window.location.hash = JSON.stringify(this.url);
  footer.highlightButton(0);
}

Dropdown.getPresentlySelectedValue = function() {
  if (!this.selectedValue) {
    this.selectedValue = "20"
  }
  return this.selectedValue;
}

Dropdown.getPresentlySelectedSortValue = function() {
  if (!this.sortSelectedValue) {
    this.sortSelectedValue = "name"
  }
  return this.sortSelectedValue;
}
