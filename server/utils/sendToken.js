export const sendToken = async (user, statusCode, message, res) => {
  const token = await user.generateToken();

  const days = process.env.COOKIE_EXPIRE || 7;

  const options = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      user,
    });
};