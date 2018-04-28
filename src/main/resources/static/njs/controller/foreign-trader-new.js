// JavaScript Document
var ParHref = jems.parsURL(window.location.href);

// 获取贩外首页的外部数据
function getForeignData(fn) {
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/newForeignIndex",
        data: {},
        dataType: "json",
        beforeSend: function () {
            $("#loading").show();
        },
        success: function (json) {
            fn && fn(json)
        }
    })

}

// 数据渲染
function dataRender(data) {
    if (!data) {
        return false;
    }
    ;
    // 广告区渲染
    jetpl('#adListData').render(data.adList, function (html) {
        $('#adList').html(html);
    });
    // 类目区渲染
    jetpl('#categoryListData').render(data.categoryList, function (html) {
        $('#categoryList').html(html);
    });

    // 广告区渲染
    var imgpath = msPicPath + data.propagateList.data[0]['imgPath']
    $('#foreiad').css('background-image', "url(" + imgpath + ")").on("tap", function () {
        jems.goUrl(data.propagateList.data[0].imgUrl);
    });

    // 中国甄选
    jetpl('#commonAlbumListData').render(data.commonAlbumList, function (html) {
        $('#commonAlbumList').html(html);
    });
    // 今日区渲染
    jetpl('#todayRecommendListData').render(data.recommendList, function (html) {
        $('#todayRecommendList').html(html);
    });
    // 导航区渲染
    jetpl('#hotRecommendListNavData').render(data, function (html) {
        $('#hotRecommendListNav').html(html);
    });
    // 热销区渲染
    jetpl('#hotRecommendListData').render(data.hotRecommendList[0], function (html) {
        $('#hotRecommendList').html(html);
    });
    // 超值钜惠区渲染
    jetpl('#activityAlbumListData').render(data.activityAlbumList, function (html) {
        var picBig = data.activityAlbumList.data[0].mainPicUrl
        $("#activityAlbumBig").html("<span class='lazy' data-id='" + data.activityAlbumList.data[0].ID + "' style='background-image: url(" + msPicPath + picBig + "?x-oss-process=image/resize,w_640)'></span>")

        $('#activityAlbumList').html(html);
    });
    //微信分享
    jems.wxShare("洋葱贩外-中国质造到海外", "http://img.51msyc.com/wx/wxshare/foreign_logo.jpg", "让世界为中国质造喝彩");
    slides();

    $("#hotRecommendListNav li").on("tap", function () {
        // 热销区渲染
        jetpl('#hotRecommendListData').render(data.hotRecommendList[$(this).index()], function (html) {
            $('#hotRecommendList').html(html);
        });
        $(this).siblings().removeClass("on");
        $(this).addClass("on");
    });

    $("#activityAlbumBig span").on("tap", function () {
        jems.goUrl('actapp/album/index.html?album=' + $(this).attr("data-id"));
    });


    var navtopH = $(".foreign-nav").position().top
    $(window).on("scroll", function () {
        var scrollH = $(this).scrollTop();
        if (scrollH > navtopH) {
            $(".foreign-nav").addClass("foreign-navtop");
        } else {
            $(".foreign-nav").removeClass("foreign-navtop");
        }
    })
}

// 轮播图
function slides() {
    // 广告轮播图
    jeSlide({
        mainCell: "#findslider",
        navCell: ".hd ul",
        conCell: ".bd ul",
        effect: "leftLoop",
        duration: 4,
        sLoad: "data-pic",
        isTouch: true,
        showNav: true, //自动分页
        autoPlay: $('#findslider .bd li').length > 1 ? true : false //自动播放
    });
    //中国甄选的轮播图
    jeSlide({
        mainCell: "#findChina",
        navCell: ".hd ul",
        conCell: ".bd ul",
        effect: "movie",
        duration: 4,
        //          pageStateCell:".pageState",
        sLoad: "data-pic",
        isTouch: true,
        showNav: false, //自动分页
        autoPlay: false //自动播放
    });
}

$(function () {
    var foreignDatas;
    getForeignData(function (data) {
        if (data) {
            foreignDatas = data.data;
        } else {
            console.log('错误码：0001');
        }
        ;
        foreignDatas && dataRender(foreignDatas);
    })
});
