const router = require('express').Router();
const agentController = require("./controllers/Agentcontroller");
const userController = require("./controllers/Usercontroller");
const useraccountController = require("./controllers/UserAccountcontroller");
const policycategoryController = require("./controllers/PolicyCategorycontroller");
const policycarrierController = require("./controllers/PolicyCarriercontroller");
const policyinfoController = require("./controllers/PolicyInfocontroller");
const messageController = require("./controllers/Messagecontroller");
const upload = require("./middleware/upload");

router.post('/agent-upload',upload.single("file"), agentController.upload);
router.post('/user-upload',upload.single("file"), userController.upload);
router.post('/useraccount-upload',upload.single("file"), useraccountController.upload);
router.post('/policycategory-upload',upload.single("file"), policycategoryController.upload);
router.post('/policycarrier-upload',upload.single("file"), policycarrierController.upload);
router.post('/policyinfo-upload',upload.single("file"), policyinfoController.upload);
router.post('/save-message',messageController.saveData);
router.get('/search-info',policyinfoController.searchInfo);
router.get('/get-policy-info',policyinfoController.getPolicyInfoByUser);

module.exports = router;    