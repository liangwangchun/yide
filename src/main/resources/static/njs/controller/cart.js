// JavaScript Document
var ParHref = jems.parsURL(window.location.href);
var params = ParHref.params;
var tmn = params.tmn;
//订单限额 2016-01-14
var sodTariff = 1000;
var newStore = false;
var totalPage = 0;
var pageNum = 0;
var price;
var dutyTotal;
var countPrice;
var countFreePrice;
var onionSumAmt = 0, otherSumAmt = 0, foreignSumAmt = 0, drinkSumAmt = 0, freshSumAmt = 0;//海外仓总计价格
var messageonion = '';//库存不足弹出提示
var aniArr = [];//ANI数组
var memberTmn;
$(function () {
    //重要紧急公告
    mBox.open({
        title: ['重要紧急公告', 'color:#8016AD;font-size:1.4rem;text-align: center;'],
        width: "90%",
        height: "70%",
        content: mBox.cell("#impnotice"),
        closeBtn: [false, 1],
        btnName: ['已阅公告'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: true
    });

    countPrice = $("#countPrice");
    $("#mytips").html(cartoedertip);
    parseFloat(countPrice.html());
    cartListData();

    $(".cartboxBtn").on("click", function () {
        var _this = $(this);
        var _sibling = $(this).parent().siblings();
        if (_sibling.is(":hidden")) {
            _this.addClass("btndown").removeClass("btnup");
            _sibling.show();
            if (aniArr.length <= 0) {
                $("#ANIblock").css("display", "none")
            }
        } else {
            _sibling.hide();
            _this.addClass("btnup").removeClass("btndown");
        }
    })

    //海外仓
    $("#seasblock input[name='seasblockcart']").on("change", function (e) {
        e.preventDefault();
        messageonion = '';
        AllSelect($(this), 1, "seas");
    });

    //酒水
    $("#drinksblock input[name='drinksblockcart']").on("change", function (e) {
        e.preventDefault();
        messageonion = '';
        AllSelect($(this), 1, "drink");
    });

    //贩外
    $("#foreignblock h3 input[name='foreignblockcart']").on("change", function (e) {
        e.preventDefault();
        messageonion = '';
        AllSelect($(this), 1, "foreign");
    });

    //生鲜
    $("#freshblock h3 input[name='freshblockcart']").on("change", function (e) {
        e.preventDefault();
        messageonion = '';
        AllSelect($(this), 1, "fresh");
    });


    //全选
    $("#allSelect").on("change", function (e) {
        e.preventDefault();
        var seasobj = $("#seasblock input[name='seasblockcart']");
        var foreignobj = $("#foreignblock input[name='foreignblockcart']");
        var drinkobje = $("#drinksblock input[name='drinksblockcart']");
        var freshobje = $("#freshblock input[name='freshblockcart']");

        if ($(this).prop('checked')) {
            seasobj.prop("checked", true);
            drinkobje.prop("checked", true);
            foreignobj.prop("checked", true);
            freshobje.prop("checked", true);
        } else {
            seasobj.prop("checked", false);
            foreignobj.prop("checked", false);
            drinkobje.prop("checked", false);
            freshobje.prop("checked", false);
        }
        messageonion = '';
        AllSelect(seasobj, 0, "seas");
        AllSelect(foreignobj, 0, "foreign");
        AllSelect(drinkobje, 0, "drink");
        AllSelect(drinkobje, 0, "fresh");
        if (messageonion != "") {
            limitMsg("温馨提示:", messageonion, null);
        }
        messageonion = '';
    })

    //去下单
    $("#settlement").on("click", function () {
        if ($(this).hasClass("btn-cartBtn")) {
            return;
        }
        if (memberTmn == 0) {
            mBox.open({
                content: "您的账号还未填写邀请码",
                closeBtn: [false],
                btnName: ['去绑定'],
                btnStyle: ["color: #0e90d2;"],
                maskClose: false,
                yesfun: function () {
                    jems.goUrl("../ucenter/bind-tmn.html");
                }
            });
            return;
        }
        var lim = mBox.open({
            title: ['跨境电商购物须知', 'color:#8016AD;font-size:1.4rem;text-align: center;'],
            width: "90%",
            height: "90%",
            content: mBox.cell("#orderinstr"),
            closeBtn: [true, 1],
            btnName: ['已阅读/AGREE'],
            btnStyle: ["color: #8016AD;"],
            maskClose: false,
            yesfun: function () {
                mBox.close(lim);
                settlement();
            }
        })
    })
});

function settlement() {
    var foreign = [];
    var onion = [];
    var wineFirst = [];
    var fresh = [];
    var cartIdsStr = '';
    var countPriceOnion = 0;
    //海外仓
    $("#seasblock li").each(function () {
        var checkobj = $(this).find("input[name='cart']");
        if (checkobj.attr("data-choose") == "true") {
            var id = $(this).attr("data-id");
            var count = $(this).find("input[data-type='onion']").val();
            onion.push({"id": id, "count": count});
            cartIdsStr += id + "_" + count + ",";
        }
    });
    //酒水
    $("#drinksblock li").each(function () {
        var checkobj = $(this).find("input[name='cart']");
        if (checkobj.attr("data-choose") == "true") {
            var id = $(this).attr("data-id");
            var count = $(this).find("input[data-type='drink']").val();
            wineFirst.push({"id": id, "count": count});
            cartIdsStr += id + "_" + count + ",";
        }
    });
    //贩外
    $("#foreignblock li").each(function () {
        var checkobj = $(this).find("input[name='cart']");
        if (checkobj.attr("data-choose") == "true") {
            var id = $(this).attr("data-id");
            var count = $(this).find("input[data-type='foreign']").val();
            foreign.push({"id": id, "count": count});
            cartIdsStr += id + "_" + count + ",";
        }
    });
    //生鲜
    $("#freshblock li").each(function () {
        var checkobj = $(this).find("input[name='cart']");
        if (checkobj.attr("data-choose") == "true") {
            var id = $(this).attr("data-id");
            var count = $(this).find("input[data-type='fresh']").val();
            fresh.push({"id": id, "count": count});
            cartIdsStr += id + "_" + count + ",";
        }
    });

    var cartIds = {foreignList: foreign, onionList: onion, wineFirstList: wineFirst, freshList: fresh};
    sessionStorage.cartIds = JSON.stringify(cartIds);
    sessionStorage.cartIdsStr = cartIdsStr;
    sessionStorage.countPrice = parseFloat(countPrice.html());
    sessionStorage.countPriceOnion = onionSumAmt;
    sessionStorage.newStore = newStore;
    sessionStorage.isSingle = undefined;
    var seasobj = $("#seasblock input[name='seasblockcart']");
    var foreignobj = $("#foreignblock input[name='foreignblockcart']");
    var drinkobje = $("#drinksblock input[name='drinksblockcart']");
    seasobj.prop("checked", false);
    foreignobj.prop("checked", false);
    drinkobje.prop("checked", false);
    $("#allSelect").prop("checked", false);
    jems.goUrl("../ucenter/cart-order-sumbit.html");
    return;
}

/**
 * 海外仓全选
 */
function AllSelect(obj, type, selectType) {
    var countPrice = $("#countPrice");
    price = 0;
    var that = obj;
    var moneyType = '';
    var selectBlock;
    var SumAmt = 0;
    switch (selectType) {
        case "seas":
            selectBlock = $("#seasblock li");
            moneyType = "onion";
            SumAmt = onionSumAmt;
            break;
        case "foreign":
            selectBlock = $("#foreignblock li");
            moneyType = "foreign";
            SumAmt = foreignSumAmt;
            break;
        case "drink":
            selectBlock = $("#drinksblock li");
            moneyType = "drink";
            SumAmt = drinkSumAmt;
            break;
        case "fresh":
            selectBlock = $("#freshblock li");
            moneyType = "fresh";
            SumAmt = freshSumAmt;
            break;
        default:
            break;
    }
    if (that.prop('checked')) {
        selectBlock.each(function () {
            var checkobj = $(this).find("input[name='cart']");
            var photoobj = $(this).find("div.photo");
            if (photoobj.hasClass("soldout1")) {
                messageonion += $(this).find("h3").html() + "库存不足</br>";
            } else if (photoobj.hasClass("soldout2")) {
                messageonion += $(this).find("h3").html() + "过季暂缓</br>";
            } else if (photoobj.hasClass("soldout3")) {
                messageonion += $(this).find("h3").html() + "目前停售</br>";
            } else if (photoobj.hasClass("soldout4")) {
                messageonion += $(this).find("h3").html() + "等待活动上线</br>";
            } else if (photoobj.hasClass("soldout5")) {
                messageonion += $(this).find("h3").html() + "预热商品暂时不可下单</br>";
            } else {
                if (checkobj.attr("data-choose") == "false" || checkobj.attr("data-choose") == undefined) {
                    price += parseFloat($(this).attr("data-price")) * parseInt($(this).find("input[name='cartname']").val());
                    checkobj.attr("data-choose", true);
                    checkobj.prop("checked", true);
                }
            }
        });
        if (messageonion != '' && type == 1) {
            limitMsg("温馨提示:", messageonion + "</br>", that);
        }
        countFreePrice = SumAmt + price;
        sumTotalMoney(countFreePrice, moneyType);
        if (selectType == "seas") {
            checkOnionMoney(countFreePrice);
        }
    } else {
        $("#allSelect").prop("checked", false);
        selectBlock.each(function () {
            var checkobj = $(this).find("input[name='cart']");
            if (checkobj.attr("data-choose") == "true") {
                price += parseFloat($(this).attr("data-price")) * parseInt($(this).find("input[name='cartname']").val());
                checkobj.attr("data-choose", false);
                checkobj.prop("checked", false);
            }
        });
        countFreePrice = SumAmt - price;
        sumTotalMoney(countFreePrice, moneyType);
    }
}

/**
 * 获取购物车商品列表的数据
 */
function cartListData() {
    if (pageNum > totalPage) {
        return;
    }
    var tmn = jems.parsURL(window.location.href).params.tmn;
    var data = {
        'tmn': tmn,
        'pageNo': pageNum,
        't': new Date().getTime()
    };
    $.ajax({
        type: "POST",
        url: msonionUrl + "app/cart/list/v3",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.errCode == 4001 || data.errCode == 4002) {	// 如果未登录，则跳至登录页面
                jems.goUrl("../login.html?" + window.location.href);
            } else {
                memberTmn = data.data.mytmn;
                newStore = data.data.newStore;
                if (data.data == "" || data.data == null) {
                    $(".nogoodsShow").removeClass("hide");//购物车数量为0时显示返回首页提示
                } else {
                    var aniList = data.data.aniList;//ANI
                    var drinksList = data.data.drinksList;//酒水
                    var foreignList = data.data.foreignList;//贩外
                    var seasList = data.data.seasList;//海外仓
                    var freshList = data.data.freshList;//生鲜
                    aniArr = aniList;
                    aniList.length <= 0 ? $("#ANIblock").addClass("hide") : $("#ANIblock").removeClass("hide");
                    drinksList.length <= 0 ? $("#drinksblock").addClass("hide") : $("#drinksblock").removeClass("hide");
                    foreignList.length <= 0 ? $("#foreignblock").addClass("hide") : $("#foreignblock").removeClass("hide");
                    seasList.length <= 0 ? $("#onion").addClass("hide") : $("#onion").removeClass("hide");
                    freshList.length <= 0 ? $("#freshblock").addClass("hide") : $("#freshblock").removeClass("hide");
                    if (aniList.length <= 0 && seasList.length <= 0) {
                        $("#seasblock").addClass("hide");
                    } else {
                        $("#seasblock").removeClass("hide");
                    }
                    var foreignhtml = '';
                    /**
                     * 贩外数据
                     */
                    foreignList.forEach(function (v) {
                        var product = v.product;
                        foreignhtml += '<li data-parentId=' + product.parentId + ' data-type=' + product.type + ' data-price=' + product.freePrice + ' data-id=' + product.id + ' class="flexbox p10 je-text-center je-align-center jepor jecell-bottom">';
                        foreignhtml += '<div class="">';
                        foreignhtml += '<label>';
                        foreignhtml += '<input type="hidden" name="ginfo" value="">';
                        foreignhtml += '<input type="hidden" id="544" name="getName" value="">';
                        foreignhtml += '<input class="radio pr10 rdu" type="checkbox" data-qty = ' + product.qty + ' data-leStat = ' + product.leStat + '  data-cart="foreign" name="cart" value="" data-cartnum="" data-name="" data-value="1" data-num="" data-leid="" data-mid="" data-salestate="">';
                        foreignhtml += '</label>';
                        foreignhtml += '</div>';
                        if (product.leSpecs[0].qty <= 0 || product.leSpecs[0].leStat == 2 || product.leSpecs[0].qty < v.num) {
                            foreignhtml += '<div class="photo jepor jecell-all ml10 soldout1">';
                        } else {
                            foreignhtml += '<div class="photo jepor jecell-all ml10 ' + getSoldOutClass(product.leSpecs[0].qty, product.saleState) + '">';
                        }
                        foreignhtml += '<img src="' + msPicPath + '' + product.leSpecs[0].mainPicUrl + '?x-oss-process=image/resize,w_200">';
                        foreignhtml += '</div>';
                        foreignhtml += '<div class="jeflex ml10 je-text-center je-align-left je-orient-ver">';
                        foreignhtml += '<h3 class="f13 jeell">' + product.name + '</h3>';
                        foreignhtml += '<div class="size f12 jepor  mt10 edit">';
                        var desc = "";
                        product.leSpecs.forEach(function (item) {
                            item.specs.sort(function(a,b){//排序
                                return a.type-b.type});
                            item.specs.forEach(function (em) {
                                product.letSpecs.forEach(function (val) {
                                    if (val.id == em.type) {
                                        desc += val.name + "&nbsp;:&nbsp;&nbsp;&nbsp;" + em.name + "&nbsp;&nbsp;&nbsp;"
                                    }
                                });
                            });
                        });
                        foreignhtml += '<p class="jeell pr25 ">' + desc + '</p>';
                        foreignhtml += '</div>';
                        foreignhtml += '<div class=" flexbox mt10 je-text-center je-align-center ">';
                        foreignhtml += '<span class="purple f16 show jeflex">&yen' + product.leSpecs[0].freePrice.toFixed(2) + '</span>';
                        foreignhtml += '<div class="cartmas ml10">';
                        foreignhtml += '<span class="cartbox jepor jecell-topbot">';
                        foreignhtml += '<em class="cartmin g3 fl tc f18 dib">-</em>';
                        foreignhtml += '<input data-type="foreign" class="cartnum g3 fl tc f14 dib" name="cartname" value="' + v.num + '" price="" duty="" data-isedit="" data-oid="" data-gid="" data-value="" readonly="">';
                        foreignhtml += '<em class="cartadd g3 fl tc f18 dib">+</em>';
                        foreignhtml += '</span>';
                        foreignhtml += '</div>';
                        foreignhtml += '</div>';
                        foreignhtml += '</div>';
                        foreignhtml += '<div data-id=' + product.id + ' class="cartdelbtn f14">删除</div></li>';
                    });
                    $("#foreignblock ul").html(foreignhtml);

                    //单个选中
                    $("input[data-cart=\"foreign\"]").on("change", function (e) {
                        e.preventDefault();
                        var that = $(this);
                        var thisSolfMsg = that.parents('li').find("h3").html();
                        var num = parseInt(that.parents('li').find("input[data-type='foreign']").val());
                        var onprice = parseFloat(that.parents("li").attr("data-price"));
                        var photoobj = that.parents('li').find("div.photo");
                        if (that.prop('checked')) {//选中
                            if (StatusTipMessage(photoobj, that, thisSolfMsg) == "") {
                                that.attr("data-choose", true);
                                if ($("input[data-cart=\"foreign\"]").length == $("input[data-cart=\"foreign\"][data-choose='true']").length) {
                                    $("#foreignblock h3 input[name='foreignblockcart']").prop("checked", true);
                                }
                                countFreePrice = foreignSumAmt + num * onprice;
                                sumTotalMoney(countFreePrice, "foreign");
                            }
                        } else {//取消
                            $("#foreignblock h3 input[name='foreignblockcart']").prop("checked", false);
                            $("#allSelect").prop("checked", false);
                            that.attr("data-choose", false);
                            countFreePrice = foreignSumAmt - num * onprice;
                            sumTotalMoney(countFreePrice, "foreign");
                        }
                    });

                    var seaslisthtml = '';
                    /**
                     * 海外仓数据
                     */
                    seasList.forEach(function (v) {
                        var product = v.product;
                        seaslisthtml += '<li data-type=' + product.type + ' data-price=' + product.freePrice + ' data-id=' + product.id + ' class="flexbox p10  jepor jecell-bottom">';
                        seaslisthtml += ' <div class="flexbox  je-align-center ">';
                        seaslisthtml += '<label>';
                        seaslisthtml += '<input type="hidden" name="ginfo" value="">';
                        seaslisthtml += '<input type="hidden" name="getName" value="">';
                        seaslisthtml += '<input class="radio pr10 rdu" type="checkbox" data-qty = ' + product.qty + ' data-leStat = ' + product.leStat + '  data-cart="onion" name="cart" value="" data-cartnum="" data-name="" data-value="" data-num="" data-leid="" data-mid=" " data-salestate="">';
                        seaslisthtml += '</label>';
                        seaslisthtml += '</div>';
                        if (product.qty <= 0 || product.leStat == 2 || product.qty < v.num) {
                            seaslisthtml += '<div class="photo jepor jecell-all ml10 soldout1">';
                        } else {
                            seaslisthtml += '<div class="photo jepor jecell-all ml10 ' + getSoldOutClass(product.qty, product.saleState) + '">';
                        }

                        seaslisthtml += '<img src="' + msPicPath + '' + product.mainPicUrl + '?x-oss-process=image/resize,w_200">';
                        seaslisthtml += '</div>';
                        seaslisthtml += '<div class="jeflex ml10 je-text-center je-align-left je-orient-ver">';
                        seaslisthtml += '<h3 class="f13  tsl">' + product.name + '</h3>';
                        seaslisthtml += '<div class=" flexbox mt10">';
                        seaslisthtml += '<span class="purple f16 show jeflex">&yen' + product.freePrice.toFixed(2) + '</span>';
                        seaslisthtml += '<div class="cartmas ml10">';
                        seaslisthtml += '<span class="cartbox jepor jecell-topbot">';
                        seaslisthtml += '<em class="cartmin g3 fl tc f18 dib">-</em>';
                        seaslisthtml += '<input data-type="onion" data-limit="' + product.buyLimit + '" class="cartnum g3 fl tc f14 dib" name="cartname" value="' + v.num + '" price="" duty="" data-isedit="" data-oid="" data-gid="" data-value="" readonly="">';
                        seaslisthtml += '<em class="cartadd g3 fl tc f18 dib">+</em>';
                        seaslisthtml += '</span>';
                        seaslisthtml += '</div>';
                        seaslisthtml += '</div>';
                        seaslisthtml += '</div>';
                        seaslisthtml += '<div data-id=' + product.id + ' class="cartdelbtn f14">删除</div></li>';
                    })
                    $("#onion ul").html(seaslisthtml);

                    var anihtml = '';
                    /**
                     * ANI品牌
                     */
                    aniList.forEach(function (v) {
                        var product = v.product;
                        anihtml += '<li data-type=' + product.type + ' data-price=' + product.freePrice + ' data-id=' + product.id + ' class="flexbox p10  jepor jecell-bottom">';
                        anihtml += '<div class="flexbox  je-align-center ">';
                        anihtml += '<label>';
                        anihtml += '<input type="hidden" name="ginfo" value="">';
                        anihtml += '<input type="hidden" name="getName" value="">';
                        anihtml += '<input class="radio pr10 rdu" data-cart="onion" data-qty = ' + product.qty + ' data-leStat = ' + product.leStat + '  type="checkbox" name="cart" value="" data-cartnum="" data-name="" data-value="" data-num="" data-leid="" data-mid=" " data-salestate="">';
                        anihtml += '</label>';
                        anihtml += '</div>';
                        if (product.qty <= 0 || product.leStat == 2 || product.qty < v.num) {
                            anihtml += '<div class="photo jepor jecell-all ml10 soldout1">';
                        } else {
                            anihtml += '<div class="photo jepor jecell-all ml10 ' + getSoldOutClass(product.qty, product.saleState) + '">';
                        }
                        anihtml += '<img src="' + msPicPath + '' + product.mainPicUrl + '?x-oss-process=image/resize,w_200">';
                        anihtml += '</div>';
                        anihtml += '<div class="jeflex ml10 je-text-center je-align-left je-orient-ver">';
                        anihtml += '<h3 class="f13  tsl">' + product.name + '</h3>';
                        anihtml += '<div class=" flexbox mt10">';
                        anihtml += '<span class="purple f16 show jeflex">&yen' + product.freePrice.toFixed(2) + '</span>';
                        anihtml += '<div class="cartmas ml10">';
                        anihtml += '<span class="cartbox jepor jecell-topbot">';
                        anihtml += '<em class="cartmin g3 fl tc f18 dib">-</em>';
                        anihtml += '<input data-type="onion" data-limit="' + product.buyLimit + '" class="cartnum g3 fl tc f14 dib" name="cartname" value="' + v.num + '" price="" duty="" data-isedit="" data-oid="" data-gid="" data-value="" readonly="">';
                        anihtml += '<em class="cartadd g3 fl tc f18 dib">+</em>';
                        anihtml += '</span>';
                        anihtml += '</div>';
                        anihtml += '</div>';
                        anihtml += '</div>';
                        anihtml += '<div data-id=' + product.id + ' class="cartdelbtn f14">删除</div></li>';
                    });
                    $("#ANIblock ul").html(anihtml);

                    //单个选中
                    $("input[data-cart=\"onion\"]").on("change", function (e) {
                        e.preventDefault();
                        var that = $(this);
                        var thisSolfMsg = that.parents('li').find("h3").html();
                        var onprice = parseFloat(that.parents("li").attr("data-price"));
                        var num = parseInt(that.parents('li').find("input[data-type='onion']").val());
                        var photoobj = that.parents('li').find("div.photo");
                        if (that.prop('checked')) {
                            if (StatusTipMessage(photoobj, that, thisSolfMsg) == "") {
                                that.attr("data-choose", true);
                                if ($("input[data-cart=\"onion\"]").length == $("input[data-cart=\"onion\"][data-choose='true']").length) {
                                    $("#seasblock input[name='seasblockcart']").prop("checked", true);
                                }
                                countFreePrice = onionSumAmt + num * onprice;
                                sumTotalMoney(countFreePrice, "onion");
                                checkOnionMoney(countFreePrice);
                            }
                        } else {
                            $("#seasblock input[name='seasblockcart']").prop("checked", false);
                            $("#allSelect").prop("checked", false);
                            that.attr("data-choose", false);
                            countFreePrice = onionSumAmt - num * onprice;
                            sumTotalMoney(countFreePrice, "onion");
                        }
                        if (onionSumAmt > 0) {
                            findTmn(tmn, onionSumAmt);
                        }
                    });

                    var drinkshtml = '';
                    /**
                     * 酒水数据
                     */
                    drinksList.forEach(function (v) {
                        var product = v.product;
                        drinkshtml += ' <li data-type=' + product.type + ' data-price=' + product.freePrice + ' data-id=' + product.id + ' class="flexbox p10  jepor jecell-bottom">';
                        drinkshtml += '<div class="flexbox  je-align-center ">';
                        drinkshtml += '<label>';
                        drinkshtml += '<input type="hidden" name="ginfo" value="">';
                        drinkshtml += '<input type="hidden" name="getName" value="">';
                        drinkshtml += '<input class="radio pr10 rdu" data-cart="drink" data-qty = ' + product.qty + '   data-leStat = ' + product.leStat + '  type="checkbox" name="cart" value="" data-cartnum="" data-name="" data-value="" data-num="" data-leid="" data-mid=" " data-salestate="">';
                        drinkshtml += '</label>';
                        drinkshtml += '</div>';
                        if (product.qty <= 0 || product.leStat == 2 || product.qty < v.num) {
                            drinkshtml += '<div class="photo jepor jecell-all ml10 soldout1">';
                        } else {
                            drinkshtml += '<div class="photo jepor jecell-all ml10 ' + getSoldOutClass(product.qty, product.saleState) + '">';
                        }
                        drinkshtml += '<img src="' + msPicPath + '' + product.mainPicUrl + '?x-oss-process=image/resize,w_200">';
                        drinkshtml += '</div>';
                        drinkshtml += '<div class="jeflex ml10 je-text-center je-align-left je-orient-ver">';
                        drinkshtml += '<h3 class="f13  tsl">' + product.name + '</h3>';
                        drinkshtml += '<div class=" flexbox mt10">';
                        drinkshtml += '<span class="purple f16 show jeflex">&yen' + product.freePrice.toFixed(2) + '</span>';
                        drinkshtml += '<div class="cartmas ml10">';
                        drinkshtml += '<span class="cartbox jepor jecell-topbot">';
                        drinkshtml += '<em class="cartmin g3 fl tc f18 dib">-</em>';
                        drinkshtml += '<input data-type="drink" class="cartnum g3 fl tc f14 dib" name="cartname" value="' + v.num + '" price="" duty="" data-isedit="" data-oid="" data-gid="" data-value="" readonly="">';
                        drinkshtml += '<em class="cartadd g3 fl tc f18 dib">+</em>';
                        drinkshtml += '</span>';
                        drinkshtml += '</div>';
                        drinkshtml += '</div>';
                        drinkshtml += '</div>';
                        drinkshtml += '<div data-id=' + product.id + ' class="cartdelbtn f14">删除</div></li>';
                    });
                    $("#drinksblock ul").html(drinkshtml);

                    //单个选中
                    $("input[data-cart=\"drink\"]").on("change", function (e) {
                        e.preventDefault();
                        var that = $(this);
                        var thisSolfMsg = that.parents('li').find("h3").html();
                        var onprice = parseFloat(that.parents("li").attr("data-price"));
                        var num = parseInt(that.parents('li').find("input[data-type='drink']").val());
                        var photoobj = that.parents('li').find("div.photo");
                        if (that.prop('checked')) {
                            if (StatusTipMessage(photoobj, that, thisSolfMsg) == "") {
                                that.attr("data-choose", true);
                                if ($("input[data-cart=\"drink\"]").length == $("input[data-cart=\"drink\"][data-choose='true']").length) {
                                    $("#drinksblock input[name='drinksblockcart']").prop("checked", true);
                                }
                                countFreePrice = drinkSumAmt + num * onprice;
                                sumTotalMoney(countFreePrice, "drink");
                            }
                        } else {
                            $("#drinksblock input[name='drinksblockcart']").prop("checked", false);
                            $("#allSelect").prop("checked", false);
                            that.attr("data-choose", false);
                            countFreePrice = drinkSumAmt - num * onprice;
                            sumTotalMoney(countFreePrice, "drink");
                        }
                    });


                    var freshhtml = '';
                    /**
                     * 生鲜数据
                     */
                    freshList.forEach(function (v) {
                        var product = v.product;
                        freshhtml += ' <li data-type=' + product.type + ' data-price=' + product.freePrice + ' data-id=' + product.id + ' class="flexbox p10  jepor jecell-bottom">';
                        freshhtml += '<div class="flexbox  je-align-center ">';
                        freshhtml += '<label>';
                        freshhtml += '<input type="hidden" name="ginfo" value="">';
                        freshhtml += '<input type="hidden" name="getName" value="">';
                        freshhtml += '<input class="radio pr10 rdu" data-cart="fresh" data-qty = ' + product.qty + '   data-leStat = ' + product.leStat + '  type="checkbox" name="cart" value="" data-cartnum="" data-name="" data-value="" data-num="" data-leid="" data-mid=" " data-salestate="">';
                        freshhtml += '</label>';
                        freshhtml += '</div>';
                        if (product.qty <= 0 || product.leStat == 2 || product.qty < v.num) {
                            freshhtml += '<div class="photo jepor jecell-all ml10 soldout1">';
                        } else {
                            freshhtml += '<div class="photo jepor jecell-all ml10 ' + getSoldOutClass(product.qty, product.saleState) + '">';
                        }
                        freshhtml += '<img src="' + msPicPath + '' + product.mainPicUrl + '?x-oss-process=image/resize,w_200">';
                        freshhtml += '</div>';
                        freshhtml += '<div class="jeflex ml10 je-text-center je-align-left je-orient-ver">';
                        freshhtml += '<h3 class="f13  tsl">' + product.name + '</h3>';
                        freshhtml += '<div class=" flexbox mt10">';
                        freshhtml += '<span class="purple f16 show jeflex">&yen' + product.freePrice.toFixed(2) + '</span>';
                        freshhtml += '<div class="cartmas ml10">';
                        freshhtml += '<span class="cartbox jepor jecell-topbot">';
                        freshhtml += '<em class="cartmin g3 fl tc f18 dib">-</em>';
                        freshhtml += '<input data-type="fresh" class="cartnum g3 fl tc f14 dib" name="cartname" value="' + v.num + '" price="" duty="" data-isedit="" data-oid="" data-gid="" data-value="" readonly="">';
                        freshhtml += '<em class="cartadd g3 fl tc f18 dib">+</em>';
                        freshhtml += '</span>';
                        freshhtml += '</div>';
                        freshhtml += '</div>';
                        freshhtml += '</div>';
                        freshhtml += '<div data-id=' + product.id + ' class="cartdelbtn f14">删除</div></li>';
                    });
                    $("#freshblock ul").html(freshhtml);

                    //单个选中
                    $("input[data-cart=\"fresh\"]").on("change", function (e) {
                        e.preventDefault();
                        var that = $(this);
                        var thisSolfMsg = that.parents('li').find("h3").html();
                        var onprice = parseFloat(that.parents("li").attr("data-price"));
                        var num = parseInt(that.parents('li').find("input[data-type='fresh']").val());
                        var photoobj = that.parents('li').find("div.photo");
                        if (that.prop('checked')) {
                            if (StatusTipMessage(photoobj, that, thisSolfMsg) == "") {
                                that.attr("data-choose", true);
                                if ($("input[data-cart=\"fresh\"]").length == $("input[data-cart=\"fresh\"][data-choose='true']").length) {
                                    $("#freshblock input[name='freshblockcart']").prop("checked", true);
                                }
                                countFreePrice = freshSumAmt + num * onprice;
                                sumTotalMoney(countFreePrice, "fresh");
                            }
                        } else {
                            $("#freshblock input[name='freshblockcart']").prop("checked", false);
                            $("#allSelect").prop("checked", false);
                            that.attr("data-choose", false);
                            countFreePrice = freshSumAmt - num * onprice;
                            sumTotalMoney(countFreePrice, "fresh");
                        }
                    });

                    /**
                     * 加
                     */
                    $(".cartadd").on("click", function () {
                        var inp = $(this).prev();
                        var id = $(this).parents("li").attr("data-id");
                        var val = parseInt(inp.val());
                        var price = parseFloat($(this).parents("li").attr("data-price"));
                        var dataType = inp.attr("data-type");
                        if (dataType == "onion") {//海外仓
                            var limit = parseInt(inp.attr("data-limit"));
                            if (val >= limit) {
                                jems.tipMsg("不能超过最大购买量!")
                                inp.val(limit);
                                return;
                            }
                        }
                        var result = saveCartNum1(id, 1);
                        if (result.errCode == 10000) {
                            inp.val(val + 1);
                            var boxState = $(this).parents("li").find("input[type='checkbox']").attr("data-choose");
                            if (boxState != "false" && boxState != undefined) {
                                if (dataType == "foreign") {
                                    countFreePrice = foreignSumAmt + price;
                                } else if (dataType == "drink") {
                                    countFreePrice = drinkSumAmt + price;
                                } else if (dataType == "fresh") {
                                    countFreePrice = freshSumAmt + price;
                                } else {
                                    countFreePrice = onionSumAmt + price;
                                    checkOnionMoney(countFreePrice);
                                }
                                sumTotalMoney(countFreePrice, dataType);
                            }

                        } else {
                            //inp.val(val - 1);
                            showSaveCartResult(result);
                        }
                    });
                    /**
                     * 减
                     */
                    $(".cartmin").on("click", function () {
                        var inp = $(this).next();
                        var id = $(this).parents("li").attr("data-id");
                        var val = parseInt(inp.val());
                        var price = parseFloat($(this).parents("li").attr("data-price"));
                        var photoobj = $(this).parents('li').find("div.photo");
                        var qty = $(this).parents('li').find('input.radio').attr("data-qty");
                        countFreePrice = parseFloat($("#countPrice").html());
                        if (val <= 1) {
                            jems.tipMsg("最少购买一件!")
                            inp.val(1);
                        } else {
                            inp.val(val - 1);
                            var result = saveCartNum1(id, -1);
                            if (result.errCode == 10000) {
                                var boxState = $(this).parents("li").find("input[type='checkbox']").attr("data-choose");
                                if (boxState != "false" && boxState != undefined) {
                                    var dataType = inp.attr("data-type");
                                    if (dataType == "foreign") {
                                        countFreePrice = foreignSumAmt - price;
                                    } else if (dataType == "drink") {
                                        countFreePrice = drinkSumAmt - price;
                                    } else if (dataType == "fresh") {
                                        countFreePrice = freshSumAmt - price;
                                    } else {
                                        countFreePrice = onionSumAmt - price;
                                    }
                                    sumTotalMoney(countFreePrice, dataType);
                                }
                                if (qty >= inp.val()) {
                                    photoobj.removeClass("soldout1");
                                }

                            } else {
                                inp.val(val);
                                showSaveCartResult(result);
                            }
                        }
                    })

                    /**
                     * 跳转
                     */
                    $(".photo,.jeell,.tsl,.edit").on("click", function (e) {
                        e.preventDefault();
                        var parali = $(this).parents("li");
                        var paraid = parali.attr("data-parentId");
                        var id = parali.attr("data-id");
                        if (parali.attr("data-type") == 1) {
                            jems.goUrl("../foreign-detail.html?id=" + paraid);
                        } else {
                            jems.goUrl("../goods-details.html?id=" + id);
                        }
                    })
                    totalPage = data.totalPage;
                    pageNum++;
                }
            }

            //删除当前购物车的当前行
            $(".carts-fs-list li").touchWipe({
                delBtn: '.cartdelbtn',
                delfun: function (elem) {
                    elem.on("click", function () {
                        if (deleCartById($(this).attr("data-id"))) {
                            countFreePrice = parseFloat($("#countPrice").html());
                            var liobj = $(this).parents("li");
                            var price = parseFloat(liobj.attr("data-price"));
                            if (liobj.find("input[type='checkbox']").attr("data-choose")) {
                                var inputobj = liobj.find("input[name='cartname']");
                                var dataType = inputobj.attr("data-type");
                                if (dataType == "foreign") {
                                    countFreePrice = foreignSumAmt - price * inputobj.val();
                                } else if (dataType == "drink") {
                                    countFreePrice = drinkSumAmt - price * inputobj.val();
                                } else if (dataType == "fresh") {
                                    countFreePrice = freshSumAmt - price * inputobj.val();
                                } else {
                                    countFreePrice = onionSumAmt - price * inputobj.val();
                                }
                                sumTotalMoney(countFreePrice, dataType);
                            }
                            $(this).parent().remove();
                            hideItem();
                        }
                    });
                }
            });
        }
    });
}

function hideItem() {
    $("#ANIblock ul").find("li").length <= 0 ? $("#ANIblock").addClass("hide")
        : $("#ANIblock").removeClass("hide");
    $("#drinksblock ul").find("li").length <= 0 ? $("#drinksblock").addClass(
        "hide") : $("#drinksblock").removeClass("hide");
    $("#foreignblock ul").find("li").length <= 0 ? $("#foreignblock").addClass(
        "hide") : $("#foreignblock").removeClass("hide");
    $("#onion ul").find("li").length <= 0 ? $("#onion").addClass("hide") : $(
        "#onion").removeClass("hide");
    $("#freshblock ul").find("li").length <= 0 ? $("#freshblock").addClass(
        "hide") : $("#freshblock").removeClass("hide");
    if ($("#ANIblock ul").find("li").length <= 0
        && $("#onion ul").find("li").length <= 0) {
        $("#seasblock").addClass("hide")
    }
}

/**
 *
 * @param dutyTotal
 * @returns
 */
function checkOnionMoney(dutyTotal) {
    if (dutyTotal > 1000) {
        jems.mboxMsg("洋葱OMALL的商品一单不可超1000元");
        return;
    }
}

/**
 * 更改数量
 * @param cartnumdata
 */
function saveCartNum1(cartId, num, obj) {
    var result;
    //var cartnumdata = "numdata=" + cartId + ":" + num;
    // 发送数据到后台
    if (cartId != '' && num != '') {
        $.ajax({
            type: 'post',
            async: false,
            url: msonionUrl + "cart/editnum",
            data: {"goodsId": cartId, "num": num, "menuId": 0},
            success: function (json) {
                result = JSON.parse(json);
            }
        });
    }
    return result;
}

function showSaveCartResult(result) {
    if (3003 == result.errCode) {
        jems.mboxMsg("该商品是限购商品<br />每人限购" + result.limitNum + "件");
        return;
    } else if (10010 == result.errCode) {
        jems.mboxMsg("数量不能为空");
        return;
    } else if (3005 == result.errCode || 3008 == result.errCode) {
        jems.mboxMsg("商品库存不足或者已经下架");
        return;
    } else if (3009 == result.errCode) {
        jems.mboxMsg("购物车数量不能少于1");
        return;
    } else if (10086 == result.errCode) {
        jems.mboxMsg("网络异常，请稍后再试");
        return;
    } else if (5008 == result.errCode) {
        jems.mboxMsg("库存不足");
        return;
    } else {
        jems.mboxMsg(result.errMsg);
    }
}

function sumTotalMoney(countFreePrice, type) {
    if (type == "onion") {
        onionSumAmt = countFreePrice;
        dutyTotal = sodTariff - onionSumAmt;
        $('#dutyTotal').text((dutyTotal).toFixed(2));//剩余金额
        if (onionSumAmt > 0) {
            findTmn(tmn, onionSumAmt);
        }
        if (onionSumAmt < 299) {
            $("#onionDesc").hide();
        } else {
            $("#onionDesc").show();
        }
    } else if (type == "drink") {
        drinkSumAmt = countFreePrice
    } else if (type == "foreign") {
        foreignSumAmt = countFreePrice
    } else if (type == "fresh") {
        freshSumAmt = countFreePrice;
    } else {
        //otherSumAmt = countFreePrice;
    }
    var totalAmt = drinkSumAmt + foreignSumAmt + onionSumAmt + freshSumAmt;
    countPrice.html(totalAmt.toFixed(2));//总额
    $("#onionSumAmt").text(onionSumAmt.toFixed(2));
    $("#foreignSumAmt").text(foreignSumAmt.toFixed(2));
    $("#drinkSumAmt").text(drinkSumAmt.toFixed(2));
    $("#freshSumAmt").text(freshSumAmt.toFixed(2));
    if (totalAmt <= 0 || dutyTotal < 0) {
        $("#settlement").removeClass("btn-cartBtn-acur").addClass("btn-cartBtn").attr('disabled', true);
    } else {
        $("#settlement").removeClass("btn-cartBtn").addClass("btn-cartBtn-acur").removeAttr('disabled');
    }
}

function findTmn(tmn, countPrice) {
    $.ajax({
        type: "post",
        data: {"tmn": tmn, "countPrice": countPrice},
        url: msonionUrl + "terminal/isFreeShipp",
        dataType: "json",
        success: function (data) {
            if (data.success) {
                $("#coumosfix").text("0.0");
                $("#shipfix").text("0.0");
            } else {
                $("#coumosfix").text("20.0");
                $("#shipfix").text("5.0");
            }
        }
    });
}

/*限购规则不符时的弹框提示*/
function limitMsg(title, msg, obj) {
    var lim = mBox.open({
        title: [title, 'color:#8016AD;font-size:1.4rem;'],
        width: "90%",
        content: "<p class='tc f14' style='width:100%'>" + msg + "</p>",
        closeBtn: [false, 1],
        btnName: ['确定'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            $(obj).prop('checked', false);
            // getCartCount()
            mBox.close(lim);
        }
    })
}

/**
 * 删除购物车
 */
function deleCartById(productId) {
    var result = false;
    // 发送数据到后台
    if (productId != '') {
        $.ajax({
            type: 'post',
            async: false,
            url: msonionUrl + "cart/delete",
            data: {"cartIds": productId},
            success: function (json) {
                result = JSON.parse(json);
                if (result.state == 1) {
                    result = true;
                }
            }
        });
    }
    return result;
}

/**
 * 商品状态
 * @param qty
 * @param saleState
 * @returns
 */
function getSoldOutClass(qty, saleState) {
    var strSoldOutClass = "";
    if (qty <= 0) {
        if (saleState == 2 || saleState == 9) {
            strSoldOutClass = "soldout2";
        }
        else if (saleState == 3 || saleState == 6 || saleState == 7 || saleState == 8) {
            strSoldOutClass = "soldout3";
        }
        else if (saleState == 5 || saleState == 10) {
            strSoldOutClass = "soldout5";
        }
        else {
            strSoldOutClass = "soldout1";
        }
    }
    else {
        if (saleState == 6 || saleState == 7 || saleState == 8) {
            strSoldOutClass = "soldout3";
        }
        else if (saleState == 5 || saleState == 10) {
            strSoldOutClass = "soldout5";
        } else {
            strSoldOutClass = "";
        }
    }
    if (saleState == 4) {
        strSoldOutClass = "soldout4";
    }
    return strSoldOutClass;
}

/**
 * 销售信息返回状态描述
 * @param status
 * @returns
 */
function StatusTipMessage(photoObj, that, thisSolfMsg) {
    if (photoObj.hasClass("soldout1")) {
        limitMsg("温馨提示:", thisSolfMsg + "库存不足", that);
        return;
    } else if (photoObj.hasClass("soldout2")) {
        limitMsg("温馨提示:", thisSolfMsg + "过季暂缓", that);
        return;
    } else if (photoObj.hasClass("soldout3")) {
        limitMsg("温馨提示:", thisSolfMsg + "目前停售", that);
        return;
    } else if (photoObj.hasClass("soldout4")) {
        limitMsg("温馨提示:", thisSolfMsg + "等待活动上线", that);
        return;
    } else if (photoObj.hasClass("soldout5")) {
        that.prop('checked', false);
        jems.mboxMsg("预热商品暂不可下单");
        return;
    } else {
        return "";
    }
}