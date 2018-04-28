/** 
@Js-name:order-refund.js
@Zh-name:退货订单
*/
var params = jems.parsURL(window.location.href).params;
var tmn = params.tmn;
$(function(){
	var pageNum = 1;
    var totalPage = 1;
	$(window).dropload({afterDatafun: lowadData});
	function lowadData(){
		if(pageNum > totalPage){ return; }
		$.ajax({
			type : "post",
			data : {"pageNo":pageNum},
			url : msonionUrl+"sodrest/thSodList",
			dataType : "json",
			asyn:false,
			success:function(json){
				if(json.data == ""){
					$("#orderrefund").html("<p class='p15 mt20 tc g9 f14'>╯▂╰ 暂无订单信息！</p>");
				}else{
					var gettpl = $('#orderrefundData').html();
					jetpl(gettpl).render(json, function(html) {
						$('#orderrefund').append(html);
					});
                    $(".sodyusu").on("tap",function () {
                        var hli = $(this).parent("li").find(".sodhide");
                        if(hli.css("display") == "none"){
                            hli.css({display:""});
                            $(this).find("span").addClass("actcurr");
                            $(this).find("span ins").text("隐藏");
                        }else {
                            hli.css({display:"none"});
                            $(this).find("span").removeClass("actcurr");
                            $(this).find("span ins").text("显示");
                        }
                    });
					totalPage = json.totalPage;
					pageNum++;
				}

			}
		});
	}
	// 显示购物车数量
	jems.showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom:100});
});
function writeExpress(sodId){
	jems.goUrl('../ucenter/write-express.html?id='+sodId);
}
function cancelRefund(sodId,fromId){
	$.ajax({
		type : "post",
		data : {"id":sodId,"fromId":fromId},
		url : msonionUrl+"app/sodrest/cancelRefund/v1",
		dataType : "json",
		asyn:false,
		success:function(json){
			if(json == ""){
				jems.mboxMsg("network error!");
			}else{
				if(json.errCode == 10000){
					messageBox("取消退款成功",sodId,tmn);
				}else if(json.errCode == 5142){
					messageBox("该订单无法取消退款",sodId,tmn);
				}else{
					messageBox("取消退款失败",sodId,tmn);
				}
			}

		}
	});
}
function messageBox(msg,sodId,tmn){
	mBox.open({
	    content: msg,
	    btnName: ['确认'],
	    maskClose: false,
	    yesfun: function(){
	    	jems.goUrl("../ucenter/order-refund1.html?sodId="+sodId+"&tmn="+tmn);
	    }, nofun: function(){
	    }
	});
}