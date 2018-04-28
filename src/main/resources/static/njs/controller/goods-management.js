/**
 * 商品管理
 * 2016-12-08
 */
var ParHref = jems.parsURL( window.location.href );
$(function(){
    // 商品搜所功能
    $.ajax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json",
        //jsonp:"callback",
        success:function(data){
            if(!data.login_flag){
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
            } else {
                if(data.memberrec.memberType == 4){//
                    jems.mboxMsgIndex("只有店主可见!");
                } else {
                    // 商品搜所功能
                    search();
                    // 加载我的商品列表
                    //toTypeSort();
                    //loadData();
                    loadGoodsData();
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
    })
});
function loadGoodsData(){
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
    //var ParHref = parsURL( window.location.href );
    //var cid = ParHref.params.cid;
    //var tmn = ParHref.params.tmn;
    //产品列表数据加载
    $(window).off("scroll");
    $(window).dropload({afterDatafun: listData});
    //获取商品列表的数据
    function listData() {
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多商品了');
            return;
        }
        if(!loadFlg)return loadFlg;
        loadFlg=false;
        var url = msonionUrl+"product/mygoods";
        var params = ParHref.params;
        params.pageNo=pageNum;
        $.ajax({
            type : "get",
            url : url,
            data:params,
            dataType : "json",
            //jsonp:"callback",
            success:function(data){
                data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#godslistnopro").css({display:"block"});
                }else{
                    var gettpl = $('#godslistData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#godslistbox').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                    //图片延迟加载插件引用
                    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
                }
                loadFlg = true;
            }
        });
    }
}
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
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
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
    var isunASC = ParHref.params.upordown == undefined || ParHref.params.upordown == "ASC";
    var udSort = isunASC ? "ASC" : "DESC";
    udSort == "ASC" ? $(that).find(".icon-up").addClass("act") : $(that).find(".icon-down").addClass("act");
    sortByType($(that).data('type'),udSort == "ASC" ? "DESC" : "ASC");
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
    sortType&&(param.ordertype = sortType);
    upordown||(upordown="DESC");
    param.upordown = upordown;
    var url = "goods-management.html?"+$.param(param);
    jems.goUrl(url);
}


/*按分类查找商品*/
function searchGoods(cid){
    //var ParHref = parsURL( window.location.href );
    var flag = ParHref.params.flag;
    var url = "goods-management.html?cid="+cid+"&flag="+flag;
    jems.goUrl(url);
}

