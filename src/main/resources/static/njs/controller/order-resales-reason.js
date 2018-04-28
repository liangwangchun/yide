/**
 * @Js-name:order.resales.js
 * @Zh-name:7天无理由退货
 * @Author:Banana
 * @Date:2017-11-03
 */
var params = jems.parsURL(window.location.href).params;
var tmn = params.tmn;
var goodArry = sessionStorage.goodArry;
var leIdArry = sessionStorage.leIdArry;
var sodId = sessionStorage.sodId;
var sodNo = sessionStorage.sodNo;
var isGroup = false;
$(function () {
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
                    html += '<li class="flexbox p10 je-align-center jepor jecell-bottom">';
                    html += '<div class="photo jepor">';
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
                    if(isGroup){
                        html += '<span class=" f16 g9 show jeflex">拼团价:<i class="purple">¥'+ (sodRec.sodGroupRec.productGroup.groupPrice).toFixed(2)+'</i></span>';
                    } else if (product.type == 1) {
                        html += '<p class="je-vercent jeflex"><span class="purple f16 show jeflex">¥' + (v.price).toFixed(2) + '</p><span class="g9">X' + amount + '</span></span>';
                    } else {
                        html += '<p class="je-vercent jeflex"><span class=" f16 g9 show jeflex">海外直购:<i class="purple">¥' + (v.price).toFixed(2) + '</i></p><span class="g9">X' + amount + '</span></span>';
                    }
                    html += '</div>';
                    html += '</div>';
                    html += '</li>';
                });
                $("#countMoney").html("&yen;" + countMoney.toFixed(2));
                $("#mainContent ul").html(html);
            } else if (result.errCode == 4002) {
                jems.goUrl("../login.html?" + window.location.href);
            } else {
                jems.mboxMsg(result.errMsg);
                return;
            }
        }
    });

    /**
     * 提交
     */
    $("#submitBtn").on("tap", function () {
        submitData();
    });

    //提交退款
    function submitData(){
        $.ajax({
            type: 'post',
            url: msonionUrl + "app/sodrest/submitRetrunPayGood/v1",
            asyn: false,
            data: {
                "rDesc": "",
                "successPicArray": "",
                "reasonArr": "",
                "Ids": leIdArry,
                "orderIds": goodArry,
                "rType": 2,
                "sodId": sodId
            },
            dataType: "json",
            success: function (result) {
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
        });
    }
})