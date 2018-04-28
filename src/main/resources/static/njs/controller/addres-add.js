/**
 @Js-name:addres-add.js
 @Zh-name:地址新增
 @Author:tyron
 @Date:2017-02-17
 */
var flag = false,errMsg= "";
var params = jems.parsURL().params;
var ua = navigator.userAgent.toLowerCase();
var isAnIos = /android|iphone|ipad|ipod/.test(ua);
var storage=window.localStorage;
var type = params.type,sodId = '';
$(function(){
    findAreaByLay("p");
    if(undefined != params.sodId){
    		sodId = params.sodId;
    }
});
function findAreaByLay(i){
	var addressProvince = $("#addressProvince").val();
    if(i == "p"){
        areaParentId = 0;
    } else if (i == "c") { 
    	$("#addresscity").empty().append("<option value='0'>-请选择 城市-</option>");
    	 $("#addressregion").empty().append("<option value='0'>-请选择  区县-</option>")
        if (addressProvince == 0  ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
            jems.tipMsg("先选择省份");
            return ;
        }else{
            areaParentId = addressProvince ;
        }
    } else {//县域
        var addresscity = $("#addresscity").val();  
        if (addressProvince == 0 || addresscity  == 0 ){
    		$("#addressregion").empty().append("<option value='0'>-请选择 城市-</option>");
    	}
        if (addressProvince == 0  ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
            jems.tipMsg("先选择省份");
            return ;
        }else if (addresscity == 0 ||addresscity == null || addresscity == "" || typeof(addresscity) == undefined){
            jems.tipMsg("先选择城市");
            return ;
        }else{
            areaParentId = addresscity ;
        }
    }
    $.ajax({
        type : "post",
        data : {"areaParentId":areaParentId,"type":i},
        url : msonionUrl+"address/findAreaByLay",
        dataType : "text",
        asyn:false,
        success:function(data){
            if(i  == "c"){
                $("#addresscity").empty().append("<option value='0'>-请选择 城市-</option>").append(data);
            }else if(i == "r"){
                $("#addressregion").empty().append("<option value='0'>-请选择  区县-</option>").append(data);
            }else{
                $("#addressProvince").append(data);
            }

        },
        error:function(data){
            alert("network error!");
        }
    });
}

function checkMobile(addressMobile){
	if (addressMobile == ""){
	    return ;
	}
    if (!moblieReg.test(addressMobile)) {
        jems.tipMsg("请输入正确的手机号码.");
        $("#addressMobile").focus();
        return false;
    }
    return true;
}

function checkCID(cid){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var isDigit = /[\u4e00-\u9fa5]/;
    if (cid == ""){
    	return ;
    }
    if (isDigit.test(cid)) {
        jems.tipMsg("别逗...此处应输入身份证号码!");
        $("#addressUserCid").focus();
        return false;
    }
    if (!reg.test(cid)) {
        jems.tipMsg("请输入正确身份证号码.");
        $("#addressUserCid").focus();
        return false;
    }
    $.ajax({
        type : "post",
        data : {"memberCid":cid},
        url : msonionUrl+"address/validateIdcard",
        dataType : "json",
        asyn:false,
        success:function(data){
            if (!data.validResult){
                $("#cidflag").val(0);
                jems.tipMsg("无效的身份证号码.");
                $("#addressUserCid").focus();
                return false;
            }else{
                $("#cidflag").val(1);
            }
        }
    });
   /* var cidFront = $("#upPositive").val();
    var cidBack = $("#upNegative").val();
    var cidFrontUrl = $("#cidFront").val();
    var cidBackUrl = $("#cidBack").val();
    if(cidFront != "" && cidFrontUrl ==""){
        uploadImage('cidFrontForm',cid);
    }
    if(cidBack != "" && cidBackUrl ==""){
        uploadImage('cidBackForm',cid);
    }*/
    return true;
}
function checkName(name){	
    if(name != "" ){//    if(name != "" ){//
        jems.tipMsg("姓名不合规范.");
        $("#addressUser").focus();
        return false;
    }
    return true;
}
var once_sumbit_flag = false;
function  saveAddress(){
	if(errMsg != ""){
		jems.tipMsg(errMsg);
        return false;
	}
    var addressUser = $("#addressUser").val();
    var addressMobile = $("#addressMobile").val();
    var addressUserCid = $("#addressUserCid").val();
    var addressProvince = $("#addressProvince").val();
    var addresscity = $("#addresscity").val();
    var addressregion = $("#addressregion").val();
    var addressNo = $("#addressNo").val();
    var cidFrontUrl = $("#cidFront").val();
    var cidBackUrl = $("#cidBack").val();
    var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (addressUserCid == null || addressUserCid == "" || typeof(addressUserCid) == undefined){
        jems.tipMsg("身份证号码不能为空.");
        return ;
    } else if ($("#cidflag").val() == 0) {
        jems.tipMsg("请输入正确的身份证号码.");
        return ;
    }
    if (addressUser == null || addressUser == "" || typeof(addressUser) == undefined){
        jems.tipMsg("姓名不能为空.");
        $("#addressUser").focus();
        return ;
    } else if (!nameReg.test(addressUser)) {
        jems.tipMsg("暂只支持中文姓名.");
        $("#addressUser").focus();
        return ;
    }
    if (addressUser.length > 30){
        jems.tipMsg("名字太长了.");
        $("#addressUser").focus();
        return ;
    }
    if (addressMobile == null || addressMobile == "" || typeof(addressMobile) == undefined){
        jems.mboxMsg("电话不能为空");
        return ;
    } else if (!moblieReg.test(addressMobile)) {
        jems.tipMsg("电话不能为空.");
        return ;
    }
    if (addressProvince == 0 ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
        jems.tipMsg("选择省区.");
        return ;
    }
    if (addresscity == 0 ||addresscity == null || addresscity == "" || typeof(addresscity) == undefined){
        jems.tipMsg("选择城市.");
        return ;
    }
    if (addressregion == 0 ||addressregion == null || addressregion == "" || typeof(addressregion) == undefined){
        jems.tipMsg("选择区县.");
        return ;
    }
    if (addressNo == null || addressNo == "" || typeof(addressNo) == undefined){
        jems.tipMsg("填写详细地址.");
        return ;
    }
    // if (cidFrontUrl == "" || cidBackUrl ==""|| cidFrontUrl == "undefined" || cidBackUrl == "undefined") {
    //     var msg = "根据海关总署令第104号文规定，个人物品类进境快件报关时，应当向海关提交进境快件收件人身份证件影印件。请尽快登录手机端商城进地址管理里上传您的身份证正反面照片，以免造成海关扣件。";
    //     jems.mboxMsg(msg);
    //     return ;
    // }
/*    if (flag){
        jems.mboxMsg("图片上传中，稍等");
        //once_sumbit_flag = false;
        $(".loading").show();
        return ;
    }*/
    if (once_sumbit_flag) {
        jems.tipMsg("提交中，如需新增请刷新.");
        return ;
    }
    once_sumbit_flag = true;
    var datas = {"addressUser":addressUser,"addressMobile":addressMobile,"addressUserCid":addressUserCid,"addressProvince":addressProvince,
            "addresscity":addresscity,"addressregion":addressregion,"addressNo":addressNo,
            "addressCidFront":cidFrontUrl,"addressCidback":cidBackUrl};
    if(undefined != params.sodId){	
    		datas = $.extend({"sodId":sodId},datas);
    		url = msonionUrl+"app/address/saveAddress/v2";
    		$.ajax({
    	        type : "post",
    	        data : datas,
    	        url : url,
    	        dataType : "json",
    	        asyn:false,
    	        success:function(result){
    	            if(10000 == result.errCode){
    	                jems.goUrl(jems.parsURL().queryURL);
    	            }else{
    	            		jems.tipMsg(result.errMsg);
    	            		return;
    	            }
    	        },
    	        error:function(data){
    	            jems.tipMsg("network error!");
    	        }
    	    });
    }else{
	    if(ua.match(/MicroMessenger/i) == "micromessenger" || !isAnIos) {
	    	// 微信端
	    	params = datas
			url = msonionUrl+"address/saveAddress";
		 }else{
			 // APP
			  var tokenStr=storage.getItem("token");
			  params=JSON.parse(tokenStr);
			  $.extend(params,datas);
			  url = msonionUrl+"app/material/saveAddressWeb";
		 }
	    $.ajax({
	        type : "post",
	        data : params,
	        url : url,
	        dataType : "json",
	        asyn:false,
	        success:function(data){
	            once_sumbit_flag =false;
	            if(data.flg == 2 || data.errCode == 10000){
	                if(jems.parsURL().params.tmn == null  || typeof(jems.parsURL().params.tmn) == undefined){
	                    jems.goUrl(jems.parsURL().queryURL);
	                } else{
	                	if(type == "wl") {
	                		// WL
	                		 jems.goUrl(jems.parsURL(window.location.href).queryURL);
	                	 }else{
	                		 // 地址管理
	                		 jems.goUrl("addres-list.html");
	                	 }
	                }
	            } else if (data.flg == 1 || data.errCode == 4001){
	                jems.tipMsg("登陆超时。");
	            }else if (data.flg == 0 ){
	                jems.tipMsg("保存失败。");
	            } else {
	            	jems.tipMsg(data.errMsg);
	            }
	        },
	        error:function(data){
	            alert("network error!");
	        }
	    });
    }
}

/*function fileChange(target,form) {
    var addressUserCid = $("#addressUserCid").val();
    var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (addressUserCid == null || addressUserCid == "" || typeof(addressUserCid) == undefined){
        jems.tipMsg("身份证号码不能为空.");
        return ;
    } else if (!CIDreg.test(addressUserCid)){
        jems.tipMsg("请输入正确的身份证号码.");

        return ;
    }
    var fileSize = 0;
    if (!target.files) {
        var filePath = target.value;
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile (filePath);
        fileSize = file.Size;

    } else {
        fileSize = target.files[0].size; 
    }
    var size = fileSize / 1024;
//	alert(size);
    if(size > 4000){
        jems.tipMsg("附件不能大于4M");
        target.value="";
        return
    }
    var name=target.value;
    var fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
    var imageArray = ["gif","jpg","jpeg","png","bmp"];
    // if(fileName == null || fileName == "" || imageArray.indexOf(fileName) < 0){
    //     jems.tipMsg("格式不对");
    //     target.value="";
    //     return
    // }

    uploadImage(form,addressUserCid);
}*/
/*function uploadImage(form,addressUserCid){
    flag =true;
    errMsg = "";
    $("#cid").val(addressUserCid);
    $("#cidBackCid").val(addressUserCid);
    var formData = new FormData($("#"+form)[0]);
    $.ajax({
        // cache: true,
        type: "POST",
        url:msonionUrl+"address/app/singeUpload",
        data:formData,//$("#"+form).serialize(),// 你的formid
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        dataType:"json",
        error: function(request) {
            // alert("Connection error");
        },
        success: function(data) {
            flag = false;
            $(".loading").hide();
            // $("#commonLayout_appcreshi").parent().html(data);
            if (form == "cidFrontForm") {
                $("#cidFront").val(data.saveUrl);
            } else {
                $("#cidBack").val(data.saveUrl);
            }
            if(data.errCode == 0){
           	 if (form == "cidFrontForm") {
                    $("#cidFront").val(data.saveUrl);
                } else {
                    $("#cidBack").val(data.saveUrl);
                }	
           } else {
           	errMsg = data.errMsg;
           	jems.tipMsg(data.errMsg);
           }
        }
    });
}*/