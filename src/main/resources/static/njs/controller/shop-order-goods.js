/**
 * 我的订单
 * author:cjw
 * 2015-08-03
 */
var ParHref = jems.parsURL();
var params = ParHref.params;
$(function(){
    // 载入数据
    loadData();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});

    //返回店主中心 
    jems.backStore(); 
});

function loadData(){
    var url = msonionUrl+"sodrest/showodrgoods";
    $.ajax({
        type : "post",
        url : url, 
        data : params,
        dataType : "json",
        success:function(result){
        	var datas = {data:result};
            if(datas.state && datas.state == -1){	// 没登录				
                jems.goUrl("login.html?"+window.location.href);
            }else{
                var gettpl = $('#orderGoodsData').html();
                jetpl(gettpl).render(datas, function(html){
                    $('#orderGoodsList').append(html);
                });
                //totalPage = result.totalPage; 
                //pageNum++;	
                //图片延迟加载插件引用
                //$('#sodOrderList').lazyload();
            }
        }
    });
} 
 