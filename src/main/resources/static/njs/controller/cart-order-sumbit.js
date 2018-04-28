/**
 @Js-name:cart-order-sumbit.js
 @Zh-name:确认订单
 @Author:tyron
 @Date:2015-08-04
 */
var cartIds = "", countPrice = 0, errCode = 0, errMsg = "", logisval = "auto", couponNo = "", rebatePrice = 0;
var msdownTime = 0, msdownText;
var params = jems.parsURL(window.location.href).params;
var tmn = params.tmn;
var url = window.location.href;
var cartIdsStr = sessionStorage.cartIdsStr;//海外仓IdStr
cartIds = sessionStorage.cartIds.toString();//params.cartIds;
countPrice = sessionStorage.countPrice;//params.countPrice;
var countPriceOnion= sessionStorage.countPriceOnion;
var addressId = 0;
//清关费5元 20180131 modify tyron
var clearFee = countPrice >= 299 ? 0 : 5;
//邮费：购买总价大于500的为40元，20180131 modify tyron
var postFee = countPrice >= 299 ? 0 : 20;
var freeCount = 299;
var newStore = sessionStorage.newStore;
if(newStore == "true"){
	freeCount = 99;
}
var isSingle;
if(sessionStorage.isSingle == undefined || sessionStorage.isSingle == "undefined"){
	isSingle = 0;
} else{
	isSingle = 1;
}

var couponData = {};
var amount = 0;
var memberTmn;
$(function () {
   if (cartIds == null || cartIds == "" || typeof(cartIds) == undefined) {
        jems.mboxMsg("返回上一步选择商品");
        return;
    }
    defaultCoupon();//默认选择适用优惠券
    var submit_flag = true;

    /**
     * 确认支付
     */
    var submit_flag  = true;
    $("#submitOrder").one("click", function () {
        var that = $(this);
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
        if (!submit_flag) {
            jems.tipMsg(errMsg == "" ? "提交中，请稍等.." : errMsg);
            return;
        }
        submit_flag = false;
        if (errCode != 10000) {
            jems.mboxMsg(errMsg);
            return;
        }
        var addressId = $("#addressId").val();
        var addressUserCid = $("#addressUserCid").val();
        var addressUser = $("#addressUser").text();
        if (cartIds == null || cartIds == "" || typeof(cartIds) == undefined) {
            jems.tipMsg("请选择结算商品");
            return;
        }
        if (addressId == null || addressId == "" || typeof(addressId) == undefined) {
            jems.tipMsg("先设置收货地址");
            return;
        }
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var isDigit = /[\u4e00-\u9fa5]/;
        var numberReg = /[0-9]+?/;
        if (addressUser == "" || numberReg.test(addressUser)) {
            jems.tipMsg("收货人姓名无效!");
            return;
        }
        if (typeof(addressUserCid) == undefined || addressUserCid == null || addressUserCid == "" || addressUserCid == "undefined") {
            jems.tipMsg("收货地址身份证号码为空，点击收货地址重新编辑");
            return;
        }

        if (isDigit.test(addressUserCid)) {
            jems.tipMsg("身份证号码不能含有中文!");
            return;
        }
        if (!reg.test(addressUserCid)) {
            jems.tipMsg("请输入正确身份证号码.");
            return;
        }
        that.css({"background-color": "#cfcfcf"}).text("正在前往支付中");

        $.ajax({
            type: "post",
            data: {"client": "web", "tmnId": tmn, "cartIds": cartIds, "addressId": addressId,"isSingle":isSingle,"couponNo":couponNo},
            url: msonionUrl + "app/sodrest/createSod/v2?t=" + new Date().getTime(),
            dataType: "json",
            success: function (result) {
            	errCode = result.errCode;
                errMsg = result.errMsg;
                retrunInfohanding(errCode);
                if (errCode != 10000) {
                    jems.mboxMsg(errMsg);
                    location.replace(location.href);
                    return;
                }
                if (params.tmn == 1 || params.tmn == "undefined") {
                    var tmnId = $("#memberTmnId").val();
                } else {
                    tmnId = params.tmn;
                }
                var subId = $("#submitOrder"), num = msdownTime;

                //限制提交按钮点击
                if (subId.attr("limit") == "no") {
                    if (msdownText != "") jems.tipMsg(msdownText);
                    return false;
                }
                ;
                subId.attr("limit", "no");
                for (var i = 1; i <= num; i++) {
                    window.setTimeout("limitTime(" + i + "," + num + ")", i * 1000)
                }
                var Waits = mBox.open({
                    boxtype: 3,
                    conStyle: 'text-align:center;',
                    maskColor: "rgba(0,0,0,0.8)",
                    time: 0,
                    content: '<div class="jemboxloadspin"><div class="jemboxloading"></div></div><p style="line-height:20px;">正在创建订单</p>',
                    success: function () {
                        orderWaiting(result.sodNo, Waits);
                    }
                });
                return;
            }
        });

    });
	
});


function  loadDate(){
    $.ajax({
        type: "post",
        data: {"cartIds": cartIds, "discountAmt": amount,"isSingle":isSingle,"couponNo":couponNo},
        url: msonionUrl + "cart/getCartByCardIds/v2",
        dataType: "json",
        asyn: false,
        success: function (result) {
            errCode = result.errCode;
            errMsg = result.errMsg;
            memberTmn = result.data.mytmn;
            retrunInfohanding(errCode);
            if(errCode == 4001){
				jems.goUrl("../login.html?"+window.location.href);
				return ;
			} else if (errCode == 5006 || errCode == 8009){
				  mBox.open({
                      width:"80%",
                      content:"<p class='tc f16' style='width:100%'>"+errMsg+"</p>",
                      closeBtn: [false],
                      btnName:['确定'],
                      btnStyle:["color: #0e90d2;"],
                      maskClose:false,
                      yesfun : function(){
                          jems.goUrl("addres-add.html?"+window.location.href);
                      }
                  });
                  return "";
			} else if(errCode == 3010){//50仓3件起售
				mBox.open({
                    width:"80%",
                    content:"<p class='tc f16' style='width:100%'>"+errMsg+"</p>",
                    closeBtn: [false],
                    btnName:['确定'],
                    btnStyle:["color: #0e90d2;"],
                    maskClose:false,
                    yesfun : function(){
                        jems.goUrl("cart.html?"+window.location.href);
                    }
                });
                return "";
			} else if(errCode == 8019){
				mBox.open({
                    width:"80%",
                    content:"<p class='tc f16' style='width:100%'>"+errMsg+"</p>",
                    closeBtn: [false],
                    btnName:['确定'],
                    btnStyle:["color: #0e90d2;"],
                    maskClose:false,
                    yesfun : function(){
                        jems.goUrl('addres-order.html?' + window.location.href)
                    }
                });
                return "";
			} else {
//					addressId = result.data.address.addressId;
		            result.data.url = url;
		            // 清关费
		            result.data.clearFee = clearFee;
		            // 计算邮费
		            result.data.postFee = postFee;
		            // 总销费 = 商品总价 + 邮费 + 清关费
		            result.data.countPrice = parseFloat(countPrice) + postFee + clearFee;
		            // 优惠金额
		            rebatePrice = result.data.rebatePrice
		            var datas = {data: result.data};
		            var gettpl = $('#indexData').html();
		            jetpl(gettpl).render(datas, function (html) {
		                $('#indexList').html(html);
		            });
		            
		            if(cartIdsStr!=''){
		                $("#gocoupons").show();
		            }
		            else{
		                $("#gocoupons").hide();
		            }
		            
				}
            
            if (errCode == 10000) {
        		if (couponData.data.length != 0) {
                    var coups = $("#gocoupons");
                    coups.find(".number").text("（已使用1张）");
                    coups.attr("price", amount);
                    coups.find(".amount").text(amount);
                } 
            	couponsDetail(cartIds, couponNo,countPrice);//优惠卷
                var totalCount = $("#totalCount").text();
                $("#gocoupons").on("click", function () {
                    var couponidx = mBox.open({
                        title: ['选择优惠券'],
                        boxtype: 2,
                        closeBtn: [true, 1],
                        height: "50%",
                        padding: "0",
                        content: '<div style="background-color: #fff;" id="coupons' + params.tmn + '"></div>',
                        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
                        success: function () {
                            couponList(totalCount, couponidx)
                        }
                    });
                })
                chooseLogistics(result.data.isChoose);
            }
            if (errCode != 10000) {
                if (errCode == 8006) {
                    var msg = "根据海关总署令第104号文规定，个人物品类进境快件报关时，应当向海关提交进境快件收件人身份证件影印件。请尽快补充您的身份证正反面照片，以免造成海关扣件。";
                    mBox.open({
                        width: "80%",
                        content: "<p class='tc f16' style='width:100%'>" + msg + "</p>",
                        closeBtn: [false],
                        btnName: ['确定'],
                        btnStyle: ["color: #0e90d2;"],
                        maskClose: false,
                        yesfun: function () {
                            jems.goUrl("addres-edit.html?addressId=" + result.data.address.addressId);
                        }
                    });
                } else if (errCode == 8008) {
                    jems.goUrl("addres-edit.html?addressId=" + result.data.address.addressId);
                } else if (errCode == 8020) {
                	 mBox.open({
                         width: "80%",
                         content: "<p class='tc f16' style='width:100%'>" + errMsg + "</p>",
                         closeBtn: [false],
                         btnName: ['确定'],
                         btnStyle: ["color: #0e90d2;"],
                         maskClose: false,
                         yesfun: function () {
                        	 jems.goUrl("addres-edit.html?addressId=" + result.data.address.addressId);
                         }
                     });
                } else {
                	if(cartIdsStr=='' || countPriceOnion == 0|| countPriceOnion == undefined || isSingle == 1){
                		$("#coumosfix").text("0.0");
                        $("#shipfix").text("0.0");
                        $("#totalCount").text(jems.formatNum(countPrice, 2));
                	} 
                    $("#tipText").text(result.errMsg);
                    $(".newStore").show();
                    jems.mboxMsg(errMsg);
                }
            }
        },
        error: function (data) {
            jems.mboxMsg("network error!");
        }
    });
}
var joinOrder = function () {
    // jems.goUrl("../search-list.html?maxamt=" + (1000 - countPriceOnion));
    jems.goUrl("../search-list.html?keywords=&menuIds=&brandIds=&countryIds=&minamt=0&maxamt="+(1000 - countPriceOnion)+"&tmn="+tmn)
}

/**
 * 返回信息处理
 */
function retrunInfohanding(errCode) {
    if (errCode == 4001) {
        jems.goUrl("../login.html?" + window.location.href);
        return;
    } else if (errCode == 5006) {
        mBox.open({
            width: "80%",
            content: "<p class='tc f16' style='width:100%'>未设置收货地址</p>",
            closeBtn: [false],
            btnName: ['确定'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false,
            yesfun: function () {
                jems.goUrl("addres-add.html?" + window.location.href);
            }
        });
        return "";
    } else if (errCode == 3010) {//50仓3件起售
        mBox.open({
            width: "80%",
            content: "<p class='tc f16' style='width:100%'>" + errMsg + "</p>",
            closeBtn: [false],
            btnName: ['确定'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false,
            yesfun: function () {
                jems.goUrl("cart.html?" + window.location.href);
            }
        });
        return "";
    } 
}


function couponList(totalCount, couponidx) {
    var couponsHtml = $('#choosecoupons').html();
    for (var i = 0; i < couponData.data.length; i++) {
        var date = new Date();
        var currentTime = date.Format("yyyy-MM-dd");
        var dateDiff = DateDiff(currentTime, couponData.data[i].validEndTime);
        couponData.data[i].dateDiff = dateDiff == 0 ? 1 : dateDiff;
    }
    jetpl(couponsHtml).render(couponData, function (html) {
        $('#coupons' + params.tmn).append(html);
    });
    $('#coupons' + params.tmn).find("li").on("click", function () {
        var coups = $("#gocoupons"),  state = $(this).attr("state");
        amount = $(this).attr("amount");
        couponNo = $(this).attr("couponNo");
        getCartByCardIdsV1(amount, state);
        mBox.close(couponidx);
        return false;
    })
}

//可使用优惠券列表
function defaultCoupon() {
	var couponListUrl = isSingle == 1 ?  "couponRest/oneUserUsableCouponList":"couponRest/userUsableCouponList";
    $.ajax({
        type: "POST",
        data: {"cartIds": cartIdsStr},
        url: msonionUrl + couponListUrl,
        dataType: "json",
        async: false,
        success: function (data) {
            couponData = {data: data.data};
            if (data.total > 0) {
                couponNo = data.data[0].couponNo;
                amount = data.data[0].couponMinus;
            }
            loadDate();
        }
    })
}

function chooseLogistics(logis) {
    var wlcell = $("#choselogis");
    if (logis == 1) {
        wlcell.show();
        $.ajax({
            type: "GET",
            url: msonionUrl + "wx/js/jsons/config.json",
            dataType: "json",
            asyn: false,
            success: function (result) {
                var datas = {data: result.logistics};
                logisval = datas.data[0].value;
                wlcell.attr("val", datas.data[0].value).find("em").text(datas.data[0].name);
                wlcell.on("click", function () {
                    var logisidx = mBox.open({
                        title: ['选择物流'],
                        boxtype: 2,
                        closeBtn: [true, 1],
                        height: "50%",
                        padding: "0",
                        content: '<div style="background-color: #fff;" id="logis' + params.tmn + '"></div>',
                        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
                        success: function () {
                            jetpl("#choosewuliu").render(datas, function (html) {
                                $('#logis' + params.tmn).append(html);
                            });
                            $('#logis' + params.tmn).find("li").on("click", function () {
                                var vals = $(this).data("value"),
                                    txts = $(this).data("text");
                                logisval = vals;
                                wlcell.attr("val", vals).find("em").text(txts);
                                mBox.close(logisidx);
                            })
                        }
                    });
                });
            }
        })
    } else {
        $("#choselogis").remove();
    }
}

function findTmn(tmn, countPrice,couponAmt) {
	if(couponNo == undefined || couponNo == "undefined" ){//未使用哟挥拳
		countPrice =  sessionStorage.countPrice;
	} else {
		countPrice =  countPrice - amount;
	}
	if(cartIdsStr=='' || countPriceOnion == 0|| countPriceOnion == undefined || isSingle == 1){
		$("#coumosfix").text("0.0");
        $("#shipfix").text("0.0");
        $("#totalCount").text(jems.formatNum(countPrice, 2));
	} else if(newStore == "true" && couponAmt >= 99){//新店99免邮
		$("#coumosfix").text("0.0");
        $("#shipfix").text("0.0");
        $("#totalCount").text(jems.formatNum(countPrice, 2));
        $("#tipText").text("新开商铺前三天单笔达99元免邮费");
        $(".newStore").show();
        $("#freeshipp").hide();
	} else{
		$.ajax({
	        type: "post",
	        data: {"tmn": tmn, "countPrice": couponAmt},
	        url: msonionUrl + "terminal/isFreeShipp",
	        dataType: "json",
	        success: function (data) {
	            if (data.success) {
	                $("#coumosfix").text("0.0");
	                $("#shipfix").text("0.0");
	                $("#totalCount").text(jems.formatNum(countPrice, 2));
	                $("#tipText").text(data.message);
	                $(".newStore").show();
	                $("#freeshipp").hide();
	            } else {
	                $("#coumosfix").text("5.0");
	                $("#shipfix").text("20.0");
	                $("#totalCount").text(jems.formatNum(Number(countPrice) + Number(25), 2));
	                $("#cost_ywbtn").show();
	                var price = freeCount - 0 - Number(couponAmt) + rebatePrice;
	                $("#freeshipp").find("p").eq(0).html("运费25元，还差"+ jems.formatNum(price, 2) +"元即可免邮");
	                $("#freeshipp").show();
	                $("#cost_ywbtn").on("click",function () {
	                    mBox.open({
	                        title: ['运费说明', 'color:#333;font-size:1.5rem;text-align:center;'],
	                        width: "90%",
	                        height: "20%",
	                        content: $("#costywView")[0],
	                        // closeBtn: [true, 1],
	                        btnName: ['知道了'],
	                        btnStyle: ["color: #0e90d2;"],
	                        maskClose: false,
	                        success:function () {
	                            //$("#materialdata").html($("#materialView").html());
	                        }
	                    });
	                });

	            }
	        }
	    });
	}
}

function orderWaiting(sodNo, mid) {
    var num = 0, time;
    var resultType = {
        ok: "ok",
        error: "error",
        timeout: "timeout",
        waitting: "waitting"
    }
    var startRun = function () {
        $.ajax({
            type: "post",
            url: msonionUrl + "sodrest/findSodStaByNo",//等待生成
            data: {"sodNo": sodNo},
            success: function (json) {//
                var data = eval("(" + json + ")");
                noresult();
                if (data.result == resultType.ok) {
                    //alert("订单生成成功！");
                    jems.goUrl("../payment.html?sodId=" + data.sodId)
                    return;
                } else if (data.result == resultType.error) {
                    alert("发生错误");
                    return;
                }
            }
        });
        time = setTimeout(startRun, 1000);
    }

    function stopRun() {
        clearTimeout(time);
    }

    function noresult() {
        num++;
        if (num > 4) {
            stopRun();
            mBox.close(mid);
            mBox.open({
                width: "70%",
                //height: 100,
                content: "<p class='tc listinfo f16' style='width:100%'>系统繁忙，请稍后尝试...</p>",
                closeBtn: [false, 1],
                btnName: ['确定'],
                btnStyle: ["color: #0e90d2;"],
                maskClose: false,
                yesfun: function () {
                    jems.goUrl("members.html");
                }
            });
            return;
        }
    }

    if (sodNo != '' || sodNo != 'undefined' || sodNo != null) {
        startRun();
    } else {
        alert("发生错误");
        jems.goUrl("members.html");
        return;
    }
}

//计算日期间隔天数
function DateDiff(sDate1, sDate2) {
    var aDate, bDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[0], aDate[1], aDate[2])
    bDate = sDate2.split("-")
    oDate2 = new Date(bDate[0], bDate[1], bDate[2])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    return iDays
}

//获取指定格式时间
Date.prototype.Format = function (format) {

    var o = {

        "M+": this.getMonth() + 1, //month

        "d+": this.getDate(), //day

        "h+": this.getHours(), //hour

        "m+": this.getMinutes(), //minute

        "s+": this.getSeconds(), //second

        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter

        "S": this.getMilliseconds() //millisecond

    }

    if (/(y+)/.test(format)) {

        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    }

    for (var k in o) {

        if (new RegExp("(" + k + ")").test(format)) {

            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));

        }

    }

    return format;

}

function getCartByCardIdsV1(amount, state) {
    $.ajax({
        type: "post",
        data: {"cartIds": cartIds, "discountAmt": amount,"isSingle":isSingle,"couponNo":couponNo},
        url: msonionUrl + "cart/getCartByCardIds/v2",
        dataType: "json",
        success: function (result) {
            result.data.url = url;
            // 清关费
            result.data.clearFee = clearFee;
            // 计算邮费
            result.data.postFee = postFee;
            // 总销费 = 商品总价 + 邮费 + 清关费
            result.data.countPrice = parseFloat(countPrice) + postFee + clearFee;            
            
            var datas = {data: result.data};
            var gettpl = $('#indexData').html();
            jetpl(gettpl).render(datas, function (html) {
                $('#indexList').html(html);
            });
            var totalCount = $("#totalCount").text();
            var price = freeCount - 0 - countPriceOnion;
            $("#freeshipp").find("p").eq(0).html("运费25元，还差"+ price +"元即可免邮");
            $("#gocoupons").on("click", function () {
                var couponidx = mBox.open({
                    title: ['选择优惠券'],
                    boxtype: 2,
                    closeBtn: [true, 1],
                    height: "50%",
                    padding: "0",
                    content: '<div style="background-color: #fff;" id="coupons' + params.tmn + '"></div>',
                    conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
                    success: function () {
                        couponList(totalCount, couponidx)
                    }
                });
            });
            chooseLogistics(result.data.isChoose);
            if (couponData != null) {
                var coups = $("#gocoupons")
                coups.attr("price", amount);
//                findTmn(params.tmn, countPrice - amount - rebatePrice);                
                couponsDetail(cartIds, couponNo, countPrice);
                if (state == 0) {
                    coups.find(".number").text("（已使用0张）");
                } else {
                    coups.find(".number").text("（已使用1张）");
                }
                coups.find(".amount").text(amount);
            }
        }
    });
}
/**
 * 优惠详情
 * @param cartsId
 * @param coupon
 */
function couponsDetail(cartsId, coupon,amt) {
	if (coupon == null || coupon == "" || typeof(coupon) == undefined) {
		findTmn(tmn, countPrice, countPriceOnion);
		return ;
	}
	 $.ajax({
	        type: "POST",
	        data: {"cartIds": cartIds,"couponNo":coupon},
	        url: msonionUrl + "couponRest/reckonProductCouponPrice",
	        dataType: "json",
	        async: false,
	        success: function (data) {
	        	var  couponAmt = data.total;	
	        	findTmn(tmn, countPrice,couponAmt);
	        }
	    });
	 
}
