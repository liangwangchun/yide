var ParHref = jems.parsURL( window.location.href );
$(function(){
	//进行商品搜索
	//$("#formalSearchTxt").focus();
	$("#searchBtn").on('click',function(){
		sessionStorage.keywords == "";
		sessionStorage.menuIds =  "";   
		sessionStorage.brandIds =  "";   
		sessionStorage.countryIds = "" ;   
		sessionStorage.minamt =0;
		sessionStorage.maxamt = 0
		var sosVal = $("#formalSearchTxt").val();
		if(sosVal == "") {
			jems.tipMsg("关键字不能为空");
		}else{
			jems.goUrl(mspaths + 'search-list.html?keywords=' + encodeURI(encodeURI(sosVal)));
		}
	});
	//获取一级类目列表
	soslanlist();
    $("#soboxnav").tabView();
    //品牌列表
    $("#brandnav").on('tap',brandwordlist);
    //地区列表
    $("#countrnav").on('tap',countryslist);
    jems.getShopTitle(ParHref.params.tmn);//微信分享用
});

//一级、二级、三级类目列表
function soslanlist(){	
	$.ajax({
		type : "get", 
		url:msonionUrl+"app/product/getLetParent/v1",
//		url:mspaths+"js/jsons/threeMenu.json?tv="+ new Date().getTime(),
		dataType : "json",
		//jsonp:"callback",
		success:function(json){
            //获取一级类目列表
			var datatop = {data:json.data};
			jetpl('#sostoplistData').render(datatop, function(html){
				$('#sostoplist').html(html);					
			}); 
			//jemRoll({ cell:".sosnavbox", posCell:"li.on", isAdjust: true });
			$('#sostoplist li').on('click',function(){
				$(this).addClass("on").siblings().removeClass("on");
				$("#soslanlist").attr("data-pid",$(this).attr("data-pid"));
				eachsoslan(json);
				//jemRoll({ cell:".sosnavbox", posCell:"li.on", isAdjust: true });
			})
            //获取二级、三级类目列表
			eachsoslan(json);
		}
	});
	function eachsoslan(json){
		var pid = $("#soslanlist").attr("data-pid");
		$.each(json.data,function(i,datas){
			if(datas.id == pid){
				var dataMenus = {data:datas.childMenus};
				if(json.total == 0){					
					//$("#godslistnopro").css({display:"block"});
					//$("#loadaimbox").css({display: 'none'});
				}else{
					jetpl('#soslanlistData').render(dataMenus, function(html){
						$('#soslanlist').html(html);
					}); 
					$("#soslanlist h3").on('click',function(){
						$(this).next(".soslancon").show().siblings(".soslancon").hide();
						$(this).addClass("current").siblings().removeClass("current");
					});
				}
			}				
		})		
	}
}
//获取品牌数据
function brandwordlist(){
	var loadFlg=false;
	if($('#brandlist').attr("date-type") != 'false'){
		$.ajax({
			type : "get", 
			url : msonionUrl+"product/brandword",
			dataType : "json",
			success:function(json){
				var gettpl = $('#brandlistData').html(), dataMenus = {data:json};
				jetpl(gettpl).render(dataMenus, function(html){
					$('#brandlist').html(html);
				}); 
				$('#brandlist').attr("date-type",'false');
				loadFlg = true;			
			}
		});
	}
}
//获取地区数据
function countryslist(){
	var loadFlg=false;
	if($('#countrieslist').attr("date-type") != 'false'){
		$.ajax({
			type : "get", 
			url : msonionUrl+"product/countrys",
			dataType : "json",
			success:function(json){
				var gettpl = $('#countriesData').html(), dataMenus = {data:json};
				jetpl(gettpl).render(dataMenus, function(html){
					$('#countrieslist').html(html);
				}); 
				$('#countrieslist').attr("date-type",'false');
				loadFlg = true;	
			}
		});
	}
}