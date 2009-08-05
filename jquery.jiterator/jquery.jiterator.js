/*
 * jiterator
 * Display a sequence of items from a list (UL or OL), one at a time.
 * 
 * Leftclick.com.au jQuery plugin library
 * 
 * Copyright (c) 2009 Leftclick.com.au, Ben New
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {
	
	/**
	 * The jiterator plugin converts a UL element from a visual sequence into
	 * a temporal sequence; that is, it iterates through the items displaying
	 * them one at a time.
	 */
	$.fn.jiterator = function(options) {
		var options = $.extend({}, $.jiterator.defaultOptions, options);
		$(this).each(function() {
			var nodeName = this.nodeName.toLowerCase();
			if (nodeName == 'ul' || nodeName == 'ol') {
				$.jiterator.create($(this), options);
			}
		});
		return this;
	};
	
	$.jiterator = {
		/**
		 * Default options.
		 */
		defaultOptions : {
			'delay' : 2500,
			'previous' : '&laquo;',
			'next' : '&raquo;',
			'navButtonClass' : 'navButton',
			'previousButtonClass' : 'prevButton',
			'nextButtonClass' : 'nextButton'
		},
		
		/**
		 * Create the jiterator.
		 */
		create : function($$, options) {
			var $items = $$.find('li');
			var visible = 0;
			var interval;
			
			/**
			 * Set the item at the given index to be the visible item.
			 * @param i Item to display.
			 */
			var setItemVisible = function(i) {
				if (i < 0 || i >= $items.length) {
					var i = (visible + 1) % $items.length;
				}
				$items.filter(':eq('+visible+')').fadeOut(function() {
					$items.filter(':eq('+(visible=i)+')').fadeIn();
				});
			};
			
			/**
			 * Initialise the jiterator.
			 */
			var init = function() {
				// Hide all but the first item
				$$.find('li').not(':first').hide();
				// Create the previous and next buttons; attach event handlers
				var prevButton = $('<a class="'+options.navButtonClass+' '+options.previousButtonClass+'"><span>'+options.previous+'</span></a>');
				var nextButton = $('<a class="'+options.navButtonClass+' '+options.nextButtonClass+'"><span>'+options.next+'</span></a>');
				$$.mouseenter(function(event) {
					clearInterval(interval);
					interval = null;
				}).mouseleave(function(event) {
					interval = setInterval(setItemVisible, options.delay);
				}).prepend(
					nextButton.click(function(event) {
						setItemVisible((visible + 1) % $items.length);
					})
				).prepend(
					prevButton.click(function(event) {
						setItemVisible((visible + $items.length - 1) % $items.length);
					})
				);
				// Set the initial interval
				interval = setInterval(setItemVisible, options.delay);
			};
			
			init();
		}
	};
})(jQuery);
