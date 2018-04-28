var ParHref = jems.parsURL();
$(function () {
	// 记录当前的值并回滚到对应的位置
	keepReconder();
	setTimeout(function () {
	    window.addEventListener('scroll', that.watchScroll, false);
	}, 1000)
    $.ajax({
        type : "get",
        url :msonionUrl+"app/configs/hot/v1?tmn="+ParHref.params.tmn,
        cache:true,
        dataType : "json",
        success:function(json) {
            var  recommenddata={data:json.recommendList},
                 newListdata ={data:json.newList};
            jetpl("#recommendData").render(recommenddata, function(html){
                $('#recommendList').html(html);
            });  

            jetpl("#newListData").render(newListdata, function(html){
                $('#newList').html(html);
            });
            jems.wxShare("洋葱OMALL"+json.comingTime+"上架清单");
        }
    });
	jems.parsURL(location.href).file == "restock-list.html"?$(".tabNav span").eq(0).addClass("on"):$(".tabNav span").eq(1).addClass("on")
    //头部标签切换
    $(".tabNav span").on("click",function () {
        var _this = $(this),idx = _this.index();
        $(".tabbox_"+idx).show().siblings().hide();
        _this.addClass("on").siblings().removeClass("on");
        if(idx == 0){
        	jems.parsURL(location.href).file == "restock-list.html"?'':jems.goUrl('restock-list.html');
        }else if(idx == 1){
        	jems.parsURL(location.href).file == "restock-list-newproduct.html"?'':jems.goUrl('restock-list-newproduct.html');
        }
    });
}) ;  

// 记录当前的值并回滚到对应的位置
function keepReconder(){
	var currentScrollY ;
	currentScrollY = jems.parsURL(location.href).file == "restock-list.html"?(sessionStorage.getItem("restock-list")?sessionStorage.getItem("restock-list"):0):(sessionStorage.getItem("restock-list-newproduct")?sessionStorage.getItem("restock-list-newproduct"):0)
	
	document.body.scrollTop = parseInt(currentScrollY);
	document.documentElement.scrollTop = parseInt(currentScrollY);
}
// 记录滚动条的位置
function watchScroll(){
	var walker = window.scrollY;
	jems.parsURL(location.href).file == "restock-list.html"?sessionStorage.getItem("restock-list",walker):sessionStorage.getItem("restock-list-newproduct",walker)
	
}
