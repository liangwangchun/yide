/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
$(function(){
    var flag = jems.parsURL().params.flag;
    if(flag==0)$('#rank').show();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    //getActivWeekAndDate();
    //返回店主中心 
    jems.backStore();
});

/**
 * 获取当前活动的周后一周的周数与起止日期
 */
function getActivWeekAndDate(){
    $.ajax({
        url:msonionUrl+'activ/weekanddate',
        type:'get',
        dataType:'json',
        success:function(result){
            if(result==-1){
                jems.goUrl("login.html?"+window.location.href);
            }else{
                // web存储，供其它页面调用
                sessionStorage.activDate = JSON.stringify(result);
                getRankingData(result);
            }
        }
    });
}

/**
 * 获取当前用户的排名
 */
function getRankingData(params){
    $.ajax({
        url:msonionUrl+'activ/ranking',
        type:'get',
        data:params,
        dataType:'json',
        success:function(result){
            // 存放活动数据
            sessionStorage.activData = JSON.stringify(result);
            // 存放活动编号
            sessionStorage.activNo = params.activNo;
        }
    });
}



