$(document).ready(function(){
    $(".add-more").click(addMore);
});

var addMore = function(e){
    e.preventDefault();
    var id = e.target.id.split('_')[1];
    var addto = "#field_" + id;
    var addRemove = "#field_" + (id);
    var next = parseInt(id) + 1;
    var newIn = 
    '<div id="field_' + next +'" class="row">\
        <div class="input-field col s5">\
          <input placeholder="Masukkan Nama/Kode Barang" id="product_' + next +'" type="text" class="autocomplete-input">\
        </div>\
        <div class="input-field col s1">\
          <input placeholder="Jumlah" id="quantity_' + next + '" type="text" class="quantity">\
        </div>\
        <div class="input-field col s2">\
          <input disabled type="text" id="unit-cost_' + next + '" class="unit-cost">\
        </div>\
        <div class="input-field col s2">\
          <input disabled type="text" id="line-price_' + next + '" class="line-price">\
        </div>\
        <div class="input-field col s1">\
          <button id="b_' + next + '" class="btn add-more" type="button">+</button>\
        </div>\
     <div>';
    var prevAddBtn = "#b_" + (id);
    var prevAddButton = $(prevAddBtn);
    prevAddButton.off('click');
    prevAddButton.text("-");
    prevAddButton.addClass('btn-danger remove-me').removeClass('add-more');

    var newInput = $(newIn);
    $(addto).after(newInput);
    $("#b_" + next).click(addMore);
    $("#field_" + next).attr('data-source',$(addto).attr('data-source'));
    $("#count").val(next);  
    
        $('.remove-me').click(function(e){
            e.preventDefault();
            var fieldNum = this.id.split('_')[1];
            var fieldID = "#field_" + fieldNum;
            $(this).remove();
            $(fieldID).remove();
            purchasedProduct['product_' + fieldNum] = undefined;
            recalculateTotalPrice();
        });

        // Listener to new field
        turnOnAutoCompleteHandler(next);
        turnOnQuantityHandler(next);
}