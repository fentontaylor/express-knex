var request = require("supertest");
var app = require('../app');

//Database connection
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('api', () => {
  beforeEach(async () => {
    await database.raw('truncate table papers cascade');

    let paper = {
      title: 'Alternate Endings for Game of Thrones, Season 8',
      author: 'Literally Anyone',
      publisher: 'Not George R. R. Martin'
    };
    await database('papers').insert(paper, 'id');
  });

  afterEach(() => {
    database.raw('truncate table papers cascade');
  });

  describe('Test the root path', () => {
    test('should return a 200', () => {
      return request(app).get("/").then(response => {
        expect(response.statusCode).toBe(200)
      })
    });
  });

  describe('POST papers', () => {
    test('happy path', async () => {
      let body = {
        title: 'Alternate Endings for Game of Thrones, Season 8',
        author: 'Literally Anyone',
        publisher: 'Not George R. R. Martin'
      };
      await request(app).post('/api/v1/papers')
        .send(body)
        .then(async (response) => {
          expect(response.statusCode).toBe(201)
        })
    })
  })
});