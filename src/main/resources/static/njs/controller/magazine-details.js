var ParHref = jems.parsURL( window.location.href );
$(function(){
	//首页产品列表
	$.ajax({
		type : "get",
		url : msonionUrl+"magazinedetail/listbymsg?msgId="+ParHref.params.id+"&tmn="+ParHref.params.tmn,
		cache:true,
		dataType : "json",
		success:function(json){
			var total = json.total, datas = {data:json.data}, rets = [], retData = {data:rets}; 
			//获取linkId不为空的数组
			$.each(json.data, function(i,dt) {	
				if(dt.linkId != "" && dt.type == 1) rets.push(dt);
			});
			var bodyCls = $("body"), bodyTop = bodyCls.css("paddingTop").replace(/\px|em|rem/g,'');
			//商品小图列表
			if(rets != ""){
				bodyCls.css({"padding-top":parseInt(bodyTop)+66});
				var reHtml = '', relen = rets.length >= 3 ? 3 : rets.length;
				for (var i=0; i<relen; i++) {
					reHtml += '<img class="photo mr8 rdu" src="'+msPicPath+rets[i].mainPicUrl+'">';
				}
				$("#magshuoluo").prepend(reHtml);
			}else{
				$("#showMore").parent().css('display','none');
			}
			//判断视频地址是否存在
			if(json.data[0].videoUrl == undefined || json.data[0].videoUrl == ""){
				$("#movie").remove();
			}else{
				var videos = $("<video/>",{"webkit-playsinline":"true","playsinline":"true","x5-video-player-type":"h5","x5-video-player-fullscreen":"true","preload":"none","width":"100%","controls":"controls","poster":""});
				var source = $("<source/>",{"src":json.data[0].videoUrl,"type":"video/mp4"});
            	$("#movie").append(videos.append(source));
			}
			//赋值详细内容展示
			if(json.data == ""){				
				$("#magazdetails").html("<p class='f18 tc red' style='padding-top:120px;'>内容丢失了！</p>");
			}else{
				//商品列表
				jetpl("#magazrelatedData").render(retData, function(html){
					$('#showMoreDIv').html(html);
				});
				//内容展示
				jetpl("#magazdetailsData").render(datas, function(html){
					$('#magazdetails').append(html);
				});
				
				relatedProducts(rets.length);
				
				var photo_url = json.data[0].img;
				if (photo_url =="" || photo_url == "undefined"){
					photo_url = "http://m.msyc.cc/wx/nimages/share_logo.png";
				} else {
					photo_url = msPicPath+photo_url;
				}
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == "micromessenger"){
					wxShare(json.data[0].title, json.data[0].titleTiny,photo_url);
				}
				
			}
			
		}
	});
	//jems.getShopTitle(ParHref.params.tmn);

	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom: 40});

});

//相关产品切换显示
function relatedProducts(len){
  	$("#showMore").on('tap',function(){
  		$(this).hide();
  		$("#showMoreDIv").show();
  		$("#magazinemask").show();
  		$(this).parent().css('bottom',0);
  		if(len > 3){
  			var showHeight = $('#showMoreDIv li').height(), diffHeight = len >= 4 ? 30 : 0;
  			$("#showMoreDIv").css({height:showHeight*4+diffHeight,overflow:'auto'});
  		}
  	});
  	$("#magazinemask").on('tap',function(){
  		$(this).hide();
  		$("#showMoreDIv").hide();
  		$("#magazinemask").hide();
  		$("#showMore").show().parent().css('bottom','');
  	});
}
/**
 * 微信分享
 * @param store_name 分享的名称
 */
function wxShare(store_name, desc,photo_url){
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
					imgUrl: photo_url, // 分享图标
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
					desc: desc, // 分享描述
					link: window.location.href,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
					imgUrl: photo_url, // 分享图标
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
				desc: desc, // 分享描述
				link: window.location.href, // 分享链接
			    imgUrl:"", // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});
			wx.onMenuShareQQ({
				title: store_name, // 分享标题
				desc: desc, // 分享描述
				link: window.location.href, // 分享链接
			    imgUrl:"", // 分享图标
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
/***************微信分享 end************************/
