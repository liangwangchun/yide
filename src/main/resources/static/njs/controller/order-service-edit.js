/**
 * Created by Administrator on 2018/4/2.
 */
var successPicArray = [];
var uploadImgNum = 0;
var detailsDivFlag = false;
var expressDivFlag = false;
var bankDivFlag = false;
var sodReturnType;
var sodNo ="";
var sodId ="";
$(function () {
	var params = jems.parsURL().params;
    sodId = params.id;
    var reasonData = "";
    if (sodId == null || sodId == "" || typeof(sodId) == undefined) {
        jems.tipMsg("返回上一步选择退货商品");
        return;
    }

    $.post( msonionUrl + "app/sodrest/getRefundReason?status=1", function (data) {
    	var json = JSON.parse(data);
		reasonData = json.data;
	})
    $.ajax({
		type: "post",
		data: {"sodId": sodId,"type":1},
		url: msonionUrl + "app/sodrest/findThSodById/v1",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4002 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} 
			if (10000 == result.errCode) {
				sodNo = result.data.sodNo;
				sodReturnType=result.data.sodReturnType;
				var stateBtns=result.data.stateBtns;
				var sodStat = result.data.sodStat;
				var cueRec = result.data.cueRec;
				var progressId = "";
				if(cueRec == undefined){
					$("#modifyReason").removeClass("show");
					$("#modifyReason").addClass("hide");
				}else{
					$("#modifyReason").removeClass("hide");
					$("#modifyReason").addClass("show");
					$("#cueReason").html(cueRec == undefined ? "" : cueRec.cueReason == "null" ? "" : cueRec.cueReason );
					$("#content").html(cueRec == undefined ? "" : cueRec.content);
				}
				$.each(stateBtns || [],function(k,v){
					if(v.code=="xg001"){
						$("#detailsDiv").show();
						detailsDivFlag = true;
					}else if(v.code=="xg002"){
						expressDivFlag = true;
						$("#expressDiv").show();
					}else if(v.code=="xg003"){
						bankDivFlag = true;
						$("#bankDiv").show();
					}
				})
				if(sodReturnType == 3){
	            	$("#record").after("<div class=\"g3 bg-wh p10 f14  jepor flexbox left-arrow jecell-bottom\" id=\"goUexProess\" ><span class=\"show b\">寄回运费进度</span></div>");
	            	var  sodReturnUex= result.data.sodReturnUex;
	            	var  sodItemPayNo= result.data.sodItemRecs[0].sodItemPayNo;
	            	var  sodItemPayBrank= result.data.sodItemRecs[0].sodItemPayBrank;
	            	var  sodItemPayName= result.data.sodItemRecs[0].sodItemPayName;
	            	var  expCom= result.data.sodItemRecs[0].expCom;
	            	var  sodItemExpressNo= result.data.sodItemRecs[0].sodItemExpressNo;
	            	var  sodRcFlg= result.data.sodRcFlg;
	            	var uexProessParms = "sodReturnType="+sodReturnType+"&sodStat="+sodStat+"&sodReturnUex="+sodReturnUex+"&sodItemPayNo="+sodItemPayNo +
	            	"&sodItemPayBrank="+sodItemPayBrank+"&sodItemPayName="+sodItemPayName+"&expCom="+expCom+"&sodItemExpressNo="+sodItemExpressNo +
	            	"&sodRcFlg="+sodRcFlg;
	            	$("#goUexProess").click(function(){
	            		jems.goUrl('order-service-freight.html?'+uexProessParms);
	            	})
	            }
				var gettpl ;
				result.reasonData = reasonData;
				if(sodReturnType == 3){
					gettpl = $('#detailsData3').html();
				}else if(sodReturnType == 4){
					gettpl = $('#detailsData4').html();
				}else {
					gettpl = $('#detailsData2').html();
				}
				jetpl(gettpl).render(result, function (html) {
					$(html).appendTo('#details');
				});
				$("[name='cartname']").each(function(k,v){
		        	var $id = "#item" + $(v).attr("data-soditemid");
		        	var val = $(v).val();
		    		if(val < 1){
		    			$($id).hide();
		    		}
		    	})
	            /**快递信息**/
	            if(sodReturnType == 3 || sodReturnType == 2){
	            	if(expressDivFlag){
	            		var gettplExrpess = $('#expressData').html();
	            		jetpl(gettplExrpess).render(result, function (html) {
	            			$(html).appendTo('#expressDetailDiv');
	            		});
	            		if(sodReturnType == 2 ){
	            			$("#refunfUex").hide();
	            		}
	            		var comNo = result.data.sodItemRecs[0].expComNo;
	            		$.getJSON(msonionUrl + "wx/js/jsons/expressCom.json", function (data) {
	            			for (i = 0; i < data.length; i++) {
	            				if (data[i].no == comNo) {
	            					$("#expComNo").append("<option value='" + data[i].no + "' selected>" + data[i].com + "</option>");
	            				} else {
	            					$("#expComNo").append("<option value='" + data[i].no + "'>" + data[i].com + "</option>");
	            				}
	            			}
	            		})
	            	}
	            }
	            if(bankDivFlag){
	            	var gettplExrpess = $('#bankData').html();
	            	jetpl(gettplExrpess).render(result, function (html) {
	            		$(html).appendTo('#bankDetailDiv');
	            	});
	            	var sodItemPayBrank = result.data.sodItemRecs[0].sodItemPayBrank;
	            	$.getJSON(msonionUrl + "wx/js/jsons/bank.json", function (data) {
	            		for (i = 0; i < data.length; i++) {
	            			if (data[i].key == sodItemPayBrank) {
	            				$("#sodItemPayBrank").append("<option value='" + data[i].key + "' selected>" + data[i].value + "</option>");
	            			} else {
	            				$("#sodItemPayBrank").append("<option value='" + data[i].key + "'>" + data[i].value + "</option>");
	            			}
	            		}
	            	})
	            }
	            /**
				 * 加
				 */
				$(".cartadd").on("tap",function(){
					var inputVal = $(this).prev();
					var allowQty =inputVal.attr("data-allowQty");
					var leId =inputVal.attr("data-leId");
					var itemId =inputVal.attr("data-itemId");
					var freePrice =inputVal.attr("data-freePrice");
					if(allowQty <= inputVal.val()){
						jems.mboxMsg("不能超过可退数量!");
						return;
					} else{
						qty = parseInt(inputVal.val())+1;
						inputVal.val(qty);
						$("#amt"+leId).html("¥"+jems.formatNum(freePrice * qty,2));
					}
				});
				
				/**
				 * 减
				 */
				$(".cartmin").on("tap",function(){
					var inputVal = $(this).next();
					var val = parseInt(inputVal.val());
					var leId =inputVal.attr("data-leId");
					var itemId =inputVal.attr("data-itemId");
					var freePrice =inputVal.attr("data-freePrice")
					if(val > 1){
						inputVal.val(val - 1);
						$("#amt"+leId).html("¥"+jems.formatNum(freePrice * (val - 1),2));
					}
				});
				$("input[name='imageFile']").each(function () {
                    upload($(this));
                })
                 $(".tache").on("tap", function () {
                    var removeImageId = $(this).parent().parent().attr("data-imageId");
                    var dataType = $(this).parent().parent().attr("data-type");
                    removeByValue(successPicArray, removeImageId);
                    $('.uploadsLi').css('display', '');
                    $(this).parent().parent().remove();
                    if(dataType != 1){
                    	--uploadImgNum;
                    }
                })
                $(".delete").on("tap", function () {
                	var $obj = $(this);
                	mBox.open({
                	    content: "<p class='tc'>是否取消该商品的售后申请？</p>",
                	    btnName: ['是', '否'],
                	    btnStyle:["color: #0e90d2;","color: #0e90d2;"],
                	    maskClose: false,
                	    yesfun: function(){
                	    	var $item = "#"+$obj.attr("data-item");
                	    	var val = $($item).children().find('[name="cartname"]').val();
                	    	var sum = 0;
                	    	$("[name='cartname']").each(function(k,v){
                	    		sum += Number($(v).val());
                	    	})
                	    	if(sum - val < 1){
                	    		jems.tipMsg("不能删除,至少要有一件商品!");
                	    		return;
                	    	}
                	    	$($item).addClass("hide");
                	    	$($item).children().find('[name="cartname"]').val(0);
                	    }, nofun: function(){
                	    }
                	});
                })
                var msg = "";
                $("select[name='liyou']").on("change", function () {
                    var that = $(this);
                    var val = that.val()-1;
                    var descLi = that.parents("li").next("li");
                    if (val != 0) {
                         $.each(reasonData, function (infoIndex, info) {
		    				if (info.refundType == sodReturnType) {
		    					$.each(info.data, function (k, v) {
		    						 if (k == val) {
		    							var label = that.attr("data-label");
		    							$("#"+label).html(v.remark)
		                                descLi.show();
		                                msg = v.voucherDescription;
		                                $("#"+label).next("span").attr("data-voucherDescription",msg)
		    						 }
	                            })
		    				}
		    			})
                    } else {
                        descLi.hide();
                    }
                })
			} else{
				jems.tipMsg(result.errMsg);
			}
        },
        error: function (result) {
            jems.tipMsg("network error!");
        }
    });
    var revise = $(".editBox-list").find(".order-btns");
    //点击修改展示
    revise.on("click",function () {
        var that = $(this), nextElem = that.parent().next();
        var funval = that.attr("data-fun");
		$("#contentlist").css({"padding-bottom": 50});
        nextElem.css({display:"block"});
        revise.css({display:"none"});
        $("#reviseBtn").css({display:"block"}).find(".save").attr("data-type",funval);
    });
    //保存按钮事件
    $("#reviseBtn").find(".save").on("click",function () {
        var typeval =  $(this).attr("data-type");
        switch (typeval){
            case "aftersale":
                aftersale();
                break;
            case "express":
                express();
                break;
            case "bankcard":
                bankcard();
                break;
        }
        $("#contentlist").css({"padding-bottom": ""});
//        $(this).removeAttr("data-type");
    });
    //取消按钮事件
    $("#reviseBtn").find(".cancel").on("click",function () {
        revise.css({display:""});
        $("#contentlist").css({"padding-bottom": ""});
        $(".editBox-list").find(".editBox-content").css({display:"none"});
        $("#reviseBtn").css({display:"none"});
        $("#reviseBtn").find(".save").removeAttr("data-type");
        $("[name='cartname']").each(function(k,v){
        	var $id = "#item" + $(v).attr("data-soditemid");
        	var val = $(v).val();
    		if(val > 0){
    			$($id).show();
    		}
    	})
    });
});
function upDesc(e){
	var msg =$(e).attr("data-voucherDescription");
    mBox.open({
        title: ['温馨提示', 'color:#8016AD;font-size:1.4rem;text-align:center;'],
        content: msg,
        btnName: ['确认'],
        maskClose: false,
        yesfun: function () {
        }, nofun: function () {
        }
    });
}
//售后单明细
function aftersale() {
	var itemRec = new Array(); 
	var sodId = $("#sodId").val();
	var sodReturnType = $("#sodReturnType").val();
	var sodRec={};
	sodRec.sodId=sodId;
	sodRec.sodReturnType = sodReturnType;
	var picNum=0;
	var flag = true;
	var sodItemRcNoTemp ="";
	var sodItemRemarkTemp = "";
	var isFirstOk = false;
	$("[name='cartname']").each(function(k,v){
		var data={};
		var ids=[];
		data.sodRec = sodRec; 
		ids[k]=$("[name='cartname']").eq(k).attr("data-ids");
		data.sodItemFromId = $("[name='cartname']").eq(k).attr("data-sodItemFromId");
		data.sodItemFromItemId = $("[name='cartname']").eq(k).attr("data-sodItemFromItemId");
		var fromSubOrderItemId = $("[name='cartname']").eq(k).attr("data-fromSubOrderItemId");
		if(fromSubOrderItemId == undefined || fromSubOrderItemId == "undefined"){
			fromSubOrderItemId = "";
		}
		data.fromSubOrderItemId = fromSubOrderItemId;
		data.sodItemId = $("[name='cartname']").eq(k).attr("data-sodItemId");
		var leId = $("[name='cartname']").eq(k).attr("data-leId");
		var sodItemRcNo = $("#select"+leId).val();
		if(sodItemRcNo == undefined || sodItemRcNo == "undefined"){
			sodItemRcNo = "";
		}
		data.sodItemRcNo = sodItemRcNo
		var sodItemRemark = $("#remark"+leId).val();
		if(sodItemRemark == undefined || sodItemRemark == "undefined"){
			sodItemRemark = "";
		}
		data.sodItemRemark = sodItemRemark;
		data.sodItemRcQty =  $("[name='cartname']").eq(k).val();
		data.sodItemQty =  $("[name='cartname']").eq(k).val();
		if(sodReturnType == 4){
			if(k == 0){
				sodItemRcNoTemp = sodItemRcNo;
				sodItemRemarkTemp = sodItemRemark;
			}else{
				data.sodItemRcNo = sodItemRcNoTemp;
				data.sodItemRemark = sodItemRemarkTemp;
			}
		}
		var product ={};
		product.id=leId;
		var returnPics = new Array();
		var $img = $("#img"+leId).find("li");
		$img.each(function(k,v){
			if(k<$img.length-1){
				var pic = {};
				pic.id = $(v).attr("data-imageId");
				pic.pictureUrl = $(v).attr("data-imageUrl");
			returnPics.push(pic);
			}
		})
		if((sodReturnType == 3 || sodReturnType == 4) && returnPics.length <=0){
			if(sodReturnType == 4 && !isFirstOk){
				jems.mboxMsg("亲.每个商品请至少上传一张图片!");
				flag = false;
				return;
			}
			if(sodReturnType == 3){
				jems.mboxMsg("亲.每个商品请至少上传一张图片!");
				flag = false;
				return;
			}
		}else{
			isFirstOk = true;
		}
		product.returnPics = returnPics;
		data.product = product;
		itemRec.push(data);
		if(returnPics.length>6){
			jems.tipMsg("最多只能上传六张凭证");
			flag = false;
			return;
		}
		picNum = picNum + returnPics.length;
	})
	if(!flag){
		return;
	}
	if(successPicArray.length != uploadImgNum){
		jems.tipMsg("图片上传中");
		return;
	}
	 $.ajax({
		type: "post",
		data: JSON.stringify(itemRec),
		url: msonionUrl + "app/sodrest/updateThSodDetail",
		dataType: "json",
		contentType : 'application/json;charset=utf-8', //设置请求头信息
		asyn: false,
		success: function (result) {
			if (4002 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} 
			if (10000 == result.errCode) {
				jems.tipMsg("保存成功");
				setTimeout(function(){
					jems.goUrl("order-refund.html");
				},2000);
			}else {
                jems.tipMsg(result.errMsg);
                return;
            }
		}
	 })
}
//回寄快递明细
function express() {
	var sodId = $("#sodId").val();
	var expComNo = $("#expComNo").val(); //快递公司
	var sodItemExpressNo = $("#sodItemExpressNo").val(); //快递单号
	var sodReturnUex = $("#sodReturnUex").val(); //运费
	if(expComNo == ""){
		jems.tipMsg("请填选择快递公司");
		return false;
	}
	if(sodItemExpressNo == ""){
		jems.tipMsg("请填写快递单号");
		return false;
	}
	var data = {"thRcFlg": 1, "sodId": sodId ,"sodReturnType":sodReturnType,"type":1};
		data["expComNo"] = expComNo;
		data["sodItemExpressNo"] = sodItemExpressNo;
		data["sodReturnUex"] = sodReturnUex;
		submitExpData(data);
}
//银行卡信息
function bankcard() {
	var chineseNameReg = /^[\u4E00-\u9FA5]{1,}(?:·[\u4E00-\u9FA5]{1,})*[\u4E00-\u9FA5]{1,}$/;
	var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	var regCarNo = /^[0-9]*$/;
	var sodId = $("#sodId").val();
	var sodItemPayBrank = $("#sodItemPayBrank").val(); //银行名称
    var sodItemPayNo = $("#sodItemPayNo").val(); //银行卡号
	var sodItemPayName = $("#sodItemPayName").val(); //姓名
	var cid = $('#cid').val(); //身份证号
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
				    var data = {"thRcFlg": 1, "sodId": sodId ,"sodReturnType":sodReturnType,"type":2};
				    data["sodItemPayBrank"] = sodItemPayBrank;
				    data["sodItemPayNo"] = sodItemPayNo;
				    data["sodItemPayName"] = sodItemPayName;
				    data["cid"] = cid;
				    submitExpData(data);
				}
			}
		});
		
    };
}
function submitExpData(data){
	$.ajax({
		type: "post",
		data: data,
		url: msonionUrl + "app/sodrest/updateThExpData",
		dataType: "json",
		asyn: false,
		success: function (result) {
			if (4002 == result.errCode) {
				jems.goUrl(mspaths + "login.html?" + window.location.href);
			} 
			if (10000 == result.errCode) {
				jems.tipMsg("保存成功");
				setTimeout(function(){
					jems.goUrl("order-refund.html");
				},2000);
			}else {
                jems.tipMsg(result.errMsg);
                return;
            }
		}
	 })
}
function upload(obj) {
	 var liObj = obj.parent().parent();
    var upload = new mbUploadify({
        file: obj[0],
        /*ajax 上传地址*/
        url: msonionUrl + 'app/sodrest/sodRefundImageFile/v1?sodId=' + sodId + '&type=2&sodNo=' + sodNo + '&leId=' + obj.attr("data-leId"),
        /*ajax上传成功*/
        uploadSuccess: function (res) {
            var result = JSON.parse(res);
            if (10000 == result.errCode) {
                successPicArray.push(result.data.imageId);
                liObj.prev().attr("data-imageId", result.data.imageId);
                liObj.prev().attr("data-imageUrl", result.data.imageUrl);
                liObj.prev().find("i").on("tap", function () {
                    var removeImageId = $(this).parent().parent().attr("data-imageId");
                    removeByValue(successPicArray, removeImageId);
                    $('.uploadsLi').css('display', '');
                    $(this).parent().parent().remove();
                    --uploadImgNum;
                })
            } else {
                jems.mboxMsg(result.errMsg);
                return;
            }
        },
        load: function (e) {
            ++uploadImgNum;
            var liDom = $('<li><span style="position: relative"><i class="tache show" style="position :absolute;right:0px;top:0"></i><img src="' + e.target.result +
                '" style="height:100%"></span></li>')
            liObj.before(liDom);
            if (liObj.parent().find("li").length > 6) {
                liObj.css('display', 'none');
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
}
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
function removeImage(removeImageId){
	
}

function scanExpress () {
	/*****微信分享*****/
	if (!navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
		alert("不是微信");
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