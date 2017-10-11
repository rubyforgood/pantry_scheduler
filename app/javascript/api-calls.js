export function updateClient(id, updatedClient) {
  return fetch(`/api/clients/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedClient)
  })
  .then(response => console.log(`Updated client with id = ${id}`))
  .catch(error => console.log(error));
}