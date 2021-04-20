import Api from '../score/API';
import 'regenerator-runtime';

beforeEach(() => {
  fetch.resetMocks();
});

it('Return score', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    result: [
      {
        user: 'John Doe',
        score: 42,
      }],
  }));
  const res = await Api.getScores();
  expect(res[0].score).toEqual(42);
  expect(fetch.mock.calls.length).toEqual(1);
});

it('Return name', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    result: [
      {
        user: 'John Doe',
        score: 42,
      }],
  }));
  const res = await Api.getScores();
  expect(res[0].user).toEqual('John Doe');
  expect(fetch.mock.calls.length).toEqual(1);
});

it('fails due to incorrect score', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    result: [
      {
        user: 'John Doe',
        score: 42,
      }],
  }));
  const res = await Api.getScores();
  expect(res[0].score).not.toEqual(13);
  expect(fetch.mock.calls.length).toEqual(1);
});
it('fails due to incorrect username', async () => {
  fetch.mockResponseOnce(JSON.stringify({
    result: [
      {
        user: 'John Doe',
        score: 42,
      }],
  }));
  const res = await Api.getScores();
  expect(res[0].user).not.toEqual('Neko Master');
  expect(fetch.mock.calls.length).toEqual(1);
});
