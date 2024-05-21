import puppeteer from "puppeteer"
import * as fs from "fs"

const urls = {
  acre: "https://acrestudios.cc/",
}

const now = new Date()
const ts = now.toLocaleDateString("en-uk", { dateStyle: "short" }).replace(/\//g, "-")

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1500, height: 1000 })

  for (let [key, url] of Object.entries(urls)) {
    console.log(`Loading ${key} (${url})...`)
    const outputDir = `./output/${key}/`

    fs.mkdir(outputDir, { recursive: true }, (err) => {
      if (err) {
        throw err
      }
    })

    await page.goto(url, {
      waitUntil: "networkidle2",
    })
    await page.screenshot({
      path: `${outputDir}/${key}-${ts}.png`,
    })
  }

  await browser.close()
})()
