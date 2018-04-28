// JavaScript Document
var ParHref = jems.parsURL(window.location.href);
var params = ParHref.params;
var tmn = params.tmn;
//var tmn = params.tmn,uid=params.uid,client=params.client,msToken=params.msToken;
var flag = true;
var id = params.id;
var pid = params.pid == undefined ? 47 : params.pid;
$(function () {
    classInfo();
    weekHotList();
    requestIndexList();
    //保留滚动位置,并滚动

    if (localStorage.getItem('currentPos') && localStorage.getItem('isIndexToDetail')) {
        document.body.scrollTop = localStorage.getItem('currentPos');
        document.documentElement.scrollTop = localStorage.getItem('currentPos');
    }

    window.addEventListener('scroll', watchScroll, false);

    function watchScroll() {
        localStorage.setItem('currentPos', window.scrollY)
    }

    $(".msopennav").on("click", function () {
        if ($(".mslevenav").css("display") == "block") {
            $(this).parent().addClass("mslevemenu");
            $(".mslevenav").css("display", "none");
            $(".msleveopen").css("display", "block");
        } else {
            $(this).parent().removeClass("mslevemenu");
            $(".mslevenav").css("display", "");
            $(".msleveopen").css("display", "none");
        }
    });
    jems.fixMenu();

    //返回顶部插件引用
    $(window).goTops({toBtnCell: "#gotop", posBottom: 55});
    //微信分享
    jems.wxShare("洋葱贩外-中国质造到海外", "http://img.51msyc.com/wx/wxshare/foreign_logo.jpg", "让世界为中国质造喝彩");
});

/**
 * 请求周热销数据
 */
function weekHotList() {
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/weekHotList",
        data: {"pid": pid},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var weekHothtml = '';
            if (10000 == result.errCode) {
                var weekhotList = result.data;//分类
                if (weekhotList.length > 0) {
                    $('.week-host').show()
                } else {
                    $('.week-host').hide()
                }
                weekhotList.forEach(function (v) {
                    weekHothtml += '<li data-type=' + v.type + ' data-id=' + v.id + '>';
                    weekHothtml += '<p class="imgs"><img class="lazy" src="' + msPicPath + '' + v.mainPicUrl + '"></p>';
                    weekHothtml += '<p class="txtells pl5 pr5 f12">' + v.name + '</p>';
                    weekHothtml += '<p class="pl5 pr5 tl"><span class="purple mr15 f14">&yen;' + v.freePrice + '</span></p>';
                    weekHothtml += '</li>';
                });
                $("#weekHotList ul").html(weekHothtml);

                /**
                 *  周热销榜点击
                 */
                $("#weekHotList ul li").on("click", function () {
                    if ($(this).attr("data-type") == 1) {
                        jems.goUrl("foreign-detail.html?tmn=" + tmn + "&id=" + $(this).attr("data-id"));
                    } else {
                        jems.goUrl("goods-details.html?tmn=" + tmn + "&id=" + $(this).attr("data-id"));
                    }
                    localStorage.setItem('isIndexToDetail', false);
                });
            }
        }
    });
}

/**
 * 请求分类信息
 */
function classInfo() {
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/getClassInfo",
        data: {"pid": pid},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var classhtml = '';
            if (10000 == result.errCode) {
                var classList = result.data.childrens;//分类
                classList.forEach(function (v) {
                    classhtml += '<li data-id="' + v.id + '">' + v.let_name + '</li>';
                });
                $(".mslevenav ul").html(classhtml);
                $(".msleveopen ul").html(classhtml);

                /**
                 * 分类点击
                 */
                $(".mslevenav li").on("tap", function () {
                    jems.goUrl("foreign-list.html?classId=" + $(this).attr("data-id") + "&pid=" + pid);
                })

                /**
                 * 分类点击
                 */
                $(".msleveopen li").on("tap", function () {
                    jems.goUrl("foreign-list.html?classId=" + $(this).attr("data-id") + "&pid=" + pid);
                })
            }
        }
    });
}

/**
 * 请求主数据
 */
function requestIndexList() {
    var url = msonionUrl + "subProduct/getForeignIndex/v2";
    var datas = {"pid": pid};
    $.ajax({
        type: "get",
        url: url,
        data: datas,
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (result) {
            var recommendhtml = '';
            var commonAlbumhtml = '';
            var activityAlbumhtml = '';
            var adPichtml0 = '';
            var adPichtml1 = '';
            if (10000 == result.errCode) {
                var indexList = result.data;
                var recommendList = indexList.recommendList;//推荐
                var commonAlbumList = indexList.commonAlbumList;//超值热卖
                var activityAlbumList = indexList.activityAlbumList;//精选美衣
                var adList = indexList.adList.data;//轮播图
                var propImg;

                if (indexList.propagateList.data.length > 0) {
                    propImg = msPicPath + indexList.propagateList.data[0].imgPath;
                    $("#foreiad").css({"backgroundImage": "url(" + propImg + ")"}).on("click", function () {
                        jems.goUrl(indexList.propagateList.data[0].imgUrl);
                    });
                }

                if (adList.length > 0) {
                    adList.forEach(function (v, index) {
                        adPichtml0 += '<li data-picUrl=' + v.imgUrl + '>';
                        adPichtml0 += '<a>';
                        adPichtml0 += '<div class="conpic">';
                        adPichtml0 += '<span class="lazy" dataimg="' + msPicPath + '' + v.imgPath + '"></span>';
                        adPichtml0 += '</div>';
                        adPichtml0 += '</a>';
                        adPichtml0 += '</li>';
                        adPichtml1 += '<li>' + index + 1 + '</li>';
                    });

                    $("#findslider div[class='bd']").find('ul').html(adPichtml0);
                    $("#findslider div[class='hd']").find('ul').html(adPichtml1);

                    jeSlide({
                        slideCell: "#findslider",
                        titCell: ".hd ul",
                        mainCell: ".bd ul",
                        effect: "leftLoop",
                        interTime: 4000,
                        switchCell: ".datapic",
                        switchLoad: "data-pic",
                        autoPage: true,//自动分页
                        autoPlay: $('#findslider .bd li').length > 1 ? true : false  //自动播放
                    });
                }

                if (recommendList.length > 0) {
                    $('.new-product').show();
                } else {
                    $('.new-product').hide();
                }
                recommendList.data.forEach(function (v) {
                    recommendhtml += '<li data-recomid=' + v.id + '>';
                    recommendhtml += '<div class="p5">';
                    recommendhtml += '<span class="photo show lazy" dataimg="' + msPicPath + '' + v.picUrl + '"></span>';
                    recommendhtml += '<h3 class="f13 mt5">' + v.name + '</h3>';
                    recommendhtml += '<p class="flexbox mt5 je-align-center">';
                    recommendhtml += '<span class="f12 purple show">&yen' + v.freePrice + '</span>';
                    recommendhtml += '<del class="f10 g9 show jeflex ml10">&yen' + v.marketPrice + '</del>';
                    recommendhtml += '</p>';
                    recommendhtml += '</div>';
                    recommendhtml += '</li>';
                });
                $(".prolist").html(recommendhtml);

                $("li[data-recomid]").on("tap", function () {
                    jems.goUrl("foreign-detail.html?tmn=" + tmn + "&id=" + $(this).attr("data-recomid"));
                    localStorage.setItem('isIndexToDetail', false);
                });
                if (commonAlbumList.data.length > 0) {
                    $('.stree-coat').show();
                } else {
                    $('.stree-coat').hide();
                }
                commonAlbumList.data.forEach(function (v) {
                    commonAlbumhtml += '<div data-activeid=' + v.ID + ' class="msgodscon">';
                    commonAlbumhtml += '<div class="imgbox" onclick="jems.goUrl()">';
                    commonAlbumhtml += '<span class="lazy" dataimg="' + msPicPath + '' + v.mainPicUrl + '"></span>';
                    commonAlbumhtml += '</div>';
                    commonAlbumhtml += '</div>';
                    commonAlbumhtml += ' <div class="msgods-smalist msgodscroll pb5">';
                    commonAlbumhtml += '<ul>';
                    v.productList.forEach(function (val) {
                        commonAlbumhtml += '<li data-hotid=' + val.id + '>';
                        commonAlbumhtml += '<p class="imgs"><img class="lazy" src="' + msPicPath + '' + val.mainPicUrl + '"></p>';
                        commonAlbumhtml += '<p class="txtells pl5 pr5 f12">' + val.name + '</p>';
                        commonAlbumhtml += ' <p class="pl5 pr5 tl"><span class="purple mr15 f14">&yen;' + val.freePrice + '</span></p>';
                        commonAlbumhtml += ' </li>';
                    })
                    commonAlbumhtml += ' <li data-activeid=' + v.ID + ' class="btnMone"><img class="lazy" src="nimages/btn_more.png"></li>';
                    commonAlbumhtml += '</ul>';
                    commonAlbumhtml += ' </div>';

                });
                $("div[data-hot=\"hot\"]").html(commonAlbumhtml);

                if (commonAlbumList.alias != undefined && commonAlbumList.alias != "") {
                    $("#commonTitle").html(commonAlbumList.alias);
                }

                $("li[data-hotid]").on("tap", function () {
                    jems.goUrl("foreign-detail.html?tmn=" + tmn + "&id=" + $(this).attr("data-hotid"));
                    localStorage.setItem('isIndexToDetail', false);
                });

                $("li.btnMone").on("tap", function () {
                    jems.goUrl("actapp/album/index.html?tmn=" + tmn + "&album=" + $(this).attr("data-activeid"));
                });
                $("div.msgodscon").on("tap", function () {
                    jems.goUrl("actapp/album/index.html?tmn=" + tmn + "&album=" + $(this).attr("data-activeid"));
                });
                if (activityAlbumList.data.length > 0) {
                    $('.fashen-single').show();
                } else {
                    $('.fashen-single').hide();
                }
                activityAlbumList.data.forEach(function (v) {
                    activityAlbumhtml += '<li data-activeid=' + v.ID + '>';
                    activityAlbumhtml += '<span class="show lazy" dataimg="' + msPicPath + '' + v.mainPicUrl + '"></span>';
                    activityAlbumhtml += '</li>';
                });
                $(".menulist").html(activityAlbumhtml);

                if (activityAlbumList.alias != undefined && activityAlbumList.alias != "") {
                    $("#activityTitle").html(activityAlbumList.alias);
                }

                $("li[data-activeid]").on("tap", function () {
                    jems.goUrl("actapp/album/index.html?tmn=" + tmn + "&album=" + $(this).attr("data-activeid"));
                });

                /**
                 * 轮播图点击
                 */
                $('#findslider .bd li').on("tap", function () {
                    jems.goUrl($(this).attr("data-picUrl"));
                })
                /**
                 * 查看更多
                 */
                $(".load-more").on("tap", function () {
                    jems.goUrl("foreign-list.html?pid=" + pid);
                });

                //图片延迟加载插件引用
                $('.lazy').lazyload({placeAttr: "dataimg", fewPiece: 0});
            }
            else {
                jems.tipMsg(result.errMsg)
                return;
            }
        }
    });
}