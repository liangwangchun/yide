/**
 @Js-name:back-password.js
 @Zh-name:忘记密码找回
 @Author:tyron
 @Date:2017-03-01
 */
// var handler2 = function (captchaObj) {
//     captchaObj.appendTo("#captcha2");
//     captchaObj.onReady(function () {
//         $("#wait2").hide();
//         $("#captcha2").html("");//clear append html
//     });
// 	$("#captcha2").click(function(){
// 	   var validate = captchaObj.getValidate();
//            captchaObj.onSuccess(function () {
//     	   validateCode(captchaObj);
//        });
//     //拖动验证成功后两秒(可自行设置时间)自动发生跳转等行为
// 	});
//     // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
// 	$("#backpsw").click(function(){
// 			var validate = captchaObj.getValidate();
// 			forgetPw(validate);
// 	 });
//	
// 	$("#resetCap").click(function(){
// 		$("#captcha2").html("");//clear append html
// 		captchaObj.reset();//重置
// 		resetPre();
//     });	
//	
// };
var time;
var count = 90;
var regPw = /^[0-9]*$/;
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
    $("#backpsw").on("click",function(){
        var validate = captchaObj.getValidate();
        forgetPw(validate);
    });
    // 更多接口说明请参见：http://docs.geetest.com/install/client/web-front/
};
$(function(){
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
	$('#password1').on("blur",function(){
		var password1 = $(this).val();
		if (password1.length < 8 || password1.length > 20) {
			jems.tipMsg("请输入8-20位密码(不能纯数字)");
			//$(this).focus();
			return ;
		} 
		if (regPw.test(password1)) {
			jems.tipMsg("密码不能纯为数字");
			//$(this).focus();
			return ;
		}
	});
});
function resetPre(){
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
                product: "float", // 产品形式，包括：float，popup
                width: "100%"
                // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
            }, handler2);
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
function sendYzCode(memberPhone,geetest_challenge,geetest_validate,geetest_seccode){
    $.ajax({
        type: "POST",
        data:{"memberPhone":memberPhone,"geetest_challenge":geetest_challenge,"geetest_validate":geetest_validate,"geetest_seccode":geetest_seccode},
        url: msonionUrl+"register/forgetPswsendCode",
        dataType: "json",
        success: function(data){
        	if(data.errCode == 10000){
				jems.tipMsg("发送成功！");
				$("#resetCap").show();
				if(count == 0){ 
					count = 90;
				    stopRun();
				}
				startRun();
				//$("#sendCode").removeClass("bg-purple").prop("disabled",true).val("发送成功"); 
			}
            jems.tipMsg(data.errMsg);
        },
        error:function(){
            jems.tipMsg("network error.");
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
function forgetPw(validate){
    var memberPhone = $('#memberPhone').val();
    var yzm = $('#yzm').val();
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();
    if(memberPhone==null || memberPhone ==''){
        alert("请您填写手机号码.");
        return false;
    }
    if (!moblieReg.test(memberPhone)) {
        jems.tipMsg("请输入正确的手机号码.");
        return false;
    }
	if (!validate) {
		jems.tipMsg("请完成短信验证码发送校验");
        return ;
    }    
    if (yzm == null || yzm == "" || typeof(yzm) == undefined){
        jems.tipMsg("请输入验证码");
        return ;
    }
    /*if (password1 == null || password1 == "" || typeof(password1) == undefined){
     UsTips("请输入验密码");
     return ;
     }*/
   // var regPw = /^[0-9a-zA-Z]+$/;
  /*  if (password1.length < 6 || password1.length > 20) {
        jems.tipMsg("请输入6-20位数字或字母");
        return ;
    }  else if (!regPw.test(password1)) {
        jems.tipMsg("只能输入6-20位数字或字母");
        return ;
    }*/
    if (password1.length < 8 || password1.length > 20) {
		jems.tipMsg("请输入8-20位密码(不能纯数字)");
		return false;
	}  else if (regPw.test(password1)) {
		jems.tipMsg("密码不能纯为数字");
		return false;
	}
    if(password1!=password2){
        jems.tipMsg("您两次输入的密码不一致！");
        return false;
    }
    $.ajax({
        type: 'POST',
        data:{"memberPhone":memberPhone,"yzm":yzm,"newPassword":password1},
        url: msonionUrl+"register/forgetPw",
        dataType: 'json',
        success: function(data){
            if (data.success){
                jems.goUrl('home.html');
            } else {
                jems.tipMsg(data.message);
            }
        }
    });
}