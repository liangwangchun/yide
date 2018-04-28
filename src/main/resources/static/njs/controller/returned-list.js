/**
 * Created by sinarts on 2017/3/13.
 */
$(function () {
    $(".tab span").on('click',function(){
        var idx = $(this).index();
        $(this).addClass("purple").siblings().removeClass("purple");
        $(".tabCont>div").eq(idx).show().siblings().hide();
    });
    //今日返库
    $.ajax({
        type : "post",
        url : msonionUrl+"productUpdate/todayList?screening=2",
        dataType : "json",
        success:function(json){
            if (json.data != undefined){
                $("#toadyNote").html("以下产品为返库的，各位小主都准备好抢购了吗？");
                jetpl("#toadyData").render(json, function(html){
                    $("#toadyList").html(html);
                });
            }
        }
    });
    //往期返库
    // $.ajax({
    //     type : "post",
    //     url : msonionUrl+"productUpdate/list?screening=2",
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
//查看每次的返库列表
function showItems(elem,num) {
    var nextCls = $(elem).next();
    if (nextCls.attr("item")=="true"){
        nextCls.attr("item","false");
        $.ajax({
            type : "post",
            url : msonionUrl+"productUpdate/itemList?screening=2&leUpdateDate="+num,
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