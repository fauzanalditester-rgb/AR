Berikut adalah draft **Product Requirement Document (PRD)** sederhana untuk mengintegrasikan Mind-AR ke dalam proyek berbasis web agar dapat mendeteksi gambar (*image tracking*) dan menampilkan konten 3D di layar kamera.

---

## **PRD: Web-Based AR Image Tracking (Mind-AR)**

### **1. Ringkasan Proyek**
*   **Nama Proyek:** WebAR Image Tracker
*   **Teknologi:** Mind-AR (JavaScript), A-Frame (Rendering), Next.js/HTML.
*   **Tujuan:** Memungkinkan pengguna melihat konten digital (3D/Video) di atas objek fisik (gambar/marker) melalui browser tanpa perlu instalasi aplikasi.

---

### **2. Fitur Utama**
*   **Kamera Scanner:** Mengaktifkan izin kamera perangkat secara otomatis.
*   **Image Tracking:** Mengenali target gambar spesifik (misal: brosur, logo, atau kartu nama).
*   **3D Overlay:** Menampilkan objek 3D (format `.glb` atau `.gltf`) tepat di atas target gambar yang terdeteksi.
*   **Responsive UI:** Antarmuka yang memuat indikator "Scanning" saat mencari gambar.

---

### **3. Alur Pengguna (User Flow)**
1.  User membuka URL aplikasi melalui browser HP (Safari/Chrome).
2.  User memberikan izin (permission) akses kamera.
3.  Layar menampilkan *viewfinder* kamera.
4.  User mengarahkan kamera ke gambar target yang sudah didaftarkan.
5.  Konten AR muncul di layar dan mengikuti pergerakan gambar target secara *real-time*.

---

### **4. Spesifikasi Teknis**

#### **A. Komponen Utama**
*   **Compiler Mind-AR:** Digunakan untuk mengubah gambar target (`.jpg`/`.png`) menjadi file `.mind` yang bisa dibaca sistem.
*   **A-Frame Library:** Framework untuk menangani rendering 3D di web agar lebih ringan.

#### **B. Kebutuhan Aset**
*   **Target Image:** Gambar dengan kontras tinggi (hindari gambar polos agar tracking stabil).
*   **Model 3D:** Gunakan format `.glb` yang sudah dioptimasi (ukuran file di bawah 5MB agar loading cepat di web).

---

### **5. Implementasi Kode (MVP)**

Berikut adalah struktur dasar kode untuk menampilkan hasil AR di layar:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Script Mind-AR & A-Frame -->
    <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js"></script>
  </head>
  <body>
    <!-- 
      Konfigurasi Mind-AR 
      imageTargetSrc: Link ke file .mind hasil kompilasi gambar target
    -->
    <a-scene mindar-image="imageTargetSrc: ./targets.mind;" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      
      <a-assets>
        <!-- Load Model 3D -->
        <a-asset-item id="avatarModel" src="./model.glb"></a-asset-item>
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <!-- 
        Target Index 0: Konten akan muncul saat gambar target pertama terdeteksi
      -->
      <a-entity mindar-image-target="targetIndex: 0">
        <a-gltf-model rotation="0 0 0" position="0 0 0" scale="0.1 0.1 0.1" src="#avatarModel"></a-gltf-model>
      </a-entity>
      
    </a-scene>
  </body>
</html>
```

---

### **6. Kriteria Keberhasilan (Acceptance Criteria)**
*   **Akurasi:** Objek 3D tetap menempel pada gambar target meskipun kamera bergerak sedikit (jitter minimal).
*   **Kecepatan:** Waktu *loading* awal hingga kamera aktif tidak lebih dari 5 detik pada koneksi 4G.
*   **Kompatibilitas:** Berjalan lancar di iOS (Safari) dan Android (Chrome).

---

### **7. Langkah Selanjutnya**
1.  **Kompilasi Gambar:** Gunakan [Mind-AR Web Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile) untuk membuat file `.mind`.
2.  **Hosting:** Karena menggunakan kamera, web ini **wajib** menggunakan protokol **HTTPS** (bisa menggunakan Vercel atau GitHub Pages) agar izin kamera diberikan oleh browser.