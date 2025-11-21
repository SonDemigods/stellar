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

 Date: 29/10/2025 09:39:21
*/


-- ----------------------------
-- Table structure for star_organization
-- ----------------------------
DROP TABLE IF EXISTS "public"."star_organization";
CREATE TABLE "public"."star_organization" (
  "id" uuid NOT NULL,
  "parent_id" uuid,
  "organization_code" varchar(100) COLLATE "pg_catalog"."default",
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "create_time" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  "create_user_id" uuid,
  "update_time" timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  "update_user_id" uuid,
  "delete_flag" int2 NOT NULL DEFAULT 0
)
;
COMMENT ON COLUMN "public"."star_organization"."id" IS '主键';
COMMENT ON COLUMN "public"."star_organization"."parent_id" IS '父节点主键';
COMMENT ON COLUMN "public"."star_organization"."organization_code" IS '组织机构编码';
COMMENT ON COLUMN "public"."star_organization"."name" IS '组织机构名称';
COMMENT ON COLUMN "public"."star_organization"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."star_organization"."create_user_id" IS '创建人';
COMMENT ON COLUMN "public"."star_organization"."update_time" IS '更新时间';
COMMENT ON COLUMN "public"."star_organization"."update_user_id" IS '更新人';
COMMENT ON COLUMN "public"."star_organization"."delete_flag" IS '删除状态，0:未删除；1:已删除';
COMMENT ON TABLE "public"."star_organization" IS '组织机构表';

-- ----------------------------
-- Primary Key structure for table star_organization
-- ----------------------------
ALTER TABLE "public"."star_organization" ADD CONSTRAINT "star_organization_pkey" PRIMARY KEY ("id");
