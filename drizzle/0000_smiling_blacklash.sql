CREATE TABLE IF NOT EXISTS "threads" (
	"id" varchar(195) PRIMARY KEY NOT NULL,
	"title" text,
	"messages" jsonb,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
