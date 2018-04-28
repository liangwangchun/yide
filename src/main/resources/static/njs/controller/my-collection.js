/**
 @Js-name:my-collection.js
 @Zh-name: 收藏夹
 @Author:tyron
 @Date:2017-02-28
 */
var tmn  ="";
$(function(){
    tmn= jems.parsURL().params.tmn;
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
    //产品列表数据加载
    $(window).dropload({afterDatafun: showCollecList});

    //按钮点击时的文本切换
    $("#deltext").on("tap",function(){
        if($("#collectfx").is(":visible")){
            $(this).text("编辑");
            $(document.body).css({"padding-bottom":""});
            $("#goodscollbox li .delbtnmask").each(function(){
                $(this).hide();
            });
            $("#collectfx").hide();

        }else{
            $(this).text("完成");
            $(document.body).css({"padding-bottom":"45px"});
            $("#goodscollbox li .delbtnmask").each(function(){
                $(this).show();
            });
            $("#collectfx").show();
        }
    });
    //删除我收藏的商品
    $("#collectfx").on("tap",function(){
        var checkIds = $("#formdata").serialize();
        if(checkIds.length  <= 0){
        	jems.mboxMsg("请先选择删除的产品！");
            return;
        };

        $.ajax({
            type : "POST",
            dataType: "json",
            data : checkIds,
            url : msonionUrl+"myatten/delete",
            success:function(data){
                //表示未删除任何记录，大于0表示删除成功！
                if (data.state == 0){
                    jems.mboxMsg("没有要择删除的产品！");
                }else if(data.state>0){
                    jems.mboxMsg("删除成功！");
                    //移除被删除的原素
                    $(":checked").parents("li").remove();
                    //判断收藏夹中是否还有商品，如果没有则显示提示
                    if($("#goodscollbox").children().length == 0){
                        $("#nolistcollect").css({display:"block"});
                        $("#collectfx").hide();
                    }
                }
            },
            error:function(data){
            	jems.tipMsg("network error!");
            }
        });
    })


    //收藏的商品列表数据加载
    function showCollecList(){
        if(pageNum>totalPage){ return; }
        loadFlg=false;
        $.ajax({
            type : "get",
            url : msonionUrl+"myatten/list?pageNo="+pageNum,
            dataType : "json",
            //jsonp:"callback",
            success:function(data){
                if(data.total == 0){
                    $("#nolistcollect").css({display:"block"});
                }else{
                    data.tmn = tmn;
                    var gettpl = $('#goodscollData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#goodscollbox').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                }
            },
            error:function(data){
            	jems.tipMsg("network error!");
            }
        });
    }

});