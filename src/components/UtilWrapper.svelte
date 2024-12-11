<script lang="ts">
    let {title, children} = $props();
</script>

<section>
    <h1 class="text-4xl font-bold mb-2 border-b-4 border-blue-500/50 pb-1">{title}</h1>
    {@render children()}
</section>

