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


public partial class notifySFT : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string verifyResult = "false";
        
       string keyMer=ConfigurationManager.AppSettings["keyMer"].Trim();
       string signMessage = Request.Form["Name"] + Request.Form["Version"] + Request.Form["Charset"] + Request.Form["TraceNo"]
            + Request.Form["MsgSender"] + Request.Form["SendTime"] + Request.Form["InstCode"] + Request["OrderNo"]
           + Request.Form["OrderAmount"] + Request["TransNo"] + Request.Form["TransAmount"]
           + Request.Form["TransStatus"] + Request.Form["TransType"] + Request.Form["TransTime"] + Request.Form["MerchantNo"]
           + Request.Form["ErrorCode"] + Request.Form["ErrorMsg"] + Request.Form["Ext1"]
           + Request.Form["SignType"] + keyMer;


        MD5 myMD5 = new MD5CryptoServiceProvider();
        byte[] signed = myMD5.ComputeHash(Encoding.GetEncoding("gbk").GetBytes(signMessage));
        string signResult = byte2mac(signed);//Convert.ToBase64String(signed);
        string SignMsgMerchant = signResult.ToUpper();

        if (SignMsgMerchant.Equals(Request.Form["SignMsg"].ToString().Trim()))
       {
             verifyResult ="true";
            //更新数据库
             Response.Write("OK");
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
