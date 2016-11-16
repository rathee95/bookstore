var editions_change = (function(){

    function changeCurrentPrice() {
        var rows = $('tbody tr');
        for(var i=0; i< rows.length; i++) {
            $(rows[i].getElementsByTagName('select')[0]).change(function() {
                var optionSelected = $("option:selected", this);
                $(this).parent().parent().find('.selling_price').text('Rs. ' + optionSelected.attr('selling_price'));
            });
        }
    }

    return {
        init: function() {
            changeCurrentPrice();
        }
    };
})();
