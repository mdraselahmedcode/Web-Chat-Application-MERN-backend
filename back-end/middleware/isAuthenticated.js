import jwt from "jsonwebtoken";


const isAuthenticated = async (req, res, next) => {
    try {

        // check either the user has the token or not
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User is not authenticated",
                success: false
            })
        }

        // verify the token even if it is
        const decode =  jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decode);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }

        // denoting the requisting user by assigning his user id from token 
        req.id = decode.userId;

        // then pass it to the getOtherUsers route
        next();
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;