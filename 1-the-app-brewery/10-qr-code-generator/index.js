import inquirer from 'inquirer'
import qr from 'qr-image'
import fs from 'fs'

// get user input
inquirer.prompt(
[{
    type: 'input',
    name: 'URL',
    message: 'Type in your URL'
  }]
)
// get qr-code
.then((answers) => {
    const qrcode = qr.image(answers.URL)
    qrcode.pipe(fs.createWriteStream('qr_image.png'))

    // create txt file w. url
    fs.writeFile("url.txt", answers.URL, (err) => {
        if (err) throw err
        console.log("URL saved on file")
    })
})

