const isProd = process.env.NODE_ENV === 'production';

// 404 — eşleşmeyen rotalar
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Rota bulunamadı: ${req.method} ${req.originalUrl}` });
};

// Merkezi hata yakalayıcı
const errorHandler = (err, req, res, next) => {
  if (!isProd) console.error(err);

  const status = err.status || err.statusCode || 500;
  const message = isProd ? 'Sunucu hatası.' : (err.message || 'Sunucu hatası.');

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
