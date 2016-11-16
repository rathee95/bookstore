var books_listing = (function() {

    function registerTooltip() {
        var div = $($(this).siblings()[0]);
        div.attr('data-toggle', 'tooltip');
        div.attr('title', 'This book is already added in cart!');
        div.attr('data-placement', 'bottom');
        div.mouseenter(function() {
             $(this).tooltip('show');
        }).mouseleave(function() {
             $(this).tooltip('hide');
        });
    }
    
    function add_to_cart() {
        $(".addtocartbuttonhidden").click(function() {
            var curr_button = $(this).siblings()[0];
            if($(curr_button).attr('flag') == 0) {
                return;
            }
            $(curr_button).attr('flag','0');
            var book_id = $(this).parent().parent().parent().parent().find('a').attr('data-bookid');
            var condition = $(this).parent().parent().find('.book-condition').val();
            var data = {'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val() };
            $(".loading-gif").show();
            $.ajax({
                type: 'POST',
                url: '/cart/addtocart/' + book_id + '/' + condition + '/1/',
                dataType : 'json',
                data : data,
                success: function(data) {
                    $('.count-cart-items').text(data['total_count']);
                    curr_button.disabled = true;
                    registerTooltip.bind(curr_button)();
                },
                complete: function() {
                    $(".loading-gif").hide();
                }
                
            });
        });
    }
    
    function condition_change() {
        $('.books-listing select').change(function() {
            var book_id = $(this).parent().parent().parent().find('a').attr('data-bookid');
            var optionSelected = $("option:selected", this)[0];
            var selling_price = $(optionSelected).attr('selling_price');
            $(this).parent().parent().find('.book-selling-price').text(' Rs.' +selling_price);
            var condition = $(this).val();
            var curr_button = $(this).siblings('.addtocartbuttondiv').find('.addtocartbutton')[0];
            $.ajax({
                type: 'GET',
                url: '/cart/quantity/',
                dataType : 'json',
                data : { book_id: book_id, condition: condition },
                success: function(data) {
                    var q = parseInt(data['quantity']);
                    if(q>=1){
                        curr_button.disabled = true;
                        $(curr_button).attr("flag", "0");
                        registerTooltip.bind(curr_button)();
                    } else {
                        curr_button.disabled = false;
                        $(curr_button).attr("flag", "1");
                        $($(curr_button).siblings()[0]).unbind('mouseenter mouseleave');
                        $($(curr_button).siblings()[0]).tooltip('destroy');
                    }
                }
            });
        });
    }

    function init() {
        condition_change();
        add_to_cart();
        $('[data-toggle="tooltip"]').tooltip();
        $("button:disabled").each(function (index) {
            registerTooltip.bind(this)();            
        });
    }

    return {
        init : init
    };
})();
