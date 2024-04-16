import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { create } from "domain";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constant.js";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    // get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    } catch (error) {
        console.log("Error getting all users", error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // user signup
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).send("User already exists");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, role, password: hashedPassword });
        await user.save();  // save user to database
       
        // create token and store it in a cookie
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
             path: "/",
             domain: "localhost",
             expires,
             httpOnly: true,
             signed: true,
        });

        return res.status(200).json({ message: "OK", id: user._id.toString() });
    } catch (error) {
        console.log("Error signing up user", error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // user login
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }

        const isPasswordValid = await compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(403).send("Incorrect password");
        }
   
        // create token and store it in a cookie
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
             path: "/",
             domain: "localhost",
             expires,
             httpOnly: true,
             signed: true,
        });
       // res.setHeader('Authorization', `Bearer ${token}`);
        return res.status(200).json({ message: "OK", token, id: user._id.toString() });
    } catch (error) {
        console.log("Error signing up user", error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const adminDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        return res.status(200).json({ message: "Welcome to the admin dashboard" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const manageUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const userChatHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.id;

    try {
        // Find the user by ID and populate the chats field
        const user = await User.findById(userId).populate('chats');

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Extract user details
        const userDetails = {
            name: user.name,
            email: user.email
        };

        // Extract chat history from the user object
        const chatHistory = user.chats.map(chat => ({
            id: chat.id,
            role: chat.role,
            content: chat.content
        }));

       // Render an HTML page and pass the user details and chat history as data
       // res.render('user-chat-history', { userDetails, chatHistory });
    } catch (error) {
        console.error('Error fetching user chat history:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const blockUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(userId, { blocked: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User blocked successfully", user });
    } catch (error) {
        console.error("Error blocking user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const unblockUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndUpdate(userId, { blocked: false }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User unblocked successfully", user });
    } catch (error) {
        console.error("Error unblocking user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};