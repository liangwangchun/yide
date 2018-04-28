/**
 * 收入管理
 * author:cjw
 * 2015-08-03
 */
var ParHref = jems.parsURL();
//今日代理收入
var agentDay = 0;
//累计代理收入
var agentSum = 0;
$(function(){
    getStoreCenterData();
    //返回店主中心 
    jems.backStore();
    
});

/**
 * ͳ统计商家中心数据
 */
function getStoreCenterData(){
    // 取可提现金额
    var Cashableurl = msonionUrl+"income/cashable";
    formatAjax(Cashableurl, 'get', getCashable);

    // 取冻结金额
    var FreeCashurl = msonionUrl+"income/freezecash";
    formatAjax(FreeCashurl, 'get', getFreeCash);

    // 取累计收入
    var SumIncomeurl = msonionUrl+"income/sumincome";
    formatAjax(SumIncomeurl, 'get', getSumIncome);

    // 取每日收入
    var DayIncomeurl = msonionUrl+"income/dayincome";
    formatAjax(DayIncomeurl, 'get', getDayIncome);

    // 取累计班费
    //var TeamFeeurl = msonionUrl+"income/sumfee";
    //formatAjax(TeamFeeurl, 'get', getTeamFee);

    // 取每日班费
    //var DayTeamFeeurl = msonionUrl+"income/dayfee";
    //formatAjax(DayTeamFeeurl, 'get', getDayTeamFee);
}

/**
 * 封装ajax请求
 * @param url
 * @param type
 * @param data
 * @param sucfun
 */
function formatAjax(url,type,sucfun){
    $.ajax({url:url,type:type,data:"_t="+new Date().getTime(),dataType:'json',success:sucfun});
}

/**
 * 获取可提现金额
 * @param result
 */
function getCashable(result){
    //console.info("可提现："+result);
    $("#withdraw").text(jems.formatNum(result || 0));
    if(result == -1)
        jems.goUrl(mspaths+"login.html?"+window.location.href);return;

}

/**
 * 获取冻结金额
 * @param result
 */
function getFreeCash(result){
    //console.info("冻结金额："+result);
    $("#freezeCash").text(jems.formatNum( result || 0));
}

/**
 * 获取累计收入
 * @param result
 */
function getSumIncome(result){
    //console.info("累计收入："+result);
    // 累计
//    $("#sumTotal").text(jems.formatNum((result&&result.sum_income) || 0));
    // 销售
//    $("#sumTerminal").text(jems.formatNum((result&&result.sum_income_zd) || 0));
    if(result.memberType!=2){// 如果是店主，则显示下面数据
    	// 零售
    	$("#sumSale").text(jems.formatNum((result&&result.sum_income_ls) || 0));
    	// 改版：累计零售收入=累计销售收入+累计拓客收入
    	$("#sumRetail").text(jems.formatNum((result&&result.sum_income_zd+result.sum_income_zc) || 0));
        $('#retail').show();
    	//旧版：注册
//        $("#sumRegister").text(jems.formatNum((result&&result.sum_income_zc) || 0));
//        $('#toshopshow').show();
    }else{
        agentSum = result.sum_income_dl || 0;
        // 代理
        $("#sumAgent").text(jems.formatNum(result.sum_income_dl || 0));
        $('#agents').show();
//        $('#toagentshow').show();
        // 累计收入查到值后，查询累计班费
        url = msonionUrl+"income/sumfeeV2";
        formatAjax(url, 'get', getTeamFee);
    }

}

/**
 * 获取每日收入
 * @param result
 */
function getDayIncome(result){
    //console.info("每日收入："+result);
    // 累计
//    $("#todayTotal").text(jems.formatNum((result&&result.income) || 0));
    // 销售收入
//    $("#todayTerminal").text(jems.formatNum((result&&result.income_zd) || 0));
    if(result.memberType!=2){// 如果是店主，则显示下面数据
    	// 今日零售额
    	$("#todaySale").text(jems.formatNum((result&&result.income_ls) || 0));
    	// 改版：今日零售收入=销售收入+拓客收入
    	$("#dayRetail").text(jems.formatNum((result&&result.income_zd+result.income_zc) || 0));
        // 注册
//        $("#todayRegister").text(jems.formatNum(result.income_zc || 0));
    }else{
        // 改版：代理收入
    	agentDay = result.income_dl || 0;
        $("#todayAgent").text(jems.formatNum(result.income_dl || 0));
        // 代理商隐藏销售与零售收入
//        $("#dataul").find(".agenthide").remove();
        // 每日收入查到值后，查询每日班费
        url = msonionUrl+"income/dayfee";
        formatAjax(url, 'get', getDayTeamFee);
    }
}

/**
 * 获取累计班费
 * @param result
 */
function getTeamFee(result){
    var ispartner = result.ispartner;
    var fee = result.fee || 0;
    if(ispartner && ispartner!=0){// && fee !=0
    	//新版：代理账户累计收入=累计代理收入+累计班费收入
        $("#agentTeamSum").text(jems.formatNum(fee+agentSum));
        // 累计
        $("#teamFee").text(jems.formatNum(fee));
        // 存储累计班费
        sessionStorage.fee = jems.formatNum(fee);
        $("#godayTeamFee").show();
//        $("#banfeeshow").show();
//        $("#goteamFee").click(function(){
//            jems.goUrl("partnerlist.html?flag=1&ispartner="+ispartner)
//        });
//
//        // 重新计算账户累计收入
//        var sumtotal = parseFloat($("#sumTotal").text());
//        $("#sumTotal").text(jems.formatNum(sumtotal+parseFloat(fee)));
    }else{
    	  $("#agentTeamSum").text(jems.formatNum(agentSum));
    }
}

/**
 * 获取每日班费
 * @param result
 */
function getDayTeamFee(result){
    var ispartner = result.ispartner;
    var dayfee = result.dayfee || 0;
    if(ispartner && ispartner!=0){ 
    	//新版：代理账户今日收入=代理收入+班费收入
    	$("#agentTeamDay").text(jems.formatNum(dayfee+agentDay));
        $("#dayTeamFee").text(jems.formatNum(dayfee));
        //$("#banfeeshow").show(); 
        $("#godayTeamFee").click(function(){
            jems.goUrl("partnerlist.html?flag=1&ispartner="+ispartner)
        });
        // 重新计算账户累计收入
//        var todaytotal = parseFloat($("#todayTotal").text());
//        $("#todayTotal").text(jems.formatNum(todaytotal+parseFloat(dayfee)));
    }else{
    	$("#agentTeamDay").text(jems.formatNum(agentDay));
    }
}

/**
 * 跳转至列表页
 */
function toDetailPage(){
    jems.goUrl("partnerlist.html?ispartner="+ispartner);
}


/**
 *
 * @param url
 */
function goUrlWithTmnAndFlg(url){
    var ParHref = jems.parsURL( window.location.href );
    var flag = ParHref.params.flag;
    var mark = url.lastIndexOf('?')!=-1?'&':'?';
    url += (mark+'flag=')+flag;
    jems.goUrl(url);
}

function goCash(){
	$.ajax({
		type:"get",
		url:msonionUrl+"register/validateMemberCode",
		dataType:"json",
		success:function(data){
			var errCode = data.errCode;
			if(errCode == 0){
				   mBox.open({
				        width:"90%",
				        content:"<p class='tc f16' style='width:100%'>为了您的财产安全，现需要您绑定手机号才可进行提现</p>",
				        closeBtn: [false],
				        btnName:['去绑定手机号','取消'],
				        btnStyle:["color: #8E488E;"],
				        maskClose:false,
				        yesfun : function(){
				        	jems.goUrl('../ucenter/personalinfo_update.html')
				        }
				    });
			}else if(errCode == -2){
				jems.goUrl('cash-withdrawal.html')	
			}
		}
	})
}
