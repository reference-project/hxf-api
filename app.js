// 引入模块
const express=require("express");
var app=express();
app.use(express.static("public"));
app.listen(3000);
const pool=require("./pool");
const cors=require("cors");
const bodyParser = require('body-parser');
const session=require('express-session');
app.use(session({
  secret:"128位随机字符串",   
  resave:false,              
  saveUninitialized:true,    
  cookie:{                   
    maxAge:1000*60*60*24     
  }
}));
app.use(cors({
  origin:["http://127.0.0.1:8080","http://localhost:8080"],
  credentials:true
}));
// 首页轮播图
app.get("/getImages",(req,res)=>{
  var rows=[
    {id:1,img_url:"http://127.0.0.1:3000/img/active_1227.png"},
    {id:2,img_url:"http://127.0.0.1:3000/img/bg.png"},
    {id:3,img_url:"http://127.0.0.1:3000/img/part2_picture2.png"},
  ];
  res.send(rows);
});
// 首页底部大图
app.get("/getImage",(req,res)=>{
	var rows=[
		{img_url:"http://127.0.0.1:3000/img/banner.png"}
	];
	res.send(rows);
});
// 商品列表页轮播图
app.get("/getIma",(req,res)=>{
  var rows=[
    {id:1,img_url:"http://127.0.0.1:3000/img/active_1227.png"},
    {id:2,img_url:"http://127.0.0.1:3000/img/part2_picture2.png"},
  ];
  res.send(rows);
});
// 商品列表
app.get("/getGoodsList",(req,res)=>{
  // 参数
  var pno=req.query.pno;
  var pageSize=req.query.pageSize;
  // 默认值
  if(!pno){ pno=1;}
  if(!pageSize){ pageSize=10;}
  // 验证正则表达式
  var reg=/^[0-9]{1,}$/;
  if(!reg.test(pno)){
    res.send({code:-1,msg:"页码格式不正确"});
    return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  // 查询总页数
  var sql1="SELECT count(id) as c FROM luckin_product";
  var progress=0;
  obj={code:1};
  pool.query(sql1,(err,result)=>{
    if(err) {throw err};
    var pageCount=Math.ceil(result[0].c/pageSize);
    obj.pageCount=pageCount;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  });
  // 查询当前页
  var sql2="SELECT id,name,ename,img_url,price FROM luckin_product LIMIT ?,?"
  var offset=parseInt((pno-1)*pageSize);
  pageSize=parseInt(pageSize);
  pool.query(sql2,[offset,pageSize],(err,result)=>{
    if(err){ throw err;}
    obj.data=result;
    progress+=50;
    if(progress==100){
      res.send(obj)
    }
  })
});
// 商品详细页
app.get("/getDetail",(req,res)=>{
  var pid=parseInt(req.query.id);
  var sql="SELECT id,name,ename,img_url,price,title,matter FROM luckin_product WHERE id=?";
  pool.query(sql,[pid],(err,result)=>{
    if(err){ throw err;}
    res.send({code:1,data:result[0]});
  })
});
// 用户名验证
app.get("/existsName",(req,res)=>{
  var name=req.query.name;
  var sql="SELECT count(id) as c FROM luckin_login WHERE name=?";
  pool.query(sql,[name],(err,result)=>{
    if(err){ throw err;}
    if(result[0].c>0){
      res.send({code:-1,msg:"该用户名已存在"});
    }else{
      res.send({code:1,msg:"欢迎使用"});
    }
  })
});
// 用户注册
app.get("/register",(req,res)=>{
   var name = req.query.name;
   var pwd = req.query.pwd;
   var phone=req.query.phone;
   var email=req.query.email;
   var reg = /^[a-z0-9_]{6,16}$/i;
   if(!reg.test(name)){
     res.send({code:-1,msg:"用户名格式不正确"});
     return;
   }
   var sql = "INSERT INTO luckin_login VALUES(null,?,md5(?),?,?)";
   pool.query(sql,[name,pwd,phone,email],(err,result)=>{
          if(err)throw err;
          if(result.affectedRows>0){
            res.send({code:1,msg:"注册成功"})
          }else{
            res.send({code:-1,msg:"注册失败"});
          }
   })
});
//用户登录
app.get("/login",(req,res)=>{
  var name=req.query.name;
  var pwd=req.query.pwd;
  var sql="SELECT count(id) as c,id FROM luckin_login WHERE name=? AND pwd=md5(?)";
  pool.query(sql,[name,pwd],(err,result)=>{
    if(err){ throw err;}
    var c=result[0].c;
    if(c==1){
      req.session.uid=result[0].id;
      // console.log(req.session.uid);
      res.send({code:1,msg:"登陆成功"});
    }else{
      res.send({code:-1,msg:"用户或密码不正确"});
    }
  })
})
//判断登录状态
app.get("/isLogin",(req,res)=>{
  var uid=req.session.uid;
  var sql="SELECT name FROM luckin_login WHERE id=?";
  pool.query(sql,[uid],(err,result)=>{
    if(err){ throw err;}
    if(result.length>0){
      res.send({code:1,data:result[0]});
    }else{
      res.send({code:-1})
    }
  })
})
//退出登录
app.get("/logOut",(req,res)=>{
  req.session.uid=null;
  res.send({code:1,msg:"退出成功"});
});
// 添加商品
app.get("/shopAdd",(req,res)=>{
  // var uid   = parseInt(req.query.uid);
  var uid=req.session.uid;
  var pid   = parseInt(req.query.pid);
  var price = parseFloat(req.query.price);
  var count = parseInt(req.query.count);
  var s=parseInt(req.query.sizeIndex);
  var size="";
    if(s==0){
      size="大";
    }else if(s==1){
      size="中";
    }
  var o=parseInt(req.query.ocIndex);
  var oc="";
  if(o==0){
    oc="热";
  }else if(o==1){
    oc="冰";
  }
  var su=parseInt(req.query.guIndex);
  var sugar="";
  if(su==0){
    sugar="无糖";
  }else if(su==1){
    sugar="半份糖";
  }else if(su==2){
    sugar="单糖";
  }
  var isChecked=true;
  console.log(uid,pid,price,count,size,oc,sugar,isChecked)
  var sql="INSERT INTO `luckin_cart`(`id`, `uid`, `pid`, `price`, `count`, `size`, `oc`, `sugar`,`isChecked`) VALUES (null,?,?,?,?,?,?,?,?)";
  pool.query(sql,[uid,pid,price,count,size,oc,sugar,isChecked],(err,result)=>{
    if(err){ throw err;}
    if(result.affectedRows>0){
      res.send({code:1,msg:"添加成功"});
    }else{
      res.send({code:-1,msg:"添加失败"});
    }
  })
});
// 查询购物车数据
app.get("/getCartList",(req,res)=>{
  var uid = req.session.uid;
  var sql =" SELECT p.name,c.count,c.price,c.id,c.size,c.oc,c.sugar,c.isChecked FROM luckin_product p,luckin_cart c WHERE p.id = c.pid AND c.uid = ?";
  pool.query(sql,[uid],(err,result)=>{
      if(err)throw err;
      res.send({code:1,data:result});
  }) 
});
// 同步购物车数据
app.get("/updateCart",(req,res)=>{
  var id=parseInt(req.query.id);
  var count=parseInt(req.query.count);
  var sql="UPDATE luckin_cart SET count=? WHERE id=?";
  pool.query(sql,[count,id],(err,result)=>{
    if(err){ throw err;}
    if(result.affectedRows>0){
      res.send({code:1,msg:"更新成功"});
    }else{
      res.send({code:-1,msg:"更新失败"});
    }
  })
});
app.get("/deleteCart",(req,res)=>{
  var id=parseInt(req.query.id);
  var sql="DELETE FROM `luckin_cart` WHERE id=?";
  pool.query(sql,[id],(err,result)=>{
    if(err){ throw err; }
    if(result.affectedRows>0){
      res.send({code:1,msg:"更新成功"});
    }else{
      res.send({code:-1,msg:"更新失败"});
    }
  })
})
