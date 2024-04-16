import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import Guidelines from "../models/rules.js";

export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res
            .status(401)
            .json({ message: "User not registered or Token malfunctioned." });
        }
    
        // grab chats of user
        const chats = user.chats.map(({ role,content }) => ({ role, content })) as ChatCompletionRequestMessage[];
        chats.push({ role: "user", content: message });
        user.chats.push({ role: "user", content: message });
    
        // send all chats with new one to openAI API
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      .json({ message: "OK", chats: user.chats });
  } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
  try {
      // user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
          return res.status(401).send("User not registered or Token Malfunction");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
          return res.status(401).send("Permission didn't match");
      }
      //@ts-ignore
      user.chats = [];
      await user.save();
      return res
      .status(200)
      .json({ message: "OK", chats: user.chats });
  } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const chatGuidelines = async (
    req: Request,
    res: Response,
    next: NextFunction
) => { 
    try {
        const guidelines = await Guidelines.find();
        res.status(200).json({ guidelines });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
      }
}

export const addGuidelines = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, description } = req.body;
    try {
        if(!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
            }
        const newGuideline = new Guidelines({ title, description });
        await newGuideline.save();
        res.status(201).json({ message: 'Guideline added successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
      }
};

export const editGuidelines = async (
    req: Request,
    res: Response,
    next: NextFunction
) => { 
    try {
        const { title, description } = req.body;
        if(!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
            }
        const updatedGuideline = await Guidelines.findByIdAndUpdate(
          req.params.id,
          { title, description },
          { new: true }
        );
        res.status(200).json({ message: 'Guideline updated successfully', guideline: updatedGuideline });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
      }
};

export const deleteGuidelines = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
      await Guidelines.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Guideline deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };