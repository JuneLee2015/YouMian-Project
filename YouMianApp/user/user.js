define(function (require, exports, module) {
    require("../public/util/common.js");

    var scrollArr = {};
    function DoMethod(methodName, successHandler) {
        $.ajax({
            type: "POST",
            url: "../Handler/MyHandler.ashx?opertype=" + methodName,
            contentType: "application/json",
            //data: "{a: 1, b: 2}",
            dataType: 'json',
            success: function (result) {
                successHandler(result);
            },
            error: function (result) {
                alert(result);
            }
        });
    }

    var restPageIndex = 0;
    var restPageSize = 10;

    var moviePageIndex = 0;
    var moviePageSize = 10;

    var ticketPageIndex = 0;
    var ticketPageSize = 10;

    function GetRestaurantOrderList() {
    	var mobile = localStorage.getItem("mobile");

		//for debug only
    	//mobile = "18500234180";

	    if (mobile == null)
            return;
        var str = "getrestaurantorderofcurrentuser&pageIndex=" + restPageIndex + "&pageSize=" + restPageSize + "&mobile=" + mobile;
        DoMethod(str, function (result) {
            if (result == "") {
                $("#page_reserve_list a[actionName='nextPage_restorder']").html("没有更多了！");
                return;
            }
            var str = "";
            var notget = "";
            var hasget = "";
            for (var i = 0; i < result.length; i++) {
                str += "<li class=\"pad10\">";
                str += "<div class=\"box h30\">";
                str += "<div class=\"box1\">" + result[i].rname + "</div>";
                str += "<div>餐位：" + result[i].canwei + "</div>";
                str += "</div>";
                str += "<div class=\"box h30\">";
                str += "<div class=\"box1\">" + result[i].dining_time + "</div>";

                //订单状态  0 ： 已预定   1：已确认   ，  已预订的能够修改，已确认的不让修改了！
                var temp = "";
                if (result[i].cw_status == "False") {
                    temp = "已预定";
                } else {
                    temp = "已确认";
                }

                str += "<div><span class=\"color-theme\">" + temp + "</span></div>";
                str += "</div>";

                if (result[i].cw_status == "False") {
                    temp = "已预定";
                    str += "<div class=\"box pad-t5\">";
                    str += "<a class=\"box1 pad-h10percent btn-buy\" actionname=\"cancelReserve\" data-id=\"" + result[i].oid + "\"><span class=\"h30\">取消</span></a>";
                    str += "<a class=\"box1 pad-h10percent btn-buy\" actionname=\"editReserve\" data-id=\""+result[i].oid+"\"><span class=\"h30\">修改</span></a>";
                    str += "</div>";
                } else {
                    temp = "已确认";
                    str += "<div class=\"box pad-t5\">";
                    str += "<a class=\"box1 pad-h10percent btn-buy\" actionname=\"cancelReserve\" data-id=\"" + result[i].oid + "\"><span class=\"h30\">取消预订</span></a>";
                    str += "</div>";
                    str += "</li>";
                    str += "<li class=\"hr\"></li>";
                }
                

                var time = result[i].dining_time;
                var now = new Date();
                if (Date.parse(time) > now) {
                    notget += str;
                } else {
                    hasget += str;
                }
                str = "";
            }

            $("#div_order_notget").append(notget);
            $("#div_order_hasget").append(hasget);
            setTimeout(function () {
                if (scrollArr["wrapper_notget"])
                    scrollArr["wrapper_notget"].refresh();
            }, 1);
            setTimeout(function () {
                if (scrollArr["wrapper_hasget"])
                    scrollArr["wrapper_hasget"].refresh();
            }, 1);
        });
    }

    function GetMovieOrderList() {
        var mobile = localStorage.getItem("mobile");
        //mobile = "18686145743";
        if (mobile == null)
            return;
        var str = "getmovieandticketorderofcurrentuser&pageIndex=" + moviePageIndex + "&pageSize=" + moviePageSize + "&mobile=" + mobile+"&isMovie=1";
        DoMethod(str, function (result) {
            if (result == "") {
                $("#page_movie_list a[actionName='nextPage_movieorder']").html("没有更多了！");
                return;
            }
            var str = "";
            var notget = "";
            var hasget = "";
            for (var i = 0; i < result.length; i++) {
                str += "<li class=\"pad10\">";
                str += " <a actionname=\"toDetailMovie\" data-id=\""+result[i].team_id+"\">";
                str += "<div class=\"shop-info-title\">";
                str += "<span>" + result[i].title + "</span><span class=\"color-theme\">("+result[i].quantity+")</span>";
                str += "</div>";
                str += "<div class=\"shop-info-list box\">";
                str += "<div>优惠券：</div>";
                str += "<div class=\"box1\">";
                str += "<div>" + result[i].cid + "</div>";
                str += "<div>" + result[i].secret + "</div>";
                str += "</div>";
                str += "</div>";
                str += "<div class=\"order-list-time\">";
                str += "<span class=\"info-small\">有效期：" + result[i].b_time + "至"+result[i].e_time+"</span>";
                str += "</div>";
                str += "</a>";
                str += "</li>";
                str += "<li class=\"hr\"></li>";

                var consumedornot = result[i].consume;
                if (consumedornot!=null && consumedornot=="N") {
                    notget += str;
                } else {
                    hasget += str;
                }
                str = "";
            }

            $("#div_movie_notget").append(notget);
            $("#div_movie_hasget").append(hasget);
            setTimeout(function () {
                if (scrollArr["wrapper_movie_not"])
                    scrollArr["wrapper_movie_not"].refresh();
            }, 1);
            setTimeout(function () {
                if (scrollArr["wrapper_movie_has"])
                    scrollArr["wrapper_movie_has"].refresh();
            }, 1);
        });
    }

    function GetTicketOrderList() {
        var mobile = localStorage.getItem("mobile");
        //mobile = "18686145743";
        if (mobile == null)
            return;
        var str = "getmovieandticketorderofcurrentuser&pageIndex=" + ticketPageIndex + "&pageSize=" + ticketPageSize + "&mobile=" + mobile + "&isMovie=0";
        DoMethod(str, function (result) {
            if (result == "") {
                $("#page_ticket_list a[actionName='nextPage_ticketorder']").html("没有更多了！");
                return;
            }
            var str = "";
            var notget = "";
            var hasget = "";
            for (var i = 0; i < result.length; i++) {
                str += "<li class=\"pad10\">";
                str += " <a actionname=\"toDetailMovie\" data-id=\""+result[i].team_id+"\">";
                str += "<div class=\"shop-info-title\">";
                str += "<span>" + result[i].title + "</span><span class=\"color-theme\">(" + result[i].quantity + ")</span>";
                str += "</div>";
                str += "<div class=\"shop-info-list box\">";
                str += "<div>优惠券：</div>";
                str += "<div class=\"box1\">";
                str += "<div>" + result[i].cid + "</div>";
                str += "<div>" + result[i].secret + "</div>";
                str += "</div>";
                str += "</div>";
                str += "<div class=\"order-list-time\">";
                str += "<span class=\"info-small\">有效期：" + result[i].b_time + "至" + result[i].e_time + "</span>";
                str += "</div>";
                str += "</a>";
                str += "</li>";
                str += "<li class=\"hr\"></li>";

                var consumedornot = result[i].consume;
                if (consumedornot != null && consumedornot == "N") {
                    notget += str;
                } else {
                    hasget += str;
                }
                str = "";
            }

            $("#div_ticket_notget").append(notget);
            $("#div_ticket_hasget").append(hasget);
            setTimeout(function () {
                if (scrollArr["wrapper_ticket_not"])
                    scrollArr["wrapper_ticket_not"].refresh();
            }, 1);
            setTimeout(function () {
                if (scrollArr["wrapper_ticket_has"])
                    scrollArr["wrapper_ticket_has"].refresh();
            }, 1);
        });
    }

    //获取该优惠券的详细信息，适用于 所有的 电影票优惠券 和 优惠券的
    function GetDetailsOfThisTicket(team_id) {
        //绑定头和尾的信息
        DoMethod("getsecretofteam_part1&team_id=" + team_id, function (result) {
            if (result == "") {                
                return;
            }
            var ticketDetail = result.ticket_details;
            $("#teamTitle").html(ticketDetail.title);
            $("#teamSubTitle").html(ticketDetail.summary);
            $("#teamPrice").html(ticketDetail.team_price + "元");
            $("#partnerMobile").html(ticketDetail.mobile);
            $("#partnerAddress").html(ticketDetail.address);
            $("#parterPhone").html(ticketDetail.phone);
            $("#teamImage").attr("src", ticketDetail.image);
        });

        //绑定中间部分的信息
        DoMethod("getsecretofteam_part2&team_id=" + team_id, function (result) {
            if (result == "") {
                return;
            }
            for (var i = 0; i < result.length; i++) {
                var str = "";
                var consumed = result[i].consume;
                if (consumed == "Y") {
                    str += "<li class=\"box border-bottom1\">";
                    str += "<div class=\"box1\"><span>券码:</span><span>" + result[i].cid + "</span></div>";
                    str += "<div><a class=\"btn-refund\" actionname=\"refund\" data-id=\"" + result[i].oid + "\"><span>退款</span></a><span>未使用</span></div>";
                    str += "</li>";
                } else {
                    // N
                    str += "<li class=\"box\">";
                    str += "<div class=\"box1\"><span>券码:</span><span data-id=\""+result[i].oid+"\">" + result[i].cid + "</span></div>";
                    str += "<div>已使用</div>";
                    str += "</li>";
                }
            }
            $("#divTeamsOfThisUser").html(str);
        });
    }

    var userAction = {
        selectTab: function (evt) {
            $(evt).parent().children().removeClass("selected");
            $(evt).addClass("selected");

            var txt = $(evt).html();
            if (txt == "未到店订单") {
                $("#wrapper_notget").show();
                $("#wrapper_hasget").hide();
                setTimeout(function () {
                    if (scrollArr["wrapper_notget"])
                        scrollArr["wrapper_notget"].refresh();
                }, 1);
            } else {
                $("#wrapper_notget").hide();
                $("#wrapper_hasget").show();
                setTimeout(function () {
                    if (scrollArr["wrapper_hasget"])
                        scrollArr["wrapper_hasget"].refresh();
                }, 1);
            }
        },
        selectTab_movie: function (evt) {
            $(evt).parent().children().removeClass("selected");
            $(evt).addClass("selected");

            var txt = $(evt).html();
            if (txt == "未使用") {
                $("#wrapper_movie_not").show();
                $("#wrapper_movie_has").hide();
                setTimeout(function () {
                    if (scrollArr["wrapper_movie_not"])
                        scrollArr["wrapper_movie_not"].refresh();
                }, 1);
            } else {
                $("#wrapper_movie_not").hide();
                $("#wrapper_movie_has").show();
                setTimeout(function () {
                    if (scrollArr["wrapper_movie_has"])
                        scrollArr["wrapper_movie_has"].refresh();
                }, 1);
            }
        },
        selectTab_ticket: function (evt) {
            $(evt).parent().children().removeClass("selected");
            $(evt).addClass("selected");

            var txt = $(evt).html();
            if (txt == "未使用") {
                $("#wrapper_ticket_not").show();
                $("#wrapper_ticket_has").hide();
                setTimeout(function () {
                    if (scrollArr["wrapper_ticket_not"])
                        scrollArr["wrapper_ticket_not"].refresh();
                }, 1);
            } else {
                $("#wrapper_ticket_not").hide();
                $("#wrapper_ticket_has").show();
                setTimeout(function () {
                    if (scrollArr["wrapper_ticket_has"])
                        scrollArr["wrapper_ticket_has"].refresh();
                }, 1);
            }
        },
        nextPage_restorder:function(evt) {
            restPageIndex = restPageIndex + 10;
            GetRestaurantOrderList();
        },
        nextPage_movieorder: function (evt) {
            moviePageIndex = moviePageIndex + 10;
            GetMovieOrderList();
        },
        nextPage_ticketorder: function (evt) {
            ticketPageIndex = ticketPageIndex + 10;
            GetTicketOrderList();
        },
        toMyReserveList: function (evt) {
            $.ui.loadContent("page_reserve_list", false, false, "slide");

            restPageIndex = 0;
            $("#page_reserve_list a[actionName='nextPage_restorder']").html("继续查看更多");
            $("#div_order_notget").html("");
            $("#div_order_hasget").html("");
            //load data of restaurant reservation
            GetRestaurantOrderList();
            var txt = $("#divRestOrder a.selected").html();
            if (txt == "未到店订单") {
                $("#wrapper_notget").show();
                $("#wrapper_hasget").hide();
            } else {
                $("#wrapper_notget").hide();
                $("#wrapper_hasget").show();
            }
        },
        toMyTicketList: function (evt) {
            $.ui.loadContent("page_ticket_list", false, false, "slide");
            
            ticketPageIndex = 0;
            $("#page_ticket_list a[actionName='nextPage_ticketorder']").html("继续查看更多");
            $("#div_ticket_notget").html("");
            $("#div_ticket_hasget").html("");
            //load data of ticket order
            GetTicketOrderList();
            var txt = $("#divTicketOrder a.selected").html();
            if (txt == "未使用") {
                $("#wrapper_ticket_not").show();
                $("#wrapper_ticket_has").hide();
            } else {
                $("#wrapper_ticket_not").hide();
                $("#wrapper_ticket_has").show();
            }
        },
        toMyMovieList: function (evt) {
            $.ui.loadContent("page_movie_list", false, false, "slide");

            moviePageIndex = 0;
            $("#page_movie_list a[actionName='nextPage_movieorder']").html("继续查看更多");
            $("#div_movie_notget").html("");
            $("#div_movie_hasget").html("");
            //load data of movie order
            GetMovieOrderList();
            var txt = $("#divMovieOrder a.selected").html();
            if (txt == "未使用") {
                $("#wrapper_movie_not").show();
                $("#wrapper_movie_has").hide();
            } else {
                $("#wrapper_movie_not").hide();
                $("#wrapper_movie_has").show();
            }
        },
        toDetailTicket: function (evt) {
            //$.ui.loadContent("page_code_detail", false, false, "slide");
            //var ticket_id = $(evt).attr("data-id");
            //if(ticket_id!=null && ticket_id!="")
            //    GetDetailsOfThisTicket(ticket_id);
        },
        toDetailMovie: function (evt) {
            $.ui.loadContent("page_code_detail", false, false, "slide");
            var ticket_id = $(evt).attr("data-id");
            if (ticket_id != null && ticket_id != "")
                GetDetailsOfThisTicket(ticket_id);
        }
    };
    $(document).ready(function () {

        //alert(localStorage.getItem("weixin"));

        //page load method
        var username = localStorage.getItem("username");
        var mobile = localStorage.getItem("mobile");

		
        if (username != null) {
            $("#divCallName").html(username);
        }
        if (mobile != null) {
            $("#divMobile").html(mobile);
        }



        common.regCustomClickHandler(userAction);
        $(".js-i-scroll").each(function (idx, el) {
            //目前只有列表和下拉列表，下拉列表高度270
            if ($(el).height() < 269) return;
            var id = $(el).attr("id"), bounce = $(el).attr("iscroll-bounce");

            scrollArr[id] = new IScroll('#' + id, { mouseWheel: true });
            scrollArr[id].refresh();
        });

        document.getElementById("afui").addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    });

});
