/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
var tmn;			// 终端
var dateobj;		// 开始与结束日期
var memberType;		// 登录用户的类型
var selectMbrId;	// 选择的店主Id
var mbType;			// 选择的店主类型
$(function(){
    // 获取登录人信息
    getMemberInfo();
    // 如果登录人是代理商，则显示加盟店列表
    if(memberType == 2){
        // 载入店主下拉列表
        getStoreList();
        $("#storeSel").show();
        // 店主列表选择事件
        changeStore();
        // 如果是代理商，则加载属于某店主的终端列表
        getTmnList($("#storelist").val());
        $("#tmnlist").prepend("<option value='0'>全部</option>");
    }else{
        // 如果不是代理商，则直接加载终端列表
        getTmnList();
    }
    // 调用计算最近月方法
    dateobj = calcDate();
    // 加载数据
    loadListData();
    // 终端列表选择事件
    chageTmn();
    // 日期选择事件
    chageDate();

    //返回店主中心 
    jems.backStore();
    
});


/*获取登录用户信息*/
function getMemberInfo(){
    $.ajax({
        type:'get',
        url:msonionUrl+"menbercenter/loginmbrinfo?d="+new Date().getTime(),
        async:false,
        dataType:'json',
        success:function(msg){
            memberType = msg.memberType;
        }
    });
}


/*列表数据载入*/
function loadListData(){
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
            $("#loadaimbox em").text('没有更多数据了');
            return;
        }
        if(!loadFlg)return loadFlg;
        loadFlg=false;
        var url = msonionUrl+"income/incomlist";
        var data = "pageNo="+pageNum+"&params[startDate]="+dateobj.startDate+
            "&params[endDate]="+dateobj.endDate;
        data += $("#tmnlist").val()==0?'':"&params[tmn]="+$("#tmnlist").val();
        data += selectMbrId?'&params[mbrId]='+selectMbrId:'';

        $.ajax({
            type : "get",
            url : url,
            data:data,
            dataType : "json",
            success:function(data){
                data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#incomeListData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#incomeList').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                    loadFlg = true;
                }
              //返回顶部插件引用
                $(window).goTops({toBtnCell:"#gotop",posBottom:50});
            }
        });
    }
}

/*查询代理商下的加盟店*/
function getStoreList(){
    $.ajax({
        type:"get",
        url: msonionUrl+"menbercenter/storembr",
        dataType:"json",
        async:false,
        success:function(result){
            var gettpl = $("#storelistData").html();
            var datas = {data:result};
            jetpl(gettpl).render(datas, function(html){
                $('#storelist').append(html);
                // 第一次进入时，给选择的店主id赋初始值
                selectMbrId = $('#storelist').val();
                // 获取店员类型
                mbType = $('#storelist').find('option').eq(0).data('value');
                // 终端下拉框加入全部选项
                $("#tmnlist").prepend("<option value='0'>全部</option>");
            });
        }
    });
}

/*获取终端列表*/
function getTmnList(mbrId,mbType){
    //var data = mbrId?"memberId="+mbrId:"";
    var data = {"memberId":mbrId,"memberType":mbType};
    $.ajax({
        type:"get",
        url: msonionUrl+"terminal/alllist",
        data:data,
        dataType:"json",
        async:false,
        success:function(result){
           // console.log(result);
            var gettpl = $("#tmnlistData").html();
            var datas = {data:result};
            jetpl(gettpl).render(datas, function(html){
                $('#tmnlist').empty();
                $('#tmnlist').append(html);
            });
        }
    });
}

/*加盟店选择事件*/
function changeStore(){
    $("#storelist").change(function(){
        selectMbrId = $(this).val();
        // 获取绑定的用户类型数据
        mbType = $(this).find("option").not(function(){ return !this.selected }).data('value');
        getTmnList(selectMbrId,mbType);
        // 终端下拉框加入全部选项
        $("#tmnlist").prepend("<option value='0'>全部</option>");
        // 清空原数据，并重新载入数据
        $("#incomeList").empty();
        loadListData();
    });
}

/*选择终端事件*/
function chageTmn(){
    $('#tmnlist').change(function(){
        tmn = this.value;
        // 清空原数据，并重新载入数据
        $("#incomeList").empty();
        loadListData();
    });
}

/*日期选择事件*/
function chageDate(){
    $('#dateselect').change(function(){
        /*var selval = $(this).val();
         // 获取选择的日期值
         var nday = (selval==1&&0) || 	// 当天
         (selval==2&&-1) ||	// 昨天
         (selval==3&&-7) ||	// 最近一周
         (selval==4&&-30) ||	// 最近一月
         (selval==5&&-365);	// 最近一年
         dateobj = calcDate();
         selval==2 && (dateobj.endDate = dateobj.startDate);*/
        dateobj = calcDate();
        // 清空原数据，并重新载入数据
        $("#incomeList").empty();
        loadListData();
    });
}

/*计算日期 flag为1则计算最近月，flag为2则计算最近季度*/
/*function calcDate(flag){
 var datejson={};
 var date = new Date();
 var year = date.getFullYear();
 // 获取月份 从0开始
 var month = date.getMonth();
 // 获取日
 var day = date.getDate();
 var endDate = year+"-"+(month+1)+"-"+day; 
 var startDate = '';
 // json赋值
 datejson.endDate = endDate;
 // 最近一月
 if(flag==1){
 startDate = year+"-"+(month+1)+"-"+1;
 }else if(flag==2){
 // 获取季度开始月
 var quarterMonth = (month<=2&&1)||(month<=5&&4)||(month<=8&&7)||(month<=11&&10)
 startDate = year+"-"+quarterMonth+"-"+1;
 }
 datejson.startDate = startDate;
 return datejson;
 }*/
/*日期往前推相应天数*/
function calcDate(){
    var datejson={};
    // 获取选择框的值
    var selval = $('#dateselect').val();
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
 * 查看订单商品
 * @param sodId
 * @param sodNo
 */
function showGoodsDetail(sodId,sodNo){
    var ParHref = jems.parsURL( );
    var flag = ParHref.params.flag; 
    jems.goUrl(msonionUrl+'wx/store/shop-order-goods.html?sodId='+sodId+'&sodNo='+sodNo+'&flag='+flag);
}
