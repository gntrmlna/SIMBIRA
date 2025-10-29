


// 1. URL CSV publik dari step publish to web
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVXOYGE5Zb3EeamUFQMEDG_yZEUm-lJ0J_l7jk_pSrOnaBaYbGUmjzDvow48cITMIdkHAeuq2j_CnZ/pub?gid=0&single=true&output=csv";

// 2. helper: ambil CSV & ubah jadi array objek JS
async function loadRekapData() {
  const res = await fetch(CSV_URL);
  const text = await res.text();

  // pecah baris CSV
  const rows = text.trim().split("\n").map(r => r.split(","));

  // baris pertama = header kolom
  const header = rows[0].map(h => h.trim().toLowerCase());

  // sisanya = data
  const dataRows = rows.slice(1);

  // bentuk array of object
  const data = dataRows.map(cols => {
    const obj = {};
    header.forEach((key, i) => {
      // normalisasi lowercase biar konsisten pencocokan
      obj[key] = (cols[i] || "").trim();
    });
    return obj;
  });

  return data;
}

// 3. hitung progress untuk 1 jenis laporan
function calculateProgress(data, jenisLaporanFilter, periodeTipeFilter) {
  // kita ambil baris yang cocok dengan jenis laporan & periode tipenya
  // NOTE: kalau mau fix periode spesifik (misal Triwulan III 2025 aja),
  // kamu bisa tambah filter periode_label atau tahun.
  const subset = data.filter(row =>
    row.jenis_laporan.toLowerCase() === jenisLaporanFilter &&
    row.periode_tipe.toLowerCase() === periodeTipeFilter
  );

  const totalWajib = 12;
  const totalMasuk = subset.filter(row => row.sudah_upload.toLowerCase() === "ya").length;

  const persen = totalWajib === 0
    ? 0
    : Math.round((totalMasuk / totalWajib) * 100);

  // Ambil label periode terbaru (misal "Triwulan III 2025")
  // anggap data paling bawah/belum disort: kita ambil yang terakhir aja
  let latestLabel = "";
  if (subset.length > 0) {
    const lastRow = subset[subset.length - 1];
    latestLabel = `${lastRow.periode_label} ${lastRow.tahun}`.trim();
  }

  return { persen, totalMasuk, totalWajib, latestLabel };
}

// 4. render progress bar ke UI
function renderProgress(prefix, prog) {
  // prefix contoh: "ratrb", "anggaran", "publikasi", "teknis"
  const barEl = document.getElementById(`progress-${prefix}-bar`);
  const textEl = document.getElementById(`progress-${prefix}-text`);
  const periodEl = document.getElementById(`${prefix}-periode-label`);

  if (barEl) {
    barEl.style.width = prog.persen + "%";
  }

  if (textEl) {
    textEl.textContent = `${prog.persen}% (${prog.totalMasuk} dari ${prog.totalWajib} UPT)`;
  }

  if (periodEl && prog.latestLabel) {
    periodEl.textContent = prog.latestLabel;
  }
}

// 5. khusus teknis insidentil -> daftar kejadian terbaru
function extractInsidentil(data) {
  // filter hanya teknis insidentil
  const subset = data.filter(row =>
    row.jenis_laporan.toLowerCase() === "teknis" &&
    row.periode_tipe.toLowerCase() === "insidentil"
  );

  // sort by tgl_kegiatan (opsional, kalau format tanggalnya konsisten)
  // kalo tanggal formatnya "24 Okt 2025" susah sort otomatis karena bukan YYYY-MM-DD,
  // jadi sementara kita cukup ambil 3 baris terakhir aja.
  const latest = subset.slice(-3).reverse(); // ambil yang paling baru duluan

  // ubah jadi bentuk gampang render
  return latest.map(row => ({
    tgl: row.tgl_kegiatan,
    upt: row.upt,
    ket: row.keterangan_singkat
  }));
}

// 6. render daftar insidentil teknis
function renderInsidentil(listItems) {
  const ul = document.getElementById("teknis-insidentil-list");
  if (!ul) return;

  ul.innerHTML = "";
  if (listItems.length === 0) {
    ul.innerHTML = `<li class="text-gray-400">Tidak ada catatan insidentil terbaru</li>`;
    return;
  }

  listItems.forEach(it => {
    const li = document.createElement("li");
    li.textContent = `- ${it.tgl} • ${capitalizeUPT(it.upt)} • ${it.ket}`;
    ul.appendChild(li);
  });
}

// helper untuk bikin nama UPT lebih rapi ditampilkan
function capitalizeUPT(upt) {
  // "lapas manokwari" -> "Lapas Manokwari"
  return upt.replace(/\b\w/g, c => c.toUpperCase());
}

// 7. init (dijalankan saat halaman load)
async function initDashboard() {
  const data = await loadRekapData();

  // RAT-RB (triwulanan)
  const progRAT = calculateProgress(data, "rat-rb", "triwulan");
  renderProgress("ratrb", progRAT);

  // Anggaran (mingguan)
  const progAnggaran = calculateProgress(data, "realisasi-anggaran", "mingguan");
  renderProgress("anggaran", progAnggaran);

  // Publikasi (bulanan)
  const progPublikasi = calculateProgress(data, "publikasi", "bulanan");
  renderProgress("publikasi", progPublikasi);

  // Teknis rutin bulanan
  const progTeknis = calculateProgress(data, "teknis", "bulanan");
  renderProgress("teknis", progTeknis);

  // Teknis insidentil list
  const insidentilList = extractInsidentil(data);
  renderInsidentil(insidentilList);
}

// panggil
initDashboard();


// 8. TOMBOL "BUKA FOLDER" (ini sama kayak yang udah kita bikin)
const folderLinks = {
  ratrb: {
        "bapas manokwari": "https://drive.google.com/drive/folders/1ZhlNrTW2k-rtmQbX-D_NTOZ-EzFtHqv1?usp=drive_link",
        "bapas fakfak":"https://drive.google.com/drive/folders/1boqQ_GOfFS00UHbkE0CdP_p_UGoqWYKw?usp=drive_link",
        "bapas sorong": "https://drive.google.com/drive/folders/1JnzsOcCpGpm_2WIKl-9dNikYhQRL2ENo?usp=drive_link",
        "kanwil":"https://drive.google.com/drive/folders/1QY9xs31eKcErTK8CylvEgU9TAbFzu1Qo?usp=drive_link",
        "lapas fakfak": "https://drive.google.com/drive/folders/1ue-Ipzv7LG9nFnXFYmfZYMmLbc8-QlTG?usp=drive_link",
        "lapas manokwari": "https://drive.google.com/drive/folders/1PfQvfkI-S5rc2Gp80V60h1eTf6eq98Xy?usp=drive_link",
        "lapas sorong": "https://drive.google.com/drive/folders/10YB9QTNTFPhMM4ml53rMhh961S0JZATO?usp=drive_link",
        "lapas kaimana": "https://drive.google.com/drive/folders/18PpZXUJ4HiI0N_LOI7rgQylCA9hXRBbD?usp=drive_link",
        "lapas teminabuan":"https://drive.google.com/drive/folders/18LBK7yAbj4uHTSSbmpRPpla5ch60TL_n?usp=drive_link",
        "lpka":"https://drive.google.com/drive/folders/1haApF65WGzhhmuL53p9xUaRsKf9awZ3m?usp=drive_link",
        "lpp":"https://drive.google.com/drive/folders/14jiaZYelX1wviEKsJIjvfmG5X4gZ9O-W?usp=drive_link",
        "rutan bintuni":"https://drive.google.com/drive/folders/1JbUyd4bP3YKFpys2GpDtEL43zKdWXec_?usp=drive_link"
      },
      anggaran: {
        "bapas manokwari": "https://drive.google.com/drive/folders/16PrI1u8OLWc0UIQ7bIDNmpetUyanJZRa?usp=drive_link",
        "bapas fakfak":"https://drive.google.com/drive/folders/1jln4DMoLpkTH_i-OKBmIGsr0ghkZy51j?usp=drive_link",
        "bapas sorong": "https://drive.google.com/drive/folders/1bx-K9wMpWNaDWGaWxdq7jROlk6OGsOou?usp=drive_link",
        "kanwil":"https://drive.google.com/drive/folders/1jytsdfUGITebdT_7ctmVHEKy25iSCDZT?usp=drive_link",
        "lapas fakfak": "https://drive.google.com/drive/folders/1glCue23RzDyfHoYell8s8irV9BHTpMx7?usp=drive_link",
        "lapas manokwari": "https://drive.google.com/drive/folders/1eXQxj_aPaQy1LX5nQTzUu09jPFpuODz4?usp=drive_link",
        "lapas sorong": "https://drive.google.com/drive/folders/1TWtvirDHaVjaDaRSy9gQfvwdLMmbYCl4?usp=drive_link",
        "lapas kaimana": "https://drive.google.com/drive/folders/17j7iyXQGLJc_LnRBr20wJj0p6J5yz46m?usp=drive_link",
        "lapas teminabuan":"https://drive.google.com/drive/folders/1AAC_jmYsdyz5oHFlaNOQyTLEPPehUlhq?usp=drive_link",
        "lpka":"https://drive.google.com/drive/folders/1EbLRKeYTkp6am1Z4CT28kiR0ccQTL_xG?usp=drive_link",
        "lpp":"https://drive.google.com/drive/folders/18kRy-Pyt5_lKORws2Ppw96p33WM6U_aa?usp=drive_link",
        "rutan bintuni":"https://drive.google.com/drive/folders/1eFS8e9oAfH6AKmhaI2spKHKl8QWYzB7g?usp=drive_link"
      },
      publikasi: {
        "bapas manokwari": "https://drive.google.com/drive/folders/1CsDOW-eS3ENGA1kHCcD8sYMlEqhpoYsT?usp=drive_link",
        "bapas fakfak":"https://drive.google.com/drive/folders/1UXSoKcqNVmIUzNQud3DRQ5N3FRBAROm0?usp=drive_link",
        "bapas sorong": "https://drive.google.com/drive/folders/1-Aa1_KFnS-L-9VzJb5oouAY-dNIQJ-S_?usp=drive_link",
        "kanwil":"https://drive.google.com/drive/folders/1sR7uN0kpaRPaQ89i9_1rbDOmFijcu0VV?usp=drive_link",
        "lapas fakfak": "https://drive.google.com/drive/folders/1pwpNyofkwp1d7gwgMUyLhUgIl29PTc0R?usp=drive_link",
        "lapas manokwari": "https://drive.google.com/drive/folders/1JbxZe8wQT9YVqSgk3_PKEVMUMZHh8AbM?usp=drive_link",
        "lapas sorong": "https://drive.google.com/drive/folders/1AIgtVlnM0jBFWCmNJx6ENUIJQXrwXZIe?usp=drive_link",
        "lapas kaimana": "https://drive.google.com/drive/folders/1oA9K9przHWL92E080MXwslWHwQU9Ipz4?usp=drive_link",
        "lapas teminabuan":"https://drive.google.com/drive/folders/1fRKX7hEfbTXHE2PTlelf3R8NUgJITSit?usp=drive_link",
        "lpka":"https://drive.google.com/drive/folders/1pLy_ysHfxFlP8qKAmfbtWaGjQbaqMxGV?usp=drive_link",
        "lpp":"https://drive.google.com/drive/folders/1OrEyaiot5tlCXPjcoAawRIVx_RUGhBW6?usp=drive_link",
        "rutan bintuni":"https://drive.google.com/drive/folders/1nXG1RhknJQYxdM84QR7CRmDD6QMkW0lc?usp=drive_link"
      },
      teknis: {
        "bapas manokwari": "https://drive.google.com/drive/folders/1U8XDfYe9Mp8uchTZpIsVseWu1PvnH0u5?usp=drive_link",
        "bapas fakfak":"https://drive.google.com/drive/folders/1llT6sZd4gz43jHDfmZ36qGFCgbwrE9UT?usp=drive_link",
        "bapas sorong": "https://drive.google.com/drive/folders/11GVHG8wd8FXEhnphtlP1mBCsVLmfDwku?usp=drive_link",
        "kanwil":"https://drive.google.com/drive/folders/1gIosBxBxprppz9quxGD43-2ltiOe0Rg-?usp=drive_link",
        "lapas fakfak": "https://drive.google.com/drive/folders/1HXid9mLahD3ApBfDRnCmZmFgxgiWhzf-?usp=drive_link",
        "lapas manokwari": "https://drive.google.com/drive/folders/1JxasguX9HMldgV8o8YUwsuIlqAVyABGS?usp=drive_link",
        "lapas sorong": "https://drive.google.com/drive/folders/17HAcOWTIcx7rfOUoL8qjscH9dqCSp1gj?usp=drive_link",
        "lapas kaimana": "https://drive.google.com/drive/folders/1Ry71bao7gYf6BXDVqK_sYX8V_Ty32W1C?usp=drive_link",
        "lapas teminabuan":"https://drive.google.com/drive/folders/1VpkYv6-B1jeX9K5IerUd-8ItvF8hBpqZ?usp=drive_link",
        "lpka":"https://drive.google.com/drive/folders/1lJzn_wV-FUztuxo1US-tQiLY_BEr7pdP?usp=drive_link",
        "lpp":"https://drive.google.com/drive/folders/1gPURCwev_rmgsTZYJpF46zWBehboMgWY?usp=drive_link",
        "rutan bintuni":"https://drive.google.com/drive/folders/134F0064yg-ASIYL3arXHTpF33hGjKt5Q?usp=drive_link"
      }
};

document.querySelectorAll(".dropdown").forEach(select => {
  select.addEventListener("change", e => {
    const reportType = e.target.dataset.type;
    const upt = e.target.value;
    const button = document.querySelector(`[data-btn="${reportType}"]`);

    if (folderLinks[reportType] && folderLinks[reportType][upt]) {
      button.href = folderLinks[reportType][upt];
      button.classList.remove("opacity-50", "pointer-events-none");
      button.textContent = "Buka Folder";
    } else {
      button.href = "#";
      button.classList.add("opacity-50", "pointer-events-none");
      button.textContent = "Buka Folder";
    }
  });
});

