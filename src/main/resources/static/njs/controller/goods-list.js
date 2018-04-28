// JavaScript Document
var ParHref = jems.parsURL( window.location.href );
$(function(){
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
    
    var params = ParHref.params;
    // 按分类查时cid或pid会有值
    var pid = params.pid, cid = params.cid, sid = params.sid, tmn = params.tmn;
    //获取当前分类的导航数据
    $.ajax({
		type : "get", 
		url : mspaths+"js/jsons/threeMenu.json",
		dataType : "json",
		success:function(json){
			$.each(json.data,function(i,datas){
				if(datas.id == pid){
					//一级导航菜单名称
					$(".godslistTitle").text(datas.name);
					var dataMenus = {data:datas.childMenus,name:datas.name}
					if(cid == undefined){
						$(".navclass").css("display", "none!important");
						$(".mswrapper").css("padding-top",40)
					}
					//二级导航菜单
					jetpl('#listchildnavData').render(dataMenus, function(html){
						$('.listchildmenu').append(html);
						$.each($('.listchildmenu li'),function(){
							var that = $(this);
							if(cid != undefined && that.attr("data-cell") == cid){
								var items = that.data("items"), datasan = {data:dataMenus.data[items].childMenus};
								//给选中的二级导航菜单标注颜色
								that.addClass("on");
								//三级导航菜单
								jetpl('#navlistfenleiData').render(datasan, function(htmls){
									$('#navlistfenlei ul').append(htmls);
									$.each($('#navlistfenlei li'),function(){
										var _this = $(this);
										if(sid != undefined &&  _this.attr("data-cell") == sid){
											_this.addClass("on");
										}
									})
									$("#navfeilei").on('tap',function(){
										var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
										shaixuan.css('display') == 'block' ? shaixuan.hide() : "";
										feilei.css('display') == 'block' ? feilei.hide() : feilei.show();
									})

								})
						    } 
			            })	
			            //滚动展现更多导航菜单
						jemRoll({ cell:".navbox", posCell:"li.on", isAdjust: true });
					});
					
				}
			})
			$.each($('#navlistshaixuan li'),function(){
				var _this = $(this), sortid = params.sort;
				if(sortid != undefined &&  _this.attr("data-cell") == sortid){
					_this.addClass("on");
				}
			})
			$("#navshaixuan").on('tap',function(){
				var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
				feilei.css('display') == 'block' ? feilei.hide() : "";
				shaixuan.css('display') == 'block' ? shaixuan.hide() : shaixuan.show();
			})
			$(".ncsmask").on('tap',function(){
				var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
				if(shaixuan.css('display') == 'block') shaixuan.hide();
				if(feilei.css('display') == 'block') feilei.hide();
			})
            //一级导航菜单
			jetpl('#navtopmenuData').render(json, function(html){
				$('#navtopmenu ul').append(html);
				$.each($('#navtopmenu ul li'),function(){
					var that = $(this);
					if(pid != undefined && that.attr("data-cell") == pid){
	                    that.addClass("on");
				    } 
	            })
			});
			//点击弹层所有一级导航
			$('.godslistTitle,.navtopmask').on('tap',function(){
				if($('#navtopmenu').css('display')=='block'){
					$('#navtopmenu').hide();
				}else{
					$('#navtopmenu').show();
				}
			})
		}
	});

	//产品列表数据加载
	$(window).dropload({afterDatafun: listData});
	function listData() {
		var pcsid='', loadFlg=false;
		if(cid != undefined){
			var psort = (params.sort != undefined ? "order="+ params.sort : "");
			pcsid = "cid="+ (sid != undefined ? sid : cid) + "&"+psort;
		}else{
			pcsid = "pid="+pid;
		}
		var url = "product/bycatidView?"+pcsid;
		$.ajax({
			type : "get", 
			url:msonionUrl+url+"&tmn="+tmn+"&pageNo="+pageNum,
			dataType : "json",
			//jsonp:"callback",
			beforeSend:function(){
				$("#loading").show();
			},
			success:function(data){
				if(data.total == 0 && data.totalPage == 0){
					$("#goodsList").html("<p class='p15 tc f14'>亲，暂无你要商品！</p>");
					$("#loading").hide();
				}else{
					var gettpl = $('#godslistData').html();
					jetpl(gettpl).render(data, function(html){
						$('#goodsList').append(html);
					}); 
					totalPage = data.totalPage;
					pageNum++;
					//图片延迟加载插件引用
					$('.lazy').lazyload({placeAttr:"dataimg",fewPiece:0});
				    loadFlg = true;
				    if(pageNum>totalPage){
						$("#loading").show().html('到底了,没有更多商品了');
					}else {
						setTimeout(function () {
							$("#loading").hide();
						}, 4000);
					}
				}
			}
		});
	};
	
	jems.showCartNum();
	//返回顶部插件引用
	$(window).goTops({toBtnCell:"#gotop",posBottom: 40});
})
function goodSort(id){
	var gcsid,params = ParHref.params, gpid = params.pid, gcid = params.cid, gsid = params.sid;
	if(gsid != undefined){
		gcsid = "&cid="+gcid+"&sid="+gsid;
	}else{
		gcsid = "&cid="+gcid;
	}
	jems.goUrl("goods-list.html?pid="+gpid+gcsid+"&sort="+id);
}
/**
 * 商品限购规则
 * @param gid	购买商品的id
 * @param mid	购买商品的分类id，如果是按指定商品限购，则分类id可以不用传
 * @param num	购买数量
 * 
 */
function limitrule(gid,num,mid){
	var limit = true;
	var params = {"gid":gid,"buynum":num,"menuid":mid};
	var url = msonionUrl+"sodrest/sodlimit1";
	$.ajax({
		type:'get',
		url:url,
		data:params,
		dataType:'json',
		async:false,
		success:function(msg){
			var info = "该商品是限购商品";
			//info += "<br />限购日期："+msg.sdate+"~"+msg.edate;
			info += "<br />每人限购"+msg.limitNum+"件";
			msg.islimit&&jems.mboxMsg(info);
			limit = msg.islimit;
		}
	});
	return limit;
}
//添加购物车
var timer = null;
function addCart(tmn,goodsId,menuId){
	clearTimeout(timer);
	timer = setTimeout(function(){
		
		if(!limitrule(goodsId, 1,menuId)){	// 添加限购规则 2015-11-30
			
			$.ajax({
				type: "get",  
				url: msonionUrl+"cart/add?tmnId="+tmn+"&goodsId="+goodsId+"&menuId="+menuId,
				dataType : "json",
				//jsonp:"callback",
				success: function(data){
				    var msg = "";
				    if(data.state == 5){
				        jems.goUrl("login.html?"+window.location.href);
				    }else{
					    if(data.state == -1){
					         msg = "对不起，洋葱商家无法使用本功能";
					    }else if(data.state == 0){
					         msg = "此商品加入购物车失败！";
					    }else if(data.state == 1){
					         msg = "此商品在商城中不存在！";
					    }else if(data.state == 2){
					         msg = "数量不能为空！";
					    }else if(data.state == 3){			    	 
					    	 jems.showCartNum();  // 重新计算购物车数量
					         msg = "恭喜加入购物车成功！";
					    }else if(data.state == 4){
					         msg = "终端不存在！";
					    }else if(data.state == 6){
					         msg = "此终端不存在！";
					    }else if(data.state == 7){
					         msg = "洋葱商家不能使用此功能！";
					    }else if(data.state == -2){
							 msg = "该商品购买数量不能超过"+data.limitNum+"件！";
						}
					    jems.tipMsg(msg);
				    }
			   }
			});
		
		}
	
	},500);
}

//添加收藏
function addAtten(tmn,goodsId){
	var ele = event.target;
	$.ajax({
		type: "get",  
		url: msonionUrl+"myatten/add?tmn="+tmn+"&goodsId="+goodsId,
		dataType : "json",
		//jsonp:"callback",
		success: function(data){
		     var msg = "";
		     if(data.state == -1){  //帐户未登录或无权限
		         jems.goUrl("login.html?"+window.location.href);
		     }else{
			     if(data.state == 0){
			         msg = "此商品收藏失败！";
			     }else if(data.state == 1){
			         msg = "此商品已在收藏夹中！";
			     }else if(data.state == 2){
			    	   $(ele).removeClass("btn-favorite").addClass("btn-favoriteAcur");
			         msg = "商品收藏成功！";
			     }else if(data.state == 3){
			         msg = "洋葱商家不能使用此功能！";
			     }
			     jems.mboxMsg(msg);
		     }
	   }
	});
}