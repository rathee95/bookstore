var auth = (function() {
    
    $("#login-modal .signup a").click(function(){
        $("#login-modal").modal('toggle');
        $("#signup-modal").modal('toggle');
    });

    function send_request() {
        var form= $(this).parent();
        var modal = $(form).parent().parent().parent();
        var formData= new FormData(form[0]);
        formData.append('csrfmiddlewaretoken', $("input[name='csrfmiddlewaretoken']").val());
        $('.loading-gif').show();
        $.ajax({
            url: form.attr('action'),
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            error: function(xhr, status, error){
                $('[data-toggle="tooltip"]').tooltip("destroy");
                var field;
                if(xhr.responseJSON.errors.__all__) {
                    field = $(form).find('#id_username');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.__all__[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.first_name) {
                    field = $(form).find('#id_first_name');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.first_name[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.username) {
                    field = $(form).find('#id_username');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.username[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.password) {
                    field = $(form).find('#id_password');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.password[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.password1) {
                    field = $(form).find('#id_password1');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.password1[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.password2) {
                    field = $(form).find('#id_password2');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.password2[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.phone_number) {
                    field = $(form).find('#id_phone_number');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.phone_number[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
                if(xhr.responseJSON.errors.email) {
                    field = $(form).find('#id_email');
                    $(field).attr('data-toggle', 'tooltip');
                    $(field).attr('title', xhr.responseJSON.errors.email[0]);
                    $(field).attr('data-placement', 'right');
                    $(field).tooltip('show');
                }
            },
            success: function(response, status, xhr){
                if(xhr.status == 201) {
                    var width = $('#signup-modal .form-card').width();
                    $('#signup-modal .form-card').empty();
                    $('#signup-modal .signup-footer').empty();
                    $('#signup-modal .btn-facebook').hide();
                    $('#signup-modal .content-div .seperator').hide();
                    $('#signup-modal .form-card').html("Thanks for registering with us. An email has been sent to you with the activation link.");
                    $('#signup-modal .form-card').css({"margin-top":"100px", "color":"#3f3f3f"});
                    $('#signup-modal .form-card').width(width + 50);
                } else {
                    $(modal).modal('toggle');
                    location.reload();                
                }
            },
            complete: function() {
                $('.loading-gif').hide();
            }
        });
    }

    return {
        init : function() {
            $('.main-button').click(function(e){
                e.preventDefault();
                send_request.bind(this)();
            });
            $(".modal").on("hidden.bs.modal", function() {
                $('[data-toggle="tooltip"]').tooltip('hide');
            });
        }
    };
})();
