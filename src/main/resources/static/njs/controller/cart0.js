/**
 @Js-name:cart.js
 @Zh-name:购物车JS函数
 */
//订单限额 2016-01-14
var sodTariff = 1000;
var newStore = false;
var memberTmn;
$(function() {
    $('#dutyTotal').text(sodTariff);
    var pageNum = 1;
    var totalPage = 1;
    $("#mytips").html(cartoedertip);
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
    //购物车商品列表数据加载
    $(window).dropload({
        afterDatafun: cartListData
    });
    //获取购物车商品列表的数据
    function cartListData() {
        if(pageNum > totalPage) {
            return;
        }
        var tmn =  jems.parsURL(window.location.href).params.tmn;
        var data = {
            'tmn':tmn,
            'pageNo': pageNum,
            't': new Date().getTime()
        };
        $.ajax({
            type: "POST",
            url: msonionUrl + "cart/list/v1",
            data: data,
            dataType: "json",
            success: function(data) {
                newStore = data.newStore;
                if(data.errCode == 4001) {	// 如果未登录，则跳至登录页面
                    jems.goUrl("../login.html?" + window.location.href);
                } else {
                	memberTmn = data.mytmn;
                    if (data.newStore){
                        $("#newstore").text("新店铺满299元免邮");
                    }
                    if(data.data == "" || data.data == null) {
                        $(".nogoodsShow").removeClass("hide");//购物车数量为0时显示返回首页提示
                    } else {
                        var gettpl = $('#cartlistData').html();
                        jetpl(gettpl).render(data, function(html) {
                            $('#cartlist').append(html);
                            allCartCount();
                        });
//						seaoffTips();// 提示弹出框 （请勿删除）
                        totalPage = data.totalPage;
                        pageNum++;
                    }
                }
            }
        });
    }
    function seaoffTips() {
        mBox.open({
            title: ['洋葱通知', 'color:#8016AD;font-size:1.4rem;'],
            width: "90%",
            height: "55%",
            content: mBox.cell("#seaoff"),
            closeBtn: [false, 1],
            btnName: ['确定'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false
        })
    }

    /*限购规则不符时的弹框提示*/
    function limitMsgBox(title, msg) {
        mBox.open({
            title: [title, 'color:#8016AD;font-size:1.4rem;'],
            width: "80%",
            content: "<p class='tc f16' style='width:100%;-webkit-box-pack: inherit;overflow:auto'>" + msg + "</p>",
            closeBtn: [false, 1],
            btnName: ['确定'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false
        })
    }

    function allCartCount() {
        var chkNameCell = $("#cartlist li input[name='cart']");
        var cartNumCell = $("#cartlist li .cartnum");
        var chooseAll = $('#checkAll');
        //单个选择
        chkNameCell.on("change", function(e) {
            e.preventDefault();
            var that = $(this), thisSolfMsg = "", moSize = chkNameCell.length, checkSize = 0;
            var cartnum = parseInt(that.attr("data-cartnum")),
                isOutOff = parseInt(that.attr("data-value")),
                thisqty = parseInt(that.attr("data-num")),
                saleState = parseInt(that.attr("data-saleState")),
                thisname = that.attr("data-name");
            for(var i = 0; i < chkNameCell.length; i++) {
                if(chkNameCell[i].checked) {
                    checkSize++;
                }
            }
            if (saleState == 5 || saleState == 10){
                that.prop('checked', false);
                chooseAll.find("span").removeClass("checkyes").attr("choose", 'false');
                jems.tipMsg("预热商品暂不可下单");
                return;
            }else if(isOutOff == 2 || thisqty <= 0 || parseInt(cartnum) > parseInt(thisqty)) {
                that.prop('checked', false);
                chooseAll.find("span").removeClass("checkyes").attr("choose", 'false');
                thisSolfMsg += thisname + "</br>";
                if(thisSolfMsg != "") {
                    limitMsg("库存不足温馨提示:", thisSolfMsg + "库存不足");
                    return;
                }
            }else{
                if(checkSize == moSize) {
                    chooseAll.find("span").addClass("checkyes").attr("choose", 'true');
                } else {
                    chooseAll.find("span").removeClass("checkyes").attr("choose", 'false');
                }
            }
            getCartCount();
        });
        //全选与取消
        chooseAll.on('tap', function(e) {
            e.preventDefault();
            var thatSpan = chooseAll.find("span");
            if(thatSpan.attr("choose") == 'false') {
                thatSpan.addClass("checkyes").attr("choose", 'true');
                chkNameCell.prop('checked', true);
            } else {
                thatSpan.removeClass("checkyes").attr("choose", 'false');
                chkNameCell.prop('checked', false);
            }
            var chkNameS = $("#cartlist li input[name='cart']");
            var cartNumS = $("#cartlist li .cartnum");
            var offSolfMsg = "",saleState;
            for(var i = 0; i < chkNameS.length; i++) {
                if(chkNameS[i].checked) {
                    var num = cartNumS.eq(i).val();
                    var isOutOff = chkNameS.eq(i).attr("data-value");
                    var qty = chkNameS.eq(i).attr("data-num");
                    var product_name = chkNameS.eq(i).attr("data-name");
                    saleState = parseInt(chkNameS.eq(i).attr("data-saleState"));
                    if (saleState == 5 || saleState == 10){
                        chkNameS[i].checked = false;
                        jems.tipMsg("预热商品暂不可下单");
                    }
                    if(isOutOff == 2 || qty <= 0 || parseInt(num) > parseInt(qty)) {
                        thatSpan.removeClass("checkyes").attr("choose", 'false');
                        offSolfMsg += product_name + "</br>"
                        chkNameS[i].checked = false;
                    }
                }
            }
            if(offSolfMsg != "") {
                limitMsg("库存不足温馨提示:", offSolfMsg + "库存不足");
                return;
            }
            getCartCount();
        });
        //修改购物车数量返回结果   libz  time:2016-12-21
        var editNumResult;
        //改变购买数量
        $.each($("#cartlist li"), function() {
            var that = $(this),
                numCell = ".cartnum",
                RealPay = ".realpay",
                DutyFree = ".dutyfree";
            //计算免税额
            function RealDuty(num) {
                that.find(RealPay).html("&yen;" + jems.formatNum(parseFloat(that.find(numCell).attr("price")) * num), 2);
                that.find(DutyFree).html("&yen;" + jems.formatNum(parseFloat(that.find(numCell).attr("duty")) * num), 2);
            }
            //增加数量
            that.find(".cartadd").on('tap', function() {
                // 获取商品id和分类id,供商品限购使用 2015-11-30
                var goodsId = that.find('input[name="cart"]').data("leid");//获取商品编号
                var menuId = that.find('input[name="cart"]').data("mid");//获取商品分类编号
                var parNum = parseInt(that.find(numCell).val());//加减数量
                editNumResult = saveCartNum1(that.find('input[name="cart"]').val(),1,menuId);
                var errCode = editNumResult.errCode;
                if(3003 == errCode){
                    jems.mboxMsg("该商品是限购商品<br />每人限购"+ editNumResult.limitNum +"件");
                    return;
                }else if(10010 == errCode){
                    jems.mboxMsg("数量不能为空");
                    return;
                }else if(3005 == errCode || 3008 == errCode){
                    jems.mboxMsg("商品库存不足或者已经下架");
                    return;
                }else if(3009 == errCode){
                    jems.mboxMsg("购物车数量不能少于1");
                    return;
                }else if(10086 == errCode){
                    jems.mboxMsg("网络异常，请稍后再试");
                    return;
                }else if(5008 == errCode){
                    jems.mboxMsg("库存不足");
                    return;
                }
                var letqty = that.find('input[name="cart"]').attr("data-num");//商品库存
                var letstate = that.find('input[name="cart"]').attr("data-value");//商品状态：1上架  2下架
                var data_oid = parseInt(that.find(numCell).attr("data-oid"));//商品编号
                if(letqty > parNum && letstate == 1) { //库存大于 购物车数量才可以加
                    var addNum = parseInt(that.find(numCell).val()) + 1;
                    that.find(numCell).val(addNum);
                    that.find('input[name="cart"]').attr("data-cartnum",addNum);
                    RealDuty(addNum);
                } else {
                    addNum = 1;
                    $("#qtyHtml" + data_oid).show();
                }
                // 记录修改状态
                recordState(that.find(numCell));
                getCartCount();
            });
            //减少数量
            that.find(".cartmin").on('tap', function() {
                // 获取商品id和分类id,供商品限购使用 2015-11-30
                var letqty = that.find('input[name="cart"]').attr("data-num");//商品库存
                var parNum = parseInt(that.find(numCell).val());
                var menuId = that.find('input[name="cart"]').data("mid");//获取商品分类编号
                var data_oid = parseInt(that.find(numCell).attr("data-oid"));
                $("#qtyHtml" + data_oid).hide();
                var minNum = parseInt(that.find(numCell).val()) - 1;
                if(minNum != undefined && minNum > 0){
                    editNumResult = saveCartNum1(that.find('input[name="cart"]').val(),-1,menuId);
                    var errCode = editNumResult.errCode;
                    if(3003 == errCode){
                        jems.mboxMsg("该商品是限购商品<br />每人限购"+ editNumResult.limitNum +"件");
                        return;
                    }else if(10010 == errCode){
                        jems.mboxMsg("数量不能为空");
                        return;
                    }else if(3005 == errCode || 3008 == errCode){
                        jems.mboxMsg("商品库存不足或者已经下架");
                        return;
                    }else if(3009 == errCode){
                        jems.mboxMsg("购物车数量不能少于1");
                        return;
                    }else if(10086 == errCode){
                        jems.mboxMsg("网络异常，请稍后再试");
                        return;
                    }else if(5008 == errCode){
                        jems.mboxMsg("库存不足");
                        return;
                    }
                    if(letqty >= minNum) {
                        $("#qtySpqn"+data_oid).hide();
                    }
                }
                if(parNum > 1) {
                    that.find(numCell).val(minNum);
                    that.find('input[name="cart"]').attr("data-cartnum",minNum);
                    RealDuty(minNum);
                } else {
                    that.find(numCell).val(1);
                    RealDuty(1);
                }
                // 记录修改状态
                recordState(that.find(numCell));
                getCartCount();

            });
        });
        //删除单个商品
        $(".delcart").on('tap', function() {
            var cartIds = $(this).data("delid");
            $.ajax({
                type: "post",
                url: msonionUrl + "cart/delete?cartIds=" + cartIds,
                dataType: "json",
                success: function(data) {
                    var msg = "";
                    if(data.state == 0) {
                        msg = "删除失败！";
                    } else if(data.state == 1) {
                        msg = "删除成功！";
                        $('#cart-' + cartIds).remove();
                        getCartCount();
                    }
                    jems.mboxMsg(msg);
                }
            });
        })
        //统计价格与数量
        function getCartCount() {
            var priceTotal = 0,
                dutyTotal = 0,
                dutyCount = 0;
            var chkNameS = $("#cartlist li input[name='cart']");
            var cartNumS = $("#cartlist li .cartnum");
            for(var i = 0; i < chkNameS.length; i++) {
                if(chkNameS[i].checked) {
                    var num = cartNumS.eq(i).val();
                    var price = cartNumS.eq(i).attr("price"),
                        duty = cartNumS.eq(i).attr("duty");
                    priceTotal = (parseFloat(priceTotal) + parseFloat(num) * parseFloat(price)); //+ 25;
                }
            }
            var dutyCount = sodTariff - priceTotal
            priceTotal =  jems.formatNum(priceTotal);
            console.log(priceTotal == 0 || priceTotal == 0.00 );
            if (priceTotal == 0 || priceTotal == 0.00 ){
                $("#other_tip").hide();
                $("#newstore").show();
                $("#newstore").text(newStore?"新店铺满99元免邮":"全场满299元免邮 ");
            } else if(newStore && priceTotal > 0 && priceTotal < 99){//新开店铺三天99包邮
                $("#newstore").hide();
                $("#other_tip").text("运费25元，还差"+jems.formatNum(99-priceTotal)+"元即可免邮，去凑单");
                $("#other_tip").show();
            } else if(newStore && priceTotal >= 99 &&  priceTotal < 1000){//新开店铺三天99包邮
                $("#newstore").hide();
                $("#other_tip").text("已免邮,再逛逛");
                $("#other_tip").show();
            } else if(priceTotal < 299){
                $("#newstore").hide();
                $("#other_tip").text("运费25元，还差"+jems.formatNum(299-priceTotal)+"元即可免邮，去凑单");
                $("#other_tip").show();
            } else if(priceTotal >= 299 && priceTotal < 1000){
                $("#newstore").hide();
                $("#other_tip").text("已免邮,再逛逛");
                $("#other_tip").show();
            } else {
                $("#newstore").hide();
                $("#other_tip").text("单笔金额不能超￥1000元");
                $("#other_tip").show();
                mBox.open({
                    title: ['洋小葱有话说', 'color:#8016AD;font-size:1.4rem;text-align: center;'],
                    width: "90%",
                    //height: "90%",
                    content: mBox.cell("#instructionsinstr"),
                    closeBtn: [false, 1],
                    btnName: ['关闭'],
                    btnStyle: ["color: #0e90d2;"],
                    maskClose: false
                });
            }
            $('#countPrice').text(jems.formatNum(priceTotal));
            //$("#dutyTotal").text(dutyCount.toFixed(dutyTotal==0 ? 0:1));
            $("#dutyTotal").text(jems.formatNum(dutyCount));
            //判断总额是否为0，为0则冻结结算按钮
            if($("#countPrice").text() == 0 || $("#dutyTotal").text() < 0) {
                $("#settlement").removeClass("btn-cartBtn-acur").addClass("btn-cartBtn").attr('disabled', true);
            } else {
                $("#settlement").removeClass("btn-cartBtn").addClass("btn-cartBtn-acur").removeAttr('disabled');
            }
        };
    }
    /**
     *结算
     */
    $("#settlement").on('tap', function() {
    	if(memberTmn == 0){
       		mBox.open({
    			content:"您的账号还未填写邀请码",
    			closeBtn: [false],
    			btnName:['去绑定'],
    			btnStyle:["color: #0e90d2;"],
    			maskClose:false,
    			yesfun : function(){
    				jems.goUrl("../ucenter/bind-tmn.html");
    			}
    		});
       		return;
    	}
        var countPrice = $("#countPrice").text();
        if(countPrice == 0 || $("#dutyTotal").text() < 0) {
            return false;
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
            yesfun: function() {
                mBox.close(lim);
                settlement();
            }
        })
        // settlement();
    })

    function settlement() {
        var countPrice = $("#countPrice").text();
        var chkNameS = $("#cartlist li input[name='cart']"),
            cartNumS = $("#cartlist li .cartnum");
        var cartIds = "",
            goodsPrice = new Array(),
            cartIdsArr = new Array(),
            numsArr = new Array(),
            index = 0,
            offSolfMsg = "";
        var is50Flag = false;//是否包含限购商品
        var aniNum = 0;
        for(var i = 0; i < chkNameS.length; i++) {
            if(chkNameS[i].checked) {
                var num = cartNumS.eq(i).val(),
                    carid = chkNameS.eq(i).attr("value"),
                    price = cartNumS.eq(i).attr("price");
                goodsPrice[index] = Math.round(price*num);
                cartIdsArr[index] = carid;
                numsArr[index] = num;
                index++;
                var isOutOff = chkNameS.eq(i).attr("data-value");
                var qty = chkNameS.eq(i).attr("data-num");
                var product_name = chkNameS.eq(i).attr("data-name");
                if(isOutOff == 2 || qty <= 0 || parseInt(num) > parseInt(qty)) {
                    offSolfMsg += product_name + "</br>"
                }
                var leCode = chkNameS.eq(i).attr("data-leCode");
                /*if(leCode.substring(leCode.length-2) == 50){
                    aniNum = aniNum + parseInt(num);
                    is50Flag = true;
                }*/
            }
        }
        if(offSolfMsg != "") {
            limitMsgBox("库存不足温馨提示:", offSolfMsg + "----库存不足");
            return;
        }
        /*if(is50Flag && aniNum < 3 ) {
            limitMsgBox("温馨提示:","As Nature Intended英国有机超市的商品3件起售");
            return;
        }*/
        for(var i = 0; i < cartIdsArr.length; i++) {
            if(i == cartIdsArr.length - 1) {
                cartIds += cartIdsArr[i] + "_" + numsArr[i];
            } else {
                cartIds += cartIdsArr[i] + "_" + numsArr[i] + ",";
            }
        }
        if(cartIds == null || cartIds == "" || typeof(cartIds) == undefined) {
            jems.tipMsg("请选择结算商品");
            return;
        } else {
            sessionStorage.cartIds = cartIds;
            sessionStorage.countPrice = countPrice;
            jems.goUrl("../ucenter/cart-order-sumbit.html");
            return;
        }
    };
    /*凑单 add by cjw*/
    $("#other_tip").on('tap', function() {
        // 获取剩余免税额
        var countPrice = $("#dutyTotal").text();
        // 如果剩余税额没有了，则不给点击
        if(parseFloat(countPrice) && parseFloat(countPrice) < 0 || parseFloat(countPrice) == sodTariff)
            return false;
        sessionStorage.keywords == "";
        sessionStorage.menuIds =  "";
        sessionStorage.brandIds =  "";
        sessionStorage.countryIds = "" ;
        sessionStorage.minamt =0;
        sessionStorage.maxamt = countPrice
        var url = mspaths + "search-list.html?maxamt=" + countPrice;
        goNextPage(url);
    });
    //返回顶部插件引用
    $(window).goTops({
        toBtnCell: "#gotop",
        posBottom: 55
    });
    /*$("#instructions").on('tap', function() {
        mBox.open({
            title: ['洋小葱有话说', 'color:#8016AD;font-size:1.4rem;text-align: center;'],
            width: "90%",
            //height: "90%",
            content: mBox.cell("#instructionsinstr"),
            closeBtn: [false, 1],
            btnName: ['关闭'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false
        });
    })*/
});

function dialogMsg(msg) {
    mBox.open({
        width: "80%",
        content: "<p class='tc f16' style='width:100%'>" + msg + "</p>",
        closeBtn: [false, 1],
        btnName: ['确定'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: false
    })
}
/*保存修改后的购物车数量*/
function saveCartNum() {
    var cartinput = $("#cartlist li .cartmas").find("input"),
        cartnumdata = '';
    // 获取已改过的数量
    cartinput.each(function(index) {
        var isedit = $(this).data("isedit");
        if(isedit) {
            index != 0 && (cartnumdata += "&");
            cartnumdata += "numdata=" + ($(this).data("oid") + ":" + $(this).val());
        }
    });
    // 发送数据到后台
    if(cartnumdata != '') {
        $.ajax({
            type: 'post',
            async: false,
            url: msonionUrl + "cart/editnum",
            data: cartnumdata
        });
    }
}

function saveCartNum1(cartId,num,menuId) {
    var result;
    //var cartnumdata = "numdata=" + cartId + ":" + num;
    // 发送数据到后台
    if(cartId != '' && num != '' && menuId != '') {
        $.ajax({
            type: 'post',
            async: false,
            url: msonionUrl + "cart/editnum",
            data: {"goodsId":cartId,"num":num,"menuId":menuId},
            success:function(json){
                result = JSON.parse(json);
            }
        });
    }
    return result;
}

/**
 * 记录修改购物车数量的状态
 * 增加或减少时判断是否真正修改了数量
 * @param that
 */
function recordState(inputele) {
    var val = inputele.val(),
        price = parseFloat(inputele.attr("price")),
        poid = inputele.attr("data-oid"),
        dvalue = inputele.data("value");
    $("#price" + poid).html("&yen;" + jems.formatNum(val * price));
    // 标识修改过数量的记录,保证只有数量发生真正修改时才会与数据库交互
    val != dvalue ? inputele.data('isedit', 'true') : inputele.data('isedit', 'false');
}

/**
 * 根据地址跳转/返回至下个页面
 * @param url
 */
function goNextPage(url) {
    // 保存购物车的修改数量
//	saveCartNum();
    // 如果有传地址，则跳至地址处
    if(url) {
        jems.goUrl(url);
    } else {
        // 没传地址则返回上一页
        jems.goBack();
    }
}

/*检查限购商品*/
function checkLimit() {
    var products = [];
    // 取所有复选框
    var chkNameS = $("#cartlist").find("input[name='cart']");
    chkNameS.each(function() {
        var that = $(this);
        if(that.attr("checked")) {
            // 取商品信息
            var pinfo = that.siblings('input').val();
            // 取购买数量
            var num = that.parents('li').find('input[name="cartname"]').val();
            var pinfos = pinfo.split(':');
            var jsonparam = '{\"id\":\"' + pinfos[0] + '\",\"qty\":\"' + num + '\"}';
            products.push(jsonparam);
        }
    });
    var result = {};
    if(products.length > 0) {
        $.ajax({
            type: 'post',
            url: msonionUrl + "sodrest/sodlimit",
            data: 'products=' + (products.join('-')),
            dataType: 'json',
            async: false,
            success: function(msg) {
                result = msg;
            }
        });
    }
    return result;
}

function checkState(obj) {
    var data_name = $(obj).attr("data-name");
    var data_stat = $(obj).attr("data-value"); //上架状态 2--下架
    var data_num = $(obj).attr("data-num"); //库存
    var data_cartnum = $(obj).attr("data-cartnum"); //购物车数量
    //取ERP库存
    /*	var data_leid = $(obj).attr("data_leid");
         var count = 0 ;
         $.ajax({
             type: "post",
             data:{"leId":data_leid},
             async: false,
             url: msonionUrl + "sodrest/getLecount",
             success: function(data) {
                 count = data;
             }
         });*/
    if(data_stat == 2 || data_num <= 0 || parseInt(data_cartnum) > parseInt(data_num)) {
        limitMsg("库存不足温馨提示:", data_name + "----库存不足", obj);
    }
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
        yesfun: function() {
            $(obj).prop('checked', false);
            getCartCount()
            mBox.close(lim);
        }
    })
}

function getCartCount() {
    var priceTotal = 0,
        dutyTotal = 0,
        dutyCount = 0;
    var chkNameS = $("#cartlist li input[name='cart']");
    var cartNumS = $("#cartlist li .cartnum");
    for(var i = 0; i < chkNameS.length; i++) {
        if(chkNameS[i].checked) {
            var num = cartNumS.eq(i).val();
            var price = cartNumS.eq(i).attr("price"),
                duty = cartNumS.eq(i).attr("duty");
            priceTotal = (parseFloat(priceTotal) + parseFloat(num) * parseFloat(price)); //+ 25;
        }
    }
    var dutyCount = sodTariff - priceTotal
    $('#countPrice').text(jems.formatNum(priceTotal));
    //$("#dutyTotal").text(dutyCount.toFixed(dutyTotal==0 ? 0:1));
    $("#dutyTotal").text(jems.formatNum(dutyCount));
    //判断总额是否为0，为0则冻结结算按钮
    if($("#countPrice").text() == 0 || $("#dutyTotal").text() < 0) {
        $("#checkAll").prop('checked', false);
        //$("#settlement,#coudan").removeClass("btn-cartBtn-acur").addClass("btn-cartBtn").attr('disabled', true);
        $("#settlement").removeClass("btn-cartBtn-acur").addClass("btn-cartBtn").attr('disabled', true);
    } else {
//		$("#settlement,#coudan").removeClass("btn-cartBtn").addClass("btn-cartBtn-acur").removeAttr('disabled');
        $("#settlement").removeClass("btn-cartBtn").addClass("btn-cartBtn-acur").removeAttr('disabled');
    }
};

function getDoubleProduce() {
    var numsArr = new Array();
    $.ajax({
        url: "js/common/carNum.txt",
        dataType: "json",
        async: false,
        success: function(data) {
            var ids = data.double
            var objArr = ids.split(",");
            for(var i = 0; i < objArr.length; i++) {
                numsArr[i] = objArr[i].split(":")[1];
            }
        }
    });

    return numsArr;
}

/**
 * 商品限购
 * @param gid
 * @param num
 * @param mid
 * @returns {Boolean}
 */
function limitrule(gid, num, mid) {
    var limit = true;
    var params = {
        "gid": gid,
        "buynum": num,
        "menuid": mid,
        "t": new Date().getTime()
    };
    var url = msonionUrl + "sodrest/sodlimit1";
    $.ajax({
        type: 'get',
        url: url,
        data: params,
        dataType: 'json',
        async: false,
        success: function(msg) {
            var info = "该商品是限购商品";
            info += "<br />每人限购" + msg.limitNum + "件";
            msg.islimit && jems.mboxMsg(info);
            limit = msg.islimit;
        }
    });
    return limit;
}
/**
 *  查询是否免邮
 * @param tmn
 * @param countPrice
 */
function diffFreeShipping(tmn,countPrice){
    $.ajax({
        type: "post",
        data:{"tmn":tmn,"countPrice":countPrice},
        url: msonionUrl + "terminal/diffFreeShipping",
        dataType: "json",
        success: function(data) {
            if(data.success){
                /*$("#coumosfix").text("0.0");
                $("#shipfix").text("0.0");
                $("#totalCount").text(parseFloat(countPrice));
                $("#tipText").text(data.message);
                $(".newStore").show();*/
            }
        }
    });
}
