var moblieReg =/^((\(\d{3}\))|(\d{3}\-))?1\d{10}$/;
var regPw = /^[0-9]*$/;
var jeparam = jems.parsURL().params, tmn  ="";
// var handler1 = function (captchaObj) {
//     captchaObj.appendTo("#captcha1");
//     captchaObj.onReady(function () {
//         $("#wait1").hide();
//         $("#captcha1").html("");//clear append html
//     });
// 	$("#captcha1").click(function(){
// 	   var validate = captchaObj.getValidate();
//            captchaObj.onSuccess(function () {
//     	   validateCode(captchaObj);
//        });
//     //拖动验证成功后两秒(可自行设置时间)自动发生跳转等行为
// 	});
//     // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
// 	$("#registerBtn").click(function(){
// 			var validate = captchaObj.getValidate();
// 	    	register(validate);
// 	 });
//	
// 	$("#resetCap").click(function(){
// 		$("#captcha1").html("");//clear append html
// 		captchaObj.reset();//重置
// 		resetPre();
//     });	
//	
// };
var time;
var count = 90;
var sendhandler = function (captchaObj) {
    captchaObj.onReady(function () {
        $("#wait").hide();
    }).onSuccess(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            return jems.tipMsg('请完成验证');
        }
        validateCode(captchaObj);
        //拖动验证成功后两秒(可自行设置时间)自动发生跳转等行为
    });
    $('#resetCap').on("click",function () {
        // 调用之前先通过前端表单校验
        var memberPhone = $('#memberPhone').val();
        if(memberPhone==null || memberPhone ==''){
            jems.tipMsg("请您填写手机号码.");
            return;
        }
        captchaObj.verify();
    });
    $("#registerBtn").on("click",function(){
        var validate = captchaObj.getValidate();
        register(validate);
    });
    // 更多接口说明请参见：http://docs.geetest.com/install/client/web-front/
};

$(function(){
    tmn = jeparam.tmn;
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
	if (tmn == 1 || tmn == 107) {
        jems.goUrl("store/stores-mapsurround.html");
        return;
		// mBox.open({
		// 	content: "洋葱OMALL为邀请制销售，请联系您身边的店主/代理/洋葱客服",
		// 	btnName: ['寻找身边店主'],
		// 	btnStyle:["color: #0e90d2;"],
		// 	maskClose:false,
		// 	yesfun : function(){
		// 		jems.goUrl("store/stores-mapsurround.html");
		// 		return
		// 	}
		// });
	}
    
    $.ajax({
        url: msonionUrl+"captcha/init?t=" + (new Date()).getTime(),
        type: "get",
        dataType: "json",
        success: function (data) {
            // 调用 initGeetest 初始化参数
            // 参数1：配置参数
            // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
                offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                product: "bind", // 产品形式，包括：float，popup
                //width: "100%"
                // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
            }, sendhandler);
        }
    });
	//$("#registerBtn").on('tap',register);
    // $('#password1').on("blur",function(){
    	// var password1 = $(this).val();
    	// if (password1.length < 8 || password1.length > 20) {
    	// 	jems.tipMsg("请输入8-20位密码(不能纯数字)");
    	// 	$(this).focus();
    	// 	return ;
    	// }
    	// if (regPw.test(password1)) {
    	// 	jems.tipMsg("密码不能纯为数字");
    	// 	$(this).focus();
    	// 	return ;
    	// }
    // });
    //var ua = navigator.userAgent.toLowerCase();
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == "micromessenger"){
        $("#wechat_login").show();
    }
});
function wxlogin(){
    //var tmn= parsURL(window.location.href).params.tmn;
	/*	if (tmn == 1 || tmn == 107) {
	 tipAndToIndex("官方商城暂时不支持微信登录，请联系你认识的店主/经济人/客服！",150);
	 return ;
	 }*/
    if($('#agreement').is(':checked') == false) {
        jems.tipMsg("需阅读并同意用户协议才能注册");
        return false;
    }
    var url = jems.parsURL().queryURL;
    jems.goUrl(msonionUrl+"user/wxlogin?tmn="+tmn+"&returnUrl="+url);
}
function resetPre(){
    $.ajax({
        url: msonionUrl+"captcha/init?t=" + (new Date()).getTime(),
        type: "get",
        dataType: "json",
        success: function (data) {
            // 调用 initGeetest 初始化参数
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
                offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                product: "float", // 产品形式，包括：float，popup
                width: "100%"
                // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
            }, handler1);
        }
    });
}
//后端校验
function validateCode(captchaObj){
	var validate = captchaObj.getValidate();
	var memberPhone = $('#memberPhone').val();
	if(memberPhone==null || memberPhone ==''){
		jems.tipMsg("请您填写手机号码.");
		location.reload();
		return;
	}
	if (!moblieReg.test(memberPhone)) {
		jems.tipMsg("请输入正确的手机号码.");
		$("#resetCap").click();
		return;
	}
    sendYzCode(memberPhone,validate.geetest_challenge,validate.geetest_validate,validate.geetest_seccode);
}

function specialStr(str){
//	var pattern = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)(\—)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\')(\。)(\，)(\、)(\？)(\￥)(\…)(\（)(\）)]+/);
	var pattern = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)(\—)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\')(\。)(\，)(\、)(\？)(\￥)(\…)(\（)(\）)]+/);
	return (pattern.test(str));
}

function sendYzCode(memberPhone,geetest_challenge,geetest_validate,geetest_seccode){
	$.ajax({
		type: 'POST',
		data:{"memberPhone":memberPhone,"geetest_challenge":geetest_challenge,"geetest_validate":geetest_validate,"geetest_seccode":geetest_seccode},
		url: msonionUrl+"register/bindingsendCode?v_="+new Date().getTime(),
		dataType: 'json',
		success: function(data){			
			if(data.errCode == 10000){
				jems.tipMsg("发送成功！");
				$("#resetCap").show();
				if(count == 0){ 
					count = 90;
				    stopRun();
				}
				startRun();
				//$("#resetCap").removeClass("bg-purple").prop("disabled",true).val("发送成功"); 
			}else{
				jems.tipMsg(data.errMsg);
			}
		},
		error:function(){
			jems.tipMsg("网络连接失败");
		}
	});
}

function startRun(){
    if(count == 0) {
    	$("#resetCap").removeAttr("disabled").attr("value", "重获验证码");
        stopRun();
    } else {
    	$("#resetCap").attr("disabled","disabled").attr("value", count+"s后重试");  
        count--;  
    }
    time = setTimeout("startRun()", 1000);
}
function stopRun(){
    clearTimeout(time);
}
var register_false = false;
function register(validate){
	var tmn= jems.parsURL(window.location.href).params.tmn;
	//var memberYCID = $('#memberYCID').val();
	var memberPhone = $('#memberPhone').val();
	var authCode = $('#authCode').val();
	var password1 = $('#password1').val();
	var password2 = $('#password2').val();
	//validateMemberYCID1(memberYCID);
	if (tmn == 1 || tmn == 107) {
		mBox.open({
			content: "洋葱OMALL为邀请制销售，请联系您身边的洋葱经纪人/服务商/洋葱客服",
			btnName: ['确定'],
			btnStyle:["color: #0e90d2;"],
			maskClose:false,
			yesfun : function(){
				jems.goShop();
			}
		});
	}
	/**
	if(memberYCID==null || memberYCID ==''){
		jems.tipMsg("请您填写洋葱ID.");
		return ;
	} else{
		if (specialStr(memberYCID)){
			$('#memberYCID').focus();
			jems.tipMsg("洋葱ID含有特殊字符或空格");
			return ;
		}else {
			var checkYCID =  $('#memberYCIDfald').attr('fald');
			if (checkYCID == 1) {
				jems.tipMsg("您的昵称已被注册，请更换！");
				return;
			}
		}
	}**/

	if(memberPhone==null || memberPhone ==''){
		jems.tipMsg("请您填写手机号码.");
		return ;
	}
	if (!moblieReg.test(memberPhone)) {
		jems.tipMsg("请输入正确的手机号码.");
		return ;
	}
	if (!validate) {
		jems.tipMsg("请完成短信验证码发送校验");
        return ;
    }	
	if (authCode == null || authCode == "" || typeof(authCode) == undefined){
		jems.tipMsg("请输入验证码");
		return ;
	}
	if (password1 == null || password1 == "" || typeof(password1) == undefined){
		jems.tipMsg("请输入密码");
		return ;
	}

	if (password1.length < 8 || password1.length > 20) {
		jems.tipMsg("请输入8-20位密码(不能纯数字)");
		return ;
	}  else if (regPw.test(password1)) {
		jems.tipMsg("密码不能纯为数字");
		return ;
	}
	if(password1!=password2){
		jems.tipMsg("您两次输入的密码不一致！");
		return ;
	}
    if($('#agreement').is(':checked') == false) {
        jems.tipMsg("需阅读并同意用户协议才能注册");
        return false;
    }
	if (register_false){
		jems.tipMsg("无需重复提交。");
		return ;
	}
	register_false = true;
	var pageLogin = mBox.open({
		boxtype: 3,
		conStyle: 'text-align:center;',
		maskColor:"rgba(0,0,0,0.8)",
		maskClose:false,
		content: "<div class='jew100 tc f15'>正在注册中，请耐心等待！</div>"
	});
	//"memberYCID":memberYCID,
	$.ajax({
		type: 'POST',
		data:{"memberPhone":memberPhone,"yzm":authCode,"memberPassword":password1,"memberTmnId":tmn,"memberFrom":0},
		url: msonionUrl+"register/register?v_="+new Date().getTime(),
		dataType: 'json',
		success: function(json){
			if (json.success){
				jems.goUrl('ucenter/personalinfo.html?tmn='+json.tmn);//change to real 
			} else {			
				register_false = false;
				jems.mboxMsg(json.message); 
				mBox.close(pageLogin);
			}  
		}
	});
}
function validateMemberYCID(memberYCID){
	if(memberYCID == "" || memberYCID == null || memberYCID == undefined){
		return "";
	}
	if (specialStr(memberYCID)){
		$('#memberYCID').focus();
		jems.tipMsg("洋葱ID含有特殊字符或空格");
		return "";
	}
	if(memberYCID.length  <2 || memberYCID.length > 20){
		jems.tipMsg("洋葱ID由2-20个字母数字中文下划线组成");
		return "";
	}
	$.ajax({
		type: 'POST',
		data:{"memberYCID":memberYCID},
		url: msonionUrl+"register/validateMemberYCID?v_="+new Date().getTime(),
		dataType: 'json',
		success: function(json){
			if(json.is_regist){
				$("#memberYCIDfald").attr('fald',0);
				return true;
			} else {
				jems.tipMsg("您的昵称已被注册，请更换！");
				$("#memberYCIDfald").attr('fald',1);
				return false;
			}
		}
	});
}
function validateMemberYCID1(memberYCID){
	if(memberYCID == "" || memberYCID == null || memberYCID == undefined){
		return "";
	}
	if (specialStr(memberYCID)){
		$('#memberYCID').focus();
		jems.tipMsg("洋葱ID含有特殊字符或空格");
		return ;
	}
	if(memberYCID.length  <2 || memberYCID.length > 20){
		jems.tipMsg("洋葱ID由2-20个字母数字中文下划线组成");
		return "";
	}
	$.ajax({
		type: 'POST',
		data:{"memberYCID":memberYCID},
		url: msonionUrl+"register/validateMemberYCID?v_="+new Date().getTime(),
		dataType: 'json',
		success: function(json){
			if(json.is_regist){
				$("#memberYCIDfald").attr('fald',0);
				return true;
			} else {
				$("#memberYCIDfald").attr('fald',1);
				return false;
			}
		}
	});
}