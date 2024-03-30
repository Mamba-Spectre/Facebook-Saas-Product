import express from 'express';
import { merge, get } from 'lodash';

import { getUserBySessionToken } from '../db/users'; 

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    console.log("i ma herer");
    console.log("cokkies", req.cookies);
    console.log("headers", req.headers["common-auth"]);
    
    
    
    const sessionToken = req.header['common-auth'];
    // const sessionToken:any = req.headers['common-auth'];
    console.log("sessionToken", sessionToken);
    

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