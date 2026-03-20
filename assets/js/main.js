/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				$nav.children('.icons').remove();
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

		function initNavDrawCircles() {
			$nav.find('ul.links li a').each(function() {
				var $link = $(this);

				if ($link.children('.nav-draw-circle').length > 0)
					return;

				$link.append(
					'<svg class="nav-draw-circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
						'<ellipse cx="50" cy="20" rx="47" ry="16" pathLength="100"></ellipse>' +
					'</svg>'
				);
			});
		}

		function initNavBrand() {
			if ($nav.length === 0)
				return;

			if ($nav.children('.nav-brand').length > 0)
				return;

			$('<a href="index.html" class="nav-brand" aria-label="Home">LM</a>').prependTo($nav);
		}

		initNavBrand();
		initNavDrawCircles();

	// SPA Navigation - Load pages without full reload
		const pagesToLoad = ['index.html', 'undergraduate.html', 'postgraduate.html', 'industry.html', 'hobby.html', 'hook.html', 'boat.html', 'pedal.html', 'pump.html', 'rover.html'];
		
		function loadPageContent(url) {
			fetch(url)
				.then(response => response.text())
				.then(html => {
					// Parse the fetched HTML
					const parser = new DOMParser();
					const doc = parser.parseFromString(html, 'text/html');
					
					// Extract main content and footer
					const newMain = doc.querySelector('#main');
					const newFooter = doc.querySelector('#footer');
					
					if (newMain) {
						// Replace main content
						const currentMain = document.querySelector('#main');
						currentMain.innerHTML = newMain.innerHTML;
						
						// Replace footer if it exists in the new content
						if (newFooter) {
							const currentFooter = document.querySelector('#footer');
							if (currentFooter) {
								currentFooter.innerHTML = newFooter.innerHTML;
							}
						}
						
						// Update page title
						document.title = doc.querySelector('title').textContent;
						
						// Update active nav link
						updateActiveNav(url);
						
						// Set intro visibility and page position
						setPagePosition(url);
						
						// Reinitialize any jQuery animations or effects
						$body.removeClass('is-preload');
						$('.scrolly').scrolly();
					}
				})
				.catch(error => console.error('Error loading page:', error));
		}
		
		function updateActiveNav(url) {
			// Get the filename
			const filename = url.split('/').pop() || 'index.html';
			
			// Remove active class from all nav links
			$nav.find('a').each(function() {
				const href = $(this).attr('href');
				$(this).closest('li').removeClass('active');
			});
			
			// Add active class to the current page link
			$nav.find('a[href="' + filename + '"]').closest('li').addClass('active');

			// Ensure animated circles exist for links
			initNavDrawCircles();
		}

		function setPagePosition(url) {
			if ($nav.length > 0)
				window.scrollTo(0, $nav.offset().top);
		}
		
		// Intercept navigation link clicks
		$(document).on('click', '#nav a, #navPanel a', function(e) {
			const href = $(this).attr('href');
			
			// Only handle internal page links
			if (pagesToLoad.includes(href) || href === 'index.html') {
				e.preventDefault();
				
				// Update browser history
				history.pushState({ page: href }, '', href);
				
				// Load the page content
				loadPageContent(href);
			}
		});
		
		// Handle browser back/forward buttons
		window.addEventListener('popstate', function(event) {
			const page = event.state ? event.state.page : 'index.html';
			loadPageContent(page);
		});

})(jQuery);