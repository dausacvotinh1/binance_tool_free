const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Cho phép gọi API từ mọi nơi (CORS)
app.use(cors());

// Phục vụ các file tĩnh từ thư mục public/
app.use(express.static(path.join(__dirname, 'public')));

// API: Lấy dữ liệu 24h từ Binance
app.get('/api/ticker', async (req, res) => {
  try {
    const response = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Lỗi khi gọi API ticker:', error.message);
    res.status(500).json({ error: 'Lỗi khi gọi API Binance' });
  }
});

// API: Lấy dữ liệu nến (klines) từ Binance
app.get('/api/klines', async (req, res) => {
  const { symbol, interval = '1h', limit = 100 } = req.query;
  try {
    const response = await axios.get('https://fapi.binance.com/fapi/v1/klines', {
      params: { symbol, interval, limit }
    });
    res.json(response.data);
  } catch (error) {
    console.error('❌ Lỗi khi gọi API klines:', error.message);
    res.status(500).json({ error: 'Lỗi lấy dữ liệu từ Binance' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
