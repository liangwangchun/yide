/**
 @Js-name:return-goods.js
 @Zh-name:退货页面
 @Author:tyron
 @Date:2017-04-11
 */
var sodId = 0;
var isGroup = false;
var old_order = false;
$(function () {
    var params = jems.parsURL().params;
    sodId = params.id;
    isGroup = params.isGroup == undefined ? false : true;
    if (sodId == null || sodId == "" || typeof(sodId) == undefined) {
        jems.tipMsg("返回上一步选择退货商品");
        return;
    }
    $.ajax({
		type: "post",
		data: {"sodId": sodId},
		url: msonionUrl + "sodrest/findSodById/v2",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4001 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} 
			if (10000 == result.errCode) {
				var targetTime = toGetTime("" + new Date("2017-09-30 00:00:00").getTime(), true);
				var sodPayTime = toGetTime(result.data.sodPayTime, false);
				var timeDif = parseInt(targetTime) - sodPayTime;
				console.log("targetTime>>"+targetTime);
				console.log(result.data.sodPayTime+"sodPayTime>>"+sodPayTime);
				console.log(timeDif);
				if (timeDif >= 0 ){
					$(".brank_info").show();
					 getLastBankInfo();
					 old_order = true;
				}
				if (result.data.sodIsGroup == 1){
					isGroup = true;
				}
				var gettpl = $('#sodDate').html();
	            var datas = {data: result.data};
	            jetpl(gettpl).render(datas, function (html) {
	                $(html).appendTo('#sodins');
	            });
			} else{
				jems.tipMsg(result.errMsg);
			}
        },
        error: function (result) {
            jems.tipMsg("network error!");
        }
    });
});
function toGetTime(strTime, isbol) {
	if (isbol) {
		return strTime;
	} else {
		var newStr = strTime.replace(/:/g, "-");
		newStr = newStr.replace(/ /g, "-");
		var arr = newStr.split("-");
		var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8,
				arr[4], arr[5]));
		return datum.getTime();
	}

}
function tuimin(qty, price, itemId) {
    var totalSodItemAmt = $("#sodItemAmt").html();
    var tuiname = $("#tuiname" + itemId).val();
    if (tuiname == 1) {
        jems.tipMsg("退货商品的数量不能少于1！");
        return;
    } else {
        $("#tuiname" + itemId).val(tuiname - 1);
        if ($("#retuan-good" + itemId).prop('checked')) {
            countAmt(-1, price);
        }
    }
}

function tuiadd(qty, price, itemId) {
    var totalSodItemAmt = $("#sodItemAmt").html();
    var tuiname = $("#tuiname" + itemId).val();
    if (tuiname >= qty) {
        jems.tipMsg("退货商品的数量不能大于订单商品数量！");
    } else {
        tuiname = 1 + parseInt(tuiname);
        $("#tuiname" + itemId).val(tuiname);
        if ($("#retuan-good" + itemId).prop('checked')) {
            countAmt(1, price);
        }
    }
}

//选择商品
function chooseItem(obj) {
    var num = $("#tuiname" + obj).val();
    var price = $("#tuiname" + obj).attr("price");
    if ($("#retuan-good" + obj).prop('checked')) {
        countAmt(-num, price);
        $("#retuan-good" + obj).prop('checked', false);
        $("#checkNum" + obj).css('display', 'none');
    } else {
        if (num == 0) {
            jems.tipMsg("此商品已全部退货");
            return;
        } else {
            countAmt(num, price);
        }
        $("#retuan-good" + obj).prop('checked', true);
        $("#checkNum" + obj).css('display', 'block');
    }
}

function chooseCheck(obj) {
    var num = $("#tuiname" + obj).val();
    var price = $("#tuiname" + obj).attr("price");

    if (!$("#retuan-good" + obj).prop('checked')) {
        countAmt(-num, price);
        $("#retuan-good" + obj).prop('checked', false);
        $("#checkNum" + obj).css('display', 'none');

    } else {
        if (num == 0) {
            jems.tipMsg("此商品已全部退货");
            $("#retuan-good" + obj).prop('checked', false);
            return;
        } else {
            countAmt(num, price);
            $("#retuan-good" + obj).prop('checked', true);
            $("#checkNum" + obj).css('display', 'block');
        }
    }
}

function countAmt(num, price) {
    var totalSodItemAmt = $("#sodItemAmt").html();
    totalSodItemAmt = jems.formatNum(parseFloat(totalSodItemAmt) + parseInt(num) * parseFloat(price), 2);
    $("#sodItemAmt").html(totalSodItemAmt);
    $("#sodItemAmtTip").html(totalSodItemAmt == 0 ? "(点击产品选择退货)" : "");
}

function chageRcType(i) {

    $('#sodItemNoType').val(i);
}

var submit_flag = false;
var rsg = /^\d{14,30}$/;
var chineseReg = /^[\u4e00-\u9fa5]{0,}$/;
var cnReg = /^[\u4e00-\u9fa5]{4,20}$/;	// 验证开户支行
var chineseNameReg = /^[\u4E00-\u9FA5]{1,}(?:·[\u4E00-\u9FA5]{1,})*[\u4E00-\u9FA5]{1,}$/;
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var regCarNo = /^[0-9]*$/;

/**
 * 部分退款
 */
function createThSod() {
    var chkNameS = $("#returnlist dl dt input[name='retuan-good']:checked");
    if (chkNameS.length == 0) {
        jems.tipMsg("未选中退货商品");
        return;
    }
    var return_itemIds = "";
    for (var i = 0; i < chkNameS.length; i++) {
        var return_itemId = chkNameS.eq(i).attr("value");
        var num = $("#tuiname" + return_itemId).val();
        if (i == chkNameS.length - 1) {
            return_itemIds += return_itemId + "_" + num;
        } else {
            return_itemIds += return_itemId + "_" + num + ",";
        }
    }
    var sodItemRcNo = $("#sodItemRcNo").val();//退货理由
    var sodItemAmt = $("#sodItemAmt").html();//退款数额
	var sodItemPayBrank = $("#sodItemPayBrank").val();
	var sodItemPayNo = $("#sodItemPayNo").val();
	var sodItemPayName = $("#sodItemPayName").val();
    var cid = $('#cid').val();
    if(old_order){//超长时间退款
    	if (!sodItemPayBrank || sodItemPayBrank==0){
    		jems.tipMsg("请选择开户银行");
    		return ;
    	} else if (!chineseReg.test(sodItemPayBrank)){
    		jems.tipMsg("只支持中文银行名称");
    		return ;
    	}else if (sodItemPayBrank.length > 30) {
    		jems.tipMsg("别闹，银行名称太长了");
    		return ;
    	}
    	if (sodItemPayNo == null || sodItemPayNo == "" || typeof(sodItemPayNo) == undefined){
    		jems.tipMsg("请输入退款卡号");
    		return ;
    	}
    	if (sodItemPayNo != null || sodItemPayNo != "" || typeof(sodItemPayNo) != undefined) {
    		sodItemPayNo = sodItemPayNo.replace(/\s/g, "");
    	} 
    	if (sodItemPayNo.length > 30) {
    		jems.tipMsg("银行卡号长度不正确");
    		return ;
    	}
    	if (sodItemPayNo.length < 14) {
    		jems.tipMsg("银行卡号长度不正确");
    		return ;
    	}
    	if (!regCarNo.test(sodItemPayNo)) {
    		jems.tipMsg("银行卡号不正确.");
    		return ;
    	}
    	if (sodItemPayName == null || sodItemPayName == "" || typeof(sodItemPayName) == undefined){
    		jems.tipMsg("请输入退款人名");
    		return ;
    	} else if (!chineseNameReg.test(sodItemPayName)) {
    		jems.tipMsg("别闹，请输入正确姓名");
    		return ;
    	} else if (sodItemPayName.length > 20) {
    		jems.tipMsg("别闹，姓名太长了");
    		return ;
    	}
    	if (cid == null || cid == "" || typeof(cid) == undefined){
    		jems.tipMsg("身份证号码不能为空.");
    		return ;
    	} else if (!CIDreg.test(cid)) {
    		jems.tipMsg("请输入正确的身份证号码.");
    		return ;
    	}
    }
    var data = {"thRcFlg": 1, "sodId": sodId, "return_itemIds": return_itemIds, "sodItemRcNo": sodItemRcNo,
        "sodItemAmt": sodItemAmt,  "sodItemPayBrank":sodItemPayBrank,"sodItemPayNo": sodItemPayNo,
        "sodItemPayName": sodItemPayName,  "cid": cid}
    showDialog(data, submitThSod);
}

/**
 * 部分退货操作
 * @param data
 */
function submitThSod(data) {
	//如果是团购订单
	if (isGroup) {
		$.ajax({
			type: "post",
			data: data,
			url: msonionUrl + "sodgroup/createTdSodGroup/v2",
			dataType: "json",
			success: function (data) {
				if (data.errCode == 10000) {
					jems.mboxMsg("已提交退款申请,请勿重复提交");
					window.location.href = '../ucenter/order-refund.html';
				} else {
					jems.mboxMsg(data.errMsg);
				}
			},
			error: function () {
				jems.mboxMsg("network error!");
			}
		});
	} else {
		$.ajax({
			type: "POST",
			url: msonionUrl + "sodrest/createThSod",
			data: data,
			dataType: "json",
			asyn: false,
			success: function (data) {
				if (data.flg == 0) {
					jems.tipMsg("友情提示:退货申请单创建失败");
					return;
				} else if (data.flg == 1) {
					jems.goUrl("../login.html?" + window.location.href);
					return;
				} else if (data.flg == 2) {
					jems.tipMsg("获取退单信息失败。请刷新");
					return;
				} else if (data.flg == 3) {
					if (data.return_over == 9) {
						jems.tipMsg("温馨提示：你的商品已退完，如有疑问，请联系客服");
					} else if (data.return_over == 10) {
						jems.tipMsg("退货数量超出商品购买数量");
						return;
					} else if (data.return_over == 1) {
						jems.tipMsg("该订单不在可退款范围");
						return;
					} else if (data.return_over == 2) {
						jems.tipMsg("交易完成不可以退款");
						return;
					} else if (data.return_over == 3) {
						jems.tipMsg("支付时间小于6小时获大于21天,不允许单件退款");
						return;
					} else {
						jems.goUrl("order-refund.html");
						return;
					}
				} else if (json.flg == 4) {
					jems.tipMsg("友情提示", "退货申请单创建成功，但您的退货申请发送到洋葱ERP失败，请联系管理员！", "确定");
					return;
				}
			}
		});
	}
}


function createThSodOfAll() {
    if (sodId == null || sodId == "" || typeof(sodId) == undefined) {
        jems.tipMsg("获取退款信息失败，返回上次刷新");
        return;
    }
    var sodItemRcNo = $("#sodItemRcNo").val();//退货理由
    var data = {"thRcFlg": 1, "sodId": sodId, "sodItemRcNo": sodItemRcNo};
    showDialog(data, submitThSodOfAll);
}

/**
 * 提交全部退单
 */
function submitThSodOfAll(data) {
    $.ajax({
        type: "POST",
        url: msonionUrl + "sodrest/createThSodOfAll",
        data: data,
        dataType: "json",
        asyn: false,
        success: function (data) {
            if (data.flg == 0) {
                jems.tipMsg("友情提示:退货申请单创建失败");
                return;
            } else if (data.flg == 1) {
                jems.goUrl("../login.html?" + window.location.href);
                return;
            } else if (data.flg == 3) {
                if (data.return_over == 9) {
                    jems.tipMsg("温馨提示：你的商品已退完，如有疑问，请联系客服");
                } else {
                    jems.goUrl("order-refund.html");
                    return;
                }
            } else if (json.flg == 4) {
                jems.tipMsg("友情提示", "退货申请单创建成功，单您的退货申请发送到洋葱ERP失败，请联系管理员！", "确定");
                return;
            }
        }
    });
}
/**
 * 获取最后一次申请退款填写的账户信息，并回显在表单中
 */
 function getLastBankInfo(){
     setTimeout(function(){
         $.getJSON(msonionUrl+"sodrest/bankinfo","_t="+new Date().getTime(),function(msg){
             //console.info(msg);
        	 if(msg == null  || msg == "-1"){
        		 return;
        	 }
             $('#sodItemPayBrank').val(msg.bank||'');
             $('#province').val(msg.province);
             getArea(msg.province,'city',msg.city);
             $('#subBank').val(msg.subBank||'');
             $('#sodItemPayNo').val(msg.bankNo||'');
             $('#sodItemPayName').val(msg.bankName||'');
             $('#cid').val(msg.cid||'');
         });
     },500)
 }

/**
 * 弹出框
 * @param msg
 */
function showDialog(msg, operFun) {
    var lim = mBox.open({
        width: "65%",
        height: "12%",
        title: "",
        content: createHtml(msg),
        closeBtn: [false, 1],
        btnName: ['确定', '取消'],
        btnStyle: ["color: #0e90d2;"],
        maskClose: false,
        yesfun: function () {
            operFun(msg);	// 执行退单操作
            mBox.close(lim);
        },
        nofun: null
    });
}

/**
 * 生成html提示内容
 * @param obj
 */
function createHtml(obj) {
    // var banknamemsg = "<span>开户银行："+obj.sodItemPayBrank+"</span><br/>";
    // var subbankmsg = "<span>开户支行："+obj.sodItemPaySubBank+"</span><br/>";
    // var accountnomsg = "<span>帐号："+obj.sodItemPayNo+"</span><br/>";
    // var accountnamemsg = "<span>帐户名称："+obj.sodItemPayName+"</span><br/>";
    // var cid = "<span>身份证号码："+obj.cid+"</span>";
    // var msg = banknamemsg+subbankmsg+accountnomsg+accountnamemsg+cid;
    var msg = '<span style="color:red;">您确定退款吗?</span>'
    return "<p class='listinfo f14' style='width:100%;text-align: center'>" + msg + "</p>";
    //showDialog("<p class='listinfo f14' style='width:100%'>"+msg+"</p>");
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
