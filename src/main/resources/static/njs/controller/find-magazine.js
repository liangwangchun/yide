/**
 * Created by onion on 2017/8/15.
 */
$(function () {
    $.ajax({
        type: "get",
        url: msonionUrl + "magmain/index",
        dataType: "json",
        success: function (json) {
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
                    slideCell:"#vidmagazList0"+idx,
                    titCell:".hdvid ul",
                    mainCell:".bd ul",
                    effect:"leftLoop",
                    interTime:2000,
                    switchCell:".datapic",
                    switchLoad:"data-pic",
                    autoPage:false,//自动分页
                    autoPlay:false  //自动播放
                });
            }
            jetpl("#guesstpl").render(json, function(htmls){
                $("#guessList").html(htmls);
            });
        }
    });
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 70});
});