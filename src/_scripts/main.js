'use strict';

var $ = require('jquery');
var jQuery = $;
var ScrollMagic = require('scrollmagic');
var TweenMax = require('gsap');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');

String.prototype.toCamel = function(){
return this.replace(/([-_][a-z])/g, function($1){return $1.toUpperCase().replace(/[-_]/,'');});
};

String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.toDash = function(){
    return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

String.prototype.toUnderscore = function(){
    return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.decapitalize = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.blankLink = function(url) {
    return "<a target='_blank' href='" + url + "'>" + url + "</a>";
}

String.prototype.parseURL = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
        return url.blankLink(url);
    });
};

(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

var imagesToLoad = null;
(function($) {
    $.fn.queueLoading = function() {
        var maxLoading = 2;
        var images = $(this);
        if (imagesToLoad == null || imagesToLoad.length == 0)
            imagesToLoad = images;
        else
            imagesToLoad = imagesToLoad.add(images);
        var imagesLoading = null;

        function checkImages() {
            imagesLoading = imagesToLoad.filter('.is-loading');
            imagesLoading.each(function() {
                var image = $(this);
                if (isImageOk(image)) {
                    image.addClass('is-loaded').removeClass('is-loading');
                    image.trigger('loaded');
                }
            });
            imagesToLoad = images.not('.is-loaded');
            loadNextImages();
        }

        function loadNextImages() {
            imagesLoading = imagesToLoad.filter('.is-loading');
            var nextImages = imagesToLoad.slice(0, maxLoading - imagesLoading.length);
            nextImages.each(function() {
                var image = $(this);
                if (image.hasClass('is-loading'))
                    return;
                image.attr('src', image.attr('data-src'));
                image.addClass('is-loading');
            });
            if (imagesToLoad.length != 0)
                setTimeout(checkImages, 25);
        }
        checkImages();
    };
}(jQuery));


function isImageOk(img) {
    _img = img.data('img');
    if (typeof _img == 'undefined') {
        var _img = new Image();
        _img.src = img.attr('src');
        img.data('img', _img);
    }
    if (!_img.complete) {
        return false;
    }
    if (typeof _img.naturalWidth != "undefined" && _img.naturalWidth == 0) {
        return false;
    }
    return true;
}

$(function() {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    function checkWindowSize(args) {
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        windowWidth = e[a + 'Width'];
        windowHeight = e[a + 'Height'];
    }

    $(window).on('resize orientationchange', function(e) {
        checkWindowSize();
        checkDeviceType();
        screenHeightResize();
        var menu = $('.nav-header-c');
        if ( windowWidth <= 1239 ) {
            menu.fadeOut(400);
        } else {
            menu.fadeIn(400);
        }
        $(window).trigger('scroll');
    });

    var isHandheld = null;
    var isTablet = null;
    var isSmartphone = null;
    var isDesktop = null;

    function checkDeviceType() {
        if (windowWidth > 1024) {
            isHandheld = isSmartphone = isTablet = false;
            isDesktop = true;
        } else if (windowWidth >= 768) {
            isHandheld = isTablet = true;
            isDesktop = isSmartphone = false;
        } else {
            isHandheld = isSmartphone = true;
            isDesktop = isTablet = false;
        }
    }
    checkDeviceType();
    (function(a) {
        (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    })(navigator.userAgent || navigator.vendor || window.opera);
    var isIE = false;

    function getInternetExplorerVersion() {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        } else if (navigator.appName == 'Netscape') {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        if (rv != -1)
            isIE = true;
        return rv;
    }
    var IEVersion = getInternetExplorerVersion();
    var isSafari = false;

    function checkSafari() {
        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)
            isSafari = true;
    }
    checkSafari();

    $('body').on('mousedown', 'img', function() {
        return false;
    });

    $('.menu_burger').click(function(){

        $(this).toggleClass('active');
        var menu = $('.nav-header-c');
        menu.toggleClass('active');

        if( menu.hasClass("active")){menu.fadeIn(400);}



        else {menu.fadeOut(400);}

        return false;
    });

    /*$('body').on('click', '.scroll-to', function(e) {
        var link = $(this);
        var target = $(link.attr('href'));
        if (target.length == 0)
            return;
        $('html,body').animate({
            scrollTop: target.offset().top
        }, {
            duration: 1000,
            easing: 'easeInOutQuint'
        });
        e.preventDefault();
    });*/

    function screenHeightResize() {
        $('.screen-height').height(windowHeight);
    }
    
    function animateStickyMenu() {
    	var $menu_item = $('.nav-header ul li'),
        time_box = 0.4,
    	tlMenu,
        easing_box = Power4.easeInOut;
	    tlMenu = new TimelineMax();
	    tlMenu
	        .staggerFromTo($menu_item, 0.4, {autoAlpha: 0, y: 7},{autoAlpha: 1, y: 0, ease:easing_box}, 0.09);
	    $menu_item.parent().addClass('is-loaded');
    }

    function stickyNav() {

        var head = $('.site-head');
        var body_class = $('.body_home');
        var headul = head.find('ul');

        var scrollTop = $(window).scrollTop();

        if ( body_class.length > 0 ) {
            if (scrollTop >= windowHeight ) {
                head.addClass('is-sticky');
                if ( !headul.hasClass('is-loaded') ) {
                    animateStickyMenu();
                }
            } else {
                head.removeClass('is-sticky');
                headul.removeClass('is-loaded');
            }
        } else {
            head.addClass('is-sticky');
        }
    }
    $(window).on('scroll', stickyNav);

    $('.site-head').addClass('is-sticky');
    animateStickyMenu();
    
    var slideshowDuration = 4000;

    function slideshowSwitch(slideshow, index, auto) {
        if (slideshow.data('wait'))
            return;
        var slides = slideshow.find('.slide');
        var pages = slideshow.find('.pages');
        var activeSlide = slides.filter('.is-active');
        var activeSlideImage = activeSlide.find('.image-container');

        var newSlide = slides.eq(index);
        var newSlideImage = newSlide.find('.image-container');
        var newSlideContent = newSlide.find('.slide-content');
        var newSlideElements = newSlide.find('.animate-txt > *');

        console.log('newSlide ' + newSlide.index());
        console.log('activeSlide ' + activeSlide.index());

        if (newSlide.is(activeSlide))
            return;
        newSlide.addClass('is-new');
        var timeout = slideshow.data('timeout');
        console.log(timeout);
        clearTimeout(timeout);
        slideshow.data('wait', true);

        slideshow.find('.pages').trigger('check');

        if (newSlide.index() > activeSlide.index()) {
            var newSlideRight = 0;
            var newSlideLeft = 'auto';
            var newSlideImageRight = -slideshow.width() / 8;
            var newSlideImageLeft = 'auto';
            var newSlideImageToRight = 0;
            var newSlideImageToLeft = 'auto';
            var newSlideContentLeft = 'auto';
            var newSlideContentRight = 0;
            var activeSlideImageLeft = -slideshow.width() / 4;
        } else {
            var newSlideRight = '';
            var newSlideLeft = 0;
            var newSlideImageRight = 'auto';
            var newSlideImageLeft = -slideshow.width() / 8;
            var newSlideImageToRight = '';
            var newSlideImageToLeft = 0;
            var newSlideContentLeft = 0;
            var newSlideContentRight = 'auto';
            var activeSlideImageLeft = slideshow.width() / 4;
        }
        newSlide.css({
            display: 'block',
            width: 0,
            right: newSlideRight,
            left: newSlideLeft,
            zIndex: 2
        });
        newSlideImage.css({
            width: slideshow.width(),
            right: newSlideImageRight,
            left: newSlideImageLeft
        });
        newSlideContent.css({
            width: slideshow.width(),
            left: newSlideContentLeft,
            right: newSlideContentRight
        });
        activeSlideImage.css({
            left: 0
        });
        TweenMax.set(newSlideElements, {
            y: 20,
            force3D: true
        });

        TweenMax.to(activeSlideImage, 2, {
            left: activeSlideImageLeft,
            ease: Power3.easeInOut
        });

        TweenMax.to(newSlide, 2, {
            width: slideshow.width(),
            ease: Power3.easeInOut
        });

        TweenMax.to(newSlideImage, 2, {
            right: newSlideImageToRight,
            left: newSlideImageToLeft,
            ease: Power3.easeInOut
        });
        TweenMax.staggerFromTo(newSlideElements, 0.8, {
            alpha: 0,
            y: 60
        }, {
            alpha: 1,
            y: 0,
            ease: Power3.easeOut,
            force3D: true,

            delay: 2
        }, 0.1, function() {
            newSlide.addClass('is-active').removeClass('is-new');
            activeSlide.removeClass('is-active');
            newSlide.css({display: '',width: '',left: '',zIndex: ''});
            newSlideImage.css({width: '',right: '',left: ''});
            newSlideContent.css({width: '',left: ''});
            newSlideElements.css({opacity: '',transform: ''});
            activeSlideImage.css({left: ''});
            slideshow.find('.pages').trigger('check');
            slideshow.data('wait', false);
            if (auto) {
                timeout = setTimeout(function() {
                    slideshowNext(slideshow, false, true);
                }, slideshowDuration);
                slideshow.data('timeout', timeout);
            }
        });
        /*}*/
    }

    function slideshowNext(slideshow, previous, auto) {
        var slides = slideshow.find('.slide');
        var activeSlide = slides.filter('.is-active');
        var newSlide = null;

        if (previous) {
            newSlide = activeSlide.prev('.slide');
            if (newSlide.length == 0)
                newSlide = slides.last();

        } else {
            newSlide = activeSlide.next('.slide');
            if (newSlide.length == 0)
                newSlide = slides.filter('.slide').first();

        }
        slideshowSwitch(slideshow, newSlide.index(), auto);
    }
    /*
    $('.slideshow .arrows .arrow').on('click', function() {
        slideshowNext($(this).closest('.slideshow'), $(this).hasClass('prev'));
    });
    */

    //$('.shuffle').chaffle();

    $('.slideshow .pages .page').on('click', function() {
        slideshowSwitch($(this).closest('.slideshow'), $(this).index(),true);
    });

    $('.slideshow .pages').on('check', function() {
        var slideshow = $(this).closest('.slideshow');
        var pages = $(this).find('.page');
        var index = slideshow.find('.slides .is-active').index();
        pages.removeClass('is-active');
        pages.eq(index).addClass('is-active');
    });

    $('.slideshow').each(function() {
        var slideshow = $(this);
        var images = slideshow.find('.image').not('.is-loaded');
        images.on('loaded', function() {
            var image = $(this);
            var slide = image.closest('.slide');
            slide.addClass('is-loaded');
        });
        images.queueLoading();
        var timeout = setTimeout(function() {
            slideshowNext(slideshow, false, true);
        }, slideshowDuration);
        slideshow.data('timeout', timeout);
    });

    function sectionParalax() {
    	var controller = new ScrollMagic.Controller();
        var scrollTop = $(window).scrollTop();
        var background = $('.section-paralax .paralax-background .image-container');
        if (background.length == 1) {
            var backgroundTop = (background.offset().top - scrollTop) / 3;
            background.css({
                backgroundPosition: 'center ' + backgroundTop + 'px'
            })
        }
    }
    $(window).on('scroll', sectionParalax);

    $('body').on('click', 'a', function(e) {
        
        var url = $(this).attr('href');
        if (url.indexOf(ABD.host) === 0) {
            e.preventDefault();
            $('.site-head').removeClass('is-light is-sticky');
            TweenMax.to($('.page-container'), 0.2, {
                alpha: 0,
                onComplete: function() {
                    window.location = url;
                }
            });
        }
    });


    /* ---------------- CALL CONTROLLER ---------------- */

    function callController(controllerName, hash) {
        var functionName = controllerName + hash;
        $(document).trigger(functionName);
    }

    function pageInit(url, transition) {
        var container = $('body');
        callController('pageInit', 'Global');
        if (container.length == 1) {
            callController('pageInit', container.attr('data-page').toCamel());
            $('.page-container').css({opacity: 1});
        } else {
            TweenMax.to($('body'), 0.2, {alpha: 1});
        }
    }

    $(document).on('pageInitGlobal', function() {
        var controller = new ScrollMagic.Controller();
    });

    
    $(document).on('pageInithome', function() {
       	
        var controller = new ScrollMagic.Controller();

        $(window).on("scroll", onScroll);

        function onScroll(event){
            var scrollPos = $(document).scrollTop() ;
            var delta = 150;
            $('.nav-header ul li span').each(function () {
                var currLink = $(this);
                var refElement = $("#"+currLink.attr("data-target"));
                var refElement_pos = refElement.position();
                if (refElement_pos.top <= scrollPos + delta && refElement_pos.top + refElement.height() > (scrollPos - delta) ) {
                    $('.nav-header ul li span').removeClass("hover");
                    currLink.addClass("hover");
                }
                else{
                    currLink.removeClass("hover");
                }
            });
        }

        jQuery('span.scrollto').click(function(event){
            event.preventDefault();
            $(document).off("scroll");
            jQuery('.nav-header ul li span').removeClass('hover');
            jQuery(this).addClass('hover');
            var full_url = jQuery(this).attr('data-target');
            var target_offset = jQuery("#"+full_url).offset();
            var target_top = target_offset.top;
            jQuery('html, body').animate({scrollTop:target_top}, 1500, function () {
                $(document).on("scroll", onScroll);
            });

            var menu = $('.nav-header-c');

            if ( menu.hasClass("active") ) {
                $('.menu_burger').toggleClass('active');
                menu.toggleClass('active');
                if ( windowWidth <= 1239 ) {
                    menu.fadeOut(400);
                } else {
                    menu.fadeIn(400);
                }
            }
            
            return false;
        });
        
        $('.section-slideshow').each(function() {
            var slideshow = $(this);
            var slides = slideshow.find('.slides');
            var slideElements = slides.find('.is-active .animate-txt > *');
            var pages = slideshow.find('.page');
            //var arrows = slideshow.find('.arrow');
            var tl = new TimelineLite();
            tl.pause();
            tl.fromTo(slideshow, 0.5, {
                alpha: 0
            }, {
                alpha: 1
            }, 0.2);
            tl.staggerFromTo(slideElements, 0.8, {
                alpha: 0,
                y: 60
            }, {
                alpha: 1,
                y: 0,
                ease: Power3.easeOut,
                force3D: true
            }, 0.1, 0.6);
            tl.staggerFromTo(pages, 0.3, {
                alpha: 0,
                y: 10
            }, {
                alpha: 1,
                y: 0,
                ease: Power3.easeOut,
                force3D: true
            }, 0.1, 1);
            tl.call(function() {
                slideshow.css({
                    opacity: ''
                });
                slideElements.css({
                    opacity: '',
                    transform: ''
                });
            });
            tl.play();
        });

        $('.animate-v-c').each(function() {

            var section = $(this);
            var items = section.find('.animate-v:nth-child(3n+1)');
            var button = section.find('.action');

            items.each(function() {
                var item = $(this);
                var lineItems = item.add(item.nextAll().slice(0, 2));
                var scene = new ScrollMagic.Scene({
                    triggerHook: 0.75,
                    triggerElement: item.get(0),
                    reverse: false
                });
                var tl = new TimelineLite();
                tl.staggerFromTo(lineItems, 1, {
                    alpha: 0,
                    y: 50
                }, {
                    alpha: 1,
                    y: 0,
                    ease: Power3.easeOut,
                    force3D: true
                }, 0.2, 0);
                tl.call(function() {
                    lineItems.css({
                        opacity: '',
                        transform: ''
                    });;
                });
                scene.setTween(tl);
                scene.addTo(controller);
            });
            var scene = new ScrollMagic.Scene({
                triggerHook: 0.9,
                triggerElement: button.get(0),
                reverse: false
            });
            if ( button.length > 0 ) {
	            var tl = new TimelineLite();
	            tl.fromTo(button, 1, {
	                alpha: 0,
	                y: 50
	            }, {
	                alpha: 1,
	                y: 0,
	                ease: Power3.easeOut,
	                force3D: true
	            });
	            tl.call(function() {
	                button.css({
	                    opacity: '',
	                    transform: ''
	                });
	            });
	            scene.setTween(tl);
	        }
            scene.addTo(controller);
        });

        $('.box_offre_c').each(function() {

            var section = $(this);
            var boxs = section.find('.box_offre');
            var lines = section.find('.line');

            var scene = new ScrollMagic.Scene({
                triggerHook: 0.75,
                triggerElement: section.get(0),
                reverse: false
            });

            var box = boxs;
            var lineBoxs = box.add(box.nextAll().slice(0, 2));

            var tl = new TimelineMax();

            tl.staggerFromTo(lineBoxs, 1,
                {alpha: 0,y: 50},
                {alpha: 1,y: 0,
                ease: Power3.easeOut,
                force3D: true
            }, 0.2, 0);

            scene.setTween(tl);
            scene.addTo(controller);

        });

        var test = 1;
        $('.line').each(function() {

            var line = $(this);
            var trigger = $('.content_offres');
            var height_line = line.height();
            var delta = line.attr('data-delta') * -1;
            var delta_end = line.attr('data-delta-end');
            var first = line.attr('data-first') - 1;
            var end   = line.attr('data-end') - 1;
            var label = line.find('.label');
            var label_span = line.find('.label span');
            var label_width = label.width();
            var label_span_width = label_span.width();
            var label_bulle = label.find('.bulle');
            var label_bulle_line = label.find('.bulle_line');
            var diff_label = label_span_width+10;
            
            var height_step = trigger.height() / ($('.liste_offres').find('.box_offre_c').length - 1);
            var top         = first * height_step;
            var height_line = (end-first) * height_step;

            console.log("Line "+test+" => top:"+top+"  //  height_line:"+height_line);

            line.css({top: top,height: height_line})
            
            var scene_test = new ScrollMagic.Scene({
                triggerHook: 0.4,
                offset: delta - 30,
                triggerElement: label.get(0),
                reverse: true
            });

            if ( $(this).hasClass('line_l') ) {
                var label_anim = label.get(0);
                var label_anim_tween = new TimelineMax()
                .add(TweenMax.fromTo(label_bulle, 0.2, {scale: 0,transformOrigin: "50% 50%"},{scale: 1,force3D: true}))
                .add(TweenMax.fromTo(label_bulle_line, 0.4, {left: '100%'},{left: diff_label}))
                .add(TweenMax.fromTo(label_span, 0.4, {alpha: 0},{alpha: 1}))
            } else {
                var label_anim = label.get(0);
                var label_anim_tween = new TimelineMax()
                .add(TweenMax.fromTo(label_bulle, 0.2, {scale: 0,transformOrigin: "50% 50%"},{scale: 1,force3D: true}))
                .add(TweenMax.fromTo(label_bulle_line, 0.4, {right: '100%'},{right: diff_label}))
                .add(TweenMax.fromTo(label_span, 0.4, {alpha: 0},{alpha: 1}))
            } 
            scene_test.setTween(label_anim_tween);
            scene_test.addTo(controller);


            var scene = new ScrollMagic.Scene({
                triggerHook: 0.4,
                offset: delta,
                triggerElement: line.get(0),
                duration: height_line - 50 - delta_end,
                reverse: true
            });

            //scene.setTween(nervousHat)
            scene.setPin(label.get(0),{pushFollowers:false});
            scene.addTo(controller);
            test++;        
        });

        /* Paralaxe Home */ 

        $('.section-paralax').each(function() {
            var section = $(this);
            var background = section.find('.paralax-background');
            var title = section.find('.paralax-content');
            var scene = new ScrollMagic.Scene({
                triggerHook: 0.8,
                triggerElement: section.get(0),
                reverse: false
            });
            var tl = new TimelineLite();
            tl.call(function() {
                background.css({
                    height: section.first().height(),
                });
            });
            tl.fromTo(title, 0.3, {
                alpha: 0,
                y:0
            }, {
                alpha: 1,
                y: 0,
                ease: Linear.easeNone
            }, 0.2, 0);
            tl.call(function() {
                title.css({
                    opacity: ''
                });
            });
            scene.setTween(tl);
            scene.addTo(controller);
        });

        $('.animate-h-c').each(function() {
            var section = $(this);
            var items = section.find('.animate-h');
            var scene = new ScrollMagic.Scene({
                triggerHook: 0.75,
                triggerElement: section.get(0),
                reverse: false
            });
            var tl = new TimelineLite();
            tl.staggerFromTo(items, 1, {alpha: 0,x: -50}, {alpha: 1,x: 0,ease: Power3.easeOut,force3D: true}, 0.2, 0);
            tl.call(function() {items.css({opacity: '',transform: ''});;});
            scene.setTween(tl);
            scene.addTo(controller);
        });

        $('.scroller').each(function() {
            var section = $(this);
            var items = section.find('.dot');
            var tl = new TimelineMax({repeat:-1});
            tl.staggerFromTo(items, 2, {alpha: 0,y: 0}, {alpha: 1,y: 10,ease: Power3.easeOut,force3D: true,repeat:-1}, 0.2, 0);
        });
		
    });

    $(document).on('pageInitpage', function() {
        
        var controller = new ScrollMagic.Controller();

        $('.animate-v-c').each(function() {
            var section = $(this);
            var items = section.find('.animate-v');
            var button = section.find('.action');
            var scene = new ScrollMagic.Scene({
                triggerHook: 0.85,
                triggerElement: section.get(0),
                reverse: false
            });
            scene.addTo(controller);

            items.each(function() {
                var item = $(this);
                var lineItems = item.add(item.nextAll().slice(0, 2));
                var scene = new ScrollMagic.Scene({
                    triggerHook: 0.75,
                    triggerElement: item.get(0),
                    reverse: false
                });
                var tl = new TimelineLite();
                tl.staggerFromTo(lineItems, 1,
                    {alpha: 0,y: 50},
                    {alpha: 1,y: 0,
                    ease: Power3.easeOut,
                    force3D: true
                }, 0.2, 0);
                tl.call(function() {lineItems.css({opacity: '',transform: ''});
                });
                scene.setTween(tl);
                scene.addTo(controller);
            });

            if ( button.length > 0 ) {

                var scene = new ScrollMagic.Scene({
                    triggerHook: 0.9,
                    triggerElement: button.get(0),
                    reverse: false
                });

                var tl = new TimelineLite();
                tl.fromTo(button, 1, {
                    alpha: 0,
                    y: 50
                }, {
                    alpha: 1,
                    y: 0,
                    ease: Power3.easeOut,
                    force3D: true
                });
                tl.call(function() {
                    button.css({
                        opacity: '',
                        transform: ''
                    });
                });
                scene.setTween(tl);
            }
            scene.addTo(controller);
        });

        $('.section-paralax').each(function() {
            var section = $(this);
            var background = section.find('.paralax-background');
            var title = section.find('.paralax-content');
            var scene = new ScrollMagic.Scene({
                triggerHook: 0.8,
                triggerElement: section.get(0),
                reverse: false
            });
            var tl = new TimelineLite();
            tl.call(function() {
                background.css({
                    height: section.first().height()
                });
            });
            tl.fromTo(title, 0.3, {
                alpha: 0,
                y:50
            }, {
                alpha: 1,
                y: 0,
                ease: Linear.easeNone
            }, 0.2, 0);
            tl.call(function() {
                title.css({
                    opacity: ''
                });
            });
            scene.setTween(tl);
            scene.addTo(controller);
        });
    });
    
    var windowLoaded = false;

    function windowOnLoad() {
        if (windowLoaded)
            return;
        windowLoaded = true;
        $(window).trigger('resize');
        pageInit();
    }

    $(window).on('load', windowOnLoad);
    $(window).bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload()
        }
    });
    $(window).on('unload', function() {});
    window.onunload = function() {};

    $('img.queue-loading.as-background').on('loaded', function() {
        var image = $(this);
        var container = image.parent();
        container.css({
            backgroundImage: 'url("' + image.attr('src') + '")'
        });
        image.css({
            'opacity': 0,
            'visibility': 'hidden'
        });
    });

    $('img.queue-loading').queueLoading();

});;

//icl_lang = icl_vars.current_language;
//icl_home = icl_vars.icl_home;

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}