import express from 'express';
import { getUserByEmail, createUser, getUserById, findFacebookId, UserModel } from '../db/users';
import { authentication, random } from '../helpers';

let user:any = "";
const getUserBySessionToken = async (sessionToken: string) => {
  try {
    user = await UserModel.findOne({ 'authentication.sessionToken': sessionToken });
    return user;
  } catch (error) {
    console.error("Error fetching user by session token:", error);
  }
};


export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid email or password' }).end();
    }

    const user:any = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.status(400).json({ message: 'User not found' }).end();
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if(user.isBlackListed){
      return res.status(403).json({ message: 'User is blacklisted' }).end();
    }
    
    if (user.authentication.password != expectedHash) {
      return res.status(403).json({ message: 'Wrong password' }).end();
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('common-auth', user.authentication.sessionToken,{ httpOnly: true, secure: true, sameSite: 'none' });


    return res.status(200).json(user).end();
  } catch (error) {
    return res.status(400).json({ message: 'Authentication Failed' }).end();
  }
};

export const logout = async (req: any, res: express.Response) => {
  try {
    
    const sessionToken:any = req.headers['common-auth'];
    const user:any = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(401).json({ message: 'User not found' }).end();
    }
    user.facebookAuthTokens = undefined;
    await user.save();
    // res.clearCookie('COMMON-AUTH');

    return res.status(200).json({ message: 'Logged out' }).end();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to logout' }).end();
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({"message": 'Invalid email or password'}).end();
    }

    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return res.status(401).json({ message: 'User already exists' }).end();
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const facebookUserCheck = async (req: express.Request, res: express.Response) => {
  try {
    const  {userID}  = req?.body?.data?.data;
    

    if (!userID) {
      return res.sendStatus(400);
    }

    const user = await findFacebookId(userID);

    if (!user) {
      const newUser = await createUser({
        facebookId: userID,
        username: req?.body?.data?.data?.name,
        email: req?.body?.data?.data?.email

      })
      return res.status(200).json(newUser).end();
    }
    else{
      
    }

    // return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

}