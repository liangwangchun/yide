$(function () {
    var currentTopicId = location.href.split('?')[1].split('&')[0].split('=')[1];
    var topicList = ['种草CLUB', '评测LAB', '主题BLOG'];
    var 
        currentHeight, i = 1,
        pageNum = 1,totalPage=1;
    var currentScrollHeight = $(window).height();

    $('#topicTitle').text(topicList[currentTopicId - 4]);

    function loadData() {
        if(pageNum > totalPage){
			$("#loading").removeClass('loading').show().html('到底了,没有更多商品了');
			return ;
		};
        $.ajax({
            type: "get",
            url: msonionUrl + "magmain/list?parentId=" + currentTopicId + "&pageNum=" + pageNum,
            dataType: "json",
            beforeSend:function(){
				$("#loading").addClass('loading').show();
			},
            success: function (json) {
                if (json.data.length === 0) {
                    $('#findsMorelist').html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
                    $("#loading").hide();
                    return;
                }
                
                var data = {
                    data: json.data||[]
                };

                jetpl('#findMoreData').render(data, function (htmls) {
                    $("#findsMorelist").append(htmls);
                });
                totalPage = json.totalPage
                pageNum++;	
                //图片延迟加载插件引用
                $('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
                $("#loading").hide();
            }
        });
    }
    

    //产品列表数据加载
	$(window).dropload({afterDatafun: loadData});
    
});