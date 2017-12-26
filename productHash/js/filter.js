function Filter(name, allProducts, domDetails, dropdown) {
  this.name = name;
  this.allProducts = allProducts;
  this.sideFilters = domDetails.sideFilters;
  this.productContentArea = domDetails.productContentArea;
  this.footer = domDetails.footer;
  this.url = domDetails.url;
  this.subFilters = [];
  this.dropdown = dropdown;
}

Filter.prototype.AvailableFilter = ['brand', 'color', 'available'];

Filter.prototype.init = function() {
  if (this.name != "available") {
    this.createSubFilter();
    this.createCheckboxForSubFIlters();
  } else {
    this.createAvailableFilter();
  }
  this.sideFilters.append("<hr>");
}

//creating filters
Filter.prototype.createSubFilter = function() {
  var _this = this;
  var uniqueSubFilters = [];
  this.allProducts.forEach(function(element) {
    if (!uniqueSubFilters.includes(element[_this.name])) {
      uniqueSubFilters.push(element[_this.name]);
    }
  });
  this.subFilters = uniqueSubFilters.sort();
}

Filter.prototype.createCheckboxForSubFIlters = function() {
  var _this = this;
  var list = $("<ol></ol>");
  this.subFilters.forEach(function(element) {
    var listItem = $("<li></li>");
    var label = $("<label></label>").text(element).attr("for", element);
    var checkbox = $("<input>").attr({
      type: "checkbox",
      name: _this.name,
      value: element,
      id: element
    }).on("click", function(event, wasTriggered) {
      _this.checkboxClick(wasTriggered);
    });
    listItem.append(label, checkbox);
    list.append(listItem);
  });
  this.sideFilters.append(list);
}

Filter.prototype.createAvailableFilter = function() {
  var _this = this;
  var availableList = $("<p></p>");
  var availableLabel = $("<label></label>").text("Available").attr("for", "available").css("margin-left", "15px");
  var availableCheckbox = $("<input>").attr({
    type: "checkbox",
    name: "available",
    value: "0",
    id: "available"
  }).on("click", function() {
    _this.checkboxClick();
  });
  availableList.append(availableLabel, availableCheckbox);
  this.sideFilters.append(availableList);
}

//on clicking
Filter.prototype.checkboxClick = function() {
  var result = this.allProducts;
  for (var i = 0; i < this.AvailableFilter.length; i++) {
    var selected = this.findSelectedCheckboxes(this.AvailableFilter[i]);
    this.url[this.AvailableFilter[i]] = selected;
    if (selected.length > 0) {
      result = this.productsInThisFilter(selected, result, this.AvailableFilter[i]);
      if (!result.length) {
        break;
      }
    }
  }
  this.createFooter(result);
  this.showProducts(result);
  window.location.hash = JSON.stringify(this.url);
}


Filter.prototype.findSelectedCheckboxes = function(presentFilter) {
  return $("input:checked").filter("[name=" + presentFilter + "]").map(function() {
    return this.value;
  }).get();
}

Filter.prototype.productsInThisFilter = function(selected, result, presentFilter) {
  var presentValues = [];
  for (var j = 0; j < result.length; j++) {
    if (selected.includes(result[j][presentFilter])) {
      presentValues.push(result[j]);
    }
  }
  return presentValues;
}

Filter.prototype.createFooter = function(visibleProducts) {
  var domDetails = {
    footer: this.footer,
    productContentArea: this.productContentArea,
    url: this.url,
    dropdown: this.dropdown
  }
  var selectedPagination = this.dropdown.selectedValues["pages"];
  var footer = new Footer(visibleProducts, selectedPagination, domDetails);
  footer.init();
  footer.highlightButton(0);
}

Filter.prototype.showProducts = function(visibleProducts) {
  var selectedValue = this.dropdown.selectedValues["pages"];
  if (selectedValue < visibleProducts.length) {
    Product.show(0, selectedValue - 1, visibleProducts, this.productContentArea, this.dropdown);
  } else {
    Product.show(0, visibleProducts.length - 1, visibleProducts, this.productContentArea, this.dropdown);
  }
}
