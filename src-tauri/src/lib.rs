use log::debug;
use probe_rs::Session;
use probe_rs::SessionConfig;
use probe_rs::flashing::DownloadOptions;
use probe_rs::probe::WireProtocol;
use serde::Deserialize;
use serde::Serialize;
use std::time::Duration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> anyhow::Result<()> {
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![change])
        .run(tauri::generate_context!())?;
    Ok(())
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
    debug!("Received request for changing id:");
    debug!(
        "  Chip          : family={:?}, name={}",
        chip_family, chip_name
    );
    debug!(
        "  Memory address: 0x{:x} - 0x{:x}",
        bank_base,
        bank_base + bank_length - 1
    );
    debug!("  CAN address   : 0x{:03x}", can_addr);
    match chip_family {
        ChipFamily::Esp32 => write(bank_base, can_addr, chip_name, WireProtocol::Jtag),
        ChipFamily::Stm32 => write(bank_base, can_addr, chip_name, WireProtocol::Swd)
    }
}

fn write(
    bank_base: u64,
    can_addr: u16,
    chip_name: &str,
    protocol: WireProtocol
) -> Result<(), String> {
    let session_config = SessionConfig {
        protocol: Some(protocol),
        speed: Some(1000),
        ..Default::default()
    };
    let download_options = {
        let mut opts = DownloadOptions::default();
        opts.keep_unwritten_bytes = true;
        opts.verify = true;
        opts
    };
    let Ok(mut session) = Session::auto_attach(chip_name, session_config) else {
        return Err("基板との接続に失敗しました。".to_string());
    };
    if let Ok(mut core) = session.core(0)
        && let Ok(_) = core.halt(Duration::from_millis(200))
    {
        // nop
    } else {
        return Err("基板の停止に失敗しました。".to_string());
    }
    let mut loader = session.target().flash_loader();
    if let Ok(_) = loader.add_data(bank_base, &[can_addr as u8, (can_addr >> 8) as u8])
        && let Ok(_) = loader.commit(&mut session, download_options)
    {
        // nop
    } else {
        return Err("基板への書き込みに失敗しました".to_string());
    }
    Ok(())
}
