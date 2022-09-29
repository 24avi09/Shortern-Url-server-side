let validUrl = require("valid-url");
const shortId = require("shortid");
const urlModel = require("../model/urlmodel");
const config = require("config");

const createUrlShortner = async (req, res) => {
  try {
    const { data } = req.body;
    // const baseUrl = config.get("baseUrl");

    if (!validUrl.isUri(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid longUrl" });
    }

    let url = await urlModel.findOne({ data });

    if (url) {
      return res
        .status(200)
        .send({ status: true, message: "url already exist", data: url });
    }

    let urlCode = shortId.generate();
    let shortUrl=`http://localhost:3000/${urlCode}`
    data.urlCode=urlCode
    data.shortUrl=shortUrl
    

    url = new urlModel({
      urlCode,
      longUrl,
    });

    let data1 = await url.save();
    return res.status(201).send({ status: true, data: data1 });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrlShortner };

// let a ="https://stackoverflow.com/questions/30931079/validating-a-url-in-node"

// // if (validUrl.isUri(a)){
// //     console.log('Looks like an URI');
// // } else {
// //     console.log('Not a URI');
// // }

// function ValidURL(URL) {

//     console.log(validUrl.isUri(URL))
//     return validUrl.isUri(URL)
// }

// ValidURL(a)

// module.exports = ValidURL;