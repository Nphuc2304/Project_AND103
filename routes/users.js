var express = require("express");
var router = express.Router();
const JWT = require("jsonwebtoken");
const config = require("../util/tokenConfig");

var usersmodel = require("../model/usersmodel");
/* GET users listing. */
router.get("/all", async function (req, res, next) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var list = await usersmodel.find({}).populate("products");
          res.json(list);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi " + error });
  }
});
// query
router.get("/findOld", async function (req, res) {
  const { oldX } = req.query;
  var list = await usersmodel.find({ old: { $gt: oldX } });
  res.json(list);
});

// login
router.post("/logIn", async function (req, res) {
  try {
    const { userName, password } = req.body;
    const checkUser = await usersmodel.findOne({
      username: userName,
      password: password,
    });
    if (checkUser == null) {
      res.status(400).json({ status: false, message: "Đăng nhập thất bại" });
    } else {
      const token = JWT.sign({ id: checkUser._id }, config.SECRETKEY, {
        expiresIn: "1h",
      });
      const refreshToken = JWT.sign({ id: checkUser._id }, config.SECRETKEY, {
        expiresIn: "1d",
      });
      res.status(200).json({
        status: true,
        message: "Đăng nhập thành công",
        token: token,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Lỗi " + error });
  }
});

module.exports = router;
