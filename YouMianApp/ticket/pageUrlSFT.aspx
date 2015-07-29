<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pageUrlSFT.aspx.cs" Inherits="pageUrlSFT" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<!--
 支付应答签名原始串是：Origin＝Name + Version + Charset + TraceNo + MsgSender + SendTime + 
        InstCode + OrderNo + OrderAmount + TransNo + TransAmount + TransStatus + TransType + 
        TransTime + MerchantNo + ErrorCode + ErrorMsg + Ext1 + SignType;
        
        bool verifyResult=i_md5_prj.SignUtil.VerifySign(_amount,_payAmount,_orderNo,_serialNo,_status
		,_merchantNo,_payChannel,_discount,_signType,_payTime,_currencyType
		,_productNo,_productDesc,_remark1,_remark2,_exInfo,_mac);
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>支付结果通知</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
       <% Response.Write("比对结果:" + Session["verifyResult"].ToString().Trim() + "****<br/>");
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
	%>
	<h1>支付成功，请确认！</h1>
	<table align="center" width="350" cellpadding="5" cellspacing="0">
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
    </table>
	<%
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
	%>.
    </div>
    </form>
</body>
</html>
