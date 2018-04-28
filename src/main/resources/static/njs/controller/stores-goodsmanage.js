/**
 * Created by mengyan on 2017/11/3.
 */
$(function () {

    
    jemRoll({
        cell:".navbox",
        posCell:"li.on",
        isAdjust: true
    });
    $(".doubtBtn").on("tap",function () {
        mBox.open({
            title: ['店铺供货价', 'color:#333;font-size:1.6rem;text-align:center;'],
            width: "90%",
            height: "50%",
            content: '<div style="background-color: #fff;" id="materialdata"></div>',
           // closeBtn: [true, 1],
            btnName: ['关闭'],
            btnStyle: ["color: #0e90d2;"],
            maskClose: false,
            success:function () {
                $("#materialdata").html($("#materialView").html());
            }
        });
    });
    
    $(".varietyBtn").on("click",function () {
        var _thisp=$(this).parents("li").children(".goodsVariety"),_this = $(this);
         if (_thisp.is(":hidden")){
             _thisp.show();
             _this.addClass("up").removeClass("down");
         }else{
             _thisp.hide();
             _this.removeClass("up").addClass("down");
         }
    });
    $(".goodsVariety dd").on("click",function () {
        $(this).addClass("on rdu4").siblings().removeClass("on rdu4")
    });
 
    $("#sortnavlist li").each(function(){
        $(this).on("tap",function(){
            goTypeSort(this)
        })
    });
    toggleSortStyle();
    /**
     * 升序或降序
     * @param updown
     */
    function goTypeSort(that){
        if(!$(that).hasClass("on")) $(that).addClass("on");
        var ordertype = ParHref.params.ordertype;
        var isunASC = ParHref.params.upordown == undefined || ParHref.params.upordown == "ASC";
        var udSort = isunASC ? "ASC" : "DESC";
        udSort == "ASC" ? $(that).find(".icon-up").addClass("act") : $(that).find(".icon-down").addClass("act");
        sortByType($(that).data('type'),udSort == "ASC" ? "DESC" : "ASC");
    }

    function toggleSortStyle(){
        var ordertype = ParHref.params.ordertype;
        var isunASC = ParHref.params.upordown == undefined || ParHref.params.upordown == "ASC";
        var udSort = isunASC ? "ASC" : "DESC", sortli = $(".sortnavlist li").eq(ordertype-1);
        sortli.addClass("on");
        udSort == "ASC" ? sortli.find(".icon-up").addClass("act") : sortli.find(".icon-down").addClass("act");
    }

    /**
     * 排序方法
     * @param sortType
     * @param upordown
     */
    function sortByType(sortType,upordown){
        var param = ParHref.params;
        sortType&&(param.ordertype = sortType);
        upordown||(upordown="DESC");
        param.upordown = upordown;
        var url = "mygoodsview?"+$.param(param);
        jems.goUrl(url);
    }



})


