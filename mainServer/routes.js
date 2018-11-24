const express = require('express');
const productsCtrl = require('./routes/productsController');
const ordersCtrl = require('./routes/ordersController');
const jobsCtrl = require('./routes/jobsController');
const usersCtrl = require('./routes/usersController');

let router = express.Router();

router.route('/price/:productName').get(productsCtrl.getPrice);
router.route('/stock/:productName').get(productsCtrl.getStock);
router.route('/sale/').get(productsCtrl.getSale);
router.route('/vegan/:productName').get(productsCtrl.getVegan);
router.route('/kosher/:productName').get(productsCtrl.getKosher);
router.route('/department/:productName').get(productsCtrl.getDepartment);
router.route('/products/').get(productsCtrl.getProducts);
router.route('/order/').get(ordersCtrl.getOrder);
router.route('/order/setOrder').put(ordersCtrl.setOrder);
router.route('/order/addProduct').put(ordersCtrl.addProduct);
router.route('/jobs').get(jobsCtrl.getJobs);
router.route('/vip/').put(usersCtrl.vipRegister);

module.exports = router;