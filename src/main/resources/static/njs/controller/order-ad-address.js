/**
 * 订单地址修改
 */
var params = jems.parsURL().params,sodId,sodAddressId;
/** 特殊字符限制 **/
var reg = /^[A-Za-z\u4E00-\u9FA5]+\·?[A-Za-z\u4E00-\u9FA5]*$/;
/** 身份证校验 **/
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
/** 中文限制 **/
var isChinese = /[\u4e00-\u9fa5]/;
$(function () {
	sodId = params.sodId;
	sodAddressId = params.sodAddressId;
	if(undefined == sodId || null == sodId || '' == sodId || undefined == sodAddressId || null == sodAddressId || '' == sodAddressId ){
		mBox.open({
			content:"非法参数!",
			closeBtn: [false],
			btnName:['确定'],
			btnStyle:["color: #0e90d2;"],
			maskClose:false,
			yesfun : function(){
				jems.goUrl('order-logistics1.html?sodStat=2');
			}
		})
	}
	$("#addSodId").val(sodAddressId);
	/** 获取地址信息 **/
	findAreaByLay("p");
	
	 mBox.open({
	        title: ['温馨提示', 'color:#8016AD;font-size:1.4rem;text-align: center;'],
	        width: "90%",
	       /* height: "50%",*/
	        content: mBox.cell("#impnotice"),
	        closeBtn: [false, 1],
	        btnName: ['确定'],
	        btnStyle: ["color: #0e90d2;"],
	        maskClose: true
	 });
}); 
 
/**
 * 修改收货地址
 */
function updateSodAdd(){
	/** 参数校验 * */
	if(!checkSodAddParams()){
		return;
	}
	/** 取form数据 **/
    var datas = $("#sodAddressForm").serialized(); 
    console.log(datas)
    var url = msonionUrl+"app/address/updateSodAdd/v1";
    $.ajax({
        type:"post",
        url:url,
        data:datas,
        dataType:"json",
        success:function(result){
        	if(10000 == result.errCode){
        		mBox.open({
                    content: "<div class='jew100 tc'>修改成功</div>",
                    btnName: ['确定'],
                    btnStyle: ["color: #0e90d2;"],
                    maskClose: false,
                    yesfun: function () {
                    	jems.goUrl('order-details1.html?sodId='+ sodId);
                    }
                });
                return;
        	}else{
        		jems.mboxMsg(result.errMsg);
        		return;
        	}
        }
    });
}

/**
 * 检测订单地址参数
 * @returns {Boolean}
 */
function checkSodAddParams(){
	var addSodId = $("#addSodId").val();
	if(null == addSodId || '' == addSodId || undefined == addSodId){
		jems.mboxMsg("非法参数，请重试");
        return false;
	}
	
	/** 用户身份证号码 **/
	var memberCid = $("#sodAddressUserCid").val();
	if(null == memberCid || '' == memberCid || undefined == memberCid){
		jems.mboxMsg("请输入收货人身份证号");
        return false;
	}
	if(!CIDreg.test(memberCid)){
		jems.mboxMsg("请填写正确的身份证号码");
        return false;
	}
	if(isChinese.test(memberCid)){
		jems.mboxMsg("此处应填身份证号码");
		$("#memberCid").focus();
        return false;
	}
	/** 用户姓名 **/
	var memberName = $("#sodAddressUser").val();
	if(null == memberName || '' == memberName || undefined == memberName){
		jems.mboxMsg("请输入与身份证一致的姓名（海关要求）");
        return false;
	}
	if(memberName.length > 20){
		jems.mboxMsg("姓名应为0~20个字符!");
        return false;
	}
	if(!reg.test(memberName)){
		jems.mboxMsg("请填写正确的姓名!");
        return false;
	}
	/** 用户联系方式 **/
	var memberPhone = $("#sodAddressTel").val();
	if(null == memberPhone || '' == memberPhone || undefined == memberPhone){
		jems.mboxMsg("请输入收货人电话");
        return false;
	}
	if(memberPhone.length != 11){
		jems.mboxMsg("手机号码长度应为11位");
        return false;
	}
	/** 省区id **/
	var proId = $("#sodPareaId").val();
	if(null == proId || '' == proId || undefined == proId || 0 == proId){
		jems.mboxMsg("请选择省区");
        return false;
	}
	/** 市区id **/
	var cid = $("#sodCareaId").val();
	if(null == cid || '' == cid || undefined == cid || 0 == cid){
		jems.mboxMsg("请选择市区");
        return false;
	}
	/** 区县id **/
	var areaId = $("#sodRareaId").val();
	if(null == areaId || '' == areaId || undefined == areaId || 0 == areaId){
		jems.mboxMsg("请选择区县");
        return false;
	}
	var detailedAdd = $("#sodAddressNo").val();
	if(null == detailedAdd || '' == detailedAdd || undefined == detailedAdd){
		jems.mboxMsg("请输入详细地址");
        return false;
	}
	return true;
}

/**
 * 获取地区
 */
function findPareaData(){
    $.ajax({
        type : "post",
        data : {"areaParentId":0,"type":'c'},
        url : msonionUrl+"address/findAreaForEdit?_"+new Date().getTime(),
        dataType : "text",
        asyn:false,
        success:function(data){
            $("#"+targetId).append(data);
        }
    });
}

/**
 * 获取地区信息
 * @param i 
 */
function findAreaByLay(i){
	var addressProvince = $("#sodPareaId").val();
    if(i == "p"){
        areaParentId = 0;
    } else if (i == "c") { 
    	 addressProvince = $("#sodPareaId").val();
    	$("#sodCareaId").empty().append("<option value='0'>-请选择 城市-</option>");
    	 $("#sodRareaId").empty().append("<option value='0'>-请选择  区县-</option>")
        if (addressProvince == 0  ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
            jems.mboxMsg("先选择省份");
            return ;
        }else{
            areaParentId = addressProvince ;
        }
    } else {//县域
        var addresscity = $("#sodCareaId").val();  
      /*  if (addresscity == 0 || addresscity  == 0 ){
    		$("#sodRareaId").empty().append("<option value='0'>-请选择 城市-</option>");
    	}*/
        if (addressProvince == 0  ||addressProvince == null || addressProvince == "" || typeof(addressProvince) == undefined){
            jems.mboxMsg("先选择省份");
            return ;
        }else if (addresscity == 0 ||addresscity == null || addresscity == "" || typeof(addresscity) == undefined){
            jems.mboxMsg("先选择城市");
            return ;
        }else{
            areaParentId = addresscity ;
        }
    }
    $.ajax({
        type : "post",
        data : {"areaParentId":areaParentId,"type":i},
        url : msonionUrl+"address/findAreaByLay",
        dataType : "text",
        asyn:false,
        success:function(data){
            if(i  == "c"){
                $("#sodCareaId").empty().append("<option value='0'>-请选择 城市-</option>").append(data);
            }else if(i == "r"){
                $("#sodRareaId").empty().append("<option value='0'>-请选择  区县-</option>").append(data);
            }else{
                $("#sodPareaId").append(data);
            }

        },
        error:function(data){
            jems.mboxMsg("network error!"); 
        }
    });
}