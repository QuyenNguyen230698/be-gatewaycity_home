const templateDesign = require("../../models/system/templateDesignModels.js");

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

const getGridDataService = async (skip, take, where, search, sorted, requiresCounts) => {
    try {
        let query = buildQuery(where);
    
        if (search.length > 0) {
          const searchQuery = buildSearchQuery(search);
          query = { $and: [query, searchQuery, { status: 'published' } ] };
        }
    
        let sortOptions = {};
        if (sorted.length > 0) {
          sorted.forEach(sort => {
            sortOptions[sort.name] = sort.direction === 'ascending' ? 1 : -1;
          });
        }
    
        let templateDesignList = await templateDesign.find(query)
          .sort(sortOptions)
          .skip(parseInt(skip, 10))
          .limit(parseInt(take, 10))
          .lean();
    
        if (templateDesignList.length > 0) {
          templateDesignList = templateDesignList.map(item => ({
            ...item,
            createdBy: item.systemInfo?.createdBy,
            updatedBy: item.systemInfo?.updatedBy,
            lastUpdated: item.systemInfo?.lastUpdated,
            systemInfo: undefined, // Remove systemInfo field
          }));
        }
    
        const totalRecords = requiresCounts ? await templateDesign.countDocuments(query) : undefined;
    
        return { templateDesignList, totalRecords };
      } catch (error) {
        console.error('Error fetching templateDesignList data:', error);
        throw new Error('Failed to fetch templateDesignList data');
      }
};

const getListTemplate = async () => {
    try {
        const templateDesignList = await templateDesign.find({ status: 'published' }).lean();
        return templateDesignList;
    } catch (error) {
        console.error('Error fetching templateDesignList data:', error);
        throw new Error('Failed to fetch templateDesignList data');
    }
}

const handleCreateOrUpdateTemplateDesign = async (_id, name, design, type, status) => {
  try {
      const templateDesignData = { name, design, type, status };
      
      if (_id) {
          // Update existing record if _id is provided
          const result = await templateDesign.findByIdAndUpdate(
              _id,
              { $set: templateDesignData },
              { new: true, runValidators: true } // Return updated document and validate
          );
          if (!result) {
              throw new Error("Template design not found");
          }
          return result;
      } else {
          // Create new record if no _id is provided
          const result = await templateDesign.create(templateDesignData);
          return result;
      }
  } catch (error) {
      console.error("Error processing templateDesign data:", error);
      throw new Error(`Failed to ${_id ? 'update' : 'create'} templateDesign data`);
  }
}

const handleDeleteTemplateDesign = async (_id) => {
    try {
        const result = await templateDesign.findOneAndDelete(_id);
        return result;
    } catch (error) {
        console.error("Error deleting templateDesign data:", error);
        throw new Error("Failed to delete templateDesign data");
    }
}

module.exports = {
    getGridDataService,
    getListTemplate,
    handleCreateOrUpdateTemplateDesign,
    handleDeleteTemplateDesign
}