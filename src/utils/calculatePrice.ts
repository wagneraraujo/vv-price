import { getVolumeDiscount, SECTOR_PRICE, TURNOVER_MULT } from "./dataPrice";

const calculatePrice = (
  sector: string,
  turnover: string,
  leadcount: number,
) => {
  const basePrice = SECTOR_PRICE[sector];
  const turnoverMultiplayer = TURNOVER_MULT[turnover] || 0;
  const volumeDiscount = getVolumeDiscount(leadcount);

  const priceAfterTurnover = basePrice * turnoverMultiplayer;
  const finalPricePerLead = priceAfterTurnover * (1 - volumeDiscount);
  const totalPrice = finalPricePerLead * leadcount;

  return {
    totalPrice,
    priceAfterTurnover,
    finalPricePerLead,
    basePrice,
    volumeDiscount,
  };
};

export default calculatePrice;
