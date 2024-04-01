const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const port = 3000;
const multer = require('multer'); 
const fs = require('fs');
const fileStore = {}; 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/main.html'));
});


app.use((req, res, next) => {
    req.rand = Math.floor(Math.random() * 8999) + 1000; 
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(`./uploads/${req.rand}`, { recursive: true }); 
        cb(null, `./uploads/${req.rand}`);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

function deltime(id) {
    setTimeout(() => {
        fs.rm(`./uploads/${id}`, { recursive: true }, () => console.log('done'));
    }, 300000);
    }
const upload = multer({ storage: storage });
app.post('/upload', upload.array('files'), (req, res) => {
    console.log(req.body);
    deltime(String(req.rand));
    res.send(String(req.rand));
});

app.post('/del', (req, res) => {
    console.log(req.body.mynum);
    fs.rm(`./uploads/${req.body.mynum}`, { recursive: true }, () => console.log('done'));
    res.send("deleted");
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;

    const filePath = `./uploads/${filename}`; 
    console.log(filePath);
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error occurred while downloading the file.');
            }
        });
    } else {
        res.status(404).send('File not found.');
    }
});


app.post('/getheart', (req, res) => {
    console.log(req.body.numbers); 
    if (fs.existsSync(`./uploads/${req.body.numbers}`)) {
        const files = fs.readdirSync(`./uploads/${req.body.numbers}`);
        res.send({ files: files });

    } else {
        res.send("339");
    }
    // res.send("hey");
});



app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
//timelimtupload