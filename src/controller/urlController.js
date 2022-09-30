const shortId = require("shortid");
const urlModel = require("../model/urlmodel");
const axios = require("axios");

/////===========================================  create shortUrl ========================================================//////

const createUrlShortner = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Send data from body" });
    }

    let options = {
      method: "get",
      url: longUrl,
    };
    let result = await axios(options).catch(() => "url invalid");

    if (result === "url invalid") {
      return res
        .status(400)
        .send({ status: false, message: "longUrl invalid" });
    }

    let findUrl = await urlModel
      .findOne({ longUrl })
      .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });

    if (findUrl) {
      return res
        .status(200)
        .send({
          status: true,
          message: "longUrl already exist",
          data: findUrl,
        });
    }

    let urlCode = shortId.generate().toLowerCase();

    let shortUrl = `http://localhost:3000/${urlCode}`;

    let createUrl = {
      urlCode,
      longUrl,
      shortUrl,
    };

    let create = await urlModel.create(createUrl);

    return res.status(201).send({ status: true, data: createUrl });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

////================================================ get long url (redirect)  ========================================================////////

let getUrl = async (req, res) => {
  try {
    let urlCode = req.params.urlCode;
    if (!urlCode) {
      return res
        .status(400)
        .send({ status: false, message: "Send urlCode from params" });
    }

    let findUrl = await urlModel.findOne({ urlCode });

    if (!findUrl) {
      return res.status(400).send({ status: false, message: "url not found" });
    }
    let objUrl = findUrl.toObject();

    return res.status(302).redirect(objUrl.longUrl);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrlShortner, getUrl };
