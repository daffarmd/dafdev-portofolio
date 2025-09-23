import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, User, BookOpen, Copy } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const ArticleDetail: React.FC = () => {
  // Data dummy untuk artikel dalam bahasa Indonesia
  const articles = [
    {
      id: "1",
      title: "Memahami React Hooks Secara Mendalam",
      content: `
        <div class="article-content">
          <p class="paragraph">React Hooks telah merevolusi cara kita menulis komponen React. Diperkenalkan di React 16.8, Hooks memungkinkan kita menggunakan state dan fitur React lainnya tanpa perlu menulis komponen kelas. Ini merupakan terobosan penting dalam pengembangan aplikasi React modern.</p>
          
          <p class="paragraph">Dengan adopsi Hooks, kode menjadi lebih ringkas dan mudah dipahami. Pengembang tidak lagi perlu khawatir tentang perbedaan antara komponen kelas dan fungsi, karena sekarang semua komponen dapat menggunakan state dan lifecycle methods dengan cara yang konsisten.</p>
          
          <h2 class="heading-primary">Apa itu React Hooks?</h2>
          
          <p class="paragraph">Hooks adalah fungsi khusus yang memungkinkan Anda "terhubung" ke fitur React dari komponen fungsi. Mereka tidak bekerja di dalam kelas — mereka memungkinkan Anda menggunakan React tanpa kelas. Konsep ini memungkinkan pengembang untuk menggunakan state dan fitur React lainnya dalam komponen fungsi.</p>
          
          <p class="paragraph">Sebelum Hooks, komponen fungsi hanya digunakan untuk komponen sederhana yang tidak memerlukan state atau lifecycle methods. Dengan Hooks, komponen fungsi sekarang dapat melakukan segala yang bisa dilakukan komponen kelas, bahkan lebih.</p>
          
          <div class="tip-box">
            <p class="tip-content"><strong>Tip Profesional:</strong> Hooks memungkinkan Anda menggunakan kembali logika stateful antar komponen tanpa mengubah hierarki komponen. Ini menjadikan kode lebih modular dan mudah dikelola.</p>
          </div>
          
          <h2 class="heading-primary">Hook useState</h2>
          
          <p class="paragraph">Hook useState adalah hook yang paling fundamental. Ini memungkinkan Anda menambahkan state ke komponen fungsi. useState mengembalikan sepasang nilai: state saat ini dan fungsi untuk memperbaruinya.</p>
          
          <p class="paragraph">Berikut adalah contoh penggunaan useState dalam komponen React:</p>
          
          <div class="code-block-container">
            <button class="copy-button">
              <Copy class="copy-icon" />
            </button>
            <pre class="code-block">
              <code class="code-content">{\`import React, { useState } from 'react';

function Contoh() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Anda telah mengklik {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}\`}</code>
            </pre>
          </div>
          
          <p class="paragraph">Dalam contoh di atas, kita mendeklarasikan state count dengan nilai awal 0. Fungsi setCount digunakan untuk memperbarui nilai state tersebut. Setiap kali tombol diklik, nilai count akan bertambah satu.</p>
          
          <h2 class="heading-primary">Hook useEffect</h2>
          
          <p class="paragraph">Hook useEffect memungkinkan Anda melakukan efek samping dalam komponen fungsi. Ini melayani tujuan yang sama dengan componentDidMount, componentDidUpdate, dan componentWillUnmount dalam kelas React.</p>
          
          <p class="paragraph">useEffect menjalankan fungsi setelah setiap render. Ini memungkinkan sinkronisasi komponen dengan sistem eksternal, seperti API, timer, atau subscription lainnya.</p>
          
          <div class="code-block-container">
            <button class="copy-button">
              <Copy class="copy-icon" />
            </button>
            <pre class="code-block">
              <code class="code-content">{\`import React, { useState, useEffect } from 'react';

function Contoh() {
  const [count, setCount] = useState(0);

  // Mirip dengan componentDidMount dan componentDidUpdate:
  useEffect(() => {
    // Memperbarui judul dokumen menggunakan API browser
    document.title = \`Anda telah mengklik \${count} kali\`;
  });

  return (
    <div>
      <p>Anda telah mengklik {count} kali</p>
      <button onClick={() => setCount(count + 1)}>
        Klik saya
      </button>
    </div>
  );
}\`}</code>
            </pre>
          </div>
          
          <p class="paragraph">Dalam contoh ini, useEffect memperbarui judul dokumen setiap kali nilai count berubah. Ini menunjukkan bagaimana efek dapat digunakan untuk sinkronisasi dengan API browser.</p>
          
          <h2 class="heading-primary">Praktik Terbaik</h2>
          
          <p class="paragraph">Untuk memastikan kode yang bersih dan bebas bug, ada beberapa praktik terbaik yang perlu diikuti saat menggunakan Hooks:</p>
          
          <div class="best-practices-grid">
            <div class="practice-card">
              <h3 class="practice-title">Aturan Utama</h3>
              <ul class="practice-list">
                <li class="practice-item">Hanya panggil Hooks di tingkat atas</li>
                <li class="practice-item">Jangan panggil Hooks di dalam loop</li>
                <li class="practice-item">Hindari memanggil Hooks dalam kondisi bersarang</li>
              </ul>
            </div>
            <div class="practice-card">
              <h3 class="practice-title">Pengembangan</h3>
              <ul class="practice-list">
                <li class="practice-item">Gunakan plugin lint Rules of Hooks</li>
                <li class="practice-item">Custom Hooks dimulai dengan "use"</li>
                <li class="practice-item">Gunakan ESLint untuk deteksi error</li>
              </ul>
            </div>
          </div>
          
          <div class="warning-box">
            <p class="warning-content"><strong>Peringatan Penting:</strong> Jangan memanggil Hooks dari dalam loop, kondisi, atau fungsi bersarang. Ini memastikan bahwa Hooks dipanggil dalam urutan yang sama setiap kali komponen dirender.</p>
          </div>
          
          <h2 class="heading-primary">Kesimpulan</h2>
          
          <p class="paragraph">React Hooks memberikan API yang lebih langsung ke konsep React yang sudah Anda kenal: props, state, context, refs, dan lifecycle. Mereka menawarkan cara yang kuat dan ekspresif untuk menyusun perilaku dan berbagi logika stateful antar komponen.</p>
          
          <p class="paragraph">Dengan penguasaan useState dan useEffect, pengembang dapat membuat aplikasi yang lebih efisien dan mudah dikelola. Langkah selanjutnya adalah mengeksplorasi hook lain seperti useCallback, useMemo, dan useContext untuk pengalaman pengembangan yang lebih optimal.</p>
          
          <div class="next-steps-box">
            <h3 class="next-steps-title">Langkah Selanjutnya</h3>
            <p class="next-steps-content">Setelah menguasai useState dan useEffect, eksplorasi hook lain seperti useCallback, useMemo, dan useContext untuk pengalaman pengembangan yang lebih optimal.</p>
            <div class="tags-container">
              <span class="tag">useState</span>
              <span class="tag">useEffect</span>
              <span class="tag">useCallback</span>
              <span class="tag">useMemo</span>
            </div>
          </div>
        </div>
      `,
      date: "2025-09-15",
      readTime: "8 menit baca",
      tags: ["React", "JavaScript", "Frontend"],
      category: "Pengembangan Frontend",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "2",
      title: "Membangun RESTful API dengan Node.js dan Express",
      content: `
        <div class="article-content">
          <p class="paragraph">Membuat RESTful API dengan Node.js dan Express adalah keterampilan fundamental bagi pengembang backend modern. Panduan ini akan membimbing Anda melalui konsep penting dan praktik terbaik dalam pengembangan API.</p>
          
          <p class="paragraph">REST (Representational State Transfer) adalah gaya arsitektur yang digunakan untuk mendesain layanan web. API yang dibangun dengan prinsip REST memungkinkan sistem yang berbeda untuk berkomunikasi dengan cara yang standar dan efisien.</p>
          
          <h2 class="heading-primary">Menyiapkan Proyek Anda</h2>
          
          <p class="paragraph">Langkah pertama dalam membangun RESTful API adalah menyiapkan proyek dan menginstal dependensi yang diperlukan. Proses ini melibatkan inisialisasi proyek Node.js dan menambahkan paket yang dibutuhkan.</p>
          
          <div class="code-block-container">
            <button class="copy-button">
              <Copy class="copy-icon" />
            </button>
            <pre class="code-block">
              <code class="code-content">{\`mkdir my-api
cd my-api
npm init -y
npm install express cors helmet dotenv
npm install -D nodemon\`}</code>
            </pre>
          </div>
          
          <p class="paragraph">Dalam perintah di atas, kita menginstal beberapa paket penting:</p>
          <ul class="list-content">
            <li><strong>express</strong>: Framework web untuk Node.js</li>
            <li><strong>cors</strong>: Middleware untuk mengaktifkan CORS</li>
            <li><strong>helmet</strong>: Middleware untuk keamanan aplikasi</li>
            <li><strong>dotenv</strong>: Untuk memuat variabel lingkungan dari file .env</li>
            <li><strong>nodemon</strong>: Alat pengembangan untuk restart otomatis server</li>
          </ul>
          
          <h2 class="heading-primary">Server Express Dasar</h2>
          
          <p class="paragraph">Setelah dependensi terinstal, langkah berikutnya adalah membuat server Express dasar. Server ini akan menjadi fondasi dari API kita dan menangani berbagai permintaan dari klien.</p>
          
          <div class="code-block-container">
            <button class="copy-button">
              <Copy class="copy-icon" />
            </button>
            <pre class="code-block">
              <code class="code-content">{\`const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API kami!' });
});

// Middleware penanganan error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan!' });
});

app.listen(PORT, () => {
  console.log(\`Server berjalan di port \${PORT}\`);
});\`}</code>
            </pre>
          </div>
          
          <div class="info-box">
            <p class="info-content"><strong>Info Keamanan:</strong> Helmet membantu mengamankan aplikasi Express dengan mengatur berbagai header HTTP. Ini merupakan langkah penting dalam melindungi API dari serangan umum.</p>
          </div>
          
          <h2 class="heading-primary">Routing RESTful</h2>
          
          <p class="paragraph">Routing adalah proses menentukan bagaimana aplikasi merespons permintaan klien ke endpoint tertentu. Dalam RESTful API, endpoint harus mengikuti konvensi yang konsisten dan intuitif.</p>
          
          <div class="routing-grid">
            <div class="routing-card">
              <h3 class="routing-title">
                <span class="routing-number">1</span>
                Metode GET
              </h3>
              <ul class="routing-list">
                <li class="routing-item">
                  <span class="method-tag">GET</span>
                  <span>/api/users - Mengambil semua pengguna</span>
                </li>
                <li class="routing-item">
                  <span class="method-tag">GET</span>
                  <span>/api/users/:id - Mengambil pengguna spesifik</span>
                </li>
              </ul>
            </div>
            <div class="routing-card">
              <h3 class="routing-title">
                <span class="routing-number">2</span>
                Metode POST/PUT/DELETE
              </h3>
              <ul class="routing-list">
                <li class="routing-item">
                  <span class="method-tag">POST</span>
                  <span>/api/users - Membuat pengguna baru</span>
                </li>
                <li class="routing-item">
                  <span class="method-tag">PUT</span>
                  <span>/api/users/:id - Memperbarui pengguna spesifik</span>
                </li>
                <li class="routing-item">
                  <span class="method-tag">DELETE</span>
                  <span>/api/users/:id - Menghapus pengguna spesifik</span>
                </li>
              </ul>
            </div>
          </div>
          
          <h2 class="heading-primary">Integrasi Database</h2>
          
          <p class="paragraph">Untuk aplikasi yang lebih kompleks, integrasi database menjadi kebutuhan penting. Anda dapat menggunakan ORM seperti Sequelize atau Mongoose, atau query builder seperti Knex.js untuk memudahkan interaksi dengan database.</p>
          
          <p class="paragraph">Berikut contoh sederhana dengan data mock yang menunjukkan bagaimana operasi CRUD dasar dapat diimplementasikan:</p>
          
          <div class="code-block-container">
            <button class="copy-button">
              <Copy class="copy-icon" />
            </button>
            <pre class="code-block">
              <code class="code-content">{\`// Mock data store (ganti dengan database sebenarnya)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET semua pengguna
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET pengguna berdasarkan ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  }
  res.json(user);
});

// POST membuat pengguna baru
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Nama dan email wajib diisi' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});\`}</code>
            </pre>
          </div>
          
          <h2 class="heading-primary">Kesimpulan</h2>
          
          <p class="paragraph">Ini adalah konsep fundamental untuk membangun RESTful API dengan Node.js dan Express. Dengan memahami prinsip-prinsip ini, Anda dapat membangun API yang robust dan scalable.</p>
          
          <p class="paragraph">Saat Anda berkembang, pertimbangkan untuk mengimplementasikan autentikasi, validasi, logging, dan testing untuk membuat API yang kuat dan dapat diandalkan dalam produksi.</p>
          
          <div class="next-steps-box">
            <h3 class="next-steps-title">Langkah Selanjutnya</h3>
            <p class="next-steps-content">Eksplorasi lebih lanjut dengan mengimplementasikan JWT untuk autentikasi, Joi untuk validasi, dan Swagger untuk dokumentasi API.</p>
            <div class="tags-container">
              <span class="tag">JWT</span>
              <span class="tag">Joi</span>
              <span class="tag">Swagger</span>
              <span class="tag">Testing</span>
            </div>
          </div>
        </div>
      `,
      date: "2025-09-10",
      readTime: "12 menit baca",
      tags: ["Node.js", "Express", "API"],
      category: "Pengembangan Backend",
      author: "Muhammad Daffa Ramadhan"
    }
  ];

  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="article-not-found">
        <div className="not-found-container">
          <div className="not-found-icon-container">
            <BookOpen className="not-found-icon" />
          </div>
          <h3 className="not-found-title">Artikel tidak ditemukan</h3>
          <p className="not-found-description">
            Artikel yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Link 
            to="/articles" 
            className="not-found-link"
          >
            <ArrowLeft className="not-found-link-icon" />
            Kembali ke artikel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="article-detail-container">
        <Link 
          to="/articles" 
          className="back-to-articles"
        >
          <ArrowLeft className="back-icon" />
          Kembali ke artikel
        </Link>
        
        <article className="article-container">
          {/* Header Artikel */}
          <div className="article-header">
            <div className="article-meta">
              <span className="article-category">
                {article.category}
              </span>
              <div className="article-info">
                <div className="info-item">
                  <Clock className="info-icon" />
                  {article.readTime}
                </div>
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
              </div>
            </div>
            
            <h1 className="article-title">
              {article.title}
            </h1>
            
            <div className="author-info">
              <User className="author-icon" />
              <span>{article.author}</span>
            </div>
            
            <div className="divider"></div>
          </div>
          
          {/* Konten Artikel */}
          <div className="article-body">
            <div 
              className="article-content-wrapper"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          
          {/* Footer Artikel */}
          <div className="article-footer">
            <div className="tags-section">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="tag-item"
                >
                  <Tag className="tag-icon" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="footer-divider"></div>
            
            <div className="footer-content">
              <div className="author-credit">
                <User className="author-credit-icon" />
                <span className="author-name">Ditulis oleh {article.author}</span>
              </div>
              <Link 
                to="/articles" 
                className="all-articles-link"
              >
                Lihat semua artikel
                <ArrowLeft className="all-articles-icon" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;