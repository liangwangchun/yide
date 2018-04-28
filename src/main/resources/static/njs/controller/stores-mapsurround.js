/**
 * Created by sinarts on 2017/3/27.
 */
var mk = 0, mapData = [], map,ptmk;
$(function () {
    var wh = $(window).height();
    $("#contentmap").height(wh - 40);
    $(window).resize(function () {
        $("#contentmap").height($(window).height() - 40);
    })
    map = new BMap.Map("contentmap"), ptmk;
    var geolocation = new BMap.Geolocation();
    var navigLocation = !!navigator.geolocation ? navigator.geolocation : geolocation;
    //var pointArr = new BMap.Point(113.389887, 23.125213);
    //创建自己设置的标注图标
    var myIcon = new BMap.Icon("http://msyc-img.oss-cn-shenzhen.aliyuncs.com/images/icon/msmarker.png", new BMap.Size(30, 30),
        {offset: new BMap.Size(20,-10),imageOffset: new BMap.Size(0, 0)});
    
    //获取当前位置
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            ptmk = new BMap.Marker(r.point, {icon: myIcon});
            map.centerAndZoom(r.point, 20);
            // 启用滚轮放大缩小 
            map.enableScrollWheelZoom(true);
            // 启用放大缩小 尺
            map.addControl(new BMap.NavigationControl());
            //把点添加到地图上  
            //map.addOverlay(ptmk);
            map.panTo(r.point);
            storeMarker(r.point);    
        }else {
            jems.mboxMsg('failed'+this.getStatus());
        }
    });

    //自定义函数,创建标注
    function addMarker(data){
        var addClickHandler = function (content,mkelem,idx){
            mkelem.addEventListener("click",function(e) {
                mk = idx;
                var p = e.target;
                onMapInfo(content,{posLng:p.getPosition().lng,posLat:p.getPosition().lat});
            });
        };
        for(var i=0;i<data.length;i++){
            // 创建标注
            var addmk = new BMap.Marker(new BMap.Point(data[i].storeLng,data[i].storeLat), {icon: myIcon});
            // 将标注添加到地图中
            map.addOverlay(addmk);
            if(i == 0){
                onMapInfo(data[i],{posLng:data[i].storeLng,posLat:data[i].storeLat});
            }
            //标注的点击事件
            addClickHandler(data[i],addmk,i);
        }
    }

    //拉取当前位置附近的店主数据
    function storeMarker(point){
        $.ajax({
            type : "get",
            url : msonionUrl+"store/nearestStoreFromMe",
            data : {storeLng:point.lng,storeLat:point.lat,limit:20},
            dataType : "json",
            success:function(json){
                if (json.errCode == 10000){
                    tmncount = json.data.length;
                	if(tmncount == 0){
                		jems.mboxMsg("附近暂无店主");
                    }
                    mapData = json.data;
                    addMarker(json.data);  console.log(mapData)
                }else {
                    jems.mboxMsg(json.errMsg);
                }
            }
        });  
    }
    
});
function onNextMap() {
    mk == 19 ? mk = 0 : mk++;
    onMapInfo(mapData[mk],{posLng:mapData[mk].storeLng,posLat:mapData[mk].storeLat});
}
function onMapInfo(cont,pos) {
    var addopts = {
        width : 300,                //信息窗口宽度
        height: 170,                 //信息窗口高度
        //title : "<span style='font-size:14px;'>"+content.storeName+"</span>" , //信息窗口标题
        enableMessage:false         //设置允许信息窗发送短息
    };
    var addpoi = new BMap.Point(pos.posLng, pos.posLat);  
    var addText = '<div id="excellentShopdata">'+
    '<div class="ov">'+
    '<div class="img_logo fl "><img src="../nimages/owner_logo.png"/></div>'+
    '<p class="fr f10 pr30 g6 g9">货 | 在 | 海 | 外 |  店 | 在 | 身 | 边 |</p>'+
    '</div><p id="storeName" class="f18 tcl mt20">'+cont.storeName+'</p> '+
    '<p class="tc f12 mt20" id="counts">贴心服务'+cont.memberCount+'位客户，并为TA们推荐了'+cont.salesCount+'件进口好货。</p><div class="flexbox" style="padding-top:5px;">'+
    '<p class="tcl jeflex jew100 "><span class="btn1 f12 rdu3 " onclick="onNextMap()">不喜欢，选择另一个</span></p> '+
    '<p class="jeflex tcl ml10 jew100"><span class="btn2 f12 rdu3"  id="tmnClick" onclick="goMsyc('+cont.tmnId+')">进入店铺</span></p>'+
    '</div></div>';
    // 创建信息窗口对象 
    var infoWindow = new BMap.InfoWindow(addText,addopts);
    //开启信息窗口
    map.openInfoWindow(infoWindow,addpoi);       
}
function goMsyc(tmn) {
    $.ajax({
        type : "post",
        async: false,
        url : msonionUrl+"menbercenter/memberInfo",
        dataType : "json",
        success:function(data){
            var urls = "http:"+msonionUrl+'wx/indexView?tmn=';   
            if(data.login_flag){  
                jems.goUrl(urls+data.memberrec.memberTmnId);
            }else{
                var ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
                    jems.goUrl(msonionUrl+"user/wxlogin?tmn="+tmn+"&returnUrl="+urls+tmn+"&type=lbs");
                }else {
                    jems.goUrl(msonionUrl+'wx/register.html?tmn='+tmn);
                }
                
            }
        }
    });
}