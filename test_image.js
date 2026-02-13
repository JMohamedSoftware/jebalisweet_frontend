const https = require('https');

const url = 'https://nakisha-unidyllic-shona.ngrok-free.dev/uploads/1767091059415-923745448.jpeg';

console.log('Testing Image URL:', url);

const req = https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);

    // Check if it's HTML (Warning Page) or Image
    if (res.headers['content-type'] && res.headers['content-type'].includes('text/html')) {
        console.log('❌ ALERT: Received HTML instead of Image! Ngrok Warning Page detected.');
    } else if (res.headers['content-type'] && res.headers['content-type'].includes('image')) {
        console.log('✅ Success: Received Image content.');
    } else {
        console.log('⚠️ Unknown content type.');
    }
});

req.on('error', (e) => {
    console.log('❌ Request Error:', e.message);
});
