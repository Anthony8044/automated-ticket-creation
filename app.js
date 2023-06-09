const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const outputFile = "output-data.json";
const outputNonGroupedFile = "output-nongrouped-data.json";
const isGibberish = require("is-gibberish");

app.use(express.json()); // To parse JSON data in the request body.

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post("/tickets", (req, res) => {
  const converstaionData = req.body;

  // const test = res.body.map((a) => a);
  let filteredTickets = [];
  let newTickets = [];

  // check if req.body json array exists
  if (
    converstaionData.length > 0 &&
    converstaionData[0]?.createdAt &&
    converstaionData[0]?.tel
  ) {
    //filter out duplicate objects
    filteredTickets = converstaionData.filter((obj, index) => {
      if (obj.createdAt && obj.tel && obj.msg && !isGibberish(obj.msg))
        return (
          index ===
          converstaionData.findIndex(
            (o) =>
              obj.createdAt === o.createdAt &&
              obj.tel === o.tel &&
              obj.msg === o.msg
          )
        );
    });

    // create a new array with the required and optional values
    filteredTickets.map((a) => {
      const optionalFileUrl = a?.fileUrl ? { file_attached: a?.fileUrl } : {};
      let found = newTickets.find(
        (b) =>
          b.phone_number === a.tel &&
          b.created_at.toDateString() === new Date(a.createdAt).toDateString()
      );

      if (found !== undefined) {
        const index = newTickets.findIndex((obj) => {
          return (
            obj.phone_number === a.tel &&
            obj.created_at.toDateString() ===
              new Date(a.createdAt).toDateString()
          );
        });
        newTickets[index].description =
          newTickets[index].description +
          " {" +
          new Date(a.createdAt).toLocaleString() +
          "}: " +
          a.msg;

        if (optionalFileUrl?.file_attached) {
          newTickets[index].file_attached = optionalFileUrl?.file_attached;
        }
      } else {
        newTickets.push({
          title: a.msg,
          phone_number: a.tel,
          description:
            "{" + new Date(a.createdAt).toLocaleString() + "}: " + a.msg,
          created_at: new Date(a.createdAt),
          ...optionalFileUrl,
        });
      }
    });
  } else {
    return res.status(500).send({
      error:
        "Input JSON array of converstation objects into the body section to receive an output and reponse",
    });
  }
  newTickets.forEach((object) => {
    delete object["created_at"];
  });

  fs.writeFile(outputFile, JSON.stringify(newTickets, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error writing to events file." });
    }

    res.status(201).send({ message: newTickets });
  });
});

app.post("/nongroupedtickets", (req, res) => {
  const converstaionData = req.body;

  // const test = res.body.map((a) => a);
  let filteredTickets = [];
  let newTickets = [];

  // check if req.body json array exists
  if (
    converstaionData.length > 0 &&
    converstaionData[0]?.createdAt &&
    converstaionData[0]?.tel
  ) {
    //filter out duplicate objects
    filteredTickets = converstaionData.filter((obj, index) => {
      if (obj.createdAt && obj.tel && obj.msg && !isGibberish(obj.msg))
        return (
          index ===
          converstaionData.findIndex(
            (o) =>
              obj.createdAt === o.createdAt &&
              obj.tel === o.tel &&
              obj.msg === o.msg
          )
        );
    });

    // create a new array with the required and optional values
    filteredTickets.map((a) => {
      const optionalFileUrl = a?.fileUrl ? { file_attached: a?.fileUrl } : {};
      newTickets.push({
        title: a.msg,
        phone_number: a.tel,
        description: "Created at: " + new Date(a.createdAt).toLocaleString(),
        ...optionalFileUrl,
      });
    });
  } else {
    return res.status(500).send({
      error:
        "Input JSON array of converstation objects into the body section to receive an output and reponse",
    });
  }

  fs.writeFile(
    outputNonGroupedFile,
    JSON.stringify(newTickets, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error writing to events file." });
      }

      res.status(201).send({ message: newTickets });
    }
  );
});
