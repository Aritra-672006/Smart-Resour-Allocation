const User = require('./User');

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    return res.status(201).json({
      message: 'Signup successful',
      user
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      user
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};


module.exports = { signup, login };
