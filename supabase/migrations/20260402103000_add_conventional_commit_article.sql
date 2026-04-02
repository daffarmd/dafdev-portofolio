with article_payload as (
  select
    'Mengenal Conventional Commit Message di Git'::text as title,
    'mengenal-conventional-commit-message-di-git'::text as slug,
    'Penjelasan sederhana tentang conventional commit message di Git, mulai dari format dasar, jenis type yang umum, sampai contoh penulisan yang mudah dipahami orang awam.'::text as excerpt,
    jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Kalau kamu baru belajar Git, mungkin kamu sering bingung saat diminta menulis commit message. Kadang kita cuma menulis update, fix lagi, atau benerin error. Masalahnya, pesan seperti itu kurang jelas. Orang lain jadi susah paham sebenarnya kita mengubah apa. Bahkan kita sendiri bisa lupa kalau melihatnya beberapa minggu kemudian.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Nah, di sinilah conventional commit message berguna. Dengan format yang rapi dan konsisten, commit jadi lebih mudah dibaca dan lebih gampang dipahami saat riwayat project mulai banyak.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Apa itu commit message?'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Commit message adalah catatan singkat yang menjelaskan perubahan yang kita simpan di Git.$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'menambah tombol login',
          'memperbaiki bug saat register',
          'mengganti warna navbar',
          'menghapus file yang tidak dipakai'
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Jadi setiap kali kita melakukan commit, kita seolah sedang bilang ke tim: Aku habis ngapain di project ini.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Apa itu conventional commit?'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Conventional commit adalah cara menulis commit message dengan format yang rapi dan konsisten.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Tujuannya supaya:$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'lebih mudah dibaca',
          'lebih gampang dicari',
          'tim lebih cepat paham isi perubahan',
          'riwayat project terlihat lebih profesional'
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Format paling umumnya seperti ini:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$type: pesan singkat$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Contoh:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah fitur login
fix: perbaiki bug validasi email
docs: update README$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Kenapa conventional commit itu penting?'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Bayangin project kamu dikerjakan banyak orang. Kalau semua orang menulis commit sesuka hati, hasilnya bakal berantakan.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Contoh yang kurang jelas:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$update
revisi
benerin
final fix
fix lagi serius ini fix$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Dari pesan seperti itu, kita tidak tahu:$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'apa yang diubah',
          'bagian mana yang berubah',
          'itu fitur baru atau bug fix',
          'perubahan itu penting atau tidak'
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Kalau pakai conventional commit, semuanya jadi lebih jelas.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Contoh:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah halaman profile
fix: perbaiki tombol submit yang tidak jalan
style: rapikan spacing pada navbar
refactor: sederhanakan logic login$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Sekali lihat, orang langsung paham.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Struktur conventional commit'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Biasanya formatnya seperti ini:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$type(scope): pesan$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Atau versi sederhananya:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$type: pesan$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Penjelasan bagian-bagiannya'
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '1. type'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Bagian ini menjelaskan jenis perubahan yang kamu lakukan.$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'feat: menambah fitur baru',
          'fix: memperbaiki bug',
          'docs: mengubah dokumentasi',
          'style: perubahan tampilan atau format, bukan logika',
          'refactor: merapikan kode tanpa mengubah fungsi utama',
          'test: menambah atau mengubah testing',
          'chore: pekerjaan kecil pendukung, misalnya update dependency'
        )
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '2. scope (opsional)'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Scope menjelaskan perubahan itu terjadi di bagian mana.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat(auth): tambah login dengan Google
fix(cart): perbaiki total harga$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$auth dan cart itu namanya scope. Kalau project kamu masih sederhana, bagian ini tidak wajib.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '3. pesan'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Bagian ini menjelaskan apa yang berubah, ditulis singkat dan jelas.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Contoh bagus:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$fix: perbaiki validasi nomor telepon$$
      )
    ) || jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Contoh kurang bagus:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$fix: bug$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Contoh type conventional commit yang paling umum'
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'feat'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$feat dipakai saat kamu menambahkan fitur baru.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah fitur reset password$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Artinya, kamu menambahkan kemampuan baru ke aplikasi.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'fix'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$fix dipakai saat kamu memperbaiki bug atau error.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$fix: perbaiki error saat upload gambar$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Artinya, ada masalah sebelumnya lalu sekarang dibetulkan.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'docs'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$docs dipakai untuk perubahan dokumentasi.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$docs: update cara instalasi di README$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Artinya, yang berubah cuma dokumentasi, bukan fitur aplikasi.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'style'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$style dipakai untuk perubahan tampilan atau format kode, bukan logika program.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$style: rapikan indentasi pada halaman dashboard$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Biasanya ini soal spasi, titik koma, atau style UI kecil.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'refactor'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$refactor dipakai saat kamu merapikan atau menyusun ulang kode tanpa mengubah hasil akhirnya.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$refactor: sederhanakan fungsi hitung diskon$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Artinya, cara penulisannya diubah supaya lebih rapi, tapi hasilnya tetap sama.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'test'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$test dipakai saat menambah atau memperbaiki testing.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$test: tambah unit test untuk login service$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'chore'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$chore dipakai untuk pekerjaan pendukung yang bukan fitur dan bukan bug fix.$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$chore: update dependency react ke versi terbaru$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Contoh commit message yang baik'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Berikut beberapa contoh yang enak dibaca:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah halaman checkout
fix: perbaiki bug logout otomatis
docs: tambah panduan setup project
style: rapikan tampilan tombol login
refactor: pisahkan logic auth ke service
test: tambah test untuk API register
chore: update package eslint$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Contoh commit message yang kurang baik'
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$update
fix
revisi
benerin dikit
aman
final$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Kenapa kurang baik? Karena terlalu umum. Orang lain tidak tahu apa isi perubahannya.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Tips menulis conventional commit biar enak dibaca'
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '1. Tulis singkat, tapi jelas'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Jangan terlalu panjang, tapi jangan terlalu samar juga.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Bagus:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$fix: perbaiki validasi form login$$
      )
    ) || jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Kurang bagus:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$fix: memperbaiki beberapa hal yang tadi sempat error di bagian login dan sedikit penyesuaian form$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '2. Fokus pada apa yang diubah'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Jangan menulis cerita panjang soal proses kamu. Fokus saja pada perubahan utamanya.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Lebih baik:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah filter produk berdasarkan kategori$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Daripada:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: saya tadi menambahkan filter karena sebelumnya belum ada$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '3. Gunakan kata yang konsisten'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Kalau tim pakai feat, jangan kadang pakai feature. Kalau pakai fix, jangan campur dengan bugfix kecuali memang sudah disepakati tim.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', '4. Satu commit, satu tujuan'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Kalau bisa, satu commit isinya satu jenis perubahan utama. Misalnya jangan campur banyak hal dalam satu commit besar.$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'tambah fitur checkout',
          'benerin bug login',
          'update README'
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Pisahkan supaya riwayat Git tetap bersih.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Contoh penggunaan di dunia nyata'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Misalnya hari ini kamu:$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'menambah fitur register',
          'memperbaiki bug tombol login',
          'update dokumentasi project'
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Maka commit-nya bisa jadi seperti ini:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah fitur register pengguna
fix: perbaiki tombol login yang tidak merespons
docs: update panduan instalasi project$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Lihat? Jadi lebih rapi dan gampang dipahami.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Apakah conventional commit wajib?'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Sebenarnya tidak selalu wajib. Kalau kamu kerja sendiri di project kecil, kamu tetap bisa pakai gaya commit biasa.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Tapi kalau:$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'kerja tim',
          'project mulai besar',
          'mau terlihat rapi dan profesional',
          'ingin riwayat Git mudah dibaca'
        )
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$maka conventional commit sangat disarankan.$$
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Kesimpulan'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Conventional commit adalah cara menulis commit message dengan format yang jelas dan konsisten.$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Format sederhananya:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$type: pesan$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Contohnya:$$
      ),
      jsonb_build_object(
        'type', 'code',
        'language', 'bash',
        'code', $$feat: tambah fitur login
fix: perbaiki bug register
docs: update README$$
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', $$Dengan cara ini, riwayat perubahan di Git jadi:$$
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'lebih rapi',
          'lebih mudah dibaca',
          'lebih gampang dipahami oleh tim',
          'lebih memudahkan diri sendiri di masa depan'
        )
      ),
      jsonb_build_object(
        'type', 'highlight',
        'title', 'Intinya',
        'content', $$Conventional commit itu bukan soal gaya-gayaan. Ini soal komunikasi yang jelas dalam project.$$
      )
    ) as content,
    $translations$
    {
      "en": {
        "title": "Understanding Conventional Commit Messages in Git",
        "excerpt": "A simple explanation of conventional commit messages in Git, from the basic format and common types to practical examples that are easy for beginners to understand.",
        "readTime": "9 min read",
        "category": "Git Basics",
        "imageAlt": "Illustration for an article about conventional commit messages in Git",
        "sections": [
          {
            "type": "paragraph",
            "content": "If you are new to Git, writing commit messages can feel confusing. Many people end up using messages like update, fix again, or quick bug fix. The problem is that messages like those are too vague."
          },
          {
            "type": "paragraph",
            "content": "Other people cannot easily tell what changed, and even you might forget what you meant a few weeks later. That is where conventional commit messages become useful."
          },
          {
            "type": "heading",
            "content": "What is a commit message?"
          },
          {
            "type": "paragraph",
            "content": "A commit message is a short note that explains the change you save in Git."
          },
          {
            "type": "list",
            "items": [
              "adding a login button",
              "fixing a bug during registration",
              "changing the navbar color",
              "removing an unused file"
            ]
          },
          {
            "type": "paragraph",
            "content": "So every time you create a commit, you are basically telling the team what you just did in the project."
          },
          {
            "type": "heading",
            "content": "What is a conventional commit?"
          },
          {
            "type": "paragraph",
            "content": "A conventional commit is a way to write commit messages in a tidy and consistent format."
          },
          {
            "type": "paragraph",
            "content": "The goal is to make commit history easier to read, easier to search, easier for the team to understand, and more professional overall."
          },
          {
            "type": "paragraph",
            "content": "The most common format looks like this:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "type: short message"
          },
          {
            "type": "paragraph",
            "content": "For example:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add login feature\nfix: resolve email validation bug\ndocs: update README"
          },
          {
            "type": "heading",
            "content": "Why are conventional commits important?"
          },
          {
            "type": "paragraph",
            "content": "Imagine your project is being worked on by many people. If everyone writes commits however they want, the history becomes messy very quickly."
          },
          {
            "type": "paragraph",
            "content": "Here are examples that are not clear enough:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "update\nrevision\nfixed\nfinal fix\nfix again seriously this is the fix"
          },
          {
            "type": "paragraph",
            "content": "From messages like that, you cannot tell what changed, which part changed, whether it was a new feature or a bug fix, or whether the change was important."
          },
          {
            "type": "paragraph",
            "content": "With conventional commits, everything becomes clearer."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add profile page\nfix: repair submit button that does not work\nstyle: tidy navbar spacing\nrefactor: simplify login logic"
          },
          {
            "type": "paragraph",
            "content": "At a glance, people immediately understand the change."
          },
          {
            "type": "heading",
            "content": "The structure of a conventional commit"
          },
          {
            "type": "paragraph",
            "content": "The common format usually looks like this:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "type(scope): message"
          },
          {
            "type": "paragraph",
            "content": "Or the simpler version:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "type: message"
          },
          {
            "type": "heading",
            "content": "Breaking down the parts"
          },
          {
            "type": "heading",
            "content": "1. type"
          },
          {
            "type": "paragraph",
            "content": "This part explains the kind of change you made."
          },
          {
            "type": "list",
            "items": [
              "feat: add a new feature",
              "fix: repair a bug",
              "docs: change documentation",
              "style: adjust formatting or appearance, not logic",
              "refactor: clean up code without changing the main behavior",
              "test: add or update tests",
              "chore: supporting work such as dependency updates"
            ]
          },
          {
            "type": "heading",
            "content": "2. scope (optional)"
          },
          {
            "type": "paragraph",
            "content": "Scope explains where the change happened."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat(auth): add Google login\nfix(cart): repair total price calculation"
          },
          {
            "type": "paragraph",
            "content": "In that example, auth and cart are the scopes. If your project is still simple, this part is optional."
          },
          {
            "type": "heading",
            "content": "3. message"
          },
          {
            "type": "paragraph",
            "content": "This part explains what changed, and it should stay short and clear."
          },
          {
            "type": "paragraph",
            "content": "A good example:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "fix: repair phone number validation"
          },
          {
            "type": "paragraph",
            "content": "A weak example:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "fix: bug"
          },
          {
            "type": "heading",
            "content": "Common conventional commit types"
          },
          {
            "type": "heading",
            "content": "feat"
          },
          {
            "type": "paragraph",
            "content": "Use feat when you add a new feature."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add reset password feature"
          },
          {
            "type": "paragraph",
            "content": "That means you are adding a new capability to the application."
          },
          {
            "type": "heading",
            "content": "fix"
          },
          {
            "type": "paragraph",
            "content": "Use fix when you correct a bug or error."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "fix: repair image upload error"
          },
          {
            "type": "paragraph",
            "content": "That means a previous issue has now been resolved."
          },
          {
            "type": "heading",
            "content": "docs"
          },
          {
            "type": "paragraph",
            "content": "Use docs when the change is only about documentation."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "docs: update installation steps in README"
          },
          {
            "type": "heading",
            "content": "style"
          },
          {
            "type": "paragraph",
            "content": "Use style when you change formatting or visual appearance but not program logic."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "style: tidy indentation on the dashboard page"
          },
          {
            "type": "heading",
            "content": "refactor"
          },
          {
            "type": "paragraph",
            "content": "Use refactor when you reorganize or clean code without changing the final behavior."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "refactor: simplify discount calculation"
          },
          {
            "type": "heading",
            "content": "test"
          },
          {
            "type": "paragraph",
            "content": "Use test when you add or update tests."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "test: add unit test for login service"
          },
          {
            "type": "heading",
            "content": "chore"
          },
          {
            "type": "paragraph",
            "content": "Use chore for supporting work that is not a feature and not a bug fix."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "chore: update react dependency to the latest version"
          },
          {
            "type": "heading",
            "content": "Examples of good commit messages"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add checkout page\nfix: repair automatic logout bug\ndocs: add project setup guide\nstyle: tidy login button appearance\nrefactor: move auth logic into a service\ntest: add tests for the register API\nchore: update eslint package"
          },
          {
            "type": "heading",
            "content": "Examples of weak commit messages"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "update\nfix\nrevision\nsmall fix\nsafe now\nfinal"
          },
          {
            "type": "paragraph",
            "content": "Those are weak because they are too general. Other people cannot understand what the actual change was."
          },
          {
            "type": "heading",
            "content": "Tips for writing better conventional commits"
          },
          {
            "type": "heading",
            "content": "1. Keep it short, but clear"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "fix: repair login form validation"
          },
          {
            "type": "paragraph",
            "content": "Do not make it too long, but do not make it vague either."
          },
          {
            "type": "heading",
            "content": "2. Focus on what changed"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add product filter by category"
          },
          {
            "type": "paragraph",
            "content": "Write the change itself, not the whole story of how you arrived there."
          },
          {
            "type": "heading",
            "content": "3. Use consistent words"
          },
          {
            "type": "paragraph",
            "content": "If your team uses feat, do not randomly switch to feature. If your team uses fix, do not mix it with bugfix unless the team has agreed on that convention."
          },
          {
            "type": "heading",
            "content": "4. One commit, one main purpose"
          },
          {
            "type": "paragraph",
            "content": "As much as possible, one commit should contain one main kind of change. For example, do not mix a new checkout feature, a login bug fix, and a README update in one giant commit."
          },
          {
            "type": "heading",
            "content": "A real-world example"
          },
          {
            "type": "paragraph",
            "content": "Imagine that today you added a registration feature, fixed the login button, and updated the project documentation. Your commits could look like this:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add user registration feature\nfix: repair login button that does not respond\ndocs: update project installation guide"
          },
          {
            "type": "paragraph",
            "content": "That is much cleaner and easier to understand."
          },
          {
            "type": "heading",
            "content": "Is conventional commit mandatory?"
          },
          {
            "type": "paragraph",
            "content": "Not always. If you work alone on a very small project, a casual commit style can still work."
          },
          {
            "type": "paragraph",
            "content": "But if you work in a team, your project is growing, you want a cleaner and more professional history, or you want the Git history to stay easy to read, then conventional commits are strongly recommended."
          },
          {
            "type": "heading",
            "content": "Conclusion"
          },
          {
            "type": "paragraph",
            "content": "A conventional commit is a way to write commit messages in a clear and consistent format."
          },
          {
            "type": "code",
            "language": "bash",
            "code": "type: message"
          },
          {
            "type": "paragraph",
            "content": "For example:"
          },
          {
            "type": "code",
            "language": "bash",
            "code": "feat: add login feature\nfix: repair registration bug\ndocs: update README"
          },
          {
            "type": "paragraph",
            "content": "With this approach, your Git history becomes cleaner, easier to read, easier for the team to understand, and easier for your future self as well."
          },
          {
            "type": "highlight",
            "title": "The point",
            "content": "Conventional commit is not about looking fancy. It is about clear communication inside a project."
          }
        ]
      }
    }
    $translations$::jsonb as translations,
    '/og-image.png'::text as cover_image_url,
    'Ilustrasi artikel tentang conventional commit message di Git'::text as cover_image_alt,
    'Git Basics'::text as category,
    array['Git', 'Conventional Commit', 'Version Control']::text[] as tags,
    '9 menit baca'::text as read_time,
    'Muhammad Daffa Ramadhan'::text as author_name,
    null::uuid as author_id,
    'published'::text as status,
    '2026-04-02T00:00:00.000Z'::timestamptz as published_at
)
insert into public.articles (
  title,
  slug,
  excerpt,
  content,
  translations,
  cover_image_url,
  cover_image_alt,
  category,
  tags,
  read_time,
  author_name,
  author_id,
  status,
  published_at
)
select
  title,
  slug,
  excerpt,
  content,
  translations,
  cover_image_url,
  cover_image_alt,
  category,
  tags,
  read_time,
  author_name,
  author_id,
  status,
  published_at
from article_payload
on conflict (slug) do update
set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  translations = excluded.translations,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  category = excluded.category,
  tags = excluded.tags,
  read_time = excluded.read_time,
  author_name = excluded.author_name,
  author_id = coalesce(public.articles.author_id, excluded.author_id),
  status = excluded.status,
  published_at = excluded.published_at;
