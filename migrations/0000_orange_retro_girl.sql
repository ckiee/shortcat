CREATE TABLE `role` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text,
	`createdAt` integer NOT NULL,
	`scope` text NOT NULL
);
