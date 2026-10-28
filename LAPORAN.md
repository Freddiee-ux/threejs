# Laporan Praktikum Three.js

## Identitas

| Keterangan | Data |
|---|---|
| Nama | [Isi nama] |
| NRP | [Isi NRP] |
| Mata kuliah | EF234504 — Grafika Komputer |
| Praktikum | Pertemuan 6 — Introduction to Three.js |
| Judul | Mini 3D Scene dengan Three.js |

## Tujuan

Praktikum ini menerapkan konsep scene graph, kamera perspektif, geometri, material, transformasi, pencahayaan, shadow, animasi berbasis delta time, dan rendering responsif. Implementasi menggunakan Three.js di atas WebGL sehingga konsep pipeline grafika sebelumnya tetap dipakai, tetapi banyak detail buffer, shader, dan draw call dikelola oleh library.

## Perangkat dan cara menjalankan

Project menggunakan JavaScript ES Module, Node.js, Vite, dan package `three`. Jalankan `npm install`, lalu `npm run dev`; Vite akan menampilkan alamat lokal untuk membuka aplikasi.

## Rancangan scene

Scene memiliki `PerspectiveCamera` dengan FOV 42°, background biru gelap, fog, dan `WebGLRenderer` antialias. Kamera diletakkan pada koordinat (6.4, 5.1, 8.2) dan diarahkan ke bagian tengah objek. Renderer membatasi pixel ratio maksimum ke 2 dan mengubah ukuran canvas saat viewport berubah.

| Objek | Geometri | Material | Transformasi / fungsi |
|---|---|---|---|
| Kubus | BoxGeometry | MeshLambertMaterial | Diletakkan di kiri, sedikit diperbesar, berputar |
| Bola | SphereGeometry (32 × 20 segmen) | MeshPhongMaterial | Diletakkan di kanan, bergerak naik turun |
| Torus | TorusGeometry | MeshStandardMaterial | Melayang di atas objek dan berotasi |
| Kerucut | ConeGeometry | MeshNormalMaterial | Objek tambahan di sisi kanan |
| Lantai | PlaneGeometry | MeshLambertMaterial | Bidang horizontal, menerima shadow |
| Platform | CylinderGeometry | MeshStandardMaterial | Alas silinder untuk komposisi objek |

Pencahayaan terdiri dari AmbientLight sebagai penerangan dasar, DirectionalLight sebagai cahaya utama dan pembuat shadow, serta PointLight sian sebagai fill light. Kubus, bola, torus, dan kerucut mengaktifkan `castShadow`; lantai dan platform menerima shadow. HUD menampilkan jumlah mesh dan kontrol jeda animasi.

## Implementasi dan hasil

### Scene, kamera, dan renderer

`Scene` menjadi wadah objek dan cahaya. `PerspectiveCamera` menghasilkan proyeksi perspektif; `camera.lookAt()` mengarahkan kamera ke pusat komposisi. `WebGLRenderer` menghasilkan elemen canvas pada `renderer.domElement`, menggambar scene, dan memakai antialias serta shadow map.

### Geometry, material, dan transform

Setiap `Mesh` menggabungkan geometri dan material. MeshBasicMaterial tidak diperlukan pada scene ini; MeshNormalMaterial memberi warna berdasarkan arah normal permukaan, sedangkan MeshLambertMaterial dan MeshPhongMaterial menunjukkan respons terhadap cahaya. Transform posisi, rotasi, dan skala diterapkan pada object, lalu Three.js menghitung model matrix saat render.

### Lighting dan shadow

AmbientLight menjaga sisi yang tidak langsung terkena cahaya tetap terbaca. DirectionalLight memberi pencahayaan terarah dan bergerak perlahan; perubahan arah ini mengubah shading dan arah bayangan. Shadow memerlukan shadow map renderer, light dengan `castShadow`, objek caster, serta permukaan receiver.

### Animasi dan kontrol

Loop memakai `requestAnimationFrame()`. Rotasi dan gerakan menggunakan delta time agar kecepatannya dinyatakan per detik dan tidak bergantung pada jumlah frame. Tombol HUD dan tombol Space menghentikan atau melanjutkan perubahan animasi.

### Responsive rendering

Saat ukuran jendela berubah, aspect ratio kamera diperbarui, projection matrix dihitung ulang, dan ukuran renderer disesuaikan. Pixel ratio tetap dibatasi maksimal 2 untuk menjaga beban rendering.

## Eksperimen dan pengamatan

| Eksperimen | Penerapan / pengamatan |
|---|---|
| WebGL dan Three.js | Scene, camera, geometry, material, mesh, transform, light, dan renderer adalah padanan terstruktur untuk kumpulan object, projection, buffer, shader, model matrix, lighting, serta draw call WebGL. |
| Segment geometri | Sphere 32 × 20 dipakai untuk permukaan yang cukup halus. Menambah segmen memperhalus siluet, sekaligus menambah vertex dan pekerjaan GPU. |
| Material dan light | Lambert dan Phong dipakai pada objek yang menerima cahaya; Phong menampilkan highlight specular. Material Basic akan tetap tampak tanpa light karena warnanya tidak dihitung dari pencahayaan. |
| MeshNormalMaterial | Cone memakai material normal sehingga warna berubah mengikuti arah normal pada permukaannya. Ini membantu melihat orientasi permukaan. |
| Transform | Posisi, rotasi, dan skala object diubah melalui properti mesh; vertex buffer tidak perlu diedit satu per satu karena Three.js membentuk model matrix. |
| Intensitas dan arah light | AmbientLight memberi terang dasar tanpa arah. DirectionalLight menghasilkan shading dan shadow yang berubah ketika posisinya digerakkan. |
| Shadow | Kubus, bola, torus, dan kerucut menjadi caster. Lantai menerima shadow, sementara platform juga menerima shadow untuk menjaga kontak visual. |
| FOV | FOV menentukan lebar bidang pandang perspektif: nilai lebih kecil mempersempit pandangan, nilai lebih besar memberi perspektif yang lebih lebar. |
| Resize | Aspect kamera dan projection matrix harus berubah bersama ukuran renderer agar bentuk tidak terdistorsi. |
| Delta time | `rotation += speed * delta` menyatakan kecepatan per detik sehingga animasi lebih konsisten dibanding penambahan tetap per frame. |

## Challenge yang dikerjakan

1. **Tambah geometry:** TorusGeometry dan ConeGeometry ditambahkan dengan material, transform, dan posisi masing-masing.
2. **Light animation:** DirectionalLight bergerak mengikuti fungsi sinus dan cosinus sehingga arah pencahayaan serta shadow berubah.
3. **Toggle animation:** tombol HUD dan tombol Space menjeda atau melanjutkan animasi. Space hanya diproses sekali untuk setiap penekanan.

## Jawaban konsep

1. Three.js adalah library tingkat tinggi di atas WebGL; ia menyederhanakan API, tetapi tidak menghilangkan buffer, shader, matriks, dan draw call dari proses di belakangnya.
2. Scene menyimpan object yang akan dirender. Kamera menentukan sudut pandang dan proyeksi; FOV adalah sudut pandang vertikal, aspect adalah rasio lebar terhadap tinggi, sedangkan near dan far membatasi rentang kedalaman yang dirender.
3. `renderer.domElement` adalah canvas HTML untuk hasil render. Geometry menyimpan vertex dan attribute seperti position, normal, dan UV; material menentukan cara permukaan tersebut di-shade.
4. Mesh adalah pasangan geometry dan material. `scene.add()` memasukkan object ke scene agar ikut dirender. `position`, `rotation`, dan `scale` menentukan transform yang dirangkum dalam model matrix.
5. Object3D adalah basis untuk object yang dapat ditransformasi dan disusun dalam hierarchy. AmbientLight memberi pencahayaan tanpa arah; DirectionalLight memberi cahaya dari arah tertentu.
6. MeshBasicMaterial tidak memakai kalkulasi cahaya, sedangkan Lambert dan Phong merespons cahaya. MeshNormalMaterial memvisualisasikan arah normal. Phong menambahkan highlight specular.
7. `castShadow` menandai object yang membuat bayangan dan `receiveShadow` menandai permukaan yang menampilkannya. Shadow map renderer dan pengaturan light juga harus aktif.
8. `requestAnimationFrame()` menyelaraskan loop dengan refresh browser. Delta time mengukur durasi antar-frame sehingga kecepatan animasi dapat dihitung per detik.
9. Resize renderer tanpa memperbarui aspect kamera dapat meregangkan gambar. `updateProjectionMatrix()` menerapkan kembali parameter kamera yang berubah.

## Refleksi

Three.js membuat scene 3D lebih cepat dibangun daripada WebGL manual karena object, kamera, material, dan pencahayaan memiliki API yang langsung digunakan. Abstraksi yang paling membantu adalah Mesh yang menggabungkan geometry dan material dalam satu object. Geometry tetap menyimpan vertex dan normal, sehingga konsep buffer dari WebGL masih relevan. Material mengatur bagaimana warna permukaan berinteraksi dengan shader dan cahaya. Konfigurasi shadow paling mudah terlewat karena renderer, light, object caster, dan receiver semuanya perlu disiapkan. Delta time membuat laju animasi dinyatakan per detik, bukan per frame. Tantangan praktikum ini adalah menyelaraskan transform scene, cahaya, dan kamera agar seluruh objek tampak jelas dalam satu komposisi.

## Kesimpulan

Mini scene ini menerapkan komponen dasar Three.js: scene, perspektif camera, beberapa geometri dan material, transformasi object, ambient serta directional lighting, shadow, loop animasi delta time, kontrol jeda, dan resize. Dua challenge geometri tambahan dan animasi cahaya serta satu challenge toggle animasi memperluas scene sambil tetap memakai struktur dasar praktikum.
