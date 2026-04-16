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
            category: 'General',
            items: [
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

            ]
        },
        {
            category: 'Search Behavior',
            items: [
                {
                    key: 'resultsPerPage',
                    label: 'Results per page',
                    type: 'number',
                    min: 1,
                    max: 50,
                    default: 10
                },
                {
                    key: 'engines',
                    label: 'Search engines',
                    type: 'checkbox-group',
                    options: [
                        { value: 'duckduckgo', label: 'DuckDuckGo' },
                        { value: 'brave', label: 'Brave' },
                        { value: 'bing', label: 'Bing' },
                        { value: 'google', label: 'Google' },
                        { value: 'yahoo', label: 'Yahoo' },
                        { value: 'wikipedia', label: 'Wikipedia' },
                        { value: 'qwant', label: 'Qwant' },
                        { value: 'github', label: 'GitHub' }
                    ],
                    default: ['duckduckgo']
                },
                {
                    key: 'autoLoad',
                    label: 'Auto load more results on scroll',
                    type: 'checkbox',
                    default: true
                }
            ]
        }
    ];

    const settingsState = {};

    const STORAGE_KEY = 'selectedCategory'

    let activeCategory = localStorage.getItem(STORAGE_KEY) || settingsSchema[0].category

    function getValue(item) {
        const persisted = localStorage.getItem(item.key)

        if (persisted === null) return item.default

        if (item.type === 'checkbox') return persisted === 'true'
        if (item.type === 'number') return Number(persisted)

        if (item.type === 'checkbox-group') {
            try {
                return JSON.parse(persisted)
            } catch {
                return item.default
            }
        }

        return persisted
    }

    function setValue(key, value) {
        settingsState[key] = value
        localStorage.setItem(key, String(value))
    }

    function createField(item) {
        const value = getValue(item)
        settingsState[item.key] = value

        if (item.type === 'select') {
            return `
        <label class="settings-field">
            <span>${item.label}</span>
            <select data-key="${item.key}">
            ${item.options.map(o =>
                `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`
            ).join('')}
            </select>
        </label>
        `
        }

        if (item.type === 'checkbox') {
            return `
        <label class="settings-field checkbox-field">
            <span>${item.label}</span>
            <input type="checkbox" data-key="${item.key}" ${value ? 'checked' : ''} />
        </label>
        `
        }

        if (item.type === 'checkbox-group') {
            const value = getValue(item)

            return `
                <div class="settings-field">
                <span>${item.label}</span>
                <div class="checkbox-group">
                    ${item.options.map(opt => `
                    <label class="checkbox-option">
                        <input 
                        type="checkbox" 
                        data-key="${item.key}" 
                        value="${opt.value}" 
                        ${value.includes(opt.value) ? 'checked' : ''}
                        />
                        <span>${opt.label}</span>
                    </label>
                    `).join('')}
                </div>
                </div>
            `
        }

        return `
        <label class="settings-field">
        <span>${item.label}</span>
        <input type="${item.type}" data-key="${item.key}" value="${value}" min="${item.min || ''}" max="${item.max || ''}" />
        </label>
    `
    }

    function renderCategories() {
        const node = document.getElementById('settings-categories')

        node.innerHTML = settingsSchema.map(cat => `
    <li>
      <button 
        class="settings-category-button ${cat.category === activeCategory ? 'active' : ''}" 
        data-category="${cat.category}">
        ${cat.category}
      </button>
    </li>
  `).join('')

        bindCategoryEvents()
    }

    function bindCategoryEvents() {
        document.querySelectorAll('.settings-category-button').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.category
                localStorage.setItem(STORAGE_KEY, activeCategory)

                renderCategories()
                renderSettings()
                updateHeader()
            })
        })
    }

    function renderSettings() {
        const category = settingsSchema.find(c => c.category === activeCategory)
        if (!category) return

        settingsList.innerHTML = category.items.map(createField).join('')
    }

    function readSettings() {
        settingsSchema.forEach(category => {
            category.items.forEach(item => {
                if (item.type === 'checkbox-group') {
                    const inputs = settingsList.querySelectorAll(
                        `input[data-key="${item.key}"]`
                    )

                    const values = [...inputs]
                        .filter(i => i.checked)
                        .map(i => i.value)

                    setValue(item.key, values)
                    return
                }

                const input = settingsList.querySelector(`[data-key="${item.key}"]`)
                if (!input) return

                let value

                if (item.type === 'checkbox') value = input.checked
                else if (item.type === 'number') value = Number(input.value) || item.default
                else value = input.value

                setValue(item.key, value)
            })
        })
    }

    function applySettings() {
        document.documentElement.dataset.theme = settingsState.theme
    }

    function openSettings() {
        renderCategories()
        renderSettings()
        updateHeader()

        settingsOverlay.hidden = false
        settingsOverlay.inert = false

        const firstInput = settingsOverlay.querySelector('input, select, button')
        firstInput?.focus()
    }

    function closeSettings() {
        document.activeElement?.blur()
        settingsOverlay.inert = true
        settingsOverlay.hidden = true
    }

    settingsButton.addEventListener('click', openSettings);
    settingsClose.addEventListener('click', closeSettings);
    settingsOverlay.addEventListener('click', (event) => {
        if (event.target === settingsOverlay) {
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

    function sanitizeCategory() {
        const exists = settingsSchema.some(c => c.category === activeCategory)

        if (!exists) {
            activeCategory = settingsSchema[0].category
            localStorage.setItem(STORAGE_KEY, activeCategory)
        }
    }

    sanitizeCategory()

    function updateHeader() {
        const category = settingsSchema.find(c => c.category === activeCategory)
        document.getElementById('settings-category-title').textContent = category.category
    }
    updateHeader();

    renderCategories();
    renderSettings();
    applySettings();


    function getEngines() {
        const engines = settingsState.engines
        return Array.isArray(engines) ? engines.join(',') : 'duckduckgo'
    }

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
            `/search?q=${encodeURIComponent(currentQuery)}&page=${page}&count=${pageSize}&engines=${getEngines()}`
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