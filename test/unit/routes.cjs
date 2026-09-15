const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const User = require('../../api/models/userModel');
const router = require('../../api/routes/routes');

test('Express routes preserve user responses and database error handling without MongoDB', async (t) => {
  const user = { _id: '507f1f77bcf86cd799439011', __v: 0, name: 'Fixture' };
  t.mock.method(User, 'find', async () => [user]);
  t.mock.method(User, 'findById', async id => { assert.equal(id, user._id); return user; });
  const app = express();
  app.use(express.json());
  app.use(router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const expected = { name: 'Fixture', userId: user._id };
  assert.deepEqual(await (await fetch(base + '/users')).json(), { data: { users: [expected] } });
  assert.deepEqual(await (await fetch(base + '/user/' + user._id)).json(), { data: { user: expected } });
  User.find.mock.mockImplementation(async () => { throw new Error('fixture failure'); });
  assert.equal((await fetch(base + '/users')).status, 400);
});
