import { Injectable } from '@angular/core';

/** Prefijo comun para no colisionar con otras apps del mismo dominio. */
const PREFIX = 'jobsy_';

/**
 * Claves de dominio que se guardan en localStorage.
 * Una clave por dominio: cada valor es su propio JSON independiente.
 */
export const StorageKeys = {
  session: 'session',
  cart: 'cart',
  checkout: 'checkout',
  register: 'register',
  publishOffer: 'publish_offer',
  profileDraft: 'profile_draft',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/**
 * Wrapper tipado sobre localStorage: serializa/parsea JSON y es seguro
 * cuando localStorage no existe (SSR, modo privado con storage bloqueado).
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private get store(): Storage | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch {
      return null;
    }
  }

  /** Devuelve el valor parseado o `fallback` si no existe o esta corrupto. */
  get<T>(key: StorageKey, fallback: T): T;
  get<T>(key: StorageKey): T | null;
  get<T>(key: StorageKey, fallback: T | null = null): T | null {
    const raw = this.store?.getItem(PREFIX + key) ?? null;
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  /** Guarda el valor como JSON. Ignora errores de cuota / storage bloqueado. */
  set<T>(key: StorageKey, value: T): void {
    try {
      this.store?.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* cuota excedida o storage no disponible: se ignora */
    }
  }

  remove(key: StorageKey): void {
    this.store?.removeItem(PREFIX + key);
  }

  /** Borra solo las claves de esta app (respeta el prefijo). */
  clear(): void {
    const store = this.store;
    if (!store) return;
    for (let i = store.length - 1; i >= 0; i--) {
      const k = store.key(i);
      if (k?.startsWith(PREFIX)) store.removeItem(k);
    }
  }
}
