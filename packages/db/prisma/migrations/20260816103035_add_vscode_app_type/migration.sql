/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instanceId]` on the table `Window` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ApplicationType" ADD VALUE 'VSCODE';

-- AlterTable
ALTER TABLE "ApplicationInstance" ADD COLUMN     "port" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "googleId" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "ApplicationInstance_applicationId_idx" ON "ApplicationInstance"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationInstance_workspaceId_idx" ON "ApplicationInstance"("workspaceId");

-- CreateIndex
CREATE INDEX "Deployment_instanceId_idx" ON "Deployment"("instanceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Window_instanceId_key" ON "Window"("instanceId");

-- CreateIndex
CREATE INDEX "Window_workspaceId_idx" ON "Window"("workspaceId");

-- CreateIndex
CREATE INDEX "Window_applicationId_idx" ON "Window"("applicationId");

-- CreateIndex
CREATE INDEX "Workspace_userId_idx" ON "Workspace"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Window" ADD CONSTRAINT "Window_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "ApplicationInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
