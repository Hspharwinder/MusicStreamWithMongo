const mongoose = require('mongoose');
const user = mongoose.model('user');
const songs = mongoose.model('songs');

const multer = require('multer');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('MusicStreammyTotalySecretKey');
// require('dotenv/config');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');

var signup = function (req, res) {
    const userType = parseInt(req.body.userType);
    // Condtions for updation
    switch (userType) {
        case 1: insertUser(req, res); break;
        case 2: insertUser(req, res); break;
        case 3: insertArtist(req, res); break;
        default: return res.status(200).json([{ success: 'Invalid userType, Fail to signup' }])
    }
};

function insertUser(req, res) {
    //setValue here for insertion
    // Inserting user details in DB 
    user.findById(req.body.id).then(result =>{        
        if (result !== null && result.length >= 1) {
            console.log("user   ", result);
            return res.status(409).json({ message: "User Already Exists" });
        }else{
            var userFields = new user(req.body) // setUserValue(req);
            // userFields.name = req.body.name,  
            // userFields.email = req.body.email,
            // userFields.password = req.body.password
            userFields.save(userFields).then(result2 => {
                console.log(result2);
                res.status(201).json({ message: "Record inserted Successfully" });
            })
            .catch(err => {
                console.log("Error While Insertion ", err);
                res.status(500).json({ error: "Error While Insertion " + err });
            });
        } 
    })
}

function insertArtist(req, res) {
    //setValue here for insertion
    const artistFields = new user(req.body); // setUserValue(req);
    // Inserting artist details in DB 
    artistFields.save().then(result => {
        if (result != 0) {
            fileCopy(req);
            // Successfully signup artist, now return user detail
            retriveUser(artistFields.email, res, 'signup')
        }
    }).catch(err => {
        if (err.code === 11000)
            return res.status(200).json([{ success: 'An account with this email address already exists.' }])
        else
            return res.status(200).json([{ success: 'Fail to signup', error: err }])
    })
}


// function used in createUser and createArtist method
// getting value from request.body and setting in object
var setUserValue = (req) => {
    let newUser = new user({
        // id: generateUserId(),
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        image: req.body.image,
        type: parseInt(req.body.type),
        status: req.body.status,
        description: req.body.description,
        userName: req.body.email
    });
    if (req.body.password)
        newUser.password = cryptr.encrypt(req.body.password);
    // removing 'tempfile' for getting only image name
    if (req.body.image)
        newUser.image = req.body.image.replace('tempFile/', '');
    return (newUser);
}

// imagepath used in multer, fileCopy and deleteFile Function
// function used in signup function
// copy file from temporary folder(tempFile) to parmanent folder(registrationImages)
function fileCopy(req) { 
    const image = req.body.userImage;
    if (image && filePath == image) {
        const fs = require('fs');
        let source = imagePath + image;
        let destination = imagePath + image.replace('tempFile/', '');
        // Copy dsingle file of folder
        fs.copyFile(source, destination, (err) => {
            if (err) throw err;
            console.log('Success Copy file');
            // delete file from temperaory folder 
            deleteFile(fs);
        });
    }
    else { console.log('image path not match with uploaded path'); }
}

// function used in fileCopy function
// delete file from temperaory folder 
function deleteFile(fs) {
    const path = require('path');
    const directory = imagePath + 'tempFile';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                msg = 'successfully deleted ' + file;
                console.log('successfully deleted ' + file);
            });
        }
    });
}

// return User detail from database
function retriveUser(email, res, checkApi) {
    user.find({email:email}).then(result=>{
        // if user not found return Invalid Username
        if (result.length == 0)
            return res.status(200).json([{ success: 'Email not registered' }])

        //adding success element in rows object 
        if (checkApi == 'signup') // result.UserType == 2 &&
            result.success = "Successfully registerd";
        else if (checkApi == 'signup') // result.UserType == 3 && 
            result.splice(0, 0, { success : "Please wait for admin to approve. We will contact you shortly"});
        else if (checkApi == 'forgetPassword'){            
            result.splice(0, 0, { success: "Success forget password" });
            result[1].password = cryptr.decrypt(result[1].password);
        }
        else if (checkApi == 'createArtist')
            result.splice(0, 0, { success: "Please wait for admin to approve. We will contact you shortly"});
        else
            result.splice(0, 0, { success : "Successfully edited"});

        //sendEmail(rows[0]); // send mail to admin
        return res.status(201).json([result]);
    }).catch(err=>{
        return res.status(200).json([{ message: 'Fail to retrive user detail', error: err }]);
    })    
}

var login = function (req, res) {
    // Check that the user logging in exists
    user.find({ userName: req.body.userName}).then(result=>{
        if (result.length == 0) 
            return res.status(200).json([{ message: 'Fail to loggedin, Email not registered' }]);
        if (req.body.password === cryptr.decrypt(result[0].password)) {
            // function for generating token with JWT
            // const tokenStore = generateToken(rows);
            //return res.status(200).send([1, rows[0].Email, tokenStore]);
            result[0].password = cryptr.decrypt(result[0].password); 
            result.splice(0, 0, { success: 'Successfully loggedin' });
            return res.status(200).json(result);
        }
        return res.status(200).json([{ success: 'Fail to loggedin, Password invalid' }]);
    }).catch(err=>{
        return res.status(200).json([{ message: 'Fail to loggedin', error: err }])
    })
};

// check email from db, if email exists return user detail
var forgetPassword = (req, res) => {
    retriveUser(req.body.email, res, 'forgetPassword')
}

// return all users from database
var allUsers = (req, res) => {
    user.find().then(result=>{
        if (result.length == 0)
            return res.status(200).json([{ success: 'Table is empty' }]);
        result.splice(0,0, {success : 'Successfully get all users'});
        return res.status(200).json(result);
    }).catch(err=>{
        return res.status(200).json([{ message: 'Fail to get all users', error: err }]);
    })
};

// // get single users
var singleUser = (req, res) => {
    const id = req.body.id; // get id from body
    if (!id)
        return res.status(200).json([{ success: 'Invalid Id' }])
    user.find({ _id: id}).then(result=>{
        if (result.length === 0)
            return res.status(200).json([{ success: 'Id does not exists' }])
        result.splice(0, 0, { success: 'Successfully get single user' });
        // decrypting password
        if (result[1].Password)
            result[1].Password = cryptr.decrypt(result[1].Password);
        return res.status(200).json(result)
    }).catch(err=>{
        return res.status(200).json([{ message: 'Fail to get single user', error: err }])
    })
};

// Delete a record from tblMedia on basis of artist Id and tblMedia Id
var deleteMediaArtIdMedId = function (req, res) {
    const tblMedia_Id = req.body.tblMedia_Id; // get id from url
    const artistId = req.body.artistId; // get id from url
    songs.deleteOne({ _id: tblMedia_Id, artistId: artistId }).then(result=>{
        if (result.deletedCount != 0) {
            return res.status(200).json([{ message: 'Record deleted sucessfully' }])
        }
        res.status(200).json([{ message: 'Fail to delete, ArtistId and tableId should be valid' }]);
    }).catch(err=>{
        res.status(200).json([{ message: 'Fail to delete, ArtistId and tableId should be valid', error: err }]);
    })
}

// set destionation and file name for saving in folder using multer
const imagePath = 'D:/HSP/Practise/Nodejs/MongoQuery/musicStream/media/registrationImages/';
let filenameStore;
var storage = multer.diskStorage({
    // accept image files only   
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Only jpg,jpeg,png,gif image files are allowed!'), false);
        }
        cb(null, true);
    },
    destination: (req, image, cb) => {
        cb(null, imagePath + 'tempFile')
    },
    filename: function (req, image, cb) {
        filenameStore = Date.now() + '_' + image.originalname;
        cb(null, filenameStore);
    }
})
// uploading image on server
var uploadMulter = multer({ storage: storage });

// return response image is uploaded or not
let filePath;
var imageUpload = function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.status(200).json([{ success: 'Fail to upload image, No image received' }])
    } else {
        console.log('file received');
        filePath = 'tempFile/' + filenameStore;
        return res.status(200).json([{ filePath: filePath, success: 'Successfully uploaded image' }])
    }
};

var artist = function (req, res) {
    // function for creating user in DB
    createArtist(req, res);
};
var createArtist = (req, res) => {
    // Set values of user
    var newUser =  new user(req.body)  //setUserValue(req);
    // Inserting user details in DB
   newUser.save().then(result => {
       // Successfully created user, now return user detail
       if(result.length != 0 )
            retriveUser(newUser.email, res, 'createArtist');
        else
            return res.status(200).json([{ success: 'Fail to signup', error: err }])
   }).catch(err => {
       if (err.code === 'ER_DUP_ENTRY')
           return res.status(200).json([{ success: 'An account with this email address already exists.' }])
       return res.status(200).json([{ success: 'Fail to signup', error: err }])
   })    
};

/** Code Start:: update user and artist */
// Update a user
// callback(err)
var editProfile = ((req, res) => {
    const userType = parseInt(req.body.type);
    // Condtions for updation
    switch (userType) {
        case 2: updateUser(req, res); break;
        case 3: updateArtist(req, res); break;
        default: return res.status(200).json([{ success: 'Invalid userType, Fail to update' }])
    }
});

function updateUser(req, res) {
    //setValue here for updation
    const userFields = user(req.body)//setUserValue(req);
    // Inserting user details in DB 
    user.findOneAndUpdate({userFields}).then(result => {
        if (result != 0) {
            /* copy last uploaded file in permanent folder and 
             remove images from temporary folder */
            fileCopy(req);
            // Successfully updated user, now return user detail
            retriveUser(userFields.email, res, 'updateUser')
        }else{
            return res.status(200).json([{ success: 'Fail to update'}])
        }   
    }).catch(err=> {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(200).json([{ success: 'An account with this email address already exists.' }])
        return res.status(200).json([{ success: 'Fail to update', error: err }])
    })
}

function updateArtist(req, res) {
    // Inserting artist details in DB 
    //setValue here for updation
    const userFields = user(req.body)//setUserValue(req);
    // Inserting user details in DB 
    user.findOneAndUpdate({ userFields }).then(result => {
        if (result != 0) {
            /* copy last uploaded file in permanent folder and 
             remove images from temporary folder */
            fileCopy(req);
            // Successfully updated user, now return user detail
            retriveUser(userFields.email, res, 'updateArtist')
        } else {
            return res.status(200).json([{ success: 'Fail to update' }])
        }
    }).catch(err => {
        if (err.code === 'ER_DUP_ENTRY')
            return res.status(200).json([{ success: 'An account with this email address already exists.' }])
        return res.status(200).json([{ success: 'Fail to update', error: err }])
    })
}
/** Code End:: update user and artist */

/** Code Start:: get all users type 2 */
const allUserType2 = (req,res)=> {
    user.find({"userType":2}).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ success: 'There is no user' }]);
        result.splice(0, 0, { success: 'Successfully get all users' });
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(200).json([{ message: 'Fail to get all users', error: err }]);
    })
}
/** Code End:: get all users type 2 */


exports.signup = signup;
exports.login = login;
exports.forgetPassword = forgetPassword;
exports.allUsers = allUsers;
exports.singleUser = singleUser;
exports.imageUpload = imageUpload;
exports.uploadMulter = uploadMulter;
exports.artist = artist;
exports.editProfile = editProfile;
exports.deleteMediaArtIdMedId = deleteMediaArtIdMedId;
exports.allUserType2 = allUserType2;










// previes code 



// var sendEmail = async (data) =>{
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     service: "Gmail", // comment this for test
//     auth: {
//       user: process.env.GMAIL_USER, // generated ethereal user
//       pass: process.env.GMAIL_PASSWORD // generated ethereal password
//     }
//   });

//   messageBody = '<h2>There is details of created new artist </h2>' 
//     + '<br>Name           ::: ' + data.Name
//     + '<br>Email          ::: ' + data.Email
//     + '<br>Phone No.      ::: ' + data.MobileNo
//     + '<br>Description    ::: ' + data.Description;

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '<test@example.com>', // sender address
//     to: 'test1@gmail.com, test2@gmail.com', // list of receivers
//     subject: 'New Artist Created ✔', // Subject line
//     text:  'Detail of Created New Artist ', // plain text body
//     html: messageBody,// html body
//   });

//   console.log('Message sent: %s', info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }



// used in login function 
// generating token
// const generateToken = (rows) =>{
//   const id = rows[0].ID;
//   const password = rows[0].Password;
//   // generating token
//   return tokenStore = jwt.sign(
//                                 { id: id, password: password },
//                                 process.env.JWT_SECRET_KEY,    //secret key
//                                 { expiresIn: '1h' }
//                               );
// };
// Note : no need yet of token