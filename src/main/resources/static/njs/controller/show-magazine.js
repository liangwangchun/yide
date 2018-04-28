var ParHref = jems.parsURL(),
    param = ParHref.params;

$(function () {
    var magUrl = msonionUrl+"magmain/view?id="+param.id+"&tmn="+param.tmn;
    $.ajax({
        type : "get",
        url : magUrl,
        cache:true,
        dataType : "json", 
        success:function(json) {
            var mzlistdata = {data: json.magazineList}, 
                relatedData = {data: json.productsList.sort(jems.compare('qty'))};
            //$("#magazineTitle").html(json.title);
            jetpl("#magazineDetails").render(json, function (html) {
                $('#magazineCont').html(html);
            });
            jetpl("#magazinelistData").render(mzlistdata, function (html) {
                $('#magazineList').html(html);
            });
            var rets = relatedData.data;
            //抢货列表
            if(rets.length > 0 ) {
                var reHtml = '', relen = rets.length >= 3 ? 3 : rets.length;
                for (var i=0; i<relen; i++) {
                    reHtml += '<img class="mr8" src="'+msPicPath+rets[i].mainPicUrl+'?x-oss-process=image/resize,w_120">';
                }
                $("#magshuoluo").prepend(reHtml);
                jetpl("#godsrecomData").render(relatedData, function(html){
                    $('#godsrecom').append(html);
                });
            }else{
                $("#showMore").parent().css({'display':'none'});
            }
            relatedProducts(rets.length);
			//获取阅读与点赞数
            $.get(msonionUrl+'magmain/getMag?id='+param.id, function(res){
                $("#browse").html(res.browseCount.toString());
                $("#thumbup").html(res.thumbUpCount.toString());
            },"json");
            //增加点赞数
            $("#thumbup").one("click",function () {
                var that = $(this);
                that.removeClass("icon-zan g9").addClass("icon-zan-pu purple");
                $.getJSON(msonionUrl+'magmain/updateThumbUp?id='+param.id, function(res){
                    that.text(res.data);
                });
            });
            $("#showcontent a").each(function () {
                var that = $(this), listval = that.attr("href");
                that.attr("data-url",listval).removeAttr("href").css({display:"block"});
                that.on("click",function () {
                    var _this = $(this), valurl = _this.attr("data-url");
                    jems.goUrl(valurl);
                })
            });
            //微信分享
            jems.wxShare(json.title,msPicPath+json.cover);
        }
    });
    jems.fixMenu();
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 55});
});
//相关产品切换显示
function relatedProducts(len){
    $("#showMore").on('click',function(){
        $(this).hide().parent().addClass("fixrecom");
        $("#godsrecom").show();
        $("#recommask").show();
        $(this).parent().css('bottom',0);
        if(len > 3){
            var showHeight = $('#godsrecom li').height(), diffHeight = len >= 4 ? 30 : 0;
            $("#godsrecom").css({height:showHeight*4+diffHeight,overflow:'auto'});
        }
    });
    $("#recommask").on('click',function(){
        $(this).hide();
        $(this).parent().removeClass("fixrecom");
        $("#godsrecom").hide();
        $("#recommask").hide();
        $("#showMore").show().parent().css('bottom','');
    });
}