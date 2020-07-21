const validator = require('validator');
const { User } = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {

    await User.findOne({ where: { email: req.body.email } }).
        then(async user => {
            if (!user) {
                return res.json({ error: 'Usuario no existe' })
            } else {
                let validacionPassword = await bcrypt.compare(req.body.password, user.password);

                if (validacionPassword) {
                    const token = jwt.sign(
                        { userId: user._id },
                        process.env.JWT_TOKEN,
                        { expiresIn: '24h' });
                    return res.status(200).json({
                        userId: user.id_user,
                        token: token
                    });
                } else {
                    return res.json({ error: 'Contraseña incorrecta' })
                }

            }
        });





}