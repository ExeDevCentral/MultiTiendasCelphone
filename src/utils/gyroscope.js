/**
 * Utilidad para el manejo de permisos y eventos de Giroscopio en iOS (Safari 13+) y Android.
 * En iOS, la API requiere invocación explícita mediante un gesto de usuario (click/tap).
 */

let isListening = false;
let gyroCallback = null;

export function isIOSPermissionRequired() {
  return (
    typeof window !== 'undefined' &&
    typeof window.DeviceOrientationEvent !== 'undefined' &&
    typeof window.DeviceOrientationEvent.requestPermission === 'function'
  );
}

export async function requestGyroscopePermission() {
  if (typeof window === 'undefined') return false;

  if (isIOSPermissionRequired()) {
    try {
      const response = await window.DeviceOrientationEvent.requestPermission();
      return response === 'granted';
    } catch (err) {
      console.warn('Error solicitando permiso de giroscopio en iOS:', err);
      return false;
    }
  }

  // En Android y navegadores modernos estándar no se requiere requestPermission explícito
  return true;
}

export function subscribeToOrientation(callback) {
  gyroCallback = callback;

  const handleOrientation = (e) => {
    if (gyroCallback) {
      gyroCallback(e);
    }
  };

  if (!isListening && typeof window !== 'undefined' && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
    isListening = true;
  }

  return () => {
    gyroCallback = null;
  };
}
