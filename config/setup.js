const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(
  bodyParser.json({
    limit: '250mb'
  })
);
router.use(
  bodyParser.urlencoded({
    limit: '250mb',
    extended: true
  })
);

module.exports = router;
exports = router;
