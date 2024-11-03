CREATE TABLE `group` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_name_unique` ON `group` (`name`);--> statement-breakpoint
CREATE TABLE `link` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`shortcode` text NOT NULL,
	`destination` text NOT NULL,
	`group` text NOT NULL,
	FOREIGN KEY (`group`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action
);
