CREATE TABLE `group` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_name_unique` ON `group` (`name`);--> statement-breakpoint
CREATE TABLE `link` (
	`createdAt` integer NOT NULL,
	`shortcode` text PRIMARY KEY NOT NULL,
	`destination` text NOT NULL,
	`group` text,
	`creator` text NOT NULL,
	FOREIGN KEY (`group`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`creator`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`token` text,
	`scope` text NOT NULL
);
