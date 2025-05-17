import {toZonedTime} from "date-fns-tz";
import {ca, enGB, es, Locale} from "date-fns/locale";

export function getLocaleDate(dateTimeString: string, locale?: string, timeZone?: string) {
    return new Date(dateTimeString).toLocaleString(locale ?? "es-ES", {timeZone: timeZone ?? "UTC"})
}

const validLocales = ["es", "en"]
const defaultLocale = "es-ES";

export function validLocale(locale: string) {
    return validLocales.includes(locale) ? locale : defaultLocale;
}

export const defaultTimer = "0:00:00";
export const defaultHourFormat = "HH:mm";
export const defaultTimeZone = "Europe/Madrid";

export function timeCounter(hours: number, minutes: number) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
}

export function getTimer(dateString?: string): string {
    if (!dateString) return defaultTimer;

    const start = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = (Math.floor((diffMs / (1000 * 60)) % 60));
    const seconds = Math.floor((diffMs / 1000) % 60);

    const minutesString = minutes.toString().padStart(2, "0");
    const secondsString = seconds.toString().padStart(2, "0");

    return `${hours}:${minutesString}:${secondsString}`;
}

export function getMondayOfWeek(date: Date,timeZone: string) {
    const now = toZonedTime(date, timeZone);
    const dayOfWeek = now.getDay();
    const mondayInZone = new Date(now);
    mondayInZone.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    mondayInZone.setHours(0, 0, 0, 0);

    return mondayInZone;
}
const localeMap: Record<string, Locale> = {
    es,
    en: enGB,
    ca,
};
export function getLocaleForDateTime(localeStr: string){
    return localeMap[localeStr]!;
}