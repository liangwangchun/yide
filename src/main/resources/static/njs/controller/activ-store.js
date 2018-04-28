/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
var ParHref = jems.parsURL( );
$(function(){
    loadAgentList();

    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    //返回店主中心 
    jems.backStore();
});

/**
 * 载入店铺数据
 */
var timer = null;
function loadAgentList(){
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
    // 取消之前绑定的滚动事件，载入数据时重新绑定
    $(window).off("scroll");
    //明细列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取收入明细列表的数据
    function listData() {
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多数据了');
            return;
        }
        if(!loadFlg)return loadFlg;
        loadFlg=false;
        var params = ParHref.params;
        var url = msonionUrl;
        url = url+"activstore/activstores";
        var data = {pageNo:pageNum,activNo:params.activNo};
        $.ajax({
            type : "get",
            url : url,
            data:data,
            dataType : "json",
            cache:false,
            success:function(data){
                //console.log(data);
                if(data==-1){jems.goUrl('../login.html');return;}
                data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#storeListData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#storeList').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                    loadFlg = true;
                }
            }
        });
    }

}

