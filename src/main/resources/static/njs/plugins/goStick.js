// JavaScript Document
;(function ($) {	
	$.fn.goStick = function(options) {
		var defaults = {
			btnCell:"#ontoBtn",	
			direction:"right",		//定位方向
			showHeight : 0,   //滚动到多少位置时显示
            fixed:"fixed",  //定位类型
			posLeft:20,
			posRight:20,
			posBottom:55, //浮层距离底部的高度
			durTime: 350, //过渡动画时间
			zIndex:1000, //层级高度  
			callback:null
		};
		var opts = $.extend(defaults,options), gthat = $(this),
			interPolate = function (source, target, shift) {  return (source + (target - source) * shift); },	  
			easing = function (pos) { return (-Math.cos(pos * Math.PI) / 2) + .5; },
            navendY = navigator.userAgent.match(/(Android)/i) ? 1 : 0,
			showH = opts.showHeight == 0 ? gthat.height()/2 : opts.showHeight;
		var gotoAnime = function() {
			if (opts.durTime === 0) {
                gthat.scrollTop(0, navendY);  
				if ($.isFunction(opts.callback)) opts.callback();
				return;
			}	  
			var startY = gthat.scrollTop(), startT = Date.now(), finishT = startT + opts.durTime;	  
			var scrollAnime = function() {
				var now = Date.now(), shift = (now > finishT) ? 1 : (now - startT) / opts.durTime;
                gthat.scrollTop(interPolate(startY, navendY, easing(shift)));	  
				if (now < finishT) {
				    setTimeout(scrollAnime, 15);
				}else {
				    if ($.isFunction(opts.callback)) opts.callback();
				}
			};	
			scrollAnime();
		};
		return this.each(function () {
			var that = $(this), tobtn = $(opts.btnCell);
			var isDirec = (opts.direction=="right") ? {right:opts.posRight}:{left:opts.posLeft};
			tobtn.css({'z-index':opts.zIndex,position:opts.fixed,display:"none",bottom:opts.posBottom}).css(isDirec);
			that.on("scroll", function(){
				var scrotop = $(this).scrollTop();		
				tobtn.css({display:scrotop >= showH ? "block" : "none"});
			});	
			tobtn.on("click", gotoAnime);
		})
	}
})(window.jQuery||window.Zepto||window.$);