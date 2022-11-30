// const sendToken = (user, statusCode, res) => {
//   const token = user.getJWTToken();
//   const options = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };
//   res.status(statusCode).cookie("token", token, options).json({
//     Sucess: true,
//     user,
//     token,
//   });
// };
const sendToken = (user, statusCode, res, pro) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    sucess: true,
    user,
    token,
    pro,
  });
};
module.exports = sendToken;
