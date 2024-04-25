const expressAsyncHandler = require("express-async-handler");

exports.updateStatesById = expressAsyncHandler(async (model, fieldId) => {
  const profile = await model.findById(fieldId);
  if (!profile) return false;
  profile.status = !profile.status;
  await profile.save();
  return true;
});
