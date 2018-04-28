// Tabs切换效果
;(function ($) {
	$.fn.tabView = function(options) {
		var defaults = {
			navCell:".tabnav li",	    //导航对象，当自动分页设为true时为“导航对象包裹层”
			conCell:".tabcon",	//切换对象包裹层	
			currCell:"on",    //当前导航选中位置自动增加的class名称
			effect:"no",      //动画类型 left, no为无动画
			tabIndex:0,        //默认的当前位置索引。1是第一个；tabIndex:1 时，相当于从第2个开始执行
			ontabfun:null
		};
		var opts = $.extend(defaults,options);
		return this.each(function () {
			var that=$(this), 
			nav = that.find(opts.navCell), 
			con = $(opts.conCell,that),
			index = opts.tabIndex;
			var TransForm = function(){
				var per = -(index * 100) + '%';
				return {
					'-webkit-transform' : 'translate3d('+ per +', 0px, 0px)',
					'transform' : 'translate3d('+ per +', 0px, 0px)',
					'-webkit-transition' : 'all 0.35s ease',
					'transition' : 'all 0.35s ease',
					'display': '-webkit-box'
				}
			};
			var conHeight = function(){
				that.find(".tabslide").css(TransForm());
				con.find(".tabslide").children().eq(index).css("height","100%");
		        con.find(".tabslide").children().eq(index).siblings().css("height",0);
			};
			if(opts.effect == "left"){wrapNode(con[0],['div',{class:"tabslide"}]);}
			//if(opts.effect == "left"){wrapNode(con.children(),'<div class="tabslide"></div>');}
			var tabeffect = function(index){
				nav.removeClass(opts.currCell).eq(index).addClass(opts.currCell);
				switch(opts.effect){
					case "no":
						con.children().hide().eq(index).show();
					break;
					case "left":					
						conHeight();
					break;
				}
			};
			tabeffect(index);
			nav.on("tap",function(){	
			    index = $(this).index(); 			
				tabeffect(index);
				opts.ontabfun && opts.ontabfun($(this), index);
			});
		});
	}
//	function wrapNode(elem, html){
//		if (elem[0]) {
//			$(elem[0]).before(html = $(html));
//			var child;
//			while ((child = html.children()).length){ html = child.first()}
//			$(html).append(elem);
//		}
//		return elem;
//	}
function wrapNode(elem, value) {
	var create = function(){	
		var arg = arguments, obj = document.createElement( arg[0] ),attr = arg[1];
		if(attr != undefined){
			var attr = attr || {};
			for( var key in attr ){
				if( /[A-Z]/.test(key) ){ obj[ key ] = attr[ key ]; }else{ obj.setAttribute( key, attr[key] ); }			
			}
		}
		return obj;			
	}
    var objtoStr = Object.prototype.toString.call(value) == '[object Array]'; 
	var av1 = objtoStr ? value[0] : value, av2 = objtoStr ? value[1] : undefined;
	var getHtml = elem.innerHTML, createDiv = create(av1, av2);
    createDiv.innerHTML = getHtml;
	elem.innerHTML = '';
	elem.appendChild(createDiv);
}
})(window.jQuery||window.Zepto||window.$);