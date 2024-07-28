const puppeteer = require('puppeteer');

// Edit this with the URL of the website that you are on 
const url = "https://www.amazon.com/New-Apple-AirPods-Max-Blue/dp/B08PZHYWJS/ref=sr_1_3?crid=2RB0FPTBRUY5V&dib=eyJ2IjoiMSJ9.cAD_qAApnyUKwmxqHeslw9E2UTKirt8YJYiEmMJHIvma_SOQhGptXWvvTVjGApxNb8rBDDAov56CPkZr7_I_l08nMKRp0D62AaR10ay9SMNT0_8doJbjvMeikEO-owmifHXVQNGhzerc3g1IkUduQSBMmiOJcereens4D9LINMONY1F27GtwPM0WiocQHrPzd7uKunLto3yuVSJ5hKtYaqfLHNPF5nD1-gwm22xlNFc.cX9xgNIVg7qtWjtX__5ekUnoI3F1P3jTzeUonWN1O-Q&dib_tag=se&keywords=apple%2Bairpods%2Bmax&qid=1722155980&sprefix=apple%2Ba%2Caps%2C74&sr=8-3&th=1";


async function MakeBrowser() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
    } catch (error) {
        console.error("Failed to load page:", error);
        await browser.close();
        process.exit(1);
    }
    return { browser, page };
}

// Do you want Warranty true if yes, false if no
const DoYouWantWarrenty = false;

async function Warranty(page, DoYouWantWarrenty) {
    try {
        if (DoYouWantWarrenty) {
            const hasWarrantyOption = await page.$("input[aria-labelledby='attachSiAddCoverage-announce']");
            if (hasWarrantyOption) {
                await page.waitForSelector("input[aria-labelledby='attachSiAddCoverage-announce']");
                await page.$eval("input[aria-labelledby='attachSiAddCoverage-announce']", elem => elem.click());
            } else {
                console.log("No warranty option available.");
            }
        } else {
            const hasNoWarrantyOption = await page.$("input[aria-labelledby='attachSiNoCoverage-announce']");
            if (hasNoWarrantyOption) {
                await page.waitForSelector("input[aria-labelledby='attachSiNoCoverage-announce']");
                await page.$eval("input[aria-labelledby='attachSiNoCoverage-announce']", elem => elem.click());
            } else {
                console.log("No warranty option available.");
            }
        }
    } catch (error) {
        console.error("Failed to select warranty option:", error);
    }
}

async function addToCart(page) {
    try {
        await page.waitForSelector("input[name='submit.add-to-cart']");
        await page.$eval("input[name='submit.add-to-cart']", elem => elem.click());
        await Warranty(page, DoYouWantWarrenty);
        await page.waitForSelector("input[name='proceedToRetailCheckout']");
        await page.$eval("input[name='proceedToRetailCheckout']", elem => elem.click());
    } catch (error) {
        console.error("Failed to add to cart:", error);
    }
}
//enter your Amazon email and password
const email = 'Example@email.com';
const password = 'pasword';

async function signIn(page) {
    try {
        await page.waitForSelector("input[id='ap_email']");
        await page.type("input[id='ap_email']", email);
        await page.waitForSelector("input[aria-labelledby='continue-announce']");
        await page.$eval("input[aria-labelledby='continue-announce']", elem => elem.click());

        await page.waitForSelector("input[id='ap_password']");
        await page.type("input[id='ap_password']", password);
        await page.waitForSelector("input[id='signInSubmit']");
        await page.$eval("input[id='signInSubmit']", elem => elem.click());
    } catch (error) {
        console.error("Failed to sign in:", error);
    }
}

async function Checkout() {
    const { browser, page } = await MakeBrowser();
    try {
        await addToCart(page);
        await signIn(page);
        console.log("Item added to cart and signed in successfully.");
        await page.$eval("input[aria-labelledby='a-autoid-0-announce']", elem => elem.click());

    } catch (error) {
        console.error("Failed during checkout process:", error);
    }
}

Checkout();
