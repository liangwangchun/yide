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
    getMemberInfo();
    getActivData();
    rewardActivClick();
    //返回店主中心 
    jems.backStore();
});

/**
 * 获取相关活动数据
 */
function getActivData(){
    // 获取活动日期数据
    var activDate = JSON.parse(sessionStorage.activDate);
    // 获取活动收入数据
    var activData = JSON.parse(sessionStorage.activData);

    if(activDate){
        // 改变页面显示的周数与起止时间
        var arr = ['一','二','三','四'];
        $('#weeknum').text(arr[activDate.weekNum-1]||'');
        $('#weekstart').text(activDate.weekStart||'');
        $('#weekend').text(activDate.weekEnd||'');
    }

    if(activData){
        // 填充收入数据
        $('#income').text("￥"+(activData.income||'暂无收入'));	// 总收入
        $('#sales').text("￥"+((activData.weekSales+activData.weekRefundSales)||'-'));	// 销售额，累计销售额+退款额所得
        $('#profit').text("￥"+(activData.weekProfit||'-'));	// 利润
        $('#reward').text("￥"+(activData.reward||'-'));		// 奖金
        $('#rewardRate').text(((activData.rewardPoint*100)||'-')+"%");		// 奖金系数
        $('#rewardActi').text("￥"+(activData.rewardActi||'-'));		// 激活奖
        $('#rewardDev').text("￥"+(activData.rewardDev||'-'));		// 开拓奖
    }
}

/**
 * 获取用户信息
 */
function getMemberInfo(){
    $.ajax({
        url:msonionUrl+'menbercenter/memberInfo',
        type:'get',   
        dataType:'json',
        success:function(result){
            $('#headimg').attr('src',result.memberrec.memberHeadUrl);
            result.memberrec.memberType == 2 && $('#actidev').show();
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


