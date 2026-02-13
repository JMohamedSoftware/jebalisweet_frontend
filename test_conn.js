const http = require('http');

console.log('--- TEST DE CONNEXION BACKEND ---');

// 1. Test Local Backend
const req = http.get('http://localhost:5000/api/products?limit=1', (res) => {
    console.log(`STATUS BACKEND LOCAL: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('✅ Backend Local (localhost:5000) fonctionne et connecte a la BD !');
    } else {
        console.log('❌ Problème Backend Local:', res.statusCode);
    }
    res.resume();
}).on('error', (e) => {
    console.log('❌ Backend Local non accessible (Est-il lance ?):', e.message);
});

console.log('Test lance...');
