import golangArticleCover from '../assets/golang-article-cover.jpg';
import type { Article } from '../types';

export const articles: Article[] = [
  {
    slug: 'membangun-rest-api-golang-yang-rapi-dan-bisa-langsung-dijalankan',
    title: 'Membangun REST API Golang yang Rapi, Mudah Dibaca, dan Bisa Langsung Dijalankan',
    excerpt:
      'Artikel ini fokus ke contoh yang praktis: struktur sederhana, handler yang jelas, dan potongan kode Go yang bisa langsung di-copy, di-paste, lalu dijalankan.',
    date: '2026-03-13',
    readTime: '8 menit baca',
    tags: ['Golang', 'REST API', 'Runnable Code'],
    category: 'Backend Engineering',
    author: 'Muhammad Daffa Ramadhan',
    image: golangArticleCover,
    imageAlt: 'Cover article about Golang and backend development',
    sections: [
      {
        type: 'paragraph',
        content:
          'Kalau sebuah artikel teknis ingin benar-benar membantu, contoh kodenya tidak boleh hanya terlihat bagus. Kode harus mudah dibaca, gampang dicopy, dan tetap masuk akal saat langsung dijalankan di local environment.',
      },
      {
        type: 'paragraph',
        content:
          'Di bawah ini saya bikin contoh REST API kecil dengan Go standar library. Tidak ada framework tambahan, jadi lebih mudah dipahami dan cocok untuk dijadikan fondasi sebelum masuk ke project yang lebih besar.',
      },
      {
        type: 'heading',
        content: '1. Mulai dari file utama yang langsung runnable',
      },
      {
        type: 'paragraph',
        content:
          'Contoh ini membuat endpoint `GET /health` dan `GET /users`. Fokusnya adalah handler yang eksplisit, response JSON yang rapi, dan konfigurasi server yang jelas.',
      },
      {
        type: 'code',
        language: 'go',
        fileName: 'main.go',
        caption: 'File ini sudah cukup untuk dijalankan sebagai API kecil di local.',
        command: 'go run main.go',
        code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type User struct {
	ID    int    \`json:"id"\`
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/users", usersHandler)

	server := &http.Server{
		Addr:         ":8080",
		Handler:      loggingMiddleware(mux),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		IdleTimeout:  10 * time.Second,
	}

	log.Println("server running on http://localhost:8080")
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"error": "method not allowed",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
	})
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"error": "method not allowed",
		})
		return
	}

	users := []User{
		{ID: 1, Name: "Daffa", Email: "daffa@example.com"},
		{ID: 2, Name: "Alya", Email: "alya@example.com"},
	}

	writeJSON(w, http.StatusOK, users)
}

func writeJSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}`,
      },
      {
        type: 'heading',
        content: '2. Jalankan dengan command yang sederhana',
      },
      {
        type: 'paragraph',
        content:
          'Karena contoh ini memakai standar library, kamu tidak perlu setup dependency tambahan. Cukup simpan file, lalu jalankan command berikut dari folder project.',
      },
      {
        type: 'code',
        language: 'bash',
        fileName: 'terminal',
        caption: 'Urutan command paling singkat untuk mengetes API.',
        command: 'curl http://localhost:8080/users',
        code: `go mod init simple-go-api
go run main.go

# test endpoint health
curl http://localhost:8080/health

# test endpoint users
curl http://localhost:8080/users`,
      },
      {
        type: 'heading',
        content: '3. Kenapa format seperti ini lebih enak dibaca',
      },
      {
        type: 'list',
        items: [
          'Setiap blok kode punya nama file atau konteks command, jadi pembaca tidak menebak-nebak.',
          'Line number membantu scanning visual, tapi tidak ikut tercopy saat tombol copy dipakai.',
          'Contrast dibuat lebih lembut supaya mata tidak cepat lelah saat membaca kode panjang.',
          'Contoh kodenya runnable, jadi artikel terasa praktis, bukan hanya dekoratif.',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Kalau nanti kamu ingin scale contoh ini, langkah berikutnya biasanya adalah memisahkan route, handler, service, dan repository ke package yang berbeda. Tapi untuk artikel, saya sengaja mulai dari satu file yang bersih agar alurnya mudah diikuti.',
      },
      {
        type: 'highlight',
        title: 'Intinya',
        content:
          'Artikel teknis yang bagus bukan cuma soal layout yang keren. Yang lebih penting adalah pembaca bisa memahami isi kode dengan cepat, menyalinnya tanpa friksi, lalu menjalankannya tanpa perlu menebak konteks yang hilang.',
      },
    ],
  },
  {
    slug: 'hal-hal-yang-saya-pelajari-setelah-menggunakan-golang-selama-2-tahun',
    title: 'Hal-Hal yang Saya Pelajari Setelah Menggunakan Golang Selama Kurang Lebih 2 Tahun di Dunia Profesional',
    excerpt:
      'Refleksi singkat tentang bagaimana Go mengubah cara saya melihat backend development, mulai dari kesederhanaan syntax sampai kemudahan deployment di production.',
    date: '2026-03-10',
    readTime: '7 menit baca',
    tags: ['Golang', 'Backend', 'Career Notes'],
    category: 'Backend Engineering',
    author: 'Muhammad Daffa Ramadhan',
    image: golangArticleCover,
    imageAlt: 'Cover article about Golang and backend development',
    sections: [
      {
        type: 'paragraph',
        content:
          'Selama kurang lebih dua tahun menggunakan Golang di dunia profesional, ada beberapa hal yang benar-benar mengubah cara saya melihat backend development.',
      },
      {
        type: 'paragraph',
        content:
          'Awalnya saya mengira Golang hanyalah bahasa yang sederhana tanpa banyak fitur dibandingkan bahasa lain. Namun setelah menggunakannya dalam proyek nyata, saya mulai memahami kenapa banyak perusahaan memilih Go untuk membangun sistem backend mereka.',
      },
      {
        type: 'paragraph',
        content:
          'Berikut beberapa hal yang paling terasa bagi saya selama bekerja dengan Go dan kenapa pengalaman ini cukup membentuk cara saya menulis kode sampai hari ini.',
      },
      {
        type: 'heading',
        content: '1. Kesederhanaan adalah kekuatan utama Go',
      },
      {
        type: 'paragraph',
        content:
          'Saat pertama kali belajar Go, saya sempat merasa bahasa ini terlalu sederhana. Tidak banyak fitur seperti inheritance yang kompleks atau abstraksi berlapis yang sering ditemukan di bahasa lain.',
      },
      {
        type: 'paragraph',
        content:
          'Namun di dunia profesional, kesederhanaan itu justru menjadi kekuatan. Codebase lebih mudah dibaca, lebih mudah dipahami anggota tim lain, dan proses onboarding developer baru terasa lebih cepat. Ketika ada masalah di production, proses debugging juga cenderung lebih jelas karena struktur kodenya tidak berputar-putar.',
      },
      {
        type: 'heading',
        content: '2. Concurrency di Go sangat powerful',
      },
      {
        type: 'paragraph',
        content:
          'Salah satu hal yang paling menarik dari Golang adalah model concurrency-nya. Dengan goroutine, kita bisa menjalankan banyak pekerjaan secara bersamaan dengan cara yang ringan dan efisien.',
      },
      {
        type: 'list',
        items: [
          'Melakukan beberapa API call secara bersamaan.',
          'Memproses background job tanpa membebani request utama.',
          'Menjalankan worker untuk task dalam jumlah besar dengan lebih hemat resource.',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Konsep channel juga membantu goroutine saling berkomunikasi dengan pola yang lebih terstruktur. Saat dipakai dengan disiplin yang baik, concurrency di Go terasa praktis, bukan sekadar fitur yang terlihat keren di atas kertas.',
      },
      {
        type: 'heading',
        content: '3. Go memaksa developer menulis kode yang eksplisit',
      },
      {
        type: 'paragraph',
        content:
          'Salah satu hal yang paling sering diperdebatkan adalah cara Go menangani error. Go tidak mengandalkan exception seperti banyak bahasa lain. Sebagai gantinya, error dicek secara eksplisit hampir di setiap langkah penting.',
      },
      {
        type: 'paragraph',
        content:
          'Awalnya pendekatan ini terasa cukup verbose. Namun setelah dipakai di production, saya justru merasa alur program menjadi lebih jelas dan kemungkinan error terlewat menjadi lebih kecil. Kode memang sedikit lebih panjang, tetapi niat dari setiap langkah jadi lebih transparan.',
      },
      {
        type: 'heading',
        content: '4. Tooling Go sangat nyaman digunakan',
      },
      {
        type: 'paragraph',
        content:
          'Hal lain yang sangat terasa setelah menggunakan Go adalah tooling-nya yang rapi dan solid. Banyak kebutuhan dasar development sudah disediakan langsung oleh ekosistem Go tanpa perlu konfigurasi yang berlebihan.',
      },
      {
        type: 'list',
        items: [
          '`go fmt` untuk formatting code.',
          '`go mod` untuk dependency management.',
          '`go test` untuk testing.',
          '`go build` untuk build aplikasi.',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Dengan tooling yang terintegrasi seperti ini, workflow development terasa lebih konsisten. Tim tidak perlu terlalu banyak berdebat soal standar dasar karena sebagian besar sudah dibawa langsung oleh bahasa dan toolchain-nya.',
      },
      {
        type: 'heading',
        content: '5. Deployment menjadi sangat mudah',
      },
      {
        type: 'paragraph',
        content:
          'Salah satu hal yang paling saya sukai dari Golang adalah proses deployment-nya. Go dapat menghasilkan satu file binary yang sudah berisi semua yang dibutuhkan untuk menjalankan aplikasi, sehingga kita tidak perlu menyiapkan runtime tambahan di server.',
      },
      {
        type: 'paragraph',
        content:
          'Pendekatan ini membuat proses deploy ke server Linux maupun environment berbasis container menjadi jauh lebih sederhana. Dari sisi operasional, kesederhanaan ini sangat berharga karena mengurangi potensi masalah di tahap release.',
      },
      {
        type: 'highlight',
        title: 'Penutup',
        content:
          'Setelah sekitar dua tahun menggunakan Golang di dunia profesional, saya mulai memahami filosofi utama dari bahasa ini: simplicity and practicality. Go mungkin tidak menawarkan banyak fitur yang kompleks, tetapi justru kesederhanaannya membuat bahasa ini sangat kuat untuk membangun sistem backend yang stabil, efisien, dan mudah dirawat.',
      },
    ],
  },
];

export const featuredArticle = articles[0];
