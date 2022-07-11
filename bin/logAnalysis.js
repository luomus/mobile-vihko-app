const fs = require('fs')
const filePath = './log.txt'

// INSTRUCTIONS:
// 1. Copy the log contents into a new file 'log.txt' which has to be located on the same directory as this script.
// 2. Run 'node logAnalysis.js'.


// Save the content of the into a string.

let content = ''

if (fs.existsSync(filePath)) {
  content = fs.readFileSync(filePath, { encoding: 'utf8' })
} else {
  console.log('File not found')
}

const lines = content.split('\n') // Parse the content into an array of lines (strings).

// Parse the lines into JSON objects and push them into the entries -array.

let entries = []

lines.forEach(line => {
  try {
    const entry = JSON.parse(line)
    entries.push(entry)
  } catch (e) {
    // Do nothing when the parsing of a line fails, it is likely not an entry.
  }
})

// Form a list of each unique error message and the users' IDs who have received them.

const usersByErrors = entries.reduce((organizedEntries, currentEntry) => {
  const foundError = organizedEntries.find(entry => entry.error === currentEntry.message)
  
  if (foundError) {
    if (!foundError.users.includes(currentEntry.meta.user_id)) {
        foundError.users.push(currentEntry.meta.user_id)
    }
  } else {
    organizedEntries.push({ error: currentEntry.message, users: [ currentEntry.meta.user_id ] })
  }

  return organizedEntries
}, [])

// Print the result.

console.log(usersByErrors)