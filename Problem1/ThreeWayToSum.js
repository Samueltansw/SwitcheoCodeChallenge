const sum_to_n_a = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

const sum_to_n_b = (n) => {
  let sum = 0;
  while (n--) {
    sum += n + 1;
  }

  return sum;
};

const sum_to_n_c = (n) => {
  if (n <= 0) return 0;

  return n + sum_to_n_c(n - 1);
};
