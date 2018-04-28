/**
 * 商品管理
 * 2017-12-04
 */
var ParHref = jems.parsURL( window.location.href );
$(function(){

    $.ajax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json",
        //jsonp:"callback",
        success:function(data){
            if(!data.login_flag){
                jems.goUrl("login.html?"+window.location.href);
            } else {
                if(data.memberrec.memberType == 4){//
                    jems.mboxMsgIndex("只有店主可见!");
                } else {
                    // 商品搜所功能
                    //searchGoods();
                    // 加载我的商品列表
                    //toTypeSort();
                    //loadData();
                    //loadGoodsData();
                    /*获取商家分类商品数据*/
                    countGoodsNum();
                    //返回顶部插件引用
                    $(window).goTops({toBtnCell:"#gotop",posBottom: 50});
                }
            }
        }
    });
    $(".varietyBtn").on("click",function () {
         var _thisp=$(this).parents("li").children(".goodsVariety"),_this = $(this);
          if (_thisp.is(":hidden")){
              _thisp.show();
              _this.addClass("up").removeClass("down");
          }else{
              _thisp.hide();
              _this.removeClass("up").addClass("down");
          }
     });
     $(".doubtBtn").on("click",function () {
     	var that = $(this),dval = that.attr("data-cost").split(","); 
         mBox.open({
             title: ['解释说明', 'color:#333;font-size:1.6rem;text-align:center;'],
             width: "90%",
             height: "50%",
             content: '<div style="background-color: #fff;" id="materialdata"></div>',
            // closeBtn: [true, 1],
             btnName: ['关闭'],
             btnStyle: ["color: #0e90d2;"],
             maskClose: false,
             success:function () {
             	$("#leCostView").text(dval[0]);
             	$("#reCostView").text(dval[1]);
             	var flag= ParHref.params.flag;
             	if(flag == 1){
             		$("#storeShow").css("display","block");
             	}else{
             		$("#storeShow").css("display","none");
             	}
                $("#materialdata").html($("#materialView").html());
             }
         });
     });
     $(".goodsVariety dd").on("click",function () {
         $(this).addClass("on rdu4").siblings().removeClass("on rdu4");
         var dval = $(this).attr("data-leSpec").split(",");
         var soldOutClass = getSoldOutClass(dval[5],dval[7]);//销售状态样式
         $(this).parent().prev("div").find("div").eq(0).attr("class","photo jepor "+soldOutClass);//添加销售状态样式
         $(this).parent().prev("div").find("img").attr("src",msPicPath+dval[0]);//图片
         $(this).parent().prev("div").find("h3").text(dval[1]);//名称
//         var tmn = ParHref.params.tmn;
//         $(this).parent().prev("div").find("a").attr("href","../wx/foreign-detail.html?id="+dval[8]+"&tmn="+tmn);//
         $(this).parent().prev("div").find("p").eq(0).find("span").html("¥"+jems.formatNum(dval[2],2));//freepirce
         $(this).parent().prev("div").find("p").eq(1).find("i").html("¥"+jems.formatNum((dval[2]-dval[4]*0.7),2));//lecost
         $(this).parent().prev("div").find("p").eq(2).find("span").html("¥"+jems.formatNum(dval[4]*0.7,2));//zlr
         $(this).parent().prev("div").find("p").eq(3).find("span").html("¥"+jems.formatNum(parseFloat(dval[4])*0.3,2)+"("+jems.formatNum(parseFloat(dval[4])*0.3/dval[2]*100,2)+"%)");//扣点
         $(this).parent().prev("div").find("p").eq(1).attr("data-cost","¥"+jems.formatNum(dval[3],2)+",¥"+jems.formatNum(dval[4]*0.3,2)+"("+jems.formatNum(parseFloat(dval[4])*0.3/dval[2]*100,2)+"%)");
     });
    toggleSortStyle();
    $("#sortnavlist li").each(function(){
        $(this).on("tap",function(){
            goTypeSort(this)
        })
    });
    $("#searchGoods").on("tap",topSearch);
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    $("#goOldPage").on("click",goOldPage);
});

/**
 * 按分类统计商品数量
 */
function countGoodsNum(){
    //var ParHref = parsURL( window.location.href );
    var cid = ParHref.params.cid,
        flag = ParHref.params.flag;
    $.ajax({
        type : "get",
        url : msonionUrl+"menu/goodsnum",
        data:ParHref.params,
        dataType : "json",
        success:function(result){
            var redate = {data:result};
            // 未登录
            if(result.state && result.state == -1){
                jems.goUrl("login.html?"+window.location.href);
            }else{
                var gettpl = $('#catagoryData').html();
                jetpl(gettpl).render(redate, function(html){
                    $('#catagory').html(html);
                });
                $.each($('#catagory li'),function(){
                    var that = $(this);
                    if(that.attr("data-cell") == cid){
                        that.addClass("on")
                    }
                });
                jemRoll({
                    cell:".navbox",
                    posCell:"li.on",
                    isAdjust: true
                });
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
}
/**
 * 升序或降序
 * @param updown
 */
function goTypeSort(that){
    if(!$(that).hasClass("on")) $(that).addClass("on");
    var ordertype = ParHref.params.ordertype;
    var upordown = ParHref.params.upordown;
    if(upordown == undefined){
    	upordown = "ASC";
    }else{
    	if(upordown == "DESC"){
    		upordown = "ASC";
    	}else{
    		upordown = "DESC";
    	}
    }
    upordown == "ASC" ? $(that).find(".icon-up").addClass("act") : $(that).find(".icon-down").addClass("act");
    sortByType($(that).data('type'),upordown);
}

function toggleSortStyle(){
    var ordertype = ParHref.params.ordertype;
    var isunASC = ParHref.params.upordown == undefined || ParHref.params.upordown == "ASC";
    var udSort = isunASC ? "ASC" : "DESC", sortli = $(".sortnavlist li").eq(ordertype-1);
    sortli.addClass("on");
    udSort == "ASC" ? sortli.find(".icon-up").addClass("act") : sortli.find(".icon-down").addClass("act");
}

/**
 * 排序方法
 * @param sortType
 * @param upordown
 */
function sortByType(sortType,upordown){
    var param = ParHref.params;
    var url = "mygoodsviewV2?flag="+param.flag+"&ordertype="+sortType+"&upordown="+upordown;
    if(param.goodsName != undefined){
    	url = url + "&goodsName="+param.goodsName;
    }
    if(param.cid != undefined){
    	url = url + "&cid="+param.cid;
    }
    if(param.brandId != undefined){
    	url = url + "&brandId="+param.brandId;
    }
    if(param.country != undefined){
    	url = url + "&country="+param.country;
    }
    jems.goUrl(url);
}


/*按分类查找商品*/
function searchGoods(cid){
    //var ParHref = parsURL( window.location.href );
    var flag = ParHref.params.flag;
    if(cid == 47){//衣服
		//更新删除start
		jems.tipMsg("敬请期待！");
		return ;
		//更新删除end
	}
    jems.goUrl("mygoodsviewV2?cid="+cid+"&flag="+flag );
}

/*按分类查找商品*/
function topSearch(){
    var flag = ParHref.params.flag;
    jems.goUrl(mspaths+"store/stores-search-goods2.html?flag="+flag);
}
function goOldPage(){
	var flag = ParHref.params.flag;
    jems.goUrl("../wx/mygoodsview?flag="+flag);
}
/**
 * 销售状态
 * @param qty
 * @param saleState
 * @returns
 */
function getSoldOutClass(qty,saleState){
	var strSoldOutClass = "";
	if (qty <= 0) {
        if (saleState == 2 || saleState == 9) {
            strSoldOutClass ="soldout2";
        }
        else if (saleState == 3 || saleState == 6 || saleState == 7 || saleState == 8) {
        	strSoldOutClass = "soldout3";
        }
        else if (saleState == 5 || saleState == 10) {
        	strSoldOutClass = "soldout5";
        }
        else {
        	strSoldOutClass = "soldout1";
        }
    }
    else {
        if (saleState == 6 || saleState == 7 || saleState == 8) {
        	strSoldOutClass = "soldout3";
        }
        else if(saleState == 5 || saleState == 10) {
        	strSoldOutClass = "soldout5";
        }else{
        	strSoldOutClass = "";
        }
    }
    if (saleState == 4) {
    	strSoldOutClass = "soldout4";
    }
    return strSoldOutClass;
}
