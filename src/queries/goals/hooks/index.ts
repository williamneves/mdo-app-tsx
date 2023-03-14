import {dbClient} from "src/configs/sanityConfig"
import Goal from "src/interfaces/Goal"
import groq from "groq"

const activeAndNotDraf = `
&& !(_id in path("drafts.**")) 
&& inactive != true
&& deleted != true
`

const allGoalsGROQ = groq`
  *[_type == "goal" ${activeAndNotDraf}]
  {
    ...,
    targetStores[]->{
      _id,
      inactive,
      name,
      taxID,
      imageURL,
      address
    },
  }`

const goalsByStoreGROQ = groq`
  *[_type == "goal" && $storeId in targetStores[]->_id] {
    ...,
    targetStores[]->{
      _id,
      inactive,
      name,
      taxID,
      imageURL,
      address,
    },
  }`

const mainGoalsByStoreGROQ = groq`
*[_type == "goal" 
&& $storeId in targetStores[]->_id
&& mainStoreGoal == true
&& goalRange.dateStart <= $dateStart
&& goalRange.dateEnd >= $dateEnd
] {
  ...,
  targetStores[]->{
    _id,
    inactive,
    name,
    taxID,
    imageURL,
    address,
  },
}`

const goalById = groq`
  *[_type == "goal" && _id == $id] {
    ...,
    targetStores[]->{
      _id,
      inactive,
      name,
      taxID,
      imageURL,
      address,
    },
  }[0]`

// ** Hooks **
// * All Goals
export const getAllGoals = async () => {
  try {
    return dbClient.fetch<Goal[]>(allGoalsGROQ)
  } catch (error) {
    throw error
  }
}

// * Goals by Store
export const getGoalsByStore = async (storeId: string) => {
  try {
    return dbClient.fetch<Goal[]>(goalsByStoreGROQ, {storeId})
  } catch (error) {
    throw error
  }
}

// * Main Goals by Store
export const getMainGoalsByStore = async (
  storeId: string,
  dateStart: string,
  dateEnd: string
) => {
  console.log(
    "🚀 ~ file: index.ts ~ line 97 ~ getMainGoalsByStore ~ mainGoalsByStoreGROQ, { storeId, dateStart, dateEnd }",
    mainGoalsByStoreGROQ,
    {storeId, dateStart, dateEnd}
  )

  try {
    return dbClient.fetch<Goal[]>(mainGoalsByStoreGROQ, {
      storeId,
      dateStart,
      dateEnd
    })
  } catch (error) {
    throw error
  }
}

// * Get one Goal by ID
export const getGoalById = async (id: string) => {
  try {
    return dbClient.fetch<Goal>(goalById, {id})
  } catch (error) {
    throw error
  }
}

// * Create Goal
export const createGoal = async (goal: Goal): Promise<Goal> => {
  // Create Goal Object
  const goalObject = {
    _type: "goal",
    ...goal
  }

  try {
    return dbClient.create(goalObject)
  } catch (e) {
    throw e
  }
}

// * Update Goal
export const updateGoal = async (
  id: string,
  updatedData: Partial<Goal>
): Promise<Goal> => {
  try {
    return dbClient.patch(id).set(updatedData).commit()
  } catch (e) {
    throw e
  }
}
