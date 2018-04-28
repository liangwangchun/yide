
var  code = "", timeStamp = "", nonceStr = "", appId = "", paySign = "", prepay_id = "",sodId = "";
$(function(){
	$("#loader").show();
	$(".mswrapper").hide();
	tmn = jems.parsURL().params.tmn;
	sodId  = jems.parsURL().params.sodId;
//	console.log(window.location.href);
	code = jems.parsURL().params.code;
	if (code == "" || code == undefined){
		jems.tipMsg("network error!");
	} else {
		publicPay(sodId, code);
	}

});

var payFlg = false;
/** 宝付公众号支付 **/
function publicPay(sodId, code){
	$.ajax({
		url: msonionUrl+"baofooPay/publicPay/v1",
		type:'POST',
		data:{"sodId":sodId,"code": code},
		dataType:'json',
		success:function(result){
			var errCode = result.errCode;
			if(errCode == 10000) {
				$("#loader").hide();
				$(".mswrapper").show();
				$("#desc").text(result.data.desc);
				$("#amount").text(result.data.amount);
				window.location.href = result.data.payUrl;
			}else {
				$("#desc").text(result.errMsg);
				$("#amount").text("0.00");		
			}
		},
		error:function(result){
			jems.tipMsg("network error!");
		}
	});
}
function callpay(){
	wx.chooseWXPay({
		timestamp:timeStamp,
		nonceStr:nonceStr,
		package:prepay_id,
		signType:"MD5",
		paySign:paySign,
		success: function (res) {
			jems.goUrl("ucenter/order-all.html?sodStat=2");
		},
		cancel:function(res){
			jems.goUrl("payment.html?sodId="+sodId);
		},
		fail:function(res){
			jems.goUrl("payment.html?sodId="+sodId);
		}
	});

}