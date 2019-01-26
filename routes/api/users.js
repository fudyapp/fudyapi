const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const decodeToken =require('../../_helpers/getdecodedTokenFromHeaders');
const roles =require('../../_helpers/roles');




//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
  return Users.findOne({email:user.email})
    .then((result) => {
      if(result) {
        return res.status(400).json({error:"Mail exists"});
      }else{
        const finalUser = new Users(user);

        finalUser.setPassword(user.password);
      
        return finalUser.save()
          .then(() => res.json({ user: finalUser.toAuthJSON() })).catch(err=>{
            res.status(400).json(err);
          });
      }
    });

});
//To create admin vendor cashier 
router.post('/create', auth.required, (req, res, next) => {
  const { body: { user ,role} } = req;
  
  const tokenData =  decodeToken(req);
  if(role=="admin" && tokenData.role !="sadmin"){
      return res.status(500).json({
        errors: {
          role: 'Unauthorized',
        },
      });
    
  }
  console.log("admin",roles.role);
  if(!roles.role.findIndex(function(value,index){ return tokenData.role=== value})){
    return res.status(500).json({
      errors: {
        role: 'Unauthorized 1',
      },
    });
  }

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
  return Users.findOne({email:user.email})
    .then((result) => {
      if(result) {
        return res.status(400).json({error:"Mail exists"});
      }else{
        const finalUser = new Users(user);

        finalUser.setPassword(user.password);
      
        return finalUser.save()
          .then((user) => {
         
            res.json({
              user: finalUser.toUserJSON()
            })
          }).catch(err => {
            res.status(400).json(err);
          });
      }
    });

});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;