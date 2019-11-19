const router = require('express-promise-router')();
const validation = require('../middleware/allValidations/validations');
const song = require('../controllers/song');

// song Apis 
// app.post('/songsPost', song.songUploadMulter.single('song'), song.songUpload);
// app.post('/songsThumbImagePost', song.thumbUploadMulter.single('image'), song.thumbImageUpload);
router.post('/songInsert', validation.song, song.songInsert);
router.get('/allSongsArtist', song.allSongsArtist);  // return all artists and songs
// app.post('/singleSongsArtist', validation.artistId, song.singleSongsArtist); // get All song with artist ID
router.get('/allArtist', song.allArtist); // return all artist with there No of Song

module.exports = router;
// pending upload file and correct path of images and songs