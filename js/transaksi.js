var purchasedProduct = {};

var calculateTotalPrice = function() {
  var totalPrice = 0;
  for (var key in purchasedProduct) {
    totalPrice += purchasedProduct[key].unitCost * purchasedProduct[key].quantity;
  }
  return totalPrice
}

var recalculateTotalPrice = function() {
  var totalPrice = calculateTotalPrice();
  console.log('Total Price:', totalPrice);
  $('#total-price').text(totalPrice);
}

// quantity handler
$('.quantity').on('change', function(event) {
  var quantityId = event.target.id;
  var fieldId = quantityId.split('_')[2];
  // Change the quantity
  purchasedProduct['product_' + fieldId].quantity = parseInt(event.target.value);
  recalculatePrice();
})

// POST data to API
var postData = function() {
  $("#loading").append("<img id='loadingImg' src='/static/i/loading.gif' style='width: 36px'/>");

  var lines = [];
  for (var key in purchasedProduct) {
    var line = Object.assign({}, purchasedProduct[key]);
    lines.push(line);
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
    url: 'http://localhost:8000/order/create',
    type: 'POST',
    crossDomain: true,
    dataType: 'json',
    data: JSON.stringify(order),
    success: function (data) {
      orderId = data.orderId;
      window.location = '/bayar?orderId=' + orderId;
    },
    error: function() {
      alert("Transaksi gagal, harap coba lagi");  
    },
  });
}


// autocomplete
var client = algoliasearch("DHTQZIC5JA", "753fbdb1826e0196ee382867881a20aa")
var index = client.initIndex('product');
autocomplete('.autocomplete-input', {hint: true}, [
{
  source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
  displayKey: 'my_attribute',
  templates: {
    suggestion: function(suggestion) {
      return suggestion._highlightResult.productName.value;
    }
  }
}
]).on('autocomplete:selected', function(event, suggestion, dataset) {
    event.target.value = suggestion.productName;
    fieldId = event.target.id;
    purchasedProduct[fieldId] = Object.assign({}, purchasedProduct[fieldId], 
      {
        "code": suggestion.productCode,
        "unitCost": suggestion.unitCost,
        "quantity": 1,
      }
    );
    $('#quantity_' + fieldId).val(1);
    recalculateTotalPrice();
    console.log(suggestion, dataset);
});

