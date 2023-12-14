const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/compress", upload.single("file"), async (req, res) => {
  try {
    const { width, height, size } = req.body;
    const fileBuffer = req.file.buffer;
    let sizeint = parseInt(size);
    console.log(width);

    if (!fileBuffer) {
      return res.status(400).send("Invalid request");
    }

    let compressedImage;
    const outputFormat = "jpeg"; // Default output format, you can change it to 'png' if needed
    let quality = 80; // Initial quality setting, you can adjust as needed
    let currentSize;
    do {
      compressedImage = await sharp(fileBuffer)
        .resize({
          width: parseInt(width),
          height: parseInt(height),
          fit: "contain",
        })
        .toFormat(outputFormat, { quality, force: false })
        .toBuffer();

      currentSize = compressedImage.length;

      if (currentSize < parseInt(sizeint) * 1024 || quality <= 10) {
        break;
      }

      quality -= 2; // Reduce quality and try again
      console.log(quality);
    } while (true);

    res.set("Content-Type", `image/${outputFormat}`);
    res.set(
      "Content-Disposition",
      `attachment; filename=compressed_image.${outputFormat}`
    );
    res.send(compressedImage);
  } catch (error) {
    console.error("Error compressing image:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
