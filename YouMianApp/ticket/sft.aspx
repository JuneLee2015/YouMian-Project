<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="sft.aspx.cs" Inherits="YouMianApp.ticket.sft" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
	<script src="../js/jquery-1.11.2.min.js"></script>
</head>
<body>
    <form id="pay_form" method="post" action="http://api.shengpay.com/html5-gateway/pay.htm?page=mobile" runat="server">
        
		<div style="margin: 140px auto;text-align: center;font-family: '宋体';">
			<h1>正在跳转进入支付...</h1>
		</div>

		<div style="display: none;">
            <input id="btnSubmit" type="submit" value="go to pay"  style="width: 200px;line-height: 30px;height: 30px;font-weight: bold;font-size: 18px;font-family: Verdana;"/>
            <br/></div>
		<div style="display: none;">
            <input type="text" runat="server" id="serviceCode" value="B2CPayment" />
            <input type="text" runat="server" id="version" value="V4.1.1.1.1" />
            <input type="text"  runat="server" id="charset" value="UTF-8" />
            <input type="text"   runat="server" id="TraceNo" value="" />
            <input type="text"  runat="server"  id="senderId" value="151299" />
            <input type="text"  runat="server"  id="sendTime" value="" />
            <input type="text"  runat="server"  id="orderNo" value="" />
            <input type="text"  runat="server"  id="orderAmount" value="0.01" />
            <input type="text"  runat="server"  id="orderTime" value="" />
            <input type="text"   runat="server" id="pageUrl" 
				value="http://html.5i5a.com/youmianwang_app/ticket/page_sft.aspx" />
            <input type="text"  runat="server"  id="notifyUrl" 
				value="http://html.5i5a.com/youmianwang_app/ticket/notifySFT.aspx" />
            <input type="text"   runat="server" id="productName" value="" />
            <input type="text"   runat="server" id="buyerIp" value="" />
            <input type="text"   runat="server" id="payType" value="" />
            <input type="text"   runat="server" id="payChannel" value="" />
            <input type="text"   runat="server" id="payerMobileNo" value="18500234180" />
            <input type="text"   runat="server" id="payerAuthTicket" value="" />
            <input type="text"  runat="server"  id="InstCode" value="" />
            <input type="text"   runat="server" id="ext1" value="" />
            <input type="text"  runat="server"  id="signType" value="MD5" />
            <input type="text"  runat="server"  id="signMsg" value="" />

        </div>
    </form>
	<script type="text/javascript">
		$(function() {
			$("#btnSubmit").click();
		});
	</script>
</body>
</html>
