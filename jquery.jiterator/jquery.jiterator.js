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
				if ($(this).find('li').length > 1) {
					$.jiterator.create($(this), options);
				}
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
			var interval;
			
			/**
			 * Display the item at the given index.
			 * @param index Item to display.
			 */
			var setItemVisible = function(index) {
				var itemOut = $items.filter(':eq(' + $$.visible + ')');
				var itemIn = $items.filter(':eq(' + index + ')');
				itemOut.fadeOut(function() {
					$$.visible = index;
					itemIn.fadeIn();
				});
			};
			
			/**
			 * Display the next item.
			 */
			var setNextItemVisible = function() {
				setItemVisible(($$.visible + 1) % $items.length);
			};
			
			/**
			 * Display the previous item.
			 */
			var setPrevItemVisible = function() {
				setItemVisible(($$.visible + $items.length - 1) % $items.length);
			};
			
			/**
			 * Initialise the jiterator.
			 */
			var init = function() {
				// Hide all but the first item
				$$.find('li').not(':first').hide();
				$$.visible = 0;
				// Create the previous and next buttons; attach event handlers
				$$.mouseenter(function(event) {
					clearInterval(interval);
					interval = null;
				}).mouseleave(function(event) {
					interval = setInterval(setItemVisible, options.delay);
				})
				.prepend($('<a class="'+options.navButtonClass+' '+options.previousButtonClass+'"><span>'+options.previous+'</span></a>').click(setNextItemVisible))
				.prepend($('<a class="'+options.navButtonClass+' '+options.nextButtonClass+'"><span>'+options.next+'</span></a>').click(setPrevItemVisible));
				// Set the initial interval
				interval = setInterval(setNextItemVisible, options.delay);
			};
			
			init();
		}
	};
})(jQuery);
