/**
 @Js-name:payment.js
 @Zh-name:支付方式
 @Author:tyron
 @Date:2015-07-31
 */
var tmn  = "";
var sodNo = "";
var time;
var num = 0 ;
$(function(){
    tmn = jems.parsURL().params.tmn;
    sodNo  = jems.parsURL( ).params.sodNo;
    if(sodNo != '' || sodNo != 'undefined' || sodNo != null){
        startRun();
    }else{
        alert("发生错误");
        jems.goUrl("ucenter/members.html");
        return ;
    }
});
var resultType = {
    ok:"ok",
    error:"error",
    timeout:"timeout",
    waitting:"waitting"
}
function startRun(){
    $.ajax({
        type: "post",
        url : msonionUrl+"sodrest/findSodStaByNo",//等待生成
        data: {"sodNo":sodNo},
        success: function(data){//
            var d = eval("("+data+")");
            noresult();
            if(d.result == resultType.ok)
            {
                //alert("订单生成成功！");
                jems.goUrl("payment.html?sodId="+d.sodId)
                return ;
            }else if(d.result ==resultType.error){
                alert("发生错误");
                return ;
            }
        }
    });
    time = setTimeout("startRun()", 1000);
}
function stopRun(){
    clearTimeout(time);
}
function noresult(){
    num++;
    if(num>4){
        stopRun();
        mBox.open({
            width: "70%", 
            //height: 100,
            content: "<p class='tc listinfo f16' style='width:100%'>系统繁忙，请稍后尝试...</p>",
            closeBtn: [false, 1],
            btnName: ['确定'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false,
            yesfun : function(){
                jems.goUrl("ucenter/members.html");
            }
        });
        return;
    }
}