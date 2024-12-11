<script lang="ts">
    import {onMount} from "svelte";
    import {copyToClipboardBtnText} from "$lib/utils";
    import Icon from "@iconify/svelte";
    import {flip} from "svelte/animate";

    type HistoryPrices = {
        finalPrice: string;
        totalTax: string;
    }

    const LOCAL_STORAGE_KEY = "vatCalculator"
    let history: HistoryPrices[] = $state([]);
    let price: string = $state("");
    let taxAmount: string = $state("23");

    onMount(() => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            history = JSON.parse(localData);
        }
    })

    function calculatePrice() {
        const numPrice = Number(price);
        const numTax = Number(taxAmount);
        const errorElement = document.getElementById("ivacalc_error");

        if (!errorElement) {
            console.error("Something went wrong fetching 'ivacalc_error'...");
            return;
        }

        if (isNaN(numPrice) || isNaN(numTax) || numPrice <= 0 || numTax <= 0 || numTax > 100) {
            errorElement.classList.remove("hidden");
            return;
        }

        errorElement.classList.add("hidden");

        const totalTax: number = numPrice - numPrice / (numTax / 100 + 1);
        const finalPrice: number = numPrice - totalTax;

        history.unshift({
            finalPrice: finalPrice.toFixed(2).replace(".", ","),
            totalTax: totalTax.toFixed(2).replace(".", ","),
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }

    function clearHistory() {
        history = [];
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    function changeCommaToDotEvent(event: Event) {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        target.value = target.value.replace(",", ".").replaceAll(/([^\d.])/g, "");
    }

    function deleteItemAt(index: number) {
        history.splice(index, 1);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }
</script>

<div class="grid grid-cols-[auto_1fr] gap-8">
    <form onsubmit={calculatePrice}>
        <h2 class="text-2xl font-bold mb-2">Form</h2>
        <div class="flex gap-4">
            <div>
                <label class="block font-semibold" for="ivacalc_price">
                    Price with VAT
                </label>
                <input id="ivacalc_price" type="text" class="border-2 rounded p-1" placeholder="example: 59.99" step="0.01" bind:value={price} onkeyup={changeCommaToDotEvent} min="0" autocomplete={null}/>
            </div>
            <div>
                <label class="block font-semibold" for="ivacalc_tax">
                    VAT amount <small>(%)</small>
                </label>
                <input id="ivacalc_tax" type="text" class="border-2 rounded p-1" placeholder="23" step="0.01" bind:value={taxAmount} onkeyup={changeCommaToDotEvent} max="100" min="0" autocomplete={null}/>
            </div>
        </div>
        <div class="flex gap-4 items-center mt-4 ">
            <button type="submit" class="bg-blue-200 text-blue-950 hover:bg-blue-300 duration-300 py-2 px-4 rounded font-bold text-sm">
                Calculate
            </button>
            <p id="ivacalc_error" class="text-red-600 hidden">
                Invalid values
            </p>
        </div>
    </form>
    <div class="min-w-0">
        <div class="flex gap-4 items-center mb-2 justify-between">
            <h2 class="font-bold text-2xl">History</h2>
            {#if history.length > 0}
                <button class="text-sm font-semibold rounded p-1 px-4 bg-gray-200 hover:bg-gray-400 duration-300 text-gray-950" onclick={clearHistory}>
                    Clear data
                </button>
            {/if}
        </div>
        <div id="ivacalc_history" class="border-2 rounded p-4 flex gap-8 overflow-x-scroll h-28">
            {#if history.length > 0}
                {#each history as h, idx (h)}
                    <div id="ivacalc_history_reg_{idx}" class="rounded text-white leading-none min-w-36 relative group" animate:flip={{duration: 650}}>
                        <button type="button" class="absolute right-0 h-[96%] translate-x-[94%] text-black px-1 bg-red-500 hover:bg-red-700 duration-300 rounded-r z-10 group-hover:block hidden"
                            onclick={() => deleteItemAt(idx)}>
                            <Icon icon="tabler:trash" class="text-white size-5"/>
                        </button>
                        <div class="flex items-center justify-between px-4 py-3 bg-gray-700 rounded-t">
                            <Icon icon="icomoon-free:price-tag" class="size-5 "/>
                            <button type="button" class="font-bold" onclick={copyToClipboardBtnText}>
                                {h.finalPrice}<small>€</small>
                            </button>
                        </div>
                        <div class="flex items-center justify-between px-4 py-1 bg-gray-500 rounded-b text-sm">
                            <Icon icon="mdi:discount-outline" class="size-4"/>
                            <button type="button" onclick={copyToClipboardBtnText}>
                                {h.totalTax}<small>€</small>
                            </button>
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="opacity-35 font-bold flex items-center">
                    No data
                </div>
            {/if}
        </div>
        <small>Total items: {history.length}</small>
    </div>
</div>

