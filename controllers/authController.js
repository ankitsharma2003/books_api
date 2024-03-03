const User = require("../models/User");
const bcrypt = require("bcrypt");
const { error, success } = require("../utils/responseWrapper");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.table([email, password]);

    if (!email || !password) {
      return res.send(error(403, "All fileds are required"));
    }

    const oldUser = await User.findOne({ email });
    console.log("oldUser", oldUser);

    if (oldUser) {
      return res.send(error(402, "User is already registred"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    console.log("user", user);

    return res.send(success(201, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(403, "All fields are required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.send(error(402, "User is not registred"));
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.send(error(401, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(
      success(200, {
        accessToken,
      })
    );
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    return res.send(error(401, "refresh token in cookie is required"));
  }

  const refreshToken = cookies.jwt;

  try {
    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decode._id;
    const accessToken = generateAccessToken({ _id });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const logOutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "user deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

//internal functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    console.log("accessToken : ", token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log("refreshToken : ", token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logOutController,
};