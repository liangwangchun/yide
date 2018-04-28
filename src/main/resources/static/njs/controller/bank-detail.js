/***
 * 选择银行卡列表
 * @author libz
 */
/** ParHref-url参数，tmn-店铺tmn **/
var ParHref = jems.parsURL(), tmn = "",bindId="";
var params = ParHref.params;
tmn=params.tmn;
$(function(){
	bindId = params.bindId;
	getBankInfo();
});

/**
 * 获取银行卡列表
 */
function getBankInfo(){
    var url = msonionUrl+"bankCard/queryOrderInfoByBindId/v1";
    $.ajax({
        type:"post",
        data:{"bindId":bindId},
        url:url,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode && (result.data != null && result.data != undefined)){
        		var bank = result.data;
        		$("#bankCode").attr("src","http://img.51msyc.com/wx/nimages/bankicon/"+bank.bankCode+".png");
        		var carTypeName = bank.cardType==101?"储蓄卡":"信用卡";
        		$("#bankName").text(bank.bankName+carTypeName);
        		var cardNo = bank.cardNo.substring(bank.cardNo.length,bank.cardNo.length - 4);
        		$("#cardNo").text(cardNo);
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}

/**
 * 解除绑定
 */
function removeBind(){
	var url = msonionUrl+"bankCard/removeBinding/v1";
    $.ajax({
        type:"post",
        data:{"bindId":bindId},
        url:url,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		//jems.mboxMsg("解绑成功!");
        		mBox.open({
        			//width:"80%",
        			content:"解绑成功",
        			closeBtn: [false],
        			btnName:['确定'],
        			btnStyle:["color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				jems.goUrl('bank-ours.html');
        			}
        		});
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}
