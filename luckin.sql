SET NAMES UTF8;
DROP DATABASE IF EXISTS luckin;
CREATE DATABASE luckin CHARSET=UTF8;
USE luckin;
-- 商品列表
CREATE TABLE luckin_product(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  ename VARCHAR(255),
  img_url VARCHAR(255),
  price DECIMAL(10,2),
  title VARCHAR(255),
  matter VARCHAR(255)
);
INSERT INTO luckin_product VALUES(1,'拿铁','Latte','http://127.0.0.1:3000/img/QJ6210124313.jpg',24,'经典意式奶咖。浓缩咖啡与香醇牛奶融合，口感圆润。','浓缩咖啡，牛奶');
INSERT INTO luckin_product VALUES(2,'榛果拿铁','Hazeinut Latte','http://127.0.0.1:3000/img/QJ6210124313.jpg',27,'榛果爱好者的选择！香甜榛果风味与咖啡牛奶融合，诠释另一种新鲜风味','浓缩咖啡，牛奶，榛子风味糖浆。');
INSERT INTO luckin_product VALUES(3,'香草拿铁','Vanilla Latte','http://127.0.0.1:3000/img/QJ6210124313.jpg',27,'经典意式奶咖。浓缩咖啡与香醇牛奶融合，口感圆润。','浓缩咖啡，牛奶');
INSERT INTO luckin_product VALUES(4,'拿铁','Latte','http://127.0.0.1:3000/img/QJ6210124313.jpg',27,'经典意式奶咖。浓缩咖啡与香醇牛奶融合，口感圆润。','浓缩咖啡，牛奶');
INSERT INTO luckin_product VALUES(5,'拿铁','Latte','http://127.0.0.1:3000/img/QJ6210124313.jpg',27,'经典意式奶咖。浓缩咖啡与香醇牛奶融合，口感圆润。','浓缩咖啡，牛奶');
INSERT INTO luckin_product VALUES(6,'拿铁','Latte','http://127.0.0.1:3000/img/QJ6210124313.jpg',27,'经典意式奶咖。浓缩咖啡与香醇牛奶融合，口感圆润。','浓缩咖啡，牛奶');
-- 用户列表
CREATE TABLE luckin_login(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(25),
  pwd  VARCHAR(32),
  phone VARCHAR(11),
  email VARCHAR(64)
);
INSERT INTO luckin_login VALUES(null,'tom',md5('123456'),'13712345678','545454@sina.com');
INSERT INTO luckin_login VALUES(null,'jerry',md5('123456'),'13712345678','545454@sina.com');
INSERT INTO luckin_login VALUES(null,'jiansheng',md5('123456'),'13712345678','545454@sina.com');
-- 购物车
CREATE TABLE luckin_cart(
  id INT PRIMARY KEY AUTO_INCREMENT,
  uid INT,
  pid INT,
  price DECIMAL(10,2),
  count INT,
  size VARCHAR(5),
  oc VARCHAR(5),
  sugar VARCHAR(10),
  isChecked BOOL
);
INSERT INTO luckin_cart VALUES(null,3,1,24,1,"大","热","单糖",1);
INSERT INTO luckin_cart VALUES(null,3,2,27,2,"中","冰","无糖",1);