using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Configuration;
using System.Text;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using YouMianApp.helpers;

namespace YouMianApp
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class MyHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            var action = context.Request["opertype"] == null ? "" :
                      context.Request["opertype"].ToString();



            switch (action.ToLower())
            {
                case "test1":
                    Test1(context);
                    break;
                case "getarea":
                    getarea(context);
                    break;
                case "getdishes":
                    getdishes(context);
                    break;
                case "getteam":
                    getteam(context);
                    break;
                case "getteamdetails":
                    getteamdetails(context);
                    break;
                case "getrestaurantdetails":
                    getrestaurantdetails(context);
                    break;
                case "getrestaurantdetailsofteams":
                    getrestaurantdetailsOfTeams(context);
                    break;
                case "getmovies":
                    getmovies(context);
                    break;
                case "getresterants":
                    getresterants(context);
                    break;
                case "restaurantorder":
                    restaurantorder(context);
                    break;
                case "insertweixinuser":
                    insertweixinuser(context);
                    break;
                case "getuserinfobyweixinid":
                    getuserinfobyweixinid(context);
                    break;
                case "updateshoujibyweixinid":
                    updateshoujibyweixinid(context);
                    break;
                case "teamorder":
                    teamorder(context);
                    break;
                case "getrestaurantorderofcurrentuser":
                    getrestaurantorderofcurrentuser(context);
                    break;
                case "getmovieandticketorderofcurrentuser":
                    getmovieandticketorderofcurrentuser(context);
                    break;
                case "md5encrypt":
                    md5encrypt(context);
                    break;
                case "getsecretofteam_part1":
                    getsecretofteam_part1(context);
                    break;
                case "getsecretofteam_part2":
                    getsecretofteam_part2(context);
                    break;
                case "updateorderstateandinsertacoupon":
                    updateorderstateandinsertacoupon(context);
                    break;
                case "getwechatinfo":
                    getwechatinfo(context);
                    break;
                    
                default:
                    break;
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
        private void md5encrypt(HttpContext context)
        {
            string order_id = QueryString.GetQuery(context, "order_id");

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var str = serializer.Serialize(md5(order_id));
            context.Response.ContentType = "text/json;charset=UTF-8;";
            context.Response.Write(str);
        }

        /// <summary>
        /// 获取区域
        /// </summary>
        private void getarea(HttpContext context)
        {
            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, "select * from area", null).Tables[0];
            List<Area> listAreas = new List<Area>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    listAreas.Add(new Area()
                    {
                        areaname = datasource.Rows[i]["area"].ToString(),
                        gis = datasource.Rows[i]["gis"].ToString(),
                        addTime = datasource.Rows[i]["addtime"].ToString(),
                        sid = datasource.Rows[i]["sid"].ToString()
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(listAreas);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }


        }

        /// <summary>
        /// 获取菜系
        /// </summary>
        private void getdishes(HttpContext context)
        {
            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, "select * from dict where codetype='02' ", null).Tables[0];
            List<Dict> listAreas = new List<Dict>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    listAreas.Add(new Dict()
                    {
                        codeType = datasource.Rows[i]["codeType"].ToString(),
                        name = datasource.Rows[i]["name"].ToString(),
                        addTime = datasource.Rows[i]["addtime"].ToString(),
                        sid = datasource.Rows[i]["sid"].ToString()
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(listAreas);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        /// <summary>
        /// 获取优惠券详细信息
        /// </summary>
        private void getteamdetails(HttpContext context)
        {
            string teamid = QueryString.GetQuery(context, "teamid");
            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, "select *,from_unixtime(begin_time) as BT,from_unixtime(end_time) as ET,p.address as PartnerAddress,p.`open` as IsOpen from team t,partner p where t.partner_id=p.id and t.id=" + teamid + "  ", null).Tables[0];
            if (datasource.Rows.Count > 0)
            {
                var row = datasource.Rows[0];
                var obj = new
                    {
                        title = row["title"].ToString(),
                        summary = row["summary"].ToString(),
                        product = row["product"].ToString(),
                        team_price = row["team_price"].ToString(),
                        market_price = row["market_price"].ToString(),
                        detail = row["detail"].ToString(),
                        image = row["image"].ToString(),
                        image1 = row["image1"].ToString(),
                        image2 = row["image2"].ToString(),
                        begin_time = row["BT"].ToString(),
                        end_time = row["ET"].ToString(),
                        phone = row["phone"].ToString(),
                        PartnerAddress = row["PartnerAddress"].ToString(),
                        pre_number = row["pre_number"].ToString(),
                        IsOpen = row["IsOpen"].ToString()
                    };


                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        /// <summary>
        /// 获取餐厅详细信息
        /// </summary>
        private void getrestaurantdetails(HttpContext context)
        {
            string restid = QueryString.GetQuery(context, "restid");
            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, @"select p.title,r.address,p.phone,p.image,r.dcsj ,r.special,r.areaID,r.caiID,r.Gis,
r.special,p.id as PartnerId,r.id as RestaurantId
 from restaurant r ,partner p
where r.id=p.rest_id and r.id=" + restid + "", null).Tables[0];
            if (datasource.Rows.Count > 0)
            {
                var row = datasource.Rows[0];
                var obj = new
                {
                    title = row["title"].ToString(),
                    address = row["address"].ToString(),
                    phone = row["phone"].ToString(),
                    image = row["image"].ToString(),
                    dcsj = row["dcsj"].ToString(),
                    special = row["special"].ToString(),
                    RestaurantId = row["RestaurantId"].ToString(),
                    PartnerId = row["PartnerId"].ToString()
                };


                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        /// <summary>
        /// 获取餐厅详细信息对应的所有优惠券信息
        /// </summary>
        private void getrestaurantdetailsOfTeams(HttpContext context)
        {
            string partnerId = QueryString.GetQuery(context, "partnerId");
            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, @"select * from team where FROM_UNIXTIME(begin_time)<now() and FROM_UNIXTIME(end_time)>now() and partner_id=" + partnerId + "", null).Tables[0];
            List<Team> lists = new List<Team>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    var row = datasource.Rows[i];
                    var obj = new Team()
                    {
                        title = row["title"].ToString(),
                        image = row["image"].ToString(),
                        team_id = row["id"].ToString(),
                    };
                    lists.Add(obj);
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(lists);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }


        /// <summary>
        /// 获取优惠券
        /// </summary>
        private void getteam(HttpContext context)
        {
            string pageIndex = QueryString.GetQuery(context, "pageIndex");
            string pageSize = QueryString.GetQuery(context, "pageSize");

            string areaId = QueryString.GetQuery(context, "areaId");
            string caiId = QueryString.GetQuery(context, "caiId");
            string orderby = QueryString.GetQuery(context, "orderby");
            string teamName = QueryString.GetQuery(context, "teamName");


            //todo:正式上线的时候 将下面的打开，对应的代码注视掉，为了数据好看而已 做的数据！
            //            var sql = @"select t.title,t.team_price,t.market_price,r.address,r.areaID,r.caiID,t.id as team_id 
            //,r.id as rid ,t.partner_id as pid,t.pre_number,t.summary,t.product,t.image 
            // from restaurant r,team t,partner p where t.partner_id = p.id and p.rest_id=r.id 
            //and FROM_UNIXTIME(t.begin_time)<=now() and FROM_UNIXTIME(t.end_time)>=now()";

            var sql = @"select t.title,t.team_price,t.market_price,r.address,r.areaID,r.caiID,t.id as team_id 
,r.id as rid ,t.partner_id as pid,t.pre_number,t.summary,t.product,t.image 
 from restaurant r,team t,partner p where t.partner_id = p.id and p.rest_id=r.id and p.display='Y' 
 and FROM_UNIXTIME(t.begin_time)<=now() and FROM_UNIXTIME(t.end_time)>=now() ";

            if (!string.IsNullOrEmpty(areaId))
            {
                sql += " and r.areaID=" + areaId + " ";
            }
            if (!string.IsNullOrEmpty(caiId))
            {
                sql += " and r.caiID like '%" + caiId + "%'";
            }
            if (!string.IsNullOrEmpty(teamName))
            {
                sql += " and t.title like '%" + teamName + "%'";
            }
            if (!string.IsNullOrEmpty(orderby))
            {
                if (orderby == "2")
                    sql += " order by t.pre_number desc";
                else
                {
                    //按照 折扣来排序
                    sql += " order by (t.team_price/t.market_price) asc";
                }
            }

            sql += " LIMIT " + pageIndex + "," + pageSize;

            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null).Tables[0];
            List<Team> list = new List<Team>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    list.Add(new Team()
                    {
                        title = datasource.Rows[i]["title"].ToString(),
                        summary = datasource.Rows[i]["summary"].ToString(),
                        product = datasource.Rows[i]["product"].ToString(),
                        image = datasource.Rows[i]["image"].ToString(),
                        team_price = datasource.Rows[i]["team_price"].ToString(),
                        market_price = datasource.Rows[i]["market_price"].ToString(),
                        pre_number = datasource.Rows[i]["pre_number"].ToString(),
                        team_id = datasource.Rows[i]["team_id"].ToString(),
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(list);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        /// <summary>
        /// 获取电影票优惠券
        /// </summary>
        private void getmovies(HttpContext context)
        {
            string pageIndex = QueryString.GetQuery(context, "pageIndex");
            string pageSize = QueryString.GetQuery(context, "pageSize");

            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, "SELECT * FROM team t where t.title like '%电影%' and FROM_UNIXTIME(t.begin_time)<=now() and FROM_UNIXTIME(t.end_time)>=now() LIMIT " + pageIndex + "," + pageSize, null).Tables[0];
            List<Team> list = new List<Team>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    list.Add(new Team()
                    {
                        title = datasource.Rows[i]["title"].ToString(),
                        summary = datasource.Rows[i]["summary"].ToString(),
                        product = datasource.Rows[i]["product"].ToString(),
                        image = datasource.Rows[i]["image"].ToString(),
                        team_price = datasource.Rows[i]["team_price"].ToString(),
                        market_price = datasource.Rows[i]["market_price"].ToString(),
                        id = datasource.Rows[i]["id"].ToString()
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(list);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }


        /// <summary>
        /// 获取所有餐厅的接口
        /// </summary>
        private void getresterants(HttpContext context)
        {
            string pageIndex = QueryString.GetQuery(context, "pageIndex");
            string pageSize = QueryString.GetQuery(context, "pageSize");

            string restName = QueryString.GetQuery(context, "restName");
            string areaId = QueryString.GetQuery(context, "areaId");
            string caiId = QueryString.GetQuery(context, "caiId");

            var sql = @"select p.image, p.title,r.address,r.consumption ,r.areaID,r.caiID,r.Gis,p.image,
r.special,p.id,r.id as rid
 from restaurant r ,partner p
where r.id=p.rest_id and r.agreement=1 and p.`open`='Y' ";

            if (!string.IsNullOrEmpty(restName))
            {
                sql += " and p.title like '%" + restName + "%' ";
            }
            if (!string.IsNullOrEmpty(areaId))
            {
                sql += " and r.areaID=" + areaId + " ";
            }
            if (!string.IsNullOrEmpty(caiId))
            {
                sql += " and r.caiID like '%" + caiId + "%'";
            }

            sql += " LIMIT " + pageIndex + "," + pageSize;

            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null).Tables[0];
            List<Resterant> list = new List<Resterant>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    list.Add(new Resterant()
                    {
                        title = datasource.Rows[i]["title"].ToString(),
                        address = datasource.Rows[i]["address"].ToString(),
                        image = datasource.Rows[i]["image"].ToString(),
                        consumption = datasource.Rows[i]["consumption"].ToString(),
                        rid = datasource.Rows[i]["rid"].ToString()
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(list);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        /// <summary>
        /// 获取当前用户下的订餐订单的所有数据
        /// </summary>
        private void getrestaurantorderofcurrentuser(HttpContext context)
        {
            string pageIndex = QueryString.GetQuery(context, "pageIndex");
            string pageSize = QueryString.GetQuery(context, "pageSize");

            string mobile = QueryString.GetQuery(context, "mobile");

            var sql = string.Format(@"select o.id as oid,r.id as rid , r.`name` as rname ,o.canwei,o.cw_status,o.dining_time from `orders` o,restaurant r  where o.restaurant_id=r.id and o.tell='{0}'
order by o.dining_time DESC limit {1},{2} ", mobile, pageIndex, pageSize);

            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null).Tables[0];
            List<RestaurantOrder> list = new List<RestaurantOrder>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    list.Add(new RestaurantOrder()
                    {
                        oid = datasource.Rows[i]["oid"].ToString(),
                        rid = datasource.Rows[i]["rid"].ToString(),
                        rname = datasource.Rows[i]["rname"].ToString(),
                        canwei = datasource.Rows[i]["canwei"].ToString(),
                        cw_status = datasource.Rows[i]["cw_status"].ToString(),
                        dining_time = datasource.Rows[i]["dining_time"].ToString()
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(list);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            //else
            //{
            //    JavaScriptSerializer serializer = new JavaScriptSerializer();
            //    var str = serializer.Serialize(ConstructReturnObject("no more data",1));
            //    context.Response.ContentType = "text/json;charset=UTF-8;";
            //    context.Response.Write(str);
            //}
        }


        public int GetMaxId()
        {
            var sql = "select @@IDENTITY";
            var ret = MySqlHelper.ExecuteScalar(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (ret != null)
            {
                return Int32.Parse(ret.ToString());
            }
            return -1;
        }

        /// <summary>
        /// 获取 电影票 和优惠券 的订单以及优惠券coupon 密码的数据
        /// </summary>
        private void getmovieandticketorderofcurrentuser(HttpContext context)
        {
            string pageIndex = QueryString.GetQuery(context, "pageIndex");
            string pageSize = QueryString.GetQuery(context, "pageSize");
            string mobile = QueryString.GetQuery(context, "mobile");
            string isMovie = QueryString.GetQuery(context, "isMovie");

            var sql = "";
            if (isMovie == "1")
                sql = string.Format(@"select t.title,o.team_id,c.consume,c.secret,c.id cid,o.id oid,o.mobile,o.quantity
 ,FROM_UNIXTIME(t.begin_time) as b_time,FROM_UNIXTIME(t.end_time) as e_time from coupon c,`order` o,team t where c.order_id=o.id and o.team_id=t.id
 and o.mobile='{0}' and title like '%电影%'
order by t.expire_time desc limit {1},{2}", mobile, pageIndex, pageSize);
            else
            {
                sql = string.Format(@"select t.title,o.team_id,c.consume,c.secret,c.id cid,o.id oid,o.mobile,o.quantity
 ,FROM_UNIXTIME(t.begin_time) as b_time,FROM_UNIXTIME(t.end_time) as e_time from coupon c,`order` o,team t where c.order_id=o.id and o.team_id=t.id
 and o.mobile='{0}'
order by t.expire_time desc limit {1},{2}", mobile, pageIndex, pageSize);
            }

            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null).Tables[0];
            List<MovieOrder> list = new List<MovieOrder>();
            if (datasource.Rows.Count > 0)
            {
                for (int i = 0; i < datasource.Rows.Count; i++)
                {
                    list.Add(new MovieOrder()
                    {
                        title = datasource.Rows[i]["title"].ToString(),
                        team_id = datasource.Rows[i]["team_id"].ToString(),
                        consume = datasource.Rows[i]["consume"].ToString(),
                        secret = datasource.Rows[i]["secret"].ToString(),
                        cid = datasource.Rows[i]["cid"].ToString(),
                        oid = datasource.Rows[i]["oid"].ToString(),
                        mobile = datasource.Rows[i]["mobile"].ToString(),
                        b_time = datasource.Rows[i]["b_time"].ToString(),
                        e_time = datasource.Rows[i]["e_time"].ToString(),
                        quantity = datasource.Rows[i]["quantity"].ToString()
                    });
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(list);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            //else
            //{
            //    JavaScriptSerializer serializer = new JavaScriptSerializer();
            //    var str = serializer.Serialize(ConstructReturnObject("no more data",1));
            //    context.Response.ContentType = "text/json;charset=UTF-8;";
            //    context.Response.Write(str);
            //}
        }


        /// <summary>
        /// 订餐  下订单 接口
        /// </summary>
        private void restaurantorder(HttpContext context)
        {
            //http://www.youmianwang.com/api/yd_orders.php?dining_time=2015-01-29&sjd=12:30&username=ym&tell=18500234180&bz=雅间优先&rest_id=990&persons=4

            string dining_time = QueryString.GetQuery(context, "dining_time");
            string sjd = QueryString.GetQuery(context, "sjd");
            string username = QueryString.GetQuery(context, "username");
            string tell = QueryString.GetQuery(context, "tell");
            string bz = QueryString.GetQuery(context, "bz");
            string rest_id = QueryString.GetQuery(context, "rest_id");
            string persons = QueryString.GetQuery(context, "persons");

            string team_id = QueryString.GetQuery(context, "team_id");
            string order_num = QueryString.GetQuery(context, "order_num");
            string client_id = "1";
            string canwei = "1";
            string nums = persons;
            string discount = "100";
            string agreement = "1";
            string creatuser = "0";
            string iffirst = "1";
            string order_status = "1";
            string ddlb = "3";   //从微信订餐标志
            string remark = "";

            var sql = string.Format(@"insert into orders(order_num,client_id,restaurant_id,persons,dining_time,canwei
,nums,discount,agreement,creatuser,creattime,iffirst,order_status,tell,username,team_id,ddlb,remark,confirm_time)
VALUES(
    '{0}',{1},{2},{3},'{4}',{5},{6},{7},{8},{9},now(),{10},{11},'{12}','{13}',{14},{15},'{16}',now()
)", order_num, client_id, rest_id, persons, dining_time + " " + sjd, canwei, nums, discount, agreement, creatuser, iffirst, order_status, tell, username, team_id, ddlb, remark);

            int result = MySqlHelper.ExecuteNonQuery(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (result > 0)
            {
                var obj = new
                {
                    status = "success",
                    val = 1,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            else
            {
                var obj = new
                {
                    status = "fail",
                    val = 0,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        /// <summary>
        /// 优惠券下单的接口，优惠券包括 购买优惠券和购买电影票的优惠券
        /// </summary>
        private void teamorder(HttpContext context)
        {
            string quantity = QueryString.GetQuery(context, "quantity");
            string mobile = QueryString.GetQuery(context, "mobile");
            string price = QueryString.GetQuery(context, "price");
            string money = QueryString.GetQuery(context, "money");
            string team_id = QueryString.GetQuery(context, "team_id");

            var sql = string.Format(@"insert into `order` (team_id,state,quantity,mobile,price,money,origin,create_time)
values({0},'unpay',{1},'{2}',{3},{4},{5},UNIX_TIMESTAMP(now()));select @@identity ", team_id, quantity, mobile, price, money, price);

            var result = MySqlHelper.ExecuteScalar(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (Int32.Parse(result.ToString()) > 0)
            {
                var obj = new
                {
                    status = "success",
                    val = Int32.Parse(result.ToString()),
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            else
            {
                var obj = new
                {
                    status = "fail",
                    val = -1,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }


        /// <summary>
        /// 将插入一条新的wx_user表记录
        /// </summary>
        private void insertweixinuser(HttpContext context)
        {
            string tousername = QueryString.GetQuery(context, "tousername");
            string mobile = QueryString.GetQuery(context, "mobile");
            string username = QueryString.GetQuery(context, "username");
            string sex = QueryString.GetQuery(context, "sex");

            var sql = string.Format(@"insert into wx_user(tousername,datetime,mobile,username,sex)
values('{0}',now(),'{1}','{2}','{3}')", tousername, mobile, username, sex);

            int result = MySqlHelper.ExecuteNonQuery(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (result > 0)
            {
                var obj = new
                {
                    status = "success",
                    val = 1,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            else
            {
                var obj = new
                {
                    status = "fail",
                    val = 0,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        public object ConstructSuccessObject()
        {
            var obj = new
            {
                status = "success",
                val = 1,
            };
            return obj;
        }
        public object ConstructReturnObject(string status, int val)
        {
            var obj = new
            {
                status = status,
                val = val,
            };
            return obj;
        }

        private void getuserinfobyweixinid(HttpContext context)
        {
            string tousername = QueryString.GetQuery(context, "tousername");
            var sql = string.Format(@"select * from wx_user where Tousername='{0}'", tousername);
            var ds = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                var row = ds.Tables[0].Rows[0];
                var obj = new
                {
                    status = "success",
                    val = 1,
                    wx_user = new wx_user()
                    {
                        id = row["id"].ToString(),
                        tousername = row["tousername"].ToString(),
                        datetime = row["datetime"].ToString(),
                        user_id = row["user_id"].ToString(),
                        mobile = row["mobile"].ToString(),
                        username = row["username"].ToString(),
                        sex = row["sex"].ToString()
                    }
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            else
            {
                var obj = new
                {
                    status = "fail",
                    val = 0,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        private void updateshoujibyweixinid(HttpContext context)
        {
            string tousername = QueryString.GetQuery(context, "tousername");
            string mobile = QueryString.GetQuery(context, "mobile");
            string username = QueryString.GetQuery(context, "username");
            var sql = string.Format(@"update wx_user set mobile='{0}',username='{2}' where Tousername='{1}'", mobile, tousername,username);
            int ret = MySqlHelper.ExecuteNonQuery(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (ret > 0)
            {
                var obj = new
                {
                    status = "success",
                    val = 1
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
            else
            {
                var obj = new
                {
                    status = "fail",
                    val = 0,
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }


        //下面两个方法是 获取这个优惠券的详细信息 包括第一个部分 优惠券的信息和商家信息， 第二部分 优惠券在coupon表中的所有记录
        private void getsecretofteam_part1(HttpContext context)
        {
            string team_id = QueryString.GetQuery(context, "team_id");
            var sql = string.Format(@"select t.image, t.title,t.summary,t.team_price,p.mobile,p.address,p.phone from team t,partner p where t.partner_id=p.id and t.id={0}", team_id);
            var ds = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                var row = ds.Tables[0].Rows[0];
                var obj = new
                {
                    status = "success",
                    val = 1,
                    ticket_details = new
                    {
                        title = row["title"].ToString(),
                        summary = row["summary"].ToString(),
                        team_price = row["team_price"].ToString(),
                        address = row["address"].ToString(),
                        mobile = row["mobile"].ToString(),
                        phone = row["phone"].ToString(),
                        image = row["image"].ToString()
                    }
                };

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        private void getsecretofteam_part2(HttpContext context)
        {
            string team_id = QueryString.GetQuery(context, "team_id");
            var sql = string.Format(@"select c.id as cid,order_id as oid,c.consume from coupon c , team t where c.team_id=t.id and team_id={0}", team_id);
            List<ticket_coupons> list = new List<ticket_coupons>();
            var ds = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, sql, null);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    var row = ds.Tables[0].Rows[i];
                    var obj = new ticket_coupons()
                    {
                        cid = row["cid"].ToString(),
                        oid = row["oid"].ToString(),
                        consume = row["consume"].ToString(),
                    };
                    list.Add(obj);
                }

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(list);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }

        T FromJsonTo<T>(string jsonString)
        {
            return JsonConvert.DeserializeObject<T>(jsonString, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
        }
        private void getwechatinfo(HttpContext context)
        {
            /*
             * 这个是测试的，下面用的是正式的!
                AppID(应用ID)
                      wx7c1cfd6821cda94e
 
                AppSecret(应用密钥)
                            2df1f0c917ab1abaf4a1e6fb836aedfa
             */
            string code = QueryString.GetQuery(context, "code");
            var appId = "wx77b38e250b03e93e";
            var secret = "9a0298a709d1822979bf1592e250ee6c";

            var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type=authorization_code";
            url = string.Format(url, appId, secret, code);


            var content = Get_Http(url, 10000);

            var json = FromJsonTo<Wechat_UserBaseInfo>(content);
            var openid = json.openid;

            var obj = new
            {
                status = "success",
                val = openid
            };

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var str = serializer.Serialize(obj);
            context.Response.ContentType = "text/json;charset=UTF-8;";
            context.Response.Write(str);

        }

        public  string Get_Http(string strUrl, int timeout)
        {
            string strResult;
            try
            {
                HttpWebRequest myReq = (HttpWebRequest)HttpWebRequest.Create(strUrl);
                myReq.Timeout = timeout;
                HttpWebResponse HttpWResp = (HttpWebResponse)myReq.GetResponse();
                Stream myStream = HttpWResp.GetResponseStream();
                StreamReader sr = new StreamReader(myStream, Encoding.Default);
                StringBuilder strBuilder = new StringBuilder();
                while (-1 != sr.Peek())
                {
                    strBuilder.Append(sr.ReadLine());
                }

                strResult = strBuilder.ToString();
            }
            catch (Exception exp)
            {
                strResult = "错误：" + exp.Message;
            }

            return strResult;
        }
        //下面的方法只是用来做测试用，正式环境不需要这样的方法
        private void updateorderstateandinsertacoupon(HttpContext context)
        {
            string order_id = QueryString.GetQuery(context, "order_id");
            var sql = string.Format(@"update `order` set state='pay',service='credit' where id={0}", order_id);
            int val1 = MySqlHelper.ExecuteNonQuery(MySqlHelper.Conn, CommandType.Text, sql, null);

            var couponId = new Random().Next().ToString().Substring(2, 5);
            var secretCode = new Random().Next().ToString().Substring(2, 5);
            sql = string.Format(@"insert into coupon(id,order_id,secret,consume) values('{0}',{1},'{2}','N')
", couponId, order_id, secretCode);
            int val2 = MySqlHelper.ExecuteNonQuery(MySqlHelper.Conn, CommandType.Text, sql, null);

            if (val1 * val2 > 0)
            {
                var obj = new
                       {
                           status = "success",
                           val = 1
                       };
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                var str = serializer.Serialize(obj);
                context.Response.ContentType = "text/json;charset=UTF-8;";
                context.Response.Write(str);
            }
        }
        private void Test1(HttpContext context)
        {
            //string schoolId = "1";
            // string classCode = "GM8526";
            string a = QueryString.GetQuery(context, "a");

            var datasource = MySqlHelper.GetDataSet(MySqlHelper.Conn, CommandType.Text, "select * from bank", null).Tables[0].DefaultView;



            //string appId = System.Configuration.ConfigurationManager.AppSettings["V5AppId"];
            //Dictionary<string, string> param = new Dictionary<string, string>();
            //param.Add("method", "getteacheravgscore");
            //param.Add("appid", appId.ToString());
            //param.Add("schoolid", schoolId);
            //param.Add("classcode", classCode);
            //string sign = "";//ApiUtils.GetSign(param);
            //param.Add("sign", sign);

            //var data = X3.WebUtilX3.DoPost(ConfigurationManager.AppSettings["ClassScoreUrl"].ToString(), param);
            //context.Response.ContentType = "text/json;charset=GB2312;";
            ////context.Response.ContentType = "text/json;charset=UTF-8;";
            //context.Response.Write(data);
            //return;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
