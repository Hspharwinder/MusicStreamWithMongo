const mongoose = require('mongoose');
const wishList = mongoose.model('wishList');
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

                const wishListFields = new wishList(req.body);
                // Inserting wishlist details in DB
                wishListFields.save().then(result => {
                    console.log(result);
                    res.status(201).json({ message: "Record inserted Successfully" });
                }).catch(err => {
                    console.log("Error While Insertion ", err);
                    res.status(500).json({ error: "Error While Insertion " + err });
                });
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

const getWishListMediaByUserId = (req, res)=> {
    let userId = parseInt(req.body.userId);
    wishList.aggregate([
        {
            $match:
            {
                "userId": userId
            }
        },
        {
            $lookup:
            {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userWishList'
            }
        },
        {
            $lookup:
            {
                from: 'songs',
                localField: 'userId',
                foreignField: 'artistId',
                as: 'songWishList'
            }
        },
        {
            "$project":
            {
                userId: 1,
                "userWishList": { name: 1, email: 1 },
                songWishList: { name: 1, artistId: 2 },
                "numOfSong": { $size: "$songWishList" }
            }
        }
    ]).then(result => {
        if (result.length == 0)
            return res.status(200).json([{ success: "Media doesn't exists" }]);
        res.status(200).json(result);
    }).catch(err => {
        res.status(200).json([{ success: "Fail to retirve wishlist details", error: err }])
    })
}

const checkwishlist = (req,res)=>{
    const userId = parseInt(req.body.userId);
    wishList.find({ userId: userId, mediaId: req.body.mediaId }).then(result=>{
        if (result.length == 0)
            return res.status(200).json([{ success: "Not present" }]);
        return res.status(200).json([{ success: "Present" }]);
    }).catch(err=>{
        res.status(200).json([{ success: "Fail to retirve wishlist details", error: err }])
    })
}

exports.insert = insert;
exports.getWishListMediaByUserId = getWishListMediaByUserId;
exports.checkwishlist = checkwishlist;