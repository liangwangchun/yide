var sodId = "";
var  data_params ="";
var url = "";
var sodStat = 0;
var pageLogin;
var tmn = jems.parsURL().params.tmn;
$(function(){
	sodId  = jems.parsURL().params.sodId;
	data_params =  jems.parsURL().params;
	url = window.location.href;
	var payFlg = false;
	if (data_params.timeStamp != undefined && !payFlg ){
		payFlg = true;
		pageLogin = mBox.open({
			width:"70%", height:100, closeBtn: [false,1],
			content:"<p class='tc listinfo f16' style='width:100%'>拼命跳转微信支付...</p>",
			maskClose:false
		})
		if (typeof WeixinJSBridge == "undefined"){
			if( document.addEventListener ){
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
				document.attachEvent('WeixinJSBridgeReady', callpay);
				document.attachEvent('onWeixinJSBridgeReady', callpay);
			}
		}else{
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
	} else {
		loadingData();
	}
	//返回店主中心 
	jems.backStore(); 
});
function loadingData(){
	$.ajax({
		type : "post",
		data: data_params,
		url : msonionUrl+"sodrest/findSodById",
		dataType : "json",
		asyn:false,
		success:function(json){
			var datas = {data:json};
			datas.data.tmn = tmn;
			sodStat = json.sodStat;
			var gettpl = $('#myOrderData').html();
			jetpl(gettpl).render(datas, function(html) {
				$('#myOrderlist').append(html);
			});
		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}
//通联支付宝支付
function aliPay_union(){
	$.ajax({
		type : "post",
		data: $("#orderForm_union").serialize(),
		url : msonionUrl+"unionPayByGroup/toPay",
		dataType : "text",
		asyn:false,
		success:function(msg){
			msg = JSON.parse(msg);
			var errCode = msg.errCode;
			if(10000 == errCode){
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == "micromessenger"){
					//如果是微信浏览器，跳转换URL。根据gopay确定是否已经更换
					window.location.href="alipay.html?"+msg.data.payUrl+"?tmn="+tmn;
				}else{//不是微信浏览器，调转支付
					window.location.href = msg.data.payUrl;
				} 
			}else if(5132 == errCode){
				var dataInfo = msg.data;
				var trxcode = dataInfo.trxcode;
				var trxMsg = '';
				if(trxcode == 'VSP501'){
					trxMsg = '微信';
				}else{
					trxMsg = '支付宝';
				}
				mBox.open({
					width:"80%",
					content:"<p class='tc listinfo f16' style='width:100%'>您已使用"+trxMsg+"支付过，请稍后查看！</p>",
					closeBtn: [false,1],
					btnName:['访问首页', '查看订单'],
					btnStyle:["color: #0e90d2;","color: #0e90d2;"],
					maskClose:false,
					yesfun : function(){
						jems.goShop();
					} ,     
					nofun : function(){
						jems.goUrl('ucenter/order-all.html');
					}     
				});
			}else{
				mBox.open({
					width:"80%",
					content:"<p class='tc listinfo f16' style='width:100%'>"+msg.errMsg+"</p>",
					closeBtn: [false,1],
					btnName:['访问首页', '查看订单'],
					btnStyle:["color: #0e90d2;","color: #0e90d2;"],
					maskClose:false,
					yesfun : function(){
						jems.goShop();
					} ,     
					nofun : function(){
						jems.goUrl('ucenter/order-all.html');
					}     
				});
			}
			
		},
		error:function(msg){
			UsTips("network error!");
		}
	});
}
//通联微信支付
function wxPay_union(){
	window.location.href = "payment-group.html?tmn="+tmn+"&sodId="+sodId;
}

//通联公众号支付(团购)
function unionWxPay_union_group(){
	$.ajax({
		type : "post",
		data: {"sodId":sodId,"tmn":tmn,"notifyUrl":"sodgroup/groupReturn"},
		url : msonionUrl+"unionPayByGroup/toWxPay",
		dataType : "json",
		success:function(result){
			mBox.close(pageLogin);
			if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"){
				if (result.errCode == 10000) {
					window.location.href = result.data;
				} else {
					jems.tipMsg(result.errMsg);
				}
			}else{
				jems.tipMsg("请在微信内部打开");
			}
		},
		error:function(msg){
			mBox.close(pageLogin);
			jems.tipMsg("network error!");
		}
	});
}
//店主支付
function storeBuy(){
	var sodId = jems.parsURL().params.sodId;
	$.ajax({
		type : "post",
		data: {"sodId":sodId},
		url : msonionUrl+"sodrest/updateSodByStoreBuy",
		dataType : "json",
		asyn:false,
		success:function(data){
			if(data){
				jems.goUrl('ucenter/order-payment.html?sodStat=1&t='+Math.random());
			} else {
				jems.tipMsg("失败了，刷新页面重新点击");
			}
		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}
function dialogMsg(msg){
	mBox.open({
		width:"70%",
		height:100,
		content:"<p class='tc listinfo f16' style='width:100%'>"+msg+"</p>",
		closeBtn: [false,1],
		btnName:['确定'],
		btnStyle:["color: #0e90d2;"],
		maskClose:false
	})
}
function callpay(){
	mBox.close(pageLogin);
	wx.chooseWXPay({
		timestamp:data_params.timestamp2,
		nonceStr:data_params.nonceStr2,
		package:"prepay_id="+data_params.packageValue,
		signType:"MD5",
		paySign:data_params.paySign,
		success: function (res) {
			jems.goUrl("ucenter/order-all.html?sodStat=2");
		},
		cancel:function(res){
			jems.goUrl("payment.html?sodId="+sodId);
		},
		fail:function(res){
			jems.goUrl("payment.html?sodId="+sodId);
			getScanUri();
		}
	});
}

/**************************************************************/
/*********************   scan  end   **************************/
/**************************************************************/
function checkTimeout(key){
	goPay();
	/*   $.ajax({
        type : "post",
        data :  {"sodId":sodId},
        url : msonionUrl+"sodrest/findSodById",
        dataType : "json",
        asyn:false,
        success:function(data){*/
	//mBox.close(pageLogin);
	if (sodStat == 1) {
		switch (key) {
		case 0: //微信支付
			unionWxPay_union_group();
			break;
		case 1: //支付宝支付
			aliPay_union();
			break;
		case 2: //店主代付
			storeBuy();
			break;
		default:
			break;
		}
//	} else if (data.sodStat == 0)  {//交易超时关闭
//		tip("支付超时，订单已关闭!");
	} else {
		tip("订单已支付");
	}

	/*     },
        error:function(){
            jems.tipMsg("network error!");
        }
    });*/
}
function tip(msg){
	mBox.open({
		width:"70%",
		content:"<p class='tc listinfo f16' style='width:100%'>"+msg+"</p>",
		closeBtn: [false,1],
		btnName:['访问首页', '查看订单'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('indexView');
		} ,
		nofun : function(){
			jems.goUrl('ucenter/order-all.html');
		}
	});
}
function goPay(){
	pageLogin =  mBox.open({
		boxtype: 3,
		conStyle: 'text-align:center;',
		maskColor:"rgba(0,0,0,0.8)",
		time: 0,
		content: '<div class="jemboxloadspin"><div class="jemboxloading"></div></div><p style="line-height:20px;">支付的路上</p>',
		success:function () {
		}
	});
}