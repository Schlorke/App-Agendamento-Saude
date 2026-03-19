/**
 * Mock AsyncStorage para Jest (v3 não inclui jest/async-storage-mock).
 * API compatível com getItem, setItem, removeItem, etc.
 */
const store = new Map();

const mock = {
  getItem: jest.fn((key) => Promise.resolve(store.get(key) ?? null)),
  setItem: jest.fn((key, value) => {
    store.set(key, String(value));
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    store.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    store.clear();
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve([...store.keys()])),
  multiGet: jest.fn((keys) =>
    Promise.resolve(keys.map((key) => [key, store.get(key) ?? null]))
  ),
  multiSet: jest.fn((pairs) => {
    pairs.forEach(([key, value]) => store.set(key, String(value)));
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach((key) => store.delete(key));
    return Promise.resolve();
  }),
};
module.exports = mock;
module.exports.default = mock;
