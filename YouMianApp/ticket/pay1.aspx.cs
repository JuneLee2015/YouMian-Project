using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace YouMianApp.ticket
{
    public partial class pay1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                var timeStr = DateTime.Now.ToString("yyyyMMddHHmmss");
                SendTime.Value = timeStr;
                OrderTime.Value = timeStr;
                //OrderNo.Value = "Y" + timeStr;

                OrderNo.Value = Request.QueryString["OrderNo"].ToString();
                OrderAmount.Value = string.Format("{0:F2}",Request.QueryString["OrderAmount"].ToString());
                //ProductName.Value = Request.QueryString["ProductName"].ToString();
                BuyerContact.Value = Request.QueryString["BuyerContact"].ToString();

                BuyerIp.Value = getIPAddress();
            }

            if (IsPostBack)
            {


                Server.Transfer("pay2.aspx");
            }
        }

        private string getIPAddress()
        {
            System.Net.IPAddress addr;
            // 获得本机局域网IP地址   
            addr = new System.Net.IPAddress(Dns.GetHostByName(Dns.GetHostName()).AddressList[0].Address);
            return addr.ToString();
        }
    }
}