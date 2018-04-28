/**
 @Js-name:logistics_domestic.js
 @Zh-name:物流信息--国内配送
 @Author:tyron
 @Date:2015-08-05
 */
var params = jems.parsURL().params;
/** 特殊字符限制 **/
var reg = /^[A-Za-z\u4E00-\u9FA5]+\·?[A-Za-z\u4E00-\u9FA5]*$/;
/** 身份证校验 **/
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
/** 中文限制 **/
var isChinese = /[\u4e00-\u9fa5]/, addrsData, sodId;
var group = null;
$(function () {
    //console.log(msonionUrl+"sodrest/findSodById");
    $.ajax({
        type: "post",
        data: params,
        url: msonionUrl + "app/sodrest/findSodById/v4",
        dataType: "json",
        asyn: false,
        success: function (result) {
            if (4001 == result.errCode) {
                jems.goUrl(mspaths + "login.html?" + window.location.href);
            }
            if (result.data == null) {
                $("#myorde_nocart").css({display: "block"});
                return;
            }
            addrsData = result.data.addresses;
            var errCode = result.errCode;
            result.data.errCode = errCode;
            jetpl("#infoorderData").render(result, function (html) {
                $('#infoorder').html(html);
                goodSodStat();
            });
            $("#addSodId").val(result.data.sodId);
            group = result.data.sodIsGroup;

            function goodSodStat() {
                //申请退款(可能是团购.也可能是非团购.)
                $("#refundMoney").on("click", function () {
                    mBox.open({
                        content: "<p class='tc f15' style='width:100%'>确认申请退款吗?<br/>退款一旦受理，将取消发货！</p>",
                        closeBtn: [false, 1],
                        btnName: ['确认退款', '我再想想'],
                        btnStyle: ["color: #0e90d2;", "color: #0e90d2;"],
                        maskClose: false,
                        yesfun: function () {
                            var data = {"thRcFlg": 1, "sodId": result.data.sodId};
                            var sodPayFlg = result.data.sodPayFlg;
                            var sodDate = toGetTime(result.data.sodDate, false);
                            var sodPayTime = toGetTime(result.data.sodPayTime, false);
                            var nowTime = toGetTime("" + new Date().getTime(), true);
                            var timeDif = parseInt(nowTime) - sodPayTime;
                            if (sodPayFlg == 9 && timeDif > 30 * 24 * 60 * 60 * 1000) {
                                jems.goUrl('return-goodsBankMsg.html?id=' + result.data.sodId);
                            } else if (timeDif > 90 * 24 * 60 * 60 * 1000) {
                                jems.goUrl('return-goodsBankMsg.html?id=' + result.data.sodId);
                            } else {
                                if (group == 1 && parseInt(nowTime) - sodPayTime < 3600000 * 6) {
                                    jems.mboxMsg("该团购订单不允许退款!");
                                    return;
                                } else {
                                    submitThSodOfAll(data);
                                }
                            }
                        },
                        nofun: function () {

                        }
                    });
                })
                result.data.sodStat == 1 ? msCountDown(result.data.sodCreateTime) : $("#ordertime").remove();
                if (result.data.sodStat == 2 || result.data.sodStat == 3) {
                    //只有可能是6小时之内. 非团购
                    $("#orderPayStart").on('click', function () {
                        var isGroup = $(this).attr("data-isGroup");
                        var sodStat = $(this).attr("data-sodStat");
                        var sodNo = $(this).attr("data-sodNo");
                        if (isGroup == "true" && sodStat < 3) {
                            jems.mboxMsg("该团购订单不允许退款!");
                            return;
                        }
                        var msg = "订单取消后不能恢复，请确认是否取消?";
                        mBox.open({
                            content: msg,
                            btnName: ['取消订单', '返回'],
                            maskClose: false,
                            yesfun: function () {
                                if (isGroup == "true" && sodStat >= 3) {
                                    createTdSodGroup(sodNo);
                                } else {
                                    var nowTime = toGetTime("" + new Date().getTime(), true);
                                    var sodPayTime = toGetTime(result.data.sodPayTime, false);
                                    var sodDate = toGetTime(result.data.sodDate, false);
                                    var sodDelayTime = result.data.sodDelayTime == null ? 0 : toGetTime(result.data.sodDelayTime, false);
                                    var timeDif = parseInt(nowTime) - sodPayTime;
                                    var returnTimeDif = parseInt(nowTime) - sodDate;//可以退货时间
                                    if (timeDif < 21600000) {
                                        //支付时间小于6小时
                                        var data = {"thRcFlg": 1, "sodId": result.data.sodId};
                                        submitThSodOfAll(data);
                                    }
                                }
                            }, nofun: function () {
                            }
                        });
                    });
                }
            }
        }
    });
});


/**
 * 提交全部退单
 */
function submitThSodOfAll(data) {
    $.ajax({
        type: "POST",
        url: msonionUrl + "sodrest/createThSodOfAll/V2",
        data: data,
        dataType: "json",
        asyn: false,
        success: function (data) {
            if (data.flg == 0) {
                alert("友情提示:退货申请单创建失败");
                return;
            } else if (data.flg == 1) {
                jems.goUrl("../login.html?" + window.location.href);
                return;
            } else if (data.flg == 3) {
                if (data.return_over == 9) {
                    alert("温馨提示：你的商品已退完，如有疑问，请联系客服");
                } else {
                    jems.goUrl("order-refund.html");
                    return;
                }
            } else if (json.flg == 4) {
                alert("友情提示", "退货申请单创建成功，单您的退货申请发送到洋葱ERP失败，请联系管理员！", "确定");
                return;
            }
        }
    });
}


/**
 * 地址修改appendHTML
 */
function editaddres() {
    /** 获取地区信息 **/
    findAreaByLay("p");
    mBox.open({
        title: ['修改地址', 'font-size:1.6rem;'],
        boxtype: 2,
        closeBtn: [true, 1],
        height: "55%",
        padding: "0",
        btnName: ['确定修改'],
        btnStyle: ["color: #0e90d2;"],
        //content: '<div class="p10 jeovh" id="editadrscon"></div>',
        content: $("#editaddresData")[0],
        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
        yesfun: function () {
            /** 修改地址 **/
            updateSodAdd();
        }
    });
}

function toGetTime(strTime, isbol) {
    if (isbol) {
        return strTime;
    } else {
        if (strTime) {
            var newStr = strTime.replace(/:/g, "-");
            newStr = newStr.replace(/ /g, "-");
            var arr = newStr.split("-");
            var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return datum.getTime();
        }
    }
}

function msCountDown(ordertime) {
    var splitTime = function (date) {
        var a = date.split(' '), d = a[0].split('-'), t = a[1].split(':');
        return {YY: d[0], MM: d[1], DD: d[2], hh: t[0], mm: t[1], ss: t[2]};
    }
    $.ajax({
        type: "get",
        url: msonionUrl + "systime",
        dataType: "json",
        asyn: false,
        success: function (json) {
            var st = splitTime(json.t), serverTime = new Date(st.YY, st.MM - 1, st.DD, st.hh, st.mm, st.ss);
            var dateTime = new Date(), difference = dateTime.getTime() - serverTime;
            setInterval(function () {
                $("#ordertime").each(function () {
                    var that = $(this), ot = splitTime(ordertime);
                    var endTime = new Date(ot.YY, ot.MM - 1, ot.DD, ot.hh, ot.mm, ot.ss);
                    endTime.setTime(endTime.getTime() + (40 * 60 * 1000));
                    var nowTime = new Date();
                    var nMS = endTime.getTime() - nowTime.getTime() + difference;
                    var D = Math.floor(nMS / (1000 * 60 * 60 * 24));
                    var H = Math.floor(nMS / (1000 * 60 * 60)) % 24;
                    var M = Math.floor(nMS / (1000 * 60)) % 60;
                    var S = Math.floor(nMS / 1000) % 60;
                    var MS = Math.floor(nMS / 100) % 10;
                    if (nMS >= 0) {
                        that.css({display: "-webkit-box!important"});
                        $('#runtime').html(M + "分" + S + "." + MS + "秒");
                    } else {
                        $("#odinfostat").html("已关闭");
                        that.css({display: "none!important"});
                        $('#orderPayStart').removeAttr("id");
                    }

                });
            }, 100);
        }
    });
};

function ordertoPay(sid, isGroup, endtime) {
    $.ajax({
        type: "get",
        data: {"sodId": sid},
        url: msonionUrl + "sodrest/checkTimeout",
        dataType: "json",
        asyn: false,
        success: function (data) {
            if (data == 1) {
                mBox.open({
                    content: "<div class='jew100 tc'>交易超时</div>",
                    btnName: ['确定'],
                    btnStyle: ["color: #0e90d2;"],
                    maskClose: false,
                    yesfun: function () {
                        window.location.reload();
                    }
                });
                return;
            } else {
                var tip = "";
                $.each($("#goodsinfo li"), function () {
                    var sodItemQty = $(this).find('input[name="sodItemQty"]').val();
                    var productQty = $(this).find('input[name="productQty"]').val();//
                    var name = $(this).find('h3[name="pName"]').html();

                    if (parseInt(productQty) < parseInt(sodItemQty)) {
                        tip += name + "<br/>";
                    }
                });
                if (tip != "") {
                    dialogMsgATip(tip + "库存不足！", sid);
                    return "";
                } else if (isGroup == 1) {
                    if (endtime != null) {
                        var endTime = new Date(endtime);
                        var date = new Date();//当前时间
                        if (date > endTime) {
                            jems.mboxMsg("团结已结束!");
                            return;
                        } else {
                            jems.goUrl(mspaths + 'payment.html?sodId=' + sid);
                        }
                    }
                }
                else {
                    jems.goUrl(mspaths + 'payment.html?sodId=' + sid);
                }
            }
        },
        error: function (data) {
            jems.mboxMsg("network error!");
        }
    });

};

function dialogMsgATip(msg, sid) {
    mbox.open({
        width: "90%",
        height: 100,
        content: "<p class='tc f15' style='width:100%'>" + msg + "</p>",
        closeBtn: [false, 1],
        btnName: ['继续购买', '删除订单'],
        btnStyle: ["color: #0e90d2;", "color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            jems.defaults();
        },
        nofun: function () {
            cancelSod(sid);
        }
    });
};

function cancelSod(id) {
    if (id == null || id == "" || typeof(id) == undefined) {
        jems.mboxMsg("获取订单失败，请刷新");
        return;
    }
    mbox.open({
        width: "90%",
        height: 100,
        content: "<p class='tc f15' style='width:100%'>确定要删除吗？</p>",
        closeBtn: [false, 1],
        btnName: ['确定', '取消'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            $.ajax({
                type: "post",
                data: {"sodId": id},
                url: msonionUrl + "sodrest/cancelSod",
                dataType: "json",
                asyn: false,
                success: function (data) {
                    if (data.flg == 1) {
                        jems.goUrl('order-all.html');
                    } else {
                        jems.mboxMsg("删除失败");
                    }
                },
                error: function (data) {
                    jems.mboxMsg("network error!");
                }
            });
        }
    });
};

/**
 * 团购订单退款
 * @param sodId 团购订单号
 */
function createTdSodGroup(sodId) {
    $.ajax({
        type: "post",
        data: {"sodId": sodId},
        url: msonionUrl + "sodgroup/createTdSodGroup",
        dataType: "json",
        success: function (data) {
            if (data.errCode == 10000) {
                jems.mboxMsg("已提交退款申请,请勿重复提交");
                jems.goUrl("order-refund.html");
            } else {
                jems.mboxMsg(data.errMsg);
            }
        },
        error: function () {
            jems.mboxMsg("network error!");
        }
    });
}

function goToPage(isGroup, id, type, parentId) {
    if (isGroup == 1) {
        jems.goUrl('../group-details.html?id=' + id);
    }
    else {
        if (undefined != type && 1 == type) {
            jems.goUrl('../foreign-detail.html?id=' + parentId);
        } else {
            jems.goUrl('../goods-details.html?id=' + id);
        }
    }
}

/**
 * 查看物流
 * @param id 订单号
 */
//查看物流详细
function lookLogistics(orderId, type, expComNo, expNo) {
    if (orderId == null || orderId == "" || orderId == "undefined" || type == null || type == "" || type == "undefined") {
        jems.tipMsg("network error!");
        return;
    }
    var no = "", com = "qf", sodId = "";
    no = expNo;
    com = expComNo;
    mBox.open({
        title: ['物流信息'],
        boxtype: 2,
        closeBtn: [true, 1],
        height: "50%",
        padding: "0",
        content: '<div style="background-color: #f8f8f8;" id="wlDetailcon"></div>',
        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
        success: function () {
            var wlDetail = $('#wlDetail').html();
            $('#wlDetailcon').append(wlDetail);
            $("#mytips").html(cartoedertip);
            appendmbox(orderId, type);
        }
    });

    function appendmbox(orderId, type) {
        if (no == null || no == "" || no == "undefined") {//50仓则只查询此处
            foreign(orderId, type);
            return;
        }
        if (com == null || com == "" || typeof(com) == undefined || com == "undefined") {
            com = "qf";
        }

        $.ajax({
            type: "post",
            data: {"com": com, "no": no, "sodId": orderId},
            url: msonionUrl + "logistics/logisticsInfo?v_=" + new Date().getTime(),
            dataType: "json",
            asyn: false,
            success: function (json) {
                $("#wlloading").hide();
                json.data.no = no;
                var dats = {data: json.data};
                var nm = expComName(com);
                if (json.errCode == 0) {
                    $("#expressNo").text(json.data.no);
                    $("#wulinfo").show();
                    jetpl('#foreignData1').render(dats, function (html) {
                        $('#wulinfolist').append(html);
                        $("#logisticsCompany").text(nm);
                    });
                    if (json.data != "") $("#wulprogress").hide();
                } else {
                    var nm = expComName(com);
                    if (no == 'undefined') {
                        no = "暂无";
                        nm = "暂无";
                    }
                    $("#logisticsCompany1").text(nm);
                    $("#logisticsCompany2").text(no);
                    //$("#nocartInfo").text(result.data);

                    $("#nocart").css({display: "block"});
                }
                foreign(orderId, type);
            }
        });

        function foreign(orderId, type) {
            $.ajax({
                type: "post",
                data: {"sodId": orderId, "type": type},
                url: msonionUrl + "foreign/logistics/v2",
                dataType: "json",
                asyn: false,
                success: function (json) {
                    $(".loading").hide();
                    var dats = {data: json};
                    if (json.dataList != "") $("#wulprogress").hide();
                    jetpl('#foreignData2').render(dats, function (html) {
                        $('#wulinfolist').append(html);
                    });
                }
            });
        }

        function expComName(no) {
            var name = "";
            switch (no) {
                case "yzgn":
                    name = "EMS快递";
                    break;
                case "qf":
                    name = "全峰快递";
                    break;
                case "sf":
                    name = "顺丰快递";
                    break;
                case "sto":
                    name = "申通快递";
                    break;
                case "yt":
                    name = "圆通快递";
                    break;
                case "yd":
                    name = "韵达快递";
                    break;
                case "tt":
                    name = "天天快递";
                    break;
                case "ems":
                    name = "EMS快递";
                    break;
                case "zto":
                    name = "中通快递";
                    break;
                case "ht":
                    name = "百世快递";
                    break;
                case "db":
                    name = "德邦快递";
                    break;
            }
            return name;
        }
    }
}

/**
 * 修改收货地址
 */
function updateSodAdd() {
    /** 参数校验 * */
    if (!checkSodAddParams()) {
        return;
    }
    /** 取form数据 **/
    var datas = $("#sodAddressForm").serialized();
    console.log(datas)
    var url = msonionUrl + "app/address/updateSodAdd/v1";
    $.ajax({
        type: "post",
        url: url,
        data: datas,
        dataType: "json",
        success: function (result) {
            if (10000 == result.errCode) {
                mBox.open({
                    content: "<div class='jew100 tc'>修改成功</div>",
                    btnName: ['确定'],
                    btnStyle: ["color: #0e90d2;"],
                    maskClose: false,
                    yesfun: function () {
                        window.location.reload();
                    }
                });
                return;
            } else {
                return;
            }
        }
    });
}

/**
 * 确认收货
 * @param id
 */
function confirmGoods(id, sodid) {
    if (id == null || id == "" || typeof(id) == undefined) {
        jems.mboxMsg("获取订单失败，请刷新");
        return;
    }
    mBox.open({
        width: "80%",
        content: "<p class='f14' style='width:100%;'><span class='red'>请慎点！</span>确认收货之后将不能再申请退款，请确保您购买的商品已全部收到并确认无任何破损。</p>",
        closeBtn: [false, 1],
        btnName: ['确定', '取消'],
        btnStyle: ["color: #0e90d2;", "color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            $.ajax({
                type: "post",
                data: {"subSodId": id, "sodId": sodid},
                url: msonionUrl + "app/subSodrest/confirmSubSodrec/v3",
                dataType: "json",
                asyn: false,
                success: function (data) {
                    if (data.errCode == 10000) {
                        mBox.open({
                            //width:"80%",
                            content: "确认成功!",
                            closeBtn: [false],
                            btnName: ['确定'],
                            btnStyle: ["color: #0e90d2;"],
                            maskClose: false,
                            yesfun: function () {
                                window.location.reload();
                            }
                        })
                    } else {
                        jems.mboxMsg(data.errMsg);
                        return;
                    }
                },
                error: function () {
                    jems.mboxMsg("network error!");
                }
            });
        }
    });
}

/**
 * 去修改地址页面
 * @param sodId 订单id
 * @param sodAddressId 订单地址id
 */
function goToAddressEdit(sodId, sodAddressId) {
//    jems.goUrl('order-ad-adress.html?sodId=' + sodId + '&sodAddressId=' + sodAddressId);
	jems.goUrl('addres-order.html?'+window.location.href+'&sodId=' + sodId + '&sodAddressId=' + sodAddressId);
}

/**
 *
 * @param id
 * @param sodId
 * @param sodNo
 * @param deliveryTime
 * @returns
 */
function jumpToResale(id, sodId, sodNo,expressNo,type) {
    //贩外
    if(type == "1"){
        if(expressNo == "" || expressNo == "undefined"){//贩外没有物流单号.则只有7天无理由退款
            sessionStorage.type = 0;
        } else {//有退款.退货退款.7天无理由退货
            sessionStorage.type = 1;
        }
    } else {
        sessionStorage.type = 2;
    }
    jems.goUrl('order-resales.html?id=' + id + '&sodId=' + sodId + '&sodNo=' + sodNo + '');
}