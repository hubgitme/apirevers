const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// پروکسی تلگرام
app.use('/telegram', createProxyMiddleware({
  target: 'https://api.telegram.org',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // حذف هدرهای نشت‌دهنده آی‌پی
    proxyReq.removeHeader('cf-connecting-ip');
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-real-ip');
  },
  ws: true, // پشتیبانی از وب‌ساکت
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

// پروکسی Apinex
app.use('/apinex', createProxyMiddleware({
  target: 'https://api.apinex.bond',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.removeHeader('cf-connecting-ip');
    proxyReq.removeHeader('x-forwarded-for');
  },
}));

// صفحه خوش‌آمدگویی
app.get('/', (req, res) => {
  res.send('پروکسی چندپروایدری روی Koyeb فعال است. <br>
    <a href="/telegram/botYOUR_TOKEN/getMe">تست تلگرام</a><br>
    <a href="/groq/v1/chat/completions">تست Groq</a><br>
    <a href="/apinex/v1/chat/completions">تست Apinex</a>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
