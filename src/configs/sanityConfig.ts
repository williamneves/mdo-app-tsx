import sanityClient from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

const sanityConfig = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_PROJECT_DATASET,
  apiVersion: "2021-03-25",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_PROJECT_TOKEN_API
})

// Function to get the image url
const builder = imageUrlBuilder(sanityConfig)

const getImageUrl = (image: any) => {
  return builder.image(image)
}

export {sanityConfig as dbClient, getImageUrl}
