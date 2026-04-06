const express = require("express");
const sharp = require("sharp");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

async function loadImage(url) {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(res.data);
}

app.post("/generate", async (req, res) => {
    try {
        const { rows, cols, ratio, urls, tileWidth, fit } = req.body;

        const ROWS = parseInt(rows);
        const COLS = parseInt(cols);
        const TOTAL = ROWS * COLS;

        const urlList = urls.split("\n").map(u => u.trim()).filter(Boolean);

        // ratio
        const [rw, rh] = ratio.split(":").map(Number);
        const targetRatio = rw / rh;

        // 🔥 dynamic tile width
        const tileW = parseInt(tileWidth) || 300;
        const tileH = Math.round(tileW / targetRatio);

        const canvasW = COLS * tileW;
        const canvasH = ROWS * tileH;

        const composites = [];

        for (let i = 0; i < TOTAL; i++) {
            const row = Math.floor(i / COLS);
            const col = i % COLS;

            let imgBuffer;

            if (i < urlList.length) {
                const buffer = await loadImage(urlList[i]);

                imgBuffer = await sharp(buffer)
                    .resize(tileW, tileH, {
                        fit: fit || "contain",
                        background: { r: 255, g: 255, b: 255 }
                    })
                    .toBuffer();
            } else {
                imgBuffer = await sharp({
                    create: {
                        width: tileW,
                        height: tileH,
                        channels: 3,
                        background: { r: 255, g: 255, b: 255 },
                    },
                }).png().toBuffer();
            }

            composites.push({
                input: imgBuffer,
                left: col * tileW,
                top: row * tileH,
            });
        }

        const buffer = await sharp({
            create: {
                width: canvasW,
                height: canvasH,
                channels: 3,
                background: { r: 255, g: 255, b: 255 },
            },
        })
            .composite(composites)
            .jpeg({ quality: 100 })
            .toBuffer();

        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Content-Length", buffer.length);
        
        return res.status(200).end(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate collage" });
    }
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});