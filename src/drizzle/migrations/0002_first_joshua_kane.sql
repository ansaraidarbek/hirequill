ALTER TABLE "profiles" ADD COLUMN "totalFreeGenerationsThisMonth" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "freeGenerationsMonth" date NOT NULL;