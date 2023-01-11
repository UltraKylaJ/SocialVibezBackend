import { RequestHandler } from 'express'
import { Message } from '../models/message'
import { User } from '../models/user'
import { verifyUser } from '../services/auth'

export const getAllMessages: RequestHandler = async (req, res, next) => {
  let messages = await Message.findAll()
  res.status(200).json(messages)
}

export const getOneMessage: RequestHandler =async (req, res, next) => {
  let messageId = req.params.messageId;
  let message = await Message.findByPk(messageId);
  res.status(200).json(message);
}

export const createMessage: RequestHandler = async (req, res, next) => {

  // console.log(await verifyUser(req), 'verifyUser console');
  let user: User | null = await verifyUser(req);
  console.log(user, 'user log')

  if (!user) {
    return res.status(403).send('User not detected.')
  }

  let newMessage: Message = req.body;
  newMessage.userId = user.userId;
  newMessage.display_name = user.display_name;
  console.log(newMessage.userId);

  if (newMessage.userId && newMessage.display_name && newMessage.title && newMessage.message) {
    let created = await Message.create(newMessage);
    res.status(201).json(created);
  } else {
    res.status(400).send('Please include userId, display_name, title, and message')
  }
}

export const editMessage: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req)

  if (!user) {
    return res.status(403).send('User not detected');
  }

  let messageId = req.params.messageId;
  let userId = user.userId;
  console.log(req.body);

  let updatedMessage: Message = req.body;
  let messageFound = await Message.findByPk(messageId);

  if (messageFound && messageFound.messageId == updatedMessage.messageId && messageFound.userId == userId) {
    await Message.update(updatedMessage, {
      where: { 
        messageId: messageId,
        userId: userId
      }
    });
    res.status(200).json('Updated message is a success!');
  }
  else {
    res.status(400).json('An error occured while updating this message');
  }
}

export const deleteMessage: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req)

  if (!user) {
    return res.status(403).send('User not detected');
  }

  let messageId = req.params.messageId;
  let userId = user.userId;
  console.log(req.body);

  let messageFound = await Message.findByPk(messageId);

  if (messageFound && messageFound.userId == userId) {
    await Message.destroy({
      where: {
        messageId: messageId,
        userId: userId
      }
    });
    res.status(200).json('Message deleted!');
  }
  else {
    res.status(404).json('An error occured while deleting this message');
  }
}


// current user gives me the data from the current user.
// match the currentUserId to the message's userId