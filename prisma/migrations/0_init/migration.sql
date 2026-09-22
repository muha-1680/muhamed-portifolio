-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "profilePhoto" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorTheme" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "primary" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cv" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pdfUrl" TEXT NOT NULL,
    "profile" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tech" TEXT[],

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "responsibilities" TEXT[],

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_stats" (
    "id" SERIAL NOT NULL,
    "cvId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "cv_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_education" (
    "id" SERIAL NOT NULL,
    "cvId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "cv_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_languages" (
    "id" SERIAL NOT NULL,
    "cvId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "cv_languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_order_key" ON "projects"("order");

-- CreateIndex
CREATE UNIQUE INDEX "experiences_order_key" ON "experiences"("order");

-- CreateIndex
CREATE UNIQUE INDEX "skills_order_key" ON "skills"("order");

-- CreateIndex
CREATE UNIQUE INDEX "cv_stats_cvId_order_key" ON "cv_stats"("cvId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "cv_education_cvId_order_key" ON "cv_education"("cvId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "cv_languages_cvId_order_key" ON "cv_languages"("cvId", "order");

-- AddForeignKey
ALTER TABLE "cv_stats" ADD CONSTRAINT "cv_stats_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_education" ADD CONSTRAINT "cv_education_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_languages" ADD CONSTRAINT "cv_languages_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

