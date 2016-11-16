var purchase = (function() {

    $("#steps").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        autoFocus: true,
        onStepChanged: function (event, currentIndex, priorIndex) {
            if(currentIndex ==0) {
                handleNextButton();
            }
            if(currentIndex == 1){
                handlepickuppoint();
            }
            if((currentIndex ==1 && priorIndex == 0) || (currentIndex==2 && priorIndex == 0)) {
                ChangeOrderDetails();
                removeBook();
                var button = $("#sell-modal").find('a[href="#finish"]')[0];

                if($("#sellorder-table tr").length > 1) {
                    $(button).css("pointer-events","auto");
                    $(button).css("background","#2184be");
                    $(button).css("color","#fff");
                } else {
                    $(button).css("pointer-events","none");
                    $(button).css("background","#eee");
                    $(button).css("color","#aaa");
                }
            }
        },
        labels: {
            finish: "Place Order",
        },
        onFinished: function (event, currentIndex) {            
            var is_loggedin = base.getCookie("logged_in_status");
            if(is_loggedin == 1) {
                $('.loading-gif').show();
                $('#sell-form').submit();
            } else {
                $('#sell-modal').modal('toggle'); 
                $('#login-modal').modal('toggle');         
            }
        }
    });

    function storeDataInCookie(){
        var orderstring = base.getCookie("orderArray");   
        orderArray = [] ;    
        var date = new Date();
        var days = 1;
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
        if(orderstring!=""){
            var str = 'orderArray='+expires;
            document.cookie = str;
        }

        $("#sellbookstable tr").each(function(){
                if($($(this).find(".sellBookautoComplete")[0]).attr('state') != 2) {
                    return;
                }
                var currentquantity =  parseInt($(this).find(".sellbook-quantity option:selected")[0].text);
                var currentcondition =  $(this).find(".sellbook-condition option:selected")[0].text;
                var currentBookPricetext = $(this).find(".book-selling-price")[0].innerText;
                var currentBookPrice = parseInt(currentBookPricetext.substr(3));
                var sellbook_id = $(this).find(".sellBookautoComplete").attr('data-book_id');
                var sellbook_title = $(this).find(".sellBookautoComplete").val();
                
                orderArray.push(sellbook_id+"^"+sellbook_title+"^"+currentcondition+"^"+currentquantity+"^"+currentBookPricetext+"^"+$(this).find(".quant")[0].innerText+'^');
        });
        var str ='orderArray='+orderArray.toString()+expires;
        document.cookie = str;
    }

    function getDataFromCookie(){
        var orderstring = base.getCookie("orderArray");
        if(orderstring!=""){
            $('#sellbookstable tbody').empty();
            var table = document.getElementById ("sellbookstable");
            var rowCount = table.rows.length;
            var rows = orderstring.split('^,');
            arrayInsert = 0;
            for(var i=0;i<rows.length;i++){
                var row = table.insertRow(rowCount);
                var tablee = rows[arrayInsert].split("^"); 
                var cell = row.insertCell (0);
                cell.innerHTML = "<td><span class='search-input'><input class=\"sellBookautoComplete currentsellBook\" name='sellBooksId' type='text' placeholder='Choose your book' onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Choose your book'\" state='0'> <input class = 'hiddensellBookautoComplete' type='text' name='hiddensellBooksId'></span></td>";
                $(cell).find('.sellBookautoComplete').attr("data-book_id", tablee[0]);
                $(cell).find('.sellBookautoComplete').attr("state",2);
                $($(cell).find('.hiddensellBookautoComplete')[0]).val(tablee[0] + ',2');
                $(cell).find('.sellBookautoComplete')[0].value = tablee[1];                 
                cell = row.insertCell(1);
                cell.innerHTML = "<td><select class='select-field sellbook-condition' name='sellBookCondition' ><option value='1'>Excellent</option><option value='2'>Good</option></select></td>";
                if(tablee[2]=="Excellent"){
                    $(cell).find('.sellbook-condition')[0].value = 1;
                }else{
                    $(cell).find('.sellbook-condition')[0].value = 2;
                }         
                cell = row.insertCell(2);
                cell.innerHTML = "<td><select class='select-field sellbook-quantity' name='sellBookQuantity'><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></td>";
                $(cell).find('.sellbook-quantity')[0].value = parseInt(tablee[3]);              
                cell = row.insertCell(3);
                cell.innerHTML = "<td><span class='book-selling-price'></span><span class='quant'></span></td>";
                $(cell).find('.book-selling-price')[0].innerText = tablee[4];
                $(cell).find('.quant')[0].innerText = tablee[5];
                cell = row.insertCell(4);
                cell.innerHTML = "<td><a class=\"sellbook-remove-button\"><i class=\"fa fa-trash-o\"></i></a></td>";
                rowCount = rowCount+1;
                arrayInsert = arrayInsert+1;            
         }
        }
        updateAddAnotherBookButtonState();
        calculateTotalPrice();
    }

    function disableTopNav() {
        $($("#sell-modal").find('a[href="#steps-h-1"]')[0]).css("pointer-events","none");
        $($("#sell-modal").find('a[href="#steps-h-2"]')[0]).css("pointer-events","none");
    }

    function handlepickuppoint() {
        var button = $("#sell-modal").find('a[href="#next"]')[0];
        var val =$('.pickup-select input')[0];
        var isPhoneNumberValid = true;
        if(val!==undefined){
            var patt = new RegExp("^\\+91[789]\\d{9}$");
            isPhoneNumberValid = patt.test($('.pickup-select input').val());
        }
        if($(".mypickuppoint").prop("selectedIndex") > 0 && isPhoneNumberValid) {
            $(button).css("pointer-events","auto");
            $(button).css("background","#2184be");
            $(button).css("color","#fff");
        } else {
            $(button).css("pointer-events","none");
            $(button).css("background","#eee");
            $(button).css("color","#aaa");
        }
    }

    function handleNextButton() {
        var button = $("#sell-modal").find('a[href="#next"]')[0];
        if($("#sellbookstable").find('tr input[state="2"]').length >= 1) {
            $(button).css("pointer-events","auto");
            $(button).css("background","#2184be");
            $(button).css("color","#fff");
        } else {
            $(button).css("pointer-events","none");
            $(button).css("background","#eee");
            $(button).css("color","#aaa");
        }
    }

    function handleInputChange() {
        var input = $('#sell-modal .sellBookautoComplete');
        input.on('keydown', function(e) {
            //handle enter key
            if(e.which == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
                return false;
            }
            var state = $(this).attr("state");
            if(state === '2') {
                $(this).parent().parent().parent().find('.book-selling-price')[0].innerText = '';
                $(this).parent().parent().parent().find('.quant')[0].innerText = '';
                $(this).parent().parent().parent().find('.sellbook-quantity').val('1');
                $(this).parent().parent().parent().find('.sellbook-condition').prop('disabled', true);
                $(this).parent().parent().parent().find('.sellbook-quantity').prop('disabled', true);
                $(this).parent().parent().parent().find('select').css('color','#999999');
                $(this).parent().parent().parent().find('.sellbook-remove-button').empty();
                $(this).attr("state", "1");
                $(this).attr("data-bookid", "");
                $($(this).parent().find(".hiddensellBookautoComplete")[0]).val("");
                updateAddAnotherBookButtonState();
                calculateTotalPrice();
                handleNextButton();
            }
        });
    }

    function calculateTotalPrice() {
        var total = 0;
        $("#sellbookstable tr").each(function(){
            var quantity =  parseInt($($(this).find(".sellbook-quantity option:selected")[0]).text());
            var price = $($(this).find(".book-selling-price")[0]).text();
            if(price.length > 0) {
                total = total + (parseInt(price.substr(3))*quantity);
            }
        });
        $("#total-selling-price span")[0].innerText = 'Rs.' + total;
    }
    
    function onPickUpPointChange(){
        $("#main-pickup-point")[0].innerText = 'Drop Point: '+ $("#pickup-point option:selected")[0].text;
        $('.pickup-select').children().on('change', function(){
            handlepickuppoint();
            $("#main-pickup-point")[0].innerText = 'Drop Point: '+ $("#pickup-point option:selected")[0].text;
        });
    }

    function ChangeOrderDetails(){
        $('#sellorder-table tbody').empty();
        var tableRef = document.getElementById('sellorder-table').getElementsByTagName('tbody')[0];
        tableRef.style.color = "Black";
        $("#sellbookstable tr").each(function(){
            if($($(this).find(".sellBookautoComplete")[0]).attr('state') != 2) {
                return;
            }
            var currentquantity =  parseInt($(this).find(".sellbook-quantity option:selected")[0].text);
            var currentcondition =  $(this).find(".sellbook-condition option:selected")[0].text;
            var currentBookPricetext = $(this).find(".book-selling-price")[0].innerText;
            var currentBookPrice = parseInt(currentBookPricetext.substr(3));
            var subtotal = currentBookPrice*currentquantity;
            var newRow   = tableRef.insertRow(tableRef.rows.length);
            var sellbook_id = $(this).find(".sellBookautoComplete").attr('data-book_id');
            var newCell1  = newRow.insertCell(0);
            $.ajax({
                type: 'GET',
                url: '/books/getsellbookdata/',
                dataType : 'json',
                data : { book_id: sellbook_id },
                success: function(data) {
                    var edition = data['edition'];
                    var title = data['title'];
                    var authors = data['authors'];
                    var imageurl = data['imageurl'];
                    var id = data['id'];
                    newCell1.innerHTML = "<td><div class='sellorderbook-info'><div class='sellorderbook-image-div'><img class='sellorderbook-image' src='"+imageurl+"'></div><div class='sellorderbook-description'><h6><strong>"+title+"</strong></h6><p style='color:black;'><strong>Edition: </strong>"+edition+"</p></div></div></td>"
                    
                }
            });  
            var newCell2  = newRow.insertCell(1);
            newCell2.innerHTML = "<td>" + currentcondition + "</td>";
            var newCell3  = newRow.insertCell(2);
            newCell3.innerHTML = "<td>" + currentquantity  + "</td>";
            var newCell4  = newRow.insertCell(3);
            newCell4.innerHTML = "<td>" + currentBookPricetext +"</td>";
            var newCell5  = newRow.insertCell(4);
            newCell5.innerHTML = "<td> Rs." + subtotal +"</td>";
            var newCell6  = newRow.insertCell(5);
            newCell6.innerHTML = "<td><a class=\"sellbook-remove-button\"><i class=\"fa fa-trash-o\"></i></a></td>";
        });
    }

    function changeSellingPrice(){
        var book_id = $(this).attr('data-book_id');
        var condition =  $(this).parent().parent().parent().find('.sellbook-condition option:selected')[0].text;
        var currentTarget = this;
        $.ajax({
            type: 'GET',
            url: '/books/getbuyingprice/',
            dataType : 'json',
            data : { book_id: book_id, condition: condition },
            success: function(data) {
                var q = data['selling_price'];
                var selling_price = $(currentTarget).parent().parent().parent().find('.book-selling-price');
                $(selling_price[0]).text('Rs.'+ q);
                storeDataInCookie();
                calculateTotalPrice();
                ChangeOrderDetails();
            }
        });  
    }

    function sellbook_conditionchange(){
        $(document).ready(function() {
            $(".sellbook-condition").each(function(){
                var currentTarget = this;
                $(this).on('change', function() {
                    var inputTarget = $(currentTarget).parent().parent().find(".sellBookautoComplete");
                    changeSellingPrice.bind(inputTarget)();
                });
            });
            
        });
    }

    function sellbook_quantitychange(){
        $(".sellbook-quantity").each(function(){
            var currentTarget = this;
            $(this).on('change', function() {
                $($(this).parent().parent().find(".quant")[0]).text(" x " + $(currentTarget).val());
                calculateTotalPrice();
                ChangeOrderDetails();
                storeDataInCookie();
            });
        });
    }
    
    function sellbook_autocomplete() {
        $(document).ready(function() {
            $(".sellBookautoComplete").each(function(){
                var currentTarget = this;
                var book_id = "";
                $(this).autocomplete({     
                    source: function(request, response) {
                        $.ajax({
                            method : 'GET',
                            url : '/books/search/autocomplete?term=' + $(currentTarget).val(),
                            dataType : 'json',
                            
                            success: function (data) {
                                response($.map(data, function(v,i){
                                    var ab = v.title + ", Edition " + v.edition;
                                    var authors = "by " 
                                    for (var key in v.authors) {
                                        authors += v.authors[key].name + ", ";
                                    }
                                    authors = authors.slice(0,-2)
                                    return {
                                        id: v.id,
                                        label: ab,
                                        value: v.title,
                                        authors: authors
           	                        }
                                }))
                            }
                        });
                        $(this).next().hide();
                    },
                    open: function() {
                        var width = $(currentTarget).width() + 22;
                        $('.ui-menu-item').width(width);
                    },
                    select: function (e, ui) {
                        $(currentTarget).blur();
                        $(currentTarget).attr("state","2");
                        $(currentTarget).parent().parent().parent().find('.sellbook-condition').prop('disabled', false);
                        $(currentTarget).parent().parent().parent().find('.sellbook-quantity').prop('disabled', false);
                        $(currentTarget).parent().parent().parent().find('select').css('color','black');
                        $(currentTarget).parent().parent().parent().find('.sellbook-remove-button').append("<i class=\"fa fa-trash-o\"></i>");
                        $(currentTarget).attr("data-book_id", ui.item.id);
                        $($(this).parent().find('.hiddensellBookautoComplete')[0]).val(ui.item.id + ',2');
                        storeDataInCookie();
                        changeSellingPrice.bind(currentTarget)();
                        updateAddAnotherBookButtonState();
                        handleNextButton();
                    }
                })
                .autocomplete( "instance" )._renderItem = function( ul, item ) {
                    return $("<li>")
                    .append(item.label + "<br><span style=\"font-size: 13px\">" + item.authors + "</span>")
                    .appendTo( ul );
                };
            });
        });
    }

    function removeBook() {
        $("#sell-modal #sellbookstable .sellbook-remove-button").each(function(){
            $(this).on('click', function() {
                $(this).parent().parent().remove();
                var table = document.getElementById("sellbookstable");
                var rowCount = table.rows.length;
                storeDataInCookie();
                if(rowCount == 1 ){
                    addAnotherBook();
                }
                calculateTotalPrice();
            });
        });

        $("#sell-modal #sellorder-table .sellbook-remove-button").each(function(){
            var currentTarget = this;
            $(this).on('click', function() {
                var row = $(this).parent().parent().parent().children().index($(this).parent().parent());
                $(currentTarget).parent().parent().remove();
                $("#sellbookstable tr").each(function(i){
                    if($($(this).find(".sellBookautoComplete")[0]).attr('state') != 2) {
                        return;
                    }
                    
                    if(i == row+1) {
                        $(this).remove();
                    }
                });
                var table = document.getElementById("sellbookstable");
                var rowCount = table.rows.length;
                storeDataInCookie();
                if(rowCount==1){
                    addAnotherBook();
                }
                calculateTotalPrice();
            });
        });
    }
    
    function updateAddAnotherBookButtonState() {
               
        var lastRow = $('#sellbookstable tr:last')[0];
        
        if($($(lastRow).find(".sellBookautoComplete")[0]).attr('state') == 2) {
            $('#add-another-book').removeClass("not-active");
            $('#add-another-book').addClass('active');
        } else {
            $('#add-another-book').removeClass('active');
            $('#add-another-book').addClass('not-active');
        }
    }

    function addAnotherBook() {
        var table = document.getElementById ("sellbookstable");
        var rowCount = table.rows.length;

        var row = table.insertRow(rowCount);
        var cell = row.insertCell (0);
        cell.innerHTML = "<td><span class='search-input'><input class=\"sellBookautoComplete currentsellBook\" name='sellBooksId' type='text' placeholder='Choose your book' onfocus=\"this.placeholder=''\" onblur=\"this.placeholder='Choose your book'\" state='0'> <input class = 'hiddensellBookautoComplete' type='text' name='hiddensellBooksId'></span></td>";
        cell = row.insertCell(1);
        cell.innerHTML = "<td><select disabled class='select-field sellbook-condition' name='sellBookCondition' ><option value='1'>Excellent</option><option value='2'>Good</option></select></td>";
        cell = row.insertCell(2);
        cell.innerHTML = "<td><select disabled class='select-field sellbook-quantity' name='sellBookQuantity'><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></td>";
        cell = row.insertCell(3);
        cell.innerHTML = "<td><span class='book-selling-price'></span><span class='quant'></span></td>";
        cell = row.insertCell(4);
        cell.innerHTML = "<td><a class=\"sellbook-remove-button\"></a></td>";
        sellbook_autocomplete() ;
        sellbook_conditionchange();
        sellbook_quantitychange();
        handleInputChange();
        removeBook();
        updateAddAnotherBookButtonState();
        base.inputclick();
    }

    return {
        init : function() {
            disableTopNav();
            getDataFromCookie();
            sellbook_autocomplete();
            sellbook_quantitychange();
            sellbook_conditionchange();
            onPickUpPointChange();
            removeBook();
            handleNextButton();
            handleInputChange();
            $('#add-another-book').click(addAnotherBook);
        }
    };
})();
    
