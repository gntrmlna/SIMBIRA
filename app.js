/* ============================
   SIMBIRA – APP.JS (Frontend)
   ============================
   Cara pakai:
   1) Ganti CSV_URL dengan URL "Publish to web" (format CSV) dari tab 'rekap'
   2) Sesuaikan TOTAL_UPT & MASTER_UPT (jumlah UPT = TOTAL_UPT)
   3) Sesuaikan folderLinks (link Drive tahun aktif)
   4) Pastikan HTML punya elemen-elemen dengan ID yang disebut di bawah
      (progress-*-bar, progress-*-text, *-periode-label, teknis-insidentil-list, laporan-ringkas)
*/

///////////////////////
// (1) KONFIGURASI  //
///////////////////////

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVXOYGE5Zb3EeamUFQMEDG_yZEUm-lJ0J_l7jk_pSrOnaBaYbGUmjzDvow48cITMIdkHAeuq2j_CnZ/pub?gid=0&single=true&output=csv";

// TOTAL UPT tetap
const TOTAL_UPT = 12;

// Master list UPT (lowercase, sama persis dengan value di <option> & kolom 'upt' di Sheet)
const MASTER_UPT = [
  "lapas manokwari",
  "lapas sorong",
  "lapas fakfak",
  "lapas kaimana",
  "lapas teminabuan",
  "bapas manokwari",
  "bapas sorong",
  "bapas fakfak",
  "kanwil",
  "lpka",
  "lpp",
  "rutan bintuni"
  // …tambahkan jika memang ada >6; total keseluruhan harus 12
];

// Mapping tombol "Buka Folder" (tahun aktif). Key harus sama dgn value dropdown (lowercase).
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

///////////////////////
// (2) UTILITAS     //
///////////////////////

// Parser CSV sederhana dengan dukungan kutip ganda (biar aman kalau ada koma di dalam kolom)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' ) {
      if (inQuotes && next === '"') { // escape ""
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (cell !== "" || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function toObjArray(rows) {
  if (!rows.length) return [];
  const header = rows[0].map(h => (h || "").trim().toLowerCase());
  return rows.slice(1).map(cols => {
    const o = {};
    header.forEach((k, i) => {
      o[k] = (cols[i] || "").trim();
    });
    return o;
  });
}

function capWords(s) {
  return (s || "").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// Safe setter
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setBarWidth(id, percent) {
  const el = document.getElementById(id);
  if (el) el.style.width = (percent || 0) + "%";
}


////////////////////////////////////
// (3) FETCH & PERSIAPAN DATA     //
////////////////////////////////////

async function loadRekapData() {
  try {
    if (!CSV_URL || CSV_URL.includes("PASTE_URL_CSV_KAMU_DISINI")) {
      console.warn("CSV_URL belum diisi.");
      return [];
    }
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error("Gagal fetch CSV:", res.status, await res.text());
      return [];
    }
    const text = await res.text();
    const rows = parseCSV(text);
    return toObjArray(rows);
  } catch (e) {
    console.error("Error loadRekapData:", e);
    return [];
  }
}


////////////////////////////////////
// (4) HITUNG PROGRESS /12 UPT    //
////////////////////////////////////

function calculateProgress(data, jenis, tipe) {
  const subset = data.filter(r =>
    (r.jenis_laporan || "").toLowerCase() === jenis &&
    (r.periode_tipe || "").toLowerCase() === tipe
  );

  // Pakai baris terakhir (paling bawah) sebagai periode aktif
  let latestLabel = "", latestYear = "";
  if (subset.length) {
    const last = subset[subset.length - 1];
    latestLabel = (last.periode_label || "").trim();
    latestYear  = (last.tahun || "").trim();
  }

  // Filter hanya periode aktif (biar gak kebawa periode lama)
  const latestSubset = subset.filter(r =>
    (r.periode_label || "").trim() === latestLabel &&
    (r.tahun || "").trim() === latestYear
  );

  // Hitung UPT yang sudah upload (unik)
  const uploadedSet = new Set(
    latestSubset
      .filter(r => (r.sudah_upload || "").toLowerCase() === "ya")
      .map(r => (r.upt || "").toLowerCase().trim())
  );

  const masuk = uploadedSet.size;
  const persen = TOTAL_UPT ? Math.round((masuk / TOTAL_UPT) * 100) : 0;
  const labelGabungan = [latestLabel, latestYear].filter(Boolean).join(" ").trim();

  return { persen, masuk, total: TOTAL_UPT, latestLabel: labelGabungan, uploadedSet };
}


////////////////////////////////////
// (5) RENDER PROGRESS + LABEL    //
////////////////////////////////////

function renderProgress(prefix, prog) {
  setBarWidth(`progress-${prefix}-bar`, prog.persen);
  setText(`progress-${prefix}-text`, `${prog.persen}% (${prog.masuk} dari ${prog.total} UPT)`);
  if (prog.latestLabel) setText(`${prefix}-periode-label`, prog.latestLabel);
}


////////////////////////////////////
// (6) TEKNIS INSIDENTIL (LOG)    //
////////////////////////////////////

function extractInsidentil(data) {
  const subset = data.filter(r =>
    (r.jenis_laporan || "").toLowerCase() === "teknis" &&
    (r.periode_tipe || "").toLowerCase() === "insidentil"
  );
  // Ambil 3 terakhir
  return subset.slice(-3).reverse().map(r => ({
    tgl: r.tgl_kegiatan || "-",
    upt: r.upt || "-",
    ket: r.keterangan_singkat || "-"
  }));
}

function renderInsidentil(items) {
  const ul = document.getElementById("teknis-insidentil-list");
  if (!ul) return;

  ul.innerHTML = "";
  if (!items.length) {
    ul.innerHTML = `<li class="text-gray-400">Tidak ada catatan insidentil terbaru</li>`;
    return;
  }

  items.forEach(it => {
    const li = document.createElement("li");
    li.textContent = `- ${it.tgl} • ${capWords(it.upt)} • ${it.ket}`;
    ul.appendChild(li);
  });
}


////////////////////////////////////
// (7) RINGKASAN OTOMATIS (/12)   //
////////////////////////////////////

function generateSummaryForJenis(data, jenis, tipe) {
  const prog = calculateProgress(data, jenis, tipe);

  // Belum setor = MASTER_UPT - uploadedSet
  const belumSetor = MASTER_UPT.filter(u => !prog.uploadedSet.has(u));

  const pretty = (j) => ({
    "rat-rb": "RAT-RB",
    "realisasi-anggaran": "Realisasi Anggaran",
    "publikasi": "Publikasi",
    "teknis": "Laporan Teknis Rutin",
  }[j] || j);

  return {
    judul: `${pretty(jenis)} — ${prog.latestLabel || "-"}`,
    persen: prog.persen,
    masuk: prog.masuk,
    total: prog.total,
    belumSetor
  };
}

function renderSummarySection(data) {
  const target = document.getElementById("laporan-ringkas");
  if (!target) return;

  const configs = [
    ["rat-rb", "triwulan"],
    ["realisasi-anggaran", "mingguan"],
    ["publikasi", "bulanan"],
    ["teknis", "bulanan"], // catatan insidentil ditampilkan terpisah
  ];

  target.innerHTML = "";
  configs.forEach(([jenis, tipe]) => {
    const s = generateSummaryForJenis(data, jenis, tipe);
    if (!s) return;

    const belumText = s.belumSetor.length
      ? "Belum setor: " + s.belumSetor.map(capWords).join(", ")
      : "Semua UPT sudah setor ✅";

    const block = document.createElement("div");
    block.className = "p-4 border rounded-xl";
    block.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <p class="font-medium text-[#07213D]">${s.judul}</p>
        <span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">${s.persen}%</span>
      </div>
      <p class="text-gray-700 text-sm mb-1">${s.masuk} dari ${s.total} UPT sudah setor</p>
      <p class="text-gray-500 text-xs italic">${belumText}</p>
    `;
    target.appendChild(block);
  });
}


////////////////////////////////////
// (8) DROPDOWN → TOMBOL FOLDER   //
////////////////////////////////////

function initFolderButtons() {
  document.querySelectorAll(".dropdown").forEach(select => {
    select.addEventListener("change", (e) => {
      const reportType = e.target.dataset.type;  // ratrb / anggaran / publikasi / teknis
      const upt = (e.target.value || "").toLowerCase();
      const button = document.querySelector(`[data-btn="${reportType}"]`);
      if (!button) return;

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
}


////////////////////////////////////
// (9) INIT DASHBOARD             //
////////////////////////////////////

async function initDashboard() {
  initFolderButtons();

  const data = await loadRekapData();

  // Progress per kartu
  renderProgress("ratrb",     calculateProgress(data, "rat-rb",             "triwulan"));
  renderProgress("anggaran",  calculateProgress(data, "realisasi-anggaran", "mingguan"));
  renderProgress("publikasi", calculateProgress(data, "publikasi",          "bulanan"));
  renderProgress("teknis",    calculateProgress(data, "teknis",             "bulanan"));

  // Teknis insidentil
  renderInsidentil(extractInsidentil(data));

  // Ringkasan otomatis
  renderSummarySection(data);
}

// Jalankan setelah DOM siap (aman walau <script> ditaruh di <head>)
window.addEventListener("DOMContentLoaded", initDashboard);

/////////////////////////////
// (10) DEBUGGING BANTUAN  //
/////////////////////////////
// Tips jika CSV tidak masuk:
// - Pastikan sudah "File → Share → Anyone with the link (Viewer)"
// - Pastikan "File → Share → Publish to web..." (pilih tab 'rekap', format CSV) → gunakan URL itu ke CSV_URL
// - Cek console (F12) apakah ada error CORS / 403 / 404
// - Pastikan header sheet sesuai: tahun, periode_label, periode_tipe, jenis_laporan, upt,
//   wajib_lapor, sudah_upload, link_folder_drive, tgl_kegiatan, keterangan_singkat
