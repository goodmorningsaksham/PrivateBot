import { Router } from 'express';
import { getAllUsers, 
         userSignup,
         userLogin,
         adminDashboard,
         manageUser,
         userChatHistory,
         userLogout,
         blockUser,
         unblockUser
        } from "../controllers/user-controllers.js"; 
import { checkBlocked, isAdmin, verifyUser } from "../middleware/middleware.js";        
import { signupValidator,
         validate,
         loginValidator
        } from "../utils/validator.js";
import { verifyToken } from '../utils/token-manager.js';

const userRoutes = Router();
// User Routes
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", userLogout);

// Admin Routes
userRoutes.get("/dashboard", verifyToken, isAdmin, checkBlocked,adminDashboard);
userRoutes.get("/manageUsers", verifyToken, isAdmin, checkBlocked,manageUser);
userRoutes.get("/user-chat-history/:id", verifyToken, isAdmin, checkBlocked,userChatHistory);
userRoutes.post("/block/:id", verifyToken, isAdmin, blockUser);
userRoutes.post("/unblock/:id", verifyToken, isAdmin, unblockUser);

export default userRoutes;