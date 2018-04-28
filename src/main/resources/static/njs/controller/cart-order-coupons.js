/**
 @Js-name:cart-order-sumbit.js
 @Zh-name:确认订单
 @Author:tyron
 @Date:2015-08-04
 */
var cartIds ="", countPrice = 0, errCode = 0,errMsg = "",couponNo="",logisval = "auto";
var msdownTime = 0, msdownText;
var params =  jems.parsURL(window.location.href).params;
$(function(){
	cartIds = sessionStorage.cartIds;
	countPrice = sessionStorage.countPrice;
	var clearFee = countPrice >= 299 ? 0:5;
	var postFee = countPrice>=299 ? 0 :20;
	if (cartIds == null || cartIds == "" || typeof(cartIds) == undefined){
		jems.mboxMsg("返回上一步选择商品");
		return ;
	}
	var url = window.location.href, couponData = {};
	$.ajax({
		type : "post",
		data : {"cartIds":cartIds},
		url : msonionUrl+"cart/getCartByCardIds/v1",
		dataType: "json",
		asyn:false,
		success:function(result){
			errCode = result.errCode;
			errMsg = result.errMsg;
			if(errCode == 4001){
				jems.goUrl("../login.html?"+window.location.href);
				return ;
			} else if (errCode == 5006){
				  mBox.open({
                      width:"80%",
                      content:"<p class='tc f16' style='width:100%'>未设置收货地址</p>",
                      closeBtn: [false],
                      btnName:['确定'],
                      btnStyle:["color: #0e90d2;"],
                      maskClose:false,
                      yesfun : function(){
                          jems.goUrl("addres-add.html?"+window.location.href);
                      }
                  });
                  return "";
			}else{				
				result.data.url = url;
				// 清关费
				result.data.clearFee = clearFee;
				// 计算邮费
				result.data.postFee = postFee;
				// 总销费 = 商品总价 + 邮费 + 清关费
				result.data.countPrice = parseFloat(countPrice) + postFee + clearFee;
				var datas = {data:result.data};
				var gettpl = $('#indexData').html();
				jetpl(gettpl).render(datas, function(html) {
					$('#indexList').html(html);
				});
				var Count = 0;
				var totalCount = $("#totalCount").text();
                $("#gocoupons").on("click",function () {
                    var couponidx = mBox.open({
                        title:['选择优惠券'],
                        boxtype: 2,
                        closeBtn:[ true, 1 ],
                        height:"50%",
                        padding:"0",
                        content: '<div style="background-color: #fff;" id="coupons'+params.tmn+'"></div>',
                        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
                        success:function () {
                        	 couponList(totalCount,couponidx)
                        }
                    });
                })
                chooseLogistics(result.data.isChoose);
//                findTmn(params.tmn, countPrice);
				if(errCode != 10000){  
					if (errCode == 8006) {
						var msg = "根据海关总署令第104号文规定，个人物品类进境快件报关时，应当向海关提交进境快件收件人身份证件影印件。请尽快补充您的身份证正反面照片，以免造成海关扣件。";
						mBox.open({
							width:"80%",
							content:"<p class='tc f16' style='width:100%'>"+msg+"</p>",
							closeBtn: [false],
							btnName:['确定'],
							btnStyle:["color: #0e90d2;"],
							maskClose:false,
							yesfun : function(){
								jems.goUrl("addres-edit.html?addressId="+result.data.address.addressId);
							}
						});
					} else if (errCode == 8008) {
						jems.goUrl("addres-edit.html?addressId="+result.data.address.addressId);
					} else {
						$("#tipText").text(result.errMsg);
						$(".newStore").show();
					}
				}
				defaultCoupon(totalCount);//默认选择适用优惠券
			}
		},
		error:function(data){
			jems.mboxMsg("network error!");
		}
	});
});


function chooseLogistics(logis) {
	var wlcell = $("#choselogis");
	if (logis == 1){
        wlcell.show();
        $.ajax({
            type : "GET",
            url : msonionUrl+"wx/js/jsons/config.json",
            dataType: "json",
            asyn:false,
            success:function(result){
            	var datas = {data:result.logistics};
                logisval = datas.data[0].value;
                wlcell.attr("val",datas.data[0].value).find("em").text(datas.data[0].name);
                wlcell.on("click",function () {
                    var logisidx = mBox.open({
                        title:['选择物流'],
                        boxtype: 2,
                        closeBtn:[ true, 1 ],
                        height:"50%",
                        padding:"0",
                        content: '<div style="background-color: #fff;" id="logis'+params.tmn+'"></div>',
                        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
                        success:function () {
                            jetpl("#choosewuliu").render(datas,function(html){
                                $('#logis'+params.tmn).append(html);
                            });
                            $('#logis'+params.tmn).find("li").on("click",function () {
                            	var vals = $(this).data("value"),
									txts = $(this).data("text");
                                logisval = vals;
                                wlcell.attr("val",vals).find("em").text(txts);
                                mBox.close(logisidx);
                            })
                        }
                    });
                });
			}
        })
	}else {
        $("#choselogis").remove();
	}
}


function couponList(totalCount,couponidx){
		     var couponsHtml = $('#choosecoupons').html();
		     for(var i = 0;i<couponData.data.length;i++){
		    	 var date = new Date();
		    	 var currentTime = date.Format("yyyy-MM-dd");
		    	 var dateDiff=DateDiff(currentTime,couponData.data[i].validEndTime);
		    	 couponData.data[i].dateDiff = dateDiff;
		     }
		     jetpl(couponsHtml).render(couponData,function(html){
		    	 $('#coupons'+params.tmn).append(html);
		     });
             $('#coupons'+params.tmn).find("li").on("click",function () {
            	 var coups = $("#gocoupons"), amount = $(this).attr("amount"),state = $(this).attr("state");
            	 couponNo = $(this).attr("couponNo"); 
                 coups.attr("price",amount);
                 findTmn(params.tmn, countPrice-amount);
                 if(state==0){
                     coups.find(".number").text("（已使用0张）");
                 }else{
                	 coups.find(".number").text("（已使用1张）");
                 }
                 coups.find(".amount").text(amount);
                 mBox.close(couponidx);
                 return false;
				})
}


function defaultCoupon(totalCount){
	$.ajax({
		type:"POST",
		data:{"cartIds":cartIds},
		url : msonionUrl+"couponRest/userUsableCouponList",
		dataType: "json",
		success:function(data){
				 couponData = {data:data.data};
            	 var coups = $("#gocoupons"),amount = 0;
            	 if(data.total>0){
            	  couponNo = data.data[0].couponNo; 
            	  amount =data.data[0].couponMinus;
            	 coups.find(".number").text("（已使用1张）");
            	 }
            	 findTmn(params.tmn, countPrice-amount);
                 coups.attr("price",amount);
                 coups.find(".amount").text(amount);
				}
	})
}

var  submit_flag  = true;
function submitOrder(){
	if (!submit_flag) {
		jems.tipMsg("提交中，请稍等..");
		return ;
	}
	submit_flag = false ;
	if (errCode != 10000) {
		jems.mboxMsg(errMsg);
		return;
	}
	var addressId  =$("#addressId").val();
	var addressUserCid  =$("#addressUserCid").val();
	var addressUser  =$("#addressUser").text();
	if (cartIds == null || cartIds == "" || typeof(cartIds) == undefined){
		jems.tipMsg("请选择结算商品");
		return ;
	}
	if (addressId == null || addressId == "" || typeof(addressId) == undefined){
		jems.tipMsg("先设置收货地址");
		return ;
	}
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	var isDigit = /[\u4e00-\u9fa5]/;
	var numberReg = /[0-9]+?/;
	if (addressUser == "" || numberReg.test(addressUser)) {
		jems.tipMsg("收货人姓名无效!");
		return ;
	}
	if (typeof(addressUserCid) == undefined || addressUserCid == null || addressUserCid =="" || addressUserCid == "undefined" ){
		jems.tipMsg("收货地址身份证号码为空，点击收货地址重新编辑");
		return  ;
	}

	if (isDigit.test(addressUserCid)) {
		jems.tipMsg("身份证号码不能含有中文!");
		return ;
	}
	if (!reg.test(addressUserCid)) {
		jems.tipMsg("请输入正确身份证号码.");
		return ;
	}
	if (params.tmn == 1 || params.tmn == "undefined"){
		var tmnId =$("#memberTmnId").val();
	} else {
		tmnId = params.tmn;
	}
	var subId = $("#submitOrder"), num = msdownTime;

	//限制提交按钮点击
	if(subId.attr("limit") == "no"){
		if(msdownText != "") jems.tipMsg(msdownText);
		return false;
	};
	subId.attr("limit", "no");
	createSod();
	for(var i=1; i <= num; i++) {
		window.setTimeout("limitTime(" + i + ","+ num+")", i * 1000)
	}
	function limitTime(num,t) {
		if(num == t) {
			subId.attr("limit", "yes");
			createSod();
		}
	}
	function createSod(){
		$.ajax({
			type: "post",
			data: {"cartIds": cartIds, "tmnId": tmnId, "addressId": addressId, "sodUserId": "","couponNo":couponNo,"logistics":logisval},
			url: msonionUrl + "sodrest/createSod2",
			//url: msonionUrl + "sodrest/createSod",
			dataType: "json",
			success: function (data) {
				$(".loading").hide();
				submit_flag = true;
				if(data.errCode==9101){
					jems.mboxMsg(data.errMsg);
				}
				if (data.flg == 0) {
					jems.mboxMsg("订单创建失败!");
					return;
				} else if (data.flg == 1) {
					jems.goUrl("../login.html?" + window.location.href);
					return;
				} else if (data.flg == 2) {
					jems.mboxMsg("请选择您要选购的商品！");
					return;
				} else if (data.flg == 8) {
					jems.mboxMsg(data.nostock + "库存不足！");
					return;
				} else if (data.flg == 5) {
					jems.mboxMsg("海关大叔友情提醒:据海关总署第43号公告规定，海关对个人邮递物品应征进口税额度在人民币50元以内的予以免税，超过50的依法征收关税");
					return;
				} else if (data.flg == 3) {
					//location.href = '<%=basePath%>webapp/memberInfo.jsp?tmnId=<%=tmnId%>&sodId='+data.sodId;
					return;
				} else if (data.flg == 4) {//创建订单成功--
					//jems.goUrl("../order-waiting.html?sodNo=" + data.sodNo);
					var Waits = mBox.open({
						boxtype: 3,
						conStyle: 'text-align:center;',
						maskColor:"rgba(0,0,0,0.8)",
						time: 0,
						content: '<div class="jemboxloadspin"><div class="jemboxloading"></div></div><p style="line-height:20px;">正在创建订单</p>',
						success:function () {
							orderWaiting(data.sodNo,Waits);
						}
					});
					return;
				} else if (data.flg == 6) {
					jems.mboxMsg("对不起，由于您是洋葱商家，不能使用此功能 ！");
					return;
				} else if (data.flg == 7) {
					jems.mboxMsg("请选择您的收货地址！");
					return;
				} else if (data.flg == 9) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 8009) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 8008) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 8005) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 8012) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 8011) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 5012) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 5013) {
					jems.mboxMsg(data.errMsg);
					return;
				} else if (data.errCode == 5015) {
					jems.mboxMsg(data.errMsg);
					return;
				}else if (data.errCode == 5016) {
					jems.mboxMsg(data.errMsg);
					return;
				}else if (data.errCode == 9101) {
					jems.mboxMsg(data.errMsg);
					return;
				}
			},
			error: function () {
				$("#submitOrder").show();
				jems.tipMsg("network error!");
			}
		});
	}
}
function checkPerson(sodNo, idcard, telPhone, address){
	var returnStr = null;
	$.ajax({
		type: "post",
		data:{"sodNo":sodNo,"idcard":idcard,"telPhone":telPhone,"address":address},
		url: msonionUrl + "sodrest/checkPersonByGoldjet",
		dataType: "json",
		success: function(data) {
			returnStr = data;
			alert(returnStr);
		}
	});
	return returnStr;
}
function findTmn(tmn,countPrice){
	$.ajax({
		type: "post",
		data:{"tmn":tmn,"countPrice":countPrice},
		url: msonionUrl + "terminal/isFreeShipp",
		dataType: "json",
		success: function(data) {
			if(data.success){
				$("#coumosfix").text("0.0");
				$("#shipfix").text("0.0");
				$("#totalCount").text(parseFloat(countPrice));
				$("#tipText").text(data.message);
				$(".newStore").show();
			}else{
				$("#coumosfix").text("5.0");
				$("#shipfix").text("20.0");
				$("#totalCount").text(parseFloat(countPrice)+25);
			}
		}
	});
}

function orderWaiting(sodNo,mid) {
	var num = 0 ,time;
	var resultType = {
			ok:"ok",
			error:"error",
			timeout:"timeout",
			waitting:"waitting"
	}
	var startRun = function (){
		$.ajax({
			type: "post",
			url : msonionUrl+"sodrest/findSodStaByNo",//等待生成
			data: {"sodNo":sodNo},
			success: function(json){//
				var data = eval("("+json+")");
				noresult();
				if(data.result == resultType.ok)
				{
					//alert("订单生成成功！");
					jems.goUrl("../payment.html?sodId="+data.sodId)
					return ;
				}else if(data.result ==resultType.error){
					alert("发生错误");
					return ;
				}
			}
		});
		time = setTimeout(startRun, 1000);
	}
	function stopRun(){
		clearTimeout(time);
	}
	function noresult(){
		num++;
		if(num>4){
			stopRun();
			mBox.close(mid);
			mBox.open({
				width: "70%",
				height: 100,
				content: "<p class='tc listinfo f16' style='width:100%'>系统繁忙，请稍后尝试...</p>",
				closeBtn: [false, 1],
				btnName: ['确定'],
				btnStyle: ["color: #0e90d2;"],
				maskClose: false,
				yesfun : function(){
					jems.goUrl("members.html");
				}
			});
			return;
		}
	}
	if(sodNo != '' || sodNo != 'undefined' || sodNo != null){
		startRun();
	}else{
		alert("发生错误");
		jems.goUrl("members.html");
		return ;
	}
}


//计算日期间隔天数
function  DateDiff(sDate1,  sDate2){    
    var  aDate, bDate, oDate1,  oDate2,  iDays  
    aDate  =  sDate1.split("-")  
    oDate1  =  new  Date(aDate[0],aDate[1],aDate[2])   
    bDate  =  sDate2.split("-")  
    oDate2  =  new  Date(bDate[0],bDate[1],bDate[2])  
    iDays  =  parseInt(Math.abs(oDate1-oDate2)/1000/60/60/24)
    return  iDays  
}    
//获取指定格式时间
Date.prototype.Format = function(format){ 

	var o = { 

	"M+" : this.getMonth()+1, //month 

	"d+" : this.getDate(), //day 

	"h+" : this.getHours(), //hour 

	"m+" : this.getMinutes(), //minute 

	"s+" : this.getSeconds(), //second 

	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 

	"S" : this.getMilliseconds() //millisecond 

	}

	if(/(y+)/.test(format)) { 

	format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 

	}

	for(var k in o) { 

	if(new RegExp("("+ k +")").test(format)) { 

	format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 

	 } 

	} 

	return format; 

	}

