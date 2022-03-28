const { required } = require('nodemon/lib/config')
const { authenticate } = require('passport/lib')
const localstrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail) {
    const authenticateUser = async(email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null){
            return done(null,false, { message: 'No user with that email' })
        }
        
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null,user)  
            }else{ 
                return done(null, false, {message: 'password incorrect'})
            }
        } catch (e) {
            return done(e)

        }
    }
    passport.use(new localstrategy({usernameField:'email'},
    authenticateUser))
    passport.serializeUser((user,done) => {})
    passport.deserializeUser((id,done) => {})

}

module.exports = initialize