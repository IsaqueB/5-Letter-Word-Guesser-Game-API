const fs = require("fs")
const path = require("path")

const words = fs.readFileSync(path.resolve(__dirname, "..", "database", "words.txt"), {
    encoding: "utf-8"
}).split("\n")

const temporary = Array.from(words[Math.floor(Math.random()*words.length)])

module.exports = {
    compare: function(req, res){
        let { word } = req.params
        word = word.toLowerCase()
        let wordFound
        let found = false
        for(let i = 0; i < words.length; i++){
            if (words[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "") == word.normalize('NFD').replace(/[\u0300-\u036f]/g, "")){
                wordFound = words[i]
                found = true
                break
            }
        }
        if (!found) {
            return res.status(404).send("word not found in db")
        }

        let dailyWordCopy = [...temporary]

        const answer = Array.from(word).map((_, i) => {
            const areEqual = word[i] === temporary[i]
            let contains = false
            for (let j = 0; j < dailyWordCopy.length; j++) {
                if (word[i] === dailyWordCopy[j]){
                    contains = true
                    dailyWordCopy[j] = " "
                    break
                }
            }
            return areEqual+contains
        })
        res.json({
            found: wordFound,
            answer
        })

    }
}