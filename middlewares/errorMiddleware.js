const errorHandler = (err, req, res) => {
  // const statusCode = res.statusCode ? res.statusCode : 500

  // res.status(statusCode)

  res.status(400).json({
    status: false,
    message: err.message,
    // eslint-disable-next-line
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
