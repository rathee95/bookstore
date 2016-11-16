var books = (function() {
    
    function init() {
        addtocart.init();
        condition_switch.init();
        editions_change.init();
    }

    return {
        init : init
    };
})();
