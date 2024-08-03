import cron from "node-cron";
const RATE_LIMIT = 5;

let bucket = RATE_LIMIT;
export const rateLimiter = (req, res, next) => {
  if (bucket > 0) {
    bucket -= 1;
    // console.log("Tokens remaining : ", bucket);
    next();
  } else {
    res.status(429).json({
      success: false,
      message: "Request limit reached..",
    });
  }
};

export const fillBucket = () => {
  bucket = RATE_LIMIT;
};

cron.schedule("*/1 * * * *", () => {
  console.log("Refilling token in the bucket..");
  fillBucket();
});
