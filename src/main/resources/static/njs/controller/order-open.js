/**
 @Js-name:order-open.js
 @Zh-name:物流信息
 @Date:2017-03-03
 */
var sodId ="", params =  jems.parsURL().params;
$(function(){
    sodId = params.sodId;
    var  countPrice = params.countPrice;
    if (sodId == null || sodId == "" || typeof(sodId) == undefined){
        UsTips("订单未选中，返回上一步");
        return ;
    }
    $.ajax({
        type : "post",
        data : {"sodId":sodId},
        url : msonionUrl+"logistics/product/v2?_="+new Date().getTime(),
        //url : msonionUrl+"subSodrest/findSubSodrecBySodId?_="+new Date().getTime(),
        dataType: "json",
        asyn:false,
        success:function(json){
            var sodAds = json.sodRec.sodAddress,
                ads = json.sodRec.addresses;
            $("#msname").text(sodAds ? sodAds.addressUser : ads.sodAddressUser);
            $("#msphone").text(sodAds ? sodAds.addressMobile : ads.sodAddressTel);
            var myAds = sodAds ? (sodAds.provinceAreaRec.areaName+sodAds.cityAreaRec.areaName+sodAds.regionAreaRec.areaName+sodAds.addressNo) :
                (ads.provinceAreaRec.areaName+ads.cityAreaRec.areaName+ads.regionAreaRec.areaName+ads.sodAddressNo)
            $("#msaddress").text(myAds);
            $("#mssodNo").text(json.sodRec.sodNo);

            var datas = {data:json};
            if(json.flag == 0) {
                jetpl('#orderOpenData').render(datas, function(html) {
                    $('#orderOpen').html(html);
                });
            } else {
                jems.tipMsg(json.errMsg);
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
});

//查看物流详细
function goDetail(orderId,type,expComNo,expNo) {
    if (orderId == null || orderId == "" || orderId == "undefined" || type == null || type == "" || type == "undefined"){
        jems.tipMsg("network error!");
        return ;
    }
    var  no ="", com ="qf", sodId ="";
    no = expNo;
    com = expComNo;
    sodId = params.sodId;
    mBox.open({
        title:['物流信息'],
        boxtype: 2,
        closeBtn:[ true, 1 ],
        height:"50%",
        padding:"0",
        content: '<div style="background-color: #f8f8f8;" id="wlDetailcon"></div>',
        conStyle: 'position:fixed; bottom:0; left:0; width:100%; padding:0; border:none;background-color:#fff;',
        success:function () {
            var wlDetail = $('#wlDetail').html();
            $('#wlDetailcon').append(wlDetail);
            $("#mytips").html(cartoedertip);
            appendmbox(orderId,type);
        }
    });
    function appendmbox(orderId,type) {
        if (no == null || no == "" || no == "undefined"){//50仓则只查询此处
            foreign(orderId,type);
            return ;
        }
        if(com == null || com == "" || typeof(com) == undefined || com == "undefined"){
            com = "qf";
        }
        $.ajax({
            type : "post",
            data : {"com":com,"no":no,"sodId":sodId},
            url : msonionUrl+"logistics/logisticsInfo?v_="+new Date().getTime(),
            dataType: "json",
            asyn:false,
            success:function(json){
                $("#wlloading").hide();
                json.data.no = no;
                var dats = {data:json.data};
                var nm = expComName(com);
                if (json.errCode == 0 ) {
                    $("#expressNo").text(json.data.no);
                    $("#wulinfo").show();
                    jetpl('#foreignData1').render(dats, function(html) {
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
                foreign(orderId,type);
            }
        });
        function foreign(orderId,type){
            $.ajax({
                type : "post",
                data : {"sodId":orderId,"type":type},
                url : msonionUrl+"foreign/logistics/v2",
                dataType: "json",
                asyn:false,
                success:function(json){
                    $(".loading").hide();
                    var dats = {data:json};
                    if(json.dataList != "") $("#wulprogress").hide();
                    jetpl('#foreignData2').render(dats, function(html) {
                        $('#wulinfolist').append(html);
                    });
                }
            });
        }
        function expComName(no){
            var name = "";
            switch (no){
                case "yzgn": name = "EMS快递"; break;
                case "qf":  name = "全峰快递"; break;
                case "sf":  name = "顺丰快递"; break;
                case "sto": name = "申通快递"; break;
                case "yt":  name = "圆通快递"; break;
                case "yd":  name = "韵达快递"; break;
                case "tt":  name = "天天快递"; break;
                case "ems": name = "EMS快递"; break;
                case "zto": name = "中通快递"; break;
                case "ht":  name = "百世快递"; break;
                case "db":  name = "德邦快递"; break;
            }
            return name;
        }
    }
}