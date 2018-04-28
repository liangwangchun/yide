/**
 @Js-name:logistics_detail.js
 @Zh-name:物流信息--国内配送
 @Author:tyron
 @Date:2015-08-19
 */
var  no ="";
var  com ="qf";
var  sodId ="";
$(function(){
    var params =  jems.parsURL(window.location.href).params;
    no = params.no;
    com = params.com;
    sodId =params.sodId;
    if (no == null || no == "" || no == "undefined"){
        foreign();
        return ;
    }
    if(com == null || com == "" || typeof(com) == undefined || com == "undefined"){
        com = "qf";
    }
    $.ajax({
        type : "post",
        data : {"com":com,"no":no},
        url : msonionUrl+"logistics/logisticsInfo?v_="+new Date().getTime(),
        dataType: "json",
        asyn:false,
        success:function(json){
            $(".loading").hide();
            json.data.no = no;
            var dats = {data:json.data};
            var nm = expComName(com);
            if (json.errCode == 0 ) {
                var gettpl = $('#indexData').html();
                $("#expressNo").text(json.data.no);
                $("#wulinfo").show();
                jetpl(gettpl).render(dats, function(html) {
                    $('#wulinfolist').append(html);
                    $("#logisticsCompany").text(nm);
                });
                if(json.data != "") $("#wulprogress").hide();
            } else{
                var nm = expComName(com);
                if(no == 'undefined'){
                    no = "暂无";
                    nm = "暂无";
                }
                $("#logisticsCompany1").text(nm);
                $("#logisticsCompany2").text(no);
                //$("#nocartInfo").text(result.data);

                $("#nocart").css({display: "block"});
            }
            foreign();
        }
    });
});
function foreign(){
    $.ajax({
        type : "post",
        data : {"sodId":sodId},
        url : msonionUrl+"foreign/logistics",
        dataType: "json",
        asyn:false,
        success:function(data){
            $(".loading").hide();
            if(data.dataList != "") $("#wulprogress").hide();
            var gettpl = $('#foreignData').html();
            jetpl(gettpl).render(data, function(html) {
                $('#wulinfolist').append(html);	
            });
        }
    });
}
function expComName(no){
    var name = "";
    switch (no){
        case "qf":  name = "全峰快递"; break;
        case "sf":  name = "顺丰快递"; break;
        case "sto": name = "申通快递"; break;
        case "yt":  name = "圆通快递"; break;
        case "yd":  name = "韵达快递"; break;
        case "tt":  name = "天天快递"; break;
        case "ems": name = "EMS快递"; break;
        case "zto": name = "中通快递"; break;
        case "ht":  name = "汇通快递"; break;
    }
    return name;
}
