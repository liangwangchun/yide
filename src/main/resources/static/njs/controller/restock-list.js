/**
 * Created by sinarts on 2017/3/13.
 */
$(function () {
    // $(".tab span").on('click',function(){
    //     var idx = $(this).index();
    //     $(this).addClass("purple").siblings().removeClass("purple");
    //     $(".tabCont>div").eq(idx).show().siblings().hide();
    // });
    //今日补货
    $.ajax({
        type : "get",
        url : msonionUrl+"app/configs/hot/v1",
        dataType : "json",
        success:function(json){
            if (json.recommendList != undefined){
                $("#toadyNote").html("以下补货产品在<span class='red'>"+json.comingTime+" 12点30分</span>准时上架，各位小主都准备好抢购了吗？");
                var datas = {data:json.recommendList};
                jetpl("#toadyData").render(datas, function(html){
                    $("#toadyList").html(html);
                });
            }
        }
    });
    //往期补货
    // $.ajax({
    //     type : "post",
    //     url : msonionUrl+"productUpdate/list",
    //     dataType : "json",
    //     success:function(json){
    //         jetpl("#itemLiData").render(json, function(html){
    //             $("#itemLiList").html(html);
    //         });
    //         $(".wqbh-list li").each(function () {
    //             $(this).find(".btnOpen").on("click",function () {
    //                 if($(this).siblings().css("display")=="none"){
    //                     $(this).siblings().show();
    //                     $(this).children("i").addClass("corner02").removeClass("corner01");
    //                     $(this).parent().siblings().children('.open-list').hide();
    //                     $(this).parent().siblings().children('.btnOpen').find('i').addClass("corner01").removeClass("corner02")
    //                 }else{
    //                     $(this).siblings().hide();
    //                     $(this).children("i").addClass("corner01").removeClass("corner02")
    //                 }
    //             }) ;
    //         });
    //     }
    // });
    //返回店主中心 
    jems.backStore();
});
//查看每次的补货列表
function showItems(elem,num) {
    var nextCls = $(elem).next();
    if (nextCls.attr("item")=="true"){
        nextCls.attr("item","false");
        $.ajax({
            type : "post",
            url : msonionUrl+"productUpdate/itemList?leUpdateDate="+num,
            dataType : "json",
            success:function(json){
                jetpl("#itemData").render(json, function(html){
                    nextCls.html(html);
                });
                nextCls.find("dl").last().removeClass("jecell-bottom");
            }
        });
    }
}