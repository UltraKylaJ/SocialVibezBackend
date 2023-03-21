import { RequestHandler } from 'express'
import { MusicPage } from '../models/musicPage'
import { Post } from '../models/post'
import { User } from '../models/user'
import { verifyUser } from '../services/auth'

export const getAllPosts: RequestHandler = async (req, res, next) => {
  let posts = await Post.findAll()
  res.status(200).json(posts)
}

export const getOnePost: RequestHandler = async (req, res, next) => {
  let postId = req.params.postId;
  let post = await Post.findByPk(postId);
  res.status(200).json(post);
}

export const getPostsByUser: RequestHandler = async (req, res, next) => {
  let userId = req.params.userId;
  let userPosts = await Post.findAll({ where: { userId: userId } });
  res.status(200).json(userPosts);
}

export const getPostsByPage: RequestHandler = async (req, res, next) => {
  let pageId = req.params.pageId;
  let pagePosts = await Post.findAll({ where: { pageId: pageId } });
  res.status(200).json(pagePosts);
}

export const createPost: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req, res, next);

  if (!user) {
    return res.status(403).send('User not detected.')
  }

  const trackId = req.body.trackId;
  const artistId = req.body.artistId;

  if (!trackId && !artistId) {
    res.status(400).send('cannot find artistId and trackId')
  }
  
  const musicPage = await getOrCreateMusicPage(trackId, artistId, req.body)

  if (!musicPage) {
    return res.status(400).send('music page not created');
  }

  let newPost: Post = req.body;
  newPost.userId = user.userId;
  newPost.pageId = musicPage.pageId;
  newPost.display_name = user.display_name;
  console.log(newPost.userId);
  console.log(newPost);

  if (newPost.title && newPost.message) {
    let created = await Post.create(newPost);
    res.status(201).json(created);
  } else {
    res.status(400).send('Please include userId, display_name, title, and message')
  }
}

const getOrCreateMusicPage = async (artistId: string, trackId: string, body?: any) => {
  if (artistId) {
    const existingArtistPage = await MusicPage.findOne({ where: { artistId: artistId } });
    if (existingArtistPage) {
      return existingArtistPage;
    }
  }

  if (trackId) {
    const existingTrackPage = await MusicPage.findOne({ where: { trackId: trackId } });
      if (existingTrackPage) {
        return existingTrackPage;
      }
  }
  
  try {
    let newPage: MusicPage = body;

    newPage.artistId = artistId;
    newPage.trackId = trackId;

    let created = await MusicPage.create(newPage)
    return created;
  } catch (error) {
    console.log(error);
  }
  
  return null;
}

export const editPost: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req, res, next);

  if (!user) {
    return res.status(403).send('User not detected');
  }

  let postId = req.params.postId;
  let currentUserId = user.userId;
  console.log(req.body);

  let updatedPost: Post = req.body;
  let postFound = await Post.findByPk(postId);

  if (postFound && postFound.postId && postFound.userId === currentUserId) {
    await Post.update(updatedPost, {
      where: { 
        postId: postId,
        userId: currentUserId
      }
    });
    res.status(200).json('Updated post is a success!');
  }
  else {
    res.status(400).json('An error occured while updating this post');
  }
}

export const deletePost: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req, res, next);

  if (!user) {
    return res.status(403).send('User not detected');
  }

  let postId = req.params.postId;
  let currentUserId = user.userId;
  console.log(req.body);

  let postFound = await Post.findByPk(postId);

  if (postFound && postFound.userId === currentUserId) {
    await Post.destroy({
      where: {
        postId: postId,
        userId: currentUserId
      }
    });
    res.status(200).json('Post deleted!');
  }
  else {
    res.status(404).json('An error occured while deleting this post');
  }
}