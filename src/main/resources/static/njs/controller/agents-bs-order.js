/**
 * 订单列表
 * author:libz
 * 2017-04-24
 */
var ParHref = jems.parsURL( window.location.href );
var tmn = ParHref.params.tmn;// 终端
var pageNum = 1;
var totalPage = 1;
var loadFlg = true;
$(function(){
	//订单列表
	$(window).dropload({afterDatafun: appylistData});
    jems.backStore(); //返回店主中心 
});  
/**
 * 订单列表
 */
function appylistData() {
	var url = msonionUrl+"agentStoreOrder/queryOrders";
	$.ajax({
		type:"get",
		url: url,
		data:{"pageNo":pageNum},
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

