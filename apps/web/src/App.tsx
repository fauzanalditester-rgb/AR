import { useState, useRef, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
/* interface Product {
  id: number;
  emoji: string;
  name: string;
  desc: string;
  price: string;
  tag: string;
  color: string;
} */

// ─── Data ────────────────────────────────────────────────────────────────────
/* const PRODUCTS: Product[] = [
  { id: 1, emoji: "🧋", name: "Teh Poci Cheese Cream", desc: "Teh premium dengan topping keju creamy yang lembut dan gurih", price: "Rp 18.000", tag: "BEST SELLER", color: "#F5C518" },
  { id: 2, emoji: "🍵", name: "Brown Sugar Series", desc: "Manis karamel brown sugar asli dengan teh pilihan terbaik", price: "Rp 16.000", tag: "TERLARIS", color: "#C97B2A" },
  { id: 3, emoji: "🍋", name: "Lemon Fresh", desc: "Segar menyegarkan dengan perasan lemon asli dan teh hijau", price: "Rp 14.000", tag: "BARU", color: "#7FC441" },
  { id: 4, emoji: "🍨", name: "Float Ice Cream", desc: "Kombinasi es krim vanilla lembut di atas teh dingin segar", price: "Rp 20.000", tag: "PREMIUM", color: "#E8A4C8" },
]; */

// ─── AR Camera Component (Mind-AR Implementation) ───────────────────────────
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-camera': any;
      'a-gltf-model': any;
    }
  }
}

function ARCamera() {
  const [started, setStarted] = useState(false);

  // Versi Tanpa Kamera (Pure Visual)
  if (!started) {
    return (
      <div className="cam-wrap" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#100500" }}>
        <div className="cam-error" style={{ textAlign: "center", padding: "20px" }}>
          <div className="cam-error-icon" style={{ fontSize: "60px" }}>🍵</div>
          <div className="sec-title bebas" style={{ fontSize: 42, color: "#F5C518" }}>TEH POCI EXPERIENCE</div>
          <p style={{ color: "#fff", opacity: 0.8, maxWidth: "300px", margin: "10px auto 20px" }}>
            Klik tombol di bawah untuk melihat visual premium Teh Poci.
          </p>
          <button className="btn-primary" style={{ padding: "15px 40px", fontSize: "18px" }} onClick={() => setStarted(true)}>
            LIHAT VISUAL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, background: "#100500" }}>
      {/* A-Frame Scene - Pure Visual Mode (No Camera) */}
      <a-scene 
        color-space="sRGB" 
        renderer="colorManagement: true, physicallyCorrectLights" 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false"
        style={{ width: "100%", height: "100%" }}
      >
        <a-assets>
          <img id="pociAsset" src="/poci_splash.png" />
          <img id="flyerAsset" src="/flyer.jpg" />
        </a-assets>

        {/* Kamera Statis */}
        <a-camera position="0 0 0" look-controls="enabled: false" wasd-controls="enabled: false"></a-camera>

        {/* CONTAINER UTAMA */}
        <a-entity position="0 0 -2.5" scale="1.3 1.3 1.3">
           
           {/* BACKGROUND FLYER */}
           <a-image 
             src="#flyerAsset" 
             width="4.2" 
             height="5.8" 
             position="0 0 -0.5"
             shader="flat"
           ></a-image>

           {/* GELAS TEH POCI UTAMA */}
           <a-entity position="0 -0.4 0.2">
              <a-image 
                src="#pociAsset" 
                width="2.2" 
                height="2.6" 
                position="0 0.2 0"
                animation="property: position; to: 0 0.3 0; dur: 2000; dir: alternate; loop: true; easing: easeInOutSine"
              ></a-image>

              {/* Secondary Splash Layer */}
              <a-image 
                src="#pociAsset" 
                width="2.3" 
                height="2.7" 
                position="0 0.2 0.05"
                opacity="0.3"
                animation="property: scale; from: 1 1 1; to: 1.05 1.05 1.05; dur: 1500; dir: alternate; loop: true; easing: easeInOutQuad"
              ></a-image>

              {/* Floating Ice Cubes */}
              {[
                { pos: "-0.5 -0.3 0.3", rot: "45 45 0", scale: "0.2" },
                { pos: "0.4 -0.6 0.2", rot: "10 20 30", scale: "0.15" },
                { pos: "-0.2 -0.8 0.4", rot: "80 10 0", scale: "0.12" },
                { pos: "0.5 -0.1 0.1", rot: "0 45 45", scale: "0.18" },
              ].map((ice, i) => (
                <a-box 
                  key={i}
                  position={ice.pos} 
                  rotation={ice.rot} 
                  width={ice.scale} 
                  height={ice.scale} 
                  depth={ice.scale} 
                  color="#E0F7FA" 
                  opacity="0.7"
                  animation={`property: position; to: ${ice.pos.split(' ')[0]} ${parseFloat(ice.pos.split(' ')[1]) + 0.1} ${ice.pos.split(' ')[2]}; dur: ${2000 + i * 500}; dir: alternate; loop: true; easing: easeInOutSine`}
                  animation__rot={`property: rotation; to: ${parseFloat(ice.rot.split(' ')[0]) + 360} ${ice.rot.split(' ')[1]} ${ice.rot.split(' ')[2]}; dur: ${5000 + i * 1000}; loop: true; easing: linear`}
                ></a-box>
              ))}
           </a-entity>

           {/* Dynamic Light */}
           <a-light type="point" intensity="1.5" distance="5" color="#F5C518" position="0 1 2"></a-light>
        </a-entity>
      </a-scene>

      {/* Tombol Kembali */}
      <button 
        onClick={() => setStarted(false)} 
        style={{ 
          position: "absolute", top: "20px", right: "20px", zIndex: 10000,
          background: "rgba(215, 43, 43, 0.9)", color: "#fff", border: "none",
          padding: "12px 25px", borderRadius: "30px", cursor: "pointer",
          fontFamily: "var(--font-bebas)", fontSize: "16px", fontWeight: "bold",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      >
        KEMBALI ✕
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function TehPociAR() {
  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              (e.target as HTMLElement).style.opacity = "1";
              (e.target as HTMLElement).style.transform = "none";
            }, i * 90);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity .7s ease, transform .7s ease";
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollToAR = () => document.getElementById("ar")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo bebas">TEH <span>POCI</span></div>
        <button className="nav-btn" onClick={scrollToAR}>📷 COBA AR</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-badge">🍵 AUGMENTED REALITY EXPERIENCE</div>
        <h1 className="hero-title bebas">
          SOLUSI <span className="yellow">DIGITAL</span><br />
          TEH POCI<br />
          <span className="yellow">NAIK KELAS</span>
        </h1>
        <p className="hero-sub">
          Scan produk Teh Poci dengan kamera HP-mu dan rasakan pengalaman AR langsung — digital marketing, order online, hingga loyalty program dalam satu ekosistem modern.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={scrollToAR}>🔍 SCAN AR SEKARANG</button>
          <button className="btn-outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
            LIHAT SOLUSI ↓
          </button>
        </div>
      </section>

      {/* AR SECTION */}
      <section id="ar" className="ar-section">
        <p className="sec-label reveal">FITUR UNGGULAN</p>
        <h2 className="sec-title bebas reveal">COBA AR <span style={{ color: "var(--yellow)" }}>SEKARANG</span></h2>
        <p className="sec-sub reveal">
          Aktifkan kamera, pilih produk, dan lihat info AR muncul langsung di layar — tanpa install app apapun.
        </p>
        <div className="reveal">
          <ARCamera />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <p className="sec-label reveal">6 SOLUSI INOVATIF</p>
        <h2 className="sec-title bebas reveal" style={{ textAlign: "center" }}>FITUR UNGGULAN</h2>
        <div className="features-grid">
          {[
            { n: "01", icon: "📲", title: "DIGITAL MARKETING", desc: "Promosi aktif via Instagram, TikTok & WhatsApp. Konten harian menarik untuk tingkatkan engagement." },
            { n: "02", icon: "🛵", title: "ORDER ONLINE", desc: "WhatsApp otomatis + GoFood, GrabFood & ShopeeFood. Pesan kapan saja, di mana saja." },
            { n: "03", icon: "🆕", title: "INOVASI MENU", desc: "Cheese Cream, Brown Sugar, Lemon Fresh & Float Ice Cream — varian kekinian yang disukai semua kalangan." },
            { n: "04", icon: "🎁", title: "PROGRAM LOYALITAS", desc: "Beli 5 Gratis 1, Member Card digital, dan sistem poin QR untuk pelanggan setia." },
            { n: "05", icon: "🖥️", title: "KASIR MODERN (POS)", desc: "Catat penjualan otomatis, pantau stok, dan lihat laporan omzet harian real-time." },
            { n: "06", icon: "🏪", title: "BRANDING BOOTH", desc: "Desain booth estetik, modern, dan instagramable — identitas merek yang kuat dan profesional." },
          ].map((f) => (
            <div className="feat-card reveal" key={f.n}>
              <span className="feat-num bebas">{f.n}</span>
              <span className="feat-icon">{f.icon}</span>
              <div className="feat-title bebas">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact">
        <p className="sec-label reveal" style={{ textAlign: "center" }}>DAMPAK NYATA</p>
        <h2 className="sec-title bebas reveal" style={{ textAlign: "center" }}>APA YANG ANDA DAPATKAN</h2>
        <div className="impact-grid">
          {[
            { icon: "📈", num: "3X", label: "Potensi peningkatan penjualan via multi-platform" },
            { icon: "⚡", num: "60%", label: "Lebih cepat proses pesanan & pencatatan kasir" },
            { icon: "❤️", num: "5X", label: "Retensi pelanggan dengan loyalty program QR" },
            { icon: "🌟", num: "100%", label: "Brand image lebih profesional & terpercaya" },
          ].map((i) => (
            <div className="impact-card reveal" key={i.num}>
              <div className="impact-icon">{i.icon}</div>
              <div className="impact-num bebas">{i.num}</div>
              <div className="impact-label">{i.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 className="cta-title bebas reveal">
          SAATNYA<br />TEH POCI<br /><span style={{ color: "var(--yellow)" }}>NAIK KELAS!</span>
        </h2>
        <p className="cta-sub reveal">Modern. Inovatif. Menguntungkan.</p>
        <div className="hero-cta reveal">
          <button className="btn-primary" onClick={scrollToAR}>🍵 COBA AR SEKARANG</button>
        </div>
      </section>

      <footer>
        <p>© 2025 <span>Teh Poci</span> — Digitalisasi & Transformasi Usaha. Dibuat dengan ❤️</p>
      </footer>
    </>
  );
}
