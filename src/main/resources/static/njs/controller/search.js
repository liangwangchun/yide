/**
 *  页面：分类
 *  链接：http://localhost:8089/msonion-web/wx/search-goods-new.html?tmn=156
 * 	联系人：李想
 * */

var ParHref = jems.parsURL(window.location.href);
$(function () {
    
	//进行商品搜索
	//$("#formalSearchTxt").focus();
	$("#searchBtn").on('click', function () {
		sessionStorage.keywords == "";
		sessionStorage.menuIds = "";
		sessionStorage.brandIds = "";
		sessionStorage.countryIds = "";
		sessionStorage.minamt = 0;
		sessionStorage.maxamt = 0
		var sosVal = $("#formalSearchTxt").val();
		if (sosVal == "") {
			jems.tipMsg("关键字不能为空");
		} else {
			jems.goUrl(mspaths + 'search-list.html?keywords=' + encodeURI(encodeURI(sosVal)));
		}
	});

	soslanlist();
	$("#soboxnav").tabView();
	//品牌列表
	$("#brandnav").on('tap', brandwordlist);
	//地区列表
	$("#countrnav").on('tap', countryslist);
	jems.getShopTitle(ParHref.params.tmn); //微信分享用
});

//一级、二级、三级类目列表
function soslanlist() {
	$.ajax({
		type: "get",
		url: msonionUrl + "app/product/getLetParent/v2",
		dataType: "json",
		success: function (json) {

			var datatop = {
				data: json.data
			};
			jetpl('#rootnavListsData').render(datatop, function (html) {
				$('#rootnavLists').html(html);
			});
			$.each(json.data, function (i, item) {

                // 子菜单ul字符串拼接
                var doms = "#childMenu" + i + " li";
                // 点击 展开 和 隐藏 的 顶级菜单
				var clickNode="#childTopMenu"+i;
				menuSwitch(clickNode);
				menuControl(doms, '#soslanlist',json);
            })
            // 设置初始值，这个值通过 type：0 | 1 区分
            $('#soslanlist').attr("type-pid", json.data[0].type);
            $('#soslanlist').attr("data-pid", json.data[0].data[0]['id']);
			
			eachsoslan(json);
		},
		error:function(jsons){
			console.log(jsons,'美物志接口请求数据失败');
			
		}
	});
	
	// 一级目录联动
	function menuControl(doms, target, json) {

		$(doms).on('click', function () {
			$(".searchnavlist li").removeClass('on');
            $(this).addClass('on')
            $(target).attr("type-pid", $(this).parent().attr("type-pid"));
            $(target).attr("data-pid", $(this).attr("data-pid"));
			eachsoslan(json);

		});
	}

	// 控制一级目录开关
	function menuSwitch(clickNode){
		
		$(clickNode).on('click',function(){
			var status = $(clickNode).next().css('display');
			if(status == 'block'){
				$(clickNode).next().css('display','none');
				$(this).find('em').removeClass('triangle-top').addClass('triangle-bottom');
			}else if(status == 'none'){
				$(clickNode).next().css('display','block');
				$(this).find('em').removeClass('triangle-bottom').addClass('triangle-top');
			}else{
				console.log("this is a error,当前节点的下一个节点必须有display")
			}
		})
	};
    
    // 右边菜单控制逻辑
	function eachsoslan(json) {
		var pid = $("#soslanlist").attr("data-pid");
		$.each(json.data, function (i, datas) {
			$.each(datas.data, function (i, items) {
				if (items.id == pid) {
					var dataMenus = {
						data: items.childMenus
					};
					if (json.length == 0) {
						//$("#godslistnopro").css({display:"block"});
						//$("#loadaimbox").css({display: 'none'});
					} else {
						jetpl('#soslanlistData').render(dataMenus, function (html) {
							$('#soslanlist').html(html);
						});
						$("#soslanlist h3").on('click', function () {
							var status = $(this).next(".soslancon").css('display');
							if(status == 'block'){
								$(this).next(".soslancon").css('display','none');
								$(this).removeClass('current');
							}else if(status == 'none'){
								$(this).next(".soslancon").css('display','block');
								$(this).addClass('current');
							}else{
								console.log("this is a error,当前节点的下一个节点必须有display")
							}
							
						});
					}
				}
			})

		})
	}
}
//获取品牌数据
function brandwordlist() {
	var loadFlg = false;
	if ($('#brandlist').attr("date-type") != 'false') {
		$.ajax({
			type: "get",
			url: msonionUrl + "product/brandword",
			dataType: "json",
			success: function (json) {
				var gettpl = $('#brandlistData').html(),
					dataMenus = {
						data: json
					};
				jetpl(gettpl).render(dataMenus, function (html) {
					$('#brandlist').html(html);
				});
				$('#brandlist').attr("date-type", 'false');
				loadFlg = true;
			}
		});
	}
}
//获取地区数据
function countryslist() {
	var loadFlg = false;
	if ($('#countrieslist').attr("date-type") != 'false') {
		$.ajax({
			type: "get",
			url: msonionUrl + "product/countrys",
			dataType: "json",
			success: function (json) {
				var gettpl = $('#countriesData').html(),
					dataMenus = {
						data: json
					};
				jetpl(gettpl).render(dataMenus, function (html) {
					$('#countrieslist').html(html);
				});
				$('#countrieslist').attr("date-type", 'false');
				loadFlg = true;
			}
		});
	}
}
