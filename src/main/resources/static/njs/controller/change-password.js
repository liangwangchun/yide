/**
 @Js-name:change-password.js
 @Zh-name:修改密码
 @Author:tyron
 @Date:2015-07-16
 */
var param = jems.parsURL().params;
var regPw = /^[0-9]*$/;
$(function(){
	$('#newPassword1').on("blur",function(){
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
function changePwd(){
    var oldPassword =  $("#oldPassword").val();
    var newPassword1 =  $("#newPassword1").val();
    var newPassword2 =  $("#newPassword2").val();

    if(oldPassword==null || oldPassword==''){
        jems.tipMsg("旧密码不能为空.");
        return false;
    }
    if(newPassword1 == null || newPassword1 == ''){
        jems.tipMsg("新密码不能为空.");
        return false;
    } /*else if (newPassword1.length < 6 ) {
        jems.tipMsg("请输入6-18位的新密码.");
        return false;
    } else if (newPassword1.length > 18){
        jems.tipMsg("请输入6-18位的新密码.");
        return false;
    }*/
    if (newPassword1.length < 8 || newPassword1.length > 20) {
		jems.tipMsg("请输入8-20位密码(不能纯数字)");
		return false;
	}  else if (regPw.test(newPassword1)) {
		jems.tipMsg("密码不能纯为数字");
		return false;
	}
    if(newPassword1 !=  newPassword2){
        jems.tipMsg("您两次输入的密码不一致.");
        return false;
    }
 
    $.ajax({
        type: 'POST',
        data:{"oldPassword":oldPassword,"newPassword":newPassword1},
        url: msonionUrl+"register/changePwd",
        dataType: 'json',
        success: function(data){
            if (data.success){
                jems.tipMsg("修改成功");
                setTimeout(function () {
                    jems.goUrl("../home.html")
                }, 3000);
            } else {
                jems.mboxMsg(data.message);

            }
        },
        complete:function(xhr, status){

        },
        error: function(xhr, type){
            alert('Ajax error!')
        }
    });
}