const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

//multer setup
const multer  = require('multer');
const storage = multer.diskStorage({
 destination: function(request, file, callback){
   callback(null, './tmp');
 },
 filename: function(request, file, callback){
   callback(null, file.originalname);
 }
});
const upload = multer({storage: storage}).single('photo');

//nodemailer setup
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/newclient', function (req, res, next) {
	
	var dir = './tmp';

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
	
	upload(req, res, function(err){
		if(err){
			throw err;
		}
		var attachments = [{ 
			filename: req.file.originalname, 
			path: req.file.path
		}];
		let mailOptions = {
			from: '"Bot" <'+process.env.EMAIL_USER+'>',
			to: process.env.EMAIL_RECEIVER,
			subject: 'Hello',
			text: `
			First name: ${req.body.firstName}\n
			Last name: ${req.body.lastName}\n
			E-mail address: ${req.body.email}\n
			Phone number: ${req.body.phoneNumber}\n
			Best time to call: ${req.body.bestTime}\n`,
			attachments: attachments
		};

		transporter.sendMail(mailOptions, (error, info) => {
	    if(error) throw error;
	    fs.unlink(req.file.path);
		});
		res.redirect('/');
	});
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get('*', function(req,res){
	res.end('404');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
