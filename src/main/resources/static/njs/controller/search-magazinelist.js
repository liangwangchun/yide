/**
 * 搜索列表
 * 
 * */ 
var ParHref = jems.parsURL();
var params = ParHref.params;
var tmn = params.tmn, keywords , maxamt = params.maxamt;
var pageNum = 1;
var totalPage = 1;

// 美物志接口
function listData() {
    if(pageNum > totalPage){
        $("#loading").show().html('到底了,没有更多商品了');
        return ;
    }
    $.ajax({
        type:"POST",
        url: msonionUrl+"magmain/searchMagMain",
        data:{
            "keyWords":keywords,
            "pageNo":pageNum,
            "pageSize":10
            },
        dataType:"json",
        beforeSend:function(){
            $("#loading").show();
        },
        success:function(data){
            if (pageNum == 1) {
               
            }
            if(data.total == 0 || data.totalPage == 0){
                $("#goodsList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                $("#loading").hide();
            }else{
                
                jetpl('#godslistData').render(data, function(html){
                    $('#goodsList').append(html);
                });  
                totalPage = data.totalPage
                pageNum++;	
                //图片延迟加载插件引用
                $('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
                $("#loading").hide();

            }
        }
    });

};

 $(function(){ 
	if (params.keywords == undefined || params.keywords == ""){
		keywords = sessionStorage.keywords == undefined?"":decodeURI(decodeURI(sessionStorage.keywords)) ;
	} else {
		keywords = decodeURI(decodeURI(params.keywords)) ;
		sessionStorage.keywords = keywords;
		$('#formalSearchTxt').val(keywords);
	}
	 if(keywords != "" && keywords != undefined){
		 $(window).dropload({afterDatafun: listData});
	 }
     $('#searchBtn').on('click',function(){
    	keywords = $('#formalSearchTxt').val();
    	if(keywords == ""){
    		alert("请输入搜索信息");
    		return;
    	}
        pageNum = 1;
        $('#goodsList').empty();
        $(window).dropload({afterDatafun: listData});
     });
     $(".menuTabs ul li").on("tap",function(){
 		var index = $(this).index();
 		if(index == 1){
// 			jems.goUrl('search-magazinelist.html?keywords='+encodeURI(encodeURI(keywords)));
 		}else{
 			jems.goUrl('search-list.html?keywords='+encodeURI(encodeURI(keywords)));
 		}
 	})
 })