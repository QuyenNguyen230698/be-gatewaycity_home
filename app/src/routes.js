const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../common/swagger/init.swagger.js');


const userRoutes = require('../routes/admin/user.routes');
const searchRoutes = require('../routes/system/search.routes');
const productRoutes = require('../routes/system/product.routes');
const newandeventRoutes = require('../routes/system/newandevent.routes');
const quotepriceRoutes = require('../routes/system/quoteprice.routes');
const cloudinaryRoutes = require('../routes/cloudinary/cloudinary.routes');
const emailRoutes = require('../routes/send-email/email.routes');
const otpRoutes = require('../routes/send-email/otp.routes');
const templateDesignRoutes = require('../routes/system/templateDesign.routes');

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