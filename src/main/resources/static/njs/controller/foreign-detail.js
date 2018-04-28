// JavaScript Document
var ParHref = jems.parsURL(window.location.href);
var params = ParHref.params;
var tmn = params.tmn;
var flag = true;
var id = params.id;
var isLogin = false;//是否登录
var memberType;
var carnumber = '';//购买数量
var goodsId = '';
var cartNum = 0;
var priceary = [];//最高价最低价
var selectArray = [];//已选择数组
var letSpecs = [];//所有sku信息
var leSpecs = [];//所有sku详细信息
var messageFlag = 0;//到货提醒
$(function () {
    //返回顶部插件引用
    $(window).goTops({toBtnCell: "#gotop", posBottom: 100});

    requestDeail(id);
    //加
    $(".cartadd").on("tap", function () {
        var carnum = $(this).prev();
        carnum.val(parseInt(carnum.val()) + 1);
        checkRule(null);
    })

    //减
    $(".cartmin").on("tap", function () {
        var carnum = $(this).next();
        var num = parseInt(carnum.val());
        if (num == 1) {
            jems.tipMsg("至少购买一件!");
            return;
        }
        carnum.val(num - 1);
        checkRule(null);
    })

    //确定
    $(".editSumit").on("tap", function () {
        var checkName = '';
        if (selectArray.length == 0) {
            letSpecs.forEach(function (val) {
                checkName += val.name + "     ";
            });
        }
        if (selectArray.length < letSpecs.length) {
            selectArray.forEach(function (v) {
                letSpecs.forEach(function (val) {
                    if (val.id != v.split("_")[1]) {
                        checkName += val.name + "     ";
                    }
                });
            });
        }
        if (checkName != '') {
            jems.tipMsg("请选择" + checkName);
            return;
        }
        if (goodsId != '') {
            $(this).parents(".editSize").hide();
            $(".editMask").hide();
            addCart();
        }
    });

    //修改尺寸弹窗
    $(".editMask ").bind("touchmove", function (e) {
        e.preventDefault();
    });

    $(".editMask ").on("click", function () {
        $(".editSize").hide();
        $(this).hide();
    });
    $(".editClose").on("click", function () {
        $(this).parents(".editSize").hide();
        $(".editMask").hide();
    });
    $(".onSelect span").on("click", function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
    $(".cartboxBtn").on("click", function () {
        var _this = $(this);
        var _sibling = $(this).parent().siblings();
        if (_sibling.is(":hidden")) {
            _this.addClass("btndown").removeClass("btnup");
            _sibling.show();
        } else {
            _sibling.hide();
            _this.addClass("btnup").removeClass("btndown");
        }
    });

    //跳转至购物车
    $("#myShopCart").on("tap", function () {
        if (checkMemberType()) {
            jems.goUrl("../wx/ucenter/cart.html")
            return;
        }
    });

    //关注
    $("#isAtten").on("tap", function () {
        if (!isLogin) {
            jems.goUrl("../wx/login.html?" + window.location.href);
            return;
        }
        if (checkMemberType()) {
            if ($(this).find("em").hasClass("msfavorgray")) {
                attenChange($(this), 0);
            } else {
                attenChange($(this), 1);
            }
        }
    });
});

/**
 * 最高价最低价排序显示
 * @returns
 */
function priceRange() {
    var minN = priceary[0];//最低价
    var maxN = priceary[priceary.length - 1];//最高价
    if (minN != maxN) {
        $("#freeprice").html("&yen" + minN + "~&yen" + maxN + "");
    } else {
        $("#freeprice").html("&yen" + minN + "");
    }
}

//关注状态切换
function attenChange(obj, status) {
    $.ajax({
        type: "post",
        url: msonionUrl + "myatten/add",
        data: {"goodsId": id, "tmn": tmn},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            if (result.state == 2) {
                obj.find("em").addClass("msfavorpurple");
                $("#isAtten span").text("已关注");
            }
            else {
                jems.tipMsg("此商品已在关注中!");
                return;
            }
        }
    });
}

function checkMemberType() {
    if (memberType == 2) {
        jems.tipMsg("对不起,洋葱商家无法使用本功能");
        return false;
    } else {
        return true;
    }
}

//选择颜色和尺寸
function checkRule() {//对应颜色
    carnumber = $("input[name='cartname']");
    var carcheck = $("#ischeck");//已经选择对象
    var displayval = "";

    //说明已经选择了
    if (selectArray.length > 0) {
        selectArray.forEach(function (item) {
            item = item.split("_");
            var id = item[0];
            var type = item[1];
            letSpecs.forEach(function (v) {
                if (v.id == type) {
                    v.data.forEach(function (val) {
                        if (val.id == id) {
                            displayval += val.name + "     ";
                        }
                    });
                }
            });
        });

        if (selectArray.length == letSpecs.length) {
            //确定用户选择的某一款
            var arr = [];//
            for (var i = 0; i < selectArray.length; i++) {
                var id = parseInt(selectArray[i].split("_")[0]);
                //用户已选商品Id数组
                arr.push(id);
            }
            var i = 0;
            for (var j = 0; j < leSpecs.length; j++) {
                var specs = leSpecs[j].specs;
                i = 0;
                for (var m = 0; m < specs.length; m++) {
                    if ($.inArray(specs[m].id, arr) > -1) {
                        ++i;
                    } else {
                        break;
                    }
                    //已经确定好客户选的是哪一款了
                    if (i == arr.length) {
                        goodsId = leSpecs[j].id;
                        $(".photo img").attr("src", msPicPath + leSpecs[j].mainPicUrl + "?x-oss-process=image/resize,w_200");
                        $("#freeprice").html("&yen" +  leSpecs[j].freePrice + "");
                    }
                }
            }
        }
    }
    carcheck.html(displayval + "   " + carnumber.val() + "件  ");
    priceRange();
}


//请求详情数据
function requestDeail() {
    if (id == "" || id == null) {
        jems.tipMsg("不合理的请求!")
        return;
    }
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/getDetailItem",
        data: {
            "id": id
        },
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var parahtml = ''//商品参数html
            var pichtml = '';
            var hdhtml = '';
            var productParaHtml = '';
            var youLikeHtml = '';//猜你喜欢
            var iskeyArray = [];//关键属性数组
            var notkeyArray = [];//非关键属性
            if (10000 == result.errCode) {
                var data = result.data.realData;
                isLogin = result.data.isLogin;
                memberType = result.data.memberType;
                jems.wxShare(data.name, msPicPath + data.mainPicUrl, undefined);
                if (result.data.cartNum != undefined && result.data.cartNum > 0) {
                    cartNum += result.data.cartNum;
                    $("#cartNum").show();
                    $("#cartNum").html(cartNum);//购物车数量
                }

                //猜你喜欢
                if (data.proInfos.length > 0) {
                    $("#guessLike").prev().css("display", "");
                    $("#guessLike").css("display", "-webkit-box!important");
                    data.proInfos.forEach(function (v) {
                        youLikeHtml += '<li data-type=' + v.type + ' data-id = ' + v.id + '>';
                        youLikeHtml += '<p class="imgs"><img src="' + msPicPath + '' + v.mainPicUrl + '"></p>';
                        youLikeHtml += '<p class="txtells pl5 pr5 f12">' + v.name + '</p>';
                        youLikeHtml += '<p class="pl5 pr5 tl"><span class="purple mr15 f14">&yen;' + v.freePrice + '</span></p>';
                        youLikeHtml += '</li>';
                    })
//                	youLikeHtml+='<li class="btnMone" onclick="jems.goUrl()"><img src="nimages/btn_more.png"></li>';
                    $("#guessLike ul").html(youLikeHtml);
                } else {
                    $("#guessLike").prev().css("display", "none");
                    $("#guessLike").css("display", "none !important");
                }

                $("#guessLike ul li").on("tap", function () {
                    if ($(this).attr("data-type") == 1) {
                        jems.goUrl("foreign-detail.html?id=" + $(this).attr("data-id"));
                    } else {
                        jems.goUrl("goods-details.html?id=" + $(this).attr("data-id"));
                    }
                })

                //商品属性
                data.goodsProps.forEach(function (v, index, array) {
                    if (v.isKey == 1) {
                        iskeyArray.push(v);
                    } else {
                        notkeyArray.push(v);
                    }
                });
                //非主要属性
                notkeyArray.forEach(function (v) {
                    if (v.propValue != "") {
                        parahtml += '<p class="g9">' + v.propName + '：<span class="g3">' + v.propValue.replace(/#/g, '</br>') + '</span></p>';
                    } else if (v.picUrl != "") {
                        parahtml += '<p class="g9">' + v.propName + '：<span class="g3"></span></p><img src="' + msPicPath + '' + v.picUrl + '" />';
                    }
                });
                $("#Param").html(parahtml);
                //主要属性
                iskeyArray.forEach(function (v) {
                    if (v.picUrl != "") {
                        productParaHtml += '<h3 class="f15 mb15 mt10">' + v.propName + ' <span class="f13 g9">' + v.enName + '</span></h3><img src="' + msPicPath + '' + v.picUrl + '" />';
                    } else {
                        productParaHtml += '<h3 class="f15 mb15 mt10">' + v.propName + ' <span class="f13 g9">' + v.enName + '</br >' + v.propValue.replace(/#/g, '</br>') + '</span></h3>';
                    }
                });
                $("#productParam").append(productParaHtml);

                data.goodsPics.forEach(function (v) {
                    pichtml += '<li>';
                    pichtml += '<div class="conpic">';
                    pichtml += '<span class="" style="background-image: url(' + msPicPath + '' + v.picUrl + ');"></span>';
                    pichtml += '</div>';
                    pichtml += '</li>';
                    hdhtml += '<li></li>';
                });
                $("#foreignSilder .bd ul").html(pichtml);
                $("#foreignSilder .hd ul").html(hdhtml);
                //名称
                $("h3[data-name=\"name\"]").html(data.name);
                //售价
                $("p[data-price=\"price\"] span").html("&yen" + data.freePrice);
                //标价
                $("p[data-price=\"price\"] del").html("&yen" + data.marketPrice);
                //如果没有mainPicUrl则取轮播图的第一张
                if (data.mainPicUrl == "" || data.mainPicUrl == undefined) {
                    $(".photo span img").attr("src", "" + msPicPath + "" + data.goodsPics[0].picUrl + "?x-oss-process=image/resize,w_200");
                } else {
                    $(".photo span img").attr("src", "" + msPicPath + "" + data.mainPicUrl + "?x-oss-process=image/resize,w_200");
                }

                //产品详情(轮播图)
                if ($('#foreignSilder .bd li').length > 0) {
                    jeSlide({
                        mainCell: "#foreignSilder",
                        navCell: ".hd ul",
                        conCell: ".bd ul",
                        effect: "leftLoop",
                        duration: 4,
                        pageStateCell: ".pageState",
                        switchCell: ".datapic",
                        sLoad: "data-pic",
                        isTouch: true,
                        showNav: true,//自动分页
                        autoPlay: $('#foreignSilder .bd li').length > 1 ? true : false  //自动播放
                    });
                }
                messageFlag = data.messageFlag;
                //状态显示
                saleState(data.qty, data.saleState, $(".tempWrap"));
                //购物车按钮显示
                cartBtnState(data.qty, data.saleState, data.leStat, $("#godsaddCart"), data.messageFlag);
                var skuName = '';
                var skuhtml = '';
                letSpecs = data.letSpecs;
                leSpecs = data.leSpecs;
                //存在数组
                var existsArray = result.data.existsArray;
                letSpecs.forEach(function (v, index) {
                    skuName += v.name + '、';
                    skuhtml += '<h3 class="f12 pl10 pr10" data-sku="sku' + index + '">' + v.name + '</h3>';
                    skuhtml += '<div class="mt10  onSelect pl5 pr5">';
                    v.data.forEach(function (val) {
                        //如果下架.或者子商品都没有库存,则灰色显示
                        if (existsArray.length == 0) {
                            skuhtml += '<span class="select rdu3 notSe" data-index="' + index + '" data-skuid="' + val.id + '" data-skutype="' + v.id + '">' + val.name + '</span>';
                        } else {
                            //只有一款子商品的情况下
                            if(leSpecs.length == 1){
                                skuhtml += '<span class="select rdu3 on" data-index="' + index + '" data-skuid="' + val.id + '" data-skutype="' + v.id + '">' + val.name + '</span>';
                                selectArray.push(val.id + "_" + v.id);
                                checkRule();
                            } else {
                                //只有一组sku的时候
                                if(letSpecs.length == 1){
                                    if($.inArray(val.id.toString(),existsArray)== -1){
                                        skuhtml += '<span class="select rdu3 notSe" data-index="' + index + '" data-skuid="' + val.id + '" data-skutype="' + v.id + '">' + val.name + '</span>';
                                    } else {
                                        skuhtml += '<span class="select rdu3" data-index="' + index + '" data-skuid="' + val.id + '" data-skutype="' + v.id + '">' + val.name + '</span>';
                                    }
                                } else {
                                    skuhtml += '<span class="select rdu3" data-index="' + index + '" data-skuid="' + val.id + '" data-skutype="' + v.id + '">' + val.name + '</span>';
                                }
                            }
                        }
                    });
                    skuhtml += '</div>';
                });
                skuName = skuName.substr(0, skuName.length - 1);
                //sky选择显示
                $("#skuDisplay").html(skuName);
                $("#skuItem").prepend(skuhtml);

                //sku选择点击
                $("span[data-skutype]").on("tap", function () {
                    var type = $(this).attr("data-skutype");
                    var skuid = $(this).attr("data-skuid");
                    var skuindex = $(this).attr("data-index");
                    if (!$(this).hasClass("notSe")) {
                        //取消选中
                        if ($(this).hasClass("on")) {
                            $(this).removeClass("on");
                            //删除已选元素
                            selectArray.forEach(function (v, index) {
                                var spl = v.split("_");
                                if (spl[0] == skuid && spl[1] == type) {
                                    selectArray.splice(index, 1);
                                }
                            });
                            $("span[data-skutype]").each(function (i) {
                                var skutype = $(this).attr("data-skutype");
                                //把另外一项的sku移除灰色
                                if (skutype != type) {
                                    $(this).removeClass("notSe");
                                }
                            });
                            //选中
                        } else {
                            $(this).siblings().removeClass("on");
                            $(this).addClass("on");
                            //删除已选元素
                            selectArray.forEach(function (v, index) {
                                var spl = v.split("_");
                                if (spl[1] == type) {
                                    selectArray.splice(index, 1);
                                }
                            });
                            //加入选中数组,格式为id_类型
                            selectArray.push($(this).attr("data-skuid") + "_" + type);

                            var indexArry = [];
                            var arr = [];
                            $("span[data-skutype]").each(function (i) {
                                var that = $(this);
                                var skutype = that.attr("data-skutype");
                                //把需要循环的索引加到对应的数组
                                if (skutype != type) {
                                    var index = that.attr("data-index");
                                    if ($.inArray(index, indexArry) == -1) {
                                        indexArry.push(index);
                                    }
                                }
                            });
                            //根据索引取出对应有的sku加入数组
                            indexArry.forEach(function (v) {
                                if (indexArry.length > 0) {
                                    existsArray.forEach(function (val) {
                                        var id = val.split("_")[skuindex];
                                        if ($.inArray(id, arr) == -1 && id == skuid) {
                                            arr.push(val.split("_")[v]);
                                        }
                                    });
                                }
                            });
                            //如果sku不在有的范围内则移除掉灰色状态.如果没有则加灰色状态不让点击
                            $("span[data-skutype]").each(function (i) {
                                var skuid = $(this).attr("data-skuid");
                                var skutype = $(this).attr("data-skutype")
                                if (skutype != type) {
                                    if (arr.length != 0) {
                                        if ($.inArray(skuid, arr) == -1) {
                                            $(this).addClass("notSe");
                                        } else {
                                            $(this).removeClass("notSe");
                                        }
                                    } else {
                                        $(this).addClass("notSe");
                                    }
                                }
                            });
                        }
                    }
                    checkRule();
                });

                if (data.leSpecs != undefined) {
                    data.leSpecs.forEach(function (v) {
                        priceary.push(v.freePrice);
                        priceary.sort(function (a, b) {
                            return a - b;
                        });
                    });
                    priceRange();
                }
                $("#detaildesc").html(data.goodsDesc);
                //是否关注
                result.data.isAtten == 1 ? $("#isAtten em").addClass("msfavorgray") : $("#isAtten em").addClass("msfavorpurple");
                result.data.isAtten == 1 ? $("#isAtten span").text("关注") : $("#isAtten span").text("已关注");
                //详情页视频
                if (result.data.realData.videoUrl == undefined || result.data.realData.videoUrl == "") {
                    $("#movie").remove();
                } else {
                    var videos = $("<video/>", {
                        "webkit-playsinline": "true",
                        "playsinline": "true",
                        "x5-video-player-type": "h5",
                        "x5-video-player-fullscreen": "true",
                        "preload": "none",
                        "width": "100%",
                        "controls": "controls",
                        "poster": ""
                    });
                    var source = $("<source/>", {"src": result.data.realData.videoUrl, "type": "video/mp4"});
                    $("#movie").append(videos.append(source));
                }
            }
            else {//请求出错了
                jems.tipMsg(result.errMsg)
                return;
            }
        }
    });
}

//添加购物车
var timer = null;

function addCart() {
    clearTimeout(timer);
    if (params.menuId == undefined) {
        params.menuId = 0;
    }
    timer = setTimeout(function () {
        $.ajax({
            type: "post",
            data: {"goodsId": goodsId, "num": carnumber.val()},
            url: msonionUrl + "app/cart/add/v2",
            dataType: "json",
            success: function (result) {
                if (result.errCode == 4001 || result.errCode == 4002) {	// 如果未登录，则跳至登录页面
                    jems.goUrl("../wx/login.html?" + window.location.href);
                } else if (result.errCode == 10000) {
                    jems.tipMsg(result.errMsg);
                    cartNum += Number(carnumber.val())
                    $("#cartNum").html(cartNum);//购物车数量
                } else {
                    jems.tipMsg(result.errMsg);
                }
            }
        });
    }, 500);
}

/**
 * 商品状态显示
 */
function saleState(qty, sale, picCell) {
    if (qty <= 0) {
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
}

/**
 * 购物车按钮状态
 */
function cartBtnState(qty, sale, leStat, addCartid, messageFlag) {
    if (qty <= 0) {
        if (sale != undefined && (sale == 2 || sale == 3 || sale == 6 || sale == 7 || sale == 8 || sale == 9)) {
            addCartid.css("background", "#aaa").text("暂时下架");
        } else {
            if (messageFlag == 1) {
                addCartid.css("background", "#aaa").text("到货提醒").on('tap', arrivalNotice);
            } else if (messageFlag == 2) {
                addCartid.css("background", "#7E56C6").text("取消提醒").on('tap', arrivalNotice);
            }
        }
    } else {
        if (leStat == 2) {
            addCartid.css("background", "#aaa").text("暂时下架");
        } else {
            var goname = (sale == 5 || sale == 10) ? "提前加入购物车" : "加入购物车";
            addCartid.text(goname).on('tap', function () {
                if (checkMemberType()) {
                    $(".editMask ").show();
                    $(".editSize").show();
                }
            });
            $(".edit").on("click", function () {
                $(".editMask ").show();
                $(".editSize").show();
            });
        }
    }
}

/**
 * 到货提醒
 * @type {boolean}
 */
var firstClick = true;

function arrivalNotice() {
    if (!firstClick) return "";
    firstClick = false;
    $.ajax({
        type: "post",
        data: {"gid": id, "messageFlag": messageFlag},
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