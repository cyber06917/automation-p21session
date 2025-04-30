let ageCell = null;

// 1. Find the column header for "Session Age"
// querySelectorAll returns 
const headerCells = document.querySelectorAll("#sessionTable th");

//A NodeList is an array-like object returned by methods like querySelectorAll(). It contains DOM nodes (elements) that match the given selector.
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

    ageCell = row.cells[colIndex];

    if (!ageCell) return;

    const ageText = ageCell.textContent.trim();
    let totalSeconds = 0;

    /*
    The regex.match() method returns an array because we are using a capturing group.
    The array contains the full match at index 0, and the value inside the capturing group at index 1.

    Example:
      /([\d.]+)s/
        ^      ^
      Start  End  (Capturing group starts and ends here)

    If a capturing group is used in the regex, the match method will return an array with:
      - The full match at index 0
      - The captured value inside the group at index 1 (and so on for additional groups)
    */

    const h = ageText.match(/(\d+)h/);
    const m = ageText.match(/(\d+)m/);
    const s = ageText.match(/([\d.]+)s/);

  
    if (h) totalSeconds += parseInt(h[1]) * 3600; 
    if (m) totalSeconds += parseInt(m[1]) * 60; 
    if (s) totalSeconds += parseFloat(s[1]);

    // Color only the session age cell red if > 2 hours (7200 seconds)
    // Ternary Operator Syntax "condition ? exprIfTrue : exprIfFalse;"
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
            let totalSeconds2 = 0;
            if (lastAccessCell) {
                let text = lastAccessCell.textContent.trim();



                const h2 = text.match(/(\d+)h/);
                const m2 = text.match(/(\d+)m/);
                const s2 = text.match(/([\d.]+)s/);
            
              
                if (h2) totalSeconds2 += parseInt(h2[1]) * 3600; 
                if (m2) totalSeconds2 += parseInt(m2[1]) * 60; 
                if (s2) totalSeconds2 += parseFloat(s2[1]);

            

                if (totalSeconds2 < 1800) {
                    lastAccessCell.style.backgroundColor = 'red';

                    // Store the first red cell found
                    if (!firstRedCell) {
                        firstRedCell = lastAccessCell;
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
    }, 2000); // Wait for 3 seconds
});


