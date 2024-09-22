const bodyParser = require("body-parser");
const cors = require("cors");

const handler = (req, res) => {
  const jsonParser = bodyParser.json({ limit: "50mb" });

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.send(200);
    return;
  }

  jsonParser(req, res, () => {
    if (req.method === "GET") {
      return res.status(200).json({ operation_code: 1 });
    }

    if (req.method === "POST") {
      const { data, file_b64 } = req.body;

      if (!Array.isArray(data)) {
        return res
          .status(400)
          .json({ is_success: false, message: "Invalid input data format." });
      }

      const user_id = "U_Sriram";
      const email = "sr7195@srmist.edu.in";
      const roll_number = "RA2111027020112";

      const numbers = data.filter((item) => !isNaN(item));
      const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

      const lowercaseAlphabets = alphabets.filter((item) =>
        /^[a-z]$/.test(item)
      );
      const highest_lowercase_alphabet = lowercaseAlphabets.length
        ? [lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]]
        : [];

      let file_valid = false;
      let file_mime_type = "";
      let file_size_kb = 0;

      if (file_b64) {
        const fileDetails = getFileDetails(file_b64);
        if (fileDetails.valid) {
          file_valid = true;
          file_mime_type = fileDetails.mimeType;
          file_size_kb = fileDetails.fileSizeKb.toFixed(2);
        }
      }

      res.status(200).json({
        is_success: true,
        user_id,
        email,
        roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet,
        file_valid,
        file_mime_type,
        file_size_kb,
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  });
};

module.exports = handler;
