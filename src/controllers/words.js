const fs = require("fs")
const path = require("path")

const words = fs.readFileSync(path.resolve(__dirname, "..", "database", "words.txt"), {
    encoding: "utf-8"
}).split("\n")

const SET_WORD = Array.from(words[Math.floor(Math.random()*words.length)])
console.log("The word set was "+SET_WORD.join(""))

const LETTER_RESULT_CODE = {
    DO_NOT_HAVE: 0,
    WRONG_PLACE: 1,
    RIGHT_PLACE: 2
}

module.exports = {
    compare: function(req, res){
        let { word } = req.params
        word = word.toLowerCase()
        let word_found
        let found = false
        for(let i = 0; i < words.length; i++){
            if (words[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "") == word.normalize('NFD').replace(/[\u0300-\u036f]/g, "")){
                word_found = words[i]
                found = true
                break
            }
        }
        if (!found) {
            return res.status(404).send("word not found in db")
        }

        let daily_word_copy = [...SET_WORD]

        const answer = Array.from(word).map((_, i) => {
            if (word[i] === SET_WORD[i]) {
                return LETTER_RESULT_CODE["RIGHT_PLACE"]
            }
            for (let j = 0; j < daily_word_copy.length; j++) {
                if (word[i] === daily_word_copy[j]){
                    daily_word_copy[j] = " "
                    return LETTER_RESULT_CODE["WRONG_PLACE"]
                }
            }
            return LETTER_RESULT_CODE["DO_NOT_HAVE"]
        })
        res.json({
            found: word_found,
            answer
        })
    }
}