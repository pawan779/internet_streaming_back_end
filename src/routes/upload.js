const express=require('express')
const multer=require('multer')
const path = require('path')
const router=express.Router();
const fs=require('fs')

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${ext}`)
    }
})

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can not upload this type of image files"), false)
    }
    cb(null, true);
};

videoFileFilter= (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|mov)$/)) {
        return cb(new Error("You can not upload this type of video file"), false)
    }
    cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter})

const videoUpload = multer({storage: storage,fileFilter: videoFileFilter})

router.get('/stream',(req,res)=>{
    const path="./public/uploads/video.mp4";
    const stat=fs.statSync(path)
    const fileSize=stat.size;
    const range=req.headers.range;
    if(range)
    {
        const parts=range.replace(/bytes=/,"").split("-");
        const start=parseInt(parts[0],10);
        const end=parts[1]?parseInt(parts[1],10):fileSize-1;
        const chunkSize=(end-start)+1;
        const file=fs.createReadStream(path,{start,end});
        const head={
            'Content-Range':`bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges':'bytes',
            'Content-Length':chunkSize,
            'Content-Type':'video/mov'
        }
        res.writeHead(206,head);
        file.pipe(res)
    }
    else{
        const head={
            'Content-Length':fileSize,
            'Content-Type':'video/mov'
        }
        res.writeHead(200,head);
        fs.createReadStream(path).pipe(res)
    }
})

router.get('/video', function(req, res) {

	const path = "./public/uploads/movie.mp4"
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head)
		file.pipe(res)
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
})

router.post('/upload',upload.single('image'),(req,res)=>{
    res.json(req.file);
});

router.post('/video-upload',videoUpload.single('video'),(req,res)=>{
    res.json(req.file);
});

module.exports=router;