import { RequestHandler } from 'express'
import { Friend } from '../models/friend'

export const addFriend: RequestHandler = async (req, res, next) => {
  let newFriend: Friend = req.body
  try {
    let created = await Friend.create(newFriend)
    res.status(201).json(created)
  } catch (error) {
    res.send(error)
    console.log(error)
  }
}

export const getFriendsByID: RequestHandler =async (req, res, next) => {
  let friendId = req.params.id;

  let friend = await Friend.findByPk(friendId).then((response) => {
    res.status(200).json(response);
  });
}

export const deleteFriendsByID: RequestHandler = async (req, res) => {
  let friendId = req.params.id;

  let friendFound = await Friend.findByPk(friendId);

  if (friendFound) {
    await Friend.destroy({
      where: { friendId: friendId },
    }).then((response) => {
      res.status(200).json();
    });
  } else {
    res.status(404).send();
  }
};

export const getAllFriends: RequestHandler = async (req, res, next) => {
  let friends: any = await Friend.findAll()
  res.status(200).json(friends)
}

export const searchFriends: RequestHandler = async (req, res) => {
  try {
    let search = req.params.searchTerm;
    const friends = await Friend.findAll({
      where: { display_name: search }
    });
    
    if (friends.length > 0) {
      
      res.status(200).json(friends);
  
      }
      else {
          res.status(200).send({});
      }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching for friends');
  }
};
