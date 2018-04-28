/** 
@Js-name:order-all.js
@Zh-name:个人订单
 */
var dataobj = {};
$(function(){
	loadSodList();
	$("#ordersosBtn").on('tap',search);
	// 显示购物车数量
	jems.showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom:100});
});
/**
 * 载入订单列表
 */
var nowtime;
function loadSodList(){
	var params = jems.parsURL().params, sodStat = params.sodStat; 
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
			beforeSend:function(){
				$("#loading").show();
			},
			success:function(data){
				//data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
				if(data.total == 0){
					$("#orderall").html("<p class='p15 tc f14'>暂无订单信息！</p>");
					$("#loading").hide();
				}else{
					var gettpl = $('#orderallData').html();
					nowtime = data.nowTime;
					jetpl(gettpl).render(data, function(html) {
						$('#orderall').append(html);
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
					totalPage = data.totalPage;
					pageNum++;	
					loadFlg = true;	
					
					if(pageNum>totalPage){
						$("#loading").show().html('到底了,没有更多订单了');
					}else {
						setTimeout(function () {
							$("#loading").hide();
						}, 4000);
					}
				}
			}
		});
	}
}

/**
 * 订单搜所框事件
 */
function search(){
	var searchKey = $('#formalSearchTxt').val();
	if(searchKey){
		if(!jems.specialStr(searchKey)){
			jems.tipMsg("不能有非法字符");
		}else{
			// 添加关键字参数
		    dataobj.searchWords = $.trim(searchKey);
		}
	}else{
		delete dataobj.searchWords; 
	}
	$('#orderall').empty();
	loadSodList();
}

/**
 * 超时订单商品恢复购物车
 */
function reinstateCard(sodNo){
	if(undefined == sodNo || null == sodNo || '' == sodNo){
		jems.tipMsg("参数错误");
		return;
	}
    $.ajax({
        type:"post",
        data:{"sodNo":sodNo},
        url:msonionUrl+"app/sodrest/reinstateCard/v1",
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		mBox.open({
        			content:"<p class='tc listinfo f16' style='width:100%'>商品已加入购物车</p>",
        			closeBtn: [false,1],
        			btnName:['前往购物车', '关闭'],
        			btnStyle:["color: #0e90d2;","color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				jems.goUrl('cart.html');
        			} ,     
        			nofun : function(){
        				jems.goUrl('order-all.html');
        			}     
        		});
        	}else{
        		jems.tipMsg(result.errMsg);
        		return;
        	}
        }
    });
}
