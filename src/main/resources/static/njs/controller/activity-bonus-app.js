/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
var tmn;		// 终端
var activNo;	//活动编号
$(function(){
    selectChange();
    loadListData();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    //返回店主中心 
    jems.backStore();
});

/*列表数据载入*/
function loadListData(){
    var pageNum = 1;
    var totalPage = 1;
    // 取消之前绑定的滚动事件，载入数据时重新绑定
    $(window).off("scroll");
    //明细列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取收入明细列表的数据
    function listData() {
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多商品了');
            return;
        }
        var url = msonionUrl+"app/activ/activlist/v1";
        // 获取选择的活动编号
        activNo = $('#activNolist').val();
        var params = jems.parsURL().params;
        var data = {"pageNo":pageNum,"activNo":activNo,"uid":params.uid,"msToken":params.msToken,"client":params.client};

        $.ajax({
            type : "post",
            url : url,
            data:data,
            dataType : "json",
            success:function(result){
                $("#loadaimbox").hide();
                $("#no_record").css({display:"block"});
                if (result.errCode != 10000){
                    return ;
                }
                //result.data.totalpage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(result.data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#bonusListData').html();
                    jetpl(gettpl).render(result.data, function(html){
                        $('#activity_bonus').append(html);
                    });
                    totalPage = result.totalpage;
                    pageNum++;
                }
            }
        });
    }
}

/**
 * 比较两时间大小
 * @param startdate
 * @param enddate
 * @returns {Boolean}
 */
function dateCompare(startdate, enddate) {
    var arr = startdate.split("-");
    var starttime = new Date(arr[0], arr[1], arr[2]);
    var starttimes = starttime.getTime();

    var arrs = enddate.split("-");
    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
    var lktimes = lktime.getTime();

    if (starttimes >= lktimes) {
        return false;
    } else
        return true;

}

/**
 * 跳转至提现页面
 */
function goCashPage(bounds,activIds){
    // 存储可提现奖金，供下个页面调用
    sessionStorage.cashfee = bounds;
    // 存储提现的奖金记录ID
    sessionStorage.activIds = activIds;
    var flag = jems.parsURL().params.flag;
    jems.goUrlFlag('cash-withdrawal.html?flag='+flag+'&isfee=2&cashfee='+bounds+'&activIds='+activIds);
}

/**
 * 活动选择事件
 */
function selectChange(){
    $('#activNolist').change(function(){
        activNo = $(this).val();
        $('#activity_bonus').empty();
        loadListData();
    });
}