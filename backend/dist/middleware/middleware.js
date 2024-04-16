import User from "../models/User.js";
export const isAdmin = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData.id; // Assuming the user's ID is stored in jwtData
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send("User not found");
        }
        if (user.role !== "admin") {
            return res.status(403).send("You're not an admin");
        }
        // If the user is an admin, proceed to the next middleware
        next();
    }
    catch (error) {
        console.error("Error in isAdmin middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        // user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didn't match");
        }
        return res
            .status(200)
            .json({ message: "OK", id: user._id.toString() });
    }
    catch (error) {
        console.log("Error signing up user", error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const checkBlocked = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData.id; // Assuming you have the user object attached to the request
        const user = await User.findById(userId);
        if (user.blocked) {
            return res.status(403).json({ message: "Your account has been blocked. Please contact support for assistance." });
        }
        // If the user is not blocked, proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error("Error checking user block status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
//# sourceMappingURL=middleware.js.map