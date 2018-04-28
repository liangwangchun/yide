// JavaScript Document
var ParHref = jems.parsURL( window.location.href );
$(function(){
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;

    var params = ParHref.params;
    var tmn = params.tmn, brandId = params.brandId, countryId = params.country;
    //产品列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取商品列表的数据
    function listData() {
        loadFlg=false;
        var bcUrl = (brandId && "product/bybrandid?brandId="+brandId) || (countryId && "product/bycountry?country="+countryId)
        $.ajax({
            type : "get",
            url : msonionUrl+bcUrl+"&pageNo="+pageNum+"&tmn="+tmn,
            dataType : "json",
            beforeSend:function(){
                $("#loading").show();
            },
            success:function(data){
                if(data.total == 0 && data.totalPage == 0){
                    $("#goodsList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                    $("#loading").hide();
                }else{
                    var gettpl = $('#godslistData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#goodsList').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                    //图片延迟加载插件引用
                    $('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
                    if(pageNum>totalPage){
                        $("#loading").show().html('到底了,没有更多商品了');
                    }else {
                        setTimeout(function () {
                            $("#loading").hide();
                        }, 4000);
                    }
                }
                loadFlg = true;
            }
        });
    }
    //进行商品搜索
    $("#searchBtn").on('tap',function(){
        var sosVal = $("#formalSearchTxt").val();
        if(sosVal == "") {
            jems.tipMsg("关键字不能为空");
        }else {
            if (!jems.specialStr(sosVal)) {
                jems.tipMsg("不能有非法字符");
            } else {
                jems.goUrl(mspaths + 'search-list.html?keywords=' + encodeURI(encodeURI(sosVal)));
            }
        }
    });
    //显示购物车数量
    jems.showCartNum();
    //返回顶部插件引用
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
                        jems.mboxMsg(msg);
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
                    $(ele).removeClass("graysc").addClass("redsc");
                    msg = "商品收藏成功！";
                }else if(data.state == 3){
                    msg = "洋葱商家不能使用此功能！";
                }
                jems.mboxMsg(msg);
            }
        }
    });
}

function buyNow(productId,price){
	var type = jems.memberType();
	if(type == 3 || type == 4){
    jems.akeyOrder(productId,price);
	}else{
		jems.tipMsg("对不起，洋葱商家无法使用本功能");
	}
}