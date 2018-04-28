/***
 * update time 2017-02-17
 * author:libz
 * 修改内容：
 *	添加app免登陆获取授权证书
 */
var params = jems.parsURL( window.location.href ).params;

$(function(){
//	if(params.client == 'iOS' || params.client == 'Android'){
//		appPost();//app请求（ios和Android）
//	}else{
//		webGet();//web请求
//	}
//	
	 var ua = navigator.userAgent.toLowerCase();
	 var isAnIos = /android|iphone|ipad|ipod/.test(ua);
	 if(ua.match(/MicroMessenger/i) == "micromessenger" || !isAnIos) {
		 webGet();//web请求
	 }else{
	     
		 appPost();//app请求（ios和Android）
	 }
	
	
});

function webGet(){
    $.ajax({
        type:'get',
        url:msonionUrl+"store/getPartStoreInfo?aus="+new Date().getTime(),
        dataType:'json',
        success:function(result){
            if(result.is_success == '-1'){
                jems.goUrl(mspaths+"login.html?"+window.location.href);
            }else{
                // 显示授权内容
                var digit = function(num) {
                    return num < 10 ? "0" + (num | 0) :num;
                };
                // 拆分时间
                var ret = result.storeCheckTime.match(/\w+|d+/g),tdate = new Date(), year = tdate.getFullYear(), endYear;
                var endDateStr = parseInt(year+digit(ret[1]).toString()+digit(ret[2]).toString()),
                    danDateStr = parseInt(year+digit(tdate.getMonth()+1).toString()+digit(tdate.getDate()).toString());
                // 判断时间
                if(year == ret[0]){
                    endYear = parseInt(ret[0])+1;
                }else{
                    if(endDateStr < danDateStr){
                        endYear = year+1;
                    }else{
                        endYear = year;
                    }
                }
                $("#sqtype").text(result.storeType);
                $("#sqstoreContact").text(result.storeContact);
                $("#sqstoreName").text(result.storeName);
                $("#sqtime").html('<em>'+ret[0]+'</em>年<em>'+ret[1]+'</em>月<em>'+ret[2]+'</em>日至<em>'+endYear+'</em>年<em>'+ret[1]+'</em>月<em>'+ret[2]+'</em>日');
            }
        }
    });
}


function appPost(){
	$.ajax({
        type:'POST',
        url:msonionUrl+"app/store/getPartStoreInfo/v1",
        dataType:'json',
        data:{"uid":params.uid,"msToken":params.msToken,"client":params.client},
        success:function(result){
        	if (result.errCode != 10000) {
				return ;
			}
            // 显示授权内容
            var digit = function(num) {
                return num < 10 ? "0" + (num | 0) :num;
            };
            // 拆分时间
            var ret = result.data.storeCheckTime.match(/\w+|d+/g),tdate = new Date(), year = tdate.getFullYear(), endYear;
            var endDateStr = parseInt(year+digit(ret[1]).toString()+digit(ret[2]).toString()),
                danDateStr = parseInt(year+digit(tdate.getMonth()+1).toString()+digit(tdate.getDate()).toString());
            // 判断时间
            if(year == ret[0]){
                endYear = parseInt(ret[0])+1;
            }else{
                if(endDateStr < danDateStr){
                    endYear = year+1;
                }else{
                    endYear = year;
                }
            }
            $("#sqtype").text(result.data.storeType);
            $("#sqstoreContact").text(result.data.storeContact);
            $("#sqstoreName").text(result.data.storeName);
            $("#sqtime").html('<em>'+ret[0]+'</em>年<em>'+ret[1]+'</em>月<em>'+ret[2]+'</em>日至<em>'+endYear+'</em>年<em>'+ret[1]+'</em>月<em>'+ret[2]+'</em>日');
        }
    });
}