import {dbClient} from "src/configs/sanityConfig"
import FaqPost from "interfaces/FaqPost"

const queryPosts = `*[_type == "faqPost" && !(_id in path("drafts.**"))]`

export const getFAQPosts = (): Promise<FaqPost> => {
  try {
    return dbClient.fetch(queryPosts)
  } catch (error) {
    throw error
  }
}
