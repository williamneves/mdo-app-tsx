import { dbClient } from "src/configs/sanityConfig";
import Client from "src/interfaces/Client";

const queryAllClients = `
  *[
    _type == "client"
    && inactive != true
    && !(_id in path('drafts.**'))
  ]{
     _id,
      inactive,
      clientNumber,
      name,
      phone,
      email,
      birthday,
      gender,
      hearAboutUs,
      cpf,
      address {
        street,
        number,
        complement,
        city,
        state,
        zipCode,
      },
    store -> {
    _id,
    inactive,
    name,
    taxID,
    imageURL,
    address {
       street,
       number,
       complement,
       city,
       state,
       zipCode,
    },
  },
    createdBy-> {
        _id,
        name,
        email,
        imageURL,
        imageAsset,
        role,
        profile {
           jobTitle,
           birthDay,
           gender,
           phoneNumbers,
           bio,
        }
    },
  }
  `;

const queryAllClientsByRefenceId = `
  *[
    _type == "client"
    && references($referenceId)
    && inactive != true
    && !(_id in path('drafts.**'))
  ]{
     _id,
      inactive,
      clientNumber,
      name,
      phone,
      email,
      birthday,
      gender,
      hearAboutUs,
      cpf,
      address {
        street,
        number,
        complement,
        city,
        state,
        zipCode,
      },
    store -> {
    _id,
    inactive,
    name,
    taxID,
    imageURL,
    address {
       street,
       number,
       complement,
       city,
       state,
       zipCode,
    },
  },
    createdBy-> {
        _id,
        name,
        email,
        imageURL,
        imageAsset,
        role,
        profile {
           jobTitle,
           birthDay,
           gender,
           phoneNumbers,
           bio,
        }
    },
  }
  `;

export const getAllClients = async (): Promise<Client[]> => {
  try {
    return await dbClient.fetch(queryAllClients);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllClientsByReferenceId = async ({referenceId}: {referenceId: string}): Promise<Client[]> => {
  try {
    return await dbClient.fetch(queryAllClientsByRefenceId, {referenceId});
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const createClient = async (client: Client) => {

  // Validate body fields
  if (!client.name || !client.store._id || !client.createdBy._id)
    throw new Error("Missing required fields");

  let clientObject = {
    _type: "client",
    clientNumber: client.clientNumber || null,
    inactive: (client.inactive && client.inactive) || false,
    name: client.name, // required
    phone: (client.phone && client.phone) || "",
    email: (client.email && client.email) || "",
    birthday: (client.birthday && client.birthday) || "",
    gender: (client.gender && client.gender) || "",
    hearAboutUs: (client.hearAboutUs && client.hearAboutUs) || "",
    cpf: (client.cpf && client.cpf) || "",
    address: {
      street: (client.address?.street && client.address.street) || "",
      number: (client.address?.number && client.address.number) || "",
      complement:
        (client.address?.complement && client.address.complement) || "",
      city: (client.address?.city && client.address.city) || "",
      state: (client.address?.state && client.address.state) || "",
      zipCode: (client.address?.zipCode && client.address.zipCode) || ""
    },
    store: {
      // required
      _type: "reference",
      _ref: client.store._id
    },
    createdBy: {
      // required
      _type: "reference",
      _ref: client.createdBy._id
    }
  };

  try {
    // Create client
    const result = await dbClient.create(clientObject);
    console.log("success", result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const increaseClientCode = async () => {
  try {
    return dbClient
      .patch("8a7d451e-193d-4ebc-92c1-40dfc7725ed8")
      .inc({ clientNumber: 1 })
      .commit();
  } catch (error) {
    throw error;
  }
};

export const updateClient = async (client: Client) => {

  if (!client._id)
    throw new Error("Missing required fields");

  const clientObject = {
    _type: "client",
    clientNumber: client.clientNumber || null,
    inactive: (client.inactive && client.inactive) || false,
    name: client.name, // required
    phone: (client.phone && client.phone) || "",
    email: (client.email && client.email) || "",
    birthday: (client.birthday && client.birthday) || "",
    gender: (client.gender && client.gender) || "",
    hearAboutUs: (client.hearAboutUs && client.hearAboutUs) || "",
    cpf: (client.cpf && client.cpf) || "",
    address: {
      street: (client.address?.street && client.address.street) || "",
      number: (client.address?.number && client.address.number) || "",
      complement:
        (client.address?.complement && client.address.complement) || "",
      city: (client.address?.city && client.address.city) || "",
      state: (client.address?.state && client.address.state) || "",
      zipCode: (client.address?.zipCode && client.address.zipCode) || ""
    },
    store: {
      // required
      _type: "reference",
      _ref: client.store._id
    },
    createdBy: {
      // required
      _type: "reference",
      _ref: client.createdBy._id
    }
  };

  try {
    const result = await dbClient.patch(client._id).set(clientObject).commit();
    return result;
  } catch (error) {
    throw error;
  }
};