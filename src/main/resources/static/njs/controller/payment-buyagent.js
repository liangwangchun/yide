var tmn  = "";
var sodId = "";
$(function(){
	tmn = jems.parsURL( window.location.href ).params.tmn;
	sodId = jems.parsURL( window.location.href ).params.sodId;
	 loadingData();
});

function loadingData(){
	var url = "";
	if(sodId != undefined && sodId!=null && sodId!=""){
		url = msonionUrl+"agentStoreOrder/getAgentPayOrderById";
		
	}else{
		url = msonionUrl+"agentStoreOrder/getAgentPayOrder";
	}
	$.ajax({
        type : "post",
        data : {"sodId":sodId},
        url : url,
        dataType : "json",
        async:false,
		success:function(data){
			$("#prvice").text(data.data.amt);
        	var errCode = data.code;
        	if(errCode == '4001'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        	}else if(errCode == '-1'){
        		 jems.mboxMsgIndex(data.msg);
        		 return;
        	}
			var gettpl = $('#myOrderData').html();
			jetpl(gettpl).render(data, function(html) {
				$('#myOrderlist').append(html);
			});
		},
		error:function(data){
			jems.tipMsg("network error!");
		}
	});
}


function wxpayEntrance(){
	$("#payEntranceForm").submit();
}
/**
 * 通联微信公众号支付
 */
function unionWxPay_union(){
	var orderId = $("#orderId").val();
	if(undefined == orderId || null == orderId || '' == orderId){
		jems.tipMsg("支付参数有误，请重新发起支付");
		return;
	}
	$.ajax({
		type : "post",
		data: {"tmn":tmn},
		url : msonionUrl+"agentStoreOrder/toWxPay/v1",
		dataType : "json",
		success:function(result){
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

/**
 * 通联快捷支付
 * @returns
 */
function unionQuickSubmitOrder(){
	var sodId = $("#orderId").val();
	if (sodId == "" || sodId == null || sodId == "undefined") {
		jems.tipMsg("系统出错，返回刷新!");
		return "";
	}
	$.ajax({
		type : "post",
		data: {"sodId":sodId,"tmn":tmn},
		url : msonionUrl+"agentStoreOrder/submitOrder/v1",
		dataType : "json",
		async:false,
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