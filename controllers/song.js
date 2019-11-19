const mongoose = require('mongoose');
const songs = mongoose.model('songs');
const user = mongoose.model('user');

const multer = require('multer'); // for uploading files
require('dotenv/config');

// // Variabele used for image uploading, copying and deleting 
// //imagepath used in multer, fileCopy and deleteFile Function
// const imageFolderPath = '../test/songs/thumbnail_Images/';
// let tempImageNameStore; // storing image name with foldername like - tempThumbImage/abc.png
// let thumbnailImageName; // storing only image name like - 1571724607849_Capture.png
// /***  Code Start:: Thumb Image Upload  ***/
// // set destionation and file name for saving in folder using multer
// var thumbStorage = multer.diskStorage({
//     // accept image files only   
//     fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//             return cb(new Error('Only jpg,jpeg,png,gif image files are allowed!'), false);
//         }
//         cb(null, true);
//     },
//     destination: (req, image, cb) => {
//         cb(null, imageFolderPath + 'tempThumbImage')
//     },
//     filename: function (req, image, cb) {
//         thumbnailImageName = Date.now() + '_' + image.originalname;
//         cb(null, thumbnailImageName);
//     }
// })
// // uploading image on server
// var thumbUploadMulter = multer({ storage: thumbStorage });
// // return response image is uploaded or not
// var thumbImageUpload = function (req, res) {
//     if (!req.file) {
//         console.log("No file received");
//         return res.status(200).json([{ message: 'Fail to upload image, No image received' }])
//     } else {
//         console.log('file received');
//         tempImageNameStore = 'tempThumbImage/' + thumbnailImageName;
//         return res.status(200).json([{ filePath: tempImageNameStore, message: 'Successfully uploaded image' }])
//     }
// };
// /*** Code End:: Thumb Image Upload  ***/

// // Variabele used for song uploading, copying and deleting 
// // songFolderPath used in multer, fileCopy and deleteFile Function
// const songFolderPath = '../test/songs/'; 
// let songName; // for storing only song name --- 1571724607849.mp3
// let tempSongNameStore; // storing image name with folder name like - tempFile/1571724607849.mp3
// /***  Code Start:: Song Upload  ***/
// // set destionation and file name for saving in folder using multer
// var storage = multer.diskStorage({
//     destination: (req, song, cb) => {
//         cb(null, songFolderPath + 'tempFile')
//     },
//     filename: function (req, song, cb) {
//         songName = Date.now() + '_' + song.originalname;
//         cb(null, songName);
//     }
// })
// // uploading song on server
// var songUploadMulter = multer({ storage: storage });
// // return response song is uploaded or not
// var songUpload = function (req, res) {
//     if (!req.file) {
//         console.log("No file received");
//         return res.status(200).json([{ message: 'Fail to upload song, No song received' }])
//     } else {
//         console.log('file received');
//         tempSongNameStore = 'tempFile/' + songName;
//         return res.status(200).json([{ filePath: tempSongNameStore, message: 'Successfully uploaded song' }])
//     }
// };
// /***  Code End:: Song Upload  ***/

/***   Code Start:: inserting song detail into DB  ***/
var songInsert = function (req, res) {
    // function for creating Song in DB
    createSong(req, res);
};
// creating Song in DB
var createSong = (req, res) => {
    // Set values of Song
    const newSong = new songs(req.body);
    // var newSong = setSongValue(req);
    // Inserting Song details in DB
    newSong.save().then(result => {
        console.log(result);
        res.status(201).json({ message: "Record inserted Successfully" });
    }).catch(err => {
        console.log("Error While Insertion ", err);
        res.status(500).json({ error: "Error While Insertion " + err });
    });

   
    // db.query('CALL sp_songInsert(?,?,?,?,?)',
    //     [newSong.name, newSong.artistId, newSong.type, newSong.filePath, newSong.thumbnailPath],
    //     function (err, rows) {
    //         if (err) {
    //             return res.status(200).json([{ message: 'Fail to insert song', error:err }])
    //         }
    //         if (rows.affectedRows != 0) {
    //             /* copy last uploaded file in permanent folder and 
    //              remove images from temporary folder */
    //             fileCopy(req)
    //             // Successfully created Song, now return Song detail
    //             retriveSong(newSong.name, res)
    //         }else{
    //             return res.status(200).json([{ message: 'No row affected in DB', error: err }])
    //         }
    //     }
    // );
};

// function used in createUser and createArtist method
// getting value from request.body and setting in object
// var setSongValue = (req) => {
//     let newSong = new songs({
//         Name: req.body.name,
//         ArtistId: req.body.artistId,
//         UserType: req.body.type,
//         FilePath: req.body.filePath.replace('tempFile/', ''),
//         ThumbnailPath: req.body.thumbnailPath.replace('tempThumbImage/', ''),
//     });
//     return (newSong);
// }

// // function used in signup function
// // copy file from temporary folder to parmanent folder
// function fileCopy(req) { 
//     copySongFile(req);
//     copyThumbImageFile(req);   
// }
// // copy and deleting song File
// function copySongFile(req){
//     if (req.body.filePath && tempSongNameStore == req.body.filePath) {
//         const fs = require('fs');
//         let source = songFolderPath + req.body.filePath;
//         let destination = songFolderPath + req.body.filePath.replace('tempFile/', '');
//         // Copy dsingle file of folder
//         fs.copyFile(source, destination, (err) => {
//             if (err) throw err;
//             console.log('Success Song Copy file');
//             // delete file from temperaory folder 
//             const directory = songFolderPath + 'tempFile'; // folder path, for removing files
//             deleteFile(fs, directory); 
//         });
//     }
//     else { console.log('song path not match with uploaded path'); }
// }
// // copy and deleting thumb Image File
// function copyThumbImageFile(req) {
//     if (req.body.thumbnailPath && tempImageNameStore == req.body.thumbnailPath) {
//         const fs = require('fs');
//         let source = imageFolderPath + req.body.thumbnailPath;
//         let destination = imageFolderPath + req.body.thumbnailPath.replace('tempThumbImage/', '');
//         // Copy dsingle file of folder
//         fs.copyFile(source, destination, (err) => {
//             if (err) throw err;
//             console.log('Success Image Copy file');
//             // delete file from temperaory folder 
//             const directory = imageFolderPath + 'tempThumbImage'; // folder path, for removing files
//             deleteFile(fs, directory); 
//         });
//     }
//     else { console.log('image path not match with uploaded path'); }
// }

// // function used in fileCopy function
// // delete file from temperaory folder 
// function deleteFile(fs, directory) {
//     const path = require('path');
//     const directoryStore = directory;
//     fs.readdir(directoryStore, (err, files) => {
//         for (const file of files) {
//             fs.unlink(path.join(directoryStore, file), err => {
//                 if (err) throw err;
//                 msg = 'successfully deleted ' + file;
//                 console.log('successfully deleted ' + file);
//             });
//         }
//     });
// }

// // return Song detail from database
// function retriveSong(name, res) {
//     db.query(' CALL sp_singleSong(?)', [name], function (err, rows) {
//         if (err) return res.send([{ message: 'Fail to retrive song detail', err: err }]);
//         //adding message element in rows object   
//         rows[0][0].message = "Song successfully inserted";
//         return res.status(201).json(rows[0]);
//     });
// }
// /***   Code End:: inserting song detail into DB  ***/

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
// var singleSongsArtist = (req, res) => {
//     const artistId = parseInt(req.body.artistId);
//     db.query("CALL sp_singleSongsArtist(?);", [artistId], function (err, rows) {
//         if (err)
//             return res.status(200).json([{ message: 'Fail to get single artist song', error: err }]);
//         if (rows[0].length == 0)
//             return res.status(200).json([{ message: 'Id doesn`t exists'}]);
//         rows[0][0].message = 'Successfully get single artist song';
//         //concate api's baseUrl with filename for check in browser
//         // setBaseUrlWithEachPath(rows, res);
//         return res.status(200).json(rows[0]);        
//     });
// };
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

// exports.songUploadMulter = songUploadMulter;
// exports.songUpload = songUpload;
exports.songInsert = songInsert;
// exports.thumbUploadMulter = thumbUploadMulter;
// exports.thumbImageUpload = thumbImageUpload;
exports.allSongsArtist = allSongsArtist;
// exports.singleSongsArtist = singleSongsArtist;
exports.allArtist = allArtist;