var autocomplete = (function() {
    
    $(".search-form .button").click(function(e){
        e.preventDefault();
        if($("#college-autoComplete").attr("state") === "2") {
            $($(".search-form")[0]).submit();
        } else {
            $(".search-form #college-autoComplete").css("border-width","2px");
            $(".search-form #college-autoComplete").css("border-color","#f1155a");
        }
    });
    
    function handleInputChange() {
        var input = $('#college-autoComplete');
        input.on('keydown', function(e) {
            //handle enter key
            if(e.which == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
                return false;
            }
            var state = $(this).attr("state");
            if(state === '2') {
                $(this).attr("state", "1");
            }
        });
    }

    function handle_enterpress_autocomplete(){
        $(document).ready(function() {
            $('#autoComplete').parent().keypress(function(e) {
                if (e.keyCode == 13 &&  $('.ui-autocomplete.ui-menu a.ui-state-focus:visible').length == 0) {
                    e.preventDefault();
                    var text = $('#autoComplete').val();
                    if(text != "") {
                        window.location.href = '/books/search/?name=' + text ;
                    }
                }
            });
        });
    }

    function search_autocomplete() {
        $(document).ready(function() {
            $('#autoComplete').autocomplete({
                source: function(request, response) {
                    $.ajax({
                        method : 'GET',
                        url : '/books/search/autocomplete?term=' + $('#autoComplete').val(),
                        dataType : 'json',
                        success: function (data) {
                            data = data.slice(0,3);
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
                    var width = $('#autoComplete').width() + 22;
                    $('.ui-menu-item').width(width);
                },
                select: function(e, ui) {
                    window.location.href = '/books/' + ui.item.id + '/';
                }
            })
            .autocomplete( "instance" )._renderItem = function(ul, item) {
                return $("<li>")
                .append(item.label + "<br><span style=\"font-size: 13px\">" + item.authors + "</span>")
                .appendTo( ul );
            };
        });
    }

    function college_search_autocomplete(){
        $(document).ready(function() {
            $('#college-autoComplete').autocomplete({ 
                source: function(request,response){
                    $.ajax({
                        method: 'GET',
                        url : '/books/search/collegeautocomplete?term=' + $('#college-autoComplete').val(),
                        dataType : 'json',
                        success : function(data) {
                            response($.map(data,function(v,i) {
                                var currCollege =  v.name;
                                return {
                                    id: v.id,
                                    label: currCollege,
                                    value: currCollege
                                }
                            }))
                        }
                    });
                },
                open: function() {
                    var width = $('#college-autoComplete').width() + 22;
                    $('.ui-menu-item').width(width);
             //       $('.ui-menu-item').addClass("ui-menu-item-white");
                },
                select: function() {
                    $("#college-autoComplete").attr("state","2");
                }
            });
        });
    }
    
    function branch_search_autocomplete(){
        $(document).ready(function() {
            $('#branch-autoComplete').autocomplete({ 
                source:function(request,response) {
                    $.ajax({
                        method: 'GET',
                        url : '/books/search/branchautocomplete?term=' + $('#branch-autoComplete').val(),
                        dataType : 'json',
                        success : function(data) {
                            response($.map(data, function(v,i) {
                                var currBranch =  v.name;
                                return {
                                    id:v.id,
                                    label:currBranch,
                                    value: currBranch
                                }
                            }))
                        }
                    });
                },
                open: function() {
                    var width = $('#branch-autoComplete').width() + 22;
                    $('.ui-menu-item').width(width);
            //        $('.ui-menu-item').addClass("ui-menu-item-white");
                }
            });
        });
    }

    return {
        init : function() {
            handle_enterpress_autocomplete();
            search_autocomplete();
            college_search_autocomplete();
            branch_search_autocomplete();
            $(window).scroll(function() {
                $(".ui-autocomplete").hide();
            });
        }
    };
})();
