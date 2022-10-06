const shortId = require("shortid");
const urlModel = require("../model/urlmodel");
const axios = require("axios");
const { GET_ASYNC, SET_ASYNC } = require("../Redis/redis");

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

    let cacheURLData = await GET_ASYNC(`${longUrl}`);

    if (cacheURLData) {
      cacheURLData = JSON.parse(cacheURLData);
      let cacheURLDataObj = {
        longUrl: cacheURLData.longUrl,
        shortUrl: cacheURLData.shortUrl,
        urlCode: cacheURLData.urlCode,
      };

      return res
        .status(200)
        .send({
          status: true,
          message: `This URL is Already Present in Cache! So use this shortURL: ${cacheURLData.shortUrl}`,
          data: cacheURLDataObj,
        });
    }

    let findUrl = await urlModel
      .findOne({ longUrl })
      .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });

    if (findUrl) {
      await SET_ASYNC(`${longUrl}`, 24 * 60 * 60, JSON.stringify(findUrl));

      let isPresentObj = {
        longUrl: findUrl.longUrl,
        shortUrl: findUrl.shortUrl,
        urlCode: findUrl.urlCode,
      };

      return res
        .status(200)
        .send({
          status: true,
          message: `For This LongUrl use this ShortUrl: ${findUrl.shortUrl} which is already Registered in DB`,
          data: isPresentObj,
        });
    }

    let urlCode = shortId.generate().toLowerCase();
    let baseUrl = `http://localhost:3000/`;
    let shortUrl = baseUrl + urlCode;

    let createUrl = {
      longUrl,
      shortUrl,
      urlCode,
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

    let cacheURLData = await GET_ASYNC(`${urlCode}`);

    if (cacheURLData) {
      cacheURLData = JSON.parse(cacheURLData);

      return res.status(302).redirect(cacheURLData.longUrl);
    } else {
      let findUrl = await urlModel.findOne({ urlCode });

      if (!findUrl) {
        return res
          .status(400)
          .send({ status: false, message: "url not found" });
      }

      let objUrl = findUrl.toObject();

      await SET_ASYNC(`${urlCode}`, 24 * 60 * 60, JSON.stringify(findUrl));

      res.status(302).redirect(findUrl.longUrl);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrlShortner, getUrl };
