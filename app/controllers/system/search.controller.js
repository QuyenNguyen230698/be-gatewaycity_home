//#region AnhLD Import các service cần thiết
const { getDataSearch
} = require("../../services/system/search.service");
//#endregion

const getListSearch = async (req, res) => {
    try {
        const { q } = req.body;
        const searchList = await getDataSearch(q);
        if (searchList.result) {
            return res.status(200).json({
                result: true,
                data: searchList.data
            });
        }
    } catch (error) {
        return res
            .status(500)
            .send({ message: "Failed to fetch searchList data", error: error.message });
    }
};

//#region AnhLD Export controller
module.exports = {
    getListSearch,
};
//#endregion
