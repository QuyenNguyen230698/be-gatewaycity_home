const QuotePrice = require('../../models/system/quoteprice.model.js');
const { responseSuccess } = require('../../common/helpers/responsive.helper.js');

const quotepriceServices = {
    getQuotePrice: async (req) => {
        try {
            const quotepriceDataList = await QuotePrice.find({});

            return responseSuccess('Get quoteprice successfully', quotepriceDataList);
        } catch (error) {
            console.error('Error fetching quoteprice data:', error);
            throw new Error('Failed to fetch quoteprice data');
        }
    },
}

module.exports = { quotepriceServices };