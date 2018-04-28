/**
 * 服务商返款列表
 */
var ParHref = jems.parsURL( window.location.href );
var tmn = ParHref.params.tmn;// 终端
var state = ParHref.params.state;//返款状态
var pageNum = 1;
var totalPage = 1;
var loadFlg = true;
$(function(){
	//订单列表
	if(state == 1){
		$(".mstitle").text("可返金额详情");
	}else if(state == 2){
		$(".mstitle").text("已返金额详情");
	}
	$(window).dropload({afterDatafun: queryCashback});
    jems.backStore(); //返回店主中心 
});  

function queryCashback() {
	var url = msonionUrl+"agentStore/queryCashback";
	$.ajax({
		type:"get",
		url: url,
		data:{"pageNo":pageNum,"state":state},
		dataType:"json",
		beforeSend:function(){
			$("#loading").show();
		},
		success:function(data){
			var errCode = data.errCode;
        	if(errCode == '4001'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        		return;
        	}else if(errCode=='4002'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        		return;
        	}
			var datas = {data:data.data};
        	var gettpl = $('#auditData').html();
            jetpl(gettpl).render(datas, function(html){
            			$('#auditList').append(html);
            });
			totalPage = data.totalPage;
			pageNum++;
			if(pageNum>totalPage){
				$("#loading").show().html('到底了,没有更多了');
			}else {
				setTimeout(function () {
					$("#loading").hide();
				}, 4000);
			}
			loadFlg = true;
		}
	});
};
