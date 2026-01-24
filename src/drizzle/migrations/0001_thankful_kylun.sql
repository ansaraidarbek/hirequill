ALTER TABLE "profiles" ALTER COLUMN "freeGenerationsMonth" SET DEFAULT date_trunc('month', now())::date;--> statement-breakpoint
ALTER TABLE "cvs" ADD COLUMN "fileType" varchar(255) NOT NULL;