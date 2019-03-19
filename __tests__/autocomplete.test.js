/* eslint-disable no-undef */
const AutoComplete = require('../index');

test('empty tree contains no children', () => {
  const trie = new AutoComplete();

  expect(trie.root.children).toEqual([]);
});

test('add method works', () => {
  const trie = new AutoComplete();
  trie.add('hello');

  // Root should have one child
  expect(trie.root.children.length).toBe(1);

  // First child should be 'h', etc.
  expect(trie.root.children[0].char).toBe('h');
  expect(trie.root.children[0].children[0].char).toBe('e');

  // Last child should be a valid word endpoint
  expect(
    trie.root.children[0].children[0].children[0].children[0].children[0]
      .validWord,
  ).toBe(true);

  trie.add('hi');

  expect(trie.root.children.length).toBe(1);
  expect(trie.root.children[0].children.length).toBe(2);
  expect(trie.root.children[0].children[1].char).toBe('i');
  expect(trie.root.children[0].children[1].validWord).toBe(true);

  trie.add('hel');

  expect(trie.root.children[0].children[0].children.length).toBe(1);
  expect(trie.root.children[0].children[0].children[0].validWord).toBe(true);

  trie.add('cat');
  expect(trie.root.children.length).toBe(2);
  expect(trie.root.children[1].char).toBe('c');
});

test('contains method works', () => {
  const trie = new AutoComplete();

  expect(trie.contains('')).toBe(false);

  expect(trie.contains('hello')).toBe(false);

  trie.add('hello');

  expect(trie.contains('hello')).toBe(true);
  expect(trie.contains('hel')).toBe(false);

  trie.add('hel');
  expect(trie.contains('hel')).toBe(true);
  expect(trie.contains('hi')).toBe(false);

  trie.add('hi');
  expect(trie.contains('hi')).toBe(true);
  expect(trie.contains('cat')).toBe(false);

  trie.add('cat');
  expect(trie.contains('cat')).toBe(true);
});

test('delete method works', () => {
  const trie = new AutoComplete();

  trie.add('hi');
  expect(trie.contains('hi')).toBe(true);

  trie.delete('hi');
  expect(trie.contains('hi')).toBe(false);

  trie.add('hi');
  trie.add('hello');
  trie.add('help');
  trie.add('cat');
  expect(trie.contains('hi')).toBe(true);
  expect(trie.contains('hello')).toBe(true);
  expect(trie.contains('help')).toBe(true);
  expect(trie.contains('cat')).toBe(true);

  trie.delete('hi');
  expect(trie.contains('hi')).toBe(false);
  expect(trie.contains('hello')).toBe(true);
  expect(trie.contains('help')).toBe(true);
  expect(trie.contains('cat')).toBe(true);

  trie.delete('help');
  expect(trie.contains('help')).toBe(false);
  expect(trie.contains('hello')).toBe(true);
  expect(trie.contains('cat')).toBe(true);

  trie.delete('hello');
  expect(trie.contains('hello')).toBe(false);
  expect(trie.contains('cat')).toBe(true);

  trie.delete('cat');
  expect(trie.contains('cat')).toBe(false);

  trie.add('test');
  trie.delete('');
  expect(trie.contains('test')).toBe(true);
});

test('suggest method works', () => {
  const trie = new AutoComplete();

  trie.add('hello');
  trie.add('help');
  trie.add('cat');
  trie.add('helium');
  trie.add('can');
  trie.add('test');
  trie.add('crap');

  expect(trie.suggest('hel')).toEqual(['hello', 'help', 'helium']);
  expect(trie.suggest('ca')).toEqual(['cat', 'can']);
  expect(trie.suggest('c')).toEqual(['cat', 'can', 'crap']);
  expect(trie.suggest('t')).toEqual(['test']);
  expect(trie.suggest('f')).toEqual([]);
  expect(trie.suggest('hex')).toEqual([]);

  trie.add('hexagon');
  trie.add('hex');

  expect(trie.suggest('he')).toEqual([
    'hello',
    'help',
    'helium',
    'hex',
    'hexagon',
  ]);
  expect(trie.suggest('hex')).toEqual(['hex', 'hexagon']);
});
