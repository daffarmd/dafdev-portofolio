import golangArticleCover from '../assets/golang-article-cover.jpg';
import restApiGolangCover from '../assets/article-rest-api-golang.png';
import expMe from '../assets/article-exp-me.png';
import type { Article } from '../types';

export const articles: Article[] = [
  {
    id: 1,
    slug: 'membangun-rest-api-golang-yang-rapi-dan-bisa-langsung-dijalankan',
    title: 'Membangun REST API Golang yang Rapi, Mudah Dibaca, dan Bisa Langsung Dijalankan',
    excerpt:
      'Artikel ini fokus ke contoh yang praktis: struktur sederhana, handler yang jelas, dan potongan kode Go yang bisa langsung di-copy, di-paste, lalu dijalankan.',
    date: '2026-03-13',
    readTime: '8 menit baca',
    tags: ['Golang', 'REST API', 'Runnable Code'],
    category: 'Backend Engineering',
    author: 'Muhammad Daffa Ramadhan',
    image: restApiGolangCover,
    imageAlt: 'Cover article about building a REST API with Golang',
    sections: [
      {
        type: 'paragraph',
        content:
          'Kalau sebuah artikel teknis ingin benar-benar membantu, contoh kodenya tidak boleh hanya terlihat bagus. Kode harus mudah dibaca, gampang dicopy, dan tetap masuk akal saat langsung dijalankan di local environment.',
      },
      {
        type: 'paragraph',
        content:
          'Di bawah ini saya membuat contoh REST API kecil dengan Go standar library. Tidak ada framework tambahan, jadi lebih mudah dipahami dan cocok untuk dijadikan gambaran sebelum masuk ke project yang lebih besar.',
      },
      {
        type: 'heading',
        content: '1. File utama yang runnable',
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
        type: 'paragraph',
        content:
          'Kalau nanti kamu ingin scale contoh ini, langkah berikutnya biasanya adalah memisahkan route, handler, service, dan repository ke package yang berbeda. Tapi untuk kali ini, saya sengaja mulai dari satu file yang clean agar alurnya mudah diikuti. dan kamu punya gambaran yang jelas tentang bagaimana struktur dasar REST API dengan Go sebelum masuk ke project yang lebih besar.',
      },
      {
        type: 'highlight',
        title: 'Intinya',
        content:
          'Artikel teknis yang bagus bukan cuma soal layout yang keren. Yang lebih penting adalah pembaca bisa memahami isi kode dengan cepat, menyalinnya tanpa friksi, lalu menjalankannya tanpa perlu menebak konteks yang hilang.',
      },
    ],
    translations: {
      en: {
        title: 'Building a Clean REST API in Golang That You Can Run Right Away',
        excerpt:
          'This article focuses on a practical example: a simple structure, clear handlers, and Go snippets you can copy, paste, and run immediately.',
        readTime: '8 min read',
        category: 'Backend Engineering',
        imageAlt: 'Cover article about building a REST API with Golang',
        sections: [
          {
            type: 'paragraph',
            content:
              'If a technical article really wants to help, the code should not only look good. It needs to be readable, easy to copy, and still make sense when you run it in a local environment.',
          },
          {
            type: 'paragraph',
            content:
              'Below I use a small REST API example with the Go standard library. There is no extra framework, so it is easier to understand and works well as a starting point before moving into larger projects.',
          },
          {
            type: 'heading',
            content: '1. A runnable main file',
          },
          {
            type: 'paragraph',
            content:
              'This example exposes `GET /health` and `GET /users`. The focus is on explicit handlers, clean JSON responses, and clear server configuration.',
          },
          {
            type: 'code',
            language: 'go',
            fileName: 'main.go',
            caption: 'This file is enough to run a small API locally.',
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
            content: '2. Run it with a simple command',
          },
          {
            type: 'paragraph',
            content:
              'Because this example only uses the standard library, you do not need any extra dependency setup. Just save the file and run the following commands from your project folder.',
          },
          {
            type: 'code',
            language: 'bash',
            fileName: 'terminal',
            caption: 'The shortest command flow to test the API.',
            command: 'curl http://localhost:8080/users',
            code: `go mod init simple-go-api
go run main.go

# test health endpoint
curl http://localhost:8080/health

# test users endpoint
curl http://localhost:8080/users`,
          },
          {
            type: 'paragraph',
            content:
              'If you want to scale this later, the next step is usually splitting routes, handlers, services, and repositories into separate packages. For now, I intentionally keep it in a single clean file so the flow is easy to follow and you get a clear picture of a basic Go REST API structure before moving into bigger projects.',
          },
          {
            type: 'highlight',
            title: 'The Point',
            content:
              'A good technical article is not only about a polished layout. What matters more is that readers can understand the code quickly, copy it without friction, and run it without guessing the missing context.',
          },
        ],
      },
    },
  },
  {
    id: 2,
    slug: 'hal-hal-yang-saya-pelajari-setelah-menggunakan-golang-selama-2-tahun',
    title: 'Hal-Hal yang Saya Pelajari Setelah Menggunakan Golang Selama Lebih dari 2 Tahun di Dunia Profesional',
    excerpt:
      'Cerita tentang perjalanan saya sebagai lulusan SMK yang langsung bekerja, kuliah sambil kerja, dan berkembang bersama Golang di dunia finance dan banking.',
    date: '2026-03-10',
    readTime: '8 menit baca',
    tags: ['Golang', 'Backend', 'Career Notes'],
    category: 'Personal Experience',
    author: 'Muhammad Daffa Ramadhan',
    image: expMe,
    imageAlt: 'Cover article about personal experience using Golang for two years',
    sections: [
      {
        type: 'paragraph',
        content:
          'Saya adalah lulusan SMK, dan pada saat artikel ini ditulis saya sedang menjalani perkuliahan sambil tetap bekerja. Setelah lulus SMK, saya memutuskan untuk langsung masuk ke dunia kerja dan bergabung dengan salah satu startup software house yang bergerak di bidang finance solution dan banking.',
      },
      {
        type: 'paragraph',
        content:
          'Di tempat kerja tersebut saya memiliki role sebagai software developer dan banyak bekerja menggunakan Golang. Dari sana, saya mulai benar-benar mengenal bagaimana Go dipakai bukan hanya untuk belajar atau eksperimen kecil, tetapi untuk sistem yang menyentuh kebutuhan bisnis yang nyata.',
      },
      {
        type: 'heading',
        content:
          '1. Golang mempertemukan saya dengan dunia backend yang lebih serius',
      },
      {
        type: 'paragraph',
        content:
          'Dari pekerjaan pertama saya itu, saya cukup banyak mendapatkan ilmu yang sebelumnya hanya saya dengar sekilas. Saya belajar tentang security, microservices, payment gateway, REST API, dan juga H2H. Hal yang menarik bagi saya, banyak dari kebutuhan tersebut dikerjakan menggunakan Golang.',
      },
      {
        type: 'paragraph',
        content:
          'Pengalaman itu membuat saya sadar bahwa backend development bukan sekadar membuat endpoint lalu selesai. Ada tanggung jawab yang lebih besar, terutama ketika sistem berkaitan dengan transaksi, integrasi antarsistem, dan kebutuhan reliability yang tinggi.',
      },
      {
        type: 'heading',
        content: '2. Bekerja sambil tetap belajar membuat saya berkembang lebih cepat',
      },
      {
        type: 'paragraph',
        content:
          'Walaupun saya sudah bekerja, saya merasa proses belajar saya tidak boleh berhenti di kantor saja. Karena itu, di luar pekerjaan saya juga berusaha terus mengimprove diri. Salah satu bentuknya adalah menulis artikel seperti ini, mengambil pekerjaan freelance,membuat produk atau aplikasi sendiri, dan membangun website portfolio saya sendiri.',
      },
      {
        type: 'paragraph',
        content:
          'Saya banyak belajar secara otodidak, terutama lewat dokumentasi resmi, eksplorasi mandiri, dan mengikuti beberapa course. Menurut saya, proses belajar seperti ini cukup menantang, tetapi justru sangat membantu karena saya dipaksa untuk benar-benar memahami dasar-dasarnya satu per satu.',
      },
      {
        type: 'heading',
        content: '3. Hal-hal di Golang yang sejauh ini sudah saya pahami',
      },
      {
        type: 'list',
        items: [
          'Golang modules untuk dependency management.',
          'Concurrency, goroutines, dan cara berpikir asynchronous yang lebih rapi.',
          'Unit testing untuk menjaga behaviour code tetap konsisten.',
          'Context untuk request lifecycle, cancellation, dan timeout.',
          'Go database untuk kebutuhan akses data.',
          'Go embed untuk memanfaatkan asset atau file langsung dari binary.',
          'Go web dan `httprouter` untuk membangun service yang lebih terstruktur.',
          'Go JSON untuk proses encoding dan decoding data.',
          'REST API di Golang sebagai fondasi utama yang paling sering saya pakai.',
        ],
      },
      {
        type: 'paragraph',
        content:
          'Semua itu adalah hal-hal yang sejauh ini saya pahami, dan saya sadar perjalanan saya masih panjang. Masih banyak area yang ingin saya dalami lebih jauh, baik dari sisi arsitektur, performa, observability, maupun best practice dalam membangun backend yang lebih matang.',
      },
      {
        type: 'heading',
        content: '4. Golang bukan tujuan akhir, tapi kendaraan untuk terus berkembang',
      },
      {
        type: 'paragraph',
        content:
          'Buat saya, dua tahun terakhir menggunakan Golang bukan hanya soal belajar syntax atau framework. Yang lebih penting adalah bagaimana pengalaman itu membentuk cara saya berpikir sebagai developer: lebih disiplin, lebih sadar terhadap kualitas code, dan lebih paham bahwa software yang baik harus bisa dipelihara, diamankan, dan diandalkan.',
      },
      {
        type: 'paragraph',
        content:
          'Saya juga merasa proses bekerja sambil kuliah dan terus belajar secara mandiri membuat saya lebih menghargai progres kecil. Menulis artikel ini adalah salah satu bentuk pengingat buat diri saya sendiri bahwa apa yang saya pahami hari ini adalah hasil dari proses yang terus berjalan, dan proses itu akan terus meningkat seiring waktu.',
      },
      {
        type: 'highlight',
        title: 'Penutup',
        content:
          'Kalau saya melihat ke belakang, perjalanan saya bersama Golang selama kurang lebih dua tahun ini bukan hanya memberi saya skill teknis, tetapi juga memberi saya arah. Saya mulai dari lulusan SMK yang langsung bekerja, lalu belajar sambil menjalani perkuliahan, dan sedikit demi sedikit memahami bagaimana membangun backend yang lebih baik. Untuk sekarang, inilah yang saya pahami, dan saya yakin kemampuan itu akan terus bertumbuh.',
      },
    ],
    translations: {
      en: {
        title: 'What I Learned After Using Golang for More Than 2 Years Professionally',
        excerpt:
          'A story about my journey as a vocational school graduate who started working right away, studied while working, and kept growing with Golang in finance and banking.',
        readTime: '8 min read',
        category: 'Personal Experience',
        imageAlt: 'Cover article about personal experience using Golang for two years',
        sections: [
          {
            type: 'paragraph',
            content:
              'I am a vocational high school graduate, and when this article is written I am also pursuing college while continuing to work. After graduating, I chose to go straight into the industry and joined a startup software house working in finance solutions and banking.',
          },
          {
            type: 'paragraph',
            content:
              'At that company, I worked as a software developer and spent a lot of time using Golang. That was where I truly saw how Go is used not only for learning or small experiments, but for systems that support real business needs.',
          },
          {
            type: 'heading',
            content: '1. Golang introduced me to a more serious backend world',
          },
          {
            type: 'paragraph',
            content:
              'From that first job, I learned many things that I had only heard about before. I was exposed to security, microservices, payment gateways, REST APIs, and H2H integrations. What stood out to me was that many of those systems were built with Golang.',
          },
          {
            type: 'paragraph',
            content:
              'That experience made me realize that backend development is not just about creating an endpoint and calling it done. There is a bigger responsibility, especially when the system deals with transactions, cross-system integrations, and reliability.',
          },
          {
            type: 'heading',
            content: '2. Working while learning made me grow faster',
          },
          {
            type: 'paragraph',
            content:
              'Even though I was already working, I felt that my learning process should not stop at the office. Because of that, I kept improving myself outside work too. Writing articles like this, taking freelance work, building my own products, and creating this portfolio website are some of the ways I keep growing.',
          },
          {
            type: 'paragraph',
            content:
              'I learned a lot through self-study, especially by reading official documentation, exploring things on my own, and following a few courses. In my opinion, this kind of learning is challenging, but it helps a lot because it forces me to understand the fundamentals step by step.',
          },
          {
            type: 'heading',
            content: '3. Things in Golang that I understand so far',
          },
          {
            type: 'list',
            items: [
              'Golang modules for dependency management.',
              'Concurrency, goroutines, and a cleaner asynchronous mindset.',
              'Unit testing to keep code behaviour consistent.',
              'Context for request lifecycle, cancellation, and timeout handling.',
              'Go database usage for data access.',
              'Go embed for bundling assets or files directly into binaries.',
              'Go web and `httprouter` for building more structured services.',
              'Go JSON for encoding and decoding data.',
              'REST APIs in Golang as the foundation I use most often.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Those are the things I understand so far, and I know the journey is still long. There is still a lot I want to explore more deeply, especially around architecture, performance, observability, and best practices for building stronger backend systems.',
          },
          {
            type: 'heading',
            content: '4. Golang is not the final destination, but a vehicle for growth',
          },
          {
            type: 'paragraph',
            content:
              'For me, the last two years with Golang were not only about learning syntax or frameworks. More importantly, that experience shaped the way I think as a developer: more disciplined, more aware of code quality, and more conscious that good software must be maintainable, secure, and reliable.',
          },
          {
            type: 'paragraph',
            content:
              'I also feel that working while studying and continuing to learn independently makes me appreciate small progress more. Writing this article is one way to remind myself that what I understand today is the result of an ongoing process, and that process will keep improving over time.',
          },
          {
            type: 'highlight',
            title: 'Closing Thoughts',
            content:
              'When I look back, my journey with Golang for more than two years has given me more than technical skills. It has also given me direction. I started as a vocational school graduate who went straight into work, then kept learning while studying in college, and little by little I began to understand how to build better backend systems. This is what I understand for now, and I believe it will continue to grow.',
          },
        ],
      },
    },
  },
];

export const featuredArticle = articles[0];
