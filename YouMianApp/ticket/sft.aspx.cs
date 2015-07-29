using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace YouMianApp.ticket
{
    public partial class sft : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                //为了一次只支付一分钱来测试，这段代码真实上线要打开，现在不打开！！！
                //orderAmount.Value = string.Format("{0:F2}", Request.QueryString["OrderAmount"].ToString());

                var nowdate = DateTime.Now.ToString("yyyyMMddHHmmss");
                TraceNo.Value = nowdate;
                sendTime.Value = nowdate;
                orderTime.Value = nowdate;
                orderNo.Value = Request.QueryString["OrderNo"].ToString();
                buyerIp.Value = GetIP();
                productName.Value = Request.QueryString["ProductName"].ToString();
                payerMobileNo.Value = Request.QueryString["BuyerContact"].ToString();

                var str1 = "";
                foreach (var control in this.Form.Controls)
                {
                    if (control.GetType().Name == "HtmlInputText")
                    {
                        str1 += ((HtmlInputText)control).Value;
                    }
                }

                str1 += "ZJWX0472-5911111";

                signMsg.Value = md5(str1).ToUpper();
            }
        }

        public string md5(string str)
        {
            byte[] b = Encoding.Default.GetBytes(str);
            b = new System.Security.Cryptography.MD5CryptoServiceProvider().ComputeHash(b);
            string ret = "";
            for (int i = 0; i < b.Length; i++)
                ret += b[i].ToString("x").PadLeft(2, '0');
            return ret;
        }
        private string GetIP()
        {
            string hostName = Dns.GetHostName();//本机名   
            //System.Net.IPAddress[] addressList = Dns.GetHostByName(hostName).AddressList;//会警告GetHostByName()已过期，我运行时且只返回了一个IPv4的地址   
            System.Net.IPAddress[] addressList = Dns.GetHostAddresses(hostName);//会返回所有地址，包括IPv4和IPv6   
            return addressList.FirstOrDefault().ToString();
        }
    }
}