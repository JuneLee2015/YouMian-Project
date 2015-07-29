//document.addEventListener("touchstart",function(e){
//    e.preventDefault();
//})
//if (target.tagName != "SELECT" && target.tagName != "INPUT" && target.tagName != "TEXTAREA") {
//    e.preventDefault();
//}
define(function (require, exports, module) {
    /*页面上只绑定一次的按钮可在$.ui.ready中进行绑定*/
//    require("../public/js/iscroll");
    /*加载模板*/
    //require("template");



    var ticketAction = {
        showMenu: function (evt) {
            var id = $(evt).attr("show");
            common.showToplistMenu(id, function () {
                $(evt).removeClass("on");
            });
            $(evt).parent().find(".nav-item").removeClass("on");
            $(evt).addClass("on");
        },
        selectArea: function (evt) {
            $(evt).parents(".menu").find(".menu-item").removeClass("on");
            $(evt).parent().addClass("on");

            $("#areaVal").attr("data",$(evt).text()).find("span").text($(evt).text());
        },
        selectCuisine: function (evt) {
            $(evt).parents(".menu").find(".menu-item").removeClass("on");
            $(evt).parent().addClass("on");

            $("#cuisineVal").attr("data",$(evt).text()).find("span").text($(evt).text());
        },
        selectOrder: function (evt) {
            $(evt).parents(".menu").find(".menu-item").removeClass("on");
            $(evt).parent().addClass("on");

            $(".nav-item.on").removeClass("on");
            $(".top-selector").hide();
            $("#mask").hide();

            $("#orderVal").attr("data",$(evt).text()).find("span").text($(evt).text());
        },
        toDetail:function(evt){
            $.ui.loadContent("page_ticket_detail",false,false,"slide");
        }
    };

    (function () {
        window.globalClickFlag = false;//防止安卓自动两次点击
        function regCustomClickHandler(actions) {
            window.global = window["global"] ? global : [];
            global.push(actions);
            $.ui.customClickHandler = function (evt) {
                if (window.globalClickFlag) {
                    return;
                }
                window.globalClickFlag = true;

                setTimeout(function () {
                    window.globalClickFlag = false;
                }, 500);
                global.forEach(function (element) {
                        element.customClickHandler = function (evt) {
                            var actionName = $(evt).attr('actionName');
                            //方法内部可以访问到evt,dataid,actionName
                            this[actionName] && typeof(this[actionName]) == "function" && this[actionName](evt);
                        }
                        element.customClickHandler(evt);
                    }
                )
            }
        }

        function showToplistMenu(div_id, hideFun) {
            var id = div_id ? ("#" + div_id) : ".top-selector:first-child";
            var height = $(id).height();
            //if (height > 300) height = 300;
            $(id).show();
            $("#mask").css({"top":"80px","zIndex":"9"}).show();

            var clk = function (e) {
                hideToplistMenu(div_id, hideFun);
                document.getElementById("afui").removeEventListener("click", clk, true);
                var target = e.target;
                if ($(target).attr("id") == div_id || $(target).parents(id).length == 0) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    return false;
                }
            }
            document.getElementById("afui").addEventListener("click", clk, true);
        }

        function hideToplistMenu(div_id, hideFun) {
            var id = div_id ? ("#" + div_id) : ".top-selector:first-child";
            $("#mask").hide();
            setTimeout(function () {
                $(id).hide();
                if (typeof hideFun == "function") {
                    hideFun(div_id);
                }
            }, 100);
        }

        window.common = {
            showToplistMenu: showToplistMenu,
            regCustomClickHandler: regCustomClickHandler
        }
    })();

    $(document).ready(function () {
        common.regCustomClickHandler(ticketAction);

    });

});
