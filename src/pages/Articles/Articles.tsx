import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Tag, Search, BookOpen, User } from 'lucide-react';

const Articles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Data dummy untuk artikel dalam bahasa Indonesia
  const articles = [
    {
      id: "1",
      title: "Memahami React Hooks Secara Mendalam",
      excerpt: "Panduan komprehensif tentang React Hooks, termasuk useState, useEffect, dan custom hooks. Pelajari cara mengoptimalkan aplikasi React Anda dengan pola hook modern.",
      date: "2025-09-15",
      readTime: "8 menit baca",
      tags: ["React", "JavaScript", "Frontend"],
      category: "Pengembangan Frontend",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "2",
      title: "Membangun RESTful API dengan Node.js dan Express",
      excerpt: "Pelajari cara membuat RESTful API yang kuat menggunakan Node.js dan Express. Panduan ini mencakup routing, middleware, autentikasi, dan praktik terbaik desain API.",
      date: "2025-09-10",
      readTime: "12 menit baca",
      tags: ["Node.js", "Express", "API"],
      category: "Pengembangan Backend",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "3",
      title: "Menguasai TypeScript: Tipe dan Generics Lanjutan",
      excerpt: "Mendalami fitur-fitur TypeScript tingkat lanjut termasuk generics, tipe kondisional, dan tipe pemetaan. Tingkatkan keamanan tipe dan pemeliharaan kode Anda.",
      date: "2025-09-05",
      readTime: "15 menit baca",
      tags: ["TypeScript", "Pemrograman"],
      category: "Pemrograman",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "4",
      title: "Prinsip Desain Database untuk Aplikasi Skalabel",
      excerpt: "Prinsip-prinsip penting desain database untuk membangun aplikasi yang dapat diskalakan. Mencakup normalisasi, pengindeksan, dan teknik optimasi query.",
      date: "2025-08-28",
      readTime: "10 menit baca",
      tags: ["Database", "PostgreSQL", "Desain"],
      category: "Database",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "5",
      title: "Praktik Terbaik DevOps: Setup Pipeline CI/CD",
      excerpt: "Pelajari cara mengatur pipeline CI/CD yang efektif menggunakan tools modern. Panduan ini mencakup otomasi, testing, dan strategi deployment untuk pengiriman software yang andal.",
      date: "2025-08-20",
      readTime: "14 menit baca",
      tags: ["DevOps", "CI/CD", "Docker"],
      category: "DevOps",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "6",
      title: "Solusi Manajemen State dalam Aplikasi Web Modern",
      excerpt: "Perbandingan berbagai solusi manajemen state termasuk Redux, Context API, dan Zustand. Pelajari kapan menggunakan setiap pendekatan untuk performa optimal.",
      date: "2025-08-15",
      readTime: "11 menit baca",
      tags: ["Manajemen State", "React", "Frontend"],
      category: "Pengembangan Frontend",
      author: "Muhammad Daffa Ramadhan"
    }
  ];

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 py-12 pt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary-100 dark:bg-primary-900/20 p-4 rounded-full mr-6">
              <BookOpen className="h-10 w-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-900 dark:text-white">Basis Pengetahuan</h1>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-6 leading-relaxed text-center">
            Kumpulan catatan, wawasan, dan pembelajaran pribadi saya selama perjalanan sebagai pengembang.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari artikel, tag, atau topik..."
              className="block w-full pl-12 pr-6 py-5 border border-gray-300 dark:border-dark-700 rounded-2xl bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article 
              key={article.id}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-7">
                <div className="flex justify-between items-start mb-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-dark-900 dark:text-white mb-4 line-clamp-2 leading-tight text-left">
                  {article.title}
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-5 line-clamp-3 text-base leading-relaxed text-left">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-5 text-left">
                  <User className="h-4 w-4 mr-2" />
                  <span>{article.author}</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200"
                    >
                      <Tag className="h-2.5 w-2.5 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6 text-left">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
                
                <div className="mt-6">
                  <Link 
                    to={`/articles/${article.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium flex items-center text-base group"
                  >
                    Baca selengkapnya
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-200 dark:bg-dark-700 border-2 border-dashed rounded-2xl w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Artikel tidak ditemukan</h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-md mx-auto text-center">
              Coba sesuaikan kata kunci pencarian Anda untuk menemukan apa yang Anda cari.
            </p>
          </div>
        )}
        
        {/* Footer Info */}
        <div className="text-center mt-20 pt-10 border-t border-gray-200 dark:border-dark-700">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Menampilkan {filteredArticles.length} dari {articles.length} artikel
          </p>
        </div>
      </div>
    </div>
  );
};

export default Articles;