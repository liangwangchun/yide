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
    getMemberInfo();
    //返回店主中心 
    jems.backStore();

});
function getMemberInfo(){

    $.ajax({
        url:msonionUrl+"app/activ/ranking/v1",
        type:'POST',
        data:{"uid":params.uid,"msToken":params.msToken,"client":params.client},
        dataType:'json',
        success:function(result){
            if (result.errCode != 10000) {
                return ;
            }
            var memberHeadUrl = result.memberrec.memberHeadUrl;
            if (memberHeadUrl != null && memberHeadUrl != "" && typeof(memberHeadUrl) != undefined){
                if (memberHeadUrl.indexOf("http:") >= 0) {
                    var imgurl = memberHeadUrl;
                } else {
                    imgurl = msPicPath+memberHeadUrl;
                }
                $('#headimg').attr('src', imgurl);
            }
            result.memberrec.memberType == 2 && $('#actidev').show();
            // 填充收入数据
            var arr = ['一','二','三','四'];
            $('#weeknum').text(arr[result.timeData.weekNum-1]||'');
            $('#weekstart').text(result.timeData.weekStart||'');
            $('#weekend').text(result.timeData.weekEnd||'');
            if (result.incomeData == null) return ;
            $('#income').text("￥"+(result.incomeData.income||'暂无收入'));	// 总收入
            $('#sales').text("￥"+((result.incomeData.weekSales+result.incomeData.weekRefundSales)||'-'));	// 销售额，累计销售额+退款额所得
            $('#profit').text("￥"+(result.incomeData.weekProfit||'-'));	// 利润
            $('#reward').text("￥"+(result.incomeData.reward||'-'));		// 奖金
            $('#rewardRate').text(((result.incomeData.rewardPoint*100)||'-')+"%");		// 奖金系数
            $('#rewardActi').text("￥"+(result.incomeData.rewardActi||'-'));		// 激活奖
            $('#rewardDev').text("￥"+(result.incomeData.rewardDev||'-'));		// 开拓奖
        }
    });
}

/**
 * 激活奖点击事件
 */
function rewardActivClick(){
    $('#actidev').on('click',function(){
        var activNo = sessionStorage.activNo;
        jems.goUrl('activ-store.html?activNo='+activNo);
    })
}

function toBonusApp(){
    jems.goUrl("activity-bonus-app.html?"+jems.parsURL().queryURL);
}
function toIntoApp(){
    jems.goUrl("activity-intro-app.html?"+jems.parsURL().queryURL);
}
function toIncomeApp(){
    jems.goUrl("activity-income-app.html?"+jems.parsURL().queryURL);
}

