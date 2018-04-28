/**
 * 收入明细
 * author:cjw
 */

var memberType;		// 登录用户的类型
$(function(){
    // 获取登录人信息
    getMemberInfo();
    // 如果登录人是代理商，则显示加盟店列表
    if(memberType == 2){

    }else{

    }
 
    // 加载数据
    loadListData(); 

    //返回顶部插件引用
    $(window).goTops({toBtnCell:"#gotop",posBottom: 100});
    
    //返回店主中心 
    jems.backStore();
});


/*获取登录用户信息*/
function getMemberInfo(){ 
    $.ajax({
        type:'get',
        url:msonionUrl+"menbercenter/loginmbrinfo?d="+new Date().getTime(),
        async:false,
        dataType:'json',
        success:function(msg){
            memberType = msg.memberType;
        }
    });
}


/*列表数据载入*/
function loadListData(){ 
    var ParHref = jems.parsURL();
    var cashId = ParHref.params.applyId;
    if(!cashId)return;
    //产品列表
    var pageNum = 1;
    var totalPage = 1;
    var loadFlg = true;
    // 取消之前绑定的滚动事件，载入数据时重新绑定
    $(window).off("scroll");
    //明细列表数据加载
    $(window).dropload({afterDatafun: listData});
    //获取收入明细列表的数据
    function listData() {
        if(pageNum>totalPage){
            $("#loadaimbox i").css({display: 'none'});
            $("#loadaimbox em").text('到底了,没有更多数据了');
            return;
        }

        if(!loadFlg)return loadFlg;
        loadFlg=false;

        var url = msonionUrl+"cash/cashedorders";
        var data = {'pageNo':pageNum,'cashId':cashId};

        $.ajax({
            type : "get",
            url : url,
            data:data, 
            dataType : "json",
            success:function(data){
                data.totalPage>1?$("#loadaimbox").show():$("#loadaimbox").hide();
                if(data.total == 0){
                    $("#no_record").css({display:"block"});
                }else{
                    $("#no_record").hide();
                    var gettpl = $('#incomeListData').html();
                    jetpl(gettpl).render(data, function(html){
                        $('#incomeList').append(html);
                    });
                    totalPage = data.totalPage;
                    pageNum++;
                    loadFlg = true;
                }
            }
        });
    }
}

