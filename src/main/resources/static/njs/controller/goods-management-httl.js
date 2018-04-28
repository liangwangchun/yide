/**
 * 商品管理
 * 2016-12-08
 */
var ParHref = jems.parsURL( window.location.href );
//var defalutCid = 48;//美妆
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
    toggleSortStyle();
    $("#sortnavlist li").each(function(){
        $(this).on("tap",function(){
            goTypeSort(this)
        })
    });
    $("#searchGoods").on("tap",topSearch);
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
});

/**
 * 按分类统计商品数量
 */
function countGoodsNum(){
    //var ParHref = parsURL( window.location.href );
	var param = ParHref.params;

    var cid = param.cid,
        flag = param.flag;
    	
    $.ajax({
        type : "post",
        url : msonionUrl+"menu/goodsnumV2",
        data:ParHref.params,
        dataType : "json",
        success:function(result){
            //1. 得到操作对象
//            var obj = result.filter((p) => {
//                return p.letId == 47;
//            });
//            //2. 得到索引
//            var index = result.indexOf(obj[0]);
//            //3. 如果存在则将其删除，index > -1 代表存在
//            index > -1 && result.splice(index, 1);
//            result.push(obj[0]);
            var redate = {data:result};
            //brandId
            //secondId
            //country
            //goodsName
            if((cid == undefined || cid == 0) && (param.brandId == "" || param.brandId == undefined)
            		&& (param.secondId == "" || param.secondId == undefined)
            		&& (param.country == "" || param.country == undefined)
            		&& (param.goodsName == "" || param.goodsName == undefined)){
            	cid = result[0].letId;
            	defalutCid = cid;
            }
            
            // 未登录
            if(result && result == -1){
                jems.goUrl("login.html?"+window.location.href);
            }else if(result && result == -2){
            	jems.tipMsg("只有店主可见!");
				setTimeout(function(){
					jems.goShop();
				},2000);
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
//    sortType&&(param.ordertype = sortType);
//    upordown||(upordown="DESC");
//    if(param.cid == undefined){
//    	param.cid = defalutCid;
//    }
    var url = "mygoodsview?flag="+param.flag+"&ordertype="+sortType+"&upordown="+upordown;
    if(typeof(param.goodsName) != "undefined"){
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
	    jems.goUrl("mygoodsviewV3?cid="+cid+"&flag="+flag);
	}else{
		jems.goUrl("mygoodsview?cid="+cid+"&flag="+flag);
	}
}

/*按分类查找商品*/
function topSearch(){
    var flag = ParHref.params.flag;
    jems.goUrl(mspaths+"store/stores-search-goods.html?flag="+flag);
}
/*新版商品管理*/
function goNewPage(){
	var flag = ParHref.params.flag;
	var cid = ParHref.params.cid;
	if (typeof(cid) == "undefined"){
		cid = "";
	}
    jems.goUrl("../wx/mygoodsviewV3?flag="+flag+"&cid="+cid);
}