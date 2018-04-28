/**
 * 商务管理
 * author:libz
 * 2017-04-24
 */
var ParHref = jems.parsURL( window.location.href );
var tmn = ParHref.params.tmn;			// 终端
$(function(){
	selectAgentState();
});  

/**
 * 获取商务管理统计数据
 */
function loadAgentCount(){
    var url = msonionUrl+"agentStore/mine";
    $.ajax({
        type : "get",
        url : url,
        dataType : "json",
        success:function(data){
        	var errCode = data.code;
        	if(errCode == '4001'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        	}else if(errCode == '4002'){
        		 jems.mboxMsgIndex("升级代理商后可以访问！");
        		 return;
        	}else if(errCode == '404'){
        		jems.mboxMsgIndex("数据未初始化");
       		 	return;
        	}  	
        	$('#usableMoney').text("￥"+(data.money.usableMoney|| 0));
        	$('#returnMoney').text("￥"+(data.money.returnMoney|| 0));
        	$('#openAgentQty').text(data.data.openAgentQty|| 0);
        	$('#agentId').text(data.data.agentId || 0);
            $('#agentCode').text(data.data.agentCode || 0);
            $('#totalTmnQty').text(data.data.totalTmnQty || 0);
            $('#openTmnQty').text(data.data.openTmnQty || 0);
            $('#closedTmnQty').text(data.data.closedTmnQty || 0);
            $('#freeTmnQty').text(data.data.freeTmnQty || 0);
//            $('#rollInQty').text(data.data.rollInQty || 0);
//            $('#rollOutQty').text(data.data.rollOutQty || 0);
        }
    });
}

/**查询代理商运营状态
 */
function selectAgentState(){
	$.ajax({
		type:"get",
		url:msonionUrl+"agentStore/suspendState",
		dataType:"json",
		success:function(data){
			if(data.errCode == "4001"){
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(data.errCode == "10011"){
				jems.mboxMsg("升级代理商后可以访问！");
			}else if(data.agentState == 0){
				loadAgentCount();//获取商务管理统计数据
			    jems.backStore(); //返回店主中心 
			}else{
				jems.mboxMsg("暂时无法审核店铺，如有疑问请联系洋葱发动机")
				$("#auditing").removeAttr("onclick");
				$("#buyStore").removeAttr("onclick");
			}
		}
	})
}
