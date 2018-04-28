
//常用公共JS工具
var msonionUrl, msonionStoreUrl, msPicPath = "http://img.51msyc.com/", 
	mspaths, jems = {}, shopUrl = "m.msyc.cc|www.2beauti.com|onion.2beauti.com|yangcong.2beauti.com";

if (new RegExp(shopUrl).test(window.location.host)){
    msonionUrl = "//"+window.location.host+"/";
}else {
    msonionUrl = "//"+window.location.host+"/msonion-web/";
}
//跳转store项目
if (new RegExp(shopUrl).test(window.location.host)){
	msonionStoreUrl = "//"+window.location.host+"/";
}else {
	msonionStoreUrl = "//localhost:8081/msonion-store/";
}
var moblieReg =/^((\(\d{3}\))|(\d{3}\-))?1\d{10}$/;
	allChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
	nameReg= /^[\u4E00-\u9FA5]{1,8}(?:·[\u4E00-\u9FA5]{1,8})*$/,//包括少数民族名字
	expNo = "0063de3bd93e6afb188a78c012c7bbf3";//"218a686e05c8f3506ee642e53355fea7";//快递单号
	numericReg = /^[0-9]*$/;
	
var groupStatType = ["支付超时","拼团失败","待付款","拼团中","尾款支付中","支付成功"];//团购订单状态显示
var cartoedertip = "";
$(function(){
    
    $("body").css({"width":jems.isMobile() ? "100%" : 640});
    $(window).on("resize",function () {
        $("body").css({"width":jems.isMobile() ? "100%" : 640});
    });
    var mswarp = $("section.mswarp");
    if (mswarp.length > 0){
    	var headCls = mswarp.find("header.msheader"), 
			footCls = mswarp.find("footer.msfooter");
    	var headH = headCls.length > 0 ? headCls.height() : 0,
        	footH = footCls.length > 0 ? footCls.height() : 0;
        mswarp.css({"padding-top":headH,"padding-bottom":footH});
        mswarp.find("header.msheader,footer.msfooter").css({"width":jems.isMobile() ? "100%" : 640});
        $(window).on("resize",function () {
            mswarp.find("header.msheader,footer.msfooter").css({"width":jems.isMobile() ? "100%" : 640});
		})
	}
	//获取设定的网址路径与图片路径
	var pachurl = $('link').attr('href'); 
	mspaths = pachurl.indexOf("../") != -1 ? "../":"";
	var msurl = window.location.href;
	if(msurl.indexOf(mspaths+"login.html") < 0 && msurl.indexOf(mspaths+"alipay.html") < 0 && msurl.indexOf(mspaths+"addres-order.html") < 0&& msurl.indexOf(mspaths+"addres-add.html") < 0){
		var tmn = jems.parsURL(msurl).params.tmn;
		if (tmn == null || tmn == "" || typeof(tmn) == undefined){
            msurl = jems.parsURL(window.location.href).queryURL;
			tmn = jems.parsURL(msurl).params.tmn;
			if(tmn == null || tmn == "" || typeof(tmn) == undefined){
				var urls = window.location.href.indexOf("?") != -1 ? msurl+"&tmn=1" : msurl+"?tmn=1";
				jems.goUrl(urls);
				//return ;
			}

		}
	}

	(function posMarpad(){
		var bod=$("body"), fixtop=bod.attr("fixtop"), fixbot=bod.attr("fixbot");
		var ftop="padding-top", fbot="padding-bottom";
		if(bod.attr("marpad") || bod.attr("padding")){ 
			if(fixtop){bod.css(ftop,fixtop);}
			if(fixbot){bod.css(fbot,fixbot);}
		}
		//创建顶部菜单
		if($("#mstopmenu").length > 0){
			var mtbox = $('<div class="mstopmenu"><ul class="f13" id="mstopmenulist"></div></div>'), 
			    mtmask = $('<div class="mstopmask"></div>');
			mtbox.append(mtmask); 
			$("body").prepend(mtbox);
			var menuli='', menuarr = $("#mstopmenu").attr("menulist").split("],[");
			for(var i=0; i<menuarr.length; i++){
				var mlist = menuarr[i].replace(/\[|]/g,'').split(',');
				menuli += '<li '+mlist[1]+'='+mlist[2]+'>'+mlist[0]+'</li>';
			}
			$("#mstopmenulist").append(menuli)
			$("#mstopmenu").on('click',function(){
				mtbox.show();
				var posl = $("#mstopmenu").offset().left,selfW = $("#mstopmenu").width(), tipW = $("#mstopmenulist").width();
				$("#mstopmenulist").css({left:posl-(tipW/2)-(selfW/2)+5})
			});
			mtmask.on('click',function(){
				mtbox.hide();
			});
		}
		//创建客服选择弹层
		if($("#service").length > 0){
			var servpachurl = $('link').attr('href').indexOf("../") != -1 ? "../":"";
			var kefu1 =  servpachurl+"yxctips2.html";
			var kefu2 =  servpachurl+"yxctips4.html";
			var kefu3 =  servpachurl+"yxctips5.html?code=yes";
			var servbox = $('<div class="msservice" id="barlist"></div>');
			var servli = '<ul class="f14">' +
				'<li class="baico msapp"><a onclick=jems.goUrl("'+kefu3+'")>APP下载</a></li>' +
				'<li class="baico mslianx"><a onclick=jems.goUrl("'+kefu2+'")>联系店主</a></li>' +
				'<li class="baico icon-wx"><a onclick=jems.goUrl("'+kefu1+'")>售后客服</a></li>' +
				'</ul>';
			$("body").prepend(servbox.append(servli));
			servbox.after('<div class="barmask" style="display:none;" id="barmask"></div>');
			barfuwu(); 
		} 
	})();
	var formSos = $("#formalSearchTxt");
    formSos.on('input cut focus keydown keyup paste blur',function(){
	    var that=$(this), corss=$("#corss");
	    if(that.val()!=""){
		     corss.show();
		     corss.on('click',function(){ that.val(""); corss.hide(); })
	    }else{
		     corss.hide();
	    }
    });
    if($("#mytips").length > 0 && cartoedertip == ""){
        $("#mytips").css({display:"none"});
    }
	//返回上一页
	$("#goback").on('click',jems.goBack);
	
	$("#goMagazine").on('click',jems.goMagazine);
	$("#goShop").on('click',jems.goShop);
    $("#goSearch").on('click',jems.goSearch);
    $("#goCategory").on('click',jems.goCategory);
	$("#myAccount").on('click',jems.myAccount);
	$("#myShopCart").on('click',jems.myShopCart);
	//百度统计
	var hm = document.createElement("script");
	hm.id = "baidutj";
	hm.src = "https://hm.baidu.com/hm.js?990d71bc0417b5322e54113b10d1913b";
	document.body.appendChild(hm);

});
function barfuwu(){
	if($("#service").length >0 && $("#barlist").length>0){
		var thatfuwu = $("#service"), thatlist = $("#barlist"), barmask = $("#barmask");
		thatfuwu.on('click',function(){
			thatlist.css({display:"block"});
			var tipH=thatlist.height(), tipW=thatlist.width();
			thatlist.css({display:"none"});
			var selfH = thatfuwu.height(), selfW = thatfuwu.width();
			var post = thatfuwu.offset().top, posl = thatfuwu.offset().left;
		    thatlist.css({bottom:selfH+8,left:posl-(tipW/2)+(selfW/2)});
		    barmask.show();
			$('html,body').css({'overflow-y':'hidden'});
		    thatlist.toggle();
		})
        barmask.on('click',function(){
			if(barmask.is(":visible")){ barmask.hide(); $('html,body').css({'overflow-y':''});}
			if(thatlist.is(":visible")){ thatlist.hide(); $('html,body').css({'overflow-y':''});}
		})
		$(window).on("scroll",function(){
			if(barmask.is(":visible")){ barmask.hide(); $('html,body').css({'overflow-y':''});}
			if(thatlist.is(":visible")){ thatlist.hide(); $('html,body').css({'overflow-y':''});}
		})
	}	
}
jems.mspath = mspaths;
jems.isMobile = function () {
    var navMatch = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|JUC|WebOS|Windows Phone)/i;
    return navigator.userAgent.match(navMatch) ? true : false;
};
/**
 * 判断是微信APP还是洋葱APP
 * @num {Number} 1表示洋葱APP，0表示微信APP 
 * @returns {Boolean}
 */
jems.isWxOnion = function (num) {
    var nav = navigator.userAgent.toLowerCase();
    if (num == 1){
		return (nav.match(/OnionAppClient/i) == "onionappclient") ? true : false;
	}else {
        return (nav.match(/MicroMessenger/i) == "micromessenger") ? true : false;
	}
};
//通用超链接跳转
jems.goUrl = function(url){
	var ParHref = jems.parsURL().params;
	var tmn = ParHref.tmn, urlTmn = jems.parsURL(url).params.tmn;
	if(tmn != "undefined" || tmn != "") {
		if(urlTmn == undefined || urlTmn == ""){
		    url = url.indexOf("?") != -1 ? url+"&tmn="+tmn : url+"?tmn="+tmn;
		}else{
			url = url;
		}
	}
	window.location.href = url;
};
//通用超链接跳转到store项目
jems.goStoreUrl = function(url){
	var ParHref = jems.parsURL().params;
	var tmn = ParHref.tmn, urlTmn = jems.parsURL(url).params.tmn;
	if(tmn != "undefined" || tmn != "") {
		if(urlTmn == undefined || urlTmn == ""){
		    url = url.indexOf("?") != -1 ? url+"&tmn="+tmn : url+"?tmn="+tmn;
		}else{
			url = url;
		}
	}
	window.location.href = msonionStoreUrl + url;
}
//Udesk客服跳转链接
jems.serverToUdesk = function(memberId){
	//商务咨询
	var nonce = Math.random().toString(36).substr(2);//随机数
	var timestamp = new Date().getTime();//時間戳
	var web_token  = memberId;//用户的ID
	var im_user_key = "0be0cffb81dbe95ce752220d59dfcb11";
	var sign_str = "nonce="+nonce+"&timestamp="+timestamp+"&web_token="+web_token+"&"+im_user_key+"";
	var signature = hex_sha1(sign_str).toUpperCase();
	var c_cf_ID = memberId;
	window.location.href = "http://onion.udesk.cn/im_client/?web_plugin_id=38843&channel=web&nonce="+nonce+"&timestamp="+timestamp+"&web_token="+web_token+"&signature="+signature+"&c_cf_ID="+c_cf_ID;
}

/**
 * 通用跳转商品详情超链接
 * @param gfid 商品ID
 * @param type 0为海外仓详情页，否则为洋葱贩外详情页
 */
jems.goShow = function (gfid,type) {
	var detail = (type == undefined || type == 0) ? "goods-details":"foreign-detail";
    jems.goUrl(msonionUrl+"wx/"+detail+".html?id="+gfid);
};
//跳转到商城首页
jems.goShop = function(){
    jems.goUrl(msonionUrl+"wx/indexView");
};
//跳转到搜索
jems.goSearch = function () {
    jems.goUrl(msonionUrl+"wx/search-page.html");
};
//跳转到分类
jems.goCategory = function () {
    jems.goUrl(msonionUrl+"wx/search-goods.html");
};
//跳转到杂志首页
jems.goMagazine = function(){
    //jems.goUrl(msonionUrl+"wx/magazineView?type=1&pageNo=1");
    jems.goUrl(msonionUrl+"wx/finds.html");
};
//返回上一页面并涮新
jems.goBack = function(){
	if (window.history.length > 1) {
		window.history.go(-1);
		return true;
	}
	return false;
};
// 时间戳格式化，10位时间戳  str代表时间戳字符串，format 格式化字符串 如 "yyyy-MM-dd hh:mm:ss.ms" 得到 2015-06-30 16:07:14.423
// @example ( 1435650377 , "YYYY-MM-DD" ) => 2015-06-30
jems.date = function(str,format) {
	var fmt = format || "YYYY-MM-DD", times = new Date(str * 1000);
	var o = {
		"M+": times.getMonth() + 1, // 月
		"D+": times.getDate(), // 日
		"h+": times.getHours(), // 时
		"m+": times.getMinutes(), // 分
		"s+": times.getSeconds(), // 秒
		"q+": Math.floor((times.getMonth() + 3) / 3), // 季度
		"ms": times.getMilliseconds() // 毫秒
	};
	if(/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (times.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	}
	return fmt; 
};
/*
	解析URL地址
	jems.parsURL( url ).file;     // = 'index.html'  	
	jems.parsURL( url ).hash;     // = 'top'  	
	jems.parsURL( url ).host;     // = 'www.abc.com'
	jems.parsURL( url ).query;    // = '?id=255&m=hello'  
	jems.parsURL( url ).queryURL  // = 'id=255&m=hello' 	
	jems.parsURL( url ).params;   // = Object = { id: 255, m: hello }  	
	jems.parsURL( url ).prefix;   // = 'www'
	jems.parsURL( url ).path;     // = '/dir/index.html'  	
	jems.parsURL( url ).segments; // = Array = ['dir', 'index.html']  	
	jems.parsURL( url ).port;     // = '8080'  	
	jems.parsURL( url ).protocol; // = 'http'  	
	jems.parsURL( url ).source;   // = 'http://www.abc.com:8080/dir/index.html?id=255&m=hello#top' 
*/
jems.parsURL = function ( url ) { 
    url = arguments[0] == undefined ? window.location.href : url;	
	var a =  document.createElement('a');  	
	a.href = url;  	
	return {  	
		source: url,	
		protocol: a.protocol.replace(':',''),	
		host: a.hostname,	
		port: a.port,  	
		query: a.search,
		params: (function(){  	
			var ret = {},seg = a.search.replace(/\?/,'').split('&'),len = seg.length, i = 0, s;
			for (;i<len;i++) {  	
				if (!seg[i]) { continue; }  	
				s = seg[i].split('=');
				var isw = /\?/.test(s[0]) ? s[0].split("?")[1] : s[0];
				ret[isw] = s[1];
			}  	
			return ret;  
		})(),  
        prefix: a.hostname.split('.')[0],
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], 	
		hash: a.hash.replace('#',''),  	
		path: a.pathname.replace(/^([^\/])/,'/$1'),  	
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  	
		segments: a.pathname.replace(/^\//,'').split('/'),
		queryURL:a.search.replace(/^\?/,'')
	};  	
};
//我的账户
jems.myAccount = function (){
	var retmn = jems.parsURL().params.tmn;
	$.ajax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
			dataType : "json",
			success:function(data){
			if(data.login_flag){
				if(data.memberrec.memberType == 2){//
					jems.goUrl(msonionUrl+"wx/store/agents.html");
				} else if (data.memberrec.memberType == 3) {
					jems.goUrl(msonionUrl+"wx/store/stores.html");
				} else {
				    jems.goUrl(msonionUrl+"wx/ucenter/members.html");
				}
			}else{
				var fromurl = window.location.href;
				if (fromurl.indexOf("indexView") > 0){
					jems.goUrl(msonionUrl+"wx/login.html?"+fromurl.substring(0,fromurl.indexOf("indexView"))+"ucenter/members.html?tmn="+retmn);
				} else{
				    jems.goUrl(msonionUrl+"wx/login.html?"+window.location.href);
				}
			}
		}
	});
}
//我的购物车
jems.myShopCart =function (){
	$.ajax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
		dataType : "json",
		success:function(data){
			if(data.login_flag){
				if(data.memberrec.memberType == 2){//
					jems.mboxMsg("对不起，洋葱商家无法使用本功能");
				} else {
					jems.goUrl(msonionUrl+"wx/ucenter/cart.html?&_v="+new Date().getTime());
				}
			}else{
				jems.goUrl(msonionUrl+"wx/login.html?"+window.location.href);
			}
		}
	});
}

//返回用户数据
jems.member = function(){
    var jsondata = {},isLogin = false;
    $.ajax({
        type : "post",
        async: false,
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json",
        success:function(json){  
            jsondata = json.memberrec;
            isLogin = json.login_flag;   
        }
    });
    
    return {data:jsondata,login:isLogin};
};
/**
 * 保留符点数后几位，默认保留一位
 * @param num 要格式化的数字
 * @param pos 要保留的位数,不传默认保留两位
 * @returns
 */
jems.formatNum = function (num,pos){
	// 默认保留一位
	pos = pos ? pos : 2;
	// 四舍五入
	var pnum = Math.round(num*Math.pow(10,pos))/Math.pow(10,pos), snum = pnum.toString(), len = snum.indexOf('.');
	// 如果是整数，小数点位置为-1
	if(len<0){
		len = snum.length;
		snum += '.';
	}
	// 不足位数以零填充
	while(snum.length<=len+pos){
		snum += '0';
	}
	return snum;
}
//有确定按钮弹层提示
jems.mboxMsg = function(texts){
	mBox.open({
        content: texts,
        btnName: ['确定'],
        btnStyle:["color: #0e90d2;"]
    });
}
//弹层提示
jems.tipMsg = function(texts){
	mBox.open({
	    content: "<div class='jew100 tc pt5 pb5'>"+texts+"</div>",
	    time: 3 //3秒后自动关闭
    });
}
//提示去首页
jems.mboxMsgIndex = function (texts){
	mBox.open({
		width:"80%",
		content:"<p class='tc f16' style='width:100%'>"+texts+"</p>",
		closeBtn: [false],
		btnName:['确定'],
		btnStyle:["color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goShop();
		}
	})
}
//验证是否有非法字符
jems.specialStr = function(val) {
	var pattern = /^[\d|A-z|\u4E00-\u9FFF]/g;
	return pattern.test(val);
}

// 对象排序 从大到小
jems.compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
    } 
};



/**
 * 扩展zepto序列化表单参数
 * 用法同jq的serizlize()方法
 * @param serilizedParam 使用
 * @returns {String}
 */
$.fn.serialized = function(){
	var params = '';
	var formData = this.serializeArray();
	if(formData && formData.length>0){
		for(var i in formData){
			if(formData[i].value!=''){
				params += formData[i].name+"="+formData[i].value+"&";
			}
		}
	}
	params = params.substring(0,params.lastIndexOf("&"));
	return params;
}

jems.goUrlFlag = function (url){
	var ParHref = jems.parsURL(), flag = ParHref.params.flag;
	var mark = url.lastIndexOf('?')!=-1?'&':'?';
	url += (mark+'flag=')+flag;
	jems.goUrl(url);
}

jems.backStore = function () {
    var flag = jems.parsURL().params.flag;
    var storeurl,texts, backCenter =  $('#backCenter');
    if(flag&&flag==1){ // 返回代理商中心
        storeurl = 'agents.html';
        texts = '服务商中心';
    }else{	// 返回店家中心
        storeurl = 'stores.html';
        texts = '店主中心';
    }
    backCenter.text(texts)
    backCenter.on("click",function () {
        jems.goUrl(storeurl);
    })
};
jems.fixMenu = function () {
    var menuli = "<nav class='leftMenu'>"+
        "<ul class='hide'>"+
        "<li class='imgclass rdu psdimg' onclick='jems.goShop()'></li>"+
        "<li class='imgclass rdu serimg' onclick='jems.goSearch()'></li>" +
        "<li class='imgclass rdu cartimg jepor' onclick='jems.myShopCart()'><span class='cartname fixcartNum f12' style='display:none;'>0</span></li>"+
        "<li class='imgclass rdu clsimg' onclick='jems.goCategory()'></li>" +
        "<li class='imgclass rdu mbimg' onclick='jems.myAccount()'></li>" +
        "</ul><div class='menumores rdu'></div>" +
        "</nav>"+
        "<div class='blackmask hide'></div>";
	if(!jems.isWxOnion(1)){
		$("body").append(menuli);
		$(".menumores").on("click", function () {
			var mthat = $(this),mul = mthat.siblings("ul");
			if (mul.hasClass("hide")){
				mthat.addClass("mshow");
				mul.addClass("show").removeClass("hide");
				$(".blackmask").show()
			}else{
				mthat.removeClass("mshow");
				mul.removeClass("show").addClass("hide");
				$(".blackmask").hide()

			}
		});
		jems.showCartNum();
	}
};
