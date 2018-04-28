var ParHref = jems.parsURL(),
    param = ParHref.params,tmnid = param.tmn;

$(function () {
    $(".ms-tab li").on("click",function () {
        var _this = $(this);
        var index = $(this).index();
        if (_this.has("act")){
            $(".tabbox_"+index).removeClass("hide").siblings().addClass("hide");
            _this.addClass("act").siblings().removeClass("act");
        }
    });
    
    $.ajax({
        type : "get",
        url : msonionUrl+"magmain/view?id="+param.id+"&tmn="+param.tmn,
        cache:true,
        dataType : "json",
        success:function(json) { 
            var mzlistdata ={data:json.magazineList},
                prdlistdata ={data:json.productsList.sort(jems.compare('qty'))};
             
            //$("#videodetailTitle").html(json.title);
            jetpl("#videoDetaildata").render(json, function(html){
                $('#videoDetail').html(html); 
                if(json.originalUrl != undefined && json.originalUrl !=""){
                   $("#original").on("click",function () {
                       jems.goUrl(json.originalUrl)
                   }).show(); 
                }
            });
            jetpl("#aboutCountdata").render(mzlistdata, function(html){
                $('#aboutCount').html(html);
            });

            jetpl("#productlistData").render(prdlistdata, function(html){
                $('#productlist').html(html);
            });
            //获取阅读与点赞数
            $.get(msonionUrl+'magmain/getMag?id='+param.id, function(res){
                $("#browse").html(res.browseCount.toString());
                $("#thumbup").html(res.thumbUpCount.toString());
            },"json");
            //增加点赞数
            $("#thumbup").one("click",function () {
                var that = $(this);
                $.getJSON(msonionUrl+'magmain/updateThumbUp?id='+param.id, function(res){
                    that.text(res.data);
                });
            });
            jems.wxShare(json.title,msPicPath+json.cover);
        }
    });
    jems.fixMenu();
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 55});
}) ;

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


