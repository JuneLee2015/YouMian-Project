<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="pay1.aspx.cs" Inherits="YouMianApp.ticket.pay1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html;charset=gb2312" />
    <title>ʢ��ͨ����ֱ���ӿڳ���ҳ��</title>

    <style type="text/css">
        body {
            text-align: center;
            font-family: 'verdana', '����';
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
            <label class="center">ʢ��ͨ����ֱ���ӿڳ���ҳ��</label>
            <table>
                <tr>
                    <td width="50%">��������</td>
                    <td>
                        <input name="Name" type="text" id="Name" value="B2CPayment" /></td>
                </tr>
                <tr>
                    <td width="50%">�汾��</td>
                    <td>
                        <input name="Version" type="text" id="Version" value="V4.1.1.1.1" /></td>
                </tr>
                <tr>
                    <td width="50%">�ַ���</td>
                    <td>
                        <input name="Charset" type="text" id="Charset" value="gbk" /></td>
                </tr>
                <tr>
                    <td width="50%">�����ύ��(һ��Ϊ�̻���)</td>
                    <td>
                        <input name="MsgSender" type="text" id="MsgSender" value="151299" /></td>
                </tr>
                <tr>
                    <td width="50%">����ʱ��</td>
                    <td>
	                    <input id="SendTime" runat="server" name="SendTime" value="" type="text" />
    
                    </td>
                </tr>
				
                <tr>
                    <td>������</td>
                    <td>
                        <input runat="server" name="OrderNo" type="text" id="OrderNo" value="" /></td>
                </tr>
                <tr>
                    <td>������������ʽ����λС����</td>
                    <td>
                        <input runat="server" name="OrderAmount" type="text" id="OrderAmount" value="" /></td>
                </tr>
                <tr>
                    <td>����ʱ��yyyyMMddHHmmss</td>
                    <td>
                        <input runat="server" name="OrderTime" type="text" id="OrderTime" value="" /></td>
                </tr>


                <tr>
                    <td>֧����ʽ</td>
                    <td>
                        <input name="PayType" type="text" id="PayType" value="" />(������ʾ�Ƿ�ֱ��)</td>
                </tr>
                <tr>
                    <td>�����������</td>
                    <td>
                        <input name="InstCode" type="text" id="InstCode" value="" />(������ʾ�Ƿ�ֱ��)</td>
                </tr>

                <tr>
                    <td>�ص���ַ</td>
                    <td>
                        <input name="PageUrl" type="text" id="PageUrl" value="http://html.5i5a.com/youmianwang_app/ticket/paysuccess.html" /></td>
                </tr>
                <tr>
                    <td>������֪ͨ��ַ</td>
                    <td>
                        <input name="NotifyUrl" type="text" id="NotifyUrl" value="http://html.5i5a.com/youmianwang_app/ticket/paysuccess.html" /></td>
                </tr>
                <tr>
                    <td>��Ʒ����</td>
                    <td>
                        <input runat="server" name="ProductName" type="text" id="ProductName" value="" /></td>
                </tr>
                <tr>
                    <td>֧������ϵ��ʽ</td>
                    <td>
                        <input runat="server" name="BuyerContact" type="text" id="BuyerContact" value="" /></td>
                </tr>


                <tr>
                    <td>���IP��ַ</td>
                    <td>
                        <input runat="server" name="BuyerIp" type="text" id="BuyerIp" value="" /></td>
                </tr>

                <tr>
                    <td>��ע1,�ص�ʱ�ᴫ�ظ��̻�</td>
                    <td>
                        <input name="Ext1" type="text" id="Ext1" value="Ext6" /></td>
                </tr>
                <tr>
                    <td class="style1">ǩ�����ͣ�1-RSAǩ����2-MD5ǩ����</td>
                    <td class="style1">
                        <input name="SignType" type="text" id="SignType" value="MD5" /></td>
                </tr>

                <tr>

                    <td>
                        <input type="hidden" name="SignMsg" id="SignMsg" value="" />
                        <asp:Button ID="ordersubmit" runat="server" Text="֧���ύ" /></td>
                    <td></td>
                </tr>

            </table>

        </div>
    </form>
</body>
</html>
