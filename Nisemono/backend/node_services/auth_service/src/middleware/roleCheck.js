function roleCheck(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: no user info" });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient role privileges" });
    }

    next();
  };
}

module.exports = roleCheck;
