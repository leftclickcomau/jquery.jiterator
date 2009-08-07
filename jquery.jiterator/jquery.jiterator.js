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
	 * 
	 * @param options Options object, overrides defaults.
	 * 
	 * @param options.delay Interval in milliseconds between displaying 
	 *   subsequent items.  Default: 2500
	 * @param options.initialDelay Delay in milliseconds before starting the
	 *   animation.  Any non-positive number starts immediately.  Default: 0
	 * @param options.previous Text for the previous button.  Default: '&laquo;'
	 * @param options.next Text for the next button.  Default: '&raquo;'
	 * @param options.navButtonClass CSS class name for all navigation buttons.
	 *   Default: 'navButton'
	 * @param options.previousButtonClass CSS class name for the previous 
	 *   button.  Default: 'previousButton',
	 * @param options.nextButtonClass CSS class name for the next button.
	 *   Default: 'nextButton'
	 *   
	 * @return Current jQuery object.
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
			'initialDelay' : 0,
			'previous' : '&laquo;',
			'next' : '&raquo;',
			'hover' : 'stop',
			'navButtonClass' : 'navButton',
			'previousButtonClass' : 'previousButton',
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
			var setPreviousItemVisible = function() {
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
					if (options.hover == 'stop') {
						stop();
					}
				}).mouseleave(function(event) {
					start();
				})
				.prepend($('<a class="'+options.navButtonClass+' '+options.previousButtonClass+'"><span>'+options.previous+'</span></a>').click(setPreviousItemVisible))
				.prepend($('<a class="'+options.navButtonClass+' '+options.nextButtonClass+'"><span>'+options.next+'</span></a>').click(setNextItemVisible));
			};
			
			/**
			 * Start the animation.
			 */
			var start = function() {
				if (!interval) {
					interval = setInterval(setNextItemVisible, options.delay);
				}
			};
			
			/**
			 * Stop the animation.
			 */
			var stop = function() {
				if (interval) {
					clearInterval(interval);
					interval = null;
				}
			};
			
			// Bootstrap
			init();
			if (options.initialDelay > 0) {
				setTimeout(start, options.initialDelay);
			} else {
				start();
			}
		}
	};
})(jQuery);
