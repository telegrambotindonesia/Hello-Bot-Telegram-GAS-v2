function prosesCallback(cb) {

  if (/me_click/i.exec(cb.data)) {
    var pesan = '~ hasil tidak mengkhianati usaha ~'
    pesan +='\n\n' + ' '.repeat(12)
    pesan += 'Semangat Belajar! ✊🏼'
    return tg.answerCallbackQuery(cb.id, pesan, true)
  }

}