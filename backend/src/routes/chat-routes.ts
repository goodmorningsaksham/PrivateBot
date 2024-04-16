import { Router } from 'express';
import { verifyToken } from '../utils/token-manager.js';
import { chatCompletionValidator, validate } from '../utils/validator.js';
import { generateChatCompletion,
         chatGuidelines,
         addGuidelines,
         deleteGuidelines,
         editGuidelines,
         sendChatsToUser,
         deleteChats
 } from '../controllers/chat-controllers.js';
import { checkBlocked, isAdmin } from '../middleware/middleware.js';

// Protected API
const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidator), verifyToken, checkBlocked, generateChatCompletion);

// Display all chats even after refresh
chatRoutes.get("/all-chats", verifyToken, checkBlocked, sendChatsToUser);

chatRoutes.delete("/delete-chats", verifyToken, deleteChats);

// Guidelines 
// View Guidelines
chatRoutes.get("/guidelines", verifyToken, isAdmin, chatGuidelines);

// Add Guidelines
chatRoutes.post("/addRules", verifyToken, addGuidelines);

// Edit Guidelines
chatRoutes.put("/updateRules/:id", verifyToken, editGuidelines);

// Delete Guidelines
chatRoutes.delete("/guidelines/:id", deleteGuidelines);

export default chatRoutes;
