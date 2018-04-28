/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */

$(function(){
    loadListData();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    //返回店主中心 
    jems.backStore(); 
});

/*列表数据载入*/
function loadListData(){
    var loadFlg=false;
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    // 取消之前绑定的滚动事件，载入数据时重新绑定
    $(window).off("scroll"); 
    //明细列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取收入明细列表的数据
    function listData() {
        var url = msonionUrl+"income/frozensod";
        var data = "pageNo="+pageNum;

        $.ajax({
            type : "get", 
            url : url,
            data:data,
            dataType : "json",
            success:function(json){
                //json.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(json.total == 0 && json.totalCount == 0){
                    $("#inconList").html("<p class='p15 tc f14'>╯▂╰ 暂无记录！</p>");
                    $("#loadaimbox").hide();
                }else if(json.state && json.state == -1){
                    jems.goUrl("login.html?"+window.location.href);
                }else{
                    var gettpl = $('#incomeListData').html();
                    jetpl(gettpl).render(json, function(html){
                        $('#inconList').append(html);
                    });
                    totalPage = json.totalPage;
                    pageNum++;

                    if(pageNum>totalPage){
                        $("#loadaimbox i").css({display: 'none'});
                        $("#loadaimbox em").text('到底了,没有更多了');
                    }
                }
            }
        });
    }
}

