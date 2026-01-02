import express, { Express, NextFunction, Request, Response } from 'express';
import { User, IUser } from './models/user.model';

const app: Express = express();
const port: number = 3000;

interface customRequest extends Request {
  startTime?: Date;
}

app.use((req: customRequest, _: Response, next: NextFunction) => {
  req.startTime = new Date();
  next();
});

app.get('/', (_: Request, res: Response) => {
  res.send('Hello');
});

interface User {
  name: string;
  email: string;
}

// fetch all Users
app.get('/users', async (_: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    console.log('users', users);
  } catch (e) {
    res.status(400).json({ message: 'Some error occured!' });
  }
});

// create user
app.post('/user/create', (req: Request<{}, {}, User>, _: Response) => {
  const { name, email } = req.body;
  console.log('name', name);
  console.log('email', email);
});

// fetch user based on userId
app.get('/user/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  console.log(id);
  return res.status(200).json({
    success: true,
    message: 'User details fetched Successfully',
  });
});

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
