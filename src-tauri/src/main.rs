// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::Path;

#[tauri::command]
async fn read_file(path: String, _app_handle: tauri::AppHandle) -> Result<String, String> {
    let path = Path::new(&path);
    if !path.exists() {
        return Err(format!("File not found: {}", path.display()));
    }
    match fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}

#[tauri::command]
async fn write_file(
    path: String,
    content: String,
    _app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let path = Path::new(&path);
    match fs::write(path, content) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to write file: {}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_file, write_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
