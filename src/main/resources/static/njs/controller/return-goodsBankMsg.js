﻿
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
				var targetTime = toGetTime("" + new Date().getTime(), true);
				var sodPayTime = toGetTime(result.data.sodPayTime, false);
				var timeDif = parseInt(targetTime) - sodPayTime;
				var sodPayFlg = result.data.sodPayFlg;
				isGroup = result.data.sodIsGroup == 1 ? true : false;
				if (isGroup == true && sodStat < 3) {
					jems.mboxMsg("该团购订单不允许退款!");
					return;
				}
				if(sodPayFlg == 9 && timeDif > 30*24*60*60*1000){
					$(".brank_info").show();
					old_order = true;
					getLastBankInfo();
				}else if(timeDif > 90*24*60*60*1000){
					$(".brank_info").show();
					old_order = true;
					getLastBankInfo();
				}else{
					$(".brank_info").hide();
					old_order = false;
				}
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

var submit_flag = false;
var rsg = /^\d{14,30}$/;
var chineseReg = /^[\u4e00-\u9fa5]{0,}$/;
var cnReg = /^[\u4e00-\u9fa5]{4,20}$/;	// 验证开户支行
var chineseNameReg = /^[\u4E00-\u9FA5]{1,}(?:·[\u4E00-\u9FA5]{1,})*[\u4E00-\u9FA5]{1,}$/;
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var regCarNo = /^[0-9]*$/;


function createThSodOfAll() {
    if (sodId == null || sodId == "" || typeof(sodId) == undefined) {
        jems.tipMsg("获取退款信息失败，返回上次刷新");
        return;
    }
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
    var data = {"thRcFlg": 1, "sodId": sodId };
    data["sodItemPayBrank"] = sodItemPayBrank;
    data["sodItemPayNo"] = sodItemPayNo;
    data["sodItemPayName"] = sodItemPayName;
    data["cid"] = cid;
    showDialog(data, submitThSodOfAll);
}

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
            }
        }
    });
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
    var msg = '<span style="color:red;">您确定退款吗?</span>'
    return "<p class='listinfo f14' style='width:100%;text-align: center'>" + msg + "</p>";
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
/**
 * 获取最后一次申请退款填写的账户信息，并回显在表单中
 */
 function getLastBankInfo(){
     setTimeout(function(){
         $.getJSON(msonionUrl+"sodrest/bankinfo","_t="+new Date().getTime(),function(msg){
        	 if(msg == null  || msg == "-1"){
        		 return;
        	 }
             $('#sodItemPayBrank').val(msg.bank||'');
             $('#sodItemPayNo').val(msg.bankNo||'');
             $('#sodItemPayName').val(msg.bankName||'');
             $('#cid').val(msg.cid||'');
         });
     },500)
 }