var memberInfo;
$(function(){
	$.ajax({
		type:'POST',
		url:msonionUrl+"store/storeCenter/v1",
		dataType:'json',
		success:function(result){
			if(10000 == result.errCode){
				memberInfo = result.data.memberInfo;
				$("#storeName").text(memberInfo.memberName);
				// 头像
				var memberHeadUrl = memberInfo.memberHeadUrl, imgurl;
				// 店名
				if(memberHeadUrl!= null || memberHeadUrl != undefined){
					if (memberHeadUrl&&memberHeadUrl.indexOf("http:") >= 0) {
						imgurl = memberHeadUrl;
					} else {
						imgurl = msPicPath+memberHeadUrl;
					}
					$("#personImg").attr("src",imgurl);
				}
				// 控制是否显示店主管理模块，如果是经纪人，则不显示
				if(result.data.isBroker){
					$('#activityLi').show();
					$('#activLi').remove();

				}else{
					$('#activLi').show();
					$('#activityLi').remove();
				}
				// 获取memberId，判断是否是环信的注册用户
				if(result.data.memberInfo.memberId){
					$('#chatBtn').on('click',function(){
						isRegister(result.data.memberInfo.memberId,result.data.memberInfo.memberType)
					});		
				}
				var sumCashAble = result.data.sumCashAble;//可提现金额
				$("#withdraw").text(jems.formatNum(sumCashAble || 0,2));
				var freezeCash = result.data.sumFreezeCash;//冻结余额
				$("#freezeCash").text(jems.formatNum(freezeCash || 0,2));
				var sumIncome = result.data.sumIncome;
				// 零售收入
				$("#sumTerminal").text(jems.formatNum((sumIncome.sum_income_ls) || 0,2));
				// 账户累计
				$("#sumRegister").text(jems.formatNum((sumIncome.sum_income) || 0,2));
				var sodCount = result.data.sodCount;
				//代付款
				if(result.sod_dfk_count != 0){$("#sod_dfk").text(sodCount.sod_dfk_count)};
				//国际物流
				if(result.sod_dfh_count != 0 || result.sod_yfh_count != 0){$("#sod_dfhyfh").text(sodCount.sod_dfh_count+sodCount.sod_yfh_count)};
				//退款/售后
				if(result.sod_return_count != 0){$("#sod_return").text(sodCount.sod_return_count)};
				var systemMessageCount = result.data.systemMessageCount;
				if(systemMessageCount.newMessage == 1){
					$("#noticeCategory").show();
				}
                jems.showCartNumTip(result.data.cartCount);//购物车数量
			}else if(4001 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(10011 == result.errCode){
				jems.mboxMsgIndex("升级店主后可以访问！");
			}else if(4002 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4003 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4004 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4008 == result.errCode){
				jems.mboxMsg("您的帐号在其它设备登录，请重新登录");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4009 == result.errCode){
				jems.mboxMsg("您的帐号登录超时，请重新登录");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(4013 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else {
				jems.tipMsg(result.errMsg);
			}
		}
	});
	//商务咨询
	$("#businessConsul").on('click',function(){
		var memid = memberInfo.memberId;
		jems.serverToUdesk(memid);//商务咨询
	});



	//退出帐户
	$("#loginout").on('click',function(){
		$.ajax({
			type : "POST",
			url : msonionUrl+"user/loginout?_="+new Date().getTime(),
			dataType : "json",
			success:function(data){
				if(data.success){
					jems.goUrl(mspaths+"indexView");
				}else{
					window.location.reload();
				}
			}
		});
	});
});
function tip(){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>升级店主后可以访问！</p>",
		closeBtn: [false,1],
		btnName:['访问首页'],
		btnStyle:["color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('../indexView');
		}
	});
}
