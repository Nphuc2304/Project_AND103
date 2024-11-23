var express = require("express");
var router = express.Router();

var productModel = require("../model/products");

// lấy hết sp
router.get("/all", async function (req, res, next) {
  try {
    var list = await productModel.find({});
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra" });
  }
});
// Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
router.get("/getAll20", async function (req, res) {
  try {
    const { count } = req.query;
    var list = await productModel.find({ productQuantity: { $gt: count } });
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});
// Lấy danh sách sản phẩm có giá từ 20000 đến 50000
router.get("/getPrice", async function (req, res) {
  try {
    const { minPrice, maxPrice } = req.query;
    var list = await productModel.find({
      productPrice: { $gte: minPrice, $lte: maxPrice },
    });
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});
// Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
router.get("/getQuantityPrice", async function (req, res) {
  try {
    const { countPro, pricePro } = req.query;
    var list = await productModel.find({
      $or: [
        { productQuantity: { $lt: countPro } },
        { productPrice: { $gt: pricePro } },
      ],
    });
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});
//Lấy thông tin chi tiết của sản phẩm
// params
router.get("/findID/:id", async function (req, res) {
  try {
    const { id } = req.params;
    var list = await productModel.findById(id);
    res.status(200).json(list);
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});

// thêm sp
router.post("/add", async function (req, res) {
  try {
    const { productName, productPrice, productQuantity } = req.body;

    const newItem = {
      productName,
      productPrice,
      productQuantity,
    };

    await productModel.create(newItem);
    res.status(200).json({ status: true, message: "Đã thêm thành công" });
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});

// chỉnh sửa
router.put("/edit", async function (req, res) {
  try {
    const { id, productName, productPrice, productQuantity } = req.body;

    // tìm sp cần chỉnh sửa
    const findPro = await productModel.findById(id);
    if (findPro) {
      findPro.productName = productName ? productName : findPro.productName;
      findPro.productPrice = productPrice ? productPrice : findPro.productPrice;
      findPro.productQuantity = productQuantity
        ? productQuantity
        : findPro.productQuantity;
      await findPro.save();
      res.status(200).json({ status: true, message: "Đã sửa thành công" });
    } else {
      res
        .status(404)
        .json({ status: false, message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});

// xoá
router.delete("/delete/:id", async function (req, res) {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Đã xoá thành công" });
  } catch (error) {
    res.status(404).json({ status: false, message: "Đã có lỗi xảy ra" });
  }
});

module.exports = router;
