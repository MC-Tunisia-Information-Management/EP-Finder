function fetchData() {
  // Replace 'INSERT_SHEET_ID_HERE' with the ID of the Google Sheet you want to write the data to
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Welcome");

  // Get the search query from cell J19
  const query = sheet.getRange("J19").getValue();

  // Set up API request headers
  const headers = {
    Authorization: "",
    "Content-Type": "application/json",
  };

  // Fetch data from API
  const response = UrlFetchApp.fetch("https://gis-api.aiesec.org/graphql", {
    method: "post",
    headers: headers,
    payload: JSON.stringify({
      query: `{
          allPeople(q: "${query}") {
            data {
              email
              full_name
              gender
              id
              phone
              status
              referral_type
              lc_alignment {
                keywords
              }
              rejected_count
              opportunity_applications_count
            }
          }
        }`,
    }),
  });

  const data = JSON.parse(response.getContentText()).data.allPeople.data;

  // Write data to sheet
  sheet
    .getRange("D22:M22")
    .setValues([
      [
        data[0].id,
        data[0].full_name,
        data[0].gender,
        data[0].email,
        data[0].phone,
        data[0].status,
        data[0].referral_type,
        data[0].lc_alignment.keywords,
        data[0].opportunity_applications_count,
        data[0].rejected_count,
      ],
    ]);
}
