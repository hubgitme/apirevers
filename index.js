const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// پروکسی تلگرام
app.use('/telegram', createProxyMiddleware({
  target: 'https://api.telegram.org',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.removeHeader('cf-connecting-ip');
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-real-ip');
  },
  ws: true,
}));

// پروکسی Groq
app.use('/groq', createProxyMiddleware({
  target: 'https://api.groq.com/openai',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.removeHeader('cf-connecting-ip');
    proxyReq.removeHeader('x-forwarded-for');
  },
  ws: true,
}));

// پروکسی Apinex (با pathRewrite برای حذف /apinex)
app.use('/apinex', createProxyMiddleware({
  target: 'https://api.apinex.bond',
  changeOrigin: true,
  pathRewrite: {
    '^/apinex': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.removeHeader('cf-connecting-ip');
    proxyReq.removeHeader('x-forwarded-for');
  },
}));

// صفحه خوش‌آمدگویی
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
