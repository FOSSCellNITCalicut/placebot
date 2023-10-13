const puppeteer = require('puppeteer');

if (process.argv.length !== 3) {
    console.log('Usage: node app.js <domain> ');
    process.exit(1);
}

const domain = process.argv[2];

console.log(`Checking js Errors in Domain : ${domain}`);
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

	page.on('pageerror', (error) => {
		if( !error.stack.includes('turtle.js')) {
			console.log(error)
			process.exit(-1)
		}
    });

	const url = 'https://' + domain;
    await page.goto(url);

	process.exit(0)

    await browser.close();
})();
