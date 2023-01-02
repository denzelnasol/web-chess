export const operatorOperations = {
  '+': function (x, y) {
    return x + y;
  },
  '-': function (x, y) {
    return x - y;
  },
  '*': function (x, y) {
    return x * y;
  }
};

export const Operator =
  Object.freeze({
    ADDITION: '+',
    SUBTRACTION: '-',
    MULTIPLICATION: '*',
  });