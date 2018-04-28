var params = jems.parsURL().params;
var sodId = params.id;
$(function () {
    if (sodId == null || sodId == "" || typeof(sodId) == undefined) {
        jems.tipMsg("返回上一步选择退货商品");
        return;
    }
    var reasonData = "";
	$.post( msonionUrl + "app/sodrest/getRefundReason", function (data) {
		var json = JSON.parse(data);
		reasonData = json.data;
	})
    $.ajax({
		type: "post",
		data: {"sodId": sodId},
		url: msonionUrl + "app/sodrest/findThSodById/v1",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4002 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} 
			if (10000 == result.errCode) {
				var sodReturnType=result.data.sodReturnType;
				var sodReturnType=result.data.sodReturnType;
				var sodStat = result.data.sodStat;
				var progressId = "";
				$("#sodAmt").html("&yen;" + jems.formatNum(result.data.sodAmt,2));
				if(result.data.sodUex == 0 && result.data.sodCcf == 0){
					$("#sodTariff").html("&yen;" + jems.formatNum(result.data.sodAmt,2));
				}else{
					$("#sodTariff").html("&yen;" + jems.formatNum(result.data.sodTariff,2));
				}
				$("#sodUex").html("&yen;" + jems.formatNum(result.data.sodUex,2));
				$("#sodCcf").html("&yen;" + jems.formatNum(result.data.sodCcf,2));
				$("#rcFlag").html(result.data.refundsMode);
				if(sodReturnType == 1 || sodReturnType ==4 || sodReturnType ==5){
					$("#progress1").show();
					$("#progress2").hide();
					progressId = "#progress1";
				}else if(sodReturnType == 2 || sodReturnType ==3){
					$("#progress2").show();
					$("#progress1").hide();
					progressId = "#progress2";
				}else{
					$("#progress1").hide();
					$("#progress2").hide();
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
					if(k < item){
						$(v).addClass("on")
					}else{
						$(v).removeClass("on");
					}
				});
				if(sodReturnType == 3){
//	            	$("#record").after("<div class=\"g3 bg-wh p10 f14  jepor flexbox left-arrow jecell-bottom\" id=\"goUexProess\" ><span class=\"show b\">寄回运费进度</span></div>");
	            	var  sodReturnUex= result.data.sodReturnUex || "0";
	            	var  sodItemPayNo= result.data.sodItemRecs[0].sodItemPayNo;
	            	var  sodItemPayBrank= result.data.sodItemRecs[0].sodItemPayBrank;
	            	var  sodItemPayName= result.data.sodItemRecs[0].sodItemPayName;
	            	var  expCom= result.data.sodItemRecs[0].expCom || "";
	            	var  sodItemExpressNo= result.data.sodItemRecs[0].sodItemExpressNo || "";
	            	var  sodRcFlg= result.data.sodRcFlg;
	            	if(sodItemExpressNo != ""){
	            		$("#goUexProess").show();
	            		var uexProessParms = "sodReturnType="+sodReturnType+"&sodStat="+sodStat+"&sodReturnUex="+sodReturnUex+"&sodItemPayNo="+sodItemPayNo +
	            		"&sodItemPayBrank="+sodItemPayBrank+"&sodItemPayName="+sodItemPayName+"&expCom="+expCom+"&sodItemExpressNo="+sodItemExpressNo +
	            		"&sodRcFlg="+sodRcFlg;
	            		$("#goUexProess").click(function(){
	            			jems.goUrl('order-service-freight.html?'+uexProessParms);
	            		})
	            	}
	            }else{
	            	$("#goUexProess").hide();
	            }
				result.reasonData = reasonData;
				var gettpl ;
				if(sodReturnType == 3){
					gettpl = $('#detailsData3').html();
				}else if(sodReturnType == 4){
					gettpl = $('#detailsData4').html();
				}else{
					gettpl = $('#detailsData2').html();
				}
	            jetpl(gettpl).render(result, function (html) {
	                $(html).appendTo('#details');
	            });
//	            $.each(result.data.sodItemRecs, function (k, v) {
//	            	rcNo = v.sodItemRcNo;
//		            $.each(reasonData, function (infoIndex, info) {
//	    				if (info.refundType == sodReturnType) {
//	    					temp = info.data[rcNo-1];
//	    					$("#reason"+k).html(temp.reason);
//	    				}
//	    			})
//	            })
	            
			} else{
				jems.tipMsg(result.errMsg);
			}
        },
        error: function (result) {
            jems.tipMsg("network error!");
        }
    });
	$("#record").on("tap",function(){
		jems.goUrl('../ucenter/order-service-record.html?sodId='+sodId);
	})
});
