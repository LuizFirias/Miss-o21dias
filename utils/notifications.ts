// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registrado:', registration);
      })
      .catch((error) => {
        console.log('SW registro falhou:', error);
      });
  });
}

// Solicitar permissão para notificações
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Agendar notificações
export function scheduleNotifications() {
  if ('Notification' in window && Notification.permission === 'granted') {
    // Notificação da manhã (8h)
    const morning = new Date();
    morning.setHours(8, 0, 0, 0);
    
    if (morning > new Date()) {
      setTimeout(() => {
        new Notification('Sala do Tempo 21', {
          body: 'Levanta. O dia começou.',
          icon: '/icon-192.png',
        });
      }, morning.getTime() - Date.now());
    }

    // Notificação da noite (20h)
    const night = new Date();
    night.setHours(20, 0, 0, 0);
    
    if (night > new Date()) {
      setTimeout(() => {
        new Notification('Sala do Tempo 21', {
          body: 'Você vai terminar ou vai falhar?',
          icon: '/icon-192.png',
        });
      }, night.getTime() - Date.now());
    }
  }
}
