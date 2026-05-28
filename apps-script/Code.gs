// === Anfragen-Tracker – Google Apps Script Backend ===
// Deployment: Deployen → Als Web-App → Ausführen als: Ich, Zugriff: Jeder

const SHEET_NAME = 'Anfragen';
const HEADERS = ['id', 'quelle', 'kunde', 'notiz', 'adresse', 'telefon', 'email', 'status', 'datum'];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Zellwert sicher als String – wandelt Datumsobjekte in ISO-Format um
function cellStr(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(val === null || val === undefined ? '' : val);
}

function doGet() {
  try {
    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return out([]);

    const data = rows.slice(1).map(row =>
      Object.fromEntries(HEADERS.map((h, i) => [h, cellStr(row[i])]))
    );
    return out(data);
  } catch (e) {
    return out({ error: e.message });
  }
}

function doPost(e) {
  try {
    const { action, data } = JSON.parse(e.postData.contents);

    if (action === 'save') {
      const sheet = getSheet();
      sheet.clearContents();
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');

      if (data.length > 0) {
        const rows = data.map(item => HEADERS.map(h => item[h] !== undefined ? item[h] : ''));
        sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
      }
    }

    return out({ ok: true });
  } catch (e) {
    return out({ error: e.message });
  }
}

function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
