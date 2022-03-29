const fs = require("fs");
const path = require("path");

(async () => {
    const stream = fs.createWriteStream(path.resolve(__dirname, "..", "..", "database", "words.txt"))
    const added_words = {}
    const files = fs.readdirSync(path.resolve(__dirname, "..", "..", "database"), {
        encoding: "utf-8"
    })

    for(let i = 0; i < files.length; i++){
        const file = await fs.readFileSync(path.resolve(__dirname, "..", "..", "database", files[i]), {
            encoding: "utf-8"
        })
        const words = file.split("\n")  
        words.forEach(word => {
            if (!added_words[word]) {
                stream.write(word)
            }
        })
    }
    stream.close()
})()