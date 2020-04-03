const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// SERVER

// READING FILES
const tempOverview = fs.readFileSync(`${__dirname}/public/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/public/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/public/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req, res) => {
   const { query, pathname } = url.parse(req.url, true);

   //  ROUTES

   // Overview Page
   if (pathname === '/' || pathname === '/overview') {
      res.writeHead(200, { 'Content-type': 'text/html' });

      const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

      res.end(output);

      // Product Page
   } else if (pathname === '/product') {
      res.writeHead(200, { 'Content-type': 'text/html' });
      const product = dataObject[query.id];
      const output = replaceTemplate(tempProduct, product);
      res.end(output);

      // API
   } else if (pathname === '/api') {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);
   } else {
      res.writeHead(404, {
         'Content-type': 'text/html',
      });
      res.end('<h1>Page not found!</h1>');
   }
});

server.listen(8000, '127.0.0.1', () => {
   console.log('Listening to requests on port 8000');
});
