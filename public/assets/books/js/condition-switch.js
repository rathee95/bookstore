var condition_switch = (function() {

    function changePrice() {
        var optionSelected = $("option:selected", this);
        $('#selling_price strong').text('Rs. ' + optionSelected.attr('selling_price'));
    }

    return {
        init : function(){
            $('#condition').change(changePrice);      
        }
    };
})();
