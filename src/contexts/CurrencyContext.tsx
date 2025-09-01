import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Currency interface
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  position: "before" | "after";
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

// Available currencies
export const AVAILABLE_CURRENCIES: Currency[] = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
    symbol: "₵",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: " ",
    decimalSeparator: ".",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    position: "before",
    decimalPlaces: 0,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    position: "before",
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  },
];

// Context interface
interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number, showSymbol?: boolean) => string;
  parseCurrency: (value: string) => number;
  getCurrencyByCode: (code: string) => Currency | undefined;
  availableCurrencies: Currency[];
}

// Create context
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Hook to use currency context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Provider props
interface CurrencyProviderProps {
  children: ReactNode;
}

// Provider component
export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  // Get default currency from localStorage or use USD
  const getDefaultCurrency = (): Currency => {
    const savedCurrencyCode = localStorage.getItem("preferredCurrency");
    if (savedCurrencyCode) {
      const savedCurrency = AVAILABLE_CURRENCIES.find(
        (c) => c.code === savedCurrencyCode
      );
      if (savedCurrency) {
        return savedCurrency;
      }
    }
    return AVAILABLE_CURRENCIES[0]; // USD as default
  };

  const [currency, setCurrencyState] = useState<Currency>(getDefaultCurrency);

  // Update currency and save to localStorage
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferredCurrency", newCurrency.code);
  };

  // Format currency amount
  const formatCurrency = (
    amount: number,
    showSymbol: boolean = true
  ): string => {
    const {
      symbol,
      position,
      decimalPlaces,
      thousandsSeparator,
      decimalSeparator,
    } = currency;

    // Format the number
    const formattedNumber = amount.toLocaleString("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    // Replace separators according to currency settings
    let formatted = formattedNumber
      .replace(/,/g, thousandsSeparator)
      .replace(/\./g, decimalSeparator);

    // Add symbol if requested
    if (showSymbol) {
      if (position === "before") {
        formatted = `${symbol}${formatted}`;
      } else {
        formatted = `${formatted}${symbol}`;
      }
    }

    return formatted;
  };

  // Parse currency string to number
  const parseCurrency = (value: string): number => {
    const { thousandsSeparator, decimalSeparator } = currency;

    // Remove symbol and clean the string
    let cleaned = value.replace(/[^\d.,]/g, "");

    // Replace separators with standard ones
    cleaned = cleaned
      .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
      .replace(new RegExp(`\\${decimalSeparator}`, "g"), ".");

    return parseFloat(cleaned) || 0;
  };

  // Get currency by code
  const getCurrencyByCode = (code: string): Currency | undefined => {
    return AVAILABLE_CURRENCIES.find((c) => c.code === code);
  };

  // Context value
  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatCurrency,
    parseCurrency,
    getCurrencyByCode,
    availableCurrencies: AVAILABLE_CURRENCIES,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
