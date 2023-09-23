-- CreateTable
CREATE TABLE `account` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(64) NOT NULL,
    `register_name` VARCHAR(32) NOT NULL,
    `display_name` VARCHAR(32) NOT NULL,
    `class` CHAR(2) NOT NULL,
    `status` CHAR(2) NOT NULL,
    `password` CHAR(64) NULL,
    `remarks` VARCHAR(1024) NULL,
    `login_datetime` CHAR(14) NULL,
    `video_connection_datetime` CHAR(14) NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `account_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file_info` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `management_id` INTEGER UNSIGNED NOT NULL,
    `sequence_number` TINYINT UNSIGNED NOT NULL,
    `class` CHAR(2) NOT NULL,
    `name` CHAR(18) NOT NULL,
    `extension` VARCHAR(10) NOT NULL,
    `is_download` BOOLEAN NOT NULL DEFAULT false,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `file_info_class_management_id_sequence_number_key`(`class`, `management_id`, `sequence_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(4000) NULL,
    `sequence_number` TINYINT UNSIGNED NOT NULL,
    `deleted_datetime` CHAR(14) NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `chat_sequence_number_key`(`sequence_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_reading_info` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `sequence_number` INTEGER UNSIGNED NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` CHAR(6) NOT NULL,
    `status` CHAR(2) NOT NULL DEFAULT '02',
    `answer_format_class` CHAR(2) NOT NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `calendar_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar_detail` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `calendar_id` INTEGER UNSIGNED NOT NULL,
    `day` CHAR(2) NOT NULL,
    `status` CHAR(2) NOT NULL DEFAULT '03',
    `title` CHAR(32) NOT NULL,
    `comment` VARCHAR(100) NULL,
    `is_ease_edit_restrictions` BOOLEAN NOT NULL DEFAULT false,
    `activity_class` CHAR(2) NOT NULL DEFAULT '01',
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `calendar_detail_calendar_id_day_key`(`calendar_id`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_request` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `calendar_detail_id` INTEGER UNSIGNED NOT NULL,
    `account_id` INTEGER UNSIGNED NOT NULL,
    `answer_class` CHAR(2) NOT NULL,
    `comment` VARCHAR(100) NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `activity_request_calendar_detail_id_account_id_key`(`calendar_detail_id`, `account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anonymous_answer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `calendar_id` INTEGER UNSIGNED NOT NULL,
    `answer_crypt_string` TEXT NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `class` CHAR(2) NOT NULL,
    `is_publish` BOOLEAN NOT NULL DEFAULT false,
    `is_list_display` BOOLEAN NOT NULL DEFAULT false,
    `title` CHAR(32) NOT NULL,
    `description` CHAR(100) NULL,
    `publish_start_datetime` CHAR(14) NULL,
    `publish_end_datetime` CHAR(14) NULL,
    `url` CHAR(64) NULL,
    `content` TEXT NULL,
    `remarks` VARCHAR(1024) NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `notice_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice_preview` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `notice_id` INTEGER UNSIGNED NOT NULL,
    `title` CHAR(32) NOT NULL,
    `description` CHAR(100) NULL,
    `content` TEXT NULL,
    `access_code` CHAR(20) NOT NULL,
    `create_account_id` INTEGER UNSIGNED NOT NULL,
    `create_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_account_id` INTEGER UNSIGNED NOT NULL,
    `update_timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat_reading_info` ADD CONSTRAINT `chat_reading_info_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar_detail` ADD CONSTRAINT `calendar_detail_calendar_id_fkey` FOREIGN KEY (`calendar_id`) REFERENCES `calendar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_request` ADD CONSTRAINT `activity_request_calendar_detail_id_fkey` FOREIGN KEY (`calendar_detail_id`) REFERENCES `calendar_detail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anonymous_answer` ADD CONSTRAINT `anonymous_answer_calendar_id_fkey` FOREIGN KEY (`calendar_id`) REFERENCES `calendar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
