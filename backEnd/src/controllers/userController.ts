import { RequestHandler } from 'express'
import { User } from '../models/user'
import { token } from '../controllers/loginController'

const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
  clientId: '69372f48d4b24c099e581c69793c1879',
})

export const currentUser: RequestHandler = async (req, res, next) => {

  await spotifyApi.setAccessToken(token)

  spotifyApi.getMe().then(
    async function (data: any) {

      res.status(200).json({token: token, userData: data.body});
    },
    function (err: any) {
      console.log('Something went wrong!', err)
    }
  )
}

export const getAllUsers: RequestHandler = async (req, res, next) => {
  let allUsers: User[] = await User.findAll()
  res.status(200).json(allUsers)
}

export const getUserById: RequestHandler =async (req, res, next) => {
  let userId = req.params.userId;
  let user = await User.findByPk(userId);
  res.status(200).json(user);
}

export const searchUsers: RequestHandler = async (req, res) => {
  try {
    let search = req.params.searchTerm;
    const users = await User.findAll({
      where: { display_name: search }
    });
    
    if (users.length > 0) {
      
      res.status(200).json(users);
  
      }
      else {
          res.status(200).send('No users found');
      }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching for users');
  }
};
