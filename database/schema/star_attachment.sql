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

 Date: 11/02/2026 14:19:47
*/


-- ----------------------------
-- Table structure for star_attachment
-- ----------------------------
DROP TABLE IF EXISTS "public"."star_attachment";
CREATE TABLE "public"."star_attachment" (
  "id" uuid NOT NULL,
  "original_filename" varchar(255) COLLATE "pg_catalog"."default",
  "file_size" int8,
  "file_type" varchar(100) COLLATE "pg_catalog"."default",
  "storage_path" varchar(500) COLLATE "pg_catalog"."default",
  "bucket_name" varchar(100) COLLATE "pg_catalog"."default",
  "md5" varchar(32) COLLATE "pg_catalog"."default",
  "access_permission" int2,
  "create_time" timestamp(6),
  "create_user_id" uuid,
  "update_time" timestamp(6),
  "update_user_id" uuid,
  "delete_flag" int2 DEFAULT 0
)
;
COMMENT ON COLUMN "public"."star_attachment"."id" IS '主键';
COMMENT ON COLUMN "public"."star_attachment"."original_filename" IS '原文件名';
COMMENT ON COLUMN "public"."star_attachment"."file_size" IS '文件大小';
COMMENT ON COLUMN "public"."star_attachment"."file_type" IS '文件类型';
COMMENT ON COLUMN "public"."star_attachment"."storage_path" IS '文件路径';
COMMENT ON COLUMN "public"."star_attachment"."bucket_name" IS '存储桶名称';
COMMENT ON COLUMN "public"."star_attachment"."md5" IS '文件校验码';
COMMENT ON COLUMN "public"."star_attachment"."access_permission" IS '访问权限，0:公开；1:私有';
COMMENT ON COLUMN "public"."star_attachment"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."star_attachment"."create_user_id" IS '创建人';
COMMENT ON COLUMN "public"."star_attachment"."update_time" IS '更新时间';
COMMENT ON COLUMN "public"."star_attachment"."update_user_id" IS '更新人';
COMMENT ON COLUMN "public"."star_attachment"."delete_flag" IS '删除状态，0:未删除；1:已删除';
COMMENT ON TABLE "public"."star_attachment" IS '附件表';

-- ----------------------------
-- Primary Key structure for table star_attachment
-- ----------------------------
ALTER TABLE "public"."star_attachment" ADD CONSTRAINT "star_user_copy1_pkey" PRIMARY KEY ("id");
