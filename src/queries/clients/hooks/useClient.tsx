import { dbClient } from "src/configs/sanityConfig";
import Client from "src/interfaces/Client";
import moment from "moment";

const queryAllClients = `
  *[
    _type == "client"
    && inactive != true
    && !(_id in path('drafts.**'))
  ]{
      _id,
      _createdAt,
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
      _createdAt,
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

// Check if CPF is Unique at Sanity
export const cpfIsUnique = async (cpf: number):Promise<boolean> => {
  try{
    const result = await dbClient.fetch(`count(*[cpf=="${cpf}"])`)
    console.log(result)
    return result === 0;
  }
  catch(error){
    throw error
  }
};

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

  async function getNewClientNumber():Promise<number> {
    const data = await increaseClientCode();
    console.log('number',data);
    return data.clientNumber;
  }

  let clientObject = {
    _type: "client",
    createdAt: moment().format("YYYY-MM-DD"),
    clientNumber: client.clientNumber || null,
    inactive: (client.inactive && client.inactive) || false,
    name: client.name, // required
    phone: (client.phone && client.phone) || "",
    email: (client.email && client.email) || "",
    birthday: client.birthday ? moment(client.birthday).format("YYYY-MM-DD") : null,
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
    // Increment client number
    const { clientNumber } = await increaseClientCode();
    clientObject.clientNumber = clientNumber;
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
    birthday: client.birthday ? moment(client.birthday).format("YYYY-MM-DD") : null,
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

export const deleteClient = async (clientID: string) => {
  try {
    const response = await dbClient.delete(clientID);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClientById = async (clientID: string) => {
  const q = `
  *[
    _type == "client"
    && _id == "${clientID}"
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

  try {
    return await dbClient.fetch(q);
  } catch (error) {
    throw error;
  }
};