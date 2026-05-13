window.FlashcardController = (() => {
    let cards = [];
    let cardPositions = [];
    let currentIndex = 0;
    let isActive = false;
    let versesContent = null;
    let strip = null;
    let touchStartX = null;
    let touchStartY = null;
    let resizeTimer = null;
    let audioEl = null;
    let audioBtn = null;

    function storageKey() {
        return 'fc-card-' + window.location.pathname.split('/').filter(Boolean).join('-');
    }

    function stopAudio() {
        if (!audioEl) return;
        audioEl.pause();
        audioEl.currentTime = 0;
        if (audioBtn) {
            audioBtn.innerHTML = '🔊 <span>Play</span>';
            audioBtn.classList.remove('playing');
        }
    }

    function updateAudio() {
        if (!audioEl || !audioBtn) return;
        stopAudio();
        const card = cards[currentIndex];
        const src = card && card.dataset.audio;

        // Move button into current card, after the verse-text-grid
        const textGrid = card && card.querySelector('.verse-text-grid');
        const meaningsSection = card && card.querySelector('.meanings-section');
        if (textGrid) {
            if (meaningsSection) {
                textGrid.parentNode.insertBefore(audioBtn, meaningsSection);
            } else {
                textGrid.parentNode.appendChild(audioBtn);
            }
        }

        if (src) {
            audioEl.src = src;
            audioBtn.style.display = '';
        } else {
            audioBtn.style.display = 'none';
        }
    }

    function toggleAudio() {
        if (!audioEl) return;
        if (audioEl.paused) {
            audioEl.play().then(function() {
                audioBtn.innerHTML = '⏸ <span>Pause</span>';
                audioBtn.classList.add('playing');
            }).catch(function() {
                audioBtn.style.display = 'none';
            });
        } else {
            stopAudio();
        }
    }

    function createAudioControls() {
        audioEl = new Audio();
        audioEl.preload = 'none';
        audioEl.addEventListener('ended', function() {
            if (audioBtn) {
                audioBtn.innerHTML = '🔊 <span>Play</span>';
                audioBtn.classList.remove('playing');
            }
        });
        audioEl.addEventListener('error', function() {
            if (audioBtn) audioBtn.style.display = 'none';
        });

        audioBtn = document.createElement('button');
        audioBtn.className = 'fc-audio-btn';
        audioBtn.setAttribute('aria-label', 'Play pronunciation');
        audioBtn.innerHTML = '🔊 <span>Play</span>';
        audioBtn.addEventListener('click', toggleAudio);
    }

    function removeAudioControls() {
        stopAudio();
        if (audioBtn) { audioBtn.remove(); audioBtn = null; }
        if (audioEl) { audioEl.src = ''; audioEl = null; }
    }

    function updateUI() {
        const total = cards.length;
        const pos = currentIndex + 1;

        const labelEl = document.querySelector('.fc-verse-label');
        const progressText = document.querySelector('.fc-progress-text');
        const progressFill = document.querySelector('.fc-progress-fill');
        const progressBar = document.querySelector('.fc-progress-bar');
        const prevBtn = document.querySelector('.fc-prev');
        const nextBtn = document.querySelector('.fc-next');

        if (labelEl) labelEl.textContent = cards[currentIndex].dataset.verseLabel || '';
        if (progressText) progressText.textContent = pos + ' / ' + total;
        if (progressFill) progressFill.style.width = ((pos / total) * 100) + '%';
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', pos);
            progressBar.setAttribute('aria-valuemax', total);
            progressBar.setAttribute('aria-valuetext', pos + ' of ' + total);
        }
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;

        const verseId = cards[currentIndex].dataset.verseId;
        if (verseId) history.replaceState(null, '', '?card=' + verseId);
        try { sessionStorage.setItem(storageKey(), currentIndex); } catch (e) {}
    }

    function syncHeight() {
        if (!strip || !versesContent) return;
        versesContent.style.height = strip.scrollHeight + 'px';
    }

    function showCard(index) {
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        if (strip) strip.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        requestAnimationFrame(syncHeight);
        updateUI();
        updateAudio();
    }

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (touchStartX === null) return;
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    }

    function handleTouchEnd(e) {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx < 0) goNext();
            else goPrev();
        }
        touchStartX = null;
        touchStartY = null;
    }

    function handleKey(e) {
        if (!isActive) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
    }

    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(syncHeight, 150);
    }

    function handlePopState() {
        if (!isActive) return;
        history.pushState(null, '', window.location.href);
        if (currentIndex > 0) showCard(currentIndex - 1);
    }

    function activate() {
        isActive = true;
        versesContent = document.querySelector('.verses-content');
        cards = Array.from(versesContent.querySelectorAll('.verse-item'));

        // Save original DOM positions so deactivate can restore nested structures
        cardPositions = cards.map(function(card) {
            return { parent: card.parentNode, nextSibling: card.nextSibling };
        });

        strip = document.createElement('div');
        strip.className = 'fc-strip';
        versesContent.appendChild(strip);
        cards.forEach(function(card) { strip.appendChild(card); });

        document.querySelector('.full-chalisa-container').classList.add('flashcard-mode');
        document.getElementById('toggle-flashcard').checked = true;

        versesContent.addEventListener('touchstart', handleTouchStart, { passive: true });
        versesContent.addEventListener('touchmove', handleTouchMove, { passive: false });
        versesContent.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('resize', handleResize);
        window.addEventListener('popstate', handlePopState);
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.documentElement.classList.add('flashcard-active');
        document.body.classList.add('flashcard-active');
        history.pushState(null, '', window.location.href);

        createAudioControls();
        showCard(currentIndex);
    }

    function deactivate() {
        isActive = false;
        removeAudioControls();

        if (strip) {
            // Restore each card to its original parent/position
            cards.forEach(function(card, i) {
                const pos = cardPositions[i];
                if (pos && pos.parent) {
                    if (pos.nextSibling && pos.nextSibling.parentNode === pos.parent) {
                        pos.parent.insertBefore(card, pos.nextSibling);
                    } else {
                        pos.parent.appendChild(card);
                    }
                }
            });
            strip.remove();
            strip = null;
            cardPositions = [];
        }

        versesContent.style.height = '';
        document.querySelector('.full-chalisa-container').classList.remove('flashcard-mode');
        document.getElementById('toggle-flashcard').checked = false;

        versesContent.removeEventListener('touchstart', handleTouchStart);
        versesContent.removeEventListener('touchmove', handleTouchMove);
        versesContent.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('popstate', handlePopState);
        document.documentElement.style.overflowX = '';
        document.body.style.overflowX = '';
        document.documentElement.classList.remove('flashcard-active');
        document.body.classList.remove('flashcard-active');

        history.replaceState(null, '', window.location.pathname);
    }

    function goNext() {
        if (currentIndex < cards.length - 1) showCard(currentIndex + 1);
    }

    function goPrev() {
        if (currentIndex > 0) showCard(currentIndex - 1);
    }

    function init() {
        if (!document.getElementById('toggle-flashcard')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const cardParam = urlParams.get('card');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (cardParam) {
            const tempCards = Array.from(document.querySelectorAll('.verse-item'));
            const idx = tempCards.findIndex(function(c) { return c.dataset.verseId === cardParam; });
            if (idx !== -1) currentIndex = idx;
        } else if (isMobile) {
            try {
                const saved = sessionStorage.getItem(storageKey());
                if (saved !== null) currentIndex = parseInt(saved, 10) || 0;
            } catch (e) {}
        }

        if (isMobile || cardParam) activate();

        document.getElementById('toggle-flashcard').addEventListener('change', function(e) {
            if (e.target.checked) activate();
            else deactivate();
        });

        document.addEventListener('keydown', handleKey);
    }

    return { init: init, goNext: goNext, goPrev: goPrev, activate: activate, deactivate: deactivate };
})();

document.addEventListener('DOMContentLoaded', FlashcardController.init);
