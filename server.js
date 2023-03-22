const express = require('express')
const app = express()
const multer = require('multer')// for handling multipart form data
const port = 3300
const path = require('path')
const staticPath = path.join(__dirname,'/public')
app.set("views",path.join(__dirname,"views"))
app.set("view engine","html")
app.engine('html', require('ejs').renderFile);
const {spawn} = require('child_process')

//serving website on express server
console.log(__dirname)
console.log(staticPath)
app.use(express.static(staticPath))

//responding by sending .html file

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'index.html'))
})

const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null,'Uploads');
  },
  filename: function(req,file,cb){
    cb(null, file.originalname)
  }
});
const upload = multer({storage});
// post route
/*app.post('/Uploads',(req,res)=>{
  const storage = multer.diskStorage({
    destination: function(req,res,cb){
      cb(null,__dirname+'/Uploads') //cb means call back function
    },
    filename: function(req,file,cb){
      cb(null, file.originalname)
    }
  })*/
  
  /*const upload = multer({storage: storage}).single('audioclips') //name of input file

  upload(req,res,(err)=>{
    console.log(req.file)

    //for handling error
    if(err){
      console.log(err);
      return;
    }
    console.log('file uploaded!!');
    res.status(200).json({"msg":"file uploaded..."});
    const ad=req.file.path
    const childpy= spawn('python',['predict.py',ad])
    childpy.stdout.on('data',(data)=>{
        console.log(`std: ${data}`)
        return res.send(`${data}`);
    });
    childpy.stderr.on('data',(data) =>{
        console.error(`stderr:${data}`)
    });
    childpy.on('close',(code)=>{
        console.log('Exited');
    });
  })

})*/
var t="hello"
app.post('/Uploads',upload.single('file'), function(req,res){
    
  console.log(req.file.path)
  const ad=req.file.path
  const childpy= spawn('python',['predict.py',ad])
  
  
  childpy.stdout.on('data',(data)=>{
      console.log(`std: ${data}`)
      t=data.toString()
      
  });
  childpy.stderr.on('data',(data) =>{
      console.error(`stderr:${data}`)
  });
  childpy.on('close',(code)=>{
      console.log('Exited');
  }
  );
  
});
app.get('/ans', function(req, res) {
  console.log(t)
  res.render(__dirname + "/public/recognition.html", {ans:t});
  
})

app.listen(port, function () {
  console.log(`Listening on port ${port}!`)
})
