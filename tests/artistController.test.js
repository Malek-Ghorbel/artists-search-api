const request = require('supertest');
const server = require('../src/index'); 

// Unmock the artistService to use the real service
jest.unmock('../src/services/artistService');

afterAll(() => {
  // Stop the server after all tests have finished
  server.close();
});

describe('Artist endpoints tests', () => {
  it('should respond with artist data', async () => {
    const response = await request(server).get('/artist?artist=Coldplay');
    expect(response.status).toBe(200);
    expect(response.body.artistData).toBeDefined();
    expect(response.body.artistData.length).toBeGreaterThan(0);
  });

  it('should handle missing artist parameter', async () => {
    const response = await request(server).get('/artist');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Artist name is required');
  });

  it('should return random artists if no one is found', async () => {
    const response = await request(server).get('/artist?artist=azertyuiop');
    expect(response.status).toBe(200);
    expect(response.body.artistData).toBeDefined();
  });

  it('should handle missing filename parameter for CSV download', async () => {
    const response = await request(server).get('/artist/download?artist=Coldplay');
    expect(response.status).toBe(200);
    expect(response.headers['content-disposition']).toContain('attachment; filename="artists.csv"');
  });

  it('should use provided filename for CSV download', async () => {
    const response = await request(server).get('/artist/download?artist=Coldplay&filename=myfile.csv');
    expect(response.status).toBe(200);
    expect(response.headers['content-disposition']).toContain('attachment; filename="myfile.csv"');
  });

});
