/** 
@Js-name:upgrade-merchants.js
@Zh-name:升级为商家
 */
var moblieReg =/^((\(\d{3}\))|(\d{3}\-))?1\d{10}$/;
var name = "", dataMsg = "",memberPhone,memberCarId;
$(function(){
	tmn = jems.parsURL(window.location.href).params.tmn;
	// 加载省份列表
	getArea(0,'province');
	
	// 加载城市列表
	$("#province").change(function(){
		var val = $(this).val();
		$("#city").empty().append("<option value=''>请选择城市</option>");
		$("#county").empty().append("<option value=''>请选择区县</option>");
		if(val != 0 && val != '')
			getArea(val,'city');
	});
	
	// 加载区县列表
	$("#city").change(function(){
		var val = $(this).val();
		$("#county").empty().append("<option value=''>请选择区县</option>");
		if(val != 0 && val != '')
			getArea(val,'county');
	});
	//校验是否绑定手机
	levelVip();
	// 店铺类型选择
	storeTypeChange();
	// 查询是否已开过店
	getStoreInfo();
	// 提交请求
	$("#confirmBtn").on('tap',confirmBtn);
	$("#pay").on('tap',pay);
	// 面板切换
	//changetab();
});

/**
 *付款页面 
 */
function pay(){
	var code=$("#fromCode2").val();
	var developerId=$("#storeFromAgentId").val();
	$.ajax({
		type:"get",
		url:msonionUrl+"agentStoreOrder/getBatchRoad",
		dataType:"json",
		success:function(result){
			var data = result.data
			if(data == true){
				jems.goUrl(mspaths+"payment-select-detail.html")
			}else if(data == false){
				jems.goUrl(mspaths+"payment-select.html");
			}else{
				jems.tipMsg("网络异常，请稍后再试");
			}
		}
	})
}

/*查询省份*/
function getArea(pid,ele,seleval){
	$.ajax({
		type:'get',
		url: msonionUrl+"store/area/v2",
		data:"pid="+pid+"&type="+getType(ele),
		dataType:'json',
		success:function(json){
			var gettpl = $('#areaData').html(), data = {data:json};
			jetpl(gettpl).render(data,function(html){
				$('#'+ele).append(html);
			});
		},
		complete:function(){
			seleval&&$('#'+ele).val(seleval);
		}
	});
}
function getType(ele){
	var type="";
	if("province" == ele){
		type="p";
	}else if("city" == ele){
		type="c";
	}else if("county" == ele){
		type="r";
	}
	return type;
}
/*检测是否开店*/
function getStoreInfo(){
	$.ajax({
		type:'get',
		url: msonionUrl+"store/info?t="+new Date().getTime(),
		dataType:'json',
		success:function(result){
			if(result.state == -1){
				jems.goUrl(mspaths+"login.html");
			}
			if(result){
				if(result.state != 0){
					// 如果该用户已开过店，则隐藏提交按钮
					//$("#confirmBtn").hide();
					// 如果该用户已开过店，则在页面回显开店数据
					getArea(result.province.areaId,'city',result.city.areaId);
					getArea(result.city.areaId,'county',result.county.areaId);
					// 处理地区级联
					result.province && $("#province").val(result.province.areaId);
					// 判断申请类别是否是经纪人，以控制部分表单的显示与隐藏
					if(result.storeType==3&&result.storeIsBroker==1){
						document.getElementById("part1").style.display="block";
					}else if(result.storeType==2&&result.storeIsBroker==1){
						document.getElementById("part2").style.display="block";
					}
					// 表单填值
					renderVal(result);
					memberPhone = result.storeContactPhone;
					memberCarId = result.storeIdcardNo;
				}if(result.storeFlg == 5 && result.storeType == 2){
					init();
					document.getElementById("submit").style.display="none";
					document.getElementById("goPay").style.display="block";
				}else if(result.storeFlg == 5 && result.storeType == 3){
					init();
				}
			}
		}
	});
}


/**
 * 禁用所有表单控件
 */
function init(){  
    var form = document.forms[0];   
     for ( var i = 0; i < form.length; i++) {   
     var element = form.elements[i];  
       element.disabled = "true";   
     }   
 }  
/**
 * 表单填值,表单name要与json数据中的Key一致
 * @param jsonData json数据
 */
function renderVal(jsonData){
	$('input,select,textarea').each(function(i,ele){
		var name = ele.name;
		var val = jsonData[name];
		var stbroker = jsonData.storeIsBroker
		// 处理店铺类型的数据回显，因为经纪人与加盟商的value是一样的，所以要从json数据的storeIsBroker进行判断1为经纪人，0为其它
		if(name=='storeType'){
			if(val == 3 && stbroker==1 ){
				$(this).find('option').eq(3).prop('selected','selected');
			}else if(val == 3 && stbroker==0 ){
				$(this).find('option').eq(2).prop('selected','selected');
			}else{
				val && $(this).val(val);
			}
		}else{
			val && $(this).val(val);
		}
	});
}

/*提交请求数据*/
function confirmBtn(){
	try{
        if($('#storeFlg').val() && $('#storeFlg').val()!=2){
            jems.mboxMsg("您的"+$('#storeType option:selected').text()+"申请正在审核中,请稍后……");
            return false;
        }
		// 较验
		if(checkvalue()){
			formDataSuc();
		}else{
			return false;
		}
	}catch(e){
		alert('catch'+e.message);
	}
}
function formDataSuc() {
    // 获取表单数据
	checkPart();
	var formData = $("#formData").serialized();
   var loginReg = /^40/;
    $.ajax({
        type:'post',
        url:msonionUrl+"store/add?t="+new Date().getTime(),
        data:formData+"&storeNo="+jems.parsURL( window.location.href ).params.tmn,
        dataType:'json',
        async:false,
        success:function(result){
            if(result.errCode == 10000){
	        	  mBox.open({
	                width:"70%",
	                content:"<p class='tc listinfo f16 pt15 pb15' style='width:100%'>您的申请已提交，请耐心等候审核。如有疑问可直接联系您的小伙伴或者招商顾问咨询。</p>",
	                closeBtn: [false],
	                btnName:['确定'],
	                btnStyle:["color: #0e90d2;"],
	                maskClose:false,
	                yesfun :function(){
	                    jems.goUrl(mspaths+"ucenter/members.html")
	                }
	            });
            } else if (loginReg.test(result.errCode)){
        		jems.goUrl("../login.html?"+window.location.href);
        		return; 
            }else {
            	jems.tipMsg(result.errMsg);
//            	setTimeout(load, 4000)
            	return; 
            }
            // 提交失败
        },
        error:function(msg,as){
            //UsTips("network error!");
        }
    });
}

function load(){
	location.reload(false)
}	


/**
 *根条件删除元素 
 */
function checkPart() {
	var attr=$("#part1").is(":hidden");
	var attr1=$("#part2").is(":hidden");
	if(attr){
		$("#fromCode1").val("");
		$("#storeIdcardNo1").val("");
		return 1;
	}else if(attr1){
		$("#storeFromAgentId").val("");
		$("#fromCode2").val("");
		$("#storeIdcardNo2").val("");
		return 2;
	}
}

function checkInt() {
	var attr=$("#part1").is(":hidden");
	var attr1=$("#part2").is(":hidden");
	if(attr){
		return 2;
	}else if(attr1){
		return 1;
	}
}
/**
 * 收款帐户选择时的事件
 * @deprecated
 */
function changetab(){
	$("#tabul").find("li").click(function(){
		// 表单存储的收款类型
		var cashType =  $("#storeCashType").val();
		// 选择的收款类型
		var selectType = $(this).data('type');
		// 切换时置空之前所填内容
		if(cashType != selectType)
			$("#useAccount").find("input").val('');
		// 选择的支付类型
		$("#storeCashType").val(selectType);
		
		$(this).addClass('on').siblings('li').removeClass('on');
		// 1为支付宝 2为银行卡
		toggleLi(selectType);
		/*(selectType==1 && $('#useAccount').find('ul').eq(1).show().siblings('ul').hide()) || 
		(selectType==2 && $('#useAccount').find('ul').eq(0).show().siblings('ul').hide());*/
	});
}

/**
 * 切换帐户时的样式
 * @deprecated
 */
function toggleLi(accountType){
	// 1为支付宝 2为银行卡
	if(accountType==1){
		$('#bankli').hide();
		$('#noli').find('span').eq(0).text('支付宝号：');
		$('#noli').find('input').attr('placeholder','请输入支付宝账号');
	}else if(accountType==2){
		$('#bankli').show();
		$('#noli').find('span').eq(0).text('银行卡号：');
		$('#noli').find('input').attr('placeholder','请输入银行卡号');			
	}
}

/*店铺类型选择时的事件*/
function storeTypeChange(){
	$("#storeType").change(function(){
		// 判断选择的下标
		var selIndex = $(this).get(0).selectedIndex;
		if(selIndex == 2){
			document.getElementById("part1").style.display="none";
			document.getElementById("part2").style.display="none";
		}else if(selIndex == 3){
			document.getElementById("part1").style.display="block";
			document.getElementById("part2").style.display="none";
		}else if(selIndex == 1){
			document.getElementById("part1").style.display="none";
			document.getElementById("part2").style.display="block";
		}
				// 标识是经济人还是加盟店
		selIndex == 2 ?$('#storeIsBroker').val(0):$('#storeIsBroker').val(1);
	});
}

/*表单较验*/
function checkvalue(fun){
	var flag = false;
	var storeContact = $("#storeContact").val();
	var storeContactPhone = $("#storeContactPhone").val();
	var storeType = $("#storeType").val();
	var province = $("#province").val();
	var city = $("#city").val();
	var county = $("#county").val();
	var isBroker = $('#storeIsBroker').val();
	var agentId = $("#storeFromAgentId").val();
	if ($("#storeContact").is(":visible") && (storeContact == "" || storeContact  == null)) {
		jems.tipMsg("商家姓名不为空");
		return false;
	}
	
	if (storeContactPhone == "" || storeContactPhone  == null) {
		jems.tipMsg("商家手机不为空");
		return false;
	} else if (!moblieReg.test(storeContactPhone)) {
		jems.tipMsg("请输入正确的手机号码.");
		return false;
	}
	if (storeType == "" || storeType  == null || storeType == undefined) {
		jems.tipMsg("请选择申请类别");
		return false;
	}
	if (province == "" || province  == null || province == undefined) {
		jems.tipMsg("请选择省份");
	}
	if (city == "" || city  == null || city == undefined) {
		jems.tipMsg("请选择城市");
		return false;
	}
	if (county == "" || county  == null || county == undefined) {
		jems.tipMsg("请选择区县");
		return false;
	}
	if (storeType == 3 || storeType == 2) {
		if($('#storeName').is(':visible')){
			if($('#storeName').val()!=''){
				var len = stringToBytesLength($('#storeName').val());
				if(len>8){
					jems.tipMsg("店铺名称长度不能超过4个字");
					return false;
				}
			}else{
				jems.tipMsg("店铺名称不能为空");
				return false;
			}
		}
		
//		if($("#storeIdcardNo").is(':visible')){
			if($("input[name='storeIdcardNo']").is(':visible')){
				var storeIdcardNo
				var check=checkInt();
				if(check == 1){
					storeIdcardNo = $("#storeIdcardNo1").val();
				}else if(check == 2){
					storeIdcardNo = $("#storeIdcardNo2").val();
				}
//			var storeIdcardNo = $("#storeIdcardNo").val();
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (storeIdcardNo == "" || storeIdcardNo  == null || storeIdcardNo == undefined) {
				jems.tipMsg("身份证号码不能为空");
				return false;
			}else if (!reg.test(storeIdcardNo)) {
				jems.tipMsg("请输入正确身份证号码.");
				return false;
			}
		}
		
		if(isBroker == 1){
			var code
			var check=checkInt();
			if(check == 1){
				 code = $("#fromCode1").val();
			}else if(check == 2){
				 code = $("#fromCode2").val();
				 if(agentId != "" && agentId  != null && agentId != undefined){
					 if(code == "" || code  == null || code == undefined){
						 jems.tipMsg("请输入服务商邀请码");
						 return false;
					 }
				 }
			}
			if(code != "" && code  != null && code != undefined){
				code = code.replace(/(^\s*)|(\s*$)/g, "");
//				$("#fromCode").val(code);
				$("input[name='fromCode']").val(code);
				var right = validateCodeReturn(code);
				if(right){
					if(check == 2){
						if(agentId == "" || agentId  == null || agentId == undefined){
							jems.tipMsg("请输入服务商ID");
							return false;
						}
					}
                    mBox.open({
                        width:"80%",
                        content:"<p class='tc f16' style='width:100%'>请问您的小伙伴是（"+name+"）吗？如果是请点确定，反之请点取消重新输入邀请码</p>",
                        closeBtn: [false],
                        btnName:['确定','取消'],
                        btnStyle:["color: #0e90d2;"],
                        maskClose:false,
                        yesfun : function(){
                            formDataSuc();
                            return true;
                        }
                    });
                    return;
				}else{
					return right;
				}
			}
		}
	}
	return true;
}

/**
 * 校验邀请码是否有效
 * @param code
 */
function validateCode(code){
	var ret = false;
	$.ajax({
		type:'get',
		url: msonionUrl+"agentStore/validateCode",
		data:{"code":code},
		dataType:'json',
		async:false,
		success:function(data){
			if(data.code == '0'){
				jems.tipMsg(data.msg);
				ret = false;
			}else{
				ret = true;
			}
		}
	});
	return ret;
}
/**
 * 校验邀请码是否有效并返回信息
 * @param code
 */
function validateCodeReturn(code){
	var ret = false;
	$.ajax({
		type:'get',
		url: msonionUrl+"agentStore/validateCodeReturn",
		data:{"code":code},
		dataType:'json',
		async:false,
		success:function(data){
			if(data.code == '0'){
                //dataMsg = data.msg
				jems.tipMsg(data.msg);
				ret = false;
			}else{
				name = data.msg;
				ret = true;
			}
		}
	});
	return ret;
}

/*字符串转字节 */
function stringToBytesLength(s){
	var ch,st,re=[];
	for(var i = 0 ; i < s.length; i++){
		ch = s.charCodeAt(i);
		st=[];
		do{
			st.push(ch & 0xFF);
			ch = ch >> 8;
		}
		while(ch);
		re = re.concat(st.reverse());
	}
	return re.length;
}
//敏感数据点击置空-cid
function valOfUserCid(that){
	if(memberCarId == that.value){
		that.value = "";
	}
}
//敏感数据点击置空-cid
function valOfPhone(that){
	if(memberPhone == that.value){
		that.value = "";
	}
}

/**
 * 校验是否绑定手机
 */
function levelVip() {
	$.ajax({
		type : "get",
		url : msonionUrl + "/register/validateMemberCode",
		dataType : "json",
		async:false,
		success : function(data) {
			if (data.errCode == "10000") {
				if (data.isBining == true) {
					return;
				} else {
					mBox.open({
						width : "80%",
						content : "<p class='tc f16' style='width:100%'>为了您的账号安全,需要绑定手机号才可申请成为店主/服务商</p>",
						closeBtn : [ false ],
						btnName : [ '去绑定' ],
						btnStyle : [ "color: #0e90d2;" ],
						maskClose : false,
						yesfun : function() {
							updatePhone();
						}
					})
				}
			} else {
				jems.tipMsg("网络错误");
			}
		}
	})
}
//绑定手机号
function updatePhone(){
	$.ajax({
		type:"get",
		url:msonionUrl+"menbercenter/getPresentMember?&="+new Date(),
		dataType:"json",
		async:false,
		success:function(data){	
			mid = data.memberRec.memberId;
			if (mid == null || mid == "" || typeof(mid) == undefined){
				jems.tipMsg("网络连接失败，请刷新");
				return ;
			}
			jems.goUrl("personalinfo_update.html?tmn="+tmn+"&mid="+mid);
		}
	});
}
