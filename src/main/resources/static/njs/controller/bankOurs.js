/***
 * 我的银行卡列表
 * @author libz
 */
/** ParHref-url参数，tmn-店铺tmn **/
var ParHref = jems.parsURL(), tmn = "",sodId="";
var params = ParHref.params;
tmn=params.tmn;
$(function(){
	sodId = params.sodId;
	$("#supportBank").on("click",function () {
        mBox.open({
            title: ['支持银行', 'color:#333;font-size:1.5rem;text-align:center;'],
            width: "90%",
            height: "50%",
            content: $("#selectbankView")[0],
            // closeBtn: [true, 1],
            btnName: ['知道了'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false,
            success:function () {
            }
        });
    });
	/** 获取银行卡列表 **/
	getCardList();
});

/**
 * 获取银行卡列表
 */
function getCardList(){
    var url = msonionUrl+"bankCard/getBankCardByMemberId/v1";
    $.ajax({
        type:"post",
        url:url,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		var gettpl = $('#cardListData').html();
        		var datas = {data:result.data};
                jetpl(gettpl).render(datas, function(html){
                    $('#cardList').append(html);
                });
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}

/**
 * 选择支付银行卡支付跳转
 * @param bindId 绑定ID
 */
function bankSelectPay(bindId){
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
 * 去到添加银行卡页面
 */
function goToAddBankCard(){
	var localUrl = window.location.href;
	var locCard = 'add-card.html?'+localUrl
	jems.goUrl(locCard);
}
