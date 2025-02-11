// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Serialize, Deserialize};
use rand::Rng;

// Position struct to represent x, y coordinates
#[derive(Debug, Serialize, Deserialize)]
pub struct Position {
    x: f64,
    y: f64,
}

// Command to generate random position within window bounds
#[tauri::command]
fn get_random_position(window_width: f64, window_height: f64) -> Position {
    let mut rng = rand::thread_rng();
    
    // Account for avatar size (100x100 as noted in DEVELOPMENT_NOTES.md)
    let max_x = window_width - 100.0;
    let max_y = window_height - 100.0;
    
    Position {
        x: rng.gen_range(0.0..max_x),
        y: rng.gen_range(0.0..max_y),
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_random_position
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
