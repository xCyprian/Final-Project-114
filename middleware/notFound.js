// 404 catch-all handler for undefined routes
const notFound = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
