/**
 @Js-name:goods-brandinfor.js
 @Zh-name:品牌信息详情页JS函数
 */
var ParHref = jems.parsURL(), menuId = 0, messageFlag = 0;
$(function(){
    var tmn=ParHref.params.tmn, 
        bid = ParHref.params.bid,
        totalPage = 1,
        pageNum = 1;
    //产品列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取当前品牌信息
    $.ajax({
        type : "get",
        url : msonionUrl+"product/brand?tmn="+tmn+"&brandId="+bid,
        dataType : "json",
        success:function(data){
            $("#brandlogo").css({"background-image":"url("+msPicPath+data.url+")"});
            $(".brandtit").html(data.name);
            //$("#brandnum").text(data.brand.remark);
            $("#brandinfo").html(data.remark);
            //微信分享
            jems.wxShare(data.name,msPicPath+data.url,data.remark);
        }
    });
    //获取当前详细页面的数据
    function listData() {
        if(pageNum > totalPage){
            $("#loading").show().html('到底了,没有更多商品了');
            return ;
        }
        $.ajax({
            type : "get",
            url : msonionUrl+"product/bybrandid?tmn="+tmn+"&brandId="+bid+"&pageNo="+pageNum,
            dataType : "json",
            success:function(json){
                $("#brandnum").text(json.totalCount);
                if(json.total == 0 || json.totalPage == 0){
                    $("#brandlist").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                    $("#loading").hide();
                }else {
                    jetpl('#brandlistData').render(json, function (html) {
                        $('#brandlist').append(html);
                        //$('#brandlist').html(html);
                    });
                    totalPage = json.totalPage
                    pageNum++;
                    $("#loading").hide();
                }
            }
        }); 
    }
    
    $(window).goTops({toBtnCell:"#gotop",posBottom: 40});
});

/**
 * 商品限购规则
 * @param gid	购买商品的id
 * @param mid	购买商品的分类id，如果是按指定商品限购，则分类id可以不用传
 * @param num	购买数量
 *
 */
function limitrule(gid,num,mid){
    var limit = true;
    var params = {"gid":gid,"buynum":num,"menuid":mid};
    var url = msonionUrl+"sodrest/sodlimit1";
    $.ajax({
        type:'get',
        url:url,
        data:params,
        dataType:'json',
        async:false,
        success:function(msg){
            var info = "该商品是限购商品";
            //info += "<br />限购日期："+msg.sdate+"~"+msg.edate;
            info += "<br />每人限购"+msg.limitNum+"件";
            msg.islimit&&jems.mboxMsg(info);
            limit = msg.islimit;
        }
    });
    return limit;
}
//添加购物车
var timer = null;
function addCart(tmn,goodsId,menuId){
    clearTimeout(timer);
    timer = setTimeout(function(){

        if(!limitrule(goodsId, 1,menuId)){	// 添加限购规则 2015-11-30

            $.ajax({
                type: "get",
                url: msonionUrl+"cart/add?tmnId="+tmn+"&goodsId="+goodsId+"&menuId="+menuId,
                dataType : "json",
                //jsonp:"callback",
                success: function(data){
                    var msg = "";
                    if(data.state == 5){
                        jems.goUrl("login.html?"+window.location.href);
                    }else{
                        if(data.state == -1){
                            msg = "对不起，洋葱商家无法使用本功能";
                        }else if(data.state == 0){
                            msg = "此商品加入购物车失败！";
                        }else if(data.state == 1){
                            msg = "此商品在商城中不存在！";
                        }else if(data.state == 2){
                            msg = "数量不能为空！";
                        }else if(data.state == 3){
                            jems.showCartNum();  // 重新计算购物车数量
                            msg = "恭喜加入购物车成功！";
                        }else if(data.state == 4){
                            msg = "终端不存在！";
                        }else if(data.state == 6){
                            msg = "此终端不存在！";
                        }else if(data.state == 7){
                            msg = "洋葱商家不能使用此功能！";
                        }else if(data.state == -2){
                            msg = "该商品购买数量不能超过"+data.limitNum+"件！";
                        }
                        jems.tipMsg(msg);
                    }
                }
            });

        }

    },500);
}

function buyNow(productId,price){
    var type = jems.memberType();
    if(type == 3 || type == 4){
        sessionStorage.buyId = productId+"_1";
        sessionStorage.buyPrice = price;
        jems.goUrl("ucenter/buy-order-sumbit.html");
    }else{
        jems.tipMsg("对不起，洋葱商家无法使用本功能");
    }
}