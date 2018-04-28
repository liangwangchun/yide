$(function(){
	$.ajax({
		url:msonionUrl+"agentStoreOrder/getBatchOrder",
		type:"get",
		dataType:"json",
		success:function(result){
			var data = result.data;
			if (data == undefined || data.length == 0) {
				$("#orderall").html("<p class='p15 tc f14'>暂无订单信息！</p>");
			}
			else if(result.code == "4001"){
				 jems.goUrl("login.html?"+window.location.href);
			}
			var gethtml = document.getElementById('tpl').innerHTML
			jetpl(gethtml).render(result, function(html){
				document.getElementById('view').innerHTML = html
			});
		}
	})

})


/**分批支付
 * @param orderNo
 * @param amt
 */
function goPay(id){
	jems.goUrl("payment-buyagent.html?sodId="+id);
}










