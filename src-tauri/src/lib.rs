use serde::Deserialize;
use serde::Serialize;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![change])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
enum ChipFamily {
    Esp32,
    Stm32
}

#[tauri::command]
fn change(
    bank_base: u64,
    bank_length: u64,
    can_addr: u16,
    chip_family: ChipFamily,
    chip_name: &str
) -> Result<(), String> {
    println!(
        "CAN Address = 0x{:03x}, Memory Address Range: 0x{:x} - 0x{:x}, Chip Family: {:?}, Chip \
         Name: {}",
        can_addr,
        bank_base,
        bank_base + bank_length - 1,
        chip_family,
        chip_name
    );
    Ok(())
}
