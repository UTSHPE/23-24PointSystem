// const express = require("express");

// const { google } = require("googleapis");

// const app = express();



// app.get("/", async (req, res) => {

//     const auth = new google.auth.GoogleAuth({

//         keyFile: "credentials.json",
//         scopes: "https://www.googleapis.com/auth/spreadsheets",
//     })


//     //create client instance for auth
//     const client = await auth.getClient();


//     //instance of Google sheets API
//     const googleSheets = google.sheets({version: "v4", auth: client});


//     const spreadsheetId = "1JfUX1qeuYkq_kT93fFSvJ0HGW0knAC19qgzAZd-lNLc";

//     //Get meta data about spreadsheet
//     const metaData = await googleSheets.spreadsheets.get({
//         auth,
//         spreadsheetId,
//     });


//     // Read rows from spreadsheet
//     const getRows = await googleSheets.spreadsheets.values.get({
//         auth,
//         spreadsheetId,
//         range: "Sheet1"
//     });


//     //Write row(s) to spreadsheet
//     await googleSheets.spreadsheets.values.append({
//         auth,
//         spreadsheetId,
//         range: "Sheet1!C:D",
//         valueInputOption: "USER_ENTERED", //or RAW
//         resource: {
//             values: [["Make a tutorial", "test"]],
//         }
//     });

//     res.send(getRows.data);

// });

// app.listen(1337, (req, res) => console.log("running on 1337"));



const express = require("express");
const { google } = require("googleapis");

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/point_system.html");
});

app.get("/checkin", async (req, res) => {
  const name = req.query.name;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1JfUX1qeuYkq_kT93fFSvJ0HGW0knAC19qgzAZd-lNLc";

    // Write row(s) to spreadsheet with 10 points
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!C:D",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[name, 10]],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error occurred during check-in:", error);
    res.status(500).json({ success: false, error: "Check-in failed." });
  }
});

app.listen(1337, () => {
  console.log("Server running on port 1337");

});
