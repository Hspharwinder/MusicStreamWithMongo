const mongoose = require('mongoose');
const songs = mongoose.model('songs');
const user = mongoose.model('user');

const multer = require('multer'); // for uploading files
require('dotenv/config');

// Variabele used for image uploading, copying and deleting 
//imagepath used in multer, fileCopy and deleteFile Function
const imageFolderPath = './media/songsAndImages/';
let tempImageNameStore; // storing image name with foldername like - tempThumbImage/abc.png
let thumbnailImageName; // storing only image name like - 1571724607849_Capture.png
/***  Code Start:: Thumb Image Upload  ***/
// set destionation and file name for saving in folder using multer
var thumbStorage = multer.diskStorage({
    // accept image files only   
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Only jpg,jpeg,png,gif image files are allowed!'), false);
        }
        cb(null, true);
    },
    destination: (req, image, cb) => {
        cb(null, imageFolderPath + 'tempFile')
    },
    filename: function (req, image, cb) {
        thumbnailImageName = Date.now() + '_' + image.originalname;
        cb(null, thumbnailImageName);
    }
})
// uploading image on server
var thumbUploadMulter = multer({ storage: thumbStorage });
// return response image is uploaded or not
var thumbImageUpload = function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.status(200).json([{ message: 'Fail to upload image, No image received' }])
    } else {
        console.log('file received');
        tempImageNameStore = 'tempFile/' + thumbnailImageName;
        return res.status(200).json([{ filePath: tempImageNameStore, message: 'Successfully uploaded image' }])
    }
};
/*** Code End:: Thumb Image Upload  ***/

// Variabele used for song uploading, copying and deleting 
// songFolderPath used in multer, fileCopy and deleteFile Function
const songFolderPath = './media/songsAndImages/'; 
let songName; // for storing only song name --- 1571724607849.mp3
let tempSongNameStore; // storing image name with folder name like - tempFile/1571724607849.mp3
/***  Code Start:: Song Upload  ***/
// set destionation and file name for saving in folder using multer
var storage = multer.diskStorage({
    destination: (req, song, cb) => {
        cb(null, songFolderPath + 'tempFile')
    },
    filename: function (req, song, cb) {
        songName = Date.now() + '_' + song.originalname;
        cb(null, songName);
    }
})
// uploading song on server
var songUploadMulter = multer({ storage: storage });
// return response song is uploaded or not
var songUpload = function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.status(200).json([{ message: 'Fail to upload song, No song received' }])
    } else {
        console.log('file received');
        tempSongNameStore = 'tempFile/' + songName;
        return res.status(200).json([{ filePath: tempSongNameStore, message: 'Successfully uploaded song' }])
    }
};
/***  Code End:: Song Upload  ***/

/***   Code Start:: inserting song detail into DB  ***/
var songInsert = function (req, res) {
    // function for creating Song in DB
    createSong(req, res);
};
// creating Song in DB
var createSong = (req, res) => {
    // Set values of Song
    // let newSong = new songs(req.body);
    var newSong = setSongValue(req);
    // Inserting Song details in DB
    newSong.save().then(result => {
        console.log(result);
        if (result.length != 0) {
            /* copy last uploaded file in permanent folder and
                remove images from temporary folder */
            fileCopy(req)
            // Successfully created Song, now return Song detail
            retriveSong(newSong.name, res)
        }else{
            return res.status(200).json([{ message: 'No row affected in DB', error: err }])
        }
        // res.status(201).json({ message: "Record inserted Successfully" });
    }).catch(err => {
        console.log("Error While Insertion ", err);
        res.status(500).json({ error: "Error While Insertion " + err });
    }); 
};

// function used in createUser and createArtist method
// getting value from request.body and setting in object
var setSongValue = (req) => {
    let newSong = new songs({
        name: req.body.name,
        artistId: req.body.artistId,
        userType: req.body.userType,
        songType: req.body.songType,
        filePath: req.body.filePath.replace('tempFile/', ''),
        thumbnailPath: req.body.thumbnailPath.replace('tempFile/', ''),
    });
    return (newSong);
}

// function used in signup function
// copy file from temporary folder to parmanent folder
function fileCopy(req) { 
    copySongFile(req);
    copyThumbImageFile(req);   
}
// copy and deleting song File
function copySongFile(req){
    if (req.body.filePath && tempSongNameStore == req.body.filePath) {
        const fs = require('fs');
        let source = songFolderPath + req.body.filePath;
        let destination = songFolderPath + req.body.filePath.replace('tempFile/', '');
        // Copy single file of folder
        fs.copyFile(source, destination, (err) => {
            if (err) throw err;
            console.log('Success Song Copy file');
            // delete file from temperaory folder 
            const directory = songFolderPath + 'tempFile'; // folder path, for removing files
            deleteFile(fs, directory); 
        });
    }
    else { console.log('song path not match with uploaded path'); }
}
// copy and deleting thumb Image File
function copyThumbImageFile(req) {
    if (req.body.thumbnailPath && tempImageNameStore == req.body.thumbnailPath) {
        const fs = require('fs');
        let source = imageFolderPath + req.body.thumbnailPath;
        let destination = imageFolderPath + req.body.thumbnailPath.replace('tempFile/', '');
        // Copy dsingle file of folder
        fs.copyFile(source, destination, (err) => {
            if (err) throw err;
            console.log('Success Image Copy file');
            // delete file from temperaory folder 
            const directory = imageFolderPath + 'tempFile'; // folder path, for removing files
            deleteFile(fs, directory); 
        });
    }
    else { console.log('image path not match with uploaded path'); }
}

// function used in fileCopy function
// delete file from temperaory folder 
function deleteFile(fs, directory) {
    const path = require('path');
    const directoryStore = directory;
    fs.readdir(directoryStore, (err, files) => {
        for (const file of files) {
            fs.unlink(path.join(directoryStore, file), err => {
                //if (err) throw err;
                msg = 'successfully deleted ' + file;
                console.log('successfully deleted ' + file);
            });
        }
    });
}

// return Song detail from database
function retriveSong(name, res) {
    songs.find({name:name}).then(result=>{
        if(result.length < 1) 
            return res.send([{ message: 'no song found' }]);
        result.message = "Song successfully inserted";
        return res.status(201).json(result);

    }).catch(err=>{
        return res.send([{ message: 'Fail to retrive song detail', err: err }]);
    })
}
/***   Code End:: inserting song detail into DB  ***/

/** Code Start:: get all songs and artist **/
var allSongsArtist = (req, res) => {
    // left join query
    user.aggregate([
        {
            "$lookup":
            {
                from: 'songs',
                localField: '_id',
                foreignField: 'artistId',
                as: 'songDetail'
            }
        },
        {
            "$project":
            {
                "name": 1,
                "status": 1,
                "songDetail": { "artistId": 1, "name": 1 }
            }
        }
    ])
    .then(result =>{
        if(result.length == 0)
            return res.status(200).json([{ message: 'Table is empty' }]);
        else
            result.splice(0, 0, { "message": "Successfully get all song of artist" })
            return res.send(result);
    })
    .catch(err => {
        console.log("Error While get allSongsArtist ", err);
        res.status(500).json({ error: "Error While get allSongsArtist " + err });
    });
};
/** Code End:: get all songs and artist **/

// /** Code Start:: get single songs and artist **/
const singleSongsArtist = (req, res) => {
    const id = parseInt(req.body.artistId)
    songs.aggregate([
        { $match: { "artistId": id } },
        {
            $project: {
                artistId: 1,
                name: 1,
                songType: 1,
            }
        }
    ]).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ message: 'There is no song' }]);

        result.splice(0, 0, { "message": "Successfully get all song with artist Id" }) // splice(index, nofvaluetoremove, valuetoAdd);
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(200).json([{ message: 'Fail to get all song with artist Id', error: err }]);
    })   
};
// /** Code End:: get single songs and artist **/

/** Code Start:: get all songs and artist **/
var allArtist = (req, res) => {
    user.aggregate([
        {
            "$lookup":
            {
                from: 'songs',
                localField: '_id',
                foreignField: 'artistId',
                as: 'songDetail'
            }
        },
        {
            "$project":
            {
                "name": 1,
                "status": 1,
                "songDetail": { "artistId": 1, "name": 1 },
                "numOfSong": { $size: "$songDetail" }
            }
        }
    ]).then(result=> {
        if (result.length == 0)
            return res.status(200).json([{ message: 'Table is empty' }]);
        result.splice(0,0,{ "message": "Successfully get all artist" }) // splice(index, nofvaluetoremove, valuetoAdd);
        return res.status(200).json(result);
    }).catch(err=> {
        return res.status(200).json([{ message: 'Fail to get all artist', error: err }]);
    })
};
/** Code End:: get all songs and artist **/

// concate api's baseUrl with filename for check in browser
// function setBaseUrlWithEachPath(rows, res) {
//     // this is the fastest way of loop
//     let i = 0;
//     let iMax = rows.length;
//     for (; i < iMax; i++) {
//         rows[i].FilePath = process.env.BASE_URL + rows[i].FilePath;
//         rows[i].ThumbnailPath = process.env.BASE_URL + rows[i].ThumbnailPath;
//     }
//     return res.status(200).json(rows);
// }

const countMediaArtId = (req, res) => {
    const artistId = parseInt(req.body.artistId);
    songs.aggregate([
        {
            $match: { "artistId": artistId }
        },
        {
            $group: {
                _id: '$songType',
                count: {
                    $sum: 1,
                }
            }
        }
    ]).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ message: 'Table is empty' }]);
        // setting response in proper way noOfAudio and noOfVideo 
        let response = [{ audioSong: 0, videoSong:0}];
        result.map((data, index)=>{
            if(result[index]._id === 1)
                response[0].audioSong = result[index].count;   
            if(result[index]._id === 2)
                response[0].videoSong = result[index].count;     
        })
        // End setting response in proper way noOfAudio and noOfVideo 
        response.splice(0, 0, { "message": "Successfully get all artist" }) // splice(index, nofvaluetoremove, valuetoAdd);
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(200).json([{ message: 'Fail to get all artist', error: err }]);
    })
}

const allVideosArtist = (req,res)=>{
    songs.aggregate([
        { $match: { "songType": 2 } },
        {
            $lookup: {
                from: "users",
                localField: "artistId",
                foreignField: "_id",
                as: "atristDetail"
            }
        },
        {
            $project: {
                artistId: 1,
                name: 1,
                songType: 1,
                atristDetail: {
                    name: 1,
                    email: 1
                }
            }
        }
    ]).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ message: 'There is no video song' }]);

        result.splice(0, 0, { "message": "Successfully get all videos with artist name" }) // splice(index, nofvaluetoremove, valuetoAdd);
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(200).json([{ message: 'Fail to get all videos with artist name', error: err }]);
    })  
}

const allVideosWithArtistId = (req,res)=>{
    const id = parseInt(req.body.artistId)
    songs.aggregate([
        { $match: { "songType": 2, "artistId": id } },
        {
            $project: {
                artistId: 1,
                name: 1,
                songType: 1,
            }
        }
    ]).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ message: 'There is no video song' }]);

        result.splice(0, 0, { "message": "Successfully get all videos with artist Id" }) // splice(index, nofvaluetoremove, valuetoAdd);
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(200).json([{ message: 'Fail to get all videos with artist Id', error: err }]);
    })   
}

exports.songUploadMulter = songUploadMulter;
exports.songUpload = songUpload;
exports.songInsert = songInsert;
exports.thumbUploadMulter = thumbUploadMulter;
exports.thumbImageUpload = thumbImageUpload;
exports.allSongsArtist = allSongsArtist;
exports.singleSongsArtist = singleSongsArtist;
exports.allArtist = allArtist;
exports.countMediaArtId = countMediaArtId;
exports.allVideosArtist = allVideosArtist;
exports.allVideosWithArtistId = allVideosWithArtistId; 