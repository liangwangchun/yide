var params = jems.parsURL().params;
var sodId = params.sodId == undefined ? 0 : params.sodId;

$(function () {

    function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        // second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+'';
    };

    $.ajax({
        type: "post",
        data: {"sodId": sodId},
        url: msonionUrl + "app/subSodrest/findConsultationBySodId",
        dataType: "json",
        success: function (result) {
            var memberData = jems.member().data;
            var memberId = memberData.memberId;
            var headUrl = memberData.memberHeadUrl;
            var data = result.data;
            var html = '';
            data.forEach(function (v) {
                html += '<li class="p15 bg-wh mb10">';
                html += '<div class="flexbox f14 jecell-bottom jepor je-align-center pb10">';
                if (v.createUserId === memberId) {
                    html += '<span class="rdu photo show" style="background-image:url(' + headUrl + ')"></span>';
                    html += '<span class="show ml15 b">我</span>';
                } else {
                    html += '<span class="rdu photo show" style="background-image:url(http://img.51msyc.com/wx/nimages/share_logo.png)"></span>';
                    html += '<span class="show ml15 b">洋小葱</span>';
                }

                html += '<span class="show jeflex f13 g9 tr">'+ formatDateTime(v.createTime) + '</span>';
                html += '</div>';
                html += '<div class="f14 pt15">';
                html += '<h3 class="b f14 mb15">' + v.recordTitle + '</h3>';
                if(v.recordContent != "" && v.recordContent != undefined){
                    html += '<p class="mt5">' + v.recordContent.replace(/-/g, "<br />") + '</p>';
                } else {
                    html += '<p class="mt5"></p>';
                }
                html += '</div>';
                html += '</li>';
            });
            $("#contentlist ul").html(html);
        },
        error: function (result) {

        }
    });
});