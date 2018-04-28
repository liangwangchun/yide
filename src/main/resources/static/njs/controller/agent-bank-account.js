/**
 * 代理商银行账户
 * 2017-12-14
 */
var ParHref = jems.parsURL( window.location.href );
var isfee = ParHref.params.isfee;
var cashUserCid,cardNo;
$(function(){
	getArea(0,'province');
    // 加载城市列表
    $("#province").change(function(){
        var val = $(this).val();
        $("#city").empty().append("<option value='0'>请选择账号所属市县</option>");
        if(val != 0 && val != '') getArea(val,'city');
    });
    confirm();
    lastRecord();
}); 
var ajaxflag = true;
function confirm(){
	
    $("#confirm").click(function(){
        // 控制重复提交
        if(!ajaxflag)return;
        ajaxflag = false;

        if(!checkInput()){
            ajaxflag = true;
            return false;
        }else{
            ajaxflag = true;
        }

    });
}

/**
 * 用户上一次账户信息
 */
function lastRecord(){
    var url = msonionUrl+"cash/queryBankAccount";
    $.ajax({
        url:url,
        type:"post",
        dataType:"json",
        success:function(result){
             if(result.errCode == 4001){
                // 未登录
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
            }else{
                loadCashType(result.data);
            }
        }
    });
}

function loadCashType(data){
    // 取最后一次开户银行名称
    $("#bank").val((data&&data.bank)||0);
    // 支行名称
    $("#bankBranch").val((data&&data.bankBranch)||'');
    // 如果该用户已开过店，则在页面回显开店数据
    data.provinceId && getArea(data.provinceId,'city',data.cityId);
    // 处理地区级联
    data.provinceId && $("#province").val(data.provinceId);
    //getArea(data.provinceId,'province');
    // 取最后一次帐号与帐户名
    $("#cardNo").val(data&&data.cardNo);
    $("#name").val(data&&data.name);
    $("#cid").val(data&&data.cid == undefined ?"":data.cid);
    cardNo = data&&data.cardNo;
    cashUserCid = data&&data.cid == undefined ?"":data.cid;
}

/**
 * 提交表单数据
 */
function submitForm(){
	var regNum = /^\d{14,30}$/;
    var regCarNo = /^[0-9]*$/;
    //校验银行卡号
    var bankCartNo = $("#cardNo").val();
    if(bankCartNo != null || bankCartNo != "" || typeof(bankCartNo) != undefined){
    	bankCartNo = bankCartNo.replace(/\s/g, "");
    }
    if(bankCartNo.length > 30){
    	 jems.tipMsg("银行卡号长度不正确");
         return;
    }
    if(bankCartNo.length < 14){
    	jems.tipMsg("银行卡号长度不正确");
    	return;
    }
    if(!regNum.test(bankCartNo)){
        jems.tipMsg("请填写正确的银行卡号!");
        return;
    }
    if(!regCarNo.test(bankCartNo)){
    	jems.tipMsg("请填写正确的银行卡号!");
    	return;
    }
    $("#cardNo").val(bankCartNo)
    // 取form数据
    var datas = $("#cashData").serialize();
    datas = isfee?datas+"&cashType="+isfee:datas+"&cashType=0";
    var url = msonionUrl+"cash/saveaccount";
    $.ajax({
        type:"post",
        url:url,
        data:datas,
        dataType:"json",
        success:function(data){
            if(data.errCode == 4001){
                // 未登录
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
            }else if(data.errCode==10000){
                jems.goUrl('agents-commerce.html');
            }else{
                jems.tipMsg("无权限操作!");
                return false;
            }
            return true;
        }
    });
}
var CIDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
var isChinese = /[\u4e00-\u9fa5]/;
function checkInput(){
    var reg = /^[A-Za-z\u4E00-\u9FA5]+\·?[A-Za-z\u4E00-\u9FA5]*$/;
    var cnReg=/^[\u4e00-\u9fa5]{4,20}$/;	// 验证开户支行
    var regNum = /^\d{14,30}$/;
    var regCarNo = /^[0-9]*$/;
    var cashApplyAmt = $("#cashApplyAmt").val();
    var cashAccountType = 1;
    var bank = $("#bank").val();
    var province = $("#province").val();
    var city = $("#city").val();
    var bankBranch = $("#bankBranch").val();
    var cardNo = $("#cardNo").val();
    var name = $("#name").val();
    var cid = $("#cid").val(), msg = '';

    if(cashAccountType == 1 ){
        if($.trim(bank) == '' || bank==0){
            jems.tipMsg("请选择开户行!");
            return false;
        }
    }

    if(province == '' || province==0){
        jems.tipMsg("请选择收款账号所属省份!");
        return false;
    }

    if(city == '' || city==0){
        jems.tipMsg("请选择收款账号所属市县!");
        return false;
    }

    if(!bankBranch || !cnReg.test(bankBranch)){
        jems.tipMsg("请输入正确的开户支行!");
        return false;
    }

    var accountTypeName = cashAccountType==1?'银行':'支付宝';
    if($.trim(cardNo) == ''){
        jems.tipMsg("请填写"+accountTypeName+"帐号!");
        return false;
    }
    if(cardNo != null || cardNo != "" || typeof(cardNo) != undefined){
    	cardNo = cardNo.replace(/\s/g, "");
    }
    if(cardNo.length > 30){
    	 jems.tipMsg("银行卡号长度不正确");
         return false;
    }
    if(cardNo.length < 14){
    	jems.tipMsg("银行卡号长度不正确");
    	return false;
    }
    if(!regNum.test(cardNo)){
        jems.tipMsg("请填写正确的银行卡号!");
        return false;
    }
    if(!regCarNo.test(cardNo)){
    	jems.tipMsg("请填写正确的银行卡号!");
    	return false;
    }
    if($.trim(name) == ''){
        jems.tipMsg("请填写帐户名!");
        return false;
    }

    if(!reg.test(name)){
        jems.tipMsg("帐户名称不可以包含数字和符号哦!");
        return false;
    }
    if (cid == null || cid == "" || typeof(cid) == undefined){
        jems.tipMsg("身份证号码不能为空.");
        return ;
    } else if (!CIDreg.test(cid)) {
        jems.tipMsg("请输入正确的身份证号码.");
        return ;
    }else if (isChinese.test(cid)) {
        jems.tipMsg("别逗...此处应输入身份证号码!");
        $("#cid").focus();
        return false;
    }
    var banknamemsg = "<span>开户银行："+bank+"</span><br/>";
    var subbankmsg = "<span>开户支行："+bankBranch+"</span><br/>";
    var accountnomsg = "<span>"+accountTypeName+"帐号："+cardNo+"</span><br/>";
    var accountnamemsg = "<span>帐户名称："+name+"</span><br/>";
    var cid = "<span>身份证号码："+cid+"</span>";
    var msg = cashAccountType==1?(banknamemsg+subbankmsg+accountnomsg+accountnamemsg+cid):(accountnomsg+accountnamemsg);
    msg += '<br/><span style="color:red">若帐号错误将无法提现，请仔细核对！</span>'
    showDialog("<p class='listinfo f14' style='width:100%'>"+msg+"</p>");
    return true;
}

/**
 * 跳转地址加tmn
 * @param url
 */
function goUrlByParam(url){
    var ParHref = jems.parsURL( window.location.href );
    var tmn = ParHref.params.tmn;
    if(tmn){
        jems.goUrl(url+"?tmn="+tmn);
    }else{
        jems.goUrl(url);
    }
}

function showDialog(msg){
    var lim = mBox.open({
        width:"90%",
        height:"40%",
        title:"确认您的返款账号",
        content:msg,
        closeBtn: [false,1],
        btnName:['确定','修改'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun:function(){
            submitForm();
            mBox.close(lim);
        },
        nofun:null
    });
}

/*查询省份*/
function getArea(pid,ele,seleval){
    $.ajax({
        type:'get',
        url: msonionUrl+"store/area",
        data:"pid="+pid,
        dataType:'json',
        success:function(result){
            var redate = {data:result};
            var gettpl = $('#areaData').html();
            jetpl(gettpl).render(redate,function(html){
                $('#'+ele).append(html);
            });
        },
        complete:function(){
            seleval&&$('#'+ele).val(seleval);
        }
    });
}
function checkCID(cid){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var isChinese = /[\u4e00-\u9fa5]/;
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
//敏感数据点击置空-cid
function valOfUserCid(that){
	if(cashUserCid == that.value){
		that.value = "";
	}
}
//敏感数据点击置空-accountNo
function valOfCashAccountNo(that){
	if(cardNo == that.value){
		that.value = "";
	}
}
