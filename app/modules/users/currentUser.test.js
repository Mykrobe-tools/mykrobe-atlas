/* @flow */

import sagaHelper from 'redux-saga-testing';

import // createCurrentUser,
// requestCurrentUser,
// updateCurrentUser,
// deleteCurrentUser,
// createCurrentUserWorker,
// requestCurrentUserWorker,
// updateCurrentUserWorker,
// deleteCurrentUserWorker,
'./currentUser';

const payload = { test: true };

describe('currentUser', () => {
  it('should contain a test', done => {
    done();
  });
});

// describe('currentUser module should create user', () => {
//   const test = sagaHelper(createCurrentUserWorker(createCurrentUser(payload)));
//   test('execute request', result => {
//     expect(result).toMatchSnapshot();
//     return { success: true };
//   });
// });

// describe('currentUser module should request user', () => {
//   const test = sagaHelper(requestCurrentUserWorker(requestCurrentUser()));
//   test('execute request', result => {
//     expect(result).toMatchSnapshot();
//   });
// });

// describe('currentUser module should update user', () => {
//   const test = sagaHelper(updateCurrentUserWorker(updateCurrentUser(payload)));
//   test('execute request', result => {
//     expect(result).toMatchSnapshot();
//   });
// });

// describe('currentUser module should delete user', () => {
//   const test = sagaHelper(deleteCurrentUserWorker(deleteCurrentUser()));
//   test('execute request', result => {
//     expect(result).toMatchSnapshot();
//     return { success: true };
//   });
// });
