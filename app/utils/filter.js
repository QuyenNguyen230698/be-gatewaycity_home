 const htmlToPlainText = (text) => {
    if (text && typeof text === 'string') {
        // Strip script/html tags using regex
        text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        text = text.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags
    }
    return text;
}

const combineText = (data) => {
    return data?.map(item => {
        const title = item.title.trim();
        const description = item.description
            .replace(/<[^>]*>/g, '')
            .trim();
        return `${title}: ${description}`;
    }).join(' ');
};

//#region QuyenNC ( filter about )
const combineTextAbout1 = (data) => {
    return data?.map(item => {
        const description = item.description
            .replace(/<[^>]*>/g, '')
            .trim();
        return `${description}`;
    }).join(' ');
};

const combineTextAbout2 = (data) => {
    return data?.map(item => {
        return item.detail
            .map(detail => {
                const name = detail.name.trim();
                const description = detail.description
                    .replace(/<[^>]*>/g, '') // Xóa các thẻ HTML nếu có
                    .trim();
                return `${name}: ${description}`;
            })
            .join(' '); // Gộp các mục trong `detail` thành một chuỗi
    }).join(' '); // Gộp các mục trong `data` thành một chuỗi
};

const combineTextAbout3 = (data) => {
    return data?.brands?.map(brand => {
        const name = brand.name.trim();
        const description = brand.description
            .replace(/<[^>]*>/g, '') // Xóa các thẻ HTML nếu có
            .trim();
        return `${name}: ${description}`;
    }).join(' '); // Gộp các mục trong `brands` thành một chuỗi
};

//#endregion

module.exports = {
    htmlToPlainText,
    combineText,
    combineTextAbout1,
    combineTextAbout2,
    combineTextAbout3
};