# Tugas Besar Grafika Komputer 1

| Anggota Kelompok | NIM |
|-----------------|-----------------|
| Yudi Kurniawan    | 10023634    |
| Michael Utama   | 13521137    |
| Kandida Edgina Gunawan    | 13521155    |


## Daftar Isi
- [Deskripsi Singkat](#deskripsi-singkat)
- [Penjelasan Fungsi](#penjelasan-fungsi)
- [Cara Instalasi Program](#cara-instalasi-program)
- [Cara Menjalankan Program](#cara-menjalankan-program)

## Deskripsi Singkat
Program yang dibuat merupakan program kloningan Photoshop yang dapat melakukan berbagai fungsi dasar kanvas 2D seperti menggambar (line, rectangle, square, convex polygon), melakukan berbagai transformasi pada objek (translasi, dilatasi, dan rotasi), menggerakkan titik sudut, menambah dan menghapus titik polygon, mengubah warna titik sudut, serta menyimpan dan meload model. Program ini dibangun dengan menggunakan library WebGL dan beberapa pendukung library lain seperti math.


## Penjelasan Fungsi
Berikut adalah fungsi non trivial yang bukan bawaan WebGL.
### hexToRgba()
Return nilai RGBA dengan range 0..1, jika diberikan input warna dalam bentuk heksadesimal
### getMiddlePoint() atau getCentroid()
Mengembalikan nilai titik tengah atau pusat massa pada sebuah objek, dengan asumsi massa seragam.
### Transformable.translate()
Melakukan translasi terhadap sebuah objek Transformable. Caranya dengan melakukan translasi ke seluruh titik pada objek.
### Transformable.dilate()
Melakukan dilatasi terhadap sebuah objek Transformable. Langkah:

1. Lakukan translasi sehingga centroid berada di (0,0)
2. Terapkan scale pada seluruh vertex
3. Lakukan translasi untuk mengembalikn centroid pada keadaan semula

### Transformable.rotate()
Melakukan rotasi terhadap sebuah objek Transformable. Langkah:

1. Lakukan translasi sehingga centroid berada di (0,0)
2. Terapkan scale sehingga range koordinat berubah dari [-1, 1] menjadi [-width, width] dan [-height, height]
3. Terapkan rotate
4. Terapkan scale sehingga range koordinat berubah kembali menjadi [-1, 1]
3. Lakukan translasi untuk mengembalikn centroid pada keadaan semula

### Selectable.isCoordInside()
Mengembalikan nilai true jika koordinat yang diberikan berada di dalam model. Implementasi dibebaskan sesuai objeknya, namun terdapat tiga pendekatan umum:

1. Pada titik, isCoordInside bernilai true jika max(distX, distY) kurang dari ukuran titik, yang diatur bernilai 10 dari vertex shader.
2. Pada garis, isCoordInside bernilai true jika koordinat yang diberikan berada pada jarak tertentu dengan garis. Untuk mencapai hal tersebut, digunakan nilai gradien garis dan sebuah parameter nilai toleransi.
3. Pada bangun ruang, isCoordInside bernilai true jika untuk tiap edge (P1, P2), berlaku orientasi (P1, P2, koordinat input) mengarah ke kiri. Perilaku fungsi orientasi dijelaskan di bawah.

### Polygon.orientation()
Memiliki masukan tiga titik, P1, P2, dan P3. Mengembalikan nilai berdasar arah yang dibentuk oleh garis P2-P3 terhadap garis P1-P2. Dengan kata lain, mengembalikan arah belok yang diperlukan untuk mencapai P1-P2-P3.

### Polygon.grahamScan()
Mencari convex hull dari seluruh vertex pada objek polygon. Langkahnya:

1. Pilih pivot, yaitu titik yang memiliki nilai y terkecil.
2. Sort seluruh titik sisanya berdasarkan sudut yang dibentuk dari pivot, sehingga menghasilkan list yang counter-clockwise.
3. Hapus titik yang memiliki sudut sama
4. Masukkan titik setelahnya ke dalam stack jika orientation (titik sebelum, titik top stack, titik setelahnya) bernilai negatif (counter-clockwise).

### Transformable.movePoint()
Memindahkan titik dengan id tertentu ke lokasi lain. Behavior berbeda tergantung objek. Kasus non trivial:

1. Pada rectangle, movePoint menghasilkan rectangle dengan rotasi yang sama namun panjang dan lebar yang berbeda. Hal ini dapat dicapai dengan melakukan rotasi ke rotasi awal, memindahkan titik, dan melakukan rotasi kembali.
2. Pada square, movePoint menghasilkan persegi dengan rotasi dan panjang sisi berbeda. Hal ini dapat dicapai dengan mengalikan vektor titik_baru - titik_tengah dengan matriks rotasi 90 derajat sebanyak 3 kali, untuk mendapat keempat titik sudut baru.

## Cara Instalasi Program
1. Melakukan perintah `git clone` repository ini
2. Jalankan perintah `npm install`

## Cara Menjalankan Program
1. Jalankan perintah `npm start`
2. Open `http://localhost:8080/` from your browser
