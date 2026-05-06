import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  emoji: string;
  name: string;
  desc: string;
  price: string;
  tag: string;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, emoji: "🧋", name: "Teh Poci Cheese Cream", desc: "Teh premium dengan topping keju creamy yang lembut dan gurih", price: "Rp 18.000", tag: "BEST SELLER", color: "#F5C518" },
  { id: 2, emoji: "🍵", name: "Brown Sugar Series", desc: "Manis karamel brown sugar asli dengan teh pilihan terbaik", price: "Rp 16.000", tag: "TERLARIS", color: "#C97B2A" },
  { id: 3, emoji: "🍋", name: "Lemon Fresh", desc: "Segar menyegarkan dengan perasan lemon asli dan teh hijau", price: "Rp 14.000", tag: "BARU", color: "#7FC441" },
  { id: 4, emoji: "🍨", name: "Float Ice Cream", desc: "Kombinasi es krim vanilla lembut di atas teh dingin segar", price: "Rp 20.000", tag: "PREMIUM", color: "#E8A4C8" },
];

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
  const sceneRef = useRef<any>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAR = () => {
    setStarted(true);
  };

  useEffect(() => {
    let arSystem: any = null;
    if (started && sceneRef.current) {
      const sceneEl = sceneRef.current;
      
      const handleRenderStart = () => {
        arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem && !arSystem.started) {
          arSystem.start();
        }
      };

      sceneEl.addEventListener("renderstart", handleRenderStart);

      return () => {
        sceneEl.removeEventListener("renderstart", handleRenderStart);
        if (arSystem && arSystem.started) {
          arSystem.stop();
        }
      };
    }
  }, [started]);

  if (!started) {
    return (
      <div className="cam-wrap">
        <div className="cam-error">
          <div className="cam-error-icon">📷</div>
          <div className="sec-title bebas" style={{ fontSize: 28 }}>AKTIFKAN AR</div>
          <div className="cam-error-txt">
            Tekan tombol di bawah untuk mengaktifkan Image Tracking AR (Mind-AR). 
            Arahkan kamera ke kartu nama/logo untuk memunculkan objek 3D.
          </div>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={startAR}>
            MULAI SCANNER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div className="cam-wrap" style={{ position: "relative" }}>
        {/* A-Frame Scene Integrated with Mind-AR */}
        <a-scene 
          ref={sceneRef}
          mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
          color-space="sRGB" 
          embedded
          renderer="colorManagement: true, physicallyCorrectLights" 
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        >
          <a-assets>
            <a-asset-item id="cupModel" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/softbar/scene.gltf"></a-asset-item>
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

          <a-entity mindar-image-target="targetIndex: 0">
            <a-gltf-model 
              rotation="0 0 0" 
              position="0 0 0.1" 
              scale="0.005 0.005 0.005" 
              src="#cupModel"
              animation="property: rotation; to: 0 360 0; dur: 5000; easing: linear; loop: true"
            ></a-gltf-model>
          </a-entity>
        </a-scene>

        {/* Custom Overlay (Optional UI) */}
        <div className="cam-overlay">
          <div className="cam-status">
            <div className="rec-dot" />
            <span className="status-txt">MIND-AR ACTIVE</span>
          </div>
          
          <div className="scan-frame">
            <div className="sf-corner tl" />
            <div className="sf-corner tr" />
            <div className="sf-corner bl" />
            <div className="sf-corner br" />
            <div className="scan-line-moving" />
          </div>
        </div>
      </div>

      <p style={{ marginTop: 16, fontSize: 13, color: "rgba(255,248,237,.4)", textAlign: "center", maxWidth: 340 }}>
        Arahkan kamera ke <a href="https://github.com/hiukim/mind-ar-js/blob/master/examples/image-tracking/assets/card-example/card.png" target="_blank" style={{ color: "var(--yellow)" }}>Gambar Target ini</a> untuk melihat model 3D.
      </p>
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
