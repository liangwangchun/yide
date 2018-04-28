//JavaScript Document
$(function(){
	/**
	 * 微信分享
	 */
	$.ajax({
		type:"get",
		url : msonionUrl+"/getWeChatSign",
		data: {"url": window.location.href},
		dataType : "json",
		success:function(data){
			wx.config({
				debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appid, // 必填，公众号的唯一标识
				timestamp: data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.noncestr, // 必填，生成签名的随机串
				signature: data.finalsign,// 必填，签名，见附录1
				jsApiList: [
				            'checkJsApi',
				            'onMenuShareTimeline',
				            'onMenuShareAppMessage',
				            'onMenuShareQQ',
				            'onMenuShareWeibo',
				            'onMenuShareQZone',
				            'chooseImage',
				            'scanQRCode'
				            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function () {	
			/*	wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function (res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						alert("fsdfsfsd");
					}
				});*/
				  wx.scanQRCode({
		                // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
		                needResult : 1,
		                desc : 'scanQRCode desc',
		                success : function(res) {
		                    //扫码后获取结果参数赋值给Input
		                    var url = res.resultStr;
		                    //商品条形码，取","后面的
		                    if(url.indexOf(",")>=0){
		                        var tempArray = url.split(',');
		                        var tempNum = tempArray[1];
		                       // $("#id_securityCode_input").val(tempNum);
		                        search(tempNum);
		                    }else{
		                        //$("#id_securityCode_input").val(url);
		                    }
		                },
		        		cancel:function(res){
//		        			alert(JSON.stringify(res));
		        		},
		        		fail:function(res){
//		        			alert(JSON.stringify(res));
		        		}
		            });
			});
		}
	});
/***************微信分享 end************************/

});
//https://m.msyc.cc/findProductByBarcode?barcode=9400097041985

var search = function(code){
	$.ajax({
		type:"get",
		url : msonionUrl+"/findProductByBarcode",
		data: {"barcode": code},
		dataType : "json",
		success:function(result){
			if(result.errCode == 10000){
				window.location.href=msonionUrl+"/wx/goods-details.html?id="+result.data.id+"&tmn=1";
			}else{
//				alert("对不起，未查到详情");
			}
		},
		error:function(result){
//			alert("错误了》。"+JSON.stringify(result));
		}
	 });
}

