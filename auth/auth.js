const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const auth = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return next(createError(403, "Authorization token is required"));
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
      // eslint-disable-next-line
      const isvarified = await jwt.verify(token, process.env.TOKENSECRATE);
      if (!isvarified) {
        return next(createError(403, "Invalid Token"));
      }
      if (roles.length > 0) {
        if (roles.includes(isvarified.role)) {
          req[isvarified.role] = {
            _id: isvarified.id,
            role: isvarified.role,
          };
          next();
        } else {
          return next(
            createError(403, `Only ${roles.toString()} can do this request.`)
          );
        }
      } else {
        req[isvarified.role] = { _id: isvarified.id, role: isvarified.role };
        next();
      }
    } catch (error) {
      return next(error);
    }
  };
};

// authorization error handler for authorization errors;
const authorize = (roles = []) => {
  // covert single string to array with same name as roles
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    try {
      // get the authorization token from the request header
      const tokenWithBearer = req.header("Authorization");

      if (!tokenWithBearer) return res.status(401).send("Access denied.");

      // split the token from the bearer
      const newToken = tokenWithBearer.split(" ")[1];

      // verify the token
      // eslint-disable-next-line
      const verified = jwt.verify(newToken, process.env.TOKENSECRATE);

      // assign the verified token to the request object auth property
      req.auth = verified; // set the request "authorized" property with the validation result
      req.role = verified.role; // set the request "authorized" property with the validation result

      // check if is roles is in the roles array
      if (roles.length > 0 && !roles.includes(verified.role)) {
        return res.status(401).send("Access Denied");
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(501).json(err);
    }
  };
};

// export the auth and authorize function to be used in other files
module.exports = {
  auth,
  authorize,
};
