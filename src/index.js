const express = require('express');
const artistRoutes = require('./routes/artistRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use the artistRoutes for handling routes
app.use('/', artistRoutes);

// Use the notFoundHandler for handling 404 errors
app.use(notFoundHandler);

// Use the errorHandler for handling other errors
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
