require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../lib/app');

const createTweet = (handle, text = 'hi I a tweet') => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      text
    })
    .then(res => res.body);
};
const createUser = (handle, name, email) => {
  return request(app)
    .post('/users')
    .send({
      handle,
      name,
      email
    })
    .then(res => res.body);
};

describe('tweets app', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  // POST ------------------------------------------
  it('can create a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'cari',
        text: 'hiya tweety'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'cari',
          text: 'hiya tweety',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
  it('can create a new user', () => {
    return request(app)
      .post('/users')
      .send({
        handle: 'newcooluser',
        name: 'Cool Person McGee',
        email: 'cool@cool.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'newcooluser',
          name: 'Cool Person McGee',
          email: 'cool@cool.com',
          _id: expect.any(String),
          __v: 0
        });
      });
  });

  // GET ------------------------------------------
  it('can get a list of tweets from db', () => {
    const tweetsToCreate = ['hey', 'hi', 'hello', 'hola'];
    return Promise.all(tweetsToCreate.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('can get a list of users from db', () => {
    const usersToCreate = ['Jim', 'Pam', 'Michael', 'Stanley'];
    return Promise.all(usersToCreate.map(createUser))
      .then(() => {
        return request(app)
          .get('/users');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  // GET by id
  it('can get a tweet by id', () => {
    return createTweet('hayyyyyy')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              handle: 'hayyyyyy',
              text: 'hi I a tweet',
              _id,
              __v: 0
            });
          });
      });
  });

  // PATCH ------------------------------------------
  it('can retrieve a tweet by :id and return the updated tweet', () => {
    const newTweet = {
      handle: 'pizzatown',
      text: 'boo I a tweet'
    };
    return createTweet('flanel')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .patch(`/tweets/${_id}`)
          .send(newTweet);
      })
      .then(res => {
        expect(res.body.handle).toEqual('pizzatown');
      });
  });

  // DELETE ------------------------------------------
  it('can retrieve a tweet by :id, delete, and return the delete count', () => {
    return createTweet('alo')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
});
