import { dbClient } from "src/configs/sanityConfig";
import AuthUser from "src/interfaces/authUser";

// ** Get User by AuthID **
const Q_userByAuthUID = `
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
      "stores":*[_type == 'store' && references(^._id)]
        {
          _id,
          name
        },
      profile,
      address,
      bankAccount
      }`

// ** Get authUser by UID **
const fetchUserDB = async (authUID: string) :Promise<AuthUser> => {
  const user = await dbClient.fetch(Q_userByAuthUID, { authUID })
  return user[0]
}

export default fetchUserDB