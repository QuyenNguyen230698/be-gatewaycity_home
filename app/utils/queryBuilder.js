/**
 *Author: AnhLD
 *Date: 2024-12-30
 * Function description
 *
 * @param {*} str
 * @return {*}
 */
 const removeAccents = (str) => {
  if (typeof str !== "string") return str;

  const accentMap = {
    à: "a",
    á: "a",
    ạ: "a",
    ả: "a",
    ã: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ậ: "a",
    ẩ: "a",
    ẫ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ặ: "a",
    ẳ: "a",
    ẵ: "a",
    è: "e",
    é: "e",
    ẹ: "e",
    ẻ: "e",
    ẽ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ệ: "e",
    ể: "e",
    ễ: "e",
    ì: "i",
    í: "i",
    ị: "i",
    ỉ: "i",
    ĩ: "i",
    ò: "o",
    ó: "o",
    ọ: "o",
    ỏ: "o",
    õ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ộ: "o",
    ổ: "o",
    ỗ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ợ: "o",
    ở: "o",
    ỡ: "o",
    ù: "u",
    ú: "u",
    ụ: "u",
    ủ: "u",
    ũ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ự: "u",
    ử: "u",
    ữ: "u",
    ỳ: "y",
    ý: "y",
    ỵ: "y",
    ỷ: "y",
    ỹ: "y",
    đ: "d",
    À: "A",
    Á: "A",
    Ạ: "A",
    Ả: "A",
    Ã: "A",
    Â: "A",
    Ầ: "A",
    Ấ: "A",
    Ậ: "A",
    Ẩ: "A",
    Ẫ: "A",
    Ă: "A",
    Ằ: "A",
    Ắ: "A",
    Ặ: "A",
    Ẳ: "A",
    Ẵ: "A",
    È: "E",
    É: "E",
    Ẹ: "E",
    Ẻ: "E",
    Ẽ: "E",
    Ê: "E",
    Ề: "E",
    Ế: "E",
    Ệ: "E",
    Ể: "E",
    Ễ: "E",
    Ì: "I",
    Í: "I",
    Ị: "I",
    Ỉ: "I",
    Ĩ: "I",
    Ò: "O",
    Ó: "O",
    Ọ: "O",
    Ỏ: "O",
    Õ: "O",
    Ô: "O",
    Ồ: "O",
    Ố: "O",
    Ộ: "O",
    Ổ: "O",
    Ỗ: "O",
    Ơ: "O",
    Ờ: "O",
    Ớ: "O",
    Ợ: "O",
    Ở: "O",
    Ỡ: "O",
    Ù: "U",
    Ú: "U",
    Ụ: "U",
    Ủ: "U",
    Ũ: "U",
    Ư: "U",
    Ừ: "U",
    Ứ: "U",
    Ự: "U",
    Ử: "U",
    Ữ: "U",
    Ỳ: "Y",
    Ý: "Y",
    Ỵ: "Y",
    Ỷ: "Y",
    Ỹ: "Y",
    Đ: "D",
  };

  return str.replace(/[\u0300-\u036f]/g, (match) => accentMap[match] || match);
};

/**
 *Author: AnhLD
 *Date: 2024-12-30
 * Function description
 *
 * @param {*} conditions
 * @return {*}
 */
const buildQuery = (conditions) => {
  if (conditions.length === 0) return {};

  /**
   *Author: AnhLD
   *Date: 2024-12-30
   * Function description
   *
   * @param {*} condition
   * @return {*}
   */
   const buildConditions = (condition) => {
    if (condition.isComplex) {
      const predicates = condition.predicates
        .map(buildConditions)
        .filter(Boolean);
  
      if (predicates.length === 0) return null;
  
      return condition.condition === "or"
        ? { $or: predicates }
        : { $and: predicates };
    } else {
      let value = condition.value;
  
      if (typeof value === "undefined" || value === null) return null;
  
      // Áp dụng removeAccents nếu cần
      if (condition.ignoreAccent && typeof value === "string") {
        value = removeAccents(value);
      }
  
      const operatorMap = {
        equal: "$eq",
        notequal: "$ne",
        gt: "$gt",
        gte: "$gte",
        lt: "$lt",
        lte: "$lte",
        in: "$in",
        nin: "$nin",
        contains: "$regex",
        regex: "$regex",
      };
  
      let operator = operatorMap[condition.operator] || "$eq";
  
      // Kiểm tra kiểu trường
      const isStringField = typeof value === "string";
  
      // Xử lý các trường hợp đặc biệt
      if (isStringField && condition.operator === "equal") {
        if (condition.ignoreCase) {
          value = new RegExp(`^${value}$`, "i");
        } else {
          value = new RegExp(`^${value}$`);
        }
        operator = "$regex";
      }
  
      if (isStringField && condition.operator === "contains") {
        if (condition.ignoreCase) {
          value = new RegExp(value, "i");
        } else {
          value = new RegExp(value);
        }
        operator = "$regex";
      }
  
      // Trả về điều kiện
      return {
        [condition.field]: { [operator]: value },
      };
    }
  };
  

  const query = conditions.map(buildConditions).filter(Boolean);

  return query.length > 1 ? { $and: query } : query[0] || {};
};

/**
 *Author: AnhLD
 *Date: 2024-12-30
 * Function description
 *
 * @param {*} searches
 * @return {*}
 */
const buildSearchQuery = (searches) => {
  let searchQueries = [];

  searches.forEach((search) => {
    search.fields.forEach((field) => {
      let value = search.key;
      if (search.ignoreCase) {
        value = new RegExp(search.key, "i");
      }
      searchQueries.push({
        [field]: { $regex: value },
      });
    });
  });

  return { $or: searchQueries };
};

module.exports = { buildQuery, buildSearchQuery };
