function sum(a, b) {
  return a + b;
}

test('sum 1 + 2 to be equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
