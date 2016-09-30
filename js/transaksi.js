var purchasedProduct = {};

var calculateTotalPrice = function() {
  var totalPrice = 0;
  for (var key in purchasedProduct) {
    if (purchasedProduct[key]) {
      totalPrice += purchasedProduct[key].unitCost * purchasedProduct[key].quantity;
    }
  }
  return totalPrice;
}

var recalculateLinePrice = function(id) {
  var product = purchasedProduct['product_' + id];
  var newPrice = product.quantity * product.unitCost;
  $('#line-price_' + id).val('Rp' + newPrice);
}

var recalculateTotalPrice = function() {
  var totalPrice = calculateTotalPrice();
  console.log('Total Price:', totalPrice);
  $('#total-price').text(totalPrice);
}

var turnOnQuantityHandler = function(id) {
  $('#quantity_' + id).on('change', function(event) {
  var quantityId = event.target.id;
  var id = quantityId.split('_')[1];
  // Change the quantity
  purchasedProduct['product_' + id].quantity = parseInt(event.target.value);
  recalculateLinePrice(id);
  recalculateTotalPrice();
});
}

// POST data to API
var postData = function() {
  $("#loading").append("<img id='loadingImg' src='/static/i/loading.gif' style='width: 36px'/>");

  var lines = [];
  for (var key in purchasedProduct) {
    if (purchasedProduct[key]) {
      var line = Object.assign({}, purchasedProduct[key]);
      lines.push(line);
    }
  }

  var order = {
      shopId: 1,
      lines: lines,
  }

  // $.ajax({
  //     url: 'http://backend001.mybluemix.net/order/create',
  //     type: 'post',
  //     dataType: 'json',
  //     success: function (data) {
  //         $('#target').html(data.msg);
  //     },
  //     data: person
  // });

  $.ajax({
    url: baseApiUrl + '/order/create',
    type: 'POST',
    crossDomain: true,
    dataType: 'json',
    data: JSON.stringify(order),
    success: function (data) {
      orderId = data.orderId;
      window.location = '/bayar.html?orderId=' + orderId;
    },
    error: function() {
      alert("Transaksi gagal, harap coba lagi");  
    },
  });
}


// autocomplete
var client = algoliasearch("DHTQZIC5JA", "753fbdb1826e0196ee382867881a20aa")
var index = client.initIndex('product');
var autoCompleteInput;
var turnOnAutoCompleteHandler = function(id) {
  autoCompleteInput = autocomplete('#product_' + id, {hint: true}, [
  {
    source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
    displayKey: 'my_attribute',
    templates: {
      suggestion: function(suggestion) {
        return suggestion._highlightResult.productName.value;
      }
    }
  }
  ]);

  var setAutoComplete = function(event, suggestion, dataset) {
    event.target.blur();
    event.target.value = suggestion.productName;
    fieldId = event.target.id;
    id = fieldId.split('_')[1];
    purchasedProduct[fieldId] = Object.assign({}, purchasedProduct[fieldId], 
      {
        "code": suggestion.productCode,
        "unitCost": suggestion.unitCost,
        "quantity": 1,
      }
    );
    $('#quantity_' + id).val(1);
    $('#unit-cost_' + id).val('Rp' + suggestion.unitCost);
    recalculateLinePrice(id);
    recalculateTotalPrice();
    console.log(suggestion, dataset);
  };

  autoCompleteInput.on('autocomplete:selected', setAutoComplete);
}

$(document).ready(function(){
    turnOnAutoCompleteHandler(1);
    turnOnQuantityHandler(1);
});