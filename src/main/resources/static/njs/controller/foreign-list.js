// JavaScript Document
var ParHref = jems.parsURL(window.location.href);
var params = ParHref.params;
var tmn = params.tmn;
//var tmn = params.tmn,uid=params.uid,client=params.client,msToken=params.msToken;
var flag = true;
var pageNum = 1;
var totalPage = 1;
var currentPageNum = 0;
var html = '';
var confightml = '';
var classhtml = '';
var twoclassid = 0;
var threeclassid = 0;
var celldesc = 0;
var pid = params.pid == "undefined" ? 47 : params.pid;
var pageTotal = 1; // 总页数通过ajax 返回的数据确认
$(function () {
    classInfo();

    //时间排序筛选
    $("li[data-cell]").on("tap", function () {
        $(this).siblings().removeClass("on");
        $(this).addClass("on");
        celldesc = $(this).attr("data-cell");
        pageNum = 1;
        listData(celldesc, twoclassid, threeclassid);
    })
    //返回顶部插件引用
    $(window).goTops({toBtnCell: "#gotop", posBottom: 100});

    //筛选
    $("#navfeilei").on('tap', function () {
        var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
        shaixuan.css('display') == 'block' ? shaixuan.hide() : "";
        feilei.css('display') == 'block' ? feilei.hide() : feilei.show();
    })
    $("#navshaixuan").on('tap', function () {
        var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
        feilei.css('display') == 'block' ? feilei.hide() : "";
        shaixuan.css('display') == 'block' ? shaixuan.hide() : shaixuan.show();
    })
    $(".ncsmask").on('tap', function () {
        hideMask();
    })
});

function defaultStatu() {
    celldesc = 0;
    $("li[data-cell]").removeClass("on");
}

/**
 * 隐藏蒙层
 */
function hideMask() {
    var shaixuan = $("#navlistshaixuan"), feilei = $("#navlistfenlei");
    if (shaixuan.css('display') == 'block') shaixuan.hide();
    if (feilei.css('display') == 'block') feilei.hide();
}

/**
 * 分类数据绑定
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
            var data = result.data;
            if (10000 == result.errCode) {
                var classId = params.classId;
                var tId = params.tId;//三级分类Id
                if (classId == undefined) {
                    confightml += '<li class="on" data-twoclassid="0">全部</li>';
                }
                else {
                    confightml += '<li data-twoclassid="0">全部</li>';
                }

                data.childrens.forEach(function (v, index, array) {//二级分类
                    if (classId == undefined) {//没有传递分类Id的情况
                        twoclassid = 0;
                        confightml += '<li data-twoclassid="' + v.id + '">' + v.let_name + '</li>';
                        v.childrens.forEach(function (val, ind) {
                            classhtml += '<li data-threeclassid="' + val.id + '" class="jecell-bottom"><a href="javascript:;">' + val.let_name + '</a></li>';
                        })
                        $("#navlistfenlei ul").html(classhtml);
                    }
                    else {//有传递分类Id
                        twoclassid = classId;
                        if (tId != undefined) {
                            threeclassid = tId;
                        }
                        if (classId == v.id) {
                            confightml += '<li class="on" data-twoclassid="' + v.id + '">' + v.let_name + '</li>';
                            v.childrens.forEach(function (val, ind) {
                                if (tId == val.id) {
                                    classhtml += '<li data-threeclassid="' + val.id + '" class="jecell-bottom on"><a href="javascript:;">' + val.let_name + '</a></li>';
                                } else {
                                    classhtml += '<li data-threeclassid="' + val.id + '" class="jecell-bottom"><a href="javascript:;">' + val.let_name + '</a></li>';
                                }
                            })
                            $("#navlistfenlei ul").html(classhtml);
                        }
                        else {
                            confightml += '<li data-twoclassid="' + v.id + '">' + v.let_name + '</li>';
                        }
                    }
                })
                $(".mstopnav ul").append(confightml);

                $("li[data-twoclassid]").on("tap", function () {
                    $(this).siblings().removeClass("on");
                    $(this).addClass("on");
                    classhtml = '';
                    //绑定三级分类
                    twoclassid = $(this).attr("data-twoclassid");
                    data.childrens.forEach(function (v) {
                        if (v.id == twoclassid) {
                            v.childrens.forEach(function (val, ind) {
                                classhtml += '<li data-threeclassid="' + val.id + '" class="jecell-bottom"><a href="javascript:;">' + val.let_name + '</a></li>';
                            })
                        }
                    })
                    $("#navlistfenlei ul").html(classhtml);
                    threeclassid = 0;
                    pageNum = 1;
                    defaultStatu();
                    firstData();//点击二级分类查询

                    $("li[data-threeclassid]").on("tap", function () {
                        $(this).siblings().removeClass("on");
                        $(this).addClass("on");
                        threeclassid = $(this).attr("data-threeclassid");
                        pageNum = 1;
                        defaultStatu();
                        firstData();//点击三级分类查询
                    });
                });

                $("li[data-threeclassid]").on("tap", function () {
                    $(this).siblings().removeClass("on");
                    $(this).addClass("on");
                    threeclassid = $(this).attr("data-threeclassid");
                    pageNum = 1;
                    defaultStatu();
                    firstData();//点击三级分类查询
                });

                //产品列表数据加载
                $(window).dropload({afterDatafun: firstData});
            }
        }
    });
}

function firstData() {
    listData(celldesc, twoclassid, threeclassid);
}
/**
 * 获取商品列表的数据
 */
function listData(desc, twoClass, threeClass) {
    if (twoClass == 0) {
        $(".navclass").css("display", "none!important");
        $(".navclass").next().css("padding-top", "40px");
    } else {
        $(".navclass").css("display", "");
        $(".navclass").next().css("padding-top", "80px");
    }

    if (!flag || currentPageNum == pageNum) {
        return;
    }
    if (pageNum > pageTotal) {
        $("#loading").html(' <p class="pt5 pb5 tc"><span>就这样，到底了</span></p>').show();
        return;
    }
    hideMask();
    $.ajax({
        type: "post",
        url: msonionUrl + "subProduct/findSubIndexList/v1",
        data: {
            "pageNo": pageNum,
            "tmn": tmn,
            "desc": desc,
            "twoClass": twoClass,
            "threeClass": threeClass,
            "pid": pid
        },
        dataType: "json",
        beforeSend: function () {
            flag = false;
            $("#loading").html(' <p class="loading pt5 pb5" id="magLoading"><span>加载中</span></p>').show();
        },
        success: function (result) {
            if (10000 == result.errCode) {
                html = '';
                confightml = '';
                classhtml = '';
                var data = result.data;
                pageTotal = data.pageTotal;
                if (data.realData.length == 0) {
                    $("#loading").hide();
                    if (pageNum > 1) {
                        $("#resultEmpty").addClass("hide");
                        return;
                    } else {
                        $("#resultEmpty").removeClass("hide");
                    }
                } else {
                    $("#resultEmpty").addClass("hide");
                    if(pageNum == pageTotal){
                        $("#loading").html(' <p class="pt5 pb5 tc"><span>就这样，到底了</span></p>').show();
                    }
                }
                data.realData.forEach(function (v, index, array) {
                    html += '<li>';
                    html += '<div class=\"p5\">';
                    html += '<span data-id="' + v.id + '" data-menuid="' + v.t_menuId + '" class="photo show" style="background-image:url(' + msPicPath + '' + v.picUrl + '?x-oss-process=image/resize,w_320)"></span>';
                    html += '<h3 class="f13 mt5">' + v.name + '</h3>';
                    html += '<p class="flexbox mt5 je-align-center">';
                    html += '<span class="f12 purple show">&yen;' + v.freePrice + '</span>';
                    html += '<del class="f10 g9 show jeflex ml10">&yen;' + v.marketPrice + ' </del>';
//                    html += '<span class="btn btn-favorite show edit" data-id="' + v.id + '" ></span>';
                    html += '</p>';
                    html += '</div>';
                    html += '</li>';
                })
                if (pageNum == 1) {
                    $("#contentlist ul").html(html);
                } else {
                    $("#contentlist ul").append(html);
                }
                pageNum++;
                //图片点击跳转
                $(".photo").on("click", function () {
                    window.location.href = 'foreign-detail.html?tmn=' + tmn + '&id=' + $(this).attr('data-id') + '&menuId=' + $(this).attr("data-menuid");
                    return;
                })
                //关注
                $(".btn-favorite").on("tap", function () {
                    var id = $(this).attr("data-id");
                })
            } else {
                jems.tipMsg(result.errMsg)
                return;
            }
            flag = true;
        }
    });
}







