// exports.negativeResponse = (res, message) => {
//   res.status(400).json({
//     status: false,
//     message,
//   });
// };

// exports.positiveResponse = (res, message, option = {}) => {
//   let object = {
//     status: true,
//     message,
//   };

//   for (let key in option) {
//     object[key] = option[key];
//   }

//   res.status(200).json(object);
// };
