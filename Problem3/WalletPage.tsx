/*
Computational Inefficiencies and Anti-patterns

1. The dependency array of 'useMemo' includes 'prices', but the logic within 'useMemo' does not use 'prices'. This could lead to unnecessary re-computations.

2. It is unnecessary to map "sortedBalances" to get "formattedBalances" since it is not used anywhere else. the map function can be done right after the filter and sort methods.

3. (lshPriority > -99) seems to be a type. It should be (balancePriority > -99) instead. And the condition 'return true' when balances with "amount <= 0" should be "amount >= 0" instead since balance amount should be positive.

4. "console.err()" is not a proper function, it should be "console.error()" instead.

5. Using "index" as key "key={index}" may not be recommended because if there are multiple rows component, it may lead to duplicated keys for <WalletRow />. A better way might be to use uuid(). 
*/

import { v4 as uuid } from "uuid";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<{}> {
    const res = await fetch(this.url);
    const prices = await res.json();
    return prices;
  }
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99 && balance.amount >= 0) {
          return true;
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      })
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(2)
        };
      });
  }, [balances, prices]);

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={uuid()}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
