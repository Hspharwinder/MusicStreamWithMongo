const mongoose = require('mongoose');
const like = mongoose.model('like');
const songs = mongoose.model('songs');
const user = mongoose.model('user');

const insert = (req, res) => {
    let userId = req.body.userId;
    /** Find user id from user doc **/
    user.findById(userId).then(result => {
        let mediaId = req.body.mediaId;
        if (result === null || result.length < 1) {
            console.log("user  ", result);
            return res.status(409).json({ message: "User doesn't exists" });
        } else {
            // check mediaId should be objectId type
            if (!mediaId.match(/^[0-9a-fA-F]{24}$/)) {
                // Yes, it's a valid ObjectId, proceed with `findById` call.
                return res.status(409).json({ message: "Media id Invalid" });
            }

            /** Find media id from media doc **/
            songs.findById(mediaId).then(result2 => {
                if (result2 === null || result2.length < 1) {
                    console.log("media   ", result2);
                    return res.status(409).json({ message: "Media doesn't exists" });
                }
                const value = { $set: { "userId": userId, "mediaId": req.body.mediaId, "like": req.body.like } };
                // { upsert : true } if exists update else update
                like.updateMany({ "userId": userId, "mediaId":mediaId }, value, { multi: true, upsert: true }).then(result4 => {
                    if (result4.nModified > 0)
                        return res.status(200).json([{ message: "Successfully update like" }]);
                    else
                        return res.status(200).json([{ message: "Not update like " }]);
                }).catch(err => {
                    return res.status(500).json({ error: "Error While updating like " + err });
                })               
            })
            .catch(err => {
                console.log("Error While find media ", err);
                res.status(500).json({ error: "Error While find media " + err });
            });
            /** End Find media id from media doc **/
        }
    }).catch(err => {
        console.log("Error While Insertion ", err);
        res.status(500).json({ error: "Error While find user " + err });
    });
    /** End Find user id from user doc **/
}

const getlikeDetail = (req, res) => {
    // convert id into objectId type
    let media = mongoose.Types.ObjectId(req.body.mediaId);
    like.aggregate([
        {
            $match:
            {
                "mediaId": media
            }
        },
        {
            $lookup:
            {
                from: 'users',
                localField: 'userId',
                foreignField: 'userId',
                as: 'userlike'
            }
        },
        {
            $lookup:
            {
                from: 'songs',
                localField: 'mediaId',
                foreignField: '_id',
                as: 'songlike'
            }
        }
    ]).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ success: "Media doesn't exists" }]);
        res.status(200).json(result);
    }).catch(err => {
        res.status(200).json([{ success: "Fail to retirve like details", error: err }])
    })
}

exports.addLikeDislike = insert;
exports.fetchLikeDislike = getlikeDetail;

