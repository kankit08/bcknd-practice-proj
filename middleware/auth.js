// For writing custom middlewares for user authentication

const auth = require("jsonwebtoken");

//Setting the token at multiple places
const auth = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.header("Authorization").replace("Bearer ", "") ||
    req.body.token;
};
