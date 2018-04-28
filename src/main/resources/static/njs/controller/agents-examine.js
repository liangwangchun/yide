/**
 * 商务管理-审核管理
 * author:libz
 * 2017-04-24
 */
var ParHref = jems.parsURL( window.location.href );
var tmn = ParHref.params.tmn;			// 终端
var pageNum = 1;
var totalPage = 1;
var loadFlg = true;
var data = "";
$(function(){
	//获取用户银行信息
	lastRecord();
	selectAgentState();
});  

/**
 * 用户上一次账户信息
 */
function lastRecord(){
    var url = msonionUrl+"cash/queryBankAccount";
    $.ajax({
        url:url,
        type:"post",
        dataType:"json",
        success:function(result){
        	data = result.data;
        }
    });
}

/**查询代理商运营状态
 */
function selectAgentState(){
	$.ajax({
		type:"get",
		url:msonionUrl+"agentStore/suspendState",
		dataType:"json",
		success:function(data){
			if(data.errCode == "4001"){
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}else if(data.errCode == "10011"){
					jems.mboxMsg("升级代理商后可以访问！");
			}else if(data.agentState == 0){
				//审核列表
				$(window).dropload({afterDatafun: appylistData});
				 jems.backStore(); //返回店主中心 
			}else{
				jems.mboxMsg("暂时无法审核店铺，如有疑问请联系洋葱发动机")
			}
		}
	})
}

/**
 * 审核列表
 */
function appylistData() {
	var url = msonionUrl+"agentStore/applyList";
	var word = $("#word").val();
	if(word!='' && word != null && word != undefined){
		pageNum = 1;
	}
	$.ajax({
		type:"get",
		url: url,
		data:{"pageNo":pageNum,"word":encodeURI(encodeURI(word))},
		dataType:"json",
		beforeSend:function(){
			$("#loading").show();
		},
		success:function(data){
			var errCode = data.errCode;
        	if(errCode == '4001'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        	}else if(errCode == '4002'){
        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        		 return;
        	}else if(errCode == '4000'){
        		jems.tipMsg("无效的邀请码");
       		 	return;
        	}
        	
			var datas = {data:data.data};
        	var gettpl = $('#auditData').html();
            jetpl(gettpl).render(datas, function(html){
            	if(word!='' && word != null && word != undefined){
            		pageNum = 1;
            		$('#auditList').html(html);
            	}else{
            		if(pageNum == 1){
            			$('#auditList').html(html);
            			pageNum++;
            		}else{
            			$('#auditList').append(html);
            			pageNum++;
            		}
            	}
                
            });
			totalPage = data.totalPage;
			if(pageNum>totalPage){
				$("#loading").show().html('到底了,没有更多了');
			}else {
				setTimeout(function () {
					$("#loading").hide();
				}, 4000);
			}
			
			loadFlg = true;
		}
	});

};

/**
 * 确认申请
 */
function confirmThis(storeId,storeType){
    if(storeType == 2){
    	if(data!=null && data!="" && data!= undefined){
    		showDialog(storeId,storeType);
    	}else{
    		mox();
    	}
//    	var storeName= "服务商["+$("em[contact='"+storeId+"']").text();
    	return;
    }else if(storeType == 3){
    	var storeName= "店铺["+$("em[ref='"+storeId+"']").text();
    }
    mBox.open({
        width:"90%",
        content:"<p class='tc f16' style='width:100%'>是否确认"+storeName+"]的申请？</p>",
        closeBtn: [false],
        btnName:['确定','取消'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun : function(){
        	confirmThisAjax(storeId,storeType);
        }
    });
}

/**
 * 确认银行账户信息
 */
function showDialog(storeId,storeType){
	var banknamemsg = "<span>开户银行："+data.bank+"</span><br/>";
	var accountnomsg = "<span>"+"银行帐号："+data.cardNo+"</span><br/>";
	var accountnamemsg = "<span>帐户名称："+data.name+"</span><br/>";
	var msg = (banknamemsg+accountnomsg+accountnamemsg);
	msg += '<br/><span style="color:red">若帐号错误将无法提现，请仔细核对！您所获得的技术服务费在该服务商开通之后的3个工作日内将汇入以下该账号，请您确认!</span>'
    var lim = mBox.open({
        width:"90%",
        height:"40%",
        title:"确认您的返款账号",
        content:"<p class='listinfo f14' style='width:100%'>"+msg+"</p>",
        closeBtn: [false,1],
        btnName:['确定','修改'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun:function(){
        	confirmThisAjax(storeId,storeType);
            mBox.close(lim);
        },
        nofun:function(){
        	jems.goUrl("agent-bank-account.html");
        }
    });
}

/**
 * 一审通过
 * @param storeId
 * @param storeType
 */
function confirmThisAjax(storeId,storeType){
	var url = msonionUrl+"agentStore/confirmThis";
	$.ajax({
	    type : "post",
	    data :{"storeId":storeId},
	    url : url,
	    dataType : "json",
	    success:function(data){
	    	var errCode = data.code;
	    	var msg = data.msg;
	    	 if(errCode == '10000'){
	     		mBox.open({
	     			width:"60%",
	     			content:"<p class='tc f16' style='width:100%'>"+msg+"</p>",
	     			closeBtn: [false],
	     			btnName:['确定'],
	     			btnStyle:["color: #0e90d2;"],
	     			maskClose:false,
	     			yesfun : function(){
	     				location.reload();
	     			}
	     		});
	     		return;
			 }else if(errCode == '502'){
	             mBox.open({
	                 width:"60%",
	                 content:"<p class='tc f16' style='width:100%'>亲爱的洋葱小主，你的店铺已全部开通，请购买店铺之后才可确认，如有任何问题，请联系洋葱发动机！</p>",
	                 closeBtn: [false],
	                 btnName:['购买店铺','取消'],
	                 btnStyle:["color: #0e90d2;"],
	                 maskClose:true,
	                 yesfun : function(){
	                     jems.goUrl("agents-buy-shop.html");
	                 }
	             });
	             return;
	    	 }else if(errCode == '4001'){
	    		jems.goUrl(mspaths+"login.html?"+window.location.href);
	    	 }
	    		jems.tipMsg(msg);
	    		return;
	    }
	});
	}



/**
 *补充返款账号 
 */
function mox(){
	var msg = '<br/><span style="color:red">需要您先填写返款账号才可进行审核喔!</span>'
    var lim = mBox.open({
        width:"90%",
        height:"40%",
        title:"请补充您的返款账号",
        content:"<p class='listinfo f14' style='width:100%'>"+msg+"</p>",
        closeBtn: [false,1],
        btnName:['去填写','取消'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun:function(){
        	jems.goUrl(mspaths+"store/agent-bank-account.html");
            mBox.close(lim);
        },
        nofun:null
    });
}


/**取消开通申请
 * @param storeId 申请者ID
 * @param storeType
 */
function cancelThis(memberId,storeId,storeType){
    var url = msonionUrl+"agentStore/cancel";
    if(storeType == 2){
    	var storeName= "服务商("+$("em[contact='"+storeId+"']").text();
    }else if(storeType == 3){
    	var storeName= "店铺("+$("em[ref='"+storeId+"']").text();
    }
    $.ajax({
        type : "get",
        data :{"id":memberId},
        url : msonionUrl+"agentStoreOrder/getBatchRoad",
        dataType : "json",
        async:false,
        success:function(data){
        	var errCode = data.code;
        	var isMake = data.data;
        	 if(errCode == '10000'){
        		 if(isMake){
        			 mBox.open({
        			        width:"90%",
        			        content:"<p class='tc f16' style='width:100%'>是否确认删除"+storeName+")的申请？</p>",
        			        closeBtn: [false],
        			        btnName:['确定','取消'],
        			        btnStyle:["color: #0e90d2;"],
        			        maskClose:false,
        			        yesfun : function(){
        					    $.ajax({
        					        type : "post",
        					        data :{"storeId":storeId},
        					        url : url,
        					        dataType : "json",
        					        success:function(data){
        					        	var errCode = data.code;
        					        	var msg = data.msg;
        					        	 if(errCode == '10000'){
        					         		mBox.open({
        					         			width:"60%",
        					         			content:"<p class='tc f16' style='width:100%'>"+msg+"</p>",
        					         			closeBtn: [false],
        					         			btnName:['确定'],
        					         			btnStyle:["color: #0e90d2;"],
        					         			maskClose:false,
        					         			yesfun : function(){
        					         				location.reload();
        					         			}
        					         		});
        					         		return;
        					         	}else if(errCode == '4001'){
        					        		jems.goUrl(mspaths+"login.html?"+window.location.href);
        					        	}
        					        		jems.tipMsg(msg);
        					        		return;
        					        }
        					    });
        			        }
        			    });	
        			 
        		 }else{
        			 jems.tipMsg("您的小伙伴正在付款");
             		return;
        		 }
         	}
        		
        }
    });
}


/**
 * 确认开通
 */
function openThis(storeId){
    var url = msonionUrl+"agentStore/openThis";
    var storeName= $("em[ref='"+storeId+"']").text();
    mBox.open({
        width:"90%",
        content:"<p class='tc f16' style='width:100%'>请确认开通店铺["+storeName+"]</p>",
        closeBtn: [false],
        btnName:['确定','取消'],
        btnStyle:["color: #0e90d2;"],
        maskClose:false,
        yesfun : function(){
		    $.ajax({
		        type : "post",
		        data :{"storeId":storeId},
		        url : url,
		        dataType : "json",
		        success:function(data){
		        	var errCode = data.code;
		        	var msg = data.msg;
			       	 if(errCode == '10000'){
			         		mBox.open({
			         			width:"60%",
			         			content:"<p class='tc f16' style='width:100%'>"+msg+"</p>",
			         			closeBtn: [false],
			         			btnName:['确定'],
			         			btnStyle:["color: #0e90d2;"],
			         			maskClose:false,
			         			yesfun : function(){
			         				location.reload();
			         			}
			         		});
			         		return;
			      	}else if(errCode == '502'){
                        mBox.open({
                            width:"60%",
                            content:"<p class='tc f16' style='width:100%'>亲爱的洋葱小主，你的店铺已全部开通，请购买店铺之后才可操作，如有任何问题，请联系洋葱发动机！</p>",
                            closeBtn: [false],
                            btnName:['购买店铺','取消'],
                            btnStyle:["color: #0e90d2;"],
                            maskClose:true,
                            yesfun : function(){
                                jems.goUrl("agents-buy-shop.html");
                            }
                        });
                        return;
		        	 } else if(errCode == '4001'){
		        		jems.goUrl(mspaths+"login.html?"+window.location.href);
		        	}
		        		jems.tipMsg(msg);
		       		 	return;
		        }
		    });
        }
    });
}
