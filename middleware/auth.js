// For writing custom middlewares for user authentication

const jwt = require("jsonwebtoken");

//Setting the token at multiple places
const auth = (req, res, next) => {
  const token =
    req.header("Authorization").replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token;

  // Checking whether the token is present or not
  if (!token) {
    res.status(403).send("Token is missing!!!");
  }

  //Verifying the token
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
  } catch (error) {
    return res.status(403).send("Invalid Token");
  }
  return next();
};

module.exports = auth;
