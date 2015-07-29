define(function (require, exports, module) {
    require("../public/util/common.js");

    var scrollArr = {};
    function calculatePrice() {
        var ticketNumber = parseInt($("#ticketNum").val());
        var danjia = parseInt($("#divDanJia").html());
        $("#divTotalPrice").html(danjia * ticketNumber);
    }
    var pageIndex = 1;
    var pageSize = 10;

    function MovieOrder() {

        //collect data for movie team
        var quantity = $("#ticketNum").val();
        var mobile = $("#txtCellPhone").val();
        var price = $("#divDanJia").html();
	    var title = $("#divTeamBuyTitle").html();
        var money = $("#divTotalPrice").html();
        var username = $("#txtAliasName").val();
        var orderSex = $("#txtSex > a.radio-selected").text();
        var team_id = $("#btnBuyTicketId").attr("data-id");

        var params = "teamorder&quantity=" + quantity + "&mobile=" + mobile
                        + "&price=" + price
                        + "&money=" + money + "&team_id=" + team_id;
        DoMethod(params, function (callResult) {

            alert("写入电影票优惠券表 order 表成功!" + callResult.status + " : " + callResult.val);

        	//将订单id写入localStorage存储区
            localStorage.setItem("OrderNo", callResult.val);
            localStorage.setItem("Action", "Movie");

			//yangmao added it! did you see any changes??
            window.location.href = "../ticket/sft.aspx?OrderNo=" + callResult.val + "&OrderAmount=" + money
            + "&ProductName=" + encodeURIComponent(title) + "&BuyerContact=" + mobile;
            
        });

        

    }

    function GenerateTeamSecretCode(order_id) {

        DoMethod("md5encrypt&order_id=" + order_id, function (result) {
            var encryptedOrderId = result;
            $.ajax({
                url: "http://www.youmianwang.com/order/yd_pay.php?order_id=" + order_id + "&md5=" + encryptedOrderId,
                //data: { Full: "fu" },
                dataType: 'jsonp',
                jsonp: "jsonpcallback",
                jsonpCallback: "success_jsonpcallback",
                success: function (call_secret_result) {
                    var obj = call_secret_result;
                },
                error: function (er) {
                    alert(er);
                }
            });
        });
    }

    function UpdateOrderStateAndInsertACoupon(order_id) {
        DoMethod("updateorderstateandinsertacoupon&order_id=" + order_id, function (result) {
            if (result.status == "success") {
                alert("模拟修改订单状态和生成优惠券密码成功！");
            }
        });

    }



    var movieAction = {
        nextPage: function (evt) {
            //这是因为mysql的pageIndex根本就不是.net分页里面的pageIndex 完全不一样 不能同样去理解
            pageIndex = pageIndex + 10;
            SearchResult();
        },
        selectGender: function (evt) {
            $(evt).parent().children().removeClass("radio-selected");
            $(evt).addClass("radio-selected");
        },
        minusNum: function (evt) {
            var t = $("#" + $(evt).attr("target-id")),
                val = parseInt(t.val());
            val = val > 1 ? (val - 1) : val;
            $(t).val(val);
            $(evt).parent().find(".btn-num").removeClass("selected");
            $(evt).addClass("selected");

            calculatePrice();
        },
        addNum: function (evt) {
            var t = $("#" + $(evt).attr("target-id")),
                val = parseInt(t.val());
            val = val + 1;
            $(t).val(val);
            $(evt).parent().find(".btn-num").removeClass("selected");
            $(evt).addClass("selected");

            calculatePrice();
        },
        toBuyTicket: function (evt) {
            $.ui.loadContent("page_ticket_buy", false, false, "slide");

            $("#ticketNum").val("1");
            $("#divTeamBuyTitle").html($(evt).attr("data-title"));
            $("#divDanJia").html($(evt).attr("data-price"));
            $("#divTotalPrice").html($(evt).attr("data-price"));
            $("#btnBuyTicketId").attr("data-id", $(evt).attr("data-id"));


            var mobile = localStorage.getItem("mobile");
            if (mobile == null) {
                //通过微信id去获取该wx_user表详细信息，看看该用户有没有绑定，如果有绑定则显示出来
                var weixin = localStorage.getItem("tousername");
                DoMethod("getuserinfobyweixinid&tousername=" + weixin, function (result) {
                    if (result.status == "success") {
                        var weixin_user = result.wx_user;

                        var shouji = weixin_user.mobile;
                        if (shouji != null && shouji != "") {
                            localStorage.setItem("mobile", shouji);
                            $("#txtCellPhone").val(shouji);
                        }
                        var sex = weixin_user.sex;
                        if (sex != null && sex != "") {
                            localStorage.setItem("sex", sex);
                            if (sex == "男") {
                                $("#txtSex").children().removeClass("radio-selected");
                                $($("#txtSex a")[0]).addClass("radio-selected");
                            } else {
                                $("#txtSex").children().removeClass("radio-selected");
                                $($("#txtSex a")[1]).addClass("radio-selected");
                            }
                        }
                        var username = weixin_user.username;
                        if (username != null && username != "") {
                            localStorage.setItem("username", username);
                            $("#txtAliasName").val(username);
                        }
                    }
                });
            } else {
                var shouji = localStorage.getItem("mobile");
                if (shouji != null && shouji != "") {
                    $("#txtCellPhone").val(shouji);
                }
                var sex = localStorage.getItem("sex");
                if (sex != null && sex != "") {
                    if (sex == "男") {
                        $("#txtSex").children().removeClass("radio-selected");
                        $($("#txtSex a")[0]).addClass("radio-selected");
                    } else {
                        $("#txtSex").children().removeClass("radio-selected");
                        $($("#txtSex a")[1]).addClass("radio-selected");
                    }
                }
                var username = localStorage.getItem("username");
                if (username != null && username != "") {
                    $("#txtAliasName").val(username);
                }
            }
        },
        toSubmit: function (evt) {
            var title = $("#divTeamBuyTitle").html();
            var number = $("#ticketNum").val();
            var singlePrice = $("#divDanJia").html();
            var totalPrice = $("#divTotalPrice").html();
            var txtCellPhone = $("#txtCellPhone").val();
            var txtAliasName = $("#txtAliasName").val();
            var txtSex = $("#txtSex > .radio-selected").text();

            MovieOrder();

            //先不跳过去！
            /*
            window.location.href = "../ticket/mypay.aspx?title=" + encodeURIComponent(title) + "&number=" + number
            + "&singlePrice=" + singlePrice + "&totalPrice=" + totalPrice + "&cellPhone=" + txtCellPhone
            + "&aliasName=" + encodeURIComponent(txtAliasName) + "&sex=" + txtSex;
            */

            
        }
    };


    function Dictionary() {
        this.add = add;
        this.datastore = new Array();
        this.find = find;
        this.remove = remove;
        this.showAll = showAll;
        this.findKeyByValue = findKeyByValue;
        this.count = count;
        this.clear = clear;
    }

    function add(key, value) {
        this.datastore[key] = value;
    }

    function find(key) {
        return this.datastore[key];
    }

    function remove(key) {
        delete this.datastore[key];
    }

    function showAll() {
        var keys = Object.keys(this.datastore).sort();
        for (var i = 0; i < keys.length; i++) {
            console.log(keys[i] + " -> " + this.datastore[keys[i]]);
        }
    }

    function findKeyByValue(val) {
        var keys = Object.keys(this.datastore).sort();
        for (var i = 0; i < keys.length; i++) {
            if (this.datastore[keys[i]] == val) {
                return keys[i];
            }
        }
        return null;
    }

    function count() {
        return Object.keys(this.datastore).length;
    }

    function clear() {
        var keys = Object.keys(this.datastore);
        for (var i = 0; i < keys.length; i++) {
            delete this.datastore[keys[i]];
        }
    }


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


    function getMovieSuccessHandler(result) {
        if (result == "") {
            $("a[actionName='nextPage']").html("没有更多了！");
            return;
        }
        var str = "";
        for (var i = 0; i < result.length; i++) {
            str += "<li class=\"item2 box\">";
            str += "<div class=\"item-left\">";
            str += "<img src=\"http://www.youmianwang.com/static/" + result[i].image + "\" />";
            str += "</div>";
            str += "<div class=\"item-content box1\">";
            str += "<div class=\"item-title\" data-id=\"" + result[i].id + "\"><h3 class=\"ellipses\">" + result[i].title + "</h3>";
            str += "<p class=\"item-info-span\">原价&nbsp;<span class=\"color-theme\"><del>" + result[i].market_price + "</del></span>&nbsp;&nbsp;现价&nbsp; <span class=\"color-theme\">" + result[i].team_price + "</span></span></p>";
            str += "</div>";
            str += "<div class=\"box pad-t5\"><a actionname='toBuyTicket' data-id=\"" + result[i].id + "\" data-title=\"" + result[i].title + "\" data-price=\"" + result[i].team_price + "\" class=\"box1 pad-r15percent btn-buy\"><span class=\"h30\">购买</span></a><a target='_blank' href=\"http://www.youmianwang.com/html5/yx.php?team_id=" + result[i].id + "\" class=\"box1 pad-r15percent btn-buy\"><span class=\"h30\">影讯</span></a></div>";
            str += "</div>";
            str += "</li>";
        }
        $("#divListContent").append(str);

        setTimeout(function () {
            scrollArr["wrapper_0"].refresh();
        }, 500);
    }

    function SearchResult() {
        var str = "getmovies&pageIndex=" + pageIndex + "&pageSize=" + pageSize;
        DoMethod(str, getMovieSuccessHandler);
    }
    function getparamOfHref(name, url) {
    	var urlinfo = url;
    	var len = urlinfo.length;//获取url的长度 
    	var offset = urlinfo.indexOf("?");//设置参数字符串开始的位置 
    	var newsidinfo = urlinfo.substr(offset + 1, len);//取出参数字符串 这里会获得类似“id=1”这样的字符串 
    	var arr = newsidinfo.split("&");//对获得的参数字符串按照“=”进行分割 
    	for (var i = 0; i < arr.length; i++) {
    		var childArr = arr[i].split("=");
    		if (childArr[0] == name) {
    			return childArr[1];
    		}
    	}
    	return "";
    }
    function GetWeChatInfo(code) {
    	DoMethod("getwechatinfo&code=" + code, function (result) {
    		if (result.status == "success") {
    			var openid = result.val;
    			//alert(openid);

    			//如果获取微信id成功了，将微信id存入localStorage
    			localStorage.setItem("tousername", openid);
    		} else {
    			alert("获取微信ID失败!");
    		}
    	});
    }

    $(document).ready(function () {

        //alert(localStorage.getItem("weixin"));
    	var tousername = localStorage.getItem("tousername");
    	if (tousername == null || tousername == "") {

    		var code = getparamOfHref("code", window.location.href);
    		//alert("code="+code);
    		GetWeChatInfo(code);
    	}

        SearchResult();

        $("#txtCellPhone").bind("keydown", function (e) {
            if (e.keyCode > 57 || e.keyCode < 48) {
                $(this).val("");
            }
        });
        $("#txtCellPhone").bind("keyup", function (e) {
            if (e.keyCode > 57 || e.keyCode < 48) {
                $(this).val("");
            }
        });

        common.regCustomClickHandler(movieAction);
        $(".js-i-scroll").each(function (idx, el) {
            //目前只有列表和下拉列表，下拉列表高度270
            if ($(el).height() < 269) return;
            var id = $(el).attr("id"), bounce = $(el).attr("iscroll-bounce");

            scrollArr[id] = new IScroll('#' + id, { mouseWheel: true, bounce: bounce == "false" ? false : true });
        });
        document.getElementById("mask").addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        document.getElementById("afui").addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    });

});
