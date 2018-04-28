$(function () {
    var params = jems.parsURL().params;
    var sodId = params.id;
    if (sodId == null || sodId == "" || typeof(sodId) == undefined) {
        jems.tipMsg("返回上一步选择退货商品");
        return;
    }
    $.ajax({
		type: "post",
		data: {"sodId": sodId},
		url: msonionUrl + "sodrest/findSodById/v2",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4001 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} 
			if (10000 == result.errCode) {
				var sodReturnType=result.data.sodReturnType;
				var sodStat = result.data.sodStat;
				var progressId = "";
				if(sodReturnType == 1 || sodReturnType ==4 || sodReturnType ==5){
					$("#progress1").show();
					$("#progress2").hide();
					progressId = "#progress1";
				}
				if(sodReturnType == 2 || sodReturnType ==3){
					$("#progress2").show();
					$("#progress1").hide();
					progressId = "#progress2";
				}
				
				var item = 1;
				if(sodStat == 6){
					item = 2;
				}else if(sodStat == 3 || sodStat == 4){
					item = 3;
				}else if(sodStat == 2){
					item = 4;
				}else{
					item = 1;
				}
				
				$(progressId).children().each(function(k,v){
					console.info(k);
					if(k < item){
						$(v).addClass("on")
					}else{
						$(v).removeClass("on");
					}
				});
				var gettpl = $('#thSodDate').html();
	            jetpl(gettpl).render(result, function (html) {
	                $(html).appendTo('#goodsList');
	            });
			} else{
				jems.tipMsg(result.errMsg);
			}
        },
        error: function (result) {
            jems.tipMsg("network error!");
        }
    });
});

