// JavaScript Document
(function(window, undefined) {
    var $QS = function(elem) {
        return document.querySelectorAll(elem);
    }, doc = document, JMS = {};
    JMS.extend = function(Obj, source, override) {
        if (override === undefined) override = true;
        for (var property in source) {
            if (override || !(property in Obj)) {
                Obj[property] = source[property];
            }
        }
        return Obj;
    };
	//事件绑定
    JMS.onevent = function(obj, type, callback) {
        if (obj.addEventListener) {
            obj.addEventListener(type, callback, false);
        }
        return this;
    };
	// 元素取宽度
	JMS.width = function (elem) {
		var el = elem[0];
		return el === window ? window.innerWidth : el.offsetWidth;
	}
	// 元素取高度
	JMS.height = function (elem) {
		var el = elem[0];
		return el === window ? window.innerHeight : el.offsetHeight;
	}
    var config = {
		//目标元素ID或CLASS
		cell:"",
        //是否竖直方向滚动
        isVertical       : false,
		//初始位置选择
		posCell          :"", 
        //滚动率
        rate             : 400,
        //时间间隙阈值
        timeSpan         : 300,
        //滚动最大值
        maxScroll        : 400,
        //安卓响应率
        androidRate      : 1,
        //是否调整点击元素居中
        isAdjust         : false
    },
	mRoll = function(options) {
		var that = this, newobj = JSON.parse(JSON.stringify(config));
        that.config = JMS.extend(newobj, options);
		that.initView();
	};
	mRoll.prototype.initView = function(){
		var _this = this,Math = window.Math,
		opts = _this.config, 
		Cell = opts.cell,
		isVertical = opts.isVertical,
		rate = opts.rate,
		timeSpan = opts.timeSpan,
		maxScroll = opts.maxScroll,
		androidRate = opts.androidRate,
		isAdjust = opts.isAdjust,
		that = $QS(Cell),
		items = that[0].children,
		isAndroid = /(android)/i.test(window.navigator.userAgent);
		for(var c =0; c<items.length; c++) items[c].classList.add("mschildrens");
		initEvent();
		function translate(elem, dist) {
			var Style = elem.style;
			//Style.webkitTransitionDuration = Style.MozTransitionDuration = Style.msTransitionDuration = Style.OTransitionDuration = Style.transitionDuration = "200ms";
			Style.webkitTransform = 'translate3d(' + (isVertical ? '0,' + dist + 'px,0' : dist + 'px,0,0') + ')';
			Style.msTransform = Style.MozTransform = Style.OTransform = "translateX(" + dist + "px)";
		}
		function getStyle(obj,attr){ 
			attr = attr.indexOf('-')>-1 ? attr.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}) : attr;
			return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj,null)[attr];  
		}
		//初始化事件函数
		function initEvent(){
			//touchstart起点
			var startX, startY,
			//touch时间点
				startTime, endTime,
			//move的距离
				swipSpan,
			//作动画的值
				translateVal = 0,
			//当然translate值
				currentVal,
			//可滚动的值
				scrollVal;
			//初始化可滚动的值函数
			function initScrollVal() {
				//item包含margin的尺寸
				var itemsOuterVal = isVertical ?
					JMS.height(items) + parseFloat(getStyle(items[0],'margin-top')) + parseFloat(getStyle(items[0],'margin-bottom')) :
					JMS.width(items) + parseFloat(getStyle(items[0],'margin-left')) + parseFloat(getStyle(items[0],'margin-right')),
				//this不包含padding的尺寸
					thisInnerVal = isVertical ?
					JMS.height(that) - parseFloat(getStyle(that[0],'padding-top')) - parseFloat(getStyle(that[0],'padding-bottom')) :
					JMS.width(that) - parseFloat(getStyle(that[0],'padding-left')) - parseFloat(getStyle(that[0],'padding-right'));

				//记录可滚动的值
				scrollVal = itemsOuterVal - thisInnerVal;
			}

			initScrollVal();
			//移动到函数
			function slide(x) {
				//起点
				if (x > 0) {
					x /= 2;
				}
				//终点
				if (-x > scrollVal) {
					x = x + (-x - scrollVal) / 2;
				}
                translate($QS(Cell + " .mschildrens")[0],(translateVal = x));
			}
			//居中函数
			function center(me) {
				var translateVal = (opts.posCell != '' && $QS(Cell+" .mschildrens "+opts.posCell).length == 0) ?
				0 : isVertical ? (me.offsetTop - items[0].offsetTop) - (JMS.height(that) - me.clientHeight) / 2 :
				(me.offsetLeft - items[0].offsetLeft) - (JMS.width(that) - me.clientWidth) / 2;

				if (translateVal <= 0) {
					slide(0);
				}
				else {
					translateVal < scrollVal ? slide(-translateVal) : slide(-scrollVal);
				}
			}
			//暴露居中函数
            that[0].center = center;

			//触摸开始事件
			JMS.onevent(that[0],'touchstart', function (evt) {
				var touch = evt.targetTouches[0];
				//记录开始时间
				startTime = evt.timeStamp;
				//记录触摸开始位置
				startX = touch.pageX;
				startY = touch.pageY;
				//重置swipSpan
				swipSpan = 0;
				//记录x
				currentVal = translateVal;

				//不作动画
				items[0].classList.add('notrans');
			});

			//触摸移动事件
			JMS.onevent(that[0],'touchmove', function (evt) {
				var touch = evt.targetTouches[0],
					swipSpanX = touch.pageX - startX,
					swipSpanY = touch.pageY - startY;

				//上下
				if (isVertical && Math.abs(swipSpanX) < Math.abs(swipSpanY)) {
					evt.preventDefault();
					evt.stopPropagation();

					slide(currentVal + (swipSpan = swipSpanY));
				}
				//左右
				if (!isVertical && Math.abs(swipSpanX) > Math.abs(swipSpanY)) {
					evt.preventDefault();
					evt.stopPropagation();

					slide(currentVal + (swipSpan = swipSpanX));
				}
			});

			//触摸结束事件
			JMS.onevent(that[0],'touchend', function (evt) {
				//记录结束时间
				endTime = evt.timeStamp;

				//计算校正值(更加拟物化)
				var timeSpan = endTime - startTime,
				//安卓的touch响应时间较长故除以一定比率
					swipSpanAdjust = timeSpan > timeSpan ? 0 : swipSpan / (isAndroid ? timeSpan /= androidRate : timeSpan),
					span = Math.abs(swipSpanAdjust) * rate;

				//设置最大滚动值
				span > maxScroll && (span = maxScroll);

				//作动画
				items[0].classList.remove('notrans');

				if (swipSpan < 0) {
					-(translateVal - span) < scrollVal ? slide(translateVal - span) : slide(-scrollVal);
				}
				else if (swipSpan > 0) {
					translateVal + span < 0 ? slide(translateVal + span) : slide(0);
				}
			});

			//点击事件(如果需要将点击元素定位到居中)
			if(isAdjust){
				JMS.onevent(that[0],'click', function (evt) {
					center(evt.target);
				})
				center($QS(Cell+" .mschildrens "+opts.posCell)[0]);
			}
			//屏幕尺寸改变事件
			JMS.onevent(window,'resize', function () {
				JMS.width(that) > 0 && initScrollVal();
			}, false);
		}
		
	};
	var jemRoll = function(options){
		return new mRoll(options || {});
	}
	// 多环境支持
	"function" === typeof define ? define(function () { 
	    return jemRoll; 
	}) : ("object" === typeof module && "object" === typeof module.exports) ?  
	module.exports = jemRoll : window.jemRoll = jemRoll;
})(window);