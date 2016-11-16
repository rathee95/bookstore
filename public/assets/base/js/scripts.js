(function($){
    "use strict";

	/* FIX TRIM FOR IE8 */
	if ( typeof String.prototype.trim !== 'function' ) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

/* -----------------------------------------------------------------------------

	GLOBAL FUNCTIONS

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		ACCORDION
	------------------------------------------------------------------------- */

	$.fn.uouAccordion = function(){

		var self = $(this),
		items = self.find( '.accordion-item' );

		items.find( '.accordion-item-content:visible' ).css( 'display', 'block' );
		items.find( '.accordion-item-content:hidden' ).css( 'display', 'none' );

		items.find( '.accordion-toggle' ).each(function(){
			$(this).click(function(){

				if ( ! self.hasClass( 'type-toggle' ) ) {

					self.find( '.accordion-item.active .accordion-toggle .fa-minus' ).removeClass( 'fa-minus' ).addClass( 'fa-plus' );
					self.find( '.accordion-item.active .accordion-item-content' ).slideUp(300);
					self.find( '.accordion-item' ).removeClass( 'active' );

				}

				$(this).find( '.fa' ).toggleClass( 'fa-plus fa-minus' );
				$(this).parents( '.accordion-item' ).toggleClass( 'active' ).find( '.accordion-item-content' ).slideToggle(300, function(){
					if ( $(this).is( ':visible' ) ) {
						$(this).css( 'display', 'block' );
					}
					else {
						$(this).css( 'display', 'none' );
					}
				});

			});
		});

		return false;

	};

	/* -------------------------------------------------------------------------
		ALERT MESSAGES
	------------------------------------------------------------------------- */

	$.fn.uouAlertMessage = function(){

		var self = $(this),
		close = self.find( '.close' );
		close.click(function(){
			self.slideUp(300);
		});

	};

	/* -------------------------------------------------------------------------
		CONTACT FORM
	------------------------------------------------------------------------- */

	$.fn.uouContactForm = function(){

		var form = $(this).prop( 'tagName' ).toLowerCase() === 'form' ? $(this) : $(this).find( 'form' ),
		submit_btn = form.find( '.submit-btn' );

		form.submit(function(e){
			e.preventDefault();

			if ( ! submit_btn.hasClass( 'loading' ) ) {

				// form not valid
				if ( ! form.uouFormValid() ) {
					form.find( 'p.alert-message.warning.validation' ).slideDown(300);
					return false;
				}
				// form valid
				else {

					submit_btn.addClass( 'loading' ).attr( 'data-label', submit_btn.text() );
					submit_btn.text( submit_btn.data( 'loading-label' ) );

					// ajax request
					$.ajax({
						type: 'POST',
						url: form.attr( 'action' ),
						data: form.serialize(),
						success: function( data ){

							form.find( '.alert-message.validation' ).hide();
							form.prepend( data );
							form.find( '.alert-message.success, .alert-message.phpvalidation' ).slideDown(300);
							submit_btn.removeClass( 'loading' );
							submit_btn.text( submit_btn.attr( 'data-label' ) );

							// reset all inputs
							if ( data.indexOf( 'success' ) > 0 ) {
								form.find( 'input, textarea' ).each( function() {
									$(this).val( '' );
								});
							}

						},
						error: function(){
							form.find( '.alert-message.validation' ).slideUp(300);
							form.find( '.alert-message.request' ).slideDown(300);
							submit_btn.removeClass( 'loading' );
							submit_btn.text( submit_btn.attr( 'data-label' ) );
						}
					});

				}

			}
		});
	};

	/* -------------------------------------------------------------------------
		FORM ELEMENTS
	------------------------------------------------------------------------- */

	// CHEKCBOX INPUT
	$.fn.uouCheckboxInput = function(){

		var self = $(this),
		input = self.find( 'input' );



		// INITIAL STATE
		if ( input.is( ':checked' ) ) {
			self.addClass( 'active' );
		}
		else {
			self.removeClass( 'active' );
		}

		// CHANGE STATE
		input.change(function(){
			if ( input.is( ':checked' ) ) {
				self.addClass( 'active' );
			}
			else {
				self.removeClass( 'active' );
			}
		});

	};

	// RADIO INPUT
	$.fn.uouRadioInput = function(){

		var self = $(this),
		input = self.find( 'input' ),
		group = input.attr( 'name' );

		// INITIAL STATE
		if ( input.is( ':checked' ) ) {
			self.addClass( 'active' );
		}

		// CHANGE STATE
		input.change(function(){
			if ( group ) {
				$( '.radio-input input[name="' + group + '"]' ).parent().removeClass( 'active' );
			}
			if ( input.is( ':checked' ) ) {
				self.addClass( 'active' );
			}
		});

	};

	// SELECT BOX
	$.fn.uouSelectBox = function(){

		var self = $(this),
		select = self.find( 'select' );
		self.prepend( '<ul class="select-clone custom-list"></ul>' );

		var placeholder = select.data( 'placeholder' ) ? select.data( 'placeholder' ) : select.find( 'option:selected' ).text(),
		clone = self.find( '.select-clone' );
		self.prepend( '<input class="value-holder" type="text" disabled="disabled" placeholder="' + placeholder + '"><i class="fa fa-chevron-down"></i>' );
		var value_holder = self.find( '.value-holder' );

		// INPUT PLACEHOLDER FIX FOR IE
		if ( $.fn.placeholder ) {
			self.find( 'input, textarea' ).placeholder();
		}

		// CREATE CLONE LIST
		select.find( 'option' ).each(function(){
			if ( $(this).attr( 'value' ) ){
				clone.append( '<li data-value="' + $(this).val() + '">' + $(this).text() + '</li>' );
			}
		});

		// TOGGLE LIST
		self.click(function(){
			var media_query_breakpoint = uouMediaQueryBreakpoint();
			if ( media_query_breakpoint > 991 ) {
				clone.slideToggle(100);
				self.toggleClass( 'active' );
			}
		});

		// CLICK
		clone.find( 'li' ).click(function(){

			value_holder.val( $(this).text() );
			select.find( 'option[value="' + $(this).attr( 'data-value' ) + '"]' ).attr('selected', 'selected');

			// IF LIST OF LINKS
			if ( self.hasClass( 'links' ) ) {
				window.location.href = select.val();
			}

		});

		// HIDE LIST
		self.bind( 'clickoutside', function(event){
			clone.slideUp(100);
		});

		// LIST OF LINKS
		if ( self.hasClass( 'links' ) ) {
			select.change( function(){
				window.location.href = select.val();
			});
		}

	};

	/* -------------------------------------------------------------------------
		FORM VALIDATION
	------------------------------------------------------------------------- */

	$.fn.uouFormValid = function() {

		function emailValid( email ) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		var form = $(this),
		formValid = true;

		form.find( 'input.required, textarea.required, select.required' ).each(function(){

			var field = $(this),
			value = field.val(),
			valid = false;

			if ( value.trim() !== '' ) {

				// email field
				if ( field.hasClass( 'email' ) ) {
					if ( ! emailValid( value ) ) {
						field.addClass( 'error' );
					}
					else {
						field.removeClass( 'error' );
						valid = true;
					}
				}

				// select field
				else if ( field.prop( 'tagName' ).toLowerCase() === 'select' ) {

					if ( value === null || value === field.data( 'placeholder' ) ) {
						field.addClass( 'error' );
						field.parents( '.select-box' ).addClass( 'error' );
					}
					else {
						field.removeClass( 'error' );
						valid = true;
					}
				}

				// default field
				else {
					field.removeClass( 'error' );
					valid = true;
				}

			}
			else {
				field.addClass( 'error' );
			}
			formValid = ! valid ? false : formValid;

		});

		return formValid;

	};

	/* -------------------------------------------------------------------------
		IMAGES LOADED
	------------------------------------------------------------------------- */

    $.fn.uouImagesLoaded = function( options ) {
		if ( $.isFunction( options ) ) {

			var images = $(this).find( 'img' ),
			loaded_images = 0,
			count = images.length;

			if ( count > 0 ) {
				images.one( 'load', function(){
					loaded_images++;
					if ( loaded_images === count ){
						options.call();
					}
				}).each(function() {
					if ( this.complete ) { $(this).load(); }
				});
			}
			else {
				options.call();
			}

		}
    };
	
	/* -------------------------------------------------------------------------
		MEDIA QUERY BREAKPOINT
	------------------------------------------------------------------------- */

	var uouMediaQueryBreakpoint = function() {

		if ( $( '#media-query-breakpoint' ).length < 1 ) {
			$( 'body' ).append( '<var id="media-query-breakpoint"><span></span></var>' );
		}
		var value = $( '#media-query-breakpoint' ).css( 'content' );
		if ( typeof value !== 'undefined' ) {
			value = value.replace( "\"", "" ).replace( "\"", "" ).replace( "\'", "" ).replace( "\'", "" );
			if ( isNaN( parseInt( value, 10 ) ) ){
				$( '#media-query-breakpoint span' ).each(function(){
					value = window.getComputedStyle( this, ':before' ).content;
				});
				value = value.replace( "\"", "" ).replace( "\"", "" ).replace( "\'", "" ).replace( "\'", "" );
			}
			if(isNaN(parseInt(value,10))){
				value = 1199;
			}
		}
		else {
			value = 1199;
		}
		return value;

	};

	/* -------------------------------------------------------------------------
		PROGRESS BAR
	------------------------------------------------------------------------- */

	$.fn.uouProgressBar = function(){

		var self = $(this),
		percentage = self.data( 'percentage' ) ? parseInt( self.data( 'percentage' ) ) : 100,
		inner = self.find( '.progress-bar-inner > span' ),
		media_query_breakpoint = uouMediaQueryBreakpoint();

		// WITH INVIEW ANIMATIONS
		if ( $( 'body' ).hasClass( 'enable-inview-animations' ) && media_query_breakpoint > 991 ) {
			self.one( 'inview', function(){
				inner.css( 'width', percentage + '%' );
			});
		}
		// WITHOUT INVIEW ANIMATIONS
		else {
			inner.css( 'width', percentage + '%' );
		}

		// TYPE 2
		if ( self.hasClass( 'type-2' ) ) {

			var button = self.find( '.toggle' ),
			text = self.find( '.progress-bar-text' );
			button.click(function(){
				button.find( '.fa' ).toggleClass( 'fa-plus fa-minus' );
				if ( text.is( ':visible' ) ) {
					text.css( 'display', 'block' );
				}
				else {
					text.css( 'display', 'none' );
				}
				text.slideToggle(300);
				self.toggleClass( 'active' );
			});
		}

	};

	/* -------------------------------------------------------------------------
		RADIAL PROGRESS BAR
	------------------------------------------------------------------------- */

	$.fn.uouRadialProgressBar = function(){

		var self = $(this),
		percentage = self.data( 'percentage' ) ? parseInt( self.data( 'percentage' ) ) : 100,
		html = '',
		media_query_breakpoint = uouMediaQueryBreakpoint();

		// CREATE HTML
		html += '<div class="loader"><div class="loader-bg"><div class="text">0%</div></div>';
		html += '<div class="spiner-holder-one animate-0-25-a"><div class="spiner-holder-two animate-0-25-b"><div class="loader-spiner" style=""></div></div></div>';
		html += '<div class="spiner-holder-one animate-25-50-a"><div class="spiner-holder-two animate-25-50-b"><div class="loader-spiner"></div></div></div>';
		html += '<div class="spiner-holder-one animate-50-75-a"><div class="spiner-holder-two animate-50-75-b"><div class="loader-spiner"></div></div></div>';
		html += '<div class="spiner-holder-one animate-75-100-a"><div class="spiner-holder-two animate-75-100-b"><div class="loader-spiner"></div></div></div>';
		html += '</div>';
		self.prepend( html );

		// SET PERCENTAGE FUNCTION
		var set_percentage = function( percentage ){
			if ( percentage < 25 ) {
				var angle = -90 + ( percentage / 100 ) * 360;
				self.find( '.animate-0-25-b' ).css( 'transform', 'rotate(' + angle + 'deg)' );
			}
			else if ( percentage >= 25 && percentage < 50 ) {
				var angle = -90 + ( ( percentage - 25 ) / 100 ) * 360;
				self.find( '.animate-0-25-b' ).css( 'transform', 'rotate(0deg)' );
				self.find( '.animate-25-50-b' ).css( 'transform', 'rotate(' + angle + 'deg)' );
			}
			else if ( percentage >= 50 && percentage < 75 ) {
				var angle = -90 + ( ( percentage-50 ) / 100 ) * 360;
				self.find( '.animate-25-50-b, .animate-0-25-b' ).css( 'transform', 'rotate(0deg)' );
				self.find( '.animate-50-75-b' ).css( 'transform' , 'rotate(' + angle + 'deg)' );
			}
			else if ( percentage >= 75 && percentage <= 100 ) {
				var angle = -90 + ( ( percentage - 75 ) / 100 ) * 360;
				self.find(' .animate-50-75-b, .animate-25-50-b, .animate-0-25-b' ).css( 'transform', 'rotate(0deg)' );
				self.find( '.animate-75-100-b' ).css( 'transform', 'rotate(' + angle + 'deg)' );
			}
			self.find( '.text' ).html( percentage + '%' );
		}

		var clearProgress = function() {
			self.find( '.animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b' ).css( 'transform', 'rotate(90deg)' );
		}

		// SET PERCENTAGE
		if ( $( 'body' ).hasClass( 'enable-inview-animations' ) && media_query_breakpoint > 991 ) {
			self.one( 'inview', function(){
				for ( var i = 0; i <= percentage; i++ ) {
					(function(i) {
						setTimeout(function(){ set_percentage( i ); }, i * 20);
					})(i);
				}
			});
		}
		else {
			set_percentage( percentage );
		}

	};

	/* -------------------------------------------------------------------------
		TABBED
	------------------------------------------------------------------------- */

	$.fn.uouTabbed = function(){

		var self = $(this),
		tabs = self.find( '> .tab-title-list > .tab-title' ),
		contents = self.find( '> .tab-content-list > .tab-content' );

		tabs.click(function(e){
			if ( ! $(this).hasClass( 'active' ) ) {
				var index = $(this).index();
				tabs.filter( '.active' ).removeClass( 'active' );
				$(this).addClass( 'active' );
				contents.filter( '.active' ).hide().removeClass( 'active' );
				contents.filter( ':eq(' + index + ')' ).show().addClass( 'active' );

				// CHANGE LOCATION HASH IF NEEDED
				var target = $(e.target);
				if ( target.attr( 'href' ) ) {
					if ( history.pushState ) {
						history.pushState( null, null, target.attr( 'href' ) );
					}
					else {
						location.hash = target.attr( 'href' );
					}
				}
				return false;

			}
		});

	};

	/* -------------------------------------------------------------------------
		TOGGLE
	------------------------------------------------------------------------- */

	$.fn.uouToggle = function(){

		var self = $(this),
		title = self.find( '.toggle-title' ),
		content = self.find( '.toggle-content' );

		title.click(function(){
			self.toggleClass( 'closed' );
			content.slideToggle(200);
		});

	};

$(document).ready(function(){
/* -----------------------------------------------------------------------------

	GENERAL

----------------------------------------------------------------------------- */

	// GET ACTUAL MEDIA QUERY BREAKPOINT
	var media_query_breakpoint = uouMediaQueryBreakpoint();

	// INPUT PLACEHOLDER FIX FOR IE
	if ( $.fn.placeholder ) {
		$( 'input, textarea' ).placeholder();
	}

	// ACCORDIONS
	$( '.accordion-container' ).each(function(){
		$(this).uouAccordion();
	});

	// ALERT MESSAGES
	$( '.alert-message' ).each(function(){
		$(this).uouAlertMessage();
	});

	// FORM ELEMENTS
	$( '.checkbox-input' ).each(function(){
		$(this).uouCheckboxInput();
	});
	$( '.radio-input' ).each(function(){
		$(this).uouRadioInput();
	});
	$( '.select-box' ).each(function(){
		$(this).uouSelectBox();
	});

	// DATE PICKER
	$( '.calendar-input' ).each(function(){

		var input = $(this).find( 'input' ),
		dateformat = input.data( 'dateformat' ) ? input.data( 'dateformat' ) : 'm/d/y',
		icon = $(this).find( '.fa' ),
		widget = input.datepicker( 'widget' );

		input.datepicker({
			dateFormat: dateformat,
			minDate: 0,
			beforeShow: function(){
				input.addClass( 'active' );
			},
			onClose: function(){
				input.removeClass( 'active' );
				// TRANSPLANT WIDGET BACK TO THE END OF BODY IF NEEDED
				widget.hide();
				if ( ! widget.parent().is( 'body' ) ) {
					widget.detach().appendTo( $( 'body' ) );
				}
			}
		});
		icon.click(function(){
			input.focus();
		});

	});

	// PROGRESS BARS
	$( '.progress-bar' ).each(function(){
		$(this).uouProgressBar();
	});
	$( '.radial-progress-bar' ).each(function(){
		$(this).uouRadialProgressBar();
	});

	// TABS
	$( '.tabs-container' ).each(function(){
		$(this).uouTabbed();
	});

	// TOGGLES
	$( '.toggle-container' ).each(function(){
		$(this).uouToggle();
	});


/* -----------------------------------------------------------------------------

	HEADER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		HEADER SEARCH
	------------------------------------------------------------------------- */

	$( '.header-search, .mobile-header-search' ).each(function(){

		var self = $(this),
		search_input = self.find( '.search-input input' ),
		search_advanced = self.find( '.search-advanced' );

		// SHOW ADVANCED
		search_input.focus(function(){
			$(this).parent().find( '.ico' ).fadeOut(300);
		});

		// HIDE ADVANCED
		self.bind( 'clickoutside', function(event){
			if ( media_query_breakpoint > 991 ) {
                if ( search_input.val() === '' ) {
					search_input.parent().find( '.ico' ).fadeIn(300);
				}
			}
		});

	});

	
	/* -------------------------------------------------------------------------
		HEADER TOGGLES
	------------------------------------------------------------------------- */

	// SEARCH TOGGLE
	$( '.search-toggle' ).click(function(){
		$( '.mobile-search' ).slideToggle(300);
	});

	// NAVBAR TOGGLE
	$( '.navbar-toggle' ).click(function(){
		$( '.mobile-header-tools' ).slideToggle(300);
	});

/* -----------------------------------------------------------------------------

	BANNER

----------------------------------------------------------------------------- */

	/* -------------------------------------------------------------------------
		BANNER SEARCH
	------------------------------------------------------------------------- */

	$( '.banner-search-inner' ).each(function(){

		var self = $(this),
		tabs = self.find( '.tab-title' ),
		contents = self.find( '.tab-content' );

		// TAB CLICK
		tabs.click(function(){
			if ( ! $(this).hasClass( 'active' ) ) {
				var index = $(this).index();
				tabs.filter( '.active' ).removeClass( 'active' );
				$(this).addClass( 'active' );
				contents.filter( '.active' ).hide().removeClass( 'active' );
				contents.filter( ':eq(' + index + ')' ).show().addClass( 'active' );

			}
		});

	});


/* -----------------------------------------------------------------------------

	TESTIMONIALS

----------------------------------------------------------------------------- */

	$( '#testimonials' ).each(function(){

		var self = $(this),
		list = self.find( '.testimonial-list' ),
		testimonials = list.find( '.testimonial' );

		// SHOW FIRST PORTRAIT
		var first_portrait = testimonials.first().find( '.portrait img' );
		if ( first_portrait.length > 0 ) {
			list.before( '<div class="active-portrait"><img src="' + first_portrait.attr( 'src' ) + '" alt="' + first_portrait.attr( 'alt' ) + '"></div>' );
		}

		// CREATE SLIDER
		list.owlCarousel({
			autoPlay: 5000,
			slideSpeed: 300,
			pagination: false,
			paginationSpeed : 400,
			singleItem:true,
			addClassActive: true,
			afterMove: function(){
				var new_portrait;
				self.find( '.active-portrait' ).fadeOut(200, function(){
					new_portrait = list.find( '.owl-item.active .portrait img' );
					if ( new_portrait.length > 0 ) {
						self.find( '.active-portrait img' ).attr( 'src', new_portrait.attr( 'src' ) );
						self.find( '.active-portrait img' ).attr( 'alt', new_portrait.attr( 'alt' ) );
					}
					self.find( '.active-portrait' ).fadeIn(200);
				});
			}
		});

		// NAV
		self.find( '.navigation .prev' ).click(function(){
			list.trigger( 'owl.prev' );
		});
		self.find( '.navigation .next' ).click(function(){
			list.trigger( 'owl.next' );
		});

	});

/* -----------------------------------------------------------------------------

	SCREEN RESIZE

----------------------------------------------------------------------------- */

	$(window).resize(function(){
		if ( uouMediaQueryBreakpoint() !== media_query_breakpoint ) {
			media_query_breakpoint = uouMediaQueryBreakpoint();

			/* RESET HEADER ELEMENTS */
			$( '.header-navbar, .header-form, .header-nav, .header-nav ul, .header-menu, .header-search, .header-tools, .sub-menu' ).removeAttr( 'style' );
			$( '.submenu-toggle .fa' ).removeClass( 'fa-chevron-up' ).addClass( 'fa-chevron-down' );
			$( '.header-btn' ).removeClass( 'hover' );

		}

	});

/* END. */
});
})(jQuery);
