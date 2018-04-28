/**
 * @Js-name:order.resales.js
 * @Zh-name:搜索页面
 * @Author:Banana
 * @Date:2017-11-03
 */
var params = jems.parsURL(window.location.href).params;
var tmn = params.tmn;
var id = params.id;
var sodId = params.sodId;
var sodNo = params.sodNo;
var type = sessionStorage.type;
var url = window.location.href;
var spriceOrder = 0, pageNum = 1;
var totalPage = 1;
var tabIndex = 0;
var couponData = {};
var discountAmt = 0;
var isGroup = false;
$(function() {
	/**
	 * 全选
	 */
	$("input[name='cartall']").on("change", function() {
		var checkobj = $(".order-sales ul li input[name='cart']");
		if ($(this).prop('checked')) {
			checkobj.each(function(){
				if($(this).attr("data-disabled")=="disabled"){
					$(this).prop("checked", false);
					$(this).attr("data-choose", false);
				} else {
					$(this).prop("checked", true);
					$(this).attr("data-choose", true);
				}
			})
		} else {
			checkobj.prop("checked", false);
            checkobj.attr("data-choose", false);
		}
	});
	
	/**
	 * 选择处理方式
	 */
	$(".order-sales-choose li").on("tap",function(){
		var index = $(this).index();
		var goodArry = [];
		var leIdArry = [];
		$("#mainContent li").each(function(){
			 var checkObj =	$(this).find("input[name='cart']");
			 var inputVal= $(this).find("input[name='cartname']")
			 if(checkObj.attr("data-choose") == "true"){
				 goodArry.push(checkObj.attr("data-goodId")+"_"+inputVal.val());
				 leIdArry.push(checkObj.attr("data-leId")+"_"+inputVal.val());
			 }
		});
		if(goodArry.length <= 0 || leIdArry.length <= 0){
			jems.mboxMsg("请选择要服务的商品!");
			return;
		}
		sessionStorage.goodArry = goodArry.toString();
		sessionStorage.leIdArry = leIdArry.toString();
		sessionStorage.sodId = sodId;
		sessionStorage.sodNo = sodNo;
		$("input[name='cartall']").prop("checked",false);
		if(index == 0){
		    jems.goUrl("order-resales-paygood.html");
		} else if(index == 1) {
		    jems.goUrl("order-resales-money.html");
		} else if(index == 2) {
			var msg = "您选择的是七天无理由退货，请务必在申请后的3天内（72小时内）填写您寄回商品的快递单号，若未填写则默认为您接受该商品，并不再享受七天无理由退货服务，订单将自动确认收货。如您评估无法在三天内寄回商品，请您暂缓申请，只要在“七天无理由退货”保障其内进行申请即可。";
				mBox.open({
					title: ['提示','text-align:center;font-size:14px;font-weight:bold '],
				    content: msg,
				    btnName: ['确认', '取消'],
				    maskClose: false, 
				    yesfun: function(){
				    	jems.goUrl("order-resales-reason.html"); 
				    }, nofun: function(){
				    }
				});
		} else {
            jems.goUrl("order-resales-refund.html");
		}
	});
	
	listData()// 加载数据
});

function listData() {
	var html = '';
	$.ajax({
			type : 'post',
			url : msonionUrl + "app/sodrest/findSodItemById/v1",
			asyn : false,
			data : {"Id":id},
			dataType : "json",
			success : function(result) {
				if (10000 == result.errCode) {
					var soditemrec  = result.data;
					soditemrec.forEach(function(v){
						var product = v.product;
						var allowQty = parseInt(v.qty) -  parseInt(v.rcQty);
						var sodRec = v.subOrder.sodRec;
						if(sodRec.sodIsGroup == 1){
                            isGroup = true;
						}
//						allowQty <= 0 ? 0 : allowQty;
						if(allowQty <= 0){
							allowQty = 0;
						} 
						html += '<li class="flexbox p10 je-align-center jepor jecell-bottom">';
						html += '<div class="flexbox je-align-center">';
						if(allowQty == 0){
							html += '<label><input data-allowQty="'+allowQty+'" data-leId='+product.id+' data-disabled="disabled" data-goodId='+v.id+' class="radio pr10 rdu" type="checkbox" name="cart" value=""></label>';
						} else {
							html += '<label><input data-allowQty="'+allowQty+'" data-leId='+product.id+' data-goodId='+v.id+' class="radio pr10 rdu" type="checkbox" name="cart" value=""></label>';
						}
						html += '</div>';
						html += '<div class="photo jepor  ml10">';
						html += '<img src="' + msPicPath + '' + product.mainPicUrl + '?x-oss-process=image/resize,w_200">';
						html += '</div>';
						html += '<div class="flexbox je-text-center je-orient-ver jeflex pl10">';
                        if(isGroup){
                            html += '<h3 class="f15"><span class="purple">【拼团】</span>'+sodRec.sodGroupRec.productGroup.name+'</h3>';
                        } else {
                            html += '<h3 class="f15">'+product.name+'</h3>';
                        }
						if(product.type == 1 && type === "0"){
							html += '<p><span class="g9 f14 mr15">'+v.sodItemLeSpec+'</span></p>';
						} 
						html += '<div class=" flexbox mt5">';
						if(isGroup){
                            html += '<span class=" f16 g9 show jeflex">拼团价:<i class="purple">¥'+ (sodRec.sodGroupRec.productGroup.groupPrice).toFixed(2)+'</i></span>';
						} else if(product.type == 1){
							html += '<span class="purple f16 show jeflex">¥'+ (v.price).toFixed(2)+'</span>';
						} else{
							html += '<span class=" f16 g9 show jeflex">海外直购:<i class="purple">¥'+ (v.price).toFixed(2)+'</i></span>';
						}
						html += '<div class="cartmas ml10">';
						html += '<span class="cartbox jepor jecell-topbot">';
						html += '<em class="cartmin g3 fl tc f18 dib">-</em>';
						html += '<input data-allowQty="'+allowQty+'" class="cartnum g3 fl tc f14 dib" name="cartname" value="'+allowQty+'" readonly />';
						html += '<em class="cartadd g3 fl tc f18 dib">+</em>';
						html += '</span>';
						html += '</div>';
						html += '</div>';
						html += '</div>';
						html += '</li>';
						
					})
					$("#mainContent ul").html(html);
					
					if(type === "0"){
						$("#noReasonMoney").show();
						$("#returngood").hide();
                        $("#retrurnMoney").hide();
					} else if(type === "1") {
						$("#noReason").show();
					}

					/**
					 * 单个选择
					 */
					$("#mainContent input[name='cart']").on('change',function(){
						if($(this).attr("data-disabled") != "disabled"){
							if ($(this).prop('checked')){
								$(this).attr("data-choose",true);
								if($("#mainContent input[name='cart'][data-choose='true']").length == soditemrec.length){
									$("input[name='cartall']").prop("checked",true);
								}
							} else {
								$(this).attr("data-choose",false);
								$("input[name='cartall']").prop("checked",false);
							}
						} else {
							jems.mboxMsg("亲,可退数量为0哦!");
							$(this).prop('checked',false);
							return;
						}
					});
					
					/**
					 * 加
					 */
					$(".cartadd").on("tap",function(){
						var inputVal = $(this).prev();
						var allowQty =inputVal.attr("data-allowQty");
						if(allowQty <= inputVal.val()){
							jems.mboxMsg("不能超过可退数量!");
							return;
						} else{
							inputVal.val(parseInt(inputVal.val())+1);
						}
					});
					
					/**
					 * 减
					 */
					$(".cartmin").on("tap",function(){
						var inputVal = $(this).next();
						var val = parseInt(inputVal.val());
						if(val > 1){
							inputVal.val(val - 1);
						}
					});
				} else if(result.errCode == 4002){
	                jems.goUrl("../login.html?" + window.location.href);
				} else {
					 jems.mboxMsg(result.errMsg);
			         return;
				}
			}});
}
