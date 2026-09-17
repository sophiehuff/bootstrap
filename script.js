document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  const applyTheme = (isFocus) => {
    body.classList.toggle('contrast-mode', isFocus);
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach((button) => {
      button.textContent = isFocus ? 'Voltar ao tema' : 'Modo foco';
      button.setAttribute('aria-pressed', String(isFocus));
    });
    localStorage.setItem('tartaruga-theme', isFocus ? 'foco' : 'claro');
  };

  const savedTheme = localStorage.getItem('tartaruga-theme');
  if (savedTheme === 'foco') {
    applyTheme(true);
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(!body.classList.contains('contrast-mode'));
    });
  });

  document.querySelectorAll('[data-page-link]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.pageLink;
      if (target) {
        window.location.href = target;
      }
    });
  });

  const favoriteKey = 'tartaruga-favoritos';
  const readFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem(favoriteKey) || '[]');
    } catch {
      return [];
    }
  };

  const writeFavorites = (favorites) => {
    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
  };

  const updateFavoriteCounter = () => {
    const counter = document.querySelector('#favCount');
    if (!counter) return;
    const favorites = readFavorites();
    counter.textContent = favorites.length;
  };

  const syncFavoriteButtons = () => {
    const favorites = readFavorites();
    document.querySelectorAll('[data-favorite]').forEach((button) => {
      const card = button.closest('.gallery-card');
      const title = card?.dataset.title || '';
      const isFavorite = favorites.includes(title);
      button.classList.toggle('active', isFavorite);
      button.textContent = isFavorite ? '♥' : '♡';
      button.setAttribute('aria-label', isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    });
    updateFavoriteCounter();
  };

  document.querySelectorAll('[data-favorite]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.gallery-card');
      const title = card?.dataset.title || '';
      if (!title) return;

      const favorites = readFavorites();
      const hasFavorite = favorites.includes(title);
      const nextFavorites = hasFavorite
        ? favorites.filter((item) => item !== title)
        : [...favorites, title];

      writeFavorites(nextFavorites);
      syncFavoriteButtons();
    });
  });

  const galleryInput = document.querySelector('#filtroGaleria');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryCards = [...document.querySelectorAll('.gallery-card')];

  const applyGalleryFilter = () => {
    if (!galleryInput) return;

    const query = galleryInput.value.trim().toLowerCase();
    const activeFilter = [...filterButtons].find((button) => button.classList.contains('active'))?.dataset.filter || 'all';

    galleryCards.forEach((card) => {
      const title = (card.dataset.title || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const categoryMatches = activeFilter === 'all' || card.dataset.filter === activeFilter;
      const queryMatches = !query || title.includes(query) || tags.includes(query);
      card.style.display = categoryMatches && queryMatches ? '' : 'none';
    });
  };

  if (galleryInput) {
    galleryInput.addEventListener('input', applyGalleryFilter);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      applyGalleryFilter();
    });
  });

  const taskInputs = document.querySelectorAll('.task-check');
  taskInputs.forEach((input) => {
    const taskKey = `tartaruga-task-${input.dataset.task}`;
    const savedState = localStorage.getItem(taskKey);
    if (savedState !== null) {
      input.checked = savedState === 'true';
    }

    input.addEventListener('change', () => {
      localStorage.setItem(taskKey, String(input.checked));
    });
  });

  syncFavoriteButtons();
  applyGalleryFilter();
});
