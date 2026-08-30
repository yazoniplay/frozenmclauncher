document.addEventListener('DOMContentLoaded', () => {
  const clientSelect = document.getElementById('client-select');
  const playBtn = document.getElementById('play-btn');
  const gameFrame = document.getElementById('game-frame');
  const placeholder = document.getElementById('placeholder');
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const selectedVersionText = document.getElementById('selected-version-text');

  // 1. Fetch available clients from clients.json
  async function loadClients() {
    try {
      const response = await fetch('clients.json');
      const clients = await response.json();
      
      clientSelect.innerHTML = ''; // Clear options

      clients.forEach((client, index) => {
        const option = document.createElement('option');
        option.value = client.url;
        option.textContent = `${client.name} (${client.version})`;
        option.dataset.version = client.version;
        if (index === 0) option.selected = true;
        clientSelect.appendChild(option);
      });

      updateVersionText();
    } catch (error) {
      console.error('Failed to load clients.json:', error);
      clientSelect.innerHTML = '<option value="">Error loading clients</option>';
    }
  }

  // 2. Tab Navigation logic
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${targetTab}-view`).classList.add('active');
    });
  });

  // 3. Update Label when selection changes
  function updateVersionText() {
    const selectedOption = clientSelect.options[clientSelect.selectedIndex];
    if (selectedOption) {
      selectedVersionText.textContent = selectedOption.textContent;
    }
  }

  clientSelect.addEventListener('change', updateVersionText);

  // 4. Launch Game Frame
  playBtn.addEventListener('click', () => {
    const selectedUrl = clientSelect.value;

    if (selectedUrl) {
      placeholder.style.display = 'none';
      gameFrame.src = selectedUrl;

      // Optional Auto-Fullscreen setting check
      const autoFullscreen = document.getElementById('auto-fullscreen').checked;
      if (autoFullscreen && gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
      }
    }
  });

  // Initialize
  loadClients();
});
