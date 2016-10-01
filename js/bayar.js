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
      renderOrderSummary(data.orderDetail);
    }
  });
}

var renderOrderSummary = function(orderDetail) {
  var $orderDetail = $('#order-detail');
  $orderDetail.append("<h4>Review Order</h4>")
  var tableString = ""
  tableString +=
    '<table>\
      <tr>\
        <th>Nama Produk</th>\
        <th>Jumlah</th>\
        <th>Harga Barang</th>\
        <th>Harga Barang Total</th>\
      <tr>';
  var orderLines = orderDetail.orderLines;
  orderLines.map(function(line) {
    tableString +=
      '<tr>\
        <td>'+ line.productName +'</td>\
        <td>' + line.quantity + '</td>\
        <td>' + line.unitCost + '</td>\
        <td>' + line.linePrice + '</td>\
       </tr>';
  });
  tableString += '</table>'
  $orderDetail.append(tableString);
  $orderDetail.append('<h5>Total Harga: <strong>Rp'+ orderDetail.totalPrice + '</strong></h5>')
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