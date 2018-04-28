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
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    //明细列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取收入明细列表的数据
    function listData() {
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多商品了');
            return;
        }
        var url = msonionUrl+"income/cashablesod";
        var data = "pageNo="+pageNum;

        $.ajax({
            type : "get",
            url : url,
            data:data,
            dataType : "json",
            success:function(json){
                //json.data.length>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(json.data == undefined||json.data.length == 0){
                    $("#no_record").css({display:"block"});
                }else if(json.state && json.state == -1){
                    jems.goUrl("login.html?"+window.location.href);
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#incomeListData').html();
                    jetpl(gettpl).render(json, function(html){
                        $('#inconList').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                }
            } 
        });
    }
}

