// JavaScript Document
var ParHref = jems.parsURL( window.location.href );
var params = ParHref.params;
var tmn = params.tmn;
var flag = true; 
$(function(){
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
            url : msonionUrl+"group/findIndexGroupList/v1",
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
            		var gettpl = $('#indexshopData').html();
            		var datas = {data:result.data.groupList};
                    jetpl(gettpl).render(datas, function(html){
                        $('#indexshop').append(html);
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
            	}else if(10013 == result.errCode){
            		tip(result.errMsg);
            	}else{
            		$("#goodsList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                    $("#loading").hide();
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

function tip(text){
	mBox.open({
		width:"80%",
		content:"<p class='tc listinfo f16' style='width:100%'>"+text+"</p>",
		closeBtn: [false,1],
		btnName:['访问团购列表', '会员中心'],
		btnStyle:["color: #0e90d2;","color: #0e90d2;"],
		maskClose:false,
		yesfun : function(){
			jems.goUrl('group-index.html');
		} ,     
		nofun : function(){
			jems.goUrl('ucenter/members.html');
		}     
	});
}

