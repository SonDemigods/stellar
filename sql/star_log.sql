/*
 Navicat Premium Dump SQL

 Source Server         : docker_PostgreSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 150014 (150014)
 Source Host           : localhost:5432
 Source Catalog        : galaxy
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150014 (150014)
 File Encoding         : 65001

 Date: 29/10/2025 09:39:06
*/


-- ----------------------------
-- Table structure for star_log
-- ----------------------------
DROP TABLE IF EXISTS "public"."star_log";
CREATE TABLE "public"."star_log" (
  "id" uuid NOT NULL,
  "level" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "meta" jsonb NOT NULL,
  "create_time" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  "create_user_id" uuid
)
;
COMMENT ON COLUMN "public"."star_log"."id" IS '主键';
COMMENT ON COLUMN "public"."star_log"."level" IS '日志级别';
COMMENT ON COLUMN "public"."star_log"."message" IS '日志信息';
COMMENT ON COLUMN "public"."star_log"."meta" IS '日志元信息';
COMMENT ON COLUMN "public"."star_log"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."star_log"."create_user_id" IS '创建人';
COMMENT ON TABLE "public"."star_log" IS '日志表';

-- ----------------------------
-- Primary Key structure for table star_log
-- ----------------------------
ALTER TABLE "public"."star_log" ADD CONSTRAINT "star_log_pkey" PRIMARY KEY ("id");
