/**
 * 我要取现
 * 2016-08-03
 */
var ParHref = jems.parsURL( window.location.href );
var isfee = ParHref.params.isfee;
var cashUserCid,cashAccountNo;
$(function(){
    // 加载省份列表
    getArea(0,'province');

    // 加载城市列表
    $("#province").change(function(){
        var val = $(this).val();
        $("#city").empty().append("<option value='0'>请选择账号所属市县</option>");
        if(val != 0 && val != '') getArea(val,'city');
    });

    //loadCashType();
    lastRecord();
    getStoreIncomeData();
    confirm();
}); 
//获取可提现金额

function getStoreIncomeData(){
    // 加入班费/奖金提现模块
    if(isfee){
        // 待提现的金额
        var fee = sessionStorage.cashfee;
        // 如果是活动奖金，则些属性有值
        var activIds = sessionStorage.activIds;
        // 今日可取现
        $("#withdraw").text(fee||0);
        $("#cashApplyAmt").val(fee||0);
        activIds&&$("#activIds").val(activIds);
        return;
    }
    // 收入提现模块
    $.ajax({
        type : "get",
        url : msonionUrl+"income/cashable?t="+new Date().getTime(),
        dataType : "json",
        success:function(data){
            if(data == -1){
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
            }else{
                // 今日可取现
                $("#withdraw").text(data||0);
                $("#cashApplyAmt").val(data||0);
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
}

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
 * 提交表单数据
 */
function submitForm(){
	var regNum = /^\d{14,30}$/;
    var regCarNo = /^[0-9]*$/;
    //校验银行卡号
    var bankCartNo = $("#cashAccountNo").val();
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
    $("#cashAccountNo").val(bankCartNo)
    // 取form数据
    var datas = $("#cashData").serialize();
    datas = isfee?datas+"&cashType="+isfee:datas+"&cashType=0";
    console.log(datas)
    var url = msonionUrl+"cash/save";
    $.ajax({
        type:"post",
        url:url,
        data:datas,
        dataType:"json",
        success:function(msg){
            if(msg.state == -1){
                // 未登录
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
            }else if(msg.state>0){
                // 保存成功，清空表单
                $("#inputs input").val('');
                //dialogMsg("您的提现申请成功，出纳妹纸将在2-3个工作日内处理您的提现。");
                mBox.open({
                    width:"90%",
                    height:"25%",
                    content:"<p class='tc mt10 mb10 listinfo f16' style='width:100%'>您的提现申请成功，出纳妹纸将在5-7个工作日内处理您的提现。</p>",
                    closeBtn: [false,1],
                    btnName:['确定','修改'],
                    btnStyle:["color: #0e90d2;"],
                    maskClose:false,
                    yesfun:function(){
                        jems.goUrl('withdrawal-detail.html');
                    }
                });
            }else if(msg.state==-2){
                // 保存成功，清空表单
                //$("#inputs input").val('');
                jems.mboxMsg("您有一笔提现正在处理中，请耐心等待。");
            }else{
                jems.mboxMsg("无效的提现金额。");
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
    var cashAccountType = $("#cashAccountType").val();
    var cashBrank = $("#cashBrank").val();
    var province = $("#province").val();
    var city = $("#city").val();
    var subBank = $("#subBank").val();
    var cashAccountNo = $("#cashAccountNo").val();
    var cashAccountName = $("#cashAccountName").val();
    var cid = $("#cid").val(), msg = '';

    if(!isfee && cashApplyAmt<200){
        jems.tipMsg("申请提限金额不能小于200");
        return false;
    }
    if(cashAccountType == 1 ){
        if($.trim(cashBrank) == '' || cashBrank==0){
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

    if(!subBank || !cnReg.test(subBank)){
        jems.tipMsg("请输入正确的开户支行!");
        return false;
    }

    var accountTypeName = cashAccountType==1?'银行':'支付宝';
    if($.trim(cashAccountNo) == ''){
        jems.tipMsg("请填写"+accountTypeName+"帐号!");
        return false;
    }
    if(cashAccountNo != null || cashAccountNo != "" || typeof(cashAccountNo) != undefined){
    	cashAccountNo = cashAccountNo.replace(/\s/g, "");
    }
    if(cashAccountNo.length > 30){
    	 jems.tipMsg("银行卡号长度不正确");
         return false;
    }
    if(cashAccountNo.length < 14){
    	jems.tipMsg("银行卡号长度不正确");
    	return false;
    }
//    if(!regNum.test(cashAccountNo)){
//        jems.tipMsg("请填写正确的银行卡号!");
//        return false;
//    }
    if(!regCarNo.test(cashAccountNo)){
    	jems.tipMsg("请填写正确的银行卡号!");
    	return false;
    }
    if($.trim(cashAccountName) == ''){
        jems.tipMsg("请填写帐户名!");
        return false;
    }

    //var reg = /^\d*$/;
    if(!reg.test(cashAccountName)){
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
    var banknamemsg = "<span>开户银行："+cashBrank+"</span><br/>";
    var subbankmsg = "<span>开户支行："+subBank+"</span><br/>";
    var accountnomsg = "<span>"+accountTypeName+"帐号："+cashAccountNo+"</span><br/>";
    var accountnamemsg = "<span>帐户名称："+cashAccountName+"</span><br/>";
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

/**
 * 缓存已填的数据
 * @deprecated
 */
function localCache(){
    var dataVal = $('#accountype').find('li[class="on"]').data('type');
    // 缓存选择的帐户类型
    localStorage.setItem('accountype',dataVal);
    localStorage.setItem('cashBrank',$('#cashBrank').val());
    localStorage.setItem('cashAccountNo',$('#cashAccountNo').val());
    localStorage.setItem('cashAccountName',$('#cashAccountName').val());
    localStorage.setItem('cid',$('#cid').val());
}


function loadCashType(data){
    /*var type= data==null?1:data.cashType;
     type = type || 1;
     $("#cashAccountType").val(type);*/
    //if(type==1){
    $('#accountype').find('li').eq(0).addClass("on").siblings("li").removeClass("on");
    // 禁用支付宝表单
    $("#cashBrankLi").show();
    //$("#cashAccountNo").attr("placeholder","请输入银行卡号");

    // 取最后一次开户银行名称
    $("#cashBrank").val((data&&data.bankName)||0);
    // 支行名称
    $("#subBank").val((data&&data.subBank)||'');

    // 如果该用户已开过店，则在页面回显开店数据
    data.province && getArea(data.province,'city',data.city);
    // 处理地区级联
    data.province && $("#province").val(data.province);
    //}
    /*else{
     $('#accountype').find('li').eq(1).addClass("on").siblings("li").removeClass("on");
     // 禁用银行表单
     $("#cashBrankLi").hide();
     $("#cashAccountNo").attr("placeholder","请输入支付宝账号");
     }*/

    // 取最后一次帐号与帐户名
    $("#cashAccountNo").val(data&&data.accountNo);
    $("#cashAccountName").val(data&&data.accountName);
    $("#cid").val(data&&data.cid == undefined ?"":data.cid);
    cashAccountNo = data&&data.accountNo;
    cashUserCid = data&&data.cid == undefined ?"":data.cid;
}

/**
 * 获取最近一次提现记录
 */
function lastRecord(){
    var url = msonionUrl+"cash/lastrecord";
    $.ajax({
        url:url,
        type:"post",
        dataType:"json",
        success:function(result){
            if(result == -1){
                // 未登录
                jems.goUrl(jems.mspath+"login.html?"+window.location.href);
            }else{
                loadCashType(result);
            }
        }
    });
}

function showDialog(msg){
    var lim = mBox.open({
        width:"90%",
        height:"40%",
        title:"确认您的提现账号",
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
	if(cashAccountNo == that.value){
		that.value = "";
	}
}
