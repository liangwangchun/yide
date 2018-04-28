var ParHref = jems.parsURL(), menuId = 0, messageFlag = 0, tmn = "", gid = "";
var pageNo = 1,totalPage;
$(function () {
    
	tmn = ParHref.params.tmn, gid = ParHref.params.id;
    // 获取素材库数据	
    

    $(window).dropload({afterDatafun: listData});
	
	getCurrentGoodsInfo();
  //返回顶部插件引用
    $(window).goStick({
        fixed: "fixed",
        btnCell: "#gotop",
        posBottom: 55
    });
   
 // 显示购物车数量
    jems.showCartNum();
    jems.fixMenu();
    
})
function listData(){
    if(pageNo>totalPage) return;
    $.ajax({
        type : "post",
        async: false,
        url : msonionUrl+"app/productMaterial/getPictureMaterial/v3",
        data:{leId:gid,type:1,pageNo:pageNo,pageSize:15},
        dataType : "json",
        success:function(result){
            if(result.errCode == 10000){
                totalPage = result.totalPage;
            	jetpl('#leftData').render(result, function (htmls) {
                    $("#left").append(htmls);
                });
                jetpl('#rightData').render(result, function (htmls) {
                    $("#right").append(htmls);
                });
                pageNo++;
            }
        }
    });
}
// 关注 购物车 购买的所有逻辑
function getCurrentGoodsInfo(){
	//获取产品详情的服务器数据
    $.ajax({
        type: "get",
        url: msonionUrl + "product/goodsinfo?tmn=" + tmn + "&gid=" + gid,
        dataType: "json",
        success: function (data) {  	
            // 存放分类id,供限购功能使用
            menuId = data.category.id;
            var picCell = $("#detailpic"),
                sale = data.saleState;
            if (data.qty <= 0) {
                if (sale == 2 || sale == 9) {
                    picCell.addClass("soldout2");
                } else if (sale == 3 || sale == 6 || sale == 8) {
                    picCell.addClass("soldout3");
                } else if (sale == 5 || sale == 10) {
                    picCell.addClass("soldout5");
                } else if (sale == 4) {
                    picCell.addClass("soldout4");
                } else if (sale == 7) {
                    picCell.addClass("soldout7");
                } else {
                    picCell.addClass("soldout1");
                }
            } else {
                if (sale == 6 || sale == 8) {
                    picCell.addClass("soldout3");
                } else if (sale == 5 || sale == 10) {
                    picCell.addClass("soldout5");
                } else if (sale == 7) {
                    picCell.addClass("soldout7");
                } else if (sale == 4) {
                    picCell.addClass("soldout4");
                }
            }
            
            var rets = data.proInfos;

            // 是否收藏效果判断
            var isAtten = data.isAtten;
            if (isAtten == 0) {
                $("#isAtten").find("em").removeClass("msfavorgray").addClass("msfavorpurple");
                $("#isAtten").find("span").text("已关注");
            } else {
                $("#isAtten").find("span").text("关注");
            }
            //点击收藏商品
            $("#isAtten").on('click', function () {
                addAtten(ParHref.params.tmn, ParHref.params.id);
            });
            //判断商品是否有货
            messageFlag = data.messageFlag;
            var addCartid = $("#godsaddCart");
            if (data.qty <= 0) {
                if (sale != undefined && (sale == 2 || sale == 3 || sale == 6 || sale == 7 || sale == 8 || sale == 9)) {
                    addCartid.css("background", "#aaa").text("暂时下架");
                } else {
                    if (messageFlag == 1) {
                        addCartid.css("background", "#aaa").text("到货提醒").on('click', arrivalNotice);
                    } else if (messageFlag == 2) {
                        addCartid.css("background", "#4b0d65").text("取消提醒").on('click', arrivalNotice);
                    }
                }
            } else {
                if (data.leStat == 2) {
                    addCartid.css("background", "#aaa").text("暂时下架");
                } else {
                    if (data.isSingleOrder != undefined && data.isSingleOrder == 1) {
                        addCartid.text("一键下单").on('click', function () {
                            if (sale == 5 || sale == 10) {
                                jems.tipMsg("预热商品暂不可下单");
                                return;
                            } else {
                                buyNow(data.id, data.freePrice);
                            }
                        });
                    } else {
                        var goname = (sale == 5 || sale == 10) ? "提前加入购物车" : "加入购物车";
                        addCartid.text(goname).on('click', function () {
                            jems.addCart(tmn,gid);
                        });
                    }
                }
            }
            //判断是否显示团购入口
            if (data.isGroup) {
                if (0 == data.groupFlag) {
                    $("#groupPrice").html("&yen;" + jems.formatNum(data.productGroup.groupPrice));
                    $("#groupInlet").show().on("click", function () {
                        jems.goUrl("group-details.html?id=" + data.productGroup.groupId);
                    });
                }
            }
               
            /*****微信分享*****/
            jems.wxShare(data.name,msPicPath + data.goodsPics[0].picUrl);
            //获取详情页中内容的图片元素
        }
    });
}

//添加收藏（关注）
function addAtten(tmn, goodsId) {
    var ele = event.target;
    $.ajax({
        type: "get",
        url: msonionUrl + "myatten/add?tmn=" + tmn + "&goodsId=" + goodsId,
        dataType: "json",
        //jsonp:"callback",
        success: function (data) {
            var msg = "";
            if (data.state == -1) { //帐户未登录或无权限
                jems.goUrl("login.html?" + window.location.href);
            } else {
                if (data.state == 0) {
                    msg = "此商品关注失败！";
                } else if (data.state == 1) {
                    msg = "此商品已在关注中！";
                } else if (data.state == 2) {
                    $("#isAtten").find("em").removeClass("msfavorgray").addClass("msfavorpurple");
                    $("#isAtten").find("span").text("已关注");
                    msg = "商品关注成功！";
                } else if (data.state == 3) {
                    msg = "洋葱商家不能使用此功能！";
                }
                jems.mboxMsg(msg);
            }
        }
    });
}//到货提醒
var firstClick = true;

function arrivalNotice() {
    if (!firstClick) return "";
    firstClick = false;
    $.ajax({
        type: "post",
        data: {
            "gid": gid,
            "messageFlag": messageFlag
        },
        url: msonionUrl + "message/createArrivalNotice?v_=" + new Date().getTime(),
        dataType: "json",
        success: function (data) {
            if (data.errCode == 0) {
                jems.goUrl("login.html?" + window.location.href);
            } else {
                window.location.reload();
            }
        }
    });
}

// 立即购买
function buyNow(productId, price) {
    var type = jems.memberType();
    if (type == 3 || type == 4) {
        jems.akeyOrder(productId, price);
    } else {
        jems.tipMsg("对不起，洋葱商家无法使用本功能");
    }
}