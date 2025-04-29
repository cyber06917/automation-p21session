// 1. Find the column header for "Session Age"
const headerCells = document.querySelectorAll("#sessionTable th");

headerCells.forEach((th, colIndex) => {
  if (th.textContent.includes("Session Age")) {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      highlightLongSessions(colIndex);
    });
  }
});

// 2. Function to color cells red if Session Age > 2 hours
function highlightLongSessions(colIndex) {
  const rows = document.querySelectorAll("#sessionTable tr");

  rows.forEach((row, index) => {
    if (index === 0) return; // skip header

    const ageCell = row.cells[colIndex];
    if (!ageCell) return;

    const ageText = ageCell.textContent.trim();
    let totalSeconds = 0;

    const h = ageText.match(/(\d+)h/);
    const m = ageText.match(/(\d+)m/);
    const s = ageText.match(/([\d.]+)s/);

    if (h) totalSeconds += parseInt(h[1]) * 3600;
    if (m) totalSeconds += parseInt(m[1]) * 60;
    if (s) totalSeconds += parseFloat(s[1]);

    // Color only the session age cell red if > 2 hours (7200 seconds)
    ageCell.style.backgroundColor = totalSeconds > 7200 ? "#ffcccc" : ""; // light red
  });
}


document.addEventListener('click', function() {
    setTimeout(function() {
        let table = document.getElementById('Windows');
        if (!table) return;

        let rows = table.getElementsByTagName('tr');
        let firstRedCell = null;

        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('td');
            let lastAccessCell = cells[1]; // 2nd column

            if (lastAccessCell) {
                let text = lastAccessCell.textContent.trim();

                // Match 1h 21m 12.215s format (with optional hours)
                let pattern = /(?:(\d+)\s*h\s*)?(\d+)\s*m\s*(\d+(?:\.\d+)?)\s*s/;
                let match = text.match(pattern);

                if (match) {
                    let hours = match[1] ? parseInt(match[1]) : 0;
                    let minutes = parseInt(match[2]);
                    let seconds = parseFloat(match[3]);

                    let totalMinutes = (hours * 60) + minutes + (seconds / 60);

                    if (totalMinutes < 30) {
                        lastAccessCell.style.backgroundColor = 'red';

                        // Store the first red cell found
                        if (!firstRedCell) {
                            firstRedCell = lastAccessCell;
                        }
                    }
                } else {
                    console.log('Unrecognized time format:', text);
                }
            }
        }

        // Scroll to the first red cell if found
        if (firstRedCell) {
            const rect = firstRedCell.getBoundingClientRect();
            const absoluteElementTop = window.pageYOffset + rect.top;
            const offset = absoluteElementTop - (window.innerHeight / 2);

            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    }, 3000); // Wait for 3 seconds
});
