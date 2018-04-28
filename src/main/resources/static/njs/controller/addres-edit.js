/**
 * @Js-name:addres-edit.js
 * @Zh-name:地址修改
 * @Author:tyron
 * @Date:2015-07-16
 */
var params = jems.parsURL().params,mobVal,addUserCid;
var flag = false,errMsg= "";
var storage=window.localStorage;
var ua = navigator.userAgent.toLowerCase();
var isAnIos = /android|iphone|ipad|ipod/.test(ua);
var tmn = params.tmn;
var type= params.type,sodId = '';
$(function(){
	if(undefined != params.sodId){
		sodId = params.sodId;
	}
    var url = window.location.href;
    var addressId = params.addressId;
    
    if (params.actionType != undefined && params.actionType == 0){
        jems.tipMsg("修改失败");
    }
    if(ua.match(/MicroMessenger/i) == "micromessenger" || !isAnIos) {
		  url = msonionUrl+"address/findAddressById";
    }else{
		 // APP
		  var tokenStr=storage.getItem("token");
		  params=JSON.parse(tokenStr);
		  params.tmn = tmn;
		  params.addressId = addressId;
		  url = msonionUrl+"app/material/findAddressById";
    }
    $.ajax({
        type : "post",
        data : params,
        url :  url,
        dataType : "json",
        asyn:false,
        success:function(data){
            if (data.flg == 1) {
                jems.goUrl("../login.html?"+window.location.href);
            }
            if (data.flg == -11) {
                jems.tipMsg("权限不足!");
                return "";
            }
            mobVal = data.addressMobile;
            $("#addressId").val(data.addressId);
            $("#addressUser").val(data.addressUser);
            $("#addressMobile").val(data.addressMobile);
            $("#cidFront").val(data.addressCidFront);
            $("#cidBack").val(data.addressCidback);
            $("#PositiveImg").css("background-image", "url(" + data.addressCidFront + ")") ;
            $("#NegativeImg").css("background-image", "url(" + data.addressCidback + ")") ;

            if(data.addressUserCid == "" || data.addressUserCid == null ||data.addressUserCid == undefined){
                $("#addressUserCid").val("");
            }else{
            	addUserCid = data.addressUserCid;
                $("#addressUserCid").val(data.addressUserCid);
// checkCID(data.addressUserCid);
            }
            selectCity(0,data.provinceAreaRec.areaId,"addressProvince","p");
            selectCity(data.provinceAreaRec.areaId,data.cityAreaRec.areaId,"addresscity","c");
            selectCity(data.cityAreaRec.areaId,data.regionAreaRec.areaId,"addressregion","r");
            $("#addressNo").val(data.addressNo);
        },
        error:function(){
            jems.tipMsg("network error!");
        }

    });

    $("#addressNo").on("blur",function () {
        var val = $(this).val();
        $(this).val(jexss.filter(val))
    })
}); 

var areaParentId  = 0;
function findAreaByLay(i){	
	var addressProvince = $("#addressProvince").val();
    if (i == "c") {
      if (addressProvince == 0 ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
    	  $("#addresscity").empty().append("<option value='0'>-请选择 城市-</option>");
          $("#addressregion").empty().append("<option value='0'>-请选择  区县-</option>");
          return ;
        }else{
           areaParentId = addressProvince ;
        }
    } else {// 选择县域
        var addresscity = $("#addresscity").val();
        if (addressProvince == 0){
        	jems.tipMsg("先选择省区");
        }
        if (addresscity == 0 ||addresscity == null || addresscity == "" || typeof(addresscity) == undefined){
            jems.tipMsg("先选择城市");
            $("#addressregion").empty().append("<option value='0'>-请选择  区县-</option>");
            return ;
        }else{
            areaParentId = addresscity ;
        }
    }
    $.ajax({
        type : "post",
        data : {"areaParentId":areaParentId,"type":i},
        url : msonionUrl+"address/findAreaByLay?_"+new Date().getTime(),
        dataType : "text",
        asyn:false,
        success:function(data){
            if(i  == "c"){
                $("#addresscity").empty().append("<option value='0'>-请选择 城市-</option>").append(data);
                $("#addressregion").empty().append("<option value='0'>-请选择  区县-</option>");
            }else if(i == "r"){
                $("#addressregion").empty().append("<option value='0'>-请选择  区县-</option>").append(data);
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
}

function selectCity(find,to,targetId,type){
    $.ajax({
        type : "post",
        data : {"areaParentId":find,"OId":to,"type":type},
        url : msonionUrl+"address/findAreaForEdit?_"+new Date().getTime(),
        dataType : "text",
        asyn:false,
        success:function(data){
            $("#"+targetId).append(data);
        }
    });
}
function checkName(name){
    // var reg=/^[\u4e00-\u9fa5]{0,}$/;
    // var reg= /^[\u4E00-\u9FA5]{1,5}(?:·[\u4E00-\u9FA5]{1,5})*$/;
    if(!nameReg.test(name)){
        jems.tipMsg("暂只支持中文姓名.");
        $("#addressUser").focus();
        return false;
    }
    return true;
}
function checkMobile(addressMobile){
    // var reg =/^((\(\d{3}\))|(\d{3}\-))?1(3|5|7|8)\d{9}$/;
    if (!moblieReg.test(addressMobile)) {
        jems.tipMsg("请输入正确的手机号码.");
        return false;
    }
    return true;
}
function checkCID(cid){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var isDigit = /[\u4e00-\u9fa5]/;
    if (isDigit.test(cid)) {
// jems.tipMsg("别逗...此处应输入身份证号码!");
// $("#addressUserCid").focus();
        return false;
    }
    if (!reg.test(cid)) {
// jems.tipMsg("请输入正确身份证号码.");
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
// $("#cidflag").val(1);//身份证号码校验位
                return true;
            }
        }
    });
    /*
	 * var cidFront = $("#upPositive").val(); var cidBack =
	 * $("#upNegative").val(); var cidFrontUrl = $("#cidFront").val(); var
	 * cidBackUrl = $("#cidBack").val(); if(cidFront != "" && cidFrontUrl ==""){
	 * uploadImage('cidFrontForm',cid); } if(cidBack != "" && cidBackUrl ==""){
	 * uploadImage('cidBackForm',cid); }
	 */
}
function  saveAddress(){
	if(errMsg != ""){
		jems.tipMsg(errMsg);
        return false;
	}
    var addressId = $("#addressId").val();
    var addressUser = $("#addressUser").val();
    var addressMobile = $("#addressMobile").val();
    var addressUserCid = $("#addressUserCid").val();
    var addressProvince = $("#addressProvince").val();
    var addresscity = $("#addresscity").val();
    var addressregion = $("#addressregion").val();
    var addressNo = $("#addressNo").val();
//    var cidFrontUrl = $("#cidFront").val();
//    var cidBackUrl = $("#cidBack").val();
    var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var datas  = {"addressId":addressId,"addressUser":addressUser,"addressMobile":addressMobile,"addressUserCid":addressUserCid,
        "addressProvince":addressProvince,"addresscity":addresscity,"addressregion":addressregion,"addressNo":addressNo,/*
        "addressCidFront":cidFrontUrl,"addressCidback":cidBackUrl*/};
    if (addressUserCid == null || addressUserCid == "" || typeof(addressUserCid) == undefined){
        jems.tipMsg("身份证号码不能为空.");
        return ;
    }else if(!changCidCheck(addressUserCid)){
    	jems.tipMsg("请输入正确身份证号码.");
        return;
    }
    if (addressUser == null || addressUser == "" || typeof(addressUser) == undefined){
        jems.tipMsg("名字不能为空.");
        return ;
    } else if (!nameReg.test(addressUser)) {
        jems.tipMsg("暂只支持中文姓名.");
        return ;
    }
    if (addressUser.length > 20){
        jems.tipMsg("名字太长了.");
        return ;
    }
    if (addressMobile == null || addressMobile == "" || typeof(addressMobile) == undefined){
        jems.tipMsg("电话不能为空");
        return ;
    } else if (!moblieReg.test(addressMobile)) {
        jems.tipMsg("请输入正确的手机号码.");
        return ;
    }else if (addressMobile.length < 11 || addressMobile.length > 11){
        jems.tipMsg("手机号码位数不对.");
        return ;
    }else if(!checkMobile(addressMobile)){
    	 jems.tipMsg("请输入正确的手机号码.");
         return false;
    }

    if (addressProvince == 0 ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
        jems.tipMsg("选择省区.");
        return ;
    }
    if (addresscity == 0 || addresscity == null || addresscity == "" || typeof(addresscity) == undefined){
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
    // if (cidFrontUrl == "" || cidBackUrl ==""|| cidFrontUrl == "undefined" ||
	// cidBackUrl == "undefined"|| cidFrontUrl == undefined || cidBackUrl ==
	// undefined) {
    // var msg =
	// "根据海关总署令第104号文规定，个人物品类进境快件报关时，应当向海关提交进境快件收件人身份证件影印件。请尽快登录手机端商城进地址管理里上传您的身份证正反面照片，以免造成海关扣件。";
    // jems.tipMsg(msg);
    // return ;
    // }
    if (flag){
        jems.tipMsg("图片上传中，稍等");
        // once_sumbit_flag = false;
        $(".loading").show();
        return ;
    }
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
	            if(data.flg == 2 || data.errCode == 10000){
	                var url = jems.parsURL().queryURL;
	                if (url.indexOf("cart-order-sumbit.html") >= 0){
	                    jems.goUrl(url);
	                } else {
	                	if(type == "wl") {
	                		// WL
	               		 jems.goUrl(jems.parsURL(window.location.href).queryURL);
	               	 }else{
	               		 // 地址管理
	               		 jems.goUrl("addres-list.html");
	                	 }
	                }
	            }  else if (data.flg == 1 || data.errCode == 4001){
	                jems.tipMsg("登陆超时。");
	            }else if (data.flg == 0 ){
	                jems.tipMsg("保存失败。");
	            } else {
	            	jems.tipMsg(data.errMsg);
	            }
	        },
	        error:function(data){
	            jems.tipMsg("network error!");
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
    } else if (!CIDreg.test(addressUserCid)) {
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
    if(size > 4000){
        jems.tipMsg("附件不能大于4M");
        target.value="";
        return
    }
    var name=target.value;   
    var fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
    var imageArray = ["gif","jpg","jpeg","png","bmp"];
    // if(fileName == null || fileName == "" || imageArray.indexOf(fileName) <
	// 0){
    // jems.tipMsg("格式不对");
    // target.value="";
    // return
    // }

    uploadImage(form,addressUserCid);
}*/
/*function uploadImage(form,addressUserCid){
    flag = true;
    errMsg = "";
    $("#cid").val(addressUserCid);
    $("#cidBackCid").val(addressUserCid);
    var formData = new FormData($("#"+form)[0]);
    $.ajax({
        // cache: true,
        type: "POST",
        url:msonionUrl+"address/app/singeUpload",
        data:formData,// $("#"+form).serialize(),// 你的formid
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        dataType:"json",
        error: function(request) {
        	flag = false;
        },
        success: function(data) {
            flag = false;
            $(".loading").hide();
            // $("#commonLayout_appcreshi").parent().html(data);
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
// 检查身份证号
function changCidCheck(cid){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var isDigit = /[\u4e00-\u9fa5]/;
    if (isDigit.test(cid)) {
// jems.tipMsg("别逗...此处应输入身份证号码!");
// $("#addressUserCid").focus();
        return false;
    }
    if (!reg.test(cid)) {
// jems.tipMsg("请输入正确身份证号码.");
        return false;
    }
    var flag;
    $.ajax({
		type : "post",
		data : {"memberCid":cid},
		async: false,
		url : msonionUrl+"address/validateIdcard",
		dataType : "json",
		success:function(data){
			if (!data.validResult){
				flag = false;
            }else{
            	flag = true;
            }
		}
	});
    return flag;
}
// 敏感数据点击置空-mobile
function valOfMobile(that){
	if(mobVal == that.value){
		that.value = "";
	}
}
// 敏感数据点击置空-cid
function valOfUserCid(that){
	if(addUserCid == that.value){
		that.value = "";
	}
}