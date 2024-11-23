var express = require("express");
var router = express.Router();
const JWT = require("jsonwebtoken");
const config = require("../util/tokenConfig");

var studentModel = require("../model/studentsmodel");
const { route } = require("./users");

// thêm sinh viên
// router.post("/add", async function (req, res) {
//   try {
//     const { mssv, password, nameStudent, average, major, date } = req.body;

//     const newItem = {
//       mssv,
//       password,
//       nameStudent,
//       average,
//       major,
//       date,
//     };

//     await studentModel.create(newItem);
//     res.status(200).json({ status: true, message: "Đã thêm thành công" });
//   } catch (error) {
//     res
//       .status(404)
//       .json({ status: false, message: "Đã có lỗi xảy ra" + error });
//   }
// });

// Lấy toàn bộ danh sách sinh viên
router.get("/get_all_student", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var list = await studentModel.find({});
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get("/get_all_student_major", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { m } = req.query;
          var list = await studentModel.find({ major: { $eq: m } });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi cảy ra " + error });
  }
});

// Lấy danh sách sản phẩm có điểm trung bình từ 6.5 đến 8.5
router.get("/get_avg/:minAvg/:maxAvg", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { minAvg, maxAvg } = req.params;

          const min = parseFloat(minAvg);
          const max = parseFloat(maxAvg);

          var list = await studentModel.find({
            average: { $gte: min, $lte: max },
          });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// Tìm kiếm thông tin của sinh viên theo MSSV
router.get("/find_by_mssv", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { ma } = req.query;
          var student = await studentModel.find({ mssv: { $eq: ma } });
          res.status(200).json(student);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// Thêm mới một sinh viên mới
router.post("/add_new_student", async function (req, res) {
  try {
    const token = req.header("authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { mssv, password, nameStudent, average, major, date } =
            req.body;

          const newItem = {
            mssv,
            password,
            nameStudent,
            average,
            major,
            date,
          };

          await studentModel.create(newItem);
          res.status(200).json({ status: true, message: "Đã thêm thành công" });
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Thay đổi thông tin sinh viên theo MSSV
router.put("/edit_student_by_mssv", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { mssv, password, nameStudent, average, major, date } =
            req.body;

          var student = await studentModel.findOne({ mssv: { $eq: mssv } });
          if (student) {
            student.password = password ? password : student.password;
            student.nameStudent = nameStudent
              ? nameStudent
              : student.nameStudent;
            student.average = average ? average : student.average;
            student.major = major ? major : student.major;
            student.date = date ? date : student.date;
            await student.save();
            res
              .status(200)
              .json({ status: true, message: "Đã sửa thành công" });
          }
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Xóa một sinh viên ra khỏi danh sách
router.delete("/delete_student/:mssv", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { mssv } = req.params;
          await studentModel.findOneAndDelete({
            mssv: { $eq: mssv },
          });
          res.status(200).json({ status: true, message: "Đã xoá thành công" });
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get("/find_student_major_avg/:major/:avg", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { major, avg } = req.params;
          const average = parseFloat(avg);
          let list = await studentModel.find({
            major: { $eq: major },
            average: { $gte: average },
          });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
router.get(
  "/find_student/:minAge/:maxAge/:major/:avg",
  async function (req, res) {
    try {
      const token = req.header("Authorization").split(" ")[1];
      if (token) {
        JWT.verify(token, config.SECRETKEY, async function (err, id) {
          if (err) {
            res.status(403).json({ status: 403, err: err });
          } else {
            const { minAge, maxAge, major, avg } = req.params;

            const min = parseFloat(minAge);
            const max = parseFloat(maxAge);
            const average = parseFloat(avg);

            let list = await studentModel.find({
              date: { $gte: min, $lte: max },
              major: { $eq: major },
              average: { $gte: average },
            });
            res.status(200).json(list);
          }
        });
      } else {
        res.status(401).json({ status: 401 });
      }
    } catch (error) {
      res
        .status(404)
        .json({ status: false, message: "Đã có lỗi xảy ra" + error });
    }
  }
);

// Sắp xếp danh sách sinh viên tăng dần theo dtb
router.get("/get_all_student_sort_by_svg", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var list = await studentModel.find({}).sort({ average: 1 });
          res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res
      .status(404)
      .json({ status: false, message: "Đã có lỗi xảy ra" + error });
  }
});

// Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
router.get("/student_highest_avg/:major", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { major } = req.params;
          var listMajor = await studentModel
            .find({ major: { $eq: major } })
            .sort({ average: -1 })
            .limit(1);
          var highestList = await studentModel.find({
            major: { $eq: major },
            average: { $eq: listMajor[0].average },
          });
          res.status(200).json(highestList);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// logIn create jwt
router.post("/logIn", async function (req, res) {
  try {
    const { mssv, pass } = req.body;
    const checkStudent = await studentModel.findOne({
      mssv: mssv,
      password: pass,
    });
    if (checkStudent == null) {
      res.status(200).json({ status: false, message: "Đăng nhập thất bại" });
    } else {
      const token = JWT.sign({ id: checkStudent._id }, config.SECRETKEY, {
        expiresIn: "10m",
      });
      const refreshToken = JWT.sign(
        { id: checkStudent._id },
        config.SECRETKEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        status: true,
        message: "Đăng nhập thành công",
        token: token,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Lỗi: " + error });
  }
});

module.exports = router;
