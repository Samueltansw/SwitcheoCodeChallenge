const token1Options = document.querySelector("#token1");
const token2Options = document.querySelector("#token2");
const btn = document.querySelector("button");
const inputAmount = document.querySelector("#input-amount");
const outputAmount = document.querySelector("#output-amount");
const conversionRate = document.querySelector("#conversion-rate");

const jsonUrl = "https://interview.switcheo.com/prices.json";

async function getJson() {
  const res = await fetch(jsonUrl);
  const tokenListObjs = await res.json();
  return tokenListObjs;
}

const populateTokenDropdown = async () => {
  const tokenListObjs = await getJson();
  const tokenList = [];
  for (let obj of tokenListObjs) {
    tokenList.push(obj.currency);
  }

  tokenList.map((token) => {
    const opt = document.createElement("option");
    const opt2 = document.createElement("option");
    opt.innerText = token;
    opt2.innerText = token;
    token1Options.appendChild(opt);
    token2Options.appendChild(opt2);
  });
};
populateTokenDropdown();

const getTokenPrices = async () => {
  const token1 = token1Options.options[token1Options.selectedIndex].text;
  const token2 = token2Options.options[token2Options.selectedIndex].text;
  const tokenListObjs = await getJson();

  const [tokenObj1] = tokenListObjs.filter((obj) => {
    return obj.currency == token1;
  });
  const [tokenObj2] = tokenListObjs.filter((obj) => {
    return obj.currency == token2;
  });

  return {
    token1: { name: token1, price: tokenObj1.price },
    token2: { name: token2, price: tokenObj2.price }
  };
};

const onChangeSelect = async () => {
  const tokenPrices = await getTokenPrices();
  const token1Price = tokenPrices.token1.price;
  const token2Price = tokenPrices.token2.price;
  const rate = token1Price / token2Price;
  conversionRate.innerText = `1 ${tokenPrices.token1.name} = ${rate} ${tokenPrices.token2.name}`;
};

token1Options.addEventListener("change", onChangeSelect);
token2Options.addEventListener("change", onChangeSelect);

btn.addEventListener("click", async () => {
  const tokenPrices = await getTokenPrices();

  const token1Price = tokenPrices.token1.price;
  const token2Price = tokenPrices.token2.price;

  const multiplier = token1Price / token2Price;

  console.log(multiplier);
  console.log(inputAmount.value);

  const inputTokenAmount = inputAmount.value;
  const outputTokenAmount = multiplier * inputTokenAmount;
  outputAmount.value = outputTokenAmount;
  console.log(token1Price);
  console.log(token2Price);
});
