/** 
@Js-name:order-payment.js
@Zh-name:个人订单
 */
var dataobj = {};
$(function(){
	loadSodList();
	// 显示购物车数量
	jems.showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom:100});
});
/**
 * 载入订单列表
 */
function loadSodList(){
	var url = window.location.href;
	var params =  jems.parsURL(url).params; 
	var  sodStat = params.sodStat; 
	//var pageNum = 1;
	//lowadData();
	var pageNum = 1;
	var totalPage = 1;
	var loadFlg = true;
	// 取消之前绑定的滚动事件，载入数据时重新绑定
	$(window).off("scroll");
	$(window).dropload({afterDatafun: lowadData});
	function lowadData(){	
		//if(pageNum > totalPage){ return; }
		if(!loadFlg)return false;
		if(pageNum>totalPage){
			$("#loadaimbox i").css({display: 'none'});
			$("#loadaimbox em").text('到底了,没有更多订单了');			
			return; 
		}
		loadFlg=false;
		params.pageNo = pageNum;
		params.iDisplayLength = 10;
		$.extend(params,dataobj);
		$.ajax({
			type : "post",
			data : params,
			url : msonionUrl+"sodrest/sodList",
			dataType : "json",
			asyn:false,
			success:function(json){ 
				//json.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
				if(json.data == 0 && pageNum == 1){
					$("#orderpayment").html("<p class='p15 mt20 tc g9 f14'>╯▂╰ 暂无订单需要付款</p>");
					return;
				}
				if(json.data == 0 && pageNum>1){
                    $("#loadaimbox i").css({display: 'none'});
                    $("#loadaimbox em").text('到底了,没有更多订单了');
                    return;
				} else{
					var gettpl = $('#orderpaymentData').html(); 
					jetpl(gettpl).render(json, function(html) {  
						$('#orderpayment').append(html);
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
					loadFlg = true;	
					//限制收货人字数
					$(".consignee").each(function() {
						var maxwidth = 6;
						if ($(this).text().length > maxwidth) {
							$(this).text($(this).text().substring(0, maxwidth));
							$(this).html($(this).html() + '…');
						}
					});
				}
			}
		});
	}
}

function ordertoPay(sid,isGroup,endtime){
	$.ajax({
		type : "get",
		data : {"sodId":sid},
		url : msonionUrl+"sodrest/checkTimeout",
		dataType : "json",
		asyn:false,
		success:function(data){
			if (data == 1){
				mBox.open({
					content: "<div class='jew100 tc'>交易超时</div>",
					btnName: ['确定'],
					btnStyle:["color: #0e90d2;"],
					maskClose:false,
					yesfun : function(){ window.location.reload();}
				});
				return;
			} else {
				//jems.goUrl(mspaths+'payment.html?sodId='+sid);0328
				if(isGroup == 1){//团购订单
					if(endtime!=null){
						var endTime = new Date(endtime);
						var date = new Date();//当前时间
						if(date>endTime){
							jems.mboxMsg("团结已结束!");
							return;
						}else{
							jems.goUrl('../payment.html?sodId='+sid+"&t="+Math.random());
						}
					}
				}
				else{
	                jems.goUrl('../payment.html?sodId='+sid);
				}
			}
		}
	});
}