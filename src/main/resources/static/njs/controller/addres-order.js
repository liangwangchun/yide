/**
 @Js-name:addres-order.js
 @Zh-name:设置收货地址
 @Author:tyron
 @Date:2017-03-01
 */
var sodId = '';
var params = jems.parsURL().params;
$(function(){
	if(undefined != params.sodId){
		sodId = 	params.sodId;
	}
    $.ajax({
        type : "get",
        url : msonionUrl+"address/findAddress",
        dataType : "json",
        //jsonp:"callback",
        asyn:false,
        success:function(data){
            var gettpl = $('#indexData').html();
            jetpl(gettpl).render(data, function(html){
                $('#indexList').append(html);
            });
        },
        error:function(data){
            jems.tipMsg("network error!");
        }
    });
    $("#sureOrderAddress").on("tap", function() {
	    	if(undefined != params.sodId){
	    		jems.goUrl('addres-add.html?'+jems.parsURL().queryURL+"&sodId="+sodId) ;
	    	}else{
	        jems.goUrl('addres-add.html?'+jems.parsURL().queryURL) ;
	    	}
    });
    /*  $("#sureOrderAddress").on(isTap(), function() { 
     var addressId = "";
     var addressChecked = document.getElementsByName("radio-1-set");		 
     for(var i=0;i<addressChecked.length;i++){
     if(addressChecked[i].checked) {
     addressId = addressChecked[i].value;
     }
     }
     if (addressId == null || addressId == "" || typeof(addressId) == undefined){
     UsTips("先选择收货地址");
     return ;
     }
     $.ajax({
     type : "post",
     data : {"addressId":addressId},
     url : msonionUrl+"address/setOrderAddress",
     dataType : "json",
     asyn:false,
     success:function(data){
     if(data.flg == 2){
     goUrl(parsURL(window.location.href).queryURL);
     } else if (data.flg == 1 ){
     UsTips("登陆超时。");
     }else if (data.flg == 0 ){
     UsTips("保存失败。");
     }
     },
     error:function(data){
     UsTips("network error!");
     }
     });
     });*/
});
/**
 * 设置为默认收货地址
 * @param addressId 地址ID
 * @returns
 */
function defaultAddress(addressId){
	var datas = {"addressId":addressId};
	if(undefined != params.sodId){
		datas = {"addressId":addressId,'sodId':sodId}
		$.ajax({
	        type : "post",
	        data : datas,
	        url : msonionUrl+"app/address/defaultAddressAndSetOrderAddress/v1",
	        dataType : "json",
	        asyn:false,
	        success:function(result){
	            if(10000 == result.errCode){
	                jems.goUrl(jems.parsURL().queryURL);
	            }else{
	            		jems.tipMsg(result.errMsg);
	            		return;
	            }
	        },
	        error:function(data){
	            jems.tipMsg("network error!");
	        }
	    });
	}else{
	    $.ajax({
	        type : "post",
	        data : datas,
	        url : msonionUrl+"address/defaultAddress",
	        dataType : "json",
	        asyn:false,
	        success:function(data){
	            if(data.flg == 2){
	                jems.goUrl(jems.parsURL().queryURL);
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
}
/**	去修改地址页面 **/
function editAddress(obj){
	if(undefined != params.sodId){
		jems.goUrl("addres-edit.html?"+jems.parsURL().queryURL+"&addressId="+obj+"&sodId="+sodId);
	}else{
		jems.goUrl("addres-edit.html?"+jems.parsURL().queryURL+"&addressId="+obj);
	}
}
/**删除地址页面**/
function delAddress(addressId){
    mBox.open({
        width:"70%",
        //height:100,
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