var addtocart = (function() {

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
    
    function addtocart() {
        $("#addtocart-hidden").click(function(e) {
            e.preventDefault();
            var curr_button = $(this).siblings()[0];
            if($(curr_button).attr("flag") == 0) {
                return;
            }
            $(curr_button).attr("flag","0");
            var book_id = $(curr_button).attr('data-bookid');
            var quantity = $("#quantity").val();
            var condition = $("#condition").val();
            var data = {'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val() };
            $(".loading-gif").show();
            $.ajax({
                type: 'POST',
                url: '/cart/addtocart/' + book_id + '/' + condition + '/' + quantity + '/',
                dataType : 'json',
                data : data,
                success : function(data) {
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
        $('#condition').change(function() {
            var curr_button = $('#addtocart')[0]
            var book_id = $(curr_button).attr('data-bookid');
            var condition = $(this).val();
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
    
    function editionaddtocart() {
        $(".edition-addtocart-hidden").click( function(e) {
            e.preventDefault();
            var curr_button = $(this).siblings()[0];
            if($(curr_button).attr("flag") == 0) {
                return;
            }
            $(curr_button).attr("flag","0");
            var book_id = $(curr_button).parent().parent().parent().find('a').attr('data-bookid');
            var quantity = $(curr_button).parent().parent().parent().find('.edition-quantity').val();
            var condition = $(curr_button).parent().parent().parent().find('.edition-condition').val();
            var data = {'csrfmiddlewaretoken' : $('input[name=csrfmiddlewaretoken]').val() };
            $(".loading-gif").show();
            $.ajax({
                type: 'POST',
                url: '/cart/addtocart/' + book_id + '/' + condition + '/' + quantity + '/',
                dataType : 'json',
                data : data,
                success : function(data) {
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
    
   
    function edition_condition_change() {
        $('.edition-condition').change(function() {
            var book_id = $(this).parent().parent().find('a').attr('data-bookid');
            var condition = $(this).val();
            var curr_button = $(this).parent().parent().find('.edition-addtocart')[0];
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

    return {   
        init : function() {
            condition_change();
            edition_condition_change();
            addtocart();
            editionaddtocart();
            $('[data-toggle="tooltip"]').tooltip();
            $("button:disabled").each(function (index) {
                registerTooltip.bind(this)();            
            });
        }
    };
})();
