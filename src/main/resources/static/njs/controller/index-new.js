/**
 * index onion.
 */
var ParHref = jems.parsURL();
$(function(){
    // 滚动图片
    var params = ParHref.params;
    var tmn = params.tmn;
    $.ajax({
        type:"get",
        url : msonionUrl+"adverimg",
        data: {"tmn":tmn,"imgType":2},
        dataType : "json",
        success:function(json){
            var gettpl = $('#defsliderData').html();
            var jsdata = {data:json};
            jetpl(gettpl).render(jsdata, function(html){
                $('#defsliderlist').html(html);
            });
            // 图片滚动
            if ($('#defslider .bd li').length > 0) {
                jeSlide({
                	mainCell: "#defslider",
                	navCell: ".hd ul",
                    conCell: ".bd ul",         
                    effect: "leftLoop",
                    duration: 4,
//                    switchCell: ".datapic",
                    sLoad: "data-pic",
                    isTouch:true,
                    showNav: true,//自动分页
                    autoPlay: $('#defslider .bd li').length > 1 ? true : false  //自动播放
                });
            }
        }
    });

    // ONION TV
    if ($("#vidonion .bd li").length > 0) {
        jeSlide({
        	mainCell: "#vidonion",
        	navCell: ".hdvid",
        	conCell: ".bd ul",
            effect: "curtain",
            duration: 2,
//            pageStateCell:".pageState",
//            switchCell: ".datapic",
            sLoad: "data-pic",
            isTouch:true,
            showNav: true,//自动分页
            autoPlay: false  //自动播放
        });
    }    
    if ($("#replendate").length > 0){
        var currdate = new Date(),
            hour = currdate.getHours(), 
            minut = currdate.getMinutes();
        var redate = parseInt(hour+""+minut) > 1230 ? replenishDate(1) : replenishDate(0);
        $("#replendate").html(redate+"12:30上架");
    }
    
    $.ajax({
        type : "post",
        url : msonionUrl+"getMemberInfo",
        dataType : "json",
        success:function(data){
            if(data.errCode == 10000){
                $("#mynotice").find(".msnum").show();
            }
            var rehref = msonionUrl+"wx/login.html?"+window.location.href;
            //通知消息
            $("#mynotice").on("click",function () {
                if(data.errCode == 10000){
                    var metype = data.memberType;
                    if (metype == 2 || metype == 3) {
                        jems.goUrl(msonionUrl+"wx/store/notice-category.html?flag=0");
                    } else {
                        jems.goUrl(msonionUrl+"wx/ucenter/arrival-notices.html?flag=0");
                    }
                }else{
                    jems.goUrl(rehref);
                }
            });
            //旗舰馆
            $("#strategy").on("click",function () {
                jems.goUrl(msonionUrl+"wx/flagshipIndex");
            });
            //拼团
            $("#groups").on("click",function () {
                jems.goUrl(msonionUrl+"wx/group-index.html");
            });
            //优惠券
            $("#robcoupon").on("click",function () {
                jems.goUrl(msonionUrl+"wx/actapp/coupons/index.html");
            });
            //成为店主
            $("#asowner").on("click",function () {
                jems.goUrl(msonionUrl+"wx/actapp/asowner/index.html");
            })
        }
    });
    packetBox();
    jems.wxShare($("#titles").text());
    jems.getShopTitle(tmn);
    //图片延迟加载插件引用
    $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
    //返回顶部插件引用
    $(window).goStick({fixed:"absolute",btnCell:"#gotop",posBottom: 70});
    //新人红包
    showOnion();
});
function replenishDate(num) {
    var date = new Date(),getday = date.getDate(), 
        setdate = getday + num,
        gday = getday == 31 ? (setdate - 1) : setdate;
    date.setDate(gday);
    var year = date.getFullYear(), 
        month = date.getMonth()+1, 
        days = date.getDate();
    return month + "月"+ days +"日";
}

function newOnion(){
	$("#packetBox").addClass("hide");
    $.ajax({
        type : "post",
        url : msonionUrl+"couponRest/receiveNewUserCoupon",
        dataType : "json",
        success:function(data){
            if(data.errCode == "4001"){
            	var rehref = msonionUrl+"wx/login.html?"+window.location.href;
            	jems.goUrl(rehref);
            	return;
            }
            if(data.data.receiveState == "10000"){
            	jems.tipMsg("领取成功！请稍后在我的优惠券中查看！");
            	jems.goUrl("https://m.msyc.cc/wx/actapp/album/index.html?album=74");
            	return;
            }else{
            	jems.tipMsg(data.data.errMsg);
            	$("#packetBox").addClass("show");
            	return;
            }
        }
    });
}

function showOnion(){
    $.ajax({
        type : "post",
        url : msonionUrl+"couponRest/receiveRecord",
        dataType : "json",
        success:function(data){
            if(data.errCode != "4001" && data.data.receiveState == "10000"){
            	$("#packetBox").removeClass("hide");
            	return;
            }
        }
    });
}

function packetBox() {
    var packetBox = $("#packetBox"),
        boxheight= packetBox.height(), wheight = $(window).height(),
        btop = (wheight-boxheight)/2
    packetBox.css({"top":btop+"px"});
    $(".colsed").on("click",function () {
        $(this).parents("#packetBox").hide();
        $(".packetMask").hide();
    })
}