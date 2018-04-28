//1.从url中获取订单ID
var params = jems.parsURL(window.location.href).params;
//2.AJAX到后台校验分享红包状态
$(function (){
	var sodId = params.sodId;
	$.ajax({
		type:"post",
		dataType:"json",
		url:msonionUrl+"couponRest/checkShareCoupon",
		data:{"sodId":sodId},
		success:function(data){
			var errCode = data.errCode;
			if(errCode == "4001"){
				jems.goUrl("../wx/login.html?"+window.location.href);
			}else if(errCode == "9121"){
				jems.tipMsg(data.errMsg);
			}else if(errCode == "10000"){
			var shareState = data.data.shareState;
				if(shareState == "10000"){
					return;
				}else{
					switch (shareState) {
					case "9114":
						$("#tips1").text("订单暂无分享数据喔");
						$("#tips1").show(1000);
						break;
					case "9115":
						$("#tip1").hide();
						$("#tip2").show();
						break;
					case "9116":
						$("#tip1").hide();
						$("#tip3").show();
						break;
					case "9117":
						$("#tip1").hide();
						$("#tip4").show();
						break;
					case "9119":
						$("#tips1").text("自己不能领取自己分享出来的红包喔");
						$("#tips1").show(1000);
						break;
					case "9120":
						$("#tips1").text("洋葱服务商/洋葱店主不能领取红包喔");
						$("#tips1").show(1000);
						break;
					default:
						break;
					}
				}
			}
		}
	})
	
	   /*****微信分享*****/
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger"){
		wxShare();
	}
	
})

//领取分享红包
function rceiveShareCoupon(){
	var sodId = params.sodId;
	$.ajax({
		type:"post",
		dataType:"json",
		url:msonionUrl+"couponRest/rceiveShareCoupon",
		data:{"sodId":sodId},
		success:function(data){
			var errCode = data.errCode;
			var couponMinus = data.couponMinus;
			if(errCode == "4001"){
				jems.goUrl("../wx/login.html?"+window.location.href);
			}else if(errCode == "9121"){
				$("#tips1").text(data.errMsg);
				$("#tips1").show(1000)
			}else if(errCode == "10000"){
			var shareState = data.data.shareState;
				if(shareState == "10000"){
					$("#tip1").hide();
					$("#tip2").show();
					$("#tips1").text("恭喜获得"+couponMinus+"元红包");
					$("#tips1").show(1000);
				}else{
					switch (shareState) {
					case "9114":
						$("#tips1").text("订单暂无分享数据喔");
						$("#tips1").show(1000);
						break;
					case "9119":
						$("#tips1").text("自己不能领取自己分享出来的红包喔");
						$("#tips1").show(1000);
						break;
					case "9120":
						$("#tips1").text("洋葱服务商/洋葱店主不能领取红包喔");
						$("#tips1").show(1000);
						break;
					default:
						break;
					}
				}
			}
		}
	})
}

//微信分享函数
function wxShare(){
    /***************微信分享************************/
    var store_name = "快快领取超值大红包，叫醒买买买的欲望";
    var photo_url = "wx/wxshare/share_envelop.png";
    $.ajax({
        type:"get",
        url : msonionUrl+"getWeChatSign",
        data: {"url": window.location.href},
        dataType : "json",
        success:function(data){
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: store_name, // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl: msPicPath+photo_url, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        //alert("3q");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //alert(" no 3q");
                    }
                });
                wx.onMenuShareAppMessage({
                    title: store_name, // 分享标题
                    desc: '全球研选日用之美，全世界的美物尽在洋葱OMALL，快领取红包买买买。', // 分享描述
                    link: window.location.href,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
                    imgUrl: msPicPath+photo_url, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
            wx.onMenuShareQZone({
                title: store_name, // 分享标题
                desc: '全球研选日用之美，全世界的美物尽在洋葱OMALL，快领取红包买买买。', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl:msPicPath+photo_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: store_name, // 分享标题
                desc: '全球研选日用之美，全世界的美物尽在洋葱OMALL，快领取红包买买买。', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl:msPicPath+photo_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    });
}
