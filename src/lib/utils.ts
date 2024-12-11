export function copyToClipboardBtnText(event: Event) {
    navigator.clipboard.writeText((event.target as HTMLElement).innerText);
}