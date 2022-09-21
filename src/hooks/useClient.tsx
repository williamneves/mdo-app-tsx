import { dbClient } from "../configs/sanityConfig";
import Client from "src/interfaces/Client";

interface useClientReturn {
  getAllClients: () => Promise<Client[] | unknown>;
}

export default function useClient(): useClientReturn {
  return {
    getAllClients
  };
};

const getAllClients = async (): Promise<Client[] | unknown> => {
  const q = `
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

  try {
    const data = await dbClient.fetch(q);
    return data;
  } catch (e) {
    console.log(e);
    return {
      error: e
    };
  }
};