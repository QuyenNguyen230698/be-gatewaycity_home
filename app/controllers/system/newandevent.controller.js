const {newandeventServices, newandeventAdminServices} = require("../../services/system/newandevent.service.js");
const Newandevent = require('../../models/system/newandevent.model.js');
const { BadRequestException } = require('../../common/helpers/error.helper.js');
const { ACCESS_TOKEN_SECRET } = require('../../common/constant/app.constant.js');

const newandeventAdminController = {

  getNewandevent: async (req, res) => {
    try {
      const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;

      const { newandeventList, totalRecords } = await newandeventAdminServices.getNewandevent(skip, take, where, search, sorted, requiresCounts);

      res.status(200).json({
        result: newandeventList,
        count: totalRecords,
      });
    } catch (error) {
      console.error('Error fetching movie data:', error);
      res.status(500).json({ message: 'Error fetching movie data', error: error.message });
    }
  },

  createNewandevent: async (req, res) => {
    try {
      const { _id, title, description, src, content, type } = req.body;
      const newandeventCreated = await newandeventAdminServices.createOrUpdateNewandevent(_id, title, description, src, content, type);
      res.status(200).json({ result: true, message: 'New and event created successfully', data: newandeventCreated });
    } catch (error) {
      console.error('Error creating new and event:', error);
      res.status(500).json({ message: 'Error creating new and event', error: error.message });
    }
  },

  deleteNewandevent: async (req, res) => {
    let result;
    try {
      const { _id } = req.body;
      const newandeventDeleted = await newandeventAdminServices.deleteNewandevent(_id);
      result = true;
      res.status(200).json({ result, message: 'New and event deleted successfully', data: newandeventDeleted });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },

  updateStatusNewandevent: async (req, res) => {
    let result;
    try {
      const { _id, status } = req.body;
      const newandeventUpdated = await newandeventAdminServices.updateStatusNewandevent(_id, status);
      result = true;
      res.status(200).json({ result, message: 'New and event updated successfully', data: newandeventUpdated });
    } catch (error) {
      result = false;
      res.status(400).json({ result, message: error.message });
    }
  },
};

const newandeventController = {
      getNewandevent: async (req, res) => {
        try {
          const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;
    
          const { newandeventDataList, totalRecords } = await newandeventServices.getNewandevent(skip, take, where, search, sorted, requiresCounts);
    
          res.status(200).json({
            result: newandeventDataList,
            count: totalRecords,
          });
        } catch (error) {
          console.error('Error fetching movie data:', error);
          res.status(500).json({ message: 'Error fetching movie data', error: error.message });
        }
      },
      getNewandeventDetail: async (req, res) => {
        try {
          const { slug } = req.body;
          const newandeventDetail = await newandeventServices.getNewandeventDetail(slug);
          if (!newandeventDetail) {
            return res.status(404).json({
              result: false,
              message: 'New and event not found'
            });
          }
          res.status(200).json({
            result: true,
            message: 'New and event found',
            data: newandeventDetail
          });
        } catch (error) {
          res.status(500).json({
            result: false,
            message: error.message
          });
        }
      },
      findNewEvent: async (req, res) => {
        try {
          const searchCriteria = req.body; // Accept any search criteria

          // Find all movies based on input criteria
          const newandevent = await Newandevent.find(searchCriteria);

          if (newandevent.length === 0) {
            return res.status(404).json({
              result: false,
              message: 'No new and event found'
            });
          }

          // Return movie data
          const newandeventData = newandevent.map(movie => ({
            _id: newandevent._id,
            title: newandevent.title,
            description: newandevent.description,
            type: newandevent.type,
          }));

          res.status(200).json({
            result: true,
            message: 'New and event found',
            data: newandeventData
          });
        } catch (error) {
          res.status(500).json({
            result: false,
            message: error.message
          });
        }
      },
}

module.exports = { newandeventAdminController, newandeventController };
