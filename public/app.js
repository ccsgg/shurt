async function loadUrls() {
  const table = document.getElementById("urls-table");
  const tbody = document.getElementById("urls-tbody");

  try {
    const response = await fetch("/api/urls");
    const urls = await response.json();

    tbody.textContent = "";

    if (urls.length === 0) {
      table.classList.add("hidden");
      return;
    }

    table.classList.remove("hidden");

    for (const url of urls) {
      const row = document.createElement("tr");
      row.classList.add("hover:bg-orange-50", "transition-colors");
      row.className = "hover:bg-orange-50 transition-colors";

      const shortUrlCell = document.createElement("td");
      shortUrlCell.className = "px-6 py-4";

      const shortContainer = document.createElement("div");
      shortContainer.className = "flex items-center gap-3";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "w-6 h-6 flex items-center justify-center leading-none text-lg text-gray-300 hover:text-orange-600 focus:outline-none transition-colors duration-200 ease-in-out";
      deleteButton.innerHTML = `<svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6L18 18" /><path d="M18 6L6 18" /></svg>`;
      deleteButton.setAttribute("aria-label", "Delete URL");

      const shortUrlLink = document.createElement("a");
      shortUrlLink.href = `/${url.short_url}`;
      shortUrlLink.textContent = `${window.location.origin}/${url.short_url}`;
      shortUrlLink.className = "font-medium text-orange-500 hover:underline px-2";
      shortUrlLink.target = "_blank";
      
      shortContainer.appendChild(deleteButton);
      shortContainer.appendChild(shortUrlLink);
      shortUrlCell.appendChild(shortContainer);

      deleteButton.addEventListener("click", async () => {
        if (confirm("This URL will be deleted. Are you sure?")) {
          try {
            const deleteResponse = await fetch(`/api/urls/${url.id}`, {
              method: "DELETE"
            });
            if (deleteResponse.ok) {
              await loadUrls();
            } else {
              const errorData = await deleteResponse.json();
              alert(`Error deleting URL: ${errorData.error}`);
            }
          } catch (error) {
            console.error("Error deleting URL:", error);
            alert("An error occurred while deleting the URL.");
          }
        }
      });

      const originalUrlCell = document.createElement("td");
      originalUrlCell.className = "px-6 py-4 text-center";
      originalUrlCell.textContent = url.original_url;

      const clickCountCell = document.createElement("td");
      clickCountCell.className = "px-6 py-4 text-center";
      clicksBadge = document.createElement("span");
      clicksBadge.className = "inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600";
      clicksBadge.textContent = url.clicks;
      clickCountCell.appendChild(clicksBadge);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-4 text-center text-gray-400 whitespace-nowrap";
      dateCell.textContent = new Date(url.created_at).toLocaleDateString();

      row.appendChild(shortUrlCell);
      row.appendChild(originalUrlCell);
      row.appendChild(clickCountCell);
      row.appendChild(dateCell);

      tbody.appendChild(row);
    }
  } catch (error) {
    console.error("Error loading URLs:", error);
  }
};

loadUrls();

const form = document.getElementById("shorten-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const urlInput = document.getElementById("url");
  const url = urlInput.value;

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    console.log("POST Response:", data);

    urlInput.value = "";
    await loadUrls();
    
  } catch (error) {
    console.error("Error:", error);
  }
});