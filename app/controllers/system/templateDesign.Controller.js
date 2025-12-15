const { getListTemplate, getGridDataService, handleCreateOrUpdateTemplateDesign,handleDeleteTemplateDesign } = require("../../services/system/templateDesign.service.js");

const getGridData = async (req, res) => {
  try {
    const { requiresCounts = false, skip = 0, take = 10, where = [], search = [], sorted = [] } = req.body;

    const { templateDesignList, totalRecords } = await getGridDataService(skip, take, where, search, sorted, requiresCounts);

    res.status(200).json({
      result: templateDesignList,
      count: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching templateDesign data:', error);
    res.status(500).json({ message: 'Error fetching templateDesign data', error: error.message });
  }
};

const getTemplateDesign = async (req, res) => {
    try {
      const templateDesignList = await getListTemplate();
      return res.status(200).json({
        result: true,
        data:templateDesignList
      });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Failed to fetch template Design List data", error: error.message });
    }
};

const createOrUpdateTemplateDesign = async (req, res) => {
  try {
    const { _id, name, design, type, status } = req.body;
    const templateDesignData = await handleCreateOrUpdateTemplateDesign(_id, name, design, type, status);
    return res.status(200).json({result:true,data:templateDesignData});
  } catch (error) {
    console.error("Error saving templateDesign data:", error);
    res
      .status(500)
      .json({ message: "Failed to save templateDesign data", error: error.message });
  }
};

const deleteTemplateDesign = async (req, res) => {
  try {
    const { _id } = req.body;
    const templateDesignData = await handleDeleteTemplateDesign(_id);
    return res.status(200).json({result:true,data:templateDesignData});
  } catch (error) {
    console.error("Error deleting template design data:", error);
    res
      .status(500)
      .json({ message: "Failed to delete template design data", error: error.message });
  }
}

module.exports = {
    getGridData,
    getTemplateDesign,
    createOrUpdateTemplateDesign,
    deleteTemplateDesign
};
