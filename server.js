const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

//store values for email constants
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS
const emailReceiver = process.env.EMAIL_RECEIVER

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
    user: emailUser,
    pass: emailPass
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

		console.log(typeof req.body)

		//generate string
		let emailContents = "";
		Object.keys(req.body).forEach(function(key) {
			let currentValue = req.body[key]
			let testString = key + ": " + currentValue + "\n"
			console.log(testString)
			emailContents += testString
		})

		let mailOptions = {
			from: '"Bot" <' + emailUser + '>',
			to: emailReceiver,
			subject: 'Transfer Form for ' + req.body["Habbo Name"],
			text: emailContents
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
