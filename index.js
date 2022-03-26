const puppeteer = require("puppeteer");
const fs = require("fs");
const { resolve } = require("path");

const baseUrl = "https://pt.wikwik.org/"
const paths = [
    "palavras5letras.htm",
    "palavras5letraspagina2.htm",
    "palavras5letraspagina3.htm",
    "palavras5letraspagina4.htm",
    "palavras5letraspagina5.htm",
    "palavras5letraspagina6.htm",
    "palavras5letraspagina7.htm",
    "palavras5letraspagina8.htm",
    "palavras5letraspagina9.htm",
];

(async () => {
    const browser = await puppeteer.launch();
    try{
        const url = baseUrl+paths[0]
        let wordsInArray = await getWords(browser, url)
        const words = []
        wordsInArray.forEach(line => {
            let iwil = line.split(" ") //Split lines in which have more than one word like eg.: presa Presa
            let wordsToAdd = []
            iwil.forEach(w => {
                w = w.toLowerCase()
                if (!wordsToAdd.includes(w)) {
                    wordsToAdd.push(w)
                }
            })
            wordsToAdd.forEach(w => {
                words.push(w)
            })
        })

        await fs.writeFile("./test.txt", words.join("\n"), () => {
            resolve()
        })
    }
    catch (e) {
        console.log(e)
    }
    await browser.close();
})()

function getWords(browser, url){
    return new Promise(async (resolve, reject) => {
        try{
            const page = await browser.newPage();
            await page.goto(url)
            proof = await page.evaluate(() => {
                children = Array.from(document.querySelector(".mm").children, e => e.innerText)
                return children
            })
            resolve(proof)
        }
        catch (e) {
            reject(e)
        }
    })
}