import { RequestHandler } from 'express'
import { User } from '../models/user'
const SpotifyWebApi = require('spotify-web-api-node')

export let token: string = ''

const spotifyApi = new SpotifyWebApi({
  clientId: '69372f48d4b24c099e581c69793c1879',
})

export const loginUser: RequestHandler = async (req, res, next) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:8100/socialvibez/music',
    clientId: '69372f48d4b24c099e581c69793c1879',
    clientSecret: '3fd83b37a78044e597517228a2cb6796',
  })

  try {
    await spotifyApi
      .authorizationCodeGrant(code)
      .then((data: any) => {
        token = data.body.access_token
      })
      .catch((err: any) => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
  }

  next()
}

export const createUser: RequestHandler = async (req, res, next) => {
  spotifyApi.setAccessToken(token)

  spotifyApi.getMe().then(
    async function (data: any) {
      let profilePic

      if (data.body.images[0]) {
        profilePic = data.body.images[0].url
      }

      let newUser: any = {
        userId: data.body.id,
        email: data.body.email,
        display_name: data.body.display_name,
        profilePic: profilePic ? profilePic : null,
      }

      if (newUser.userId && newUser.email && newUser.display_name) {
        const existingUser = await User.findByPk(newUser.userId)
        if (!existingUser) {
          try {
            let created = await User.create(newUser)
            return created
          } catch (error) {
            console.log(error)
          }
        } else {
          console.log('')
        }
      } else {
        console.log(`userId, email, and display_name required`)
      }
    },
    function (err: any) {
      console.log('Something went wrong!', err)
    }
  )

  next()
}
