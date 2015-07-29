define(function (require, exports, module) {
	require("../public/util/common.js");

	var scrollArr = {}, hasCalendar = false, hasCalendarHorizon = false;
	var randomNumber = 0;

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

	function RestaurantOrder() {

		//collect data for order meal
		var orderDate = $("#calendarH .selected").find("span").text();
		var mealorlunch = $("#divOrderMealSelected > a.selected").text();
		var room = $("#divOrderMealRoomSelected > a.selected").text();
		var orderNumber = $("#txtOrderedNumber").val();
		var tell = $("#txtOrderedCustomerPhone").val();
		var username = $("#txtOrderedAlias").val();
		var orderSex = $("#divOrderedSex > a.radio-selected").text();

		var rest_id = $("#txtRestOrderTitle").attr("data-id");
		var team_id = "0";

		mealorlunch = mealorlunch == "午餐" ? "12:00" : "18:00";
		room = room == "包间优先" ? "雅间优先" : "只定包间";

		//var orderDate = "2015-02-05";
		//var mealorlunch = "18:00";
		//var room = "雅间优先";
		//var rest_id = 990;
		//var orderNumber = 4;
		//var username = "杨过";
		//var tell = "18500234180";
		//var team_id = "120";

		$.ajax({
			url: "http://www.youmianwang.com/api/yd_orders.php?dining_time=" + orderDate
                + "&sjd=" + mealorlunch + "&bz=" + encodeURIComponent(room)
        + "&rest_id=" + rest_id + "&persons=" + orderNumber + "&username=" + encodeURIComponent(username) + "&tell=" + tell,
			//data: { Full: "fu" },
			//type: "get",
			dataType: 'jsonp',
			jsonp: "jsonpcallback",
			jsonpCallback: "success_jsonpcallback",
			success: function (result) {

				//		msg	"OK|1201501292245548"	String
				var msg = result[0].msg.toString();
				var status = msg.substr(0, 2);
				var orderNum = msg.substring(3);
				//alert(result[0].msg + " , order num=" + orderNum);

				if (status == "OK") {

					//alert("下订单成功，请在个人中心查看！");
					//调用自己的下订单接口，数据写入自己的数据库
					//var params = "restaurantorder&dining_time=" + orderDate + "&sjd=" + mealorlunch
					//    + "&bz=" + encodeURIComponent(room)
					//    + "&username=" + encodeURI(username) + "&tell=" + tell + "&rest_Id=" + rest_id
					//    + "&persons=" + orderNumber + "&team_id=" + team_id + "&order_num=" + orderNum;
					//DoMethod(params, function (callResult) {

					//	alert("写入订单表orders表成功!" + callResult.status + " : " + callResult.val);

					//	//下单成功后跳转到 个人中心页面
					//	window.locaiton.href = "../user/user.html";
					//});
				} else {
					//alert("调用下订单接口失败！");
				}
			},
			error: function (er) {
				alert(er);
			}
		});

	}

	function validatemobile(mobile) {
		var re = /^1\d{10}$/;
		if (!re.test(mobile)) {
			return false;
		}
		return true;
	}

	var reserveAction = {
		showMenu: function (evt) {
			var id = $(evt).attr("show");
			console.log(id);
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

			//只有在搜索的时候 才会重新定位pageIndex=1，其他时候不需要
			pageIndex = 0;
			$("#divListContent").html("");
			SearchResult();
		},
		selectCuisine: function (evt) {
			$(evt).parents(".menu").find(".menu-item").removeClass("on");
			$(evt).parent().addClass("on");

			$("#cuisineVal").attr("data", $(evt).text()).find("span").text($(evt).text());

			//只有在搜索的时候 才会重新定位pageIndex=1，其他时候不需要
			pageIndex = 0;
			$("#divListContent").html("");
			SearchResult();
		},
		selectOrder: function (evt) {
			$(evt).parents(".menu").find(".menu-item").removeClass("on");
			$(evt).parent().addClass("on");

			$(".nav-item.on").removeClass("on");
			$(".top-selector").hide();
			$("#mask").hide();

			$("#orderVal").attr("data", $(evt).text()).find("span").text($(evt).text());
		},
		toDetail: function (evt) {
			var rid = $(evt).attr("data-id");
			$.ui.loadContent("page_reserve_detail", false, false, "slide");

			//绑定详细信息
			DoMethod("getrestaurantdetails&restId=" + rid, function (result) {

				$("#txtRestDetailTitle").html(result.title);
				$("#imgRestDetailImage").attr("src", "http://www.youmianwang.com/static/" + result.image);
				$("#txtTime").html(result.dcsj);
				$("#txtDetailPhone").html(result.phone);
				$("#txtDetailAddress").html(result.address);
				$("#txtDetailSpecial").html(result.special);
				$("#btnReserve").attr("data-id", rid);

				$("#txtRestOrderTitle").html(result.title);
				$("#txtRestOrderTitle").attr("data-id", rid);
				$("a[actionname='toReserveOne']").attr("data-id", rid);
				var partnerId = result.PartnerId;
				//绑定餐厅的优惠券信息
				DoMethod("getrestaurantdetailsOfTeams&partnerId=" + partnerId, function (result) {
					var str = "";
					for (var i = 0; i < result.length; i++) {
						str += "<li class=\"list-plain-li arrows\"><a class=\"ellipses\" actionname=\"toDetailTicket\" data-id=\"" + result.team_id + "\">" + result[i].title + "</a></li>";
					}
					$("#divDetailsOfTeams").html(str);

					setTimeout(function () {
						scrollArr["wrapper_0"].refresh();
					}, 500);
				});

			});
		},
		getCalendarHorizon: function () {
			//生成日期横条（今天、明天、后天）
			var cur = new Date();
			var curDate = { y: cur.getFullYear(), m: cur.getMonth(), d: cur.getDate(), w: cur.getDay() };
			var first = new Date(curDate.y, curDate.m, curDate.d),
                last = new Date(curDate.y, curDate.m + 1, curDate.d - 1);
			var length = parseInt((last.getTime() - first.getTime()) / 86400000);
			var html = '';
			for (var i = 0; i < length; i++) {
				var date = new Date(curDate.y, curDate.m, curDate.d + i);
				var month = date.getMonth() + 1, day = date.getDate();
				var dateStr = date.getFullYear() + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day);
				var dateStr2 = date.getFullYear() + "-" + (month - 1) + "-" + day;
				html += '<li class="box1">';
				var cls = date.getDay() == 0 || date.getDay() == 6 ? ' color-weekend' : '';
				if (i == 0) {
					html += '<a ids="' + i + '" class="selected' + cls + '" actionname="selectDate" data-date="' + dateStr2 + '"><div class="h20">今天</div><span class="h20">';
					$("#btnCalendar").attr("data-date", dateStr2).attr("ids", 0);
				} else if (i == 1) {
					html += '<a ids="' + i + '"  class="' + cls + '" actionname="selectDate" data-date="' + dateStr2 + '"><div class="h20">明天</div><span class="h20">';
				} else if (i == 2) {
					html += '<a ids="' + i + '"  class="' + cls + '" actionname="selectDate" data-date="' + dateStr2 + '"><div class="h20">后天</div><span class="h20">';
				} else {
					html += '<a ids="' + i + '"  class="' + cls + '" actionname="selectDate" data-date="' + dateStr2 + '"><span class="h40">';
				}
				html += dateStr + '</span></a></li>';
			}
			var w = (document.documentElement.offsetWidth - 20) * 0.7;
			$("#calendarH ul").html(html).css({ "width": (w / 3 * length + 2) + "px" });
			scrollArr["calendarH"] = new IScroll("#calendarH", {
				mouseWheel: true,
				bounce: false,
				scrollX: true,
				scrollY: false,
				directionLockThreshold: 1
			});

		},
		getCalendarTitle: function (y, m) {
			return '<table cellpadding="0" cellspacing="0" border="0">'
                + '<thead>'
                + '<tr class="calendar-month">'
                + '<th colspan="7">'
                + y
                + '年'
                + (m + 1)
                + '月</th></tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr class="calendar-week color-minor2">'
                + '<td class="color-weekend">日</td>'
                + '<td>一</td>'
                + '<td>二</td>'
                + '<td>三</td>'
                + '<td>四</td>'
                + '<td>五</td>'
                + '<td class="color-weekend">六</td>'
                + '</tr>';
		},
		generateCalendar: function () {
			//生成日历
			var cur = new Date();
			var curDate = { y: cur.getFullYear(), m: cur.getMonth(), d: cur.getDate(), w: cur.getDay() };
			var last = new Date(curDate.y, curDate.m + 1, 0);
			var lastDate2 = last.getDate();
			var y = curDate.y, m = curDate.m;
			var html = this.getCalendarTitle(curDate.y, curDate.m);
			var datei = curDate.d;
			var idx = 0;
			for (var i = 0; i < 5 && datei < lastDate2; i++) {
				html += '<tr class="calendar-days">';
				for (var j = 0; j < 7; j++) {
					if (i == 0 && curDate.w > j)
						html += '<td class="calendar-day-out"></td>';
					else if (datei < lastDate2) {
						html += '<td><a ids="' + idx + '" actionname="selectDate2" data-date="' + curDate.y + '-' + curDate.m + '-' + curDate.d + '" class="' + (j == 0 || j == 6 ? 'color-weekend' : '') + '">' + datei + '</a></td>'
						datei++;
						idx++;
					} else {
						html += '<td class="calendar-day-out2"></td>';
					}
				}
			}
			html += '</tbody></table>';

			if (curDate.d > 1) {//若是当前为2.12日，则可选日期为一个月:最晚为3.11
				var first = new Date(curDate.y, curDate.m + 1, 1);
				datei = 1;
				var fWeek = first.getDay();
				html += '<div class="hr"></div>' + this.getCalendarTitle(first.getFullYear(), first.getMonth());
				for (var i = 0; i < 5 && datei < curDate.d; i++) {
					html += '<tr class="calendar-days">';
					for (var j = 0; j < 7; j++) {
						if (i == 0 && fWeek > j)
							html += '<td class="calendar-day-out2"></td>'
						else if (datei < curDate.d) {
							html += '<td><a ids="' + idx + '" actionname="selectDate2" class="' + (j == 0 || j == 6 ? 'color-weekend' : '') + '" data-date="' + curDate.y + '-' + curDate.m + '-' + curDate.d + '" >' + datei + '</a></td>';
							datei++;
							idx++;
						} else {
							html += '<td class="calendar-day-out2"></td>';
						}
					}
					html += '</tr>';
				}
				html += '</tbody></table>';
			}
			$("#calendar").html(html);
		},
		toReserveOne: function (evt) {

			//window.location.href = "order.html?rest_id="+$(evt).attr("data-id");

			$.ui.loadContent("page_reserve_buy", false, false, "slide");
			if (!hasCalendarHorizon) {
				this.getCalendarHorizon();
				hasCalendarHorizon = true;
			}
			setTimeout(function () {
				scrollArr["calendarH"].refresh();
			}, 500);

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
							$("#txtOrderedCustomerPhone").val(shouji);
						}
						var sex = weixin_user.sex;
						if (sex != null && sex != "") {
							localStorage.setItem("sex", sex);
							if (sex == "男") {
								$("#divOrderedSex").children().removeClass("radio-selected");
								$($("#divOrderedSex a")[0]).addClass("radio-selected");
							} else {
								$("#divOrderedSex").children().removeClass("radio-selected");
								$($("#divOrderedSex a")[1]).addClass("radio-selected");
							}
						}
						var username = weixin_user.username;
						if (username != null && username != "") {
							localStorage.setItem("username", username);
							$("#txtOrderedAlias").val(username);
						}
					}
				});
			} else {
				var shouji = localStorage.getItem("mobile");
				if (shouji != null && shouji != "") {
					$("#txtOrderedCustomerPhone").val(shouji);
				}
				var sex = localStorage.getItem("sex");
				if (sex != null && sex != "") {
					if (sex == "男") {
						$("#divOrderedSex").children().removeClass("radio-selected");
						$($("#divOrderedSex a")[0]).addClass("radio-selected");
					} else {
						$("#divOrderedSex").children().removeClass("radio-selected");
						$($("#divOrderedSex a")[1]).addClass("radio-selected");
					}
				}
				var username = localStorage.getItem("username");
				if (username != null && username != "") {
					$("#txtOrderedAlias").val(username);
				}

				var hours = new Date().getHours();
				if (hours >= 14) {
					//var obj=
					//$("#divOrderMealSelected a:eq(0)").removeAttr("selected");
					//$("#divOrderMealSelected a:eq(1)").attr("disabled", "disabled");
					//$("#divOrderMealSelected a:eq(1)").attr("selected");
				}
			}
		},
		selectDate: function (evt) {
			$("#calendarH .selected").removeClass("selected");
			$(evt).addClass("selected");

			$("#btnCalendar").attr("data-date", $(evt).attr("data-date")).attr("ids", $(evt).attr("ids"));
		},
		toCalendar: function (evt) {
			if (!hasCalendar) {
				this.generateCalendar();
				hasCalendar = true;
			}
			//选中日期
			$("#calendar").find(".selected").removeClass("selected");
			var ids = $("#calendarH .selected").attr("ids");
			$("#calendar a[ids='" + ids + "']").addClass("selected");

			$.ui.loadContent("page_calendar", false, false, "slide");

		},
		selectDate2: function (evt) {
			//选择日历
			var select = $(evt).attr("data-date");
			$("#calendar .selected").removeClass("selected");
			$(evt).addClass("selected");

			$.ui.goBack();

			$("#calendarH .selected").removeClass("selected");
			var el = $("#calendarH a[ids='" + $(evt).attr("ids") + "']");
			$(el).addClass("selected");
			scrollArr["calendarH"].scrollToElement(el.get(0), 1000);


		},
		selectMeal: function (evt) {
			$(evt).parent().children().removeClass("selected");
			$(evt).addClass("selected");
		},
		selectRoom: function (evt) {
			$(evt).parent().children().removeClass("selected");
			$(evt).addClass("selected");

		},
		selectGender: function (evt) {
			$(evt).parent().children().removeClass("radio-selected");
			$(evt).addClass("radio-selected");
		},
		toReserve: function (evt) {

			//这个页面是 当点击了  立即预定  后进入这里进行处理
			var orderedPhone = $("#txtOrderedCustomerPhone").val();
			if (!validatemobile(orderedPhone)) {
				alert("电话号码格式不对！");
				$("#txtOrderedCustomerPhone").val("");
				return;
			}
			if ($("#txtOrderedNumber").val() == "") {
				alert("请填写订餐人数！");
			} else {
				var val = $("#txtOrderedNumber").val();
				for (var i = 0; i < val.length; i++) {
					if (val.charCodeAt(i) > 57 || val.charCodeAt(i) < 48) {
						alert("订餐人数只能是数字！");
						return;
					}
				}
			}

			if ($("#txtOrderedAlias").val() == "") {
				alert("请填写称呼！");
				return;
			}

			//todo:这里需要验证一下  如果没有绑定了手机就跳到手机绑定页面，如果绑定了就不要执行这句话了！！！
			var mobile = localStorage.getItem("mobile");
			if (mobile == null) {
				//绑定手机页面
				$.ui.loadContent("page_bind", false, false, "slide");
				$("#txtYourCellPhone").val($("#txtOrderedCustomerPhone").val());
			}
			//调用它们的下订单接口
			RestaurantOrder();

		},
		getBindCode: function (evt) {
			var r = Math.random().toString();
			randomNumber = r.substr(2, 4);
			var phoneNumber = $("#txtYourCellPhone").val();
			if (!validatemobile(phoneNumber)) {
				alert("手机号码不正确,请重新输入!");
				$("#txtYourCellPhone").val("");
				return;
			}

			var strContent = "【" + phoneNumber + "】您的验证码为：" + randomNumber;
			$.ajax({
				url: "http://114.113.155.149:8888/sms.aspx?action=send&userid=110&account=zijics106&password=126zcn&mobile=" + phoneNumber + "&content=" + strContent,
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

			//讲按钮置为不可用状态一分钟
			var sh;
			var total = 60;
			var originText = $("#txtGetValidateCode").html();
			sh = setInterval(function () {
				$("#aGetBindCode").removeAttr("actionname");
				total--;
				if (total > 0) {
					$("#aGetBindCode").attr("disabled", "disabled");
					$("#txtGetValidateCode").html(originText + "(" + total + "s)");
				} else {
					$("#txtGetValidateCode").html(originText);
					$("#aGetBindCode").removeAttr("disabled");
					$("#aGetBindCode").attr("actionname", "getBindCode");
					clearInterval(sh);
				}
			}, 1000);

		},
		toSubmit: function (evt) {
			//提交验证码
			//这里是获取验证码的页面接口

			//拿用户输入的随机码和内存中保存的随机码进行比较来判断是否是正确的用户！！！
			var userInputCode = $("#txtValidateCode").val();
			if (userInputCode != randomNumber) {
				alert("验证失败！");
				$("#txtValidateCode").val("");
				return;
			} else {
				alert("验证成功！");
				//将手机号码更新到wx_user表里面去
				var tousername = localStorage.getItem("tousername");
				var mobile = $("#txtYourCellPhone").val();
				var username = $("#txtOrderedAlias").val();
				DoMethod("updateshoujibyweixinid&tousername=" + tousername + "&mobile=" + mobile+"&username="+encodeURIComponent(username), function (result) {
					if (result.status == "success") {
						localStorage.setItem("mobile", mobile);
						localStorage.setItem("username", username);
						//alert("成功绑定手机号！");

						//绑定成功后 跳转到用户页面
						window.location.href = "../user/user.html";
					}
				});
			}
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
		var str = "";
		for (var i = 0; i < result.length; i++) {
			str += "<li class=\"\">";
			str += "<a actionname=\"toDetail\""
                + " data-id=\"" + result[i].rid + "\" class=\"item box\">";
			str += "<div class=\"item-left\">";
			str += "<img src=\"http://www.youmianwang.com/static/" + result[i].image + "\" />";
			str += "</div>";
			str += "<div class=\"item-content box1\">";
			str += "<div class=\"item-title\" data=\"" + result[i].rid + "\"><h3 class=\"ellipses\">" + result[i].title + "</h3></div>";
			str += "<div class=\"item-info\">";
			//str += "<span class=\"reserve-table floatR\">餐位预定</span>";

			//orginal
			//str += "人均消费:<span class=\"item-info-span\" style='color:#ff8400'>" + result[i].consumption
			//    + "</span><span class=\"item-info-span\">地址:" + result[i].address + "</span>";

			str += "<span>人均消费(元): </span><span class=\"item-info-span\" style='color:#ff8400'>" + result[i].consumption
                + "</span><span class=\"item-info-span\">" + result[i].address + "</span>";


			//+ "\t" + result[i].rid
			str += "</div>";
			str += "</div>";
			//str += "<div>"+"<span class=\"item-info-span\">地址:" + result[i].address + "</span>"+"</div>";

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
		var restName = $("#txtTeamName").val();

		var areaId = areaIdDic.findKeyByValue(areaName);
		var caixiId = caiIdDic.findKeyByValue(caixiName);

		var str = "getresterants&pageIndex=" + pageIndex + "&pageSize=" + pageSize;
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
		if (restName == null || restName == "") {
			str += "&restName=";
		} else {
			str += "&restName=" + encodeURIComponent(restName);
		}
		DoMethod(str, getteamSuccessHandler);

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

		var tousername = localStorage.getItem("tousername");
		if (tousername == null || tousername == "") {

			var code = getparamOfHref("code", window.location.href);
			//alert("code="+code);
			GetWeChatInfo(code);
		}


		DoMethod("getarea", getareaSuccessHandler);
		DoMethod("getdishes", getdishesSuccessHandler);

		SearchResult();

		//绑定列表页点击后跳转到详细页的事件
		//$("div.item-title").click(function() {
		//    location.href = "TeamDetail.html?team_id=" + $(this).attr("data");
		//});

		//$("#txtOrderedCustomerPhone").bind("keydown", function (e) {
		//    if (e.keyCode > 57 || e.keyCode < 48) {
		//        $(this).val("");
		//    }
		//});
		//$("#txtOrderedCustomerPhone").bind("keyup", function (e) {
		//    if (e.keyCode > 57 || e.keyCode < 48) {
		//        $(this).val("");
		//    }
		//});

		//$("#txtOrderedNumber").bind("keyup", function (e) {
		//    if (e.keyCode > 57 || e.keyCode < 48) {
		//        $(this).val("");
		//    }
		//});

		common.regCustomClickHandler(reserveAction);
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
		/*默认把日历都加载上，也可去掉，会在点开页面时加载*/
		reserveAction.getCalendarHorizon();
		hasCalendarHorizon = true;
		setTimeout(function () {
			scrollArr["calendarH"].refresh();
		}, 500);
		reserveAction.generateCalendar();
		hasCalendar = true;
	});

});
