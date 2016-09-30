var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var orderId = unescape(temp[1]);

// load qrcode as soon as document is ready
$(document).ready(function() {
  getOrder();
  waitStatusConfirmation();
});

var getOrder = function() {
  var url = baseApiUrl + '/qrcode/generate?format=json&id=' + orderId;
  $.ajax({
    url: url,
    type: 'GET',
    dataType: "json",
    crossDomain: true,
    success: function(data) {
      console.log('Received Data', data);
      var base64Image = data.image;
      $("#qrcode").append("<img src='data:image/jpeg;base64," + base64Image + "' style='width:360px; height:360px'/>");
      renderOrderDetail(data.orderDetail);
    }
  });
}

var renderOrderDetail = function(orderDetail) {
  $("#order-detail").append("<h4>Detail Order</h4>")
  var orderLines = orderDetail.orderLines;
  orderLines.map(function(line) {
    var text = line.productName + " x" + line.quantity;
    $("#order-detail").append("<li>" + text + "</li>");
  });
}

var waitStatusConfirmation = function() {
  setInterval(function() {
    $.ajax({
      url: baseApiUrl + '/order/check-status?id=' + orderId,
      type: 'GET',
      dataType: "json",
      crossDomain: true,
      success: function(data) {
        var orderStatus = data.orderStatus;
        if (orderStatus == 'Completed') {
          alert("Pembayaran Diterima");
          window.location = '/histori.html';
        }
      }
    });
  }, 5000);
}