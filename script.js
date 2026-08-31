document.addEventListener('DOMContentLoaded', () => {
  const clientSelect = document.getElementById('client-select');
  const playBtn = document.getElementById('play-btn');
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const selectedVersionText = document.getElementById('selected-version-text');

  // Load clients from clients.json
  async function loadClients() {
    try {
      const response = await fetch('clients.json');
      if (!response.ok) throw new Error('Failed to load JSON');

      const clients = await response.json();
      clientSelect.innerHTML = ''; 

      if (!clients || clients.length === 0) {
        clientSelect.innerHTML = '<option value="">No clients found</option>';
        return;
      }

      clients.forEach((client, index) => {
        const option = document.createElement('option');
        option.value = client.url ? client.url.trim() : '';
        option.textContent = `${client.name} (${client.version || '1.12.2'})`;
        if (index === 0) option.selected = true;
        clientSelect.appendChild(option);
      });

      updateVersionText();
    } catch (error) {
      console.error('Error:', error);
      clientSelect.innerHTML = '<option value="">Error loading clients.json</option>';
    }
  }

  function updateVersionText() {
    const selectedOption = clientSelect.options[clientSelect.selectedIndex];
    if (selectedOption && selectedVersionText) {
      selectedVersionText.textContent = selectedOption.textContent;
    }
  }

  clientSelect.addEventListener('change', updateVersionText);

  // Tab Navigation Handling
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(`${targetTab}-view`);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });

  // Launch directly in a new tab when clicking PLAY
  playBtn.addEventListener('click', () => {
    const targetUrl = clientSelect.value.trim();

    if (!targetUrl) {
      alert('Please select a valid client version first!');
      return;
    }

    // Opens the client link in a fresh new tab
    window.open(targetUrl, '_blank');
  });

  loadClients();
});
