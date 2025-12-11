const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../common/swagger/init.swagger.js');


const userRoutes = require('../routes/admin/user.routes.js');
const searchRoutes = require('../routes/system/search.routes.js');
const productRoutes = require('../routes/system/product.routes.js');
const newandeventRoutes = require('../routes/system/newandevent.routes.js');
const quotepriceRoutes = require('../routes/system/quoteprice.routes.js');
const cloudinaryRoutes = require('../routes/cloudinary/cloudinary.routes.js');
const emailRoutes = require('../routes/send-email/email.routes.js');
const otpRoutes = require('../routes/send-email/otp.routes.js');
const templateDesignRoutes = require('../routes/system/templateDesign.routes.js');

router.use('/users', userRoutes);
router.use('/search', searchRoutes);
router.use('/newandevents', newandeventRoutes);
router.use('/products', productRoutes);
router.use('/template-design', templateDesignRoutes);
router.use('/quoteprices', quotepriceRoutes);
router.use('/cloudinary', cloudinaryRoutes);
router.use('/email', emailRoutes);
router.use('/otp', otpRoutes);

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', (req, res) => {
    const urlNew = `${req.protocol}://${req.get("host")}`
    console.log('Current URL:', urlNew)

    const existingServer = swaggerDocument.servers.find(item => item.url === urlNew)
    
    if (!existingServer) {
        swaggerDocument.servers.unshift({
            url: urlNew,
            description: "New server"
        })
    }

    return swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true
        }
    })(req, res)
});

module.exports = router;