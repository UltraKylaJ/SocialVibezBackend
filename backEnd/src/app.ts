require('dotenv').config()
const cors = require('cors')
const lyricsFinder = require('lyrics-finder')
const SpotifyWebApi = require('spotify-web-api-node')
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import { db } from './models'
import postRoutes from './routes/postRoutes'
import messageRoutes from './routes/messageRoutes'
import loginRoutes from './routes/loginRoutes'
import songRoutes from './routes/songRoutes'
import userRoutes from './routes/userRoutes'
import friendRoutes from './routes/friendRoutes'

const app = express()
app.use(cors())

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:8100/socialvibez/music',
    clientId: '69372f48d4b24c099e581c69793c1879',
    clientSecret: '3fd83b37a78044e597517228a2cb6796',
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then((data: any) => {
      console.log(data.body)
    })
    .catch((err: any) => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.get('/lyrics', async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || 'No Lyrics Found'
  res.json({ lyrics })
})

app.use('/posts', postRoutes)
app.use('/messages', messageRoutes)
app.use('/login', loginRoutes)
app.use('/users', userRoutes)
app.use('/songs', songRoutes)
app.use('/friends', friendRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).end()
})

// Syncing our database
db.sync({ alter: true }).then(() => {
  console.info('connected to the database!')
})

app.listen(3001)
