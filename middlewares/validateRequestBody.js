// Middleware to validate request body
function validateRequestBody(req, res, next) {
	for (const key in req.body) {
		if (req.body.hasOwnProperty(key)) {
			const value = req.body[key];
			// Check if the value is not null or empty
			if (value == null || value.toString().trim() === "") {
				return res.status(400).json({
					message: `Value for ${key} is required and cannot be empty`,
					code: 400,
				});
			}
		}
	}
	next(); // Proceed to the next middleware/controller if validation passes
}

module.exports = validateRequestBody;
