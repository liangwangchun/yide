
var ParHref = jems.parsURL(), params = ParHref.params, tmn = params.tmn, title;
$(function () {
    //分类查询
    $.ajax({
        type:"POST",
        url: msonionUrl+"product/flagshipCatalog?flagId="+params.flagId,
        dataType:"json",
        beforeSend:function(){
            $("#loading").show();
        },
        success:function(msg){
            $("#loading").hide();
            var errorCode = msg.errCode;

            //分类列表
            var countries = {data:msg.data.menu};
            var gettpl = $('#classIfIcationData').html();
            jetpl(gettpl).render(countries, function(html){
                $('#classIfIcation').html(html);
            });
            topNavFilter();
        }
    });
    jems.fixMenu();
    //微信分享
    //jems.wxShare($("title").text(),wxShareimg,wxSharetxt);
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    //返回顶部插件引用
    $(window).goStick({btnCell:"#gotop",posBottom: 50});
});

/**
 * 头部筛选过滤
 */
function topNavFilter() {
    var navbli = $(".navsobar li"), navcon = $(".navsocon");
    navbli.on("click",function () {
        var that = $(this), idx = that.index();
        $("#navsomask").show();
        navbli.removeClass("on");
        that.addClass("on");
        navcon.show().find("section").removeClass("on");
        $("#socon0"+(idx+1)).addClass("on");
    });
    $.each($('#navlistshaixuan li'),function(){
        var _this = $(this), orderid = params.order;
        if(orderid != undefined &&  _this.attr("data-order") == orderid){
            _this.addClass("on");
        }
    });
    $("#navreset").on("click",function () {//重置
        $(".navsocon section li").removeClass("curr");
        window.location.href=window.location.href;
    });
    $(".navsocon section li").on("click",function () {
        $(this).toggleClass("curr");
        var soarr = [], thispar = $(this).parent();
        thispar.find("li.curr").each(function () {
            soarr.push($(this).attr("data-gid"))
        });
        thispar.attr("data-val",soarr.join(","));
    });
    $("#navsobtn").on("click",function () {//确定按钮
        navcon.hide();
        navbli.removeClass("on");
        $("#navsomask").hide();
        var menuIds = $("#classIfIcation").attr("data-val");
        var orders = params.order != undefined ? "&order="+params.order : "";
        jems.goUrl("flagView?flagId="+params.flagId+"&menuId="+menuIds+orders+"&pageNo=1");
    });
    $("#navsomask").on("click",function () {
        navcon.hide();
        navbli.removeClass("on");
        $(this).hide();
    })
}
function goodSort(id){
    var menus = params.menuId != undefined ? "&menuId="+params.menuId : "";
    jems.goUrl("flagView?flagId="+params.flagId+menus+"&order="+id+"&pageNo=1");
}