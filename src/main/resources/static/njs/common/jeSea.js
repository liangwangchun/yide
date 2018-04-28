/**
 @Name : jeSea v1.2 轻量级文件加载
 @Author: chen guojun
 @Date: 2018-01-30
 @官网：http://www.jemui.com/ 或 https://github.com/singod/jeSea
 */
var msSeaUrl = "",currLocal = window.location.host;

;(function ( window, factory ) {
    window.jeSea = factory();
})( this, function () {
    var extend = function(a, b) {
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
    var seaConfig = {
        baseUrl:'',
        paths:{},
        urlArgs:"",
        debug:false
    };
    var jeSea = {
        config:function (opts) {
            return extend(seaConfig, opts || {});
        },
        use : function (deps,callback) {
            if(deps && typeof (deps) == "function"){
                this.ready(deps);
            }else {
                new addOnload(deps,callback);
            }
        },
        ready: function ( callback ) {
            if ( document.readyState === "complete" ) {
                callback && callback();
            } else {
                var docReady = (function () {
                    document.addEventListener("DOMContentLoaded", function () {
                        document.removeEventListener("DOMContentLoaded", docReady);
                        callback && callback();
                    });
                })();
            }
        }
    };

    var opts = jeSea.config();
    var head = document.head || document.getElementsByTagName('head')[0],
        baseElem = head.getElementsByTagName("base")[0];
    function getKey(obj) {
        var keyArr = [];
        for(var key in obj){ keyArr.push(key); }
        return keyArr;
    }
    function arrayContain(array, obj){
        for (var i = 0; i < array.length; i++){
            if (array[i] == obj) return true;
        }
        return false;
    };
    function addOnload(urls,callback) {
        var loader = function (uri, callback) {
            var returi,spath,tmp,srcl,url = arrayContain(getKey(opts.paths),uri) ? opts.paths[uri] : uri;
            url.replace(/\/\.\//g, "\/\/").replace(/([^:])\/{2,}/g, "$1\/").replace(/[^/]+\/\.\.\/([^/]*)/g, "$1");
            var ext = url.split(/\./).pop(),isFull = /^(\w+)(\d)?:.*/.test(url),currNode,
                isCSS = (ext.replace(/[\?#].*/, '').toLowerCase() == "css"),
                node = document.createElement(isCSS ? "link" : "script");

            if (isFull) { //如果本来就是完整路径
                returi = url;
            } else {
                tmp = url.charAt(0);
                spath = url.slice(0,2);
                if(tmp != "." && tmp != "/"){ //当前路径
                    returi = "/" + url;
                }else if(spath == "./"){ //当前路径
                    returi = url.slice(1);
                }else if(spath == ".."){ //相对路径
                    srcl = "";
                    url = url.replace(/\.\.\//g,function(){
                        srcl = srcl.substr(0,srcl.lastIndexOf("/"));
                        return "";
                    });
                    returi = srcl + "/" + url;
                }
            }
            //为uri添加一个统一的后缀
            if (!isCSS && !/\.js$/.test(returi)) {
                returi += ".js";
            }

            node.src = isFull ? returi + opts.urlArgs : opts.baseUrl + returi + opts.urlArgs;
            node.type = isCSS ? "text/css" : "text/javascript";
            if (isCSS) node.rel = "stylesheet";
            node.charset = "utf-8";
            if (!isCSS) node.async = true;

            currNode = node;
            baseElem ? head.insertBefore(node, baseElem) : head.appendChild(node);
            node.onerror = function (oError) {
                console.error("Error: "+ url + " \u4E0D\u5B58\u5728\u6216\u65E0\u6CD5\u8BBF\u95EE");
            };
            if (node.readyState) {
                //IE
                node.onreadystatechange = function () {
                    if (node.readyState == "loaded" || node.readyState == "complete") {
                        onLoads(node,callback);
                    }
                };
            } else {
                //Others
                node.onload = function () {
                    onLoads(node,callback);
                };
            }
            currNode = null;
        };
        function onLoads(elem,callback) {
            elem.onload = elem.onerror = elem.onreadystatechange = null;
            if(opts.debug) head.removeChild(elem);
            callback && callback();
        }
        if (urls && urls.length > 0) {
            for(var u=0; u<urls.length; u++){
                loader(urls[u], function () {
                    if(u == urls.length) callback && callback();
                })
            }
        }
    }
    return jeSea;
});


if(/2beauti.com/g.test(currLocal)){
    msSeaUrl = "//img.2beauti.com/";
}else if(/msyc.cc/g.test(currLocal)){
    msSeaUrl = "//static.51msyc.com/";
}else{
    msSeaUrl = "//"+currLocal+"/msonion-web/";
}  

jeSea.config({
    baseUrl:msSeaUrl+"wx/njs",
    debug:false,
    paths:{
        "zepto":"../common/zepto.min.js",
        "common":"./common/common.js",
        "base":"./common/base.js",
        "vue":"./common/vue.min.js",
        "common-vue":"./common/common-vue.js",
        "base-vue":"./common/base-vue.js"
    }
});