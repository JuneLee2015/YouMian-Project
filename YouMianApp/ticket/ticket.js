define(function (require, exports, module) {
    require("../public/util/common.js");

    var scrollArr = {};
    var randomNumber = 0;

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

    function calculatePrice() {
        var ticketNumber = parseInt($("#ticketNum").val());
        var danjia = parseInt($("#divDanJia").html());
        $("#divTotalPrice").html(danjia * ticketNumber);
    }
    function validatemobile(mobile) {
        var re = /^1\d{10}$/;
        if (!re.test(mobile)) {
            return false;
        }
        return true;
    }
    function TeamOrder() {

        //collect data for movie team
        var quantity = $("#ticketNum").val();
        var mobile = $("#txtCellPhone").val();
        var price = $("#divDanJia").html();
        var money = $("#divTotalPrice").html();
        var username = $("#txtAliasName").val();
        var orderSex = $("#txtSex > a.radio-selected").text();
        var team_id = $("#btnBuyTicketId").attr("data-id");


        var params = "teamorder&quantity=" + quantity + "&mobile=" + mobile
                        + "&price=" + price
                        + "&money=" + money + "&team_id=" + team_id;
        DoMethod(params, function (callResult) {

            alert("写入优惠券表 order 表成功!" + callResult.status + " : 订单编号:" + callResult.val);

            //下单成功后跳转到 支付页面  是否支付等等

            /*   因为支付还没有好，所以不进行支付  */   
            var title = $("#divTeamBuyTitle").html();
            var number = $("#ticketNum").val();
            var singlePrice = $("#divDanJia").html();
            var totalPrice = $("#divTotalPrice").html();
            var txtCellPhone = $("#txtCellPhone").val();
            var txtAliasName = $("#txtAliasName").val();
            var txtSex = $("#txtSex > .radio-selected").text();

        	//将订单id写入localStorage存储区
            localStorage.setItem("OrderNo", callResult.val);
	        localStorage.setItem("Action", "Ticket");

            window.location.href = "sft.aspx?OrderNo=" + callResult.val + "&OrderAmount=" + totalPrice
            + "&ProductName=" + encodeURIComponent(title) + "&BuyerContact=" + txtCellPhone;

			
        });

    }

    var ticketAction = {
        showMenu: function (evt) {
            var id = $(evt).attr("show");
            common.showToplistMenu(id, $(evt).attr("id"), function () {
                $(evt).removeClass("on");
            });
            $(evt).parent().find(".nav-item").removeClass("on");
            $(evt).addClass("on");
            //刷新滚动
            if (scrollArr[id])
                scrollArr[id].refresh();
        },
        selectArea: function (evt) {
            $(evt).parents(".menu").find(".menu-item").removeClass("on");
            $(evt).parent().addClass("on");

            $("#areaVal").attr("data", $(evt).text()).find("span").text($(evt).text());
        },
        selectCuisine: function (evt) {
            $(evt).parents(".menu").find(".menu-item").removeClass("on");
            $(evt).parent().addClass("on");

            $("#cuisineVal").attr("data", $(evt).text()).find("span").text($(evt).text());
        },
        selectOrder: function (evt) {
            $(evt).parents(".menu").find(".menu-item").removeClass("on");
            $(evt).parent().addClass("on");

            $("#orderVal").attr("data", $(evt).text()).find("span").text($(evt).text());
        },
        toDetail: function (evt) {

            //这里是从列表页点击一条优惠券信息后，进入详细页面的处理方法入口

            $.ui.loadContent("page_ticket_detail", false, false, "slide");
            var team_id = $(evt).attr("data-id");

            DoMethod("getteamdetails&teamid=" + team_id, function (result) {

            	var isOpen = result.IsOpen;

				//TODO:这里暂时用显示和不显示来做，因为其实要把不显示的设置为灰色图片，现在没有灰色图片！
				if (isOpen == "Y") {
					$("#divCanWeiShow").css("display", "block");
				} else {
					$("#divCanWeiShow").css("display", "none");
				}
				//TODO:还有后面的优惠券显示与否的逻辑！

	            var discount = ((result.team_price / result.market_price) * 10).toFixed(1);
				if (discount == "NaN") {
					discount = "0";
				}
                $("#divTitle").html(result.title);
                $("#imgSrc").attr("src", "http://www.youmianwang.com/static/" + result.image);
                $("#divTeamPrice").html("￥" + result.team_price + "元<span class='discount'>"
                    + discount + "折</span>");
                $("#divTotalSaled").html("已售" + result.pre_number + "张");
                $("#divDetailInfo1").html(result.product);
                $("#divDetailInfo2").html(result.summary);
                $("#divBusinessInfo1").html(result.product);
                $("#divBusinessInfo2").html("<li><span>电话：</span><span>" + result.phone
                    + "</span></li><li><span>地址：</span><span>" + result.PartnerAddress + "</span></li>");

                //给购买页面的变量赋值
                $("#btnBuyTicketId").attr("data-id", team_id);
                $("#divTeamBuyTitle").html(result.title);
                $("#divDanJia").html(result.team_price);
                $("#divTotalPrice").html(result.team_price);

            });
        },
        toBuyTicket: function (evt) {
            $.ui.loadContent("page_ticket_buy", false, false, "slide");

            //这里是从详细页面点击了抢购按钮后进入  抢购页面的入口
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
        toPay: function (evt) {
            var mobile = localStorage.getItem("mobile");
            if (mobile == null) {

            	var cellphone = $("#txtCellPhone").val();
	            $("#txtYourCellPhone").val(cellphone);
                //绑定手机页面
                $.ui.loadContent("page_bind", false, false, "slide");
            } else {
                TeamOrder();
            }
        },
        toSubmit: function (evt) {

            //拿用户输入的随机码和内存中保存的随机码进行比较来判断是否是正确的用户！！！
            var userInputCode = $("#txtValidateCode").val();
            if (userInputCode != randomNumber) {
                alert("验证失败！");
                $("#txtValidateCode").val("");
                return;
            } else {
                //alert("绑定成功！");
                //将手机号码更新到wx_user表里面去
            	var tousername = localStorage.getItem("tousername");
	            var username = $("#txtAliasName").val();
                var mobile = $("#txtYourCellPhone").val();
                DoMethod("updateshoujibyweixinid&tousername=" + tousername + "&mobile=" + mobile+"&username="+encodeURIComponent(username), function (result) {
                    if (result.status == "success") {
                    	localStorage.setItem("mobile", mobile);
	                    localStorage.setItem("username", username);
                        alert("成功绑定手机号！");

                        TeamOrder();
                    }
                });
        	}


        	//发短信的服务 已经被玩坏了啊！哈哈,赶紧充值
        	//var tousername = localStorage.getItem("tousername");
        	//var mobile = $("#txtYourCellPhone").val();
        	//DoMethod("updateshoujibyweixinid&tousername=" + tousername + "&mobile=" + mobile, function (result) {
        	//	if (result.status == "success") {
        	//		localStorage.setItem("mobile", mobile);
        	//		alert("成功绑定手机号！");

        	//		TeamOrder();
        	//	}
        	//});
        },
        getBindCode: function (evt) {
            var r = Math.random().toString();
            randomNumber = r.substr(2, 4);
            $("#txtYourCellPhone").val($("#txtCellPhone").val());
            var phoneNumber = $("#txtYourCellPhone").val();
            if (!validatemobile(phoneNumber)) {
                alert("手机号码不正确,请重新输入!");
                $("#txtYourCellPhone").val("");
                return;
            }
        	//您的电话号码【18000000000】开启绑订功能的验证码为：0000.【5911111餐饮预订中心】
            var strContent = "您的电话号码【" + phoneNumber + "】开启绑订功能的验证码为：" + randomNumber + "【5911111餐饮预订中心】";
            alert("验证码已经发送，请注意查收！");
        	//http://114.113.155.149:8888/sms.aspx?action=send&userid=79 &account=hyhrkj &password=3rs6xz5a&mobile=短信号码&content=内容
            $.ajax({
            	url: "http://114.113.155.149:8888/sms.aspx?action=send&userid=79&account=hyhrkj&password=3rs6xz5a&mobile=" + phoneNumber + "&content=" + strContent,
                //data: { Full: "fu" },
                //type: "get",
                dataType: 'xml',
                success: function (data) {
                    $(data).find("returnsms").each(function (index, ele) {
                        var status = $(ele).find("returnstatus").text();
                        var message = $(ele).find("message").text();
                        var remainPoint = $(ele).find("remainpoint").text();
                        var taskId = $(ele).find("taskID").text();
                        var successCounts = $(ele).find("successCounts").text();

                        if (message == "ok") {
                            //发送短信成功了！！
                            alert("短信发送成功，请注意查收！");
                        } else {
                            alert("短信发送失败，请重试！");
                        }
                    });
                },
                error: function (er) {
                    //alert(er);
                }
            });
        },
        selectGender: function (evt) {
            $(evt).parent().children().removeClass("radio-selected");
            $(evt).addClass("radio-selected");
        },
        goSearch: function (evt) {
            //只有在搜索的时候 才会重新定位pageIndex=1，其他时候不需要
            pageIndex = 0;
            $("#divListContent").html("");
            SearchResult();

        },
        nextPage: function (evt) {
            //这是因为mysql的pageIndex根本就不是.net分页里面的pageIndex 完全不一样 不能同样去理解
            pageIndex = pageIndex + 10;
            SearchResult();
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

    var areaIdDic = new Dictionary();
    var caiIdDic = new Dictionary();
    var pageIndex = 0;
    var pageSize = 10;

    function getareaSuccessHandler(result) {
        var str = "";
        str += "<li class=\"menu-item\"><a actionname=\"selectArea\">全部区域</a></li>";
        for (var i = 0; i < result.length; i++) {
            str += "<li class=\"menu-item\"><a actionname=\"selectArea\">" + result[i].areaname + "</a></li>";
            areaIdDic.add(result[i].sid, result[i].areaname);
        }
        $("#divAreas").html(str);
    }

    function getdishesSuccessHandler(result) {
        var str = "";
        str += "<li class=\"menu-item\"><a actionname=\"selectCuisine\">全部菜系</a></li>";
        for (var i = 0; i < result.length; i++) {
            str += "<li class=\"menu-item\"><a actionname=\"selectCuisine\">" + result[i].name + "</a></li>";
            caiIdDic.add(result[i].sid, result[i].name);
        }
        $("#divCaixi").html(str);
    }

    function getteamSuccessHandler(result) {
        if (result == "") {
            $("a[actionName='nextPage']").html("没有更多了！");
            return;
        }
        //alert(result.length);href=\"TeamDetail.html?team_id=" + result[i].team_id    target=\"_self\"
        var str = "";
        for (var i = 0; i < result.length; i++) {
            str += "<li class=\"\">";
            str += "<a actionname=\"toDetail\" data-id=\"" + result[i].team_id + "\" class=\"item box\">";
            str += "<div class=\"item-left-ticket\">";
            str += "<img src=\"http://www.youmianwang.com/static/" + result[i].image + "\" />";
            str += "</div>";
            str += "<div class=\"item-content box1\">";
            str += "<div class=\"item-title\" data=\"" + result[i].team_id + "\"><h3 class=\"ellipses\">" + result[i].title + "</h3></div>";
            str += "<div class=\"item-info\">";
            str += "<span class=\"cash floatR\">￥" + result[i].team_price
                + "</span><span class=\"item-info-span\">原价<del style='color:#ff8400'>￥" + result[i].market_price
                + "</del></span> 现价<span style='color:#ff8400'>￥" + result[i].team_price + "</span>";
            //+ "\t" + result[i].team_id
            str += "</div>";
            str += "</div>";
            str += "</a>";
            str += "</li>";
        }
        $("#divListContent").append(str);

        setTimeout(function () {
            scrollArr["wrapper_0"].refresh();
        }, 500);
    }

    function SearchResult() {

        var areaName = $("#areaVal").attr("data");
        var caixiName = $("#cuisineVal").attr("data");
        var orderbyName = $("#orderVal").attr("data");
        var teamName = $("#txtTeamName").val();

        var areaId = areaIdDic.findKeyByValue(areaName);
        var caixiId = caiIdDic.findKeyByValue(caixiName);

        var str = "getteam&pageIndex=" + pageIndex + "&pageSize=" + pageSize;
        if (areaName == "全部区域" || areaName == null) {
            str += "&areaId=";
        } else {
            str += "&areaId=" + areaId;
        }
        if (caixiName == "全部菜系" || caixiName == null) {
            str += "&caiId=";
        } else {
            str += "&caiId=" + caixiId;
        }
        if (orderbyName == null || orderbyName == "销量") {
            str += "&orderBy=2";
        } else {
            str += "&orderBy=1";
        }
        if (teamName == null || teamName == "") {
            str += "&teamName=";
        } else {
            str += "&teamName=" + encodeURIComponent(teamName);
        }
        DoMethod(str, getteamSuccessHandler);

        //setTimeout(function () {
        //    scrollArr["wrapper_0"].refresh();
        //}, 500);
    }


    //获取进来的用户的微信信息
    function GetWeChatInfo(code) {
        DoMethod("getwechatinfo&code="+code, function (result) {
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

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象         
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数            
        if (r != null)
            return unescape(r[2]);
        return null; //返回参数值            
    }


	function getparamOfHref(name,url) {
		var urlinfo = url;
		var len = urlinfo.length;//获取url的长度 
		var offset = urlinfo.indexOf("?");//设置参数字符串开始的位置 
		var newsidinfo = urlinfo.substr(offset+1, len);//取出参数字符串 这里会获得类似“id=1”这样的字符串 
		var arr = newsidinfo.split("&");//对获得的参数字符串按照“=”进行分割 
		for (var i = 0; i < arr.length; i++) {
			var childArr = arr[i].split("=");
			if (childArr[0] == name) {
				return childArr[1];
			}
		}
		return "";
	}

	$(document).ready(function () {

		//UpdateOrderStateAndInsertACoupon(49651);

        //alert(window.location.href);
        var code = getparamOfHref("code",window.location.href);
        //alert("code="+code);
        GetWeChatInfo(code);

        //localStorage.setItem("tousername", "weixin_001");
        //localStorage.removeItem("tousername");
        //localStorage.removeItem("mobile");
        //localStorage.removeItem("username");

        DoMethod("getarea", getareaSuccessHandler);
        DoMethod("getdishes", getdishesSuccessHandler);

        SearchResult();

        //绑定列表页点击后跳转到详细页的事件
        //$("div.item-title").click(function() {
        //    location.href = "TeamDetail.html?team_id=" + $(this).attr("data");
        //});

        //$("#txtCellPhone").bind("keydown", function (e) {
        //    if (e.keyCode > 57 || e.keyCode < 48) {
        //        $(this).val("");
        //    }
        //});
        //$("#txtCellPhone").bind("keyup", function (e) {
        //    if (e.keyCode > 57 || e.keyCode < 48) {
        //        $(this).val("");
        //    }
        //});

        //绑定事件
        common.regCustomClickHandler(ticketAction);

        //为需要滚动容器，创建iScroll对象
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
