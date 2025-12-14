const QuotePrice = require('../../models/system/quoteprice.model.js');
const { responseSuccess } = require('../../common/helpers/responsive.helper.js');
const { buildQuery, buildSearchQuery } = require('../../utils/queryBuilder.js');

const quotepriceServices = {
    getQuotePrice: async (skip, take, where, search, sorted, requiresCounts) => {
        try {
            let query = buildQuery(where);
    
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
    
            let quotepriceDataList = await QuotePrice.find(query)
                .sort(sortOptions)
                .skip(parseInt(skip, 10))
                .limit(parseInt(take, 10))
                .lean();
    
            if (quotepriceDataList.length > 0) {
                quotepriceDataList = quotepriceDataList.map(item => ({
                    ...item,
                    createdBy: item.systemInfo?.createdBy,
                    updatedBy: item.systemInfo?.updatedBy,
                    lastUpdated: item.systemInfo?.lastUpdated,
                    systemInfo: undefined, // Remove systemInfo field
                }));
            }
    
            const totalRecords = requiresCounts ? await QuotePrice.countDocuments(query) : undefined;
    
            return { quotepriceDataList, totalRecords };
        } catch (error) {
            console.error('Error fetching newandevent data:', error);
            throw new Error('Failed to fetch newandevent data');
        }
    },
}

module.exports = { quotepriceServices };