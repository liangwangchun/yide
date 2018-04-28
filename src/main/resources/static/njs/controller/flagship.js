
var ParHref = jems.parsURL();
$(function(){
    // 图片滚动
    
    jeSlide({
    	mainCell: "#flagshipslider",
    	navCell: ".hd ul",
        conCell: ".bd ul",         
        effect: "leftLoop",
        duration: 4,
//        switchCell: ".datapic",
        sLoad: "data-pic",
        isTouch:true,
        showNav: true,//自动分页
        autoPlay: $('#flagshipslider .bd li').length > 1 ? true : false  //自动播放
    });
    jems.fixMenu();
    //微信分享
    jems.wxShare("洋葱旗舰馆");
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    //返回顶部插件引用
    $(window).goStick({btnCell:"#gotop",posBottom: 50});
});