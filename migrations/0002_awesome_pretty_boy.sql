PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_link` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`shortcode` text NOT NULL,
	`destination` text NOT NULL,
	`group` text,
	FOREIGN KEY (`group`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_link`("id", "createdAt", "shortcode", "destination", "group") SELECT "id", "createdAt", "shortcode", "destination", "group" FROM `link`;--> statement-breakpoint
DROP TABLE `link`;--> statement-breakpoint
ALTER TABLE `__new_link` RENAME TO `link`;--> statement-breakpoint
PRAGMA foreign_keys=ON;