//JavaScript Document
var ParHref = jems.parsURL();
var params = ParHref.params;
var tmn = params.tmn, keywords = params.keywords, maxamt = params.maxamt;
var spriceOrder = 0, pageNum = 1;
var totalPage = 1;
var loadown = true;
var title, brandIds, menuIds, countryIds, minamt;
var isFisrtMag = true;
var isFisrtGoods = true;
var tabIndex = 0;
var isgoodsfinish = true;
//美物志相关js
var pageNumMag = 1;
var totalPageMag = 1;
var isMagfinish = true;
$(function () {
    keywords = decodeURI(decodeURI(keywords));
    // 商品 美物志 进行切换
    $(".menuTabs .topnav li").on("tap", function () {
        changeTab($(this));
    })
    $('#formalSearchTxt').on("change", function () {
        isFisrtMag = true;
        isFisrtGoods = true;
        keywords = $(this).val();
    });

    function changeTab(that) {
        that.addClass('on').siblings().removeClass('on');
        var index = that.index();
        if (index == 0) {
            $('#goodscontainer').css('display', 'block');
            $('#goodslogcontainer').css('display', 'none');
            $('.navsobar').css("display", "block!important");
            tabIndex = 0;
            if (isFisrtGoods) {
                $(window).dropload({afterDatafun: listData});
                $("#goodsList").empty();
                isFisrtGoods = false;
            }
        } else {
            $(".navsocon").hide();
            $("#navsomask").hide();
            $('#goodscontainer').css('display', 'none');
            $('#goodslogcontainer').css('display', 'block');
            $('.navsobar').css("display", "none!important");
            tabIndex = 1;
            if (isFisrtMag) {
                $("#goodsLogList").empty();
                $(window).dropload({afterDatafun: listMagMainData});
                isFisrtMag = false;
            }
        }
    }

    if(params.index != 1){
        changeTab($(".menuTabs .topnav li").eq(0));
    } else {
        changeTab($(".menuTabs .topnav li").eq(1));
    }
    // isFisrtGoods = false;
    if (maxamt) {
        $("#formalSearchTxt").val(keywords != undefined ? keywords : decodeURI(decodeURI("金额小于" + maxamt + "元的商品")));
    } else {
        keywords = keywords == undefined ? "" : keywords;
        $("#formalSearchTxt").val(decodeURI(decodeURI(keywords)));
    }
    maxamt = params.maxamt != undefined ? params.maxamt : 0;
    minamt = params.minamt != undefined ? params.minamt : 0;
    $("#minprice").val(minamt);
    $("#maxprice").val(maxamt);

    function listData() {
        $("#loading").show();
        if (pageNum > totalPage) {
            $("#loading").show().html('就这样,到底了');
            return;
        }
        maxamt = params.maxamt != undefined ? params.maxamt : 0;
        minamt = params.minamt != undefined ? params.minamt : 0;
        if (isgoodsfinish && tabIndex == 0) {
            rData = {
                "goodsName": keywords,
                "tmn": tmn,
                "brandIds": params.brandIds,
                "menuIds": params.menuIds,
                "countryIds": params.countryIds,
                "minTaxamt": minamt,
                "maxTaxamt": maxamt,
                "spriceOrder": spriceOrder,
                "pageNo": pageNum
            }
            $.ajax({
                type: "POST",
                url: msonionUrl + "product/search/v2",
                data: rData,
                dataType: "json",
                beforeSend: function () {
                    $("#loading").show();
                    isgoodsfinish = false;
                },
                success: function (data) {
                    if (pageNum == 1) {
                        searchCatalog();
                    }
                    if (data.total == 0 || data.totalPage == 0) {
                        $("#goodsList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                        $("#loading").hide();
                    } else {
                        var gettpl = $('#godslistData').html();
                        jetpl(gettpl).render(data, function (html) {
                            $('#goodsList').append(html);
                        });
                        //页面跳转
                        $("#goodsList li").on("tap", function () {
                            jems.goShow($(this).attr("data-id"), $(this).attr("data-type"))
                        });
                        totalPage = data.totalPage
                        pageNum++;
                        //图片延迟加载插件引用
                        $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
                        $("#loading").hide();
                        isgoodsfinish = true;
                        /*****微信分享*****/
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                            jems.wxShare();
                        }
                    }
                }
            });
        }
    };
    /**
     * 点击商品搜索
     */
    $("#searchBtn").on('tap', function () {
        $(".navsocon").hide();
        $("#navsomask").hide();
        $(".navsobar li").removeClass("on");
        $("#loading").show();
        pageNum = 1;
        totalPage = 1;
        pageNumMag = 1;
        totalPageMag = 1;
        isgoodsfinish = true;
        isMagfinish = true;
        isFisrtGoods = true;
        var sosVal = $("#formalSearchTxt").val().trim();
        if (sosVal == "" || title == sosVal) {
            jems.tipMsg("关键字不能为空");
        } else {
            if (!jems.specialStr(sosVal)) {
                jems.tipMsg("不能有非法字符");
            } else {
                loadown = true;
                pageNum = 1;
                keywords = sosVal;
                if (tabIndex == 0) {
                    // $("#goodsList").empty();
                    // $(window).dropload({afterDatafun: listData});
                    var sosVal = $("#formalSearchTxt").val().trim();
                    keywords = encodeURI(encodeURI(sosVal))
                    window.location.href = "search-list.html?keywords=" + keywords +"&menuIds=&brandIds=&countryIds=&minamt=0&maxamt=0&tmn="+tmn;
                }
                if (tabIndex == 1) {
                    $("#goodsLogList").empty();
                    var sosVal = $("#formalSearchTxt").val().trim();
                    keywords = encodeURI(encodeURI(sosVal))
                    window.location.href = "search-list.html?keywords=" + keywords +"&menuIds=&brandIds=&countryIds=&minamt=0&maxamt=0&tmn="+tmn+"&index=1";
                }
                return;
            }
        }
    });
    //显示购物车数量
    jems.showCartNum();
    //返回顶部插件引用
    $(window).goTops({toBtnCell: "#gotop", posBottom: 40});
});

/**
 * 分类/国家/品牌查询
 */
function searchCatalog() {
    var sosVal = $("#formalSearchTxt").val();
    var data = {"goodsName": keywords, "maxTaxamt": params.maxamt != undefined ? params.maxamt : 0};
    $.ajax({
        type: "POST",
        url: msonionUrl + "product/searchCatalog/v1",
        data: data,
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            $("#loading").hide();
            var errorCode = result.errCode;
            if (errorCode == 10000) {
                //国家列表
                var countries = {data: result.data.country};
                var gettpl = $('#countriesData').html();
                jetpl(gettpl).render(countries, function (html) {
                    $('#countries').html(html);
                });
                //分类列表
                var countries = {data: result.data.menu};
                var gettpl = $('#classIfIcationData').html();
                jetpl(gettpl).render(countries, function (html) {
                    $('#classIfIcation').html(html);
                });
                //品牌 列表
                var countries = {data: result.data.brand};
                var gettpl = $('#brandData').html();
                jetpl(gettpl).render(countries, function (html) {
                    $('#brand').html(html);
                });
                topNavFilter();
            }

        }
    });
}

/**
 * 头部筛选过滤
 */
function topNavFilter() {
    var navbli = $(".navsobar li"), navcon = $(".navsocon");
    navbli.on("tap", function () {
        var that = $(this), idx = that.index();
        $("#navsomask").show();
        navbli.removeClass("on");
        that.addClass("on");
        navcon.show().find("section").removeClass("on");
        $("#socon0" + (idx + 1)).addClass("on");
    });
    $("#navreset").on("tap", function () {//重置
        $(".navsocon section li").removeClass("curr");
        $("#minprice").val(0);
        $("#maxprice").val(0);
        var sosVal = $("#formalSearchTxt").val().trim();
        keywords = encodeURI(encodeURI(sosVal))
        window.location.href = "search-list.html?keywords=" + keywords +"&menuIds=&brandIds=&countryIds=&minamt=0&maxamt=0&tmn="+tmn;
    });
    $(".navsocon section li").on("tap", function () {
        $(this).toggleClass("curr");
        var soarr = [], thispar = $(this).parent();
        thispar.find("li.curr").each(function () {
            soarr.push($(this).attr("data-gid"))
        });
        thispar.attr("data-val", soarr.join(","));
    });
    $("#navsobtn").on("click", function () {//确定按钮
        var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        minamt = $("#minprice").val();
        maxprice = $("#maxprice").val();
        var sosVal = $("#formalSearchTxt").val().trim();
        keywords = encodeURI(encodeURI(sosVal));
        if (!reg.test(minamt) || !reg.test(maxprice)) {
            jems.tipMsg("金额必须是数字");
            return;
        }
        if (minamt == "") {
            minamt = 0;
        }
        if (maxprice == "") {
            maxprice = 0;
        }
        if (parseInt(maxprice) < parseInt(minamt)) {
            jems.tipMsg("最大金额不能小于最小金额");
            return;
        }
        navcon.hide();
        navbli.removeClass("on");
        $("#navsomask").hide();
        menuIds = $("#classIfIcation").attr("data-val");
        brandIds = $("#brand").attr("data-val");
        countryIds = $("#countries").attr("data-val");
        var url = "search-list.html?keywords=" + keywords + "&menuIds=" + menuIds + "&brandIds=" + brandIds + "&countryIds=" + countryIds + "&minamt=" + minamt + "&maxamt=" + maxprice+"&tmn="+tmn;
        window.location.href = url;
    });
    $("#navsomask").on("tap", function () {
        navcon.hide();
        navbli.removeClass("on");
        $(this).hide();
    })
}

/**
 * 商品限购规则
 * @param gid    购买商品的id
 * @param mid    购买商品的分类id，如果是按指定商品限购，则分类id可以不用传
 * @param num    购买数量
 *
 */
function limitrule(gid, num, mid) {
    var limit = true;
    var params = {"gid": gid, "buynum": num, "menuid": mid};
    var url = msonionUrl + "sodrest/sodlimit1";
    $.ajax({
        type: 'get',
        url: url,
        data: params,
        dataType: 'json',
        async: false,
        success: function (msg) {
            var info = "该商品是限购商品";
            //info += "<br />限购日期："+msg.sdate+"~"+msg.edate;
            info += "<br />每人限购" + msg.limitNum + "件";
            msg.islimit && jems.mboxMsg(info);
            limit = msg.islimit;
        }
    });
    return limit;
}

//添加购物车
var timer = null;

function addCart(tmn, goodsId, menuId) {
    clearTimeout(timer);
    timer = setTimeout(function () {
        if (!limitrule(goodsId, 1, menuId)) {	// 添加限购规则 2015-11-30
            $.ajax({
                type: "get",
                url: msonionUrl + "cart/add?tmnId=" + tmn + "&goodsId=" + goodsId + "&menuId=" + menuId,
                dataType: "json",
                //jsonp:"callback",
                success: function (data) {
                    var msg = "";
                    if (data.state == 5) {
                        jems.goUrl("login.html?" + window.location.href);
                    } else {
                        if (data.state == -1) {
                            msg = "对不起，洋葱商家无法使用本功能";
                        } else if (data.state == 0) {
                            msg = "此商品加入购物车失败！";
                        } else if (data.state == 1) {
                            msg = "此商品在商城中不存在！";
                        } else if (data.state == 2) {
                            msg = "数量不能为空！";
                        } else if (data.state == 3) {
                            jems.showCartNum();  // 重新计算购物车数量
                            msg = "恭喜加入购物车成功！";
                        } else if (data.state == 4) {
                            msg = "终端不存在！";
                        } else if (data.state == 6) {
                            msg = "此终端不存在！";
                        } else if (data.state == 7) {
                            msg = "洋葱商家不能使用此功能！";
                        } else if (data.state == -2) {
                            msg = "该商品购买数量不能超过" + data.limitNum + "件！";
                        }
                        jems.tipMsg(msg);
                    }
                }
            });
        }
    }, 500);
}

//添加收藏
function addAtten(tmn, goodsId) {
    var ele = event.target;
    $.ajax({
        type: "get",
        url: msonionUrl + "myatten/add?tmn=" + tmn + "&goodsId=" + goodsId,
        dataType: "json",
        //jsonp:"callback",
        success: function (data) {
            var msg = "";
            if (data.state == -1) {  //帐户未登录或无权限
                jems.goUrl("login.html?returnUrl=" + window.location.href);
            } else {
                if (data.state == 0) {
                    msg = "此商品收藏失败！";
                } else if (data.state == 1) {
                    msg = "此商品已在收藏夹中！";
                } else if (data.state == 2) {
                    $(ele).removeClass("graysc").addClass("redsc");
                    msg = "商品收藏成功！";
                } else if (data.state == 3) {
                    msg = "洋葱商家不能使用此功能！";
                }
                jems.mboxMsg(msg);
            }
        }
    });
}

//function goUrl(id){
//	jems.goUrl('goods-details.html?id='+id);
//	$.ajax({
//		type:"get",
//		url: msonionUrl+"product/recordBrowse", 
//		data: {"id":id},
//	})
//}
function buyNow(productId, price) {
    jems.akeyOrder(productId, price);
};

// 美物志接口
function listMagMainData() {
    $("#magLoading").show();
    if (pageNumMag > totalPageMag) {
        $("#magLoading").show().html('就这样,到底了');
        return;
    }
    if (isMagfinish && tabIndex == 1) {
        $.ajax({
            type: "POST",
            url: msonionUrl + "magmain/searchMagMain",
            data: {
                "keyWords": keywords,
                "pageNo": pageNumMag,
                "pageSize": 10
            },
            dataType: "json",
            beforeSend: function () {
//    			$("#magLoading").html(' <p class="loading pt5 pb5" id="magLoading"><span>加载中</span></p>').show();
                $("#magLoading").show();
                isMagfinish = false;
            },
            success: function (data) {
                if (data.total == 0 || data.totalPage == 0) {
                    $("#goodsLogList").html("<p class='p15 tc f14'>亲，暂无相关杂志！</p>").show();
                    $("#magLoading").hide();
                } else {
                    jetpl('#goodsLogListData').render(data, function (html) {
                        $('#goodsLogList').append(html);
                    });
                    totalPageMag = data.totalPage
                    pageNumMag++;
                    //图片延迟加载插件引用
                    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
                    $("#magLoading").hide();
                    isMagfinish = true;
                }
            }
        });
    }
};

/**
 * 商品状态显示
 */
function saleState(qty, sale,type) {
    if(1 == type && 1 == sale){
        return "";
    } else {
        if (qty <= 0) {
            if (sale == 2 || sale == 9) {
                return "soldout2";
            } else if (sale == 3 || sale == 6 || sale == 8) {
                return "soldout3";
            } else if (sale == 5 || sale == 10) {
                return "soldout5";
            } else if (sale == 4) {
                return "soldout4";
            } else if (sale == 7) {
                return "soldout7";
            } else {
                return "soldout1";
            }
        } else {
            if (sale == 6 || sale == 8) {
                return "soldout3";
            } else if (sale == 5 || sale == 10) {
                return "soldout5";
            } else if (sale == 7) {
                return "soldout7";
            } else if (sale == 4) {
                return "soldout4";
            }
        }
    }
}