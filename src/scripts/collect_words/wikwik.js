const puppeteer = require("puppeteer");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path")

const base_url = "https://pt.wikwik.org/"
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
        const [w0, w1, w2, w3, w4, w5, w6, w7, w8] = await Promise.all([
            await getWords(browser, base_url+paths[0]),
            await getWords(browser, base_url+paths[1]),
            await getWords(browser, base_url+paths[2]),
            await getWords(browser, base_url+paths[3]),
            await getWords(browser, base_url+paths[4]),
            await getWords(browser, base_url+paths[5]),
            await getWords(browser, base_url+paths[6]),
            await getWords(browser, base_url+paths[7]),
            await getWords(browser, base_url+paths[8])
        ])
        const words_in_array = w0.concat(w1, w2, w3, w4, w5, w6, w7, w8)
        //filter words from website
        let words = await filterWords(words_in_array)
        //validate words
        words = await validateWords(words)
        await fs.writeFileSync(path.resolve(__dirname, "..", "..", "database", "wikwik.txt"), words.join("\n"))
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
            words = await page.evaluate(() => {
                children = Array.from(document.querySelector(".mm").children, e => e.innerText)
                return children
            })
            resolve(words)
        }
        catch (e) {
            reject(e)
        }
    })
}

function filterWords(words_in_array) {
    return new Promise(resolve => {
        const words = []
        words_in_array.forEach(line => {
            let iwil = line.split(" ") //Split lines in which have more than one word like eg.: presa Presa
            let words_to_add = []
            iwil.forEach(w => {
                w = w.toLowerCase()
                //remove special characters
                w = Array.from(w).filter(l => {
                    return /[A-z??-??]/.test(l)
                }).join("")
                //check if already exists
                if (!words_to_add.includes(w)) {
                    words_to_add.push(w)
                }
            })
            words_to_add.forEach(w => {
                words.push(w)
            })
        })
        resolve(words)
    })
}

function validateWords(words) {
    return new Promise(async (resolve, reject) => {
        try{
            const amount = 30 //amount of words avaliated each time
            // let stream = fs.createWriteStream("append.txt");
            let validated = []
            for(let i = 0; i < Math.ceil(words.length/amount); i++){
                console.log(`${i*amount} to ${(i+1)*amount} with ${validated.length} words`)
                limit = amount
                if (amount*(i+1) > words.length) {
                    limit = words.length-(amount*i)
                }
                let requests = []
                for(let j = 0; j < limit; j++){
                    requests.push(fetch("https://significado.herokuapp.com/"+words[(i*amount)+j]))
                }
                const responses = await Promise.all(requests)
                responses.forEach((res, index)=> {
                    if(res.ok){
                        // stream.write(words[amount*i+index] + "\n");
                        validated.push(words[amount*i+index])
                    }
                })
            }
            // stream.end();
            resolve(validated)
        }
        catch (e) {
            reject(e)
        }
    })
}