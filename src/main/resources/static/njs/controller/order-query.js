/***
 * 查询Excel
 * @author libz
 */
/** ParHref-url参数，tmn-店铺tmn **/
var ParHref = jems.parsURL(), tmn = "";
var params = ParHref.params;
tmn=params.tmn;
$(function(){
	
});

/**
 * 获取Excel数据
 * @returns
 */
function queryData(){
	$('#sodList').html("");
	$('#noData').hide();
    var url = msonionUrl+"excel/getApcesBySodNo/v1";
    var sodNo = $("#sodNo").val();
    sodNo = sodNo.trim();
    if(undefined == sodNo || '' == sodNo){
    	jems.tipMsg("请填写WMS、AMS、IMS开头的订单号");
		return;
    }
    if(sodNo.substring(0,3) != 'WMS' && sodNo.substring(0,3) != 'AMS' && sodNo.substring(0,3) != 'IMS'){
    	jems.tipMsg("请填写正确的WMS、AMS、IMS开头的订单号");
    	return;
    }
    $('#waitingData').show();
    $.ajax({
        type:"get",
        data:{"sodNo":sodNo},
        url:url,
        dataType:"json",
        success:function(result){
			$('#waitingData').hide();
        	if(10000 == result.errCode){
        		if(undefined == result.data || result.data.length <= 0){
        			$("#descTest").show().text("抱歉！没有您的订单号，请您确认输入是否正确或是否符合查询范围。如属于符合范围订单未有结果，请根据首页下方提示操作反馈，谢谢您的配合！");
        			$("#describe").hide();
        			return;
        		}else{
        			var gettpl = $('#sodListData').html();
            		var datas = {data:result.data};
            		if(undefined == datas || datas.length <= 0){
            			$("#noData").show();
            		}else{
            			$("#describe").show();
            			jetpl(gettpl).render(datas, function(html){
                			$("#descTest").hide();
    						$("#noData").hide();	
    						$('#sodList').html("").html(html);
    					});
            		}
        		}
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}
