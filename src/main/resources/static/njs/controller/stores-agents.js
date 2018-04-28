
$(function(){
	var currFile = jems.parsURL().file;
	if(currFile == "stores.html"){
		//***********店主中心**********//*
		//判断用户是否是经纪人
		$.ajax({
			type:'post',
			url:msonionUrl+"income/isbroker?_="+new Date().getTime(),
			dataType:'json',
			success:function(result){
				if(result == '-1'){
					jems.goUrl(mspaths+"login.html?"+window.location.href);
				}else{
					// 控制是否显示店主管理模块，如果是经纪人，则不显示
					if(result.isBroker){
						$('#activityLi').show();
						$('#activLi').remove();
					}else{
						$('#activLi').show();
						$('#activityLi').remove();
					}
				}
			}
		});		
		// 取用户信息
		formatAjax(msonionUrl+"income/memberinfo", getMemberInfo);		
		// 取可提现金额
		formatAjax(msonionUrl+"income/cashable", getCashable);		
		// 取冻结金额
		formatAjax(msonionUrl+"income/freezecash", getFreeCash);	
		// 取累计收入
		formatAjax(msonionUrl+"income/sumincome", getSumIncome);
		// 取累订单数
		formatAjax(msonionUrl+"income/sodcount", getSodCount);
		haveNewMessage();//是否有新的消息
	}else{
		
		//***********代理商中心**********//*
		// 取用户信息
		formatAjax(msonionUrl+"income/memberinfo", agentsMemberInfo);		
		// 取可提现金额
		formatAjax(msonionUrl+"income/cashable", agentsCashable);		
		// 取冻结金额
		formatAjax(msonionUrl+"income/freezecash", agentsFreeCash);
		// onlinetype
		formatAjax(msonionUrl+"agentStore/validateAgent", agentsRight);		
	};
	//判断是否为店主，店主不显示授权书
	if(jems.memberType() == 1) $("#authorization").remove();
	// 显示购物车数量
	jems.showCartNum();
	
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
});

function formatAjax(url,sucfun){
	$.ajax({url:url,type:'get',data:"_ast="+new Date().getTime(),dataType:'json',success:sucfun});
}

/***************************************************
 * 获取店主中心数据
 */

// 获取用户信息
function getMemberInfo(result){
	// 店名
	$("#storeName").text(result.memberName);
	// 头像
	var memberHeadUrl = result.memberHeadUrl, imgurl;
	if(memberHeadUrl!= null || memberHeadUrl != undefined){					
		if (memberHeadUrl&&memberHeadUrl.indexOf("http:") >= 0) {
			imgurl = memberHeadUrl;
		} else {
			imgurl = msPicPath+memberHeadUrl;
		}
		$("#personImg").attr("src",imgurl);
	}
}
// 获取可提现金额
function getCashable(result){
	$("#withdraw").text(jems.formatNum(result || 0,2));
	if(result == -1){
		jems.goUrl(mspaths+"login.html?"+window.location.href);
		return;
	}
}
// 获取冻结金额
function getFreeCash(result){
	$("#freezeCash").text(jems.formatNum( result || 0,2));
}
// 获取累计收入
function getSumIncome(result){
	// 零售收入
	$("#sumTerminal").text(jems.formatNum((result&&result.sum_income_ls) || 0,2));
	// 账户累计
	$("#sumRegister").text(jems.formatNum((result&&result.sum_income) || 0,2));
}
// 获取订单数量
function getSodCount(result){
	if(result.sod_dfk_count != 0){$("#sod_dfk").text(result.sod_dfk_count)};
	if(result.sod_dfh_count != 0 || result.sod_yfh_count != 0){$("#sod_dfhyfh").text(result.sod_dfh_count+result.sod_yfh_count)};
	if(result.sod_return_count != 0){$("#sod_return").text(result.sod_return_count)};
}

function searchOrder(sodState,sodType){
	var url = mspaths+"shop-order.html?sodState="+sodState+"&sodType="+sodType+'&flag=0';
	jems.goUrl(url);
}

/***************************************************
 * 获取代理商中心数据
 */

// 获取代理用户信息
function agentsMemberInfo(result){
	if (result.memberType !=2 ) {
        mBox.open({
            width: "80%",
            content: "<p class='tc f16' style='width:100%;-webkit-box-pack: inherit;overflow:auto'>您的权限不足!</p>",
            closeBtn: [false, 1],
            btnName: ['确定'],
            btnStyle:["color: #0e90d2;"],
            maskClose: false,
            yesfun : function(){
			   jems.goShop();
		    }
        });
	}
	// 店名
	$("#agentsName").text(result.memberName);
	// 头像
	var memberHeadUrl = result.memberHeadUrl, imgurl;
	if(memberHeadUrl!= null || memberHeadUrl != "undefined"){					
		if (memberHeadUrl&&memberHeadUrl.indexOf("http:") >= 0) {
			imgurl = memberHeadUrl;
		} else {
			imgurl = msPicPath+memberHeadUrl;
		}
        if (imgurl.indexOf("undefined") == -1) $("#agentsImage").attr("src",imgurl);
	}
}
// 获取代理可提现金额
function agentsCashable(result){
    $("#agentswithdraw").text(jems.formatNum(result || 0,2));
    if(result == -1){
        jems.goUrl(mspaths+"login.html?"+window.location.href);
        return;
    }
}

// 获取代理冻结金额
function agentsFreeCash(result){
	$("#agentsfreezeCash").text(jems.formatNum( result || 0,2));
}

//获取代理权限
function agentsRight(result){
    if(result.code == '10000'){
    	$("#agentscommerce").show();
    }
}
/**
 * 是否有新的系统通知
 */
function haveNewMessage(){
	$.ajax({
		//data:{"messageType":messageType},
		url:msonionUrl+"message/findSystemMessageCount?v_="+new Date().getTime(),
		type:"post",
		dataType:"json",
		success:function(result){
			if(result.errCode == 1){
                $("#noticeCategory").show();
			}  
		}
	}); 
}