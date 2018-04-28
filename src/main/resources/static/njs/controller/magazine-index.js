// JavaScript Document
var ParHref = jems.parsURL( window.location.href), store_name;
var store_name = "洋葱OMALL";
$(function(){
	jems.getShopTitle(ParHref.params.tmn);
	//首页导航菜单
	var menunav = $("#menunav li");
	var menusli = $("#menunav li").slice(3,7);
	menusli.hide();
	$("#menumore").on("tap",function(){
		if(menusli.is(':visible')){
			menusli.hide();
			$(this).text(">>");
		}else{
			menusli.show();
			$(this).text("<<");
		}
	});
	//首页杂志列表
	var pageNum = 1;
	var totalPage = 1;
	var loadFlg = true;
	$("#idxmagaz").tabView({
		ontabfun:function(elem, idx){
			magazListData(idx+1)
		}
	});
	$(window).dropload({afterDatafun: function(){
		magazListData(1);
	}});
	function magazListData(num){
		var magazList = $('#magazList'+num);
		if(magazList.attr("date-type") == "true") {
			$.ajax({
				type: "get",
				url: msonionUrl + "magazinedetail/listByType?tmn=" + ParHref.params.tmn + "&type=" + num,
				cache: true,
				dataType: "json",
				success: function (data) {
					jetpl('#magazData').render(data, function (html) {
						magazList.find("ul").html(html);
					});
					magazList.attr("date-type", "false");
					//图片延迟加载插件引用
					$('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
				}
			});
		}
	}
	function listData() {		
		if(pageNum>totalPage){ 
			return; 
		}
		loadFlg=false;
		$.ajax({
			type : "get",
			url : msonionUrl+"magazine/list?tmn="+ParHref.params.tmn+"&pageNo="+pageNum,
			cache:true,
			dataType : "json",
			//jsonp:"callback",
			success:function(data){
				//data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
				if(data.total == 0){				
					$("#indexList").html("<li class='mt10 tc red'>暂无数据！</li>");
				}else{
					jetpl('#magaztwoData').render(data, function(html){
						$('#magaztwoList').append(html);
					});  
					totalPage = data.totalPage;
					pageNum++;	
					//图片延迟加载插件引用
					$('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
				}
				loadFlg = true;			
			}
		});
	}
	// 滚动图片
	$.ajax({
		type:"get",
		url : msonionUrl+"adverimg",
		data: {"tmn":ParHref.params.tmn,"imgType":5},
		dataType : "json",
		success:function(json){
			var gettpl = $('#scrollImgData').html();
			var jsdata = {data:json}
			jetpl(gettpl).render(jsdata, function(html){
				$('#scrollimg').html(html);
			});
			// 图片滚动
			jeSlide({ 
				slideCell:"#idxfocus",
				titCell:".hd ul", 
				mainCell:".bd ul", 
				effect:"leftLoop", 
				switchCell:".datapic",
				switchLoad:"data-pic",
				autoPage:true,//自动分页
				autoPlay:$('#idxfocus .bd li').length>1 ? true:false  //自动播放
			});
		}
	});
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom: 70});
    // 显示购物车数量
	jems.showCartNum();
	
});



