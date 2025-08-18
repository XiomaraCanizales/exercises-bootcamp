// package used: npm i taylor-swift

const { song, album, quote } = require("taylor-swift")

const randomSong = song.random()
console.log(randomSong.name)

const randomQuote = quote.random()
console.log(randomQuote)

const randomAlbum = album.random()
console.log(randomAlbum.title)

console.log(album.all())