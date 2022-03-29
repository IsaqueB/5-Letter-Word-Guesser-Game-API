const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

(async () => {
    const res = await fetch("https://www.ime.usp.br/~pf/dicios/br-utf8.txt")
    const all_words = await res.text()
    const words = all_words.split("\n").filter(w => w.length === 5)
    await fs.writeFileSync(path.resolve(__dirname, "..", "..", "database", "ime_usp.txt"), words.join("\n"))
})()