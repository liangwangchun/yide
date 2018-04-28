/**
 @Js-name:home.js
 @Zh-name:会员中心
 @Author:tyron
 @Date:2017-03-08
 */
$(function(){

    $("#deltext").on("click",function(){
        if($("#deltextBtn").is(":visible")){
            $(this).text("编辑");
            $("#deltextBtn").hide();
            $("#indexList li .delete").each(function(){
                $(this).addClass("hide").removeClass("show");
            });
        }else{
            $(this).text("完成");
            $("#deltextBtn").show();
            $("#indexList li .delete").each(function(){
                $(this).addClass("show").removeClass("hide");
            });
        }
    })
    $.ajax({
        type : "post",
        url : msonionUrl+"message/findArrivalMessage?_="+new Date().getTime(),
        dataType : "json",
        success:function(data){
            var json = {data:data}
            if(json == 1){
                jems.goUrl("login.html")
            } else if (json == ""){
                $("#no_record").css({display: "block"});
            }else{
                var gettpl = $('#indexData').html();
                jetpl(gettpl).render(json, function(html){
                    $('#indexList').append(html);
                });
            }
            $(window).goTops({toBtnCell:"#gotop",posBottom:50});
        }
    });
    //返回店主中心 
    jems.backStore();

});
/**
 *
 * @param Lid 商品id
 * @param Mid 信息id
 * @param isRead 0未读，1已读
 */
function goDetails(Lid,Mid,isRead,type,parentId){
    if (isRead == 0) {
        $.ajax({
            type : "post",
            data : {"Mid":Mid},
            url : msonionUrl+"message/updateIsRead?_="+new Date().getTime(),
            dataType : "text",
            success:function(){
                //alert(11);
                //alert(data);
            }
        });
    }
    Lid = type == 1 ? parentId :Lid;
    jems.goShow(Lid,type);
}

/**
 * 删除选中数据
 * @returns
 */
function delMessageData(){
    var messageIds = "";
    $('input[name="checkBoxData"]:checked').each(function(){
        messageIds += $(this).val()+',';
    });
    if('' == messageIds || undefined == messageIds || messageIds.length <= 0){
        jems.tipMsg("请选择要删除的数据");
        return;
    }
    messageIds = messageIds.substring(0,messageIds.length-1);
    $.ajax({
        type : "get",
        data: {"messageIds":messageIds},
        url : msonionUrl+"app/message/delMessageData/v1",
        dataType : "json",
        success:function(result){
            if(10000 == result.errCode){
                mBox.open({
                    //width:"80%",
                    content:result.errMsg,
                    closeBtn: [false],
                    btnName:['确定'],
                    btnStyle:["color: #0e90d2;"],
                    maskClose:false,
                    yesfun : function(){
                        window.location.reload();
                    }
                })
            }else{
                jems.tipMsg("网络异常，请稍后再试！");
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
}


