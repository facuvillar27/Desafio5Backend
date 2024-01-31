function auth(req, res, next) {
    if(req.session && req.session.role === "admin") return next()
    else return res.sendStatus(401)
}

export default auth;