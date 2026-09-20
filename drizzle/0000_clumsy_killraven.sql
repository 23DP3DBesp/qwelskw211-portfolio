CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`service` text NOT NULL,
	`description` text NOT NULL,
	`contact` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `owner` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `owner_user_id_unique` ON `owner` (`user_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_projects_status_position` ON `projects` (`status`,`position`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);
