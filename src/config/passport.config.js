import passport from 'passport';
import local from 'passport-local'
import GitHubStrategy from 'passport-github2';
import fetch from 'node-fetch';
import { createHash, isValidPassword } from '../utils.js';
import { cartService } from '../services/cart.service.js';
import { usersService } from '../services/users.service.js';

const LocalStrategy = local.Strategy;

export function iniPassport() {

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      }, 
      async (req, username, password, done) => {
        try {
          const user = await usersService.getUserByEmail(username);
          if (!user) {
            console.log('User Not Found with username (email) ' + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log('Invalid Password');
            return done(null, false);
          }
          req.session.email = user.email;
          req.session.firstName = user.firstName;
          req.session.lastName = user.lastName;
          req.session.age = user.age;
          req.session.role = user.role;
          req.session.cart = user.cart;

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age } = req.body;
          let user = await usersService.getUserByEmail(username);
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }
          const newUser = {
            email: username,
            firstName,
            lastName,
            age,
            password,
            role: "user",
            isAdmin: "false"
          };
          let userCreated = await usersService.addUser(newUser);
          
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accesToken, _, profile, done) => {
        console.log(profile);
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          let user = await usersService.getUserByEmail(profile.email);
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              isAdmin: false,
              password: 'nopass',
            };
            let userCreated = await usersService.addUser(newUser);
            console.log('User Registration successful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersService.getUserById(id);
    done(null, user);
  });
}
