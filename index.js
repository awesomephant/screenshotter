import puppeteer from "puppeteer"
import * as fs from "fs"

const urls = {
  acre: "https://acrestudios.cc/",
  acre_info: "https://acrestudios.cc/information/",
  eilis: "https://eilissearson.com/",
  coda: "https://ex-coda.com/",
}

async function getScreenshots() {
  const now = new Date()
  const dateFormat = new Intl.DateTimeFormat("en", { timeStyle: "short", dateStyle: "short" })
  const ts = dateFormat.format(now).replace(/[\/,: ]/g, "-")
	console.log(ts)
		; (async () => {
    const browser = await puppeteer.launch({
     	args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1800, height: 1350 })

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
      console.log(`Saved screenshot to ${outputPath}`)
    }

    await browser.close()
  })()
}

async function run() {
  await getScreenshots()
  setTimeout(run, 1000 * 60 * 60 * 24) // Once per day
}

run()
