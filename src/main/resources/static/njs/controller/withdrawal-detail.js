/**
 * 提现明细
 * author:cjw
 * 2017-03-03
 */

$(function(){
    var pageNum = 1;
    var totalPage = 1;
    // 下拉加载
    $(window).dropload({afterDatafun: listData});

    function listData(){
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'}); 
            $("#loadaimbox em").text('到底了,没有更多数据了');
            return;
        }
        // 查询提现明细
        $.ajax({
            type : "POST",
            url : msonionUrl+"cash/list/v1",
            data:{"pageNo":pageNum},
            dataType : "json",
            success:function(result){
            	 $("#loadaimbox").hide();
                if(result.errCode == 10000){
	                var gettpl = $('#widthdrawDetailData').html();
	                jetpl(gettpl).render(result, function(html){
	                    $('#widthdrawDetail').append(html);
	                });
	                totalPage = result.totalPage;
	                pageNum++; 
                }  else if(result.errCode == 4001){
                	jems.goUrl(mspaths+"login.html");
                }else{
                	 jems.tipMsg(result.errMsg);
                }
            },
            error:function(json){
                jems.tipMsg("network error!");
            }
        });
    }

    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    
  //返回店主中心 
    jems.backStore();
});
