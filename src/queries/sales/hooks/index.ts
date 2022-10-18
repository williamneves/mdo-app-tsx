import { dbClient } from "src/configs/sanityConfig";
import Product from "src/interfaces/Product";
import Origin from "src/interfaces/Origin";
import Sale from "src/interfaces/Sale";
import moment from "moment";

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
    // Check if the last sale number is the same as the actual sale number
    if (actualSaleNumber === lastSaleNumber) {
      // Increment the sale number by 1 and return it
      dbClient
        .patch("8a7d451e-193d-4ebc-92c1-40dfc7725ed8")
        .inc({ saleNumber: 1 })
        .commit()
        .then((res) => {
          console.log("Sale number updated");
          console.log(res.saleNumber);
          return resolve(res.saleNumber);
        })
        .catch((err) => {
          return reject(err);
        });
    }

    // If the last sale number is not the same as the actual sale number
    if (actualSaleNumber < lastSaleNumber) {
      // Set the sale number to the last sale number + 1 and return it
      dbClient
        .patch("8a7d451e-193d-4ebc-92c1-40dfc7725ed8")
        .set({ saleNumber: lastSaleNumber + 1 })
        .commit()
        .then((res) => {
          return resolve(res.saleNumber);
        })
        .catch((err) => {
          return reject(err);
        });
    }

    // If the sale number is greater than the last sale number, return the actual sale number
    if (actualSaleNumber > lastSaleNumber) {
      return resolve(actualSaleNumber);
    }
  });
};

// Validate the P.D.V. number
export const validatePDVNumber = async (PDVNumber: any): Promise<boolean> => {

  // const intPDVNumber = parseInt(PDVNumber);
  try {
    const data = await dbClient.fetch(
      `count(
      *[
      _type=="sale" 
      && PDVNumber=="${PDVNumber.toUpperCase()}" 
      && canceled!=true
      && excluded!=true
      ])`
    );
    console.log(data);
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
    return data;
  } catch (err) {
    throw err;
  }
};

const getAllOriginQ = `
 *[
    _type == "origin"
    && !(_id in path('drafts.**'))
  ]{
    _id,
    name,
    displayName,
  }
  `;

export const getAllOrigin = async (): Promise<Origin[]> => {
  try {
    return dbClient.fetch(getAllOriginQ);
  } catch (err) {
    throw err;
  }
};

// Prepare OriginsObject for sale
const prepareOriginsObject = (origins: any) => {
  const originsObject: any = [];
  origins.forEach((origin: any, index: number) => {
    originsObject.push({
      _ref: origin._id,
      _type: "reference",
      _key: `0${index}`
    });
  });
  return originsObject;
};

// Prepare ProductsObject for sale
const prepareProductsObject = (products: any) => {
  const productsObject: any = [];
  products.forEach((product: any, index: number) => {
    productsObject.push({
      _key: `0${index}`,
      product: {
        _ref: product.product._id,
        _type: "reference"
      },
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      discount: parseFloat(product.discount),
      cost: parseFloat(product.cost)
    });
  });
  return productsObject;
};

// Prepare PaymentsObject for sale
const preparePaymentsObject = (payments: any) => {
  const paymentsObject: any = [];
  payments.forEach((payment: any, index: number) => {
    paymentsObject.push({
      _key: `${index}`,
      paymentMethod: {
        _ref: payment.paymentMethod._id,
        _type: "reference"
      },
      paymentAmount: parseFloat(payment.paymentAmount),
      splitQuantity: parseInt(payment.splitQuantity)
    });
  });
  return paymentsObject;
};

// Get one sale by ID
const getOneSaleByIdQ = `
*[_type=="sale" && _id==$saleID]{
  ...,
  "origin": userReferrer[]->,
  userReferrer[]->,
  user->,
  "vendor": user->,
  client->,
  store->,
  paymentMethod->,
  salePayments[]{
    ...,
    paymentMethod->,
    },
  products[] {
    ...,
    product->,
  }
  }[0]
`;

export const getOneSaleById = async (id: string): Promise<Sale> => {
  try {
    return dbClient.fetch(getOneSaleByIdQ, { saleID: id });
  } catch (err) {
    throw err;
  }
};

// Get Sales By Store by Date Range
const getSalesByReferenceByDateRangeQ = `
*[_type=="sale" 
&& references($storeRef) 
&& canceled!=true 
&& excluded!=true 
&& date >= $startDate 
&& date <= $endDate
]{
  ...,
  "origin": userReferrer[]->,
  userReferrer[]->,
  user->,
  "vendor": user->,
  client->,
  store->,
  paymentMethod->,
  salePayments[]{
    ...,
    paymentMethod->,
    },
  products[] {
    ...,
    product->,
  }
  }
  `;

export const getSalesByReferenceByDateRange = async (
  storeRef: string,
  { startDate, endDate }: { startDate: string; endDate: string }
): Promise<Sale[]> => {
  console.log(startDate, endDate, storeRef);
  try {
    return dbClient.fetch(getSalesByReferenceByDateRangeQ, {
      storeRef: storeRef,
      startDate: startDate,
      endDate: endDate
    });
  } catch (err) {
    throw err;
  }
}

// Create a new sale
export const createSale = async (sale: Sale): Promise<Sale> => {

  const saleObject = {
    _type: "sale",
    saleNumber: sale.saleNumber,
    PDVNumber: sale.PDVNumber,
    auditStatus: sale.auditStatus || "pending",
    date: moment(sale.date).format("YYYY-MM-DD"),
    client: {
      _ref: sale.client._id,
      _type: "reference"
    },
    products: prepareProductsObject(sale.products),
    salePayments: preparePaymentsObject(sale.salePayments),
    saleAmount: sale.saleAmount,
    totalDiscount: sale.totalDiscount,
    totalCost: sale.totalCost,
    totalQuantity: sale.totalQuantity,
    profit: sale.profit,
    markup: sale.markup,
    score: sale.score,
    paymentMethod: {
      _ref: sale.paymentMethod._id,
      _type: "reference"
    },
    splitQuantity: sale.splitQuantity,
    userReferrer: prepareOriginsObject(sale.origin),
    schedule: sale.schedule,
    scheduleDiscount: sale.scheduleDiscount,
    observations: sale.observations,
    user: {
      // @ts-ignore
      _ref: sale.vendor._id,
      _type: "reference"
    },
    store: {
      _ref: sale.store._id,
      _type: "reference"
    }
  };

  try {
    const newSale = await dbClient.create(saleObject);
    // fetch the new sale
    return getOneSaleById(newSale._id);
  } catch (err) {
    throw err;
  }

};

// Create a new sale
export const updateEntireSale = async (sale: Sale): Promise<Sale> => {

  const saleObject = {
    _type: "sale",
    _id: sale._id,
    saleNumber: sale.saleNumber,
    PDVNumber: sale.PDVNumber,
    auditStatus: sale.auditStatus || "pending",
    date: moment(sale.date).format("YYYY-MM-DD"),
    client: {
      _ref: sale.client._id,
      _type: "reference"
    },
    products: prepareProductsObject(sale.products),
    salePayments: preparePaymentsObject(sale.salePayments),
    saleAmount: sale.saleAmount,
    totalDiscount: sale.totalDiscount,
    totalCost: sale.totalCost,
    totalQuantity: sale.totalQuantity,
    profit: sale.profit,
    markup: sale.markup,
    score: sale.score,
    paymentMethod: {
      _ref: sale.paymentMethod._id,
      _type: "reference"
    },
    splitQuantity: sale.splitQuantity,
    userReferrer: prepareOriginsObject(sale.origin),
    schedule: sale.schedule,
    scheduleDiscount: sale.scheduleDiscount,
    observations: sale.observations,
    user: {
      // @ts-ignore
      _ref: sale.vendor._id,
      _type: "reference"
    },
    store: {
      _ref: sale.store._id,
      _type: "reference"
    }
  };

  try {
    const newSale = await dbClient.createOrReplace(saleObject);
    // fetch the new sale
    return getOneSaleById(newSale._id);
  } catch (err) {
    throw err;
  }

};