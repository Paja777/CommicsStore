const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify authentification
  const { authorization } = req.headers;
  

  if (!authorization) {
    return res.status(401).json({ erorr: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // find user with id from token and select only id property
    req.user = await User.findOne({ _id });
    
    next(); 
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send("You do not have permission to perform this action");
    }
    next();
  };
};

module.exports = { requireAuth, restrict };
