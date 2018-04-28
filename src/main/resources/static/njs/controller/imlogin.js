    // author：lixiang
    // IM存在多个入口（会员，店主，供应商）所以把这一块的逻辑抽出来
    
    //判断是否注册为环信会员
    // @params  memberId 	
	function isRegister(memberId,memberType){
		var memberId = memberId;
		if(!memberId) return;
		$.ajax({
			type : "post",
			url : msonionUrl+"/app/emchat/makeMemberImState",
			// url:"http://183.62.23.38:8088/msonion-web/app/emchat/makeMemberImState",(dev)
			data:{uid:memberId},
			dataType : "json",
			success:function(result){
				if(result.memberImState == 1){
					personalInfo(memberId,memberType);
				}
			}
		})
	}
	// 如果只是会员，那么返回的数据就只有一个就是店主信息 如果是店主，那么返回的数据就是好友列表
	// @params memberId
	function getFriendsList(memberId,memberType){
		var memberId = memberId;
		if(!memberId) return;
		$.ajax({
			type : "post",
			url : msonionUrl+"app/emchat/getMemberImFriends/v1",
			// url:"http://183.62.23.38:8088/msonion-web/app/emchat/getMemberImFriends",(dev)
			data:{uid:memberId,mType:memberType},
			dataType : "json",
			success:function(result){
				if(result.errCode === 10000){
					var friendLists = result.data;
					if(friendLists.length<1 && memberType == 3){
						jems.tipMsg('我是店主，但我没有会员')
					}else if(friendLists.length<1 && memberType == 4){
						jems.tipMsg('我是会员，但我没有店主')
					}else{
						
						goChatPath(memberType,friendLists)
					}		
				}
			}
		})
	}
	// 获取当前店主的关于IM的个人信息
	function personalInfo(memberId,memberType){
		var memberId = memberId;
		if(!memberId) return;
		$.ajax({
			type : "post",
			url : msonionUrl+"app/emchat/getUserImDataByUserName",
			// url:"http://183.62.23.38:8088/msonion-web/app/emchat/getUserImDataByUserName",(dev)
			data:{userName:memberId},
			dataType : "json",
			success:function(result){
				if(result.errCode === 10000){
					var personalInfos = result.data;
					var personalInfosToStr = JSON.stringify(personalInfos);
					localStorage.setItem('personalInfos', personalInfosToStr);
					getFriendsList(memberId,memberType);
				}
			}
		})

	}
	//	跳转思路：(memberType) 
	//  4 -----> 代表是会员，那么他的好友列表只要一个数据，直接跳到聊天界面
	//  3 -----> 代表是店主，那么首先要调到好友列表，根据不同的好友跳到不同的聊天界面
	function goChatPath(memberType,friendLists){
        var memberType = memberType;
        localStorage.setItem('memberType', memberType);
		switch(memberType){
                        
            case 4: 	var friendListsToStr = JSON.stringify(friendLists[0]);
                        localStorage.setItem('currentFriend', friendListsToStr);
						jems.goUrl(mspaths+"mschat/chat.html");
						break;
            case 3: 	var friendListsToStr = JSON.stringify(friendLists);
                        localStorage.setItem('friendLists', friendListsToStr);
						jems.goUrl(mspaths+"mschat/contactList.html");
						break;
			default: return;
		}
	}