/**
 * Created by my on 2017/2/17.
 */
/**
 @Js-name:addres-list.js
 @Zh-name:地址列表
 @Author:tyron
 @Date:2017-02-17
 */
$(function(){
    $.ajax({
        type : "get",
        url : msonionUrl+"address/findAddressNoJSONP?_"+new Date().getTime(),
        dataType : "json",
        //jsonp:"callback",
        asyn:false,
        success:function(json){
            if (json.flg == 1) {
                jems.goUrl("../login.html?"+window.location.href);
            }
            if(json == ""){
                $("#myorde_nocart").css({display: "block"});
            } else{
                var datas = {data:json};
                var gettpl = $('#indexData').html();
                jetpl(gettpl).render(datas, function(html){
                    $('#indexList').append(html);
                });
            }
        },
        error:function(data){
            jems.mboxMsg("network error!");
        }
    });

});
/**
 * @param addressId  地址id
 * @param addressType 地址类型，默认地址不能删除
 */
function delAddress(addressId){
    mBox.open({
        width:"70%",
        //height:"100px",
        content:"<p class='tc listinfo f16' style='width:100%'>确定要删除吗？</p>",
        closeBtn: [false,1],
        btnName:['确定', '取消'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun : function(){
            $.ajax({
                type : "post",
                data : {"addressId":addressId},
                url : msonionUrl+"address/delAddress",
                dataType : "json",
                asyn:false,
                success:function(data){
                    if(data.flg == 1){
                        jems.tipMsg("删除成功。");
                        window.location.reload()
                    } else {
                        jems.tipMsg("删除失败。");
                    }
                },
                error:function(data){
                    jems.tipMsg("network error!");
                }
            });
        } ,
        nofun :  null
    });
}
function defaultAddress(addressId){
    $.ajax({
        type : "post",
        data : {"addressId":addressId},
        url : msonionUrl+"address/defaultAddress",
        dataType : "json",
        asyn:false,
        success:function(data){
            if(data.flg == 2){
                jems.goUrl("addres-list.html");
            } else if (data.flg == 1 ){
                jems.tipMsg("登陆超时。"); 
            }else if (data.flg == 0 ){
                jems.tipMsg("保存失败。");
            }
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
}