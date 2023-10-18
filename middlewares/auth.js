const jwt = require('jsonwebtoken');
const secret = "$ecretKey"

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming you store the token in a cookie
  if (!token) {
    return res.status(401).render("login", { message: "Unauthorized" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).render("login", { message: "Unauthorized" });
    }
    // If the token is valid, store the decoded information in the request object
    req.userId = decoded.userId;
    req.username = decoded.username;

    next(); // Proceed to the dashboard route
  });
};

const redirectToDashboardIfAuthenticated = (req, res, next) => {
    const token = req.cookies.token; // Assuming you store the token in a cookie
  
    if (!token) {
      // If no token is present, proceed to the login/registration route
      return next();
    }
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // Token is invalid or has expired, proceed to the login/registration route
        return next();
      }
      // If the token is valid, store the decoded information in the request object
      req.userId = decoded.userId;
      req.username = decoded.username;
  
      return res.redirect("/user/dashboard"); // Proceed to the dashboard route
    });
  };

module.exports = {verifyToken, redirectToDashboardIfAuthenticated};