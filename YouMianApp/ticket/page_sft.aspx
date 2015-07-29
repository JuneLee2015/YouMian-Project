<%@ Page Language="C#" AutoEventWireup="true" Debug="true" CodeBehind="page_sft.aspx.cs" Inherits="YouMianApp.ticket.page_sft" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>支付结果通知</title>
	<script src="../js/jquery-1.11.2.min.js"></script>
</head>
<body>
	<form id="form1" runat="server">
		<div>
			<%--<% Response.Write("比对结果:" + Session["verifyResult"].ToString().Trim() + "****<br/>");
           if (Session["verifyResult"].ToString().Trim().Equals("true"))
           {
               Response.Write("签名验证成功#######<br/>");
               if (Request.Form["TransStatus"].Trim().Equals("01"))
                 {  
                     Response.Write("更新数据库成功OK");
		         }else
                 {
                     Response.Write("更新订单失败");
		         }
	%>--%>
			<h1>支付成功，请确认！</h1>
			<a href="TeamList.html">回到优惠券页面</a>
			<%--<table align="center" width="350" cellpadding="5" cellspacing="0">
        <tr>
            <td align="right">订单号：</td>
            <td align="left"><%=Request.Form["OrderNo"].ToString()%></td>
        </tr>
		<tr>
           <td align="right">盛付通订单号：</td>
           <td align="left"><%=Request.Form["TraceNo"].ToString()%></td>
        </tr>
        <tr>
           <td align="right">实际付款总金额：</td>
           <td align="left"><%=Request.Form["TransAmount"].ToString()%></td>
        </tr>
		<tr>
           <td  align="right">支付时间：</td>
           <td align="left"><%=Request.Form["TransTime"].ToString()%></td>
        </tr>
    </table>--%>


			<%--<%
	}else
    {
        Response.Write("Verify MAC failed, _TransType.form:" + Request.Form["TransType"].ToString() + "<br/>");
        Response.Write("Verify MAC failed, _InstCode.form:" + Request.Form["InstCode"].ToString() + "<br/>");  
        Response.Write("Verify MAC failed, _SignMsg.form:" + Request.Form["SignMsg"].ToString() + "<br/>");
        Response.Write("Verify MAC failed, SignMsg_mer:" + Session["SignMsg_mer"].ToString() + "<br/>");
        Response.Write("Verify MAC failed, _SignMsg.form:" + Session["signMessage"].ToString() + "<br/>");    
	    %>
		    <h1>支付失败</h1>
	    <%
	}
	%>--%>
		</div>
	</form>

	<script type="text/javascript">

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

		$(function () {

			var action = localStorage.getItem("Action");
			var orderNo = localStorage.getItem("OrderNo");

			//alert("action=" + action + " , orderNo=" + orderNo);

			if (action == "Ticket") {
				//将交易流水信息写入bank表
				//TODO:目前没有将支付写入bank表，做不做待定！

				//支付成功该做的事，这个方法以后要注释掉，因为上了真正的环境，不需要模拟数据了
				UpdateOrderStateAndInsertACoupon(orderNo);

				//todo:假设支付成功了，然后这里对优惠券生成密码   调用生成优惠券密码的接口
				//GenerateTeamSecretCode(orderNo);
			}
			else if (action == "Movie") {
				UpdateOrderStateAndInsertACoupon(orderNo);
			}
		});
	</script>
</body>
</html>
