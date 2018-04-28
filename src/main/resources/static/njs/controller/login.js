/** 
@Js-name:login.js
@Zh-name:登录
 */
var jeparam = jems.parsURL().params, tmn  ="";
$(function(){
    var queryURL = jems.parsURL().queryURL;
    tmn = jeparam.tmn;
    $("#loginBox").height($(window).height());
    $(window).on("resize",function(){
        $("#loginBox").height($(this).height());
    });
    //登录背景图
	loginChangeBg(tmn);
	
	if (tmn == null || tmn == "" || tmn == undefined||tmn == "undefined") {
		tmn = jems.parsURL(queryURL).params.tmn;
		if (tmn == null || tmn == "" || tmn == undefined||tmn == "undefined") {
			jems.tipMsg("缺少tmn");
			return "";
		} else {
			jems.tipMsg("缺少tmn");
			return "";
		}
	}
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) != "micromessenger"){
		$("#wechat_login").hide();
	} /* else {
		$("#wechat_forget").hide();
	}*/
	$.ajax({
		type : "post",
		url : msonionUrl+"getMemberInfo",
		/*data : {"uid":sessionStorage.uid,"msToken":sessionStorage.msToken,"client":"WEB"},*/
		dataType : "json",
		success:function(data){
			if(data.errCode == 10000){
				if (data.memberType == 2) {//代理商
					jems.goUrl("store/agents.html");
				} else if (data.memberType == 3) {
					jems.goUrl("store/stores.html");
				} else {
					jems.goUrl("ucenter/members.html");
				}
			}
		}
	});
	$("#togglepass").on('tap',function(){
		var passCls = $("#passWord");
		if("password" == passCls.attr( "type" )){
			passCls.attr( "type", "text");
			$(this).addClass("dianpass");
		}else{
			passCls.attr( "type", "password" );
			$(this).removeClass("dianpass");
		};
	});

});
//更改登录界面背景
function loginChangeBg(tmn){
    $.ajax({
        type:"get",
        url : msonionUrl+"adverimg",
        data: {"tmn":tmn,"imgType":6},
        dataType : "json",
        success:function(json){
            $("#lognewbox").css('background-image', "url('" + (msPicPath + json[0].imgPath) + "')");
        }
    });
}
function login(){
	var params =  jems.parsURL(window.location.href).queryURL; 
	var userCode = $("#userCode").val();
	var passWord = $("#passWord").val();
	if (userCode ==null | userCode == "" || typeof(userCode) == undefined) {
		jems.tipMsg("请您填写手机号码或者洋葱昵称.");
		return false;
	}

	if (passWord ==null | passWord == "" || typeof(passWord) == undefined) {
		jems.tipMsg("请输入密码.");
		return false;
	}
    if($('#agreement').is(':checked') == false) {
        jems.tipMsg("需阅读并同意用户协议才能登录");
        return false;
    }
	var pageLogin = mBox.open({
		boxtype: 3,
		conStyle: 'text-align:center;',
		maskColor:"rgba(0,0,0,0.8)",
		maskClose:false,
		content: '<p class="tc f15">正在登录中请稍等</p>'
	});
	$.ajax({
		type: 'post',
		url: msonionUrl+"user/login/v1",
		data:{"client":"WEB","loginName":userCode,"passWord":passWord,"returnUrl":params,"tmn":tmn},                                     
		dataType: 'json',
		success: function(result){
			mBox.close(pageLogin);
			if (result.errCode == 10000){
				sessionStorage.uid = result.data.memberRec.memberId;
				sessionStorage.msToken=result.data.memberRec.msToken;
				sessionStorage.client = "WEB";
				if (jeparam.wxtype == "webschool"){
                    jems.goUrl(params);
				}else {
                    if (result.data.memberRec.memberType == 2) {//代理商
                    	if((params != null || params != undefined || params != 'undefined')  &&  params.indexOf("group-") > 0){
                    		jems.goUrl(params);
                    		return ;
                    	}
                    	jems.goUrl("store/agents.html");//不跳转回去注册地
                    } else if (result.data.memberRec.memberType == 3) {
                    	if((params != null || params != undefined || params != 'undefined')  &&  params.indexOf("group-") > 0){
                    		jems.goUrl(params);
                    		return ;
                    	}
                        jems.goUrl("store/stores.html?tmn=" + result.data.memberRec.memberTmnId);
                    } else {
                    	if((params != null || params != undefined || params != 'undefined')  &&  params.indexOf("group-") > 0){
                    		jems.goUrl(params);
                    		return ;
                    	}
                        if (tmn == 1) {
                    		var rembTmn = result.data.memberRec.memberTmnId == "" || result.data.memberRec.memberTmnId == undefined ? 1 : result.data.memberRec.memberTmnId;
                            if (result.data.returnUrl == null || result.data.returnUrl == '' || result.data.returnUrl == 'null') {
                                jems.goUrl("ucenter/members.html?tmn=" + rembTmn);
                            } else {
                                if (jems.parsURL(window.location.href).queryURL.indexOf("http://") < 0) {
                                    result.data.returnUrl = "ucenter/members.html?" + result.data.returnUrl;
                                }
                                window.location.href = changeURLArg(result.data.returnUrl, "tmn", rembTmn);
                            }
                        } else {
                            if (result.data.returnUrl == null || result.data.returnUrl == '' || result.data.returnUrl == 'null') {
                                jems.goUrl("ucenter/members.html");
                            } else {
                                if (jems.parsURL().queryURL.indexOf("http://") < 0) {
                                    result.data.returnUrl = "ucenter/members.html?" + result.data.returnUrl;
                                }
                                jems.goUrl(result.data.returnUrl);
                            }
                        }
                    }
                }

			} else if (result.errCode == 4014){
				 //jems.goUrl("back-password.html");
				tip(result.errMsg);
				 return false;
			} else if (result.errCode == 4015){
				 //jems.goUrl("back-password.html");
				tip(result.errMsg);
				 return false;
			}  else {
				jems.tipMsg(result.errMsg);
			}  
		}
	});
}

/* 
 * url 目标url 
 * arg 需要替换的参数名称 
 * arg_val 替换后的参数的值 
 * return url 参数替换后的url 
 */ 
function changeURLArg(url,arg,arg_val){ 
	var pattern=arg+'=([^&]*)'; 
	var replaceText=arg+'='+arg_val; 
	if(url.match(pattern)){ 
		var tmp='/('+ arg+'=)([^&]*)/gi'; 
		tmp=url.replace(eval(tmp),replaceText); 
		return tmp; 
	}else{ 
		if(url.match('[\?]')){ 
			return url+'&'+replaceText; 
		}else{ 
			return url+'?'+replaceText; 
		} 
	} 
	return url+'\n'+arg+'\n'+arg_val; 
} 

function wxlogin(){
	//var tmn= parsURL(window.location.href).params.tmn;
	/*	if (tmn == 1 || tmn == 107) {
		tipAndToIndex("官方商城暂时不支持微信登录，请联系你认识的店主/经济人/客服！",150);
		return ;
	}*/
    if($('#agreement').is(':checked') == false) {
        jems.tipMsg("需阅读并同意用户协议才能登录");
        return false;
    }
	var url = jems.parsURL(window.location.href).queryURL;
	jems.goUrl(msonionUrl+"user/wxlogin?tmn="+tmn+"&returnUrl="+url);
}
function tip(msg){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>"+msg+"</p>",
		closeBtn: [false,1],
		btnName:['修改密码'],
		btnStyle:["color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('back-password.html');
		}     
	});
}
