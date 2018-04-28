/**
 * @Name：Vue Ajax
 * @Author：chen guojun
 */
;!(function(window, undefined){
    var jsonpID = 0;
    var extend = function () {
        var options, name, src, copy,deep = false, target = arguments[0], i = 1, length = arguments.length;
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
    };
    function xhrAJAX(params) {
        var that = this, ajaxSettings = {
            // 默认请求类型
            type:'GET',
            dataType:"json",
            processData:true,
            complete:function(){},//要求执行回调完整（包括：错误和成功）
            // MIME类型的映射
            accepts:{
                script:'text/javascript, application/javascript',
                json:  'application/json',
                xml:   'application/xml, text/xml',
                html:  'text/html',
                text:  'text/plain'
            },
            // 应该被允许缓存GET响应
            cache: true
        };
        that.opts = extend(ajaxSettings, params);
        //发送之前执行的函数
        that.before = function (beforeSend) {
            beforeSend && beforeSend();
            return that;
        };
        //请求数据
        that.done = function (resolve,reject) {
            //如果请求成功时执行回调
            var success = resolve || function(){},
            //如果请求失败时执行回调
            error = reject || function(){};
            that.initAjax(that.opts,success,error);
            return that;
        };
    }
    xhrAJAX.prototype = {
        param:function(obj,traditional,scope){
            if(typeof(obj) === "string") return obj;
            var that = this, params = [],str='';
            params.add=function(key, value){
                this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value== null?"":value));
            };
            if(scope==true&&typeof(obj)==='object') params.add(traditional,obj);
            else {
                for(var p in obj) {
                    var v = obj[p],str='',
                    k = (function(){
                        if (traditional) {
                            if (traditional==true) return p;
                            else{
                                if(scope&&typeof(obj)==='array') return traditional
                                return traditional + "[" + (typeof(obj)==='array'?"":p) + "]";
                            };
                        };
                        return p
                    })();
                    str = typeof v==="object" ? that.param(v, k ,traditional) : params.add(k, v);
                    if (str) params.push(str);
                };
            }
            return params.join('&');
        },
        //创建XHR对象处理。
        getXHR : function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else {
                //遍历IE中不同版本的ActiveX对象
                var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
                for (var i = 0; i < versions.length; i++) {
                    try {
                        var XMLHttp = versions[i] + ".XMLHTTP";
                        return new ActiveXObject(XMLHttp);
                    } catch (e) {
                        window.alert("Your browser does not support ajax, please replace it!");
                    }
                }
            }
        },
        createJsonp:function (options,success,error) {
            var that = this, _callbackName = options.jsonpCallback,
            callbackName = (typeof(_callbackName) == 'function' ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
            script = document.createElement('script');
            script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
            script.type = "text/javascript";
            document.body.appendChild(script);
            if (error){ 
                script.onerror = function() {
                    error && error(options)
                }
            }
            window[callbackName] = function(data) {
                document.body.removeChild(script);
                success && success(data, options);
            };
            
            return that.getXHR();
        },
        initAjax:function(options,success,error){
            var that = this, key,name,
                setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
                appendQuery = function(url, query) {
                    if (query == '') return url;
                    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
                },
                serializeData = function(options){
                    if (options.processData && options.data && typeof(options.data) != "string")
                        options.data = that.param(options.data, options.traditional);
                    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
                        options.url = appendQuery(options.url, options.data), options.data = undefined;
                };
            serializeData(options);

            //jsonp
            var dataType = options.dataType, hasPlaceholder = /\?.+=\?/.test(options.url);
            if (hasPlaceholder) dataType = 'jsonp';
            //给URL后面加上时间戳
            if (options.cache === false || ( (!options || options.cache !== true) && ('script' == dataType || 'jsonp' == dataType) )) {
                options.url = appendQuery(options.url, '_je=' + Date.now());
            }
            //判断是否为jsonp
            if ('jsonp' == dataType) {
                if (!hasPlaceholder) options.url = appendQuery(options.url,options.jsonp ? (options.jsonp + '=?') : options.jsonp === false ? '' : 'callback=?')
                return that.createJsonp(options,success,error);
            }
            
            var data = options.data,
                callback = success || function(){},
                errback = error || function(){},
                mime = options.accepts[options.dataType],
                content = options.contentType,
                xhr = that.getXHR(),
                nativeSetHeader = xhr.setRequestHeader,
                headers={};
                if (!options.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest'),setHeader('Accept', mime || '*/*');
                if (options.headers) for (name in options.headers) setHeader(name, options.headers[name]);
                if (options.contentType || (options.contentType !== false && options.data && options.type.toUpperCase() != 'GET'))
                    setHeader('Content-Type', options.contentType || 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 0) {
                        var result, error = false;
                            result = xhr.responseText;
                        try {
                            if (options.dataType == 'script')    (1,eval)(result);
                            else if (options.dataType == 'xml')  result = xhr.responseXML;
                            else if (options.dataType == 'json') result = /^\s*$/.test(result) ? null : JSON.parse(result);
                        } catch (e) { error = e }

                        if (error){
                            errback && errback(error, 'parsererror', xhr, options);
                        }else{
                            callback && callback(result, 'success', xhr);
                        } 
                    } else {
                        options.complete && options.complete(xhr, error ? 'error' : 'success');
                    }
                }
            };
            if (data&&data instanceof Object&&options.type=='GET'){
                data?options.url =(options.url.indexOf('?')>-1?options.url +'&'+ data:options.url +'?'+ data) :null;
            }
            var async = 'async' in options ? options.async : true
            xhr.open(options.type, options.url, async);
            if (mime) xhr.setRequestHeader('Accept', mime);
            if (data instanceof Object && mime == 'application/json' ) data = JSON.stringify(data), content = content || 'application/json';
            for (name in headers) nativeSetHeader.apply(xhr, headers[name]);

            xhr.send(data?data:null);
        }
    };
    function parseArgs(url, data, dataType) {
        return { url: url , data: data || null , dataType: dataType }
    }
    var jeAjax = function (params) {
        return new xhrAJAX(params);
    };
    
    //将Ajax添加到Vue方法里面
    function VueAjax(Vue, options) {
        // 1. 添加全局方法或属性
        Vue.myGlobalMethod ={};
        // 2. 添加全局资源
        Vue.directive('my-directive', {});
        // 3. 添加实例方法
        var VuePro = Vue.prototype;
        VuePro.$jeAjax = function (options) {
            return jeAjax(options);
        };
        VuePro.$jeAjax.get = function (/* url, data, dataType */) {
            return jeAjax(parseArgs.apply(null, arguments));
        };
        VuePro.$jeAjax.post = function (/* url, data, dataType */) {
            var options = parseArgs.apply(null, arguments);
            options.type = 'POST';
            return jeAjax(options);
        };
        VuePro.$jeAjax.getJSON = function (/* url, data */) {
            var options = parseArgs.apply(null, arguments);
            options.dataType = 'json';
            return jeAjax(options);
        };
        VuePro.$jeAjax.JSONP = function (/* url, data */) {
            var options = parseArgs.apply(null, arguments);
            options.dataType = 'jsonp';
            return jeAjax(options);
        };
    }
    window.jeAjax = $ajax = jeAjax;
    if (typeof exports == "object") {
        module.exports = VueAjax
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return VueAjax })
    } else if (window.Vue) {
        Vue.use(VueAjax)
    }
})(window);
/**
 * @Name：Vue backTop
 * @Author：chen guojun
 */
;!(function(window, undefined) {  
    var VueBack = {};
    // 对象合并
    var extend = function () {
        var options, name, src, copy,deep = false, target = arguments[0], i = 1, length = arguments.length;
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
    };
    //将backTop添加到Vue方法里面
    VueBack.install = function (Vue, options) {
        // 添加全局资源
        Vue.prototype.$backTop = function (params) {
            var config = {
                scrollView:window,
                direction:"right",		//定位方向
                distance : 0,           //滚动到多少距离时显示
                fixed:"fixed",          //定位类型
                posLeft:"20px",
                posRight:"20px",
                posBottom:"55px",       //浮层距离底部的高度
                duration: 1000,         //过渡动画时间
                zIndex:1000             //层级高度  
            }
            var opts = extend(config, params);
            var isDirec = (opts.direction=="right") ? {right:opts.posRight}:{left:opts.posLeft};
            var BackTpl = Vue.extend({
                data:function(){
                    return {
                        backConf: opts,
                        backShow: false,
                        backCss:extend({zIndex:opts.zIndex,position:opts.fixed,bottom:opts.posBottom},isDirec)
                    }
                },
                template: '<div class="backtop" v-show="backShow" :style="backCss" @click.stop="backtop"></div>',
                mounted:function(){
                    this.$nextTick(function () {
                        this.backConf.scrollView.addEventListener('scroll', this.scrollHandler, false);
                    })
                },
                methods:{
                    backtop:function() {
                        var top = 0, docElem = document.documentElement && document.documentElement.scrollTop;
                        if (this.backConf.scrollView === window) {
                            top = docElem ? document.documentElement.scrollTop : document.body.scrollTop;
                        } else {
                            top = this.backConf.scrollView.scrollTop
                        }
                        this.scrollTop(this.backConf.scrollView, top, 0,this.backConf.duration);
                    },
                    scrollHandler:function() {
                        var offsetTop = window.pageYOffset;
                        var offsetHeight = window.innerHeight;
                        if (this.backConf.scrollView !== window) {
                            offsetTop = this.backConf.scrollView.scrollTop;
                            offsetHeight = this.backConf.scrollView.offsetHeight;
                        }
                        var scrollHeight = this.backConf.distance == 0 ? offsetHeight/2 : this.backConf.distance;
                        this.backShow = offsetTop >= scrollHeight;
                    },
                    scrollTop:function(el, from, to, duration){
                        if (!window.requestAnimationFrame) {
                            window.requestAnimationFrame = (
                                window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
                                function (callback) {
                                    return window.setTimeout(callback, 1000 / 60);
                                }
                            );
                        }
                        var difference = Math.abs(from - to);
                        var step = Math.ceil(difference / duration * 50);
                        function scroll(start, end, step) {
                            if (start === end) return;
                            var d = (start + step > end) ? end : start + step;
                            if (start > end) {
                                d = (start - step < end) ? end : start - step;
                            }
                            if (el === window) {
                                window.scrollTo(d, d);
                            } else {
                                el.scrollTop = d;
                            }
                            window.requestAnimationFrame(function(){scroll(d, end, step)}); 
                        }
                        scroll(from, to, step);
                    }
                }
            });
            var tpl = new BackTpl().$mount(document.createElement('div'));
            document.body.appendChild(tpl.$el);
        }
    };
    
    if (typeof exports == "object") {
        module.exports = VueBack;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return VueBack });
    } else if(window.Vue){
        Vue.use(VueBack);
    }
})(window);
/**
 * @Name：Vue lazyload
 * @Author：chen guojun
 */
;!(function(window, undefined) {  
    var VueLazy = {};
    var extend = function () {
        var options, name, src, copy,deep = false, target = arguments[0], i = 1, length = arguments.length;
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
    };
    //将Ajax添加到Vue方法里面
    VueLazy.install = function (Vue, options) {
        // 2. 添加全局资源
        Vue.prototype.$lazyload = function (params) {
            var events = ['resize', 'scroll'];
            var config = {
                attr:"lazysrc",  //给img标签加的属性为图片的地址
                threshold:0,	//提前加载距离
                offset:0
            }
            var opts = extend(config, params);
            var direc = document.querySelectorAll("["+opts.attr+"]");
            Vue.nextTick(function () {
                direc.forEach(function(el){
                    lazyExec(el, opts);
                })
            })
            events.forEach(function (event) {
                window.addEventListener(event, function () {
                    direc.forEach(function (node) { 
                        lazyExec(node, opts); 
                    })
                });
            })
        }
    };
    function scrollPositon(node,opts) { 
        var offsetTop = node.getBoundingClientRect().top;
        var clientHeight = window.clientHeight || document.documentElement.clientHeight || document.body.clientHeight; //可视区域
        var scrollTop = opts.threshold > 0 ? opts.threshold : (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)
        if (offsetTop + opts.offset <= clientHeight + opts.threshold) {
            return true;
        }
        return false;
    }
    function lazyExec (node, opts) {
        var unavailableSrc = ['false', 'undefined', 'null', ''];
        // node: HTML Element Object.
        if (!node.hasAttribute(opts.attr)) return;
        // Attach image link or not.
        if (scrollPositon(node, opts)) {
            var imgLink = node.attributes[opts.attr].value, isImg = node.tagName;
            // If unavailable src was given, just go return.
            if (unavailableSrc.filter(function (value) { return imgLink === value }).length) { return }
            if (isImg == "IMG"){
                node.src = imgLink;
            }else {
                setTimeout(function() {
                    node.style.backgroundImage = 'url(' + imgLink + ')';
                }, Math.floor(Math.random() * 100));
            }
            node.removeAttribute(opts.attr)
        }
    }
    
    if (typeof exports == "object") {
        module.exports = VueLazy;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return VueLazy });
    } else if(window.Vue){
        Vue.use(VueLazy);
    }
})(window);
/**
 * @Name：Vue mBox
 * @Author：chen guojun
 */
;!(function(window, undefined) {    
    var mBox = {}, isType = function (obj,type) {
        type = type.replace(/(\w)/,function(v){return v.toUpperCase()});
        return Object.prototype.toString.call(obj) === '[object '+type+']';
    };
    var extend = function () {
        var options, name, src, copy,deep = false, target = arguments[0], i = 1, length = arguments.length;
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
    };
    mBox.install = function (Vue, vueConfig) {
        var VuePro = Vue.prototype;
        VuePro.$mBox = function (option) {
            var config = {
                width:"auto",  // 弹层的宽度，可用是百分比，可用是如（320px）
                height:"auto",  // 弹层的高度，可用是百分比，可用是如（320px）
                radius:"4px",  //弹层的类型
                title:[],  // 标题可以有2个参数，例如 ["标题",{"background-color":"#fff","color":"#fff"}]，如果title:[]参数为空，不显示标题
                content:"请稍等,暂无内容！",  // 内容	
                conStyle:{}, //内容框的css样式，你可以写更多样式，例如{"background-color":"#fff"}
                skin:"scale",  //弹出风格
                yesCall:{},  // 确定按钮回调函数，例如{name:"确定",css:{"background-color":"#fff"},fun:function (){}}
                noCall:{},  // 取消按钮回调函数，例如{name:"取消",css:{"background-color":"#fff"},fun:function (){}}
                closeCall:null,  // 右上角关闭取消按钮回调函数
                closeBtn:[ true, 1 ],  // 参数一是否显示右上角关闭取消按钮，默认false，参数二按钮颜色 1是黑色，2是白色
                time:0,  // 自动关闭时间(毫秒)
                mask:true,  //是否显示遮罩层
                maskClose:true,  // 点击遮罩层是否关闭，默认true
                maskColor:"rgba(0,0,0,0.5)",  // 遮罩层颜色可以是rgba也可以是rgb
                padding:"10px 10px",
                zIndex:1e4,  // 层级关系
                success:null,  //层成功弹出层的回调函数，返回一个参数为当前层元素对象
                endCall:null   //层彻底销毁后的回调函数
            };
            var opts = extend(JSON.parse(JSON.stringify(config)), vueConfig);
            var BoxTpl = Vue.extend({
                data: function () {
                    return {ModleConf:opts}
                },
                template: '<div class="vmboxer" :class="ModleConf.boxanim" :style="{zIndex: ModleConf.zIndex}" vuemBox>' +
                '<div class="vmboxmask" :style="{backgroundColor: ModleConf.maskColor, zIndex: ModleConf.zIndex-5}" @click="maskCloseTap" v-if="ModleConf.mask"></div>' +
                '<div class="vmboxchild" :class="ModleConf.childanim" :style="ModleConf.conStyle">' +
                '<div class="vmboxhead" v-if="ModleConf.isTitle" v-html="ModleConf.title[0]" :style="ModleConf.title[1]"></div><span class="vmboxclose01" v-if="ModleConf.closeBtn[0]" @click="maskCloseTap"></span>'+
                '<div class="vmboxmcont" :style="{ padding: ModleConf.padding}" v-html="ModleConf.content"></div>' +
                '<div class="vmboxfoot" v-if="ModleConf.yesBtnName || ModleConf.noBtnName"><span type="no" v-if="ModleConf.noBtnName == true" :style="ModleConf.noCall.css" @click="noModalTap" v-text="ModleConf.noCall.name"></span><span type="yes" v-if="ModleConf.yesBtnName" :style="ModleConf.yesCall.css" @click="yesModalTap" v-text="ModleConf.yesCall.name"></span></div>' +
                '</div></div>',
                methods:{
                    maskCloseTap:function () {
                        VuePro.$mBox.close(tpl.$el);
                    },
                    yesModalTap:function () {
                        if(isType(opts.yesCall.fun,"function")) opts.yesCall.fun && opts.yesCall.fun(tpl.$el);
                    },
                    noModalTap:function () {
                        if(isType(opts.noCall.fun,"function")) opts.noCall.fun && opts.noCall.fun(tpl.$el);
                        VuePro.$mBox.close(tpl.$el);
                    }
                },
            });
            var tpl = new BoxTpl().$mount(document.createElement('div'));
            if(typeof option == 'object'){
                for (var key in option) opts[key] = option[key];
            }
            opts.isTitle = (opts.title == false || opts.title.length == 0) ? false : true;
            opts.conStyle = extend({zIndex: opts.zIndex,width:opts.width,height:opts.height,borderRadius:opts.radius },opts.conStyle);
            opts.boxanim = "vmboxmain-"+ opts.skin;
            opts.childanim = "jemanim-" + opts.skin;
            opts.yesBtnName = opts.yesCall.name == undefined ? false:true;
            opts.noBtnName = opts.noCall.name == undefined ? false:true;
            document.body.appendChild(tpl.$el);
            if (opts.time > 0){
                setTimeout(function () {
                    document.body.removeChild(tpl.$el);
                }, 1000*opts.time)
            }
            setTimeout(function() {
                //弹出成功后的回调
                opts.success && opts.success(tpl.$el);
            }, 30);    
        };
        //弹出式提示
        VuePro.$mBox.toast = function (options) {
            var conHtml = "", asscon = {"backgroundColor":"rgba(0,0,0,0.80)","color":"#fff"},
                mConf = extend({width:'',padding:"20px 10px", closeBtn:[ false, 1 ],content:"",conStyle:{},type:"",time:0,success:null}, options);
            //判断类型
            switch (mConf.type){
                case "none"   : conHtml = "<div class='jemtc'>"+mConf.content+"</div>"; break;
                case "success": conHtml = "<div class='success'></div><div class='jemtc'>"+mConf.content+"</div>"; break;
                case "error"  : conHtml = "<div class='error'></div><div class='jemtc'>"+mConf.content+"</div>"; break;
                case "loading": conHtml = "<div class='loading'><span></span></div><div class='jemtc'>"+mConf.content+"</div>"; break;
            }
            VuePro.$mBox({
                width:mConf.width, padding:mConf.padding,
                mask:false,  time:mConf.time, content:conHtml,
                conStyle:extend(asscon,mConf.conStyle),
                closeBtn:mConf.closeBtn,success:mConf.success
            })
        };
        //警告提示
        VuePro.$mBox.alert = function (text) {
            VuePro.$mBox({
                width:'86%', padding:"20px 10px",
                content:text, yesCall:{
                    name:"确定",
                    fun:function(idx){
                        VuePro.$mBox.close(idx);
                    }
                }
            });
        };
        //通知提示
        VuePro.$mBox.notice = function (options) {
            var mConf = extend({content:"",time:5,conStyle:{}}, options),
                asscon = {position: "fixed",top: 0, left: 0, "backgroundColor":"rgba(0,0,0,0.80)","color":"#fff"};
            VuePro.$mBox({
                width:'100%', padding:"8px 10px", time:mConf.time,radius:"0px",
                content:"<div class='jemtc'>"+mConf.content+"</div>",mask:false,
                conStyle:extend(asscon,mConf.conStyle)
            });
        };
        //弹出式菜单
        VuePro.$mBox.actionSheet = function (options) {
            //合并默认的API
            var mConf = extend({title:"",closeBtn:[ false, 1 ],content:"",skins:"",time:0,conStyle:{},success:null,yesCall:null,noCall:{name:"取消"}}, options);
            //判断向上弹出层的效果类型
            if(mConf.skins == "websheet"){
                var childWidth = '100%', bgColor = {"backgroundColor":"#fff"};
            }else if(mConf.skins == "itemsheet"){
                var childWidth = '95%',  bgColor = {"backgroundColor":"rgba(255,255,255,0)"};
            }
            VuePro.$mBox({
                width:childWidth, padding:"0px", time:mConf.time,title:mConf.title,
                closeBtn:mConf.closeBtn,skin:mConf.skins, radius:"", content:mConf.content,
                conStyle:extend(bgColor,mConf.conStyle), success:mConf.success,
                yesCall:mConf.yesCall,noCall:mConf.noCall
            });
        };
        VuePro.$mBox.close = function (el) {
            document.body.removeChild(el);
        }
        VuePro.$mBox.closeAll = function () {
            var vuemBox = document.querySelectorAll("[vuemBox]");
            vuemBox.forEach(function (elem) {
                document.body.removeChild(elem);
            })
        }
    };
    if (typeof exports == "object") {
        module.exports = mBox;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return mBox });
    } else if(window.Vue){
        Vue.use(mBox);
    }
})(window);