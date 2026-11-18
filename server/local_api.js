const http = require('http');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'database', 'data');
let reviews = JSON.parse(fs.readFileSync(path.join(dataDir, 'reviews.json'), 'utf8')).reviews;
const dealerships = JSON.parse(fs.readFileSync(path.join(dataDir, 'dealerships.json'), 'utf8')).dealerships;

const sendJson = (res, status, obj) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(obj));
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (req.method === 'GET' && urlPath === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Welcome to the Dealership API');
  }
  if (req.method === 'GET' && urlPath === '/fetchReviews') {
    return sendJson(res, 200, reviews);
  }
  if (req.method === 'GET' && urlPath.startsWith('/fetchReviews/dealer/')) {
    const id = parseInt(urlPath.split('/').pop(), 10);
    return sendJson(res, 200, reviews.filter(r => Number(r.dealership) === id));
  }
  if (req.method === 'GET' && urlPath === '/fetchDealers') {
    return sendJson(res, 200, dealerships);
  }
  if (req.method === 'GET' && urlPath.startsWith('/fetchDealers/')) {
    const state = urlPath.substring('/fetchDealers/'.length);
    return sendJson(res, 200, dealerships.filter(d => d.state.toLowerCase() === state.toLowerCase()));
  }
  if (req.method === 'GET' && urlPath.startsWith('/fetchDealer/')) {
    const id = parseInt(urlPath.split('/').pop(), 10);
    return sendJson(res, 200, dealerships.filter(d => Number(d.id) === id));
  }
  if (req.method === 'POST' && urlPath === '/insert_review') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const maxId = reviews.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
        const newReview = {
          id: maxId + 1,
          name: data.name,
          dealership: Number(data.dealership),
          review: data.review,
          purchase: Boolean(data.purchase),
          purchase_date: data.purchase_date,
          car_make: data.car_make,
          car_model: data.car_model,
          car_year: Number(data.car_year)
        };
        reviews.push(newReview);
        return sendJson(res, 200, newReview);
      } catch (e) {
        return sendJson(res, 500, { error: 'Error inserting review' });
      }
    });
    return;
  }
  sendJson(res, 404, { error: 'Not found' });
});

server.listen(3030, '127.0.0.1', () => {
  console.log('Dealership API listening on http://127.0.0.1:3030');
});
