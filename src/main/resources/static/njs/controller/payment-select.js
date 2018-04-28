/**创建订单
 * @param road 付款方式
 */
function pay(road){
	var url = msonionUrl+"agentStoreOrder/createBatchOrder";
	if(road == 0){
		$.ajax({
			url:url,
			type:"POST",
			data:{road:"fiveCardStud"},
			dataType:"json",
			success:function(data){
				
			}
		})
		jems.goUrl("payment-buyagent.html")
	}else if(road == 1){
		$.ajax({
			url:url,
			type:"POST",
			data:{road:"batch"},
			dataType:"json",
			success:function(data){
				
			}
		})
		jems.goUrl("payment-select-detail.html")
	}
}
