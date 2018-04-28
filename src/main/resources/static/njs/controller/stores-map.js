/**
 * Created by sinarts on 2017/3/27.
 */
var params =  jems.parsURL().params;
$(function () {
    var wh = $(window).height();
    $("#contentmap").height(wh - 100);
    $(window).resize(function () {
        $("#contentmap").height($(window).height() - 100);
    })
    var map = new BMap.Map("contentmap"), ptmk;
    var geolocation = new BMap.Geolocation();
    var navigLocation = !!navigator.geolocation ? navigator.geolocation : geolocation;
    //var pointArr = new BMap.Point(113.389887, 23.125213);
    //创建自己设置的标注图标
    var myIcon = new BMap.Icon("http://msyc-img.oss-cn-shenzhen.aliyuncs.com/images/icon/msmarker.png", new BMap.Size(30, 30),
        {offset: new BMap.Size(20,-10),imageOffset: new BMap.Size(0, 0)});
    $.ajax({
        type: "post",
        url: msonionUrl + "menbercenter/memberInfo",
        dataType: "json",
        success: function (json) {
            var wxmember = json.memberrec;
            if(json.login_flag) {
                $.ajax({
                    type: "get",
                    url: msonionUrl + "/store/name?tmn=" + wxmember.memberTmnId,
                    dataType: "json",
                    success: function (data) {
                        if (data.storeLat > 0 && data.storeLng > 0) {
                            getCurrentPos({lat: data.storeLat, lng: data.storeLng});
                            $("#fuAddress").val((data.storeMapAddress).split(",")[1] || "");
                            $("#storeWechat").val(data.storeWechat);
                        } else {
                            getCurrentPos("");
                        }
                    }
                });
            }else {
                jems.goUrl("../login.html?"+window.location.href);
            }
        }
    })
    
    //获取当前位置
    function getCurrentPos(pos) {
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){  
                var Poiarr = typeof pos == "object" ? new BMap.Point(pos.lng,pos.lat) : r.point;
                ptmk = new BMap.Marker(Poiarr, {icon: myIcon});
                map.centerAndZoom(Poiarr, 20);
                // 启用滚轮放大缩小 
                map.enableScrollWheelZoom();
                // 启用放大缩小 尺
                map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_RIGHT}));
                //拖动图标获取附近的地址
                ptmk.addEventListener("dragend", function (e) {
                    showInfo(e);
                });
                ptmk.setShadow();
                //启用拖拽
                ptmk.enableDragging();
                //把点添加到地图上  
                map.addOverlay(ptmk);
                var label = new BMap.Label("可拖动定位",{offset:new BMap.Size(-15,-25)});
                ptmk.setLabel(label);
                map.panTo(Poiarr);
                getAddress(Poiarr);
            }else {
                jems.mboxMsg('failed'+this.getStatus());
            }
        });
    }

    //绑定Marker的拖拽事件
    function showInfo(e){
        var gc = new BMap.Geocoder();
        gc.getLocation(e.point, function(rs){
            var addComp = rs.addressComponents;
            var address = addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
            var adrs = {"address":address,"point":e.point};
            setMyAddress(adrs);
            displayPOI(adrs,e.point);
        });
    }
    
    //获取地址信息，设置地址label
    function getAddress(point){
        var gc = new BMap.Geocoder();
        gc.getLocation(point, function(rs){
            var addComp = rs.addressComponents;
            var address =  addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
            var adrs = {"address":address,"point":point};   
            setMyAddress(adrs);
            displayPOI(adrs,point);
        });
    }
    //获取半径范围内的附近地址
    var mOption = {
        poiRadius : 400,           //半径为1000米内的POI,默认100米
        numPois : 10                //列举出50个POI,默认10个
    };
    var myGeo = new BMap.Geocoder();        //创建地址解析实例
    function displayPOI(arr,mPoint){
        new BMap.Circle(mPoint,400);        //添加一个圆形覆盖物
        myGeo.getLocation(mPoint, function mCallback(rs){
            var adrsList = [arr];
            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
            for(i=0;i<allPois.length;++i){
                adrsList.push({"address":allPois[i].address,"point":allPois[i].point})
            }
            appendHtml(adrsList);
        },mOption);
    }
    //将获取到的地址与坐标列表出来，同时设置事件
    function appendHtml(arr) {  
        var adrUl = $("#mapAddress ul");
        adrUl.empty();
        var len = arr.length;   
        $("#mapAddress").height(len>3 ? 35*4 : "");
        $.each(arr, function (i,val) {
            adrUl.append("<li point-lat="+val.point.lat+" point-lng="+val.point.lng+">"+val.address+"</li>");
        });
        adrUl.find("li").on("click",function () {
            var that = $(this);
            var myArr = {
                "address":that.text(),
                "point":{lat:that.attr("point-lat"),lng:that.attr("point-lng")}
            };
            setMyAddress(myArr);
        })
    }
    //将当前的地址设置到头部
    function setMyAddress(arr) {
        $("#myAddress").text(arr.address).attr("point-lat",arr.point.lat).attr("point-lng",arr.point.lng);
    }
    
    $("#getMapData").on("click",function () {
        var myAddress = $("#myAddress");
        //获取当前选中的信息
        var adrtetx = myAddress.text(),
            adrlat = myAddress.attr("point-lat"),
            adrlng = myAddress.attr("point-lng"),
            fuAddress = $("#fuAddress").val(),
            storewx = $("#storeWechat").val();
        //将获取的信息发送到后台
        mBox.open({
            width:"90%",
            content:"<p class='tc f16' style='width:100%'>您保存此项内容可能会有陌生人添加您的微信，若介意请勿保存。</p>",
            closeBtn: [false],
            btnName:['确定','取消'],
            btnStyle:["color: #0e90d2;"],
            maskClose:false,
            yesfun : function(){
                $.ajax({
                    type : "post",
                    data : {storelng:adrlng,storelat:adrlat,storeMapAddress:(adrtetx+","+fuAddress),storeWechat:storewx},
                    url : msonionUrl+"store/updateLngAndLat",
                    dataType : "json",
                    success:function(data){
                        var errCode = data.errCode;
                        if(errCode == 10000){
                            jems.tipMsg("保存成功");
                        }
                    }
                });
            }
        });
    })
});