const puppeteer = require('puppeteer-core');
const path = require('path');
const express = require('express');

let config = {
    port: process.env.Port || 3000,
    chromePath: process.env.ChromePath || 'E:\\.local-chromium\\win64-706915\\chrome-win\\chrome.exe'
};

async function init() {
    const browser = await puppeteer.launch({
        executablePath: config.chromePath,
        args: ['--no-sandbox']
    });

    const app = express();

    app.get('*', async function (req, res) {
        try {
            let url = req.protocol + '://' + req.header('host') + req.originalUrl;
            console.log(url);
            const page = await browser.newPage();
            await page.goto(url);
            await page.waitFor(1000 * 3);
            let cont = await page.content();
            page.close();
            res.send(cont);
        } catch (e) {
            res.send(e.message);
        }
    });

    app.listen(config.port, function () {
        console.log(`app listening on port ${config.port}!`);
    });
}

init().catch(e => {
    console.error(e);
});