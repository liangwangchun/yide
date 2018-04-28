/**
 * 准合伙人收入明细
 * author:wh
 * 2016-09-13
 */
var params = jems.parsURL().params;			// 终端
var ispartner = 0;	// 标识是合伙人还是开发商
$(function(){
   // tmn = returnTmnNo();
    ispartner = params.ispartner;
    loadPartnerList();
    //准合伙人预计班费
    unSumfee();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 70});

    //返回店主中心  
    jems.backStore();
});

/**
 * 载入店铺数据
 */

function loadPartnerList(){
    $("#loadaimbox i").show(); 
    $("#loadaimbox em").text('正在努力加载');
    //产品列表
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
        var url = msonionUrl+"income/unPartnerListV2";
        var data = {"pageNo":pageNum};
        $.ajax({
            type : "post",
            url : url,
            data:data,
            dataType : "json",
            success:function(data){
                if(data==-1){jems.goUrl('login.html');return;}
                data.totalpage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#partnerListData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#partnerList').append(html);
                    });
                    totalPage = data.totalpage;
                    pageNum++;
                    loadFlg = true;
                }
            }
        });
    }
}

/**
 * 准合伙人预计班费
 */
function unSumfee(){
    // 获取累计班费
    $.ajax({
        'url':msonionUrl+"income/unSumfeeV2",
        'dataType':'json',
        'success':function(result){
            if(result.code == 0){
                if(result.ispartner == 3){
                    $('#cashable2').text(result.fee);
                    $("#uncashable").show();
                }
            }
        }
    });
}
