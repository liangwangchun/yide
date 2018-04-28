/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
var ParHref = jems.parsURL( window.location.href );
var tmn = ParHref.params.tmn;			// 终端
var dateobj={};		// 开始与结束日期
$(function(){
   // tmn = returnTmnNo();
    // 加载数据
    loadListData();

    loadAgentList(0);
    // 日期选择事件
    //chageDate();
    // 初始化日期选择控件
    initDatePlugin();
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 70});

    //返回店主中心 
    jems.backStore();
});  

/*列表数据载入*/
function loadListData(){ 
    loadAgentCount();
}


/**
 * 载入店铺数据
 */
var timer = null;
function loadAgentList(flag){

    $("#storeList").empty();
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
        if(!loadFlg)return loadFlg;
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多数据了');
            return;
        }
        loadFlg=false;
        var url = msonionUrl;
        url = flag==0?url+"income/opendstore":url+"income/ordstore";
        var data = "pageNo="+pageNum+"&t="+new Date().getTime();
        dateobj.startDate&&(data += "&params[startDate]="+dateobj.startDate);
        dateobj.endDate&&(data += "&params[endDate]="+dateobj.endDate);
        dateobj.serkey&&(data += "&params[serkey]="+dateobj.serkey);
        $.ajax({
            type : "post",
            url : url,
            data:data,
            dataType : "json",
            success:function(data){
                //console.log(data);
                if(data==-1){jems.goUrl(mspaths+"login.html?"+window.location.href);return;}
                if(data==-2){
                    var load_msg = $('<div class="loadingbox" id="loadaimbox" style="display: -webkit-box;">'
                        +'<i class="loadingrdu"><img src="nimages/loading.gif" /></i>	'
                        +'<em class="ml5 f15">正在努力加载</em>'
                        +'</div>');
                    $("body").html(load_msg);
                    jems.mboxMsgIndex("您没有权限查看!");
                    return;
                }
                data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#storeListData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#storeList').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                    loadFlg = true;
                }
            }
        });
    }

} 

/**
 * 查看指定客户订单收支数据
 */
function loadOrdStoreInfo(mebId,tmn){
    var url = msonionUrl+"income/ordstoreinfo";
    var params = "memberId="+mebId+"&tmn="+tmn+"&t="+new Date().getTime();
    dateobj.startDate&&(params += "&startDate="+dateobj.startDate);
    dateobj.endDate&&(params += "&endDate="+dateobj.endDate);
    $.ajax({
        url:url,
        data:params,
        type:"post",
        dataType:"json",
        success:function(data){
            countReg(mebId,data);
            /*if(data&&data.mbrSodCount>0){
             m.open({
             width:"90%",
             height:"60%",
             content:createHtml(data),
             closeBtn: [false],
             btnName:['确定'],
             btnStyle:["color: #0e90d2;"],
             maskClose:false
             });
             }*/
        }
    });

    //countReg(tmn);
}

/**
 * 代理商web后台统计
 */
function loadAgentCount(){
    //获取收入明细列表的数据
    var url = msonionUrl+"income/agentV2";
    dateobj.tmn = tmn;
    dateobj.t = new Date().getTime();
    var params = dateobj;
    $.ajax({
        type : "post",
        url : url,
        data:params,
        dataType : "json",
        success:function(data){
            $('#store').text(data.store || 0);
            $('#storeOrd').text(data.store_ord || 0);
            $('#sodCount').text(data.sodCount || 0);
            $('#sodAvgPrice').text((data.salesAmt/data.sodCount)?jems.formatNum(data.salesAmt/data.sodCount,2):'0.00');
            $('#salesAmt').text(data.salesAmt?jems.formatNum(data.salesAmt,2):'0.00');
            $('#refundAmt').text(data.refundAmt?jems.formatNum(data.refundAmt,2):'0.00');
            $('#agentAmt').text(data.agentAmt?jems.formatNum(data.agentAmt,2):'0.00');
        }
    });
}

/**
 * 统计注册用户数
 */
function countReg(memberId,dataobj){
    //获取收入明细列表的数据
    var url = msonionUrl+"income/countreg";
    dateobj.t = new Date().getTime();
    var params = dateobj;
    //params.tmn = tmn;
    params.memberId = memberId;
    $.ajax({
        type : "post",
        url : url,
        data:params,
        dataType : "json",
        success:function(data){
            // 数据合并
            $.extend(data,dataobj);
            //console.info(data);
            if(data&&data.mbrSodCount>0){
                mBox.open({
                    width:"90%",
                    height:"60%",
                    content:createHtml(data),
                    closeBtn: [false],
                    btnName:['确定'],
                    btnStyle:["color: #0e90d2;"],
                    maskClose:false
                });
            }else{
                jems.tipMsg("没有相应的订单数据！");
            }
        }
    });
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

/*日期往前推相应天数*/
function calcDate(){
    var datejson={};
    // 获取选择框的值
    var selval = $('#dateselect').val();
    if(selval==0)return datejson;
    // 获取选择的日期值
    var nday = (selval==1&&0) || 	// 当天
        (selval==2&&-1) ||	// 昨天
        (selval==3&&-7) ||	// 最近一周
        (selval==4&&-30) ||	// 最近一月
        (selval==5&&-365);	// 最近一年	
    // 获取当前日期
    var date = new Date();
    datejson.endDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    // 加上要推前的天数进行记算
    date.setDate(date.getDate()+nday);
    datejson.startDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    selval==2 && (datejson.endDate = datejson.startDate);
    return datejson;
}

/**
 * 弹出框的页面内容
 * @param arrObj
 * @returns
 */
function createHtml(arrObj){
    var htm,datas = {data:arrObj}
    var gettpl = $('#sodStoreListData').html();
    jetpl(gettpl).render(datas , function(html){
        htm = html;
    });
    return htm;
}

/**
 * 初始化时间控件
 */ 
function initDatePlugin(){
    jeDate({
        dateCell:"#startDate",
        format:"YYYY-MM-DD",
        choosefun:function(){
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
        choosefun:function(){
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