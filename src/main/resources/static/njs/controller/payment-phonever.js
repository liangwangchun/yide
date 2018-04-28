/***
 * 添加银行卡页面js 
 * @author libz
 */
/** ParHref-url参数，tmn-店铺tmn，uniqueCode-手机验证码,countdown-倒计时 **/
var ParHref = jems.parsURL(), tmn = "",businessNo = "",bindId="",sodId="",countdown=60;
var params = ParHref.params;
tmn=params.tmn;
$(function(){
	setTime();
	businessNo = params.businessNo;
	bindId = params.bindId;
	sodId = params.sodId;
	/** 获取银行卡信息 **/
	getBankInfo();
});

/**
 * 获取银行卡列表
 */
function getBankInfo(){
    var url = msonionUrl+"bankCard/queryOrderInfoByBindId/v1";
    $.ajax({
        type:"post",
        data:{"bindId":bindId},
        url:url,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		var bank = result.data;
        		var cardNo = bank.cardNo.substring(bank.cardNo.length,bank.cardNo.length - 4);
        		$("#smsCode").attr('placeholder',"短信验证码（尾号"+cardNo+"）")
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}

/**
 * 倒计时（60秒重发）
 * @param obj
 */
function setTime() {
	if (countdown == 0) {
		$("#sendSmsCode").removeAttr("disabled");
		$("#sendSmsCode").removeClass("bg-gray g3 f12 p11").addClass("bg-purple white f12 p11");
		$("#sendSmsCode").text("重新获取验证码");
		countdown = 60;
		$("#sendSmsCode").on("click",function(){
			countdown = 60;
		});
		return;
	} else {
		$("#sendSmsCode").attr("disabled", false);
		$("#sendSmsCode").removeClass("bg-purple white f12 p11").addClass("bg-gray g3 f12 p11");
		$("#sendSmsCode").text("重新发送(" + countdown + ")")
		countdown--;
	}
	setTimeout(function() {
		setTime();
	}, 1000)
}

/**
 * 发送验证码
 */
function sendSmsCode(){
    var datas = {"sodId":sodId,"bindId":bindId}; 
    console.log(datas)
    var url = msonionUrl+"bankCard/prePayByBindId/v1";
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
 * 确认支付
 * @returns {Boolean}
 */
function confirmToPay(){
	var smsCode = $("#smsCode").val();
	if(null == smsCode || '' == smsCode || undefined == smsCode){
		jems.tipMsg("请填写验证码!");
        return false;
	}
	if(null == businessNo || '' == businessNo || undefined == businessNo){
		jems.tipMsg("获取支付参数失败，请重新发起请求!");
        return false;
	}
	if(null == bindId || '' == bindId || undefined == bindId){
		jems.tipMsg("获取支付参数失败，请重新发起请求!");
        return false;
	}
	$("#confirmPay").removeClass('show').addClass('hide');
	$("#paying").removeClass('hide').addClass('show');
    var url = msonionUrl+"bankCard/toPayByBindId/v1";
    $.ajax({
        type:"post",
        url:url,
        data:{"smsCode":smsCode,"businessNo":businessNo,"bindId":bindId},
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		mBox.open({
        			//width:"80%",
        			content:"支付成功!",
        			closeBtn: [false],
        			btnName:['确定'],
        			btnStyle:["color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				$("#confirmPay").removeClass('hide').addClass('show');
        				jems.goUrl("ucenter/order-logistics.html?sodStat=2");
        			}
        		})
        	}else{
        		jems.tipMsg(result.errMsg);
        		$("#confirmPay").removeClass('hide').addClass('show');
        		return;
        	}
        }
    });
}
