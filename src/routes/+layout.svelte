<script lang="ts">
    import '../app.css';
    import Icon from "@iconify/svelte";

    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
    <nav class="p-4 border-b-2 mb-12">
        <div class="text-2xl font-bold">
            Random Utils
        </div>
    </nav>
    <main class="px-4">
        {@render children()}
    </main>
    <footer class="p-4 border-t-2 mt-auto text-sm flex justify-between">
        <a class="font-bold underline" href="/">
            Random Utils
        </a>
        <div class="flex">
            Developed by&nbsp;<a href="https://miguelmagueijo.pt" class="font-bold underline" target="_blank">Miguel Magueijo</a>
            <Icon icon="radix-icons:arrow-top-right" class="size-3 opacity-75"/>
        </div>
    </footer>
</div>
