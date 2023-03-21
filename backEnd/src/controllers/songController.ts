import { RequestHandler } from 'express'
import { Song } from '../models/song'
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
  clientId: '69372f48d4b24c099e581c69793c1879',
})

export const createSong: RequestHandler = async (req, res, next) => {
  let newSong: Song = req.body

  if (newSong.title && newSong.artist) {
    let created = await Song.create(newSong)
    res.status(201).json(created)
  } else {
    res.status(400).send()
  }
}

export const currentUserSongs: RequestHandler = async (req, res, next) => {
  let userId = req.params.userId

  let songs = await Song.findAll({
    where: { userId: userId },
  }).then((response) => {
    res.status(200).json(response)
  })
  return songs;
}

export const getAllSongs: RequestHandler = async (req, res, next) => {
  let allSongs: Song[] = await Song.findAll()
  res.status(200).json(allSongs)
}

export const songSearch: RequestHandler = async (req, res, next) => {
  let search = req.params.searchTerm;
  let token = req.body.token;

  spotifyApi.setAccessToken(token);

  let result = spotifyApi.searchTracks(`artist:${search}`, {limit:20}).then((response: any) => {
    res.status(200).json(response.body.tracks.items)
  });

  return result;
}
