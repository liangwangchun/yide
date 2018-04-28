/**
 * Created by Administrator on 2017/11/27.
 */
var ParHref = jems.parsURL();
$(function () {
    $("#searchBtn").on('click',function(){
        sessionStorage.keywords == "";
        sessionStorage.menuIds =  "";
        sessionStorage.brandIds =  "";
        sessionStorage.countryIds = "" ;
        sessionStorage.minamt =0;
        sessionStorage.maxamt = 0;
        var sosVal = $("#formalSearchTxt").val();
        if(sosVal == "") {
            jems.tipMsg("关键字不能为空");
        }else{
            setHistory(decodeURI(decodeURI(sosVal)));
            jems.goUrl(mspaths + 'search-list.html?keywords=' + encodeURI(encodeURI(sosVal)));
        }
    });
    //最近搜索
    var hisarr = getHistory(), hisStr = "";
    $.each(hisarr,function (i,val) {
        var sekey = mspaths + 'search-list.html?keywords=' + encodeURI(encodeURI(val));
        hisStr += val != "No search" ? "<li onclick=jems.goUrl('"+sekey+"')>"+val+"</li>":"<li>"+val+"</li>";
    });
    $("#searchHistory").html(hisStr);
    //热门搜索
    // $.ajax({
    //     type : "get",
    //     url:mspaths+"js/jsons/threeMenu.json?tv="+ new Date().getTime(),
    //     dataType : "json",
    //     success:function(json){
    //         var datatop = {data:json.data};
    //         jetpl('#sostoplistData').render(datatop, function(html){
    //             $('#sostoplist').html(html);
    //         });
    //     }
    // });
});

//存值方法,新的值添加在首位
function setHistory(keyword) {
    var historyItems = localStorage.historyItems;
    if (historyItems === undefined) {
        localStorage.historyItems = keyword;
    } else {
        var onlyItem = historyItems.split('|').filter(function(e) {
            return e != keyword;
        });
        if (onlyItem.length > 0) historyItems = keyword + '|' + onlyItem.join('|');
        localStorage.historyItems = historyItems;
    }
}
//获取所有history值
function getHistory() {
    var str = localStorage.historyItems;
    return str == undefined ? ['No search'] : str.split('|');
}
//清除history值
function clearHistory() {
    localStorage.removeItem('historyItems');
    window.location.reload();
}