const User = require("../../models/admin/user.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Email = require("../../models/send-email/email.models.js");
const { responseSuccess } = require('../../common/helpers/responsive.helper.js');
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES } = require('../../common/constant/app.constant.js');
const { buildQuery, buildSearchQuery } = require('../../utils/queryBuilder.js');

const userServices = {
    getUsers: async (skip, take, where, search, sorted, requiresCounts) => {
    try {
        let query = buildQuery(where);
        query = { $and: [query, { status: { $ne: 'INACTIVE' } }] };

        if (search.length > 0) {
            const searchQuery = buildSearchQuery(search);
            query = { $and: [query, searchQuery] };
        }

        let sortOptions = {};
        if (sorted.length > 0) {
            sorted.forEach(sort => {
                sortOptions[sort.name] = sort.direction === 'ascending' ? 1 : -1;
            });
        }

        let userDataList = await User.find(query)
            .sort(sortOptions)
            .skip(parseInt(skip, 10))
            .limit(parseInt(take, 10))
            .lean();

        if (userDataList.length > 0) {
            userDataList = userDataList.map(item => ({
                ...item,
                createdBy: item.systemInfo?.createdBy,
                updatedBy: item.systemInfo?.updatedBy,
                lastUpdated: item.systemInfo?.lastUpdated,
                systemInfo: undefined, // Remove systemInfo field
            }));
        }

        const totalRecords = requiresCounts ? await User.countDocuments(query) : undefined;

        return { userDataList, totalRecords };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }
  },

  registerUser: async (username, email, password, phoneNumber) => {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const user = new User({ username, email, password: hashedPassword, phoneNumber });
      await user.save();
  
      return responseSuccess(`User ${username} created successfully`);
    } catch (error) {
      console.error("❌ Error registering user:", error);
      throw new Error("Failed to register user");
    }
  },

  loginUser: async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ email });

    // check user
    if (!user) {
      throw new Error('User not found');
    }

    // check status
    if (user.status === 'INACTIVE') {
      throw new Error('User is inactive please contact admin !');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
    return { user, token };
  },

  loginAdmin: async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ email });

    // check user
    if (!user) {
      throw new Error('User not found');
    }

    // check roles
    if (user.roles !== 'ADMIN') {
      throw new Error('User is not an admin please contact super admin !');
    }

    // check status
    if (user.status === 'INACTIVE') {
      throw new Error('User is inactive please contact super admin !');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
    return { user, token };
  },

  updateRole: async (email, roles) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
    
      // Update the user's roles
      user.roles = roles;
      await user.save();
    
      return responseSuccess(`User ${email} updated successfully`);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  },

  updateUser: async (email, password, username, phoneNumber, avatar, position) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
    
      // Update the user's fields only if new data is provided
      if (password) {
        user.password = await bcrypt.hash(password, 10); // Hash the new password
      }
      if (username) user.username = username;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (avatar) user.avatar = avatar;
      if (position) user.position = position;
      await user.save();
    
      return responseSuccess(`User ${email} updated successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },

  deleteUser: async (email, status) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
    
      // Update the user's status
      user.status = status;
      await user.save();
    
      return responseSuccess(`User ${email} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
};

module.exports = userServices;