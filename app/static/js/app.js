document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const queryInput = document.getElementById('query');
  const resultsNode = document.getElementById('results');
  const sentinel = document.getElementById('results-sentinel');
  const settingsButton = document.getElementById('settings-button');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsClose = document.getElementById('settings-close');
  const settingsList = document.getElementById('settings-list');
  const settingsSave = document.getElementById('settings-save');

  const settingsSchema = [
    {
      key: 'theme',
      label: 'Theme',
      type: 'select',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'dark', label: 'Dark' }
      ],
      default: 'default'
    },
    {
      key: 'autoLoad',
      label: 'Auto load more',
      type: 'checkbox',
      default: true
    },
    {
      key: 'resultsPerPage',
      label: 'Results per page',
      type: 'number',
      min: 1,
      max: 50,
      default: 10
    }
  ];

  const settingsState = {};

  function createSettingField(item) {
    const persisted = localStorage.getItem(item.key);
    const value = persisted !== null ? persisted : item.default;
    settingsState[item.key] = item.type === 'checkbox' ? value === 'true' || value === true : value;

    if (item.type === 'select') {
      return `
        <label class="settings-field">
          <span>${item.label}</span>
          <select data-key="${item.key}">
            ${item.options
              .map(
                (option) => `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`
              )
              .join('')}
          </select>
        </label>
      `;
    }

    if (item.type === 'checkbox') {
      const checked = value === 'true' || value === true;
      return `
        <label class="settings-field checkbox-field">
          <span>${item.label}</span>
          <input type="checkbox" data-key="${item.key}" ${checked ? 'checked' : ''} />
        </label>
      `;
    }

    return `
      <label class="settings-field">
        <span>${item.label}</span>
        <input type="${item.type}" data-key="${item.key}" value="${value}" min="${item.min || ''}" max="${item.max || ''}" />
      </label>
    `;
  }

  function renderSettings() {
    settingsList.innerHTML = settingsSchema.map((item) => createSettingField(item)).join('');
  }

  function readSettings() {
    settingsSchema.forEach((item) => {
      const input = settingsList.querySelector(`[data-key="${item.key}"]`);
      if (!input) return;

      let value;
      if (item.type === 'checkbox') {
        value = input.checked;
      } else if (item.type === 'number') {
        value = input.value ? Number(input.value) : item.default;
      } else {
        value = input.value;
      }

      settingsState[item.key] = value;
      localStorage.setItem(item.key, String(value));
    });
  }

  function applySettings() {
    document.documentElement.dataset.theme = settingsState.theme;
  }

  function openSettings() {
    renderSettings();
    settingsOverlay.hidden = false;
    settingsOverlay.setAttribute('aria-hidden', 'false');
    settingsOverlay.scrollTop = 0;
    const firstInput = settingsOverlay.querySelector('input, select, button');
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeSettings() {
    settingsOverlay.hidden = true;
    settingsOverlay.setAttribute('aria-hidden', 'true');
  }

  settingsButton.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', (event) => {
    if (!event.target.closest('.settings-panel')) {
      closeSettings();
    }
  });

  settingsSave.addEventListener('click', () => {
    readSettings();
    applySettings();
    closeSettings();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !settingsOverlay.hidden) {
      closeSettings();
    }
  });

  renderSettings();
  applySettings();

  let currentQuery = '';
  let currentPage = 1;
  let loading = false;
  let hasMore = false;

  function getPageSize() {
    return Number(settingsState.resultsPerPage) || 10;
  }

  async function loadResults(page) {
    if (loading || !currentQuery || (!hasMore && page > 1)) {
      return;
    }

    loading = true;
    const pageSize = getPageSize();
    const response = await fetch(
      `/search?q=${encodeURIComponent(currentQuery)}&page=${page}&count=${pageSize}`
    );
    const data = await response.json();

    if (!response.ok || data.error) {
      if (page === 1) {
        resultsNode.innerHTML = `<div class="message">${data.error || 'Search failed'}</div>`;
      }
      loading = false;
      hasMore = false;
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      if (page === 1) {
        resultsNode.innerHTML = '<div class="message">No results found.</div>';
      }
      hasMore = false;
      loading = false;
      return;
    }

    if (page === 1) {
      resultsNode.innerHTML = '';
    }

    resultsNode.insertAdjacentHTML(
      'beforeend',
      data
        .map(
          (item) => `
            <article class="result-card">
              <a class="result-title" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title || item.url}</a>
              <div class="result-url">${item.url}</div>
              <p class="result-content">${item.content || 'No description available.'}</p>
            </article>
          `
        )
        .join('')
    );

    hasMore = data.length >= pageSize;
    currentPage = page;
    loading = false;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading && hasMore && settingsState.autoLoad) {
        loadResults(currentPage + 1);
      }
    },
    {
      rootMargin: '200px',
    }
  );
  observer.observe(sentinel);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentQuery = queryInput.value.trim();
    currentPage = 1;
    hasMore = true;
    resultsNode.innerHTML = '';
    if (!currentQuery) {
      resultsNode.textContent = 'Please enter a search term.';
      return;
    }
    await loadResults(1);
  });
});
