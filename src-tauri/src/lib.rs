use tauri_plugin_sql::Migration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Migration 1: Create categories table
        Migration {
            version: 1,
            description: "Create categories table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    color TEXT NOT NULL DEFAULT '#000000',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            "#,
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        // Migration 2: Create tasks table
        Migration {
            version: 2,
            description: "Create tasks table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    status TEXT NOT NULL CHECK (status IN ('todo', 'inprogress', 'done')) DEFAULT 'todo',
                    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
                    category_id INTEGER,
                    start_time DATETIME,
                    deadline DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
                );
            "#,
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
        // Migration 3: Create indexes
        Migration {
            version: 3,
            description: "Create indexes on tasks table",
            sql: r#"
                CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
                CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
                CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
                CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
            "#,
            kind: tauri_plugin_sql::MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:tomo.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
