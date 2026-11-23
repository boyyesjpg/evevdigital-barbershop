/* ==========================================================================
   PENGATURAN INFORMASI KLIEN (BARBERSHOP & GROOMING LOUNGE - evevbarber)
   Ubah nilai di objek PROFIL_USAHA untuk memperbarui seluruh template.
   ========================================================================== */

const PROFIL_USAHA = {
  nama: "evevbarber",
  tagline: "Pangkas Presisi & Grooming Lounge Pria Jakarta Timur",
  deskripsi: "Barbershop & Grooming Lounge modern di Otista Raya, Jakarta Timur. Spesialis pangkas presisi, Korean Down Perm, Skin Fade, dan Royal Hot Towel Shave dengan silet steril 1x pakai.",

  temaDefault: "dark",

  whatsapp: "62895323418658",
  telepon: "+62 895-3234-18658",
  email: "evevdigital@gmail.com",
  pesanWABooking: "Halo evevbarber, saya ingin booking kursi potong rambut. Mohon info slot tersedia hari ini.",

  alamat: "Jl. Otista Raya No. 88, Jatinegara, Jakarta Timur",
  jamBukaText: "Setiap Hari: 10:00 - 21:00 WIB",
  jamBukaHour: 10,
  jamTutupHour: 21,
  areaLayanan: "Walk-In Cepat & Reservasi Kursi VIP Online",
  linkMaps: "https://maps.google.com/?q=Jl.+Otista+Raya+No.+88+Jatinegara+Jakarta+Timur",

  layanan: [
    {
      nama: "Gentleman Signature Haircut",
      harga: "Rp 70.000",
      durasi: "45 Menit",
      deskripsi: "Konsultasi bentuk rahang, pangkas presisi, cuci rambut hangat/dingin, pijat kepala relaksasi, tonic penyegar, dan styling pomade premium.",
      badge: "Paling Favorit"
    },
    {
      nama: "Royal Hot Towel Shave & Beard Trim",
      harga: "Rp 45.000",
      durasi: "30 Menit",
      deskripsi: "Kompres handuk hangat aromaterapi, cukur silet steril 1x pakai dibuka di depan Anda, beard oil penutrisi, dan aftershave dingin anti iritasi.",
      badge: "Relaksasi Pria"
    },
    {
      nama: "The Royalty Full Grooming Package",
      harga: "Rp 120.000",
      durasi: "75 Menit",
      deskripsi: "Paket komplit: Signature Haircut + Hot Towel Shave + Face Scrub angkat komedo + Pijat leher & bahu + Free Specialty Espresso.",
      badge: "Best Value"
    },
    {
      nama: "Korean Down Perm & Textured Cut",
      harga: "Rp 160.000",
      durasi: "90 Menit",
      deskripsi: "Solusi rambut samping kaku/jabrik agar turun rapi natural mengikuti bentuk kepala, lengkap dengan potongan Two-Block atau Comma Hair.",
      badge: "Tren Studio"
    }
  ],

  keunggulan: [
    {
      judul: "100% Silet Steril 1x Pakai",
      deskripsi: "Protokol higienis ketat: mata pisau baru selalu dibuka langsung di hadapan Anda untuk mencegah iritasi kulit."
    },
    {
      judul: "Master Barber Bersertifikat",
      deskripsi: "Berpengalaman lebih dari 8 tahun menangani karakter rambut pria Asia, dari formal eksekutif hingga skin fade tajam."
    },
    {
      judul: "Lounge AC Dingin & Free Espresso",
      deskripsi: "Ruang tunggu sofa kulit nyaman, Wi-Fi cepat, dan kopi espresso segar gratis tanpa biaya tambahan."
    }
  ]
};

window.PROFIL_USAHA = PROFIL_USAHA;

window.evevMakeWaUrl = function (customText) {
  const p = window.PROFIL_USAHA || {};
  const cleanNum = String(p.whatsapp || "62895323418658").replace(/\D/g, "");
  const text = (customText && String(customText).trim()) || p.pesanWABooking || "Halo evevbarber, saya ingin booking kursi.";
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
};

/* ==========================================================================
   ENGINE HIDRASI OTOMATIS & INTERCEPTOR BOOKING WHATSAPP
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const p = window.PROFIL_USAHA;
  if (!p) return;

  // 1. Hidrasi seluruh elemen ber-atribut data-config
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.getAttribute("data-config");
    if (p[key] !== undefined) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = p[key];
      } else {
        el.textContent = p[key];
      }
    }
  });

  // 2. Hidrasi tautan Google Maps & Email
  document.querySelectorAll("[data-maps-link]").forEach((el) => {
    if (p.linkMaps) {
      el.setAttribute("href", p.linkMaps);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  document.querySelectorAll("[data-email-link]").forEach((el) => {
    if (p.email) {
      el.setAttribute("href", `mailto:${p.email}`);
    }
  });

  // 3. Sinkronisasi seluruh tautan WhatsApp tanpa menghapus pesan kontekstual
  document.querySelectorAll('a[href*="wa.me"], a.wa-link, .btn-wa-booking, a[data-wa-text], a[href*="book.html"]').forEach((a) => {
    const currentHref = a.getAttribute("href") || "";
    if (currentHref.startsWith("#") && currentHref.length > 1) return;

    let customMessage = a.getAttribute("data-wa-text");
    if (!customMessage && currentHref.includes("?text=")) {
      try {
        const parsed = new URL(currentHref, window.location.origin);
        customMessage = parsed.searchParams.get("text");
      } catch (err) {
        customMessage = null;
      }
    }

    a.setAttribute("href", window.evevMakeWaUrl(customMessage));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });

  // 4. Batasi tanggal booking minimal hari ini
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  document.querySelectorAll('input[type="date"]').forEach((dateInput) => {
    dateInput.setAttribute("min", todayStr);
    if (!dateInput.value) {
      dateInput.value = todayStr;
    }
  });

  // 5. Intercept Form Booking Online (termasuk pilihan Stylist)
  const bookingForms = document.querySelectorAll("form#form_sb, form.form-border, form[name='contactForm']");
  bookingForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = (form.querySelector('input[name="name"], input#name')?.value || "").trim() || "Pelanggan";
      const telp = (form.querySelector('input[name="phone"], input#phone')?.value || "").trim() || "-";
      const service = form.querySelector('select[name="service"], select#service')?.value || "Gentleman Signature Haircut";
      const stylist = form.querySelector('select[name="stylist"], select#stylist')?.value || "Barber Senior Tersedia";
      const date = form.querySelector('input[name="date"], input#date')?.value || todayStr;
      const time = form.querySelector('select[name="time"], input[name="time"]')?.value || "14:00";

      const waMessage = [
        "*RESERVASI KURSI - " + p.nama.toUpperCase() + "*",
        "",
        `Halo ${p.nama}, saya ingin booking jadwal grooming:`,
        `• Nama: ${nama}`,
        `• No. WhatsApp: ${telp}`,
        `• Layanan: ${service}`,
        `• Stylist/Barber: ${stylist}`,
        `• Tanggal: ${date}`,
        `• Jam Kedatangan: ${time} WIB`,
        "",
        "Mohon konfirmasi ketersediaan kursinya. Terima kasih!"
      ].join("\n");

      window.open(window.evevMakeWaUrl(waMessage), "_blank", "noopener,noreferrer");
    });
  });

  // 6. Guard aset gambar lokal agar tidak menampilkan broken icon kasar
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = "true";
      this.classList.add("evev-img-fallback");
    });
  });
});
