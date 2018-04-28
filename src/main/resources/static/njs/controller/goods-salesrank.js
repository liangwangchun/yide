/**
 * 昨天销量top20
 */
var parHref = jems.parsURL(), letId = 0;
$(function(){
	letId=parHref.params.letId;
	if (letId == 0) {
		 jems.tipMsg("类别ID不能为空");
	}
    $.ajax({
        type : "post",
        data:{"letId":letId},
        url : msonionUrl+"saleTop/yestodayTop",
        dataType : "json",
        success:function(result){
        	if (result.errCode == 10000) {
        		console.log(JSON.stringify(result.data));
        		$(".mstitle").text(result.data.menu.name);
        		$(".mstitle").text(result.data.menu.name);
        		$(".muneImg").css('background-image', "url('"+msPicPath + result.data.menu.url + "')")
        		  if (result.data.saleTop != undefined && result.data.saleTop.length > 0) {
        			  var gettpl = $('#goodslistData').html(); 
  					jetpl(gettpl).render(result, function(html) {  
  						$('#goodsList').append(html);
  					});
                  } else {
                	  $("#goodsList").html("<p class='p15 tc f14'>暂无数据！</p>");
                  }
        	} else {
        		 jems.tipMsg(result.errMsg);
        	}
        }
    });
});   