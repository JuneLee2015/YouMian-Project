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

public partial class SendOrderSFT1 : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {

        if (!IsPostBack)
        {
            var timeStr=DateTime.Now.ToString("yyyyMMddHHmmss");
            SendTime.Value = timeStr;
            OrderTime.Value = timeStr;
            OrderNo.Value = "Y" + timeStr;

            BuyerIp.Value = "10.200.32.55";
        }

        if (IsPostBack)
        {


            Server.Transfer("SendOrderSFT2.aspx");
        }
    }


}
