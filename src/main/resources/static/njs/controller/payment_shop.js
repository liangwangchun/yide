var tmn  = "";
var data_params ="";
var url = "";
$(function(){
	tmn = jems.parsURL( window.location.href ).params.tmn;
	data_params =  jems.parsURL(window.location.href).params;
	 url = window.location.href;
	 var payFlg = false;
	 if(data_params.payCode != undefined && data_params.payCode == 110){
		 jems.tipMsg("拒绝非法支付！");
		 return;
	 }
	loadingData();
	if (data_params.timeStamp != undefined && !payFlg ){
		payFlg = true;
		if (typeof WeixinJSBridge == "undefined"){
			   if( document.addEventListener ){
				  // alert("wx.config");
				   wx.config({
					    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					    timestamp:data_params.timeStamp,
					    nonceStr:data_params.nonceStr,
					    appId:data_params.appid,
					    signature:data_params.sign,
					    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
			       document.addEventListener('WeixinJSBridgeReady', callpay, false);
			   }else if (document.attachEvent){
				   //alert("else");
			       document.attachEvent('WeixinJSBridgeReady', callpay); 
			       document.attachEvent('onWeixinJSBridgeReady', callpay);
			   }
			}else{
			  // alert("==");
			   wx.config({
				    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    timestamp:data_params.timeStamp,
				    nonceStr:data_params.nonceStr,
				    appId:data_params.appid,
				    signature:sign,// 必填，签名，见附录1
				    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			   callpay();
			}
	}
});
function loadingData(){
	$.ajax({
        type : "get",
        data: data_params,
        url : msonionUrl+"agentStoreOrder/queryOrder",
        dataType : "json",
        async:false,
		success:function(data){
        	var errCode = data.code;
        	if(errCode == '4001'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        	}else if(errCode == '-1'){
        		 jems.mboxMsgIndex(data.msg);
        		 return;
        	}
            $('#purchaseQty').text(data.data.purchaseQty || 0);
//            $('#giveQty').text(data.data.giveQty || 0);
            $('#prvice').text("￥"+data.data.price || 0);
            
			var gettpl = $('#myOrderData').html();
			jetpl(gettpl).render(data, function(html) {
				$('#myOrderlist').append(html);
			});
		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}
function wxpayEntrance(){
	$("#payEntranceForm").submit();
}
function callpay(){
		//wx.checkJsApi({
		  //  jsApiList: ['chooseWXPay'], // 检查微信支付接口是否可用
		 //   success: function (res) { 
		    	//if(res.checkResult.chooseWXPay){
		    		wx.chooseWXPay({
		    			timestamp:data_params.timestamp2,
		    			nonceStr:data_params.nonceStr2,
		    			package:"prepay_id="+data_params.packageValue,
		    			signType:"MD5",
		    			paySign:data_params.paySign,
		    			success: function (res) {
		    				//$("#confirmPay").show();
		    				jems.goUrl("store/agents-bs-order.html");
		    		    },
			    		cancel:function(res){
			                // var text = JSON.stringify(res); 
			                // alert("text="+text);
			                jems.goUrl("payment.html?sodId="+sodId);
			            }
		    		});
		    	//}else{
		    	//	alert("支付接口不可用");
		    	//}
		   // }
		   // });
	/*	wx.error(function(res){
		    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			var text = JSON.stringify(res);
			alert("wx.error="+text);
		});*/
	
}