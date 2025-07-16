document.getElementById("generate-btn").addEventListener("click", generateThought);

function generateThought() {
  fetch('thoughts.txt')
    .then(response => response.text())
    .then(data => {
      var thoughts = data.split("\n");
      var randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
      document.getElementById("thought").textContent = randomThought;
    })
    .catch(error => {
      console.log("Error fetching thoughts:", error);
    });
}
