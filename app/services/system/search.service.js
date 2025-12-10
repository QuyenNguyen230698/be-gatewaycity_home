
const search = require('../../models/system/search.models');

const getDataSearch = async (query) => {
    try {
        const searchQuery = query 
            ? { status: "published", $or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }] } 
            : { status: "published" };
        
        const searchList = await search.find(searchQuery);
        return {
            result: true,
            data: searchList
        };
    } catch (error) {
        console.error("Error fetching Search data:", error);
        throw new Error("Failed to fetch Search data");
    }
};

module.exports = {
    getDataSearch
};
