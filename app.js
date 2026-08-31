/**
 * ==========================================================================
 * Wedding Invitation WA Message Generator — JavaScript Logic
 * Indah & Anton
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const inviteForm = document.getElementById('inviteForm');
  const guestNameInput = document.getElementById('guestName');
  const partnerNameInput = document.getElementById('partnerName');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const guestNameError = document.getElementById('guestNameError');
  const previewUrlLink = document.getElementById('previewUrlLink');
  const previewMessageText = document.getElementById('previewMessageText');
  const previewTime = document.getElementById('previewTime');
  const btnCopyMessage = document.getElementById('btnCopyMessage');
  const btnCopyUrl = document.getElementById('btnCopyUrl');
  const btnShareNative = document.getElementById('btnShareNative');
  const btnReset = document.getElementById('btnReset');
  const toast = document.getElementById('toast');

  // Base URL for online wedding invitation
  const BASE_URL = 'https://undanganonlineaja.id/indah-anton';

  // Device detection (iOS / Android / Desktop)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isIOS;

  /**
   * Updates real-time clock in the WhatsApp preview bubble
   */
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (previewTime) {
      previewTime.textContent = `${hours}:${minutes}`;
    }
  }
  updateTime();

  /**
   * Constructs the full recipient display name
   * @param {boolean} isPlaceholderIfEmpty - Whether to return placeholder text if empty
   */
  function getRecipientName(isPlaceholderIfEmpty = false) {
    const guest = guestNameInput.value.trim();
    const partner = partnerNameInput.value.trim();

    if (!guest) {
      return isPlaceholderIfEmpty ? '[NAMA_TAMU]' : '';
    }

    if (partner) {
      return `${guest} & ${partner}`;
    }

    return guest;
  }

  /**
   * Generates the personalized invitation URL
   * @param {boolean} isPlaceholderIfEmpty - Whether to return placeholder URL if empty
   */
  function generateInviteUrl(isPlaceholderIfEmpty = false) {
    const recipientName = getRecipientName(isPlaceholderIfEmpty);
    if (!recipientName || recipientName === '[NAMA_TAMU]') {
      return `${BASE_URL}?to=[NAMA_TAMU]`;
    }
    return `${BASE_URL}?to=${encodeURIComponent(recipientName)}`;
  }

  /**
   * Generates the full WhatsApp invitation message template
   * @param {boolean} isPlaceholderIfEmpty - Whether to return placeholder message if empty
   */
  function generateFullMessage(isPlaceholderIfEmpty = false) {
    const inviteUrl = generateInviteUrl(isPlaceholderIfEmpty);

    return `Assalamu'alaikum Wr.Wb
Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i 
untuk menghadiri acara pernikahan kami

${inviteUrl}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan 
untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini, 
karena keterbatasan jarak & waktu.

Pesan ini adalah undangan resmi sebagai pengganti apabila undangan cetak 
BELUM/TIDAK DITERIMA oleh Bapak/Ibu/Saudara/i.

Diharapkan melalui media ini sebagai pengganti undangan resmi maksud 
dan tujuan kami dapat tersampaikan.

Terima kasih banyak atas perhatiannya.
Kami yang berbahagia,
Indah & Anton`;
  }

  /**
   * Normalizes Indonesian phone numbers into international WhatsApp format (62...)
   * Examples:
   *  08123456789 -> 628123456789
   *  8123456789  -> 628123456789
   *  +6281234567 -> 6281234567
   */
  function formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    } else if (cleaned.startsWith('8')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  }

  /**
   * Updates live preview elements synchronously
   */
  function updatePreview() {
    const isGuestEmpty = !guestNameInput.value.trim();
    const inviteUrl = generateInviteUrl(isGuestEmpty);
    const message = generateFullMessage(isGuestEmpty);

    // Update URL preview link
    previewUrlLink.textContent = inviteUrl;
    previewUrlLink.href = isGuestEmpty ? '#' : inviteUrl;

    // Update message text in chat bubble (make link clickable in preview)
    const escapedMessage = escapeHtml(message);
    const linkedMessage = escapedMessage.replace(
      /(https:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    previewMessageText.innerHTML = linkedMessage;
  }

  /**
   * Helper to escape HTML characters
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Displays toast notification banner
   */
  let toastTimer = null;
  function showToast(message, type = 'success') {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast show ${type === 'success' ? 'toast-success' : ''}`;

    toastTimer = setTimeout(() => {
      toast.className = 'toast';
    }, 3000);
  }

  /**
   * Copies text to clipboard with modern Clipboard API and legacy fallback
   */
  async function copyToClipboard(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      showToast(successMessage, 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showToast('Gagal menyalin teks ke clipboard', 'error');
    }
  }

  /**
   * Validates guest name input
   */
  function validateForm() {
    const guest = guestNameInput.value.trim();
    if (!guest) {
      guestNameInput.classList.add('input-error');
      guestNameError.classList.add('visible');
      guestNameInput.focus();
      return false;
    }
    guestNameInput.classList.remove('input-error');
    guestNameError.classList.remove('visible');
    return true;
  }

  /**
   * Opens WhatsApp with proper handling for iOS, Android, and Desktop
   */
  function openWhatsApp() {
    if (!validateForm()) {
      showToast('Mohon masukkan nama tamu terlebih dahulu', 'error');
      return;
    }

    const message = generateFullMessage(false);
    const phone = formatPhoneNumber(phoneNumberInput.value.trim());
    const encodedMessage = encodeURIComponent(message);

    if (phone) {
      // 1. Direct message to specific phone number
      if (isMobile) {
        // Deep link into WhatsApp mobile chat room
        window.location.href = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
      } else {
        // WhatsApp Web on Desktop
        window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, '_blank');
      }
    } else {
      // 2. No phone number provided -> Trigger contact selection in WhatsApp
      if (isMobile) {
        // whatsapp:// scheme triggers native contact selector on iOS & Android
        window.location.href = `whatsapp://send?text=${encodedMessage}`;
      } else {
        // WhatsApp Web on Desktop
        window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, '_blank');
      }
    }
  }

  /**
   * Native Share API (Invokes iPhone / Android system share sheet)
   */
  async function shareNative() {
    if (!validateForm()) {
      showToast('Mohon masukkan nama tamu terlebih dahulu', 'error');
      return;
    }

    const message = generateFullMessage(false);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Undangan Pernikahan Indah & Anton',
          text: message
        });
        showToast('Berhasil membuka menu Share!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share error:', err);
          // Fallback to WhatsApp link if share sheet encounters error
          openWhatsApp();
        }
      }
    } else {
      // If Web Share API is not supported, open WhatsApp directly
      openWhatsApp();
    }
  }

  // --- Event Listeners ---

  // Real-time input listener for Guest Name
  guestNameInput.addEventListener('input', () => {
    if (guestNameInput.value.trim()) {
      guestNameInput.classList.remove('input-error');
      guestNameError.classList.remove('visible');
    }
    updatePreview();
  });

  // Real-time input listener for Partner Name
  partnerNameInput.addEventListener('input', updatePreview);

  // Form Submit -> Send via WhatsApp
  inviteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    openWhatsApp();
  });

  // Native Share Button (iOS / Android)
  if (btnShareNative) {
    btnShareNative.addEventListener('click', shareNative);
  }

  // Copy Full Message Button
  btnCopyMessage.addEventListener('click', () => {
    const isGuestEmpty = !guestNameInput.value.trim();
    const message = generateFullMessage(isGuestEmpty);
    copyToClipboard(message, 'Pesan undangan berhasil disalin! 📋');
  });

  // Copy URL Only Button
  btnCopyUrl.addEventListener('click', () => {
    const isGuestEmpty = !guestNameInput.value.trim();
    const url = generateInviteUrl(isGuestEmpty);
    copyToClipboard(url, 'Link undangan berhasil disalin! 🔗');
  });

  // Reset Form Button
  btnReset.addEventListener('click', () => {
    inviteForm.reset();
    guestNameInput.classList.remove('input-error');
    guestNameError.classList.remove('visible');
    updatePreview();
    guestNameInput.focus();
    showToast('Formulir telah direset', 'success');
  });

  // Render initial preview state on load
  updatePreview();
});
