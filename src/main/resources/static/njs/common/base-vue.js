/**
 * Created by Administrator on 2017/12/14.
 */
var isua = navigator.userAgent.toLowerCase();
//我的账户
jems.myAccount = function (){
    var retmn = jems.parsURL().params.tmn;
    jeAjax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json"
    }).done(function (data) {
        if(data.login_flag){
            if(data.memberrec.memberType == 2){//
                jems.goUrl(msonionUrl+"wx/store/agents.html");
            } else if (data.memberrec.memberType == 3) {
                jems.goUrl(msonionUrl+"wx/store/stores.html");
            } else {
                jems.goUrl(msonionUrl+"wx/ucenter/members.html");
            }
        }else{
            var fromurl = window.location.href;
            if (fromurl.indexOf("indexView") > 0){
                jems.goUrl(msonionUrl+"wx/login.html?"+fromurl.substring(0,fromurl.indexOf("indexView"))+"ucenter/members.html?tmn="+retmn);
            } else{
                jems.goUrl(msonionUrl+"wx/login.html?"+window.location.href);
            }
        }
    });
};
//我的购物车
jems.myShopCart =function (){
    jeAjax({
        type : "post",
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json"
    }).done(function (data) {
        if(data.login_flag){
            if(data.memberrec.memberType == 2){//
                jems.mboxMsg("对不起，洋葱商家无法使用本功能");
            } else {
                jems.goUrl(msonionUrl+"wx/ucenter/cart.html?&_v="+new Date().getTime());
            }
        }else{
            jems.goUrl(msonionUrl+"wx/login.html?"+window.location.href);
        }
    });
};
//返回用户数据
jems.member = function(){
    var jsondata = {},isLogin = false;
    jeAjax({
        type : "post",
        async: false,
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json"
    }).done(function (json) {
        jsondata = json.memberrec;
        isLogin = json.login_flag;
    });
    return {data:jsondata,login:isLogin};
};
//返回用户类型
jems.memberType = function(){
    var type;
    jeAjax({
        type : "post",
        async: false,
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json"
    }).done(function (data) {
        if(data.login_flag){
            type = data.memberrec.memberType;
        }else{
            jems.goUrl(mspaths+"login.html?"+window.location.href);
        }
    });
    return type;
};
//购物车数量
// 查看购物车数量
jems.showCartNum = function (cartNum){
    jeAjax({
        type:"get",
        url : msonionUrl+"cart/count?ct="+new Date().getTime(),
        dataType : "json"
    }).done(function (data) {
        if(data.num != '' && data.num != "undefined" && data.num != undefined || data.num != null){
            // 显示购物车数量
            $Q(".fixcartNum").style.display = data.num <= 0 ? "none" : "block";
            $Q(".fixcartNum").textContent = data.num;
        }else{
            // 如果未登录，则不显示数量提示
            $Q(".fixcartNum").style.display ="none";
        }
    });
};
jems.showCartNumTip = function (cartNum){
    if(cartNum != '' && cartNum != "undefined" && cartNum != undefined || cartNum != null){
        // 显示购物车数量
        $Q(".fixcartNum").style.display = cartNum <= 0 ? "none" : "block";
        $Q(".fixcartNum").textContent = cartNum;
    }else{
        // 如果未登录，则不显示数量提示
        $Q(".fixcartNum").style.display ="none";
    }
};
//添加收藏
jems.addAtten = function (tmn,goodsId){
    var ele = event.target;
    jeAjax({
        type: "get",
        url: msonionUrl+"myatten/add?tmn="+tmn+"&goodsId="+goodsId,
        dataType : "json"
    }).done(function (data) {
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
            jems.tipMsg(msg);
        }
    });
};
//一键下单
jems.akeyOrder = function (productId,price) {
    var type = jems.memberType();
    if(type == 3 || type == 4){
        sessionStorage.buyId = productId+"_1";
        sessionStorage.buyPrice = price;
        jems.goUrl(msonionUrl+"/wx/ucenter/buy-order-sumbit.html");
    }else{
        jems.tipMsg("对不起，洋葱商家无法使用本功能");
    }
};
//添加购物车
var addCartTimer = null;
jems.addCart = function (tmn,goodsId) {
    clearTimeout(addCartTimer);
    addCartTimer = setTimeout(function(){
        if(!jems.limitrule(goodsId, 1)){	// 添加限购规则 2015-11-30
            jeAjax({
                type: "get",
                url: msonionUrl+"cart/add?tmnId="+tmn+"&goodsId="+goodsId,
                dataType : "json"
            }).done(function (data) {
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
            });
        }
    },500);
};
/**
 * 商品限购规则
 * @param gid	购买商品的id
 * @param mid	购买商品的分类id，如果是按指定商品限购，则分类id可以不用传
 * @param num	购买数量
 *
 */
jems.limitrule = function (gid,num){
    var limit = true;
    var params = {"gid":gid,"buynum":num};
    var url = msonionUrl+"sodrest/sodlimit1";
    jeAjax({
        type:'get',
        url:url,
        data:params,
        dataType:'json',
        async:false
    }).done(function (msg) {
        var info = "该商品是限购商品";
        info += "<br />每人限购"+msg.limitNum+"件";
        msg.islimit&&jems.mboxMsg(info);
        limit = msg.islimit;
    });
    return limit;
};
/**
 * 微信分享
 * @param wxtitle 分享的名称
 * @param imgs 分享的图片
 * @param desc 分享的描述
 */
jems.wxShare = function (wxtitle,imgs,desc){
    var wximg = imgs == undefined ? "http://img.51msyc.com/wx/nimages/share_logo.png" : imgs;
    var wxdesc = desc == undefined || desc == "" ? '洋葱OMALL 给你更多' : desc;
    if(isua.match(/MicroMessenger/i) == "micromessenger") {
        jeAjax({
            type: "get",
            url: msonionUrl + "getWeChatSign",
            data: {"url": window.location.href},
            dataType: "json"
        }).done(function (data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appid, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.noncestr, // 必填，生成签名的随机串
                signature: data.finalsign,// 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: wxtitle, // 分享标题
                    link: window.location.href, // 分享链接
                    imgUrl: wximg, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        //alert("3q");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //alert(" no 3q");
                    }
                });
                wx.onMenuShareAppMessage({
                    title: wxtitle, // 分享标题
                    desc: wxdesc, // 分享描述
                    link: window.location.href,//'http://m.msyc.cc/wx/index.html?tmn='+tmn, // 分享链接
                    imgUrl: wximg, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
            wx.onMenuShareQZone({
                title: wxtitle, // 分享标题
                desc: wxdesc, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: wximg, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: wxtitle, // 分享标题
                desc: wxdesc, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: wximg, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    }
};