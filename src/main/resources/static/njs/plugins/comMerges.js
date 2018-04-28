//jetpl
;(function(d,f){"function"===typeof define&&define.amd?define(["jetpl"],f):"object"===typeof exports?module.exports=f(require("jetpl")):d.jetpl=f(d.jetpl)})(this,function(d){var f={},l={error:function(a,c){"object"===typeof console&&console.error("jetpl "+a+"\n"+(c||""));return"jetpl "+a}},g=function(a){a=a||"";/^\#/.test(a)&&(a=document.getElementById(a.substring(1)).innerHTML);this.tpl=a;this.tplinit();f[a]=this};g.prototype.tplCompiler=function(a){var c=0;return'var outStr\x3d"";\n'+a.replace(/(^|%>|}})([\s\S]*?)({{|<%|$)/g,function(a,c,h,k){return c+'outStr+\x3d "'+h.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r?\n/g,"\\n")+'";\n'+k}).replace(/(<%=)([\s\S]*?)(%>)/g,"outStr+\x3d ($2);\n").replace(/(<%)(?!=)([\s\S]*?)(%>)/g,"\n$2\n").replace(/{{each\s*([\w."'\][]+)\s*(\w+)\s*(\w+)?}}/g,function(a,e,h,k){a="tps"+c++;return("for(var $p\x3d0; $p\x3c$1.length; $p++){"+(h?"\nvar $2 \x3d $1[$p];\n":"\nvar $item \x3d $1[$p];\n")+(k?"\nvar $3 \x3d $p;\n":"")).replace(/\$1/g,e).replace(/\$2/g,h).replace(/\$3/g,k).replace(/\$p/g,a)}).replace(/{{\/each}}/g,"};\n").replace(/{{if\s+(.*?)}}/g,"if($1){").replace(/{{else ?if (.*?)}}/g,"}else if($1){").replace(/{{else}}/g,"}else{").replace(/{{\/if}}/g,"}").replace(/{{=?([\s\S]*?)}}/g,"outStr+\x3d$1;\n")+"return outStr;"};g.prototype.dataToVars=function(a){a=Object.keys(a||{}).sort();for(var c="";a.length;)var b=a.shift(),c=c+("var "+b+'\x3d dt["'+b+'"];');return c};g.prototype.tplinit=function(){var a=this,c=a.tpl,b=function(b,c){f[b]=f[b]||{};var e=a.dataToVars(c);if(f[b].vars==e)return f[b].refuns;var d=f[b].code||a.tplCompiler(b),g=new Function("dt",e+d);f[b].vars=e;f[b].code=d;return f[b].refuns=g},e=function(a,c){var e=b(a,c);return 1<arguments.length?e(c):function(c){return b(a,c)(c)}};return a.render=function(a,b){if(!a)return l.error("no data");try{var d=e(c,a);if(!b)return e(c)(a);b(d)}catch(f){return b("jetpl "+f),l.error(f,c)}}};d=function(a){return"string"!==typeof a?l.error("Template not found"):new g(a)};d.decimal=function(a,c){c=c?c:2;var b=(Math.round(a*Math.pow(10,c))/Math.pow(10,c)).toString(),e=b.indexOf(".");0>e&&(e=b.length,b+=".");for(;b.length<=e+c;)b+="0";return b};d.decode=function(a){return a.replace(/&amp;/g,"\x26").replace(/&lt;/g,"\x3c").replace(/&gt;/g,"\x3e").replace(/&quot;/g,'"').replace(/&#39;/g,"'")};d.escape=function(a){return String(a||"").replace(/&(?!#?[a-zA-Z0-9]+;)/g,"\x26amp;").replace(/</g,"\x26lt;").replace(/>/g,"\x26gt;").replace(/'/g,"\x26#39;").replace(/"/g,"\x26quot;")};d.toNumber=function(a){return a.toString()};d.date=function(a,c){var b=c||"YYYY-MM-DD",e=new Date(1E3*a),d={"M+":e.getMonth()+1,"D+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),ms:e.getMilliseconds()};/(Y+)/.test(b)&&(b=b.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(var f in d)(new RegExp("("+f+")")).test(b)&&(b=b.replace(RegExp.$1,1==RegExp.$1.length?d[f]:("00"+d[f]).substr((""+d[f]).length)));return b};d.include=function(a,c){var b=document.getElementById(a.replace(/\#/g,"")),b=/input|textarea/i.test(b.nodeName)?b.value:b.innerHTML;return d(b).render(c)};d.version="1.2";return d});

//下拉加载
//!function(a){a.fn.dropload=function(b){var c={wrapCell:"",loadDatafun:null,afterDatafun:null},d=a.extend(c,b);return this.each(function(){function f(b){var c=a(b).scrollTop(),e=a(b).height(),f=""==d.wrapCell||null==d.wrapCell?a(document):a(d.wrapCell),g=f.height(),h=c+e>=g;return h}function g(){var e,c=!0;c&&f(b)&&(c=!1,clearTimeout(e),e=setTimeout(function(){(a.isFunction(d.afterDatafun)||null!=d.afterDatafun)&&d.afterDatafun&&d.afterDatafun()},1e3))}var b=a(this);d.page,d.pagesize,a.isFunction(d.loadDatafun)||null!=d.loadDatafun?d.loadDatafun&&d.loadDatafun():d.afterDatafun&&d.afterDatafun(),b.on("scroll",function(){g()})})}}(window.jQuery||window.Zepto||window.$);
//下拉加载
! function (a) {
    a.fn.dropload = function (b) {
        var c = {
                wrapCell: "",
                loadDatafun: null,
                afterDatafun: null
            },
            d = a.extend(c, b),timer = null;
        return this.each(function () {
            function f(b) {
                var c = a(b).scrollTop(),
                    e = a(b).height(),
                    f = "" == d.wrapCell || null == d.wrapCell ? a(document) : a(d.wrapCell),
                    g = f.height(),
                    h = c + e >= g;
                return h
            }

            function g() {
                var e, c = !0;
                c && f(b) && (c = !1, 
                    (a.isFunction(d.afterDatafun) || null != d.afterDatafun) && d.afterDatafun && d.afterDatafun()
                )
            }
            var b = a(this);
            d.page, d.pagesize, a.isFunction(d.loadDatafun) || null != d.loadDatafun ? d.loadDatafun && d.loadDatafun() : d.afterDatafun && d.afterDatafun(), 
            b.on("scroll", function () {
                clearTimeout(timer)
                timer = setTimeout(function(){
                    g()
                },1000)
               
            })
        })
    }
}(window.jQuery || window.Zepto || window.$);
//图片延迟加载
!function(a,b){"function"==typeof define&&define.amd?define(["$"],b):"object"==typeof exports?module.exports=b():a.lazyInit=b(window.Zepto||window.jQuery||$)}(this,function(a){function b(){this.config={loadImg:"",container:window,effect:"show",effectArgs:0,placeAttr:"data-src",offset:0,fewPiece:0,event:"scroll",elements:null,load:null}}return a.fn.lazyload=function(c){var d=new b,e=a.extend({elements:a(this)},c);return d.init(e),d},b.prototype={init:function(b){this.config=a.extend(this.config,b),this.elements=a(this.config.elements),this.initImg(),this.bindEvent()},initImg:function(){var d,e,f,g,b=this,c=b.config.fewPiece;if(this.elements.each(function(){var c=a(this);void 0!==c.attr("src")&&c.attr("src")!==!1&&""!=c.attr("src")||!c.is("img")||c.attr("src",b.config.loadImg)}),c>0)for(d=0;c>d;d++)e=a(b.elements),f=b.config.placeAttr,g=e.eq(d).attr(f),e.is("img")?e.eq(d).attr("src",g).removeAttr(f):e.eq(d).css("background-image","url('"+g+"')").removeAttr(f);else"scroll"==this.config.event&&this.load()},bindEvent:function(){var b=a(this.config.container),c=this;b.on(c.config.event,function(){c.load()}),a(window).on("resize",function(){c.load()})},load:function(){var a=this;this.elements.each(function(){this.loaded||(a.checkPosition(this)&&a.show(this),a.config.load&&a.config.load.call(a,this))})},checkPosition:function(b){var f,c=a(b).offset().top,d=window.clientHeight||document.documentElement.clientHeight||document.body.clientHeight;return window.clientWidth||document.documentElement.clientWidth||document.body.clientWidth,f=a(window).scrollTop(),c+this.config.offset<=d+f?!0:!1},show:function(b){var f,c=this,d=a(b),e=b;e.loaded=!1,f=d.attr(c.config.placeAttr),a("<img/>").attr("src",f).on("load",function(){e.loaded=!0,d.hide(),d.is("img")?d.attr("src",f).removeAttr(c.config.placeAttr):d.css("background-image","url('"+f+"')").removeAttr(c.config.placeAttr),d[c.config.effect](c.config.effectArgs)})}},b});

//mBox v2.0 弹层组件移动版
!function(a,b){"function"==typeof define&&define.amd?define(["mBox"],b):"object"==typeof exports?module.exports=b(require("mBox")):a.mBox=b(a.mBox)}(this,function(a){function o(a,b,c,d,e){b&&b.parentNode?b.parentNode.insertBefore(a,b.nextSibling):c&&c.parentNode?c.parentNode.insertBefore(a,c):d&&d.appendChild(a),a.style.display="block"==e?"block":"none",this.backSitu=null}var f,i,j,k,l,m,g,h,n,b=function(a){return document.querySelectorAll(a)},c=document,d={};return b.prototype,d.timer={},d.endfun={},d.extend=function(a,b,c){void 0===c&&(c=!0);for(var d in b)!c&&d in a||(a[d]=b[d]);return a},d.oneven=function(a,b){var c;return/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(navigator.userAgent)?(a.addEventListener("touchmove",function(){c=!0},!1),a.addEventListener("touchend",function(a){a.preventDefault(),c||b.call(this,a),c=!1},!1),void 0):a.addEventListener("click",function(a){b.call(this,a)},!1)},f={width:"",height:"",boxtype:0,title:[],content:"请稍等,暂无内容！",conStyle:"background-color:#fff;",btnName:[],btnStyle:[],yesfun:null,nofun:null,closefun:null,closeBtn:[!1,1],time:null,fixed:!0,mask:!0,maskClose:!0,maskColor:"rgba(0,0,0,0.5)",padding:"10px 10px",zIndex:1e4,success:null,endfun:null},g=1,h=["jembox"],n=function(a){var b=this,c=JSON.parse(JSON.stringify(f));b.config=d.extend(c,a),i=b.config.content,i&&1===i.nodeType&&(m=document.defaultView.getComputedStyle(i,null).display,j=i.previousSibling,k=i.nextSibling,l=i.parentNode),b.viewInit()},n.prototype={viewInit:function(){var k,l,m,n,o,p,q,r,s,a=this,d=a.config,e=c.createElement("div"),f=d.mask?'<div class="jemboxmask" style="pointer-events:auto;background-color:'+d.maskColor+';"></div>':"",i=function(){var a="object"==typeof d.title,b=void 0!=d.title[1]?d.title[1]:"";return""!=d.title?'<div class="jemboxhead" id="head'+g+'" style="'+b+'">'+(a?d.title[0]:d.title)+"</div>":""}(),j=function(){var c,f,h,i,a=d.btnName,b=a.length,e="width:50%;";return 0!==b&&d.btnName?(1===b&&(f=""!=d.btnStyle?"width:100%;"+d.btnStyle[0].replace(/\s/g,""):"width:100%;",c='<span onytpe="1" style="'+f+'">'+a[0]+"</span>"),2===b&&(h=void 0!=d.btnStyle[0]?e+d.btnStyle[0]:e,i=void 0!=d.btnStyle[1]?e+d.btnStyle[1]:e,c='<span onytpe="0" style="'+i+'">'+a[1]+'</span><span onytpe="1" style="'+h+'">'+a[0]+"</span>"),'<div class="jemboxfoot" id="foot'+g+'">'+c+"</div>"):""}();k=""!=d.width?"width:"+d.width+";":"",l=""!=d.height?"height:"+d.height+";":"",a.id=e.id=h[0]+g,e.setAttribute("class","jemboxer "+h[0]+(d.boxtype||1)),e.setAttribute("style","z-index:"+d.zIndex),e.setAttribute("jmb",g),e.innerHTML=f+'<div class="jemboxmain" '+(d.fixed?"":'style="position:static;"')+'><div class="jemboxsection">'+'<div class="jemboxchild" style="'+k+l+d.conStyle+'">'+i+'<span class="jemboxclose0'+d.closeBtn[1]+'" style="display:'+(d.closeBtn[0]?"block":"none")+'"></span>'+'<div class="jemboxmcont" style="padding:'+d.padding+';"></div>'+j+"</div>"+"</div></div>",c.body.appendChild(e),""!=d.height&&(m=b("#"+a.id+" .jemboxmcont")[0],n=""!=d.title?b("#head"+g)[0].offsetHeight:0,o=0!=d.btnName.length?b("#foot"+g)[0].offsetHeight:0,p=/^\d+%$/.test(d.height.toString())?parseInt(document.documentElement.clientHeight*(d.height.replace("%","")/100)):parseInt(fixH.replace(/\px|em|rem/g,"")),q=m.style.paddingTop.replace(/\px|em|rem/g,""),r=m.style.paddingBottom.replace(/\px|em|rem/g,""),m.style.overflow="auto",m.style.height=p-n-o-q-r+"px"),s=a.elem=b("#"+a.id)[0],setTimeout(function(){try{b("#"+a.id+" .jemboxchild")[0].classList.add("jemboxanim")}catch(c){return}d.success&&d.success(s)},1),a.idx=g++,a.contype(d),a.action(d)},contype:function(a){var g,d=this,e=b("#"+d.id+" .jemboxmcont")[0],f=a.content;return d._elemBack&&d._elemBack(),void 0===f?e:("string"==typeof f?e.innerHTML=a.content:f&&1===f.nodeType&&(g=c.createElement("div"),"none"==window.getComputedStyle(f,null).display&&(f.style.display="block"),e.appendChild(g.appendChild(f))),void 0)},action:function(c){var f,g,h,i,e=this;if(c.time&&(d.timer[e.idx]=setTimeout(function(){a.close(e.idx)},1e3*c.time)),c.closeBtn[0]&&(f=b("#"+e.id+" .jemboxclose0"+c.closeBtn[1])[0],d.oneven(f,function(){c.closefun&&c.closefun(),a.close(e.idx)})),""!=c.btnName)for(g=b("#"+e.id+" .jemboxfoot")[0].children,h=0;h<g.length;h++)d.oneven(g[h],function(){var b=this.getAttribute("onytpe");0==b?c.nofun&&c.nofun():c.yesfun&&c.yesfun(e.idx),a.close(e.idx)});c.mask&&c.maskClose&&(i=b("#"+e.id+" .jemboxmask")[0],d.oneven(i,function(){a.close(e.idx,c.endfun)})),c.endfun&&(d.endfun[e.idx]=c.endfun)}},a={idx:g,version:"2.0",cell:function(a){return b(a)[0]},open:function(a){var b=new n(a||{});return b.idx},close:function(a){var e=b("#jembox"+a)[0];e&&(i&&1===i.nodeType&&o(i,j,k,l,m),c.body.removeChild(e),clearTimeout(d.timer[g]),delete d.timer[g],"function"==typeof d.endfun[g]&&d.endfun[g](),delete d.endfun[g])},closeAll:function(){var d,c=b(".jemboxer");for(d=0;d<c.length;d++)a.close(c[d].getAttribute("jmb"))}}});
//返回到顶部
!function(a){a.fn.goTops=function(b){var c={endY:navigator.userAgent.match(/(Android)/i)?1:0,toBtnCell:"#ontoBtn",direction:"right",showHeight:a(window).height()/2,posLeft:10,posRight:10,posBottom:55,duration:200,zIndex:200,callback:null},d=a.extend(c,b),e=function(a,b,c){return a+(b-a)*c},f=function(a){return-Math.cos(a*Math.PI)/2+.5},g=function(){var a,b,c,g;return 0===d.duration?(window.scrollTo(0,d.endY),"function"==typeof d.callback&&d.callback(),void 0):(a=window.pageYOffset,b=Date.now(),c=b+d.duration,g=function(){var h=Date.now(),i=h>c?1:(h-b)/d.duration;window.scrollTo(0,e(a,d.endY,f(i))),c>h?setTimeout(g,15):"function"==typeof d.callback&&d.callback()},g(),void 0)};return this.each(function(){var f,b=a(this),c=a(d.toBtnCell);navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i),f="right"==d.direction?{right:d.posRight}:{left:d.posLeft},c.css({"z-index":d.zIndex,position:"fixed",display:"none",bottom:d.posBottom}).css(f),b.on("scroll",function(){var b=a(this).scrollTop();b>=d.showHeight?c.css({display:"block"}):c.css({display:"none"})}),c.on("tap",function(){g()})})}}(window.jQuery||window.Zepto||window.$);


/**
 * dropload
 * 移动端下拉刷新、上拉加载更多插件
 */
;(function($){'use strict';var win=window,doc=document;var winCell=$(win),docCell=$(doc);$.fn.pullLoad=function(options){return new MyDropLoad(this,options);};var MyDropLoad=function(element,options){var that=this;that.elemCell=element;that.upInsertDOM=false;that.loading=false;that.isLockUp=false;that.isLockDown=false;that.isData=true;that._scrollTop=0;that._threshold=0;that.init(options);};MyDropLoad.prototype.init=function(options){var that=this;that.opts=$.extend(true,{},{scrollArea:that.elemCell,domUp:{domClass:'dropload-up',domRefresh:'<div class="dropload-refresh">↓下拉刷新</div>',domUpdate:'<div class="dropload-update">↑释放更新</div>',domLoad:'<div class="dropload-load"><span class="loading"></span>加载中...</div>'},domDown:{domClass:'dropload-down',domRefresh:'<div class="dropload-refresh">↑上拉加载更多</div>',domLoad:'<div class="dropload-load"><span class="loading"></span>加载中...</div>',domNoData:'<div class="dropload-noData">亲，没有更多了！</div>'},upShow:true,downShow:true,autoLoad:true,distance:50,threshold:'',loadDefault:'',loadUpFn:'',loadDownFn:''},options);if(that.opts.loadDefault){that.opts.loadDefault(that);}
    if(that.opts.downShow){that.elemCell.append('<div class="'+that.opts.domDown.domClass+'">'+that.opts.domDown.domRefresh+'</div>');that.downCell=$('.'+that.opts.domDown.domClass);}
    if(!!that.downCell&&that.opts.threshold===''){that._threshold=Math.floor(that.downCell.height()*1/3);}else{that._threshold=that.opts.threshold;}
    if(that.opts.scrollArea==win){that.scrollCell=winCell;that._scrollContentHeight=docCell.height();that._scrollWindowHeight=doc.documentElement.clientHeight;}else{that.scrollCell=that.opts.scrollArea;that._scrollContentHeight=that.elemCell[0].scrollHeight;that._scrollWindowHeight=that.elemCell.height();}
    if(that.opts.downShow)fnAutoLoad(that);winCell.on('resize',function(){if(that.opts.scrollArea==win){that._scrollWindowHeight=win.innerHeight;}else{that._scrollWindowHeight=that.elemCell.height();}});that.elemCell.on('touchstart',function(e){if(!that.loading){fnTouches(e);fnTouchstart(e,that);}});that.elemCell.on('touchmove',function(e){if(!that.loading){fnTouches(e,that);fnTouchmove(e,that);}});that.elemCell.on('touchend',function(){if(!that.loading){fnTouchend(that);}});that.scrollCell.on('scroll',function(){that._scrollTop=that.scrollCell.scrollTop();if(that.opts.downShow&&!that.loading&&!that.isLockDown&&(that._scrollContentHeight-that._threshold)<=(that._scrollWindowHeight+that._scrollTop)){that.downCell.show();loadDown(that);}});};function fnTouches(e){if(!e.touches){e.touches=e.originalEvent.touches;}}
    function fnTouchstart(e,that){that._startY=e.touches[0].pageY;that.touchScrollTop=that.scrollCell.scrollTop();}
    function fnTouchmove(e,that){that._curY=e.touches[0].pageY;that._moveY=that._curY-that._startY;if(that._moveY>0){that.direction='down';}else if(that._moveY<0){that.direction='up';}
        var _absMoveY=Math.abs(that._moveY);if(that.opts.upShow&&that.touchScrollTop<=0&&that.direction=='down'&&!that.isLockUp){e.preventDefault();that.upCell=$('.'+that.opts.domUp.domClass);if(!that.upInsertDOM){that.elemCell.prepend('<div class="'+that.opts.domUp.domClass+'"></div>');that.upInsertDOM=true;}
            fnTransition(that.upCell,0);if(_absMoveY<=that.opts.distance){that._offsetY=_absMoveY;that.upCell.html(that.opts.domUp.domRefresh);}else if(_absMoveY>that.opts.distance&&_absMoveY<=that.opts.distance*2){that._offsetY=that.opts.distance+(_absMoveY-that.opts.distance)*0.5;that.upCell.html(that.opts.domUp.domUpdate);}else{that._offsetY=that.opts.distance+that.opts.distance*0.5+(_absMoveY-that.opts.distance*2)*0.2;}
            that.upCell.css({'height':that._offsetY});}}
    function fnTouchend(that){var _absMoveY=Math.abs(that._moveY);if(that.opts.upShow&&that.touchScrollTop<=0&&that.direction=='down'&&!that.isLockUp){fnTransition(that.upCell,300);if(_absMoveY>that.opts.distance){that.upCell.css({'height':that.upCell.children().height()});that.upCell.html(that.opts.domUp.domLoad);that.loading=true;that.opts.loadUpFn(that);}else{that.upCell.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){that.upInsertDOM=false;$(this).remove();});}
        that._moveY=0;}}
    function fnAutoLoad(that){if(that.opts.autoLoad){if((that._scrollContentHeight-that._threshold)<=that._scrollWindowHeight){loadDown(that);}}}
    function fnRecoverContentHeight(that){if(that.opts.scrollArea==win){that._scrollContentHeight=docCell.height();}else{that._scrollContentHeight=that.elemCell[0].scrollHeight;}}
    function loadDown(that){that.direction='up';if(that.opts.downShow)that.downCell.html(that.opts.domDown.domLoad);that.loading=true;if(that.opts.downShow)that.opts.loadDownFn(that);}
    MyDropLoad.prototype.lock=function(direction){var that=this;if(direction===undefined){if(that.direction=='up'){that.isLockDown=true;}else if(that.direction=='down'){that.isLockUp=true;}else{that.isLockUp=true;that.isLockDown=true;}}else if(direction=='up'){that.isLockUp=true;}else if(direction=='down'){that.isLockDown=true;that.direction='up';}};MyDropLoad.prototype.unlock=function(){var that=this;that.isLockUp=false;that.isLockDown=false;that.direction='up';};MyDropLoad.prototype.noData=function(flag){var that=this;if(flag===undefined||flag==true){that.isData=false;}else if(flag==false){that.isData=true;}};MyDropLoad.prototype.resetload=function(){var that=this;if(that.direction=='down'&&that.upInsertDOM){that.upCell.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){that.loading=false;that.upInsertDOM=false;$(this).remove();fnRecoverContentHeight(that);});}else if(that.direction=='up'){that.loading=false;if(that.isData){if(that.opts.downShow){that.downCell.html(that.opts.domDown.domRefresh);}
        fnRecoverContentHeight(that);if(that.opts.downShow)fnAutoLoad(that);that.downCell.hide();}else{if(that.opts.downShow)that.downCell.html(that.opts.domDown.domNoData);}}};function fnTransition(dom,num){dom.css({'-webkit-transition':'all '+num+'ms','transition':'all '+num+'ms'});}})(window.Zepto||window.jQuery);

//jexss是一个用于对用户输入的内容进行过滤的控件
!function(window,factory){if(typeof define==="function"&&define.amd){define(factory);}else if(typeof module==="object"&&typeof module.exports==="object"){module.exports=factory();}else{window.jexss=factory();}}(this,function(){var utils={each:function(stack,handler){var len=stack.length;if(len){for(var i=0;i<len;i++){if(handler.call(stack[i],stack[i],i)===false)break;}}else if(typeof len==="undefined"){for(var name in stack){if(handler.call(stack[name],stack[name],name)===false)break;}}},str_trim:function(string){return string.replace(/^\s+/g,"").replace(/\s+$/g,"");},isObject:function(obj){return obj===Object(obj);},extend:function(){var options,name,src,copy,target=arguments[0],i=1,length=arguments.length,deep=false;if(typeof target==="boolean")deep=target,target=arguments[1]||{},i=2;if(typeof target!=="object"&&typeof target!=="function")target={};if(length===i)target=this,--i;for(;i<length;i++){if((options=arguments[i])!=null){for(name in options){src=target[name],copy=options[name];if(target===copy)continue;if(copy!==undefined)target[name]=copy;}}}
    return target;}};var TAGSTYLE=/<style[^>]*>[^<]*<\/style>/gim;var TAGSCRIPT=/<script[^>]*>[^<]*<\/script>/gim;var REGATTR=/([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))/gim;var SPACEPRE=/\s*([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))/gim;var SPACESUF=/([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*))(\s*)/gim;var WITHTAG=/<[a-zA-Z]+[a-zA-Z0-9]*((\s+([\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^ >]*)))+).*>/gim;var jexss={filter:function(html,options){var xss=new XSSFilter(html,options);return xss.filter;}};function XSSFilter(htmlStr,options){var config={matchStyleTag:true,matchScriptTag:true,removeMatchedTag:false,escape:true,blackListAttrs:{onclick:true,ondblclick:true,onchange:true,onblur:true,onfocus:true,onkeydown:true,onkeypress:true,onkeyup:true,onmousedown:true,onmousemove:true,onmouseover:true,onmouseout:true,onmouseup:true,onselect:true,onsubmit:true,onreset:true,onload:true,onabort:true,onerror:true}};var opts=utils.extend(config,options||{});if(htmlStr!=undefined||htmlStr!=""){this.filter=this.filters(htmlStr,opts);return this.filter;}}
    XSSFilter.prototype.filters=function(html,config){if(html=="")return html;var result=html;if(config.matchStyleTag){result=filterStyleTag(result,config);}
        if(config.matchScriptTag){result=filterScriptTag(result,config);}
        result=filterAttribute(result,config);result=clearTagSpaces(result);if(config.escape){result=escapeTags(result);}
        return result;};function filterAttribute(html,config){var result=html;var tempHTML=html;(function(){var attrMatches=WITHTAG.exec(tempHTML);WITHTAG.lastIndex=0;if(attrMatches){var labelHasAttr=attrMatches[1];var attrArray=labelHasAttr.match(REGATTR);tempHTML=tempHTML.replace(labelHasAttr,"");utils.each(attrArray,function(item){var attrName=utils.str_trim(item.substr(0,item.indexOf("="))).toLowerCase();if(config.blackListAttrs[attrName]){result=result.replace(item,"");}});arguments.callee();}})();return result;}
    function filterStyleTag(html,config){var result;if(config.removeMatchedTag){result=html.replace(TAGSTYLE,"");}else{result=html.replace(TAGSTYLE,function(body){return escapeTags(body);});}
        return result;}
    function filterScriptTag(html,config){var result;if(config.removeMatchedTag){result=html.replace(TAGSCRIPT,"");}else{result=html.replace(TAGSCRIPT,function(body){return escapeTags(body);});}
        return result;}
    function clearTagSpaces(html){var result=html.replace(SPACEPRE,function(dirtyAttr,attrName,attrValue){return" "+attrName+"="+attrValue;}).replace(SPACESUF,function(dirtyAttr,attrName,attrValue,a,b,c,sufSpace){var cleanAttr=attrName+"="+attrValue;if(sufSpace.length>0){cleanAttr+=" ";}
        return cleanAttr;});result=result.replace(/\t+\n/g,"").replace(/\s*>/gm,function(a){return a.replace(/\s+/,"");});return result;}
    function escapeTags(html){return html.replace(/</g,"&lt;").replace(/>/g,"&gt;");}
    return jexss;});