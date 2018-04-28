//JavaScript Document
var ParHref = jems.parsURL();
var params = ParHref.params;
var tmn = params.tmn, keywords = params.keywords, maxamt = params.maxamt;
var spriceOrder = 0,pageNum = 1;
var totalPage = 1;
var loadown = true;
var title, brandIds,menuIds,countryIds,minamt;
$(function(){
	if (params.keywords == undefined || params.keywords == ""){
		keywords = sessionStorage.keywords == undefined?"":decodeURI(decodeURI(sessionStorage.keywords)) ;
	}  else {
		keywords = decodeURI(decodeURI(keywords)) ;
	}
	
	$(".menuTabs ul li").on("tap",function(){
		var index = $(this).index();
		if(index == 1){
			// jems.goUrl('foreign-select.html?keywords='+keywords);
            jems.goUrl('search-magazinelist.html?keywords='+keywords);
		}else{
			jems.goUrl('search-list-new.html?keywords='+keywords);
		}
	})
	
	//产品列表数据加载
	$(window).dropload({afterDatafun: listData});
	if(maxamt){
		title = "金额小于"+maxamt+"元的商品"
		$('title').text(title);
		$("#formalSearchTxt").val(keywords != undefined ?keywords:decodeURI(decodeURI("金额小于"+maxamt+"元的商品")));
	}else{
		$('title').text("搜索商品列表");
		keywords = keywords == undefined ?"":keywords;
		$("#formalSearchTxt").val(decodeURI(decodeURI(keywords)));
	}
	maxamt = sessionStorage.maxamt != undefined ?sessionStorage.maxamt:params.maxamt != undefined ? params.maxamt:0;
	minamt = minamt != undefined ?minamt:sessionStorage.minamt == "undefined" ?0:sessionStorage.minamt == undefined ?0:sessionStorage.minamt;
//	maxamt = maxamt != undefined ?maxamt:sessionStorage.maxamt == "undefined" ?0:sessionStorage.maxamt == undefined ?0:sessionStorage.maxamt;
	$("#minprice").val(minamt);
	$("#maxprice").val(maxamt);
	function listData() {
		if(pageNum > totalPage){
			$("#loading").show().html('到底了,没有更多商品了');
			return ;
		}
		$.ajax({
			type:"POST",
			url: msonionUrl+"product/search/v1",
			data:{
				"goodsName":keywords,
				"tmn":tmn,
				"brandIds":sessionStorage.brandIds,
				"menuIds":sessionStorage.menuIds,
				"countryIds":sessionStorage.countryIds,
				"minTaxamt": minamt != undefined ?minamt:sessionStorage.minamt == "undefined" ?0:sessionStorage.minamt == undefined ?0:sessionStorage.minamt,
				"maxTaxamt": maxamt,
				"spriceOrder":spriceOrder,
				"pageNo":pageNum
				},
			dataType:"json",
			beforeSend:function(){
				$("#loading").show();
			},
			success:function(data){
				if (pageNum == 1) {
					searchCatalog();
				}
				if(data.total == 0 || data.totalPage == 0){
					$("#goodsList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
					$("#loading").hide();
				}else{
					var gettpl = $('#godslistData').html();
					jetpl(gettpl).render(data, function(html){
						$('#goodsList').append(html);
					});
                    //页面跳转
                    $("#goodsList li").on("tap",function () {
                        jems.goShow($(this).attr("data-id"),$(this).attr("data-type"))
                    });
					totalPage = data.totalPage
					pageNum++;	
					//图片延迟加载插件引用
					$('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
					$("#loading").hide();
				}
			}
		});
	};



	/**
	 * 点击商品搜索
	 */
	$("#searchBtn").on('tap',function(){
		$(".navsocon").hide();
		$("#navsomask").hide();
		$(".navsobar li").removeClass("on");
		var sosVal = $("#formalSearchTxt").val();
		if(sosVal == "" || title == sosVal) {
			jems.tipMsg("关键字不能为空");
		}else {
			if (!jems.specialStr(sosVal)) {
				jems.tipMsg("不能有非法字符");
			} else {
				loadown = true;
				pageNum = 1;
				sessionStorage.menuIds = "",
				sessionStorage.brandIds = "",
				sessionStorage.countryIds = "";
				sessionStorage.keywords = sosVal;	
				sessionStorage.maxamt = 0;
				sessionStorage.minamt = 0;
				jems.goUrl("search-list-new.html");
				return;
			}
		}
	});
	//显示购物车数量
	jems.showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom: 40});	
});

/**
 * 分类/国家/品牌查询
 */
function searchCatalog(){
	var sosVal = $("#formalSearchTxt").val();
	var data = {"goodsName":keywords,"maxTaxamt":params.maxamt != undefined ? params.maxamt:sessionStorage.maxamt};
	$.ajax({
		type:"POST",
		url: msonionUrl+"product/searchCatalog/v1",
		data:data,
		dataType:"json",
		beforeSend:function(){
			$("#loading").show();
		},
		success:function(result){
			$("#loading").hide();
			var errorCode = result.errCode;
			if (errorCode == 10000) {
				//国家列表
				var countries = {data:result.data.country};
				var gettpl = $('#countriesData').html();
				jetpl(gettpl).render(countries, function(html){
					$('#countries').html(html);
				});  
				//分类列表
				var countries = {data:result.data.menu};
				var gettpl = $('#classIfIcationData').html();
				jetpl(gettpl).render(countries, function(html){
					$('#classIfIcation').html(html);
				});  
				//品牌 列表
				var countries = {data:result.data.brand};
				var gettpl = $('#brandData').html();
				jetpl(gettpl).render(countries, function(html){
					$('#brand').html(html);
				});
				topNavFilter();
			}
			
		}
	});
}

/**
 * 头部筛选过滤
 */
function topNavFilter() {
	var navbli = $(".navsobar li"), navcon = $(".navsocon");
	navbli.on("tap",function () {
		var that = $(this), idx = that.index();
		$("#navsomask").show();
		navbli.removeClass("on");
		that.addClass("on");
		navcon.show().find("section").removeClass("on");
		$("#socon0"+(idx+1)).addClass("on");
	});
	$("#navreset").on("tap",function () {//重置
		$(".navsocon section li").removeClass("curr");
		sessionStorage.menuIds =  "";   
		sessionStorage.brandIds =  "";   
		sessionStorage.countryIds = "" ;   
		sessionStorage.minamt =0;
		sessionStorage.maxamt = 0;
		$("#minprice").val(0);
		$("#maxprice").val(0);
	});
	$(".navsocon section li").on("tap",function () {
		$(this).toggleClass("curr");
		var soarr = [], thispar = $(this).parent();
		thispar.find("li.curr").each(function () {
			soarr.push($(this).attr("data-gid"))
		});
		thispar.attr("data-val",soarr.join(","));
	});
	$("#navsobtn").on("click",function () {//确定按钮
		var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
		minamt = $("#minprice").val();
		maxprice = $("#maxprice").val();
		if(!reg.test(minamt) || !reg.test(maxprice) ){
			jems.tipMsg("金额必须是数字");
			return ;
		}
		if (minamt == "") {
			minamt = 0;
		}
		if (maxprice == "") {
			maxprice = 0;
		}
		if(parseInt(maxprice) < parseInt(minamt)){
			jems.tipMsg("最大金额不能小于最小金额");
			return ;
		}
		navcon.hide();
		navbli.removeClass("on");
		$("#navsomask").hide();
		menuIds = $("#classIfIcation").attr("data-val");
		brandIds = $("#brand").attr("data-val");
		countryIds = $("#countries").attr("data-val");
		sessionStorage.menuIds = menuIds != "" ? menuIds:sessionStorage.menuIds == undefined ? "" : sessionStorage.menuIds;   
		sessionStorage.brandIds = brandIds != ""  ? brandIds:sessionStorage.brandIds  == undefined ? "" : sessionStorage.brandIds;  
		sessionStorage.countryIds = countryIds != ""  ? countryIds:sessionStorage.countryIds  == undefined ? "" : sessionStorage.countryIds; 
		sessionStorage.minamt = minamt;
		sessionStorage.maxamt = maxprice;
		window.location.href=window.location.href;
	});
	$("#navsomask").on("tap",function () {
		navcon.hide();
		navbli.removeClass("on");
		$(this).hide();
	})
}
/**
 * 商品限购规则
 * @param gid	购买商品的id
 * @param mid	购买商品的分类id，如果是按指定商品限购，则分类id可以不用传
 * @param num	购买数量
 * 
 */
function limitrule(gid,num,mid){
	var limit = true;
	var params = {"gid":gid,"buynum":num,"menuid":mid};
	var url = msonionUrl+"sodrest/sodlimit1";
	$.ajax({
		type:'get',
		url:url,
		data:params,
		dataType:'json',
		async:false,
		success:function(msg){
			var info = "该商品是限购商品";
			//info += "<br />限购日期："+msg.sdate+"~"+msg.edate;
			info += "<br />每人限购"+msg.limitNum+"件";
			msg.islimit&&jems.mboxMsg(info);
			limit = msg.islimit;
		}
	});
	return limit;
}
//添加购物车
var timer = null;
function addCart(tmn,goodsId,menuId){
	clearTimeout(timer);
	timer = setTimeout(function(){

		if(!limitrule(goodsId, 1,menuId)){	// 添加限购规则 2015-11-30

			$.ajax({
				type: "get",  
				url: msonionUrl+"cart/add?tmnId="+tmn+"&goodsId="+goodsId+"&menuId="+menuId,
				dataType : "json",
				//jsonp:"callback",
				success: function(data){
					var msg = "";
					if(data.state == 5){
						jems.goUrl("login.html?"+window.location.href);
					}else{
						if(data.state == -1){
							msg = "对不起，洋葱商家无法使用本功能";
						}else if(data.state == 0){
							msg = "此商品加入购物车失败！";
						}else if(data.state == 1){
							msg = "此商品在商城中不存在！";
						}else if(data.state == 2){
							msg = "数量不能为空！";
						}else if(data.state == 3){			    	 
							jems.showCartNum();  // 重新计算购物车数量
							msg = "恭喜加入购物车成功！";
						}else if(data.state == 4){
							msg = "终端不存在！";
						}else if(data.state == 6){
							msg = "此终端不存在！";
						}else if(data.state == 7){
							msg = "洋葱商家不能使用此功能！";
						}else if(data.state == -2){
							msg = "该商品购买数量不能超过"+data.limitNum+"件！";
						}
						jems.tipMsg(msg);
					}
				}
			});

		}

	},500);
}

//添加收藏
function addAtten(tmn,goodsId){
	var ele = event.target;
	$.ajax({
		type: "get",  
		url: msonionUrl+"myatten/add?tmn="+tmn+"&goodsId="+goodsId,
		dataType : "json",
		//jsonp:"callback",
		success: function(data){
			var msg = "";
			if(data.state == -1){  //帐户未登录或无权限
				jems.goUrl("login.html?returnUrl="+window.location.href);
			}else{
				if(data.state == 0){
					msg = "此商品收藏失败！";
				}else if(data.state == 1){
					msg = "此商品已在收藏夹中！";
				}else if(data.state == 2){
					$(ele).removeClass("graysc").addClass("redsc");
					msg = "商品收藏成功！";
				}else if(data.state == 3){
					msg = "洋葱商家不能使用此功能！";
				}
				jems.mboxMsg(msg);
			}
		}
	});
}

//function goUrl(id){
//	jems.goUrl('goods-details.html?id='+id);
//	$.ajax({
//		type:"get",
//		url: msonionUrl+"product/recordBrowse", 
//		data: {"id":id},
//	})
//}
function buyNow(productId,price){
	jems.akeyOrder(productId,price);
}