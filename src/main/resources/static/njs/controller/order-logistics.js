/** 
@Js-name:order-logistics.js
@Zh-name:国际物流订单
 */
var dataobj = {};
$(function(){
	loadSodList();
	// 显示购物车数量
	jems.showCartNum();
	$("#mytips").html(cartoedertip);
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
			url : msonionUrl+"sodrest/sodListInLogist?sodStat="+sodStat+"&sodType=1",
			dataType : "json",
			asyn:false,
			success:function(json){
				if(json.data == 0){ 
					$("#orderlogist").html("<p class='p15 tc mt20 g9 f14'>╯▂╰ 暂无物流信息！</p>");
					return;
				}else{
					jetpl('#orderlogistData').render(json, function(html) {
						$('#orderlogist').append(html); 
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
				    $(".consignee").each(function(){
						var maxwidth=6;
						if($(this).text().length>maxwidth){
							$(this).text($(this).text().substring(0,maxwidth));
							$(this).html($(this).html()+'…');
						}
				    });
				}

			}
		});
	}
}

/**
 * 确认收货
 * @param id
 */
function sureOrder(id){
	if (id == null || id == "" || typeof(id) == undefined){
		jems.mboxMsg("获取订单失败，请刷新");
		return ;
	}
	mBox.open({
		width:"80%",
		content:"<p class='f14' style='width:100%;'><span class='red'>请慎点！</span>确认收货之后将不能再申请退款，请确保您购买的商品已全部收到并确认无任何破损。</p>",
		closeBtn: [false,1],
		btnName: ['确定','取消'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			$.ajax({
				type : "post",
				data : {"sodId":id},
				url : msonionUrl+"sodrest/comfirmReceipt",
				dataType : "json",
				asyn:false,
				success:function(data){
					if(data.errCode > 0){
						window.location.reload();
					}else{
						jems.mboxMsg("确认失败，");
					}
				},
				error:function(){
					jems.mboxMsg("network error!");
				}
			});
		}
	});
}

function shareMoreFriends(sodGroupParent,groupId){	
	$.ajax({
		type : "post",
		data : {"sodGroupParent":sodGroupParent,"groupId":groupId},
		url : msonionUrl+"sodgroup/shareSodGroup",
		dataType : "json",
		asyn:false,
		success:function(result){
			if(10000 == result.errCode){
				var url = msonionUrl+"wx/group-fight-groups.html?id="+groupId+"&sodGroupId="+result.data.sodGroupId;
				jems.goUrl(url);
			}else{
				jems.tipMsg(result.errMsg);
			}
		},
		error:function(){
	       jems.tipMsg("network error!");
	    }
	});	
}