$(document).ready(function(){
    getOrderHistory();
});

var getOrderHistory = function() {
  var url = baseApiUrl + '/order/history?format=json';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: "json",
    crossDomain: true,
    success: function(data) {
      console.log('Received Data', data);
      renderOrderHistory(data.orderHistory);
    }
  });
}

var renderOrderHistory = function(orderHistory) {
  orderHistory.map(function(order) {
    $('#order-history').append('\
      <tr>\
        <td>' + order.id + '</td>\
        <td>Rp' + order.totalPrice + '</td>\
        <td>' + order.date + '</td>\
      </tr>');
  });
}