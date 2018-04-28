$(function () {
    var params = jems.parsURL().params;
    var gettpl = $('#uexProcessData').html();
    if(params.sodRcFlg==1){
    	params.sodRcFlg = "原路退回";
    }else if(params.sodRcFlg==2){
    	params.sodRcFlg = "银行转账";
    }else{
    	params.sodRcFlg = "";
    }
    jetpl(gettpl).render(params, function (html) {
    	$(html).appendTo('#uexProcess');
    });
	var item = 1;
	var sodStat = params.sodStat;
	if(sodStat == 6){
		item = 2;
	}else if(sodStat == 3 || sodStat == 4){
		item = 3;
	}else if(sodStat == 2){
		item = 4;
	}else{
		item = 1;
	}
	$("#progress").children().each(function(k,v){
		if(k < item){
			$(v).addClass("on")
		}else{
			$(v).removeClass("on");
		}
	});
})