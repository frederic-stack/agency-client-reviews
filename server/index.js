const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (_, res) => res.json({ message: 'ClientScore API is running!', status: 'ok' }));
app.get('/health', (_, res) => res.send('ok'));

app.listen(PORT, '0.0.0.0', () => console.log(`Live on ${PORT}`)); 