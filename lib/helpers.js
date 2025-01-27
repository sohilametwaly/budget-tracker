import { Currencies } from "./Currencies";

export function DatetoUtcDate(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

export function GetFormatterForCurrency(currency) {
  const locale = Currencies.find((c) => c.value == currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
