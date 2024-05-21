import puppeteer from "puppeteer"
import * as fs from "fs"

const urls = {
  acre: "https://acrestudios.cc/",
}

const now = new Date()
const ts = now.toLocaleDateString("en-uk", { dateStyle: "short" }).replace(/\//g, "-")

console.log(`Capturing ${Object.keys(urls).length} URLs...`)
;(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1500, height: 1000 })

  for (let [key, url] of Object.entries(urls)) {
    console.log(`Loading ${key} (${url})...`)

    const outputDir = `./output/${key}`
    const outputPath = `${outputDir}/${key}-${ts}.png`

    fs.mkdir(outputDir, { recursive: true }, (err) => {
      if (err) {
        throw err
      }
    })

    await page.goto(url, {
      waitUntil: "networkidle2",
    })
    await page.screenshot({
      path: outputPath,
    })
    console.log(`Saved screenshot to ${outputPath}\n`)
  }

  await browser.close()
})()
