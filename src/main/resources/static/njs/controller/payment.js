/**
 @Js-name:payment.js
 @Zh-name:支付方式
 @Author:tyron
 @Date:2015-07-31
 */
var  tmn = "";
var sodId = "";
var  data_params ="";
var url = "";
var sodStat = 0;
var localUrl = window.location.href;
var tmnids = [79344,13673,376,156,498];
$(function(){
	tmn  = jems.parsURL().params.tmn;
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
	/** 快捷支付选卡 **/
	quickPayment();
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
				if (tmnids.indexOf(json.memberRec.memberTmnId) >= 0 ) {
					$(".baofu_cart").show();
				}
				if ((json.memberRec.memberTmnId % 2) == 0 ) {
					$(".checkTmn").show();
				}
				$('#myOrderlist').append(html);
			});
		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}
//支付宝支付
function payment(){
	$.ajax({
		type : "post",
		data: $("#orderForm").serialize(),
		url : msonionUrl+"alipay/judgeBrowser",
		dataType : "text",
		asyn:false,
		success:function(data){
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == "micromessenger"){
				//如果是微信浏览器，跳转换URL。根据gopay确定是否已经更换
				window.location.href = "alipay.html?"+data;
			}else{//不是微信浏览器，调转支付
				window.location.href = data;
			}

		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}
//支付宝国际支付
function paymentV2(){
	$.ajax({
		type : "post",
		data: $("#orderForm_aliPay").serialize(),
		url : msonionUrl+"alipay/toAlipay/v1",
		dataType : "text",
		asyn:false,
		success:function(data){
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == "micromessenger"){
				//如果是微信浏览器，跳转换URL。根据gopay确定是否已经更换
				window.location.href = "alipay.html?"+data;
			}else{//不是微信浏览器，调转支付
				window.location.href = data;
			}
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
		url : msonionUrl+"unionPay/toPay",
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
//易联支付宝支付
function aliPay_payeco(){
	$.ajax({
		type : "post",
		data: $("#payeco_aliPay").serialize(),
		url : msonionUrl+"payeco/payecoByAliPay/v1",
		dataType : "text",
		asyn:false,
		success:function(msg){
			msg = JSON.parse(msg);
			if(10000 == msg.errCode){
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == "micromessenger"){
					//如果是微信浏览器，跳转换URL。根据gopay确定是否已经更换
					window.location.href="alipay.html?"+msg.data.payUrl+"?tmn="+tmn;
				}else{//不是微信浏览器，调转支付
					window.location.href = msg.data.payUrl;
				} 
			}else{
				mBox.open({
        			//width:"80%",
        			content:msg.errMsg,
        			closeBtn: [false],
        			btnName:['确定'],
        			btnStyle:["color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				jems.goUrl(localUrl);
        			}
        		})
        		return;
			}
		},
		error:function(msg){
			UsTips("network error!");
		}
	});
}
//通联微信支付
function wxPay_union(){
	window.location.href = "payment-union.html?tmn="+tmn+"&sodId="+sodId;
}

//通联公众号支付
function unionWxPay_union(){
	$.ajax({
		type : "post",
		data: {"sodId":sodId,"tmn":tmn},
		url : msonionUrl+"unionPay/toWxPay",
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
//宝付公众号支付
function baofooWxPay_baofoo(){
	$.ajax({
		type : "post",
		data: {"sodId":sodId,"tmn":tmn},
		url : msonionUrl+"baofooPay/toWxPay/v1",
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
//财务通 支付
function tenpayment(){
	$.ajax({
		type : "post",
		data: $("#tenpayForm").serialize(),
		url : msonionUrl+"wx/tenpay/toTenpay",
		dataType : "text",
		asyn:false,
		success:function(data){
			window.location.href = data;
			/*var ua = navigator.userAgent.toLowerCase();
             if(ua.match(/MicroMessenger/i) == "micromessenger"){
             //如果是微信浏览器，跳转换URL。根据gopay确定是否已经更换
             goUrl("alipay.html?"+data);
             }else{//不是微信浏览器，调转支付
             window.location.href = data;
             }  */
		},
		error:function(data){
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
//钱袋宝支付
function qiandaibao(payType){
	var sodId = jems.parsURL().params.sodId;
	if (sodId == "" || sodId == null || sodId == "undefined") {
		jems.tipMsg("系统出错，返回刷新!");
		return "";
	}
	$.ajax({
		type : "post",
		data: {"sodId":sodId,"tmn":tmn,"platform":"mobile","payType":payType},//weixin,mobile
		url : msonionUrl+"qiandaibao/toPay",
		dataType : "json",
		asyn:false,
		success:function(data){
			if (data.errCode == 10000){
				$("#payment").html(data.returnText);
			} else {
				jems.tipMsg("网络异常请重新生成订单");
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
function wxpay(){
	$("#wechatForm").submit();
}

function weChatpublicNoPay(){
	$("#weChatpublicNo").submit();
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
/*********************   scan     begin************************/
/**************************************************************/
function getScanUri(){
	$.ajax({
		type: 'POST',
		url: msonionUrl+"/wx/wxpay/getWxScanPayUri",
		data:$("#wechatForm").serialize(),
		dataType: 'json',
		success: function(data){
			// dialogMsg("正在生成微信支付二维码，请耐心等待");
			$("#payScanImgSrc").show();
			var uri = data.result;
			if(uri == "" || uri == null || uri == undefined){
				uri = msPicPath+"/wx/index.html?tmn=1";
			}
			$("#payScanImgSrc").attr("src","http://api.kuaipai.cn/qr?chl="+uri+"&chs=400x400");
			seaoffTips();
		},
		error:function(data){
			dialogMsg("生成微信支付二维码失败，请刷新重试");
			$("#payScanImgSrc").hide();
			$("#payBUt").show();
		}
	});
}
function seaoffTips() {
	mBox.open({
		title: ['长按二维码支付','background:#8016AD; color:#fff;font-size:1.6rem;'],
		width:"90%",
		height:"66%",
		setType : "id",
		content:"#payScanImgSrc",
		closeBtn: [true,2],
		maskClose:false
	})
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
			wxpay();
			break;
		case 1: //支付宝支付
			paymentV2();
//			payment();
//			qiandaibao("alipay")
			break;
		case 2: //店主代付
			storeBuy();
			break;
		case 3: //通联微信支付
			wxPay_union();
			break;
		case 4://通联支付宝支付
			aliPay_union();
			break;
		case 5: //钱袋宝
			qiandaibao("weixin");
			break;
		case 6:
			unionWxPay_union();
			break;
		case 8://微信公众号
			weChatpublicNoPay();
			break;
		case 9://易联支付宝支付
			aliPay_payeco();
			break;
		case 1001:
			baofooWxPay_baofoo();
			break;
		case 1002:
			unionQuickSubmitOrder();
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
function tip(texts){
//	alert(texts);
//	mBox.open({
//		width:"70%",
//		height:"100px",
//		content:"<p class='tc f16' style='width:100%'>"+texts+"</p>",
//		closeBtn: [false],
//		btnName:['访问首页', '查看订单'],
//		btnStyle:["color: #0e90d2;"],
//		maskClose:false,
//		yesfun : function(){
//			jems.goShop();
//		},
//		nofun : function(){
//			jems.goUrl('ucenter/order-all.html');
//		}
//	})
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>"+texts+"</p>",
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
/** 快捷支付选卡 **/
function quickPayment(){
	$.ajax({
		type : "post",
		url : msonionUrl+"bankCard/getCardByTop/v1",
		dataType: 'json',
		success:function(result){
			if(10000 == result.errCode){
				if(undefined == result.data || null == result.data){
					$("#youCard").hide();
					$("#noCard").show().on("click",function(){
						var localUrl = window.location.href;
						var locCard = 'add-card.html?'+localUrl
						jems.goUrl(locCard);
					});
				}else{
					$("#noCard").hide();
					var dataResult = result.data;
					$("#bankName").text(dataResult.bankName);
					var bankNo = dataResult.cardNo;
					$("#bankNo").text(bankNo.substring(bankNo.length,bankNo.length-4));
					$("#bankCode").attr("src","http://img.51msyc.com/wx/nimages/bankicon/"+dataResult.bankCode+".png");
					$("#goToBankSelect").on("click",function(){
						jems.goUrl('bank-select.html?sodId='+sodId);
					});
					$("#toQuickPay").on("click",function(){
						/** 支付页面（支付验证码） **/
						quickPay(dataResult.bindId);
					});
				}
			}else{
				jems.tipMsg(result.errMsg);
        		return;
			}
		}
	});
}

/**
 * 确认支付页面（支付验证码页面）
 * @param bindId
 */
function quickPay(bindId){
	$.ajax({
		type : "post",
		data: {"bindId":bindId,"sodId":sodId},
		url : msonionUrl+"bankCard/prePayByBindId/v1",
		dataType : "json",
		success:function(result){
			if(10000 == result.errCode){
				var businessNo = result.data.business_no;
				jems.goUrl('payment-phonever.html?businessNo='+businessNo+'&bindId='+bindId+"&sodId="+sodId);
			}else{
				jems.tipMsg(result.errMsg);
        		return;
			}
		}
	});
}
/**
 * 通联快捷支付
 * @returns
 */
function unionQuickSubmitOrder(){
	var sodId = jems.parsURL().params.sodId;
	if (sodId == "" || sodId == null || sodId == "undefined") {
		jems.tipMsg("系统出错，返回刷新!");
		return "";
	}
	$.ajax({
		type : "post",
		data: {"sodId":sodId,"tmn":tmn},
		url : msonionUrl+"unionQuick/submitOrder/v1",
		dataType : "json",
		asyn:false,
		success:function(result){
			if (result.errCode == 10000){
				$("#payment").html(result.data);
			} else {
				jems.tipMsg("网络异常请重新生成订单");
			}
		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}