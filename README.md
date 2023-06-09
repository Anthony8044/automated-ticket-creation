# Automated Ticket Creation

## How to use

```sh
npm install
```

```sh
node app.js
```

## Endpoints and Assumptions

After starting, use postman or thunderclient to to POST to the endpoints:

- http://localhost:3000/tickets
  - IMPORTANT: input the input json into the body json content in order to see the results
  - This will give you tickets that are grouped by the day
  - Assuming that the title is the first message in the conversation
  - The description will have the log of all the messages in that grouped ticket
  - The JSON data will be send in the response and stored in output-data.json file
  - IMPORTANT: input the input json into the body json content in order to see the results
  - This will give you tickets that are grouped by the day
  - Assuming that the title is the first message in the conversation
  - The description will have the log of all the messages in that grouped ticket
  - The JSON data will be send in the response and stored in output-data.json file
- http://localhost:3000/nongroupedtickets
  - IMPORTANT: input the input json into the body json content in order to see the results
  - This endpoint is created on the assumption that the tickets should not be grouped
  - Each message will have a different ticket
  - However I believe this is not the optimal outcome thats why its just created as a secondary endpoint
  - The JSON data will be send in the response and stored in output-nongrouped-data.json file
