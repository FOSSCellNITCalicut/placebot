
const puppeteer = require('puppeteer');
const fs = require('fs');


if (process.argv.length !== 4) {
    console.log('Usage: node app.js <domain> <output_file>');
    process.exit(1);
}

const domain = process.argv[2];
const outputFile = process.argv[3];

console.log(`Fetching Domain : ${domain}`);
console.log(`Output File: ${outputFile}`);

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://" + domain); // Replace with the URL of the webpage you want to scrape
  await page.waitForSelector('#turtlecanvas'); // Replace with the selector for the canvas element
  const canvas = await page.$('#turtlecanvas'); // Replace with the correct canvas selector
  const imageData = await canvas.screenshot();

  await browser.close();

  fs.writeFileSync(outputFile, imageData);
  console.log('Image saved as scraped_image.png');
})();

