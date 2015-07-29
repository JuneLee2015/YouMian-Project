using System;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Text;
using System.Security.Cryptography;


public partial class pageUrlSFT : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            string verifyResult = "false";

            // 支付应答签名原始串是：Origin＝Name + Version + Charset + TraceNo + MsgSender + SendTime + 
            //InstCode + OrderNo + OrderAmount + TransNo + TransAmount + TransStatus + TransType + 
            //TransTime + MerchantNo + ErrorCode + ErrorMsg + Ext1 + SignType; 

            string keyMer = ConfigurationManager.AppSettings["keyMer"].Trim();
            string signMessage = Request.Form["Name"] + Request.Form["Version"] + Request.Form["Charset"] +
                                 Request.Form["TraceNo"]
                                 + Request.Form["MsgSender"] + Request.Form["SendTime"] + Request.Form["InstCode"] +
                                 Request["OrderNo"]
                                 + Request.Form["OrderAmount"] + Request["TransNo"] + Request.Form["TransAmount"]
                                 + Request.Form["TransStatus"] + Request.Form["TransType"] + Request.Form["TransTime"] +
                                 Request.Form["MerchantNo"]
                                 + Request.Form["ErrorCode"] + Request.Form["ErrorMsg"] + Request.Form["Ext1"]
                                 + Request.Form["SignType"] + keyMer;

            //REP_B2CPAYMENT V4.1.2.1.1 UTF-8 5da18a31-fcd3-4ac3-87ac-e7b6efcf3973 SFT 20120227105851 CMB 0.01 0.01 01 PT001 20120227105717 100894 13974851711-WXTSFT120227105717369957048 MD5 shengfutongSHENGFUTONGtest

            //string SignMsg_mer = MD5Encode(Request.Form["Name"] + Request.Form["Version"] + Request.Form["Charset"] + Request.Form["TraceNo"] 
            //     + Request.Form["MsgSender"] + Request.Form["SendTime"] +  Request.Form["InstCode"] +Request.Form["OrderNo"] 
            //    + Request.Form["OrderAmount"] +Request.Form["TransNo"] + Request.Form["TransAmount"]
            //    + Request.Form["TransStatus"] + Request.Form["TransType"] + Request.Form["TransTime"] +Request.Form["MerchantNo"] 
            //    + Request.Form["ErrorCode"] + Request.Form["ErrorMsg"] + Request.Form["Ext1"] 
            //    +Request.Form["SignType"] + keyMer).ToUpper();

            MD5 myMD5 = new MD5CryptoServiceProvider();
            byte[] signed = myMD5.ComputeHash(Encoding.GetEncoding("gbk").GetBytes(signMessage));
            string signResult = byte2mac(signed); //Convert.ToBase64String(signed);
            string SignMsgMerchant = signResult.ToUpper();

            if (SignMsgMerchant.Equals(Request.Form["SignMsg"].ToString().Trim()))
            {
                verifyResult = "true";

            }
            Session["verifyResult"] = verifyResult;
            Session["SignMsgMerchant"] = SignMsgMerchant;
            Session["signMessage"] = signMessage;
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message+" , "+ex.StackTrace.ToString());
        }
    }

           //加密验证方法

    public static string byte2mac(byte[] signed)
    {
        StringBuilder EnText = new StringBuilder();
        foreach (byte Byte in signed)
        {
            EnText.AppendFormat("{0:x2}", Byte);
        }

        return EnText.ToString();
    }        


}
