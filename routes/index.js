import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.json({
    message: "Sever Is healthy",
    timeStamp: new Date().toISOString(),
  });
});

export default router;
