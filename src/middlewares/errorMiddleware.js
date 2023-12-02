function notFoundHandler(req, res, next) {
    res.status(404).json({ error: 'Not Found' });
}
  
function errorHandler(err, req, res, next) {
    console.error(err.stack);

    // Check if the error has a status code, if not, default to 500
    const statusCode = err.status || 500;
    res.status(statusCode).json({ error: err.message });
}

module.exports = {
    notFoundHandler,
    errorHandler,
};