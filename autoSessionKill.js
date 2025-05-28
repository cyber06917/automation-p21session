// Add event listener to trigger the logic once on first click anywhere
document.body.addEventListener("click", handleClickOnce, { once: true });

function handleClickOnce() {
  console.log("Page clicked. Evaluating sessions...");
  evaluateSessionRows();
}

const SESSION_TABLE_ID = "sessionTable";
const WINDOWS_TABLE_ID = "Windows";

function parseTimeString(text) {
  const h = text.match(/(\d+)h/);
  const m = text.match(/(\d+)m/);
  const s = text.match(/([\d.]+)s/);

  let totalSeconds = 0;
  if (h) totalSeconds += parseInt(h[1]) * 3600;
  if (m) totalSeconds += parseInt(m[1]) * 60;
  if (s) totalSeconds += parseFloat(s[1]);

  return totalSeconds;
}

function highlightPopup() {
  const popup = document.createElement('div');
  popup.textContent = "Don't kill it";
  Object.assign(popup.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    zIndex: '1000'
  });
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1000);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function evaluateSessionRows() {
  const table = document.getElementById(SESSION_TABLE_ID);
  const rows = table.querySelectorAll("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    // Click to load associated Windows table
    row.click();

    // Wait for the Windows table to render (adjust delay if needed)
    await delay(2000);
  // }


   

    const windowsTable = document.getElementById(WINDOWS_TABLE_ID);
    if (!windowsTable) continue;

    const winRows = windowsTable.querySelectorAll("tr");
    let safeToKill = true;

    for (let j = 1; j < winRows.length; j++) {
      const cells = winRows[j].querySelectorAll("td");
      if (cells.length < 2) continue;

      const lastAccessText = cells[1].textContent.trim();
      const seconds = parseTimeString(lastAccessText);

      if (seconds < 1800) {
        safeToKill = false;
        highlightPopup();
        break;
      }
    }

    if (safeToKill) {

      // Override confirm early
      const originalConfirm = window.confirm;
      window.confirm = () => true;

      // Perform the action
      row.cells[3].style.backgroundColor = "#111827";
      row.cells[5].click();
      window.alert = function (msg) {
        console.log("Killed Session", msg);
      };

      // Optional: Restore original confirm after action
      setTimeout(() => {
        window.confirm = originalConfirm;
      }, 1000); // Adjust timeout if needed

    }
  }
}
