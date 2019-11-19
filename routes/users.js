const router = require('express-promise-router')();
const users = require('../controllers/users');
const validation = require('../middleware/allValidations/validations');

// // user Apis
router.post('/signup', validation.signUp, users.signup);
router.post('/filePost', users.uploadMulter.single('image'), users.imageUpload);
router.post('/login', validation.login, users.login);
router.post('/forgetPassword', validation.forgetPassword, users.forgetPassword);
router.get('/user', users.allUsers);
router.post('/profile', validation.singleUser, users.singleUser);
router.post('/createartist', validation.artist, users.artist);
router.post('/editProfile', validation.editProfile, users.editProfile);
router.post('/delMediaArtIdMedId', validation.deleteMediaArtIdMedId, users.deleteMediaArtIdMedId);

module.exports = router;
// pending upload file and correct path of images and songs