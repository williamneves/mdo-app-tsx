import { dbClient } from "src/configs/sanityConfig";
import IBonus from "interfaces/Bonus";
import User from "interfaces/User";
import Goal from "interfaces/Goal";
import Store from "interfaces/Store";
import groq from "groq";

import moment from "moment";

const activeAndNotDraf = `
&& !(_id in path("drafts.**")) 
&& inactive != true
&& deleted != true
`

const allBonusGROQ = groq`
  *[_type == "bonus" ${activeAndNotDraf}]{
    ...,
    goal->,
    user->,
    store->,
    }`

const bonusByReferenceIdGROQ =  groq`
  *[_type == "bonus"
  && references($referenceId)
  ${activeAndNotDraf}]{
    ...,
    goal->,
    user->,
    store->,
    }`

// ** Get all Bonus
export const getAllBonus = async (): Promise<IBonus[]> => {
  try{
    return await dbClient.fetch(allBonusGROQ)
  }
  catch(err){
    throw err
  }
}

// ** Get Bonus by referenceId
export const getBonusByReferenceId = async (referenceId: string): Promise<IBonus[]> => {
  try{
    return await dbClient.fetch(bonusByReferenceIdGROQ, {referenceId: referenceId})
  }
  catch(err){
    throw err
  }
}

// ** Create Bonus
export const createBonus = async (bonus: IBonus): Promise<IBonus> => {

  // ** Create Bonus
  const newBonus = {
    ...bonus,
    _type: "bonus",
    bonusRange: {
      dateStart: moment(bonus.bonusRange.dateStart).format('YYYY-MM-DD'),
      dateEnd: moment(bonus.bonusRange.dateEnd).format('YYYY-MM-DD'),
    },
    user: {
      _type: "reference",
      _ref: (bonus.user as User)._id
    },
    goal: {
      _type: "reference",
      _ref: (bonus.goal as Goal)._id
    },
    store: {
      _type: "reference",
      _ref: (bonus.store as Store)._id
    }
  }
  console.log('newBonus', newBonus)

  try{
    bonus._type = "bonus"
    return await dbClient.create(newBonus as any, {autoGenerateArrayKeys: true})
  }
  catch(err){
    throw err
  }
}

// ** Update All Bonus
export const updateAllBonus = async (bonus: IBonus): Promise<IBonus> => {

  // ** Create Bonus
  const newBonus = {
    ...bonus,
    bonusRange: {
      dateStart: moment(bonus.bonusRange.dateStart).format('YYYY-MM-DD'),
      dateEnd: moment(bonus.bonusRange.dateEnd).format('YYYY-MM-DD'),
    },
    user: {
      _type: "reference",
      _ref: (bonus.user as User)._id
    },
    goal: {
      _type: "reference",
      _ref: (bonus.goal as Goal)._id
    },
    store: {
      _type: "reference",
      _ref: (bonus.store as Store)._id
    }
  }

  try{
    return await dbClient.patch(bonus._id as string).set(newBonus).commit({autoGenerateArrayKeys: true})
  }
  catch(err){
    throw err
  }
}

// ** Update Bonus fields
export const updateBonusFields = async (bonusId: string, bonus: Partial<IBonus>): Promise<IBonus> => {
  try{
    return await dbClient.patch(bonusId).set(bonus).commit()
  }
  catch(err){
    throw err
  }
}

// ** Delete Bonus
export const deleteBonus = async (bonusId: string): Promise<IBonus> => {
  try{
    return await dbClient.delete(bonusId)
  }
  catch(err){
    throw err
  }
}