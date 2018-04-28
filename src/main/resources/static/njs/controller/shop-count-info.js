/**
 * 收入明细
 * author:cjw
 * 2015-08-03
 */
var tmn;			// 终端
var dateobj={};		// 开始与结束日期
$(function(){
	$.ajax({
		type : "post",
		url : msonionUrl+"menbercenter/memberInfo",
		dataType : "json",
		//jsonp:"callback",
		success:function(data){
			if(!data.login_flag){				
				jems.goUrl("login.html?"+window.location.href);
			}else {
				if(data.memberrec.memberType != 3){
					var load_msg = $('<div class="loadingbox" id="loadaimbox" style="display: -webkit-box;">'
							+'<i class="loadingrdu"><img src="../nimages/loading.gif" /></i>	'
							+'<em class="ml5 f15">正在努力加载</em>'
							+'</div>');
					$("body").html(load_msg);
                    jems.mboxMsgIndex("只有店主可见!"); 
				}  else {
					loadData();
				}
			} 
		}
	});
    $(window).goTops({toBtnCell:"#gotop",posBottom:70});

    //返回店主中心 
    jems.backStore(); 
 
});

function loadData(){  
	//tmn = returnTmnNo(); /******/
	// 加载数据
	loadListData();
 
	loadClientList(0);

	// 日期选择事件
	chageDate(); 

	// 初始化时间控件
	initDatePlugin();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom: 100});
}
/*列表数据载入*/
function loadListData(){
	loadStoreCount(); 
}

/**
 * 店主web后台统计
 */
function loadStoreCount(){
	//获取收入明细列表的数据
	var url = msonionUrl+"income/store";
	//dateobj.tmn = returnTmnNo();
	dateobj.t = new Date().getTime();
	var params = dateobj;
	$.ajax({
		type : "post",  
		url : url,
		data:params,
		dataType : "json",
		success:function(data){
			$('#ord').text(data.ord||0);
			$('#sodCount').text(data.sodCount||0);
			$('#sodAvgPrice').text((data.salesAmt/data.sodCount)?jems.formatNum(data.salesAmt/data.sodCount,2):'0.00');
			$('#salesAmt').text(data.salesAmt?jems.formatNum(data.salesAmt,2):'0.00');
			$('#refundAmt').text(data.refundAmt?jems.formatNum(data.refundAmt,2):'0.00');
			$('#profitAmt').text(data.profitAmt?jems.formatNum(data.profitAmt,2):'0.00');
		} 
	});	

	// 统计注册用户数
	countReg();
}

/**
 * 统计注册用户数
 */
function countReg(){
	//获取收入明细列表的数据
	var url = msonionUrl+"income/countreg";
	dateobj.t = new Date().getTime();
	var params = dateobj;
	//console.log(params);
	$.ajax({
		type : "post", 
		url : url,
		data:params,
		dataType : "json",
		success:function(data){
			$('#reg').text(data.reg||0);
		}
	});	
}
/**
 * 载入已注册客户数据
 */
function loadClientList(flag){
		$("#clientList").empty();
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
			var url = msonionUrl;
			url = flag==0?url+"income/regclient":url+"income/ordclient";
			var data = "pageNo="+pageNum+"&t="+new Date().getTime();
			dateobj.startDate&&(data += "&params[startDate]="+dateobj.startDate);
			dateobj.endDate&&(data += "&params[endDate]="+dateobj.endDate);
			dateobj.serkey&&(data += "&params[serkey]="+dateobj.serkey);
			$.ajax({
				type : "get", 
				url : url,
				data:data,
				dataType : "json",
				success:function(data){
					if(data==-1){goUrl('login.html');return;}
					data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
					if(data.total == 0){					
						$("#no_record").css({display:"block"});
					}else{
						$("#no_record").hide();
						var gettpl = $('#clientListData').html();
						jetpl(gettpl).render(data, function(html){
							$('#clientList').append(html);
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
function loadOrdClientInfo(mebId){
	var url = msonionUrl+"income/ordclientinfo";
	var params = "memberId="+mebId+"&t="+new Date().getTime();
	dateobj.startDate&&(params += "&startDate="+dateobj.startDate);
	dateobj.endDate&&(params += "&endDate="+dateobj.endDate);
	$.ajax({
		url:url,
		data:params,
		type:"post",
		dataType:"json",
		success:function(data){
			if(data && data.total>0){
				mBox.open({
					width:"90%",
					height:"40%",
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

/**
 * 代理商web后台统计
 */
function loadAgentCount(){
	//获取收入明细列表的数据
	var url = msonionUrl+"income/agent";
	dateobj.tmn = returnTmnNo();
	dateobj.t = new Date().getTime();
	var params = dateobj;
	$.ajax({
		type : "get", 
		url : url,
		data:params,
		dataType : "json",
		success:function(data){
			$('#store').text(data.store);
			$('#storeOrd').text(data.store_ord);
			$('#stores').show();
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
		//$("#clientList").empty();
		loadClientList(0);
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
	var htm, datas = {data:arrObj}
	var gettpl = $('#sodClientListData').html();
	jetpl(gettpl).render(datas, function(html){
		htm = html;
	}); 
	return htm;
}

/**
 * 初始化时间控件
 */
function initDatePlugin(){
    mDate({
        'trigger': '#startDate', /*选择器，触发弹出插件*/
        'type': 'date',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'maxDate':new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),/*最大日期*/
        'onSubmit':function(){/*确认时触发事件*/
            dateobj.startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            endDate&&endDate!=''?dateobj.endDate = endDate:delete dateobj['endDate'];
            // 清空原数据，并重新载入数据
            loadListData();
            // 默认载入注册客户列表
            loadClientList(0);
        },
        'onClose':function(){/*取消时触发事件*/
        }
    });
    mDate({
        'trigger': '#endDate', /*选择器，触发弹出插件*/
        'type': 'date',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate':'1900-1-1',/*最小日期*/
        'maxDate':'2020-12-12',/*最大日期*/
        'onSubmit':function(){/*确认时触发事件*/
            dateobj.endDate = $("#endDate").val();
            if(dateobj.startDate){
                // 清空原数据，并重新载入数据
                loadListData();
                // 默认载入注册客户列表
                loadClientList(0);
            }else{
                jems.tipMsg('请选择开始时间');
            }
        },
        'onClose':function(){/*取消时触发事件*/
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
		// 清空原数据，并重新载入数据
		//loadListData();
		// 默认载入注册客户列表
	}else{
		delete dateobj.serkey; 
	}
	loadClientList(0);
}
