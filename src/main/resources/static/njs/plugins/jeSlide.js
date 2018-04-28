/**
 * author:jordenli
 * create time: 2017-12-12
 * content:原生轮播插件
*/

/**
 * 优化记录：
 * 1.实现左右无限加载模式  
 * 2.实现大幕模式
 * 3.实现movie模式
*/

; (function (window, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    } else {
        window.jeSlide = factory();
    }
})(this, function () {
    // 辅助对象
    var Help = {
        /*监听过渡结束事件*/
        transitionEnd: function (dom, callback) {
            //没dom的时候或者不是一个对象的时候 程序停止
            if (!dom || typeof dom != 'object') return;
            dom.addEventListener('transitionEnd', function () {
                callback && callback();
            });
            dom.addEventListener('webkitTransitionEnd', function () {
                callback && callback();
            });
        },
        // 获取节点
        $Q: function (select, context) {
            context = context || document;
            if (!select || select == "[]") return [];
            return context.querySelectorAll(select);
        },
        // 对象合并
        extend: function () {
            var options, name, src, copy, deep = false, target = arguments[0], i = 1, length = arguments.length;
            if (typeof (target) === "boolean") deep = target, target = arguments[1] || {}, i = 2;
            if (typeof (target) !== "object" && typeof (target) !== "function") target = {};
            if (length === i) target = this, --i;
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name], copy = options[name];
                        if (target === copy) continue;
                        if (copy !== undefined) target[name] = copy;
                    }
                }
            }
            return target;
        },
        // 对内容区添加包裹层
        wrap: function (el, v) {
            var tmp = document.createElement('div');
            tmp.innerHTML = v;
            tmp = tmp.children[0];
            var _el = el.cloneNode(true);
            tmp.appendChild(_el);
            el.parentNode.replaceChild(tmp, el);
            return tmp;
        },
        // 添加过渡函数
        addTransition: function (dom, speed) {
            dom.style.transition = "all +" + speed + "+ms";
            dom.style.webkitTransition = "all " + speed + "ms"; /*做兼容*/
        },
        // 移除过渡函数
        removeTransition: function (dom) {
            dom.style.transition = "none";
            dom.style.webkitTransition = "none"; /*做兼容*/
        },
        // 移动函数
        setTranslateX: function (dom, translatex) {
            dom.style.transform = "translateX(" + translatex + "px)";
            dom.style.webkitTransition = "translateX(" + translatex + "px)"
        },
        // pc端验证
        IsPC: function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
    }

    var Slide = function (options) {
        var defaultOpts = {
            mainCell: '', // 主节点
            conCell: '', // 内容节点
            navCell: '', // 导航节点
            pageCell: '', // 左右导航父节点
            prev: '', // 上一页《
            next: '', // 下一页 》
            curNavClassName: 'on', // 当前导航类名
            pageStateCell: '', // 1/2
            autoPlay: true, // 是否循环播放
            showNav: false, // 是否显示显示导航栏
            isTouch: false, // 是否可以拖动
            hasHandle: false, //是否需要左右导航,
            effect: "leftLoop", // 默认右循环播放模式      两种模式：leftLoop curtain(大幕) movie(电影)
            index: 0, // 下标 
            timer: null, // 计时器
            duration: 3, // 间隔时间
            speed: 300, // 过渡函数执行时间
            sLoad: '', // 图片懒加载
            pageStateHTML: '',
            clickSectionWidth: 0.05,  // 左右点击区域宽度0.05
            imgSpacingDistant: 0.01   // 图片间隔1%
        };
        var that = this;
        this.opts = Help.extend(defaultOpts, options || {});
        this.bindData();

    };
    Slide.prototype = {
        // 常用全局对象绑定
        bindData: function () {
            var that = this,
                opts = that.opts;
            that.slideDOM = Help.$Q(opts.mainCell)[0]; // 主节点DOM
            that.conDOM = Help.$Q(opts.conCell, that.slideDOM)[0]; // 内容节点父对象  
            that.conDOMLens = that.conDOM.children.length; // 内容节点的length
            that.navDOM = Help.$Q(opts.navCell, that.slideDOM)[0].children; // 导航节点 ---> []
            that.pageDOM = Help.$Q(opts.pageCell, that.slideDOM)[0] || null; // 左右导航父对象
            that.pageStateDOM = Help.$Q(opts.pageStateCell, that.slideDOM)[0]; // 1/3
            that.index = that.opts.index; // index
            that.timer = that.opts.timer;
            that.effect = opts.effect;
            that.startX = 0;
            that.moveX = 0;
            that.distanceX = 0;
            that.touchStart = !Help.IsPC() ? 'touchstart' : '';
            that.touchMove = !Help.IsPC() ? 'touchmove' : '';
            that.touchEnd = !Help.IsPC() ? 'touchend' : '';
            that.isMove = false;
            if (that.effect == 'leftLoop' || that.effect == 'curtain'|| that.effect == 'movie') {
                that.renderWrap();
            } else {
                return false;
            }
        },
        // 主体内容添加滚动样式，以后添加其他模式可以修改这里
        conReset: function () {
            var that = this,
                opts = that.opts;
            that.slideWidth = that.slideDOM.offsetWidth; // 获取主节点的宽度
            var conWidth = that.conDOMLens * that.slideWidth;
            var twCell = Help.wrap(that.conDOM, '<div class="tempWrap" style="overflow:hidden; position:relative;"></div>');
            that.conDOM = Help.$Q(opts.conCell, twCell)[0];
            if (that.effect == "leftLoop") {
                that.conDOM.style.cssText = "width:" + conWidth + "px;" + "position:relative;overflow:hidden;padding:0;margin:0;transform:translateX(" + (-that.slideWidth) + "px)";
            } else if (that.effect == "curtain") {
                that.conDOM.style.cssText = "width:" + conWidth * (1 - opts.clickSectionWidth * 2) + "px;" + "position:relative;overflow:hidden;padding:0;margin:0;transform:translateX(" + (-that.slideWidth * (1 - opts.clickSectionWidth * 3)) + "px)";
            }else if (that.effect == "movie") {
                // 这里对左右显示区域进行定制
                opts.clickSectionWidth = 0.1;
               
                that.conDOM.style.cssText = "width:" + conWidth * (1 - opts.clickSectionWidth * 2) + "px;" + "position:relative;overflow:hidden;padding:0;margin:0;transform:translateX(" + (-that.slideWidth * (1 - opts.clickSectionWidth * 3)) + "px)";
            }
            // 每屏的宽度

            [].slice.call(that.conDOM.children, 0).forEach(function (node,index) {
                if (that.effect == "curtain") {
                    node.style.cssText = "display:block;float:left;width:" + that.slideWidth * (1 - opts.clickSectionWidth * 2 - opts.imgSpacingDistant * 2) + "px;";
                    node.style.marginLeft = that.slideWidth * (opts.imgSpacingDistant) + "px";
                    node.style.marginRight = that.slideWidth * (opts.imgSpacingDistant) + "px";
                } else if (that.effect == "leftLoop") {
                    node.style.cssText = "display:block;float:left;width:" + that.slideWidth + "px";
                }else if(that.effect == "movie"){
                    node.classList.add('swipe-slide');
                    if(index == 1){
                        node.classList.add('swipe-slide-active');
                    };
                    node.style.cssText = "display:block;float:left;width:" + that.slideWidth * (1 - opts.clickSectionWidth * 2 - opts.imgSpacingDistant * 2) + "px;";
                    node.style.marginLeft = that.slideWidth * (opts.imgSpacingDistant) + "px";
                    node.style.marginRight = that.slideWidth * (opts.imgSpacingDistant) + "px";   
                }
            });
        },
        // 导航区判断是否需要加载，如果没有是否可以自动生成
        navReset: function () {
            var that = this,
                opts = that.opts;
            // 处理 如果没有提供底部圆点，自动生成
            if (opts.showNav) {
                if (that.navDOM.length == 0) {
                    var temp = "";
                    for (var i = 0; i < that.conDOMLens - 2; i++) {
                        temp += typeof opts.showNav != "string" ? "<li></li>" : opts.showNav.replace('$', "");
                    };
                    that.navDOM = Help.$Q(that.opts.navCell, that.slideDOM)[0];
                    that.navDOM.innerHTML = temp;
                    that.navDOM = that.navDOM.children;
                    that.navDOM[0].classList.add(opts.curNavClassName);
                    that.clickNav();
                } else {
                    that.navDOM[0].classList.add(opts.curNavClassName);
                }
            }
        },
        renderWrap: function () {
            var that = this,
                opts = that.opts;
            if (that.effect == "leftLoop" || that.effect == "curtain"||that.effect=="movie") {
                that.conDOMLens += 2;
                that.conDOM.appendChild(that.conDOM.children[0].cloneNode(true));
                that.conDOM.insertBefore(that.conDOM.children[that.conDOMLens - 3].cloneNode(true), that.conDOM.children[0]);
            }
            that.conReset();
            that.navReset()
            that.init();
        },

        init: function () {
            var that = this,
                opts = that.opts;
            /**
             * 模块开关
             * */

            // 是否自动播放
            if (opts.autoPlay) {
                that.autoplay();
                that.imgLazy();
            } else {
                that.index++;
                that.imgLazy();
            };

            // 是否有左右导航
            if (opts.hasHandle) {
                that.pageNav();
            } else {
                if (that.pageDOM) {
                    that.pageDOM.style.display = "none"
                }

            }

            // 是否可以拖动
            if (opts.isTouch) {
                that.conDOM.addEventListener(that.touchStart, function (e) {
                    that.touchstart(e)
                }, false);
            };
            that.pageStateEvent();
            window.addEventListener('resize', function () {
                clearInterval(that.timer);
                that.index = 0;
                that.conReset();
                that.resetInterval(that);
            }, false);
            that.conDOM.addEventListener(that.touchMove, function (e) {
                that.touchmove(e)
            }, false);
            window.addEventListener(that.touchEnd, function (e) {
                that.touchend(e)
            }, false);
        },

        // 图片懒加载
        imgLazy: function () {
            var that = this, opts = that.opts,
                cidx, attr, isundef = that.conDOM.children[that.index] == undefined;
            cidx = that.conDOM.children[isundef ? that.conDOMLens - 1 : that.index];
            if (opts.sLoad) {
                var attr = "[" + opts.sLoad + "]";
                var imgDOM = Help.$Q(attr, cidx)[0];
                if (imgDOM) {
                    if (imgDOM.tagName == "IMG") {
                        if (imgDOM.getAttribute(opts.sLoad)) {
                            imgDOM.setAttribute("src", imgDOM.getAttribute(opts.sLoad));
                        }
                    } else {
                        imgDOM.style.backgroundImage = "url('" + imgDOM.getAttribute(opts.sLoad) + "')";
                    }
                    imgDOM.removeAttribute(opts.sLoad);
                }
            }
        },
        // 图片每次移动的距离  status 是为 touchmove准备的，因为touchmove移动需要添加初始值,这里可以扩展
        moveDistance: function (context, status) {
            var that = context,
                opts = that.opts;
            if (status == undefined) {
                if (context.effect == "curtain") {
                    Help.setTranslateX(context.conDOM, -(context.index - 1) * context.slideWidth * (1 - opts.clickSectionWidth * 2) - context.slideWidth * (1 - opts.clickSectionWidth * 3));
                } else if (context.effect == "leftLoop") {
                    Help.setTranslateX(context.conDOM, -context.index * context.slideWidth);
                } else if(context.effect == "movie"){
                    Help.setTranslateX(context.conDOM, -(context.index - 1) * context.slideWidth * (1 - opts.clickSectionWidth * 2) - context.slideWidth * (1 - opts.clickSectionWidth * 3));
                }
            } else if (status == 'move') {
                if (that.effect == "curtain") {
                    Help.setTranslateX(that.conDOM, -(that.index - 1) * that.slideWidth * (1 - opts.clickSectionWidth * 2) - that.slideWidth * (1 - opts.clickSectionWidth * 3) + that.distanceX);
                } else if (context.effect == "leftLoop") {
                    Help.setTranslateX(that.conDOM, -that.index * that.slideWidth + that.distanceX); //实时的定位
                } else if(that.effect == "movie"){
                    Help.setTranslateX(that.conDOM, -(that.index - 1) * that.slideWidth * (1 - opts.clickSectionWidth * 2) - that.slideWidth * (1 - opts.clickSectionWidth * 3) + that.distanceX);
                }
            }
        },
        // 重置参数
        reset: function () {
            var that = this,
                opts = that.opts;
            that.startX = 0;
            that.moveX = 0;
            that.distanceX = 0;
            that.isMove = false;
        },
        // 重置定时器
        resetInterval: function (context) {
            var that = this,
                opts = that.opts;
            clearInterval(context.timer);
            context.reset();
            if (context.opts.autoPlay) {
                context.timer = setInterval(function () {
                    context.index++; //自动轮播到下一张
                    Help.addTransition(context.conDOM, context.opts.speed);
                    that.moveDistance(that);
                }, context.opts.duration * 1000);
            };
            Help.transitionEnd(context.conDOM, function () {
                if (opts.effect == 'curtain' || opts.effect == 'leftLoop'||opts.effect == 'movie') {
                    if (context.index > context.conDOMLens - 2) {
                        context.index = 1
                    } else if (context.index <= 0) {
                        context.index = context.conDOMLens - 2
                    };
                }
                Help.removeTransition(context.conDOM); //清除过渡
                that.moveDistance(that);
                context.switchNav();
                that.pageStateEvent()
            })
        },

        // autoPlay
        autoplay: function () {
            var that = this;
            opts = that.opts;
            that.index = 1;
            that.timer = setInterval(function () {
                that.index++;
                that.imgLazy();
                Help.addTransition(that.conDOM, opts.speed);
                that.moveDistance(that);
            }, opts.duration * 1000);
            Help.transitionEnd(that.conDOM, function () {
                var me = that;
                if (me.effect == "leftLoop" || that.effect == "curtain" || that.effect == "movie") {
                    if (me.index > me.conDOMLens - 2) {
                        me.index = 1
                    } else if (me.index <= 0) {
                        me.index = me.conDOMLens - 2
                    };
                    Help.removeTransition(me.conDOM); //清除过渡
                    that.moveDistance(that);
                }
                me.switchNav();
            })
        },

        // 导航状态切换
        switchNav: function (current) {
            var that = this,
                opts = that.opts;
            that.pageStateEvent();
            that.imgLazy();
            if (!opts.showNav) {
                return;
            }
            [].slice.call(that.navDOM, 0).forEach(function (item) {
                item.className = "";
            });
            that.navDOM[current == undefined ? that.index - 1 : current].classList.add(opts.curNavClassName)
        },
        pageStateEvent: function () {
            var that = this,
                opts = that.opts;
            if (that.pageStateDOM) {
                if (opts.effect == "leftLoop" || opts.effect == "curtain"||opts.effect == "movie") {
                    if (!opts.pageStateHTML) {
                        that.pageStateDOM.innerHTML = "<span>" + (that.index) + "/" + (that.conDOMLens - 2) + "</span>"
                    } else {
                        that.pageStateDOM.innerHTML = opts.pageStateHTML.replace('$1', that.index).replace('$2', that.conDOMLens - 2);
                    }
                }
            }
        },
        // 导航点击事件
        clickNav: function () {
            var that = this,
                opts = that.opts;
            [].slice.call(that.navDOM, 0).forEach(function (dot, index) {
                var me = that,
                    opts = that.opts;
                dot.addEventListener('click', function () {
                    clearInterval(me.timer);
                    var target = -me.slideWidth * (index + 1);
                    me.index = index + 1;
                    me.switchNav()
                    Help.addTransition(me.conDOM, opts.speed);
                    Help.setTranslateX(me.conDOM, target);
                    me.resetInterval(me);
                }, false)
            })
        },
        move: function (status) {
            var that = this,
                opts = that.opts;

            clearInterval(that.timer);
            switch (status) {
                case 'add':
                    that.index++;
                    break;
                case 'sub':
                    that.index--;
                    break;
                default:
                    break;
            };

            if(that.opts.effect == "movie"){
                var currentIndex = that.index;

                
                if(currentIndex >= that.conDOM.children.length-1){
                    currentIndex = 1;
                }else if(currentIndex<=0){
                    currentIndex = that.conDOM.children.length-2;
                };
                console.log(currentIndex);
                that.animateCurrentSlide(currentIndex)
                
            }
 


            that.imgLazy();
            Help.addTransition(that.conDOM, opts.speed);
            that.moveDistance(that);
            that.resetInterval(that);
        },
        // 对当前主屏进行动画处理
        animateCurrentSlide:function(currentIndex){
            var that = this;
            [].slice.call(that.conDOM.children,0).forEach(function(node,index){            
                    node.classList.remove('swipe-slide-active')        
            });
            that.conDOM.children[currentIndex].classList.add('swipe-slide-active');

        },
        // 上一页 和 下一页
        pageNav: function () {
            var that = this,
                opts = that.opts;
            var prevDOM = Help.$Q(opts.prev, that.slideDOM)[0];
            var nextDOM = Help.$Q(opts.next, that.slideDOM)[0];
            prevDOM.addEventListener('click', function () {
                that.move('sub');
            }, false);
            nextDOM.addEventListener('click', function () {
                that.move('add');
            }, false);
        },
        // touch事件
        touchstart: function (e) {
            var that = this,
                opts = that.opts;
            clearInterval(that.timer);
            var point = !Help.IsPC() ? e.touches[0] : e;
            that.startX = point.clientX;
        },
        touchmove: function (e) {
            var that = this,
                opts = that.opts;
            clearInterval(that.timer);
            var point = !Help.IsPC() ? e.touches[0] : e;
            that.moveX = point.clientX; //滑动时候的X
            that.distanceX = that.moveX - that.startX; //计算移动的距离
            Help.removeTransition(that.conDOM); //清除过渡
            that.moveDistance(that, 'move');
            that.isMove = true; //证明滑动过
        },
        touchend: function (e) {
            var that = this,
                opts = that.opts;
            // 滑动超过 1/4 即为滑动有效，否则即为无效，则吸附回去
            if (that.isMove && Math.abs(that.distanceX) > that.slideWidth / 5) {
                that.move(that.distanceX > 0 ? 'sub' : 'add');
            } else {
                that.move();
            };
            that.resetInterval(that);
        }
    };
    var jeSlide = function (options) {
        return new Slide(options || {})
    };

    return jeSlide;
});