exports.login = async (req, res) => {
  const { user, password } = req.body;

  if (user !== 'admin' && password !== "123") {
    return res.status(400).json({
      message: "User / Password are incorrect",
    });
  } else if (user==='admin' && password === '123') {
    res.json({
        name: "admin",
        token: "40e7d147-aa48-4dc4-8e11-bdc2f58a3666",
        message: "Successful login",
      });
  }
};
