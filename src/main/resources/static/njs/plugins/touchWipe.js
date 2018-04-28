/**
 * zepto插件：向左滑动删除动效
 * 使用方法：$('.itemWipe').touchWipe({delBtn: '.item-delete'});
 * 参数：itemDelete  删除按钮的样式名
 */
;
(function ($) {
    $.fn.touchWipe = function (option) {
        var defaults = {
            delBtn: '.item-delete', //删除元素
            delfun: null
        };
        var opts = $.extend({}, defaults, option); //配置选项
        var delWidth = $(this).find(opts.delBtn).width();
        var initX; //触摸位置X
        var initY; //触摸位置Y
        var moveX; //滑动时的位置X
        var moveY; //滑动时的位置Y
        var X = 0; //移动距离X
        var Y = 0; //移动距离Y
        var flagX = 0; //是否是左右滑动 0为初始，1为左右，2为上下，在move中设置，在end中归零
        var objX = 0; //目标对象位置
        var startevt, moveevt, endevt, isTouch = "ontouchstart" in window;
        startevt = isTouch ? 'touchstart' : "mousedown";
        moveevt = isTouch ? 'touchmove' : "mousemove";
        endevt = isTouch ? 'touchend' : "mouseup";
        $(this).on(startevt, function (event) {
            var obj = this;
            initX = isTouch ? event.targetTouches[0].pageX : event.clientX;
            initY = isTouch ? event.targetTouches[0].pageY : event.clientY;
            objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
            if (objX == 0) {
                $(this).on(moveevt, function (event) {
                    // 判断滑动方向，X轴阻止默认事件，Y轴跳出使用浏览器默认
                    if (flagX == 0) {
                        setScrollX(event);
                        return;
                    } else if (flagX == 1) {
                        //event.preventDefault();
                    } else {
                        return;
                    }

                    var obj = this;
                    moveX = isTouch ? event.targetTouches[0].pageX : event.clientX;
                    X = moveX - initX;
                    if (X >= 0) {
                        obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                    } else if (X < 0) {
                        var l = Math.abs(X);
                        if (l > delWidth) l = delWidth;
                        obj.style.WebkitTransform = "translateX(" + -l + "px)";
                    }
                });
            } else if (objX < 0) {
                $(this).on(moveevt, function (event) {
                    // 判断滑动方向，X轴阻止默认事件，Y轴跳出使用浏览器默认
                    if (flagX == 0) {
                        setScrollX(event);
                        return;
                    } else if (flagX == 1) {
                        //event.preventDefault();
                    } else {
                        return;
                    }

                    var obj = this;
                    moveX = isTouch ? event.targetTouches[0].pageX : event.clientX;
                    X = moveX - initX;
                    if (X >= 0) {
                        var r = -delWidth + Math.abs(X);
                        if (r > 0) r = 0;
                        obj.style.WebkitTransform = "translateX(" + r + "px)";
                    } else { //向左滑动
                        obj.style.WebkitTransform = "translateX(" + -delWidth + "px)";
                    }
                });
            };
            //结束时判断，并自动滑动到底或返回
            $(this).on(endevt, function (event) {
                //            event.preventDefault();
                var obj = this;
                objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                if (objX > -delWidth / 2) {
                    $(this).css({
                        transition: "all 0.2s",
                        transform: "translateX(" + 0 + "px)"
                    });
                    objX = 0;
                } else {
                    $(this).css({
                        transition: "all 0.2s",
                        transform: "translateX(" + -delWidth + "px)"
                    });
                    objX = -delWidth;
                }
                flagX = 0;
            })
        });

        //设置滑动方向
        function setScrollX(event) {
            //event.preventDefault();
            moveX = isTouch ? event.targetTouches[0].pageX : event.clientX;
            moveY = isTouch ? event.targetTouches[0].pageY : event.clientY;
            X = moveX - initX;
            Y = moveY - initY;
            flagX = (Math.abs(X) > Math.abs(Y)) ? 1 : 2;
            return flagX;
        }
        if (typeof (opts.delfun) === "function") opts.delfun($(this).find(opts.delBtn));
        //链式返回
        return this;
    };
})(Zepto);