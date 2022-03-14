const path = "http://localhost:5000/"

// GET
export const getImages = async () => await fetch(`${path}images`).then(res => res.json())
export const getMyImages = async (id) => await fetch(`${path}imagesForUser/${id}`).then(res => res.json())
export const getClassifications = async (imageID) => await fetch(`${path}imageInfo/${imageID}`).then(res => res.json())

// POST

export const postAuth = async (data) => await fetch(`${path}auth`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}).then(res => res.json())
