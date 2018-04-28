/**
 * 收入明细
 * author:cjw
 * 2015-12-08
 */
var params = jems.parsURL().params;			// 终端
var dateobj={};		// 开始与结束日期
var ispartner = 0;	// 标识是合伙人还是开发商
$(function(){
    ispartner = params.ispartner;
    loadPartnerList();
    // 计算可提现班费
    cashedable();
    // 检测是到了可提现日期90天后
    iscashable();
    //准合伙人预计班费
    unSumfee();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});

    //返回店主中心  
    jems.backStore(); 
});

/**
 * 载入店铺数据
 */
 
function loadPartnerList(){
    $("#loadaimbox i").show();
    $("#loadaimbox em").text('正在努力加载');
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
    // 取消之前绑定的滚动事件，载入数据时重新绑定
    $(window).off("scroll");
    //明细列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取收入明细列表的数据
    function listData() {
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多数据了');
            return;
        }
        if(!loadFlg)return loadFlg;
        loadFlg=false;
        var url = msonionUrl+"income/teamlistV2";
        var data = {"pageNo":pageNum,"ispartner":ispartner};
        $.ajax({
            type : "post",
            url : url,
            data:data,
            dataType : "json",
            success:function(data){
            	if(ispartner == 4){
            		for(var i=0;i<data.data.length;i++){
            			data.data[i].rebate = jems.formatNum(0.024,3);
            		}
            	}else{
            		for(var i=0;i<data.data.length;i++){
            			data.data[i].rebate = jems.formatNum(0.03);
            		}
            	}
                if(data==-1){jems.goUrl('login.html');return;}
                data.totalpage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#partnerListData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#partnerList').append(html);
                    });
                    totalPage = data.totalpage;
                    pageNum++;
                    loadFlg = true;
                }
            }
        });  
    }
}  


/*日期选择事件*/
function chageDate(){
    $('#dateselect').change(function(){
        dateobj = calcDate();
        // 清空原数据，并重新载入数据
        loadListData();
        // 默认载入注册客户列表
        loadAgentList(0);
    });
}

/**
 * 初始化时间控件
 */
function initDatePlugin(){
    jeDate({
        dateCell:"#startDate",
        format:"YYYY-MM-DD",
        choose:function(){
            dateobj.startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            endDate&&endDate!=''?dateobj.endDate = endDate:delete dateobj['endDate'];
            // 清空原数据，并重新载入数据
            loadListData();
            // 默认载入注册客户列表
            loadAgentList(0);
        }
    });

    jeDate({
        dateCell:"#endDate",
        format:"YYYY-MM-DD",
        choose:function(){
            dateobj.endDate = $("#endDate").val();
            if(dateobj.startDate){
                // 清空原数据，并重新载入数据
                loadListData();
                // 默认载入注册客户列表
                loadAgentList(0);
            }else{
                jems.tipMsg('请选择开始时间');
            }
        }
    });
}

/**
 * 搜所功能
 * @param serkey
 */
function search(){
    var searchKey = $('#formalSearchTxt').val();
    if(searchKey){
        // 添加关键字参数
        dateobj.serkey = $.trim(searchKey);
    }else{
        delete dateobj.serkey;
    }
    loadAgentList(0);
}

/**
 * 计算可提现班费
 */
function cashedable(){
    // 获取累计班费
    var fee = sessionStorage.fee;
    $.ajax({
        'url':msonionUrl+"income/cashedfee",
        'dataType':'json',
        'success':function(result){
            // 获取已提现的班费
            var cashed = result;
            // 计算可提现班费=累计班费-已提现班费
            //console.info(fee+'...'+cashed);
            var cashable = jems.formatNum(fee - cashed,2);
            $('#totalfee').text(fee);
            $('#cashable').text(cashable);
            $('#cashed').text(cashed);
            // 存储可提现班费，供下个页面调用
            sessionStorage.cashfee = cashable;
        }
    });
}

/**
 * 准合伙人预计班费
 */
function unSumfee(){
    // 获取累计班费
    $.ajax({
        'url':msonionUrl+"income/unSumfeeV2",
        'dataType':'json',
        'success':function(result){
            if(result.code == 0){
                if(result.ispartner == 3){
                    $('#cashable2').text(result.fee);
                    $("#uncashable").show();
                }
            }
        }
    });
}

/**
 * 查看是否可以提现
 */
function iscashable(){
    var data = {"ispartner":ispartner}; 
    $.ajax({
        'url':msonionUrl+"income/startdate",
        'data':data,
        'type':'get',
        'dataType':'json',
        'success':function(result){
            if(!result.iscashable){
                // 显示下次可提现日期
                // $('#cashdate').show();
                // 设置下次可提现日期文本
                if(result.nextDate != undefined) $('#startDate').text("下次提现日期: "+result.nextDate);
            }else {
                $('#cashbtn').css({"display":"block"});
                $('body').css({"padding-bottom":"70px"});
            }
        }
    }); 
}

function goCashPage(){  
    jems.goUrlFlag('cash-withdrawal.html?flag=1&isfee=1');
}

function goPartner2Page(){
    jems.goUrlFlag('partnerlist_2.html');
}