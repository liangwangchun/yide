/**
 @Js-name:regist.js
 @Zh-name:用户注册
 @Author:tyron
 @Date:2015-07-13
 */
var param = jems.parsURL().params;
var regPw = /^[0-9]*$/;
$(function(){
    $("#memberId").attr("fald",param.mid);
    $('#password1').on("blur",function(){
    	var password1 = $(this).val();
    	if (password1.length < 8 || password1.length > 20) {
    		jems.tipMsg("请输入8-20位密码(不能纯数字)");
    		return ;
    	} 
    	if (regPw.test(password1)) {
    		jems.tipMsg("密码不能纯为数字");
    		return ;
    	}
    });
	//退出登录
	$("#goback").on('tap',function(){
		$.ajax({
			type : "POST",
			url : msonionUrl+"user/loginout?_="+new Date().getTime(),
			dataType : "json",
			success:function(data){
				if(data.success){
					sessionStorage.uid = "";
					sessionStorage.msToken="";
					sessionStorage.client = "";
					jems.goUrl(mspaths+"indexView");
				}else{
					window.location.reload();
				}
			}
		});		
	});
});
function sendYzCode(){
    var memberPhone = $('#memberPhone').val();
    if(memberPhone==null || memberPhone ==''){
        jems.tipMsg("请您填写手机号码.");
        return false;
    }
    if (!moblieReg.test(memberPhone)) {
        jems.tipMsg("请输入正确的手机号码.");
        return false;
    }
  //如果没有注册，发送验证码
    $.ajax({
        type: "POST",
        data :{"memberPhone":memberPhone},
        url: msonionUrl+"register/bindingCode?_="+new Date().getTime(),
        dataType: "json",
        success: function(data){
            jems.tipMsg(data.errMsg);
        },
        error:function(){
            jems.tipMsg("network error.");
        }
    });
}
var register_false = false;
function updateMember(){
    var memberId = $('#memberId').attr("fald");
    var memberPhone = $('#memberPhone').val();
    var yzm = $('#yzm').val();
    var password1 = $('#password1').val();
    var password2 = $('#password2').val();
    if(memberId==null || memberId ==''){
        jems.tipMsg("网络连接失败，请刷新");
        return false;
    }
    if(memberPhone==null || memberPhone ==''){
        jems.tipMsg("请您填写手机号码.");
        return false;
    }
    //var reg =/^((\(\d{3}\))|(\d{3}\-))?1(3|5|7|8)\d{9}$/;
    if (!moblieReg.test(memberPhone)) {
        jems.tipMsg("请输入正确的手机号码.");
        return false;
    }
    if (yzm == null || yzm == "" || typeof(yzm) == undefined){
        jems.tipMsg("请输入验证码");
        return ;
    }
    if (password1 == null || password1 == "" || typeof(password1) == undefined){
        jems.tipMsg("请输入密码");
        return ;
    }
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
		return ;
	}  else if (regPw.test(password1)) {
		jems.tipMsg("密码不能纯为数字");
		return ;
	}
    if(password1!=password2){
        jems.tipMsg("您两次输入的密码不一致！");
        return false;
    }
    if (register_false){
        jems.tipMsg("无需重复提交。");
        return false;
    }
    register_false = true;
    $.ajax({
        type: 'POST',
        data:{"memberPhone":memberPhone,"yzm":yzm,"memberPassword":password1,"memberId":memberId},
        url: msonionUrl+"register/updateMember",
        dataType: 'json',
        success: function(data){
            if (data.success){
                jems.goUrl('personalinfo.html');
            } else {
                jems.tipMsg(data.message);
            }
        }
    });
}
