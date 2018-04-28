var ParHref = jems.parsURL(), messageFlag = 0, tmn = "", id = "",level="",sodGroupId="";
var params = ParHref.params;
$(function(){
	tmn=params.tmn, id = params.id, level = params.level, sodGroupId = params.sodGroupId;
	if (typeof(level) == undefined || level == null || level =="" || level == "undefined" ){
		level = 0;
	}
	if (typeof(sodGroupId) == undefined || sodGroupId == null || sodGroupId =="" || sodGroupId == "undefined" ){
		sodGroupId = 0;
	}
	$.ajax({
		type : "post",
		data : {"groupId":id,"tmn":tmn},
		url : msonionUrl+"sodgroup/confirmOrder/v1?t="+new Date().getTime(),
		dataType: "json",
		asyn:false,
		success:function(result){
			errCode = ""+ result.errCode;
			errMsg = result.errMsg;
			if (errCode == "10010"){
				tip("参数有误", "group-index.html");
				return ;
			} else if (errCode.indexOf("40") == 0){
				jems.goUrl("login.html?"+window.location.href);
				return ;
			} else if (errCode == "5006"){
				tip("未设置收货地址", "ucenter/addres-add.html");
                return;
			}else if (errCode == "3201"){
				tip("商品已下架", "group-index.html");
                return;
			}
			if(2 == result.data.memberType){
				tip("对不起，洋葱商家无法使用本功能", "store/stores.html");
				return;
			}
			var groupInfo = result.data.groupRec;
			var address = result.data.addressRec;
			$("#totalCount").html("&yen;"+ jems.formatNum(groupInfo.groupPrice));
			$("#addressUser").html(address.addressUser);
			$("#address_mobile").html(address.addressMobile);
			$("#address_detail").html(address.provinceAreaRec.areaName+address.cityAreaRec.areaName+address.regionAreaRec.areaName+address.addressNo);
			$("#addressUser").html(address.addressUser);
			$("#groupName").html(groupInfo.name);
			$("#groupPrice").html("&yen;"+ jems.formatNum(groupInfo.groupPrice));
			$("#mainPicUrl").attr('src',msPicPath+groupInfo.product.mainPicUrl);
			$("#addressId").val(address.addressId);
			$("#addressUserCid").val(address.addressUserCid);
			$("#memberTmnId").val(address.addressMember.memberTmnId);
			if(errCode != "10000"){
				$("#tipText").text(result.errMsg);
				$(".newStore").show();
			}
            
		},
		error:function(data){
			jems.mboxMsg("network error!");
		}
	});
});
//点击去到团购商品详情页面
function goToGroupDetails(){
	jems.goUrl('group-details.html?id='+id)
//	jems.goUrl('group-details.html?id='+id+"&tmn="+tmn+'&msToken='+msToken+'&client='+client+'&uid='+uid)
}
//点击去到订单地址页面
function goToSodAddress(){
	jems.goUrl('ucenter/addres-order.html?'+window.location.href);
}

//提交生成订单
function submitOrder(){
	if(errCode != "10000"){
		jems.mboxMsg(errMsg);
		return ;
	}
	var addressId  =$("#addressId").val();
	var addressUserCid  =$("#addressUserCid").val();
	var addressUser  =$("#addressUser").text();
	if (addressId == null || addressId == "" || typeof(addressId) == undefined){
		jems.tipMsg("先设置收货地址");
		return ;
	}
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	var isDigit = /[\u4e00-\u9fa5]/;
	var numberReg = /[0-9]+?/;
	if (addressUser == "" || numberReg.test(addressUser)) {
		jems.tipMsg("收货人姓名无效!");
		return ;
	}
	if (typeof(addressUserCid) == undefined || addressUserCid == null || addressUserCid =="" || addressUserCid == "undefined" ){
		jems.tipMsg("收货地址身份证号码为空，点击收货地址重新编辑");
		return  ;
	}

	if (isDigit.test(addressUserCid)) {
		jems.tipMsg("身份证号码不能含有中文!");
		return ;
	}
	if (!reg.test(addressUserCid)) {
		jems.tipMsg("请输入正确身份证号码.");
		return ;
	}
	if (tmn == 1 || tmn == "undefined"){
		tmn = $("#memberTmnId").val();
	}
	$.ajax({
		type: "post",
		data: {
			"groupId": id,
			"tmn": tmn, 
			"addressId": addressId,
			"groupType": 0,
			"level":level == 0 ? 0:1,
			"sodGroupId":sodGroupId,
			"client":'WEB',
		},
		url: msonionUrl + "sodgroup/createSod",
		dataType: "json",
		success: function (resilt) {
			$(".loading").hide();
//			submit_flag = true;
			var errCode = resilt.errCode;
			var errMsg = resilt.errMsg;
			if(10000 == errCode){
				var Waits = mBox.open({
					boxtype: 3,
					conStyle: 'text-align:center;',
					maskColor:"rgba(0,0,0,0.8)",
					time: 0,
					content: '<div class="jemboxloadspin"><div class="jemboxloading"></div></div><p style="line-height:20px;">正在创建订单</p>',
					success:function () {
						orderWaiting(resilt.sodNo,Waits);
					}
				});
				return;
			}else if (4001 == errCode) {
				jems.goUrl("login.html?" + window.location.href);
				return;
			}else if(3202 == errCode){
				jems.mboxMsg("手慢了，商品已抢光");
				return;
			}else if(3206 == errCode){
				mBox.open({
					width:"80%",
					content:"<p class='tc listinfo f16' style='width:100%'>您已参团，请确认!</p>",
					closeBtn: [false,1],
					btnName:['访问团购首页', '会员中心'],
					btnStyle:["color: #0e90d2;","color: #0e90d2;"],
					maskClose:false,
					yesfun : function(){
						jems.goUrl('group-index.html');
//						jems.goUrl('group-index.html?tmn='+tmn+'&msToken='+msToken+'&client='+client+'&uid='+uid);
					} ,     
					nofun : function(){
						jems.goUrl('ucenter/members.html');
					}     
				});
			}else{
				jems.mboxMsg(errMsg);
				return;
			}
		},
		error: function () {
			$("#submitOrder").show();
			jems.tipMsg("network error!");
		}
	});
}
//返回订单信息
function orderWaiting(sodNo,mid) {
	var num = 0 ,time;
	var resultType = {
			ok:"ok",
			error:"error",
			timeout:"timeout",
			waitting:"waitting"
	}
	var startRun = function (){
		$.ajax({
			type: "post",
			url : msonionUrl+"sodrest/findSodStaByNo",//等待生成
			data: {"sodNo":sodNo},
			success: function(json){
				var data = eval("("+json+")");
				noresult();
				if(data.result == resultType.ok)
				{
					//alert("订单生成成功！");
					jems.goUrl("payment.html?sodId="+data.sodId)
					return ;
				}else if(data.result ==resultType.error){
					jems.mboxMsg("发生错误");
					return ;
				}
			}
		});
		time = setTimeout(startRun, 1000);
	}
	function stopRun(){
		clearTimeout(time);
	}
	function noresult(){
		num++;
		if(num>4){
			stopRun();
			mBox.close(mid);
			mBox.open({
				width: "70%",
				//height: 100, 
				content: "<p class='tc listinfo f16' style='width:100%'>系统繁忙，请稍后尝试...</p>",
				closeBtn: [false, 1],
				btnName: ['确定'],
				btnStyle: ["color: #0e90d2;"],
				maskClose: false,
				yesfun : function(){
					jems.goUrl("ucenter/members.html");
				}
			});
			return;
		}
	}
	if(sodNo != '' || sodNo != 'undefined' || sodNo != null){
		startRun();
	}else{
		jems.mboxMsg("发生错误");
		jems.goUrl("ucenter/members.html");
		return ;
	}
}
function tip(msg,url){
	  mBox.open({
        width:"80%",
        content:"<p class='tc f16' style='width:100%'>"+msg+"</p>",
        closeBtn: [false],
        btnName:['确定'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun : function(){
            jems.goUrl(url);//"ucenter/addres-add.html?"+window.location.href
        }
    });
}