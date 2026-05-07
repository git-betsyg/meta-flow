/*
 PostgreSQL Schema
 Converted from SQLite
*/

-- ============================
-- notification_outbox
-- ============================

DROP TABLE IF EXISTS notification_outbox CASCADE;

CREATE TABLE notification_outbox (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMP,
  last_error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_outbox_status_retry
ON notification_outbox (
  status,
  next_retry_at,
  created_at
);

-- ============================
-- schema_migrations
-- ============================

DROP TABLE IF EXISTS schema_migrations CASCADE;

CREATE TABLE schema_migrations (
  migration_key TEXT PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- tasks
-- ============================

DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,

  youtube_url TEXT NOT NULL,
  upload_target TEXT DEFAULT 'acfun',
  status TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  video_title_original TEXT,
  video_title_translated TEXT,

  description_original TEXT,
  description_translated TEXT,

  tags_generated TEXT,

  recommended_partition_id TEXT,
  selected_partition_id TEXT,

  recommended_partition_id_acfun TEXT,
  selected_partition_id_acfun TEXT,

  recommended_partition_id_bilibili TEXT,
  selected_partition_id_bilibili TEXT,

  cover_path_local TEXT,
  video_path_local TEXT,

  subtitle_path_original TEXT,
  subtitle_path_translated TEXT,

  subtitle_language_detected TEXT,

  subtitle_qc_failed BOOLEAN DEFAULT FALSE,
  subtitle_qc_reason TEXT,
  subtitle_qc_score DOUBLE PRECISION,
  subtitle_qc_checked_at TIMESTAMP,

  metadata_json_path_local TEXT,

  moderation_result TEXT,
  error_message TEXT,

  pipeline_checkpoint TEXT,
  upload_progress TEXT,

  acfun_upload_response TEXT,
  bilibili_upload_response TEXT,

  asr_warning_message TEXT
);

-- ============================
-- monitor_configs
-- ============================

DROP TABLE IF EXISTS monitor_configs CASCADE;

CREATE TABLE monitor_configs (
  id BIGSERIAL PRIMARY KEY,

  name TEXT NOT NULL,

  enabled BOOLEAN DEFAULT TRUE,

  region_code TEXT DEFAULT 'US',
  category_id TEXT DEFAULT '0',

  time_period INTEGER DEFAULT 7,
  max_results INTEGER DEFAULT 10,

  min_view_count INTEGER DEFAULT 0,
  min_like_count INTEGER DEFAULT 0,
  min_comment_count INTEGER DEFAULT 0,

  keywords TEXT DEFAULT '',
  exclude_keywords TEXT DEFAULT '',

  channel_ids TEXT DEFAULT '',
  exclude_channel_ids TEXT DEFAULT '',

  min_duration INTEGER DEFAULT 0,
  max_duration INTEGER DEFAULT 0,

  schedule_type TEXT DEFAULT 'manual',
  schedule_interval INTEGER DEFAULT 120,

  order_by TEXT DEFAULT 'viewCount',

  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',

  rate_limit_requests INTEGER DEFAULT 20,
  rate_limit_window INTEGER DEFAULT 60,

  last_run_time TEXT,

  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  auto_add_to_tasks BOOLEAN DEFAULT FALSE,

  monitor_type TEXT DEFAULT 'youtube_search',
  channel_mode TEXT DEFAULT 'latest',
  channel_keywords TEXT DEFAULT '',

  latest_days INTEGER DEFAULT 7,
  latest_max_results INTEGER DEFAULT 20,

  video_types TEXT DEFAULT 'video,short,live',

  historical_progress_date TEXT DEFAULT '',
  historical_offset INTEGER DEFAULT 0
);

-- ============================
-- monitor_history
-- ============================

DROP TABLE IF EXISTS monitor_history CASCADE;

CREATE TABLE monitor_history (
  id BIGSERIAL PRIMARY KEY,

  config_id BIGINT REFERENCES monitor_configs(id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

  video_id TEXT NOT NULL,
  video_type TEXT,

  video_title TEXT,
  channel_title TEXT,

  view_count INTEGER,
  like_count INTEGER,
  comment_count INTEGER,

  duration TEXT,
  published_at TEXT,

  added_to_tasks BOOLEAN DEFAULT FALSE,

  run_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- users
-- ============================

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,

  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,

  email TEXT UNIQUE,

  nickname TEXT,
  avatar_url TEXT,

  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',

  last_login_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- indexes
-- ============================

CREATE INDEX idx_users_username
ON users(username);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_role
ON users(role);

CREATE INDEX idx_users_status
ON users(status);