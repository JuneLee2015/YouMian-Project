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

    function showToplistMenu(div_id, fromid, hideFun) {
        var id = div_id ? ("#" + div_id) : ".top-selector:first-child";
        $(id).show();
        $("#mask").show();

        var clk = function (e) {
            hideToplistMenu(div_id, hideFun);
            document.getElementById("afui").removeEventListener("click", clk, true);
            var target = e.target;
            if ($(target).attr("id") == fromid || $(target).parents("#"+fromid).length != 0) {
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
