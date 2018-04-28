var ParHref = jems.parsURL(), stat = "", tmn = "", id = "",sodGroupId="",uid = "",level = "";
var params = ParHref.params;
var placesNum = 0,name = "",groupPrice=0,imgUrl="",saleGuide="",memberType="";
var tmn = params.tmn;
$(function(){
	$("#productGroup").hide();
	tmn=params.tmn, id = params.id,sodGroupId=params.sodGroupId;
	$.ajax({
		type : "post",
		data : {
			"groupId":id,
			"tmn":tmn,
			"sodGroupId":sodGroupId
		},
		url : msonionUrl+"group/spellGroupDetails/v1",
		dataType: "json",
		asyn:false,
		success:function(result){
			errCode = result.errCode;
			errMsg = result.errMsg;
			if(errCode == 10000){
				var groupInfo = result.data.groupRec;//团购商品信息
				stat = result.data.stat;//参团用户信息
				placesNum = result.data.placesNum;//还差几个人
				name = groupInfo.name;//商品名称
				groupPrice = groupInfo.groupPrice;//商品价格
				saleGuide = groupInfo.product.saleGuide;//商品价格
				imgUrl = msPicPath+groupInfo.product.mainPicUrl;//商品图片
				var isgroup = result.data.isgroup;//是否参团
				$(".groupTime").html(groupInfo.groupTime);
				memberType = result.data.memberType;
				level = result.data.level;
				if(stat == 1){//尚未参团
					tip("团购已结束!");//团购已完成跳转
				} else if(5 == stat){
					$("#coloneDiv").show();
					$("#yjctDiv").hide();
					$("#successMsg").hide();
					$("#successMsg2").show();
					$("#succeedDiv2").show();
					$("#productGroup1").show();
					$("#footerDiv2").show();
					$("#successGroup").html("拼团成功");
					$("#goToOrderDesc").on("click",function(){
            			goToSodDetails(result.data.sodId)
            		});
					$("#memberList").show();
					$("#productGroupBeginTime").html(result.data.startDate);
				}else if(3 == stat || 4 == stat){					
					$(".join_group").hide();
					$(".join_group").html("参团成功")
					$("#join_group").show();
					$("#footerDiv").show();
					$("#succeedDiv2").show();
					$("#groupDesc").text("点击右上角,邀请好友参加")
					$("#join_group").click(function(){
						jems.goUrl('ucenter/order-details.html?sodId='+isgroup+"&tmn="+tmn);
					});
					$("#successMsg").html("快邀请小伙伴们来参团吧！");
					$("#succeedDiv1").show();
					$("#placesNumP2").show();
					$("#djsDiv").show(); 
					$("#coloneDiv").show();
					$("#productGroup1").show();
					$("#footerDiv").show();
					$("#productGroupBeginTime").html(result.data.startDate);
				}else if(2 == stat){
					$(".join_group").hide();
					$("#join_group").html("参团成功，未支付");
					$("#join_group").show();
					$("#join_group").click(function(){
						jems.goUrl('ucenter/order-details.html?sodId='+isgroup+"&tmn="+tmn);
					});
					$("#successMsg").hide();
					$("#succeedDiv2").show();
					$("#djsDiv").show();
					$("#coloneDiv").show();
					$("#productGroup1").show();
					$("#footerDiv").show();
					$("#placesNumP").show();
					$("#yjctDiv").show();
					$("#productGroupBeginTime").html(result.data.startDate);
				}else{
					$("#join_group").hide();
					$("#productGroup").show();
					$("#djsDiv").show();
					$("#coloneDiv").show();
					$("#ptxzDiv").show();
					$("#placesNumP").show();
					$("#yjctDiv").show();
				}
				$("#groupName").html(name);
				$("#productGroupName").html(name);
				$("#groupMemberQty").html(groupInfo.groupMemberQty);
				$("#groupPrice").html("&yen;"+ jems.formatNum(groupPrice));
				$("#freePrice").html("&yen;"+ jems.formatNum(groupInfo.product.freePrice));
				$("#placesNum").html(placesNum);
				$("#placesNum1").html(placesNum);
				$("#groupPrice").html("&yen;"+ jems.formatNum(groupPrice));
				$("#productPic").attr('src',imgUrl);
				countDates(result.data.endTime,result.data.nowDate);
				var gettpl = $('#memberListData').html();
				var datas = {data:result.data.memberList};
				jetpl(gettpl).render(datas, function(html){
					$('#memberList').append(html);
				});
				//微信分享
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == "micromessenger"){
					var title = "【还差"+placesNum+"人】我"+groupPrice+"元拼了【"+name+"】";
					wxShare(title, window.location.href, imgUrl,saleGuide);
				}
			}else{
				var groupInfo = result.data.groupRec;//团购商品信息
				$(".groupTime").html(groupInfo.groupTime);
				$("#groupName").html(groupInfo.name);
				$("#groupMemberQty").html(groupInfo.groupMemberQty);
				$("#groupPrice").html("&yen;"+ jems.formatNum(groupInfo.groupPrice));
				$("#freePrice").html("&yen;"+ jems.formatNum(groupInfo.product.freePrice));
				$("#productPic").attr('src', msPicPath+groupInfo.product.mainPicUrl);

				$("#coloneDiv").show();
				$(".join_group").hide();
				$("#bg-gray").text(result.errMsg).addClass("bg-C0C0C0");
				$("#bg-gray").show();
				$("#bg-gray").click(function(){
					jems.goUrl("group-index.html"+'?msToken='+msToken+'&client='+client+'&uid='+uid);
				});			
				$("#productGroup").show();
				$("#ptxzDiv").show();
				return;
			}
		},
		error:function(data){
			jems.mboxMsg("network error!");
		}
	});
	
});
//点击去到团购商品详情页面
function goToGroupDetails(){
	jems.goUrl('group-details.html?id='+id);
}
//点击去到团购列表页面
function goToIndex(){
	jems.goUrl('group-index.html');
}
//去订单详情页面
function goToSodDetails(sodId){
	jems.goUrl("ucenter/order-details.html?sodId="+sodId);
}

//倒计时
function countDates(orderdate,serverdate){
	var splitTime = function (date) {
		var a = date.split(' '), d = a[0].split('-'), t = a[1].split(':');
		return { YY: d[0], MM: d[1], DD: d[2], hh: t[0],  mm: t[1], ss: t[2] };
	}
	var st = splitTime(serverdate), serverTime =  new Date(st.YY, st.MM - 1, st.DD, st.hh, st.mm, st.ss);
//	var dateTime = new Date(), difference = dateTime.getTime() - serverTime;
	var that = $(this), ot = splitTime(orderdate);
	var endTime = new Date(ot.YY, ot.MM - 1, ot.DD, ot.hh, ot.mm, ot.ss);
	var nMS = endTime.getTime() - serverTime.getTime();
	setInterval(function() {
		var D = Math.floor(nMS / (1000 * 60 * 60 * 24));
		var H = Math.floor(nMS / (1000 * 60 * 60)) % 24;
		var M = Math.floor(nMS / (1000 * 60)) % 60;
		var S = Math.floor(nMS / 1000) % 60;
		var MS = Math.floor(nMS / 100) % 10;
		H = D * 24+H;
		H = checkTime(H);
		M = checkTime(M);
		S = checkTime(S);
		if (nMS >= 0) {
			$("#_h").html(H);
			$("#_m").html(M);
			$("#_s").html(S);
		} else {
			$("#placesNumP").hide();
			$("#djsDiv").hide();
			$("#yjctDiv").text("拼团已结束！").addClass("f18");
		}
		nMS= nMS-100;
	}, 100);
}
function checkTime(i) { // 将0-9的数字前面加上0，例1变为01
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
function tip(text){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>"+text+"</p>",
		closeBtn: [false,1],
		btnName:['访问团购列表', '会员中心'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('group-index.html');
		} ,     
		nofun : function(){
			jems.goUrl('ucenter/members.html');
		}     
	});
}
function goToObligations(){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>您已参团，请付款!</p>",
		closeBtn: [false,1],
		btnName:['访问团购首页', '去付款'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('group-index.html');
		} ,     
		nofun : function(){
			jems.goUrl('ucenter/order-payment.html?sodStat=1&t='+Math.random());
		}     
	});
}
//确认订单页面
function goToSubmit(){
	if (typeof(memberType) == undefined || memberType == null || memberType =="" || memberType == "undefined" ){
		jems.goUrl("login.html?"+window.location.href);
		return;
	}
	if(2 == memberType){
		mBox.open({
			width:"80%",
			content:"<p class='tc f16' style='width:100%'>对不起，洋葱商家无法使用本功能</p>",
			closeBtn: [false],
			btnName:['确定'],
			btnStyle:["color: #0e90d2;"],
			maskClose:false,
			yesfun : function(){
				jems.goBack();
			}
		});
		return;
	}
	jems.goUrl('group-sumbit.html?id='+id+'&sodGroupId='+sodGroupId+'&level='+level+"&t="+Math.random());
}
//团购详情页面
function goGroupDetail(){
	jems.goUrl('group-details.html?id='+id+'&t='+Date.parse(new Date()));
}
/**
 * 微信分享
 * @param store_name 分享的名称
 */

function wxShare (title, link, imgUrl,desc){
	title = title == null ? "洋葱OMALL":title;
	link = link == null ? window.location.href:link;
	desc = desc == null ? "全球研选 日用之美":desc;
	imgUrl = imgUrl == null ? "https://m.msyc.cc/wx/nimages/share_logo.png":imgUrl;
	/*if(imgUrl.indexOf("msyc-img.img-cn-shenzhen.aliyuncs.com") < 0 || mgUrl.indexOf("img.51msyc.com") < 0 ){
		imgUrl = "http://img.51msyc.com/"+imgUrl;
	}*/
	$.ajax({
		type:"get",
		url : msonionUrl+"getWeChatSign",
		data: {"url": link},
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
					title: title, // 分享标题
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					desc  :desc,
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
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: link,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
					imgUrl: imgUrl, // 分享图标
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
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl:imgUrl, // 分享图标
				success: function () { 
					// 用户确认分享后执行的回调函数
				},
				cancel: function () { 
					// 用户取消分享后执行的回调函数
				}
			});
			wx.onMenuShareQQ({
				title: title, // 分享标题
				desc: desc, // 分享描述
				link: link, // 分享链接
				imgUrl:imgUrl, // 分享图标
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
/*var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i) == "micromessenger"){
	shareMoreFriends();
}*/
/***************微信分享 end************************/
