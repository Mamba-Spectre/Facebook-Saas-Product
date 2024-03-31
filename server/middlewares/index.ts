import express from 'express';
import { merge, get } from 'lodash';
import axios from 'axios';

import { UserModel, getUserBySessionToken } from '../db/users'; 

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken:any = req.headers['common-auth'];

    if (!sessionToken) {
      return res.status(403).json({ message: 'No session token' });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(403).json({ message: 'User dont exsist' });
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error authenticating user' });
  }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as unknown as string;

    if (!currentUserId) {
      return res.status(400).json({ message: 'No user found' });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({ message: 'Not the owner' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error checking ownership' });
  }
}

export const profanityfilter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try{
    const text = req.body.message;
    // const { id } = req.params;
    const sessionToken:any = req.headers['common-auth'];
    const user:any = await getUserBySessionToken(sessionToken);

    
    const apiKey ="rckVCRVEJ9Poa7gzUWH8Vw==JICS95KeAHzIdMh9";
    const response = await axios.get(`https://api.api-ninjas.com/v1/profanityfilter?text=${text}`, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });
    if(response.data.has_profanity){
      user.isBlackListed = true;
      await user.save();
      return res.status(402).json({ message: 'Profanity detected' });
    }
    next();
  }catch(error){
    console.log(error);
    return res.status(400).json({ message: 'Error checking profanity' });
  }
}