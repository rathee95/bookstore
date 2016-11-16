$(document).ready(function() {
	$('.delete').on('click', function (e) {
	    e.preventDefault();
	    var self = $(this), message = "",
	        link = self.attr('href') || self.data('href');
	    
	    if (!link) return false;

	    if (self.data('message')) {
	        message += self.data('message');
	    } else {
	        message += 'Are you sure, you want to proceed with the action?!';
	    }

	    bootbox.confirm(message, function (ans) {
	        if (!ans) return;

	        request.delete({url: link}, function (err, data) {
	            if (err) {
	                return bootbox.alert(err);
	            }

	            bootbox.alert(data.message, function () {
	                window.location.href = self.data('location') || window.location.href;
	            });
	        });
	    }); 
	});

	$('.request').on('click', function (e) {
		e.preventDefault();
	    var self = $(this), message = "",
	        link = self.attr('href') || self.data('href');

	    var type = self.data('type');

	    if (self.data('message')) {
	        message += self.data('message');
	    } else {
	        message += 'Are you sure, you want to proceed with the action?!';
	    }
	    
	    request[type]({url: link}, function (err, data) {
	        if (err) {
	            return bootbox.alert(err);
	        }

	        bootbox.alert(data.message, function () {
	            window.location.href = self.data('location') || window.location.href;
	        });
	    });
	})
});