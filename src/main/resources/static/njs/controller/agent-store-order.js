$(function(){
	checkLogin();
	$('article p[type="button"]').on('click',submitOrder);
}); 
function submitOrder(){
	var buyVal = '';
	$('article p input[type="radio"]').each(function(i,obj){
		if($(obj)[0].checked  == true){ 
			buyVal = $(obj).val();
		}
	});
	$.ajax({
        type: "post",
        data:{"buyVal":buyVal},
        url: msonionUrl + "agentStoreOrder/createOrder",
        dataType: "json",
        success: function(data) {
        	if(data.code == '4001'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        		return;
        	}else if(data.code == '4002'){
        		jems.tipMsg("您没有权限操作此功能");
        		return;
        	}
        	jems.goUrl('../payment-buyshop.html?id='+data.orderId)
        },
        error:function(){
            jems.mboxMsg("网络不好，请稍后再试！");
        }
    });
}
function checkLogin(){
	$.ajax({
		type: "get",
		dataType: "json",
		url: msonionUrl + "agentStoreOrder/checkLogin",
		success: function(data){
			if(data == null){
				return;
			}
			else if(data.code == '4001'){
				jems.goUrl(mspaths+"login.html?"+window.location.href);
        		return;
			}else if(data.code == '4002'){
				jems.goUrl(mspaths+"login.html?"+window.location.href);
				return;
			}
		}
	})
}