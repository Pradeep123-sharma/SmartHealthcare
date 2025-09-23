import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model

const register = async (userData) => {
    const { username, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
        username,
        password: hashedPassword,
    });

    await newUser.save();
    return newUser;
};

const login = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
};

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export { register, login, validateToken };