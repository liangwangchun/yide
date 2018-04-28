/**
 @Js-name:goods-share.js
 @Zh-name:素材详情
 @Author:李柏真
 @Date:2017-06-09
 */
var params = "";
$(function(){
	var url = window.location.href;
	params = jems.parsURL(url).params;
	if (params.pmId == undefined){
		jems.tipMsg("参数有误!");
        return;
    }
	if (params.tmn == undefined){
		jems.tipMsg("参数有误!");
        return;
    }
	$.ajax({
        type : "post",
        data : params,
        url :  msonionUrl+"product/productMaterialInfo/v1",
        dataType : "json",
        asyn:false,
        success:function(result){
            if(10000 == result.errCode){
            	var materilaInfo = result.data;
            	if(materilaInfo.material.materialItemList != undefined && materilaInfo.material.materialItemList != 'undefined'){
            		var materialItemList = {data:materilaInfo.material.materialItemList};
                	jetpl("#materialItemListData").render(materialItemList, function(html){
                        $("#materialItemList").html(html);
                    });
            	}
            	$("#materialTitle").html(materilaInfo.material.title);
            	$("#materialContent").html(materilaInfo.material.content);
            	$("#productPic").attr('src',msPicPath+materilaInfo.productInfo.mainPicUrl);
            	$("#productContent").html(materilaInfo.productInfo.name);
            	$("#productPrice").html(jems.formatNum(materilaInfo.productInfo.freePrice));
            	$("#productTitle").html(materilaInfo.productInfo.name);
            	$("#goshare").on("click",function () {
					jems.goUrl("goods-details.html?id="+materilaInfo.productInfo.id);
                });
            	if(materilaInfo.memberRec != undefined && materilaInfo.memberRec != null){
            		if(materilaInfo.memberRec.memberHeadUrl != undefined && materilaInfo.memberRec.memberHeadUrl != null && materilaInfo.memberRec.memberHeadUrl != '' ){
            			$("#memberHeadPic").attr("src",materilaInfo.memberRec.memberHeadUrl);
            		}else{
            			$("#memberHeadPic").attr("src","http://img.51msyc.com/wx/nimages/share_logo.png");
            		}
            		if(materilaInfo.memberRec.memberName != undefined && materilaInfo.memberRec.memberName != null && materilaInfo.memberRec.memberName != '' ){
            			$("#memberName").html(materilaInfo.memberRec.memberName);
            		}else{
            			$("#memberName").html("匿名");
            		}
            	}
            	 //微信分享功能
                var title = materilaInfo.material.title,content = materilaInfo.material.content,picUrl = msPicPath+materilaInfo.productInfo.mainPicUrl;
                if(title && content && picUrl){
                    jems.wxShare(title, picUrl, content);
                }
            }else if(6012 == result.errCode){
            	jems.tipMsg("该状态下的素材不允许分享!");
                return;
            }
        },
        error:function(){
            jems.tipMsg("network error!");
        }

    });
})