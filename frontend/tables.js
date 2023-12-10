
const storeButton = document.getElementById("store");
const tableArea = document.createElement("div")
document.body.appendChild(tableArea);
generateAllTables();

document.getElementById("sheetjsexport").addEventListener('click', function() {
    /* Create worksheet from HTML DOM TABLE */
    var wb = XLSX.utils.table_to_book(document.getElementById("TableToExport"));
    /* Export to file (start a download) */
    XLSX.writeFile(wb, "FileTempos.xlsx");
  }
);

storeButton.addEventListener("click", () => {
    const selectedFile = document.querySelector('input[type="file"]').files[0];
    console.log(selectedFile)
    if(selectedFile == null){
        return
    }
    var data = new FormData()
    data.append('my_audio_file', selectedFile)
    const result = fetch("http://localhost:8086/api/file_tempo", {
            method: "POST",
            body: data
        })
        .then(response => response.json())
        .then(data => fetch("http://localhost:5000/api/store", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
            })
            .then(response => response.json())
            .catch(error => {
                console.log(error)
            })
        )

    result.then(r => {
        generateAllTables()
    });
    }
);

async function generateAllTables(){
    tableArea.innerHTML = '';
    result = fetch("http://localhost:5000/api/get", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }
        )
    .then((response) => response.json())
    .then(data => {
        createTable(data)
    });
}

function createTable(data) {
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");

    for (let i = 0; i < data.length + 1; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 4; j++) {
        const cell = document.createElement("td");
        const current_file_data = data[i - 1]

        var cellText = null;
        switch(j){
            case 0: // filename
                if(i == 0){
                    cellText = document.createTextNode(`filename`);
                    break;
                }
                cellText = document.createTextNode(current_file_data["filename"]);
                break;
            case 1: // overall tempo
                if(i == 0){
                    cellText = document.createTextNode(`overall_tempo`);
                    break;
                }
                cellText = document.createTextNode(current_file_data["overall_tempo"]);
                break;
            case 2: // peak 1
                if(i == 0){
                    cellText = document.createTextNode(`peak 1`);
                    break;
                }
                cellText = document.createTextNode(current_file_data["peak1"]);
                break;
            case 3: // peak 2
                if(i == 0){
                    cellText = document.createTextNode(`peak 2`);
                    break;
                }
                cellText = document.createTextNode(current_file_data["peak2"]);
                break;
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
      }

      // add the row to the end of the table body
      tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    tableArea.appendChild(tbl);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "2");
    tbl.setAttribute("id", "TableToExport")
  }