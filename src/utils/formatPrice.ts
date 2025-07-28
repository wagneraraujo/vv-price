const formatPrice = (value: number) => {
  const numvalue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numvalue)) {
    return "0,00";
  }

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(numvalue);
};

export default formatPrice;
