-- AlterTable
ALTER TABLE `Ingredient` ADD COLUMN `unit` ENUM('GRAMS', 'DEFAULT', 'MILLILITERS') NOT NULL DEFAULT 'DEFAULT';