import {Router} from 'express';
import {login,register,getProfile} from '../controllers/authController';
import {authenticateToken} from '../middleware/auth';
const r=Router();
r.post('/register',register);
r.post('/login',login);
r.get('/profile',authenticateToken,getProfile);
export default r; 