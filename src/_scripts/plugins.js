// Avoid `console` errors in browsers that lack a console.
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
var jQuery = require('jQuery');
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
/*!
 * chaffle v1.0.0
 * 
 * Licensed under MIT
 * Copyright 2013-2014 blivesta
 * http://blivesta.com
 
(function($) {
  var namespace = "chaffle";
  var methods = {
    init: function(options) {
      options = $.extend({
        speed: 20,
        time: 140
      }, options);
      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);
        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, {
            options: options
          });
        }
        var $text = $this.text();
        var substitution;
        var shuffle_timer;
        var shuffle_timer_delay;
        var shuffle = function() {
          $this.text(substitution);
          if ($text.length - substitution.length > 0) {
            for (i = 0; i < $text.length - substitution.length; i++) {
              var shuffleStr = random_text.call();
              $this.append(shuffleStr);
            }
          } else {
            clearInterval(shuffle_timer);
          }
        };
        var shuffle_delay = function() {
          if (substitution.length < $text.length) {
            substitution = $text.substr(0, substitution.length + 1);
          } else {
            clearInterval(shuffle_timer_delay);
          }
        };
        var random_text = function() {
          var str;
          var lang = $this.data("lang");
          str = String.fromCharCode(33 + Math.round(Math.random() * 99));
          return str;
        };
        var start = function() {
          substitution = "";
          clearInterval(shuffle_timer);
          clearInterval(shuffle_timer_delay);
          shuffle_timer = setInterval(function() {
            shuffle.call(_this);
          }, options.speed);
          shuffle_timer_delay = setInterval(function() {
            shuffle_delay.call(this);
          }, options.time);
        };
        $this.unbind("mouseover." + namespace).bind("mouseover." + namespace, function() {
          start.call(_this);
        });
      });
    },
    destroy: function() {
      return this.each(function() {
        var $this = $(this);
        $(window).unbind("." + namespace);
        $this.removeData(namespace);
      });
    }
  };
  $.fn.chaffle = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + method + " does not exist on jQuery." + namespace);
    }
  };
})(jQuery);

*/
