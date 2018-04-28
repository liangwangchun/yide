/*
 * Created with Sublime Text 3.
 * license: http://www.lovewebgames.com/jsmodule/index.html
 * User: 田想兵
 * Date: 2015-05-13
 * Time: 10:27:55
 * Contact: 55342775@qq.com
 */
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.lazyInit = factory(window.Zepto || window.jQuery || $);
	}
})(this, function($) {
	$.fn.lazyload = function(config) {
		var newLazy = new lazyInit();
		var options = $.extend({elements: $(this)}, config);
		newLazy.init(options);
		return newLazy;
	};

	function lazyInit() {
		this.config = {  
			loadImg: '',
			container: window,
			effect: 'show',
			effectArgs: null,
			placeAttr: "data-src",
			offset: 0,
			fewPiece:0,
			event: 'scroll',
			elements: null,
			load: null
		};
	}
	lazyInit.prototype = {
		init: function(config) {
			this.config = $.extend(this.config, config);
			this.elements = $(this.config.elements);			
			this.initImg();   
			this.bindEvent();
		},
		initImg: function() {
			var _this = this, few = _this.config.fewPiece;
			this.elements.each(function() {				
				var $this = $(this);
				if (($this.attr('src') === undefined || $this.attr('src') === false || $this.attr('src') == "") && $this.is('img')) {
					$this.attr('src', _this.config.loadImg);
				}
			})
			if(few > 0){
				for(var i=0; i < few; i++){
					var elem = $(_this.elements), place =_this.config.placeAttr, eleImg = elem.eq(i).attr(place);
					if (elem.is('img')) {
						elem.eq(i).attr('src', eleImg).removeAttr(place);
					} else {
						elem.eq(i).css('background-image', "url('" + eleImg + "')").removeAttr(place);
					}
				}
			}else{
				if (this.config.event == "scroll") {
					this.load();
				}
			}
		},
		bindEvent: function() {
			var container = $(this.config.container);
			var _this = this;
			container.on(_this.config.event, function() {
				_this.load();
			});
			$(window).on('resize', function() {
				_this.load();
			});
		},
		load: function() {
			var _this = this;
			this.elements.each(function() {
				if (this.loaded) {
					return;
				}
				if (_this.checkPosition(this)) {
					_this.show(this);
				}
				_this.config.load && _this.config.load.call(_this, this)
			});
		},
		checkPosition: function(img) {
			var offsetTop = $(img).offset().top;
			var clientHeight = window.clientHeight || document.documentElement.clientHeight || document.body.clientHeight; //可视区域
			var clientWidth = window.clientWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var scrollTop = $(window).scrollTop();
			if (offsetTop + this.config.offset <= clientHeight + scrollTop) {
				return true;
			}
			return false;
		},
		show: function(img) {
			var _this = this;
			var $this = $(img);
			var self = img;
			self.loaded = false;
			var original = $this.attr(_this.config.placeAttr);
			$('<img/>').attr('src', original).on('load', function() {
				self.loaded = true;
				$this.hide();
				if ($this.is('img')) {
					$this.attr('src', original).removeAttr(_this.config.placeAttr);
				} else {
					$this.css('background-image', "url('" + original + "')").removeAttr(_this.config.placeAttr);
				}
				$this[_this.config.effect](_this.config.effectArgs).removeClass($this);
			});
		}
	}
	return lazyInit;
});