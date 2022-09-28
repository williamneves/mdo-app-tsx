import { dbClient } from "src/configs/sanityConfig";
import Product from "src/interfaces/Product";

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

// Handle the sale number creation
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
          resolve(res.saleNumber);
        })
        .catch((err) => {
          reject(err);
        });
    }

    // If the sale number is greater than the last sale number, return the actual sale number
    resolve(actualSaleNumber);
  });
};

// Validate the P.D.V. number
export const validatePDVNumber = async (PDVNumber: any): Promise<boolean> => {

  const intPDVNumber = parseInt(PDVNumber);

  try {
    const data = await dbClient.fetch(
      `count(*[_type=="sale" && PDVNumber==${intPDVNumber}])`
    );
    return data === 0;
  } catch (err) {
    return false;
  }
};

// Get All Products By Reference (Store)
const allProductsByReferenceQuery = `
*[
  _type == "product" 
  && references($storeRef)
  && inactive != true
  && !(_id in path("drafts.**"))
]{
  ...,
  inactive,
  title,
  description,
  sku,
  category,
  store,
}`;


export const getAllProductsByReference = async (referenceID: string): Promise<Product[]> => {
  try {
    const data = await dbClient.fetch(allProductsByReferenceQuery, {
      storeRef: referenceID as string
    });
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};


// Get All Products By Reference (Store)
const allPaymentMethodByReferenceQuery = `
*[
  _type == "paymentMethod" 
  && references($storeRef)
  && inactive != true
  && !(_id in path("drafts.**"))
]{
  ...,
  inactive,
  title,
  description,
  sku,
  category,
  store,
}`;


export const getAllPaymentMethodByReference = async (referenceID: string): Promise<Product[]> => {
  try {
    const data = await dbClient.fetch(allPaymentMethodByReferenceQuery, {
      storeRef: referenceID as string
    });
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};