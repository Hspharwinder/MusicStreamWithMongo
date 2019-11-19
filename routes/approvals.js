const router = require('express-promise-router')();
const validation = require('../middleware/allValidations/validations');
const approval = require('../controllers/approval');

// // approval api
router.get('/allApprovedArtist', approval.allApprovedArtist); // return all aproved artist (usertype 3)
router.get('/allPendingArtist', approval.allPendingArtist); // return all pending artist (usertype 3)
router.post('/approveToArtist', validation.artistId, approval.approveToArtist); 

module.exports = router;