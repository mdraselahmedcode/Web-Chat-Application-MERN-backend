// jwtToken.js


// create token and saving in cookie

const sendToken = (user, statusCode, res, msg) => {

    const token = user.getJWTToken();
    // console.log(token);


    // options for cookie
    // const options = {
    //     expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    //     httpOnly: true,
    // };

    res.status(statusCode).cookie("token", token, {
        maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
    }).json({
        success: true,
        // _id: user._id,
        // username: user.username,
        // fullName: user.fullName,
        // profilePhoto: user.profilePhoto,
        
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            message: msg,
       
            token,

    })

}

export default sendToken; 