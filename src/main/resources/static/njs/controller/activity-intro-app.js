/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
var params;
$(function(){
    params = jems.parsURL().params;
    var flag = jems.parsURL().params.flag;
    if(flag==0)$('#rank').show();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});

    //返回店主中心 
    jems.backStore();
});

function toIncomeApp(){
    jems.goUrl("activity-income-app.html?"+jems.parsURL().queryURL);
}
function toIntoApp(){
    jems.goUrl("activity-intro-app.html?"+jems.parsURL().queryURL);
}