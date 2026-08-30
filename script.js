document.addEventListener('DOMContentLoaded', () => {
  const clientSelect = document.getElementById('client-select');
  const playBtn = document.getElementById('play-btn');
  const gameFrame = document.getElementById('game-frame');
  const placeholder = document.getElementById('placeholder');
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const selectedVersionText = document.getElementById('selected-version-text');

  // Fetch clients from clients.json dynamically
  async function loadClients() {
    try {
      const response = await fetch('clients.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const clients = await response.json();
      clientSelect.innerHTML = ''; // Clear existing loading options

      if (!clients || clients.length === 0) {
        clientSelect.innerHTML = '<option value="">No clients found</option>';
        return;
      }

      clients.forEach((client, index) => {
        const option = document.createElement('option');
        // Clean up URL whitespace
        option.value = client.url ? client.url.trim() : '';
        option.textContent = `${client.name} (${client.version || '1.12.2'})`;
        if (index === 0) option.selected = true;
        clientSelect.appendChild(option);
      });

      updateVersionText();
    } catch (error) {
      console.error('Error loading clients.json:', error);
      clientSelect.innerHTML = '<option value="">Failed to load clients.json</option>';
    }
  }

  // Update display text when client dropdown changes
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

  // Launch Button Logic
  playBtn.addEventListener('click', () => {
    const rawUrl = clientSelect.value;

    if (!rawUrl) {
      alert('Please select a valid client version first!');
      return;
    }

    const targetUrl = rawUrl.trim();

    // Hide placeholder overlay and set iframe source
    if (placeholder) placeholder.style.display = 'none';
    
    gameFrame.style.display = 'block';
    gameFrame.src = targetUrl;

    // Check optional auto-fullscreen toggle
    const autoFullscreen = document.getElementById('auto-fullscreen');
    if (autoFullscreen && autoFullscreen.checked && gameFrame.requestFullscreen) {
      gameFrame.requestFullscreen().catch(err => {
        console.warn('Fullscreen request blocked by browser policy:', err);
      });
    }
  });

  // Initialize client loading
  loadClients();
});
