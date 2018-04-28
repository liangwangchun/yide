var ParHref = jems.parsURL(), menuId = 0, messageFlag = 0, tmn = "", id = "",leId = "";
var params = ParHref.params;
tmn=params.tmn, id = params.id;
$(function(){
    var qrcode = new QRCode($("#qrCodebox")[0], {
        text : window.location.href,
        width : 160,
        height : 160
    });
    $('#erwmbox').on('click',function(){
        mBox.open({
            content:mBox.cell("#qrCodebox")
        });
    }); 
    $(".mask").bind("touchmove",function(e){ e.preventDefault();});
    //$("#goodsdetail").tabView();
    //获取当前详细页面的数据 
    $.ajax({
        type : "get",
        url : msonionUrl+"group/findGroupInfo/v1?tmn="+tmn+"&groupId="+id,
        dataType : "json",
        success:function(result){
        	if(10000 == result.errCode){
        		var groupInfo = result.data.productGroupInfo;
        		var productInfo = groupInfo.productInfo;
        		$('#detailtopPic').attr('src',msPicPath+productInfo.goodsPics[0].picUrl+"?x-oss-process=image/resize,w_640");
                $("#godsAdv").html(productInfo.salePoint);
                $("#godsTit").html(groupInfo.name);
                $("#endTime").html(groupInfo.endTime);
                $("#countryico").addClass(productInfo.country.code);
                $("#countryname").html(productInfo.country.name);
                $("#godcbTxt").html(productInfo.saleGuide);
                $("#groupPrice").html("&yen;"+ jems.formatNum(groupInfo.groupPrice));
                $("#freePrice").html("&yen;"+ jems.formatNum(productInfo.freePrice));
                $("#le_editor").attr('src',msPicPath+'file/'+productInfo.leEditor+'.jpg');
                $("#leedit").html(productInfo.leEditor);
                $("#freePrice1").html("&yen;"+ jems.formatNum(productInfo.freePrice));
                $(".successTime").html(groupInfo.groupTime);
                $("#surplusGroup").html(groupInfo.surplusGroup);
                $("#groupQty").html(groupInfo.groupQty);
                var nt = result.data.nowDate.match(/\w+|d+/g);
        		var serviceTime = new Date(nt[0],nt[1],nt[2],nt[3],nt[4],nt[5]).getTime();//服务器时间
        		var bt = groupInfo.beginTime.match(/\w+|d+/g);
        		var groupBeginTime = new Date(bt[0],bt[1],bt[2],bt[3],bt[4],bt[5]).getTime();//团购开始时间
        		var et = groupInfo.endTime.match(/\w+|d+/g);
        		var groupEndTime = new Date(et[0],et[1],et[2],et[3],et[4],et[5]).getTime();//团购结束时间
//                if(groupBeginTime <= 0){
//                	$("#countEndTime").text("团购已结束");
//                }else if(groupBeginTime <  ){
//                	detailsBeginCountdown(groupInfo.beginTime,result.data.nowDate);//团购商品倒计时
//                	$("#countEndTime").find("em").eq(0).text("距离开始还剩");
//                }else{
//                	detailsEndCountdown(groupInfo.endTime,result.data.nowDate);//团购商品倒计时
//                	$("#countEndTime").find("em").eq(0).text("距离结束还剩");
//                }
        		if(serviceTime < groupBeginTime){
        			//$("#qtyText").show();
        			$("#countEndTime").find("em").eq(0).text("距离开始还剩");
        			detailsBeginCountdown(groupInfo.beginTime,result.data.nowDate);//团购商品倒计时
        		}else if(serviceTime > groupBeginTime && serviceTime < groupEndTime){ 
        			if(groupInfo.groupQty <= 0){
        				$("#surplusGroup").html("0");
        				$("#surpText").show();
        			}
        			$("#qtyText").show();
        			$("#countEndTime").find("em").eq(0).text("距离结束还剩");
        			detailsEndCountdown(groupInfo.endTime,result.data.nowDate);//团购商品倒计时
        		}else{
        			$("#countEndTime").text("团购已结束");
        		}
                //detailsCountdown(groupInfo.endTime,result.data.nowDate);//团购商品倒计时
                leId = groupInfo.leId;//商品id
                var isTuxedo = result.data.isTuxedo;
                var groupQty = groupInfo.groupQty;//团购库存
                var isLogin = result.data.isLogin;//是否登陆
                var surplus = groupInfo.surplusGroup;//剩余开团数
                var memberType;
                if(isLogin){
                	memberType = result.data.memberType;
                }
                if(surplus>0){
                	$("#topText").text("正在开团");
                }else{
                	$("#topText").text("可开团数已满，可直接参团哦");
                }
                if(groupQty > 0){
                	//随机拼团
                    var gettpl = $('#randGroupListData').html();
	            		var datas = {data:result.data.randList||[]}, vdata = [];
	            		for(var i=0; i<=1;i++){
	            			if(datas.data[i] != undefined){
	            				vdata.push(datas.data[i]);
	            			}
	            		}
	            		vdata = {data:vdata}
	            		if(datas.data.length >= 1){
	            			$("#surpText2").show();
	            		}
	            		if(datas.data.length > 2){
	            			$("#lookUp").show();
	            		}
	                    jetpl(gettpl).render(vdata, function(html){
	                        $('#randGroupList').html(html);
	                    });
	                    jetpl(gettpl).render(datas, function(html){
	                        $('#randGroupList2').html(html);
	                    });
	                    $("#lookUp").on("click",function(){
	                    	$(".mask").show();
	                        $(".randGroupBox").show();
	                    })
	                    $(".downtime").each(function(){
		                		countDates($(this));
		                	});
	                	if(1 == isTuxedo && isLogin){//已参团
	                		$("#groupRandDiv").hide();
	                		var sodId = result.data.sodGroups.sodId;
	                		var sodGroupId = result.data.sodGroups.sodGroupId;
                			$("#groups").html("已参团").on("click",function(){
	                			//goToSodDetails(sodId);
	                			goToGroupFightGroup(sodGroupId);//去到参团成功页面
	                		});
	                		$('#randGroupList').hide();
	                	}else if(2 == isTuxedo){
	                		var pinHTml = '<span class="f12 show">&yen;'+jems.formatNum(groupInfo.groupPrice)+'</span>\
	                			<span class="f12 show"><em id="groupMemberQty">'+groupInfo.groupMemberQty+'</em>人团</span>';
	                		$("#groups").html(pinHTml).on("click",function(){
	                			goToSubmit(surplus,memberType);
	                		});
	                	}else if(3 == isTuxedo){
	                		$("#groups").text("已结束").addClass("bg-C0C0C0");
	                	}else if(4 == isTuxedo){
	                		$("#groups").text("待开团").addClass("bg-C0C0C0");
	                	}
	                	
                }else{
	                	if(1 == isTuxedo && isLogin){//已拼团
	                		var sodId = result.data.sodGroups.sodId;
	                		var sodGroupId = result.data.sodGroups.sodGroupId;
	                		$("#groups").html("已参团").on("click",function(){
	                			//goToSodDetails(sodId);//去订单详情页面
	                			goToGroupFightGroup(sodGroupId);//改版去到参团成功页面
	                		});
	                	}else if(2 == isTuxedo){
	                		var pinHTml = '<span class="f12 show">&yen;'+jems.formatNum(groupInfo.groupPrice)+'</span>\
	                			<span class="f12 show"><em id="groupMemberQty">'+groupInfo.groupMemberQty+'</em>人团</span>';
	                		$("#groups").html(pinHTml).on("click",function(){
	                			goToSubmit(surplus,memberType);
	                		});
	                	}else if(3 == isTuxedo){
	                		$("#groups").text("已结束").addClass("bg-C0C0C0");
	                	}else if(4 == isTuxedo){
	                		$("#groups").text("待开团").addClass("bg-C0C0C0");
	                	}else{
	                		$("#groups").text("已抢光").addClass("bg-C0C0C0");
	                	}
	                	$('#randGroupList').text("暂无数据");
                }
                //了解品牌
                var gobrand = $("#gobrand");
                gobrand.on("click",function () {
                    jems.goUrl('goods-brandinfor.html?bid='+ productInfo.brand.id);
                });
                gobrand.find(".brandpic").css({"background-image":"url("+msPicPath+productInfo.brand.url+")"});
                gobrand.find(".brandname").text(productInfo.brand.name);
                //商品介绍
                jetpl('#godsContextData').render(productInfo, function(html){
                    var fixtext = $('#godsConTxt').find(".fixtext");
                    fixtext.append(html);
                    if ($(".conmore").length>0) {
                        $(".conmore").on("click", function () {
                            if (fixtext.find("p.hide").css("display") == "none") {
                                fixtext.find("p.hide").css({"display": "block"});
                                $(this).addClass("open").find("span").text("收起");
                            } else {
                                fixtext.find("p.hide").css({"display": ""});
                                $(this).removeClass("open").find("span").text("展开");
                            }
                        })
                    }
                });
                jetpl("#paramlistData").render(productInfo, function(html){
                    $('#godsConTxt').append(html);
                });
                //插入详情图片
                $('#godsConImg').append(productInfo.goodsDesc);
        	}else{
        		jems.mboxMsgIndex(result.errMsg);
        		return;
        	}
        }
    });
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 55});
});
//判断是否为手机端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//微信分享函数
function wxShare(data){
    /***************微信分享************************/
        //alert(data.goodsPics[0].picUrl);
    var store_name = data.name;
    //alert(store_name);
    if (store_name =="" || store_name == "undefined"){
        store_name = "洋葱OMALL";
    }
    var photo_url = data.goodsPics[0].picUrl
    if (photo_url =="" || photo_url == "undefined"){
        photo_url = "wx/nimages/share_logo.png";
    }
    $.ajax({
        type:"get",
        url : msonionUrl+"getWeChatSign",
        data: {"url": window.location.href},
        dataType : "json",
        success:function(data){
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appid, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.noncestr, // 必填，生成签名的随机串
                signature: data.finalsign,// 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: store_name, // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl: msPicPath+photo_url, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        //alert("3q");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //alert(" no 3q");
                    }
                });
                wx.onMenuShareAppMessage({
                    title: store_name, // 分享标题
                    desc: '全球研选 日用之美', // 分享描述
                    link: window.location.href,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
                    imgUrl: msPicPath+photo_url, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
            wx.onMenuShareQZone({
                title: store_name, // 分享标题
                desc: '全球研选 日用之美', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl:msPicPath+photo_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: store_name, // 分享标题
                desc: '全球研选 日用之美', // 分享描述
                link: window.location.href, // 分享链接
                imgUrl:msPicPath+photo_url, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    });
}
//去提交订单页面
function goToSubmit(surplus,memberType){
	if(surplus <= 0){
		$(".mask").show();
        $(".randGroupBox").show();
        return;
	}
	if (typeof(memberType) == undefined || memberType == null || memberType =="" || memberType == "undefined" ){
		jems.goUrl("login.html?"+window.location.href);
		return;
	}
	if(2 == memberType){
		mBox.open({
            width:"80%",
            content:"<p class='tc f16' style='width:100%'>对不起，洋葱商家无法使用本功能</p>",
            closeBtn: [false],
            btnName:['确定'],
            btnStyle:["color: #0e90d2;"],
            maskClose:false,
            yesfun : function(){
          	  jems.goBack();
            }
        });
		return;
	}
	jems.goUrl("group-sumbit.html?id="+id+"&t="+Math.random());
}
//去提交订单详情页面
function goToSodDetails(sodId){
	jems.goUrl("ucenter/order-details.html?sodId="+sodId);
}
//去确认参团页
function goToGroupFightGroup(sodGroupId){
	jems.goUrl("group-fight-groups.html?sodGroupId="+sodGroupId+"&id="+id);
}
//去商品详情页面
function goToGoodDetails(){
	jems.goUrl("goods-details.html?id="+leId);
}
//参团列表倒计时
function countDates(that){
	var cls = $(that);
	var orderdate=cls.attr("data-endDate"),
		serverdate=cls.attr("data-currDate");
	var splitTime = function (date) {
		var a = date.split(' '), d = a[0].split('-'), t = a[1].split(':');
		return { YY: d[0], MM: d[1], DD: d[2], hh: t[0],  mm: t[1], ss: t[2] };
	}
	var st = splitTime(serverdate), serverTime =  new Date(st.YY, st.MM - 1, st.DD, st.hh, st.mm, st.ss);
//	var dateTime = new Date(), difference = dateTime.getTime() - serverTime;
	var ot = splitTime(orderdate);
	var endTime = new Date(ot.YY, ot.MM - 1, ot.DD, ot.hh, ot.mm, ot.ss);
	var nMS = endTime.getTime() - serverTime.getTime();//+ difference
	setInterval(function() {
		var D = Math.floor(nMS / (1000 * 60 * 60 * 24));
		var H = Math.floor(nMS / (1000 * 60 * 60)) % 24;
		var M = Math.floor(nMS / (1000 * 60)) % 60;
		var S = Math.floor(nMS / 1000) % 60;
		var MS = Math.floor(nMS / 100) % 10;
		var HMS = [checkTime(D*24+H), checkTime(M), checkTime(S)];
		if (nMS >= 0) {
			$.each(HMS,function(i){
				cls.children().eq(i).html(HMS[i])
			});
		} else {
			$("#djsDiv").html("拼团已结束！");
			$("#yjctDiv").hide();
			location.reload();
		}
		nMS= nMS-100;
	}, 100);

}
//团购商品开始倒计时
function detailsBeginCountdown(orderdate,serverdate){
	var splitTime = function (date) {
		var a = date.split(' '), d = a[0].split('-'), t = a[1].split(':');
		return { YY: d[0], MM: d[1], DD: d[2], hh: t[0],  mm: t[1], ss: t[2] };
	}
	var st = splitTime(serverdate), serverTime =  new Date(st.YY, st.MM - 1, st.DD, st.hh, st.mm, st.ss);
	var that = $(this), ot = splitTime(orderdate);
	var endTime = new Date(ot.YY, ot.MM - 1, ot.DD, ot.hh, ot.mm, ot.ss);
	var nMS = endTime.getTime() - serverTime.getTime();
	setInterval(function() {
		var D = Math.floor(nMS / (1000 * 60 * 60 * 24));
		var H = Math.floor(nMS / (1000 * 60 * 60)) % 24;
		var M = Math.floor(nMS / (1000 * 60)) % 60;
		var S = Math.floor(nMS / 1000) % 60;
		var MS = Math.floor(nMS / 100) % 10;
		if (nMS >= 0) {
			if (D <= 0) {
				$("#timeDay").hide();
			} else {
				D = checkTime(D);
				$("#_day").html(D);
			}
			H = checkTime(H);
			M = checkTime(M);
			S = checkTime(S);
			$("#_hour").html(H);
			$("#_minutes").html(M);
			$("#_second").html(S);
		} else {
			$("#countEndTime").text("请点击右上角刷新本页");
		}
		nMS= nMS-100;
	}, 100);
}
//团购商品结束倒计时
function detailsEndCountdown(orderdate,serverdate){
	var splitTime = function (date) {
		var a = date.split(' '), d = a[0].split('-'), t = a[1].split(':');
		return { YY: d[0], MM: d[1], DD: d[2], hh: t[0],  mm: t[1], ss: t[2] };
	}
	var st = splitTime(serverdate), serverTime =  new Date(st.YY, st.MM - 1, st.DD, st.hh, st.mm, st.ss);
	var that = $(this), ot = splitTime(orderdate);
	var endTime = new Date(ot.YY, ot.MM - 1, ot.DD, ot.hh, ot.mm, ot.ss);
	var nMS = endTime.getTime() - serverTime.getTime();
	setInterval(function() {
		var D = Math.floor(nMS / (1000 * 60 * 60 * 24));
		var H = Math.floor(nMS / (1000 * 60 * 60)) % 24;
		var M = Math.floor(nMS / (1000 * 60)) % 60;
		var S = Math.floor(nMS / 1000) % 60;
		var MS = Math.floor(nMS / 100) % 10;
		if (nMS >= 0) {
			if (D <= 0) {
				$("#timeDay").hide();
			} else {
				D = checkTime(D);
				$("#_day").html(D);
			}
			H = checkTime(H);
			M = checkTime(M);
			S = checkTime(S);
			$("#_hour").html(H);
			$("#_minutes").html(M);
			$("#_second").html(S);
		} else {
			$("#countEndTime").text("团购已结束！");
		}
		nMS= nMS-100;
	}, 100);
}
function checkTime(i) { // 将0-9的数字前面加上0，例1变为01
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
