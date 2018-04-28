/***
 * 洋葱体验馆
 * libz
 */
var params =  jems.parsURL().params;
var tmn = params.tmn;
var memberInfo;
$(function() {

	//获取用户信息
	memberInfo = getMemberInfo();
	if(memberInfo == undefined){
		jems.goUrl(mspaths+"login.html?"+window.location.href);
	}
	// 加载省份列表
	getArea(0,'province');
	// 加载城市列表
	$("#province").change(function(){
		var val = $(this).val();
		$("#city").empty().append("<option value=''>请选择城市</option>");
		$("#county").empty().append("<option value=''>请选择区县</option>");
		if(val != 0 && val != '')
			getArea(val,'city');
	});
	// 加载区县列表
	$("#city").change(function(){
		var val = $(this).val();
		$("#county").empty().append("<option value=''>请选择区县</option>");
		if(val != 0 && val != '')
			getArea(val,'county');
	});
	getExperienceInfo();//获取体验馆信息

});

/**
 * 获取体验馆详情
 */
function getExperienceInfo(){
	//获取用户信息
	//var memberInfo = getMemberInfo();
	if(memberInfo == undefined){
		jems.goUrl(mspaths+"login.html?"+window.location.href);
	}
	$.ajax({
        type:'get',
        url: msonionUrl+"experienceHell/getExperienceById",
        data:{"uid":memberInfo.memberId,"client":"web","msToken":memberInfo.msToken},
        dataType:'json',
        success:function(data){
           var errCode = data.errCode;
           if(errCode == 4001 || errCode == 4002 || errCode == 4003 || errCode == 4004){
        	   jems.goUrl(mspaths+"login.html?"+window.location.href);
           }else if(errCode == 4008){
        	   mBox.open({
	           		width:"80%",
	           		content:"<div class='jew100 tc'>您的帐号在其它设备登录，请重新登录!</div>",
	           		closeBtn: [false],
	           		btnName:['确定'],
	           		btnStyle:["color: #0e90d2;"],
	           		maskClose:false,
	           		yesfun : function(){
	           			jems.goUrl(mspaths+"login.html?"+window.location.href);
	           		}
           		});
        	   
           }else if(errCode == 10011){
        	   jems.mboxMsgIndex("您没有权限操作次功能");
        	   return;
           }else if(errCode == 10086){
        	   jems.mboxMsgIndex("网络异常，请稍后再试!");
        	   return;
           }
           var experienceInfo = data.data;
           if(null != experienceInfo){
        	   if(experienceInfo.state > 0 && experienceInfo.state < 4){
        		   $("#experienceType").val(experienceInfo.type).attr("disabled","disabled");
            	   $("#experienName").val(experienceInfo.name).attr("readonly","readonly");
            	   $("#experienTel").val(experienceInfo.tel).attr("readonly","readonly");
            	   $("#experienEmail").val(experienceInfo.email).attr("readonly","readonly");
            	   getArea(experienceInfo.sareaId,'city',experienceInfo.careaId);
    			   getArea(experienceInfo.careaId,'county',experienceInfo.xareaId);
    			   $("#city").attr("disabled","disabled");
    			   $("#county").attr("disabled","disabled");
    			   // 处理地区级联
    			   $("#province").val(experienceInfo.sareaId).attr("disabled","disabled");
            	   $("#experienAddress").val(experienceInfo.address).attr("readonly","readonly");
            	   $("#experienAppTime").val(experienceInfo.applyTime).attr("readonly","readonly");
            	   $("#experienOpenTime").val(experienceInfo.openTime).attr("readonly","readonly");
            	   if(experienceInfo.pic1Url != null && experienceInfo.pic1Url != undefined && experienceInfo.pic1Url != ""){
            		   $("#expupload li").eq(0).find("span").css({"background-image": "url(" + experienceInfo.pic1Url + ")"});
            	   }
            	   if(experienceInfo.pic2Url != null && experienceInfo.pic2Url != undefined && experienceInfo.pic2Url != ""){
            		   $("#expupload li").eq(1).find("span").css({"background-image": "url(" + experienceInfo.pic2Url + ")"});
            	   }
            	   if(experienceInfo.pic3Url != null && experienceInfo.pic3Url != undefined && experienceInfo.pic3Url != ""){
            		   $("#expupload li").eq(2).find("span").css({"background-image": "url(" + experienceInfo.pic3Url + ")"});
            	   }
            	   if(experienceInfo.pic4Url != null && experienceInfo.pic4Url != undefined && experienceInfo.pic4Url != ""){
            		   $("#expupload li").eq(3).find("span").css({"background-image": "url(" + experienceInfo.pic4Url + ")"});
            	   }
            	   if(experienceInfo.pic5Url != null && experienceInfo.pic5Url != undefined && experienceInfo.pic5Url != ""){
            		   $("#expupload li").eq(4).find("span").css({"background-image": "url(" + experienceInfo.pic5Url + ")"});
            	   }
            	   if(experienceInfo.pic1Url != null && experienceInfo.pic1Url != undefined && experienceInfo.pic1Url != ""){
            		   $("#pic1UrlInput").val(experienceInfo.pic1Url);
            	   }
            	   if(experienceInfo.pic2Url != null && experienceInfo.pic2Url != undefined && experienceInfo.pic2Url != ""){
            		   $("#pic2UrlInput").val(experienceInfo.pic2Url);
            	   }
            	   if(experienceInfo.pic3Url != null && experienceInfo.pic3Url != undefined && experienceInfo.pic3Url != ""){
            		   $("#pic3UrlInput").val(experienceInfo.pic3Url);
            	   }
            	   if(experienceInfo.pic4Url != null && experienceInfo.pic4Url != undefined && experienceInfo.pic4Url != ""){
            		   $("#pic4UrlInput").val(experienceInfo.pic4Url);
            	   }
            	   if(experienceInfo.pic5Url != null && experienceInfo.pic5Url != undefined && experienceInfo.pic5Url != ""){
            		   $("#pic5UrlInput").val(experienceInfo.pic5Url);
            	   }
        	   }else{
        		   $("#experienceType").val(experienceInfo.type);
            	   $("#experienName").val(experienceInfo.name);
            	   $("#experienTel").val(experienceInfo.tel);
            	   $("#experienEmail").val(experienceInfo.email);
            	   getArea(experienceInfo.sareaId,'city',experienceInfo.careaId);
    			   getArea(experienceInfo.careaId,'county',experienceInfo.xareaId);
    			   // 处理地区级联
    			   $("#province").val(experienceInfo.sareaId);
            	   $("#experienAddress").val(experienceInfo.address);
            	   $("#experienAppTime").val(experienceInfo.applyTime);
            	   $("#experienOpenTime").val(experienceInfo.openTime);
                   mDate({
                       'trigger': '#experienAppTime', /*选择器，触发弹出插件*/
                       'type': 'date',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
                       'minDate':'1900-1-1',/*最小日期*/
                       'maxDate':new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),/*最大日期*/
                       'onSubmit':function(){/*确认时触发事件*/
                           //var theSelectData=calendar.value;
                       },
                       'onClose':function(){/*取消时触发事件*/
                       }
                   });
                   mDate({
                       'trigger': '#experienOpenTime', /*选择器，触发弹出插件*/
                       'type': 'date',/*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
                       'minDate':'1900-1-1',/*最小日期*/
                       'maxDate':'2020-12-12',/*最大日期*/
                       'onSubmit':function(){/*确认时触发事件*/
                           //var theSelectData=calendar.value;
                       },
                       'onClose':function(){/*取消时触发事件*/
                       }
                   });
        	   }
        	   
        	   $("#experienceId").val(experienceInfo.experienceHellId);
        	   $("#experienceStat").val(experienceInfo.state);
        	   checkState(experienceInfo.state);//检查状态
               
           }
        }
    });
}

/**
 * 检测状态
 * 图片上传
 * @param applyState
 */
function checkState(applyState){
	//var memberInfo = getMemberInfo();
//	alert("checkState===>>>:"+memberInfo.memberId)
	if(memberInfo == undefined){
		jems.goUrl(mspaths+"login.html?"+window.location.href);
	}
	//如果审核不通过显示下面提
    if (applyState == -1){
        $("#extips").text("* 未达条件申请不通过");
    }else if(applyState == -2){
    	$("#extips").text("* 设计审核不通过");
    }
    //如果申请状态applyState 为0或4的 URL
    //var saveUrl = msonionUrl+"experienceHell/"+ ((applyState == 0 || applyState == 4) ? "save":"update");
    var picUrl = "";
    //如果通过审核，即可以上传图片
    if (applyState > 0 && applyState <2){
        $("#expic").show();
        $("#expupload li").on("change", "input", function () {
        	var filesVal= this.files[0],nameVal = $(this).attr("name");
            var objUrl = getObjectURL(filesVal);
            if (objUrl) $(this).prev().css({"background-image": "url(" + objUrl + ")", "background-color": "#fff"});
           
            function getObjectURL(file) {
                var url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            }
            var form = new FormData();
            form.append("uid",memberInfo.memberId);
            form.append("client","web");
            form.append("msToken",memberInfo.msToken);
            form.append("imageFile",filesVal);
            form.append("fileName",nameVal);
            //data:{"uid":memberInfo.memberId,"client":"web","msToken":memberInfo.msToken,"imageFile":filesVal,"fileName":nameVal},
            //图片上传(表单提交)
        	$.ajax({
                type:'post',
                url: msonionUrl+"experienceHell/uploadPicture/v1",
                data:form,
                dataType:'json',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success:function(data){
                   var errCode = data.errCode;
                   if(errCode == 2002){
                	   jems.tipMsg("图片格式不对");
                	   return;
                   }else if(errCode == 10000){
                	   picUrl = data.saveUrl;
                		if(nameVal == 'pic1Url'){
                			$("#pic1UrlInput").val(picUrl);
                		}else if(nameVal == 'pic2Url'){
                			$("#pic2UrlInput").val(picUrl);
                		}else if(nameVal == 'pic3Url'){
                			$("#pic3UrlInput").val(picUrl);
                		}else if(nameVal == 'pic4Url'){
                			$("#pic4UrlInput").val(picUrl);
                		}else if(nameVal == 'pic5Url'){
                			$("#pic5UrlInput").val(picUrl);
                		}
                   }
                },
                error:function(data){
                	jems.tipMsg("网络异常，图片上传失败");
             	   	return;
                }
                
            });
        }
    )
    }else if(applyState>=2){
    	$("#expic").show();
    	$(".uploadinput").hide();
    	$("#samplePurchaseBtn").show();
    	$("#saveOrUpdateBtn").hide();
    }
}

/**
 * 跳转到物料采购
 */
function samplePurchase(){
	jems.goUrl("../../material/cart.html");
}

/***
 * 获取用户信息
 * @returns
 */
function getMemberInfo(){
	var memberInfo;
	$.ajax({
		type : "post",
		async: false,
		url : msonionUrl+"menbercenter/memberInfo",
		dataType : "json",
		success:function(data){
			if(data.login_flag){
				memberInfo = data.memberrec;
			}else{
				jems.goUrl(mspaths+"login.html?"+window.location.href);
			}
		}
	});
	return memberInfo;
}

/*查询省份*/
function getArea(pid,ele,seleval){
	$.ajax({
		type:'get',
		url: msonionUrl+"store/area",
		data:"pid="+pid,
		dataType:'json',
		success:function(json){
			var gettpl = $('#areaData').html(), data = {data:json};
			jetpl(gettpl).render(data,function(html){
				$('#'+ele).append(html);
			});
		},
		complete:function(){
			seleval&&$('#'+ele).val(seleval);
		}
	});
}

/***
 * 提交表单 
 * @param uid 用户编号
 * @param msToken 
 * @param picUrl 图片地址（oss）
 * @param nameVal 数据库属性名称
 * @returns {Boolean}
 */
function saveOrUpdate(){
	// 获取用户信息
	//var memberInfo = getMemberInfo();
//	alert("saveOrUpdate:"+memberInfo.memberId)
	if(memberInfo == undefined){
		jems.goUrl(mspaths+"login.html?"+window.location.href);
	}
	var experienceStat = $("#experienceStat").val();
	if(experienceStat != '' && experienceStat == 0){
		mBox.open({
    		width:"80%",
    		content:"<div class='jew100 tc'>您提交的体验馆信息正在审核中，请勿更改!</div>",
    		closeBtn: [false],
    		btnName:['确定'],
    		btnStyle:["color: #0e90d2;"],
    		maskClose:false,
    		yesfun : function(){
    			window.location.reload();
    		}
    	});
	}
	var experienceType = $("#experienceType").val();
	if(experienceType == 0 || null == experienceType || experienceType == '' || experienceType == 'undefined'){
		jems.tipMsg("请选择申报选项");
		return;
	}
	var experienName = $("#experienName").val();
	if(null == experienName || experienName == '' || experienName == 'undefined'){
		jems.tipMsg("请填写您的真实姓名");
		return;
	}
	if (specialStr(experienName)){
        $(this).focus();
        jems.tipMsg("您的真实姓名含有特殊字符");
        return;
	}
	var experienTel = $("#experienTel").val();
	if(experienTel==null || experienTel =='' || experienTel == undefined){
		 jems.tipMsg("请填写您的联系电话");
		 return;
	}
	if (!moblieReg.test(experienTel)) {
		 jems.tipMsg("请输入正确的手机号码.");
		 return;
	}
	
	var experienEmail = $("#experienEmail").val();
	if(null == experienEmail || experienEmail == '' || experienEmail == undefined){
		jems.tipMsg("请填写您的电子邮箱");
		return;
	}
	var checkEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	if (!checkEmail.test(experienEmail)) {
		 jems.tipMsg("请输入正确的电子邮箱");
		 return;
	}
	var province = $("#province").val();
	if(0 == province || null == province || province == '' || province == undefined){
		jems.tipMsg("请选择所属省份");
		return;
	}
	var city = $("#city").val();
	if(0 == city || null == city || city == '' || city == undefined){
		jems.tipMsg("请选择所属城市");
		return;
	}
	var county = $("#county").val();
	if(0 == county || null == county || county == '' || county == undefined){
		jems.tipMsg("请选择所属区县");
		return;
	}
	var experienAddress = $("#experienAddress").val();
	if(null == experienAddress || experienAddress == '' || experienAddress == undefined){
		jems.tipMsg("请输入详细地址");
		return;
	}
	var experienAppTime = $("#experienAppTime").val();
	if(null == experienAppTime || experienAppTime == '' || experienAppTime == undefined){
		jems.tipMsg("请输入申报时间");
		return;
	}
	var experienOpenTime = $("#experienOpenTime").val();
	if(null == experienOpenTime || experienOpenTime == '' || experienOpenTime == undefined){
		jems.tipMsg("请输入开店时间");
		return;
	}
	var experienceId = $("#experienceId").val();
	var picUrl1 = $("#pic1UrlInput").val();
	var picUrl2 = $("#pic2UrlInput").val();
	var picUrl3 = $("#pic3UrlInput").val();
	var picUrl4 = $("#pic4UrlInput").val();
	var picUrl5 = $("#pic5UrlInput").val();
	var experienceHell = {'type':experienceType,'name':experienName,'tel':experienTel,
			'email':experienEmail,'sareaId':province,'careaId':city,'xareaId':county,
			'address':experienAddress,'applyTime':experienAppTime,'openTime':experienOpenTime,
			'experienceHellId':experienceId,'pic1Url':picUrl1,'pic2Url':picUrl2,'pic3Url':picUrl3,'pic4Url':picUrl4,'pic5Url':picUrl5,
			"uid":memberInfo.memberId,"client":"web","msToken":memberInfo.msToken};
	var datathis = {"uid":memberInfo.memberId,"client":"web","msToken":memberInfo.msToken};
	var datas = $.extend(datathis,experienceHell);
	$.ajax({
        type:'get',
        url: msonionUrl+"experienceHell/saveOrUpdate",
        data:experienceHell,
        dataType:'json',
        success:function(data){
        	var errCode = data.errCode;
			if(errCode == 4001){
         	   jems.goUrl(mspaths+"login.html?"+window.location.href);
            }else if(errCode == 10011){
               jems.mboxMsgIndex("您没有权限操作次功能");
          	   return;
            }else if(errCode == 10010){
               jems.tipMsg("请填写完整信息后提交");
          	   return;
            }else if(errCode == 10086){
        	   jems.mboxMsgIndex("网络异常，请稍后再试!");
        	   return;
            }else if(errCode == 6004){
            	mBox.open({
            		width:"80%",
            		content:"<div class='jew100 tc'>您提交的体验馆信息正在审核中，请勿更改!</div>",
            		closeBtn: [false],
            		btnName:['确定'],
            		btnStyle:["color: #0e90d2;"],
            		maskClose:false,
            		yesfun : function(){
            			window.location.reload();
            		}
            	});
            }else if(errCode == 10000){
            	mBox.open({
            		width:"80%",
            		content:"<div class='jew100 tc'>保存成功</div>",
            		closeBtn: [false],
            		btnName:['确定'],
            		btnStyle:["color: #0e90d2;"],
            		maskClose:false,
            		yesfun : function(){
            			window.location.reload();
            		}
            	});
            	return;
            }
        }
    });
}
/**
 * 名称正则
 */
function specialStr(str){
    var pattern = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)(\—)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\')(\。)(\，)(\、)(\？)(\￥)(\…)(\（)(\）)]+/);
    return (pattern.test(str));
}