
var  code = "", timeStamp = "", nonceStr = "", appId = "", paySign = "", prepay_id = "",sodId = "";
$(function(){
	$("#loader").show();
	$(".mswrapper").hide();
	tmn = jems.parsURL().params.tmn;
	sodId  = jems.parsURL().params.sodId;
	console.log(window.location.href);
	code = jems.parsURL().params.code;
	if (code == "" || code == undefined){
		jems.tipMsg("非法支付!");
		return;
	} else {
		publicPay(sodId, code);
	}

});

/**
 * 通联-公众号支付
 * @param sodId 订单ID
 * @param code
 * @returns
 */
function publicPay(sodId, code){
	$.ajax({
		url: msonionUrl+"material/wxpay/publicPay/v1",
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
				timeStamp = result.data.timeStamp;
				nonceStr = result.data.nonceStr;
				appId = result.data.appId;
				paySign = result.data.paySign;
				prepay_id = result.data.prepayId;
				if (result.data.timeStamp != undefined){
					if (typeof WeixinJSBridge == "undefined"){
						if( document.addEventListener ){
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								timestamp:result.data.timeStamp,
								nonceStr:result.data.nonceStr,
								appId:result.data.appId,
								signature:result.data.paySign,
								jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
							});
							document.addEventListener('WeixinJSBridgeReady', callpay, false);
						}else if (document.attachEvent){
							document.attachEvent('WeixinJSBridgeReady', callpay);
							document.attachEvent('onWeixinJSBridgeReady', callpay);
						}
					}else{
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							timestamp:result.data.timeStamp,
							nonceStr:result.data.nonceStr,
							appId:result.data.appId,
							signature:result.data.paySign,
							jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						callpay();
					}
				} else {
					jems.goUrl("ucenter/members.html");
				}
			} else {
				$("#desc").text(result.errMsg);
				$("#amount").text("0.00");		
			}
		},
		error:function(result){
			alert(1111);
			alert(result);
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
			jems.goUrl("ucenter/members.html");
		},
		cancel:function(res){
			jems.goUrl("ucenter/members.html");
		},
		fail:function(res){
			jems.goUrl("ucenter/members.html");
		}
	});
}