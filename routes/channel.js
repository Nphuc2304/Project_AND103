var express = require("express");
var router = express.Router();
const JWT = require("jsonwebtoken");
const config = require("../util/tokenConfig");

var channelModel = require("../model/channelsmodel");

// thêm channel
router.post("/add", async function (req, res) {
  try {
    const token = req.header("authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { channelName, channelImage, description, followedChannel } =
            req.body;

          const newItem = {
            channelName,
            channelImage,
            description,
            followedChannel,
          };

          await channelModel.create(newItem);
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

// lấy toàn bộ channel
router.get("/get_all_channel", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var list = await channelModel.find({});
          res
            .status(200)
            .json({ status: true, message: "Thành công", data: list });
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// xoá channel
router.delete("/del_channel/:id", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { id } = req.params;
          await channelModel.findByIdAndDelete(id);
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

// chỉnh sửa channel
router.put("/edit_channel", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const {
            id,
            channelName,
            channelImage,
            description,
            followedChannel,
          } = req.body;

          var channel = await channelModel.findById(id);
          if (channel) {
            channel.channelName = channelName
              ? channelName
              : channel.channelName;
            channel.channelImage = channelImage
              ? channelImage
              : channel.channelImage;
            channel.description = description
              ? description
              : channel.description;
            channel.followedChannel = followedChannel
              ? followedChannel
              : channel.followedChannel;
            await channel.save();
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

// tìm theo id channel
router.get("/find_channel_by_id", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { id } = req.query;
          var channel = await channelModel.findById(id);
          res.status(200).json(channel);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// tìm theo tên channel
router.get("/find_by_name/:name", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { name } = req.params;
          var channel = await channelModel.find({ channelName: { $eq: name } });
          res.status(200).json(channel);
        }
      });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    res.status(404).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});

// tìm channel có lượng follow trong khoảng min -> max
router.get("/find_by_follow/:min/:max", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          const { min, max } = req.params;

          var list = await channelModel.find({
            followedChannel: { $gte: min, $lte: max },
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

// Sắp xếp danh sách channel tăng dần
router.get("get_channel_increasing", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var list = await channelModel.find({}).sort({ average: 1 });
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

// Sắp xếp danh sách channel giảm dần
router.get("get_channel_decreasing", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var list = await channelModel.find({}).sort({ average: -1 });
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

// tìm channel có lượt follow cao nhất
router.get("", async function (req, res) {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: 403, err: err });
        } else {
          var listMajor = await channelModel
            .find({})
            .sort({ average: -1 })
            .limit(1);
          var highestList = await channelModel.find({
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

module.exports = router;
