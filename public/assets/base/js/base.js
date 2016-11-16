var base = (function() {
    
    function inputclick() {
        $("input[type='text']").not("input[name='phone_number']").on("click", function () {
            $(this).select();
        });
    }

    $(".actions").prepend( "<h3 id=\"total-selling-price\">Total: <span>Rs.0</span></h3>" );
    $("#total-selling-price").css("float","left");
    $("#total-selling-price").css("margin-left","20px");
    $("#total-selling-price").css("margin-top","10px");

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    $(".mobile-sell-button").click(function() {
        $('.mobile-sell-toast').fadeIn(400).delay(2000).fadeOut(400);
    });    

    return {
        init : function() {
            auth.init();
            purchase.init();
            autocomplete.init();
            inputclick();
        },
        getCookie : getCookie,
        inputclick : inputclick
    };
})();

function init() {
    base.init();
}
window.addEventListener('load',init);