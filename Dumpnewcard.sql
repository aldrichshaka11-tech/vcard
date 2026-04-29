-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: smartcard
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_logs`
--

DROP TABLE IF EXISTS `admin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_user_id` int DEFAULT NULL,
  `details` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `target_user_id` (`target_user_id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `admin_logs_ibfk_2` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_logs`
--

LOCK TABLES `admin_logs` WRITE;
/*!40000 ALTER TABLE `admin_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_leads`
--

DROP TABLE IF EXISTS `card_leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_leads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `lead_name` varchar(120) NOT NULL,
  `lead_email` varchar(190) DEFAULT NULL,
  `lead_phone` varchar(30) DEFAULT NULL,
  `lead_note` text,
  `source` varchar(40) NOT NULL DEFAULT 'public_card',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_card_id` (`card_id`),
  CONSTRAINT `fk_card_leads_card` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_leads`
--

LOCK TABLES `card_leads` WRITE;
/*!40000 ALTER TABLE `card_leads` DISABLE KEYS */;
INSERT INTO `card_leads` VALUES (3,4,'aa','jegusselvaraj@gmail.com','7894562130','dfsd','public_card','2026-04-22 01:52:55'),(4,4,'fwsf','bkgh@gmail.com','78964513','scs','public_card','2026-04-22 01:53:46'),(5,4,'aaag','jegusselvaraj@gmail.com','5654','jgjg','public_card','2026-04-22 02:08:27'),(6,4,'fbf','jegusselvaraj@gmail.com','78756464589','dfdsfg','public_card','2026-04-22 02:14:18'),(7,4,'khh','jegusselvaraj@gmail.com','3646416','1jhfjl','public_card','2026-04-22 02:16:55'),(8,4,'HJRH','jegusselvaraj@gmail.com','567+7+8','RFTYDS','public_card','2026-04-22 02:20:28'),(9,4,'XVZD','jegusselvaraj@gmail.com','5634345','GHJNFHJ','public_card','2026-04-22 02:21:08'),(10,4,'dgs',NULL,'646467+67','dfgdd','public_card','2026-04-22 02:26:43'),(11,4,'kkbljk','jegusselvaraj@gmail.com','8687786','kjkgkg','public_card','2026-04-22 02:28:31');
/*!40000 ALTER TABLE `card_leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_links`
--

DROP TABLE IF EXISTS `card_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_card_id` (`card_id`),
  CONSTRAINT `card_links_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=277 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_links`
--

LOCK TABLES `card_links` WRITE;
/*!40000 ALTER TABLE `card_links` DISABLE KEYS */;
INSERT INTO `card_links` VALUES (91,4,'phone','phone','9750750519',0),(92,4,'website','website','https://www.kairatechnologies.in/',1),(93,4,'meta_name','Display Name','Albin Jegus',2),(94,4,'meta_email','Display Email','jegusselvaraj@gmail.com',3),(95,4,'meta_company','Display Company','kaira',4),(96,4,'meta_themeColor','Theme Color','#ca8a04',5),(97,4,'meta_profile','Profile Photo','photo_69e8200e04ab75.98633646.png',6),(98,4,'meta_cover','Cover Photo','photo_69e8200e07ea60.37901625.png',7),(99,4,'meta_logo','Company Logo','photo_69e8200e0c00b1.38624774.png',8),(100,5,'phone','phone','975124863',0),(101,5,'website','website','https://www.kairatechnologies.in/',1),(102,5,'meta_name','Display Name','Arun',2),(103,5,'meta_company','Display Company','kaira',3),(104,5,'meta_department','Department','Ece',4),(105,5,'meta_address','Address','kovipatti',5),(106,5,'meta_ctaLabel','CTA Label','Save Contact',6),(107,5,'meta_themeColor','Theme Color','#22c55e',7),(108,5,'meta_vBg_preset','Virtual BG Preset','gradient',8),(109,5,'meta_profile','Profile Photo','photo_69e90e52286843.51329982.png',9),(110,5,'meta_cover','Cover Photo','photo_69e90e522e0120.66154705.png',10),(111,5,'meta_logo','Company Logo','photo_69e90e52317b00.91898152.png',11),(264,6,'phone','phone','9750750519',0),(265,6,'website','website','https://www.kairatechnologies.in/',1),(266,6,'meta_name','Display Name','albin',2),(267,6,'meta_email','Display Email','albin.kairatech@gmail.com',3),(268,6,'meta_company','Display Company','KAIRA',4),(269,6,'meta_department','Department','IT',5),(270,6,'meta_ctaLabel','CTA Label','Save Contact',6),(271,6,'meta_themeColor','Theme Color','#3b82f6',7),(272,6,'meta_vBg_preset','Virtual BG Preset','linear-gradient(135deg,#667eea,#764ba2)',8),(273,6,'meta_vBg_custom','Virtual BG Custom','photo_69ebd7e69c0761.67401354.jpg',9),(274,6,'meta_profile','Profile Photo','photo_69ebd7fce287c3.53594029.png',10),(275,6,'meta_cover','Cover Photo','photo_69ebd7f7e88183.11589338.png',11),(276,6,'meta_logo','Company Logo','photo_69ebd80324b2a9.30661323.png',12);
/*!40000 ALTER TABLE `card_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_views`
--

DROP TABLE IF EXISTS `card_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_views` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_id` int NOT NULL,
  `visitor_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_card_id` (`card_id`),
  KEY `idx_viewed_at` (`viewed_at`),
  CONSTRAINT `card_views_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_views`
--

LOCK TABLES `card_views` WRITE;
/*!40000 ALTER TABLE `card_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `card_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'default',
  `is_active` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (2,2,'','','','','default',1,'2026-04-21 22:55:13','2026-04-21 22:55:13'),(4,1,'dev','kaira','','photo_69e8200e04ab75.98633646.png','#ca8a04',1,'2026-04-22 01:10:38','2026-04-22 02:07:43'),(5,4,'developer','kaira','Thanks','photo_69e90e52286843.51329982.png','#22c55e',1,'2026-04-22 18:07:14','2026-04-22 18:07:14'),(6,5,'dev','KAIRA','We are top digital Marking Company in south India','photo_69ebd7fce287c3.53594029.png','#3b82f6',1,'2026-04-24 18:41:36','2026-04-24 20:59:09');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feature_limits`
--

DROP TABLE IF EXISTS `feature_limits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feature_limits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_type` enum('free','premium') NOT NULL,
  `feature_name` varchar(50) NOT NULL,
  `limit_value` int DEFAULT NULL,
  `is_enabled` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_plan_feature` (`plan_type`,`feature_name`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feature_limits`
--

LOCK TABLES `feature_limits` WRITE;
/*!40000 ALTER TABLE `feature_limits` DISABLE KEYS */;
INSERT INTO `feature_limits` VALUES (1,'free','max_cards',1,1),(2,'free','max_social_links',5,1),(3,'free','max_theme_colors',5,1),(4,'free','cover_photo',0,0),(5,'free','company_logo',0,0),(6,'free','virtual_background',0,0),(7,'free','custom_color_picker',0,0),(8,'free','advanced_analytics',0,0),(9,'free','custom_fields',0,0),(10,'free','lead_capture',0,0),(11,'premium','max_cards',999,1),(12,'premium','max_social_links',999,1),(13,'premium','max_theme_colors',999,1),(14,'premium','cover_photo',1,1),(15,'premium','company_logo',1,1),(16,'premium','virtual_background',1,1),(17,'premium','custom_color_picker',1,1),(18,'premium','advanced_analytics',1,1),(19,'premium','custom_fields',1,1),(20,'premium','lead_capture',1,1),(21,'free','custom_colors',0,0),(22,'free','theme_colors',0,0),(23,'free','social_links',3,1),(24,'premium','custom_colors',-1,1),(25,'premium','theme_colors',-1,1),(26,'premium','social_links',-1,1);
/*!40000 ALTER TABLE `feature_limits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_stats`
--

DROP TABLE IF EXISTS `platform_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `total_users` int DEFAULT '0',
  `free_users` int DEFAULT '0',
  `premium_users` int DEFAULT '0',
  `total_cards` int DEFAULT '0',
  `total_views` int DEFAULT '0',
  `total_leads` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_stats`
--

LOCK TABLES `platform_stats` WRITE;
/*!40000 ALTER TABLE `platform_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `platform_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `premium_requests`
--

DROP TABLE IF EXISTS `premium_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `premium_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `message` text,
  `requested_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `processed_at` datetime DEFAULT NULL,
  `processed_by` int DEFAULT NULL,
  `admin_note` text,
  PRIMARY KEY (`id`),
  KEY `processed_by` (`processed_by`),
  KEY `idx_status` (`status`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `premium_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `premium_requests_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `premium_requests`
--

LOCK TABLES `premium_requests` WRITE;
/*!40000 ALTER TABLE `premium_requests` DISABLE KEYS */;
INSERT INTO `premium_requests` VALUES (1,5,'approved','hi i need premium','2026-04-24 15:47:50','2026-04-24 17:06:40',6,NULL);
/*!40000 ALTER TABLE `premium_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('free','premium','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'free',
  `plan_status` enum('pending','active','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `premium_requested_at` datetime DEFAULT NULL,
  `premium_approved_at` datetime DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_email` (`email`),
  KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','albin@gmail.com','free',NULL,NULL,NULL,NULL,1,'$2y$10$clX0ZxxzsvxTMyv3RiX1yeug/V4aPUdwe1oNKFesKSWzJ/catwTwq','test','2026-04-21 22:03:36'),(2,'albin','jegusselvaraj@gmail.com','free',NULL,NULL,NULL,NULL,1,'$2y$10$82kDorIYcmZGqEFQHVN1G.BmZFFs.IqBEfuni.B4LxNcmIEpL0Il.','albin','2026-04-21 22:54:26'),(3,'arun','arun@gmail.com','free',NULL,NULL,NULL,NULL,1,'$2y$10$UpnIR/dm2mB/wG5zHpbhWOfX6jn2Ctr0I46NAk3m4kIy4OkulF50y','arun','2026-04-21 23:31:12'),(4,'aswin','aswin@gmail.com','free',NULL,NULL,NULL,NULL,1,'$2y$10$DmrrkNDv/7RlGAgVeWF4CuTMgUUgwlvUQF/a0udKjC34/eSCwz.4e','aswin','2026-04-22 18:06:46'),(5,'kaira','kaira@gmail.com','premium','active','2026-04-24 15:47:50',NULL,NULL,1,'$2y$10$iioKCVA5YoSfp9uDrQtFxOtXAe7Y.GipYMlXtrtQxac0FXqWdPnL2','kaira','2026-04-24 18:39:20'),(6,'admin','admin@smartcard.com','admin','active',NULL,NULL,NULL,1,'$2y$10$v6UH7xL/4VyyQIgMv4LkCuBzcGaafd2vQ6Oz1z4d0uGPO5EbYWkYu','admin','2026-04-24 22:12:28'),(7,'pradeeba','pradeeba@gmail.com','free',NULL,NULL,NULL,NULL,1,'$2y$10$vncLBgCz5UzaBJy.ioIsO.UEHmxTDe2mVJlSd6ThQRixTwPGb3FjS','pradeeba','2026-04-25 00:21:51'),(8,'arun','arun2@gmail.com','free',NULL,NULL,NULL,NULL,1,'$2y$10$odkRImSiaHJ60UYpLnLLxe/qCez/g6buUxR.sr52Qee99CcjEQgyG','arun-1','2026-04-25 00:31:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 19:08:08
