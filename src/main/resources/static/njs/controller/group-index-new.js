// JavaScript Document
var ParHref = jems.parsURL( window.location.href );
var params = ParHref.params;
var tmn = params.tmn;
var flag = true; 
var serviceTime;
$(function(){
	//返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    $(".rule-colsed").on("tap",function () {
        $(".mask").hide();
        $(this).parents(".rule").hide();
    });
    $(".mask").on("tap",function () {
        $(this).hide();
        $(".rule").hide();
    })
    $(".ruleBtn").on("tap",function () {
        $(".rule").show();
        $(".mask").show();
    });
    $('.mask').bind("touchmove",function(e){ e.preventDefault();});
    
    var pageNum = 1; 
    var totalPage = 1;
    var currentPageNum  = 0;
    //产品列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取商品列表的数据
    function listData() { //团购商品列表
	    if(!flag || currentPageNum == pageNum){
	    	return;
	    }
    	if(pageNum > totalPage) {
    		$("#loading").show().html('到底了,没有更多商品了');
			return;
		}
    	currentPageNum = pageNum;
        $.ajax({
            type : "post",
            url : msonionUrl+"group/findIndexGroupList/v2",
            data:{
            	"pageNo":pageNum,
            	"tmn":tmn
            },
            dataType : "json",
            beforeSend:function(){
                $("#loading").show();
            },
            success:function(result){
            	if(10000 == result.errCode){
            		var titles = [],indexList=result.data.groupList;
            		var nt = result.data.nowDate.match(/\w+|d+/g);
            		serviceTime = new Date(nt[0],nt[1],nt[2],nt[3],nt[4],nt[5]).getTime();
//            		$.each(indexList,function(i,val){
//            			if(i == 0){
//            				$("#titleList").append("<li class='on'>"+val.title+"</li>");
//            			}else{
//            				$("#titleList").append("<li class=''>"+val.title+"</li>");
//            			}
//            			
//            		});
            		
            		var gettpl = $('#indexShopData').html();
            		var datas = {data:indexList};
                    jetpl(gettpl).render(datas, function(html){
                        $('#indexShopList').append(html);
                    });
                    flag = true; 
                    //图片延迟加载插件引用
                    $('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
                    if(pageNum>totalPage){
                        $("#loading").show().html('到底了,没有更多商品了');
                    }else {
                        setTimeout(function () {
                            $("#loading").hide();
                        }, 4000);
                    }
                    totalPage = result.data.pageTotal;
                    pageNum ++;
                    //显示购物车数量
                    jems.showCartNumTip(result.data.cartNum);
                    $("#titleList li").on("click",function () {
            	        var idx = $(this).index();
            	        $(this).addClass("on").siblings().removeClass("on");
            	        setTimeout(function(){
            	        	var offsettop = $(".listBox .listBox-list").eq(idx).offset().top-90;
                	        $("html,body").scrollTop(offsettop);
            	        },200)
            	        
            	    })
            	}else{
            		$("#indexShopList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                    $("#loading").hide();
                    $("#topFileBox").hide();
            	}
            }
        });
    }
    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 70});
    var isua = navigator.userAgent.toLowerCase();
    if(isua.match(/MicroMessenger/i) == "micromessenger"){
    		jems.wxShare("洋葱拼团","https://m.msyc.cc/wx/nimages/share_logo.png","全球研选 日用之美");
    }
    
});

