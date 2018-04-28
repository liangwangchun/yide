/**
 * Created by onion on 2017/8/16.
 */
$(function () {
    $.ajax({
        type: "get",
        url: msonionUrl + "magmain/index",
        dataType: "json",
        success: function (json) {
            jetpl('#findsliderData').render(json, function(htmls){
                $("#findslider .bd ul").html(htmls);
                // 图片滚动
               
                jeSlide({
                	mainCell: "#findslider",
                	navCell: ".hd ul",
                    conCell: ".bd ul",         
                    effect: "leftLoop",
                    duration: 4,
//                    switchCell: ".datapic",
                    sLoad: "data-pic",
                    isTouch:true,
                    showNav: true,//自动分页
                    autoPlay: $('#findslider .bd li').length > 1 ? true : false  //自动播放
                });
            });
        }
    });
    // 显示购物车数量
    jems.showCartNum();
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 70});
});