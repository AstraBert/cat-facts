mod requests;

use crate::requests::{get_cat_fact, get_random_cat_picture};

#[tauri::command]
async fn cat_fact(language: String) -> Result<String, String> {
    let fact = get_cat_fact(&language).await.map_err(|e| e.to_string())?;

    Ok(fact)
}

#[tauri::command]
async fn cat_pic() -> Result<String, String> {
    let url = get_random_cat_picture().await.map_err(|e| e.to_string())?;

    Ok(url)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![cat_fact, cat_pic])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
