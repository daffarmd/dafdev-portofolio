import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, User, BookOpen } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const ArticleDetail: React.FC = () => {
  // Data dummy untuk artikel dalam bahasa Indonesia
  const articles = [
    {
      id: "1",
      title: "Memahami React Hooks Secara Mendalam",
      content: `
        <p className="mb-6 text-lg">React Hooks telah merevolusi cara kita menulis komponen React. Diperkenalkan di React 16.8, Hooks memungkinkan kita menggunakan state dan fitur React lainnya tanpa perlu menulis komponen kelas.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Apa itu React Hooks?</h2>
        <p className="mb-6">Hooks adalah fungsi yang memungkinkan Anda "terhubung" ke fitur state dan lifecycle React dari komponen fungsi. Mereka tidak bekerja di dalam kelas — mereka memungkinkan Anda menggunakan React tanpa kelas.</p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
          <p className="text-blue-800 dark:text-blue-200"><strong>Tip:</strong> Hooks memungkinkan Anda menggunakan kembali logika stateful antar komponen tanpa mengubah hierarki komponen.</p>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Hook useState</h2>
        <p className="mb-6">Hook useState adalah hook yang paling fundamental. Ini memungkinkan Anda menambahkan state ke komponen fungsi:</p>
        
        <div class="bg-gray-800 text-white rounded-xl p-4 my-6 overflow-x-auto">
          <pre class="language-jsx">
            <code>{\`import React, { useState } from 'react';

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
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Hook useEffect</h2>
        <p className="mb-6">Hook useEffect memungkinkan Anda melakukan efek samping dalam komponen fungsi. Ini melayani tujuan yang sama dengan componentDidMount, componentDidUpdate, dan componentWillUnmount dalam kelas React:</p>
        
        <div class="bg-gray-800 text-white rounded-xl p-4 my-6 overflow-x-auto">
          <pre class="language-jsx">
            <code>{\`import React, { useState, useEffect } from 'react';

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
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Praktik Terbaik</h2>
        <ul className="list-disc pl-6 space-y-3 my-6 bg-gray-50 dark:bg-dark-700 p-6 rounded-xl">
          <li>Hanya panggil Hooks di tingkat atas. Jangan panggil Hooks di dalam loop, kondisi, atau fungsi bersarang.</li>
          <li>Hanya panggil Hooks dari komponen fungsi React. Jangan panggil Hooks dari fungsi JavaScript biasa.</li>
          <li>Custom Hooks harus dimulai dengan awalan "use" untuk mengikuti konvensi penamaan.</li>
          <li>Gunakan plugin lint Rules of Hooks untuk secara otomatis menangkap bug.</li>
        </ul>
        
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-8 rounded-r-lg">
          <p class="text-yellow-800 dark:text-yellow-200"><strong>Peringatan:</strong> Jangan memanggil Hooks dari dalam loop, kondisi, atau fungsi bersarang. Ini memastikan bahwa Hooks dipanggil dalam urutan yang sama setiap kali komponen dirender.</p>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Kesimpulan</h2>
        <p className="mb-6">React Hooks memberikan API yang lebih langsung ke konsep React yang sudah Anda kenal: props, state, context, refs, dan lifecycle. Mereka menawarkan cara yang kuat dan ekspresif untuk menyusun perilaku dan berbagi logika stateful antar komponen.</p>
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
        <p className="mb-6 text-lg">Membuat RESTful API dengan Node.js dan Express adalah keterampilan fundamental bagi pengembang backend modern. Panduan ini akan membimbing Anda melalui konsep penting dan praktik terbaik.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Menyiapkan Proyek Anda</h2>
        <p className="mb-6">Pertama, inisialisasi proyek Anda dan instal dependensi yang diperlukan:</p>
        
        <div class="bg-gray-800 text-white rounded-xl p-4 my-6 overflow-x-auto">
          <pre class="language-bash">
            <code>{\`mkdir my-api
cd my-api
npm init -y
npm install express cors helmet dotenv
npm install -D nodemon\`}</code>
          </pre>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Server Express Dasar</h2>
        <p className="mb-6">Berikut adalah contoh setup server Express sederhana:</p>
        
        <div class="bg-gray-800 text-white rounded-xl p-4 my-6 overflow-x-auto">
          <pre class="language-jsx">
            <code>{\`const express = require('express');
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
        
        <div class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-8 rounded-r-lg">
          <p class="text-green-800 dark:text-green-200"><strong>Info:</strong> Helmet membantu mengamankan aplikasi Express dengan mengatur berbagai header HTTP.</p>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Routing RESTful</h2>
        <p className="mb-6">Ikuti konvensi REST untuk route Anda:</p>
        
        <div class="bg-gray-50 dark:bg-dark-700 p-6 rounded-xl my-6">
          <ul class="space-y-3">
            <li class="flex items-start">
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded mr-3 font-mono">GET</span>
              <span>/api/users - Mengambil semua pengguna</span>
            </li>
            <li class="flex items-start">
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded mr-3 font-mono">GET</span>
              <span>/api/users/:id - Mengambil pengguna spesifik</span>
            </li>
            <li class="flex items-start">
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded mr-3 font-mono">POST</span>
              <span>/api/users - Membuat pengguna baru</span>
            </li>
            <li class="flex items-start">
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded mr-3 font-mono">PUT</span>
              <span>/api/users/:id - Memperbarui pengguna spesifik</span>
            </li>
            <li class="flex items-start">
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded mr-3 font-mono">DELETE</span>
              <span>/api/users/:id - Menghapus pengguna spesifik</span>
            </li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Integrasi Database</h2>
        <p className="mb-6">Untuk integrasi database, pertimbangkan menggunakan ORM seperti Sequelize atau Mongoose, atau query builder seperti Knex.js. Berikut contoh sederhana dengan data mock:</p>
        
        <div class="bg-gray-800 text-white rounded-xl p-4 my-6 overflow-x-auto">
          <pre class="language-jsx">
            <code>{\`// Mock data store (ganti dengan database sebenarnya)
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
        
        <h2 className="text-2xl font-bold mt-10 mb-5 text-dark-900 dark:text-white border-l-4 border-primary-500 pl-4">Kesimpulan</h2>
        <p className="mb-6">Ini adalah konsep fundamental untuk membangun RESTful API dengan Node.js dan Express. Saat Anda berkembang, pertimbangkan untuk mengimplementasikan autentikasi, validasi, logging, dan testing untuk membuat API yang kuat.</p>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 py-12 pt-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-200 dark:bg-dark-700 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Artikel tidak ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Artikel yang Anda cari tidak ada atau telah dihapus.
            </p>
            <Link 
              to="/articles" 
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke artikel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 py-12 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
          to="/articles" 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium mb-6 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke artikel
        </Link>
        
        <article className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
                {article.category}
              </span>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readTime}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-8 pb-6 border-b border-gray-200 dark:border-dark-700">
              <User className="h-4 w-4 mr-2" />
              <span>{article.author}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200"
                >
                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-dark-900 prose-headings:dark:text-white
                prose-p:text-gray-700 prose-p:dark:text-gray-300
                prose-pre:bg-gray-800 prose-pre:text-white
                prose-code:text-primary-600 prose-code:dark:text-primary-400
                prose-strong:text-dark-900 prose-strong:dark:text-white
                prose-ul:text-gray-700 prose-ul:dark:text-gray-300
                prose-ol:text-gray-700 prose-ol:dark:text-gray-300
                prose-li:marker:text-primary-500
                prose-a:text-primary-600 prose-a:dark:text-primary-400
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4
                prose-img:rounded-xl
                prose-h2:mt-10 prose-h2:mb-5 prose-h2:border-l-4 prose-h2:border-primary-500 prose-h2:pl-4
                prose-h3:mt-8 prose-h3:mb-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          
          <div className="px-6 md:px-8 py-6 bg-gray-50 dark:bg-dark-700 border-t border-gray-200 dark:border-dark-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <User className="h-4 w-4 mr-2" />
                <span>Ditulis oleh {article.author}</span>
              </div>
              <Link 
                to="/articles" 
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
              >
                Lihat semua artikel
                <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;