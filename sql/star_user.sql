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

 Date: 29/10/2025 09:36:48
*/


-- ----------------------------
-- Table structure for star_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."star_user";
CREATE TABLE "public"."star_user" (
  "id" uuid NOT NULL,
  "user_name" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(128) COLLATE "pg_catalog"."default" NOT NULL,
  "photo" varchar(255) COLLATE "pg_catalog"."default",
  "nickname" varchar(20) COLLATE "pg_catalog"."default",
  "phone" varchar(20) COLLATE "pg_catalog"."default",
  "id_card" varchar(20) COLLATE "pg_catalog"."default",
  "name" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "gender" int2 DEFAULT 0,
  "create_time" timestamp(6),
  "create_user_id" uuid,
  "update_time" timestamp(6),
  "update_user_id" uuid,
  "delete_flag" int2 DEFAULT 0
)
;
COMMENT ON COLUMN "public"."star_user"."id" IS '主键';
COMMENT ON COLUMN "public"."star_user"."user_name" IS '用户名';
COMMENT ON COLUMN "public"."star_user"."password" IS '密码';
COMMENT ON COLUMN "public"."star_user"."photo" IS '头像';
COMMENT ON COLUMN "public"."star_user"."nickname" IS '昵称';
COMMENT ON COLUMN "public"."star_user"."phone" IS '手机号';
COMMENT ON COLUMN "public"."star_user"."id_card" IS '身份证号';
COMMENT ON COLUMN "public"."star_user"."name" IS '姓名';
COMMENT ON COLUMN "public"."star_user"."gender" IS '性别，0:未知；1:男；2:女';
COMMENT ON COLUMN "public"."star_user"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."star_user"."create_user_id" IS '创建人';
COMMENT ON COLUMN "public"."star_user"."update_time" IS '更新时间';
COMMENT ON COLUMN "public"."star_user"."update_user_id" IS '更新人';
COMMENT ON COLUMN "public"."star_user"."delete_flag" IS '删除状态，0:未删除；1:已删除';
COMMENT ON TABLE "public"."star_user" IS '用户表';

-- ----------------------------
-- Primary Key structure for table star_user
-- ----------------------------
ALTER TABLE "public"."star_user" ADD CONSTRAINT "star_user_pkey" PRIMARY KEY ("id");
