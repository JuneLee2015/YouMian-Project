using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace YouMianApp.ticket
{
    public partial class pay2 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string SFTPayConfig = ConfigurationManager.AppSettings["SFTPayConfig"];
            string[] c = SFTPayConfig.Split('|');
            string key = c[1];//密钥

            this.Name.Value = (string)Request.Form["Name"];
            this.Version.Value = (string)Request.Form["Version"];
            this.Charset.Value = (string)Request.Form["Charset"];
            this.MsgSender.Value = c[0];

            string SendTime1 = DateTime.Now.ToString("yyyyMMddHHmmss");
            this.SendTime.Value = SendTime1;
            this.OrderNo.Value = "SFT" + DateTime.Now.ToString("yyMMddHHmmssffff") + new Random().Next(11111, 99999).ToString();
            this.OrderAmount.Value = (string)Request.Form["OrderAmount"];
            string OrderTime1 = DateTime.Now.ToString("yyyyMMddHHmmss");
            this.OrderTime.Value = OrderTime1;
            this.PayType.Value = (string)Request.Form["PayType"];
            string payType = this.PayType.Value;

            // 如果PayType的值不是PT001则为网银直连，否则则为非直连
            if (payType.Trim() != "PT001")
            {
                this.InstCode.Value = "";
            }
            else
            {
                this.InstCode.Value = (string)Request.Form["InstCode"];
            }
            //设置回调地址，发货通知地址
            this.PageUrl.Value = string.Format("http://{0}/ShengPay-Net/pageUrlSFT.aspx", Request.Url.Host.ToLower() + (Request.Url.Port == 80 ? "" : ":" + Request.Url.Port.ToString()));
            // string PageUrl = "http://localhost:1632/ShengPay-Net/pageUrlSFT.aspx";
            this.NotifyUrl.Value = string.Format("http://{0}/ShengPay-Net/notifySFT.ashx", Request.Url.Host.ToLower() + (Request.Url.Port == 80 ? "" : ":" + Request.Url.Port.ToString()));


            this.ProductName.Value = (string)Request.Form["ProductName"];
            this.SignType.Value = (string)Request.Form["SignType"];

            this.BuyerContact.Value = (string)Request.Form["BuyerContact"];
            this.BuyerIp.Value = (string)Request.Form["BuyerIp"];
            this.Ext1.Value = (string)Request.Form["Ext1"];

            //加密数据串

            string testStr = this.Name.Value + this.Version.Value + this.Charset.Value + this.MsgSender.Value + this.SendTime.Value
                + this.OrderNo.Value + this.OrderAmount.Value + this.OrderTime.Value + this.PayType.Value + this.InstCode.Value + this.PageUrl.Value
                + this.NotifyUrl.Value + this.ProductName.Value + this.BuyerContact.Value + this.BuyerIp.Value +
                this.Ext1.Value + this.SignType.Value + key;

            MD5 myMD5 = new MD5CryptoServiceProvider();
            byte[] signed = myMD5.ComputeHash(Encoding.GetEncoding("gbk").GetBytes(testStr));
            string signResult = byte2mac(signed);//Convert.ToBase64String(signed);
            this.SignMsg.Value = signResult.ToUpper();

        }

        //MD5加密方法
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
}