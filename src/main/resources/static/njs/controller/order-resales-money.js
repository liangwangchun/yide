/**
 * @Js-name:order.resales.js
 * @Zh-name:搜索页面
 * @Author:Banana
 * @Date:2017-11-03
 */
var params = jems.parsURL(window.location.href).params;
var tmn = params.tmn;
var goodArry = sessionStorage.goodArry;
var leIdArry = sessionStorage.leIdArry;
var sodId = sessionStorage.sodId;
var sodNo = sessionStorage.sodNo;
var successPicArray = [];
var reasonData = [];
var old_order = false;
var group = sessionStorage.group;
var uploadImgNum = 0;
var isGroup = false;
$(function () {
    $.post(msonionUrl + "app/sodrest/getRefundReason", function (data) {
        var json = JSON.parse(data);
        //清空内容
        json.data.forEach(function (v) {
            if (v.refundType == 4) {
                reasonData = v.data;
                getDataList();
            }
        });
    });
    /**
     * 提交
     */
    $("#submitBtn").on("tap", function () {
        var reasonArr = [];//退款理由
        var reason = $("select[name='liyou']").val();
        if (reason == 0) {
            jems.mboxMsg("请选择退货理由!");
            return;
        } else {
            $("li[data-id]").each(function () {
                var id = $(this).attr("data-id");
                reasonArr.push({"reason": reason, "id": id});
            })
        }
        //上传图片检测是否为空
        if ($(".uploads").find("li").length == 1) {
            jems.mboxMsg("亲.请至少上传一张图片!");
            return;
        }
        var rsg = /^\d{14,30}$/;
        var chineseReg = /^[\u4e00-\u9fa5]{0,}$/;
        var cnReg = /^[\u4e00-\u9fa5]{4,20}$/;	// 验证开户支行
        var chineseNameReg = /^[\u4E00-\u9FA5]{1,}(?:·[\u4E00-\u9FA5]{1,})*[\u4E00-\u9FA5]{1,}$/;
        var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var regCarNo = /^[0-9]*$/;
        var sodItemPayBrank = $("#sodItemPayBrank").val();
        var sodItemPayNo = $("#sodItemPayNo").val();
        var sodItemPayName = $("#sodItemPayName").val();
        var cid = $('#cid').val();
        if (old_order) {
            if (!sodItemPayBrank || sodItemPayBrank == 0) {
                jems.tipMsg("请选择开户银行");
                return;
            } else if (!chineseReg.test(sodItemPayBrank)) {
                jems.tipMsg("只支持中文银行名称");
                return;
            } else if (sodItemPayBrank.length > 30) {
                jems.tipMsg("别闹，银行名称太长了");
                return;
            }
            if (sodItemPayNo == null || sodItemPayNo == "" || typeof(sodItemPayNo) == undefined) {
                jems.tipMsg("请输入退款卡号");
                return;
            }
            if (sodItemPayNo != null || sodItemPayNo != "" || typeof(sodItemPayNo) != undefined) {
                sodItemPayNo = sodItemPayNo.replace(/\s/g, "");
            }
            if (sodItemPayNo.length > 30) {
                jems.tipMsg("银行卡号长度不正确");
                return;
            }
            if (sodItemPayNo.length < 14) {
                jems.tipMsg("银行卡号长度不正确");
                return;
            }
            if (!regCarNo.test(sodItemPayNo)) {
                jems.tipMsg("银行卡号不正确.");
                return;
            }
            if (sodItemPayName == null || sodItemPayName == "" || typeof(sodItemPayName) == undefined) {
                jems.tipMsg("请输入退款人名");
                return;
            } else if (!chineseNameReg.test(sodItemPayName)) {
                jems.tipMsg("别闹，请输入正确姓名");
                return;
            } else if (sodItemPayName.length > 20) {
                jems.tipMsg("别闹，姓名太长了");
                return;
            }
            if (cid == null || cid == "" || typeof(cid) == undefined) {
                jems.tipMsg("身份证号码不能为空.");
                return;
            } else if (!CIDreg.test(cid)) {
                jems.tipMsg("请输入正确的身份证号码.");
                return;
            }
        }

        if (uploadImgNum != successPicArray.length) {
            jems.tipMsg("图片上传中!");
            return;
        }

        mBox.open({
            content: "<p class='tc f15' style='width:100%'>确认申请退款吗?<br/>退款一旦受理，将取消发货！</p>",
            closeBtn: [false, 1],
            btnName: ['确认退款', '我再想想'],
            btnStyle: ["color: #0e90d2;", "color: #0e90d2;"],
            maskClose: false,
            yesfun: function () {
                $.ajax({
                    type: 'post',
                    url: msonionUrl + "app/sodrest/submitRetrunPayGood/v1",
                    asyn: false,
                    data: {
                        "rDesc": "",
                        "successPicArray": successPicArray.toString(),
                        "reasonArr": JSON.stringify(reasonArr),
                        "Ids": leIdArry,
                        "orderIds": goodArry,
                        "rType": 1,
                        "sodId": sodId,
                        "sodItemPayBrank": sodItemPayBrank,
                        "sodItemPayNo": sodItemPayNo,
                        "sodItemPayName": sodItemPayName,
                        "cid": cid
                    },
                    dataType: "json",
                    success:

                        function (result) {
                            var msg = result.errMsg;
                            if (10000 == result.errCode) {
                                mBox.open({
                                    content: msg,
                                    btnName: ['确认'],
                                    maskClose: false,
                                    yesfun: function () {
                                        jems.goUrl("../ucenter/order-refund.html");
                                    }, nofun: function () {
                                    }
                                });
                            } else {
                                jems.mboxMsg(msg);
                            }
                        }
                })
                ;
            },
            nofun: function () {

            }
        });
    });

    var upload = new mbUploadify({
        file: document.getElementById('j-file-orderResalesMoney'),
        /*ajax 上传地址*/
        url: msonionUrl + 'app/sodrest/sodRefundImageFile/v1?sodId=' + sodId + '&type=2&sodNo=' + sodNo,
        /*ajax上传成功*/
        uploadSuccess: function (res) {
            var result = JSON.parse(res);
            if (10000 == result.errCode) {
                successPicArray.push(result.data.imageId);
                $(".uploadsLi").prev().attr("data-imageId", result.data.imageId);
                $(".uploadsLi").prev().find("i").on("tap", function () {
                    var removeImageId = $(this).parent().parent().attr("data-imageId");
                    removeByValue(successPicArray, removeImageId);
                    --uploadImgNum;
                    $('.uploadsLi').css('display', '');
                    $(this).parent().parent().remove();
                })
            } else {
                jems.mboxMsg(result.errMsg);
                return;
            }
        },
        load: function (e) {
            ++uploadImgNum;
            var liDom = $('<li><span style="position: relative"><i name="deleteIcon" class="tache show" style="position :absolute;right:0px;top:0"></i><img src="' + e.target.result +
                '" style="height:100%"></span></li>')
            $('.uploadsLi').before(liDom);
            if ($('.uploads').find("li").length > 3) {
                $('.uploadsLi').css('display', 'none');
            } else {
                $('.uploadsLi').css('display', '');
            }
        },
        isMultiple: false,
        //上传最多个数
        maximum: 10000,
        //文件大小 2M
        size: 1024 * 1024 * 4,
        isAllowSame: true,
        //错误提示信息!
        message: {
            type: '类型不对!',
            size: '图片不能超过4M',
            maximum: '上传文件数量太多!',
            same: '不能上传相同的文件!',
            other: '其它网络错误!'
        },
        //上传失败
        error: function (file, msg) {
            jems.tipMsg(msg);
        },
    })
    var msg = "";
    $("select[name='liyou']").on("change", function () {
        var that = $(this);
        var val = that.val();
        var lab = $("label[name='reasonDesc']");
        var liDesc = lab.parent();
        if (val != 0) {
            reasonData.forEach(function (s) {
                if (s.index == val) {
                    lab.html(s.remark);
                    msg = s.voucherDescription;
                    liDesc.show();
                    msg == "" ? $("span[name='upDesc']").hide() : $("span[name='upDesc']").show();
                }
            });

        } else {
            liDesc.hide();
        }
    })
    $("span[name='upDesc']").on("tap", function () {
        mBox.open({
            content: msg,
            btnName: ['确认'],
            maskClose: false,
            yesfun: function () {
            }, nofun: function () {
            }
        });
    })
});

function getDataList() {
    var liyouHtml = '';
    if (reasonData.length > 0) {
        liyouHtml += '<option value="0">- 请选择退货理由 -</option>';
        reasonData.forEach(function (s) {
            liyouHtml += '<option value="' + s.index + '">- ' + s.reason + ' -</option>';
        })
    }

    $("select[name='liyou']").html(liyouHtml);

    var html = '';
    $.ajax({
        type: 'post',
        url: msonionUrl + "app/sodrest/confirmSodItemById/v1",
        asyn: false,
        data: {
            "Ids": goodArry,
            "sodId": sodId
        },
        dataType: "json",
        success: function (result) {
            if (10000 == result.errCode) {
                var soditemrec = result.data.listItem;
                var sodPayFlg = result.data.sodPayFlg;
                var sodDate = toGetTime(result.data.sodDate, false);
                var sodPayTime = toGetTime(result.data.sodPayTime, false);
                var nowTime = toGetTime("" + new Date().getTime(), true);
                var timeDif = parseInt(nowTime) - sodPayTime;
                var newArray = goodArry.split(",");
                var countMoney = 0;
                soditemrec.forEach(function (v) {
                    var product = v.product;
                    var amount = 1;
                    var sodRec = v.subOrder.sodRec;
                    if (sodRec.sodIsGroup == 1) {
                        isGroup = true;
                    }
                    newArray.forEach(function (val) {
                        if (val.split("_")[0] == v.id) {
                            amount = val.split("_")[1];//客户选择退货的数量
                        }
                    });
                    countMoney += amount * v.price;
                    html += '<li data-id=' + product.id + ' class="flexbox p10 je-align-center jepor jecell-bottom">';
                    html += '<div class="photo jepor ">';
                    html += '<img src="' + msPicPath + '' + product.mainPicUrl + '?x-oss-process=image/resize,w_200">';
                    html += '</div>';
                    html += '<div class="flexbox je-text-center je-orient-ver jeflex pl10">';
                    if (isGroup) {
                        html += '<h3 class="f15"><span class="purple">【拼团】</span>' + sodRec.sodGroupRec.productGroup.name + '</h3>';
                    } else {
                        html += '<h3 class="f15">' + product.name + '</h3>';
                    }
                    if (product.type == 1) {
                        html += '<p><span class="g9 f14 mr15">' + v.sodItemLeSpec + '</span></p>';
                    }
                    html += '<div class="flexbox je-align-center mt5 f14">';
                    if (isGroup) {
                        html += '<span class=" f16 g9 show jeflex">拼团价:<i class="purple">¥' + (sodRec.sodGroupRec.productGroup.groupPrice).toFixed(2) + '</i></span>';
                    } else if (product.type == 1) {
                        html += '<p class="je-vercent jeflex"><span class="purple f16 show jeflex">¥' + (v.price).toFixed(2) + '</span></p><span class="g9">X' + amount + '</span>';
                    } else {
                        html += '<p class="je-vercent jeflex"><span class=" f16 g9 show jeflex">海外直购:<i class="purple">¥' + (v.price).toFixed(2) + '</i></span></p><span class="g9">X' + amount + '</span></span>';
                    }
                    html += '</div>';
                    html += '</div>';
                    html += '</li>';
                })

                $("#countMoney").html("&yen;" + countMoney.toFixed(2));
                $("#mainContent ul").html(html);
                if (timeDif > 75 * 24 * 60 * 60 * 1000) {
                    $(".brank_info").show();
                    old_order = true;
                } else {
                    $(".brank_info").hide();
                    old_order = false;
                }
            } else if (result.errCode == 4002) {
                jems.goUrl("../login.html?" + window.location.href);
            } else {
                jems.mboxMsg(result.errMsg);
                return;
            }
        }
    });
}

function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
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

/**
 * 验证身份证号码
 */

function checkCID(cid) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var isChinese = /[\u4e00-\u9fa5]/;
    if (cid == "") {
        return;
    }
    if (isChinese.test(cid)) {
        jems.tipMsg("别逗...此处应输入身份证号码!");
        $("#cid").focus();
        return false;
    }
    if (!reg.test(cid)) {
        jems.tipMsg("请输入正确身份证号码.");
        $("#cid").focus();
        return false;
    }
}

