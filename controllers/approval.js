const mongoose = require('mongoose');
const user = mongoose.model('user');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('MusicStreammyTotalySecretKey');

// retun all approved Artist(UserType 3 and Status 1)
var allApprovedArtist = (req,res)=>{
    user.aggregate([
        {
            $lookup:
            {
                from: 'songs',
                localField: '_id',
                foreignField: 'artistId',
                as: 'statusDetail'
            }
        },
        {
            $match:
            {
                "statusDetail.userType": 1
            }
        }
    ]).then(result=>{
        if (result.length == 0)
            return res.status(200).json([{ success: "No artist Approved" }]);
        setSuccessWithEachRecord(result, 'approved');
        res.status(200).json(result);
    }).catch(err=>{
        res.status(200).json([{ success: "Fail to retirve All Approved Artist", error: err }])
    })
}

// return all pending artist(UserType 3 and Status 2) for approval
var allPendingArtist = (req, res)=>{
    user.aggregate([
        {
            $lookup:
            {
                from: 'songs',
                localField: '_id',
                foreignField: 'artistId',
                as: 'statusDetail'
            }
        },
        {
            $match:
            {
                "statusDetail.userType": 1
            }
        }
    ]).then(result => {
        if(result.length == 0)
            return res.status(200).json([{ success: "No artist pending for approval" }]);
        setSuccessWithEachRecord(result, 'pending');
        res.status(200).json(result);
    }).catch(err => {
        res.status(200).json([{ success: "Fail to retirve All pending Artist or approval", error: err }])
    })    
}

// Add success element in each row with message
function setSuccessWithEachRecord(result, checkApi){    
    if (checkApi == 'approved'){
        result.map(element => {
            element.statusDetail.map(element2=>{
                element2.message = "Successfully retirve ALL Approved Artist";
            })
            element.message = "Successfully retirve ALL Approved Artist";
        })        
    }else{
        result.map(element => {
            element.message = "Successfully retirve ALL Approved Artist";
        })        
    }    
}

// approved artist(insert user password) if status 1(user inactive ) else send not approved 
var approveToArtist = (req,res)=>{
    const id = req.body.artistId;
    let param = setValues(req);
    var myquery = { _id: id, status: 1 };
    var setQuery = {
        $set: { status: 2, userName: param.userName, password: param.password } 
    };
    user.find({ status: 1}).then(result=>{
        if (result.length == 0 ) 
           return res.status(200).json([{ message: "There is no pending artist" }]);

        user.updateOne(myquery, setQuery).then(result2 => {
            if (result2.nModified > 0)
                return res.status(200).json([{ message: "Successfully approved artist" }]);
            else
                return res.status(200).json([{ message: "Artist not approved " }]);
        }).catch(err => {
            if(err.code == 11000)
                return res.status(200).json([{ message: 'An account with this userName already exists.' }])
            res.status(200).json([{ message: "Something went wrong while updating record", error: err }]);
        })
    })
    .catch(err=>{
        res.status(200).json([{ message: "Something went wrong while finding record", error: err }]);
    })
}

// getting value from request.body and setting in object
var setValues = (req) => {
    let fieldValues = {
        userName: req.body.userName,      
    };
    if (req.body.password)
        fieldValues.password = cryptr.encrypt(req.body.password);
    return (fieldValues);
}

const changeStatus = (req,res)=>{
    const userId = parseInt(req.body.id);
    const userName = req.body.userName;
    const status = req.body.status;
    let value = {$set: {status: status}};
    user.updateOne({ _id: userId, userName: userName }, value ).then(result => {
        if (result.nModified < 1)
            return res.status(200).json([{ message: "Status not changed" }]);
        return res.status(200).json([{ message: "Status changed" }]);
    }).catch(err=>{
        res.status(200).json([{ message: "Something went wrong while changing status", error: err }]);
    })
}

exports.allApprovedArtist = allApprovedArtist;
exports.allPendingArtist = allPendingArtist;
exports.approveToArtist = approveToArtist;
exports.changeStatus = changeStatus;