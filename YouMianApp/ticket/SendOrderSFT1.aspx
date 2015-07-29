<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SendOrderSFT1.aspx.cs" Inherits="SendOrderSFT1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>盛付通网银直连接口呈现页面</title>

    <style type="text/css">
        body {
            text-align: center;
            font-family: 'verdana', '宋体';
        }

        .container {
            text-align: left;
            margin: 2px auto;
            width: 800px;
            height: 343px;
        }

        input {
            display: block;
			width: 167px;
		}

        .center {
            text-align: center;
        }

        label {
            display: block;
        }

        .style1 {
            height: 27px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server" method="post">
        <div class="container">
            <label class="center">盛付通网银直连接口呈现页面</label>
            <table>
                <tr>
                    <td width="50%">报文名称</td>
                    <td>
                        <input name="Name" type="text" id="Name" value="B2CPayment" /></td>
                </tr>
                <tr>
                    <td width="50%">版本号</td>
                    <td>
                        <input name="Version" type="text" id="Version" value="V4.1.1.1.1" /></td>
                </tr>
                <tr>
                    <td width="50%">字符集</td>
                    <td>
                        <input name="Charset" type="text" id="Charset" value="gbk" /></td>
                </tr>
                <tr>
                    <td width="50%">请求提交方(一般为商户号)</td>
                    <td>
                        <input name="MsgSender" type="text" id="MsgSender" value="151299" /></td>
                </tr>
                <tr>
                    <td width="50%">发送时间</td>
                    <td>
	                    <input id="SendTime" runat="server" name="SendTime" value="" type="text" />
    
                    </td>
                </tr>
				
                <tr>
                    <td>订单号</td>
                    <td>
                        <input runat="server" name="OrderNo" type="text" id="OrderNo" value="" /></td>
                </tr>
                <tr>
                    <td>订单金额（数字形式，两位小数）</td>
                    <td>
                        <input name="OrderAmount" type="text" id="OrderAmount" value="0.12" /></td>
                </tr>
                <tr>
                    <td>订单时间yyyyMMddHHmmss</td>
                    <td>
                        <input runat="server" name="OrderTime" type="text" id="OrderTime" value="" /></td>
                </tr>


                <tr>
                    <td>支付方式</td>
                    <td>
                        <input name="PayType" type="text" id="PayType" value="" />(单个表示是否直连)</td>
                </tr>
                <tr>
                    <td>付款机构代码</td>
                    <td>
                        <input name="InstCode" type="text" id="InstCode" value="" />(单个表示是否直连)</td>
                </tr>

                <tr>
                    <td>回调地址</td>
                    <td>
                        <input name="PageUrl" type="text" id="PageUrl" value="http://html.5i5a.com/youmianwang_app/ticket/paysuccess.html" /></td>
                </tr>
                <tr>
                    <td>服务器通知地址</td>
                    <td>
                        <input name="NotifyUrl" type="text" id="NotifyUrl" value="http://html.5i5a.com/youmianwang_app/ticket/paysuccess.html" /></td>
                </tr>
                <tr>
                    <td>商品名称</td>
                    <td>
                        <input name="ProductName" type="text" id="ProductName" value="apple" /></td>
                </tr>
                <tr>
                    <td>支付人联系方式</td>
                    <td>
                        <input name="BuyerContact" type="text" id="BuyerContact" value="18500234180" /></td>
                </tr>


                <tr>
                    <td>买家IP地址</td>
                    <td>
                        <input runat="server" name="BuyerIp" type="text" id="BuyerIp" value="" /></td>
                </tr>

                <tr>
                    <td>备注1,回调时会传回给商户</td>
                    <td>
                        <input name="Ext1" type="text" id="Ext1" value="Ext6" /></td>
                </tr>
                <tr>
                    <td class="style1">签名类型（1-RSA签名，2-MD5签名）</td>
                    <td class="style1">
                        <input name="SignType" type="text" id="SignType" value="MD5" /></td>
                </tr>

                <tr>

                    <td>
                        <input type="hidden" name="SignMsg" id="SignMsg" value="" />
                        <asp:Button ID="ordersubmit" runat="server" Text="支付提交" /></td>
                    <td></td>
                </tr>

            </table>

        </div>
    </form>
</body>
</html>
