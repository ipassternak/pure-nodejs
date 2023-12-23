-- CreateEnum
CREATE TYPE "user_system_role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "participant_role" AS ENUM ('author', 'assignee', 'reviewer', 'participant');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR(30) NOT NULL,
    "password" VARCHAR(400) NOT NULL,
    "email" VARCHAR(40),
    "phone" VARCHAR(20),
    "avatar" VARCHAR(200),
    "system_role" "user_system_role" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "expires_at" TIMESTAMP,
    "state" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(240) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sheduled_at" TIMESTAMP NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "user_id" INTEGER NOT NULL,
    "message_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "status" "project_status" NOT NULL DEFAULT 'inactive',
    "start_date" TIMESTAMP NOT NULL,
    "end_date" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "logo" VARCHAR(200),
    "description" VARCHAR(4000),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "rule" VARCHAR(45) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grants" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "project_id" INTEGER NOT NULL,
    "description" VARCHAR(500),
    "deadline" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "role" "participant_role" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "color" VARCHAR(15) NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "label_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(200) NOT NULL,
    "format" VARCHAR(15) NOT NULL,
    "task_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "replied_to" INTEGER,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "content" VARCHAR(1000) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_user_id_message_id_key" ON "notifications"("user_id", "message_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_title_key" ON "projects"("title");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_rule_key" ON "permissions"("rule");

-- CreateIndex
CREATE UNIQUE INDEX "grants_role_id_permission_id_key" ON "grants"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_project_id_key" ON "members"("user_id", "project_id");

-- CreateIndex
CREATE INDEX "tasks_project_id_idx" ON "tasks"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_member_id_task_id_key" ON "participants"("member_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "labels_name_key" ON "labels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_label_id_task_id_key" ON "tags"("label_id", "task_id");

-- CreateIndex
CREATE INDEX "attachments_task_id_idx" ON "attachments"("task_id");

-- CreateIndex
CREATE INDEX "reviews_task_id_idx" ON "reviews"("task_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_replied_to_fkey" FOREIGN KEY ("replied_to") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;