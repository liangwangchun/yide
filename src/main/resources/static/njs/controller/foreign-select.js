/**
 @Js-name:cart-order-sumbit.js
 @Zh-name:搜索页面
 @Author:Banana
 @Date:2015-08-04
 */
var params = jems.parsURL(window.location.href).params;
var tmn = params.tmn;
var desc = 0, twoclassid = 0;
var keywords = params.keywords;
var url = window.location.href;
var spriceOrder = 0,pageNum = 1;
var totalPage = 1;
var tabIndex = 0;
var couponData = {};
var discountAmt = 0;
var soarr = [];//选中分类数组
$(function () {
	
	if (params.keywords == undefined || params.keywords == ""){
		keywords = sessionStorage.keywords == undefined?"":decodeURI(decodeURI(sessionStorage.keywords)) ;
	}  else {
		keywords = decodeURI(decodeURI(keywords)) ;
		sessionStorage.keywords = keywords;
	}
    keywords = keywords == undefined ?"":keywords;
    $("#formalSearchTxt").val(decodeURI(decodeURI(keywords)));
	classInfo();//分类数据绑定

	//产品列表数据加载
	maxamt = sessionStorage.maxamt != undefined ?sessionStorage.maxamt:params.maxamt != undefined ? params.maxamt:0;
	minamt = 0;// minamt != undefined ?minamt:sessionStorage.minamt == "undefined" ?0:sessionStorage.minamt == undefined ?0:sessionStorage.minamt;
//	maxamt = maxamt != undefined ?maxamt:sessionStorage.maxamt == "undefined" ?0:sessionStorage.maxamt == undefined ?0:sessionStorage.maxamt;
	
	$(window).dropload({afterDatafun: listDataWithForeign});

	$("#minprice").val(minamt);
	$("#maxprice").val(maxamt);

	
    /**
     * 点击商品搜索
     */
    $("#searchBtn").on('tap',function(){
        var sosVal = $("#formalSearchTxt").val();
        if(sosVal == "") {
            jems.tipMsg("关键字不能为空");
        }else {
            if (!jems.specialStr(sosVal)) {
                jems.tipMsg("不能有非法字符");
            } else {
                loadown = true;
                pageNum = 1;
                sessionStorage.menuIds = "";
				sessionStorage.brandIds = "";
				sessionStorage.countryIds = "";
                sessionStorage.keywords = sosVal;
                sessionStorage.maxamt = 0;
                sessionStorage.minamt = 0;
                jems.goUrl("foreign-select.html");
                return;
            }
        }
    });
	//返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    //tabs
    $(".menuTabs li").on("click",function () {           
    	tabIndex = $(this).index();//当前选择tap
        $(this).addClass("on").siblings().removeClass("on");
        $(".tabsBox>div").eq(tabIndex).removeClass("hide").siblings().addClass("hide");
        if(tabIndex == 1){
        	pageNum = 1;
        	classInfo();//分类数据绑定
        	$(window).dropload({afterDatafun: listDataWithForeign});
        }
    })
    $(".ncsmask").on('tap',function(){
    	hideMask();
    })
    topNavFilter();   
});

function goodSort(d){
	$(this).addClass("on");
	pageNum = 1;
	desc = d;
	listDataWithForeign();
}

/**
 * 隐藏遮罩层
 */
function hideMask(){
	 var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
     if(shaixuan.css('display') == 'block') shaixuan.hide();
     if(feilei.css('display') == 'block') feilei.hide();
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

/**
 * 分类数据绑定
 */
function classInfo() {
	var confightml = '';
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/getClassInfoWithKeyWord",
        data: {"keyWord":keywords},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var data = result.data;
            if (10000 == result.errCode) {
                var classId = params.classId;

                data.forEach(function (v, index, array) {//二级分类
                    confightml += '<li data-gid="'+v.id+'"><p><span class="sep">'+v.let_name+'</span></p></li>';
                })
                $("#socon02 ul").html(confightml);

                $("li[data-gid]").on("tap", function () {
                	if($(this).hasClass("curr")){
                		for(var i=0; i<soarr.length; i++) {
                		    if(soarr[i] == $(this).attr("data-gid")) {
                		    	soarr.splice(i, 1);
                		      break;
                		    }
                		  }
                	}
                	$(this).toggleClass("curr");
            		var thispar = $(this).parent();
            		if($(this).hasClass("curr")){
                		soarr.push($(this).attr("data-gid"));
            		}
            		thispar.attr("data-val",soarr.join(","));
                });
            }
        }
    });
}

/**
 * 加载贩外搜索数据
 * @returns
 */
function listDataWithForeign(){
	 hideMask();
	 var minamt = $("#minprice").val();
     var maxprice = $("#maxprice").val() == 0 ? -1 : $("#maxprice").val();
	    $.ajax({
	        type: "post",
	        url: msonionUrl + "subProduct/findSubIndexList/v1",
	        data: {
	            "pageNo": pageNum,
	            "tmn": tmn,
	            "desc": desc,
	            "twoClass": soarr.toString(),
	            "threeClass": 0,
	            "keyWord":keywords,
	            "minAmt":minamt,
	            "maxAmt":maxprice
	        },
	        dataType: "json",
	        beforeSend: function () {
	            $("#loading").show();
	        },
	        success: function (result) {
	            if (10000 == result.errCode) {
	                html = '';
	                confightml = '';
	                classhtml = '';
	                var data = result.data;
	                if(data.realData.length==0 && pageNum ==1){
	                	$(".goods-list").css("display","");
	                    $("#contentlistForeign ul").html(html);
	                	return;
	                } else if(data.realData.length==0 && pageNum>1){
	                    return;
	                }
	                else {
	                	data.realData.forEach(function (v, index, array) {
		                    html += '<li>';
		                    html += '<div class=\"p5\">';
		                    html += '<span data-id="' + v.id + '" data-menuid="' + v.t_menuId + '" class="photo show" style="background-image:url(' + msPicPath + '' + v.picUrl + '?x-oss-process=image/resize,w_320)"></span>';
		                    html += '<h3 class="f13 mt5">' + v.name + '</h3>';
		                    html += '<p class="flexbox mt5 je-align-center">';
		                    html += '<span class="f12 purple show">&yen;' + v.freePrice + '</span>';
		                    html += '<del class="f10 g9 show jeflex ml10">&yen;' + v.marketPrice + ' </del>';
//		                    html += '<span class="btn btn-favorite show edit" data-id="' + v.id + '" ></span>';
		                    html += '</p>';
		                    html += '</div>';
		                    html += '</li>';
		                })
		                if(pageNum ==1){
		                    $("#contentlistForeign ul").html(html);
		                }else{
		                    $("#contentlistForeign ul").append(html);
		                }
		                pageNum++;
		                //图片点击跳转
		                $(".photo").on("click", function () {
		                    window.location.href = 'foreign-detail.html?tmn=' + tmn + '&id=' + $(this).attr('data-id') + '&menuId=' + $(this).attr("data-menuid");
		                    return;
		                })
		                //关注
		                $(".btn-favorite").on("tap", function () {
		                    var id = $(this).attr("data-id");
		                })
	                }
	            } else {
	                jems.tipMsg(result.errMsg)
	                return;
	            }
	        }
	    });
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


/**
 *洋葱OMALL 头部筛选过滤
 */
function topNavFilter() {
    var navbli = $(".navsobar li"), navcon = $(".navsocon"),brandnavso =$(".brandnavso");
    navbli.on("tap",function () {
        var that = $(this), idx = that.index();
        $("#navsomask").show();
        $(".brandnavso").show();
        
        navbli.removeClass("on");
        that.addClass("on");
        navcon.show().find("section").removeClass("on");
        $("#socon0"+(idx+1)).addClass("on");
        $(".navfootbtn").show();
    });
    $("#navreset").on("tap",function () {//重置
        $(".navsocon section li").removeClass("curr");
        soarr = [];
        sessionStorage.menuIds =  ""; 
        sessionStorage.brandIds =  "";
        sessionStorage.countryIds = "" ;
        sessionStorage.minamt =0;
        sessionStorage.maxamt = 0;
        $("#minprice").val(0);
        $("#maxprice").val(0);
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
        $(this).parent().hide();
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
        if($("li[data-gid].curr").length==0){
            soarr = [];
        }
        pageNum = 1;
        listDataWithForeign();
    });
    $("#navsomask").on("tap",function () {
        navcon.hide();
        navbli.removeClass("on");
        $(this).hide();
        $(".brandnavso").hide();
    })
}
