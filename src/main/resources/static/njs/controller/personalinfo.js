/** 
@Js-name:personalinfo.js
@Zh-name:个人信息
 */
var tmn, mid;
var sure_submit = "";
var hasCode = false;
$(function(){
	tmn = jems.parsURL().params.tmn;
	$.ajax({
		type : "get",
		url : msonionUrl+"menbercenter/getPresentMember?&="+new Date(),
		dataType : "json",
		asyn:false,
		success:function(data){			
			var memberYCID = data.memberRec.memberYCID;
			mid = data.memberRec.memberId;
			$('#memberName').val(data.memberRec.memberName);
			$('#memberYCID').val(data.memberRec.memberYCID);
			var memberPhone = data.memberRec.memberCode;
			//显示头像
			var memberHeadUrl = data.memberRec.memberHeadUrl, imgurl;//background
			if (memberHeadUrl != null && memberHeadUrl != "" && typeof(memberHeadUrl) != undefined){
				if (memberHeadUrl&&memberHeadUrl.indexOf("http:") >= 0) {
					imgurl = memberHeadUrl;
				} else {
					imgurl = msPicPath+memberHeadUrl;
				}
				$('#headphono').css({"background-image":'url('+ imgurl + ')'});//("background",msPicPath+memberHeadUrl);
			}
			
			//memberCode为空显示
			if (memberPhone == undefined || memberPhone == null || memberPhone == ""){
				$('#memberPhone').html("未绑定手机号");
				$("#wechat_perple").show();
			}else{
				$('#memberPhone').html(memberPhone);
				hasCode = true;
			}
			
			if(memberYCID == "" || memberYCID == null || memberYCID == undefined){
				$('#memberYCID').removeAttr("readonly");
				$("#memberYCID").on("blur",validateMemberYCID1);
			}else{
				$("#user_YCID").html(memberYCID);
			}
			/*
			//微信登录 用户 是否显示绑定手机号码 按钮
			var memberWxcode = data.memberRec.memberWxcode;
			if (memberWxcode != null && memberWxcode != "" && typeof(memberWxcode) != undefined){
				if (memberPhone == undefined || memberPhone == null || memberPhone == ""){
					$("#wechat_perple").show();
				}
			}*/
		},
		error:function(data){
			jems.tipMsg("网络连接失败，请刷新");
		}
	});
	upPhoto("#upphono","#headphono");
	$("#memberName").on("keyup change",checkName);
});

function specialStr(str){
	var pattern = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)(\—)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\')(\。)(\，)(\、)(\？)(\￥)(\…)(\（)(\）)]+/);
	return (pattern.test(str));
}

function validateMemberYCID1(){
	var memberYCID = $('#memberYCID').val();
	if(memberYCID == "" || memberYCID == null || memberYCID == undefined){
		$('#memberYCID').focus();
		jems.tipMsg("登录账号不能为空");
		return;
	}
	if (specialStr(memberYCID)){
		$('#memberYCID').focus();
		jems.tipMsg("登录账号含有特殊字符或空格");
		return ;
	}
	if (numericReg.test(memberYCID)) {
		$('#memberYCID').focus();
		jems.tipMsg("登录账号不能全是数字");
		return ;
	}
	if(memberYCID.length  <2 || memberYCID.length > 20){
		jems.tipMsg("登录账号由2-20个字母数字中文下划线组成");
		return "";
	}
	$.ajax({
		type: 'POST',
		data:{"memberYCID":memberYCID},
		url: msonionUrl+"register/validateMemberYCID?v_="+new Date().getTime(),
		dataType: 'json',
		success: function(json){
			if(json.is_regist){
				return true;
			} else {
				jems.tipMsg("登录账号已被注册，请更换！");
				return;
			}
		}
	});
}

function checkName() {
	var memberName = $("#memberName").val();
	if (memberName.length > 20){
		memberName = memberName.substring(0,20);
		$("#memberName").val(memberName);
	}
	var reg = /^(\w|-|[\u4E00-\u9FA5]){2,20}$/;
	console.log(reg.test(memberName));
	if (!reg.test(memberName)) {
		//console.log("必须是2至20位的数字、字母、中文或者下划线");
		$("#memberName").css("color","red");
		sure_submit = "false";
	} else {
		$("#memberName").css("color","");
		sure_submit = "";
	}
}
function updateMember(){
	var memberYCID = $('#memberYCID').val();
	if(memberYCID == "" || memberYCID == null || memberYCID == undefined){
		$('#memberYCID').focus();
		jems.tipMsg("登录账号不能为空");
		return;
	}
	if (specialStr(memberYCID)){
		$('#memberYCID').focus();
		jems.tipMsg("登录账号含有特殊字符或空格");
		return ;
	}
	if (numericReg.test(memberYCID)) {
		$('#memberYCID').focus();
		jems.tipMsg("登录账号不能全是数字");
		return ;
	}
	$("#loading").show();
	$("#bcBtn").hide();
	if (sure_submit != "") {
		$("#memberName").css("color","red");
		jems.tipMsg("必须是2至20位的数字、字母、中文或者下划线");
		return ;
	}
	var formData = new FormData($("#memberform")[0]); 
	$.ajax({
		type: "POST",
		url:msonionUrl+"menbercenter/addImage",
		data:formData,//$("#"+form).serialize(),// 你的formid
		async: false,  
		cache: false,  
		contentType: false,  
		processData: false, 
		dataType:"json",
		success: function(data) {
			$(".loading").hide();
			if (data.errCode == 0) {
				if (data.type == 4){
					tip();	
				}else if (data.type == 2){
					agentTip();//代理商--商家中心
				} else {
					highTip();
				}
			} else {
				jems.tipMsg(data.errMsg);
			}
		}
	});
}
//上传头像
function upPhoto(obj,photo){
	$(obj).change(function(){
		var objUrl = getObjectURL(this.files[0]) ;
		console.log("objUrl = "+objUrl) ;
		if (objUrl) {
			$(photo).css("background-image", "url(" + objUrl + ")") ;
		}
	}) ;

	function getObjectURL(file) {
		var url = null ; 
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
		} else if (window.URL!=undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file) ;
		} else if (window.webkitURL!=undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file) ;
		}
		return url ;
	}
}
function tip(){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>保存成功!</p>",
		closeBtn: [false,1],
		btnName:['访问首页', '会员中心'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('../indexView');
		} ,     
		nofun : function(){
			jems.goUrl('members.html');
		}     
	});
}
function highTip(){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>保存成功!</p>",
		closeBtn: [false,1],
		btnName:['访问首页', '店主中心'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('../indexView');
		} ,     
		nofun : function(){
			jems.goUrl('../store/stores.html');
		}     
	});
}
/******
 * 商家中心
 * *****/
function agentTip(){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>保存成功!</p>",
		closeBtn: [false,1],
		btnName:['访问首页', '商家中心'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('../indexView');
		} ,     
		nofun : function(){
			jems.goUrl('../store/agents.html');
		}     
	});
}
function updatePhone(){
	$.ajax({
		type:"get",
		url:msonionUrl+"menbercenter/getPresentMember?&="+new Date(),
		dataType:"json",
		success:function(data){	
			mid = data.memberRec.memberId;
			if (mid == null || mid == "" || typeof(mid) == undefined){
				jems.tipMsg("网络连接失败，请刷新");
				return ;
			}
			jems.goUrl("personalinfo_update.html?tmn="+tmn+"&mid="+mid);
		}
	});
}
function newPassword(){
	if(!hasCode){
      mBox.open({
          width:"70%",
          content:"<p class='tc f16' style='width:100%'>需要绑定手机号才能设置密码</p>",
          closeBtn: [false],
          btnName:['确定','取消'],
          btnStyle:["color: #0e90d2;"],
          maskClose:false,
          yesfun : function(){
        	  jems.goUrl("personalinfo_update.html?tmn="+tmn+"&mid="+mid);
          }
      });
	}else{
		jems.goUrl("change-password.html?tmn="+tmn);
	}
}

function goUpdate(){
	if(!hasCode){
           jems.goUrl("personalinfo_update.html?tmn="+tmn+"&mid="+mid);
	}
}
//检查图片
function fileChange(target) {
	var fileSize = 0;         
	if (!target.files) {     
		var filePath = target.value;     
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");        
		var file = fileSystem.GetFile (filePath);     
		fileSize = file.Size;   

	} else {    
		fileSize = target.files[0].size;     
	}   
	var size = fileSize / 1024,
	name=target.value,
	fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase(),
	imageArray = ["gif","jpg","jpeg","png","bmp"];
	if(fileName == null || fileName == "" || imageArray.indexOf(fileName) < 0){
		jems.tipMsg("图片格式不对");
		target.value="";
		return
	}
	if(size > 4000){  
		jems.tipMsg("图片附件不能大于4M");
		target.value="";
		return
	}

}