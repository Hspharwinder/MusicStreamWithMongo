const router = require('express-promise-router')();
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

const users = require('../controllers/users');
const song = require('../controllers/song');
const approval = require('../controllers/approval');
const comment = require('../controllers/comment');
const like = require('../controllers/like');
const wishList = require('../controllers/wishList');
const validation = require('../middleware/allValidations/validations');


// swagger
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth Apis
router.post('/signup', validation.signUp, users.signup);
router.post('/filePost', users.uploadMulter.single('image'), users.imageUpload);
router.post('/login', validation.login, users.login);
router.post('/forgetPassword', validation.forgetPassword, users.forgetPassword);
router.post('/createartist', validation.artist, users.artist);

// user Apis
router.get('/user', users.allUsers);
router.post('/profile', validation.singleUser, users.singleUser);
router.post('/editProfile', validation.editProfile, users.editProfile);
router.post('/delMediaArtIdMedId', validation.deleteMediaArtIdMedId, users.deleteMediaArtIdMedId);
// app.post('/delProfile', validation.deleteProfile, user.deleteProfile);
router.get('/allUserType2', users.allUserType2);  // get all user having type 2 (mean not artist/admin only user)

// song Apis 
router.post('/songsPost', song.songUploadMulter.single('song'), song.songUpload);
router.post('/songsThumbImagePost', song.thumbUploadMulter.single('image'), song.thumbImageUpload);
router.post('/songInsert', validation.song, song.songInsert);
router.get('/allSongsArtist', song.allSongsArtist);  // return all artists and songs
router.post('/singleSongsArtist', validation.artistId, song.singleSongsArtist); // get All song with artist ID
router.get('/allArtist', song.allArtist); // return all artist with there No of Song
router.get('/allVideosArtist', song.allVideosArtist);  // return all artists and Videos
router.post('/allVideosWithArtistId', validation.artistId, song.allVideosWithArtistId); // get All videos with artist ID
router.post('/countMediaArtId', validation.artistId, song.countMediaArtId); // return counting of videos and song based on artist Id

// approval api
router.get('/allApprovedArtist', approval.allApprovedArtist); // return all aproved artist (usertype 3)
router.get('/allPendingArtist', approval.allPendingArtist); // return all pending artist (usertype 3)
router.post('/approveToArtist', validation.artistId, approval.approveToArtist); 
router.post('/changeStatus', approval.changeStatus); // change status of any user active or in-active

// Whishlist api
router.post('/InsertwishList', validation.userIdMediaId, wishList.insert);
router.post('/GetWishListByUserId', validation.userId, wishList.getWishListMediaByUserId);  // return all record of wishlist, media with artist name(tbluser) based on userId 
// app.post('/delWishListByUserIdMediaId', validation.userIdMediaId, wishList.deleteWishListByUserIdMediaId);   // remove record from wishlist
router.post('/checkwishlist', validation.userIdMediaId, wishList.checkwishlist);  // check whether record present in wishlist or not based on user id and media id

// Liking api
router.post('/likeDislike', validation.userIdMediaId, like.addLikeDislike);
router.post('/fetchLikeDislike', validation.userIdMediaId, like.fetchLikeDislike);

// comment api
router.post('/addComment', comment.addComment); 
router.post('/fetchComment', comment.fetchComment); 

module.exports = router;
