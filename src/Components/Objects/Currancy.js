export function formatDollars(number) {
  return "$" + Number(number).toLocaleString("en");
}
