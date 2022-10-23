import { dbClient } from "src/configs/sanityConfig";
import AuthUser from "src/interfaces/authUser";


// ** Get User by AuthID **
export const Q_userByAuthUID = `
 *[
    _type == 'user' 
    && authUID==$authUID 
    && !(_id in path('drafts.**'))
  ]
  {
    _id,
    inactive,
    authUID,
    provider,
    name,
    email,
    imageURL,
    imageAsset,
    role,
    "stores":*[
      _type == 'store' 
      && references(^._id) 
      && inactive != true
      && !(_id in path('drafts.**'))
    ]
      {
        _id,
        name,
        employees[]->{
          _id,
          name,
          email,
          profile,
          imageURL,
          imageAsset,
          role,
          _createdAt,
          _updatedAt,
        },
        managers[]->{
          _id,
          name,
          email,
          profile,
          imageURL,
          imageAsset,
          role,
          _createdAt,
          _updatedAt,
        },
      _createdAt,
      _updatedAt,
        },
      profile,
      address,
      bankAccount,
      _createdAt,
      _updatedAt,
      }
      `;

// ** Get authUser by UID **
const fetchUserDB = async (authUID: string): Promise<AuthUser> => {
  try{
    // Fetch user from Sanity
    const user = await dbClient.fetch(Q_userByAuthUID, { authUID })
    // Return user
    return user[0]
  }
  catch(error){
    console.log(error)
    throw(error)
  }
};

export default fetchUserDB;