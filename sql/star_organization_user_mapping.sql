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

 Date: 29/10/2025 09:39:34
*/


-- ----------------------------
-- Table structure for star_organization_user_mapping
-- ----------------------------
DROP TABLE IF EXISTS "public"."star_organization_user_mapping";
CREATE TABLE "public"."star_organization_user_mapping" (
  "id" uuid NOT NULL,
  "organization_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "create_time" timestamp(6),
  "create_user_id" uuid,
  "update_time" timestamp(6),
  "update_user_id" uuid,
  "delete_flag" int2 DEFAULT 0
)
;
COMMENT ON COLUMN "public"."star_organization_user_mapping"."id" IS '主键';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."organization_id" IS '组织机构id';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."user_id" IS '用户id';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."create_user_id" IS '创建人';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."update_time" IS '更新时间';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."update_user_id" IS '更新人';
COMMENT ON COLUMN "public"."star_organization_user_mapping"."delete_flag" IS '删除状态，0:未删除；1:已删除';
COMMENT ON TABLE "public"."star_organization_user_mapping" IS '组织机构用户关系表';

-- ----------------------------
-- Primary Key structure for table star_organization_user_mapping
-- ----------------------------
ALTER TABLE "public"."star_organization_user_mapping" ADD CONSTRAINT "star_organization_user_mapping_pkey" PRIMARY KEY ("id");
