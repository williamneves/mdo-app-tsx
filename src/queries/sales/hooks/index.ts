import { dbClient } from "src/configs/sanityConfig";

// Create the sale number
const getSaleNumberAndLastSaleNumber = `*[_id=="8a7d451e-193d-4ebc-92c1-40dfc7725ed8"]{
  saleNumber,
  "lastSaleNumber": *[_type=="sale"] | order(_createdAt desc)[0]{
  saleNumber,
}
}`;

const lastSalesNumbers = async () => {
  const data = await dbClient.fetch(getSaleNumberAndLastSaleNumber);
  return {
    actualSaleNumber: data[0].saleNumber,
    lastSaleNumber: data[0].lastSaleNumber.saleNumber
  };
};

export const getSaleNumber = async (): Promise<number> => {
  // Create New Promise
  return new Promise(async (resolve, reject) => {
    const { actualSaleNumber, lastSaleNumber } = await lastSalesNumbers();
    if (actualSaleNumber === lastSaleNumber) {
      // Increment the sale number by 1 and return it
      dbClient
        .patch("8a7d451e-193d-4ebc-92c1-40dfc7725ed8")
        .inc({ saleNumber: 1 })
        .commit()
        .then((res) => {
          resolve(res.saleNumber);
        })
        .catch((err) => {
          reject(err);
        });
    }
    if (actualSaleNumber < lastSaleNumber) {
      // Set the sale number to the last sale number + 1 and return it
      dbClient
        .patch("8a7d451e-193d-4ebc-92c1-40dfc7725ed8")
        .set({ saleNumber: lastSaleNumber + 1 })
        .commit()
        .then((res) => {
          return res.saleNumber;
        })
        .catch((err) => {
          throw err;
        });
    }

    // If the sale number is greater than the last sale number, return the actual sale number
    resolve(actualSaleNumber);
  });
};