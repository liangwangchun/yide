
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
                    sLoad: "data-pic",
                    isTouch:true,
                    showNav: true,//自动分页
                    autoPlay: $('#findslider .bd li').length > 1 ? true : false  //自动播放
                });
            });
            for (var i=0; i<3; i++){
                var idx = i+1;
                var vidmagazData = {
                    video:json["videoMagazineList"+idx]||[],
                    common:json["commonMagazineList"+idx]||[]
                };
                jetpl('#vidmagaz').render(vidmagazData, function(htmls){
                    $("#vidmagazList0"+idx).html(htmls);
                });
                jeSlide({
                	mainCell: "#vidmagazList0"+idx,
                	navCell: ".hdvid",
                	conCell: ".bd ul",
                    effect: "curtain",
                    duration: 2,
//                    pageStateCell:".pageState",
                    sLoad: "data-pic",
                    isTouch:true,
                    showNav: true,//自动分页
                    autoPlay: false  //自动播放
                });
            }
            jetpl("#guesstpl").render(json, function(htmls){
                $("#guessList").html(htmls);
            });
            //图片延迟加载插件引用
            $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
        }
    });
    //微信分享
    jems.wxShare("洋葱美物");
    
    // 显示购物车数量
    jems.showCartNum();
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 70});
});