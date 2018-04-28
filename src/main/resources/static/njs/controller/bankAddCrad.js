/***
 * 添加银行卡页面js 
 * @author libz
 */
/** ParHref-url参数，tmn-店铺tmn，uniqueCode-手机验证码,countdown-倒计时 **/
var ParHref = jems.parsURL(), tmn = "",uniqueCode = "",countdown=60,localUrl="";
var params = ParHref.params;
tmn=params.tmn;
/** 银行卡长度限制 **/
var regNum = /^\d{14,30}$/;
/** 银行卡数值限制 **/
var regCarNo = /^[0-9]*$/;
/** 特殊字符限制 **/
var reg = /^[A-Za-z\u4E00-\u9FA5]+\·?[A-Za-z\u4E00-\u9FA5]*$/;
/** 身份证校验 **/
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
/** 中文限制 **/
var isChinese = /[\u4e00-\u9fa5]/;
$(function(){
	localUrl = ParHref.queryURL;
	$(".aginselect").on("change",function () {
	    var that = $(this), vals = that.val();
	    $("#creditCard").css({display:vals == 102 ? "block":"none"});
	})
	$("#phoneExplain").on("click",function () {
	    mBox.open({
	        title: ['手机号说明', 'color:#333;font-size:1.5rem;text-align:center;'],
	        width: "90%", 
	        //height: "50%",
	        content: $("#phoneExplainlView")[0],
	        // closeBtn: [true, 1],
	        btnName: ['知道了'],
	        btnStyle: ["color: #0e90d2;"],
	        maskClose: false,
	        success:function () {
	            //$("#materialdata").html($("#materialView").html());
	        }
	    });
	});
	$("#supportBank").on("click",function () {
	    mBox.open({
	        title: ['支持银行', 'color:#333;font-size:1.5rem;text-align:center;'],
	        width: "90%",
	        height: "50%", 
	        content: $("#selectbankView")[0],
	        // closeBtn: [true, 1],
	        btnName: ['知道了'],
	        btnStyle: ["color: #0e90d2;"],
	        maskClose: false,
	        success:function () {
	        }
	    });
	});
	$("#Validity").on("click",function () {
	    mBox.open({
	        title: ['信用卡有限期限怎么看', 'color:#333;font-size:1.5rem;text-align:center;'],
	        width: "90%",
	       // height: "50%",
	        content: $("#validityView")[0],
	        // closeBtn: [true, 1],
	        btnName: ['知道了'],
	        btnStyle: ["color: #0e90d2;"],
	        maskClose: false,
	        success:function () {
	        }
	    });
	});
	$("#safetyCode").on("click",function () {
	    mBox.open({
	        title: ['信用卡安全码怎么看', 'color:#333;font-size:1.5rem;text-align:center;'],
	        width: "90%",
	        height: "50%",
	        content: $("#safetyCodeView")[0],
	        // closeBtn: [true, 1],
	        btnName: ['知道了'],
	        btnStyle: ["color: #0e90d2;"],
	        maskClose: false,
	        success:function () {
	        }
	    });
	});
});

/**
 * 校验参数
 */
function checkParams(){
	/** 持卡人姓名 **/
	var memberName = $("#memberName").val();
	if(null == memberName || '' == memberName || undefined == memberName){
		jems.tipMsg("请输入持卡人姓名!");
        return false;
	}
	if(memberName.length > 20){
		jems.tipMsg("持卡人姓名应为0~20个字符!");
        return false;
	}
	if(!reg.test(memberName)){
		jems.tipMsg("请填写正确的持卡人姓名!");
        return false;
	}
	/** 持卡人身份证 **/
	var memberCid = $("#memberCid").val();
	if(null == memberCid || '' == memberCid || undefined == memberCid){
		jems.tipMsg("请输入持卡人身份证号码!");
        return false;
	}
	if(!CIDreg.test(memberCid)){
		jems.tipMsg("请填写正确的持卡人身份证号码!");
        return false;
	}
	if(isChinese.test(memberCid)){
		jems.tipMsg("此处应填持卡人身份证号码!");
		$("#memberCid").focus();
        return false;
	}
	/** 银行卡号 **/
	var cardNo = $("#cardNo").val();
	if(null == cardNo || '' == cardNo || undefined == cardNo){
		jems.tipMsg("请输入银行卡号!");
        return false;
	}
	if(cardNo.length < 14 || cardNo.length > 30){
		jems.tipMsg("银行卡号应为14~30个字符!");
        return false;
	}
	if(!regNum.test(cardNo)){
		jems.tipMsg("请输入正确的银行卡信息!");
        return false;
	}
	if(!regCarNo.test(cardNo)){
		jems.tipMsg("银行卡信息应为全数值!");
		return false;
	}
	
	/** 银行卡类型 **/
	var cardType = $("#cardType").val();
	if(null == cardType || '' == cardType || undefined == cardType){
		jems.tipMsg("请选择银行卡类型!");
        return false;
	}
	if(101 != cardType && 102 != cardType){
		jems.tipMsg("请选择正确的银行卡类型!");
        return false;
	}
	/** 信用卡有效期 yyy-MM-dd **/
	var validDate = $("#validDate").val();
	/** 信用卡安全吗 **/
	var safeCode = $("#safeCode").val();
	if(102 == cardType){
		if(null == validDate || '' == validDate || undefined == validDate){
			jems.tipMsg("请填写信用卡有效期!");
	        return false;
		}
		if(!regCarNo.test(validDate)){
			jems.tipMsg("请输入正确的有效期格式!");
	        return false;
		}
		if(validDate.length != 4){
			jems.tipMsg("信用卡有效期值长度为4位!");
	        return false;
		}
		if(null == safeCode || '' == safeCode || undefined == safeCode){
			jems.tipMsg("请填写信用卡安全码!");
	        return false;
		}
		if(!regCarNo.test(validDate)){
			jems.tipMsg("请输入正确的安全码格式!");
	        return false;
		}
		if(validDate.length != 3){
			jems.tipMsg("信用卡安全码长度为3位!");
	        return false;
		}
	}
	/** 银行预留手机号码 **/
	var phone = $("#phone").val();
	if(null == phone || '' == phone || undefined == phone){
		jems.tipMsg("请输入办卡需要预留的手机号码!");
        return false;
	}
	if(!regCarNo.test(phone)){
		jems.tipMsg("请输入正确的手机号码格式!");
        return false;
	}
	if(phone.length != 11){
		jems.tipMsg("手机号码长度应为11位!");
        return false;
	}
	return true;
}

/**
 * 倒计时（60秒重发）
 * @param obj
 */
function setTime() {
	if (countdown == 0) {
		$("#sendBtn").removeAttr("disabled");
		$("#sendBtn").removeClass("bg-gray g6").addClass("bg-purple white");
		$("#sendBtn").val("重新获取验证码");
		$("#sendBtn").on("click",function(){
			countdown = 60;
		});
		return; 
	} else {
		countdown--;
		$("#sendBtn").attr("disabled", false);
		$("#sendBtn").removeClass("bg-purple white").addClass("bg-gray g6");
		$("#sendBtn").val("重新发送(" + countdown + ")");
	}
	var timer = setTimeout(function() {
		setTime();
	}, 1000)
}

/**
 * 发送验证码
 */
function sendSmsCode(){
	/** 参数校验 * */
	if(!checkParams()){
		return;
	}
	// 取form数据
    var datas = $("#addCardFrom").serialized(); 
    var url = msonionUrl+"bankCard/preBandingBankCard/v1";
    $.ajax({
        type:"post",
        url:url,
        data:datas,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		uniqueCode = result.data.unique_code;
        		$("#uniqueCode").val(uniqueCode);
        		setTime();
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}

/**
 * 添加银行卡信息方法
 */
function submitAddCard(){
	checkParams();
	var smsCode = $("#smsCode").val();
	if(null == smsCode || '' == smsCode || undefined == smsCode){
		jems.tipMsg("请填写验证码!");
        return false;
	}
	// 取form数据
    var datas = $("#addCardFrom").serialize();
    console.log(datas)
    var url = msonionUrl+"bankCard/confirmBandingBankCard/v1";
    $.ajax({
        type:"post",
        url:url,
        data:datas,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		mBox.open({
        			//width:"80%",
        			content:"添加成功!",
        			closeBtn: [false],
        			btnName:['确定'],
        			btnStyle:["color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				jems.goUrl(localUrl);
        			}
        		})
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}
