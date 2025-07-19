import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // This must match your JWT payload
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

export default verifyToken;
