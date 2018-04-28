/**
 * Created by sinarts on 2017/6/1.
 */
$(function () {
    //获取页面后缀参数
    var params = jems.parsURL().params;
    // 页数
    var pageNum = 1, pageSize = 5,stateNum = parseInt(params.state);
    if(isNaN(stateNum)){
    	stateNum = 0;
    }
    var urls = msonionUrl+"couponRest/couponMineList";
    $("#coponsNav").find("p").eq(stateNum).addClass('on');
    $("#coponsNav").find("p").on("tap",function () {
        var idxNum = parseInt($(this).attr("state"));
        jems.goUrl("coupons.html?state="+idxNum);
    });
    var tmpHtml = $("#coponsData"+stateNum).html();
    $.ajax({
        type: 'POST',
        url: urls,
        data:{"pageNo":pageNum,"couponState":stateNum},
        dataType: 'json',
        async:false,
        success: function(msg){
            var datas = {data:msg.data||[]}, arrLen = datas.data.length;
            jetpl(tmpHtml).render(datas, function(result){
                $('#coponsList').append(result);
            });
            if(arrLen > 0) {
            	pageNum++
                droploadDate();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        },
        complete: function(XMLHttpRequest, textStatus) {
            this; // 调用本次AJAX请求时传递的options参数
        }
    });

    // 下拉加载数据
    function droploadDate() {
        $('#coponsart').pullLoad({
            loadUpFn:function () {
                location.reload()
            },
            loadDownFn: function (me) {
                // 拼接HTML
                $.ajax({
                    type: 'POST',
                    url: urls,
                    data:{"pageNo":pageNum,"couponState":stateNum},
                    dataType: 'json',
                    success: function(msg){
                        var datas = {data:msg.data||[]}, arrLen = datas.data.length;
                        if(arrLen > 0){
                            setTimeout(function(){
                                jetpl(tmpHtml).render(datas, function(result){
                                    $('#coponsList').append(result);
                                });
                                // 每次数据插入，必须重置
                                me.resetload();
                            },800);
                            pageNum++;
                        }else{
                            // 如果没有数据, 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                            me.resetload();
                        }

                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            },
            threshold: 50
        });
    }
})