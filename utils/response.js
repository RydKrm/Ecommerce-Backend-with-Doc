exports.negativeResponse = (res, message) => {
  res.status(400).json({
    success: false,
    message,
  });
};

exports.positiveResponse = (res, message, option = {}) => {
  let object = {
    success: true,
    message,
  };

  for (let key in option) {
    object[key] = option[key];
  }

  res.status(200).json(object);
};
