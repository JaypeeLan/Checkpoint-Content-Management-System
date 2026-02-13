jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const { query } = require('../src/config/database');
const { createComment } = require('../src/controllers/commentController');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('createComment controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 422 for invalid post_id', async () => {
    const req = { body: { post_id: 'abc', content: 'hello' } };
    const res = mockRes();
    const next = jest.fn();

    await createComment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 404 if post does not exist', async () => {
    query.mockResolvedValueOnce({ rows: [] });

    const req = { body: { post_id: 999, content: 'hello' } };
    const res = mockRes();
    const next = jest.fn();

    await createComment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Post not found' }));
  });

  it('creates comment for valid post', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ post_id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ comment_id: 1, post_id: 1, content: 'ok' }] });

    const req = { body: { post_id: 1, content: 'ok' } };
    const res = mockRes();
    const next = jest.fn();

    await createComment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(next).not.toHaveBeenCalled();
  });
});