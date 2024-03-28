import express from 'express';

import { deleteUserById, getUsers, getUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.body;
    const {accessToken} = req.body;
    // const { username } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Missing Access Token fields' });
    }

    const user = await getUserById(id);
    
    user.facebookAuthTokens = accessToken;
    await user.save();

    return res.status(200).json({message:"Facebook Page auth Token set"}).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Error updating user' });
  }
}