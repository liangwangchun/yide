
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
                relatedData = {data: json.productsList};
            //$("#magazineTitle").html(json.title);
            jetpl("#magazineDetails").render(json, function (html) {
                $('#magazineCont').html(html);
            });

            //获取阅读与点赞数
            $.get(msonionUrl+'magmain/getMag?id='+param.id, function(res){
                $("#browse").html(res.browseCount.toString());
                $("#thumbup").html(res.thumbUpCount.toString());
            },"json");
            //增加点赞数
            $("#thumbup").one("click",function () {
                var that = $(this);
                $.getJSON(msonionUrl+'magmain/updateThumbUp?id='+param.id, function(res){
                    that.text(res.data);
                });
            });
            jems.wxShare(json.title,msPicPath+json.cover);
        }
    });
    jems.fixMenu();
    $(window).goStick({fixed:"fixed",btnCell:"#gotop",posBottom: 55});
});