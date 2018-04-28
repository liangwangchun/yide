/**
 *Js-name:stores-order-all.js
 *Zh-name:订单管理
 */
var dataobj = {};
$(function(){
    loadSodList();
    $("#ordersosBtn").on('tap',search);
    // 显示购物车数量
    jems.showCartNum();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom:100});
});
function loadSodList(){
    //产品列表
    var pageNum = 1, totalPage = 1, loadFlg = true;
    var ParHref = jems.parsURL(), param = ParHref.params;
    // 取消之前绑定的滚动事件，载入数据时重新绑定
    $(window).off("scroll");
    //产品列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取商品列表的数据
    function listData() {
        if(!loadFlg)return false;
        param.pageNo = pageNum;
        $.extend(param,dataobj);
        if(pageNum>totalPage){
            $("#loading").show().html('到底了,没有更多订单了');
            return;
        }
        loadFlg=false;
        var url = msonionUrl+"sodrest/storeOrdersMerge";
        $.ajax({
            type : "post",
            url : url,
            data : param,
            dataType : "json",
            success:function(result){
                result.totalPage>1?$("#loading").show():$("#loading").hide();
                if(result.state && result.state == -1){	// 没登录
                    jems.goUrl(mspaths+"login.html?"+window.location.href);
                }else if(result.state && result.state == 4){	// 普通会员
                    jems.mboxMsgIndex("只有店主可见!");
                }else if(result.total == 0){	// 没数据
                    $("#sodOrderList").html("<p class='p15 tc f14'>暂无订单信息！</p>");
                    $("#loading").hide();
                }else{
                    $("#shoporde_nocart").hide();
                    var gettpl = $('#sodlistData').html();
                    jetpl(gettpl).render(result, function(html){
                        $('#sodOrderList').append(html);
                    });
                    $(".sodyusu").on("tap",function () {
                        var hli = $(this).parent("li").find(".sodhide");
                        if(hli.css("display") == "none"){
                            hli.css({display:""});
                            $(this).find("span").addClass("actcurr");
                            $(this).find("span ins").text("隐藏");
                        }else {
                            hli.css({display:"none"});
                            $(this).find("span").removeClass("actcurr");
                            $(this).find("span ins").text("显示");
                        }
                    });
                    $(".isstorebot").each(function(){
                        if($(this).children().length == 0 || $(this).attr("storebot") == "no"){
                            $(this).css({"display":"none!important"});
                        }
                    })
                    totalPage = result.totalPage;
                    pageNum++;
                }
                loadFlg = true;
            }
        });
    }
}
/*收款与支付按钮事件*/
function dealerPay(sodId){
    // 将按钮改为支付按钮，并改写事件
    var ele = $(event.target);
    $.ajax({
        type:'get',
        url:msonionUrl+'sodrest/dealer',
        data:'sodId='+sodId,
        dataType:'json',
        success:function(msg){
            if(msg>0){
                jems.tipMsg('收款成功！');
                ele.text('支付');
                ele.removeAttr('onclick');
                ele.on('click',function(){
                    //跳向支付页面
                    jems.goUrl(mspaths+'payment.html?sodId='+sodId);
                });
            }
        }
    });
}
/*订单利润*/
function orderProfit(id){
    var params = {'sodId':id,'d':new Date().getTime()};
    $.ajax({
        type : "get",
        url : msonionUrl+"sodrest/showiteminfo",
        data:params,
        dataType : "json",
        success:function(result){
            mBox.open({
                width:"90%",
                height:"50%",
                content:createHtml(result),
                closeBtn: [false],
                btnName:['确定'],
                btnStyle:["color: #0e90d2;"],
                maskClose:false
            })
        }
    })
}
function createHtml(arrObj){
    var htmStr='';
    var gettpl = $('#itemIncomeData').html();
    jetpl(gettpl).render(arrObj, function(html){
        htmStr = html;
    });
    return htmStr;
}
/**
 * 订单搜所框事件
 */
function search(){
    var searchKey = $('#formalSearchTxt').val();
    if(searchKey){
        if(!jems.specialStr(searchKey)){
            jems.tipMsg("不能有非法字符");
        }else{
            // 添加关键字参数
            dataobj.searchWords = $.trim(searchKey);
        }
    }else{
        delete dataobj.searchWords;
    }
    $('#sodOrderList').empty();
    loadSodList();
}