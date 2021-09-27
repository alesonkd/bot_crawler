const puppeteer = require('puppeteer');
const fs = require('fs');

type Book = {
    title: string,
    price: string,
    availability: string,
    image: string,
    rating: string
}

let scrape = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://books.toscrape.com/');

    const result = await page.evaluate(() => {
        const titles = [] as string[];
        const prices = [] as string[];
        const availability = [] as string[];
        const images = [] as string [];
        const rating = [] as string[];
        const books = [] as Book[];

        document.querySelectorAll('h3 > a').forEach(book => titles.push(book.getAttribute('title')))
        document.querySelectorAll('div.product_price > p.price_color').forEach(book => prices.push(book.textContent))
        document.querySelectorAll('div.product_price > p.instock.availability').forEach(book => availability.push(book.classList[0]))
        document.querySelectorAll('div.image_container > a > img').forEach(book => images.push(book.getAttribute('src')))
        document.querySelectorAll('p.star-rating').forEach(book => rating.push(book.classList[1]));

        for (let key in titles) {
            let book = {} as Book;

            book.title = titles[key];
            book.price = prices[key];
            book.availability = availability[key];
            book.image = images[key];
            book.rating = rating[key];
            books.push(book);

        }
        return books
    });

    fs.writeFile('resultadoJson.json', JSON.stringify(result, null, 2), (err: Error) => {
        if (err) throw new Error('ERRO!!!')

        console.log('Tudo Certo!');
    })

    browser.close();
    return result
};

scrape().then(value => {
    console.log(value);
})