var tmn = "";
var openId = "";
var appId_return = "";
var timestamp_return = "";
var nonceStr_return = "";				
var paySign_return = "";
var package_return = "";
$(function(){
	tmn = jems.parsURL().params.tmn;
	openId = jems.parsURL().params.openId;
	sodId  = jems.parsURL().params.sodId; 
	toPay(sodId, tmn, openId);
});

function toPay(sodId,tmn,openId){
	var data = {"sodId":sodId,"tmn":tmn,"payType":34,"openId":openId};
	$.ajax({
		url: msonionUrl+"/payeco/payecoPayByOpenId/v1",
		type:'POST',
		data:data,
		dataType:'json',
		success:function(result){
			$("#loader").hide();
			$(".mswrapper").show();
			if(result.errCode == 10000) {
				$("#desc").text(result.data.desc);
				$("#amount").text(result.data.amount);
				appId_return  =  result.data.appId;
				 timestamp_return = result.data.timestamp;
				nonceStr_return  = result.data.nonceStr;				
				paySign_return  =  result.data.paySign;
				package_return   =  result.data.Package;
				if (package_return !=  "") {
					call_wxPay();
				}				
				return ;
			} else {
				$("#amount").text(result.errMsg);
			}
		}
	});
}
call_wxPay = function(){
	var payFlg = false;
	if (timestamp_return != undefined && !payFlg ){
		payFlg = true;
		pageLogin = mBox.open({
			width:"70%", height:100, closeBtn: [false,1],
			content:"<p class='tc listinfo f16' style='width:100%'>拼命跳转微信支付...</p>",
			maskClose:false
		});
		if (typeof WeixinJSBridge == "undefined"){
			if( document.addEventListener ){
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					timestamp:timestamp_return,
					nonceStr:nonceStr_return,
					appId:appId_return,
					signature:paySign_return,
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
				timestamp:timestamp_return,
				nonceStr:nonceStr_return,
				appId:appId_return,
				signature:paySign_return,
				jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			callpay();
		} 
	} else {
        jems.tipMsg("下单失败");
	}
}
callpay = function(){
	mBox.close(pageLogin);
	wx.chooseWXPay({
		timestamp:timestamp_return,
		nonceStr:nonceStr_return,
		package:package_return,
		signType:"MD5",
		paySign:paySign_return,
		success: function (res) {
			jems.goUrl("ucenter/order-all.html?sodStat=2");
		},
		cancel:function(res){
			jems.goUrl("ucenter/payment.html?sodId="+sodId);
		},
		fail:function(res){
			jems.goUrl("ucenter/payment.html?sodId="+sodId);
		}
	});
}