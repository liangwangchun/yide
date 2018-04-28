var memberInfo;
$(function(){
	$.ajax({
		type:'POST',
		url:msonionUrl+"store/agentCenter/v1",
		dataType:'json',
		success:function(result){
			if(10000 == result.errCode){
				if(result.data.agentsRight){
					$("#agentscommerce").show();
					selectAgentState();
				}
				memberInfo = result.data.memberInfo;
				$("#agentsName").text(memberInfo.memberName);
				// 头像
				var memberHeadUrl = memberInfo.memberHeadUrl, imgurl;
				// 店名
				if(memberHeadUrl!= null || memberHeadUrl != undefined){					
					if (memberHeadUrl&&memberHeadUrl.indexOf("http:") >= 0) {
						imgurl = memberHeadUrl;
					} else {
						imgurl = msPicPath+memberHeadUrl;
					}
			        if (imgurl.indexOf("undefined") == -1) $("#agentsImage").attr("src",imgurl);
				}
				var sumCashAble = result.data.sumCashAble;//可提现金额
				$("#agentswithdraw").text(jems.formatNum(sumCashAble || 0,2));
				var freezeCash = result.data.sumFreezeCash;//冻结余额
				$("#agentsfreezeCash").text(jems.formatNum(freezeCash || 0,2));
				var systemMessageCount = result.data.systemMessageCount;
				if(systemMessageCount.newMessage == 1){
					$("#noticeCategory").show();
				}
				jems.showCartNumTip(result.data.cartCount);//购物车数量
			}else if(4001 == result.errCode){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(10011 == result.errCode){
				jems.mboxMsgIndex("升级代理商后可以访问！");
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

	//退出帐户
	$("#loginout").on('tap',function(){
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

    //商务咨询
    $("#businessConsul").on('tap',function(){
        var memid = memberInfo.memberId;
        jems.serverToUdesk(memid);//商务咨询
    });

}); 

/**查询代理商运营状态
 */
function selectAgentState(){
	$.ajax({
		type:"get",
		url:msonionUrl+"agentStore/suspendState",
		dataType:"json",
		success:function(data){
			if(data.errCode == "4001"){
				jems.mboxMsg("请先登录后再进行操作");
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(data.errCode == "10011"){
				jems.mboxMsg("升级代理商后可以访问！");
			}else if (data.agentState != 0) {
				$("#agentscommerce .flexbox").attr("onclick","jems.mboxMsg('暂时无法审核店铺，如有疑问请联系洋葱发动机')");
			}
		}
	})
}
