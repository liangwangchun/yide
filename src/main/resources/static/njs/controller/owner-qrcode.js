//JavaScript Document
/** 店铺信息 */

$(function(){
	// 获取店铺信息
	getStoreName();
	getStoreLink();

	/*  jeQrcode({
        qrCell:"erwmbox",
        text : msonionUrl+"tmn"+jems.parsURL( ).params.tmn+".html",
        size : 150,
        imgSrc:"http://m.msyc.cc/wx/nimages/qrcode_logo.png"
    });*/
})
/**
 * 设置店铺名称与邀请码
 */
function getStoreName(){
	var ParHref = jems.parsURL().params;
	var data = {'tmn':ParHref.tmn,"url": msonionUrl+"tmn"+jems.parsURL( ).params.tmn+".html"};
	$.ajax({
		url:msonionUrl+"store/storeInfo",
		type:'post',
		data:data,
		dataType:'json',
		success:function(result){
			if(result.errCode == 10000){
				$(".mt50").show();
				$('#storeName').text(result.data.storeName);
				$('#storeInv').text(result.data.storeCode);
				$('.qrcodeshowimg').attr("src","data:image/jpg;base64,"+result.data.img);
			}else{
				$(".mt50").hide();
			}

		}
	});
}


/**
 * 设置店铺链接
 */
function getStoreLink(){
	var reg=new RegExp("^http");    
	if (!reg.test(msonionUrl)){
		msonionUrl = "https:"+msonionUrl;
	}
	var ParHref =  msonionUrl+"tmn"+jems.parsURL().params.tmn+".html";
	document.getElementById("storeLink").innerHTML=ParHref;
}
