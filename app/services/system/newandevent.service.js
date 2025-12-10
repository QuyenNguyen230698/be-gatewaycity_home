const Newandevent = require('../../models/system/newandevent.model');
const search = require('../../models/system/search.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { responseSuccess } = require('../../common/helpers/responsive.helper');
const { htmlToPlainText } = require('../../utils/filter');

const buildQuery = (where) => {
    let query = {};
    Object.keys(where).forEach(key => {
        query[key] = where[key];
    });
    return query;
};

const buildSearchQuery = (search) => {
    let searchQuery = {};
    search.forEach(item => {
        searchQuery[item.name] = { $regex: item.value, $options: 'i' };
    });
    return searchQuery;
};

const newandeventAdminServices = {
  getNewandevent: async (skip, take, where, search, sorted, requiresCounts) => {
    try {
        let query = buildQuery(where);
        query = { $and: [query, { status: { $ne: 'archived' } }] };

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

        let newandeventList = await Newandevent.find(query)
            .sort(sortOptions)
            .skip(parseInt(skip, 10))
            .limit(parseInt(take, 10))
            .lean();

        if (newandeventList.length > 0) {
            newandeventList = newandeventList.map(item => ({
                ...item,
                createdBy: item.systemInfo?.createdBy,
                updatedBy: item.systemInfo?.updatedBy,
                lastUpdated: item.systemInfo?.lastUpdated,
                systemInfo: undefined, // Remove systemInfo field
            }));
        }

        const totalRecords = requiresCounts ? await Newandevent.countDocuments(query) : undefined;

        return { newandeventList, totalRecords };
    } catch (error) {
        console.error('Error fetching newandevent data:', error);
        throw new Error('Failed to fetch newandevent data');
    }
  },

createOrUpdateNewandevent: async (_id, title, description, src, content, type) => {
  try {
    // Nếu có _id → cập nhật, không có _id → tạo mới
    if (_id) {
      // Cập nhật (nếu không tìm thấy thì ném lỗi)
      const existing = await Newandevent.findById(_id);
      if (!existing) {
        throw new Error('New and event not found');
      }

      await Newandevent.updateOne(
        { _id },
        { title, description, src, content, type, updatedAt: Date.now() }
      );
      findNews = await Newandevent.findOne({ _id });
      await search.updateOne(
        { _idRef: _id },
        { slug: "tin-tuc-va-su-kien/" + findNews.slug,
          name: "Tin tức và sự kiện",
          child: findNews.title,
          description: findNews.title + " " + htmlToPlainText(findNews.description)
         }
      );

      return responseSuccess(`New and event "${title}" updated successfully`);
    } else {
      // Tạo mới
      const newNewandevent = new Newandevent({
        title,
        description,
        src,
        content,
        type,
      });
      await newNewandevent.save();
      await search.create({
        _idRef: newNewandevent._id,
        slug: "tin-tuc-va-su-kien/" + newNewandevent.slug,
        name: "Tin tức và sự kiện",
        child: newNewandevent.title,
        description: newNewandevent.title + " " + htmlToPlainText(newNewandevent.description)
      });

      return responseSuccess(`New and event "${title}" created successfully`);
    }
  } catch (error) {
    console.error('Error in createOrUpdateNewandevent:', error);
    
    // Giữ nguyên thông báo lỗi gốc nếu có, nếu không thì thông báo chung
    const message = error.message || 'Failed to save New and event';
    throw new Error(message);
  }
},

  deleteNewandevent: async (_id) => {
    try {
      await Newandevent.findOneAndDelete({ _id });
      await search.findOneAndDelete({ _idRef: _id });
    
      return responseSuccess(`New and event deleted successfully`);
    } catch (error) {
      console.error('Error deleting New and event:', error);
      throw new Error('Failed to delete New and event');
    }
  },

  updateStatusNewandevent: async (_id, status) => {
    try {
        // Find the user by _id
        const newNewandevent = await Newandevent.findOne({ _id });
        if (!newNewandevent) {
          throw new Error('New and event not found');
        }
      
        // Update the user's status
        newNewandevent.status = status;
        await newNewandevent.save();
      
        return responseSuccess(`New and event ${newNewandevent.title} ${status} successfully`);
      } catch (error) {
        console.error('Error updating New and event status:', error);
        throw new Error('Failed to update New and event status');
      }
  },
};

const newandeventServices = {
    getNewandevent: async (skip, take, where, search, sorted, requiresCounts) => {
        try {
            let query = buildQuery(where);
            query = { $and: [query, { status: 'published' }] };
    
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
    
            let newandeventDataList = await Newandevent.find(query)
                .sort(sortOptions)
                .skip(parseInt(skip, 10))
                .limit(parseInt(take, 10))
                .lean();
    
            if (newandeventDataList.length > 0) {
                newandeventDataList = newandeventDataList.map(item => ({
                    ...item,
                    createdBy: item.systemInfo?.createdBy,
                    updatedBy: item.systemInfo?.updatedBy,
                    lastUpdated: item.systemInfo?.lastUpdated,
                    systemInfo: undefined, // Remove systemInfo field
                }));
            }
    
            const totalRecords = requiresCounts ? await Newandevent.countDocuments(query) : undefined;
    
            return { newandeventDataList, totalRecords };
        } catch (error) {
            console.error('Error fetching newandevent data:', error);
            throw new Error('Failed to fetch newandevent data');
        }
    },
    getNewandeventDetail: async (slug) => {
        try {
            const newandeventDetail = await Newandevent.findOne({ slug });
            return newandeventDetail;
        } catch (error) {
            console.error('Error getting newandevent detail:', error);
            throw new Error('Failed to get newandevent detail');
        }
    }
}

module.exports = { newandeventAdminServices, newandeventServices };