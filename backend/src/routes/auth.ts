import {Router} from 'express';
import {login,register,getProfile,updateProfile} from '../controllers/authController';
import {authenticateToken} from '../middleware/auth';
const r=Router();
r.post('/register',register);
r.post('/login',login);
r.get('/profile',authenticateToken,getProfile);
r.put('/profile',authenticateToken,updateProfile);
export default r; 