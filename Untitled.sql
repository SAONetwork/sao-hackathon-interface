CREATE TABLE `collection_files` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`file_id` bigint unsigned NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`status` bigint NULL DEFAULT NULL,
`collection_id` bigint unsigned NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `collection_likes` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`collection_id` bigint unsigned NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `collection_stars` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`collection_id` bigint unsigned NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `collections` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`preview` longtext NULL,
`labels` longtext NULL,
`title` longtext NULL,
`description` longtext NULL,
`type` bigint NULL DEFAULT NULL,
`collection_likes` varchar(255) NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_chunk_metadata` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`deleted_at` datetime NULL DEFAULT NULL,
`file_id` bigint unsigned NULL DEFAULT NULL,
`offset` bigint NULL DEFAULT NULL,
`size` bigint NULL DEFAULT NULL,
`encrypted_offset` bigint NULL DEFAULT NULL,
`encrypted_size` bigint NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_comment_likes` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`comment_id` bigint unsigned NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_comments` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`comment` longtext NULL,
`parent_id` bigint unsigned NULL DEFAULT NULL,
`comment_likes` varchar(255) NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_infos` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`expireAt` bigint NULL DEFAULT NULL,
`ipfsHash` varchar(255) NULL DEFAULT '',
`content` longtext NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_previews` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`file_id` bigint unsigned NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`preview` longtext NULL,
`labels` longtext NULL,
`thum_id` longtext NULL,
`price` decimal(32,18) NULL DEFAULT NULL,
`title` longtext NULL,
`description` longtext NULL,
`content_type` longtext NULL,
`type` bigint NULL DEFAULT NULL,
`filename` longtext NULL,
`status` bigint NULL DEFAULT NULL,
`file_category` longtext NULL,
`nft_token_id` bigint NULL DEFAULT NULL,
`additional_info` longtext NULL,
`file_stars` varchar(255) NULL,
`file_comment` varchar(255) NULL,
`size` bigint NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_stars` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`file_preview_id` bigint unsigned NULL DEFAULT NULL,
`eth_addr` longtext NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `mcs_infos` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`deleted_at` datetime NULL DEFAULT NULL,
`source_file_upload_id` bigint NULL DEFAULT NULL,
`payload_cid` longtext NULL,
`ipfs_url` longtext NULL,
`file_size` bigint NULL DEFAULT NULL,
`w_cid` longtext NULL,
`payment_tx_hash` longtext NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `purchase_orders` (
`id` bigint unsigned NOT NULL,
`file_id` bigint NULL DEFAULT NULL,
`buyer_addr` longtext NULL,
`order_tx_hash` longtext NULL,
`complete_tx_hash` longtext NULL,
`state` longtext NULL,
`updated_at` datetime NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `user_followings` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`follower` longtext NULL,
`following` longtext NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `user_profiles` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`eth_addr` longtext NULL,
`avatar` longtext NULL,
`username` longtext NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `user_followers_index` (
`dataId` int(11) NOT NULL,
`hashValue`  NULL,
`followerDataId` int(11) NULL
);

CREATE TABLE `thumbnail` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`content` varchar(255) NULL DEFAULT '',
`contentType` varchar(255) NULL DEFAULT '',
`size` bigint NULL DEFAULT NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `collection_comments` (
`id` bigint unsigned NOT NULL,
`created_at` datetime NULL DEFAULT NULL,
`updated_at` datetime NULL DEFAULT NULL,
`comment` longtext NULL,
`parent_id` bigint unsigned NULL DEFAULT NULL,
`comment_likes` varchar(255) NULL
)
ENGINE = InnoDB
AVG_ROW_LENGTH = 0
KEY_BLOCK_SIZE = 0
MAX_ROWS = 0
MIN_ROWS = 0
ROW_FORMAT = Dynamic
STATS_SAMPLE_PAGES = 0;

CREATE TABLE `file_comment_likes` (
`dataId` int(11) NOT NULL,
`users(array)` int(11) NULL
);

CREATE TABLE `file_comment_index` (
`dataId` int(11) NOT NULL,
`fileId` int(11) NULL,
`commentId(array)` int(11) NULL
);

CREATE TABLE `collection_comment_index` (
`dataId` int(11) NOT NULL,
`fileId` int(11) NULL,
`commentId(array)` int(11) NULL
);

CREATE TABLE `file_stars` (
`dataId` int(11) NOT NULL,
`users(array)` int(11) NULL
);

CREATE TABLE `collection_likes` (
`dataId` int(11) NOT NULL,
`users(array)` int(11) NULL
);

