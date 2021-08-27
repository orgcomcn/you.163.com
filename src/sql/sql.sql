/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.5.60 : Database - you163
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`you163` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `you163`;

/*Table structure for table `carts` */

DROP TABLE IF EXISTS `carts`;

CREATE TABLE `carts` (
  `cId` int(11) NOT NULL AUTO_INCREMENT COMMENT '购物车id',
  `pId` int(11) NOT NULL COMMENT '产品id',
  `uId` int(11) NOT NULL COMMENT '购买用户id',
  `pImg` varchar(64) NOT NULL COMMENT '产品图片',
  `pName` varchar(64) NOT NULL COMMENT '产品名称',
  `pYh` varchar(64) NOT NULL COMMENT '产品优惠日期',
  `pGg` varchar(64) NOT NULL COMMENT '产品规格',
  `pPrice` float NOT NULL COMMENT '产品单价',
  `pPriceCount` float NOT NULL COMMENT '产品总价',
  `pCount` int(11) NOT NULL COMMENT '产品数量',
  `cStatus` int(1) NOT NULL DEFAULT '1' COMMENT '产品状态',
  PRIMARY KEY (`cId`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

/*Data for the table `carts` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `phone` varchar(11) NOT NULL COMMENT '用户手机号',
  `pwd` varchar(50) NOT NULL COMMENT '用户密码',
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '1启用0禁用',
  `date` varchar(32) NOT NULL COMMENT '用户注册日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `QNIQUE_PHONE` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4;

/*Data for the table `user` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
