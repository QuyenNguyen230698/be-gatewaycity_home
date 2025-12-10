const userServices = require("../../services/admin/user.service");
const User = require('../../models/admin/user.model');
const { BadRequestException } = require('../../common/helpers/error.helper');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../../common/constant/app.constant');

const userController = {
  checkRun: async (req, res) => {
    res.json("check Run Sever");
  },

  getUsers: async (req, res) => {
    try {
      const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;

      const { userDataList, totalRecords } = await userServices.getUsers(skip, take, where, search, sorted, requiresCounts);

      res.status(200).json({
        result: userDataList,
        count: totalRecords,
      });
    } catch (error) {
      console.error('Error fetching userDataList data:', error);
      res.status(500).json({ message: 'Error fetching userDataList data', error: error.message });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { username, email, password, phoneNumber } = req.body;

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestException('User already exists with this email');
      }

      // Proceed to create the user
      const createUser = await userServices.registerUser(username, email, password, phoneNumber);
      res.status(201).json(createUser);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  },

  loginUser: async (req, res) => {
    let result;
    try {
      const { email, password } = req.body;
      const { user, token } = await userServices.loginUser(email, password);
      const data = {
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        roles: user.roles,
        avatar: user.avatar,
        position: user.position
      };
      result = true;
      res.status(200).json({ result, message: 'Login successful', data, token });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

  loginAdmin: async (req, res) => {
    let result;
    try {
      const { email, password } = req.body;
      const { user, token } = await userServices.loginAdmin(email, password);
      const data = {
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        roles: user.roles,
        avatar: user.avatar,
        position: user.position
      };
      result = true;
      res.status(200).json({ result, message: 'Login successful', data, token });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

  updateRole: async (req, res) => {
    let result;
    try {
      const { email, roles } = req.body;
      const roleUpdated = await userServices.updateRole(email, roles);
      result = true;
      res.status(200).json({ result, message: 'Role updated successfully', data: roleUpdated });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

  updateUser: async (req, res) => {
    let result;
    try {
      const { email, password, username, phoneNumber, avatar, position } = req.body;
      const userUpdated = await userServices.updateUser(email, password, username, phoneNumber, avatar, position);
      result = true;
      res.status(200).json({ result, message: 'User updated successfully', data: userUpdated });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    let result;
    try {
      const { email, status } = req.body;
      const userDeleted = await userServices.deleteUser(email, status);
      result = true;
      res.status(200).json({ result, message: 'User deleted successfully', data: userDeleted });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

  findUser: async (req, res) => {
    try {
      const searchCriteria = req.body; // Accept any search criteria

      // Validate and sanitize search criteria
      if (typeof searchCriteria !== 'object' || Array.isArray(searchCriteria)) {
        return res.status(400).json({
          result: false,
          message: 'Invalid search criteria'
        });
      }

      // Find all users based on input criteria
      const users = await User.find(searchCriteria);

      if (users.length === 0) {
        return res.status(404).json({
          result: false,
          message: 'No users found'
        });
      }

      // Return user data
      const userData = users.map(user => ({
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        roles: user.roles,
        avatar: user.avatar,
        position: user.position,
        status: user.status
      }));

      res.status(200).json({
        result: true,
        message: 'Users found',
        data: userData
      });
    } catch (error) {
      res.status(500).json({
        result: false,
        message: error.message
      });
    }
  }
};

const decodeToken = (token) => {
  if (!token) {
    console.error('Token is not provided');
    throw new Error('Token must be provided');
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Invalid token');
  }
};

module.exports = userController;
