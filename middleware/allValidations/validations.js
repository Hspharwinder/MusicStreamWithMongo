const { Validator } = require('node-input-validator');

// MiddleWare validation for signup
var signUp = async (req, res, next) => {
    let v;
    if (req.body.type == 3) {
        v = new Validator(req.body, {
            image: 'required',
            email: 'required|email',
            password: 'required'
        });
    } else {
        v = new Validator(req.body, {
            email: 'required|email',
            password: 'required'
        });
    }
    const matched = await v.check();
    if (!matched) {
        req.status = 422;
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};

// MiddleWare validation for login
var login = async (req, res, next) => {
    let v = new Validator(req.body, {
            userName: 'required|email',
            password: 'required'
        });
    const matched = await v.check();
    if (!matched) {
        req.status = 422;
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};

// MiddleWare validation for forgetPassword
var forgetPassword = async (req, res, next) => {
    let v = new Validator(req.body, {
        email: 'required|email',
    });
    const matched = await v.check();
    if (!matched) {
        req.status = 422;
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};

// MiddleWare validation for singleUser's Id
var singleUser = async (req, res, next) => {
    let v = new Validator(req.body, {
        id: 'required',
    });
    const matched = await v.check();
    if (!matched) {
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};

// MiddleWare validation for artist fields
var artist = async (req, res, next) => {
    let v = new Validator(req.body, {
        email: 'required|email',
        name: 'required',
        phone_no: 'required|integer|min:1',
        description: 'required',
        status: 'required',
        type: 'required',
    });
    const matched = await v.check();
    if (!matched) {
        req.status = 422;
        req.body = v.errors;
        v.errors.success = "Validation error";
        if (v.errors.phone_no)
            v.errors.phone_no.message = "Phone number invalid"; // custom validate message for phone number
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};

// MiddleWare validation for editProfile/update user
var editProfile = async (req, res, next) => {
    let v = new Validator(req.body, {
        name: 'required',
        type: 'required'
    });
    const matched = await v.check();
    if (!matched) {
        req.status = 422;
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};


// MiddleWare Validation song fields
var song = async (req, res, next) => {
    let v = new Validator(req.body, {
        name: 'required',
        artistId: 'required',
        userType: 'required',
        filePath: 'required',
        thumbnailPath: 'required',
    });
    const matched = await v.check();
    if (!matched) {
        req.status = 422;
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};
// used in singleSongsArtist and approveToArtist API
// MiddleWare validation for artist's id
var artistId = async (req, res, next) => {
    let v = new Validator(req.body, {
        artistId: 'required',
    });
    const matched = await v.check();
    if (!matched) {
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    } else {
        next();
    }
};

var deleteMediaArtIdMedId = async (req,res, next)=>{
    let v = new Validator(req.body,{
        tblMedia_Id: 'required',
        artistId:'required'
    })
    const matched = await v.check();
    if(!matched){
        req.body = v.errors;
        v.errors.success = "Validation error";
        res.status(422).send([v.errors]);
    }else
        next();
}

exports.signUp = signUp;
exports.login = login;
exports.forgetPassword = forgetPassword;
exports.singleUser = singleUser;
exports.artist = artist;
exports.editProfile = editProfile;
exports.song = song;
exports.artistId = artistId;
exports.deleteMediaArtIdMedId = deleteMediaArtIdMedId;