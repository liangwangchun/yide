/**
 * Created by onion on 2017/8/16.
 */
var ParHref = jems.parsURL();
$(function(){
    // 滚动图片
    var params = ParHref.params;
    var tmn = params.tmn;
    
    //内容展开收缩
    var about_str = $(".about-js").html().length;
    if (about_str>100){
        $(".aboutbtn").addClass("show");
    }else{
        $(".aboutbtn").removeClass("show");
    }
    $(".aboutbtn").on("click",function (){
        var _this = $(this);
        if(_this.hasClass("downbtn")){
            $(".about-js").removeClass("aboutcont-hide");
            _this.addClass("upbtn").removeClass("downbtn").html("收起");
        }else{
            $(".about-js").addClass("aboutcont-hide");
            _this.addClass("downbtn").removeClass("upbtn").html("展开");
        }
    });
    //热销好货
    $("#hotgoods").on("click",function () {
        jems.goUrl(msonionUrl+"wx/flagView?flagId="+params.id);
    });
    // ONION TV
    if ($("#vidonion .bd li").length > 0) {
        jeSlide({
        	mainCell: "#vidonion",
        	navCell: ".hdvid",
        	conCell: ".bd ul",
            effect: "curtain",
            duration: 4,
//            pageStateCell:".pageState",
//            switchCell: ".datapic",
            sLoad: "data-pic",
            isTouch:true,
            showNav: true,//自动分页
            autoPlay: false  //自动播放
        });
    }
    jems.fixMenu();
    //微信分享
    jems.wxShare($("title").text(),wxShareimg,wxSharetxt);
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    //返回顶部插件引用
    $(window).goStick({btnCell:"#gotop",posBottom: 50});
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

//添加收藏
function addAtten(tmn,goodsId){
    var ele = event.target;
    $.ajax({
        type: "get",
        url: msonionUrl+"myatten/add?tmn="+tmn+"&goodsId="+goodsId,
        dataType : "json",
        //jsonp:"callback",
        success: function(data){
            var msg = "";
            if(data.state == -1){  //帐户未登录或无权限
                jems.goUrl("login.html?"+window.location.href);
            }else{
                if(data.state == 0){
                    msg = "此商品收藏失败！";
                }else if(data.state == 1){
                    msg = "此商品已在收藏夹中！";
                }else if(data.state == 2){
                    $(ele).removeClass("btn-favorite").addClass("btn-favoriteAcur");
                    msg = "商品收藏成功！";
                }else if(data.state == 3){
                    msg = "洋葱商家不能使用此功能！";
                }
                jems.tipMsg(msg);
            }
        }
    });
}


function buyNow(productId,price){
    var type = jems.memberType();
    if(type == 3 || type == 4){
        sessionStorage.buyId = productId+"_1";
        sessionStorage.buyPrice = price;
        jems.goUrl(msonionUrl+"/wx/ucenter/buy-order-sumbit.html");
    }else{
        jems.tipMsg("对不起，洋葱商家无法使用本功能");
    }
}