// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// Import userProfile schema
import user from "./user";
import store from "./store";
import paymentMethod from "./paymentMethod";
import bankAccount from "./bankAccount";
import sale from "./sale";
import product from "./product";
import client from "./client";
import origin from "./origin";
import sequenceNumbers from "./sequenceNumbers";
import goal from "./goal";
import StreetDailyReport from "./StreetDailyReport";
import bonus from "./bonus";
import faqPost from "./faqPost";
import managerReport from "./managerReport";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    sequenceNumbers,
    user,
    store,
    bankAccount,
    paymentMethod,
    product,
    origin,
    client,
    goal,
    sale,
    bonus,
    StreetDailyReport,
    faqPost,
    managerReport
  ]),
});
