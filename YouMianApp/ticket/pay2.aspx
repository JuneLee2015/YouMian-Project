<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="pay2.aspx.cs" Inherits="YouMianApp.ticket.pay2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

        <title>盛付通网银直连接口处理页面</title>
        <style type="text/css">
            body
            {
                text-align: center;
            }
            .container
            {
                text-align: left;
                margin: 2px auto;
                width: 800px;
                height: 343px;
            }
            input
            {
                display: block;
            }
            .center
            {
                text-align: center;
            }
            label
            {
                display: block;
            }
            .style1
            {
                height: 27px;
            }
        </style>
        <script type="text/javascript">
            
            window.onload = function() { form1.submit(); }
        </script>
    
</head>
<body>
    <form id="form1" method="post" action="http://html.5i5a.com/youmianwang_app/ticket/teamlist.html">
     <input name="Name" runat="server" type="hidden" id="Name" value="" />
    <input name="Version" runat="server" type="hidden" id="Version" value="V4.1.1.1.1" />
    <input name="Charset" runat="server" type="hidden" id="Charset" value="" />
    <input name="MsgSender" runat="server" type="hidden" id="MsgSender" value="151299" />
    <input name="SendTime" runat="server" type="hidden" id="SendTime" value="" />
    <input name="OrderNo" runat="server" type="hidden" id="OrderNo" value="" />
    <input name="OrderAmount" runat="server" type="hidden" id="OrderAmount" value="0.12" />
    <input name="OrderTime" runat="server" type="hidden" id="OrderTime" value="" />
    <input name="PayType" runat="server" type="hidden" id="PayType" value="" />
    <input name="InstCode" runat="server" type="hidden" id="InstCode" value="" />
    <input name="PageUrl" runat="server" type="hidden" id="PageUrl" value="http://html.5i5a.com/youmianwang_app/ticket/paysuccess.html" />
    <input name="NotifyUrl" runat="server" type="hidden" id="NotifyUrl" value="http://html.5i5a.com/youmianwang_app/ticket/paysuccess.html" />
    <input name="ProductName" runat="server" type="hidden" id="ProductName" value="" />
    <input name="BuyerContact" runat="server" type="hidden" id="BuyerContact" value="" />
    <input name="BuyerIp" runat="server" type="hidden" id="BuyerIp" value="" />
    <input name="Ext1" runat="server" type="hidden" id="Ext1" value="" />
    <input name="SignType" runat="server" type="hidden" id="SignType" value="MD5" />
    <input name="SignMsg" runat="server" type="hidden" id="SignMsg" value="" />
    </form>
</body>
</html>
