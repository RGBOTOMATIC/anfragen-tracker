// === Anfragen-Tracker – Google Apps Script Backend ===
// Deployment: Deployen → Als Web-App → Ausführen als: Ich, Zugriff: Jeder

const SHEET_NAME          = 'Anfragen';
const GEBURTSTAGE_SHEET   = 'Geburtstage';
const HEADERS             = ['id', 'quelle', 'kunde', 'notiz', 'adresse', 'telefon', 'email', 'status', 'datum'];
const GEBURTSTAGE_HEADERS = ['id', 'name', 'datum', 'notiz'];

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

function getGeburtstageSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(GEBURTSTAGE_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(GEBURTSTAGE_SHEET);
    sheet.appendRow(GEBURTSTAGE_HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, GEBURTSTAGE_HEADERS.length).setFontWeight('bold');
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

function doGet(e) {
  try {
    const sheetParam = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : 'anfragen';

    if (sheetParam === 'geburtstage') {
      const sheet = getGeburtstageSheet();
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) return out([]);
      const data = rows.slice(1).map(row =>
        Object.fromEntries(GEBURTSTAGE_HEADERS.map((h, i) => [h, cellStr(row[i])]))
      );
      return out(data);
    } else {
      const sheet = getSheet();
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) return out([]);
      const data = rows.slice(1).map(row =>
        Object.fromEntries(HEADERS.map((h, i) => [h, cellStr(row[i])]))
      );
      return out(data);
    }
  } catch (err) {
    return out({ error: err.message });
  }
}

function doPost(e) {
  try {
    const body       = JSON.parse(e.postData.contents);
    const action     = body.action;
    const sheetParam = body.sheet || 'anfragen';
    const data       = body.data || [];

    if (action === 'save') {
      if (sheetParam === 'geburtstage') {
        const sheet = getGeburtstageSheet();
        sheet.clearContents();
        sheet.appendRow(GEBURTSTAGE_HEADERS);
        sheet.getRange(1, 1, 1, GEBURTSTAGE_HEADERS.length).setFontWeight('bold');
        if (data.length > 0) {
          const rows = data.map(item => GEBURTSTAGE_HEADERS.map(h => item[h] !== undefined ? item[h] : ''));
          sheet.getRange(2, 1, rows.length, GEBURTSTAGE_HEADERS.length).setValues(rows);
          // Datum-Spalte als Text erzwingen – verhindert automatische Datumserkennung durch Sheets
          const datumCol = GEBURTSTAGE_HEADERS.indexOf('datum') + 1;
          sheet.getRange(2, datumCol, rows.length, 1).setNumberFormat('@');
        }
      } else {
        const sheet = getSheet();
        sheet.clearContents();
        sheet.appendRow(HEADERS);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
        if (data.length > 0) {
          const rows = data.map(item => HEADERS.map(h => item[h] !== undefined ? item[h] : ''));
          sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
        }
      }
    }

    return out({ ok: true });
  } catch (err) {
    return out({ error: err.message });
  }
}

function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
