// fungsi buat handle hanya menerima pesan berupa POST, kalau GET keluarkan pesan error
function doGet(e) {
  return tg.util.outputText("Hanya data POST yang kita proses yak!");
}

// fungsi buat handle pesan POST
function doPost(e) {  
  // data e kita verifikasi
  let update = tg.doPost(e);
  
  try {
    if (debug) return tg.sendMessage(adminBot, JSON.stringify(update, null, 2))
    prosesPesan(update)
  } catch (e) {
    tg.sendMessage(adminBot, e.message)
  }
  
}

// fungsi utama untuk memproses segala pesan yang masuk
function prosesPesan(update) {  

  // deteksi tipe message
  if (update.message) { 

    // penyederhanaan variable
    var msg = update.message;

    // deteksi event letakkan di sini

    // jika ada pesan berupa text
    if (msg.text) {

      // jika user klik start, bot akan menjawab
      var pola = /\/start/i
      if (pola.exec(msg.text)) {
        var nama = msg.from.first_name
        if (msg.from.last_name)
          nama += ' ' + msg.from.last_name
        // perhatikan, ini menggunakan sendMsg bukan sendMessage
        var pesan = "🙋🏽 Halo, <b>" + tg.util.clearHTML(nama) + "</b>, perkenalkan aku ini bot!"
        pesan += `\n🎁 Dibuat dengan <b>GAS Library</b> versi <code>${tg.versi()}</code>`
        pesan += "\n\n💁🏻‍♀️ Bergabunglah di @botindonesia untuk silaturrahim dan belajar bersama membuat bot Telegram."

        var keyboard = []

        // keyboard baris pertama
        // index dimulai dari 0
        keyboard[0] = [
          tg.button.url('📚 Materi Bot', 'https://bit.ly/GooglescriptBotTelegram'),
          tg.button.url('👥 @botindonesia', 'https://t.me/botindonesia'),
        ]
        // keyboard baris kedua
        keyboard[1] = [
          tg.button.text('😼 Halo Human', 'me_click')
        ]

        return tg.sendMsgKeyboardInline(msg, pesan, keyboard, 'HTML')
      }

      // jika user ketik /ping, bot akan jawab Pong!
      // pola dan jawaban paling sederhana
      var pola = /^[\/!]ping$/i
      if (pola.exec(msg.text)) {
        // balas pong dengan mereply pesan
        // menggunakan parse_mode Markdown
        return tg.sendMessage(msg.chat.id, '🏓 *Pooong!*', 'Markdown', false, false, msg.message_id)
      }

      
      // jika user ketik /pong, sekalian dihitung selisihnya
      // dan diberikan berbagai contoh kasus

      // balas pong dengan mereply pesan
      // menggunakan parse_mode Markdown
      var pola = /^[\/!]pong$/i
      if (pola.exec(msg.text)) {
      
        // awal waktu pakai timestampnya message saja
        // jika bot macet timestamp pengirim tetap diperhitungkan
        // pilihan lain bisa bikin time sendiri
        var waktuAwal = msg.date 
        var hasil = tg.sendMessage(msg.chat.id, '<b>Ping</b>', 'HTML', false, false, msg.message_id)

        var newMsg = hasil.result
        var waktuAkhir = new Date()

        let fotoMie = [
        'https://assets-pergikuliner.com/uploads/bootsy/image/7377/medium_medium_Mie_instan_Indonesia__pergikuliner.com_.jpg',
        'https://cdn-2.tstatic.net/manado/foto/bank/images/mie_20180331_140834.jpg',
        'https://cdn-2.tstatic.net/pontianak/foto/bank/images/tom-yam-ramen_20171129_091301.jpg',
        'https://steemitimages.com/p/o1AJ9qDyyJNSpZWhUgGYc3MngFqoAMdKHenXrMvJdYNGVi3g2',
        'https://bebaspedia.com/wp-content/uploads/2020/03/Mie-Ramen.jpg'
        ]
        
        // hitung selisih waktunya dalam satuan detik
        var selisihWaktu = (waktuAkhir / 1000 ) - waktuAwal
        // foto gambar disembunyikan di emoticon mie
        var pesan = '<a href="'+tg.util.random(fotoMie)+'">🍜</a> '
        pesan += `<b>Ping</b>... in <i>mie telur</i> rebus.\n🥢 Dimasak dalam <code>${selisihWaktu.toLocaleString()}</code> detik.`

        return tg.editMessageText(msg.chat.id, newMsg.message_id, false, pesan, 'HTML')
      }

      // tangkap pesan echo atau say
      var pola = /^([\/!](echo|say))/i
      if ( cocok = pola.exec(msg.text) ) {
        var pesan = msg.text.replace(cocok[1], '')
        // bersihkan pesan dari spasi
        pesan = pesan.trim()
        // deteksi jika panjang pesan < 1, jangan lakukan apa-apa
        if (pesan.length<1) 
          return false
        
        // kirim pesan echo / say nya, tanpa parse_mode
        return tg.sendMsg(msg, pesan)
      }

      // kirim foto dari URL
      var pola = /^[\/!](foto|ph?oto)$/i
      if ( cocok = pola.exec(msg.text) ) {        
        var url = 'https://blog.banghasan.com/assets/images/me/banghasan_pedang.jpg'
        var caption = 'Test Kirim Foto'
        return tg.sendPhoto(msg.chat.id, url, caption, 'HTML')
      }

      // kalau mau kembangin sendiri menjadi bot interaktif, code nya taruh di bawah ini
      // -- mulai custom deteksi text --

      // akhir deteksi pesan text
    }

    // deteksi jika ada foto
    if (msg.photo) {
      // taruh codinganmu di sini
      // misal menampilkan foto ID
      return tg.sendMsg(msg, '⚜️ File ID: ' + msg.photo[0].file_id)
    }
    
    // akhir update message
  }

   // deteksi callback
   if (update.callback_query) {
      // proses di halaman berikutnya, biar gak terlalu panjang     
     return prosesCallback(update.callback_query)
   }
  
}