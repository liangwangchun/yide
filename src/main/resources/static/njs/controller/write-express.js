var sodId = 0;
var isGroup = false;
var old_order = false;
var uploadImgNum = 0;
var params = jems.parsURL().params;
$(function () {
	sodId = params.id;
	isGroup = params.isGroup == undefined ? false : true;
	if (sodId == null || sodId == "" || typeof (sodId) == undefined) {
		jems.tipMsg("返回上一步选择退货商品");
		return;
	}
	$.ajax({
		type: "post",
		data: {
			"sodId": sodId
		},
		url: msonionUrl + "app/sodrest/getThExpData",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4001 == result.errCode || 4002 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} else if (10086 == result.errCode) {
				jems.mboxMsg("网络异常，请稍后再试");
				return;
			} else if (5003 == result.errCode) {
				jems.mboxMsg("查不到订单");
				return;
			}
			if (10000 == result.errCode) {
				var refundData = result.data.data[0];
				if (refundData.sodReturnType == 2) {
					var gettpl = $('#thExpressData2').html();
					jetpl(gettpl).render(result.data, function (html) {
						$('.wirteExpress').append(html);
					});
				}
				if (refundData.sodReturnType == 3) {
					var gettpl = $('#thExpressData').html();
					jetpl(gettpl).render(result.data, function (html) {
						$('.wirteExpress').append(html);
						$('#removeImg').on('click',function(){
							// 删除图片的逻辑
							$('.quote').remove();
							$('.upload').show();
							$('.upload').after('<p class="quote"></p>');
							upload(refundData);
							
						})
					});
					if (refundData.imageUrl == undefined || refundData.imageUrl == "") {
						upload(refundData);
					}
				}
				var comNo = refundData.sodItemExpressComNo;
				if(typeof(comNo)!="undefined"){
					comNo = comNo.replace(" ","");
				}
				var sodItemPayBrank = refundData.sodItemPayBrank;
				if(typeof(sodItemPayBrank)!="undefined"){
					sodItemPayBrank = sodItemPayBrank.replace(" ","");
				}
				$.getJSON(msonionUrl + "wx/js/jsons/expressCom.json", function (data) {
					for (i = 0; i < data.length; i++) {
						if (data[i].no == comNo) {
							$("#expComNo").append("<option value='" + data[i].no + "' selected>" + data[i].com + "</option>");
						} else {
							$("#expComNo").append("<option value='" + data[i].no + "'>" + data[i].com + "</option>");
						}
					}
				})
				$("#expComNo").find("option[value='"+comNo+"']").attr("selected",true);
				$("#sodItemPayBrank").find("option[value='" + sodItemPayBrank + "']").attr("selected", true);
			} else {
				jems.tipMsg(result.errMsg);
			}
		},
		error: function (result) {
			jems.tipMsg("network error!");
		}
	});

});

var submit_flag = false;
var rsg = /^\d{14,30}$/;
var chineseReg = /^[\u4e00-\u9fa5]{0,}$/;
var cnReg = /^[\u4e00-\u9fa5]{4,20}$/; // 验证开户支行
var chineseNameReg = /^[\u4E00-\u9FA5]{1,}(?:·[\u4E00-\u9FA5]{1,})*[\u4E00-\u9FA5]{1,}$/;
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var regCarNo = /^[0-9]*$/;
var numChar = /^[A-Za-z0-9]+$/;
var moneyReg = /^(([1-9]\d{0,2})|(([0]\.\d{1,2}|[1-9]\d{0,2}\.\d{1,2})))$/;
var expComNo,sodItemExpressNo,sodReturnUex,sodItemPayBrank,sodItemPayNo,sodItemPayName,sodItemPaySubBank,cid,sodNo,imageId,imageUrl;

function writeExpress(sodReturnType) {
	 expComNo = $("#expComNo").val(); //快递公司
	 sodItemExpressNo = $("#sodItemExpressNo").val(); //快递单号
	 sodReturnUex = $("#sodReturnUex").val(); //运费
	 sodItemPayBrank = $("#sodItemPayBrank").val(); //银行名称
     sodItemPayNo = $("#sodItemPayNo").val(); //银行卡号
	 sodItemPayName = $("#sodItemPayName").val(); //姓名
	 sodItemPaySubBank = $("#sodItemPaySubBank").val(); //开户支行
	 cid = $('#cid').val(); //身份证号
	 sodNo = $('#sodNo').val(); //
	 imageId = $('.quote').find("img").attr("imageId"); //图片
	 imageUrl = $('.quote').find("img").attr("imageUrl"); //图片
	if (!expComNo || expComNo == 0) {
		jems.tipMsg("请选择快递公司");
		return;
	}
	if (sodItemExpressNo.trim() == "") {
		jems.tipMsg("请填写快递单号");
		return;
	} else if (!numChar.test(sodItemExpressNo)) {
		jems.tipMsg("快递单号只能是字母和数字");
		return;
	}
	var data = {
		"expComNo": expComNo,
		"sodItemExpressNo": sodItemExpressNo,
		"sodId": params.id,
		"sodReturnType": sodReturnType
	};
	if (sodReturnType == 3) {
		if (!sodReturnUex || sodReturnUex == 0) {
			jems.tipMsg("请填写运费.");
			return;
		}else if (!moneyReg.test(sodReturnUex)) {
			jems.tipMsg("运费填写不正确.");
			return;
		}
		if (imageUrl == null || imageUrl == "") {
			if(uploadImgNum > 0){
		    	jems.tipMsg("图片上传中!");
		    }else{
		    	jems.tipMsg("请上传凭证.");
		    }
			return;
		}
		if (!sodItemPayBrank || sodItemPayBrank == 0) {
			jems.tipMsg("请选择开户银行");
			return;
		}
		if (cid == null || cid == "" || typeof (cid) == undefined) {
			jems.tipMsg("身份证号码不能为空.");
			return;
		} else if (!CIDreg.test(cid)) {
			jems.tipMsg("请输入正确的身份证号码.");
			return;
		}else{
			$.ajax({
				type : "post",
				data : {"memberCid":cid},
				url : msonionUrl+"address/validateIdcard",
				dataType : "json",
				asyn:false,
				success:function(json){
					if (!json.validResult){
						jems.tipMsg("无效的身份证号码.");
						return false;
					}else{
                        vaildataFromId(data);     
					}
				}
			});
			
        };
	}else{
		showDialog(data, submitExpData);
	}
}

/**
 * 如果身份证信息不对，那么就不需要后面的验证
 * 
 * */ 
function vaildataFromId(data){
    if (sodItemPayNo == null || sodItemPayNo == "" || typeof (sodItemPayNo) == undefined) {
        jems.tipMsg("请输入银行卡号");
        return;
    }else if (sodItemPayNo.length > 30 || sodItemPayNo.length < 14) {
        jems.tipMsg("银行卡号长度不正确");
        return;
    }else if (!regCarNo.test(sodItemPayNo)) {
        jems.tipMsg("银行卡号不正确.");
        return;
    }
    if (sodItemPayName == null || sodItemPayName == "" || typeof (sodItemPayName) == undefined) {
        jems.tipMsg("请输入持卡人姓名");
        return;
    } else if (!chineseNameReg.test(sodItemPayName)) {
        jems.tipMsg("别闹，请输入正确姓名");
        return;
    } else if (sodItemPayName.length > 20) {
        jems.tipMsg("别闹，姓名太长了.");
        return;
    }
    /*if (sodItemPaySubBank.trim() == ""){
        jems.tipMsg("请输入开户支行.");
        return;
    }
    if (sodItemPaySubBank.trim() != "" && !cnReg.test(sodItemPaySubBank)) {
        jems.tipMsg("请输入正确的开户支行.");
        return;
    }*/
    data["sodReturnUex"] = sodReturnUex;
    data["sodItemPayBrank"] = sodItemPayBrank;
    data["sodItemPayNo"] = sodItemPayNo;
    data["sodItemPayName"] = sodItemPayName;
    data["cid"] = cid;
//    data["sodItemPaySubBank"] = sodItemPaySubBank;
    data["imageId"] = imageId;
    data["imageUrl"] = imageUrl;
    showDialog(data, submitExpData);
}
/**
 * 提交退货快递信息
 * @param data
 */
function submitExpData(data) {
	$.ajax({
		type: "POST",
		url: msonionUrl + "app/sodrest/saveThExpData",
		data: data,
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4001 == result.errCode || 4002 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} else if (result.errCode == 10000) {
				jems.tipMsg("提交成功");
				setTimeout(function(){
					jems.goUrl("order-refund.html");
				},2000);
				return;
			} else {
				jems.tipMsg(result.errMsg);
				return;
			}
		}
	});
}

/**
 * 获取最后一次申请退款填写的账户信息，并回显在表单中
 */
function getLastBankInfo() {
	setTimeout(function () {
		$.getJSON(msonionUrl + "sodrest/bankinfo", "_t=" + new Date().getTime(), function (msg) {
			//console.info(msg);
			if (msg == null || msg == "-1") {
				return;
			}
			$('#sodItemPayBrank').val(msg.bank || '');
			$('#province').val(msg.province);
			getArea(msg.province, 'city', msg.city);
			$('#subBank').val(msg.subBank || '');
			$('#sodItemPayNo').val(msg.bankNo || '');
			$('#sodItemPayName').val(msg.bankName || '');
			$('#cid').val(msg.cid || '');
		});
	}, 500)
}

/**
 * 弹出框
 * @param msg
 */
function showDialog(msg, operFun) {
	var lim = mBox.open({
		width: "65%",
		height: "17%",
		title: "",
		content: createHtml(msg),
		closeBtn: [false, 1],
		btnName: ['确定', '取消'],
		btnStyle: ["color: #0e90d2;"],
		maskClose: false,
		yesfun: function () {
			operFun(msg); //提交操作
			mBox.close(lim);
		},
		nofun: null
	});
}

function createHtml(obj) {
	var msg = '<span style="color:red;">您确定提交吗?</span>'
	return "<p class='pt15 pb15 f15' style='width:100%;text-align: center'>" + msg + "</p>";
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

function upload(data) {
	var upload = new mbUploadify({
		file: document.getElementById('j-file-writeExpress'),
		/*ajax 上传地址*/
		url: msonionUrl + 'app/sodrest/sodRefundImageFile/v1?sodId=' + data.sodId + '&type=1&sodNo=' + data.sodNo,
		/*ajax上传成功*/
		uploadSuccess: function (res) {
			var result = eval("(" + res + ")");
			$('.quote').find("img").attr("imageId", "");
			$('.quote').find("img").attr("imageUrl", result.data.imageUrl);
		},
		load: function (e) {
			++uploadImgNum;
			$('.quote').show();
			$('.upload').hide();
			$('.quote').addClass('preview');
			$('.quote').append('<i class="tache show" id="removeImg" style="position:absolute;right:0;top:0"></i><img src="' + e.target.result +
				'" style="height:100%">');
			$('#removeImg').on('click',function(){
				// 删除图片的逻辑
				$('.quote').remove();
				$('.upload').show();
				$('.upload').after('<p class="quote"></p>');
				--uploadImgNum;
			})
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
	    error: function(file, msg){
	    	jems.tipMsg(msg);
	    },
	})
}

function scanExpress() {
	/*****微信分享*****/
	if (!navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
		jems.tipMsg("该功能只能在微信内使用");
		return "";
	}
	
	$.ajax({
		type:"post",
		url : msonionUrl+"/getWeChatSign",
		data: {"url": window.location.href},
		dataType : "json",
		success:function(data){
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appid, // 必填，公众号的唯一标识
				timestamp: data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.noncestr, // 必填，生成签名的随机串
				signature: data.finalsign,// 必填，签名，见附录1
				jsApiList: [
				            'checkJsApi',
				            'scanQRCode'
				            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function () {	
				wx.scanQRCode({
					// 默认为0，扫描结果由微信处理，1则直接返回扫描结果
					needResult : 1,
					desc : 'scanQRCode desc',
					success : function(res) {
						//扫码后获取结果参数赋值给Input
						var url = res.resultStr;
						//商品条形码，取","后面的
						if(url.indexOf(",")>=0){
							var tempArray = url.split(',');
							var tempNum = tempArray[1];
							// $("#id_securityCode_input").val(tempNum);
							if(tempNum != null) {
								 var player = $("#scanOk")[0]; /*jquery对象转换成js对象*/
							     player.play(); /*播放*/
								$("#sodItemExpressNo").val(tempNum);
							}
						}else{
							//$("#id_securityCode_input").val(url);
//							alert("else:"+JSON.stringify(res));
						}
					},
					cancel:function(res){
						//alert("cancel:"+JSON.stringify(res));
					},
					fail:function(res){
						//alert("fail:"+JSON.stringify(res));
					}
				});
			});
		}
	});
}