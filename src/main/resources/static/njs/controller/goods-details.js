/**
 @Js-name:goods-details.js
 @Zh-name:产品详情页JS函数
 @Author:li xiang
 */
var ParHref = jems.parsURL(), menuId = 0, messageFlag = 0, tmn = "", gid = "";
// tmn gid 的值后期需要删除，因为当前需要数据
$(function () {
    tmn = ParHref.params.tmn, gid = ParHref.params.id;
    //返回顶部插件引用
    $(window).goStick({
        fixed: "fixed",
        btnCell: "#gotop",
        posBottom: 55
    });

    // 触发滚动条事件
    $(window).on('scroll', scrollEvent);
    // 顶部导航切换
    $("#headernav li").on("click", function () {
        $(window).off('scroll', scrollEvent);
        var that = $(this);
        that.addClass("on").siblings().removeClass("on");
        var idx = that.index();
        var position = $(".floor" + idx).offset().top - 50;
        $("html,body").scrollTop(position);
        setTimeout(function () {
            $(window).on('scroll', scrollEvent)
        }, 1000);
        return false;
    });
    // 商品详情 和 FAQ 切换
    $(".detailsTab li").on("click", function () {
        var idx = $(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $(".tabbox_" + idx).show().siblings().hide();
    });

    // 查看理由中的查看更多
    $("#checkMore").on("click", function () {
        //alert(11111)
        var _this = $(this).siblings(".checkCont");
        if (_this.is(":hidden")) {
            _this.show();
        } else {
            _this.hide();
        }
    });

    //弹窗 detailbox-flrico 
    $(".detailbox-flrico").on("click", function () {
        mBox.open({
            title: ['查看收入', 'color:#333;font-size:1.5rem;text-align:center;'],
            width: "90%",
            height: "50%",
            content: $("#materialView")[0],
            // closeBtn: [true, 1],
            btnName: ['确认'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false
        });
    });



    
    //获取产品详情的服务器数据
    $.ajax({
        type: "get",
        url: msonionUrl + "product/goodsinfo?tmn=" + tmn + "&gid=" + gid,
        dataType: "json",
        success: function (data) {
        	
            // 存放分类id,供限购功能使用
            menuId = data.category.id;
            var picCell = $("#detailpic"),
                sale = data.saleState;
            if (data.qty <= 0) {
                if (sale == 2 || sale == 9) {
                    picCell.addClass("soldout2");
                } else if (sale == 3 || sale == 6 || sale == 8) {
                    picCell.addClass("soldout3");
                } else if (sale == 5 || sale == 10) {
                    picCell.addClass("soldout5");
                } else if (sale == 4) {
                    picCell.addClass("soldout4");
                } else if (sale == 7) {
                    picCell.addClass("soldout7");
                } else {
                    picCell.addClass("soldout1");
                }
            } else {
                if (sale == 6 || sale == 8) {
                    picCell.addClass("soldout3");
                } else if (sale == 5 || sale == 10) {
                    picCell.addClass("soldout5");
                } else if (sale == 7) {
                    picCell.addClass("soldout7");
                } else if (sale == 4) {
                    picCell.addClass("soldout4");
                }
            }
            $('#detailtopPic').attr('src', msPicPath + data.goodsPics[0].picUrl + "?x-oss-process=image/resize,w_640");
            $("#godsAdv").html(data.salePoint);
            $("#godsenName").html(data.enName);
            $("#godsTit").html(data.name);
            $("#countryico").addClass(data.country.code);
            $("#countryname").html(data.country.name);
            $("#godcbTxt").html(data.saleGuide);
            if (data.saleRule != undefined) {
                $("#saleRule").show().children().html(data.saleRule);
            }
            $("#freePrice").html("&yen;" + jems.formatNum(data.freePrice));
            $("#marketPrice").html("&yen;" + jems.formatNum(data.marketPrice));
            $("#le_editor").attr('src', msPicPath + 'file/' + data.leEditor + '.jpg');
            $("#leedit").html(data.leEditor);
            if(data.memberType < 4){
            	var income = jems.formatNum((data.freePrice - data.leCost)*0.7,2);
            	var registIncome = jems.formatNum((data.freePrice - data.leCost)*0.2,2);
            	var daoGouIncome = jems.formatNum(income- registIncome,2);
            	var storeIncome = jems.formatNum((data.freePrice - data.leCost)*0.3,2);
            	$("#materialView").find("p").eq(0).find("i").html("¥"+ income);
            	$("#registIn").html( registIncome);
            	$("#daogouIn").html( daoGouIncome);
            	$("#materialView").find("p").eq(2).find("i").html("¥"+ storeIncome);
            	$("#materialView").find("p").eq(2).find("span").append("("+jems.formatNum(storeIncome/data.freePrice*100,2)+"%)");
            	if(data.memberType == 2){
                 	$("#storeShow").css("display","block");
                 	$("#serverShow").css("display","block");
                 	$("#storeInShow").css("display","block");
             	}else{
             		$("#storeShow").css("display","none");
             		$("#serverShow").css("display","none");
             		$("#storeInShow").css("display","none");
             	}
                $("#checkProfit").css({"display":""});
            }else{
            	$("#checkProfit").css({"display":"none"});
            }
            var rets = data.proInfos;
            //抢货列表
            if (rets != "" && data.qty > 0) {
                var reHtml = '',
                    relen = rets.length >= 3 ? 3 : rets.length;
                for (var i = 0; i < relen; i++) {
                    reHtml += '<img class="mr8" src="' + msPicPath + rets[i].mainPicUrl + '?x-oss-process=image/resize,w_120">';
                }
                $("#magshuoluo").prepend(reHtml);
                jetpl("#godsrecomData").render(data, function (html) {
                    $('#godsrecom').append(html);
                });
            } else {
                $("#showMore").parent().css({'display': 'none'});
            }

            relatedProducts(data.proInfos.length);
            //商品介绍
            jetpl('#godsContextData').render(data, function (html) {
                var fixtext = $('#godsConTxt');
                fixtext.append(html);
                if ($(".conmore").length > 0) {
                    $(".conmore").on("click", function () {
                        if (fixtext.find("p.hide").css("display") == "none") {
                            fixtext.find("p.hide").css({"display": "block"});
                            $(this).addClass("open").find("span").text("收起");
                        } else {
                            fixtext.find("p.hide").css({"display": ""});
                            $(this).removeClass("open").find("span").text("展开");
                        }
                    })
                }
            });

            $.each(["#paramlist","#faqs","#magazine"],function (i,cell) {
                jetpl(cell+"Data").render(data, function (html) {
                    $(cell+"list").append(html);
                });
            });
            //插入详情图片
            $('#godsConImg').append(data.goodsDesc.replace(/\.jpg/g, ".jpg?x-oss-process=image/resize,w_640").replace(/\.png/g, ".png?x-oss-process=image/resize,w_640"));

            //相似商品
            if (data.qty <= 0 && sale == 1) {
                if (data.proInfos1 != undefined && data.proInfos1.length > 0) {
                    jetpl("#godslistData").render(data, function (html) {
                        $('#godslist').append(html);
                        var parCell = $('#similar h3');
                        parCell.parent().css({
                            width: IsPC() ? 640 : "100%",
                            display: "block"
                        }).addClass("openfix");
                        parCell.on("click", function () {
                            var thisCell = $(this).parent();
                            if (thisCell.hasClass("openfix")) {
                                thisCell.removeClass("openfix");
                            } else {
                                thisCell.addClass("openfix");
                            }
                        })
                    });
                }
            }
            var gobrand = $("#gobrand");
            gobrand.on("click", function () {
                jems.goUrl('goods-brandinfor.html?bid=' + data.brand.id);
            });
            gobrand.find(".brandpic").css({
                "background-image": "url(" + msPicPath + data.brand.url + ")"
            });
            gobrand.find(".brandname").text(data.brand.name);


            // 是否收藏效果判断
            var isAtten = data.isAtten;
            if (isAtten == 0) {
                $("#isAtten").find("em").removeClass("msfavorgray").addClass("msfavorpurple");
                $("#isAtten").find("span").text("已关注");
            } else {
                $("#isAtten").find("span").text("关注");
            }
            //点击收藏商品
            $("#isAtten").on('click', function () {
                addAtten(ParHref.params.tmn, ParHref.params.id);
            });
            //判断商品是否有货
            messageFlag = data.messageFlag;
            var addCartid = $("#godsaddCart");
            if (data.qty <= 0) {
                if (sale != undefined && (sale == 2 || sale == 3 || sale == 6 || sale == 7 || sale == 8 || sale == 9)) {
                    addCartid.css("background", "#aaa").text("暂时下架");
                } else {
                    if (messageFlag == 1) {
                        addCartid.css("background", "#aaa").text("到货提醒").on('click', arrivalNotice);
                    } else if (messageFlag == 2) {
                        addCartid.css("background", "#4b0d65").text("取消提醒").on('click', arrivalNotice);
                    }
                }
            } else {
                if (data.leStat == 2) {
                    addCartid.css("background", "#aaa").text("暂时下架");
                } else {
                    if (data.isSingleOrder != undefined && data.isSingleOrder == 1) {
                        addCartid.text("一键下单").on('click', function () {
                            if (sale == 5 || sale == 10) {
                                jems.tipMsg("预热商品暂不可下单");
                                return;
                            } else {
                                buyNow(data.id, data.freePrice);
                            }
                        });
                    } else {
                        var goname = (sale == 5 || sale == 10) ? "提前加入购物车" : "加入购物车";
                        addCartid.text(goname).on('click', function () {
                            jems.addCart(tmn,gid);
                        });
                    }
                }
            }
            //判断是否显示团购入口
            if (data.isGroup) {
                if (0 == data.groupFlag) {
                    $("#groupPrice").html("&yen;" + jems.formatNum(data.productGroup.groupPrice));
                    $("#groupInlet").show().on("click", function () {
                        jems.goUrl("group-details.html?id=" + data.productGroup.groupId);
                    });
                }
            }
            
            // 渲染视频列表
               
            jetpl("#videosData").render(data, function (html) {
            	$('#videoContent').append(html);
            	//轮播
                if ($("#vidonion .bd li").length > 0) {
                    jeSlide({
                        slideCell: "#vidonion",
                        titCell: ".hd ul",
                        mainCell: ".bd ul",
                        effect: "leftLoop",
                        interTime: 2000,
                        pageStateCell: ".pageState",
                        switchCell: ".datapic",
                        switchLoad: "data-pic",
                        autoPage: true, //自动分页
                        autoPlay: false //自动播放
                    });
                }
            	
            })
            
            // 渲染用户口碑
            
            jetpl("#goodsMaterialsData").render(data.goodsMaterials, function (html) {
            	$('#goodsMaterialsContent').append(html);
            	$("#goodsMaterialsCount").html("（"+data.goodsMaterials.total_count+"条）");
            })
            
            // 如果 onion tv 和 美物志 没有展示内容 那么标题隐藏
            
            if(data.magazines.length<1){
                $('#goodGoodsLognav').hide();
                $('#magazinelist').hide()
            }else{
                $('#goodGoodsLognav').show();
                $('#magazinelist').show()
            }
            if(data.videos.length<1){
                $('#oniontvnav').hide();
            }else{
                $('#oniontvnavs').show();
            }
            /*****微信分享*****/
            if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
	           var shareImg = data.mainPicUrl == undefined ? data.goodsPics[0].picUrl:data.mainPicUrl;
	           shareImg = msPicPath + shareImg;
	           jems.wxShare(data.name, shareImg);
            }
        }
    });

    // 显示购物车数量
    jems.showCartNum();
    jems.fixMenu();
    
    //口碑查看更多
    $('.checkMore').on('click',function(){		
    	jems.goUrl('goods-userwom.html?id='+gid+'')
    })

});

//滚动条事件
function scrollEvent() {
    var scrolltop = $(window).scrollTop(),
        top0 = $(".floor0").offset().top,
        top1 = $(".floor1").offset().top,
        top2 = $(".floor2").offset().top;
    if (scrolltop > top0 && scrolltop < top1) {
        $("#headernav li").eq(0).addClass("on").siblings().removeClass("on")
    } else if (scrolltop > top1 && scrolltop < top2) {
        $("#headernav li").eq(1).addClass("on").siblings().removeClass("on")
    } else if (scrolltop > top2) {
        $("#headernav li").eq(2).addClass("on").siblings().removeClass("on")
    }
    return false;
}

//抢货产品切换显示
function relatedProducts(len) {
    $("#showMore").on('click', function () {
        $(this).hide().parent().addClass("fixrecom");
        $("#godsrecom").show();
        $("#recommask").show();
        $(this).parent().css('bottom', 0);
        if (len > 3) {
            var showHeight = $('#godsrecom li').height(),
                diffHeight = len >= 4 ? 30 : 0;
            $("#godsrecom").css({
                height: showHeight * 4 + diffHeight,
                overflow: 'auto'
            });
        }
    });
    $("#recommask").on('click', function () {
        $(this).hide();
        $(this).parent().removeClass("fixrecom");
        $("#godsrecom").hide();
        $("#recommask").hide();
        $("#showMore").show().parent().css('bottom', '');
    });
}

//判断是否为手机端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//添加收藏
function addAtten(tmn, goodsId) {
    var ele = event.target;
    $.ajax({
        type: "get",
        url: msonionUrl + "myatten/add?tmn=" + tmn + "&goodsId=" + goodsId,
        dataType: "json",
        //jsonp:"callback",
        success: function (data) {
            var msg = "";
            if (data.state == -1) { //帐户未登录或无权限
                jems.goUrl("login.html?" + window.location.href);
            } else {
                if (data.state == 0) {
                    msg = "此商品关注失败！";
                } else if (data.state == 1) {
                    msg = "此商品已在关注中！";
                } else if (data.state == 2) {
                    $("#isAtten").find("em").removeClass("msfavorgray").addClass("msfavorpurple");
                    $("#isAtten").find("span").text("已关注");
                    msg = "商品关注成功！";
                } else if (data.state == 3) {
                    msg = "洋葱商家不能使用此功能！";
                }
                jems.mboxMsg(msg);
            }
        }
    });
}

//到货提醒
var firstClick = true;

function arrivalNotice() {
    if (!firstClick) return "";
    firstClick = false;
    $.ajax({
        type: "post",
        data: {
            "gid": gid,
            "messageFlag": messageFlag
        },
        url: msonionUrl + "message/createArrivalNotice?v_=" + new Date().getTime(),
        dataType: "json",
        success: function (data) {
            if (data.errCode == 0) {
                jems.goUrl("login.html?" + window.location.href);
            } else {
                window.location.reload();
            }
        }
    });
}

// 立即购买
function buyNow(productId, price) {
    var type = jems.memberType();
    if (type == 3 || type == 4) {
        jems.akeyOrder(productId, price);
    } else {
        jems.tipMsg("对不起，洋葱商家无法使用本功能");
    }
}