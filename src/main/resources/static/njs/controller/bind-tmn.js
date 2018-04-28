/** 
@Js-name:upgrade-merchants.js
@Zh-name:升级为商家
 */
var tmn;
$(function(){
	// 提交请求
	tmn = jems.parsURL(window.location.href).params.tmn;
	$("#confirmBtn").on('tap',confirmBtn);
});
function confirmBtn() {
	var fromCode = $("#fromCode").val();
    $.ajax({
        type:'post',
        url:msonionUrl+"store/codebytmn?code="+fromCode,
        dataType:'json',
        async:false,
        success:function(result){
            if(result.errCode == 0){
                mBox.open({
                    width:"70%",
                    content:"<p class='tc f16' style='width:100%'>确认该邀请码店铺："+result.storeName+"</p>",
                    closeBtn: [false],
                    btnName:['确认','取消'],
                    btnStyle:["color: #0e90d2;"],
                    maskClose:false,
                    yesfun : function(){
                  	  bind(fromCode);
                    }
                });
            }else {
            	jems.tipMsg(result.errMsg);
            	return; 
            }
        },
        error:function(msg,as){
        		jems.tipMsg("网络异常，请重试");
        		return;
        }
    });
}

function load(){
	location.reload(false)
}	

/**
 * 校验邀请码是否有效并返回信息
 * @param code
 */
function bind(code){
	$.ajax({
		type:'post',
		url: msonionUrl+"store/bindStoreCode",
		data:{"code":code},
		dataType:'json',
		async:false,
		success:function(data){
			if(data.errCode == 4001){
	       		mBox.open({
        			//width:"80%",
        			content:data.errMsg,
        			closeBtn: [false],
        			btnName:['确定'],
        			btnStyle:["color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				jems.goUrl(mspaths + "login.html?" + msonionUrl + "wx/ucenter/members.html?tmn="+tmn);
        			}
        		});
				return;
			}else if(data.errCode == 10000){
	       		mBox.open({
        			//width:"80%",
        			content:data.errMsg,
        			closeBtn: [false],
        			btnName:['确定'],
        			btnStyle:["color: #0e90d2;"],
        			maskClose:false,
        			yesfun : function(){
        				jems.goUrl(mspaths + "login.html?" + msonionUrl + "wx/ucenter/members.html?tmn="+data.tmnId);
        			}
        		});
				
			}else{
				jems.tipMsg(data.errMsg);
				return;
			}
		}
	});
}
