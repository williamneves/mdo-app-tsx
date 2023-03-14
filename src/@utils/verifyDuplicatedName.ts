// Functions
const formatName = (name: string): string =>
  name.normalize("NFD").replace(/[^a-zA-Z\s]/g, "")
const splitName = (name: string): Array<string> =>
  name
    .toLowerCase()
    .split(" ")
    .filter(char => char !== "")

import Client from "src/interfaces/Client"

// Risk Interface
interface Risk {
  status: boolean
  probableDuplicity: Array<Client>
}

// Verify Duplicated Name
export const verifyDuplicatedName = (
  newClientName: string,
  ListDataToCompare: Client[]
): Risk => {
  // Format the new client name
  const formattedName: string = formatName(newClientName)
  const splitNameList: Array<string> = splitName(formattedName)

  // Create the risk
  const risk: Risk = {
    status: false,
    probableDuplicity: []
  }

  // Verify if the new client name is duplicated
  ListDataToCompare.forEach((client: Client) => {
    const clientName = splitName(formatName(client.name))
    if (
      clientName[0] === splitNameList[0] &&
      clientName[1] === splitNameList[1]
    ) {
      risk.status = true
      risk.probableDuplicity.push(client)
    }
  })

  return risk
}
