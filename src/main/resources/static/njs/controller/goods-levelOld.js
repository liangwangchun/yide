/**
 * Created by onion on 2017/8/14.
 */
var ParHref = jems.parsURL(),
    params = ParHref.params;
$(function () {
    // 按分类查时cid或pid会有值
    var pid = params.pid, cid = params.cid, 
        sid = params.sid, tmn = params.tmn;
    $("#navtopmenu").css({"max-width":jems.isMobile() ? "100%" : 640});
    $(window).on("resize",function () {
        $("#navtopmenu").css({"max-width":jems.isMobile() ? "100%" : 640});
    });
    //获取当前分类的导航数据
    $.ajax({
        type: "get",
        data:{pid:pid},
//        url: mspaths + "js/jsons/threeMenu.json",
        url:msonionUrl+"app/product/getLetParent/v1",
        dataType: "json",
        success: function (json) {
        	var dataMenus = {data:json.childrens,name:json.let_name};
            if(json.id == pid){
                //一级导航菜单名称
                $("title,.godsnavtitle").text(json.let_name);
                jetpl('#listchildnavData').render(dataMenus, function(html) {
                    $('.listchildmenu').html(html);
                })
            }
            //一级导航菜单
            $.each($('#navtopmenu ul li'),function(){
                var that = $(this);
                if(pid != undefined && that.attr("data-cell") == pid){
                    that.addClass("on");
                }
             })
            //点击弹层所有一级导航
            $('.godsnavtitle,.navtopmask').on('click',function(){
                if($('#navtopmenu').css('display')=='block'){
                    $('#navtopmenu').hide();
                }else{
                    $('#navtopmenu').show();
                }
            })
            $(".msopennav").on("click",function () {
                if ($(".mslevenav").css("display") == "block"){
                    $(this).parent().addClass("mslevemenu");
                    $(".mslevenav").css("display","none");
                    $(".msleveopen").css("display","block");
                }else {
                    $(this).parent().removeClass("mslevemenu");
                    $(".mslevenav").css("display","");
                    $(".msleveopen").css("display","none"); 
                }
            });
        }
    });
    // 图片滚动
    jeSlide({
        slideCell:"#goodslevelslider",
        titCell:".hd ul",
        mainCell:".bd ul",
        effect:"leftLoop",
        interTime:4000,
        switchCell:".datapic",
        switchLoad:"data-pic",
        autoPage:true,//自动分页
        autoPlay:$('#goodslevelslider .bd li').length>1 ? true:false  //自动播放
    });
    jems.fixMenu();
    //微信分享
    jems.wxShare($("title").text());
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    //返回顶部插件引用
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 50});
});